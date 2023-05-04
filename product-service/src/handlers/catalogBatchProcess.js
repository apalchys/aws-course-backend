import get from 'lodash/get'
import { PublishCommand } from "@aws-sdk/client-sns";

import { createProduct } from "../db/products";
import snsClient from '../libs/sns';
import { buildResponse } from "../utils";

export const handler = async (event) => {
    try {
        console.log('sqs event', event)

        const records = get(event, 'Records', []);

        for (const record of records) {
            const newProductData = await createProduct(JSON.parse(record.body));

            console.log(newProductData)

            await snsClient.send(new PublishCommand({
                Subject: 'New Files Added to Catalog',
                Message: JSON.stringify(newProductData),
                TopicArn: process.env.IMPORT_PRODUCTS_TOPIC_ARN,
                MessageAttributes: {
                    count: {
                        DataType: 'Number',
                        StringValue: newProductData.count
                    }
                }
            }))
        }

        return buildResponse(200, records);
    } catch(err) {
        console.log(err)
        return buildResponse(500, err);
    }
};
