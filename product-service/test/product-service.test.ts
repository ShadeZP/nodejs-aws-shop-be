import { Product } from '../lambda/Product.model';

// handler.test.js
const { handler: getProductsHandler } = require('../lambda/get_products');
const { handler: getProductByIdHandler } = require('../lambda/get_product_by_id');
const { products } = require('../lambda/products.mock');

describe('getProductsHandler', () => {
  it('should return all products', async () => {
    const result = await getProductsHandler();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(products);
  });
});

describe('getProductByIdHandler', () => {
  it('should return product if id is valid', async () => {
    const idToFind = '1';
    const expectedProduct = products.find((p: Product) => p.id === idToFind);
    const event = { pathParameters: { id: idToFind } };
    const result = await getProductByIdHandler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(expectedProduct);
  });

  it('should return 404 if product not found', async () => {
    const idToFind = 'not-existing-id';
    const event = { pathParameters: { id: idToFind } };
    const result = await getProductByIdHandler(event);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ message: 'Product not found' });
  });
});
