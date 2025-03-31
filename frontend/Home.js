import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { loadStripe } from '@stripe/stripe-js';
import StarryBackground from './StarryBackground';

const stripePromise = loadStripe('pk_test_your_publishable_key');

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
        <section className="video-grid">
          <h2 className="section-title">Latest Truth Drops</h2>
          {loading ? (
            <div className="loader"></div>
          ) : (
            videos.slice(0, 3).map((video) => (
              <div key={video._id} className="video-card">
                <ReactPlayer url={video.fileUrl} light={video.thumbnailUrl} width="100%" height="200px" controls />
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