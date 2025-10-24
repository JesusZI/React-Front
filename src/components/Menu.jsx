import React, { useMemo, useState, useEffect } from 'react'
import { Drawer } from '@mui/material'

function ModuleItem({ m, onClose }){
  const cfg = m.setting_module_config || {}
  const route = cfg.route ? `/${cfg.route}` : '#'
  const iconVal = cfg.icon || 'bx bx-circle'
  const renderIcon = () => {
    if (typeof iconVal === 'string' && iconVal.toLowerCase().endsWith('.svg')) {
    
      const src = `/assets/img/icons/${iconVal}`
      return <img src={src} alt={cfg.key || m.module} className="menu-icon-svg" />
    }
   
    return <i className={`menu-icon ${iconVal}`}></i>
  }

  return (
    <li className="menu-item">
      <a href="#" className="menu-link" onClick={(e)=>{ e.preventDefault(); if(onClose) onClose(); }}>
        {renderIcon()}
        <div>{cfg.key || m.module}</div>
      </a>
    </li>
  )
}


function MenuNode({ node, onClose, depth = 0 }){
  const [open, setOpen] = useState(false)
  const cfg = node.setting_module_config || {}
  const route = cfg.route ? `/${cfg.route}` : '#'
  const iconClass = cfg.icon || 'bx bx-circle'
  const hasChildren = Array.isArray(node.children) && node.children.length > 0

  const toggle = (e) => { e.preventDefault(); setOpen(v => !v) }

  return (
    <li className={`menu-item${depth === 0 ? ' active' : ''}`}>
      <div className={`menu-link ${hasChildren ? 'menu-toggle' : ''}`} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
         
          {typeof iconClass === 'string' && iconClass.toLowerCase().endsWith('.svg') ? (
            <img src={`/assets/img/icons/${iconClass}`} alt={cfg.key || node.module} className="menu-icon-svg" />
          ) : (
            <i className={`menu-icon ${iconClass}`} aria-hidden="true"></i>
          )}
          <a href="#" onClick={(e)=>{ e.preventDefault(); if(onClose) onClose(); }} style={{ color: 'inherit', textDecoration: 'none' }}>{cfg.key || node.module}</a>
        </div>
        {hasChildren && (
          <button aria-expanded={open} aria-label={`${open ? 'Cerrar' : 'Abrir'} ${cfg.key || node.module}`} onClick={toggle} className="btn btn-sm btn-icon" style={{ border: 'none', background: 'transparent' }}>
            <i className={`bx ${open ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden="true"></i>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul className="menu-sub" role="menu" style={{ paddingLeft: 12 }}>
          {node.children.map(child => (
            <MenuNode key={child.id_module || child.module || child.setting_module_config?.route || Math.random()} node={child} onClose={onClose} depth={depth+1} />
          ))}
        </ul>
      )}
    </li>
  )
}

function Menu({ open = false, onClose = () => {}, isMdUp = false, modules = [], drawerWidth = 280 }){
  const [collapsed, setCollapsed] = useState(typeof document !== 'undefined' && document.documentElement.classList.contains('layout-menu-collapsed'))

  useEffect(() => {
   
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    const target = document.documentElement;
    const obs = new MutationObserver(() => {
      const isCollapsed = target.classList.contains('layout-menu-collapsed')
      setCollapsed(isCollapsed)
    })
    obs.observe(target, { attributes: true, attributeFilter: ['class'] })
   
    setCollapsed(target.classList.contains('layout-menu-collapsed'))
    return () => obs.disconnect()
  }, [])
  const sections = [
    'HEADER', 'SIDEBAR-UP', 'SIDEBAR-CENTER', 'CONFIGURACION-MENU', 'CONFIGURACION-SUB-MENU', 'SIDEBAR-DOWN'
  ]

  
  const sectionIcons = {
    'HEADER': 'bx-home',
    'SIDEBAR-UP': 'bx-list-ul',
    'SIDEBAR-CENTER': 'bx-grid-alt',
    'CONFIGURACION-MENU': 'bx-cog',
    'CONFIGURACION-SUB-MENU': 'bx-sitemap',
    'SIDEBAR-DOWN': 'bx-chevron-down'
  }

  const byPosition = (pos) => (modules || []).filter(m => m?.is_render === 1 && (m.setting_module_config?.position || '') === pos).sort((a,b)=> (a.order||0)-(b.order||0))

  
  const buildForest = (items) => {
    const list = items.slice()

    
    const byId = new Map()
    const byModule = new Map()
    const byRoute = new Map()
    const byKey = new Map()

    list.forEach(m => {
      const idKey = m.id_module != null ? String(m.id_module) : null
      const moduleKey = m.module != null ? String(m.module) : null
      const routeKey = m.setting_module_config?.route ? String(m.setting_module_config.route).replace(/^\/+/, '') : null
      const keyKey = m.setting_module_config?.key ? String(m.setting_module_config.key) : null
      const node = { ...m, children: [] }
      if(idKey) byId.set(idKey, node)
      if(moduleKey) byModule.set(moduleKey, node)
      if(routeKey) byRoute.set(routeKey, node)
      if(keyKey) byKey.set(keyKey, node)
    })

    const roots = []

    const detectParentValue = (m) => {
   
      return m.parent_id ?? m.parent ?? m.id_parent ?? m.setting_module_config?.parent ?? m.setting_module_config?.parent_id ?? m.parentKey ?? null
    }

   
    const resolveParent = (parentVal) => {
      if(parentVal == null) return null
      const p = String(parentVal)
      if(byId.has(p)) return byId.get(p)
      if(byModule.has(p)) return byModule.get(p)
      if(byKey.has(p)) return byKey.get(p)
      
      const maybeRoute = p.replace(/^\/+/, '')
      if(byRoute.has(maybeRoute)) return byRoute.get(maybeRoute)
    
      const lastSeg = maybeRoute.split('/').pop()
      if(byRoute.has(lastSeg)) return byRoute.get(lastSeg)
      return null
    }

   
    list.forEach(m => {
      const nodeKey = m.id_module != null ? String(m.id_module) : (m.setting_module_config?.route ? String(m.setting_module_config.route).replace(/^\/+/, '') : (m.module ? String(m.module) : null))
      const node = (nodeKey && (byId.get(nodeKey) || byRoute.get(nodeKey) || byModule.get(nodeKey))) || { ...m, children: [] }

      const parentVal = detectParentValue(m)
      const parentNode = resolveParent(parentVal)
      if(parentNode && parentNode !== node){
        parentNode.children = parentNode.children || []
        parentNode.children.push(node)
      } else {
        roots.push(node)
      }
    })

    
    const uniqueRoots = []
    const added = new Set()
    const pushRoot = (n) => {
      const k = n.id_module ?? n.setting_module_config?.route ?? n.module
      if(!added.has(k)) { uniqueRoots.push(n); added.add(k) }
    }
    roots.forEach(pushRoot)


    const sortTree = (arr) => arr.sort((a,b)=> (a.order||0)-(b.order||0)).forEach(n => n.children && sortTree(n.children))
    sortTree(uniqueRoots)
    return uniqueRoots
  }

  const renderMenuContent = () => (
    <nav id="layout-menu" role="navigation" aria-label="Main menu" className="layout-menu menu-vertical menu" style={{ height: '100%' }}>
      <div className="app-brand demo">
        <a href="#" className="app-brand-link" onClick={(e)=>e.preventDefault()}>
          <span className="app-brand-logo demo">
            <span className="text-primary">
             
              <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" fill="currentColor" />
                <path d="M3 7l9 5 9-5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <path d="M12 22V7" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              </svg>
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-2">React Demo</span>
        </a>
        <a href="#" className="layout-menu-toggle menu-link text-large ms-auto" onClick={(e)=>e.preventDefault()} aria-label="toggle menu">
          <i className="icon-base bx bx-chevron-left" aria-hidden="true"></i>
        </a>
      </div>

      <div className="menu-inner-shadow" aria-hidden="true"></div>

  <div style={{ padding: 0, overflow: 'auto' }}>
        {sections.map(section => {
          const items = byPosition(section)
     
          const forest = items.length ? buildForest(items) : []
          return (
            <section key={section} aria-labelledby={`menu-section-${section}`} style={{ marginBottom: 8 }}>
             
              <ul className="menu-inner py-1" role="menu">
                <li className="menu-item active">
                  <a href="#" className="menu-link menu-toggle" onClick={(e)=>e.preventDefault()}>
                    <i className={`menu-icon icon-base bx ${sectionIcons[section] || 'bx-grid'}`}></i>
                    <div>{section}</div>
                  </a>

                  {forest.length > 0 ? (
                    <ul className="menu-sub">
                      {forest.map(n => (
                        <MenuNode key={n.id_module || n.module || n.setting_module_config?.route || Math.random()} node={n} onClose={onClose} depth={1} />
                      ))}
                    </ul>
                  ) : (
                    <div style={{ padding: '0 12px 0 12px', color: '#6b7280' }}>No options</div>
                  )}
                </li>
              </ul>
            </section>
          )
        })}
      </div>
    </nav>
  )

  if(isMdUp){
   
    const effectiveWidth = collapsed ? 64 : drawerWidth
    return (
      <div style={{ width: effectiveWidth, position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 1200, overflow: 'hidden', transition: 'width 200ms ease' }}>
        {renderMenuContent()}
      </div>
    )
  }

  return (
    <Drawer open={open} onClose={onClose} ModalProps={{ keepMounted: true }} PaperProps={{ sx: { width: drawerWidth } }}>
      <div style={{ width: drawerWidth }}>
        {renderMenuContent()}
      </div>
    </Drawer>
  )
}
export default Menu
export { Menu as SideMenu }
