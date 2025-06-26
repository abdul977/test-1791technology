# Deployment Guide - 1791 Technology Frontend

This guide covers various deployment options for the 1791 Technology frontend application.

## 🚀 Quick Deployment (Recommended)

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd rest-api/frontend
   vercel
   ```

4. **Follow the prompts**
   - Project name: `1791technology-frontend`
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`

### Environment Variables
Set these environment variables in your deployment platform:

```bash
# API Base URL (adjust for your backend deployment)
VITE_API_BASE_URL=https://your-backend-api.com/api/v1

# App Environment
VITE_APP_ENV=production

# App Version
VITE_APP_VERSION=1.0.0
```

## 🏗️ Build Process

### Local Build
```bash
# Install dependencies
npm install

# Run type checking
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output
The build process creates:
- `dist/` - Production-ready static files
- Optimized JavaScript bundles
- Compressed CSS files
- Optimized images and assets

## 🌐 Deployment Platforms

### 1. Vercel (Recommended)

**Pros:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Git integration

**Setup:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### 2. Netlify

**Pros:**
- Easy drag-and-drop deployment
- Form handling
- Serverless functions
- Split testing

**Setup:**
1. Connect Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure redirects for SPA

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS S3 + CloudFront

**Pros:**
- Highly scalable
- Cost-effective
- Full AWS integration
- Custom domain support

**Setup Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload build files
4. Configure CloudFront distribution
5. Set up custom domain (optional)

**AWS CLI Deployment:**
```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 4. GitHub Pages

**Pros:**
- Free hosting
- Git integration
- Custom domains

**Setup:**
1. Install gh-pages: `npm install -D gh-pages`
2. Add deploy script to package.json:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

### 5. Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

**Docker Commands:**
```bash
# Build image
docker build -t 1791technology-frontend .

# Run container
docker run -p 80:80 1791technology-frontend
```

## ⚙️ Configuration

### Environment Variables

Create `.env.production` for production settings:
```bash
# API Configuration
VITE_API_BASE_URL=https://api.1791technology.com/api/v1

# App Configuration
VITE_APP_NAME=1791 Technology
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Error Tracking (optional)
VITE_SENTRY_DSN=your_sentry_dsn
```

### API Configuration

Update `src/services/api.ts` for production:
```typescript
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
```

## 🔧 Performance Optimization

### Build Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and CSS optimization
- **Bundle Analysis**: Use `npm run build -- --analyze`

### Runtime Optimization
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser and CDN caching
- **Compression**: Gzip/Brotli compression
- **CDN**: Global content delivery

## 🔒 Security Considerations

### Production Security
- **HTTPS Only**: Enforce HTTPS in production
- **CSP Headers**: Content Security Policy
- **CORS Configuration**: Proper CORS setup
- **Environment Variables**: Secure secret management

### Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: Monitor loading performance
- **Error Tracking**: Implement error monitoring
- **User Analytics**: Track user behavior
- **Uptime Monitoring**: Monitor application availability

### Recommended Tools
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior analytics
- **Lighthouse CI**: Automated performance testing
- **Pingdom**: Uptime monitoring

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for TypeScript errors

**Routing Issues:**
- Configure server for SPA routing
- Check redirect rules
- Verify base URL configuration

**API Connection Issues:**
- Verify API base URL
- Check CORS configuration
- Verify SSL certificates

**Performance Issues:**
- Enable compression
- Optimize images
- Check bundle size
- Configure CDN

### Debug Commands
```bash
# Check build output
npm run build -- --debug

# Analyze bundle size
npm run build -- --analyze

# Test production build locally
npm run preview

# Run tests
npm run test
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Run all tests: `npm test`
- [ ] Check TypeScript: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Update environment variables
- [ ] Verify API endpoints

### Post-Deployment
- [ ] Verify application loads
- [ ] Test authentication flow
- [ ] Check API connectivity
- [ ] Verify responsive design
- [ ] Test core user flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### Rollback Plan
- [ ] Keep previous deployment available
- [ ] Document rollback procedure
- [ ] Monitor deployment metrics
- [ ] Have emergency contacts ready

---

For additional support or questions about deployment, contact:
- **Developer**: Abdulmumin Ibrahim (Vibe Coder)
- **Email**: Abdulmuminibrahim74@gmail.com
- **Phone**: 090 257 94 407
