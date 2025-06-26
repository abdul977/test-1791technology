import React from 'react';
import { User, Code, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-lg text-gray-600">
            This page has been converted to showcase API documentation.
            User profiles are now managed through the Users API endpoints.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Users API</span>
              </CardTitle>
              <CardDescription>
                Manage user profiles and authentication through RESTful endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/api/v1/users"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Users API Documentation →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Interactive Testing</span>
              </CardTitle>
              <CardDescription>
                Test API endpoints with Swagger UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="http://localhost:3000/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Open Swagger UI →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>API Overview</span>
              </CardTitle>
              <CardDescription>
                Complete API documentation and getting started guide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/api/v1"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View API Overview →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
