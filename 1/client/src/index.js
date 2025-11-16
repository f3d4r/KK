import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style/common.css';
import './style/reset.css';
import { UserProvider } from './components/context/UseContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />     
    </UserProvider>
  </React.StrictMode>
);