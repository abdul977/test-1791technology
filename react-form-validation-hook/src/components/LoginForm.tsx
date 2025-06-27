// React library for component creation
import React from 'react';
// Import form validation hook for form state management
import { useFormValidation } from '../hooks';
// Import predefined validation rules for login forms
import { createFormRules } from '../validation';

/**
 * Props interface for LoginForm component
 * Defines the expected properties and their types
 */
interface LoginFormProps {
  // Callback function called when form is successfully submitted
  onSubmit: (values: { email: string; password: string }) => void;
  // Optional loading state to disable form during external operations
  isLoading?: boolean;
}

/**
 * LoginForm Component
 * A reusable login form with email and password validation
 * Demonstrates basic usage of the form validation hook
 */
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  // Initialize form validation hook with configuration
  const {
    // Current form field values
    values,
    // Current validation errors for each field
    errors,
    // Track which fields have been interacted with
    touched,
    // Whether form is currently being submitted
    isSubmitting,
    // Handler for input change events
    handleChange,
    // Handler for input blur events (when field loses focus)
    handleBlur,
    // Handler for form submission with validation
    handleSubmit,
  } = useFormValidation({
    // Set initial empty values for form fields
    initialValues: {
      email: '',
      password: '',
    },
    // Use predefined login validation rules (email format, password requirements)
    validationRules: createFormRules.login(),
    // Validate fields when they lose focus for immediate feedback
    validateOnBlur: true,
    // Validate entire form before submission
    validateOnSubmit: true,
  });

  // Create submit handler that wraps the provided onSubmit callback
  const submitHandler = handleSubmit(async (formValues) => {
    // Type assertion for better type safety
    await onSubmit(formValues as { email: string; password: string });
  });

  // Render the login form UI
  return (
    <div className="login-form">
      {/* Form title */}
      <h2>Login</h2>
      {/* Form element with validation disabled (we handle it ourselves) */}
      <form onSubmit={submitHandler} noValidate>
        {/* Email input field group */}
        <div className="form-group">
          {/* Accessible label for email input */}
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email" // Must match the field name in form values
            type="email" // HTML5 email input type for better UX
            value={values.email || ''} // Controlled input with fallback to empty string
            onChange={handleChange} // Handle input changes
            onBlur={handleBlur} // Handle field blur for validation
            // Dynamic CSS class based on validation state
            className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
            placeholder="Enter your email"
            // Disable input during submission or external loading
            disabled={isSubmitting || isLoading}
          />
          {/* Conditional error message display */}
          {errors.email && touched.email && (
            <div className="error-message">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.password && touched.password ? 'error' : ''}`}
            placeholder="Enter your password"
            disabled={isSubmitting || isLoading}
          />
          {errors.password && touched.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
