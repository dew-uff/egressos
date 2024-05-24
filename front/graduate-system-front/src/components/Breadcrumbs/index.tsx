import React from 'react'
import { Button, Typography } from '@mui/material'
import BC from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import { BreadcrumbOptions } from './types'

interface Props {
  breadcrumbs: BreadcrumbOptions[]
}

export const Breadcrumbs = ({ breadcrumbs }: Props) => {
  const itensWithoutLast = breadcrumbs.slice(0, breadcrumbs.length - 1)
  const lastItem = breadcrumbs[breadcrumbs.length - 1]

  return (
    <BC aria-label="breadcrumb">
      {itensWithoutLast.map((breadcrumb, index) => (
        <Button
          sx={{
            backgroundColor: 'transparent',
            padding: 0,
            '&:hover': { backgroundColor: 'transparent' },
          }}
          key={index}
          href={breadcrumb.href}
          LinkComponent={Link}
        >
          {breadcrumb.name}
        </Button>
      ))}
      <Typography color="text.primary" variant="subtitle2">
        {lastItem.name.toUpperCase()}
      </Typography>
    </BC>
  )
}
