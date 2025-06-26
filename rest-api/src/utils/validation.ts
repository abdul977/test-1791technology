import Joi from 'joi';
import { UserRole, OrderStatus } from '../types/index.js';

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid ID format',
    'any.required': 'ID is required',
  }),
  
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required',
  }),
  
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username can only contain letters and numbers',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username is required',
  }),
  
  name: Joi.string().trim().min(1).max(50).required().messages({
    'string.min': 'Name cannot be empty',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  },
};

// User validation schemas
export const userValidation = {
  register: Joi.object({
    email: commonSchemas.email,
    username: commonSchemas.username,
    password: commonSchemas.password,
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    role: Joi.string().valid(...Object.values(UserRole)).default(UserRole.USER),
  }),
  
  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),
  
  updateProfile: Joi.object({
    email: commonSchemas.email.optional(),
    username: commonSchemas.username.optional(),
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),
  
  updateUser: Joi.object({
    email: commonSchemas.email.optional(),
    username: commonSchemas.username.optional(),
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),
    isActive: Joi.boolean().optional(),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: commonSchemas.password,
  }),
};

// Product validation schemas
export const productValidation = {
  create: Joi.object({
    name: Joi.string().trim().min(1).max(100).required().messages({
      'string.min': 'Product name cannot be empty',
      'string.max': 'Product name cannot exceed 100 characters',
      'any.required': 'Product name is required',
    }),
    description: Joi.string().trim().min(1).max(1000).required().messages({
      'string.min': 'Product description cannot be empty',
      'string.max': 'Product description cannot exceed 1000 characters',
      'any.required': 'Product description is required',
    }),
    price: Joi.number().positive().precision(2).required().messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required',
    }),
    category: Joi.string().trim().min(1).max(50).required().messages({
      'string.min': 'Category cannot be empty',
      'string.max': 'Category cannot exceed 50 characters',
      'any.required': 'Category is required',
    }),
    stock: Joi.number().integer().min(0).required().messages({
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock is required',
    }),
    sku: Joi.string().trim().uppercase().pattern(/^[A-Z0-9-_]+$/).required().messages({
      'string.pattern.base': 'SKU can only contain uppercase letters, numbers, hyphens, and underscores',
      'any.required': 'SKU is required',
    }),
    images: Joi.array().items(Joi.string().uri()).max(10).default([]).messages({
      'array.max': 'Cannot have more than 10 images',
    }),
    tags: Joi.array().items(Joi.string().trim().max(30)).max(20).default([]).messages({
      'array.max': 'Cannot have more than 20 tags',
    }),
  }),
  
  update: Joi.object({
    name: Joi.string().trim().min(1).max(100).optional(),
    description: Joi.string().trim().min(1).max(1000).optional(),
    price: Joi.number().positive().precision(2).optional(),
    category: Joi.string().trim().min(1).max(50).optional(),
    stock: Joi.number().integer().min(0).optional(),
    sku: Joi.string().trim().uppercase().pattern(/^[A-Z0-9-_]+$/).optional(),
    isActive: Joi.boolean().optional(),
    images: Joi.array().items(Joi.string().uri()).max(10).optional(),
    tags: Joi.array().items(Joi.string().trim().max(30)).max(20).optional(),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),
};

// Order validation schemas
export const orderValidation = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: commonSchemas.id,
        quantity: Joi.number().integer().min(1).required().messages({
          'number.integer': 'Quantity must be an integer',
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required',
        }),
        price: Joi.number().positive().precision(2).required().messages({
          'number.positive': 'Price must be a positive number',
          'any.required': 'Price is required',
        }),
      })
    ).min(1).required().messages({
      'array.min': 'Order must have at least one item',
      'any.required': 'Items are required',
    }),
    shippingAddress: Joi.object({
      street: Joi.string().trim().max(200).required(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
        'string.pattern.base': 'Please provide a valid ZIP code',
      }),
      country: Joi.string().trim().max(100).required(),
    }).required(),
    billingAddress: Joi.object({
      street: Joi.string().trim().max(200).required(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
        'string.pattern.base': 'Please provide a valid ZIP code',
      }),
      country: Joi.string().trim().max(100).required(),
    }).required(),
    paymentMethod: Joi.string().trim().max(50).required().messages({
      'any.required': 'Payment method is required',
    }),
  }),
  
  updateStatus: Joi.object({
    status: Joi.string().valid(...Object.values(OrderStatus)).required().messages({
      'any.only': 'Invalid order status',
      'any.required': 'Status is required',
    }),
  }),
  
  update: Joi.object({
    status: Joi.string().valid(...Object.values(OrderStatus)).optional(),
    shippingAddress: Joi.object({
      street: Joi.string().trim().max(200).required(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required(),
      country: Joi.string().trim().max(100).required(),
    }).optional(),
    billingAddress: Joi.object({
      street: Joi.string().trim().max(200).required(),
      city: Joi.string().trim().max(100).required(),
      state: Joi.string().trim().max(100).required(),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required(),
      country: Joi.string().trim().max(100).required(),
    }).optional(),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update',
  }),
};
