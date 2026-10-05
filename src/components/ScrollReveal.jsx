'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * ScrollReveal Component
 * Hardware-accelerated, buttery smooth scroll reveal animation for elements and sections.
 * Perfectly calibrated to match Lenis smooth inertial scrolling.
 *
 * @param {React.ReactNode} children
 * @param {'fade-up'|'fade-down'|'fade-left'|'fade-right'|'zoom-in'|'blur-in'} animation
 * @param {number} delay - delay in milliseconds (e.g. 100, 200, 300)
 * @param {number} duration - animation duration in seconds (default: 0.85s)
 * @param {number} threshold - visibility threshold to trigger (0.0 to 1.0, default: 0.12)
 * @param {string} rootMargin - rootMargin string (default: '0px 0px -50px 0px')
 * @param {boolean} once - if true, animation triggers once and remains visible
 * @param {string} className - optional additional class names
 * @param {React.CSSProperties} style - optional inline styles
 * @param {string} as - HTML tag name (default: 'div')
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.85,
  threshold = 0.12,
  rootMargin = '0px 0px -50px 0px',
  once = true,
  className = '',
  style = {},
  as: Component = 'div',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  // Determine initial hidden styles based on chosen animation type
  const getHiddenTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translate3d(0, 38px, 0)';
      case 'fade-down':
        return 'translate3d(0, -38px, 0)';
      case 'fade-left':
        return 'translate3d(-40px, 0, 0)';
      case 'fade-right':
        return 'translate3d(40px, 0, 0)';
      case 'zoom-in':
        return 'scale3d(0.92, 0.92, 1) translate3d(0, 20px, 0)';
      case 'blur-in':
        return 'scale3d(0.97, 0.97, 1)';
      default:
        return 'translate3d(0, 38px, 0)';
    }
  };

  const getHiddenFilter = () => {
    switch (animation) {
      case 'blur-in':
        return 'blur(12px)';
      default:
        return 'blur(6px)';
    }
  };

  const animatedStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale3d(1, 1, 1)' : getHiddenTransform(),
    filter: isVisible ? 'blur(0px)' : getHiddenFilter(),
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: isVisible ? 'auto' : 'transform, opacity, filter',
    ...style
  };

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? 'is-revealed' : ''} ${className}`}
      style={animatedStyles}
      {...props}
    >
      {children}
    </Component>
  );
}
