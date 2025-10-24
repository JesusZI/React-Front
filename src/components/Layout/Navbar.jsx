import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearAuth } from '../../store/slices/authSlice'

const Navbar = () => {
	const modules = useSelector(s => s.auth.modules || [])
	const [isSmall, setIsSmall] = useState(() => {
		if (typeof window !== 'undefined' && window.Helpers && window.Helpers.LAYOUT_BREAKPOINT) {
			return window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT
		}
		return typeof window !== 'undefined' ? window.innerWidth < 1200 : false
	})

	useEffect(() => {
		const onResize = () => {
			const bp = window.Helpers?.LAYOUT_BREAKPOINT || 1200
			setIsSmall(window.innerWidth < bp)
		}
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])

	const dispatch = useDispatch()
	const navigate = useNavigate()

	
	useEffect(() => {
		const instances = []
		if (typeof window !== 'undefined' && window.bootstrap && window.bootstrap.Tooltip) {
			document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
				try { instances.push(new window.bootstrap.Tooltip(el)) } catch(e) { /* ignore */ }
			})
		}
		return () => { instances.forEach(i => i && i.dispose && i.dispose()) }
	}, [isSmall])

	
	const renderModuleLinks = () => {
		const iconSizeStyle = { fontSize: '1.35rem', lineHeight: 1 }
		const icons = (
			<>
				<li className="nav-item me-2">
					<Link to="/welcome" className="nav-link px-2" aria-label="Welcome" title="Welcome" data-bs-toggle="tooltip">
						<i className="bx bx-home bx-lg" style={iconSizeStyle} aria-hidden="true"></i>
					</Link>
				</li>
				<li className="nav-item me-2">
					<Link to="/devices" className="nav-link px-2" aria-label="Devices" title="Devices" data-bs-toggle="tooltip">
						<i className="bx bx-mobile bx-lg" style={iconSizeStyle} aria-hidden="true"></i>
					</Link>
				</li>
				<li className="nav-item me-2">
					<Link to="/external" className="nav-link px-2" aria-label="External" title="External" data-bs-toggle="tooltip">
						<i className="bx bx-link-external bx-lg" style={iconSizeStyle} aria-hidden="true"></i>
					</Link>
				</li>

				
					<li className="nav-item me-2">
						<button type="button" className="nav-link px-2" aria-label="Logout" title="Logout" data-bs-toggle="tooltip" onClick={() => {
							try {
								dispatch(clearAuth())
								localStorage.removeItem('rawModules')
								navigate('/login')
							} catch (e) { /* ignore */ }
						}} style={{ border: 'none', background: 'transparent' }}>
							<i className="bx bx-power-off bx-lg" style={iconSizeStyle} aria-hidden="true"></i>
						</button>
					</li>
			</>
		)

		if (isSmall) {
			return (
				<>
					{icons}
					<li className="nav-item dropdown me-2">
						<a className="nav-link dropdown-toggle no-caret" href="#" id="nav-modules" data-bs-toggle="dropdown" aria-expanded="false">
							<i className="bx bx-menu"></i>
						</a>
						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="nav-modules">
							{modules && modules.length ? modules.map(m => {
								const cfg = m.setting_module_config || {}
								const route = cfg.route ? `/${cfg.route}` : cfg.key ? `/${cfg.key}` : (m.path ? `/${m.path}` : '#')
								const label = cfg.key || m.module || 'Module'
								return (
									<li key={m.id_module || label}>
										<Link className="dropdown-item" to={route}>{label}</Link>
									</li>
								)
							}) : (
								<li><span className="dropdown-item">No hay módulos</span></li>
							)
						}</ul>
					</li>
				</>
			)
		}

		return icons
	}

	return (
		<nav className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme" id="layout-navbar">
			<div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
				<div className="navbar-nav align-items-center">
					<div className="nav-item dropdown me-2 me-xl-0">
					
					
					</div>
				</div>

				<ul className="navbar-nav flex-row align-items-center ms-md-auto w-100 justify-content-center justify-content-md-end">
					{renderModuleLinks()}

				
					
				</ul>
			</div>
		</nav>
	)
}

export default Navbar

