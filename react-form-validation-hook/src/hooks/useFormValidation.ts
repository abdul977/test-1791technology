// React hooks for state management and lifecycle
import { useState, useCallback, useRef, useEffect } from 'react';
// Type definitions for form validation system
import {
  UseFormValidationOptions,
  UseFormValidationReturn,
  FormValues,
  FormErrors,
  ValidationRule,
} from './types';

/**
 * Custom React hook for form validation with comprehensive features
 * 
 * @param options Configuration options for the form validation
 * @returns Object containing form state and handlers
 */
const useFormValidation = (options: UseFormValidationOptions = {}): UseFormValidationReturn => {
  // Destructure options with default values for flexible configuration
  const {
    // Initial form field values (empty object if not provided)
    initialValues = {},
    // Validation rules for each field (empty object if not provided)
    validationRules = {},
    // Whether to validate on every input change (disabled by default for performance)
    validateOnChange = false,
    // Whether to validate when field loses focus (enabled by default for good UX)
    validateOnBlur = true,
    // Whether to validate entire form on submission (enabled by default for data integrity)
    validateOnSubmit = true,
    // Debounce delay for validation to prevent excessive API calls
    debounceMs = 300,
  } = options;

  // Core form state using React hooks
  // Current values of all form fields
  const [values, setValues] = useState<FormValues>(initialValues);
  // Current validation errors for each field
  const [errors, setErrors] = useState<FormErrors>({});
  // Track which fields have been interacted with (for conditional error display)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  // Track form submission state to prevent double submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for managing asynchronous operations and cleanup
  // Store timeout IDs for debounced validation to allow cancellation
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  // Store validation promises to handle race conditions in async validation
  const validationPromises = useRef<{ [key: string]: Promise<string | null> }>({});

  /**
   * Validates a single field based on its validation rules
   * Supports both synchronous and asynchronous validation
   * Returns error message string or null if valid
   */
  const validateSingleField = useCallback(async (fieldName: string, value: any): Promise<string | null> => {
    // Get validation rule for this field
    const rule: ValidationRule = validationRules[fieldName];
    // If no rule exists, field is considered valid
    if (!rule) return null;

    // Required field validation - check for empty values
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      // Return custom message or default required message
      return rule.message || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    // This allows optional fields to be empty without triggering other validation rules
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String-specific validations (length and pattern)
    if (typeof value === 'string') {
      // Minimum length validation
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
      }

      // Maximum length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${fieldName} must be no more than ${rule.maxLength} characters`;
      }

      // Regular expression pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${fieldName} format is invalid`;
      }
    }

    // Custom validation function - can be async for server-side validation
    if (rule.custom) {
      try {
        // Execute custom validation function
        const customResult = await rule.custom(value);
        // Return error message if validation failed
        if (customResult) {
          return customResult;
        }
      } catch (error) {
        // Handle errors in custom validation functions
        return `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    // All validations passed
    return null;
  }, [validationRules]);

  /**
   * Validates a specific field and updates errors state
   * Handles race conditions for async validation to prevent stale results
   */
  const validateField = useCallback(async (fieldName: string): Promise<void> => {
    // Get current value for the field
    const value = values[fieldName];

    // Cancel any existing validation promise for this field to prevent race conditions
    // This ensures only the latest validation result is used
    if (fieldName in validationPromises.current) {
      // Note: We can't actually cancel the promise, but we can ignore its result
      delete validationPromises.current[fieldName];
    }

    // Create new validation promise and store reference
    const validationPromise = validateSingleField(fieldName, value);
    validationPromises.current[fieldName] = validationPromise;

    try {
      // Wait for validation to complete
      const error = await validationPromise;

      // Only update state if this is still the latest validation for this field
      // This prevents race conditions where older validations complete after newer ones
      if (validationPromises.current[fieldName] === validationPromise) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || '', // Store error message or empty string if valid
        }));
        // Clean up the promise reference
        delete validationPromises.current[fieldName];
      }
    } catch (err) {
      // Handle validation errors (network issues, custom validation function errors, etc.)
      if (validationPromises.current[fieldName] === validationPromise) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'Validation failed',
        }));
        delete validationPromises.current[fieldName];
      }
    }
  }, [values, validateSingleField]);

  /**
   * Validates all fields in the form simultaneously
   * Used for form submission validation and overall form state checking
   * @returns Promise<boolean> - true if all fields are valid, false otherwise
   */
  const validateForm = useCallback(async (): Promise<boolean> => {
    // Get all field names that have validation rules
    const fieldNames = Object.keys(validationRules);
    // Create validation promises for all fields simultaneously
    const validationPromises = fieldNames.map(async (fieldName) => {
      const error = await validateSingleField(fieldName, values[fieldName]);
      return { fieldName, error };
    });

    try {
      // Wait for all validations to complete
      const results = await Promise.all(validationPromises);
      const newErrors: FormErrors = {};

      // Process validation results and build errors object
      results.forEach(({ fieldName, error }) => {
        newErrors[fieldName] = error || '';
      });

      // Update errors state with all validation results
      setErrors(newErrors);

      // Return true if no errors exist (all fields are valid)
      return !Object.values(newErrors).some(error => error !== '');
    } catch (error) {
      // Handle unexpected errors during validation
      console.error('Form validation failed:', error);
      return false;
    }
  }, [validationRules, values, validateSingleField]);

  /**
   * Debounced field validation to prevent excessive validation calls
   * Delays validation until user stops typing for the specified debounce period
   * Improves performance and user experience
   */
  const debouncedValidateField = useCallback((fieldName: string) => {
    // Clear any existing timeout for this field to reset the debounce timer
    if (debounceTimeouts.current[fieldName]) {
      clearTimeout(debounceTimeouts.current[fieldName]);
    }

    // Set new timeout to validate field after debounce period
    debounceTimeouts.current[fieldName] = setTimeout(() => {
      // Execute validation after debounce delay
      validateField(fieldName);
      // Clean up timeout reference
      delete debounceTimeouts.current[fieldName];
    }, debounceMs);
  }, [validateField, debounceMs]);

  /**
   * Handles input change events
   */
  const handleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    
    // Handle different input types
    let processedValue: any = value;
    if (type === 'checkbox') {
      processedValue = (event.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }

    setValues(prev => ({
      ...prev,
      [name]: processedValue,
    }));

    // Validate on change if enabled
    if (validateOnChange) {
      debouncedValidateField(name);
    }
  }, [validateOnChange, debouncedValidateField]);

  /**
   * Handles input blur events
   */
  const handleBlur = useCallback((
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      validateField(name);
    }
  }, [validateOnBlur, validateField]);

  /**
   * Creates a submit handler that validates the form before calling the provided onSubmit function
   */
  const handleSubmit = useCallback((
    onSubmit: (values: FormValues) => void | Promise<void>
  ) => {
    return async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        // Mark all fields as touched
        const allFieldNames = Object.keys(validationRules);
        const touchedState = allFieldNames.reduce((acc, fieldName) => {
          acc[fieldName] = true;
          return acc;
        }, {} as { [key: string]: boolean });
        setTouched(touchedState);

        // Validate form if enabled
        let isValid = true;
        if (validateOnSubmit) {
          isValid = await validateForm();
        }

        // Call onSubmit if form is valid
        if (isValid) {
          await onSubmit(values);
        }
      } catch (error) {
        console.error('Form submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validationRules, validateOnSubmit, validateForm]);

  /**
   * Sets a specific field value
   */
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  /**
   * Sets a specific field error
   */
  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  /**
   * Sets a specific field touched state
   */
  const setFieldTouched = useCallback((fieldName: string, isTouched: boolean = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched,
    }));
  }, []);

  /**
   * Resets the form to initial values or provided values
   */
  const resetForm = useCallback((newValues?: FormValues) => {
    const resetValues = newValues || initialValues;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    
    // Clear any pending debounced validations
    Object.values(debounceTimeouts.current).forEach(timeout => clearTimeout(timeout));
    debounceTimeouts.current = {};
  }, [initialValues]);

  /**
   * Clears all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Calculate if form is valid (no errors and has been touched or submitted)
  const isValid = Object.values(errors).every(error => !error);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    clearErrors,
  };
};

export default useFormValidation;
