import React from 'react'
import { Box, Typography } from '@components'

export const Subtitle = ({ children }) => (
  <Box pb={2}>
    <Typography color="primary.main" fontWeight="medium" variant="h5">
      {children}
    </Typography>
  </Box>
)
