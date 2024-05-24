import { DatePicker as DP } from '@mui/x-date-pickers/DatePicker'
import React from 'react'

export const DatePicker = (props: any) => (
  <DP
    slotProps={{
      textField: {
        variant: 'outlined',
      },
    }}
    {...props}
  />
)
