'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll with buttery exponential easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node) => {
        return Boolean(
          node &&
          (node.classList?.contains('lenis-prevent') ||
            (node.closest &&
              (node.closest('[data-lenis-prevent]') ||
                node.closest('.music-player-root') ||
                node.closest('.music-expanded-card') ||
                node.closest('.top-artists-modal-overlay') ||
                node.closest('.modal-glass-card'))))
        );
      }
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    let animId;
    function raf(time) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    // Smooth navigation anchor link clicks (e.g. #hero, #about, #skills, #projects, #contact)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -75,
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return <>{children}</>;
}
