import './midnight/resilientFetch'; // MUST run first: patches WASM streaming before midnight-js loads
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Install the resumable-chunk WASM patches before anything boots the ledger.
import { patchWasmStreaming, patchWasmFetch } from './midnight/resilientFetch';
patchWasmFetch(); // intercept bare fetch() of .wasm (the wallet glue's path)
patchWasmStreaming(); // belt & suspenders for streaming-compile callers

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
