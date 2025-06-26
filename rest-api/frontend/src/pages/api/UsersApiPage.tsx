import React, { useState, useEffect } from 'react';
import { Copy, Play, ChevronDown, ChevronRight, ExternalLink, Shield, User } from 'lucide-react';
import ApiLayout from '../../components/layout/ApiLayout';

interface UserData {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
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

const UsersApiPage: React.FC = () => {
  const [sampleUsers, setSampleUsers] = useState<UserData[]>([]);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string>('get-users');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSampleUsers = async () => {
      try {
        const response = await fetch('/backend-api/v1/users?limit=2');
        const data = await response.json();
        // Remove password field from sample data for security
        const sanitizedUsers = (data.data || []).map((user: any) => {
          const { password, ...sanitizedUser } = user;
          return sanitizedUser;
        });
        setSampleUsers(sanitizedUsers);
      } catch (error) {
        console.error('Failed to fetch sample users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSampleUsers();
  }, []);

  const endpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/users',
      title: 'Get All Users',
      description: 'Retrieve a paginated list of all users (Admin only)',
      isPublic: false,
      adminOnly: true,
      parameters: [
        { name: 'page', type: 'integer', required: false, description: 'Page number for pagination', example: '1' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of items per page', example: '10' },
        { name: 'sort', type: 'string', required: false, description: 'Sort field', example: 'createdAt' },
        { name: 'order', type: 'string', required: false, description: 'Sort order (asc/desc)', example: 'desc' },
        { name: 'role', type: 'string', required: false, description: 'Filter by role', example: 'user' },
        { name: 'isActive', type: 'boolean', required: false, description: 'Filter by active status', example: 'true' },
        { name: 'search', type: 'string', required: false, description: 'Search in name, email, username', example: 'john' }
      ],
      responses: [
        {
          status: 200,
          description: 'Users retrieved successfully',
          example: {
            success: true,
            data: sampleUsers.slice(0, 2),
            pagination: {
              page: 1,
              limit: 10,
              total: sampleUsers.length,
              pages: 1
            }
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/users/{id}',
      title: 'Get User by ID',
      description: 'Retrieve a specific user by ID (Users can only access their own profile, Admins can access any)',
      isPublic: false,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'User ID', example: '685d503a6c1f91d519cba62c' }
      ],
      responses: [
        {
          status: 200,
          description: 'User retrieved successfully',
          example: {
            success: true,
            data: sampleUsers[0] || {}
          }
        },
        {
          status: 403,
          description: 'Forbidden - Can only access own profile',
          example: {
            success: false,
            message: 'Forbidden - Can only access own profile or admin required'
          }
        },
        {
          status: 404,
          description: 'User not found',
          example: {
            success: false,
            message: 'User not found'
          }
        }
      ]
    },
    {
      method: 'POST',
      path: '/api/v1/users',
      title: 'Create User',
      description: 'Create a new user (Admin only)',
      isPublic: false,
      adminOnly: true,
      requestBody: {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      responses: [
        {
          status: 201,
          description: 'User created successfully',
          example: {
            success: true,
            data: {
              _id: '685d503a6c1f91d519cba62d',
              email: 'newuser@example.com',
              username: 'newuser',
              firstName: 'John',
              lastName: 'Doe',
              role: 'user',
              isActive: true,
              createdAt: '2025-06-26T13:50:50.045Z',
              updatedAt: '2025-06-26T13:50:50.045Z'
            },
            message: 'User created successfully'
          }
        },
        {
          status: 409,
          description: 'Email or username already exists',
          example: {
            success: false,
            message: 'Email already registered'
          }
        }
      ]
    },
    {
      method: 'PUT',
      path: '/api/v1/users/{id}',
      title: 'Update User',
      description: 'Update user information (Users can update their own profile, Admins can update any)',
      isPublic: false,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'User ID', example: '685d503a6c1f91d519cba62c' }
      ],
      requestBody: {
        firstName: 'Updated Name',
        lastName: 'Updated Last Name',
        email: 'updated@example.com'
      },
      responses: [
        {
          status: 200,
          description: 'User updated successfully',
          example: {
            success: true,
            data: { ...sampleUsers[0], firstName: 'Updated Name', lastName: 'Updated Last Name' },
            message: 'User updated successfully'
          }
        },
        {
          status: 409,
          description: 'Email or username already in use',
          example: {
            success: false,
            message: 'Email already in use'
          }
        }
      ]
    },
    {
      method: 'DELETE',
      path: '/api/v1/users/{id}',
      title: 'Deactivate User',
      description: 'Deactivate a user account (Admin only)',
      isPublic: false,
      adminOnly: true,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'User ID', example: '685d503a6c1f91d519cba62c' }
      ],
      responses: [
        {
          status: 200,
          description: 'User deactivated successfully',
          example: {
            success: true,
            message: 'User deactivated successfully'
          }
        },
        {
          status: 403,
          description: 'Cannot delete own account',
          example: {
            success: false,
            message: 'Cannot delete own account'
          }
        }
      ]
    },
    {
      method: 'PUT',
      path: '/api/v1/users/{id}/activate',
      title: 'Activate User',
      description: 'Activate a deactivated user account (Admin only)',
      isPublic: false,
      adminOnly: true,
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'User ID', example: '685d503a6c1f91d519cba62c' }
      ],
      responses: [
        {
          status: 200,
          description: 'User activated successfully',
          example: {
            success: true,
            message: 'User activated successfully'
          }
        }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/users/stats',
      title: 'Get User Statistics',
      description: 'Get user statistics and analytics (Admin only)',
      isPublic: false,
      adminOnly: true,
      responses: [
        {
          status: 200,
          description: 'Statistics retrieved successfully',
          example: {
            success: true,
            data: {
              totalUsers: sampleUsers.length,
              activeUsers: sampleUsers.filter(u => u.isActive).length,
              usersByRole: {
                admin: sampleUsers.filter(u => u.role === 'admin').length,
                moderator: sampleUsers.filter(u => u.role === 'moderator').length,
                user: sampleUsers.filter(u => u.role === 'user').length
              },
              recentRegistrations: 5
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Users API</h1>
          <p className="text-lg text-gray-600">
            User management and authentication endpoints. Handle user profiles, roles, 
            and administrative operations with proper access controls.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-900">Security Notice</h3>
              <p className="text-amber-800 text-sm mt-1">
                Most user endpoints require authentication. Admin-only endpoints are clearly marked. 
                Users can only access and modify their own profiles unless they have admin privileges.
              </p>
            </div>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Base URL</h3>
              <code className="text-blue-800">http://localhost:3000/api/v1/users</code>
            </div>
            <button
              onClick={() => copyToClipboard('http://localhost:3000/api/v1/users')}
              className="p-2 text-blue-600 hover:text-blue-800"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sample Data */}
        {!isLoading && sampleUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample User Data</h2>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(sampleUsers[0], null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* User Roles */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Roles & Permissions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">User</h3>
              </div>
              <p className="text-sm text-gray-600">
                Standard user with access to their own profile and basic operations.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Moderator</h3>
              </div>
              <p className="text-sm text-gray-600">
                Enhanced permissions for content moderation and product management.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-gray-900">Admin</h3>
              </div>
              <p className="text-sm text-gray-600">
                Full system access including user management and system statistics.
              </p>
            </div>
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
                        href={`http://localhost:3000/api-docs#/Users/${endpoint.method.toLowerCase()}${endpoint.path.replace(/\{|\}/g, '')}`}
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

export default UsersApiPage;
