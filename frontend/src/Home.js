import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { loadStripe } from '@stripe/stripe-js';
import StarryBackground from './StarryBackground';

const stripePromise = loadStripe('pk_test_your_publishable_key'); // Replace with your live key

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  // Donation state
  const [donationAmount, setDonationAmount] = useState(5230); // Example starting value
  // Chip form state
  const [chipName, setChipName] = useState('');
  const [chipEmail, setChipEmail] = useState('');
  const [chipMessage, setChipMessage] = useState('');
  const [chipSubmitting, setChipSubmitting] = useState(false);
  // Video upload state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with your auth logic

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/.netlify/functions/videos');
        setVideos(res.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();

    // Simulate donation ticker (replace with your real logic if dynamic)
    const tickerInterval = setInterval(() => {
      setDonationAmount((prev) => Math.min(prev + Math.floor(Math.random() * 50), 10000));
    }, 5000);
    return () => clearInterval(tickerInterval);
  }, []);

  const handleDonate = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }), // $10, adjust as needed
    });
    const session = await response.json();
    stripe.redirectToCheckout({ sessionId: session.id });
  };

  const handleChipSubmit = async (e) => {
    e.preventDefault();
    setChipSubmitting(true);
    try {
      await axios.post('/.netlify/functions/submit-chip', {
        name: chipName,
        email: chipEmail,
        message: chipMessage,
      });
      alert('Report submitted—thank you!');
      setChipName('');
      setChipEmail('');
      setChipMessage('');
    } catch (err) {
      alert('Submission failed—try again.');
    } finally {
      setChipSubmitting(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile || !videoTitle) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('title', videoTitle);
    try {
      await axios.post('/.netlify/functions/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      alert('Video uploaded!');
      setVideoTitle('');
      setVideoFile(null);
      setUploadProgress(0);
    } catch (err) {
      alert('Upload failed—try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="rotating-text-background">Vaccine Police</div>
      <main className="main-content">
        <section className="featured-section">
          <h2 className="section-title">Welcome to the Fight</h2>
          <p className="section-text accent-text">
            I’m Christopher Key, the Vaccine Police—dedicated to exposing vaccine truth and fighting for your freedom. Join me in this battle for our kids and our future.
          </p>
        </section>

        <section className="support-section">
          <h2 className="section-title">Support the Fight</h2>
          <p className="section-text">
            Every dollar fuels the battle against tyranny. Help us reach our goal!
          </p>
          <div className="ticker">
            Raised: $<span id="donation-amount">{donationAmount}</span> of $10,000
          </div>
          <button className="cta-btn pulse-btn" onClick={handleDonate}>
            Donate Now
          </button>
        </section>

        <section className="chips-section">
          <h2 className="section-title">Report the Chips</h2>
          <p className="section-text">
            Seen a chip? Tell us your story—together, we’ll expose the truth!
          </p>
          <form onSubmit={handleChipSubmit} className="chips-form">
            <input
              type="text"
              value={chipName}
              onChange={(e) => setChipName(e.target.value)}
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              value={chipEmail}
              onChange={(e) => setChipEmail(e.target.value)}
              placeholder="Your Email"
              required
            />
            <textarea
              value={chipMessage}
              onChange={(e) => setChipMessage(e.target.value)}
              placeholder="Your Chip Story"
              required
            />
            <button type="submit" className="cta-btn" disabled={chipSubmitting}>
              {chipSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </section>

        {isAuthenticated && (
          <section className="upload-form">
            <h2 className="section-title">Upload Your Truth</h2>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Video Title"
            />
            <input
              type="file"
              onChange={(e) => setVideoFile(e.target.files[0])}
              accept="video/*"
            />
            <button className="upload-btn" onClick={handleVideoUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
            {uploadProgress > 0 && (
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </section>
        )}

        <section className="video-grid">
          <h2 className="section-title">Latest Truth Drops</h2>
          {loading ? (
            <div className="loader"></div>
          ) : (
            videos.slice(0, 3).map((video) => (
              <div key={video._id} className="video-card">
                <ReactPlayer
                  url={video.fileUrl}
                  light={video.thumbnailUrl}
                  width="100%"
                  height="200px"
                  controls
                />
                <h3 className="video-title">{video.title}</h3>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
}

export default Home;