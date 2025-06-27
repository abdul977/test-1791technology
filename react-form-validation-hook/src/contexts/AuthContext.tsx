// React imports for context creation and state management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * User interface defining the structure of authenticated user data
 */
interface User {
  // User's email address (used for login)
  email: string;
  // User's display name
  name: string;
}

/**
 * Authentication context type defining all available auth-related functions and state
 */
interface AuthContextType {
  // Currently authenticated user (null if not logged in)
  user: User | null;
  // Boolean indicating if user is currently authenticated
  isAuthenticated: boolean;
  // Function to authenticate user with email and password
  login: (email: string, password: string) => Promise<boolean>;
  // Function to log out current user
  logout: () => void;
  // Boolean indicating if authentication state is being determined
  isLoading: boolean;
}

// Create React context for authentication state management
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access authentication context
 * Provides type-safe access to auth state and functions
 * @returns AuthContextType object with user state and auth functions
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Ensure hook is used within provider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Props interface for AuthProvider component
 */
interface AuthProviderProps {
  // Child components that will have access to auth context
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Provides authentication state and functions to child components
 * Handles user session persistence using localStorage
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State for currently authenticated user
  const [user, setUser] = useState<User | null>(null);
  // State for loading indicator during auth operations
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on component mount
  useEffect(() => {
    // Attempt to restore user session from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        // Parse and restore user data
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Handle corrupted localStorage data
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    // Authentication check complete
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in a real app, this would be an API call
    // For demo purposes, accept any email with password length >= 6
    if (email && password && password.length >= 6) {
      const newUser: User = {
        email,
        name: email.split('@')[0], // Use email prefix as name
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
