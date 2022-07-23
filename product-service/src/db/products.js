import PostgreClient from "./index";

export const getProductsList = () => PostgreClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .select('products.*', 'stocks.count')

export const getProductById = (productId) => PostgreClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .first('products.*', 'stocks.count')
    .where('products.id', productId)

export const createProduct = (newProduct) => PostgreClient.transaction(async (trx) => {
        const { title, description, price, count } = newProduct
        const products = await trx('products').insert({ title, description, price }, '*')
        const productId = products[0].id
        await trx('stocks').insert({ product_id: productId, count }, 'count')
        return { ...newProduct, id: productId }
    })
