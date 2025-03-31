import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Videos from './Videos';
import Shop from './Shop';
import Contact from './Contact';
import StarryBackground from './StarryBackground';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <StarryBackground /> {/* Keep the SIIIIICk stars */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;