import { createTheme } from '@mui/material'
import { cyan, teal } from '@mui/material/colors'
import { ptBR } from '@mui/material/locale'

export const theme = createTheme(
  {
    palette: {
      primary: teal,
      secondary: cyan,
      background: { default: '#121214' },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
      divider: '#BDBDBD',
    },
    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
    components: {},
  },
  ptBR
)
// export const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#51be78',
//     },
//     secondary: {
//       main: '#3c3c3c',
//     },
//   },
// })
