import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsTable = dynamodb.Table.fromTableName(this, 'productsTable', 'products');
    const stocksTable = dynamodb.Table.fromTableName(this, 'stocksTable', 'stocks');

    const getProductsLambda = new lambda.Function(this, 'getProductsHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'get_products.handler',
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
      },
    });

    const getProductsByIdLambda = new lambda.Function(this, 'getProductsByIdHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'get_product_by_id.handler',
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
      },
    });

    const createProductLambda = new lambda.Function(this, 'createProductHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'create_product.handler',
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });

    const api = new apigateway.RestApi(this, 'HelloWorldApi', {
      restApiName: 'Products Service',
    });

    const products = api.root.addResource('products');
    const getProductsIntegration = new apigateway.LambdaIntegration(getProductsLambda);
    products.addMethod('GET', getProductsIntegration);

    const product = products.addResource('{id}');
    const getProductByIdIntegration = new apigateway.LambdaIntegration(getProductsByIdLambda);
    product.addMethod('GET', getProductByIdIntegration);

    const createProductIntegration = new apigateway.LambdaIntegration(createProductLambda);
    products.addMethod('POST', createProductIntegration);

    productsTable.grantReadData(getProductsLambda);
    productsTable.grantReadData(getProductsByIdLambda);
    productsTable.grantReadWriteData(createProductLambda);
    stocksTable.grantReadData(getProductsLambda);
    stocksTable.grantReadData(getProductsByIdLambda);
    stocksTable.grantReadWriteData(createProductLambda);
  }
}
