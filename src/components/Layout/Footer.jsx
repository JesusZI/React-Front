import React from 'react';

const Footer = () => {
  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl">
        <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
          <div className="mb-2 mb-md-0">
            © {new Date().getFullYear()}, Developed by Jesus Zambrano Isambertt
            </div>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;