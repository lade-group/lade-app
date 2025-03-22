import { PropsWithChildren } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#272B4B',
    },
    secondary: {
      main: '#E7E9F4',
    },
    error: {
      main: red.A400,
    },
  },
})

const ThemeMUIProvider = ({ children }: PropsWithChildren) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default ThemeMUIProvider
