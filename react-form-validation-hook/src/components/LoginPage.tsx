import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import ContactForm from './ContactForm';
import AsyncValidationForm from './AsyncValidationForm';
import { useAuth } from '../contexts/AuthContext';

type DemoType = 'login' | 'registration' | 'contact' | 'async';

const LoginPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoType>('login');
  const [notifications, setNotifications] = useState<string[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  // Generic authentication handler for all forms
  const authenticateUser = async (email: string, formType: string) => {
    try {
      // For forms without email, use a default email
      const userEmail = email || 'demo@example.com';
      const success = await login(userEmail, 'password123');
      if (success) {
        addNotification(`${formType} successful! Redirecting...`);
        setTimeout(() => {
          navigate('/main');
        }, 1000);
      } else {
        addNotification('Authentication failed. Please try again.');
      }
    } catch (error) {
      addNotification('Authentication failed. Please try again.');
      console.error('Authentication error:', error);
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    await authenticateUser(values.email, 'Login');
  };

  const handleRegistration = async (values: any) => {
    console.log('Registration submitted:', values);
    await authenticateUser(values.email, 'Registration');
  };

  const handleContact = async (values: any) => {
    console.log('Contact form submitted:', values);
    await authenticateUser(values.email, 'Contact submission');
  };

  const handleAsyncValidation = async (values: any) => {
    console.log('Async validation form submitted:', values);
    await authenticateUser(values.email, 'Account creation');
  };

  // Mock async validation functions
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const takenUsernames = ['admin', 'user', 'test', 'demo'];
    return !takenUsernames.includes(username.toLowerCase());
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const takenEmails = ['admin@example.com', 'user@example.com', 'test@example.com'];
    return !takenEmails.includes(email.toLowerCase());
  };

  const renderActiveDemo = () => {
    switch (activeDemo) {
      case 'login':
        return <LoginForm onSubmit={handleLogin} />;
      case 'registration':
        return <RegistrationForm onSubmit={handleRegistration} />;
      case 'contact':
        return <ContactForm onSubmit={handleContact} />;
      case 'async':
        return (
          <AsyncValidationForm
            onSubmit={handleAsyncValidation}
            checkUsernameAvailability={checkUsernameAvailability}
            checkEmailAvailability={checkEmailAvailability}
          />
        );
      default:
        return <LoginForm onSubmit={handleLogin} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>1791 Technology - React Form Validation</h1>
        <p>Professional Form Validation Demo with Authentication</p>
        <p className="auth-note">Submit any form to authenticate and access the main page</p>
      </header>

      <nav className="demo-nav">
        <button
          className={`nav-button ${activeDemo === 'login' ? 'active' : ''}`}
          onClick={() => setActiveDemo('login')}
        >
          Login Form
        </button>
        <button
          className={`nav-button ${activeDemo === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveDemo('registration')}
        >
          Registration Form
        </button>
        <button
          className={`nav-button ${activeDemo === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveDemo('contact')}
        >
          Contact Form
        </button>
        <button
          className={`nav-button ${activeDemo === 'async' ? 'active' : ''}`}
          onClick={() => setActiveDemo('async')}
        >
          Async Validation
        </button>
      </nav>

      <main className="demo-content">
        {renderActiveDemo()}
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
          Test any form above - successful submission will authenticate and redirect to the main page.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
