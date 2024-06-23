import { ProductResponse } from './Product.model';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event: any) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const product: ProductResponse = JSON.parse(event.body);

  if (!product || !product.id || !product.title || !product.description || !product.price || !product.count) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'content-type': 'application/json',
      },
      body: 'Invalid product data',
    };
  }

  const transactParams = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.PRODUCTS_TABLE_NAME,
          Item: {
            id: { S: product.id },
            title: { S: product.title },
            description: { S: product.description },
            price: { N: product.price.toString() },
          },
        },
      },
      {
        Put: {
          TableName: process.env.STOCKS_TABLE_NAME,
          Item: {
            product_id: { S: product.id },
            count: { N: product.count.toString() },
          },
        },
      },
    ],
  };

  try {
    await dynamodb.transactWriteItems(transactParams).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'content-type': 'application/json',
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.error('DynamoDB error: ', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Could not create product',
    };
  }
};
