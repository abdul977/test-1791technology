import { describe, it, expect, vi } from 'vitest';
import {
  required,
  minLength,
  maxLength,
  pattern,
  custom,
  min,
  max,
  range,
  email,
  url,
  phone,
  date,
  futureDate,
  pastDate,
  confirmation,
  unique,
  fileSize,
  fileType,
} from '../validators';

describe('Validation Validators', () => {
  describe('required', () => {
    it('should create a required validation rule', () => {
      const rule = required('This field is required');
      
      expect(rule.required).toBe(true);
      expect(rule.message).toBe('This field is required');
    });

    it('should use default message when none provided', () => {
      const rule = required();
      
      expect(rule.message).toBe('This field is required');
    });
  });

  describe('minLength', () => {
    it('should create a minimum length validation rule', () => {
      const rule = minLength(5, 'Must be at least 5 characters');
      
      expect(rule.minLength).toBe(5);
      expect(rule.message).toBe('Must be at least 5 characters');
    });

    it('should use default message when none provided', () => {
      const rule = minLength(3);
      
      expect(rule.message).toBe('Must be at least 3 characters');
    });
  });

  describe('maxLength', () => {
    it('should create a maximum length validation rule', () => {
      const rule = maxLength(10, 'Must be no more than 10 characters');
      
      expect(rule.maxLength).toBe(10);
      expect(rule.message).toBe('Must be no more than 10 characters');
    });

    it('should use default message when none provided', () => {
      const rule = maxLength(20);
      
      expect(rule.message).toBe('Must be no more than 20 characters');
    });
  });

  describe('pattern', () => {
    it('should create a pattern validation rule', () => {
      const regex = /^[a-zA-Z]+$/;
      const rule = pattern(regex, 'Only letters allowed');
      
      expect(rule.pattern).toBe(regex);
      expect(rule.message).toBe('Only letters allowed');
    });

    it('should use default message when none provided', () => {
      const rule = pattern(/test/);
      
      expect(rule.message).toBe('Invalid format');
    });
  });

  describe('custom', () => {
    it('should create a custom validation rule', () => {
      const validator = (value: string) => value === 'test' ? null : 'Invalid';
      const rule = custom(validator, 'Custom error');
      
      expect(rule.custom).toBe(validator);
      expect(rule.message).toBe('Custom error');
    });

    it('should use default message when none provided', () => {
      const validator = () => null;
      const rule = custom(validator);
      
      expect(rule.message).toBe('Invalid value');
    });
  });

  describe('min', () => {
    it('should validate minimum numeric value', async () => {
      const rule = min(10);
      
      expect(await rule.custom!(15)).toBeNull();
      expect(await rule.custom!(10)).toBeNull();
      expect(await rule.custom!(5)).toBe('Must be at least 10');
      expect(await rule.custom!('not-a-number')).toBe('Must be a number');
    });

    it('should use custom message', async () => {
      const rule = min(5, 'Value too small');
      
      expect(await rule.custom!(3)).toBe('Value too small');
    });
  });

  describe('max', () => {
    it('should validate maximum numeric value', async () => {
      const rule = max(100);
      
      expect(await rule.custom!(50)).toBeNull();
      expect(await rule.custom!(100)).toBeNull();
      expect(await rule.custom!(150)).toBe('Must be no more than 100');
      expect(await rule.custom!('not-a-number')).toBe('Must be a number');
    });

    it('should use custom message', async () => {
      const rule = max(10, 'Value too large');
      
      expect(await rule.custom!(15)).toBe('Value too large');
    });
  });

  describe('range', () => {
    it('should validate numeric range', async () => {
      const rule = range(10, 20);
      
      expect(await rule.custom!(15)).toBeNull();
      expect(await rule.custom!(10)).toBeNull();
      expect(await rule.custom!(20)).toBeNull();
      expect(await rule.custom!(5)).toBe('Must be between 10 and 20');
      expect(await rule.custom!(25)).toBe('Must be between 10 and 20');
      expect(await rule.custom!('not-a-number')).toBe('Must be a number');
    });

    it('should use custom message', async () => {
      const rule = range(1, 10, 'Out of range');
      
      expect(await rule.custom!(15)).toBe('Out of range');
    });
  });

  describe('email', () => {
    it('should validate email addresses', () => {
      const rule = email();
      
      expect(rule.pattern!.test('test@example.com')).toBe(true);
      expect(rule.pattern!.test('user.name@domain.co.uk')).toBe(true);
      expect(rule.pattern!.test('invalid-email')).toBe(false);
      expect(rule.pattern!.test('test@')).toBe(false);
      expect(rule.pattern!.test('@example.com')).toBe(false);
    });

    it('should use custom message', () => {
      const rule = email('Invalid email format');
      
      expect(rule.message).toBe('Invalid email format');
    });
  });

  describe('url', () => {
    it('should validate URLs', () => {
      const rule = url();
      
      expect(rule.pattern!.test('https://example.com')).toBe(true);
      expect(rule.pattern!.test('http://www.example.com')).toBe(true);
      expect(rule.pattern!.test('https://subdomain.example.com/path')).toBe(true);
      expect(rule.pattern!.test('invalid-url')).toBe(false);
      expect(rule.pattern!.test('ftp://example.com')).toBe(false);
    });

    it('should use custom message', () => {
      const rule = url('Invalid URL format');
      
      expect(rule.message).toBe('Invalid URL format');
    });
  });

  describe('phone', () => {
    it('should validate US phone numbers', () => {
      const rule = phone();
      
      expect(rule.pattern!.test('(555) 123-4567')).toBe(true);
      expect(rule.pattern!.test('555-123-4567')).toBe(true);
      expect(rule.pattern!.test('555 123 4567')).toBe(true);
      expect(rule.pattern!.test('+1 555 123 4567')).toBe(true);
      expect(rule.pattern!.test('123-456')).toBe(false);
      expect(rule.pattern!.test('invalid-phone')).toBe(false);
    });

    it('should use custom message', () => {
      const rule = phone('Invalid phone format');
      
      expect(rule.message).toBe('Invalid phone format');
    });
  });

  describe('date', () => {
    it('should validate dates', async () => {
      const rule = date();
      
      expect(await rule.custom!('2023-12-25')).toBeNull();
      expect(await rule.custom!('12/25/2023')).toBeNull();
      expect(await rule.custom!('invalid-date')).toBe('Please enter a valid date');
      expect(await rule.custom!('')).toBeNull(); // Empty values are allowed
    });

    it('should use custom message', async () => {
      const rule = date('Invalid date format');
      
      expect(await rule.custom!('invalid-date')).toBe('Invalid date format');
    });
  });

  describe('futureDate', () => {
    it('should validate future dates', async () => {
      const rule = futureDate();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(await rule.custom!(tomorrow.toISOString().split('T')[0])).toBeNull();
      expect(await rule.custom!(yesterday.toISOString().split('T')[0])).toBe('Date must be in the future');
      expect(await rule.custom!('')).toBeNull(); // Empty values are allowed
    });

    it('should use custom message', async () => {
      const rule = futureDate('Must be future date');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(await rule.custom!(yesterday.toISOString().split('T')[0])).toBe('Must be future date');
    });
  });

  describe('pastDate', () => {
    it('should validate past dates', async () => {
      const rule = pastDate();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(await rule.custom!(yesterday.toISOString().split('T')[0])).toBeNull();
      expect(await rule.custom!(tomorrow.toISOString().split('T')[0])).toBe('Date cannot be in the future');
      expect(await rule.custom!('')).toBeNull(); // Empty values are allowed
    });

    it('should use custom message', async () => {
      const rule = pastDate('Must be past date');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(await rule.custom!(tomorrow.toISOString().split('T')[0])).toBe('Must be past date');
    });
  });

  describe('confirmation', () => {
    it('should validate confirmation fields', async () => {
      const getOriginalValue = () => 'password123';
      const rule = confirmation('password', getOriginalValue);
      
      expect(await rule.custom!('password123')).toBeNull();
      expect(await rule.custom!('different')).toBe('Values do not match');
    });

    it('should use custom message', async () => {
      const getOriginalValue = () => 'test';
      const rule = confirmation('original', getOriginalValue, 'Passwords must match');
      
      expect(await rule.custom!('different')).toBe('Passwords must match');
    });
  });

  describe('unique', () => {
    it('should validate uniqueness', async () => {
      const checkFunction = vi.fn()
        .mockResolvedValueOnce(true)  // unique
        .mockResolvedValueOnce(false); // not unique
      
      const rule = unique(checkFunction);
      
      expect(await rule.custom!('unique-value')).toBeNull();
      expect(await rule.custom!('taken-value')).toBe('This value is already taken');
      expect(await rule.custom!('')).toBeNull(); // Empty values are allowed
    });

    it('should handle check function errors', async () => {
      const checkFunction = vi.fn().mockRejectedValue(new Error('Network error'));
      const rule = unique(checkFunction);
      
      expect(await rule.custom!('test')).toBe('Unable to verify uniqueness');
    });

    it('should use custom message', async () => {
      const checkFunction = vi.fn().mockResolvedValue(false);
      const rule = unique(checkFunction, 'Username already exists');
      
      expect(await rule.custom!('test')).toBe('Username already exists');
    });
  });

  describe('fileSize', () => {
    it('should validate file size', async () => {
      const smallFile = { size: 1024 * 1024 } as File; // 1MB
      const largeFile = { size: 5 * 1024 * 1024 } as File; // 5MB
      
      const rule = fileSize(2); // 2MB limit
      
      expect(await rule.custom!(smallFile)).toBeNull();
      expect(await rule.custom!(largeFile)).toBe('File size must be less than 2MB');
      expect(await rule.custom!(null)).toBeNull(); // No file is allowed
    });

    it('should use custom message', async () => {
      const largeFile = { size: 5 * 1024 * 1024 } as File;
      const rule = fileSize(1, 'File too large');
      
      expect(await rule.custom!(largeFile)).toBe('File too large');
    });
  });

  describe('fileType', () => {
    it('should validate file types', async () => {
      const imageFile = { type: 'image/jpeg' } as File;
      const textFile = { type: 'text/plain' } as File;
      
      const rule = fileType(['image/jpeg', 'image/png']);
      
      expect(await rule.custom!(imageFile)).toBeNull();
      expect(await rule.custom!(textFile)).toBe('File type must be one of: image/jpeg, image/png');
      expect(await rule.custom!(null)).toBeNull(); // No file is allowed
    });

    it('should use custom message', async () => {
      const textFile = { type: 'text/plain' } as File;
      const rule = fileType(['image/jpeg'], 'Only JPEG images allowed');
      
      expect(await rule.custom!(textFile)).toBe('Only JPEG images allowed');
    });
  });
});
