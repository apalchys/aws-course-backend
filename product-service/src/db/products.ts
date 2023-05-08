import PostgreClient from './index';

export const getProductsList = () =>
  PostgreClient('products').join('stocks', 'products.id', 'stocks.product_id').select('products.*', 'stocks.count');

export const getProductById = (productId) =>
  PostgreClient('products')
    .join('stocks', 'products.id', 'stocks.product_id')
    .first('products.*', 'stocks.count')
    .where('products.id', productId);

export const createProduct = (newProduct) =>
  PostgreClient.transaction(async (trx) => {
    const { title, description, price, count } = newProduct;
    const products = await trx('products').insert({ title, description, price }, '*');
    const productId = products[0].id;
    await trx('stocks').insert({ product_id: productId, count }, 'count');
    return { ...newProduct, id: productId };
  });

export const deleteProduct = (id) =>
  PostgreClient.transaction(async (trx) => {
    const product = await trx('stocks').where('product_id', id).delete('*');
    await trx('products').where('id', id).delete('*');
    return product;
  });

export const createProducts = (productsList) =>
  PostgreClient.transaction(async (trx) => {
    const newProducts = productsList.map((item) => ({
      title: item.title,
      description: item.description,
      price: item.price,
    }));
    const createdProducts = await trx('products').insert(newProducts, '*');
    const counts = createdProducts.map((item) => ({
      product_id: item.id,
      count: productsList.find((product) => item.title === product.title && item.description === product.description)
        .count,
    }));
    await trx('stocks').insert(counts, 'count');
    return productsList;
  });
