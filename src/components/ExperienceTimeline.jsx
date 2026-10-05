'use client';

import { Sparkles, Calendar, Award, Code, Rocket, CheckCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ExperienceTimeline() {
  const milestones = [
    {
      period: '2025 — Sekarang',
      title: 'Fullstack Next.js & Advanced Game Prototyping',
      subtitle: 'Pengembangan Berkelanjutan & Kolaborasi Proyek',
      desc: 'Mendalami Next.js App Router, React Server Components, optimasi state management, dan arsitektur modular untuk aplikasi web skala menengah dan game 2D.',
      tags: ['Next.js', 'React', 'MySQL', 'Fullstack', 'Web Performance'],
      color: '#8b5cf6'
    },
    {
      period: '2024 — 2025',
      title: 'Spesialisasi Frontend & Visual Aesthetic UI/UX',
      subtitle: 'SMK Pengembangan Perangkat Lunak dan Gim (PPLG)',
      desc: 'Menempa kemampuan frontend engineering, glassmorphic design system, responsive layout di berbagai viewport, dan penulisan kode terstruktur.',
      tags: ['Modern JavaScript', 'CSS Architecture', 'UI/UX', 'Figma'],
      color: '#06b6d4'
    },
    {
      period: '2023 — 2024',
      title: 'Fondasi Logika Pemrograman & Sintaks Awal',
      subtitle: 'Awal Perjalanan Coding & Eksplorasi Game Dev',
      desc: 'Mempelajari dasar-dasar algoritma, manipulasi DOM, struktur data dasar, logika game loop sederhana dengan Python, dan fundamental HTML/CSS.',
      tags: ['HTML5', 'CSS3', 'Python', 'Algoritma', 'Game Loop'],
      color: '#ec4899'
    }
  ];

  return (
    <section id="experience" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag">
              <Sparkles size={14} />
              <span>Peta Perjalanan & Milestone</span>
            </div>
            <h2 className="section-title">
              Evolusi & <span className="gradient-text-purple">Pengalaman Belajar</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Perjalanan konsisten dari baris kode pertama hingga pengembangan sistem modern.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline List */}
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          
          {/* Central Line */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              bottom: '10px',
              left: '24px',
              width: '2px',
              background: 'linear-gradient(to bottom, #ffffff, #71717a, #27272a)',
              opacity: 0.4
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {milestones.map((item, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 140}
                style={{ width: '100%' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '2rem',
                    position: 'relative'
                  }}
                >

                {/* Node icon dot */}
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#0a0a0c',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2
                  }}
                >
                  {idx === 0 ? <Rocket size={20} color="#ffffff" /> : idx === 1 ? <Code size={20} color="#ffffff" /> : <Calendar size={20} color="#ffffff" />}
                </div>

                {/* Content Card */}
                <div
                  className="glass-card"
                  style={{
                    flexGrow: 1,
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: item.color,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${item.color}40`
                      }}
                    >
                      {item.period}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f8fafc' }}>
                    {item.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                    {item.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#e2e8f0'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
          </div>

        </div>

      </div>
    </section>
  );
}
