/// <reference types="vitest" />
// Vite configuration file for React TypeScript project with Vitest integration

// Import Vite's configuration function
import { defineConfig } from 'vite'
// Import React plugin for Vite with Fast Refresh support
import react from '@vitejs/plugin-react'

// Vite configuration - see https://vite.dev/config/
export default defineConfig({
  base: '/',
  // Plugins to enhance Vite functionality
  plugins: [
    // React plugin enables JSX transformation and Fast Refresh
    react()
  ],
  // Vitest testing configuration
  test: {
    // Enable global test functions (describe, it, expect) without imports
    globals: true,
    // Use jsdom environment to simulate browser DOM for React component testing
    environment: 'jsdom',
    // Setup file to configure testing environment and global test utilities
    setupFiles: './src/test/setup.ts',
  },
})
