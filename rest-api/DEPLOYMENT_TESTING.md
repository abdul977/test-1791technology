# Deployment Testing Guide

This guide helps you test and verify your deployments on Render (backend) and Vercel (frontend).

## 🔍 Backend Testing (Render)

### 1. Health Check
Test your backend health endpoint:
```bash
curl https://your-render-backend-url.onrender.com/health
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-06-26T...",
    "uptime": 123.456,
    "environment": "production",
    "version": "v1"
  },
  "message": "Server is healthy"
}
```

### 2. API Base Endpoint
```bash
curl https://your-render-backend-url.onrender.com/api/v1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "REST API Server",
    "version": "v1",
    "timestamp": "2025-06-26T...",
    "endpoints": {
      "users": "/api/v1/users",
      "products": "/api/v1/products",
      "orders": "/api/v1/orders",
      "documentation": "/api-docs",
      "health": "/health"
    },
    "documentation": "https://your-render-backend-url.onrender.com/api-docs"
  }
}
```

### 3. API Documentation
Visit: `https://your-render-backend-url.onrender.com/api-docs`

Should display Swagger UI with all API endpoints.

### 4. Products Endpoint (Public)
```bash
curl https://your-render-backend-url.onrender.com/api/v1/products
```

### 5. CORS Testing
Test from browser console on your frontend:
```javascript
fetch('https://your-render-backend-url.onrender.com/api/v1/products')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('CORS Error:', error));
```

## 🌐 Frontend Testing (Vercel)

### 1. Homepage Load
Visit: `https://your-frontend-url.vercel.app`

**Check:**
- [ ] Page loads without errors
- [ ] Navigation works
- [ ] Styling is correct
- [ ] No console errors

### 2. API Documentation Pages
Test these routes:
- `https://your-frontend-url.vercel.app/api/v1` - API Overview
- `https://your-frontend-url.vercel.app/api/v1/products` - Products API
- `https://your-frontend-url.vercel.app/api/v1/users` - Users API
- `https://your-frontend-url.vercel.app/api/v1/orders` - Orders API

### 3. Products Page
Visit: `https://your-frontend-url.vercel.app/products`

**Check:**
- [ ] Products load from backend
- [ ] Search functionality works
- [ ] Filtering works
- [ ] Product details page works

### 4. Cart Functionality
**Check:**
- [ ] Add products to cart
- [ ] View cart page
- [ ] Update quantities
- [ ] Remove items

## 🔗 Integration Testing

### 1. Frontend-Backend Communication
Open browser developer tools and check:

**Network Tab:**
- [ ] API calls are made to correct Render URL
- [ ] Responses are successful (200 status)
- [ ] No CORS errors
- [ ] Proper headers are sent

**Console Tab:**
- [ ] No JavaScript errors
- [ ] No network errors
- [ ] API responses are properly handled

### 2. API Endpoints Testing
Test key endpoints from frontend:

**Products:**
```javascript
// In browser console on your frontend
fetch('/api/v1/products')
  .then(r => r.json())
  .then(console.log);
```

**Search:**
```javascript
fetch('/api/v1/products/search?q=laptop')
  .then(r => r.json())
  .then(console.log);
```

**Categories:**
```javascript
fetch('/api/v1/products/categories')
  .then(r => r.json())
  .then(console.log);
```

## 🚨 Common Issues & Solutions

### Backend Issues

**1. Health Check Fails**
- Check Render logs
- Verify environment variables
- Check MongoDB connection

**2. CORS Errors**
- Update `CORS_ORIGIN` in Render environment
- Include your Vercel URL
- Redeploy backend

**3. Database Connection Issues**
- Verify `MONGODB_URI` in Render
- Check MongoDB Atlas network access
- Test connection string

### Frontend Issues

**1. API Calls Fail**
- Check `VITE_API_BASE_URL` in Vercel
- Verify backend URL is correct
- Check network tab for errors

**2. Environment Variables Not Working**
- Ensure variables start with `VITE_`
- Redeploy after setting variables
- Check build logs

**3. Routing Issues**
- Verify `vercel.json` rewrites
- Check for 404 errors on refresh

## 📋 Deployment Checklist

### Backend (Render) ✅
- [ ] Service deployed successfully
- [ ] Health endpoint responds
- [ ] API documentation accessible
- [ ] Environment variables set
- [ ] MongoDB connection working
- [ ] CORS configured for frontend URL

### Frontend (Vercel) ✅
- [ ] Site deployed successfully
- [ ] All pages load correctly
- [ ] API calls work
- [ ] Environment variables set
- [ ] No console errors
- [ ] Mobile responsive

### Integration ✅
- [ ] Frontend can communicate with backend
- [ ] CORS working properly
- [ ] All API endpoints accessible
- [ ] Error handling works
- [ ] Loading states work

## 🔧 Monitoring & Maintenance

### Backend Monitoring
- Monitor Render service health
- Check logs for errors
- Monitor database performance
- Set up uptime monitoring

### Frontend Monitoring
- Monitor Vercel deployment status
- Check Core Web Vitals
- Monitor error rates
- Test on different devices/browsers

## 📞 Support

If you encounter issues:

1. **Check logs** in Render and Vercel dashboards
2. **Verify environment variables** are set correctly
3. **Test API endpoints** individually
4. **Check CORS configuration**

**Contact:**
- **Developer**: Abdulmumin Ibrahim (Vibe Coder)
- **Email**: Abdulmuminibrahim74@gmail.com
- **Phone**: 090 257 94 407
