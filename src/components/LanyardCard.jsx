'use client';

import { useState, useRef, useEffect } from 'react';
import { RotateCw, ShieldCheck, Sparkles, ExternalLink, Move } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function LanyardCard() {
  // isFlipped = false -> Photo ID Pass face (default front)
  // isFlipped = true  -> Security Clearance face (back face)
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  // Entrance drop animation state: 'initial' -> 'dropping' -> 'settled'
  const [dropState, setDropState] = useState('initial');
  const hasDroppedRef = useRef(false);

  // Direct DOM Refs for 120 FPS GPU-accelerated motion (ZERO React re-renders during drag/swing!)
  const containerRef = useRef(null);
  const cardRigRef = useRef(null);
  const flipContainerRef = useRef(null);
  const strapLeftRef = useRef(null);
  const strapRightRef = useRef(null);
  const claspGroupRef = useRef(null);
  const sheenRef1 = useRef(null);
  const sheenRef2 = useRef(null);

  // Physics and interaction mutable state (kept outside React state to prevent stutter)
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initialX: 0, initialY: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0, lastX: 0, lastY: 0, lastTime: 0 });
  const tiltTargetRef = useRef({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const tiltCurrentRef = useRef({ x: 0, y: 0 });

  const physicsRef = useRef({
    targetX: 0,
    targetY: 0,
    currX: 0,
    currY: 0,
    vx: 0,
    vy: 0,
    currRotZ: 0,
    rotZv: 0
  });

  // ============================================================
  // LANYARD DROP ENTRANCE TRIGGER (SYNCHRONIZED WITH PRELOADER EXIT)
  // ============================================================
  useEffect(() => {
    // If user prefers reduced motion, skip drop animation immediately
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDropState('settled');
      hasDroppedRef.current = true;
      return;
    }

    const triggerDrop = () => {
      if (hasDroppedRef.current) return;
      hasDroppedRef.current = true;
      setDropState('dropping');

      // Impart organic pendulum sway impulse right as the badge hits the bottom overshoot
      setTimeout(() => {
        if (physicsRef.current) {
          physicsRef.current.rotZv = 1.35;
          physicsRef.current.vy = 3.5;
        }
      }, 700);

      // Transition to clean settled state after bounce sequence completes
      setTimeout(() => {
        setDropState('settled');
      }, 1400);
    };

    window.addEventListener('trigger-lanyard-drop', triggerDrop);

    // Global debug trigger function
    if (typeof window !== 'undefined') {
      window.triggerLanyardDrop = triggerDrop;
    }

    // Safety fallback: ensure card appears even if preloader was dismissed earlier
    const fallbackTimer = setTimeout(() => {
      if (!hasDroppedRef.current) {
        triggerDrop();
      }
    }, 2800);

    return () => {
      window.removeEventListener('trigger-lanyard-drop', triggerDrop);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // ============================================================
  // HIGH-FREQUENCY 60/120 FPS GPU RENDERING TICKER
  // ============================================================
  useEffect(() => {
    let animId;
    const ropeLength = 220;
    const springK = 0.052;
    const damping = 0.92;

    const renderFrame = () => {
      const p = physicsRef.current;

      if (isDraggingRef.current) {
        // Silky smooth interpolation (lerp) towards cursor target
        p.currX += (p.targetX - p.currX) * 0.45;
        p.currY += (p.targetY - p.currY) * 0.45;

        // Realistic pendulum swing angle follows displacement
        const targetRotZ = Math.atan2(p.currX, ropeLength + p.currY) * (180 / Math.PI) * 1.25;
        p.currRotZ += (targetRotZ - p.currRotZ) * 0.28;
      } else {
        // Elastic spring oscillation returning to origin
        const ax = -springK * p.currX;
        const ay = -springK * p.currY;

        p.vx = (p.vx + ax) * damping;
        p.vy = (p.vy + ay) * damping;

        p.currX += p.vx;
        p.currY += p.vy;

        const targetRotZ = Math.atan2(p.currX, ropeLength + p.currY) * (180 / Math.PI) * 1.25;
        p.rotZv = (p.rotZv + (targetRotZ - p.currRotZ) * 0.2) * 0.88;
        p.currRotZ += p.rotZv;
      }

      // Smooth mouse tilt lerp
      const t = tiltTargetRef.current;
      const tc = tiltCurrentRef.current;
      tc.x += (t.x - tc.x) * 0.15;
      tc.y += (t.y - tc.y) * 0.15;

      // 1. UPDATE CARD RIG TRANSFORM (Hinged at top hook 50% 0px)
      if (cardRigRef.current) {
        cardRigRef.current.style.transform = `translate3d(${p.currX.toFixed(2)}px, ${p.currY.toFixed(2)}px, 0px) rotateZ(${p.currRotZ.toFixed(2)}deg) rotateX(${tc.x.toFixed(2)}deg) rotateY(${tc.y.toFixed(2)}deg)`;
      }

      // 2. DYNAMIC SVG STRAPS GEOMETRY (Natural sagging & stretching)
      const clipX = 180 + p.currX;
      const clipY = 56 + p.currY;
      const ropeSlack = Math.max(0, -p.currY * 0.45);

      // Left Strap Path
      if (strapLeftRef.current) {
        const leftStart = { x: 100, y: -30 };
        const leftEnd = { x: clipX - 3, y: clipY - 14 };
        const cp1 = {
          x: leftStart.x + (leftEnd.x - leftStart.x) * 0.35,
          y: leftStart.y + (leftEnd.y - leftStart.y) * 0.45 + ropeSlack
        };
        const cp2 = {
          x: leftStart.x + (leftEnd.x - leftStart.x) * 0.75,
          y: leftStart.y + (leftEnd.y - leftStart.y) * 0.85 + ropeSlack
        };
        strapLeftRef.current.setAttribute(
          'd',
          `M ${leftStart.x} ${leftStart.y} C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${leftEnd.x.toFixed(1)} ${leftEnd.y.toFixed(1)}`
        );
      }

      // Right Strap Path
      if (strapRightRef.current) {
        const rightStart = { x: 260, y: -30 };
        const rightEnd = { x: clipX + 3, y: clipY - 14 };
        const cp1 = {
          x: rightStart.x + (rightEnd.x - rightStart.x) * 0.35,
          y: rightStart.y + (rightEnd.y - rightStart.y) * 0.45 + ropeSlack
        };
        const cp2 = {
          x: rightStart.x + (rightEnd.x - rightStart.x) * 0.75,
          y: rightStart.y + (rightEnd.y - rightStart.y) * 0.85 + ropeSlack
        };
        strapRightRef.current.setAttribute(
          'd',
          `M ${rightStart.x} ${rightStart.y} C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${rightEnd.x.toFixed(1)} ${rightEnd.y.toFixed(1)}`
        );
      }

      // 3. METALLIC CLASP ROTATION
      if (claspGroupRef.current) {
        const claspAngle = p.currRotZ * 0.85;
        claspGroupRef.current.setAttribute('transform', `translate(${clipX.toFixed(2)}, ${clipY.toFixed(2)}) rotate(${claspAngle.toFixed(2)})`);
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ============================================================
  // ULTRA-RESPONSIVE POINTER HANDLERS
  // ============================================================
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('button') || e.target.closest('a')) return;

    isDraggingRef.current = true;
    const now = performance.now();
    const p = physicsRef.current;

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: p.currX,
      initialY: p.currY
    };

    velocityRef.current = {
      vx: 0,
      vy: 0,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: now
    };

    p.vx = 0;
    p.vy = 0;
    p.rotZv = 0;

    if (containerRef.current && e.setPointerCapture) {
      try {
        containerRef.current.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (isDraggingRef.current) {
      const now = performance.now();
      const dt = Math.max(1, now - velocityRef.current.lastTime);

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      let targetX = dragStartRef.current.initialX + deltaX;
      let targetY = dragStartRef.current.initialY + deltaY;

      // Soft non-linear rubberband limits
      if (targetX > 200) targetX = 200 + (targetX - 200) * 0.35;
      if (targetX < -200) targetX = -200 + (targetX + 200) * 0.35;
      if (targetY > 280) targetY = 280 + (targetY - 280) * 0.35;
      if (targetY < -90) targetY = -90 + (targetY + 90) * 0.35;

      const vx = ((e.clientX - velocityRef.current.lastX) / dt) * 16;
      const vy = ((e.clientY - velocityRef.current.lastY) / dt) * 16;

      velocityRef.current.vx = vx;
      velocityRef.current.vy = vy;
      velocityRef.current.lastX = e.clientX;
      velocityRef.current.lastY = e.clientY;
      velocityRef.current.lastTime = now;

      physicsRef.current.targetX = targetX;
      physicsRef.current.targetY = targetY;
    } else {
      // 3D tilt tracking when hovering
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 11;

      tiltTargetRef.current = {
        x: rotateX,
        y: rotateY,
        glareX: (x / rect.width) * 100,
        glareY: (y / rect.height) * 100
      };
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (containerRef.current && e.releasePointerCapture) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const p = physicsRef.current;
    p.vx = Math.max(-28, Math.min(28, velocityRef.current.vx * 0.65));
    p.vy = Math.max(-28, Math.min(28, velocityRef.current.vy * 0.65));
    p.targetX = 0;
    p.targetY = 0;
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      tiltTargetRef.current = { x: 0, y: 0, glareX: 50, glareY: 50 };
    }
  };

  // Flip 3D card toggle
  const handleFlip = (e) => {
    if (e) e.stopPropagation();
    setIsFlipping(true);
    setIsFlipped((prev) => !prev);
    setTimeout(() => setIsFlipping(false), 900);
  };

  return (
    <div
      className={dropState === 'dropping' ? 'lanyard-drop-active' : ''}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        perspective: '1400px',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        paddingTop: '16px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...(dropState === 'initial'
          ? {
              transform: 'translate3d(0, -960px, 0)',
              opacity: 0,
              pointerEvents: 'none'
            }
          : dropState === 'dropping'
          ? {
              pointerEvents: 'none'
            }
          : {
              transform: 'none',
              opacity: 1,
              pointerEvents: 'auto'
            })
      }}
    >
      {/* ============================================================ */}
      {/* 1. DYNAMIC FLUID LANYARD STRAPS (ORGANIC CUBIC BEZIER ROPES) */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'relative',
          width: '360px',
          height: '75px',
          zIndex: 10,
          marginBottom: '-16px',
          pointerEvents: 'none',
          overflow: 'visible'
        }}
      >
        <svg
          width="360"
          height="140"
          viewBox="0 0 360 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            overflow: 'visible',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.85))'
          }}
        >
          <defs>
            <linearGradient id="strapAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="strapCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Left Orange/Amber Lanyard Strap (Ref-mutated in RAF for 120 FPS zero lag) */}
          <path
            ref={strapLeftRef}
            d="M 100 -30 C 130 10, 160 30, 177 42"
            stroke="url(#strapAmberGrad)"
            strokeWidth="4"
            strokeDasharray="6 3.5"
            strokeLinecap="round"
          />

          {/* Right Cyan/Blue Lanyard Strap */}
          <path
            ref={strapRightRef}
            d="M 260 -30 C 230 10, 200 30, 183 42"
            stroke="url(#strapCyanGrad)"
            strokeWidth="4"
            strokeDasharray="6 3.5"
            strokeLinecap="round"
          />

          {/* Metallic Clasp Body stamped with "AJIS" */}
          <g ref={claspGroupRef} transform="translate(180, 56) rotate(0)">
            <ellipse cx="0" cy="-14" rx="7.5" ry="4.5" stroke="#64748b" strokeWidth="2.5" fill="none" />
            <rect
              x="-20"
              y="-10"
              width="40"
              height="23"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="5.5"
              fill="#38bdf8"
              fontSize="8.5"
              fontWeight="900"
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              AJIS
            </text>
            <rect x="-3.5" y="13" width="7" height="13" rx="2" fill="#475569" stroke="#64748b" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 2. OUTER PENDULUM RIG (HARDWARE ACCELERATED VIA GPU REFS) */}
      {/* ============================================================ */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          maxWidth: '365px',
          height: '535px',
          position: 'relative',
          perspective: '1400px',
          userSelect: 'none',
          touchAction: 'none',
          cursor: 'grab'
        }}
      >
        <div
          ref={cardRigRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 0px',
            willChange: 'transform'
          }}
        >
          {/* ============================================================ */}
          {/* 3. INNER 3D FLIP CONTAINER (SPINS 180 DEG SMOOTHLY ON FLIP) */}
          {/* ============================================================ */}
          <div
            ref={flipContainerRef}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 50%',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.88s cubic-bezier(0.34, 1.45, 0.64, 1)',
              borderRadius: '26px'
            }}
          >
            {/* ============================================================ */}
            {/* FACE 1: PHOTO ID PASS (FRONT - DEFAULT INITIAL VIEW) */}
            {/* ============================================================ */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: '26px',
                background: '#070b13',
                border: '1.5px solid rgba(6, 182, 212, 0.42)',
                boxShadow: '0 22px 60px rgba(0, 0, 0, 0.92), 0 0 30px rgba(6, 182, 212, 0.2)',
                padding: '1.25rem 1.15rem 1.15rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden'
              }}
            >
              {/* Dynamic lighting sheen */}
              <div
                ref={sheenRef1}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '26px',
                  background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.12) 0%, transparent 65%)',
                  pointerEvents: 'none',
                  zIndex: 20
                }}
              />

              <div>
                {/* Header Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 10px #10b981'
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 900,
                        fontFamily: 'var(--font-heading)',
                        color: '#ffffff',
                        letterSpacing: '0.04em'
                      }}
                    >
                      AJIES<span style={{ color: '#22d3ee' }}>.ID</span>
                    </span>

                    {/* RFID waves */}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: 0.85, marginLeft: '2px' }}
                    >
                      <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                      <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                      <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                    </svg>
                  </div>

                  {/* Punched slot hole */}
                  <div
                    style={{
                      width: '46px',
                      height: '9px',
                      borderRadius: '9999px',
                      background: '#020408',
                      border: '1.2px solid rgba(255, 255, 255, 0.18)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.95)',
                      margin: '0 0.5rem'
                    }}
                  />

                  <div
                    style={{
                      padding: '0.22rem 0.65rem',
                      borderRadius: '6px',
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.45)',
                      color: '#22d3ee',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    PASS LEVEL 5
                  </div>
                </div>

                {/* Photo Showcase Frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '255px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#04070d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '0.85rem',
                    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.9)'
                  }}
                >
                  <img
                    src="/ajis.jpeg"
                    alt="Putra Raden Al Aziz"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 18%',
                      filter: 'contrast(1.04) brightness(0.98)'
                    }}
                  />

                  {/* Smart EMV Gold Chip (Top-Left) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '38px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #d97706 100%)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.4)',
                      border: '1px solid #b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      zIndex: 5
                    }}
                    title="EMV Smart Access Chip"
                  >
                    <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                      <rect x="1" y="1" width="32" height="22" rx="4" stroke="#78350f" strokeWidth="1" />
                      <path d="M1 8 H12 M1 16 H12 M22 8 H33 M22 16 H33" stroke="#78350f" strokeWidth="1" />
                      <rect x="12" y="5" width="10" height="14" rx="2" stroke="#78350f" strokeWidth="1" />
                      <path d="M17 5 V19" stroke="#78350f" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Cyan HUD Corner Reticles */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderTop: '2.5px solid #22d3ee', borderRight: '2.5px solid #22d3ee', filter: 'drop-shadow(0 0 4px #22d3ee)' }} />
                  <div style={{ position: 'absolute', bottom: '44px', left: '10px', width: '18px', height: '18px', borderBottom: '2.5px solid #22d3ee', borderLeft: '2.5px solid #22d3ee', filter: 'drop-shadow(0 0 4px #22d3ee)' }} />
                  <div style={{ position: 'absolute', bottom: '44px', right: '10px', width: '18px', height: '18px', borderBottom: '2.5px solid #22d3ee', borderRight: '2.5px solid #22d3ee', filter: 'drop-shadow(0 0 4px #22d3ee)' }} />

                  {/* Bottom Telemetry Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(5, 10, 18, 0.88)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(6, 182, 212, 0.35)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.8)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff', letterSpacing: '0.04em' }}>
                        LATENSI P99: 14.2ms
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#22d3ee', letterSpacing: '0.05em' }}>
                      SLA 99.98%
                    </span>
                  </div>
                </div>

                {/* Name & Role */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                      Putra Raden Al Aziz
                    </h3>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#22d3ee', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      Arsitek Frontend &amp; Game Dev
                    </p>
                  </div>
                </div>

                {/* Skills pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
                  {['NEXT.JS', 'REACT', 'PHP', 'MYSQL', 'PYTHON', 'DOCKER'].map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        color: '#e2e8f0',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.18rem 0.45rem',
                        borderRadius: '5px'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer row: Barcode & Verified */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.4rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="64" height="16" viewBox="0 0 68 18" fill="none">
                      <rect x="0" y="0" width="2" height="18" fill="#ffffff" />
                      <rect x="3" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="5" y="0" width="3" height="18" fill="#ffffff" />
                      <rect x="10" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="13" y="0" width="2" height="18" fill="#ffffff" />
                      <rect x="17" y="0" width="4" height="18" fill="#ffffff" />
                      <rect x="23" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="26" y="0" width="3" height="18" fill="#ffffff" />
                      <rect x="31" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="34" y="0" width="2" height="18" fill="#ffffff" />
                      <rect x="38" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="41" y="0" width="4" height="18" fill="#ffffff" />
                      <rect x="47" y="0" width="2" height="18" fill="#ffffff" />
                      <rect x="51" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="54" y="0" width="3" height="18" fill="#ffffff" />
                      <rect x="59" y="0" width="1" height="18" fill="#ffffff" />
                      <rect x="62" y="0" width="2" height="18" fill="#ffffff" />
                      <rect x="66" y="0" width="2" height="18" fill="#ffffff" />
                    </svg>
                    <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', letterSpacing: '0.06em', fontWeight: 700 }}>
                      AJIS-8842-ENG
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    <ShieldCheck size={13} color="#10b981" />
                    <span>TERVERIFIKASI</span>
                  </div>
                </div>
              </div>

              {/* Flip Button to Security Clearance */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleFlip}
                  className="btn btn-secondary"
                  style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    padding: '0.62rem',
                    fontSize: '0.78rem',
                    background: 'rgba(6, 182, 212, 0.1)',
                    borderColor: 'rgba(6, 182, 212, 0.35)',
                    color: '#22d3ee',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Putar ke Sisi Kredensial Keamanan 3D"
                >
                  <RotateCw size={14} style={{ marginRight: '6px', transform: isFlipping ? 'rotate(180deg)' : 'none', transition: 'transform 0.8s ease' }} />
                  <span>Putar ke Kredensial 3D</span>
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* FACE 2: SECURITY CLEARANCE PASS (BACK FACE - ROTATED 180 DEG) */}
            {/* ============================================================ */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: '26px',
                background: '#070b13',
                border: '1.5px solid rgba(6, 182, 212, 0.42)',
                boxShadow: '0 22px 60px rgba(0, 0, 0, 0.92), 0 0 30px rgba(6, 182, 212, 0.2)',
                padding: '1.25rem 1.15rem 1.15rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden'
              }}
            >
              {/* Dynamic lighting sheen */}
              <div
                ref={sheenRef2}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '26px',
                  background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.12) 0%, transparent 65%)',
                  pointerEvents: 'none',
                  zIndex: 20
                }}
              />

              <div>
                {/* Header Bar + Oblong Slot Hole */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.85rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 8px #10b981'
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 900,
                        fontFamily: 'var(--font-heading)',
                        color: '#ffffff',
                        letterSpacing: '0.04em'
                      }}
                    >
                      AJIES<span style={{ color: '#22d3ee' }}>.CLEARANCE</span>
                    </span>
                  </div>

                  {/* Oblong Slot Hole */}
                  <div
                    style={{
                      width: '44px',
                      height: '9px',
                      borderRadius: '9999px',
                      background: '#020408',
                      border: '1.2px solid rgba(255, 255, 255, 0.18)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.95)'
                    }}
                  />

                  <div
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.45)',
                      color: '#6ee7b7',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    LEVEL 5 ROOT
                  </div>
                </div>

                {/* High-Tech Magnetic Stripe */}
                <div
                  style={{
                    width: '100%',
                    height: '35px',
                    background: 'linear-gradient(180deg, #09090b 0%, #18181b 50%, #09090b 100%)',
                    border: '1px solid #27272a',
                    borderRadius: '6px',
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 0.75rem',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.62rem', color: '#71717a', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
                    TRACK-1: PRA//ROOT//2026
                  </span>
                  <span style={{ fontSize: '0.62rem', color: '#52525b', fontFamily: 'var(--font-mono)' }}>
                    ••• 8842
                  </span>
                </div>

                {/* Authorized Clearance Heading */}
                <div style={{ textAlign: 'center', marginBottom: '0.9rem' }}>
                  <h4
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '0.12em',
                      fontFamily: 'var(--font-mono)',
                      margin: 0
                    }}
                  >
                    AUTHORIZED SECURITY CLEARANCE
                  </h4>
                  <p style={{ fontSize: '0.68rem', color: '#71717a', marginTop: '0.2rem', fontFamily: 'var(--font-body)' }}>
                    Issued by SMK Negeri 1 Ciomas • Departemen PPLG
                  </p>
                </div>

                {/* Holder Info & Biometric Box */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '0.8rem',
                    fontSize: '0.73rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#cbd5e1',
                    lineHeight: 1.75,
                    marginBottom: '0.9rem'
                  }}
                >
                  {/* Mini biometric photo row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.55rem', paddingBottom: '0.55rem', borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1.5px solid #22d3ee',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src="/ajis.jpeg"
                        alt="Biometric Thumbnail"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 15%'
                        }}
                      />
                    </div>

                    <div>
                      <span style={{ display: 'block', fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                        PUTRA RADEN AL AZIZ
                      </span>
                      <span style={{ fontSize: '0.67rem', color: '#22d3ee', fontWeight: 700 }}>
                        FULLSTACK ARCHITECT
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>HOLDER:</span>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>PUTRA RADEN AL AZIZ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>ACCESS ROLE:</span>
                    <span style={{ color: '#22d3ee', fontWeight: 700 }}>FULLSTACK ARCHITECT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>LOCATION:</span>
                    <span style={{ color: '#e2e8f0' }}>BOGOR, JAWA BARAT</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>VALID THRU:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>PERPETUAL / ACTIVE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>EMAIL:</span>
                    <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>putraradenn247@gmail.com</span>
                  </div>
                </div>

                {/* Holographic Seal & QR Code */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      width: '95px',
                      height: '62px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 35%, #06b6d4 70%, #10b981 100%)',
                      padding: '1.5px',
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '99px',
                        background: '#090d16',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px'
                      }}
                    >
                      <ShieldCheck size={20} color="#c084fc" />
                      <span style={{ fontSize: '0.56rem', fontWeight: 900, color: '#e2e8f0', letterSpacing: '0.08em', marginTop: '2px' }}>
                        AUTHENTIC
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://github.com/1dleraden"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textDecoration: 'none',
                      background: '#ffffff',
                      padding: '5px 7px',
                      borderRadius: '9px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
                    }}
                    title="Scan / Buka GitHub"
                  >
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="#000000">
                      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 5h2v3h-2v-3zm2-3h3v2h-3v-2zm3 3h3v3h-3v-3z" />
                    </svg>
                    <span style={{ fontSize: '0.5rem', fontWeight: 900, color: '#000000', fontFamily: 'var(--font-mono)' }}>
                      SCAN GITHUB
                    </span>
                  </a>
                </div>
              </div>

              {/* Action Buttons: 3D Flip & GitHub */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleFlip}
                  className="btn btn-secondary"
                  style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    padding: '0.62rem',
                    fontSize: '0.78rem',
                    background: 'rgba(6, 182, 212, 0.1)',
                    borderColor: 'rgba(6, 182, 212, 0.35)',
                    color: '#22d3ee',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Putar Kartu 3D ke Sisi Foto Pass"
                >
                  <RotateCw size={14} style={{ marginRight: '6px', transform: isFlipping ? 'rotate(180deg)' : 'none', transition: 'transform 0.8s ease' }} />
                  <span>Putar ke Foto Pass 3D</span>
                </button>

                <a
                  href="https://github.com/1dleraden"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    flexShrink: 0
                  }}
                  title="Profil GitHub"
                >
                  <GithubIcon size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physics & Drag Interaction Hint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '14px',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.7rem',
          color: '#94a3b8',
          fontFamily: 'var(--font-mono)',
          transition: 'all 0.2s',
          cursor: 'grab'
        }}
      >
        <Move size={12} color="#22d3ee" />
        <span>Tarik / Ayunkan Lanyard Bebas • 120 FPS Buttery Smooth</span>
      </div>
    </div>
  );
}
