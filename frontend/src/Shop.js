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
      gsap.from(products.children, {
        duration: 1,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: products },
      });
    }

    const sponsored = sponsoredRef.current;
    if (sponsored) {
      gsap.from(sponsored.children, {
        duration: 1,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: sponsored },
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
            <button
              className="cta-btn"
              onClick={() => window.open('https://bit.ly/christiskey', '_blank')}
            >
              Learn More
            </button>
          </div>
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/admezub1dbxvfrr2bmls"
              alt="IGF-1 Supplement"
              className="product-image"
            />
            <h3 className="product-title">IGF-1 Supplement</h3>
            <p className="product-text">
              Boost your vitality and performance with this powerful IGF-1 formula for optimal health.
            </p>
            <button
              className="cta-btn"
              onClick={() => window.open('https://getigf1.com', '_blank')}
            >
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
            <button
              className="cta-btn"
              onClick={() =>
                window.open('https://www.freedomlawschool.org/affiliate?code=vaccinepolice', '_blank')
              }
            >
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
            <button
              className="cta-btn"
              onClick={() => window.open('https://cardiomiracle.myshopify.com/KEY', '_blank')}
            >
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
            <button
              className="cta-btn"
              onClick={() => window.open('https://centropix.us/christiskey', '_blank')}
            >
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
            <button
              className="cta-btn"
              onClick={() => window.open('https://keys2life.b3sciences.com', '_blank')}
            >
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
            <button
              className="cta-btn"
              onClick={() =>
                window.open(
                  'https://globalhealing.com/?irclickid=wz3WxVXATxyKTn0TP8038V7zUks3XJ1JMxcsVo0&irgwc=1&utm_source=ir&utm_medium=referral&utm_campaign=3231152&utm_term=971435',
                  '_blank'
                )
              }
            >
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/wvsd59jkfmhwogvwwbfx"
              alt="Apricot Seeds"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Apricot Seeds</h3>
            <p className="sponsored-text">
              Harness the power of nature with these nutrient-rich seeds for wellness.
            </p>
            <button
              className="cta-btn"
              onClick={() =>
                window.open(
                  'https://rncstore.com/?utm_source=simple-affiliate&utm_medium=referral&utm_campaign=Jennifer+%285274143522876%29&sacode=tdeanq',
                  '_blank'
                )
              }
            >
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/hiut1t0d9xgfdliuhe68"
              alt="Microbiome"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Microbiome</h3>
            <p className="sponsored-text">
              Support gut health and immunity with advanced microbiome solutions.
            </p>
            <button
              className="cta-btn"
              onClick={() => window.open('https://microbiomelabs.com/register/?ref=VPolice', '_blank')}
            >
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/h6pajzrzb5mtee9rjfsd"
              alt="Sulphur Crystals"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Sulphur Crystals</h3>
            <p className="sponsored-text">
              Purify and energize your body with these potent sulphur crystals.
            </p>
            <button
              className="cta-btn"
              onClick={() =>
                window.open('https://www.h2oairwateramericas.com/?affid=vaccine-police', '_blank')
              }
            >
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/g8ziobkzyd3ditqq4aag"
              alt="PH Prescription Water"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">PH Prescription Water</h3>
            <p className="sponsored-text">
              Hydrate and balance your body with optimized pH water for health.
            </p>
            <button
              className="cta-btn"
              onClick={() => window.open('https://www.phprescription.com/?ref=CKey', '_blank')}
            >
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/Screenshot_2025-06-18_at_8.42.52_AM_vwqgau"
              alt="Nesa's Hemp"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Nesa's Hemp</h3>
            <p className="sponsored-text">
              Experience premium hemp products for wellness and balance.
            </p>
            <button
              className="cta-btn"
              onClick={() => window.open('https://www.nesashemp.com/#key', '_blank')}
            >
              Get It Now
            </button>
          </div>
          <div className="sponsored-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/v1751910808/Screenshot_2025-07-07_at_12.52.47_PM_tbkcmd.png"
              alt="Triad Aer"
              className="sponsored-image"
            />
            <h3 className="sponsored-title">Triad Aer</h3>
            <p className="sponsored-text">
              Purify your air and enhance wellness with advanced air purification technology.
            </p>
            <button
              className="cta-btn"
              onClick={() => window.open('https://mytriadaer.funnelpages.com/KEY', '_blank')}
            >
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