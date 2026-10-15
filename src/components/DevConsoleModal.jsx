'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, CornerDownLeft, Sparkles } from 'lucide-react';

export default function DevConsoleModal({ isOpen, onClose }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: '✦ Putra Raden Al Aziz (ajies) — Celestial Observatory Shell & Telemetry Terminal v2.4' },
    { type: 'system', text: 'Stasiun Pengamatan: Bogor, ID • Orbit: LEO 420KM • Ketik "help" untuk panduan transmisi.' }
  ]);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newEntry = { type: 'user', text: `astro@station:~$ ${cmd}` };

    let response = [];

    switch (trimmed) {
      case 'help':
        response = [
          'Protokol perintah stasiun observatorium:',
          '  • bio       : Data astronot & latar belakang navigasi',
          '  • skills    : Rasi bintang teknologi & persenjataan kode',
          '  • projects  : Ekspedisi luar angkasa & arsip misi',
          '  • contact   : Frekuensi transmisi sinyal & media sosial',
          '  • game      : Buka simulasi antariksa Cosmic Voyager',
          '  • orbit     : Status koordinat orbital & telemetri',
          '  • clear     : Bersihkan layar konsol',
          '  • exit      : Tutup konsol observatorium ini'
        ];
        break;

      case 'bio':
        response = [
          'Astronot : Putra Raden Al Aziz (ajies)',
          'Stasiun  : Observatorium Bogor (106.8°E, 6.6°S)',
          'Misi     : Fullstack Cosmic Web Engineering & Game Prototyping',
          'Status   : Siswa Pengembangan Perangkat Lunak dan Gim (PPLG)'
        ];
        break;

      case 'orbit':
        response = [
          'Status Orbit     : LEO (Low Earth Orbit 420KM)',
          'Velositas Linear : 7.8 KM/S // STABIL',
          'Konektivitas     : Deep Space Network Online',
          'Sistem Navigasi  : Next.js 16 App Router & 60 FPS Canvas Starfield'
        ];
        break;

      case 'skills':
        response = [
          'Frontend Nebula : Next.js, React, Modern JS (ES6+), HTML5, CSS3, Tailwind CSS',
          'Backend Core    : Node.js, Express, PHP, Python',
          'Data Relics     : MySQL, SQLite, PostgreSQL',
          'Cosmic Engines  : Python (Pygame), 2D Particle Physics, Collision Loop',
          'Flight Tools    : VS Code, Git, GitHub, Docker, Figma'
        ];
        break;

      case 'projects':
        response = [
          '1. Arsyavin      — Sistem Otomasi Sirkulasi Perpustakaan (Laravel 12, MySQL)',
          '2. TechInf       — Portal Informasi & Berita AI / Cyber (Vercel CI/CD)',
          '3. Cosmic Voyager — Arena Navigasi Asteroid 2D (Canvas & Web Audio)',
          '4. Portfolio V2  — Celestial Observatory Next.js 16 Web App'
        ];
        break;

      case 'contact':
        response = [
          'Frekuensi Email  : putraradenn247@gmail.com',
          'Kanal WhatsApp   : +62 838 7764 1571',
          'Arsip GitHub     : https://github.com/1dleraden',
          'Transmisi IG     : https://instagram.com/ptrraden_',
          'Radar TikTok     : https://tiktok.com/@usrrad3n'
        ];
        break;

      case 'game':
        response = ['Mengalihkan ke Cosmic Voyager Space Arena... Menembus gravitasi! 🚀'];
        setTimeout(() => {
          onClose();
          const el = document.getElementById('game');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 800);
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'exit':
        onClose();
        return;

      case '':
        response = [];
        break;

      default:
        response = [`Transmisi tidak dikenal: "${cmd}". Ketik "help" untuk protokol resmi.`];
    }

    setHistory((prev) => [
      ...prev,
      newEntry,
      ...response.map((r) => ({ type: 'response', text: r }))
    ]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(3, 5, 14, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: 'min(760px, 100%)',
          height: '480px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(6, 9, 22, 0.96)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 40px rgba(139, 92, 246, 0.25)',
          overflow: 'hidden',
          fontFamily: "var(--font-terminal, 'Consolas', 'Courier New', monospace)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Terminal size={16} color="#22d3ee" />
            <span style={{ fontSize: '0.85rem', fontFamily: "var(--font-terminal, 'Consolas', 'Courier New', monospace)", fontWeight: 700, color: '#f8fafc' }}>
              ajies@observatory:~ (cosmic-sh)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              aria-label="Tutup Console"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          style={{
            flexGrow: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            fontFamily: "var(--font-terminal, 'Consolas', 'Courier New', monospace)",
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}
        >
          {history.map((item, idx) => (
            <div
              key={idx}
              style={{
                color:
                  item.type === 'user'
                    ? '#67e8f9'
                    : item.type === 'system'
                    ? '#c4b5fd'
                    : '#cbd5e1',
                marginBottom: '0.35rem',
                whiteSpace: 'pre-wrap'
              }}
            >
              {item.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Line */}
        <form
          onSubmit={onSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <span style={{ color: '#22d3ee', fontFamily: "var(--font-terminal, 'Consolas', 'Courier New', monospace)", fontWeight: 700 }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ketik perintah (contoh: help, skills, bio)..."
            style={{
              flexGrow: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: "var(--font-terminal, 'Consolas', 'Courier New', monospace)",
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <CornerDownLeft size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
