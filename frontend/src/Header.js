import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Header({ user, setShowAuth, handleLogout }) {
  const titleRef = useRef(null);
  const ctaRef = useRef(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // Mobile toggle

  useEffect(() => {
    const title = titleRef.current;
    if (title) {
      const letters = "Vaccine Police"
        .split('')
        .map((char, index) => {
          const className = index < 7 ? 'letter vaccine-letter' : 'letter police-letter';
          return `<span class="${className}">${char}</span>`;
        })
        .join('');
      title.innerHTML = letters;
      gsap.from('.letter', { duration: 1, opacity: 0, y: 50, stagger: 0.05, ease: 'power2.out' });
    }

    const cta = ctaRef.current;
    if (cta) {
      gsap.from(cta.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.2, ease: 'back.out(1.7)' });
    }
  }, []);

  const scrollToChips = () => {
    window.location.href = '/'; // Redirect to Home for chips form
  };

  const handleDonate = async (amount) => {
    const donationAmount = amount || (customAmount ? parseFloat(customAmount) : 0);
    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a valid donation amount!');
      return;
    }

    const stripe = await stripePromise;
    try {
      const response = await axios.post('/.netlify/functions/create-checkout-session', {
        amount: Math.round(donationAmount * 100),
        description: 'Donation to KNN',
      });
      const { id } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) throw error;
      setShowDonateModal(false);
      setCustomAmount('');
    } catch (err) {
      alert('Donation failed—try again!');
    }
  };

  const presetAmounts = [5, 10, 25, 50, 100, 200];

  return (
    <header className="header">
      <h1 ref={titleRef} className="title">Vaccine Police</h1>
      <p className="subtitle">Christopher Key - Truth Warrior</p>
      <div className="action-ticker">
        <span>Act NOW! Claim FREE Chips, Grab MasterPeace, Support the Fight!</span>
      </div>
      <div className={`action-cta-container ${isExpanded ? 'expanded' : ''}`} ref={ctaRef}>
        <button
          className="action-mobile-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Close Actions' : 'Take Action!'}
        </button>
        <div className="action-cta-list">
          <button onClick={scrollToChips} className="action-cta-btn pulse-btn">
            Claim FREE Pain & Energy Chips
          </button>
          <a href="https://bit.ly/christiskey" target="_blank" rel="noopener noreferrer" className="action-cta-btn pulse-btn">
            Buy MasterPeace NOW
          </a>
          <button onClick={() => setShowDonateModal(true)} className="action-cta-btn pulse-btn">
            Donate to Fuel the Fight
          </button>
        </div>
      </div>
      <div className="auth-section">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="auth-btn">Logout</button>
          </>
        ) : (
          <button onClick={() => setShowAuth(true)} className="auth-btn">Sign Up or Log In</button>
        )}
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/videos" className="nav-link">Videos</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </nav>
      {showDonateModal && (
        <div className="donate-modal">
          <div className="donate-content">
            <h2 className="donate-title">Support KNN - Choose Your Donation</h2>
            <div className="donation-grid">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleDonate(amount)}
                  className="cta-btn donation-btn"
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="custom-donation">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter custom amount ($)"
                className="donate-input"
                min="1"
              />
              <button onClick={() => handleDonate()} className="cta-btn custom-donate-btn">
                Donate Any Amount
              </button>
            </div>
            <button className="close-btn" onClick={() => setShowDonateModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;