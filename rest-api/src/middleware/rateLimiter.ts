import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import { ApiResponse } from '../types/index.js';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs, // 15 minutes
  max: config.security.rateLimitMaxRequests, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      type: 'RATE_LIMIT_EXCEEDED',
      title: 'Too many requests',
      status: 429,
      detail: 'Too many requests from this IP, please try again later.',
    },
  } as ApiResponse,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        type: 'RATE_LIMIT_EXCEEDED',
        title: 'Too many requests',
        status: 429,
        detail: 'Too many requests from this IP, please try again later.',
        instance: req.url,
      },
    } as ApiResponse);
  },
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    error: {
      type: 'AUTH_RATE_LIMIT_EXCEEDED',
      title: 'Too many authentication attempts',
      status: 429,
      detail: 'Too many authentication attempts from this IP, please try again later.',
    },
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        type: 'AUTH_RATE_LIMIT_EXCEEDED',
        title: 'Too many authentication attempts',
        status: 429,
        detail: 'Too many authentication attempts from this IP, please try again later.',
        instance: req.url,
      },
    } as ApiResponse);
  },
});

// Create operation rate limiter
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 create requests per minute
  message: {
    success: false,
    error: {
      type: 'CREATE_RATE_LIMIT_EXCEEDED',
      title: 'Too many create requests',
      status: 429,
      detail: 'Too many create requests from this IP, please try again later.',
    },
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        type: 'CREATE_RATE_LIMIT_EXCEEDED',
        title: 'Too many create requests',
        status: 429,
        detail: 'Too many create requests from this IP, please try again later.',
        instance: req.url,
      },
    } as ApiResponse);
  },
});
