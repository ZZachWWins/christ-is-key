import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import StarryBackground from './StarryBackground';

function Shop() {
  const shopRef = useRef(null);

  useEffect(() => {
    gsap.from(shopRef.current.children, { duration: 1, opacity: 0, scale: 0.9, stagger: 0.1, ease: 'back.out(1.7)' });
  }, []);

  return (
    <>
      <StarryBackground />
      <div className="rotating-text-background">Vaccine Police</div>
      <section className="products-section" ref={shopRef}>
        <h2 className="section-title">Freedom Essentials & Gear</h2>
        <p className="section-text">
          Equip yourself with the tools to reclaim your health and liberty—straight from the Vaccine Police arsenal.
        </p>
        <div className="products-grid">
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/fvcwlsdc0botrbzzk3xp"
              alt="MasterPeace"
              className="product-image"
            />
            <h3 className="product-title">MasterPeace</h3>
            <p className="product-text">Detox heavy metals—pure and potent.</p>
            <button className="cta-btn" onClick={() => window.open('https://bit.ly/christiskey', '_blank')}>
              Buy Now
            </button>
          </div>
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_200,c_fill/admezub1dbxvfrr2bmls"
              alt="IGF-1"
              className="product-image"
            />
            <h3 className="product-title">IGF-1</h3>
            <p className="product-text">Boost vitality and strength.</p>
            <button className="cta-btn" onClick={() => window.open('https://getifg1.com', '_blank')}>
              Buy Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Shop;