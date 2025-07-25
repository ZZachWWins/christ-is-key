import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const publisherCode = '3ycfre';

// Poem text about Christopher Key
const keyPoem = `<p>If you can <span>stand</span> for truth when lies surround you,  
And <span>fight</span> the tyrants who would <span>chain</span> us all;  
If you can <span>shout</span> your voice though they <span>drown</span> you,  
Yet hold your <span>ground</span> and never fall;  
If you can <span>heal</span> with chips that spark your <span>fire</span>,  
Or <span>break</span> the chains of jabs with <span>bold</span> decree,  
And <span>rise</span> against the powers that <span>conspire</span>,  
While keeping <span>faith</span> in liberty;  
If you can <span>lead</span> the lost to find their <span>freedom</span>,  
And <span>guard</span> the kids from masks and <span>harm</span>’s disguise;  
If you can <span>build</span> a world with truth’s own <span>wisdom</span>,  
And <span>shine</span> through darkness with unyielding <span>eyes</span>;  
If you can <span>forge</span> a path where none would <span>venture</span>,  
And <span>defy</span> the shadows cast by fear’s <span>command</span>;  
If you can <span>rally</span> souls to break their <span>silence</span>,  
And <span>plant</span> the seeds of justice in this land;  
If you can <span>storm</span> the gates of lies with <span>courage</span>,  
And <span>wield</span> the truth as sword and blazing <span>light</span>;  
If you can <span>free</span> the minds held long in <span>bondage</span>,  
And <span>carve</span> a future fierce with righteous <span>might</span>;  
If you can <span>call</span> the weary to awaken,  
And <span>stir</span> the hearts grown cold with doubt’s <span>embrace</span>;  
If you can <span>lift</span> the flag of freedom <span>higher</span>,  
And <span>spark</span> a flame no tyrant can <span>erase</span>;  
Yours is the <span>fight</span> that wakes the silent <span>nation</span>,  
The <span>roar</span> that shakes the chains from sea to <span>sea</span>;  
And—more than all—you’ll be the <span>Key</span>, our guide,  
The <span>beacon</span> of our boundless liberty!  
- Inspired by Christopher Key’s Mission</p>`;

function Home({ user }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationTotal, setDonationTotal] = useState(0);
  const [showMission, setShowMission] = useState(false);
  const [showFight, setShowFight] = useState(false);
  const [showChipsModal, setShowChipsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const chipsRef = useRef(null);
  const poemRef = useRef(null);

  useEffect(() => {
    // Fetch videos
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

    // Fetch donation total (placeholder)
    const fetchDonationTotal = async () => {
      setDonationTotal(0);
    };
    fetchDonationTotal();

    // GSAP animation for chips section
    const chip = chipsRef.current;
    if (chip) {
      gsap.from(chip.children, {
        duration: 1,
        opacity: 0,
        x: 50,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: chip },
      });
    }

    // Insert poem into text divs
    const textDivs = poemRef.current?.querySelectorAll('.poem-text');
    textDivs?.forEach((div) => {
      div.innerHTML = keyPoem;
    });

    // Adjust content size for poem
    const contentDiv = poemRef.current?.querySelector('.poem-content');
    if (contentDiv) {
      const adjustContentSize = () => {
        const viewportWidth = window.innerWidth;
        const baseWidth = 1000;
        const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.8 : 1;
        contentDiv.style.transform = `scale(${scaleFactor})`;
      };
      adjustContentSize();
      window.addEventListener('resize', adjustContentSize);
      return () => window.removeEventListener('resize', adjustContentSize);
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

  const handleChipsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/.netlify/functions/send-chips-email', formData);
      alert(response.data.message);
      setFormData({ name: '', email: '', address: '', phone: '' });
      setShowChipsModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit—try again!');
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      <section className="poem-section" ref={poemRef}>
        <div className="poem-container">
          <div className="poem-content">
            <div className="poem-container-full">
              <div className="poem-hue poem-animated"></div>
              <img
                className="poem-backgroundImage"
                src="https://drive.google.com/thumbnail?id=1_ZMV_LcmUXLsRokuz6WXGyN9zVCGfAHp&sz=w1920"
                alt="Background"
              />
              <img
                className="poem-boyImage"
                src="https://drive.google.com/thumbnail?id=1eGqJskQQgBJ67myGekmo4YfIVI3lfDTm&sz=w1920"
                alt="Christopher Key"
              />
              <div className="poem-container">
                <div className="poem-cube">
                  <div className="poem-face poem-top"></div>
                  <div className="poem-face poem-bottom"></div>
                  <div className="poem-face poem-left poem-text"></div>
                  <div className="poem-face poem-right poem-text"></div>
                  <div className="poem-face poem-front"></div>
                  <div className="poem-face poem-back poem-text"></div>
                </div>
              </div>
              <div className="poem-container-reflect">
                <div className="poem-cube">
                  <div className="poem-face poem-top"></div>
                  <div className="poem-face poem-bottom"></div>
                  <div className="poem-face poem-left poem-text"></div>
                  <div className="poem-face poem-right poem-text"></div>
                  <div className="poem-face poem-front"></div>
                  <div className="poem-face poem-back poem-text"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        <button className="cta-btn pulse-btn" onClick={() => setShowChipsModal(true)}>
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

      {showChipsModal && (
        <div className="chips-modal">
          <div className="chips-content">
            <h2 className="chips-title">Claim Your Free Pain & Energy Chips</h2>
            <form onSubmit={handleChipsSubmit} className="chips-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Your Email"
                required
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Your Shipping Address"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Your Phone Number"
                required
              />
              <button type="submit" className="submit-btn">Submit</button>
            </form>
            <button className="close-btn" onClick={() => setShowChipsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;