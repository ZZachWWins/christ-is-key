import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function FloatingCTAs({ scrollToChips }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleDonate = async (amount) => {
    const donationAmount = amount || (customAmount ? parseFloat(customAmount) : 0);
    if (!donationAmount || donationAmount <= 0) {
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
      setShowDonateModal(false); // Close modal on success
      setCustomAmount(''); // Reset input
    } catch (err) {
      alert('Donation failed—try again!');
    }
  };

  const presetAmounts = [5, 10, 25, 50, 100, 200];

  return (
    <>
      <div className="floating-ctas">
        <a href="https://bit.ly/christiskey" target="_blank" rel="noopener noreferrer" className="cta-btn floating-btn">
          Buy MasterPeace
        </a>
        <button onClick={scrollToChips} className="cta-btn floating-btn">
          Claim Free Chips
        </button>
        <button onClick={() => setShowDonateModal(true)} className="cta-btn floating-btn">
          Donate
        </button>
      </div>

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
    </>
  );
}

export default FloatingCTAs;