import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/app/App';
import { ErrorBoundary } from './src/app/ErrorBoundary';
import './src/index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
