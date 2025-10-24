import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Menu from '../Menu';


const Sidebar = () => {
  const modules = useSelector((s) => s.auth.modules || [])
  const [isMdUp, setIsMdUp] = useState(() => {
    if (typeof window !== 'undefined' && window.Helpers && window.Helpers.LAYOUT_BREAKPOINT) {
      return window.innerWidth >= window.Helpers.LAYOUT_BREAKPOINT
    }
    return typeof window !== 'undefined' ? window.innerWidth >= 1200 : true
  })

  useEffect(() => {
    const onResize = () => {
      const bp = window.Helpers?.LAYOUT_BREAKPOINT || 1200
      setIsMdUp(window.innerWidth >= bp)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])


  let effective = modules
  if ((!effective || effective.length === 0) && typeof window !== 'undefined') {
    try {
      const raw = JSON.parse(localStorage.getItem('rawModules') || 'null')
      if (Array.isArray(raw) && raw.length > 0) effective = raw
    } catch (e) { /* ignore */ }
  }


  if (!isMdUp) return null

  return (
    <div>
      <Menu isMdUp={true} modules={effective} onClose={() => {}} drawerWidth={280} />
    </div>
  )
}

export default Sidebar;
