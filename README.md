# React Form Validation Hook

A comprehensive, TypeScript-first React hook for form validation with support for synchronous and asynchronous validation, debouncing, and flexible validation rules.

## 🌐 Live Demo

Check out the live demo: [https://test-1791technology.vercel.app/](https://test-1791technology.vercel.app/)

## Features

- 🚀 **TypeScript Support** - Fully typed with comprehensive type definitions
- ⚡ **Flexible Validation** - Support for synchronous and asynchronous validation rules
- 🎯 **Multiple Validation Triggers** - Validate on change, blur, or submit
- ⏱️ **Debounced Validation** - Configurable debouncing to prevent excessive validation calls
- 🔄 **Async Validation** - Built-in support for async validation (e.g., checking username availability)
- 📝 **Rich Validation Rules** - Pre-built validators for common use cases
- 🎨 **Demo Forms** - Multiple example forms showcasing different validation scenarios
- 🧪 **Well Tested** - Comprehensive test suite with Vitest and Testing Library

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-form-validation-hook

# Install dependencies
npm install

# Start development server
npm run dev
```

### Basic Usage

```tsx
import { useFormValidation } from './hooks/useFormValidation';
import { required, email, minLength } from './validation/validators';

function LoginForm() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormValidation({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: [required(), email()],
      password: [required(), minLength(6)],
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const onSubmit = async (formValues) => {
    console.log('Form submitted:', formValues);
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
}
```

## API Reference

### useFormValidation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialValues` | `FormValues` | `{}` | Initial form field values |
| `validationRules` | `ValidationRules` | `{}` | Validation rules for each field |
| `validateOnChange` | `boolean` | `false` | Validate fields on every change |
| `validateOnBlur` | `boolean` | `true` | Validate fields when they lose focus |
| `validateOnSubmit` | `boolean` | `true` | Validate all fields on form submission |
| `debounceMs` | `number` | `300` | Debounce delay for validation in milliseconds |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `values` | `FormValues` | Current form field values |
| `errors` | `FormErrors` | Current validation errors |
| `touched` | `object` | Fields that have been interacted with |
| `isValid` | `boolean` | Whether the form is currently valid |
| `isSubmitting` | `boolean` | Whether the form is currently being submitted |
| `isDirty` | `boolean` | Whether the form has been modified |
| `handleChange` | `function` | Handler for input change events |
| `handleBlur` | `function` | Handler for input blur events |
| `handleSubmit` | `function` | Handler for form submission |
| `setFieldValue` | `function` | Programmatically set a field value |
| `setFieldError` | `function` | Programmatically set a field error |
| `resetForm` | `function` | Reset form to initial state |
| `validateField` | `function` | Manually validate a specific field |
| `validateForm` | `function` | Manually validate the entire form |

## Built-in Validators

The library includes several pre-built validators:

- `required()` - Field is required
- `email()` - Valid email format
- `minLength(length)` - Minimum string length
- `maxLength(length)` - Maximum string length
- `pattern(regex, message)` - Custom regex pattern
- `numeric()` - Numeric values only
- `url()` - Valid URL format

## Demo Forms

The project includes several demo forms showcasing different validation scenarios:

1. **Login Form** - Basic email/password validation
2. **Registration Form** - Complex form with multiple validation rules
3. **Contact Form** - Form with optional and required fields
4. **Async Validation Form** - Demonstrates async validation for username/email availability

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Technology Stack

- **React 19** - Latest React version
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Vitest** - Fast unit testing framework
- **Testing Library** - React testing utilities
- **ESLint** - Code linting and formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
