// Import ValidationRule type for type safety
import { ValidationRule } from '../hooks/types';

/**
 * Predefined validation rules for common use cases
 * These rules can be used directly or as templates for custom validation
 * Each rule combines multiple validation constraints for comprehensive validation
 */

/**
 * Email validation rule
 * Validates email format using RFC-compliant regex pattern
 * Requires field to be filled and match email pattern
 */
export const emailRule: ValidationRule = {
  // Email field is required
  required: true,
  // Basic email pattern: localpart@domain.tld
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // User-friendly error message
  message: 'Please enter a valid email address',
};

/**
 * Basic password validation rule
 * Minimum 8 characters with at least one letter and one number
 * Suitable for most applications with moderate security requirements
 */
export const passwordRule: ValidationRule = {
  // Password field is required
  required: true,
  // Minimum length for security
  minLength: 8,
  // Pattern: at least one letter and one number, allows special characters
  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
  // Clear requirements in error message
  message: 'Password must be at least 8 characters with at least one letter and one number',
};

/**
 * Strong password validation rule
 * Requires uppercase, lowercase, number, and special character
 * Suitable for high-security applications
 */
export const strongPasswordRule: ValidationRule = {
  // Strong password field is required
  required: true,
  // Minimum length for security
  minLength: 8,
  // Pattern: lowercase, uppercase, digit, and special character
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  // Detailed requirements in error message
  message: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
};

/**
 * US phone number validation rule
 * Supports various US phone number formats
 * Optional field (not required by default)
 */
export const phoneRule: ValidationRule = {
  // Pattern supports: (123) 456-7890, 123-456-7890, 123 456 7890, +1 123 456 7890
  pattern: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
  // User-friendly error message
  message: 'Please enter a valid phone number',
};

// URL validation rule
export const urlRule: ValidationRule = {
  pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  message: 'Please enter a valid URL',
};

// Credit card validation rule (basic Luhn algorithm check)
export const creditCardRule: ValidationRule = {
  pattern: /^[0-9]{13,19}$/,
  custom: (value: string) => {
    if (!value) return null;
    
    // Remove spaces and dashes
    const cleanValue = value.replace(/[\s-]/g, '');
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanValue.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanValue.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 ? null : 'Please enter a valid credit card number';
  },
  message: 'Please enter a valid credit card number',
};

// ZIP code validation rule (US format)
export const zipCodeRule: ValidationRule = {
  pattern: /^\d{5}(-\d{4})?$/,
  message: 'Please enter a valid ZIP code',
};

// Name validation rule (letters, spaces, hyphens, apostrophes)
export const nameRule: ValidationRule = {
  required: true,
  pattern: /^[a-zA-Z\s\-']+$/,
  minLength: 2,
  maxLength: 50,
  message: 'Name must contain only letters, spaces, hyphens, and apostrophes',
};

// Username validation rule (alphanumeric and underscores, 3-20 characters)
export const usernameRule: ValidationRule = {
  required: true,
  pattern: /^[a-zA-Z0-9_]{3,20}$/,
  message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
};

// Age validation rule (18-120 years)
export const ageRule: ValidationRule = {
  required: true,
  custom: (value: number) => {
    const age = Number(value);
    if (isNaN(age)) return 'Age must be a number';
    if (age < 18) return 'You must be at least 18 years old';
    if (age > 120) return 'Please enter a valid age';
    return null;
  },
  message: 'Please enter a valid age',
};

// Date validation rule (not in the future)
export const pastDateRule: ValidationRule = {
  custom: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (date > today) {
      return 'Date cannot be in the future';
    }
    return null;
  },
  message: 'Please enter a valid date',
};

// Required field rule
export const requiredRule: ValidationRule = {
  required: true,
  message: 'This field is required',
};

// Numeric validation rule
export const numericRule: ValidationRule = {
  pattern: /^\d+$/,
  message: 'This field must contain only numbers',
};

// Decimal validation rule
export const decimalRule: ValidationRule = {
  pattern: /^\d+(\.\d{1,2})?$/,
  message: 'Please enter a valid decimal number (up to 2 decimal places)',
};
