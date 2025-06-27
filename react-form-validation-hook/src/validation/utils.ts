// Import types for validation rules
import { ValidationRule, ValidationRules } from '../hooks/types';

/**
 * Utility functions for working with validation rules
 * Provides helper functions for combining, creating, and managing validation logic
 */

/**
 * Combines multiple validation rules into a single rule
 * Executes rules in order and returns the first error encountered
 * Useful for creating complex validation scenarios from simple rules
 * @param rules - Array of validation rules to combine
 * @returns Single ValidationRule that executes all provided rules
 */
export const combineRules = (...rules: ValidationRule[]): ValidationRule => {
  return {
    // Create a custom validation function that runs all rules
    custom: async (value: any) => {
      // Iterate through each rule in order
      for (const rule of rules) {
        // Check required validation first (highest priority)
        if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          return rule.message || 'This field is required';
        }

        // Skip other validations if field is empty and not required
        // This allows optional fields to pass validation when empty
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          continue;
        }

        // Check string-specific validations
        if (typeof value === 'string') {
          // Minimum length validation
          if (rule.minLength && value.length < rule.minLength) {
            return rule.message || `Must be at least ${rule.minLength} characters`;
          }
          // Maximum length validation
          if (rule.maxLength && value.length > rule.maxLength) {
            return rule.message || `Must be no more than ${rule.maxLength} characters`;
          }
          // Pattern/regex validation
          if (rule.pattern && !rule.pattern.test(value)) {
            return rule.message || 'Invalid format';
          }
        }

        // Check custom validation function
        if (rule.custom) {
          const customResult = await rule.custom(value);
          // Return first error encountered
          if (customResult) {
            return customResult;
          }
        }
      }
      // All rules passed
      return null;
    },
  };
};

/**
 * Creates a conditional validation rule that only applies when a condition is met
 * Useful for dependent field validation (e.g., require field B only if field A has a specific value)
 * @param condition - Function that determines if validation should be applied
 * @param rule - Validation rule to apply when condition is true
 * @param getValues - Function to get current form values for condition evaluation
 * @returns ValidationRule that conditionally applies validation
 */
export const when = (
  condition: (values: any) => boolean,
  rule: ValidationRule,
  getValues: () => any
): ValidationRule => ({
  // Create custom validation function that checks condition first
  custom: async (value: any) => {
    // Get current form values to evaluate condition
    const values = getValues();
    // Skip validation if condition is not met
    if (!condition(values)) {
      return null; // Field is considered valid when condition is false
    }

    // Apply the validation rule since condition is met
    // Check required validation first
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Apply string-specific validations
    if (typeof value === 'string') {
      // Minimum length validation
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Must be at least ${rule.minLength} characters`;
      }
      // Maximum length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Must be no more than ${rule.maxLength} characters`;
      }
      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format';
      }
    }

    // Apply custom validation if present
    if (rule.custom) {
      return await rule.custom(value);
    }

    // All validations passed
    return null;
  },
});

/**
 * Creates validation rules for common form patterns
 * Provides pre-configured validation rule sets for typical form scenarios
 * Reduces boilerplate and ensures consistency across forms
 */
export const createFormRules = {
  /**
   * Login form validation rules
   * Standard email and password validation for authentication forms
   * @returns ValidationRules object with email and password validation
   */
  login: (): ValidationRules => ({
    // Email field validation
    email: {
      // Email is required for login
      required: true,
      // Basic email format validation
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      // User-friendly error message
      message: 'Please enter a valid email address',
    },
    // Password field validation
    password: {
      required: true,
      minLength: 6,
      message: 'Password must be at least 6 characters',
    },
  }),

  /**
   * Registration form validation rules
   */
  registration: (): ValidationRules => ({
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'First name must contain only letters, spaces, hyphens, and apostrophes',
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'Last name must contain only letters, spaces, hyphens, and apostrophes',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
      message: 'Password must be at least 8 characters with at least one letter and one number',
    },
    confirmPassword: {
      required: true,
      message: 'Please confirm your password',
    },
  }),

  /**
   * Contact form validation rules
   */
  contact: (): ValidationRules => ({
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Name must be between 2 and 100 characters',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Subject must be between 5 and 200 characters',
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Message must be between 10 and 1000 characters',
    },
  }),

  /**
   * Profile form validation rules
   */
  profile: (): ValidationRules => ({
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'First name must contain only letters, spaces, hyphens, and apostrophes',
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-']+$/,
      message: 'Last name must contain only letters, spaces, hyphens, and apostrophes',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    phone: {
      pattern: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
      message: 'Please enter a valid phone number',
    },
    website: {
      pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      message: 'Please enter a valid URL',
    },
  }),
};

/**
 * Debounce utility for validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Validates a single value against a rule
 */
export const validateValue = async (value: any, rule: ValidationRule): Promise<string | null> => {
  // Required validation
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return rule.message || 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return null;
  }

  // String-specific validations
  if (typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Must be at least ${rule.minLength} characters`;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Must be no more than ${rule.maxLength} characters`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format';
    }
  }

  // Custom validation
  if (rule.custom) {
    try {
      return await rule.custom(value);
    } catch (error) {
      return `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  return null;
};
