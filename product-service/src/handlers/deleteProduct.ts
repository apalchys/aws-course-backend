import get from 'lodash/get';

import { deleteProduct } from '../db/products';
import { buildResponse } from '../utils';

export const handler = async (event) => {
  try {
    const productId = get(event, 'pathParameters.productId');

    const deletedData = await deleteProduct(productId);

    return buildResponse(200, deletedData);
  } catch (err) {
    console.log(err);
    return buildResponse(500, err);
  }
};
