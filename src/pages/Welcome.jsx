import React from 'react'
import { Link } from 'react-router-dom'

export default function Welcome(){
  return (
    <div className="container-xxl py-5">
      <div className="row">
        <div className="col-xxl-10 mx-auto">
        
          <div className="card mb-4 shadow-sm welcome-main">
            <div className="row g-0 align-items-center">
              <div className="col-md-7">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-2">Welcome, Admin! 🎉</h5>
                  <p className="mb-3 text-muted">Welcome to the system. Use the navigation to access modules, manage your resources, and explore integrations. Quick access buttons are available below.</p>

                  <div className="d-flex gap-2 flex-wrap">
                    <Link to="/devices" className="btn btn-label-primary btn-sm">Access Devices</Link>
                    <Link to="/external" className="btn btn-outline-secondary btn-sm">Access External</Link>
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <div className="card-body d-flex align-items-center justify-content-center py-4">
                  <img src="/assets/img/illustrations/man-with-laptop.png" height="200" className="img-fluid welcome-main-illustration" alt="Welcome illustration" />
                </div>
              </div>
            </div>
          </div>

        
          <div className="row welcome-cards">
            <div className="col-lg-12 mx-auto">
              <div className="row g-4">
                <div className="col-xl-4 col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-body text-center py-4">
                      <div className="welcome-card-icon mx-auto mb-3"><i className="bx bx-group" aria-hidden="true"></i></div>
                      <h5 className="my-2">User Management</h5>
                      <p className="mb-3 text-muted">Manage users, roles, and permissions. Review activity logs and assign access levels across the application.</p>
                    
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-body text-center py-4">
                      <div className="welcome-card-icon mx-auto mb-3"><i className="bx bx-rocket" aria-hidden="true"></i></div>
                      <h5 className="my-2">Deployment Center</h5>
                      <p className="mb-3 text-muted">Monitor deployment pipelines, view build statuses, and access staging environments to streamline releases.</p>
                    
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-body text-center py-4">
                      <div className="welcome-card-icon mx-auto mb-3"><i className="bx bx-code-alt" aria-hidden="true"></i></div>
                      <h5 className="my-2">Developer Docs</h5>
                      <p className="mb-3 text-muted">Find API references, integration guides, and code examples to help your engineering team build with the platform.</p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
