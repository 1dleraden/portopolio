'use client';

import { useState, useEffect } from 'react';

/**
 * ScrollProgressBar Component
 * Sleek, futuristic top neon laser progress bar that tracks the user's scroll percentage.
 * Seamlessly hooks into Lenis smooth scroll engine with fallback to window scroll.
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animFrameId;

    const updateProgress = (progress) => {
      setScrollProgress(Math.min(100, Math.max(0, progress * 100)));
    };

    // If Lenis is active on window, hook directly into its RAF events
    if (window.lenis) {
      const onLenisScroll = (e) => {
        updateProgress(e.progress);
      };

      window.lenis.on('scroll', onLenisScroll);

      return () => {
        if (window.lenis) {
          window.lenis.off('scroll', onLenisScroll);
        }
      };
    } else {
      // Fallback to standard window scroll listener
      const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const currentProgress = window.scrollY / totalHeight;
          updateProgress(currentProgress);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'rgba(255, 255, 255, 0.03)'
      }}
      aria-hidden="true"
    >
      <div
        style={{
          height: '100%',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 35%, #818cf8 70%, #c084fc 100%)',
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.8), 0 0 20px rgba(129, 140, 248, 0.5)',
          transition: 'width 0.1s linear',
          willChange: 'width'
        }}
      />
    </div>
  );
}
