import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

import ReactDOM from 'react-dom/client'
import './index.css'
import {router} from './routes.tsx'
import {
  RouterProvider,
} from "react-router-dom";
import { googleOAuthConfig } from './config.tsx';
import Navbar from './components/Navbar.tsx';
import LoginModal from './components/LoginModal.tsx';
import { Provider } from 'react-redux';
import {store, persistor} from './store/index.ts';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId={googleOAuthConfig.clientId}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navbar />
            <LoginModal />
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
  </React.StrictMode>,
)
