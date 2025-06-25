import { useState, useCallback, useRef, useEffect } from 'react';
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
  const {
    initialValues = {},
    validationRules = {},
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
    debounceMs = 300,
  } = options;

  // Form state
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for debouncing and cleanup
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const validationPromises = useRef<{ [key: string]: Promise<string | null> }>({});

  /**
   * Validates a single field based on its validation rules
   */
  const validateSingleField = useCallback(async (fieldName: string, value: any): Promise<string | null> => {
    const rule: ValidationRule = validationRules[fieldName];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String-specific validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${fieldName} must be no more than ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${fieldName} format is invalid`;
      }
    }

    // Custom validation
    if (rule.custom) {
      try {
        const customResult = await rule.custom(value);
        if (customResult) {
          return customResult;
        }
      } catch (error) {
        return `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    return null;
  }, [validationRules]);

  /**
   * Validates a specific field and updates errors state
   */
  const validateField = useCallback(async (fieldName: string): Promise<void> => {
    const value = values[fieldName];
    
    // Cancel any existing validation promise for this field
    if (fieldName in validationPromises.current) {
      // Note: We can't actually cancel the promise, but we can ignore its result
      delete validationPromises.current[fieldName];
    }

    // Create new validation promise
    const validationPromise = validateSingleField(fieldName, value);
    validationPromises.current[fieldName] = validationPromise;

    try {
      const error = await validationPromise;
      
      // Only update if this is still the latest validation for this field
      if (validationPromises.current[fieldName] === validationPromise) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || '',
        }));
        delete validationPromises.current[fieldName];
      }
    } catch (err) {
      // Handle validation errors
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
   * Validates all fields in the form
   */
  const validateForm = useCallback(async (): Promise<boolean> => {
    const fieldNames = Object.keys(validationRules);
    const validationPromises = fieldNames.map(async (fieldName) => {
      const error = await validateSingleField(fieldName, values[fieldName]);
      return { fieldName, error };
    });

    try {
      const results = await Promise.all(validationPromises);
      const newErrors: FormErrors = {};
      
      results.forEach(({ fieldName, error }) => {
        newErrors[fieldName] = error || '';
      });

      setErrors(newErrors);
      
      // Return true if no errors
      return !Object.values(newErrors).some(error => error !== '');
    } catch (error) {
      console.error('Form validation failed:', error);
      return false;
    }
  }, [validationRules, values, validateSingleField]);

  /**
   * Debounced field validation
   */
  const debouncedValidateField = useCallback((fieldName: string) => {
    // Clear existing timeout
    if (debounceTimeouts.current[fieldName]) {
      clearTimeout(debounceTimeouts.current[fieldName]);
    }

    // Set new timeout
    debounceTimeouts.current[fieldName] = setTimeout(() => {
      validateField(fieldName);
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
