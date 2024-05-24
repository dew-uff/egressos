'use client'

import React from 'react'
import { ThemeProvider } from '@mui/material'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { theme } from '@styles/theme'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AuthProvider } from '@context/AuthProvider'
import GlobalStyle from '@styles/global'

import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

const RootLayout = ({ children }) => {
  return (
    <html lang="pt" className={roboto.className}>
      <body>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <AuthProvider>{children}</AuthProvider>
              <GlobalStyle />
            </LocalizationProvider>
          </StyledThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
