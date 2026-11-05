import React from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import ParticleBackground from './components/ParticleBackground';
import CursorTrail from './components/CursorTrail';
import StatusBar from './components/StatusBar';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Music from './components/Music';
import SoundCloudWidget from './components/SoundCloudWidget';
import Footer from './components/Footer';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <ParticleBackground />
      <CursorTrail />
      <StatusBar />
      <Nav />

      <main>
        <Hero />
        <Ticker />
        <TechStack />
        <Projects />
        <About />
        <Contact />
        <Music />
      </main>

      <Footer />
      <SoundCloudWidget />
    </>
  );
}
