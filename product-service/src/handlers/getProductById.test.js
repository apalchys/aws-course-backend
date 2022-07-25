import { handler as getProductsById } from './getProductsById'

jest.mock('../constants', () => ({
    ...jest.requireActual('../constants'),
    products: [{
        "count": 1,
        "description": "Explore the world full of machines",
        "id": "2",
        "price": 20,
        "title": "Horizon: Zero Dawn"
    },
    {
        "count": 1,
        "description": "New GOW Game",
        "id": "1",
        "price": 30,
        "title": "God Of War"
    }]
}))

const EVENT_MOCK = {
    pathParameters: {
        productId: '2'
    }
}

describe('getProductsById',() => {
    it('should return item with chosen ID', async () => {
        const response = await getProductsById(EVENT_MOCK)
        expect(response.body).toStrictEqual(JSON.stringify({
            "count": 1,
            "description": "Explore the world full of machines",
            "id": "2",
            "price": 20,
            "title": "Horizon: Zero Dawn"
        }))
        expect(response.statusCode).toBe(200);
    })

    it('should fail with Error', async () => {
        const response = await getProductsById()
        expect(response.statusCode).toBe(500)
    })
})
