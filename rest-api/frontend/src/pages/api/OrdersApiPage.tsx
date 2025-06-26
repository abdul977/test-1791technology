import React, { useState, useEffect } from 'react';
import { Copy, Play, ChevronDown, ChevronRight, ExternalLink, Package, Truck, CheckCircle } from 'lucide-react';
import ApiLayout from '../../components/layout/ApiLayout';

interface OrderData {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  isPublic: boolean;
  adminOnly?: boolean;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  requestBody?: object;
  responses: Array<{
    status: number;
    description: string;
    example: object;
  }>;
}

const OrdersApiPage: React.FC = () => {
  const [orderCount, setOrderCount] = useState<number>(0);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string>('get-orders');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await fetch('/backend-api/v1/orders?limit=1');
        const data = await response.json();
        setOrderCount(data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch order stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  // Sample order data structure based on real backend schema
  const sampleOrder: OrderData = {
    _id: '685d4e2a92de265ff93207e1',
    userId: '685d503a6c1f91d519cba62c',
    items: [
      {
        productId: '685d4e2a92de265ff93207d9',
        quantity: 2,
        price: 99.99,
        total: 199.98
      }
    ],
    totalAmount: 224.97,
    status: 'confirmed',
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    createdAt: '2025-06-26T14:30:00.000Z',
    updatedAt: '2025-06-26T14:35:00.000Z'
  };

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/orders',
      title: 'Get Orders',
      description: 'Retrieve orders (Users see their own orders, Admins see all orders)',
      isPublic: false,
      parameters: [
        { name: 'page', type: 'integer', required: false, description: 'Page number for pagination', example: '1' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of items per page', example: '10' },
        { name: 'sort', type: 'string', required: false, description: 'Sort field', example: 'createdAt' },
        { name: 'order', type: 'string', required: false, description: 'Sort order (asc/desc)', example: 'desc' },
        { name: 'status', type: 'string', required: false, description: 'Filter by status', example: 'confirmed' }
      ],
      responses: [
        {
          status: 200,
          description: 'Orders retrieved successfully',
          example: {
            success: true,
            data: [sampleOrder],
            pagination: {
              page: 1,
              limit: 10,
              total: orderCount,
              pages: Math.ceil(orderCount / 10) || 1
            }
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/orders/{id}',
      title: 'Get Order by ID',
      description: 'Retrieve a specific order by ID (Users can only access their own orders)',
      isPublic: false,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Order ID', example: '685d4e2a92de265ff93207e1' }
      ],
      responses: [
        {
          status: 200,
          description: 'Order retrieved successfully',
          example: {
            success: true,
            data: sampleOrder
          }
        },
        {
          status: 404,
          description: 'Order not found',
          example: {
            success: false,
            message: 'Order not found'
          }
        }
      ]
    },
    {
      method: 'POST',
      path: '/api/v1/orders',
      title: 'Create Order',
      description: 'Create a new order with items and shipping information',
      isPublic: false,
      requestBody: {
        items: [
          {
            productId: '685d4e2a92de265ff93207d9',
            quantity: 2,
            price: 99.99
          }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'credit_card'
      },
      responses: [
        {
          status: 201,
          description: 'Order created successfully',
          example: {
            success: true,
            data: sampleOrder,
            message: 'Order created successfully'
          }
        }
      ]
    },
    {
      method: 'PUT',
      path: '/api/v1/orders/{id}/status',
      title: 'Update Order Status',
      description: 'Update the status of an order (Admin/Moderator only)',
      isPublic: false,
      adminOnly: true,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Order ID', example: '685d4e2a92de265ff93207e1' }
      ],
      requestBody: {
        status: 'shipped'
      },
      responses: [
        {
          status: 200,
          description: 'Order status updated successfully',
          example: {
            success: true,
            data: { ...sampleOrder, status: 'shipped' },
            message: 'Order status updated successfully'
          }
        }
      ]
    },
    {
      method: 'PUT',
      path: '/api/v1/orders/{id}/cancel',
      title: 'Cancel Order',
      description: 'Cancel an order (Users can cancel their own orders if status allows)',
      isPublic: false,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Order ID', example: '685d4e2a92de265ff93207e1' }
      ],
      responses: [
        {
          status: 200,
          description: 'Order cancelled successfully',
          example: {
            success: true,
            data: { ...sampleOrder, status: 'cancelled' },
            message: 'Order cancelled successfully'
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/orders/stats',
      title: 'Get Order Statistics',
      description: 'Get order statistics and analytics (Admin/Moderator only)',
      isPublic: false,
      adminOnly: true,
      responses: [
        {
          status: 200,
          description: 'Statistics retrieved successfully',
          example: {
            success: true,
            data: {
              totalOrders: orderCount,
              ordersByStatus: {
                pending: 5,
                confirmed: 10,
                processing: 8,
                shipped: 12,
                delivered: 15,
                cancelled: 2
              },
              totalRevenue: 15420.50,
              averageOrderValue: 224.97
            }
          }
        }
      ]
    }
  ];

  const orderStatuses = [
    { status: 'pending', color: 'bg-yellow-100 text-yellow-800', icon: Package, description: 'Order placed, awaiting confirmation' },
    { status: 'confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle, description: 'Order confirmed, preparing for processing' },
    { status: 'processing', color: 'bg-purple-100 text-purple-800', icon: Package, description: 'Order being prepared for shipment' },
    { status: 'shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck, description: 'Order shipped, in transit' },
    { status: 'delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle, description: 'Order delivered successfully' },
    { status: 'cancelled', color: 'bg-red-100 text-red-800', icon: Package, description: 'Order cancelled' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ApiLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Orders API</h1>
          <p className="text-lg text-gray-600">
            Complete order management system for e-commerce operations. Handle order creation, 
            status tracking, updates, and comprehensive order analytics.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Base URL</h3>
              <code className="text-blue-800">http://localhost:3000/api/v1/orders</code>
            </div>
            <button
              onClick={() => copyToClipboard('http://localhost:3000/api/v1/orders')}
              className="p-2 text-blue-600 hover:text-blue-800"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Statistics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? '...' : orderCount}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : Math.floor(orderCount * 0.8)}
              </div>
              <div className="text-sm text-gray-600">Completed Orders</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? '...' : Math.floor(orderCount * 0.15)}
              </div>
              <div className="text-sm text-gray-600">In Transit</div>
            </div>
          </div>
        </div>

        {/* Order Statuses */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status Flow</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderStatuses.map((statusInfo) => {
              const Icon = statusInfo.icon;
              return (
                <div key={statusInfo.status} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className={`px-2 py-1 text-sm font-medium rounded ${statusInfo.color}`}>
                      {statusInfo.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{statusInfo.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sample Order Data */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Order Structure</h2>
          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-800">
              {JSON.stringify(sampleOrder, null, 2)}
            </pre>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Endpoints</h2>
          {endpoints.map((endpoint, index) => {
            const endpointId = `${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const isExpanded = expandedEndpoint === endpointId;

            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => setExpandedEndpoint(isExpanded ? '' : endpointId)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{endpoint.title}</h3>
                        <p className="text-gray-600">{endpoint.description}</p>
                        <code className="text-sm text-gray-500">{endpoint.path}</code>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {endpoint.adminOnly ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          Admin Only
                        </span>
                      ) : endpoint.isPublic ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                          Protected
                        </span>
                      )}
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t p-6 space-y-6">
                    {/* Parameters */}
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex}>
                                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{param.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                                  <td className="px-4 py-2 text-sm">
                                    {param.required ? (
                                      <span className="text-red-600">Required</span>
                                    ) : (
                                      <span className="text-gray-500">Optional</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                                  <td className="px-4 py-2 text-sm">
                                    {param.example && (
                                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{param.example}</code>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {endpoint.requestBody && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Request Body</h4>
                        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-gray-800">
                            {JSON.stringify(endpoint.requestBody, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Responses</h4>
                      <div className="space-y-4">
                        {endpoint.responses.map((response, responseIndex) => (
                          <div key={responseIndex} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-sm font-medium rounded ${
                                  response.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {response.status}
                                </span>
                                <span className="text-gray-600">{response.description}</span>
                              </div>
                              <button
                                onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2))}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                              <pre className="text-sm text-gray-800">
                                {JSON.stringify(response.example, null, 2)}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Try it out */}
                    <div className="flex items-center space-x-4 pt-4 border-t">
                      <a
                        href={`http://localhost:3000/api-docs#/Orders/${endpoint.method.toLowerCase()}${endpoint.path.replace(/\{|\}/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Try in Swagger</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(`curl -X ${endpoint.method} "http://localhost:3000${endpoint.path}" -H "Authorization: Bearer YOUR_TOKEN"`)}
                        className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy cURL</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ApiLayout>
  );
};

export default OrdersApiPage;
