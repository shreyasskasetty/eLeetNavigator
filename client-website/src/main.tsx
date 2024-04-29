import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

import ReactDOM from 'react-dom/client'
import './index.css'
import { googleOAuthConfig } from './config.tsx';

import { Provider } from 'react-redux';
import {store, persistor} from './store/index.ts';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId={googleOAuthConfig.clientId}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
          <App />
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
  </React.StrictMode>,
)
