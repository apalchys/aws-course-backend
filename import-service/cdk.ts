import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3notifications from 'aws-cdk-lib/aws-s3-notifications';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as apigateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ImportServiceStack', {
  env: { region: 'eu-west-3' },
});

const bucket = new s3.Bucket(stack, 'ImportBucket', {
  bucketName: 'aws-course-import-products',
  removalPolicy: RemovalPolicy.DESTROY,
});

const queue = sqs.Queue.fromQueueArn(stack, 'ImportFileQueue', 'arn:aws:sqs:eu-west-3:935586505400:import-file-queue');

const importProductsFileLambda = new nodejs.NodejsFunction(stack, 'ImportProductsFileLambda', {
  functionName: 'importProductsFile',
  entry: 'src/handlers/importProductsFile.ts',
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    IMPORT_AWS_REGION: process.env.IMPORT_AWS_REGION!,
    IMPORT_BUCKET_NAME: process.env.IMPORT_BUCKET_NAME!,
    IMPORT_UPLOADED_PREFIX: process.env.IMPORT_UPLOADED_PREFIX!,
    IMPORT_SQS_URL: queue.queueUrl,
  },
});
bucket.grantReadWrite(importProductsFileLambda);

const importFileParserLambda = new nodejs.NodejsFunction(stack, 'ImportFileParserLambda', {
  functionName: 'importFileParser',
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: 'src/handlers/importFileParser.ts',
  environment: {
    IMPORT_BUCKET_NAME: process.env.IMPORT_BUCKET_NAME!,
    IMPORT_UPLOADED_PREFIX: process.env.IMPORT_UPLOADED_PREFIX!,
    IMPORT_SQS_URL: queue.queueUrl,
  },
});
queue.grantSendMessages(importFileParserLambda);

bucket.addEventNotification(
  s3.EventType.OBJECT_CREATED,
  new s3notifications.LambdaDestination(importFileParserLambda),
  { prefix: process.env.IMPORT_UPLOADED_PREFIX }
);

const api = new apigateway.HttpApi(stack, 'ImportApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apigateway.CorsHttpMethod.ANY],
  },
});

const importProductsFileIntegration = new HttpLambdaIntegration(
  'importProductsFileIntegration',
  importProductsFileLambda
);

api.addRoutes({
  integration: importProductsFileIntegration,
  path: '/import',
  methods: [apigateway.HttpMethod.GET],
});
