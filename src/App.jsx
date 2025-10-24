import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import Devices from './pages/Devices'
import External from './pages/External'
import Layout from './components/Layout'
import ModulePlaceholder from './pages/ModulePlaceholder'
import { useSelector } from 'react-redux'

export default function App(){
  const token = useSelector(s => s.auth.token)
  const modules = useSelector(s => s.auth.modules || [])

  const moduleRoutes = modules
    .filter(m => m && (m.setting_module_config?.route || m.route || m.path))
    .map(m => ({
      ...m,
      url: ('/' + ((m.setting_module_config?.route) || m.route || m.path) || '').replace(/\\/g, '/').replace(/^\/+/g, '/').toLowerCase()
    }))
    .reduce((acc, cur) => { if(!acc.find(x => x.url === cur.url)) acc.push(cur); return acc }, [])

  return (
    <Routes>
    
      <Route path="/login" element={<Login />} />

    
      <Route element={token ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="/welcome" replace />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="devices" element={<Devices />} />
        <Route path="external" element={<External />} />

        {moduleRoutes.map(m => (
          <Route key={m.url} path={m.url.replace(/^\//, '')} element={<ModulePlaceholder title={m.name || m.code} route={m.route} path={m.path} />} />
        ))}
      </Route>
    
      <Route path="*" element={token ? <Navigate to="/welcome" /> : <Navigate to="/login" />} />
    </Routes>
  )
}
