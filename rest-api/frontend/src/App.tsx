import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import ApiOverviewPage from './pages/api/ApiOverviewPage';
import ProductsApiPage from './pages/api/ProductsApiPage';
import UsersApiPage from './pages/api/UsersApiPage';
import OrdersApiPage from './pages/api/OrdersApiPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />

            {/* API Documentation routes */}
            <Route path="/api/v1" element={<ApiOverviewPage />} />
            <Route path="/api/v1/products" element={<ProductsApiPage />} />
            <Route path="/api/v1/orders" element={<OrdersApiPage />} />
            <Route path="/api/v1/users" element={<UsersApiPage />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
