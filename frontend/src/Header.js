import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

function Header({ user, setShowAuth, handleLogout }) {
  const titleRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    if (title) {
      const letters = "Vaccine Police"
        .split('')
        .map((char, index) => {
          const className = index < 7 ? 'letter vaccine-letter' : 'letter police-letter';
          return `<span class="${className}">${char}</span>`;
        })
        .join('');
      title.innerHTML = letters;
      gsap.from('.letter', { duration: 1, opacity: 0, y: 50, stagger: 0.05, ease: 'power2.out' });
    }
  }, []);

  return (
    <header className="header">
      <h1 ref={titleRef} className="title">Vaccine Police</h1>
      <p className="subtitle">Christopher Key - Truth Warrior</p>
      <div className="auth-section">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="auth-btn">Logout</button>
          </>
        ) : (
          <button onClick={() => setShowAuth(true)} className="auth-btn">Sign Up or Log In</button>
        )}
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