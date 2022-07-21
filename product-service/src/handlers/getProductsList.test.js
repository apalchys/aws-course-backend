import { handler } from './getProductsList'
import { getProductsList } from "../db/products";

jest.mock('../db/products')

const PRODUCTS_MOCK = [
    {
        "count": 1,
        "description": "Explore the world full of machines",
        "id": "2",
        "price": 20,
        "title": "Horizon: Zero Dawn"
    }
]


describe('getProductsList',() => {
    it('should return item with chosen ID', async () => {
        getProductsList.mockReturnValueOnce(Promise.resolve(PRODUCTS_MOCK))
        const response = await handler()
        expect(response.body).toStrictEqual(JSON.stringify({ products: PRODUCTS_MOCK }))
        expect(response.statusCode).toBe(200);
    })

    it('should fail with 500 Error', async () => {
        getProductsList.mockImplementationOnce(async () => {
            throw new Error()
        })
        const response = await handler()
        expect(response.statusCode).toBe(500)
    })
})
