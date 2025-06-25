import React from 'react';
import { useFormValidation } from '../hooks';
import { createFormRules } from '../validation';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  onSubmit: (values: RegistrationFormData) => void;
  isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
  } = useFormValidation({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      ...createFormRules.registration(),
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (value !== values.password) {
            return 'Passwords do not match';
          }
          return null;
        },
        message: 'Please confirm your password',
      },
    },
    validateOnBlur: true,
    validateOnSubmit: true,
    validateOnChange: false,
  });

  const submitHandler = handleSubmit(async (formValues) => {
    // Additional validation for password confirmation
    if (formValues.password !== formValues.confirmPassword) {
      setFieldError('confirmPassword', 'Passwords do not match');
      return;
    }

    await onSubmit(formValues as RegistrationFormData);
  });

  return (
    <div className="registration-form">
      <h2>Create Account</h2>
      <form onSubmit={submitHandler} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={values.firstName || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${errors.firstName && touched.firstName ? 'error' : ''}`}
              placeholder="Enter your first name"
              disabled={isSubmitting || isLoading}
            />
            {errors.firstName && touched.firstName && (
              <div className="error-message">{errors.firstName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={values.lastName || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${errors.lastName && touched.lastName ? 'error' : ''}`}
              placeholder="Enter your last name"
              disabled={isSubmitting || isLoading}
            />
            {errors.lastName && touched.lastName && (
              <div className="error-message">{errors.lastName}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
            placeholder="Enter your email"
            disabled={isSubmitting || isLoading}
          />
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
          <div className="password-requirements">
            <small>Password must be at least 8 characters with at least one letter and one number</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm your password"
            disabled={isSubmitting || isLoading}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
