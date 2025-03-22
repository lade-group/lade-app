import { PropsWithChildren } from 'react'
import { PrimeReactProvider } from 'primereact/api'

const ThemePrimeProvider = ({ children }: PropsWithChildren) => {
  return <PrimeReactProvider>{children}</PrimeReactProvider>
}

export default ThemePrimeProvider
