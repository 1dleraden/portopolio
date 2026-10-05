'use client';

import { X, Printer, Download, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
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
        background: 'rgba(3, 5, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: 'min(820px, 100%)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(9, 13, 30, 0.98)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.85)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2rem',
            background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
            Curriculum Vitae Preview • Putra Raden Al Aziz
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.45rem 0.85rem' }}
            >
              <Printer size={15} />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CV Document Content */}
        <div
          style={{
            flexGrow: 1,
            padding: '2.5rem',
            overflowY: 'auto',
            color: '#f8fafc',
            lineHeight: 1.7
          }}
        >
          {/* Header Info */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.35rem' }}>
              Putra Raden Al Aziz
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#22d3ee', fontWeight: 600, marginBottom: '0.75rem' }}>
              Junior Web Developer & Game Development Enthusiast
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>📍 Bogor, Jawa Barat, Indonesia</span>
              <span>✉️ putraradenn247@gmail.com</span>
              <span>📞 +62 838 7764 1571</span>
              <span>🌐 github.com/1dleraden</span>
            </div>
          </div>

          {/* Profil Singkat */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Profil Singkat
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
              Siswa Pengembangan Perangkat Lunak dan Gim (PPLG) dengan dedikasi tinggi dalam menciptakan antarmuka web yang estetis, cepat, dan responsif. Berpengalaman membangun aplikasi web berbasis Next.js, PHP, dan basis data MySQL, serta aktif bereksperimen dengan game mechanics dan logika komputasi.
            </p>
          </div>

          {/* Pendidikan */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Pendidikan
            </h3>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem' }}>SMK — Pengembangan Perangkat Lunak dan Gim (PPLG)</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>2023 — Sekarang</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Fokus studi: Rekayasa perangkat lunak, algoritma pemrograman, desain antarmuka (UI/UX), dan pengembangan gim.
              </p>
            </div>
          </div>

          {/* Keahlian Utama */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Keahlian Teknis
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><strong>Frontend:</strong> Next.js, React, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS</div>
              <div><strong>Backend:</strong> PHP, Node.js, Express, Python, REST APIs</div>
              <div><strong>Database:</strong> MySQL, MariaDB, SQLite</div>
              <div><strong>Game & Tools:</strong> Pygame, Git, GitHub, Docker, VS Code, Figma</div>
            </div>
          </div>

          {/* Proyek Unggulan */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Karya Proyek Unggulan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong>TaskForge — Agile Workspace & Board</strong> (Next.js, PHP, MySQL)
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Aplikasi manajemen tugas tim dengan Kanban dinamis, penghitungan performa otomatis, dan UI SaaS gelap.
                </p>
              </div>
              <div>
                <strong>Cyber Odyssey — 2D Neon Action Platformer</strong> (Python, Pygame)
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Prototipe gim aksi berkecepatan 60 FPS dengan sistem pertarungan pedang, dash evasion, dan simulasi partikel cuaca.
                </p>
              </div>
              <div>
                <strong>DevNexus — Code Snippet Studio</strong> (Next.js, Web API)
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Workbench pengujian API dan repositori potongan kode dengan syntax highlighter.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
