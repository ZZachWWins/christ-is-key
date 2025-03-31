import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Shop() {
  const productsRef = useRef(null);
  const sponsoredRef = useRef(null);

  useEffect(() => {
    const products = productsRef.current;
    if (products) {
      gsap.from(products.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: products } });
    }

    const sponsored = sponsoredRef.current;
    if (sponsored) {
      gsap.from(sponsored.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: sponsored } });
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

  return (
    <main className="main">
      <section className="products-section" ref={productsRef}>
        <h2 className="section-title">KNN Freedom Essentials</h2>
        <div className="products-grid">
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/fvcwlsdc0botrbzzk3xp"
              alt="MasterPeace"
              className="product-image"
            />
            <h3 className="product-title">MasterPeace</h3>
            <p className="product-text">
              Detox your body from heavy metals and reclaim your Temple with this game-changing formula.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://bit.ly/christiskey', '_blank')}>
              Learn More
            </button>
          </div>
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/admezub1dbxvfrr2bmls"
              alt="IGF-1"
              className="product-image"
            />
            <h3 className="product-title">IGF-1</h3>
            <p className="product-text">
              Boost your vitality and strength with this natural growth factor.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://getifg1.com', '_blank')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="sponsored-section" ref={sponsoredRef}>
        <h2 className="section-title">KNN Sponsored Gear</h2>
        <div className="sponsored-grid">
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/o51xmti0h4wd4w1y4rp2"
              alt="Freedom Law School"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Freedom Law School</h3>
            <p className="sponsored-text">
              Arm yourself with knowledge to fight tyranny—learn your rights.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://www.freedomlawschool.org/affiliate?code=vaccinepolice', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/flnxzvhblggdbgnnqe2f"
              alt="Cardio Miracle"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Cardio Miracle</h3>
            <p className="sponsored-text">
              Supercharge your heart health with this nitric oxide powerhouse.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://cardiomiracle.myshopify.com/KEY', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/l80zdqvcwmvluw1aujcq"
              alt="KLOUD/PEMF"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">KLOUD/PEMF</h3>
            <p className="sponsored-text">
              Heal with pulsed electromagnetic fields—recharge your body’s energy.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://centropix.us/christiskey', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/gqzznuwtbyns65uwiafq"
              alt="B3 Bands"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">B3 Bands</h3>
            <p className="sponsored-text">
              Build muscle and boost recovery with blood flow restriction.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://keys2life.b3sciences.com', '_blank')}>
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/suzt0afdbmtveja9a1gv"
              alt="Global Healing"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Global Healing</h3>
            <p className="sponsored-text">
              Cleanse and restore with premium supplements—pure health.
            </p>
            <button className="cta-btn" onClick={() => window.open('https://globalhealing.com/?irclickid=wz3WxVXATxyKTn0TP8038V7zUks3XJ1JMxcsVo0&irgwc=1&utm_source=ir&utm_medium=referral&utm_campaign=3231152&utm_term=971435', '_blank')}>
              Get It Now
            </button>
          </div>
        </div>
       <button className="cta-btn pulse-btn" onClick={handleCheckout}>
  <span className="exclusive-badge">KNN Exclusive</span> Get the Key Report - $17.76
      </button>
      </section>
    </main>
  );
}

export default Shop;