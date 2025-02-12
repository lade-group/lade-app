import * as Sentry from '@sentry/react'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development'

interface SentryConfig {
  dsn: string
  environment: string
  tracesSampleRate: number
  replaysSessionSampleRate: number
  replaysOnErrorSampleRate: number
}

const config: SentryConfig = {
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
}

export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not found. Error tracking is disabled.')
    return
  }

  Sentry.init({
    ...config,
  })
}

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  })
}

export const captureMessage = (message: string, level?: Sentry.SeverityLevel) => {
  Sentry.captureMessage(message, level)
}
