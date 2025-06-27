# React Form Validation Hook

A powerful, flexible, and TypeScript-first React hook for form validation with support for synchronous and asynchronous validation, debouncing, and comprehensive error handling.

## ✨ Features

- 🎯 **TypeScript-first** - Full type safety and IntelliSense support
- ⚡ **Performance optimized** - Debounced validation and memoized handlers
- 🔄 **Async validation** - Support for server-side validation with race condition handling
- 🎛️ **Flexible validation timing** - onChange, onBlur, and onSubmit validation modes
- 🧩 **Composable validators** - Reusable validation rules and custom validators
- 🛡️ **Memory leak prevention** - Automatic cleanup of timeouts and promises
- 📱 **Cross-platform** - Works with React Native and web
- 🎨 **Zero dependencies** - Only requires React

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-form-validation-hook

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Basic Usage

```tsx
import React from 'react';
import { useFormValidation } from './src/hooks';
import { createFormRules } from './src/validation';

const LoginForm = () => {
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
      email: '',
      password: '',
    },
    validationRules: createFormRules.login(),
    validateOnBlur: true,
    validateOnSubmit: true,
  });

  const onSubmit = async (formValues) => {
    console.log('Form submitted:', formValues);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

## 📖 API Reference

### useFormValidation Hook

```tsx
const formState = useFormValidation(options);
```

#### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `initialValues` | `FormValues` | `{}` | Initial form field values |
| `validationRules` | `ValidationRules` | `{}` | Validation rules for each field |
| `validateOnChange` | `boolean` | `false` | Validate fields on change events |
| `validateOnBlur` | `boolean` | `true` | Validate fields on blur events |
| `validateOnSubmit` | `boolean` | `true` | Validate form on submit |
| `debounceMs` | `number` | `300` | Debounce delay for onChange validation |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `values` | `FormValues` | Current form field values |
| `errors` | `FormErrors` | Current validation errors |
| `touched` | `TouchedFields` | Fields that have been interacted with |
| `isSubmitting` | `boolean` | Whether form is currently submitting |
| `isValid` | `boolean` | Whether form is currently valid |
| `handleChange` | `Function` | Input change event handler |
| `handleBlur` | `Function` | Input blur event handler |
| `handleSubmit` | `Function` | Form submit handler factory |
| `setFieldValue` | `Function` | Programmatically set field value |
| `setFieldError` | `Function` | Programmatically set field error |
| `setFieldTouched` | `Function` | Programmatically set field touched state |
| `validateField` | `Function` | Validate a specific field |
| `validateForm` | `Function` | Validate entire form |
| `resetForm` | `Function` | Reset form to initial state |
| `clearErrors` | `Function` | Clear all validation errors |

## 🔧 Validation Rules

### Built-in Validators

```tsx
import { 
  required, 
  email, 
  minLength, 
  maxLength, 
  pattern,
  custom 
} from './src/validation/validators';

const validationRules = {
  email: email('Please enter a valid email address'),
  password: combineRules(
    required('Password is required'),
    minLength(8, 'Password must be at least 8 characters')
  ),
  username: pattern(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  ),
};
```

### Custom Validation

```tsx
const customValidationRules = {
  username: {
    required: true,
    custom: async (value) => {
      const response = await fetch(`/api/check-username/${value}`);
      const { available } = await response.json();
      return available ? null : 'Username is already taken';
    },
  },
};
```

### Predefined Form Rules

```tsx
import { createFormRules } from './src/validation';

// Login form
const loginRules = createFormRules.login();

// Registration form
const registrationRules = createFormRules.registration();

// Contact form
const contactRules = createFormRules.contact();

// Profile form
const profileRules = createFormRules.profile();
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🏗️ Project Structure

```
src/
├── hooks/
│   ├── useFormValidation.ts    # Main hook implementation
│   ├── types.ts                # TypeScript definitions
│   ├── index.ts                # Public exports
│   └── __tests__/              # Hook tests
├── validation/
│   ├── validators.ts           # Validator factories
│   ├── rules.ts                # Predefined rules
│   ├── utils.ts                # Validation utilities
│   ├── index.ts                # Public exports
│   └── __tests__/              # Validation tests
├── components/                 # Example components
└── test/                       # Test setup
```

## 🔒 Security Considerations

- **Client-side validation is for UX only** - Always validate on the server
- **XSS Prevention** - All user input is properly escaped
- **No sensitive data** - Validation state doesn't store sensitive information
- **HTTPS required** - Use HTTPS for async validation requests

## 🚀 Performance

- **Debounced validation** - Prevents excessive validation calls
- **Memoized handlers** - Optimized re-render performance  
- **Promise cancellation** - Prevents race conditions in async validation
- **Memory leak prevention** - Automatic cleanup of resources

## 📝 Examples

See the `src/components/` directory for complete examples:

- `LoginForm.tsx` - Basic login form
- `RegistrationForm.tsx` - Registration with password confirmation
- `ContactForm.tsx` - Contact form with textarea
- `AsyncValidationForm.tsx` - Async validation example

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions and support:
- Create an issue on GitHub
- Check the documentation in `DEVELOPMENT_DOCUMENTATION.md`
- Review the example components

---

Built with ❤️ using React, TypeScript, and Vite
