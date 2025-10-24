import { useDispatch } from 'react-redux';
import { clearAuth } from '../store/slices/authSlice';

const Toolbar = ({ onMenuToggle }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem('rawModules');
  };

  return (
    <nav className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
      id="layout-navbar">
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
        <a className="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)" onClick={onMenuToggle}>
          <i className="icon-base bx bx-menu icon-md"></i>
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
        <div className="navbar-nav align-items-center">
          <div className="nav-item dropdown me-2 me-xl-0">
            <a className="nav-link dropdown-toggle hide-arrow"
              id="nav-theme"
              href="javascript:void(0);"
              data-bs-toggle="dropdown">
              <i className="icon-base bx bx-sun icon-md theme-icon-active"></i>
              <span className="d-none ms-2" id="nav-theme-text">Toggle theme</span>
            </a>
          </div>
        </div>

        <ul className="navbar-nav flex-row align-items-center ms-md-auto">
          {/* User */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a className="nav-link dropdown-toggle hide-arrow p-0"
              href="javascript:void(0);"
              data-bs-toggle="dropdown">
              <div className="avatar avatar-online">
                <img src="/assets/img/avatars/1.png" alt="avatar" className="rounded-circle" />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img src="/assets/img/avatars/1.png" alt="avatar" className="w-px-40 h-auto rounded-circle" />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">Usuario</h6>
                      <small className="text-body-secondary">Admin</small>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="dropdown-divider my-1"></div>
              </li>
              <li>
                <a className="dropdown-item" href="javascript:void(0);" onClick={handleLogout}>
                  <i className="icon-base bx bx-power-off icon-md me-3"></i>
                  <span>Cerrar Sesión</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export { Toolbar as Navbar };
