'use client';

import { useState, useEffect, useRef } from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle2, Play, Volume2 } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('MEMULAI RUNTIME PORTFOLIO...');
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [readyForGesture, setReadyForGesture] = useState(false);
  const hasExitedRef = useRef(false);

  const proceedToExit = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    setIsExiting(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-lanyard-drop'));
    }
    if (onComplete) onComplete();
    setTimeout(() => {
      setIsMounted(false);
    }, 650);
  };

  const handleLaunch = (e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && window.playPortfolioMusic) {
      window.playPortfolioMusic().catch(() => {});
    }
    proceedToExit();
  };

  const handleSkip = (e) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && window.playPortfolioMusic) {
      window.playPortfolioMusic().catch(() => {});
    }
    setProgress(100);
    setStatusText('SISTEM SIAP // SELAMAT DATANG!');
    proceedToExit();
  };

  // Keyboard shortcut listener (Space or Enter to launch when ready)
  useEffect(() => {
    if (!readyForGesture) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleLaunch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readyForGesture]);

  useEffect(() => {
    // 1. Immediately preload the audio file in memory
    try {
      const preloadAudio = new Audio('/music/laskar-cinta.mp3');
      preloadAudio.preload = 'auto';
      preloadAudio.load();
    } catch (e) {}

    // 2. Dynamic loading sequence
    const stages = [
      { at: 15, text: 'MEMUAT MODUL INTI & KERNEL REACT 19...' },
      { at: 35, text: 'MENGINISIALISASI SHADER STARFIELD 60 FPS...' },
      { at: 55, text: 'MERAKIT LANYARD ID PASS 3D & FISIKA PEGAS...' },
      { at: 75, text: 'MENGHUBUNGKAN PROTOKOL AUDIO PORTFOLIO...' },
      { at: 92, text: 'MENYIAPKAN ARENA GAME & BENTO GRID...' },
      { at: 100, text: 'SISTEM SIAP // SELAMAT DATANG!' }
    ];

    let currentVal = 0;
    const interval = setInterval(() => {
      // Natural variable speed
      const increment = currentVal < 60 ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 6) + 4;
      currentVal = Math.min(100, currentVal + increment);
      setProgress(currentVal);

      // Update diagnostic text
      const matchingStage = stages.find((s) => currentVal <= s.at);
      if (matchingStage) {
        setStatusText(matchingStage.text);
      }

      if (currentVal >= 100) {
        clearInterval(interval);

        // Attempt zero-delay audio playback
        if (typeof window !== 'undefined' && window.playPortfolioMusic) {
          const playPromise = window.playPortfolioMusic();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise
              .then(() => {
                // Autoplay permitted by browser! Proceed immediately without delay
                setTimeout(proceedToExit, 250);
              })
              .catch(() => {
                // Browser requires user gesture! Show prompt to enter with 1 click
                setReadyForGesture(true);
              });
            return;
          }
        }

        // Default timer if no promise returned
        setTimeout(proceedToExit, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      onClick={(e) => {
        if (readyForGesture) handleLaunch(e);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#030508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        select: 'none',
        userSelect: 'none',
        cursor: readyForGesture ? 'pointer' : 'default',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.04)' : 'scale(1)',
        filter: isExiting ? 'blur(10px)' : 'none',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease',
        pointerEvents: isExiting ? 'none' : 'auto'
      }}
    >
      {/* Background Cyber Grid & Ambient Bloom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 30%, transparent 80%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 65%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      {/* Center Console Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '440px',
          padding: '0 1.5rem',
          textAlign: 'center'
        }}
      >
        {/* Glowing Icon Box */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(6, 25, 40, 0.85)',
            border: '1.5px solid rgba(6, 182, 212, 0.45)',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22d3ee',
            marginBottom: '1.5rem',
            animation: 'pulseGlow 2.5s ease-in-out infinite'
          }}
        >
          <Cpu size={28} />
        </div>

        {/* Title & Role */}
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.15em',
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.2
          }}
        >
          PUTRA RADEN AL AZIZ
        </h1>

        <p
          style={{
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#22d3ee',
            marginTop: '0.4rem',
            marginBottom: '1.85rem'
          }}
        >
          ARSITEK FRONTEND &amp; GAME DEVELOPER
        </p>

        {/* Loading Progress Track */}
        <div style={{ width: '100%', marginBottom: '0.75rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '6px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 50%, #10b981 100%)',
                borderRadius: '9999px',
                boxShadow: '0 0 14px rgba(6, 182, 212, 0.65)',
                transition: 'width 0.06s ease-out'
              }}
            />
          </div>

          {/* Diagnostic Status & Percentage */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.65rem',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span
              style={{
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '320px',
                textAlign: 'left'
              }}
            >
              {statusText}
            </span>
            <span style={{ color: '#22d3ee', fontWeight: 800, marginLeft: '0.5rem' }}>
              {String(progress).padStart(3, '0')}%
            </span>
          </div>
        </div>

        {/* Action Button: Instant Enter & Play Dewa 19 or Skip */}
        {readyForGesture ? (
          <div style={{ marginTop: '1.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={handleLaunch}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
                border: '1.5px solid #22d3ee',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), inset 0 0 15px rgba(6, 182, 212, 0.25)',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                animation: 'pulseGlow 2s infinite',
                transition: 'all 0.2s',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              title="Masuk ke Portofolio"
            >
              <Play size={16} fill="#22d3ee" color="#22d3ee" />
              <span>MASUK</span>
            </button>

            <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              [ Klik di mana saja atau tekan Enter / Spasi ]
            </span>
          </div>
        ) : (
          <button
            onClick={handleSkip}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              marginTop: '0.85rem',
              borderRadius: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            title="Langsung Masuk ke Halaman Web dan Mulai Musik"
          >
            [ LEWATI INISIALISASI ]
          </button>
        )}
      </div>

      {/* Footer System Telemetry */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '28px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          color: '#475569'
        }}
      >
        <span>STATUS: 200 OK • BOGOR, ID</span>
        <span>LATENSI: 12ms // STABIL</span>
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(6, 182, 212, 0.2);
            border-color: rgba(6, 182, 212, 0.45);
          }
          50% {
            box-shadow: 0 0 35px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(6, 182, 212, 0.35);
            border-color: rgba(34, 211, 238, 0.8);
          }
        }
      `}</style>
    </div>
  );
}
