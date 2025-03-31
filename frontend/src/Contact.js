import React, { useState } from 'react';
import StarryBackground from './StarryBackground';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for reaching out! We’ll get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <>
      <StarryBackground />
      <div className="rotating-text-background">Vaccine Police</div>
      <section className="chips-section">
        <h2 className="section-title">Contact the Vaccine Police</h2>
        <p className="section-text">
          Got a story? Need to connect? Drop us a line—your voice fuels the fight against tyranny and corruption.
        </p>
        <form onSubmit={handleSubmit} className="chips-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            required
          />
          <button type="submit" className="cta-btn">Send Message</button>
        </form>
      </section>
    </>
  );
}

export default Contact;