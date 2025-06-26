import morgan from 'morgan';
import logger from '../utils/logger.js';
import config from '../config/index.js';

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom token for request ID (if you implement request ID middleware)
morgan.token('request-id', (req: any) => {
  return req.requestId || '-';
});

// Custom token for user ID (if authenticated)
morgan.token('user-id', (req: any) => {
  return req.user?.id || '-';
});

// Define log format based on environment
const getLogFormat = (): string => {
  if (config.server.nodeEnv === 'production') {
    return 'combined';
  }
  return ':method :url :status :res[content-length] - :response-time ms';
};

// Custom format for detailed logging
const detailedFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :request-id :user-id';

// Create morgan middleware
export const requestLogger = morgan(getLogFormat(), {
  stream: {
    write: (message: string) => {
      // Remove trailing newline and log as info
      logger.http(message.trim());
    },
  },
  skip: (req, res) => {
    // Skip logging for health check endpoints in production
    if (config.server.nodeEnv === 'production') {
      return req.url === '/health' || req.url === '/api/health';
    }
    return false;
  },
});

// Detailed request logger for development
export const detailedRequestLogger = morgan(detailedFormat, {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
});

// Error logger
export const errorLogger = morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.error(message.trim());
    },
  },
  skip: (req, res) => {
    // Only log errors (4xx and 5xx status codes)
    return res.statusCode < 400;
  },
});
