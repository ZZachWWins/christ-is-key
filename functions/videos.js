const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  rumbleVideoId: String,
  uploadedBy: String,
  isLive: Boolean,
});

const Video = mongoose.model('Video', videoSchema);

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const { title, description, rumbleVideoId, uploadedBy, isLive } = JSON.parse(event.body);
    const newVideo = new Video({ title, description, rumbleVideoId, uploadedBy, isLive });
    await newVideo.save();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Video details saved' }),
    };
  }

  if (event.httpMethod === 'GET') {
    const videos = await Video.find().sort({ _id: -1 }); // Newest first
    return {
      statusCode: 200,
      body: JSON.stringify(videos),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};