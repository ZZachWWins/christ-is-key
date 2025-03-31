import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Videos from './Videos';
import Shop from './Shop';
import Contact from './Contact';
import './App.css'; // Matches your working fix

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Vaccine Police</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/videos">Videos</a>
            <a href="/shop">Shop</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <footer>
          <p>© 2025 Vaccine Police</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;