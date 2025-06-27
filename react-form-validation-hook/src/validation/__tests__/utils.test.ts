/**
 * Test suite for validation utility functions
 * Comprehensive tests for utility functions including:
 * - Rule combination and composition
 * - Conditional validation logic
 * - Form rule creation helpers
 * - Debouncing functionality
 * - Value validation utilities
 */

// Import Vitest testing utilities
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
// Import utility functions to test
import {
  combineRules,
  when,
  createFormRules,
  debounce,
  validateValue,
} from '../utils';
// Import types for type safety in tests
import type { ValidationRule } from '../../hooks/types';

// Main test suite for validation utilities
describe('Validation Utils', () => {
  // Test suite for combineRules function
  describe('combineRules', () => {
    // Test that multiple rules can be combined into one
    it('should combine multiple validation rules', async () => {
      const rule1: ValidationRule = {
        required: true,
        message: 'Field is required',
      };
      
      const rule2: ValidationRule = {
        minLength: 5,
        message: 'Must be at least 5 characters',
      };
      
      const rule3: ValidationRule = {
        pattern: /^[a-zA-Z]+$/,
        message: 'Only letters allowed',
      };
      
      const combinedRule = combineRules(rule1, rule2, rule3);
      
      // Test required validation
      expect(await combinedRule.custom!('')).toBe('Field is required');
      
      // Test min length validation
      expect(await combinedRule.custom!('abc')).toBe('Must be at least 5 characters');
      
      // Test pattern validation
      expect(await combinedRule.custom!('abc123')).toBe('Only letters allowed');
      
      // Test valid value
      expect(await combinedRule.custom!('abcdef')).toBeNull();
    });

    it('should return first error encountered', async () => {
      const rule1: ValidationRule = {
        minLength: 10,
        message: 'Too short',
      };
      
      const rule2: ValidationRule = {
        pattern: /^[0-9]+$/,
        message: 'Only numbers',
      };
      
      const combinedRule = combineRules(rule1, rule2);
      
      // Should return the first error (minLength) even though pattern also fails
      expect(await combinedRule.custom!('abc')).toBe('Too short');
    });

    it('should handle custom validation rules', async () => {
      const rule1: ValidationRule = {
        custom: (value: string) => value === 'forbidden' ? 'Not allowed' : null,
      };
      
      const rule2: ValidationRule = {
        custom: (value: string) => value.includes('bad') ? 'Contains bad word' : null,
      };
      
      const combinedRule = combineRules(rule1, rule2);
      
      expect(await combinedRule.custom!('forbidden')).toBe('Not allowed');
      expect(await combinedRule.custom!('bad word')).toBe('Contains bad word');
      expect(await combinedRule.custom!('good')).toBeNull();
    });
  });

  describe('when', () => {
    it('should apply validation only when condition is met', async () => {
      const condition = (values: any) => values.enableValidation === true;
      const rule: ValidationRule = {
        required: true,
        message: 'Field is required',
      };
      const getValues = () => ({ enableValidation: true, field: '' });
      
      const conditionalRule = when(condition, rule, getValues);
      
      expect(await conditionalRule.custom!('')).toBe('Field is required');
    });

    it('should skip validation when condition is not met', async () => {
      const condition = (values: any) => values.enableValidation === true;
      const rule: ValidationRule = {
        required: true,
        message: 'Field is required',
      };
      const getValues = () => ({ enableValidation: false, field: '' });
      
      const conditionalRule = when(condition, rule, getValues);
      
      expect(await conditionalRule.custom!('')).toBeNull();
    });

    it('should handle complex conditions', async () => {
      const condition = (values: any) => values.type === 'premium' && values.age >= 18;
      const rule: ValidationRule = {
        required: true,
        message: 'Credit card required for premium users',
      };
      
      const getValues1 = () => ({ type: 'premium', age: 25, creditCard: '' });
      const getValues2 = () => ({ type: 'basic', age: 25, creditCard: '' });
      const getValues3 = () => ({ type: 'premium', age: 16, creditCard: '' });
      
      const conditionalRule1 = when(condition, rule, getValues1);
      const conditionalRule2 = when(condition, rule, getValues2);
      const conditionalRule3 = when(condition, rule, getValues3);
      
      expect(await conditionalRule1.custom!('')).toBe('Credit card required for premium users');
      expect(await conditionalRule2.custom!('')).toBeNull();
      expect(await conditionalRule3.custom!('')).toBeNull();
    });
  });

  describe('createFormRules', () => {
    describe('login', () => {
      it('should create login form validation rules', () => {
        const rules = createFormRules.login();
        
        expect(rules.email).toBeDefined();
        expect(rules.email.required).toBe(true);
        expect(rules.email.pattern).toBeDefined();
        
        expect(rules.password).toBeDefined();
        expect(rules.password.required).toBe(true);
        expect(rules.password.minLength).toBe(6);
      });
    });

    describe('registration', () => {
      it('should create registration form validation rules', () => {
        const rules = createFormRules.registration();
        
        expect(rules.firstName).toBeDefined();
        expect(rules.firstName.required).toBe(true);
        expect(rules.firstName.minLength).toBe(2);
        expect(rules.firstName.maxLength).toBe(50);
        
        expect(rules.lastName).toBeDefined();
        expect(rules.email).toBeDefined();
        expect(rules.password).toBeDefined();
        expect(rules.confirmPassword).toBeDefined();
      });
    });

    describe('contact', () => {
      it('should create contact form validation rules', () => {
        const rules = createFormRules.contact();
        
        expect(rules.name).toBeDefined();
        expect(rules.email).toBeDefined();
        expect(rules.subject).toBeDefined();
        expect(rules.message).toBeDefined();
        
        expect(rules.message.minLength).toBe(10);
        expect(rules.message.maxLength).toBe(1000);
      });
    });

    describe('profile', () => {
      it('should create profile form validation rules', () => {
        const rules = createFormRules.profile();
        
        expect(rules.firstName).toBeDefined();
        expect(rules.lastName).toBeDefined();
        expect(rules.email).toBeDefined();
        expect(rules.phone).toBeDefined();
        expect(rules.website).toBeDefined();
        
        // Phone and website should not be required
        expect(rules.phone.required).toBeUndefined();
        expect(rules.website.required).toBeUndefined();
      });
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      // Call multiple times rapidly
      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');
      
      // Function should not be called yet
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time
      vi.advanceTimersByTime(300);
      
      // Function should be called once with the last arguments
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    it('should reset debounce timer on subsequent calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn('arg1');
      
      // Advance time partially
      vi.advanceTimersByTime(200);
      
      // Call again, should reset timer
      debouncedFn('arg2');
      
      // Advance remaining time from first call
      vi.advanceTimersByTime(100);
      
      // Function should not be called yet
      expect(mockFn).not.toHaveBeenCalled();
      
      // Advance full debounce time from second call
      vi.advanceTimersByTime(200);
      
      // Function should be called with second argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg2');
    });
  });

  describe('validateValue', () => {
    it('should validate required fields', async () => {
      const rule: ValidationRule = {
        required: true,
        message: 'Field is required',
      };
      
      expect(await validateValue('', rule)).toBe('Field is required');
      expect(await validateValue('   ', rule)).toBe('Field is required');
      expect(await validateValue('value', rule)).toBeNull();
    });

    it('should validate minimum length', async () => {
      const rule: ValidationRule = {
        minLength: 5,
        message: 'Too short',
      };
      
      expect(await validateValue('abc', rule)).toBe('Too short');
      expect(await validateValue('abcdef', rule)).toBeNull();
      expect(await validateValue('', rule)).toBeNull(); // Empty is allowed if not required
    });

    it('should validate maximum length', async () => {
      const rule: ValidationRule = {
        maxLength: 10,
        message: 'Too long',
      };
      
      expect(await validateValue('a'.repeat(15), rule)).toBe('Too long');
      expect(await validateValue('short', rule)).toBeNull();
    });

    it('should validate patterns', async () => {
      const rule: ValidationRule = {
        pattern: /^[a-zA-Z]+$/,
        message: 'Only letters allowed',
      };
      
      expect(await validateValue('abc123', rule)).toBe('Only letters allowed');
      expect(await validateValue('abc', rule)).toBeNull();
    });

    it('should validate custom rules', async () => {
      const rule: ValidationRule = {
        custom: (value: string) => value === 'forbidden' ? 'Not allowed' : null,
      };
      
      expect(await validateValue('forbidden', rule)).toBe('Not allowed');
      expect(await validateValue('allowed', rule)).toBeNull();
    });

    it('should handle custom validation errors', async () => {
      const rule: ValidationRule = {
        custom: () => {
          throw new Error('Validation failed');
        },
      };
      
      expect(await validateValue('test', rule)).toBe('Validation error: Validation failed');
    });

    it('should use default error messages', async () => {
      const requiredRule: ValidationRule = { required: true };
      const minLengthRule: ValidationRule = { minLength: 5 };
      const maxLengthRule: ValidationRule = { maxLength: 10 };
      const patternRule: ValidationRule = { pattern: /^[a-z]+$/ };
      
      expect(await validateValue('', requiredRule)).toBe('This field is required');
      expect(await validateValue('abc', minLengthRule)).toBe('Must be at least 5 characters');
      expect(await validateValue('a'.repeat(15), maxLengthRule)).toBe('Must be no more than 10 characters');
      expect(await validateValue('ABC', patternRule)).toBe('Invalid format');
    });

    it('should skip validations for empty non-required fields', async () => {
      const rule: ValidationRule = {
        minLength: 5,
        maxLength: 10,
        pattern: /^[a-z]+$/,
        message: 'Invalid',
      };
      
      expect(await validateValue('', rule)).toBeNull();
      expect(await validateValue('   ', rule)).toBeNull();
    });

    it('should handle non-string values appropriately', async () => {
      const rule: ValidationRule = {
        minLength: 5, // This should only apply to strings
        custom: (value: any) => typeof value === 'number' && value < 0 ? 'Must be positive' : null,
      };
      
      expect(await validateValue(-5, rule)).toBe('Must be positive');
      expect(await validateValue(10, rule)).toBeNull();
    });
  });
});
