import { ValidationRule, ValidationRules } from '../hooks/types';

/**
 * Utility functions for working with validation rules
 */

/**
 * Combines multiple validation rules into a single rule
 * The first error encountered will be returned
 */
export const combineRules = (...rules: ValidationRule[]): ValidationRule => {
  return {
    custom: async (value: any) => {
      for (const rule of rules) {
        // Check required
        if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          return rule.message || 'This field is required';
        }

        // Skip other validations if field is empty and not required
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          continue;
        }

        // Check string validations
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

        // Check custom validation
        if (rule.custom) {
          const customResult = await rule.custom(value);
          if (customResult) {
            return customResult;
          }
        }
      }
      return null;
    },
  };
};

/**
 * Creates a conditional validation rule that only applies when a condition is met
 */
export const when = (
  condition: (values: any) => boolean,
  rule: ValidationRule,
  getValues: () => any
): ValidationRule => ({
  custom: async (value: any) => {
    const values = getValues();
    if (!condition(values)) {
      return null; // Skip validation if condition is not met
    }

    // Apply the rule
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || 'This field is required';
    }

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

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

    if (rule.custom) {
      return await rule.custom(value);
    }

    return null;
  },
});

/**
 * Creates validation rules for common form patterns
 */
export const createFormRules = {
  /**
   * Login form validation rules
   */
  login: (): ValidationRules => ({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
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
