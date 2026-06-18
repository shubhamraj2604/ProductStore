import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'; 

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn('⚠️ Missing VITE_CLERK_PUBLISHABLE_KEY - Authentication features will not work. Please add it to your .env file.');
}

// Use a placeholder key if none is provided (Clerk will show errors but app won't crash)
const clerkKey = PUBLISHABLE_KEY || 'pk_test_placeholder_key_replace_with_real_key';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
