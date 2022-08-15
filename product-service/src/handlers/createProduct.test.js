import { handler } from './createProduct'
import { createProduct } from "../db/products";

jest.mock('../db/products')

const PRODUCT_MOCK = {
    "description": "Explore the world full of machines",
    "price": 20,
    "title": "Horizon: Zero Dawn",
    "count": 10
}

describe('createProduct',() => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fail because of database error', async () => {
        createProduct.mockReturnValueOnce(Promise.reject('error'))
        const response = await handler({ body: JSON.stringify(PRODUCT_MOCK) })
        expect(response.statusCode).toBe(500);
    })

    it('should create product', async () => {
        createProduct.mockReturnValueOnce(Promise.resolve(PRODUCT_MOCK))
        const response = await handler({ body: JSON.stringify(PRODUCT_MOCK) })
        expect(response.body).toStrictEqual(JSON.stringify(PRODUCT_MOCK))
        expect(response.statusCode).toBe(200);
    })

    it('should fail because of lack of parameters', async () => {
        createProduct.mockReturnValueOnce(Promise.resolve(PRODUCT_MOCK))
        const response = await handler({ body: JSON.stringify({ price: 30 }) })
        expect(response.statusCode).toBe(400);
    })
})
