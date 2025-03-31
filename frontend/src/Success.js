import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Success() {
  return (
    <div className="main">
      <h2 className="landing-title">Thanks for Supporting KNN!</h2>
      <p className="landing-text">
        Your $17.76 Key Report subscription is confirmed—12 FREE Pain & Energy Chips are shipping soon! Check your email for details.
      </p>
      <Link to="/" className="cta-btn">Back to KNN</Link>
    </div>
  );
}
export default Success;