import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Book, 
  Database, 
  ShoppingCart, 
  Users, 
  FileText, 
  Menu, 
  X, 
  ExternalLink,
  Code,
  Server,
  Globe
} from 'lucide-react';

interface ApiLayoutProps {
  children: React.ReactNode;
}

const ApiLayout: React.FC<ApiLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Overview',
      path: '/api/v1',
      icon: Book,
      description: 'API Overview & Getting Started'
    },
    {
      title: 'Products',
      path: '/api/v1/products',
      icon: ShoppingCart,
      description: 'Product management endpoints'
    },
    {
      title: 'Orders',
      path: '/api/v1/orders',
      icon: FileText,
      description: 'Order processing endpoints'
    },
    {
      title: 'Users',
      path: '/api/v1/users',
      icon: Users,
      description: 'User management endpoints'
    }
  ];

  const externalLinks = [
    {
      title: 'Swagger UI',
      url: 'http://localhost:3000/api-docs',
      icon: Code,
      description: 'Interactive API documentation'
    },
    {
      title: 'Live API',
      url: 'http://localhost:3000/api/v1',
      icon: Server,
      description: 'Access the live API'
    },
    {
      title: 'GitHub Repository',
      url: 'https://github.com/abdul977',
      icon: Globe,
      description: 'View source code'
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1791</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Technology</span>
              </Link>
              
              <div className="hidden sm:flex items-center space-x-2 text-gray-500">
                <span>/</span>
                <Database className="w-4 h-4" />
                <span className="font-medium">API Documentation</span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center space-x-4">
              <a
                href="http://localhost:3000/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>Swagger UI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a
                href="https://github.com/abdul977"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  API Endpoints
                </h3>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  External Resources
                </h3>
                {externalLinks.map((link) => {
                  const Icon = link.icon;
                  
                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{link.title}</div>
                        <div className="text-xs text-gray-500">{link.description}</div>
                      </div>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApiLayout;
