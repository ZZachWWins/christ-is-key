import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
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
  const [showBio, setShowBio] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${star.alpha})`; // Gold stars
        ctx.fill();
        star.alpha += Math.random() * 0.05 - 0.025;
        star.alpha = Math.max(0.3, Math.min(1, star.alpha));
      });
      animationFrameId = requestAnimationFrame(animate);
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

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/.netlify/functions/login', { username, password });
      setUser(res.data.user);
      setUsername('');
      setPassword('');
    } catch (err) {
      alert('Login failed—verify your credentials.');
    }
  };

  const handleSignup = async e => {
    e.preventDefault();
    try {
      await axios.post('/.netlify/functions/signup', { username: signupUsername, password: signupPassword });
      alert('Signup successful—log in now.');
      setSignupUsername('');
      setSignupPassword('');
    } catch (err) {
      alert('Signup failed—username may be taken.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/.netlify/functions/logout');
      setUser(null);
    } catch (err) {
      alert('Logout failed—try again.');
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!user) return alert('Log in to upload.');
    if (!file) return alert('Select a video file.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'video-vault-preset');

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dwmnbrjtu/video/upload', formData);
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
      const videosRes = await axios.get('/.netlify/functions/videos');
      setVideos(videosRes.data || []);
      alert('Video uploaded successfully.');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert('Upload failed—check file or permissions.');
    }
  };

  const handleViewIncrement = async id => {
    try {
      const res = await axios.put('/.netlify/functions/videos', { id });
      setVideos(videos.map(video => (video._id === id ? { ...video, views: res.data.views } : video)));
    } catch (err) {
      console.error('View increment error:', err.response?.data || err.message);
    }
  };

  const featuredVideo = videos.length > 0 ? videos[0] : null;

  return (
    <div className="app">
      <canvas ref={canvasRef} className="luxe-background" />
      <header className="luxe-header">
        <h1 className="luxe-title">Christ Is Key</h1>
        <p className="luxe-subtitle">Presented by Christopher Key, The Vaccine Police</p>
        {user ? (
          <div className="auth-suite">
            <span className="user-greeting">Greetings, {user.username}</span>
            <button onClick={handleLogout} className="luxe-btn">Logout</button>
          </div>
        ) : (
          <div className="auth-suite">
            <form onSubmit={handleLogin} className="login-form">
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="luxe-input" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="luxe-input" />
              <button type="submit" className="luxe-btn">Login</button>
            </form>
            <form onSubmit={handleSignup} className="signup-form">
              <input type="text" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} placeholder="Choose Username" required className="luxe-input" />
              <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Choose Password" required className="luxe-input" />
              <button type="submit" className="luxe-btn">Signup</button>
            </form>
          </div>
        )}
      </header>

      <section className="luxe-landing">
        <h2 className="luxe-section-title">Welcome to Christ Is Key</h2>
        <p className="luxe-text">
          Welcome to Christ Is Key, where faith, freedom, and truth unite. I’m Christopher Key—a health advocate, patriot, and disciple of Jesus—dedicated to exposing injustices and empowering you with knowledge through powerful video testimonies.
        </p>
        <h2 className="luxe-section-title">Our Mission</h2>
        <p className="luxe-text">
          This isn’t just a platform; it’s a movement. From battling vaccine mandates to championing human rights, my life’s work is to serve and protect. Explore real stories, join the fight, and reclaim your God-given rights—one video at a time.
        </p>
        <button className="luxe-cta" onClick={() => window.location.href = 'mailto:contact@christiskey.life'}>Share Your Story</button>
        <button className="luxe-cta" onClick={() => setShowBio(true)}>About Christopher</button>
        <p className="luxe-disclaimer">
          Views here are for education and inspiration only. We don’t offer medical advice or products—evaluate everything with discernment.
        </p>

        {showBio && (
          <div className="luxe-modal">
            <div className="luxe-modal-content">
              <h2 className="luxe-modal-title">About Christopher Key</h2>
              <p className="luxe-modal-text">
                Christopher Key—once featured on Sports Illustrated—has lived a life of defiance and devotion. From owning Steel City Fitness and co-founding SWATS (shut down by the government) to losing his job for opposing tyrannical mandates, he’s now the Vaccine Police. A patriot and disciple of Jesus, he travels the nation to fight for your rights, fueled by faith and a calling to protect the vulnerable.
              </p>
              <button className="luxe-close" onClick={() => setShowBio(false)}>Close</button>
            </div>
          </div>
        )}
      </section>

      <main className="luxe-main">
        {featuredVideo && (
          <section className="luxe-featured">
            <h2 className="luxe-section-title">Featured Testimony</h2>
            <div className="luxe-video">
              <ReactPlayer url={featuredVideo.fileUrl} light={featuredVideo.thumbnailUrl} width="100%" height="400px" controls onStart={() => handleViewIncrement(featuredVideo._id)} />
              <h3 className="luxe-video-title">{featuredVideo.title}</h3>
              <p className="luxe-video-desc">{featuredVideo.description}</p>
              <p className="luxe-video-uploader">By: {featuredVideo.uploadedBy}</p>
              <p className="luxe-video-views">Views: {featuredVideo.views || 0}</p>
            </div>
          </section>
        )}

        {user && (
          <form onSubmit={handleUpload} className="luxe-upload">
            <input type="file" onChange={e => setFile(e.target.files[0])} accept="video/*" required className="luxe-file" />
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="luxe-input" />
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="luxe-input" />
            <button type="submit" className="luxe-btn">Upload Testimony</button>
          </form>
        )}

        <section className="luxe-grid">
          {loading ? (
            <div className="luxe-loader"></div>
          ) : videos.length === 0 ? (
            <p className="luxe-no-videos">No testimonies yet—share yours!</p>
          ) : (
            videos.map(video => (
              <div key={video._id} className="luxe-card">
                <ReactPlayer url={video.fileUrl} light={video.thumbnailUrl} width="100%" height="200px" controls lazy={true} onStart={() => handleViewIncrement(video._id)} />
                <h2 className="luxe-video-title">{video.title}</h2>
                <p className="luxe-video-desc">{video.description}</p>
                <p className="luxe-video-uploader">By: {video.uploadedBy}</p>
                <p className="luxe-video-views">Views: {video.views || 0}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;