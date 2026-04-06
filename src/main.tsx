// Polyfill crypto.randomUUID for browsers/environments that don't support it (needed by Parse SDK)
(function() {
  const randomUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Try to polyfill on multiple possible global objects
  const globals = [globalThis, window, self];
  for (const g of globals) {
    if (g) {
      try {
        if (!g.crypto) {
          g.crypto = {} as any;
        }
        if (!g.crypto.randomUUID) {
          (g.crypto as any).randomUUID = randomUUID;
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }
})();

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('[Main] Starting app...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[Main] Root element not found!");
} else {
  try {
    console.log('[Main] Creating root...');
    const root = createRoot(rootElement);
    console.log('[Main] Rendering App...');
    root.render(<App />);
    console.log("[Main] ✅ App rendered successfully");
  } catch (error) {
    console.error("[Main] ❌ Error rendering app:", error);
    rootElement.innerHTML = `<div style="color:red;padding:20px;"><h1>App Error</h1><pre>${error}</pre></div>`;
  }
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().catch((error) => {
        console.error('Service worker unregister failed:', error);
      });
    });
  });
}
