/**
 * Test setup file for Vitest testing environment
 * Configures global test utilities and DOM matchers
 * This file is automatically loaded before running tests (configured in vite.config.ts)
 */

// Import Jest DOM matchers for enhanced DOM testing assertions
// Provides additional matchers like toBeInTheDocument(), toHaveClass(), etc.
import '@testing-library/jest-dom'
