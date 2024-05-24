import { Theme } from '@utils/enums'
import { Grid } from '@components'
import React from 'react'

const theme = {
  gray: {
    backgroundColor: '#F8F3FF',
  },
  white: {
    backgroundColor: '#FFF',
  },
}

type AppProps = {
  themeName: Theme
  children: React.ReactNode
}

export const Wrapper = ({ themeName, children }: AppProps) => (
  <Grid
    display="block"
    position="relative"
    width="100%"
    height="100%"
    sx={{ width: '100%', backgroundColor: theme[themeName].backgroundColor }}
    container
  >
    {children}
  </Grid>
)

export const Content = ({ children }) => (
  <Grid item overflow="auto" maxHeight="100vh+88px" padding="0 50px 0 50px" flexDirection="column">
    {children}
  </Grid>
)
