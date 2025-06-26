import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config/index.js';
import { requestLogger, errorLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { setupSwagger } from './config/swagger.js';
import logger from './utils/logger.js';

// Import routes
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();

// Trust proxy (important for rate limiting and getting real IP addresses)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);
app.use(errorLogger);

// Rate limiting
app.use(generalLimiter);

// Static file serving
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.server.nodeEnv,
      version: config.server.apiVersion,
    },
    message: 'Server is healthy',
  });
});

// API routes
const apiPrefix = `${config.server.apiPrefix}/${config.server.apiVersion}`;

// Root API route - redirects to current version
app.get(config.server.apiPrefix, (req, res) => {
  res.redirect(301, apiPrefix);
});

// Base API route - provides API information
app.get(apiPrefix, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'REST API Server',
      version: config.server.apiVersion,
      timestamp: new Date().toISOString(),
      endpoints: {
        users: `${apiPrefix}/users`,
        products: `${apiPrefix}/products`,
        orders: `${apiPrefix}/orders`,
        documentation: '/api-docs',
        health: '/health'
      },
      documentation: `${req.protocol}://${req.get('host')}/api-docs`
    }
  });
});

// API discovery endpoint with detailed information
app.get(`${apiPrefix}/info`, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      api: {
        name: 'REST API Server',
        version: config.server.apiVersion,
        environment: config.server.nodeEnv,
        timestamp: new Date().toISOString()
      },
      endpoints: {
        users: {
          base: `${apiPrefix}/users`,
          routes: [
            'GET / - Get all users (Admin only)',
            'GET /:id - Get user by ID',
            'POST / - Create user (Admin only)',
            'PUT /:id - Update user',
            'DELETE /:id - Deactivate user (Admin only)',
            'GET /stats - Get user statistics (Admin only)'
          ]
        },
        products: {
          base: `${apiPrefix}/products`,
          routes: [
            'GET / - Get all products (Public)',
            'GET /:id - Get product by ID (Public)',
            'POST / - Create product (Admin/Moderator)',
            'PUT /:id - Update product (Admin/Moderator)',
            'DELETE /:id - Deactivate product (Admin only)',
            'GET /categories - Get product categories (Public)',
            'GET /search - Search products (Public)',
            'GET /stats - Get product statistics (Admin/Moderator)'
          ]
        },
        orders: {
          base: `${apiPrefix}/orders`,
          routes: [
            'GET / - Get orders (Users see own, Admins see all)',
            'GET /:id - Get order by ID',
            'POST / - Create order',
            'PUT /:id/status - Update order status (Admin/Moderator)',
            'PUT /:id/cancel - Cancel order',
            'GET /stats - Get order statistics (Admin/Moderator)'
          ]
        }
      },
      documentation: `${req.protocol}://${req.get('host')}/api-docs`,
      health: `${req.protocol}://${req.get('host')}/health`
    }
  });
});

// API routes
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);

// Swagger documentation
setupSwagger(app);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
