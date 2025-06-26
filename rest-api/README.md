# 1791Technology REST API

A professional RESTful API built with Node.js, Express, and TypeScript following industry best practices.

## 🚀 Live Demo

- **Production API**: [https://test-1791technology.vercel.app/api/v1](https://test-1791technology.vercel.app/api/v1)
- **API Documentation**: [https://test-1791technology.vercel.app/api-docs](https://test-1791technology.vercel.app/api-docs)

## 📋 Features

### Core Features
- ✅ **RESTful Design**: Follows REST principles with proper HTTP methods and status codes
- ✅ **JWT Authentication**: Secure token-based authentication with refresh tokens
- ✅ **Role-Based Access Control**: Admin, Moderator, and User roles
- ✅ **Input Validation**: Comprehensive validation using Joi
- ✅ **Error Handling**: Standardized error responses following RFC 7807
- ✅ **Rate Limiting**: Protection against abuse with configurable limits
- ✅ **Security Headers**: Helmet.js for security best practices
- ✅ **Request Logging**: Detailed logging with Winston
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation
- ✅ **Testing Suite**: Comprehensive unit and integration tests
- ✅ **Postman Collection**: Ready-to-use API collection

### Technical Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## 🏗️ Architecture

### Project Structure
```
rest-api/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── tests/           # Test files
│   └── examples/        # Usage examples
├── postman/             # Postman collection and environment
├── logs/                # Application logs
└── docs/                # Additional documentation
```

### API Endpoints

#### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /refresh` - Refresh access token
- `POST /logout` - User logout

#### Users (`/api/v1/users`)
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID
- `POST /` - Create user (Admin only)
- `PUT /:id` - Update user
- `DELETE /:id` - Deactivate user (Admin only)
- `GET /stats` - Get user statistics (Admin only)

#### Products (`/api/v1/products`)
- `GET /` - Get all products (Public)
- `GET /:id` - Get product by ID (Public)
- `POST /` - Create product (Admin/Moderator)
- `PUT /:id` - Update product (Admin/Moderator)
- `DELETE /:id` - Deactivate product (Admin only)
- `GET /categories` - Get product categories (Public)
- `GET /search` - Search products (Public)
- `GET /stats` - Get product statistics (Admin/Moderator)

#### Orders (`/api/v1/orders`)
- `GET /` - Get orders (Users see own, Admins see all)
- `GET /:id` - Get order by ID
- `POST /` - Create order
- `PUT /:id/status` - Update order status (Admin/Moderator)
- `PUT /:id/cancel` - Cancel order
- `GET /stats` - Get order statistics (Admin/Moderator)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rest-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

6. **Access the API**
- API Base URL: `http://localhost:3000/api/v1`
- Documentation: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
The test suite includes:
- Unit tests for utilities and middleware
- Integration tests for all API endpoints
- Authentication and authorization tests
- Error handling tests
- Validation tests

## 📚 API Documentation

### Interactive Documentation
Visit `/api-docs` endpoint for interactive Swagger UI documentation with:
- Complete API reference
- Request/response examples
- Authentication flows
- Error response formats
- Try-it-out functionality

### Postman Collection
Import the Postman collection and environment:
1. Import `postman/1791Technology-REST-API.postman_collection.json`
2. Import `postman/1791Technology-Environment.postman_environment.json`
3. Set up environment variables
4. Start testing!

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Token expiration and refresh mechanism

### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Sanitization**: XSS protection
- **Validation**: Comprehensive input validation

### Rate Limits
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Create operations: 10 requests per minute

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rest-api-db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## 📊 Monitoring & Logging

### Logging
- Structured logging with Winston
- Request/response logging with Morgan
- Error logging with stack traces
- Log levels: error, warn, info, http, debug

### Health Check
- Endpoint: `GET /health`
- Returns server status, uptime, and environment info

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure production MongoDB
- [ ] Set NODE_ENV=production
- [ ] Configure CORS origins
- [ ] Set up SSL/TLS
- [ ] Configure reverse proxy
- [ ] Set up monitoring
- [ ] Configure log rotation

### Docker Support
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Abdulmumin Ibrahim (Vibe Coder)**
- Email: Abdulmuminibrahim74@gmail.com
- Portfolio: [https://potfolio-lilac-one.vercel.app/](https://potfolio-lilac-one.vercel.app/)
- GitHub: [https://github.com/abdul977](https://github.com/abdul977)
- Phone: 090 257 94 407

---

Built with ❤️ by Muahib Solutions for professional API development and job interview showcases.
