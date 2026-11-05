import React, { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import StatusBar from './components/StatusBar';
import Nav from './components/Nav';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import SoundCloudWidget from './components/SoundCloudWidget';
import Footer from './components/Footer';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <ParticleBackground />
      <StatusBar />
      <Nav onMenuToggle={setMenuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero />
        <Ticker />
        <TechStack />
        <Projects />
        <About />
        <Contact />
      </main>

      <Footer />
      <SoundCloudWidget />
    </>
  );
}
