import get from 'lodash/get'

import { createProduct } from "../db/products";
import { buildResponse, checkBodyParameters } from "../utils";

const PRODUCT_REQUIRED_KEYS = ['title', 'description', 'price', 'count'];

export const handler = async (event) => {
    try {
        console.log('Create Product Event', event)
        const data = JSON.parse(get(event, 'body', {}));

        const isValidData = checkBodyParameters(PRODUCT_REQUIRED_KEYS, data)

        if (!isValidData) {
            return buildResponse(400, { message: `Required body properties: ${JSON.stringify(PRODUCT_REQUIRED_KEYS)}` });
        }

        const newProductData = await createProduct(data);

        return buildResponse(200, newProductData);
    } catch(err) {
        return buildResponse(500, err);
    }
};
