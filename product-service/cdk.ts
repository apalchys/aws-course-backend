import * as apigateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, 'AuthorizationServiceStack', {
  env: { region: 'eu-west-3' },
});

const importProductTopic = new sns.Topic(stack, 'ImportProductTopic', {
  topicName: 'import-products-topic',
});
const importQueue = new sqs.Queue(stack, 'ImportQueue', {
  queueName: 'import-file-queue',
});
new sns.Subscription(stack, 'BigStockSubscription', {
  endpoint: process.env.BIG_STOCK_EMAIL!,
  protocol: sns.SubscriptionProtocol.EMAIL,
  topic: importProductTopic,
  filterPolicy: {
    count: sns.SubscriptionFilter.numericFilter({ greaterThan: 10 }),
  },
});
new sns.Subscription(stack, 'RegularStockSubscription', {
  endpoint: process.env.REGULAR_STOCK_EMAIL!,
  protocol: sns.SubscriptionProtocol.EMAIL,
  topic: importProductTopic,
  filterPolicy: {
    count: sns.SubscriptionFilter.numericFilter({ lessThanOrEqualTo: 10 }),
  },
});

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PG_HOST: process.env.PG_HOST!,
    PG_PORT: process.env.PG_PORT!,
    PG_DATABASE: process.env.PG_DATABASE!,
    PG_USERNAME: process.env.PG_USERNAME!,
    PG_PASSWORD: process.env.PG_PASSWORD!,
    PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION!,
    IMPORT_PRODUCTS_TOPIC_ARN: importProductTopic.topicArn,
  },
};

const getProductsList = new NodejsFunction(stack, 'GetProductsListLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductsList',
  entry: 'src/handlers/getProductsList.ts',
});

const getProductById = new NodejsFunction(stack, 'GetProductByIdLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductById',
  entry: 'src/handlers/getProductById.ts',
});

const createProduct = new NodejsFunction(stack, 'CreateProductLambda', {
  ...sharedLambdaProps,
  functionName: 'createProduct',
  entry: 'src/handlers/createProduct.ts',
});

const deleteProduct = new NodejsFunction(stack, 'DeleteProductLambda', {
  ...sharedLambdaProps,
  functionName: 'deleteProduct',
  entry: 'src/handlers/deleteProduct.ts',
});

const catalogBatchProcess = new NodejsFunction(stack, 'CatalogBatchProcessLambda', {
  ...sharedLambdaProps,
  functionName: 'catalogBatchProcess',
  entry: 'src/handlers/catalogBatchProcess.ts',
});

importProductTopic.grantPublish(catalogBatchProcess);
catalogBatchProcess.addEventSource(new SqsEventSource(importQueue, { batchSize: 5 }));

const api = new apigateway.HttpApi(stack, 'ProductApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apigateway.CorsHttpMethod.ANY],
  },
});

api.addRoutes({
  integration: new HttpLambdaIntegration('GetProductsListIntegration', getProductsList),
  path: '/products',
  methods: [apigateway.HttpMethod.GET],
});

api.addRoutes({
  integration: new HttpLambdaIntegration('GetProductByIdIntegration', getProductById),
  path: '/products/{productId}',
  methods: [apigateway.HttpMethod.GET],
});

api.addRoutes({
  integration: new HttpLambdaIntegration('CreateProductIntegration', createProduct),
  path: '/products',
  methods: [apigateway.HttpMethod.POST],
});

api.addRoutes({
  integration: new HttpLambdaIntegration('DeleteProductIntegration', deleteProduct),
  path: '/products/{productId}',
  methods: [apigateway.HttpMethod.DELETE],
});
