import React from 'react'
import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function ModulePage(){
  const params = useParams()
  return (
    <Box>
      <Typography variant="h5">Módulo</Typography>
      <Typography variant="body2">Ruta: {window.location.pathname}</Typography>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(params, null, 2)}</pre>
    </Box>
  )
}
