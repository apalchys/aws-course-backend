import { getProductsList } from "../db/products";
import { buildResponse } from "../utils";

export const handler = async () => {
    try {
        const products = await getProductsList()

        return buildResponse(200, {
            products
        });
    } catch (err) {
        return buildResponse(500, {
            message: err.message
        })
    }
};
