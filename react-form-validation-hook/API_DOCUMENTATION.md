# API Documentation

## Table of Contents

- [useFormValidation Hook](#useformvalidation-hook)
- [Types and Interfaces](#types-and-interfaces)
- [Validation Rules](#validation-rules)
- [Validator Functions](#validator-functions)
- [Utility Functions](#utility-functions)
- [Examples](#examples)

## useFormValidation Hook

The main hook for form validation with comprehensive features.

### Signature

```typescript
function useFormValidation(options?: UseFormValidationOptions): UseFormValidationReturn
```

### Parameters

#### `UseFormValidationOptions`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `initialValues` | `FormValues` | `{}` | Initial values for form fields |
| `validationRules` | `ValidationRules` | `{}` | Validation rules for each field |
| `validateOnChange` | `boolean` | `false` | Enable validation on input change |
| `validateOnBlur` | `boolean` | `true` | Enable validation on input blur |
| `validateOnSubmit` | `boolean` | `true` | Enable validation on form submit |
| `debounceMs` | `number` | `300` | Debounce delay for onChange validation (ms) |

### Return Value

#### `UseFormValidationReturn`

| Property | Type | Description |
|----------|------|-------------|
| `values` | `FormValues` | Current form field values |
| `errors` | `FormErrors` | Current validation errors |
| `touched` | `TouchedFields` | Fields that have been interacted with |
| `isSubmitting` | `boolean` | Whether form is currently submitting |
| `isValid` | `boolean` | Whether form is currently valid (no errors) |
| `handleChange` | `ChangeHandler` | Input change event handler |
| `handleBlur` | `BlurHandler` | Input blur event handler |
| `handleSubmit` | `SubmitHandlerFactory` | Form submit handler factory |
| `setFieldValue` | `SetFieldValue` | Set specific field value |
| `setFieldError` | `SetFieldError` | Set specific field error |
| `setFieldTouched` | `SetFieldTouched` | Set specific field touched state |
| `validateField` | `ValidateField` | Validate specific field |
| `validateForm` | `ValidateForm` | Validate entire form |
| `resetForm` | `ResetForm` | Reset form to initial state |
| `clearErrors` | `ClearErrors` | Clear all validation errors |

## Types and Interfaces

### Core Types

```typescript
// Form field values
type FormValues = { [key: string]: any };

// Form validation errors
type FormErrors = { [key: string]: string };

// Touched field states
type TouchedFields = { [key: string]: boolean };

// Validation rules for all fields
type ValidationRules = { [key: string]: ValidationRule };
```

### ValidationRule Interface

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null | Promise<string | null>;
  message?: string;
}
```

### Event Handler Types

```typescript
type ChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;

type BlurHandler = (
  event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;

type SubmitHandlerFactory = (
  onSubmit: (values: FormValues) => void | Promise<void>
) => (event: React.FormEvent) => Promise<void>;
```

### Utility Function Types

```typescript
type SetFieldValue = (fieldName: string, value: any) => void;
type SetFieldError = (fieldName: string, error: string) => void;
type SetFieldTouched = (fieldName: string, isTouched?: boolean) => void;
type ValidateField = (fieldName: string) => Promise<void>;
type ValidateForm = () => Promise<boolean>;
type ResetForm = (newValues?: FormValues) => void;
type ClearErrors = () => void;
```

## Validation Rules

### Built-in Validation Properties

#### `required: boolean`
Validates that the field has a value.

```typescript
const rule: ValidationRule = {
  required: true,
  message: 'This field is required'
};
```

#### `minLength: number`
Validates minimum string length.

```typescript
const rule: ValidationRule = {
  minLength: 8,
  message: 'Must be at least 8 characters'
};
```

#### `maxLength: number`
Validates maximum string length.

```typescript
const rule: ValidationRule = {
  maxLength: 100,
  message: 'Must be no more than 100 characters'
};
```

#### `pattern: RegExp`
Validates against a regular expression.

```typescript
const rule: ValidationRule = {
  pattern: /^[a-zA-Z0-9]+$/,
  message: 'Only letters and numbers allowed'
};
```

#### `custom: Function`
Custom validation function (sync or async).

```typescript
const rule: ValidationRule = {
  custom: async (value: string) => {
    if (value === 'forbidden') {
      return 'This value is not allowed';
    }
    return null; // No error
  }
};
```

### Validation Execution Order

1. **Required validation** - Runs first if `required: true`
2. **Built-in validations** - `minLength`, `maxLength`, `pattern`
3. **Custom validation** - Runs last if `custom` function provided

### Error Handling

- Return `null` or `undefined` for no error
- Return a string for validation error message
- Throw an error to trigger generic error handling
- First error encountered stops further validation

## Validator Functions

Pre-built validator factory functions for common use cases.

### Basic Validators

```typescript
import { required, minLength, maxLength, pattern, custom } from './validation/validators';

// Required field
const requiredRule = required('This field is required');

// Length constraints
const minLengthRule = minLength(8, 'Must be at least 8 characters');
const maxLengthRule = maxLength(100, 'Must be no more than 100 characters');

// Pattern matching
const alphanumericRule = pattern(/^[a-zA-Z0-9]+$/, 'Only letters and numbers');

// Custom validation
const customRule = custom(
  (value) => value === 'test' ? 'Test value not allowed' : null,
  'Invalid value'
);
```

### Specialized Validators

```typescript
import { 
  email, 
  url, 
  phone, 
  date, 
  futureDate, 
  pastDate,
  min,
  max,
  range,
  confirmation,
  unique,
  fileSize,
  fileType
} from './validation/validators';

// Email validation
const emailRule = email('Please enter a valid email');

// URL validation
const urlRule = url('Please enter a valid URL');

// Phone number (US format)
const phoneRule = phone('Please enter a valid phone number');

// Date validations
const dateRule = date('Please enter a valid date');
const futureDateRule = futureDate('Date must be in the future');
const pastDateRule = pastDate('Date cannot be in the future');

// Numeric validations
const minRule = min(18, 'Must be at least 18');
const maxRule = max(100, 'Must be no more than 100');
const rangeRule = range(18, 65, 'Must be between 18 and 65');

// Confirmation field (e.g., password confirmation)
const confirmRule = confirmation(
  'password',
  () => formValues.password,
  'Passwords do not match'
);

// Async uniqueness check
const uniqueRule = unique(
  async (value) => {
    const response = await fetch(`/api/check-username/${value}`);
    const { available } = await response.json();
    return available;
  },
  'Username is already taken'
);

// File validations
const fileSizeRule = fileSize(5, 'File must be less than 5MB');
const fileTypeRule = fileType(
  ['image/jpeg', 'image/png'],
  'Only JPEG and PNG files allowed'
);
```

## Utility Functions

### Rule Composition

```typescript
import { combineRules } from './validation/utils';

// Combine multiple validation rules
const passwordRule = combineRules(
  required('Password is required'),
  minLength(8, 'Password must be at least 8 characters'),
  pattern(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain letters and numbers')
);
```

### Conditional Validation

```typescript
import { when } from './validation/utils';

// Conditional validation based on other field values
const conditionalRule = when(
  (values) => values.accountType === 'business',
  required('Business name is required for business accounts'),
  () => formValues
);
```

### Predefined Form Rules

```typescript
import { createFormRules } from './validation/utils';

// Pre-configured validation rules for common forms
const loginRules = createFormRules.login();
const registrationRules = createFormRules.registration();
const contactRules = createFormRules.contact();
const profileRules = createFormRules.profile();
```

### Value Validation

```typescript
import { validateValue } from './validation/utils';

// Validate a single value against a rule
const error = await validateValue('test@example.com', emailRule);
if (error) {
  console.log('Validation error:', error);
}
```

## Examples

### Basic Form

```typescript
import React from 'react';
import { useFormValidation } from './hooks';

const BasicForm = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation({
    initialValues: { email: '', password: '' },
    validationRules: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email'
      },
      password: {
        required: true,
        minLength: 8,
        message: 'Password must be at least 8 characters'
      }
    }
  });

  const onSubmit = async (formValues) => {
    console.log('Submitting:', formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <span>{errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.password && errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Advanced Form with Async Validation

```typescript
import React from 'react';
import { useFormValidation } from './hooks';
import { required, email, minLength, unique } from './validation/validators';

const AdvancedForm = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationRules: {
      username: {
        required: true,
        minLength: 3,
        custom: unique(
          async (username) => {
            const response = await fetch(`/api/check-username/${username}`);
            const { available } = await response.json();
            return available;
          },
          'Username is already taken'
        )
      },
      email: email('Please enter a valid email address'),
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
        message: 'Password must contain at least one letter and one number'
      },
      confirmPassword: {
        required: true,
        custom: (value) => {
          return value === values.password ? null : 'Passwords do not match';
        }
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 500
  });

  const onSubmit = async (formValues) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      });

      if (response.ok) {
        console.log('Registration successful');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          name="username"
          placeholder="Username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

### Programmatic Field Management

```typescript
import React from 'react';
import { useFormValidation } from './hooks';

const ProgrammaticForm = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    resetForm,
    clearErrors,
  } = useFormValidation({
    initialValues: { email: '', score: 0 },
    validationRules: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      score: {
        required: true,
        custom: (value) => {
          const num = Number(value);
          if (num < 0 || num > 100) {
            return 'Score must be between 0 and 100';
          }
          return null;
        }
      }
    }
  });

  // Auto-generate email based on other inputs
  const generateEmail = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    setFieldValue('email', `user${randomId}@example.com`);
  };

  // Validate specific field programmatically
  const validateEmailField = async () => {
    await validateField('email');
  };

  // Set custom error
  const setCustomError = () => {
    setFieldError('email', 'This email is temporarily unavailable');
    setFieldTouched('email', true);
  };

  // Reset form to new values
  const resetToDefaults = () => {
    resetForm({
      email: 'default@example.com',
      score: 50
    });
  };

  const onSubmit = async (formValues) => {
    console.log('Form submitted:', formValues);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <span>{errors.email}</span>
          )}
        </div>

        <div>
          <input
            name="score"
            type="number"
            placeholder="Score (0-100)"
            value={values.score}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.score && errors.score && (
            <span>{errors.score}</span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>

      <div>
        <h3>Programmatic Controls</h3>
        <button onClick={generateEmail}>Generate Email</button>
        <button onClick={validateEmailField}>Validate Email</button>
        <button onClick={setCustomError}>Set Custom Error</button>
        <button onClick={clearErrors}>Clear All Errors</button>
        <button onClick={resetToDefaults}>Reset to Defaults</button>
      </div>
    </div>
  );
};
```

## Best Practices

### Performance Optimization

1. **Use debouncing** for onChange validation to avoid excessive API calls
   ```typescript
const form = useFormValidation({
     validateOnChange: true,
     debounceMs: 500, // Wait 500ms after user stops typing
   });
```

2. **Memoize validation functions** when possible
   ```typescript
const validationRules = useMemo(() => ({
     email: email('Please enter a valid email'),
     password: minLength(8, 'Password too short')
   }), []);
```

3. **Avoid inline validation rules** - define them outside the component
   ```typescript
// ❌ Bad - creates new objects on every render
   const form = useFormValidation({
     validationRules: {
       email: { required: true, pattern: /.../ }
     }
   });

   // ✅ Good - stable reference
   const EMAIL_RULES = { required: true, pattern: /.../ };
   const form = useFormValidation({
     validationRules: { email: EMAIL_RULES }
   });
```

4. **Use validateOnBlur** instead of validateOnChange for better UX
   ```typescript
const form = useFormValidation({
     validateOnBlur: true,    // ✅ Good UX
     validateOnChange: false, // Avoid unless necessary
   });
```

### Error Handling

1. **Provide clear error messages** that guide users to fix issues
   ```typescript
const passwordRule = {
     minLength: 8,
     message: 'Password must be at least 8 characters long' // Clear and specific
   };
```

2. **Handle async validation errors** gracefully
   ```typescript
const asyncRule = {
     custom: async (value) => {
       try {
         const isValid = await validateOnServer(value);
         return isValid ? null : 'Value is not available';
       } catch (error) {
         return 'Unable to validate. Please try again.';
       }
     }
   };
```

3. **Show errors only after user interaction** (touched fields)
   ```typescript
{touched.email && errors.email && (
     <span className="error">{errors.email}</span>
   )}
```

4. **Clear errors when user starts correcting** the input
   ```typescript
// This is handled automatically by the hook
   // Errors are cleared when validation passes
```

### Accessibility

1. **Associate error messages** with form fields using aria-describedby
   ```typescript
<input
     name="email"
     aria-describedby={errors.email ? 'email-error' : undefined}
     aria-invalid={touched.email && !!errors.email}
   />
   {touched.email && errors.email && (
     <span id="email-error" role="alert">{errors.email}</span>
   )}
```

2. **Use proper input types** (email, tel, url, etc.)
   ```typescript
<input type="email" name="email" />
   <input type="tel" name="phone" />
   <input type="url" name="website" />
```

3. **Provide clear labels** and placeholders
   ```typescript
<label htmlFor="email">Email Address *</label>
   <input
     id="email"
     name="email"
     type="email"
     placeholder="Enter your email address"
     required
   />
```

4. **Indicate required fields** visually and programmatically
   ```typescript
<label htmlFor="email">
     Email Address <span aria-label="required">*</span>
   </label>
   <input id="email" name="email" required />
```

### Security

1. **Always validate on the server** - client-side validation is for UX only
   ```typescript
// Client-side validation for UX
   const clientRules = { email: email() };

   // Server-side validation for security (required)
   app.post('/api/submit', (req, res) => {
     const { email } = req.body;
     if (!isValidEmail(email)) {
       return res.status(400).json({ error: 'Invalid email' });
     }
     // Process form...
   });
```

2. **Sanitize user input** before displaying error messages
   ```typescript
const customRule = {
     custom: (value) => {
       // Sanitize value before using in error message
       const sanitized = escapeHtml(value);
       return `Value "${sanitized}" is not allowed`;
     }
   };
```

3. **Use HTTPS** for all form submissions
   ```typescript
const onSubmit = async (values) => {
     // Always use HTTPS endpoints
     await fetch('https://api.example.com/submit', {
       method: 'POST',
       body: JSON.stringify(values)
     });
   };
```

4. **Implement rate limiting** for async validation endpoints
   ```typescript
// Server-side rate limiting
   app.use('/api/validate', rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }));
```

## Common Patterns

### Form Wizard/Multi-Step Forms

```typescript
const useFormWizard = (steps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const forms = steps.map(step =>
    useFormValidation(step.validationConfig)
  );

  const nextStep = async () => {
    const isValid = await forms[currentStep].validateForm();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    currentForm: forms[currentStep],
    nextStep,
    prevStep,
    isLastStep: currentStep === steps.length - 1
  };
};
```

### Field Arrays/Dynamic Lists

```typescript
const DynamicListForm = () => {
  const [items, setItems] = useState([{ name: '', email: '' }]);

  const addItem = () => {
    setItems([...items, { name: '', email: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <input
            value={item.name}
            onChange={(e) => updateItem(index, 'name', e.target.value)}
            placeholder="Name"
          />
          <input
            value={item.email}
            onChange={(e) => updateItem(index, 'email', e.target.value)}
            placeholder="Email"
          />
          <button onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};
```

---

*For more examples and advanced usage patterns, see the example components in the `src/components/` directory.*
