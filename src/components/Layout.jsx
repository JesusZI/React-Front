import React from 'react'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import MainLayout from './Layout/MainLayout'

export default function Layout(){

  return (
    <MainLayout>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </MainLayout>
  )
}
