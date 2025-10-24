import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import ModulePage from '../pages/ModulePage'

function normalizeRoute(r){
  if(!r) return null
  return '/' + r.replace(/^\/+/, '').toLowerCase()
}

export default function DynamicRoutes(){
  const modules = useSelector(s => s.auth.modules) || []
  return (
    <>
      {modules.map((m, i) => {
        const route = normalizeRoute(m.route)
        if(!route) return null
        return <Route key={route + i} path={route} element={<ModulePage />} />
      })}
    </>
  )
}
