import PostgreClient from "./index";

export const getProductsList = () => PostgreClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .select('products.*', 'stocks.count')

export const getProductById = (productId) => PostgreClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .first('products.*', 'stocks.count')
    .where('products.id', productId)
