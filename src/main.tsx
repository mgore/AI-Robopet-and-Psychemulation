import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent unhandled rejection errors from sandbox HMR websocket disconnection
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = event.reason ? String(event.reason?.message || event.reason) : '';
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('closed without opened') ||
    reasonStr.includes('vite')
  ) {
    event.preventDefault();
  }
});

// Register Service Worker for PWA / Android APK web view capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Service worker registered successfully:', reg.scope);
    }).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

