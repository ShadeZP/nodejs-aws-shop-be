import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsLambda = new lambda.Function(this, 'getProductsHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'get_products.handler',
    });

    const getProductsByIdLambda = new lambda.Function(this, 'getProductsByIdHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'get_product_by_id.handler',
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
  }
}
