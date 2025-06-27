// React application entry point
// Import React's StrictMode for development warnings and checks
import { StrictMode } from 'react'
// Import createRoot for React 18+ concurrent rendering
import { createRoot } from 'react-dom/client'
// Import BrowserRouter for client-side routing
import { BrowserRouter } from 'react-router-dom'
// Import global CSS styles
import './index.css'
// Import main App component
import App from './App.tsx'

// Create React root and render the application
// Get the root DOM element and assert it exists (non-null assertion)
createRoot(document.getElementById('root')!).render(
  // StrictMode enables additional checks and warnings in development
  <StrictMode>
    {/* BrowserRouter enables client-side routing using HTML5 history API */}
    <BrowserRouter>
      {/* Main application component */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
