import request from 'supertest';
import app from '../../app.js';
import { User } from '../../models/index.js';
import { validUserData, adminUserData, moderatorUserData } from '../fixtures/users.js';
import { UserRole } from '../../types/index.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export const createUserAndGetTokens = async (userData = validUserData): Promise<AuthTokens> => {
  // Register user
  const registerResponse = await request(app)
    .post('/api/v1/auth/register')
    .send(userData)
    .expect(201);

  return {
    accessToken: registerResponse.body.data.accessToken,
    refreshToken: registerResponse.body.data.refreshToken,
    userId: registerResponse.body.data.user.id,
  };
};

export const createAdminAndGetTokens = async (): Promise<AuthTokens> => {
  return createUserAndGetTokens(adminUserData);
};

export const createModeratorAndGetTokens = async (): Promise<AuthTokens> => {
  return createUserAndGetTokens(moderatorUserData);
};

export const loginAndGetTokens = async (email: string, password: string): Promise<AuthTokens> => {
  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);

  return {
    accessToken: loginResponse.body.data.accessToken,
    refreshToken: loginResponse.body.data.refreshToken,
    userId: loginResponse.body.data.user.id,
  };
};

export const createUserDirectly = async (userData = validUserData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const createAdminDirectly = async () => {
  return createUserDirectly(adminUserData);
};

export const createModeratorDirectly = async () => {
  return createUserDirectly(moderatorUserData);
};

export const getAuthHeader = (token: string): string => {
  return `Bearer ${token}`;
};

export const expectUnauthorized = (response: any) => {
  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.error.type).toBe('UNAUTHORIZED');
};

export const expectForbidden = (response: any) => {
  expect(response.status).toBe(403);
  expect(response.body.success).toBe(false);
  expect(response.body.error.type).toBe('FORBIDDEN');
};

export const expectValidationError = (response: any) => {
  expect(response.status).toBe(422);
  expect(response.body.success).toBe(false);
  expect(response.body.error.type).toBe('VALIDATION_ERROR');
  expect(response.body.error.errors).toBeDefined();
  expect(Array.isArray(response.body.error.errors)).toBe(true);
};

export const expectNotFound = (response: any) => {
  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.error.type).toBe('NOT_FOUND');
};

export const expectConflict = (response: any) => {
  expect(response.status).toBe(409);
  expect(response.body.success).toBe(false);
  expect(response.body.error.type).toBe('CONFLICT');
};

export const expectSuccess = (response: any, expectedStatus = 200) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeDefined();
};

export const expectPaginatedResponse = (response: any) => {
  expectSuccess(response);
  expect(response.body.meta).toBeDefined();
  expect(response.body.meta.page).toBeDefined();
  expect(response.body.meta.limit).toBeDefined();
  expect(response.body.meta.total).toBeDefined();
  expect(response.body.meta.totalPages).toBeDefined();
  expect(typeof response.body.meta.hasNext).toBe('boolean');
  expect(typeof response.body.meta.hasPrev).toBe('boolean');
};
