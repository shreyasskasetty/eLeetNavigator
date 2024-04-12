import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

import ReactDOM from 'react-dom/client'
import './index.css'
import {router} from './routes.tsx'

import {
  RouterProvider,
} from "react-router-dom";
import { googleOAuthConfig } from './config.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
     <GoogleOAuthProvider clientId={googleOAuthConfig.clientId}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
  </React.StrictMode>,
)
