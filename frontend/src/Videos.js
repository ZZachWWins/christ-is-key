import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import StarryBackground from './StarryBackground';

function Videos() {
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
      <section className="video-grid">
        <h2 className="section-title">Keys 2 Truth Vault</h2>
        <p className="section-text">
          Get all the information regarding vaccines, including the COVID dilemma. These videos expose the truth Big Pharma doesn’t want you to see.
        </p>
        {loading ? (
          <div className="loader"></div>
        ) : videos.length === 0 ? (
          <p className="no-videos">No videos yet—check back soon!</p>
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
              />
              <h3 className="video-title">{video.title}</h3>
              <p className="video-description">{video.description}</p>
              <p className="video-uploader">Uploaded by: {video.uploadedBy}</p>
              <p className="video-views">Views: {video.views || 0}</p>
            </div>
          ))
        )}
      </section>
    </>
  );
}

export default Videos;