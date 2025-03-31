import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function About() {
  const bioRef = useRef(null);
  const ministryRef = useRef(null);

  useEffect(() => {
    const bio = bioRef.current;
    if (bio) {
      gsap.from(bio.children, { duration: 1, opacity: 0, y: 30, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: bio } });
    }

    const ministry = ministryRef.current;
    if (ministry) {
      gsap.from(ministry.children, { duration: 1, opacity: 0, x: -50, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: ministry } });
    }
  }, []);

  return (
    <main className="main">
      <section className="who-i-am-section" ref={bioRef}>
        <h2 className="section-title">Who I Am</h2>
        <div className="bio-container">
          <div className="bio-image">
            <img
              src="https://res.cloudinary.com/diwgwgndv/image/upload/w_300,h_300,c_fill/hegegf5e0xzx7siuncsv"
              alt="Christopher Key"
              className="christopher-pic"
            />
          </div>
          <p className="section-text accent-text">
            I’m Christopher Key, the Vaccine Police—a health advocate, patriot, and disciple of Jesus. My whole life, I’ve stood tall against the masses, fighting evil with the strength He gives me. God chose me to defend human rights and the defenseless. From Sports Illustrated covers to owning Steel City Fitness and co-owning SWATS (seized by the feds seven years ago), I’ve lived bold. Fired from a six-year gig for battling Alabama’s tyrannical school board over mask mandates, I now roam the nation for YOUR KIDS!
          </p>
        </div>
      </section>

      <section className="ministry-section" ref={ministryRef}>
        <h2 className="section-title">Keys 2 Life Ministry</h2>
        <p className="section-text">
          We’re here to reclaim our God-given Temple and do His work—together. Evil corrupts our air, water, food, and bodies, but we fight back with real solutions: pure air, clean water, honest food, potent supplements, sacred herbs, and healing frequencies. In our frequency fellowship, we resonate as one to serve God’s will, uplift His people, and wage peaceful war on government and corporate tyranny—every damn day.
        </p>
      </section>
    </main>
  );
}

export default About;