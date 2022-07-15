const { products } = require('../constants');

module.exports = async () => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
            products
        }),
    };
};
