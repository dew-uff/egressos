import React from 'react'
import GlobalStyle from '@styles/global'
import { theme } from '@styles/theme'
import { AuthProvider } from '@context/AuthProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import NextNProgress from 'nextjs-progressbar'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from '@components'
import Head from 'next/head'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <Head>
              <title>Sistema Egressos</title>
            </Head>
            <NextNProgress height={7} color={theme.palette.primary.main} />
            <Component {...pageProps} />
            <ToastContainer />
          </AuthProvider>
          <GlobalStyle />
        </LocalizationProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  )
}

export default App
