import { generatePolicy } from "../utils";

export const handler = async (event, context, callback) => {

        console.log('Event: ', event);

        if(event['type'] !== 'TOKEN') {
            callback('Unauthorized')
        }

        try {
            const authToken = event.authorizationToken;

            const encoded = authToken.split(' ')[1];
            const buffer = Buffer.from(encoded, 'base64');
            const creds = buffer.toString('utf-8').split(':');
            const user = creds[0];
            const password = creds[1];

            const allowedUserPassword = process.env[user]

            const policyEffect = !allowedUserPassword || password !== allowedUserPassword ? 'Deny' : 'Allow'

            callback(null, generatePolicy(encoded, event.methodArn, policyEffect))

        } catch (err) {
            callback(`Unauthorized: ${err.message}`)
        }
};
