'use client';

import { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, RotateCcw, Play, Volume2, Sparkles, Zap, Shield } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function MiniGame() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Audio Synth for retro sound effects
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
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
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

    // Game state
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 45,
      width: 32,
      height: 24,
      speed: 6
    };

    let items = [];
    let particles = [];
    let spawnTimer = 0;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cyber grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Handle input
      if (moveLeft.current && player.x > player.width / 2) {
        player.x -= player.speed;
      }
      if (moveRight.current && player.x < canvas.width - player.width / 2) {
        player.x += player.speed;
      }

      // Draw player ship
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2);
      ctx.lineTo(player.width / 2, player.height / 2);
      ctx.lineTo(0, player.height / 3);
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.closePath();
      ctx.fill();

      // Engine thruster glow
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, player.height / 2 + 2, 4 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Spawn obstacles and crystals
      spawnTimer++;
      if (spawnTimer % 35 === 0) {
        const isCrystal = Math.random() > 0.45;
        items.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          radius: isCrystal ? 8 : 12,
          speed: 3 + Math.random() * 2.5 + Math.min(localScore / 100, 4),
          type: isCrystal ? 'crystal' : 'obstacle',
          color: isCrystal ? '#a855f7' : '#ef4444',
          rotation: 0
        });
      }

      // Update and draw items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;
        item.rotation += 0.05;

        // Collision check
        const dist = Math.hypot(player.x - item.x, player.y - item.y);
        if (dist < player.width / 2 + item.radius) {
          if (item.type === 'crystal') {
            localScore += 10;
            setScore(localScore);
            playSynth('collect');

            // Emit burst particles
            for (let p = 0; p < 8; p++) {
              particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 25,
                color: '#c084fc'
              });
            }

            items.splice(i, 1);
            continue;
          } else {
            // Hit obstacle -> Game Over
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
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 12;

        if (item.type === 'crystal') {
          // Diamond crystal
          ctx.beginPath();
          ctx.moveTo(0, -item.radius);
          ctx.lineTo(item.radius, 0);
          ctx.lineTo(0, item.radius);
          ctx.lineTo(-item.radius, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Triangle obstacle
          ctx.beginPath();
          ctx.moveTo(0, item.radius);
          ctx.lineTo(item.radius, -item.radius);
          ctx.lineTo(-item.radius, -item.radius);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Remove off-screen
        if (item.y > canvas.height + 30) {
          items.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 25;
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
              <Gamepad2 size={14} />
              <span>Interactive Game Dev Showcase</span>
            </div>
            <h2 className="section-title">
              Cyber Runner <span className="gradient-text-purple">Mini Arena</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Bukti nyata kemampuan Game Development saya. Ditenagai oleh custom Canvas loop & kalkulasi fisika 60 FPS.
            </p>
          </div>
        </ScrollReveal>

        {/* Game Box Container */}
        <ScrollReveal animation="zoom-in" delay={120}>
          <div
            className="glass-card"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)'
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
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="#ffffff" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Skor: <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{score}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={16} color="#ffffff" />
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                Rekor Terbaik: <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>{highScore}</strong>
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
              background: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.1)'
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
                  background: 'rgba(0, 0, 0, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                {gameOver ? (
                  <>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444', marginBottom: '0.5rem' }}>
                      GAME OVER!
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                      Skor kamu: <strong style={{ color: '#ffffff' }}>{score}</strong> • Rekor: <strong style={{ color: '#ffffff' }}>{highScore}</strong>
                    </p>
                    <button onClick={startGame} className="btn btn-primary">
                      <RotateCcw size={16} />
                      <span>Main Lagi</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffffff, #71717a)',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
                      }}
                    >
                      <Gamepad2 size={28} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
                      Mulai Mainkan Cyber Runner
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', marginBottom: '1.5rem' }}>
                      Gunakan tombol <strong>A / D</strong> atau <strong>Panah Kiri / Kanan</strong>. Kumpulkan kristal ungu dan hindari rintangan merah!
                    </p>
                    <button onClick={startGame} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                      <Play size={18} />
                      <span>Mulai Main Sekarang</span>
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
              ◀ Kiri (A)
            </button>
            <button
              onMouseDown={() => (moveRight.current = true)}
              onMouseUp={() => (moveRight.current = false)}
              onTouchStart={() => (moveRight.current = true)}
              onTouchEnd={() => (moveRight.current = false)}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.9rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              Kanan (D) ▶
            </button>
          </div>

        </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
