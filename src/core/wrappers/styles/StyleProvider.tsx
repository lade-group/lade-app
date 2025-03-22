import { PropsWithChildren } from 'react'

import ThemeMUIProvider from './ThemeMUIProvider'
// import ThemePrimeProvider from './ThemePrimeProvider'

const StyleProvider = ({ children }: PropsWithChildren) => {
  return (
    // <ThemePrimeProvider>
    <ThemeMUIProvider>{children}</ThemeMUIProvider>
    // </ThemePrimeProvider>
  )
}

export default StyleProvider
