import { handler } from './catalogBatchProcess'
import { createProduct } from "../db/products";

jest.mock('../db/products')
jest.mock('../libs/sns', () => ({
    send: (command) => command
}));

const PRODUCT_MOCK = {
    "description": "Explore the world full of machines",
    "price": 20,
    "title": "Horizon: Zero Dawn",
    "count": 10
}

describe('catalogBatch',() => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return result', async () => {
        createProduct.mockReturnValueOnce(Promise.resolve(PRODUCT_MOCK))
        const response = await handler({ Records: [{ body: JSON.stringify(PRODUCT_MOCK)}] })
        expect(response.statusCode).toBe(200);
    })

    it('should return result', async () => {
        createProduct.mockReturnValueOnce(Promise.reject('Error'))
        const response = await handler({ Records: [{ body: JSON.stringify(PRODUCT_MOCK)}] })
        expect(response.statusCode).toBe(500);
    })
})
