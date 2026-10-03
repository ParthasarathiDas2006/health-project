import React from 'react';
import ReactDOM from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';
import { registerServiceWorker } from './utils/pwaRegister.js';
import { initPhcDb } from './utils/phcIndexedDb.js';

// Initialize PWA Service Worker & Offline IndexedDB Gateway for Rural PHCs
registerServiceWorker();
initPhcDb().catch((err) => console.warn('[PWA/DB Init]', err));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

