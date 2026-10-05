'use client';

import { useState, useEffect } from 'react';
import Starfield from '@/components/Starfield';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutBento from '@/components/AboutBento';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import MiniGame from '@/components/MiniGame';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import DevConsoleModal from '@/components/DevConsoleModal';
import ResumeModal from '@/components/ResumeModal';
import MusicPlayer from '@/components/MusicPlayer';
import Preloader from '@/components/Preloader';
import ScrollProgressBar from '@/components/ScrollProgressBar';

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

  // Shortcut key listener (Ctrl+` or Ctrl+K for Dev Console)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top Laser Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Cybernetic Initialization Preloader */}
      <Preloader onComplete={() => setStartMusic(true)} />

      {/* 60 FPS Interactive Starfield Canvas Background */}
      <Starfield />

      {/* Navigation */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Main Flow */}
      <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Hero
          onOpenResume={() => setResumeOpen(true)}
        />

        <AboutBento />

        <SkillsSection />

        <ProjectsSection />

        <MiniGame />

        <ExperienceTimeline />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Lo-Fi Music Player */}
      <MusicPlayer autoPlay={startMusic} />

      {/* Modals */}
      <DevConsoleModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </>
  );
}
