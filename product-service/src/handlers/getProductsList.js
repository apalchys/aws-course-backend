import { products } from '../constants';
import { buildResponse } from "../utils";

export const handler = async () => {
    return buildResponse(200, {
        products
    });
};
