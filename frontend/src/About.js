import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import StarryBackground from './StarryBackground';

function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    gsap.from(aboutRef.current.children, { duration: 1, opacity: 0, y: 30, stagger: 0.2, ease: 'power3.out' });
  }, []);

  return (
    <>
      <StarryBackground />
      <div className="rotating-text-background">Vaccine Police</div>
      <section className="who-i-am-section" ref={aboutRef}>
        <h2 className="section-title">About Christopher Key</h2>
        <div className="bio-container">
          <div className="bio-image">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_300,c_fill/hegegf5e0xzx7siuncsv"
              alt="Christopher Key"
              className="christopher-pic"
            />
          </div>
          <p className="section-text accent-text">
            I’m Christopher Key, the Vaccine Police—a health advocate, patriot, and disciple of Jesus. My life’s been a battle against tyranny, from Sports Illustrated covers to owning Steel City Fitness and co-owning SWATS (seized by the feds). Fired for fighting mask mandates, I now roam the nation for YOUR KIDS, exposing corruption and healing lives with God’s strength.
          </p>
        </div>
        <p className="section-text">
          My whole life I’ve stood up for my beliefs when the masses were against me. I have a strong drive to do what’s right for myself and my fellow humans. God has chosen me to fight for human rights and protect those who can’t protect themselves. Through Keys 2 Life Ministry, I’m here to arm you with truth, health, and freedom. Join me.
        </p>
      </section>
    </>
  );
}

export default About;