'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, CornerDownLeft, Sparkles } from 'lucide-react';

export default function DevConsoleModal({ isOpen, onClose }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: '⚡ Putra Raden Al Aziz (ajies) — Developer Interactive Shell v2.4' },
    { type: 'system', text: 'Ketik "help" untuk melihat daftar perintah yang tersedia.' }
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
    const newEntry = { type: 'user', text: `$ ${cmd}` };

    let response = [];

    switch (trimmed) {
      case 'help':
        response = [
          'Perintah yang tersedia:',
          '  • bio       : Informasi ringkas & latar belakang saya',
          '  • skills    : Persenjataan teknologi & keahlian',
          '  • projects  : Daftar karya dan arsitektur',
          '  • contact   : Kontak email, telepon, dan media sosial',
          '  • game      : Buka arena game mini Cyber Runner',
          '  • clear     : Bersihkan layar terminal',
          '  • exit      : Tutup terminal ini'
        ];
        break;

      case 'bio':
        response = [
          'Nama: Putra Raden Al Aziz (ajies)',
          'Lokasi: Bogor, Indonesia',
          'Fokus: Fullstack Web Development & Game Prototyping',
          'Status: Siswa Pengembangan Perangkat Lunak dan Gim (PPLG)'
        ];
        break;

      case 'skills':
        response = [
          'Frontend : Next.js, React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS',
          'Backend  : Node.js, Express, PHP, Python',
          'Database : MySQL, SQLite, PostgreSQL',
          'Game Dev : Python (Pygame), Game Physics, 2D Mechanics',
          'Tools    : VS Code, Git, GitHub, Docker, Figma'
        ];
        break;

      case 'projects':
        response = [
          '1. TaskForge      — Kanban SaaS Dashboard (Next.js, PHP, MySQL)',
          '2. Cyber Odyssey  — 2D Neon Action Platformer (Python, Pygame)',
          '3. DevNexus       — Code Snippet & API Studio (React, Web API)',
          '4. Portfolio V2   — Next.js 16 Web App with Interactive Canvas'
        ];
        break;

      case 'contact':
        response = [
          'Email     : putraradenn247@gmail.com',
          'WhatsApp  : +62 838 7764 1571',
          'GitHub    : https://github.com/1dleraden',
          'Instagram : https://instagram.com/ptrraden_',
          'TikTok    : https://tiktok.com/@usrrad3n'
        ];
        break;

      case 'game':
        response = ['Mengalihkan ke Game Arena... Meluncur! 🚀'];
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
        response = [`Perintah tidak dikenal: "${cmd}". Ketik "help" untuk panduan.`];
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
              ajies@terminal:~ (zsh)
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
