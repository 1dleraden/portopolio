'use client';

import { ArrowUp, Heart } from 'lucide-react';
import { GithubIcon, InstagramIcon } from './Icons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(5, 7, 18, 0.95)',
        padding: '3rem 0 2rem 0'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {/* Brand & copyright */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                ajies.dev
              </span>
              <span style={{ fontSize: '0.75rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
                • Putra Raden Al Aziz
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Membangun website modern dan eksplorasi gim interaktif dari Bogor, Indonesia.
            </p>
          </div>

          {/* Socials & Back to Top */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://github.com/1dleraden"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>

            <a
              href="https://instagram.com/ptrraden_"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>

            <button
              onClick={scrollToTop}
              className="btn btn-secondary btn-sm"
              title="Kembali ke atas"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem' }}
            >
              <ArrowUp size={15} />
              <span>Ke Atas</span>
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>© 2026 Putra Raden Al Aziz. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with Next.js 16 & React 19 • Designed with Passion
          </span>
        </div>
      </div>
    </footer>
  );
}
