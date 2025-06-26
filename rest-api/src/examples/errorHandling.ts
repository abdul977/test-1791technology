/**
 * Error Handling Examples
 * 
 * This file demonstrates the comprehensive error handling system
 * implemented in the REST API following RFC 7807 standards.
 */

import { ApiResponse, ErrorDetails } from '../types/index.js';

// Example error responses following RFC 7807 Problem Details format

/**
 * 1. Validation Error (422 Unprocessable Entity)
 * Returned when request data fails validation
 */
export const validationErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'VALIDATION_ERROR',
    title: 'Validation failed',
    status: 422,
    detail: 'The request data contains validation errors',
    instance: '/api/v1/users',
    errors: [
      {
        field: 'email',
        message: 'Please provide a valid email address',
        value: 'invalid-email'
      },
      {
        field: 'password',
        message: 'Password must be at least 8 characters long',
        value: '123'
      }
    ]
  }
};

/**
 * 2. Authentication Error (401 Unauthorized)
 * Returned when authentication is required or fails
 */
export const authenticationErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'UNAUTHORIZED',
    title: 'Unauthorized access',
    status: 401,
    detail: 'Valid authentication credentials are required',
    instance: '/api/v1/users/profile'
  }
};

/**
 * 3. Authorization Error (403 Forbidden)
 * Returned when user lacks permission for the requested action
 */
export const authorizationErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'FORBIDDEN',
    title: 'Forbidden access',
    status: 403,
    detail: 'You do not have permission to perform this action',
    instance: '/api/v1/users/123'
  }
};

/**
 * 4. Not Found Error (404 Not Found)
 * Returned when requested resource doesn't exist
 */
export const notFoundErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'NOT_FOUND',
    title: 'Resource not found',
    status: 404,
    detail: 'The requested resource could not be found',
    instance: '/api/v1/products/nonexistent-id'
  }
};

/**
 * 5. Conflict Error (409 Conflict)
 * Returned when request conflicts with current state
 */
export const conflictErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'CONFLICT',
    title: 'Resource conflict',
    status: 409,
    detail: 'Email already registered',
    instance: '/api/v1/auth/register'
  }
};

/**
 * 6. Rate Limit Error (429 Too Many Requests)
 * Returned when rate limit is exceeded
 */
export const rateLimitErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'RATE_LIMIT_EXCEEDED',
    title: 'Too many requests',
    status: 429,
    detail: 'Too many requests from this IP, please try again later',
    instance: '/api/v1/auth/login'
  }
};

/**
 * 7. Internal Server Error (500 Internal Server Error)
 * Returned when an unexpected server error occurs
 */
export const internalServerErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'INTERNAL_SERVER_ERROR',
    title: 'Internal server error',
    status: 500,
    detail: 'An unexpected error occurred while processing your request',
    instance: '/api/v1/orders'
  }
};

/**
 * 8. Database Error Example
 * Custom error for database-related issues
 */
export const databaseErrorExample: ApiResponse = {
  success: false,
  error: {
    type: 'DATABASE_ERROR',
    title: 'Database operation failed',
    status: 500,
    detail: 'Unable to connect to the database',
    instance: '/api/v1/products'
  }
};

/**
 * Error Handling Best Practices:
 * 
 * 1. Consistent Structure: All errors follow RFC 7807 format
 * 2. Meaningful Messages: Clear, user-friendly error descriptions
 * 3. Proper Status Codes: HTTP status codes match error types
 * 4. Security: No sensitive information in error messages
 * 5. Logging: All errors are logged with context
 * 6. Validation Details: Field-level validation errors included
 * 7. Instance Information: Request path included for debugging
 * 
 * Error Types Handled:
 * - Validation errors (422)
 * - Authentication errors (401)
 * - Authorization errors (403)
 * - Not found errors (404)
 * - Conflict errors (409)
 * - Rate limiting errors (429)
 * - Internal server errors (500)
 * - Database errors (500)
 * - JWT token errors (401)
 * - Mongoose validation errors (422)
 * - Mongoose cast errors (400)
 * 
 * Client Error Handling:
 * Clients should check the 'success' field and handle errors based on:
 * - HTTP status code for general error category
 * - Error 'type' field for specific error handling
 * - Error 'errors' array for field-level validation issues
 */

// Example of how clients should handle errors
export const clientErrorHandlingExample = `
// JavaScript/TypeScript client example
async function handleApiCall() {
  try {
    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      // Handle error based on type
      switch (result.error.type) {
        case 'VALIDATION_ERROR':
          // Show field-level validation errors
          result.error.errors?.forEach(err => {
            showFieldError(err.field, err.message);
          });
          break;
          
        case 'UNAUTHORIZED':
          // Redirect to login
          redirectToLogin();
          break;
          
        case 'FORBIDDEN':
          // Show access denied message
          showAccessDeniedMessage();
          break;
          
        case 'RATE_LIMIT_EXCEEDED':
          // Show rate limit message and retry after delay
          showRateLimitMessage();
          break;
          
        default:
          // Show generic error message
          showGenericError(result.error.detail);
      }
      return;
    }
    
    // Handle success
    handleSuccess(result.data);
    
  } catch (error) {
    // Handle network or parsing errors
    showNetworkError();
  }
}
`;
