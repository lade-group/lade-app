import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Providers & Wrappers
import { BrowserRouter } from 'react-router'
import SentryProvider from './core/wrappers/SentryProvider'
import StyleProvider from './core/wrappers/styles/StyleProvider'
import LoadingWrapper from './core/wrappers/LoadingWrapper'
import { NotificationProvider } from './core/contexts/NotificationContext'

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
              <Router />
            </NotificationProvider>
          </LoadingWrapper>
        </StyleProvider>
      </BrowserRouter>
    </SentryProvider>
  </StrictMode>
)
