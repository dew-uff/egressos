import React from 'react'
import { AppProps } from 'next/app'
import GlobalStyle from '../src/styles/global'
import { ThemeProvider } from 'styled-components'
import theme from '../src/styles/theme'
import { AuthProvider } from '../src/api/AuthProvider'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default MyApp
