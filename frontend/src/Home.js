import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const publisherCode = '3ycfre'; // Your Rumble publisher code from ?pub=3ycfre

function Home({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationTotal, setDonationTotal] = useState(0);
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
      gsap.from(chips.children, {
        duration: 1,
        opacity: 0,
        x: 50,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: chips },
      });
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

  const featuredVideo = videos.length > 0 ? videos[0] : null;

  const testimonials = [
    { quote: "Dropped my back pain in 2 days—Christopher’s the real deal!", name: "John D., Patriot" },
    { quote: "Energy through the roof—no coffee needed!", name: "Sarah T., Freedom Fighter" },
    { quote: "These chips are a game-changer—pain’s gone!", name: "Mike R., Truth Warrior" },
    { quote: "Chronic knee pain vanished in hours—unbelievable!", name: "Lisa M., Health Advocate" },
    { quote: "I’m sleeping better and waking up energized!", name: "Tom B., Veteran" },
    { quote: "My migraines are history thanks to these chips!", name: "Emma S., Mother of Three" },
    { quote: "Boosted my focus and stamina for the fight!", name: "David K., Activist" },
    { quote: "No more joint pain—back to hiking at 60!", name: "Carol W., Outdoor Enthusiast" },
  ];

  return (
    <main className="main">
      <section className="landing-section">
        <h2 className="landing-title">Welcome to KNN - Key News Network</h2>
        <div className="news-ticker">
          <span>Wake up America! - KNN - Key News Network - Home of the Vaccine Police - The Christopher Key Show - FOLLOW OUR CHANNELS!</span>
        </div>
        <p className="landing-text">
          Christopher Key delivers raw, unfiltered truth—KNN breaks it wide open.
        </p>
        <button className="cta-btn" onClick={() => setShowMission(true)}>Our Mission</button>
        <button className="cta-btn" onClick={() => setShowFight(true)}>Join the Fight</button>
      </section>

      {loading ? (
        <div className="loader">Loading KNN Broadcasts...</div>
      ) : featuredVideo ? (
        <section className="featured-section">
          <h2 className="featured-title breaking-news">{featuredVideo.isLive ? 'Live Now' : 'Breaking News'}</h2>
          <div className="featured-video">
            <div className="videoWrapper">
              <iframe
                src={`https://rumble.com/embed/${featuredVideo.rumbleVideoId}/?pub=${publisherCode}`}
                frameBorder="0"
                allowFullScreen
                title={featuredVideo.title}
              ></iframe>
            </div>
            <h3 className="video-title">{featuredVideo.title}</h3>
            <p className="video-description">{featuredVideo.description}</p>
            <p className="video-uploader">Reported by: {featuredVideo.uploadedBy}</p>
          </div>
        </section>
      ) : (
        <p>No breaking news yet—stay tuned!</p>
      )}

      <section className="support-section">
        <h2 className="section-title">Support KNN’s Fight</h2>
        <p className="section-text">
          Fired for defying tyranny, Christopher’s raising hell and funds to hold this nation accountable, shield your rights, and save kids from masks, jabs, and trafficking. Drop $17.76—a patriot’s price—for the exclusive Key Report and fuel this war for truth. <strong>Donate $17.76 now and get $100 worth of Free Pain & Energy Chips shipped to you!</strong>
        </p>
        <p className="donation-counter">Patriots have fueled: ${donationTotal.toFixed(2)}</p>
        <button className="cta-btn pulse-btn" onClick={handleCheckout}>
          Get the Key Report - $17.76
        </button>
      </section>

      <section className="chips-section" ref={chipsRef}>
        <h2 className="section-title">Pain & Energy Chips: Freedom from Pain</h2>
        <p className="section-text">
          Experience the power of nano-tech Pain & Energy Chips from Christopher Key’s arsenal. These non-invasive patches deliver natural relief from chronic pain and supercharge your energy—stick ‘em on and feel the freedom! Claim your 12 FREE chips today through our exclusive offer and join thousands reclaiming their vitality.
        </p>
        <button className="cta-btn pulse-btn" onClick={() => window.location.href = '#free-chips'}>
          Claim Your Free Chips Now
        </button>
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
            <h2 className="history-title">KNN’s Mission</h2>
            <p className="history-text">
              Christopher Key’s mission is simple: expose corruption, protect freedom, and empower people to take back their health and lives through hard-hitting news.
            </p>
            <button className="close-btn" onClick={() => setShowMission(false)}>Close</button>
          </div>
        </div>
      )}

      {showFight && (
        <div className="course-modal">
          <div className="course-content">
            <h2 className="course-title">Join KNN’s Fight</h2>
            <p className="course-text">
              Become part of the Key News Network movement. Share your stories, upload your reports, and stand with Christopher against tyranny.
            </p>
            <button className="close-btn" onClick={() => setShowFight(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;