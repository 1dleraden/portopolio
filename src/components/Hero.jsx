'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  Gamepad2, 
  ExternalLink, 
  Copy, 
  Check,
  ChevronDown
} from 'lucide-react';
import { GithubIcon, InstagramIcon, TiktokIcon } from './Icons';
import LanyardCard from './LanyardCard';
import TechText from './TechText';
import AeroShards from './AeroShards';

export default function Hero({ onOpenGame, onOpenResume }) {
  const roles = [
    'Web Developer',
    'Game Developer',
    'Frontend & UI Specialist',
    'Creative Software Engineer'
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll to fade out scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    if (typeof window !== 'undefined') {
      if (window.lenis) {
        window.lenis.scrollTo('#about', { offset: -70 });
      } else {
        const aboutEl = document.getElementById('about');
        aboutEl?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  // Typewriter effect for roles
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  const copyEmail = () => {
    navigator.clipboard.writeText('putraradenn247@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="hero" style={{ position: 'relative', paddingTop: '8.5rem', paddingBottom: '5rem', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Interactive AeroShards Wind Sculpture Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: 0.65
        }}
      >
        <AeroShards
          backgroundColor="#000000"
          shardColor="#38bdf8"
          accentColor="#c084fc"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={0.9}
          depth={0.8}
          speed={0.7}
          spin={0.8}
          interaction="repel"
          density={1.2}
          shardSize={1.0}
          glow={1.2}
          bloom={0.4}
          edgeSoftness={2}
          holdToGather={true}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Left Column: Bio & Intros */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Status Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', width: 'fit-content' }}>
              <span className="status-dot" />
              <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600, letterSpacing: '0.02em' }}>
                Open for Projects & Collaborations • Bogor, ID
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <p style={{ fontSize: '1rem', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                Halo, Dunia! Saya
              </p>
              <h1 style={{ margin: '0 0 1rem 0', padding: 0 }}>
                <span className="sr-only">Putra Raden Al Aziz</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: '600px' }}>
                  <div style={{ width: '100%', height: 'clamp(56px, 6.6vw, 84px)' }}>
                    <TechText
                      text="Putra Raden"
                      fontFamily="'Outfit', sans-serif"
                      fontWeight={900}
                      fontSize={160}
                      color="#ffffff"
                      accentColor="#22d3ee"
                      align="left"
                      draggable={true}
                      selection={true}
                      labels={true}
                      sweep={true}
                      specks={16}
                    />
                  </div>
                  <div style={{ width: '100%', height: 'clamp(56px, 6.6vw, 84px)' }}>
                    <TechText
                      text="Al Aziz"
                      fontFamily="'Outfit', sans-serif"
                      fontWeight={900}
                      fontSize={160}
                      color="#ffffff"
                      accentColor="#c084fc"
                      align="left"
                      draggable={true}
                      selection={true}
                      labels={true}
                      sweep={true}
                      specks={16}
                    />
                  </div>
                </div>
              </h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '2.4rem' }}>
                <span style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Seorang
                </span>
                <span 
                  className="gradient-text-cyan font-mono" 
                  style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', fontWeight: 700, borderRight: '2px solid #22d3ee', paddingRight: '4px' }}
                >
                  {displayText}
                </span>
              </div>
            </div>

            {/* Tagline / Subtitle */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.75, maxWidth: '540px' }}>
              Siswa pengembangan perangkat lunak dan gim yang berdedikasi menciptakan website interaktif, modern, cepat, serta game yang menarik secara visual dan mekanik.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
              <a href="#projects" className="btn btn-primary">
                <span>Eksplorasi Proyek</span>
                <ArrowRight size={17} />
              </a>

              <a href="#game" className="btn btn-cyan" onClick={(e) => { e.preventDefault(); const el = document.getElementById('game'); if(el) el.scrollIntoView({behavior:'smooth'}); }}>
                <Gamepad2 size={18} />
                <span>Play Game Arena</span>
              </a>

              <button 
                onClick={copyEmail}
                className="btn btn-secondary"
                title="Salin alamat email"
              >
                {copiedEmail ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copiedEmail ? 'Email Disalin!' : 'Salin Email'}</span>
              </button>
            </div>

            {/* Social Network Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Socials:</span>
              
              <a
                href="https://github.com/1dleraden"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.25)'; e.currentTarget.style.borderColor = '#8b5cf6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                aria-label="GitHub Profile"
              >
                <GithubIcon size={18} />
              </a>

              <a
                href="https://instagram.com/ptrraden_"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(236, 72, 153, 0.25)'; e.currentTarget.style.borderColor = '#ec4899'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                aria-label="Instagram Profile"
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href="https://tiktok.com/@usrrad3n"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 211, 238, 0.2)';
                  e.currentTarget.style.borderColor = '#22d3ee';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
                aria-label="TikTok Profile (@usrrad3n)"
                title="TikTok (@usrrad3n)"
              >
                <TiktokIcon size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Lanyard Conference Pass / Developer Badge */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Ambient Cyan/Dark Glow behind Lanyard Badge */}
            <div
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '380px',
                height: '420px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
                filter: 'blur(55px)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
            />

            {/* Suspended Lanyard Badge Component */}
            <LanyardCard />
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        onClick={handleScrollDown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleScrollDown()}
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
          opacity: isScrolled ? 0 : 0.85,
          pointerEvents: isScrolled ? 'none' : 'auto',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10
        }}
        aria-label="Scroll down to explore portfolio"
      >
        <div
          style={{
            width: '20px',
            height: '32px',
            borderRadius: '12px',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '6px'
          }}
        >
          <div
            className="animate-wheel-dot"
            style={{
              width: '3.5px',
              height: '7px',
              borderRadius: '3px',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            Scroll
          </span>
          <ChevronDown size={12} className="animate-scroll-down" style={{ color: '#38bdf8' }} />
        </div>
      </div>
    </section>
  );
}
