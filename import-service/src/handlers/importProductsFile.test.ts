import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handler } from './importProductsFile';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/s3-request-presigner');

describe('importProductsFile', () => {
  it('should create signed url', async () => {
    await handler({
      queryStringParameters: {
        name: 'someTestName',
      },
    } as unknown as APIGatewayProxyEventV2);

    expect(getSignedUrl).toHaveBeenCalled();
  });
  it('should fail because of wrong parameters', async () => {
    const response = await handler({
      queryStringParameters: {},
    } as unknown as APIGatewayProxyEventV2);

    expect(response.body).toStrictEqual(JSON.stringify({ message: 'No File Name' }));
    expect(response.statusCode).toBe(500);
  });
});
