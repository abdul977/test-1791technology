// Main application component with routing and authentication
import React from 'react';
// Import React Router components for client-side routing
import { Routes, Route, Navigate } from 'react-router-dom';
// Import page components for different routes
import {
  LoginPage,
  MainPage,
} from './components';
// Import authentication context and hook
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Import application-wide CSS styles
import './App.css';

/**
 * Protected Route Component
 * Wraps routes that require authentication and redirects unauthenticated users to login
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state from context
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Render children if authenticated, otherwise redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * App Routes Component
 * Defines all application routes and their corresponding components
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public login route - accessible without authentication */}
      <Route path="/login" element={<LoginPage />} />
      {/* Protected main application route - requires authentication */}
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      {/* Default route - redirect to login page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

/**
 * Main App Component
 * Root component that provides authentication context and renders routes
 */
function App() {
  return (
    // AuthProvider wraps the entire app to provide authentication state
    <AuthProvider>
      {/* AppRoutes handles all routing logic */}
      <AppRoutes />
    </AuthProvider>
  );
}

// Export App component as default export
export default App;
