import get from 'lodash/get'
import { products } from '../constants';
import { buildResponse } from "../utils";

export const handler = async (event) => {
    const productId = get(event, 'pathParameters.productId');
    const desiredProduct = products.find(product => product.id === productId);

    if (!desiredProduct) {
        return buildResponse(500, {
            message: 'Product Not Found'
        });
    }
    return buildResponse(200, desiredProduct);
};
