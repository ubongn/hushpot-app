import './midnight/resilientFetch'; // MUST run first: patches WASM streaming before midnight-js loads
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Install the resumable-chunk WASM patch before anything boots the ledger.
import { patchWasmStreaming } from './midnight/resilientFetch';
patchWasmStreaming();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
