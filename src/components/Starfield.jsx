'use client';

import { useEffect, useRef } from 'react';

// Stellar classification color palettes (O, B, A, F, G, K, M + Cosmic Nebulae)
const STAR_PALETTES = [
  { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.6)' }, // Diamond White
  { color: '#e0f2fe', glow: 'rgba(224, 242, 254, 0.5)' }, // Sirius White-Cyan
  { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.65)' }, // Rigel Blue Giant
  { color: '#818cf8', glow: 'rgba(129, 140, 248, 0.6)' },  // Vega Sapphire
  { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.65)' }, // Nebula Violet
  { color: '#fde047', glow: 'rgba(253, 224, 71, 0.6)' },   // Solar Gold
  { color: '#fb923c', glow: 'rgba(251, 146, 60, 0.6)' },   // Capella Amber
  { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.6)' },  // Cosmic Rose
  { color: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.6)' }    // Emerald Aurora
];

const CURSOR_COLORS = ['#38bdf8', '#c084fc', '#fde047', '#ffffff', '#2dd4bf', '#f472b6'];

export default function Starfield() {
  const bgCanvasRef = useRef(null);
  const fgCanvasRef = useRef(null);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    if (!bgCtx || !fgCtx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvases = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      bgCanvas.width = width * dpr;
      bgCanvas.height = height * dpr;
      bgCanvas.style.width = `${width}px`;
      bgCanvas.style.height = `${height}px`;
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fgCanvas.width = width * dpr;
      fgCanvas.height = height * dpr;
      fgCanvas.style.width = `${width}px`;
      fgCanvas.style.height = `${height}px`;
      fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // ==========================================
    // 1. GENERATE DEEP BACKGROUND STARS
    // ==========================================
    // Micro-stars (Milky Way star dust)
    const microCount = Math.floor(Math.min(width, 1920) * 0.35); // ~400-600 stars
    const microStars = Array.from({ length: microCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 0.9 + 0.3,
      speedX: (Math.random() - 0.5) * 0.08,
      speedY: (Math.random() - 0.5) * 0.08,
      opacity: Math.random() * 0.6 + 0.15,
      pulseSpeed: Math.random() * 0.03 + 0.006,
      pulsePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.3 ? '#ffffff' : STAR_PALETTES[Math.floor(Math.random() * STAR_PALETTES.length)].color
    }));

    // Midground spectral stars
    const midCount = Math.floor(Math.min(width, 1920) * 0.1); // ~120-180 stars
    const midStars = Array.from({ length: midCount }, () => {
      const pal = STAR_PALETTES[Math.floor(Math.random() * STAR_PALETTES.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 1.0,
        speedX: (Math.random() - 0.5) * 0.14,
        speedY: (Math.random() - 0.5) * 0.14,
        opacity: Math.random() * 0.65 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        color: pal.color,
        glow: pal.glow
      };
    });

    // Foreground Major Beacon Stars with 4-Point Diffraction Spikes
    const majorCount = Math.floor(Math.min(width, 1920) * 0.022) + 12; // ~35-45 prominent stars
    const majorStars = Array.from({ length: majorCount }, (_, idx) => {
      const pal = STAR_PALETTES[Math.floor(Math.random() * STAR_PALETTES.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 2.0,
        spikeLen: Math.random() * 10 + 9,
        baseRot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.0008,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.5 + 0.5,
        pulseSpeed: Math.random() * 0.018 + 0.006,
        pulsePhase: Math.random() * Math.PI * 2,
        color: pal.color,
        glow: pal.glow,
        hasDiagonal: idx % 3 === 0, // Top 33% stars get 8-point James Webb diffraction spikes
        flareMultiplier: 1.0,
        flareTimer: 0,
        flareRingRadius: 0
      };
    });

    // Constellation lines: link nearby major stars
    const maxLinkDist = 130;

    // ==========================================
    // 2. SHOOTING METEORS & SUPERNOVAE
    // ==========================================
    const meteors = [];
    const meteorSparks = [];
    let nextMeteorTime = Date.now() + 1800;
    let nextFlareTime = Date.now() + 3500;

    const spawnMeteor = () => {
      const angle = (Math.random() * 20 + 35) * (Math.PI / 180); // 35-55 deg
      const speed = Math.random() * 12 + 15;
      const length = Math.random() * 130 + 100;
      const pal = STAR_PALETTES[Math.floor(Math.random() * STAR_PALETTES.length)];
      meteors.push({
        x: Math.random() * (width * 0.85),
        y: Math.random() * (height * 0.4),
        length,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.016 + 0.012,
        color: pal.color,
        glow: pal.glow,
        thickness: Math.random() * 1.5 + 1.2
      });
    };

    // ==========================================
    // 3. FOREGROUND INTERACTIVE STARDUST & SPARKS
    // ==========================================
    const cursorParticles = [];
    const ambientMotes = Array.from({ length: 22 }, () => {
      const pal = STAR_PALETTES[Math.floor(Math.random() * STAR_PALETTES.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 3,
        speedY: -(Math.random() * 0.35 + 0.15),
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: pal.color,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    const spawnStardust = (x, y, count = 2, isClick = false) => {
      for (let i = 0; i < count; i++) {
        if (cursorParticles.length > 90) cursorParticles.shift();
        const angle = isClick ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * Math.PI * 2;
        const speed = isClick ? Math.random() * 4.5 + 2.0 : Math.random() * 1.5 + 0.5;
        const color = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
        cursorParticles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isClick ? 0.5 : 0.8), // float upward gently
          size: isClick ? Math.random() * 7 + 5 : Math.random() * 5 + 3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          color,
          life: 1.0,
          decay: isClick ? Math.random() * 0.02 + 0.015 : Math.random() * 0.035 + 0.02,
          isStar: Math.random() > 0.25 // 75% are 4-point stars, 25% are circular stardust
        });
      }
    };

    let mouse = { x: -1000, y: -1000 };
    let lastSpawn = 0;

    const handlePointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const now = performance.now();
      if (now - lastSpawn > 24) {
        spawnStardust(e.clientX, e.clientY, 2, false);
        lastSpawn = now;
      }
    };

    const handlePointerDown = (e) => {
      // Celestial Supernova Burst on click
      spawnStardust(e.clientX, e.clientY, 16, true);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        spawnStardust(touch.clientX, touch.clientY, 2, false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // ==========================================
    // 4. DRAWING HELPERS
    // ==========================================
    // 4-Point Star Diamond Curve
    const drawStar4Point = (ctx, x, y, size, rotation, color, alpha) => {
      if (alpha <= 0.01 || size <= 0.3) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;

      ctx.beginPath();
      const s = size;
      const inset = s * 0.24;
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, -inset, inset, 0);
      ctx.quadraticCurveTo(0, inset, 0, s);
      ctx.quadraticCurveTo(-inset, 0, -s, 0);
      ctx.quadraticCurveTo(0, -inset, 0, -s);
      ctx.closePath();
      ctx.fill();

      // White sparkling core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.6, s * 0.28), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Major Celestial Star Beacon with Cross Diffraction Spikes
    const drawMajorBeacon = (ctx, star, now) => {
      const { x, y, size, color, rotSpeed, baseRot, spikeLen, hasDiagonal } = star;
      // Calm steady celestial star without flickering/pulsing
      const currentAlpha = star.opacity;
      const currentSpike = spikeLen;
      const currentSize = size;
      const rotation = baseRot + now * rotSpeed;

      ctx.save();
      ctx.translate(x, y);

      // 1. Soft radial coronal aura
      const glowR = currentSize * 5.0;
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      glow.addColorStop(0, color);
      glow.addColorStop(0.35, star.glow || 'rgba(56, 189, 248, 0.4)');
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = currentAlpha * 0.85;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Primary 4-Point Cross Diffraction Needle Spikes (+)
      ctx.rotate(rotation);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(0.85, currentSize * 0.32);
      ctx.lineCap = 'round';
      ctx.globalAlpha = currentAlpha;

      ctx.beginPath();
      ctx.moveTo(-currentSpike, 0);
      ctx.lineTo(currentSpike, 0);
      ctx.moveTo(0, -currentSpike);
      ctx.lineTo(0, currentSpike);
      ctx.stroke();

      // 3. Secondary 45° Faint Diagonal Spikes (8-Point James Webb Flare)
      if (hasDiagonal) {
        ctx.rotate(Math.PI / 4);
        ctx.lineWidth = Math.max(0.5, currentSize * 0.18);
        ctx.globalAlpha = currentAlpha * 0.45;
        ctx.beginPath();
        ctx.moveTo(-currentSpike * 0.52, 0);
        ctx.lineTo(currentSpike * 0.52, 0);
        ctx.moveTo(0, -currentSpike * 0.52);
        ctx.lineTo(0, currentSpike * 0.52);
        ctx.stroke();
      }

      // 4. Brilliant Hot Diamond Core
      ctx.globalAlpha = Math.min(1.0, currentAlpha * 1.4);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1.3, currentSize * 0.9), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ==========================================
    // 5. MAIN ANIMATION LOOP
    // ==========================================
    const render = () => {
      const now = performance.now();

      // ----------------------------------------
      // A. RENDER BACKGROUND CANVAS (Fixed deep space)
      // ----------------------------------------
      bgCtx.clearRect(0, 0, width, height);

      // Periodically spawn shooting meteors
      if (Date.now() > nextMeteorTime) {
        spawnMeteor();
        nextMeteorTime = Date.now() + Math.random() * 3500 + 2000;
      }

      // 1. Draw Micro Stars (Milky Way Dust) - Calm steady stars
      for (let i = 0; i < microStars.length; i++) {
        const star = microStars[i];
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        bgCtx.fillStyle = star.color;
        bgCtx.globalAlpha = star.opacity;
        bgCtx.fillRect(star.x, star.y, star.size, star.size);
      }

      // 2. Draw Midground Spectral Stars - Calm steady glow without flickering
      for (let i = 0; i < midStars.length; i++) {
        const star = midStars[i];
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Subtle celestial gravity pull on cursor hover
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 1) {
          const force = (120 - dist) / 120;
          star.x -= (dx / dist) * force * 0.8;
          star.y -= (dy / dist) * force * 0.8;
        }

        bgCtx.save();
        bgCtx.globalAlpha = star.opacity;
        bgCtx.fillStyle = star.color;
        bgCtx.shadowColor = star.glow;
        bgCtx.shadowBlur = 6;
        bgCtx.beginPath();
        bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
      }

      // 3. Draw Constellation Linkages between nearby Major Stars
      for (let i = 0; i < majorStars.length; i++) {
        const s1 = majorStars[i];
        for (let j = i + 1; j < majorStars.length; j++) {
          const s2 = majorStars[j];
          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          if (dist < maxLinkDist) {
            bgCtx.save();
            const linkAlpha = (1 - dist / maxLinkDist) * 0.22;
            bgCtx.globalAlpha = linkAlpha;
            bgCtx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            bgCtx.lineWidth = 0.7;
            bgCtx.beginPath();
            bgCtx.moveTo(s1.x, s1.y);
            bgCtx.lineTo(s2.x, s2.y);
            bgCtx.stroke();
            bgCtx.restore();
          }
        }
      }

      // 4. Draw Major Beacon Stars with 4-Point Diffraction Crosses
      for (let i = 0; i < majorStars.length; i++) {
        const star = majorStars[i];
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        drawMajorBeacon(bgCtx, star, now);
      }

      // 5. Draw & Update Shooting Meteors
      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        meteor.x += meteor.speedX;
        meteor.y += meteor.speedY;
        meteor.life -= meteor.decay;

        // Emit tiny falling embers from meteor tail
        if (Math.random() < 0.45 && meteorSparks.length < 50) {
          meteorSparks.push({
            x: meteor.x - (Math.random() - 0.5) * 8,
            y: meteor.y - (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 1.2 + 0.3,
            size: Math.random() * 2 + 1,
            life: 1.0,
            decay: Math.random() * 0.04 + 0.02,
            color: meteor.color
          });
        }

        if (meteor.life <= 0 || meteor.x > width || meteor.y > height) {
          meteors.splice(m, 1);
          continue;
        }

        const tailX = meteor.x - (meteor.speedX / Math.hypot(meteor.speedX, meteor.speedY)) * meteor.length;
        const tailY = meteor.y - (meteor.speedY / Math.hypot(meteor.speedX, meteor.speedY)) * meteor.length;

        const grad = bgCtx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.65, meteor.glow || 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(1, '#ffffff');

        bgCtx.save();
        bgCtx.globalAlpha = Math.max(0, meteor.life);
        bgCtx.strokeStyle = grad;
        bgCtx.lineWidth = meteor.thickness;
        bgCtx.lineCap = 'round';
        bgCtx.beginPath();
        bgCtx.moveTo(tailX, tailY);
        bgCtx.lineTo(meteor.x, meteor.y);
        bgCtx.stroke();

        // Meteor glowing head
        bgCtx.fillStyle = '#ffffff';
        bgCtx.beginPath();
        bgCtx.arc(meteor.x, meteor.y, meteor.thickness * 1.3, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
      }

      // Draw meteor sparks
      for (let s = meteorSparks.length - 1; s >= 0; s--) {
        const spark = meteorSparks[s];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life -= spark.decay;
        if (spark.life <= 0) {
          meteorSparks.splice(s, 1);
          continue;
        }
        bgCtx.save();
        bgCtx.globalAlpha = spark.life;
        bgCtx.fillStyle = spark.color;
        bgCtx.beginPath();
        bgCtx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
      }

      // ----------------------------------------
      // B. RENDER FOREGROUND CANVAS (Interactive Stardust & Cursor Trail)
      // ----------------------------------------
      fgCtx.clearRect(0, 0, width, height);

      // 1. Ambient Floating Starlight Motes
      for (let i = 0; i < ambientMotes.length; i++) {
        const mote = ambientMotes[i];
        mote.y += mote.speedY;
        mote.x += mote.speedX;
        mote.rotation += mote.rotSpeed;

        if (mote.y < -20) {
          mote.y = height + 20;
          mote.x = Math.random() * width;
        }
        if (mote.x < -20) mote.x = width + 20;
        if (mote.x > width + 20) mote.x = -20;

        drawStar4Point(fgCtx, mote.x, mote.y, mote.size, mote.rotation, mote.color, mote.alpha);
      }

      // 2. Cursor Stardust & Click Nova Burst Particles
      for (let p = cursorParticles.length - 1; p >= 0; p--) {
        const part = cursorParticles[p];
        part.x += part.vx;
        part.y += part.vy;
        part.vx *= 0.96;
        part.vy *= 0.96;
        part.rotation += part.rotSpeed;
        part.life -= part.decay;

        if (part.life <= 0) {
          cursorParticles.splice(p, 1);
          continue;
        }

        const alpha = Math.pow(part.life, 1.4);
        const currentSize = part.size * (0.35 + 0.65 * part.life);

        if (part.isStar) {
          drawStar4Point(fgCtx, part.x, part.y, currentSize, part.rotation, part.color, alpha);
        } else {
          fgCtx.save();
          fgCtx.globalAlpha = alpha;
          fgCtx.fillStyle = part.color;
          fgCtx.beginPath();
          fgCtx.arc(part.x, part.y, currentSize * 0.5, 0, Math.PI * 2);
          fgCtx.fill();
          fgCtx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvases);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* Deep Space Background Canvas: Stars, Constellations, Meteors */}
      <canvas
        ref={bgCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.95
        }}
        aria-hidden="true"
      />

      {/* Foreground Celestial Canvas: Interactive Cursor Stardust & Sparkle Nova */}
      <canvas
        ref={fgCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9995
        }}
        aria-hidden="true"
      />
    </>
  );
}
