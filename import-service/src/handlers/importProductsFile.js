import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import get from 'lodash/get';
import s3Client from '../libs/s3';

import {buildResponse, streamToString} from "../utils";

export const handler = async (event) => {
    console.log('import products file event', event)
    const fileName = get(event, 'pathParameters.name');

    if (!fileName) {
        return buildResponse(500, {
            message: 'No File Name'
        })
    }

    try {
        const bucketParams = {
            Bucket: process.env.IMPORT_BUCKET_NAME,
            Prefix: process.env.IMPORT_UPLOADED_PREFIX,
            Key: fileName
        }
        const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), { expiresIn: 3600 })

        return buildResponse(200, {
            url: signedUrl
        });
    } catch (err) {
        console.log(err);

        return buildResponse(500, {
            message: err.message
        })
    }
};
