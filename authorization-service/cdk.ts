import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();

const stack = new cdk.Stack(app, 'AuthorizationServiceStack', {
  env: { region: 'eu-west-3' },
});

new nodejs.NodejsFunction(stack, 'BasicAuthorizerLambda', {
  functionName: 'basicAuthorizer',
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: 'src/handlers/basicAuthorizer.ts',
});
