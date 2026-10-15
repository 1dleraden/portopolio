'use client';

import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, RotateCcw, Play, Volume2, Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function MiniGame() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Audio Synth for retro cosmic sound effects
  const playSynth = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.16); // C6
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio might be blocked if no user gesture yet
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('ajies_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft.current = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight.current = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft.current = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let localScore = 0;

    // Spacecraft State
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 48,
      width: 36,
      height: 30,
      speed: 6.5
    };

    let items = [];
    let particles = [];
    let engineSparks = [];
    let spawnTimer = 0;

    // Warp Starfield in game background
    const bgStars = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 2.5 + 1.5,
      color: Math.random() > 0.4 ? '#ffffff' : '#38bdf8'
    }));

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Deep Space Background with Warp Stars
      ctx.fillStyle = '#03050c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint nebula glow in game arena
      const nebulaGrad = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.4, 10, canvas.width * 0.5, canvas.height * 0.4, 200);
      nebulaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      nebulaGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.05)');
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw background warp stars
      for (let s = 0; s < bgStars.length; s++) {
        const star = bgStars[s];
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Handle user navigation input
      if (moveLeft.current && player.x > player.width / 2 + 8) {
        player.x -= player.speed;
      }
      if (moveRight.current && player.x < canvas.width - player.width / 2 - 8) {
        player.x += player.speed;
      }

      // 2. Emit thruster engine sparks
      if (Math.random() < 0.8) {
        engineSparks.push({
          x: player.x + (Math.random() - 0.5) * 8,
          y: player.y + player.height / 2 + 2,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 3 + 1.5,
          life: 18,
          color: Math.random() > 0.4 ? '#38bdf8' : '#c084fc'
        });
      }

      // Draw engine sparks
      for (let e = engineSparks.length - 1; e >= 0; e--) {
        const sp = engineSparks[e];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life--;
        if (sp.life <= 0) {
          engineSparks.splice(e, 1);
          continue;
        }
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.life / 18;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 3. Draw Player Spacecraft
      ctx.save();
      ctx.translate(player.x, player.y);

      // Ship body
      ctx.fillStyle = '#0ea5e9';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2); // Nose
      ctx.lineTo(player.width / 2, player.height / 2); // Right wing
      ctx.lineTo(player.width / 4, player.height / 3);
      ctx.lineTo(0, player.height / 2.2);
      ctx.lineTo(-player.width / 4, player.height / 3);
      ctx.lineTo(-player.width / 2, player.height / 2); // Left wing
      ctx.closePath();
      ctx.fill();

      // Cockpit canopy glow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, -player.height / 8, 3.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dual Ion Thruster Nozzles
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-player.width / 4 - 2, player.height / 2.5, 4, 3);
      ctx.fillRect(player.width / 4 - 2, player.height / 2.5, 4, 3);
      ctx.restore();

      // 4. Spawn Asteroids & Starlight Energy Crystals
      spawnTimer++;
      if (spawnTimer % 32 === 0) {
        const isCrystal = Math.random() > 0.42;
        items.push({
          x: Math.random() * (canvas.width - 50) + 25,
          y: -25,
          radius: isCrystal ? 9 : 14,
          speed: 3.2 + Math.random() * 2.2 + Math.min(localScore / 120, 4.5),
          type: isCrystal ? 'crystal' : 'asteroid',
          color: isCrystal ? '#fde047' : '#94a3b8',
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08
        });
      }

      // 5. Update and Draw Items (Asteroids & Starlight Crystals)
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;
        item.rotation += item.rotSpeed;

        // Collision detection
        const dist = Math.hypot(player.x - item.x, player.y - item.y);
        if (dist < player.width / 2 + item.radius - 2) {
          if (item.type === 'crystal') {
            localScore += 10;
            setScore(localScore);
            playSynth('collect');

            // Emit radiant starlight explosion particles
            for (let p = 0; p < 12; p++) {
              particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 28,
                color: Math.random() > 0.4 ? '#fde047' : '#38bdf8'
              });
            }

            items.splice(i, 1);
            continue;
          } else {
            // Collision with asteroid -> Ship Damaged / Game Over
            playSynth('hit');
            setGameOver(true);
            setIsPlaying(false);
            if (localScore > highScore) {
              setHighScore(localScore);
              localStorage.setItem('ajies_high_score', localScore.toString());
            }
            return;
          }
        }

        // Draw item
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        if (item.type === 'crystal') {
          // 4-Point Starlight Cosmic Energy Diamond
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          const s = item.radius * 1.2;
          const inset = s * 0.25;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, -inset, inset, 0);
          ctx.quadraticCurveTo(0, inset, 0, s);
          ctx.quadraticCurveTo(-inset, 0, -s, 0);
          ctx.quadraticCurveTo(0, -inset, 0, -s);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Cosmic Space Asteroid with crater texture
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          const r = item.radius;
          ctx.moveTo(r, 0);
          ctx.lineTo(r * 0.7, r * 0.8);
          ctx.lineTo(-r * 0.4, r * 0.9);
          ctx.lineTo(-r * 0.9, r * 0.3);
          ctx.lineTo(-r * 0.8, -r * 0.6);
          ctx.lineTo(-r * 0.1, -r * 0.95);
          ctx.lineTo(r * 0.8, -r * 0.6);
          ctx.closePath();
          ctx.fill();

          // Asteroid crater contours
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.arc(r * 0.25, r * 0.2, r * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-r * 0.3, -r * 0.2, r * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Cull off-screen items
        if (item.y > canvas.height + 40) {
          items.splice(i, 1);
        }
      }

      // 6. Update explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 28;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        if (p.life <= 0) particles.splice(i, 1);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <section id="game" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag section-tag-cyan">
              <Rocket size={14} />
              <span>✦ Space Arcade &amp; Orbital Simulator</span>
            </div>
            <h2 className="section-title">
              Cosmic Voyager <span className="gradient-text-purple">Space Arena</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Kendalikan wahana antariksa melewati sabuk asteroid dan kumpulkan starlight energy crystals berkecepatan 60 FPS.
            </p>
          </div>
        </ScrollReveal>

        {/* Game Console Card */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div
            className="glass-card"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.12)'
            }}
          >
          {/* Game Stats Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Starlight Energy: <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{score}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={16} color="#fde047" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Top Flight Record: <strong style={{ color: '#fde047', fontSize: '1.1rem' }}>{highScore}</strong>
              </span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '360px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#03050c',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}
          >
            <canvas
              ref={canvasRef}
              width={620}
              height={360}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* Overlay if not playing */}
            {!isPlaying && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(3, 5, 12, 0.94)',
                  backdropFilter: 'blur(8px)',
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                {gameOver ? (
                  <>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f87171', marginBottom: '0.5rem' }}>
                      KAPAL MENABRAK ASTEROID! 💥
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.92rem' }}>
                      Energi terkumpul: <strong style={{ color: '#38bdf8' }}>{score}</strong> • Rekor Tertinggi: <strong style={{ color: '#fde047' }}>{highScore}</strong>
                    </p>
                    <button onClick={startGame} className="btn btn-cyan">
                      <RotateCcw size={16} />
                      <span>Luncurkan Ulang Wahana 🚀</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)'
                      }}
                    >
                      <Rocket size={26} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
                      Launch Cosmic Voyager
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                      Gunakan tombol <strong>A / D</strong> atau <strong>Panah Kiri / Kanan</strong>. Kumpulkan kristal starlight dan hindari asteroid luar angkasa!
                    </p>
                    <button onClick={startGame} className="btn btn-cyan" style={{ padding: '0.8rem 2rem' }}>
                      <Play size={18} />
                      <span>Mulai Ekspedisi Luar Angkasa 🚀</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile on-screen touch controls */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.25rem',
              justifyContent: 'center'
            }}
          >
            <button
              onMouseDown={() => (moveLeft.current = true)}
              onMouseUp={() => (moveLeft.current = false)}
              onTouchStart={() => (moveLeft.current = true)}
              onTouchEnd={() => (moveLeft.current = false)}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.9rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              ◀ Manuver Kiri (A)
            </button>
            <button
              onMouseDown={() => (moveRight.current = true)}
              onMouseUp={() => (moveRight.current = false)}
              onTouchStart={() => (moveRight.current = true)}
              onTouchEnd={() => (moveRight.current = false)}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.9rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              Manuver Kanan (D) ▶
            </button>
          </div>

        </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
