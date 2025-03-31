import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Videos from './Videos';
import Shop from './Shop';
import Contact from './Contact';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Combine original twinkling stars with falling stars
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2, // Falling speed
      isFalling: Math.random() > 0.5, // 50% falling, 50% twinkling
    }));

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();

          if (star.isFalling) {
            // Falling stars
            star.y += star.speed;
            if (star.y > canvas.height) {
              star.y = 0 - star.radius;
              star.x = Math.random() * canvas.width;
            }
          } else {
            // Twinkling stars
            star.alpha += Math.random() * 0.05 - 0.025;
            star.alpha = Math.max(0.5, Math.min(1, star.alpha));
          }
        });
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/.netlify/functions/login', { username, password });
      setUser(res.data.user);
      setUsername('');
      setPassword('');
      setShowAuth(false);
    } catch (err) {
      alert('Login failed—check your credentials!');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/signup', { username: signupUsername, password: signupPassword });
      alert('Signup successful! Please log in.');
      setSignupUsername('');
      setSignupPassword('');
      setActiveTab('login');
    } catch (err) {
      alert('Signup failed—username might be taken!');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/.netlify/functions/logout');
      setUser(null);
    } catch (err) {
      alert('Logout failed—try again!');
    }
  };

  return (
    <Router>
      <div className="app">
        <canvas ref={canvasRef} className="starry-background" />
        <div className="rotating-text-background">Vaccine Police</div>
        <Header user={user} setShowAuth={setShowAuth} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/videos" element={<Videos user={user} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        {showAuth && (
          <div className="auth-modal">
            <div className="auth-content">
              <h2 className="auth-title">Join the Fight</h2>
              <div className="auth-tabs">
                <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                  Login
                </button>
                <button className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
                  Signup
                </button>
              </div>
              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="auth-form">
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                  <button type="submit" className="submit-btn">Login</button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="auth-form">
                  <input type="text" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} placeholder="Choose Username" required />
                  <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Choose Password" required />
                  <button type="submit" className="submit-btn">Signup</button>
                </form>
              )}
              <button className="close-btn" onClick={() => setShowAuth(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;