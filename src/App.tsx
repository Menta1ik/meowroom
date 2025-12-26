import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import Cats from './pages/Cats';
import Visit from './pages/Visit';
import Donate from './pages/Donate';
import Contacts from './pages/Contacts';
import BecomeSponsor from './pages/BecomeSponsor';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cats" element={<Cats />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/become-sponsor" element={<BecomeSponsor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
