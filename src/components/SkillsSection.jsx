'use client';

import { useState } from 'react';
import { 
  Code2, 
  Server, 
  Database, 
  Gamepad2, 
  Wrench, 
  Sparkles, 
  Check, 
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Semua Keahlian' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'game-tools', label: 'Game & Tools' }
  ];

  const skillsData = [
    {
      name: 'Next.js & React',
      category: 'frontend',
      level: 90,
      status: 'Aktif Dipakai',
      desc: 'Membangun SPA & SSR dengan App Router, server actions, dan optimasi SEO.',
      color: '#8b5cf6'
    },
    {
      name: 'Modern JavaScript (ES6+)',
      category: 'frontend',
      level: 92,
      status: 'Mahir',
      desc: 'Async/await, DOM manipulation, functional programming, Web APIs.',
      color: '#facc15'
    },
    {
      name: 'HTML5 & Vanilla CSS',
      category: 'frontend',
      level: 95,
      status: 'Ahli',
      desc: 'Semantic markup, Flexbox, CSS Grid, keyframe animations, dan Glassmorphism.',
      color: '#38bdf8'
    },
    {
      name: 'Tailwind CSS',
      category: 'frontend',
      level: 88,
      status: 'Aktif Dipakai',
      desc: 'Utility-first rapid prototyping, responsive layouts, dan custom design tokens.',
      color: '#06b6d4'
    },
    {
      name: 'PHP & Laravel Concept',
      category: 'backend',
      level: 84,
      status: 'Mahir',
      desc: 'MVC architecture, CRUD operations, authentication, database binding.',
      color: '#a855f7'
    },
    {
      name: 'Node.js & Express',
      category: 'backend',
      level: 82,
      status: 'Mahir',
      desc: 'Membangun REST API, middleware, JSON web tokens, dan asynchronous event loop.',
      color: '#22c55e'
    },
    {
      name: 'Python',
      category: 'backend',
      level: 80,
      status: 'Aktif Dipakai',
      desc: 'Scripting otomatisasi, logika algoritma, dan game prototype engine.',
      color: '#3b82f6'
    },
    {
      name: 'MySQL & MariaDB',
      category: 'database',
      level: 86,
      status: 'Mahir',
      desc: 'Relational schema design, complex JOIN queries, indexing, dan foreign keys.',
      color: '#0284c7'
    },
    {
      name: 'SQLite',
      category: 'database',
      level: 85,
      status: 'Mahir',
      desc: 'Embedded lightweight database untuk aplikasi desktop, game, dan testing.',
      color: '#38bdf8'
    },
    {
      name: 'Pygame & Game Mechanics',
      category: 'game-tools',
      level: 82,
      status: 'Aktif Riset',
      desc: 'Game loop, 2D physics, collision handling, sprite sheets, particle system.',
      color: '#ec4899'
    },
    {
      name: 'Git & GitHub Workflow',
      category: 'game-tools',
      level: 88,
      status: 'Mahir',
      desc: 'Version control, branch management, pull requests, dan CI/CD automation.',
      color: '#f97316'
    },
    {
      name: 'VS Code & Dev Environment',
      category: 'game-tools',
      level: 95,
      status: 'Ahli',
      desc: 'Custom extensions, debugging configs, linting, dan command line mastery.',
      color: '#6366f1'
    }
  ];

  const filteredSkills = activeCategory === 'all' 
    ? skillsData 
    : skillsData.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag">
              <Sparkles size={14} />
              <span>Keahlian & Teknologi</span>
            </div>
            <h2 className="section-title">
              Persenjataan <span className="gradient-text-purple">Teknologi</span> Saya
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Kombinasi alat modern untuk merancang pengalaman web interaktif dan mengembangkan game yang seru.
            </p>

            {/* Filter Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '2rem'
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? '#000000' : 'var(--text-secondary)',
                      border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.2)' : 'none'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredSkills.map((skill, idx) => (
            <ScrollReveal
              key={skill.name}
              animation="fade-up"
              delay={Math.min(idx * 50, 350)}
              style={{ display: 'flex' }}
            >
              <div
                className="glass-card"
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                      {skill.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: skill.color,
                        border: `1px solid ${skill.color}40`
                      }}
                    >
                      {skill.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {skill.desc}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Kemahiran
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: skill.color }}>
                      {skill.level}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${skill.level}%`,
                        height: '100%',
                        borderRadius: '9999px',
                        background: `linear-gradient(90deg, ${skill.color}, #38bdf8)`,
                        boxShadow: `0 0 10px ${skill.color}80`,
                        transition: 'width 0.8s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
