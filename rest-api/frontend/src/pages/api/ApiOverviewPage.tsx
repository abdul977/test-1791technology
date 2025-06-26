import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  Server, 
  Database, 
  Code, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe
} from 'lucide-react';
import ApiLayout from '../../components/layout/ApiLayout';

interface ApiStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  apiVersion: string;
  serverStatus: 'online' | 'offline';
}

const ApiOverviewPage: React.FC = () => {
  const [apiStats, setApiStats] = useState<ApiStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    apiVersion: 'v1',
    serverStatus: 'online'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiStats = async () => {
      try {
        // Fetch real data from the API
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch('/backend-api/v1/products?limit=1'),
          fetch('/backend-api/v1/users?limit=1'),
          fetch('/backend-api/v1/orders?limit=1')
        ]);

        const [productsData, usersData, ordersData] = await Promise.all([
          productsRes.json(),
          usersRes.json(),
          ordersRes.json()
        ]);

        setApiStats({
          totalProducts: productsData.pagination?.total || 0,
          totalUsers: usersData.pagination?.total || 0,
          totalOrders: ordersData.pagination?.total || 0,
          apiVersion: 'v1',
          serverStatus: 'online'
        });
      } catch (error) {
        console.error('Failed to fetch API stats:', error);
        setApiStats(prev => ({ ...prev, serverStatus: 'offline' }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiStats();
  }, []);

  const endpoints = [
    {
      title: 'Products API',
      path: '/api/v1/products',
      icon: ShoppingCart,
      description: 'Manage product catalog with full CRUD operations',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      features: ['Search products', 'Filter by category', 'Stock management', 'Product statistics'],
      isPublic: true,
      count: apiStats.totalProducts
    },
    {
      title: 'Users API',
      path: '/api/v1/users',
      icon: Users,
      description: 'User management and authentication endpoints',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      features: ['User profiles', 'Role management', 'Account activation', 'User statistics'],
      isPublic: false,
      count: apiStats.totalUsers
    },
    {
      title: 'Orders API',
      path: '/api/v1/orders',
      icon: FileText,
      description: 'Order processing and management system',
      methods: ['GET', 'POST', 'PUT'],
      features: ['Order creation', 'Status tracking', 'Order cancellation', 'Order statistics'],
      isPublic: false,
      count: apiStats.totalOrders
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Base URL',
      description: 'All API requests should be made to:',
      code: 'http://localhost:3000/api/v1'
    },
    {
      step: 2,
      title: 'Authentication',
      description: 'For protected endpoints, include the Authorization header:',
      code: 'Authorization: Bearer <your-jwt-token>'
    },
    {
      step: 3,
      title: 'Content Type',
      description: 'Set the content type for POST/PUT requests:',
      code: 'Content-Type: application/json'
    },
    {
      step: 4,
      title: 'Example Request',
      description: 'Get all products:',
      code: 'GET http://localhost:3000/api/v1/products'
    }
  ];

  return (
    <ApiLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            1791 Technology REST API
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional RESTful API for e-commerce operations. Built with Node.js, Express, 
            TypeScript, and MongoDB. Featuring comprehensive product, user, and order management.
          </p>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">API Status</h2>
            <div className="flex items-center space-x-2">
              {apiStats.serverStatus === 'online' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">Online</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-medium">Offline</span>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">v1</div>
              <div className="text-sm text-gray-600">API Version</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : apiStats.totalProducts}
              </div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? '...' : apiStats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {isLoading ? '...' : apiStats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">Orders</div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Available Endpoints</h2>
          <div className="grid gap-6">
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon;
              return (
                <div key={endpoint.path} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{endpoint.title}</h3>
                        <p className="text-gray-600">{endpoint.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {endpoint.isPublic ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                          Protected
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        {endpoint.count} records
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {endpoint.methods.map((method) => (
                        <span
                          key={method}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            method === 'POST' ? 'bg-green-100 text-green-800' :
                            method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.features.map((feature) => (
                        <span key={feature} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <code className="text-sm bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {endpoint.path}
                    </code>
                    <Link
                      to={endpoint.path}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span>View Documentation</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start Guide</h2>
          <div className="grid gap-6">
            {quickStartSteps.map((step) => (
              <div key={step.step} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm text-gray-800">{step.code}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">External Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Code className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Swagger UI</div>
                <div className="text-sm text-gray-600">Interactive API documentation</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            
            <a
              href="https://github.com/abdul977"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-6 h-6 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">GitHub Repository</div>
                <div className="text-sm text-gray-600">View source code</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            
            <a
              href="https://potfolio-lilac-one.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Developer Portfolio</div>
                <div className="text-sm text-gray-600">More projects & contact</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </ApiLayout>
  );
};

export default ApiOverviewPage;
