import { APIGatewayAuthorizerEvent } from 'aws-lambda';
import { generatePolicy } from '../utils';

export const handler = async (event: APIGatewayAuthorizerEvent) => {
  console.log('Event: ', event);

  if (event['type'] !== 'TOKEN') {
    throw new Error('Unauthorized');
  }

  try {
    const authToken = event.authorizationToken;

    const encoded = authToken.split(' ')[1];
    const buffer = Buffer.from(encoded, 'base64');
    const creds = buffer.toString('utf-8').split(':');
    const user = creds[0];
    const password = creds[1];

    const allowedUserPassword = process.env[user];

    const policyEffect = !allowedUserPassword || password !== allowedUserPassword ? 'Deny' : 'Allow';

    return generatePolicy(encoded, event.methodArn, policyEffect);
  } catch (err) {
    throw new Error(`Unauthorized: ${err.message}`);
  }
};
