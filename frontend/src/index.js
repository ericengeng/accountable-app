import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router if it's not yet imported in App
import { AuthProvider } from './contexts/AuthContext';  // Ensure the path matches where the AuthProvider is defined

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>

    <AuthProvider>
      <App />
    </AuthProvider>

  </React.StrictMode>
);
