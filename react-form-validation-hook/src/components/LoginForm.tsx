import React from 'react';
import { useFormValidation } from '../hooks';
import { createFormRules } from '../validation';

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: createFormRules.login(),
    validateOnBlur: true,
    validateOnSubmit: true,
  });

  const submitHandler = handleSubmit(async (formValues) => {
    await onSubmit(formValues as { email: string; password: string });
  });

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={submitHandler} noValidate>
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
