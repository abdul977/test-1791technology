/**
 * Type definitions for the form validation hook system
 * Provides comprehensive type safety for form validation functionality
 */

/**
 * Validation rule interface defining various validation constraints
 * Generic type T allows for type-safe custom validation functions
 */
export interface ValidationRule<T = any> {
  // Whether the field is required (cannot be empty)
  required?: boolean;
  // Minimum length for string values
  minLength?: number;
  // Maximum length for string values
  maxLength?: number;
  // Regular expression pattern for validation
  pattern?: RegExp;
  // Custom validation function that can be sync or async
  custom?: (value: T) => string | null | Promise<string | null>;
  // Error message to display when validation fails
  message?: string;
}

/**
 * Collection of validation rules mapped by field name
 * Each field can have its own validation rule configuration
 */
export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

/**
 * Form errors object mapping field names to error messages
 * Only contains fields that currently have validation errors
 */
export interface FormErrors {
  [fieldName: string]: string;
}

/**
 * Form values object containing all form field values
 * Flexible structure to accommodate any form field types
 */
export interface FormValues {
  [fieldName: string]: any;
}

/**
 * Complete form state interface containing all form-related data
 * Represents the current state of the form at any given time
 */
export interface FormState {
  // Current values of all form fields
  values: FormValues;
  // Current validation errors for form fields
  errors: FormErrors;
  // Tracks which fields have been interacted with (touched)
  touched: { [fieldName: string]: boolean };
  // Whether the form is currently being submitted
  isSubmitting: boolean;
  // Whether the form is currently valid (no errors)
  isValid: boolean;
}

/**
 * Configuration options for the useFormValidation hook
 * Allows customization of validation behavior and timing
 */
export interface UseFormValidationOptions {
  // Initial values for form fields
  initialValues?: FormValues;
  // Validation rules to apply to form fields
  validationRules?: ValidationRules;
  // Whether to validate fields on every change event
  validateOnChange?: boolean;
  // Whether to validate fields when they lose focus (blur)
  validateOnBlur?: boolean;
  // Whether to validate the entire form on submit
  validateOnSubmit?: boolean;
  // Debounce delay in milliseconds for validation (prevents excessive validation calls)
  debounceMs?: number;
}

/**
 * Return type of the useFormValidation hook
 * Provides all necessary state and functions for form management
 */
export interface UseFormValidationReturn {
  // Current form field values
  values: FormValues;
  // Current validation errors
  errors: FormErrors;
  // Fields that have been touched/interacted with
  touched: { [fieldName: string]: boolean };
  // Whether form is currently being submitted
  isSubmitting: boolean;
  // Whether form is currently valid
  isValid: boolean;

  // Event handlers for form interactions
  // Handle input change events (typing, selecting, etc.)
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  // Handle input blur events (when field loses focus)
  handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  // Handle form submission with custom submit logic
  handleSubmit: (onSubmit: (values: FormValues) => void | Promise<void>) => (event: React.FormEvent) => void;

  // Programmatic field manipulation functions
  // Set a specific field's value
  setFieldValue: (fieldName: string, value: any) => void;
  // Set a specific field's error message
  setFieldError: (fieldName: string, error: string) => void;
  // Mark a specific field as touched or untouched
  setFieldTouched: (fieldName: string, touched?: boolean) => void;

  // Validation functions
  // Validate a single field
  validateField: (fieldName: string) => Promise<void>;
  // Validate the entire form and return validity status
  validateForm: () => Promise<boolean>;

  // Form reset and cleanup functions
  // Reset form to initial or new values
  resetForm: (newValues?: FormValues) => void;
  // Clear all validation errors
  clearErrors: () => void;
}

