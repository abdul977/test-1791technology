// Import ValidationRule type for type safety
import { ValidationRule } from '../hooks/types';

/**
 * Validator factory functions for creating reusable validation rules
 * These functions return ValidationRule objects that can be used with the form validation hook
 * Each validator can accept custom error messages for better user experience
 */

/**
 * Creates a required field validator
 * Ensures that the field has a non-empty value
 * @param message - Custom error message (optional)
 * @returns ValidationRule object with required constraint
 */
export const required = (message?: string): ValidationRule => ({
  // Mark field as required
  required: true,
  // Use custom message or default
  message: message || 'This field is required',
});

/**
 * Creates a minimum length validator for string inputs
 * Validates that string values meet minimum character requirements
 * @param min - Minimum number of characters required
 * @param message - Custom error message (optional)
 * @returns ValidationRule object with minLength constraint
 */
export const minLength = (min: number, message?: string): ValidationRule => ({
  // Set minimum length requirement
  minLength: min,
  // Use custom message or generate default with min value
  message: message || `Must be at least ${min} characters`,
});

/**
 * Creates a maximum length validator for string inputs
 * Validates that string values don't exceed maximum character limits
 * @param max - Maximum number of characters allowed
 * @param message - Custom error message (optional)
 * @returns ValidationRule object with maxLength constraint
 */
export const maxLength = (max: number, message?: string): ValidationRule => ({
  // Set maximum length limit
  maxLength: max,
  // Use custom message or generate default with max value
  message: message || `Must be no more than ${max} characters`,
});

/**
 * Creates a pattern validator using regular expressions
 * Validates that string values match a specific pattern/format
 * @param regex - Regular expression pattern to match against
 * @param message - Custom error message (optional)
 * @returns ValidationRule object with pattern constraint
 */
export const pattern = (regex: RegExp, message?: string): ValidationRule => ({
  // Set regex pattern for validation
  pattern: regex,
  // Use custom message or default
  message: message || 'Invalid format',
});

/**
 * Creates a custom validator with user-defined validation logic
 * Allows for complex validation scenarios including async validation
 * @param validator - Function that takes a value and returns error message or null
 * @param message - Fallback error message (optional)
 * @returns ValidationRule object with custom validation function
 */
export const custom = (
  // Validator function can be sync or async
  validator: (value: any) => string | null | Promise<string | null>,
  message?: string
): ValidationRule => ({
  // Set custom validation function
  custom: validator,
  // Use custom message or default (though custom validator should return its own message)
  message: message || 'Invalid value',
});

/**
 * Creates a minimum value validator for numbers
 */
export const min = (minValue: number, message?: string): ValidationRule => ({
  custom: (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    return num >= minValue ? null : (message || `Must be at least ${minValue}`);
  },
});

/**
 * Creates a maximum value validator for numbers
 */
export const max = (maxValue: number, message?: string): ValidationRule => ({
  custom: (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    return num <= maxValue ? null : (message || `Must be no more than ${maxValue}`);
  },
});

/**
 * Creates a range validator for numbers
 */
export const range = (minValue: number, maxValue: number, message?: string): ValidationRule => ({
  custom: (value: any) => {
    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    if (num < minValue || num > maxValue) {
      return message || `Must be between ${minValue} and ${maxValue}`;
    }
    return null;
  },
});

/**
 * Creates an email validator
 */
export const email = (message?: string): ValidationRule => ({
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: message || 'Please enter a valid email address',
});

/**
 * Creates a URL validator
 */
export const url = (message?: string): ValidationRule => ({
  pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  message: message || 'Please enter a valid URL',
});

/**
 * Creates a phone number validator (US format)
 */
export const phone = (message?: string): ValidationRule => ({
  pattern: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
  message: message || 'Please enter a valid phone number',
});

/**
 * Creates a date validator
 */
export const date = (message?: string): ValidationRule => ({
  custom: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? (message || 'Please enter a valid date') : null;
  },
});

/**
 * Creates a future date validator
 */
export const futureDate = (message?: string): ValidationRule => ({
  custom: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    if (date <= today) {
      return message || 'Date must be in the future';
    }
    return null;
  },
});

/**
 * Creates a past date validator
 */
export const pastDate = (message?: string): ValidationRule => ({
  custom: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (date > today) {
      return message || 'Date cannot be in the future';
    }
    return null;
  },
});

/**
 * Creates a confirmation field validator (e.g., password confirmation)
 */
export const confirmation = (
  _originalFieldName: string,
  getOriginalValue: () => any,
  message?: string
): ValidationRule => ({
  custom: (value: any) => {
    const originalValue = getOriginalValue();
    return value === originalValue ? null : (message || 'Values do not match');
  },
});

/**
 * Creates an async validator for checking uniqueness (e.g., username availability)
 */
export const unique = (
  checkFunction: (value: any) => Promise<boolean>,
  message?: string
): ValidationRule => ({
  custom: async (value: any) => {
    if (!value) return null;
    try {
      const isUnique = await checkFunction(value);
      return isUnique ? null : (message || 'This value is already taken');
    } catch (error) {
      return 'Unable to verify uniqueness';
    }
  },
});

/**
 * Creates a file size validator
 */
export const fileSize = (maxSizeInMB: number, message?: string): ValidationRule => ({
  custom: (file: File) => {
    if (!file) return null;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes ? null : (message || `File size must be less than ${maxSizeInMB}MB`);
  },
});

/**
 * Creates a file type validator
 */
export const fileType = (allowedTypes: string[], message?: string): ValidationRule => ({
  custom: (file: File) => {
    if (!file) return null;
    const fileType = file.type;
    return allowedTypes.includes(fileType) ? null : (message || `File type must be one of: ${allowedTypes.join(', ')}`);
  },
});
