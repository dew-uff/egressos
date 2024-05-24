import React, { Fragment, ReactElement } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@components'
import { Fields, TypographyTableCell } from '@styles/index.style'

type Align = 'inherit' | 'left' | 'center' | 'right' | 'justify'

interface ColumnDetail {
  name: string
  align?: Align
  width?: string
}

interface RowDetails {
  body?: string | ReactElement
  align?: Align
  width?: string
}

interface Props {
  columns: ColumnDetail[]
  rows: RowDetails[][]
}

const CustomTable = ({ columns, rows }: Props) => {
  const isString = item => typeof item === 'string'

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableCell
                key={column.name}
                align={column.align ?? 'left'}
                width={column.width ?? 'auto'}
              >
                <Fields>{column.name}</Fields>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows?.map((row, index) => (
            <TableRow key={index}>
              {row.map((field, i) => (
                <TableCell key={`${index}-${i}`} align={field.align ?? 'left'}>
                  {isString(field.body) ? (
                    <TypographyTableCell>{field.body as string}</TypographyTableCell>
                  ) : (
                    <Fragment>{field.body} </Fragment>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CustomTable
