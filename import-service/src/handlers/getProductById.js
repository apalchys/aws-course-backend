import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { buildResponse } from "../utils";
import { getProductById } from "../db/products";

export const handler = async (event) => {
    const productId = get(event, 'pathParameters.productId');
    try {
        console.log('Get Product by Id event', event);
        const product = await getProductById(productId)

        if (isEmpty(product)) {
            return buildResponse(400, {
                message: 'Product Not Found'
            });
        }

        return buildResponse(200, product);
    } catch(err) {
        return buildResponse(500, err);
    }
};
