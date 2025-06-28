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

## 🚀 Development Journey: Building with AI

This project represents a fascinating journey of AI-assisted development, showcasing how modern AI tools can accelerate the creation of production-ready React libraries. Here's the story of how we built this comprehensive form validation hook from concept to completion.

### The Beginning: From Concept to First Prompt

We started with a simple goal: create a reusable React form validation hook that could handle both synchronous and asynchronous validation. Our first prompt to the AI was straightforward: *"Create a React hook for form validation with TypeScript support."* This initial attempt gave us a basic structure, but we quickly realized we needed something more robust for real-world applications.

### Iteration 1: Adding TypeScript and Performance

The first iteration lacked proper TypeScript definitions and performance optimizations. We refined our prompt: *"Create a TypeScript-first React form validation hook with debounced validation and memory leak prevention."* This led to a much better foundation with proper type safety, but we encountered our first major challenge - the hook was re-rendering too frequently and causing performance issues in complex forms.

### Solving Performance Issues

We discovered that our event handlers were being recreated on every render, causing unnecessary re-renders in child components. The AI helped us implement `useCallback` and `useMemo` optimizations, but we had to iterate several times to get the dependency arrays right. One particularly tricky bug involved stale closures in our debounced validation - the AI initially suggested a solution that worked in simple cases but failed when users typed quickly.

### The Async Validation Challenge

Implementing asynchronous validation proved to be our biggest hurdle. Our initial prompt was: *"Add support for async validation with race condition handling."* The first implementation had a critical flaw - it didn't handle race conditions properly, leading to scenarios where an older validation result could overwrite a newer one. We spent considerable time debugging this, eventually implementing a promise-based system with proper cancellation.

### Security Considerations and Edge Cases

As we refined the hook, we realized we needed to address security concerns. We prompted the AI: *"Add XSS prevention and ensure no sensitive data is stored in validation state."* This led us to implement proper input sanitization and ensure that validation errors don't inadvertently expose sensitive information. We also discovered edge cases around form reset functionality that required multiple iterations to resolve.

### Building a Comprehensive Test Suite

Testing proved crucial for maintaining code quality. We started with basic unit tests but quickly realized we needed comprehensive coverage. Our prompt evolved to: *"Create comprehensive tests covering all hook functionality, edge cases, and async scenarios with proper mocking."* The AI helped us implement tests for debounced validation, async race conditions, memory leak prevention, and error boundary scenarios. We encountered several testing challenges, particularly around fake timers and async validation mocking.

### Creating Reusable Validation Rules

To make the hook truly useful, we needed a library of common validation rules. We prompted: *"Create a comprehensive set of reusable validators for common form fields like email, password, phone numbers."* This led to the creation of our validator factory system, but we had to iterate multiple times to get the composition pattern right. The AI initially suggested a more complex inheritance-based approach that we simplified into the current functional composition system.

### Documentation and Developer Experience

Writing comprehensive documentation was crucial for adoption. We used AI to help generate API documentation, usage examples, and troubleshooting guides. The challenge was ensuring the documentation stayed in sync with the code as we made changes. We implemented a documentation-driven development approach where we would update docs first, then implement features to match.

### Performance Optimization Deep Dive

During development, we discovered several performance bottlenecks. The debouncing mechanism was initially implemented with `setTimeout`, but this caused issues with rapid user input. We refined it to use a more sophisticated approach with cleanup functions. Memory leak prevention required careful attention to cleanup in `useEffect` hooks, especially for async operations that might complete after component unmount.

### Cross-Platform Compatibility

Ensuring the hook worked across different React environments (web, React Native, server-side rendering) required additional considerations. We had to abstract away DOM-specific code and ensure our validation logic was environment-agnostic. This led to several refactoring iterations and additional test scenarios.

### The Final Polish

The last phase involved extensive testing with real-world scenarios, performance profiling, and code review. We discovered subtle bugs in edge cases like rapid form submission, network failures during async validation, and browser autofill interactions. Each issue required careful analysis and targeted fixes.

### Key Learnings and Recommendations

1. **Start with comprehensive TypeScript types** - This saved us countless debugging hours later
2. **Implement performance optimizations early** - `useCallback` and `useMemo` are crucial for form hooks
3. **Test async scenarios thoroughly** - Race conditions and promise cancellation are easy to get wrong
4. **Consider memory leaks from the beginning** - Cleanup is critical in React hooks
5. **Document as you build** - Keeping docs in sync prevents confusion later
6. **Use real-world testing scenarios** - Edge cases often reveal fundamental design flaws

### Prompts That Worked Well

- *"Create a TypeScript-first React hook with comprehensive error handling"*
- *"Implement debounced validation with proper cleanup and memory leak prevention"*
- *"Add async validation support with race condition handling and promise cancellation"*
- *"Create comprehensive test suite with edge case coverage and async mocking"*
- *"Optimize performance using React best practices and memoization"*

### Common Pitfalls We Encountered

- **Stale closures in debounced functions** - Required careful dependency management
- **Race conditions in async validation** - Needed promise cancellation and request deduplication
- **Memory leaks from uncleaned timeouts** - Required comprehensive cleanup in useEffect
- **Performance issues from unnecessary re-renders** - Solved with proper memoization
- **Type safety gaps in generic scenarios** - Required advanced TypeScript patterns

This journey demonstrates that while AI can significantly accelerate development, building production-ready code still requires careful iteration, testing, and refinement. The key is knowing how to prompt effectively and being prepared to debug and optimize the generated solutions.

---

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



Built with ❤️ using React, TypeScript, Vite, and AI assistance
