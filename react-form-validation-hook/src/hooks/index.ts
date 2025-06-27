/**
 * Hooks module public API
 * Exports all form validation hooks and related TypeScript types
 * This is the main entry point for consuming the form validation functionality
 */

// Export the main form validation hook
export { default as useFormValidation } from './useFormValidation';

// Export all TypeScript type definitions for type safety
export type {
  // Individual validation rule configuration
  ValidationRule,
  // Collection of validation rules for multiple fields
  ValidationRules,
  // Form error messages mapped by field name
  FormErrors,
  // Form field values mapped by field name
  FormValues,
  // Complete form state interface
  FormState,
  // Configuration options for the useFormValidation hook
  UseFormValidationOptions,
  // Return type of the useFormValidation hook
  UseFormValidationReturn,
} from './types';
