import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <h1 className="title">Vaccine Police</h1>
      <p className="subtitle">Christopher Key - Truth Warrior</p>
      <div className="hero-tagline">
        <span className="tagline-text">Fighting Tyranny | Healing Lives | Keys 2 Freedom</span>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/videos" className="nav-link">Videos</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;