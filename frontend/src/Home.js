import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { gsap } from 'gsap';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key');

function Home({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // This is fine
  const [donationTotal, setDonationTotal] = useState(0);
  const [chipName, setChipName] = useState('');
  const [chipEmail, setChipEmail] = useState('');
  const [chipPhone, setChipPhone] = useState('');
  const [chipAddress, setChipAddress] = useState('');
  const [showChipsForm, setShowChipsForm] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showFight, setShowFight] = useState(false);
  const chipsRef = useRef(null);

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

    const fetchDonationTotal = async () => {
      setDonationTotal(0); // Placeholder
    };
    fetchDonationTotal();

    const chips = chipsRef.current;
    if (chips) {
      gsap.from(chips.children, { duration: 1, opacity: 0, x: 50, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: chips } });
    }
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    try {
      const response = await axios.post('/.netlify/functions/create-checkout-session', {
        amount: 1776,
        description: 'Key Report Subscription + $100 Pain & Energy Chips',
      });
      const { id } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) throw error;
    } catch (err) {
      alert('Checkout error—try again!');
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
      alert('Claim submitted! Chips shipping soon!');
      setChipName('');
      setChipEmail('');
      setChipPhone('');
      setChipAddress('');
      setShowChipsForm(false);
    } catch (err) {
      alert('Claim failed—check your info!');
    }
  };

  const featuredVideo = videos.length > 0 ? videos[0] : null;

  const testimonials = [
    { quote: "Dropped my back pain in 2 days—Christopher’s the real deal!", name: "John D., Patriot" },
    { quote: "Energy through the roof—no coffee needed!", name: "Sarah T., Freedom Fighter" },
    { quote: "These chips are a game-changer—pain’s gone!", name: "Mike R., Truth Warrior" },
  ];

  return (
    <main className="main">
      <section className="landing-section">
        <h2 className="landing-title">Welcome to Vaccine Police</h2>
        <p className="landing-text">
          Christopher Key’s here to rip the veil off corruption and fight for freedom with raw, unfiltered videos that hit like a freight train.
        </p>
        <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
        <button className="cta-btn" onClick={() => setShowFight(true)}>Join the Fight</button>
      </section>

      {loading ? (
        <div className="loader">Loading videos...</div>
      ) : featuredVideo ? (
        <section className="featured-section">
          <h2 className="featured-title">Featured Video</h2>
          <div className="featured-video">
            <ReactPlayer
              url={featuredVideo.fileUrl}
              light={featuredVideo.thumbnailUrl}
              width="100%"
              height="400px"
              controls
            />
            <h3 className="video-title">{featuredVideo.title}</h3>
            <p className="video-description">{featuredVideo.description}</p>
            <p className="video-uploader">Uploaded by: {featuredVideo.uploadedBy}</p>
            <p className="video-views">Views: {featuredVideo.views || 0}</p>
          </div>
        </section>
      ) : (
        <p>No featured video yet!</p>
      )}

      <section className="support-section">
        <h2 className="section-title">Support the Fight</h2>
        <p className="section-text">
          Fired for defying tyranny, I’m raising hell and funds to hold this nation accountable, shield your rights, and save kids from masks, jabs, and trafficking. Drop $17.76—a patriot’s price—for the exclusive Key Report and fuel this war for truth. <strong>Donate $17.76 now and get $100 worth of Free Pain & Energy Chips shipped to you!</strong>
        </p>
        <p className="donation-counter">Patriots have fueled: ${donationTotal.toFixed(2)}</p>
        <button className="cta-btn pulse-btn" onClick={handleCheckout}>
          Get the Key Report - $17.76
        </button>
      </section>

      <section className="chips-section" ref={chipsRef}>
        <h2 className="section-title">Free Pain & Energy Chips</h2>
        <p className="section-text">
          Nano-tech patches that zap pain and charge your energy—stick ‘em on, feel the freedom. Claim your 12 FREE Pain & Energy Chips—natural, non-invasive relief and vitality boosters from Christopher Key’s arsenal.
        </p>
        <div className="chips-button-container">
          <button className="cta-btn" onClick={() => setShowChipsForm(!showChipsForm)}>
            {showChipsForm ? 'Hide Claim Form' : 'Claim Your 12 Free Chips'}
          </button>
        </div>
        {showChipsForm && (
          <div className="chips-form-container">
            <form onSubmit={handleChipClaim} className="chips-form">
              <input type="text" value={chipName} onChange={(e) => setChipName(e.target.value)} placeholder="Full Name" required />
              <input type="email" value={chipEmail} onChange={(e) => setChipEmail(e.target.value)} placeholder="Email Address" required />
              <input type="tel" value={chipPhone} onChange={(e) => setChipPhone(e.target.value)} placeholder="Phone Number" required />
              <textarea value={chipAddress} onChange={(e) => setChipAddress(e.target.value)} placeholder="Shipping Address" required />
              <button type="submit" className="cta-btn">Submit Claim</button>
            </form>
          </div>
        )}
        <div className="chips-testimonials">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <p className="testimonial-name">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {showMission && (
        <div className="history-modal">
          <div className="history-content">
            <h2 className="history-title">Our Mission</h2>
            <p className="history-text">
              Christopher Key’s mission is simple: expose corruption, protect freedom, and empower people to take back their health and lives.
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
              Become part of the Vaccine Police movement. Upload your videos, share your experiences, and stand with Christopher against tyranny.
            </p>
            <button className="close-btn" onClick={() => setShowFight(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;