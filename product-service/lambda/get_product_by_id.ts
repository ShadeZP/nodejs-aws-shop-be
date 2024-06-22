import { Product, ProductResponse, Stock } from './Product.model';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: { pathParameters: { id: string } }) => {
  console.log('event: ', event);

  const requestedId = event.pathParameters.id;
  const productsParams = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
    Key: { id: requestedId },
  };

  const stockssParams = {
    TableName: process.env.STOCKS_TABLE_NAME,
    Key: { product_id: requestedId },
  };

  try {
    const [productsData, stocksData]: [{ Item: Product }, { Item: Stock }] = await Promise.all([
      docClient.get(productsParams).promise(),
      docClient.get(stockssParams).promise(),
    ]);

    if (!productsData.Item || !stocksData.Item) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ message: 'Product not found' }),
      };
    }

    const data: ProductResponse = {
      ...productsData.Item,
      count: stocksData.Item.count,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('DynamoDB error: ', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Could not fetch product' }),
    };
  }
};
