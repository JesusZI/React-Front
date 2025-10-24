import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const token = useSelector(s => s.auth.token)

  if (!token) return null
  useEffect(() => {
  
    let delegatedHandler = null;
    let pollHandle = null;
    let destroyed = false;

    const ensureInit = () => {
      const el = document.getElementById('layout-menu');
      if (!el) return false;

      if (window && window.Menu && !el.menuInstance) {
        try {
          const menu = new window.Menu(el, {
            orientation: el.classList.contains('menu-horizontal') ? 'horizontal' : 'vertical',
            closeChildren: false,
            showDropdownOnHover: true
          });
          if (window.Helpers) window.Helpers.mainMenu = menu;
        } catch (e) {
          // ignore
        }
      }
      return true;
    };

    delegatedHandler = (ev) => {
      const toggle = ev.target.closest && ev.target.closest('.layout-menu-toggle');
      if (!toggle) return;
      ev.preventDefault();

      try {
        if (window.Helpers && typeof window.Helpers.toggleCollapsed === 'function') {
          window.Helpers.toggleCollapsed();
        } else {
          document.documentElement.classList.toggle('layout-menu-collapsed');
        }
      } catch (e) {
        document.documentElement.classList.toggle('layout-menu-collapsed');
      }

      setTimeout(() => {
        try { if (window.Helpers && typeof window.Helpers.update === 'function') window.Helpers.update(); } catch (e) {}
        try {
          const elMenu = document.getElementById('layout-menu');
          if (elMenu && elMenu.menuInstance && typeof elMenu.menuInstance.update === 'function') elMenu.menuInstance.update();
        } catch (e) {}
      }, 50);
    };

    document.addEventListener('click', delegatedHandler);

    const start = Date.now();
    const timeout = 3000; // ms
    const tryInit = () => {
      if (destroyed) return;
      const ok = ensureInit();
      if (ok) {
        if (!(window && window.Menu) && Date.now() - start < timeout) {
          return false;
        }
        return true;
      }
      return false;
    };

    pollHandle = setInterval(() => {
      if (tryInit() || Date.now() - start > timeout) {
        clearInterval(pollHandle);
        pollHandle = null;
      }
    }, 150);

    tryInit();

    
    return () => {
      destroyed = true;
      if (pollHandle) {
        clearInterval(pollHandle);
        pollHandle = null;
      }
      document.removeEventListener('click', delegatedHandler);
      const el2 = document.getElementById('layout-menu');
      if (el2 && el2.menuInstance && typeof el2.menuInstance.destroy === 'function') {
        try { el2.menuInstance.destroy(); } catch (e) {}
        el2.menuInstance = null;
      }
    };
  }, []);

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Menu Sidebar */}
        <Sidebar />

        {/* Layout container */}
        <div className="layout-page">
          {/* Navbar */}
          <Navbar />

          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>

            {/* Footer */}
            <Footer />

            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="layout-overlay layout-menu-toggle"></div>
      
      {/* Drag Target Area To SlideIn Menu On Small Screens */}
      <div className="drag-target"></div>
    </div>
  );
};

export default MainLayout;