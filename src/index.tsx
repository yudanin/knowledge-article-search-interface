import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// To start measuring performance, pass a function to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
reportWebVitals();
