import TableComponent from '@mui/material/Table'
import TableHeadComponent from '@mui/material/TableHead'
import TableCellComponent from '@mui/material/TableCell'
import TableRowComponent from '@mui/material/TableRow'
import TableBodyComponent from '@mui/material/TableBody'
import TableContainerComponent from '@mui/material/TableContainer'
import IconButton from '@mui/material/IconButton'

import styled from 'styled-components'
import CustomTable from './CustomTable'

const TableContainer = TableContainerComponent
const TableHeader = styled(TableHeadComponent)`
  border-bottom: 1px solid #00000019;
`

const Table = styled(TableComponent)``

const TableCell = styled(TableCellComponent)`
  width: ${({ width }) => width ?? '300'}px;
`
const TableRow = TableRowComponent

const TableBody = TableBodyComponent

const ActionIcon = IconButton

export {
  CustomTable,
  TableHeader,
  Table,
  ActionIcon,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
}
