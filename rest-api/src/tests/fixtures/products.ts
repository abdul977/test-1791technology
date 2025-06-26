import { CreateProductRequest } from '../../types/index.js';

export const validProductData: CreateProductRequest = {
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  category: 'Electronics',
  stock: 100,
  sku: 'TEST-PROD-001',
  images: ['https://example.com/image1.jpg'],
  tags: ['test', 'electronics'],
};

export const anotherProductData: CreateProductRequest = {
  name: 'Another Product',
  description: 'Another test product',
  price: 149.99,
  category: 'Electronics',
  stock: 50,
  sku: 'TEST-PROD-002',
  images: [],
  tags: ['test'],
};

export const outOfStockProductData: CreateProductRequest = {
  name: 'Out of Stock Product',
  description: 'This product is out of stock',
  price: 199.99,
  category: 'Electronics',
  stock: 0,
  sku: 'TEST-PROD-003',
  images: [],
  tags: ['test', 'out-of-stock'],
};

export const invalidProductData = {
  name: '', // empty name
  description: '',
  price: -10, // negative price
  category: '',
  stock: -5, // negative stock
  sku: 'invalid sku', // invalid characters
};

export const duplicateSkuData: CreateProductRequest = {
  name: 'Duplicate SKU Product',
  description: 'This product has a duplicate SKU',
  price: 79.99,
  category: 'Electronics',
  stock: 25,
  sku: 'TEST-PROD-001', // same as validProductData
  images: [],
  tags: ['test'],
};

export const updateProductData = {
  name: 'Updated Product Name',
  price: 129.99,
  stock: 75,
  isActive: true,
};

export const searchQuery = 'test';
export const categoryFilter = 'Electronics';
export const priceRange = { minPrice: 50, maxPrice: 150 };
