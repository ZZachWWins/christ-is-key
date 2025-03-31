import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        Built by Zachary | © 2025 Christopher Key. All rights reserved.
      </p>
      <p className="contact-text">Contact: christopherkey@vaccinepolice.com</p>
      <div className="social-links">
        <a href="https://truthsocial.com/@vaccinepolice" target="_blank" rel="noopener noreferrer" className="social-icon">
          <i className="fab fa-tumblr"></i>
        </a>
        <a href="https://x.com/TheKeyReport111" target="_blank" rel="noopener noreferrer" className="social-icon">
          <i className="fab fa-twitter"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;