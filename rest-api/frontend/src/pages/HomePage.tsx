import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, BarChart3, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              1791 Technology
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Professional RESTful API Showcase
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
              A modern e-commerce platform demonstrating industry best practices with React, TypeScript, 
              Node.js, and MongoDB. Built by Abdulmumin Ibrahim (Vibe Coder) as a showcase project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/api/v1">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Explore API Documentation
                </Button>
              </Link>
              <a
                href="http://localhost:3000/api-docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Swagger UI
                </Button>
              </a>
              <Link to="/products">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Demo Frontend
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features & Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This application demonstrates modern web development practices and professional-grade features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="text-center">
                <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>E-commerce Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete shopping experience with product catalog, cart management, and order processing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Role-based authentication with user, moderator, and admin roles. JWT token management.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive admin interface with statistics, user management, and product administration.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Security & Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Input validation, rate limiting, CORS protection, and secure authentication practices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern technologies and best practices
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">React</span>
              </div>
              <h3 className="font-semibold text-gray-900">Frontend</h3>
              <p className="text-sm text-gray-600">React 19 + TypeScript</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">Node</span>
              </div>
              <h3 className="font-semibold text-gray-900">Backend</h3>
              <p className="text-sm text-gray-600">Node.js + Express</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">DB</span>
              </div>
              <h3 className="font-semibold text-gray-900">Database</h3>
              <p className="text-sm text-gray-600">MongoDB + Mongoose</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">API</span>
              </div>
              <h3 className="font-semibold text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-600">Swagger/OpenAPI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Info */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            About the Developer
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl mb-6">
              <strong>Abdulmumin Ibrahim (Vibe Coder)</strong>
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Full-stack developer with 1-2 years of experience specializing in modern web technologies. 
              This project showcases professional development skills for job interview purposes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://potfolio-lilac-one.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  View Portfolio
                </Button>
              </a>
              <a 
                href="https://github.com/abdul977" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  GitHub Profile
                </Button>
              </a>
            </div>
            <div className="mt-8 text-sm text-gray-400">
              <p>Phone: 090 257 94 407</p>
              <p>Email: Abdulmuminibrahim74@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
