# 1791 Technology - Frontend

A modern, responsive React frontend application that perfectly integrates with the 1791 Technology REST API backend. This project demonstrates professional web development practices and serves as a showcase for job interview purposes.

## 🚀 Features

### Core Functionality
- **Complete E-commerce Platform**: Product browsing, cart management, and order processing
- **User Authentication**: Login, registration, profile management with JWT tokens
- **Role-Based Access Control**: User, moderator, and admin roles with appropriate permissions
- **Admin Dashboard**: Comprehensive statistics, user management, and product administration
- **Responsive Design**: Mobile-first approach with seamless desktop experience

### Technical Highlights
- **Modern React 19**: Latest React features with TypeScript for type safety
- **API Documentation**: Professional interactive API documentation pages
- **State Management**: Context API for global state (cart, notifications)
- **API Integration**: Comprehensive REST API client with real data integration
- **UI/UX Excellence**: Professional design with Tailwind CSS and custom components
- **Real-time Feedback**: Toast notifications and loading states throughout the app

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6 with API documentation routes
- **HTTP Client**: Axios with interceptors for API communication
- **Icons**: Lucide React for consistent iconography
- **Development**: ESLint, TypeScript for code quality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, Layout, ApiLayout)
│   └── ui/             # Base UI components (Button, Input, Card, etc.)
├── contexts/           # React Context providers
│   └── CartContext.tsx # Shopping cart state management
├── pages/              # Page components
│   ├── api/            # API documentation pages
│   ├── products/       # Product listing and detail pages
│   ├── cart/           # Shopping cart page
│   ├── checkout/       # Checkout process
│   ├── orders/         # Order management pages
│   ├── profile/        # API documentation redirect page
│   └── admin/          # Admin dashboard
├── services/           # API services and utilities
│   └── api.ts          # Comprehensive API client
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 1791tecnology/rest-api/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Environment Setup

The frontend is configured to work with the backend API at `http://localhost:3000`. If your backend runs on a different port, update the `baseURL` in `src/services/api.ts`.

## 📚 API Documentation

### Available Documentation
- **API Overview**: Complete API documentation at `/api/v1`
- **Products API**: Product management endpoints at `/api/v1/products`
- **Users API**: User management endpoints at `/api/v1/users`
- **Orders API**: Order processing endpoints at `/api/v1/orders`
- **Swagger UI**: Interactive API testing at `http://localhost:3000/api-docs`

### Features
- Real-time data from backend API
- Interactive endpoint documentation
- Copy-to-clipboard functionality
- Professional Swagger-like interface
- Live API statistics and examples

### Authentication Flow
1. User logs in with email/password
2. Backend returns JWT access token and refresh token
3. Frontend stores tokens and user data
4. API client automatically includes tokens in requests
5. Automatic token refresh on expiration

## 🛒 Key Features Walkthrough

### Product Management
- **Product Listing**: Paginated grid/list view with search and filters
- **Product Details**: Comprehensive product information with image gallery
- **Categories**: Dynamic category filtering
- **Search**: Real-time product search functionality

### Shopping Cart
- **Add to Cart**: Seamless product addition with quantity selection
- **Cart Management**: Update quantities, remove items, clear cart
- **Persistent Storage**: Cart data persists across browser sessions
- **Order Summary**: Real-time calculation of totals, shipping, and taxes

### Order Processing
- **Multi-step Checkout**: Shipping information, payment details, order review
- **Order History**: Complete order tracking and status updates
- **Order Details**: Comprehensive order information and timeline

### Admin Dashboard
- **Statistics Overview**: Key metrics and performance indicators
- **User Management**: User listing, role management, account status
- **Product Administration**: Product CRUD operations and inventory management
- **Order Management**: Order processing and status updates

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) for main actions and branding
- **Secondary**: Gray scale for text and backgrounds
- **Success**: Green (#22c55e) for positive actions
- **Warning**: Yellow (#f59e0b) for caution states
- **Error**: Red (#ef4444) for error states

### Typography
- **Font Family**: Inter for clean, modern readability
- **Font Weights**: 300-700 for proper hierarchy
- **Responsive Sizing**: Fluid typography that scales with screen size

### Components
- **Consistent Spacing**: 4px base unit with systematic scaling
- **Border Radius**: Consistent rounded corners throughout
- **Shadows**: Subtle elevation for depth and hierarchy
- **Animations**: Smooth transitions and micro-interactions

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile (320px+)**: Optimized for touch interactions
- **Tablet (768px+)**: Enhanced layout with more content
- **Desktop (1024px+)**: Full-featured experience with sidebars
- **Large Screens (1280px+)**: Maximum content width with centered layout

## 🔧 API Integration

### API Client Features
- **Automatic Authentication**: JWT token management with refresh
- **Error Handling**: Comprehensive error handling with user feedback
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Token refresh and error processing
- **Type Safety**: Full TypeScript integration for API responses

### Endpoints Covered
- **Authentication**: Login, register, profile, password change
- **Products**: CRUD operations, search, categories, statistics
- **Orders**: Order management, status updates, history
- **Users**: User management, role assignment (admin only)

## 👨‍💻 Developer Information

**Developed by**: Abdulmumin Ibrahim (Vibe Coder)
- **Phone**: 090 257 94 407
- **Email**: Abdulmuminibrahim74@gmail.com
- **Portfolio**: https://potfolio-lilac-one.vercel.app/
- **GitHub**: https://github.com/abdul977
- **Experience**: 1-2 years full-stack development

**Company**: Muahib Solutions
**Project Purpose**: Job interview showcase demonstrating professional web development skills

---

**Live Demo**: https://test-1791technology.vercel.app/
**API Documentation**: http://localhost:3000/api-docs (when backend is running)
