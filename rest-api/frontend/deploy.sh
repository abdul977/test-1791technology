#!/bin/bash

# Frontend Deployment Script for Vercel

echo "🚀 Starting frontend deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Update VITE_API_BASE_URL in Vercel environment variables"
echo "   2. Update CORS_ORIGIN in your backend Render deployment"
echo "   3. Test all API endpoints"
