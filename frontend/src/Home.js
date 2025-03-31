import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key');

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState(5230);
  const [chipName, setChipName] = useState('');
  const [chipEmail, setChipEmail] = useState('');
  const [chipMessage, setChipMessage] = useState('');
  const [chipSubmitting, setChipSubmitting] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Keep and use

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

    const checkAuth = async () => {
      try {
        const res = await axios.get('/.netlify/functions/check-auth');
        setIsAuthenticated(res.data.isAuthenticated || false); // Fixes lint error
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      }
    };

    fetchVideos();
    checkAuth();

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
      body: JSON.stringify({ amount: 1000 }),
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
    <main>
      <section>
        <h2>Welcome to the Fight</h2>
        <p>
          I’m Christopher Key, the Vaccine Police—dedicated to exposing vaccine truth and fighting for your freedom. Join me in this battle for our kids and our future.
        </p>
      </section>

      <section>
        <h2>Support the Fight</h2>
        <p>Every dollar fuels the battle against tyranny. Help us reach our goal!</p>
        <div>Raised: ${donationAmount} of $10,000</div>
        <button onClick={handleDonate}>Donate Now</button>
      </section>

      <section>
        <h2>Report the Chips</h2>
        <p>Seen a chip? Tell us your story—together, we’ll expose the truth!</p>
        <form onSubmit={handleChipSubmit}>
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
          <button type="submit" disabled={chipSubmitting}>
            {chipSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </section>

      {isAuthenticated && (
        <section>
          <h2>Upload Your Truth</h2>
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
          <button onClick={handleVideoUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
          {uploadProgress > 0 && <div>Progress: {uploadProgress}%</div>}
        </section>
      )}

      <section>
        <h2>Latest Truth Drops</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          videos.slice(0, 3).map((video) => (
            <div key={video._id}>
              <ReactPlayer url={video.fileUrl} width="100%" height="200px" controls />
              <h3>{video.title}</h3>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default Home;