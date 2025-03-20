import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { gsap } from 'gsap';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showMission, setShowMission] = useState(false);
  const [showFight, setShowFight] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const ministryRef = useRef(null);

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

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach((star) => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.fill();
          star.alpha += Math.random() * 0.05 - 0.025;
          star.alpha = Math.max(0.5, Math.min(1, star.alpha));
        });
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animate();

    const fetchVideos = async () => {
      try {
        const res = await axios.get('/.netlify/functions/videos');
        setVideos(res.data || []);
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();

    const title = titleRef.current;
    if (title) {
      const letters = "Vaccine Police"
        .split('')
        .map((char) => `<span class="letter">${char}</span>`)
        .join('');
      title.innerHTML = letters;
      gsap.from('.letter', { duration: 1, opacity: 0, y: 50, stagger: 0.05, ease: 'power2.out' });
    }

    // Bio Animation
    const bio = bioRef.current;
    if (bio) {
      gsap.from(bio.children, { duration: 1, opacity: 0, y: 30, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: bio } });
    }

    // Ministry Animation
    const ministry = ministryRef.current;
    if (ministry) {
      gsap.from(ministry.children, { duration: 1, opacity: 0, x: -50, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: ministry } });
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e) => { /* Unchanged */ };
  const handleSignup = async (e) => { /* Unchanged */ };
  const handleLogout = async () => { /* Unchanged */ };
  const handleUpload = async (e) => { /* Unchanged */ };
  const handleViewIncrement = async (id) => { /* Unchanged */ };
  const handleLike = async (id) => { /* Unchanged */ };
  const hasLiked = (video) => user && video.likedBy && video.likedBy.includes(user._id);
  const featuredVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className="app">
      <canvas ref={canvasRef} className="starry-background" />
      <div className="rotating-text-background">Vaccine Police</div>

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
      </header>

      {featuredVideo && (
        <section className="featured-section">
          <h2 className="featured-title">Featured Video</h2>
          <div className="featured-video">
            <ReactPlayer
              url={featuredVideo.fileUrl}
              light={featuredVideo.thumbnailUrl}
              width="100%"
              height="400px"
              controls
              onStart={() => handleViewIncrement(featuredVideo._id)}
            />
            <h3 className="video-title">{featuredVideo.title}</h3>
            <p className="video-description">{featuredVideo.description}</p>
            <p className="video-uploader">Uploaded by: {featuredVideo.uploadedBy}</p>
            <p className="video-views">Views: {featuredVideo.views || 0}</p>
          </div>
        </section>
      )}

      {/* Rebranded Bio Section */}
      <section className="who-i-am-section" ref={bioRef}>
        <h2 className="section-title">Who I Am</h2>
        <p className="section-text accent-text">
          I’m Christopher Key, the Vaccine Police—a health advocate, patriot, and disciple of Jesus. My whole life, I’ve stood tall against the masses, fighting evil with the strength He gives me. God chose me to defend human rights and the defenseless. From Sports Illustrated covers to owning Steel City Fitness and co-owning SWATS (seized by the feds seven years ago), I’ve lived bold. Fired from a six-year gig for battling Alabama’s tyrannical school board over mask mandates, I now roam the nation for YOUR KIDS!
        </p>
      </section>

      {/* Rebranded Ministry Section */}
      <section className="ministry-section" ref={ministryRef}>
        <h2 className="section-title">Keys 2 Life Ministry</h2>
        <p className="section-text">
          We’re here to reclaim our God-given Temple and do His work—together. Evil corrupts our air, water, food, and bodies, but we fight back with real solutions: pure air, clean water, honest food, potent supplements, sacred herbs, and healing frequencies. In our frequency fellowship, we resonate as one to serve God’s will, uplift His people, and wage peaceful war on government and corporate tyranny—every damn day.
        </p>
      </section>

      {/* Support Section with Flag Flair */}
      <section className="support-section">
        <h2 className="section-title">Support the Fight</h2>
        <p className="section-text">
          Fired for defying tyranny, I’m raising hell and funds to hold this nation accountable, shield your rights, and save kids from masks, jabs, and trafficking. Drop $17.76—a patriot’s price—for the exclusive Key Report and fuel this war for truth. Every cent powers our peaceful rebellion!
        </p>
        <button className="cta-btn pulse-btn">Get the Key Report - $17.76</button>
      </section>

      {/* New Products Section */}
      <section className="products-section">
        <h2 className="section-title">Freedom Essentials</h2>
        <div className="products-grid">
          <div className="product-card">
            <h3 className="product-title">MasterPeace</h3>
            <p className="product-text">
              Detox your body from heavy metals and reclaim your Temple with this game-changing formula. Pure, potent, and patriot-approved.
            </p>
            <button className="cta-btn">Learn More</button>
          </div>
          <div className="product-card">
            <h3 className="product-title">IGF-1</h3>
            <p className="product-text">
              Boost your vitality and strength with this natural growth factor. Fuel your fight with the power God intended.
            </p>
            <button className="cta-btn">Learn More</button>
          </div>
        </div>
      </section>

      {showAuth && ( /* Unchanged Auth Modal */ )}

      <section className="landing-section">
        <h2 className="landing-title">Welcome to Vaccine Police</h2>
        <p className="landing-text">
          Christopher Key’s here to rip the veil off corruption and fight for freedom with raw, unfiltered videos that hit like a freight train.
        </p>
        <h2 className="landing-title">The Truth Movement</h2>
        <p className="landing-text">
          This ain’t just a site—it’s a revolution. Government overreach? Corporate lies? We’re cutting through the bullshit. Join up, share your story, stand tall.
        </p>
        <h2 className="landing-title">Your Voice Matters</h2>
        <p className="landing-text">
          Watch, learn, upload—your voice drives this war. Together, we’re waking the world up, one truth at a time.
        </p>
        <button className="cta-btn" onClick={() => window.open('mailto:christopherkey@vaccinepolice.com')}>
          Share Your Story
        </button>
        <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
        <button className="cta-btn" onClick={() => setShowFight(true)}>Join the Fight</button>
      </section>

      {showMission && ( /* Unchanged Mission Modal */ )}
      {showFight && ( /* Unchanged Fight Modal */ )}

      <main className="main">{/* Unchanged Upload Form and Video Grid */}</main>

      <footer className="footer">
        <p className="footer-text">
          Built by Zachary | © 2025 Christopher Key. All rights reserved.
        </p>
        <p className="contact-text">Contact: christopherkey@vaccinepolice.com</p>
        <div className="social-links">
          <a href="https://truthsocial.com/@vaccinepolice" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-tumblr"></i>
          </a>
          <a href="https://x.com/vaccinepolice" target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;