import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { gsap } from 'gsap';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';

const stripePromise = loadStripe('pk_test_your_publishable_key'); // Replace with your Stripe key when ready

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
  const [chipName, setChipName] = useState('');
  const [chipEmail, setChipEmail] = useState('');
  const [chipPhone, setChipPhone] = useState('');
  const [chipAddress, setChipAddress] = useState('');
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const ministryRef = useRef(null);
  const sponsoredRef = useRef(null);
  const chipsRef = useRef(null);

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
        .map((char, index) => {
          const className = index < 7 ? 'letter vaccine-letter' : 'letter police-letter';
          return `<span class="${className}">${char}</span>`;
        })
        .join('');
      title.innerHTML = letters;
      gsap.from('.letter', { duration: 1, opacity: 0, y: 50, stagger: 0.05, ease: 'power2.out' });
    }

    const bio = bioRef.current;
    if (bio) {
      gsap.from(bio.children, { duration: 1, opacity: 0, y: 30, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: bio } });
    }

    const ministry = ministryRef.current;
    if (ministry) {
      gsap.from(ministry.children, { duration: 1, opacity: 0, x: -50, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: ministry } });
    }

    const sponsored = sponsoredRef.current;
    if (sponsored) {
      gsap.from(sponsored.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: sponsored } });
    }

    const chips = chipsRef.current;
    if (chips) {
      gsap.from(chips.children, { duration: 1, opacity: 0, x: 50, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: chips } });
    }

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to upload videos!');
    if (!file) return alert('Please select a video file!');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'video-vault-preset');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/diwgwgndv/video/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      const videoData = {
        title,
        description,
        fileUrl: res.data.secure_url,
        thumbnailUrl: res.data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_320,h_240/'),
        uploadedBy: user.username,
      };

      await axios.post('/.netlify/functions/videos', videoData);
      setFile(null);
      setTitle('');
      setDescription('');
      setProgress(0);
      const videosRes = await axios.get('/.netlify/functions/videos');
      setVideos(videosRes.data || []);
      alert('Video uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert('Upload failed—check your file or permissions!');
      setProgress(0);
    }
  };

  const handleViewIncrement = async (id) => {
    try {
      const res = await axios.put('/.netlify/functions/videos', { id });
      setVideos((videos) =>
        videos.map((video) => (video._id === id ? { ...video, views: res.data.views } : video))
      );
    } catch (err) {
      console.error('Failed to increment views:', err.response?.data || err.message);
    }
  };

  const handleLike = async (id) => {
    if (!user) {
      alert('Please log in to like videos!');
      return;
    }
    try {
      const res = await axios.put('/.netlify/functions/videos', {
        id,
        userId: user._id,
        action: 'like',
      });
      setVideos((videos) =>
        videos.map((video) =>
          video._id === id ? { ...video, likes: res.data.likes, likedBy: res.data.likedBy } : video
        )
      );
    } catch (err) {
      if (err.response?.status === 403) {
        alert('You’ve already liked this video!');
      } else {
        console.error('Failed to like video:', err.response?.data || err.message);
        alert('Failed to like video—try again!');
      }
    }
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    try {
      const response = await axios.post('/.netlify/functions/create-checkout-session', {
        amount: 1776, // $17.76 in cents
        description: 'Key Report Subscription + Free Pain & Energy Chips',
      });
      const { id } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) throw error;
    } catch (err) {
      console.error('Checkout error:', err.message);
      alert('Failed to start checkout—try again!');
    }
  };

  const handleChipClaim = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/claim-chips', {
        name: chipName,
        email: chipEmail,
        phone: chipPhone,
        address: chipAddress,
      });
      alert('Claim submitted! We’ll ship your free chips soon—stay free, patriot!');
      setChipName('');
      setChipEmail('');
      setChipPhone('');
      setChipAddress('');
    } catch (err) {
      console.error('Chip claim error:', err.response?.data || err.message);
      alert('Claim failed—check your info and try again!');
    }
  };

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

      <section className="support-section">
        <h2 className="section-title">Support the Fight</h2>
        <p className="section-text">
          Fired for defying tyranny, I’m raising hell and funds to hold this nation accountable, shield your rights, and save kids from masks, jabs, and trafficking. Drop $17.76—a patriot’s price—for the exclusive Key Report and fuel this war for truth. <strong>Donate $17.76 now and get $100 worth of Free Pain & Energy Chips shipped to you!</strong> Every cent powers our peaceful rebellion!
        </p>
        <button className="cta-btn pulse-btn" onClick={handleCheckout}>
          Get the Key Report - $17.76
        </button>
      </section>

      <section className="who-i-am-section" ref={bioRef}>
        <h2 className="section-title">Who I Am</h2>
        <p className="section-text accent-text">
          I’m Christopher Key, the Vaccine Police—a health advocate, patriot, and disciple of Jesus. My whole life, I’ve stood tall against the masses, fighting evil with the strength He gives me. God chose me to defend human rights and the defenseless. From Sports Illustrated covers to owning Steel City Fitness and co-owning SWATS (seized by the feds seven years ago), I’ve lived bold. Fired from a six-year gig for battling Alabama’s tyrannical school board over mask mandates, I now roam the nation for YOUR KIDS!
        </p>
      </section>

      <section className="ministry-section" ref={ministryRef}>
        <h2 className="section-title">Keys 2 Life Ministry</h2>
        <p className="section-text">
          We’re here to reclaim our God-given Temple and do His work—together. Evil corrupts our air, water, food, and bodies, but we fight back with real solutions: pure air, clean water, honest food, potent supplements, sacred herbs, and healing frequencies. In our frequency fellowship, we resonate as one to serve God’s will, uplift His people, and wage peaceful war on government and corporate tyranny—every damn day.
        </p>
      </section>

      <section className="products-section">
        <h2 className="section-title">Freedom Essentials</h2>
        <div className="products-grid">
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/fvcwlsdc0botrbzzk3xp"
              alt="MasterPeace"
              className="product-image"
            />
            <h3 className="product-title">MasterPeace</h3>
            <p className="product-text">
              Detox your body from heavy metals and reclaim your Temple with this game-changing formula. Pure, potent, and patriot-approved.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://bit.ly/christiskey', '_blank')}>
              Learn More
            </button>
          </div>
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/admezub1dbxvfrr2bmls"
              alt="IGF-1"
              className="product-image"
            />
            <h3 className="product-title">IGF-1</h3>
            <p className="product-text">
              Boost your vitality and strength with this natural growth factor. Fuel your fight with the power God intended.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://getifg1.com', '_blank')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="sponsored-section" ref={sponsoredRef}>
        <h2 className="section-title">Sponsored Gear</h2>
        <div className="sponsored-grid">
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/o51xmti0h4wd4w1y4rp2"
              alt="Freedom Law School"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Freedom Law School</h3>
            <p className="sponsored-text">
              Arm yourself with knowledge to fight tyranny—learn your rights and break free from government overreach.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://www.freedomlawschool.org/affiliate?code=vaccinepolice', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/flnxzvhblggdbgnnqe2f"
              alt="Cardio Miracle"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Cardio Miracle</h3>
            <p className="sponsored-text">
              Supercharge your heart health with this nitric oxide powerhouse—vitality for warriors.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://cardiomiracle.myshopify.com/KEY', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/l80zdqvcwmvluw1aujcq"
              alt="KLOUD/PEMF"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">KLOUD/PEMF</h3>
            <p className="sponsored-text">
              Heal with pulsed electromagnetic fields—recharge your body’s energy and crush fatigue.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://centropix.us/christiskey', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/gqzznuwtbyns65uwiafq"
              alt="B3 Bands"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">B3 Bands</h3>
            <p className="sponsored-text">
              Build muscle and boost recovery with blood flow restriction—train smarter, not harder.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://keys2life.b3sciences.com', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/suzt0afdbmtveja9a1gv"
              alt="Global Healing"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Global Healing</h3>
            <p className="sponsored-text">
              Cleanse and restore with premium supplements—pure health from nature’s best.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://globalhealing.com/?irclickid=wz3WxVXATxyKTn0TP8038V7zUks3XJ1JMxcsVo0&irgwc=1&utm_source=ir&utm_medium=referral&utm_campaign=3231152&utm_term=971435', '_blank')}>
              Get It Now
            </button>
          </div>
        </div>
      </section>

      <section className="chips-section" ref={chipsRef}>
        <h2 className="section-title">Free Pain & Energy Chips</h2>
        <p className="section-text">
          Claim your FREE Pain & Energy Chips ($100 value)—natural, non-invasive relief and vitality boosters from Christopher Key’s arsenal. Fill out the form below, and we’ll ship ‘em to you. No catch, just freedom from pain and fatigue!
        </p>
        <form onSubmit={handleChipClaim} className="chips-form">
          <input
            type="text"
            value={chipName}
            onChange={(e) => setChipName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            value={chipEmail}
            onChange={(e) => setChipEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="tel"
            value={chipPhone}
            onChange={(e) => setChipPhone(e.target.value)}
            placeholder="Phone Number"
            required
          />
          <textarea
            value={chipAddress}
            onChange={(e) => setChipAddress(e.target.value)}
            placeholder="Shipping Address"
            required
          />
          <button type="submit" className="cta-btn">Claim My Free Chips</button>
        </form>
      </section>

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

      {showMission && (
        <div className="history-modal">
          <div className="history-content">
            <h2 className="history-title">Our Mission</h2>
            <p className="history-text">
              Christopher Key’s mission is simple: expose corruption, protect freedom, and empower people to take back their health and lives. From peaceful protests to hard-hitting videos, he’s a warrior for truth in a world of lies.
            </p>
            <button className="close-btn" onClick={() => setShowMission(false)}>Close</button>
          </div>
        </div>
      )}

      {showFight && (
        <div className="course-modal">
          <div className="course-content">
            <h2 className="course-title">Join the Fight</h2>
            <p className="course-text">
              Become part of the Vaccine Police movement. Upload your videos, share your experiences, and stand with Christopher against tyranny. This is your chance to make a difference—start now.
            </p>
            <button className="close-btn" onClick={() => setShowFight(false)}>Close</button>
          </div>
        </div>
      )}

      <main className="main">
        {user && (
          <form onSubmit={handleUpload} className="upload-form">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="video/*" required />
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
            <button type="submit" className="upload-btn">Upload Video</button>
            {progress > 0 && progress < 100 && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}>
                  <span className="progress-text">{progress}%</span>
                </div>
              </div>
            )}
          </form>
        )}

        <section className="video-grid">
          {loading ? (
            <div className="loader"></div>
          ) : videos.length === 0 ? (
            <p className="no-videos">No videos yet—upload some!</p>
          ) : (
            videos.map((video) => (
              <div key={video._id} className="video-card">
                <ReactPlayer
                  url={video.fileUrl}
                  light={video.thumbnailUrl}
                  width="100%"
                  height="200px"
                  controls
                  lazy={true}
                  onStart={() => handleViewIncrement(video._id)}
                />
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <p className="video-uploader">Uploaded by: {video.uploadedBy}</p>
                <p className="video-views">Views: {video.views || 0}</p>
                <div className="like-section">
                  <button
                    onClick={() => handleLike(video._id)}
                    className={`like-btn ${hasLiked(video) ? 'liked' : ''}`}
                    disabled={hasLiked(video)}
                  >
                    👍 Like
                  </button>
                  <span className="like-count">Likes: {video.likes || 0}</span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

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
    </div>
  );
}

export default App;