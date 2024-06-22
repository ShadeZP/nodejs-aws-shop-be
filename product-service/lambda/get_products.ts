import { products } from './products.mock';

exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST , PUT, DELETE, OPTIONS',
      'content-type': 'application/json',
    },
    body: JSON.stringify(products),
  };
};
