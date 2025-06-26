import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from './errorHandler.js';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all validation errors
      allowUnknown: false, // Don't allow unknown fields
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }));

      throw new ValidationError('Validation failed', validationErrors);
    }

    // Replace the original property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Validate request body
export const validateBody = (schema: Joi.ObjectSchema) => validate(schema, 'body');

// Validate request params
export const validateParams = (schema: Joi.ObjectSchema) => validate(schema, 'params');

// Validate request query
export const validateQuery = (schema: Joi.ObjectSchema) => validate(schema, 'query');

// Common validation schemas for params
export const paramSchemas = {
  id: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required',
    }),
  }),
  
  userId: Joi.object({
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required',
    }),
  }),
  
  productId: Joi.object({
    productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid product ID format',
      'any.required': 'Product ID is required',
    }),
  }),
  
  orderId: Joi.object({
    orderId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid order ID format',
      'any.required': 'Order ID is required',
    }),
  }),
};

// Common pagination schema
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  // Also accept frontend naming conventions
  sortBy: Joi.string().default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Common validation schemas for query parameters
export const querySchemas = {
  pagination: paginationSchema,

  search: Joi.object({
    q: Joi.string().trim().allow('').max(100).optional(),
    search: Joi.string().trim().allow('').max(100).optional(), // Accept both q and search
    category: Joi.string().trim().allow('').max(50).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    inStock: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
  }).concat(paginationSchema),

  userFilter: Joi.object({
    role: Joi.string().valid('admin', 'user', 'moderator').optional(),
    isActive: Joi.boolean().optional(),
    search: Joi.string().trim().min(1).max(100).optional(),
  }).concat(paginationSchema),

  orderFilter: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').optional(),
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(0).optional(),
  }).concat(paginationSchema),
};

// Sanitize input middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Recursively sanitize object
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove potential XSS characters
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };

  // Sanitize request body, params, and query
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.params) {
    req.params = sanitize(req.params);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};
