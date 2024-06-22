import { Product, ProductResponse, Stock } from './Product.model';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  console.log('Fetching products..');
  const productsParams = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
  };

  const stockssParams = {
    TableName: process.env.STOCKS_TABLE_NAME,
  };

  try {
    const [productsData, stocksData] = await Promise.all([
      docClient.scan(productsParams).promise(),
      docClient.scan(stockssParams).promise(),
    ]);

    const data: ProductResponse = productsData.Items.map((product: Product) => {
      const stock = stocksData.Items.find((stock: Stock) => stock.product_id === product.id);
      return {
        ...product,
        count: stock ? stock.count : 0,
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST , PUT, DELETE, OPTIONS',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log('DynamoDB error: ', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify('Could not fetch products'),
    };
  }
};
