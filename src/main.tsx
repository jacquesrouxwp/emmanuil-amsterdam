import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTelegram, getTelegramUser } from '@/lib/telegram';
import { subscribe } from '@/lib/api';
import '@/styles/globals.css';

initTelegram();

// Subscribe user for push notifications
const tgUser = getTelegramUser();
if (tgUser?.id) {
  subscribe(tgUser.id, tgUser.first_name || '');
}

// Register service worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
