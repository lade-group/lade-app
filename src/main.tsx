import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Providers & Wrappers
import { BrowserRouter } from 'react-router'
import SentryProvider from './core/wrappers/SentryProvider'
import StyleProvider from './core/wrappers/styles/StyleProvider'
import LoadingWrapper from './core/wrappers/LoadingWrapper'
import { NotificationProvider } from './core/contexts/NotificationContext'
import { APIProvider } from '@vis.gl/react-google-maps'

// Styles
import './styles/index.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.css'

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
                <Router />
              </APIProvider>
            </NotificationProvider>
          </LoadingWrapper>
        </StyleProvider>
      </BrowserRouter>
    </SentryProvider>
  </StrictMode>
)
