// React library for component creation
import React from 'react';
// Import form validation hook for advanced form state management
import { useFormValidation } from '../hooks';
// Import individual validator functions for custom validation rules
import { required, email, minLength } from '../validation';

/**
 * Interface defining the structure of async validation form data
 * Used for type safety and form validation with server-side checks
 */
interface AsyncValidationFormData {
  // Username (must be unique - checked against server)
  username: string;
  // Email address (must be unique - checked against server)
  email: string;
  // Password (local validation only)
  password: string;
}

/**
 * Props interface for AsyncValidationForm component
 * Includes async validation functions for server-side checks
 */
interface AsyncValidationFormProps {
  // Callback function called when form is successfully submitted
  onSubmit: (values: AsyncValidationFormData) => void;
  // Async function to check if username is available on server
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  // Async function to check if email is available on server
  checkEmailAvailability: (email: string) => Promise<boolean>;
  // Optional loading state to disable form during external operations
  isLoading?: boolean;
}

/**
 * AsyncValidationForm Component
 * Demonstrates advanced async validation with server-side uniqueness checks
 * Shows how to integrate real-time validation with external APIs
 */
const AsyncValidationForm: React.FC<AsyncValidationFormProps> = ({
  onSubmit,
  checkUsernameAvailability,
  checkEmailAvailability,
  isLoading = false,
}) => {
  // Initialize form validation hook with async validation configuration
  const {
    // Current form field values
    values,
    // Current validation errors for each field
    errors,
    // Track which fields have been interacted with
    touched,
    // Whether form is currently being submitted
    isSubmitting,
    // Whether form is currently valid (no errors)
    isValid,
    // Handler for input change events
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationRules: {
      username: {
        ...required('Username is required'),
        ...minLength(3, 'Username must be at least 3 characters'),
        pattern: /^[a-zA-Z0-9_]+$/,
        custom: async (value: string) => {
          if (!value || value.length < 3) return null;
          
          try {
            const isAvailable = await checkUsernameAvailability(value);
            return isAvailable ? null : 'Username is already taken';
          } catch (error) {
            return 'Unable to check username availability';
          }
        },
        message: 'Username must contain only letters, numbers, and underscores',
      },
      email: {
        ...required('Email is required'),
        ...email('Please enter a valid email address'),
        custom: async (value: string) => {
          if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
          
          try {
            const isAvailable = await checkEmailAvailability(value);
            return isAvailable ? null : 'Email is already registered';
          } catch (error) {
            return 'Unable to check email availability';
          }
        },
      },
      password: {
        ...required('Password is required'),
        ...minLength(8, 'Password must be at least 8 characters'),
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
        message: 'Password must contain at least one letter and one number',
      },
    },
    validateOnBlur: true,
    validateOnSubmit: true,
    validateOnChange: false,
    debounceMs: 800, // Longer debounce for async validation
  });

  const submitHandler = handleSubmit(async (formValues) => {
    await onSubmit(formValues as AsyncValidationFormData);
  });

  return (
    <div className="async-validation-form">
      <h2>Sign Up with Async Validation</h2>
      <p className="form-description">
        This form demonstrates async validation for username and email availability.
      </p>
      
      <form onSubmit={submitHandler} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            id="username"
            name="username"
            type="text"
            value={values.username || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.username && touched.username ? 'error' : ''}`}
            placeholder="Choose a unique username"
            disabled={isSubmitting || isLoading}
          />
          {errors.username && touched.username && (
            <div className="error-message">{errors.username}</div>
          )}
          <div className="field-hint">
            Username must be at least 3 characters and contain only letters, numbers, and underscores
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
            placeholder="Enter your email address"
            disabled={isSubmitting || isLoading}
          />
          {errors.email && touched.email && (
            <div className="error-message">{errors.email}</div>
          )}
          <div className="field-hint">
            We'll check if this email is already registered
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.password && touched.password ? 'error' : ''}`}
            placeholder="Create a secure password"
            disabled={isSubmitting || isLoading}
          />
          {errors.password && touched.password && (
            <div className="error-message">{errors.password}</div>
          )}
          <div className="field-hint">
            Password must be at least 8 characters with at least one letter and one number
          </div>
        </div>

        <div className="form-validation-status">
          {isValid && Object.keys(touched).length > 0 && (
            <div className="success-message">✓ All fields are valid</div>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${!isValid ? 'disabled' : ''}`}
          disabled={isSubmitting || isLoading || !isValid}
        >
          {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default AsyncValidationForm;
