import React from 'react'
import styled from 'styled-components'
import { styled as styledMUI } from '@mui/material/styles'
import { Grid, Typography } from '@mui/material'
import { HISTORY_STATUS } from '@modules/Egressos/types'
import { theme } from '@styles/theme'

const fontFamily = 'font-family: Roboto, sans-serif'

export const Content = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ImageLogo = styled.div`
  padding-top: 112px;
`

export const FormInputGroup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 67px;
  margin-bottom: 11px;
`

export const TitleLogin = styled.h1`
  padding-top: 24px;
  padding-bottom: 54px;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 47px;

  color: ${({ theme }) => theme.palette.primary.contrastText};
`

export const Title = styled.h1`
  padding-top: 20px;
  padding-bottom: 20px;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: ${({ theme }) => theme.palette.primary.main};
`

export const PageWrapper = styledMUI(Grid)`
  padding: 20px 20px 50px 50px;
`
export const Label = styled.p`
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 16px;
  line-height: 24px;

  color: ${({ color = theme.palette.text.secondary }) => color};
`
export const ErrorMessage = styled.p`
  padding-left: 24px;
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 15px;
  line-height: 24px;

  color: #cb0000;
`

export const Background = styled.div`
  background: rgba(11, 105, 81, 0.7);
  opacity: 0.99;
  height: 100%;
  width: 100%;
`

const statusColor = {
  [HISTORY_STATUS.PENDING]: '#e11818',
  [HISTORY_STATUS.UPDATED]: '#5BAFC9',
  [HISTORY_STATUS.UPDATED_PARTIALLY]: '#DCB552',
  default: theme.palette.primary.main,
}

export const Fields = styled.p`
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 16px;
  line-height: 24px;

  color: ${({ status }: { status?: string }) => statusColor[status ?? 'default']};
`

interface TableCellProps {
  children: React.ReactNode
  status?: HISTORY_STATUS
  width?: string
}

export const TypographyTableCell = ({ children, status, width = '250px' }: TableCellProps) => (
  <Typography
    sx={{
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      maxWidth: width,
      borderStyle: 'border-box',
      paddingTop: '5px',
      paddingBottom: '15px',
      fontSize: '16px',
      lineHeight: '24px',
      color: status ? statusColor[status] : theme.palette.primary.main,
    }}
  >
    {children}
  </Typography>
)

export const DialogTitleTypography = ({ children }) => (
  <Typography variant="h6" color="primary.main">
    {children}
  </Typography>
)

export const Subtitle = ({ children }) => (
  <Typography color="primary.main" fontWeight="medium" variant="h5">
    {children}
  </Typography>
)
