import request from 'supertest';
import app from '../../app.js';
import { Product } from '../../models/index.js';
import {
  validProductData,
  anotherProductData,
  invalidProductData,
  duplicateSkuData,
  updateProductData,
  searchQuery,
  categoryFilter,
  priceRange,
} from '../fixtures/products.js';
import {
  createUserAndGetTokens,
  createAdminAndGetTokens,
  createModeratorAndGetTokens,
  getAuthHeader,
  expectUnauthorized,
  expectForbidden,
  expectValidationError,
  expectConflict,
  expectSuccess,
  expectNotFound,
  expectPaginatedResponse,
} from '../helpers/auth.js';

describe('Product Endpoints', () => {
  let userTokens: any;
  let adminTokens: any;
  let moderatorTokens: any;

  beforeEach(async () => {
    userTokens = await createUserAndGetTokens();
    adminTokens = await createAdminAndGetTokens();
    moderatorTokens = await createModeratorAndGetTokens();
  });

  describe('GET /api/v1/products', () => {
    beforeEach(async () => {
      // Create test products
      await Product.create(validProductData);
      await Product.create(anotherProductData);
    });

    it('should get all products without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .expect(200);

      expectPaginatedResponse(response);
      expect(response.body.data.length).toBe(2);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .query({ category: categoryFilter })
        .expect(200);

      expectPaginatedResponse(response);
      response.body.data.forEach((product: any) => {
        expect(product.category.toLowerCase()).toContain(categoryFilter.toLowerCase());
      });
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .query(priceRange)
        .expect(200);

      expectPaginatedResponse(response);
      response.body.data.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(priceRange.minPrice);
        expect(product.price).toBeLessThanOrEqual(priceRange.maxPrice);
      });
    });

    it('should search products by text', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .query({ q: searchQuery })
        .expect(200);

      expectPaginatedResponse(response);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .query({ page: 1, limit: 1 })
        .expect(200);

      expectPaginatedResponse(response);
      expect(response.body.data.length).toBe(1);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(1);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create(validProductData);
      productId = product.id;
    });

    it('should get product by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/products/${productId}`)
        .expect(200);

      expectSuccess(response);
      expect(response.body.data.id).toBe(productId);
      expect(response.body.data.name).toBe(validProductData.name);
    });

    it('should return not found for non-existent product', async () => {
      const response = await request(app)
        .get('/api/v1/products/507f1f77bcf86cd799439011');

      expectNotFound(response);
    });

    it('should return validation error for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/v1/products/invalid-id');

      expectValidationError(response);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create product as admin', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .send(validProductData)
        .expect(201);

      expectSuccess(response, 201);
      expect(response.body.data.name).toBe(validProductData.name);
      expect(response.body.data.sku).toBe(validProductData.sku);
    });

    it('should create product as moderator', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', getAuthHeader(moderatorTokens.accessToken))
        .send(validProductData)
        .expect(201);

      expectSuccess(response, 201);
    });

    it('should return forbidden for regular user', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', getAuthHeader(userTokens.accessToken))
        .send(validProductData);

      expectForbidden(response);
    });

    it('should return unauthorized without token', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .send(validProductData);

      expectUnauthorized(response);
    });

    it('should return validation error for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .send(invalidProductData);

      expectValidationError(response);
    });

    it('should return conflict error for duplicate SKU', async () => {
      // Create first product
      await request(app)
        .post('/api/v1/products')
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .send(validProductData)
        .expect(201);

      // Try to create product with same SKU
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .send(duplicateSkuData);

      expectConflict(response);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create(validProductData);
      productId = product.id;
    });

    it('should update product as admin', async () => {
      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .send(updateProductData)
        .expect(200);

      expectSuccess(response);
      expect(response.body.data.name).toBe(updateProductData.name);
      expect(response.body.data.price).toBe(updateProductData.price);
    });

    it('should update product as moderator', async () => {
      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', getAuthHeader(moderatorTokens.accessToken))
        .send(updateProductData)
        .expect(200);

      expectSuccess(response);
    });

    it('should return forbidden for regular user', async () => {
      const response = await request(app)
        .put(`/api/v1/products/${productId}`)
        .set('Authorization', getAuthHeader(userTokens.accessToken))
        .send(updateProductData);

      expectForbidden(response);
    });

    it('should return not found for non-existent product', async () => {
      const response = await request(app)
        .put('/api/v1/products/507f1f77bcf86cd799439011')
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .send(updateProductData);

      expectNotFound(response);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create(validProductData);
      productId = product.id;
    });

    it('should deactivate product as admin', async () => {
      const response = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .expect(200);

      expectSuccess(response);

      // Verify product is deactivated
      const product = await Product.findById(productId);
      expect(product?.isActive).toBe(false);
    });

    it('should return forbidden for moderator', async () => {
      const response = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', getAuthHeader(moderatorTokens.accessToken));

      expectForbidden(response);
    });

    it('should return forbidden for regular user', async () => {
      const response = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', getAuthHeader(userTokens.accessToken));

      expectForbidden(response);
    });
  });

  describe('GET /api/v1/products/categories', () => {
    beforeEach(async () => {
      await Product.create(validProductData);
      await Product.create({ ...anotherProductData, category: 'Books' });
    });

    it('should get all categories', async () => {
      const response = await request(app)
        .get('/api/v1/products/categories')
        .expect(200);

      expectSuccess(response);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toContain('Electronics');
      expect(response.body.data).toContain('Books');
    });
  });

  describe('GET /api/v1/products/stats', () => {
    beforeEach(async () => {
      await Product.create(validProductData);
      await Product.create(anotherProductData);
    });

    it('should get product statistics as admin', async () => {
      const response = await request(app)
        .get('/api/v1/products/stats')
        .set('Authorization', getAuthHeader(adminTokens.accessToken))
        .expect(200);

      expectSuccess(response);
      expect(response.body.data.totalProducts).toBeDefined();
      expect(response.body.data.activeProducts).toBeDefined();
      expect(response.body.data.productsByCategory).toBeDefined();
    });

    it('should return forbidden for regular user', async () => {
      const response = await request(app)
        .get('/api/v1/products/stats')
        .set('Authorization', getAuthHeader(userTokens.accessToken));

      expectForbidden(response);
    });
  });
});
