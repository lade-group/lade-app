import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Providers & Wrappers
import { BrowserRouter } from 'react-router'
import SentryProvider from './core/wrappers/SentryProvider'
import StyleProvider from './core/wrappers/styles/StyleProvider'
import LoadingWrapper from './core/wrappers/LoadingWrapper'
import { NotificationProvider } from './core/contexts/NotificationContext'
import { APIProvider } from '@vis.gl/react-google-maps'

// Context

import AuthProvider from './core/contexts/AuthContext'
import ClientProvider from './core/contexts/ClientContext'
// Styles

import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.css'
import './styles/index.css'

import { initSentry } from './lib/Sentry'
import Router from './router/Router'

initSentry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryProvider>
      <BrowserRouter>
        <StyleProvider>
          <LoadingWrapper>
            <NotificationProvider>
              <APIProvider apiKey={'AIzaSyAoA48PKTl6pgEa0P5lILzXNbZu2m2PjZs'}>
                <AuthProvider>
                  <ClientProvider>
                    <Router />
                  </ClientProvider>
                </AuthProvider>
              </APIProvider>
            </NotificationProvider>
          </LoadingWrapper>
        </StyleProvider>
      </BrowserRouter>
    </SentryProvider>
  </StrictMode>
)
