import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Cancel() {
  return (
    <div className="main">
      <h2 className="landing-title">Checkout Cancelled</h2>
      <p className="landing-text">
        No worries—your support keeps KNN fighting. Ready to try again?
      </p>
      <Link to="/" className="cta-btn">Back to KNN</Link>
    </div>
  );
}
export default Cancel;