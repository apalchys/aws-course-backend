const get = require('lodash/get');
const { products } = require('../constants');

module.exports = async (event) => {
    const productId = get(event, 'pathParameters.productId');
    const desiredProduct = products.find(product => product.id === productId);

    if (!desiredProduct) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            },
            body: JSON.stringify({
                message: 'No such product'
            }),
        };
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
            product: desiredProduct
        }),
    };
};
