// React library for component creation
import React from 'react';
// Import form validation hook for form state management
import { useFormValidation } from '../hooks';
// Import predefined validation rules for contact forms
import { createFormRules } from '../validation';

/**
 * Interface defining the structure of contact form data
 * Used for type safety and form validation
 */
interface ContactFormData {
  // Contact person's name
  name: string;
  // Contact person's email address
  email: string;
  // Subject line for the message
  subject: string;
  // Main message content
  message: string;
}

/**
 * Props interface for ContactForm component
 * Defines expected properties and their types
 */
interface ContactFormProps {
  // Callback function called when form is successfully submitted
  onSubmit: (values: ContactFormData) => void;
  // Optional loading state to disable form during external operations
  isLoading?: boolean;
}

/**
 * ContactForm Component
 * A contact form with name, email, subject, and message fields
 * Demonstrates form validation with textarea and character counting
 */
const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isLoading = false }) => {
  // Initialize form validation hook with contact form configuration
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
    // Handler for input blur events (when field loses focus)
    handleBlur,
    // Handler for form submission with validation
    handleSubmit,
    // Function to reset form to initial state
    resetForm,
  } = useFormValidation({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationRules: createFormRules.contact(),
    validateOnBlur: true,
    validateOnSubmit: true,
    validateOnChange: true,
    debounceMs: 500,
  });

  const submitHandler = handleSubmit(async (formValues) => {
    await onSubmit(formValues as ContactFormData);
    // Reset form after successful submission
    resetForm();
  });

  const handleReset = () => {
    resetForm();
  };

  return (
    <div className="contact-form">
      <h2>Contact Us</h2>
      <form onSubmit={submitHandler} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.name && touched.name ? 'error' : ''}`}
            placeholder="Enter your full name"
            disabled={isSubmitting || isLoading}
          />
          {errors.name && touched.name && (
            <div className="error-message">{errors.name}</div>
          )}
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
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.subject && touched.subject ? 'error' : ''}`}
            placeholder="Enter the subject of your message"
            disabled={isSubmitting || isLoading}
          />
          {errors.subject && touched.subject && (
            <div className="error-message">{errors.subject}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={values.message || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-control ${errors.message && touched.message ? 'error' : ''}`}
            placeholder="Enter your message"
            disabled={isSubmitting || isLoading}
          />
          {errors.message && touched.message && (
            <div className="error-message">{errors.message}</div>
          )}
          <div className="character-count">
            {(values.message || '').length}/1000 characters
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting || isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${!isValid ? 'disabled' : ''}`}
            disabled={isSubmitting || isLoading || !isValid}
          >
            {isSubmitting || isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
