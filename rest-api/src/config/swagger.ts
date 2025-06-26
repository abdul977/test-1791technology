import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from './index.js';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '1791Technology REST API',
    version: '1.0.0',
    description: `
      A professional RESTful API built with Node.js, Express, and TypeScript following industry best practices.
      
      ## Features
      - JWT-based authentication and authorization
      - Role-based access control (Admin, Moderator, User)
      - Comprehensive input validation
      - Standardized error handling (RFC 7807)
      - Rate limiting and security middleware
      - MongoDB with Mongoose ODM
      - Full CRUD operations for Users, Products, and Orders
      - Search and filtering capabilities
      - Pagination support
      - Request/response logging
      
      ## Authentication
      This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      ## Error Handling
      All errors follow RFC 7807 Problem Details format with consistent structure:
      - \`type\`: Error type identifier
      - \`title\`: Human-readable error title
      - \`status\`: HTTP status code
      - \`detail\`: Detailed error description
      - \`instance\`: Request path where error occurred
      - \`errors\`: Array of field-level validation errors (when applicable)
      
      ## Rate Limiting
      - General endpoints: 100 requests per 15 minutes
      - Authentication endpoints: 5 requests per 15 minutes
      - Create operations: 10 requests per minute
    `,
    contact: {
      name: 'Abdulmumin Ibrahim (Vibe Coder)',
      email: 'Abdulmuminibrahim74@gmail.com',
      url: 'https://potfolio-lilac-one.vercel.app/',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}${config.server.apiPrefix}/${config.server.apiVersion}`,
      description: 'Development server',
    },
    {
      url: `https://test-1791technology.vercel.app${config.server.apiPrefix}/${config.server.apiVersion}`,
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from login endpoint',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
          },
          data: {
            description: 'Response data (varies by endpoint)',
          },
          message: {
            type: 'string',
            description: 'Human-readable response message',
          },
          error: {
            $ref: '#/components/schemas/ErrorDetails',
          },
          meta: {
            $ref: '#/components/schemas/PaginationMeta',
          },
        },
      },
      ErrorDetails: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Error type identifier',
            example: 'VALIDATION_ERROR',
          },
          title: {
            type: 'string',
            description: 'Human-readable error title',
            example: 'Validation failed',
          },
          status: {
            type: 'integer',
            description: 'HTTP status code',
            example: 422,
          },
          detail: {
            type: 'string',
            description: 'Detailed error description',
            example: 'The request data contains validation errors',
          },
          instance: {
            type: 'string',
            description: 'Request path where error occurred',
            example: '/api/v1/users',
          },
          errors: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            description: 'Field name that failed validation',
            example: 'email',
          },
          message: {
            type: 'string',
            description: 'Validation error message',
            example: 'Please provide a valid email address',
          },
          value: {
            description: 'Invalid value that was provided',
            example: 'invalid-email',
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Current page number',
            example: 1,
          },
          limit: {
            type: 'integer',
            description: 'Number of items per page',
            example: 10,
          },
          total: {
            type: 'integer',
            description: 'Total number of items',
            example: 100,
          },
          totalPages: {
            type: 'integer',
            description: 'Total number of pages',
            example: 10,
          },
          hasNext: {
            type: 'boolean',
            description: 'Whether there are more pages',
            example: true,
          },
          hasPrev: {
            type: 'boolean',
            description: 'Whether there are previous pages',
            example: false,
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication required',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiResponse' },
                {
                  properties: {
                    success: { example: false },
                    error: {
                      example: {
                        type: 'UNAUTHORIZED',
                        title: 'Unauthorized access',
                        status: 401,
                        detail: 'Valid authentication credentials are required',
                        instance: '/api/v1/users/profile',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      ForbiddenError: {
        description: 'Insufficient permissions',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiResponse' },
                {
                  properties: {
                    success: { example: false },
                    error: {
                      example: {
                        type: 'FORBIDDEN',
                        title: 'Forbidden access',
                        status: 403,
                        detail: 'You do not have permission to perform this action',
                        instance: '/api/v1/users/123',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiResponse' },
                {
                  properties: {
                    success: { example: false },
                    error: {
                      example: {
                        type: 'NOT_FOUND',
                        title: 'Resource not found',
                        status: 404,
                        detail: 'The requested resource could not be found',
                        instance: '/api/v1/products/nonexistent-id',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiResponse' },
                {
                  properties: {
                    success: { example: false },
                    error: {
                      example: {
                        type: 'VALIDATION_ERROR',
                        title: 'Validation failed',
                        status: 422,
                        detail: 'The request data contains validation errors',
                        instance: '/api/v1/users',
                        errors: [
                          {
                            field: 'email',
                            message: 'Please provide a valid email address',
                            value: 'invalid-email',
                          },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      RateLimitError: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiResponse' },
                {
                  properties: {
                    success: { example: false },
                    error: {
                      example: {
                        type: 'RATE_LIMIT_EXCEEDED',
                        title: 'Too many requests',
                        status: 429,
                        detail: 'Too many requests from this IP, please try again later',
                        instance: '/api/v1/auth/login',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Products',
      description: 'Product management endpoints',
    },
    {
      name: 'Orders',
      description: 'Order management endpoints',
    },
  ],
};

// Options for swagger-jsdoc
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
  ],
};

// Generate swagger specification
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Setup Swagger UI
export const setupSwagger = (app: Express): void => {
  if (config.swagger.enabled) {
    // Swagger UI options
    const swaggerUiOptions = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: '1791Technology API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
      },
    };

    // Serve swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
    
    // Serve swagger.json
    app.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }
};
