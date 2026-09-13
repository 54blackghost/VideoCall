import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'stream-chat-react/dist/css/v2/index.css';
import './index.css';
import {  QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ClerkProvider } from "@clerk/react";
import App from './App.jsx';


import {BrowserRouter } from 'react-router';


const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
        <BrowserRouter >
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter >
    </ClerkProvider>
  </StrictMode>
)
  
