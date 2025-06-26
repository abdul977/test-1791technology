import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity
} from 'lucide-react';
import { UserStats, ProductStats, OrderStats } from '../../types';
import apiClient from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [users, products, orders] = await Promise.all([
        apiClient.getUserStats(),
        apiClient.getProductStats(),
        apiClient.getOrderStats(),
      ]);

      setUserStats(users);
      setProductStats(products);
      setOrderStats(orders);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats?.newUsersThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productStats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {productStats?.activeProducts || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${orderStats?.averageOrderValue?.toFixed(2) || '0.00'} avg value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orderStats?.totalRevenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${orderStats?.revenueThisMonth?.toFixed(2) || '0.00'} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>User distribution by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats?.usersByRole && Object.entries(userStats.usersByRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{role}</span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
            <CardDescription>Orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStats?.ordersByStatus && Object.entries(orderStats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{status}</span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Product Insights</CardTitle>
          <CardDescription>Key product metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {productStats?.categoriesCount || 0}
              </div>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${productStats?.averagePrice?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-600">Average Price</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {productStats?.lowStockProducts || 0}
              </div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Users Management Component
const UsersManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
        <p className="text-gray-600">Manage users, roles, and permissions</p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-600">
            User management interface coming soon. This will include user listing,
            role management, and user activity monitoring.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Products Management Component
const ProductsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Management</h2>
        <p className="text-gray-600">Manage products, inventory, and categories</p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
          <p className="text-gray-600">
            Product management interface coming soon. This will include product CRUD operations,
            inventory management, and category administration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Orders Management Component
const OrdersManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h2>
        <p className="text-gray-600">Manage orders, fulfillment, and customer service</p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management</h3>
          <p className="text-gray-600">
            Order management interface coming soon. This will include order processing,
            status updates, and fulfillment tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart3, current: location.pathname === '/admin' },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Products', href: '/admin/products', icon: Package, current: location.pathname === '/admin/products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, current: location.pathname === '/admin/orders' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your application and monitor key metrics</p>
      </div>

      {/* Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/products" element={<ProductsManagement />} />
        <Route path="/orders" element={<OrdersManagement />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
