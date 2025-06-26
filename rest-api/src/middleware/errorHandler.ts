import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ErrorDetails } from '../types/index.js';
import logger from '../utils/logger.js';

// Custom error class
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    type: string = 'INTERNAL_SERVER_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends ApiError {
  public readonly errors: Array<{ field: string; message: string; value?: any }>;

  constructor(
    message: string,
    errors: Array<{ field: string; message: string; value?: any }> = []
  ) {
    super(message, 422, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

// Not found error class
export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

// Unauthorized error class
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Forbidden error class
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Conflict error class
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let type = 'INTERNAL_SERVER_ERROR';
  let message = 'Internal server error';
  let errors: Array<{ field: string; message: string; value?: any }> | undefined;

  // Handle known API errors
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    type = error.type;
    message = error.message;

    if (error instanceof ValidationError) {
      errors = error.errors;
    }
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 422;
    type = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = Object.values((error as any).errors).map((err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));
  }
  // Handle Mongoose cast errors
  else if (error.name === 'CastError') {
    statusCode = 400;
    type = 'INVALID_ID';
    message = 'Invalid ID format';
  }
  // Handle duplicate key errors
  else if ((error as any).code === 11000) {
    statusCode = 409;
    type = 'DUPLICATE_RESOURCE';
    message = 'Resource already exists';
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    type = 'INVALID_TOKEN';
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    type = 'TOKEN_EXPIRED';
    message = 'Token expired';
  }

  // Log error
  logger.error(`${type}: ${message}`, {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Create error response following RFC 7807
  const errorDetails: ErrorDetails = {
    type,
    title: message,
    status: statusCode,
    detail: error.message,
    instance: req.url,
  };

  if (errors) {
    errorDetails.errors = errors;
  }

  const response: ApiResponse = {
    success: false,
    error: errorDetails,
  };

  res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
