import React from 'react'
import { Typography, Box, Paper, Button } from '@mui/material'

export default function ModulePlaceholder({ title, route, path }){
  return (
    <Paper className="card" sx={{ p:3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h5">{title || 'Módulo'}</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>Ruta: <strong>{route || path || 'N/A'}</strong></Typography>
        </div>
        <Button variant="contained" color="primary">Abrir</Button>
      </Box>
      <Typography variant="body2" sx={{ mt:2 }}>Este es un placeholder generado automáticamente para rutas de módulos.</Typography>
    </Paper>
  )
}
