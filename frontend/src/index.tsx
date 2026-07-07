// src/index.tsx - удалите импорт profile.css
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'; // только этот импорт
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);