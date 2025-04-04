import React, { useState, useEffect } from 'react';
import axios from 'axios';

const publisherCode = '3ycfre';

function Videos({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rumbleVideoId, setRumbleVideoId] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to upload reports!');
    if (user.role !== 'admin') return alert('Only admins can upload reports!');
    if (!rumbleVideoId) return alert('Please enter a Rumble video ID!');

    try {
      const videoData = {
        title,
        description,
        rumbleVideoId,
        uploadedBy: user.username,
        isLive,
      };

      await axios.post('/.netlify/functions/videos', videoData);
      setTitle('');
      setDescription('');
      setRumbleVideoId('');
      setIsLive(false);
      const videosRes = await axios.get('/.netlify/functions/videos');
      setVideos(videosRes.data || []);
      alert('Report uploaded to KNN!');
    } catch (err) {
      alert('Upload failed—check your input!');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('User object:', user);

  return (
    <main className="main">
      {user && user.role === 'admin' ? (
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Report Title"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Report Description"
            required
          />
          <input
            type="text"
            value={rumbleVideoId}
            onChange={(e) => setRumbleVideoId(e.target.value)}
            placeholder="Rumble Video ID (e.g., v6p4qz4)"
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />
            Mark as Live
          </label>
          <button type="submit" className="upload-btn">Upload to KNN</button>
        </form>
      ) : user ? (
        <p className="no-upload">Only admins can upload reports.</p>
      ) : (
        <p className="no-upload">Please log in to upload reports.</p>
      )}

      <section className="video-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos by title or description..."
          className="search-bar"
        />
        <button onClick={handleClearSearch} className="auth-btn clear-btn">
          Clear
        </button>
      </section>

      <section className="video-grid">
        {loading ? (
          <div className="loader">Loading KNN Reports...</div>
        ) : filteredVideos.length === 0 ? (
          <p className="no-videos">No matching reports found.</p>
        ) : (
          filteredVideos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="videoWrapper">
                <iframe
                  src={`https://rumble.com/embed/${video.rumbleVideoId}/?pub=${publisherCode}`}
                  frameBorder="0"
                  allowFullScreen
                  title={video.title}
                ></iframe>
              </div>
              <h3 className="video-title">{video.title} {video.isLive && <span>(Live)</span>}</h3>
              <p className="video-description">{video.description}</p>
              <p className="video-uploader">Reported by: {video.uploadedBy}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default Videos;