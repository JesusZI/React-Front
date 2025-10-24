import React, { useEffect, useState, useRef } from 'react'
import { Box, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert, Typography } from '@mui/material'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function Devices(){
  const token = useSelector(s => s.auth.token)
  const [items, setItems] = useState([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [rawResponse, setRawResponse] = useState(null)
  const debounceRef = useRef(null)

  const load = async (reset=false) => {
    if(!token) return
    setLoading(true)
    setError(null)
    try{
      const res = await axios.get('https://api.qa.myintelli.net/v1/devices',{
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 5, offset: reset ? 0 : offset, search: search || undefined }
      })
      const resData = res.data
      

      let data = []
      let serverLimit = 5
      let serverOffset = 0
      let serverCount = null

      if (Array.isArray(resData)) {
        data = resData
      } else if (resData && Array.isArray(resData.data)) {
        data = resData.data
      } else if (resData && resData.data && Array.isArray(resData.data.results)) {
        data = resData.data.results
        serverLimit = Number(resData.data.limit ?? serverLimit)
        serverOffset = Number(resData.data.offset ?? serverOffset)
        serverCount = resData.data.count != null ? Number(resData.data.count) : null
      } else if (resData && Array.isArray(resData.items)) {
        data = resData.items
      } else if (resData && resData.devices && Array.isArray(resData.devices)) {
        data = resData.devices
      } else if (resData && typeof resData === 'object') {
       
        if (resData.data && typeof resData.data === 'object') {
          const arr = Object.values(resData.data).find(v => Array.isArray(v))
          if (arr) data = arr
        }
        if (data.length === 0) {
          const arrTop = Object.values(resData).find(v => Array.isArray(v))
          if (arrTop) data = arrTop
        }
      }

      if (reset) setItems(data)
      else setItems(prev => [...prev, ...data])
      const fetched = data.length

     
      const pageSize = serverLimit || 5
      
      setHasMore(fetched === pageSize)

      if (reset) {
      
        setOffset(pageSize)
      } else {
        
        setOffset(prev => prev + pageSize)
      }
    }catch(err){
      console.error('Devices load error', err)
      setError(err.response?.data?.message || err.message || 'Error loading data')
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load(true) }, [token])

  useEffect(()=>{
    if(debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(()=>{ load(true) }, 500)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="card">
      <div className="card-body">
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Devices</Typography>
          {!token && <Alert severity="warning">You must sign in to view devices</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Search" fullWidth value={search} onChange={e => setSearch(e.target.value)} />
          <List>
            {items.length === 0 && !loading && <ListItem><ListItemText primary={<Typography variant="body2">No devices found</Typography>} /></ListItem>}
            {rawResponse && <ListItem><ListItemText primary={<Typography variant="body2">Raw response: {JSON.stringify(rawResponse)}</Typography>} /></ListItem>}
            {items.map((it,i)=> (
              <ListItem key={i} divider>
                <ListItemText 
                  primary={it?.device_name || it?.deviceName || it?.name || `#${i+1}`} 
                  secondary={
                    <>
                      <div>{it?.settings_device?.serial ? `Serial: ${it.settings_device.serial}` : it?.id_device}</div>
                      <div>{it?.device_model ? `Model: ${it.device_model}` : ''}</div>
                    </>
                  } 
                />
              </ListItem>
            ))}
          </List>
          {(() => {
            const isSearching = String(search || '').trim().length > 0
            if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress /></Box>
            if (isSearching) return null
            return (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                {hasMore ? (
                  <a
                    href="#"
                    className={`btn btn-outline-primary${loading ? ' disabled' : ''}`}
                    onClick={(e) => { e.preventDefault(); if (loading) return; load(false); }}
                    aria-disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load more'}
                  </a>
                ) : (
                  <Typography variant="body2">No more devices</Typography>
                )}
              </Box>
            )
          })()}
        </Box>
      </div>
    </div>
  )
}
