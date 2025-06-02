import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Header({ user, setShowAuth, handleLogout }) {
  const ctaRef = useRef(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showChipsModal, setShowChipsModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [formError, setFormError] = useState('');

  // Simplified ticker text
  const tickerText = window.innerWidth <= 768 
    ? "Claim Your Free Pain & Energy Chips Now!" 
    : "Claim Your 12 Free Pain & Energy Chips Today! - Press the Free Chips Button Below!";

  useEffect(() => {
    const cta = ctaRef.current;
    if (cta) {
      gsap.from(cta.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.2, ease: 'back.out(1.7)' });
    }
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleChipsSubmit = async (e) => {
    e.preventDefault();
    const { name, email, address, phone } = formData;

    // Basic validation
    if (!name || !email || !address || !phone) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      await axios.post('/.netlify/functions/send-chips-email', {
        name,
        email,
        address,
        phone
      });
      setShowChipsModal(false);
      setFormData({ name: '', email: '', address: '', phone: '' });
      alert('Your request has been sent! Check your email for confirmation.');
    } catch (err) {
      setFormError('Failed to send request. Please try again.');
    }
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
      {/* Sticky element at the top */}
      <div className="sticky-bar">
        <a
          href="https://bit.ly/christiskey"
          target="_blank"
          rel="noopener noreferrer"
          className="action-cta-btn"
        >
          MasterPeace
        </a>
        <a
          href="https://getigf1.com"
          target="_blank"
          rel="noopener noreferrer"
          className="action-cta-btn"
        >
          IGF1
        </a>
        <button
          onClick={() => setShowDonateModal(true)}
          className="action-cta-btn"
        >
          Donate
        </button>
      </div>

      {/* Existing header content */}
      <div className="header-content">
        <div className="header-left">
          <img
            src="https://res.cloudinary.com/diwgwgndv/image/upload/w_120,h_120,c_fill/image000000_vx5dvn"
            alt="Earth under a dome"
            className="header-logo"
          />
        </div>
        <div className="header-right">
          <h1 className="header-title">Christopher Key - Truth Warrior</h1>
          <p className="subtitle">WE DO NOT SHIP ANY PRODUCTS TO THE STATE OF ALABAMA</p>
          <div className={`action-cta-container ${isExpanded ? 'expanded' : ''}`} ref={ctaRef}>
            <button
              className="action-mobile-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Close Actions' : 'PRESS HERE NOW'}
            </button>
            <div className="action-ticker">
              <span>{tickerText}</span>
            </div>
            <div className="action-cta-list">
              {/* No buttons here as MasterPeace and Donate are now in sticky-bar */}
            </div>
          </div>
        </div>
      </div>
      <div className="auth-section">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="auth-btn">Logout</button>
          </>
        ) : (
          <button onClick={() => setShowAuth(true)} className="auth-btn">
            Sign Up or Log In
          </button>
        )}
        </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/videos" className="nav-link">Videos</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
        <Link
          to="#"
          className="nav-link nav-free-chips"
          onClick={() => setShowChipsModal(true)}
        >
          Free Chips
        </Link>
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
                  className="donation-btn"
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
              <button onClick={() => handleDonate()} className="custom-donate-btn">
                Donate Any Amount
              </button>
            </div>
            <button className="close-btn" onClick={() => setShowDonateModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {showChipsModal && (
        <div className="chips-modal">
          <div className="chips-content">
            <h2 className="chips-title">Claim Free Pain and Energy Chips</h2>
            <form onSubmit={handleChipsSubmit} className="chips-form">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Full Name"
                className="chips-input"
                required
              />
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Email Address"
                className="chips-input"
                required
              />
              <label htmlFor="address" className="form-label">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Shipping Address"
                className="chips-input"
                rows="4"
                required
              />
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Phone Number"
                className="chips-input"
                required
              />
              {formError && <p className="form-error">{formError}</p>}
              <div className="chips-form-buttons">
                <button type="submit" className="chips-submit-btn">
                  Submit Request
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowChipsModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;