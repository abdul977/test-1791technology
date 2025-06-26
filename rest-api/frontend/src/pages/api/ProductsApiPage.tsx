import React, { useState, useEffect } from 'react';
import { Copy, Play, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import ApiLayout from '../../components/layout/ApiLayout';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  isActive: boolean;
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  isPublic: boolean;
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

const ProductsApiPage: React.FC = () => {
  const [sampleProducts, setSampleProducts] = useState<Product[]>([]);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string>('get-products');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSampleProducts = async () => {
      try {
        const response = await fetch('/backend-api/v1/products?limit=3');
        const data = await response.json();
        setSampleProducts(data.data || []);
      } catch (error) {
        console.error('Failed to fetch sample products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSampleProducts();
  }, []);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/products',
      title: 'Get All Products',
      description: 'Retrieve a paginated list of all products with optional filtering and sorting',
      isPublic: true,
      parameters: [
        { name: 'page', type: 'integer', required: false, description: 'Page number for pagination', example: '1' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of items per page', example: '10' },
        { name: 'sort', type: 'string', required: false, description: 'Sort field', example: 'name' },
        { name: 'order', type: 'string', required: false, description: 'Sort order (asc/desc)', example: 'asc' },
        { name: 'category', type: 'string', required: false, description: 'Filter by category', example: 'Electronics' },
        { name: 'search', type: 'string', required: false, description: 'Search in name and description', example: 'wireless' }
      ],
      responses: [
        {
          status: 200,
          description: 'Products retrieved successfully',
          example: {
            success: true,
            data: sampleProducts.slice(0, 2),
            pagination: {
              page: 1,
              limit: 10,
              total: sampleProducts.length,
              pages: 1
            }
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/products/{id}',
      title: 'Get Product by ID',
      description: 'Retrieve a specific product by its ID',
      isPublic: true,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Product ID', example: '685d4e2a92de265ff93207d9' }
      ],
      responses: [
        {
          status: 200,
          description: 'Product retrieved successfully',
          example: {
            success: true,
            data: sampleProducts[0] || {}
          }
        },
        {
          status: 404,
          description: 'Product not found',
          example: {
            success: false,
            message: 'Product not found'
          }
        }
      ]
    },
    {
      method: 'POST',
      path: '/api/v1/products',
      title: 'Create Product',
      description: 'Create a new product (Admin/Moderator only)',
      isPublic: false,
      requestBody: {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring and GPS',
        price: 299.99,
        category: 'Electronics',
        stock: 25,
        sku: 'SWP-001'
      },
      responses: [
        {
          status: 201,
          description: 'Product created successfully',
          example: {
            success: true,
            data: {
              _id: '685d4e2a92de265ff93207da',
              name: 'Smart Watch Pro',
              description: 'Advanced smartwatch with health monitoring and GPS',
              price: 299.99,
              category: 'Electronics',
              stock: 25,
              sku: 'SWP-001',
              isActive: true
            },
            message: 'Product created successfully'
          }
        },
        {
          status: 409,
          description: 'SKU already exists',
          example: {
            success: false,
            message: 'SKU already exists'
          }
        }
      ]
    },
    {
      method: 'PUT',
      path: '/api/v1/products/{id}',
      title: 'Update Product',
      description: 'Update an existing product (Admin/Moderator only)',
      isPublic: false,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Product ID', example: '685d4e2a92de265ff93207d9' }
      ],
      requestBody: {
        name: 'Updated Product Name',
        price: 149.99,
        stock: 30
      },
      responses: [
        {
          status: 200,
          description: 'Product updated successfully',
          example: {
            success: true,
            data: { ...sampleProducts[0], name: 'Updated Product Name', price: 149.99 },
            message: 'Product updated successfully'
          }
        }
      ]
    },
    {
      method: 'DELETE',
      path: '/api/v1/products/{id}',
      title: 'Delete Product',
      description: 'Deactivate a product (Admin only)',
      isPublic: false,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Product ID', example: '685d4e2a92de265ff93207d9' }
      ],
      responses: [
        {
          status: 200,
          description: 'Product deactivated successfully',
          example: {
            success: true,
            message: 'Product deactivated successfully'
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/products/categories',
      title: 'Get Categories',
      description: 'Get all available product categories',
      isPublic: true,
      responses: [
        {
          status: 200,
          description: 'Categories retrieved successfully',
          example: {
            success: true,
            data: ['Electronics', 'Clothing', 'Books', 'Home & Garden']
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/products/search',
      title: 'Search Products',
      description: 'Search products by query string',
      isPublic: true,
      parameters: [
        { name: 'q', type: 'string', required: true, description: 'Search query', example: 'wireless headphones' },
        { name: 'page', type: 'integer', required: false, description: 'Page number', example: '1' },
        { name: 'limit', type: 'integer', required: false, description: 'Items per page', example: '10' }
      ],
      responses: [
        {
          status: 200,
          description: 'Search completed successfully',
          example: {
            success: true,
            data: sampleProducts.filter(p => p.name.toLowerCase().includes('wireless')),
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/products/stats',
      title: 'Get Product Statistics',
      description: 'Get product statistics (Admin/Moderator only)',
      isPublic: false,
      responses: [
        {
          status: 200,
          description: 'Statistics retrieved successfully',
          example: {
            success: true,
            data: {
              totalProducts: sampleProducts.length,
              activeProducts: sampleProducts.filter(p => p.isActive).length,
              totalValue: sampleProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
              categoryCounts: {
                Electronics: 2,
                Clothing: 1
              }
            }
          }
        }
      ]
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products API</h1>
          <p className="text-lg text-gray-600">
            Comprehensive product management endpoints for e-commerce operations. 
            Manage product catalog, categories, search, and inventory.
          </p>
        </div>

        {/* Base URL */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Base URL</h3>
              <code className="text-blue-800">http://localhost:3000/api/v1/products</code>
            </div>
            <button
              onClick={() => copyToClipboard('http://localhost:3000/api/v1/products')}
              className="p-2 text-blue-600 hover:text-blue-800"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sample Data */}
        {!isLoading && sampleProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Data</h2>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(sampleProducts[0], null, 2)}
              </pre>
            </div>
          </div>
        )}

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
                      {endpoint.isPublic ? (
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
                        href={`http://localhost:3000/api-docs#/Products/${endpoint.method.toLowerCase()}${endpoint.path.replace(/\{|\}/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Try in Swagger</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(`curl -X ${endpoint.method} "http://localhost:3000${endpoint.path}"`)}
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

export default ProductsApiPage;
