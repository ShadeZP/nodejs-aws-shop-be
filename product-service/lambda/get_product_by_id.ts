import { products } from './products.mock';

exports.handler = async (event: { pathParameters: { id: string } }) => {
  const product = products.find((p) => p.id === event.pathParameters.id);
  return product
    ? {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST , PUT, DELETE, OPTIONS',
          'content-type': 'application/json',
        },
        body: JSON.stringify(product),
      }
    : {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST , PUT, DELETE, OPTIONS',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ message: 'Product not found' }),
      };
};
