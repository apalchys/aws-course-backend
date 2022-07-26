import { handler } from './getProductById'
import { getProductById } from "../db/products";

jest.mock('../db/products')

const PRODUCT_MOCK = {
    "count": 1,
    "description": "Explore the world full of machines",
    "id": "2",
    "price": 20,
    "title": "Horizon: Zero Dawn"
}

describe('getProductsById',() => {
    it('should return item with chosen ID', async () => {
        getProductById.mockReturnValueOnce(Promise.resolve(PRODUCT_MOCK))
        const response = await handler({ pathParameters: { productId: 2 }})
        expect(response.body).toStrictEqual(JSON.stringify(PRODUCT_MOCK))
        expect(response.statusCode).toBe(200);
    })

    it('should fail with 400 Error', async () => {
        getProductById.mockReturnValueOnce(Promise.resolve({}))
        const response = await handler({ pathParameters: { productId: 2 }})
        expect(response.statusCode).toBe(400)
    })

    it('should fail with 500 Error', async () => {
        getProductById.mockImplementationOnce(async () => {
            throw new Error()
        })
        const response = await handler({ pathParameters: { productId: 2 }})
        expect(response.statusCode).toBe(500)
    })
})
