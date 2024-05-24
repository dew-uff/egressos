import { Grid, SvgIconTypeMap, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { OverridableComponent } from '@mui/types'

interface Props {
  onClick: () => void
  title: string
  subtitle: string
  IconComponent: OverridableComponent<SvgIconTypeMap>
}

export const CardTitle = styled.h4`
  font-weight: normal;
  color: ${({ theme }) => theme.palette.primary.main};
`
const IconWrapper = styled.div`
  padding-top: 10px;
`
export const IconImage = ({ src, alt }) => (
  <IconWrapper>
    <Image fill={false} width={64} height={64} src={src} alt={alt}></Image>
  </IconWrapper>
)

const Card = styled.div`
  border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 5px;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  padding: 30px;
  width: 420px;
  height: 180px;
  transition: all 0.3s ease-out;

  &:hover {
    border-left: 3px solid ${({ theme }) => theme.palette.primary.dark};
    transform: translateY(-4px);
    cursor: pointer;
  }
`

export const CardOptions = ({ onClick, title, subtitle, IconComponent }: Props) => (
  <Card onClick={onClick}>
    <Grid container alignItems="center">
      <Grid item pr={1}>
        <IconComponent sx={{ height: '40px', width: 'auto' }} color={'primary'} />
      </Grid>
      <Grid item xs={10}>
        <CardTitle>{title}</CardTitle>
      </Grid>
      <Grid item pt={2}>
        <Typography>{subtitle}</Typography>
      </Grid>
    </Grid>
  </Card>
)
