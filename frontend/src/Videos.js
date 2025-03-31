import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

function Videos({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

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
      alert('Upload failed—check your file!');
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
      console.error('Failed to increment views:', err);
    }
  };

  const handleLike = async (id) => {
    if (!user) return alert('Please log in to like videos!');
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
      alert(err.response?.status === 403 ? 'You’ve already liked this!' : 'Like failed!');
    }
  };

  const hasLiked = (video) => user && video.likedBy && video.likedBy.includes(user._id);

  return (
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
  );
}

export default Videos;