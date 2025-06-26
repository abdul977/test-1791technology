import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">1791</span>
              </div>
              <span className="text-xl font-bold">Technology</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional RESTful API showcase project demonstrating modern web development practices 
              with React, TypeScript, and Node.js.
            </p>
            <div className="text-sm text-gray-400">
              <p>Developed by: <span className="text-white">Abdulmumin Ibrahim (Vibe Coder)</span></p>
              <p>Phone: <span className="text-white">090 257 94 407</span></p>
              <p>Email: <span className="text-white">Abdulmuminibrahim74@gmail.com</span></p>
            </div>
          </div>

          {/* API Documentation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">API Documentation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/api/v1" className="text-gray-400 hover:text-white transition-colors">
                  API Overview
                </Link>
              </li>
              <li>
                <Link to="/api/v1/products" className="text-gray-400 hover:text-white transition-colors">
                  Products API
                </Link>
              </li>
              <li>
                <Link to="/api/v1/users" className="text-gray-400 hover:text-white transition-colors">
                  Users API
                </Link>
              </li>
              <li>
                <Link to="/api/v1/orders" className="text-gray-400 hover:text-white transition-colors">
                  Orders API
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:3000/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Swagger UI
                </a>
              </li>
            </ul>
          </div>

          {/* Demo Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Demo</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products Demo
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Developer</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://potfolio-lilac-one.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/abdul977" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://test-1791technology.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Live Demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 1791 Technology. Built by Muahib Solutions. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This is a showcase project demonstrating professional web development skills.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
