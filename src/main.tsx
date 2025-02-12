import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { initSentry } from './core/config/Sentry'
import { SentryProvider } from './core/providers/SentryProvider'

import './index.css'
import App from './core/router/Router'

initSentry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SentryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SentryProvider>
  </StrictMode>
)
