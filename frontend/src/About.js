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
            My whole life I have stood up for my beliefs when many times the masses were against me. I have a strong drive to do what is right for myself and my fellow humans. I am a health advocate, a patriot, and a disciple of Jesus. He gives me the strength to take on the evil in this world and fight for what is right. I believe God has chosen me to fight for human rights and to protect those who cannot protect themselves. I have dedicated my life to serving the people of the world. My goal EVERY DAY is to make a difference with the peaceful protest of the injustices from the government and greedy corporations. Everything I do is amplified by the support of those around me and for that, I am extremely grateful. God Bless You All!

I have owned a health club called Steel City Fitness, which specialized in health and wellness, and co-owned SWATS,  a company with its own controversy. I also started a company called Health Management Systems that utilized a device that measures body fat.

I have been on the cover of Sports Illustrated, and I helped professional athletes and the public without drugs, chemicals, and surgery until the government came and seized everything I owned and shut me down. This happened seven years ago.

I was recently fired from my job of six years for being a patriot and standing against a tyrannical school board in Alabama. Because of these efforts, the mask mandate was lifted, and kids will not have to provide proof of inoculation to return to in-person learning in the fall.

Since publicly announcing that victory and encouraging fellow Americans to fight against the unconstitutional mandates, I was fired from my job by my ‘bully boss.’

Rather than feeling sorry for myself, I have responded to a higher calling and will be traveling the country to fight for YOUR KIDS!
          </p>
        </div>
      </section>

      <section className="ministry-section" ref={ministryRef}>
        <h2 className="section-title">Keys 2 Life Ministry</h2>
        <p className="section-text">
          Our Mission is to learn and share our knowledge on how to take back our God given Temple so we can do God's work. We are all in this together and , since evil forces are coming for all of us corrupting our environment and bodies -our temples-, we have to come together and work together loving ourselves, loving all others as we love ourselves, and taking in real air, real water, real food, real supplements, real herbs and real frequencies.In a frequency fellowship we must all align in resonance to do God's will, to help God's people and, most importantly, to help God's children.
        </p>
      </section>
    </main>
  );
}

export default About;