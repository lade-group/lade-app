import { PropsWithChildren } from 'react'
import * as Sentry from '@sentry/react'

export const SentryProvider = ({ children }: PropsWithChildren) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error }: any) => (
        <div className='error-boundary'>
          <h2>Ha ocurrido un error inesperado</h2>
          <p>{error.message}</p>
        </div>
      )}
      showDialog
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
