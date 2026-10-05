'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Compass, 
  Code, 
  CheckCircle2, 
  Flame, 
  Zap, 
  HeartHandshake,
  Lightbulb
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AboutBento() {
  const [bogorTime, setBogorTime] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [nodes, setNodes] = useState([]);

  // Live Bogor WIB Clock (UTC+7)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in Asia/Jakarta timezone
      const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('id-ID', options);
      setBogorTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Native Web Audio API ambient tone generator for Focus Dev Mode
  const toggleAmbientSound = () => {
    if (!audioPlaying) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        // Gentle warm binaural ambient chord
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4

        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setAudioCtx(ctx);
        setNodes([osc1, osc2]);
        setAudioPlaying(true);
      } catch (e) {
        console.error('Audio not allowed', e);
      }
    } else {
      if (nodes.length > 0) {
        nodes.forEach(n => {
          try { n.stop(); } catch(err){}
        });
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch(err){}
      }
      setAudioPlaying(false);
      setNodes([]);
      setAudioCtx(null);
    }
  };

  return (
    <section id="about" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag section-tag-cyan">
              <Sparkles size={14} />
              <span>Tentang Saya</span>
            </div>
            <h2 className="section-title">
              Membangun Jembatan Antara <br />
              <span className="gradient-text">Logika Komputasi</span> & <span className="gradient-text-purple">Estetika Interaktif</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Dari baris kode awal hingga desain antarmuka yang memikat, berikut sekilas tentang pola pikir, lingkungan, dan etos kerja saya.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem',
            alignItems: 'stretch'
          }}
        >
          {/* Card 1: Main Story (8 Cols on desktop) */}
          <ScrollReveal animation="fade-up" delay={60} className="bento-col-8">
            <div
              className="glass-card"
              style={{
                width: '100%',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#c4b5fd', marginBottom: '1rem' }}>
                  <Compass size={20} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Perjalanan & Filosofi
                  </span>
                </div>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>
                  Eksperimen tiada henti, fokus pada performa dan pengalaman pengguna.
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                  Saya adalah siswa kejuruan spesialisasi <strong>Pengembangan Perangkat Lunak dan Gim (PPLG)</strong>. 
                  Ketertarikan saya dimulai dari rasa penasaran bagaimana game retro bekerja dan bagaimana sebuah website dapat bereaksi secara dinamis terhadap tindakan manusia.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.8 }}>
                  Saat ini, saya fokus mendalami arsitektur frontend modern dengan Next.js dan React, pembuatan RESTful backend dengan Node.js dan PHP, serta prototyping game engine dengan Python dan Godot.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '2rem' }}>
                <span className="badge badge-purple">
                  <Zap size={12} /> Responsive Design
                </span>
                <span className="badge badge-cyan">
                  <Code size={12} /> Clean & Maintainable Code
                </span>
                <span className="badge badge-emerald">
                  <Flame size={12} /> 60 FPS Micro-Interactions
                </span>
                <span className="badge">
                  <HeartHandshake size={12} /> Team Collaboration
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Live Bogor WIB Card (4 Cols on desktop) */}
          <ScrollReveal animation="fade-up" delay={140} className="bento-col-4">
            <div
              className="glass-card"
              style={{
                width: '100%',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(145deg, rgba(18, 18, 22, 0.85), rgba(8, 8, 10, 0.95))'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#e4e4e7', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    ZONA WAKTU
                  </span>
                  <span className="status-dot" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Clock size={20} color="#ffffff" />
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                    {bogorTime || '10:00:00'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Waktu Indonesia Barat (WIB • UTC+7)
                </p>
              </div>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontWeight: 600 }}>
                  <MapPin size={18} color="#ffffff" />
                  <span>Bogor, Jawa Barat, ID</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Kota Hujan • Terbuka untuk remote & onsite work
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Ambient Lo-Fi Focus Mode (4 Cols) */}
          <ScrollReveal animation="fade-up" delay={100} className="bento-col-4">
            <div
              className="glass-card"
              style={{
                width: '100%',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#e4e4e7', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    DEV FOCUS VIBE
                  </span>
                  {audioPlaying ? (
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '16px' }}>
                      <div style={{ width: '3px', height: '14px', background: '#ffffff', animation: 'pulse-ring 1s infinite alternate' }} />
                      <div style={{ width: '3px', height: '8px', background: '#a1a1aa', animation: 'pulse-ring 1.3s infinite alternate' }} />
                      <div style={{ width: '3px', height: '16px', background: '#71717a', animation: 'pulse-ring 0.9s infinite alternate' }} />
                    </div>
                  ) : null}
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Ambient Synth Generator
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Nyalakan gelombang nada fokus sintetis binaural saat menjelajahi portofolio ini.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button
                  onClick={toggleAmbientSound}
                  className={`btn btn-sm ${audioPlaying ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%' }}
                >
                  {audioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{audioPlaying ? 'Matikan Suara Fokus' : 'Nyalakan Lo-Fi Ambient'}</span>
                </button>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('open-top-artists'));
                    }
                  }}
                  className="btn btn-sm"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.18), rgba(251, 113, 133, 0.08))',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    color: '#fb7185',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                  title="Buka Showcase Top Artist & 5 Lagu Favorit"
                >
                  <Sparkles size={14} color="#fb7185" />
                  <span>⭐ Top Artist & Lagu Favorit</span>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: How I Work Workflow (4 Cols) */}
          <ScrollReveal animation="fade-up" delay={180} className="bento-col-4">
            <div
              className="glass-card"
              style={{
                width: '100%',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', marginBottom: '1rem' }}>
                <Lightbulb size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  WORKFLOW SAYA
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { step: '01', title: 'Analisis & Riset Ide', desc: 'Memahami tujuan pengguna & fungsionalitas' },
                  { step: '02', title: 'Desain & UI Prototyping', desc: 'Wireframe modern dengan estetika dark mode' },
                  { step: '03', title: 'Koding & Integrasi', desc: 'Menulis kode modular, responsif, dan teruji' },
                  { step: '04', title: 'Optimasi & Deployment', desc: 'Lighthouse score tinggi & zero broken links' }
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', fontWeight: 700, marginTop: '2px' }}>
                      {item.step}
                    </span>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{item.title}</h5>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: Personal Traits & Fun Facts (4 Cols) */}
          <ScrollReveal animation="fade-up" delay={260} className="bento-col-4">
            <div
              className="glass-card"
              style={{
                width: '100%',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  ETOS & FAKTA MENARIK
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
                    🧩 Problem Solver Alami
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Suka memecah alur kode rumit menjadi komponen independen yang mudah di-debug.
                  </p>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
                    🎮 Game Mechanics Enthusiast
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Sering bereksperimen dengan fisika 2D, collision detection, dan sprite animations.
                  </p>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
                    ⚡ Fast Learner
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Cepat mengadopsi tooling baru dan framework mutakhir dalam hitungan hari.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>

      <style jsx>{`
        :global(.bento-col-8) {
          grid-column: span 8;
          display: flex;
        }
        :global(.bento-col-4) {
          grid-column: span 4;
          display: flex;
        }
        @media (max-width: 1024px) {
          :global(.bento-col-8),
          :global(.bento-col-4) {
            grid-column: span 6 !important;
          }
        }
        @media (max-width: 720px) {
          :global(.bento-col-8),
          :global(.bento-col-4) {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
