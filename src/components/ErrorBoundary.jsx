import React from 'react'
import { Box, Typography, Button } from '@mui/material'

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error){
    return { hasError: true, error }
  }
  componentDidCatch(error, info){
    console.error('ErrorBoundary caught', error, info)
  }
  render(){
    if(this.state.hasError){
      return (
        <Box sx={{ p:2 }}>
          <Typography variant="h6">Ha ocurrido un error en la aplicación</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', my: 1 }}>{String(this.state.error)}</Typography>
          <Button variant="contained" onClick={()=>window.location.reload()}>Recargar</Button>
        </Box>
      )
    }
    return this.props.children
  }
}
