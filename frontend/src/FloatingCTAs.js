import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function FloatingCTAs({ scrollToChips }) {
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonate = async () => {
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      alert('Please enter a valid donation amount!');
      return;
    }

    const stripe = await stripePromise;
    try {
      const response = await axios.post('/.netlify/functions/create-checkout-session', {
        amount: Math.round(donationAmount * 100), // Convert to cents
        description: 'Donation to KNN',
      });
      const { id } = response.data;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) throw error;
    } catch (err) {
      alert('Donation failed—try again!');
    }
  };

  return (
    <div className="floating-ctas">
      <a href="https://bit.ly/christiskey" target="_blank" rel="noopener noreferrer" className="cta-btn floating-btn">
        Buy MasterPeace
      </a>
      <button onClick={scrollToChips} className="cta-btn floating-btn">
        Claim Free Chips
      </button>
      <div className="donate-cta">
        <input
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          placeholder="Enter amount ($)"
          className="donate-input"
          min="1"
        />
        <button onClick={handleDonate} className="cta-btn floating-btn">
          Donate
        </button>
      </div>
    </div>
  );
}

export default FloatingCTAs;