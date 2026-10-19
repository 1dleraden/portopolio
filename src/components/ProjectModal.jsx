'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Copy, 
  Check, 
  Terminal, 
  GitBranch, 
  Star, 
  GitFork,
  Sparkles,
  Code
} from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectModal({ project, onClose }) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const cloneCmd = project.cloneUrl || `git clone https://github.com/1dleraden/${project.name}.git`;

  const copyClone = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(3, 5, 14, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: 'min(860px, 100%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(8, 11, 22, 0.98)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-purple">{project.categoryLabel || 'GitHub Repository'}</span>
              
              {project.isNew && (
                <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={11} />
                  <span>✦ Baru di GitHub</span>
                </span>
              )}

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <GitBranch size={11} />
                <span>1dleraden/{project.name}</span>
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; e.currentTarget.style.borderColor = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Project Image Preview or Stylized Banner */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'linear-gradient(135deg, #090d1a, #0f172a)'
          }}
        >
          {project.image && !imageError ? (
            <img
              src={project.image}
              alt={project.title}
              onError={() => setImageError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.15), transparent 70%)'
              }}
            >
              <Code size={48} color="#38bdf8" style={{ marginBottom: '1rem', opacity: 0.8 }} />
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                {project.title}
              </div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                github.com/1dleraden/{project.name}
              </div>
            </div>
          )}

          {/* Quick info ribbon overlay bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '0.75rem 1.25rem',
              background: 'linear-gradient(to top, rgba(8, 11, 22, 0.95), transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: project.languageColor || '#38bdf8'
                }}
              />
              <span style={{ fontWeight: 600 }}>{project.language || 'Code'}</span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
              <span>⭐ {project.stars || 0} Stars</span>
              <span>🍴 {project.forks || 0} Forks</span>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#c4b5fd' }}>
            Ringkasan & Tujuan Proyek
          </h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.98rem' }}>
            {project.detailedDesc || project.description}
          </p>
        </div>

        {/* Key Features & Architecture */}
        {project.features && project.features.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', color: '#67e8f9' }}>
              Fitur Utama &amp; Arsitektur
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.6rem', fontFamily: 'var(--font-mono)' }}>
            Teknologi &amp; Spesifikasi
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(project.tech || []).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(168, 85, 247, 0.12)',
                  color: '#d8b4fe',
                  border: '1px solid rgba(168, 85, 247, 0.25)'
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Git Clone Quick Command */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.4rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={13} color="#38bdf8" />
              <span>Clone Repository via Git</span>
            </span>
            <span>{project.relativeTime || project.updatedAt}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ color: '#38bdf8', marginRight: '0.6rem' }}>$</span>
            <span style={{ color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              git clone {project.cloneUrl || `https://github.com/1dleraden/${project.name}.git`}
            </span>
            <button
              onClick={copyClone}
              style={{
                marginLeft: '0.75rem',
                background: copied ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                border: 'none',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {project.liveUrl === '#game' ? (
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById('game');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '160px' }}
            >
              <span>🎮 Mainkan di Website</span>
            </button>
          ) : project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, minWidth: '160px' }}
            >
              <span>Buka Live Demo</span>
              <ExternalLink size={16} />
            </a>
          ) : (
            <div
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <span>💻 Localhost / Source Code Project</span>
            </div>
          )}

          <a
            href={project.githubUrl || `https://github.com/1dleraden/${project.name}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: '160px' }}
          >
            <GithubIcon size={16} />
            <span>Buka di GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
