import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#0b74ff', light: '#3fa5ff', dark: '#005ecb' },
    secondary: { main: '#00d4c4', light: '#66fff0', dark: '#00a38a' },
    background: { default: '#f3f7fb', paper: '#ffffff' },
    text: { primary: 'rgba(3,18,32,0.9)', secondary: 'rgba(3,18,32,0.6)' }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 }
  },
  components: {
    MuiButton: { styleOverrides: { contained: { textTransform: 'none' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 10 } } }
  }
})

export default theme
