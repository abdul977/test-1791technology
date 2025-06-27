// ESLint configuration for React TypeScript project
// Import ESLint core JavaScript rules
import js from '@eslint/js'
// Import global variables definitions for different environments
import globals from 'globals'
// Import React Hooks specific linting rules
import reactHooks from 'eslint-plugin-react-hooks'
// Import React Fast Refresh compatibility rules
import reactRefresh from 'eslint-plugin-react-refresh'
// Import TypeScript ESLint integration
import tseslint from 'typescript-eslint'
// Import global ignore patterns configuration
import { globalIgnores } from 'eslint/config'

// Export ESLint configuration using TypeScript ESLint config format
export default tseslint.config([
  // Ignore dist directory from linting (build output)
  globalIgnores(['dist']),
  {
    // Apply rules to TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    // Extend from recommended configurations
    extends: [
      // ESLint recommended JavaScript rules
      js.configs.recommended,
      // TypeScript ESLint recommended rules
      tseslint.configs.recommended,
      // Latest React Hooks rules for proper hook usage
      reactHooks.configs['recommended-latest'],
      // React Fast Refresh rules for Vite compatibility
      reactRefresh.configs.vite,
    ],
    // Language-specific options
    languageOptions: {
      // Use ECMAScript 2020 features
      ecmaVersion: 2020,
      // Include browser global variables (window, document, etc.)
      globals: globals.browser,
    },
  },
])
