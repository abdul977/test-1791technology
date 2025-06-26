# Deployment Guide

This guide covers deploying the 1791Technology REST API to various platforms.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended for Node.js APIs)

#### Prerequisites
- Vercel account
- MongoDB Atlas account (for database)

#### Steps
1. **Prepare for deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

2. **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. **Set environment variables**
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
# Add other environment variables
```

4. **Deploy**
```bash
npm run build
vercel --prod
```

### 2. Railway

#### Steps
1. **Connect GitHub repository**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

### 3. Render

#### Steps
1. **Connect GitHub repository**
2. **Configure build and start commands**
   - Build Command: `npm run build`
   - Start Command: `npm start`
3. **Set environment variables**
4. **Deploy**

### 4. Heroku

#### Steps
1. **Install Heroku CLI**
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

### 5. DigitalOcean App Platform

#### Steps
1. **Connect GitHub repository**
2. **Configure app spec**
3. **Set environment variables**
4. **Deploy**

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/rest-api-db
      - JWT_SECRET=your-jwt-secret
      - JWT_REFRESH_SECRET=your-refresh-secret
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mongo_data:
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Scale the API
docker-compose up -d --scale api=3
```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Server
NODE_ENV=production
PORT=3000

# Database (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT (Use strong secrets in production)
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-256-bits-minimum
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS (Set your frontend domains)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# API Documentation
SWAGGER_ENABLED=true
```

## 🔒 Security Checklist

### Pre-deployment Security
- [ ] Strong JWT secrets (256-bit minimum)
- [ ] Secure MongoDB connection string
- [ ] CORS configured for specific origins
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enforced
- [ ] Security headers configured

### Post-deployment Security
- [ ] SSL/TLS certificate installed
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented

## 📊 Monitoring Setup

### Application Monitoring
```javascript
// Add to your app.js for production monitoring
if (process.env.NODE_ENV === 'production') {
  // Add monitoring service (e.g., New Relic, DataDog)
  require('newrelic');
  
  // Add error tracking (e.g., Sentry)
  const Sentry = require('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}
```

### Health Checks
- API health endpoint: `/health`
- Database connectivity check
- External service dependencies
- Memory and CPU usage

### Logging Strategy
- Structured JSON logging
- Log aggregation (ELK stack, Splunk)
- Error alerting
- Performance metrics

## 🚀 Performance Optimization

### Production Optimizations
1. **Enable compression**
   ```javascript
   app.use(compression());
   ```

2. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name "api" -i max
   ```

3. **Database optimization**
   - Connection pooling
   - Proper indexing
   - Query optimization

4. **Caching strategy**
   - Redis for session storage
   - API response caching
   - Database query caching

### Load Balancing
```nginx
# nginx.conf
upstream api_servers {
    server api1:3000;
    server api2:3000;
    server api3:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues
1. **MongoDB connection issues**
   - Check connection string
   - Verify network access
   - Check authentication

2. **JWT token issues**
   - Verify secret configuration
   - Check token expiration
   - Validate token format

3. **CORS errors**
   - Configure allowed origins
   - Check preflight requests
   - Verify headers

4. **Rate limiting issues**
   - Adjust rate limits
   - Check IP forwarding
   - Monitor usage patterns

### Debugging in Production
```javascript
// Add debug logging
if (process.env.DEBUG === 'true') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

## 📞 Support

For deployment support, contact:
- **Developer**: Abdulmumin Ibrahim (Vibe Coder)
- **Email**: Abdulmuminibrahim74@gmail.com
- **Phone**: 090 257 94 407
