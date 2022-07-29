import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import s3Client from '../libs/s3';
import {buildResponse, readCSVFile} from "../utils";

export const handler = async (event) => {
    console.log('import parser triggered with event', event)

    try {
        for (const record of event.Records) {

            console.log(record)

            const newObject = await s3Client.send(new GetObjectCommand({
                Bucket: process.env.IMPORT_BUCKET_NAME,
                Key: record.s3.object.key
            }))

            const csvContent = await readCSVFile(newObject.Body)

            console.log('parsed successfully', csvContent)

            const copyParams = {
                Bucket: process.env.IMPORT_BUCKET_NAME,
                CopySource: `${process.env.IMPORT_BUCKET_NAME}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace('uploaded', 'parsed')
            }

            await s3Client.send(new CopyObjectCommand(copyParams))

            console.log('Copy object to parsed folder success');

            const deleteParams = {
                Bucket: process.env.IMPORT_BUCKET_NAME,
                Key: record.s3.object.key
            }

            await s3Client.send(new DeleteObjectCommand(deleteParams))

            console.log('Delete object from uploaded success');

            return buildResponse(200, {
                content: csvContent
            })
        }
    } catch (err) {
        console.log(err);

        return buildResponse(500, {
            message: err.message
        })
    }
};
