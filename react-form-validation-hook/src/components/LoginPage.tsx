import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const success = await login(values.email, values.password);
      if (success) {
        addNotification('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/main');
        }, 1000);
      } else {
        addNotification('Invalid credentials. Please try again.');
      }
    } catch (error) {
      addNotification('Login failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>1791 Technology - React Form Validation</h1>
        <p>Professional Form Validation Demo with Authentication</p>
      </header>

      <main className="demo-content">
        <LoginForm onSubmit={handleLogin} />
      </main>

      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((notification, index) => (
            <div key={index} className="notification">
              {notification}
            </div>
          ))}
        </div>
      )}

      <footer className="app-footer">
        <p>
          Built with React, TypeScript, and custom form validation hooks.
          Use any email with a password of 6+ characters to login.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
