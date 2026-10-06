'use client';

import { useState, useRef, useEffect } from 'react';
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
  Layers, 
  Zap 
} from 'lucide-react';
import LogoLoop from './LogoLoop';
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiMysql,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiGithub,
  SiVite,
  SiFigma
} from 'react-icons/si';

const TECH_LOGOS = [
  { node: <SiReact color="#61DAFB" />, title: 'React', href: 'https://react.dev' },
  { node: <SiNextdotjs color="#FFFFFF" />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiJavascript color="#F7DF1E" />, title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { node: <SiTypescript color="#3178C6" />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss color="#06B6D4" />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiNodedotjs color="#5FA04E" />, title: 'Node.js', href: 'https://nodejs.org' },
  { node: <SiPython color="#3776AB" />, title: 'Python', href: 'https://www.python.org' },
  { node: <SiPhp color="#777BB4" />, title: 'PHP', href: 'https://www.php.net' },
  { node: <SiMysql color="#4479A1" />, title: 'MySQL', href: 'https://www.mysql.com' },
  { node: <SiPostgresql color="#4169E1" />, title: 'PostgreSQL', href: 'https://www.postgresql.org' },
  { node: <SiDocker color="#2496ED" />, title: 'Docker', href: 'https://www.docker.com' },
  { node: <SiGit color="#F05032" />, title: 'Git', href: 'https://git-scm.com' },
  { node: <SiGithub color="#FFFFFF" />, title: 'GitHub', href: 'https://github.com/1dleraden' },
  { node: <SiVite color="#646CFF" />, title: 'Vite', href: 'https://vitejs.dev' },
  { node: <SiFigma color="#F24E1E" />, title: 'Figma', href: 'https://www.figma.com' }
];

const getSkillIcon = (name, category) => {
  if (name.includes('Next.js') || name.includes('React')) return Layers;
  if (name.includes('JavaScript')) return Zap;
  if (name.includes('HTML') || name.includes('CSS')) return Code2;
  if (name.includes('Tailwind')) return Sparkles;
  if (name.includes('PHP') || name.includes('Laravel')) return Server;
  if (name.includes('Node') || name.includes('Express')) return Cpu;
  if (name.includes('Python')) return Terminal;
  if (name.includes('MySQL') || name.includes('MariaDB') || name.includes('SQLite')) return Database;
  if (name.includes('Pygame') || name.includes('Game')) return Gamepad2;
  if (name.includes('Git') || name.includes('GitHub')) return Check;
  if (name.includes('VS Code') || name.includes('Dev Environment')) return Wrench;
  return Sparkles;
};

function SkillCard({ skill, index, isSectionInView, activeCategory }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getSkillIcon(skill.name, skill.category);

  // Staggered scroll reveal trigger
  useEffect(() => {
    if (!isSectionInView) return;

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      setDisplayLevel(skill.level);
      return;
    }

    const delay = Math.min(index * 65, 550);
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isSectionInView, activeCategory, index, skill.level]);

  // Animated percentage counter when card is revealed
  useEffect(() => {
    if (!isRevealed) {
      setDisplayLevel(0);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayLevel(skill.level);
      return;
    }

    let animFrame;
    const duration = 1000;
    const startTime = performance.now();
    const target = skill.level;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayLevel(Math.round(easeOut * target));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isRevealed, skill.level]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed 
          ? (isHovered ? 'translate3d(0, -6px, 0)' : 'translate3d(0, 0, 0)') 
          : 'translate3d(0, 36px, 0) scale(0.95)',
        filter: isRevealed ? 'blur(0px)' : 'blur(6px)',
        transition: isRevealed 
          ? 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s ease, filter 0.65s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s' 
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        borderRadius: '16px',
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(22, 22, 30, 0.95) 0%, rgba(14, 14, 18, 0.98) 100%)' 
          : 'rgba(14, 14, 17, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isHovered 
          ? `1px solid ${skill.color}55` 
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered 
          ? `0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px ${skill.color}20` 
          : '0 4px 20px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient corner glow */}
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          right: '-25px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${skill.color}25 0%, transparent 70%)`,
          filter: 'blur(14px)',
          pointerEvents: 'none',
          opacity: isHovered ? 0.9 : 0.4,
          transition: 'opacity 0.3s'
        }}
      />

      <div>
        {/* Top Header: Tech Icon, Name, Category and Status Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                background: `${skill.color}15`,
                border: `1px solid ${skill.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: skill.color,
                boxShadow: isHovered ? `0 0 14px ${skill.color}40` : 'none',
                transition: 'all 0.25s',
                flexShrink: 0
              }}
            >
              <IconComponent size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.25 }}>
                {skill.name}
              </h3>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                // {skill.category.toUpperCase()}
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.22rem 0.55rem',
              borderRadius: '6px',
              background: `${skill.color}12`,
              color: skill.color,
              border: `1px solid ${skill.color}35`,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              flexShrink: 0
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: skill.color,
                boxShadow: `0 0 6px ${skill.color}`
              }}
            />
            {skill.status}
          </span>
        </div>

        {/* Skill Description */}
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.35rem' }}>
          {skill.desc}
        </p>
      </div>

      {/* Mastery Progress Bar & Animated Number */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Kemahiran
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: skill.color }}>
            {displayLevel}%
          </span>
        </div>

        {/* Bar Track */}
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: isRevealed ? `${skill.level}%` : '0%',
              height: '100%',
              borderRadius: '9999px',
              background: `linear-gradient(90deg, ${skill.color}, #38bdf8)`,
              boxShadow: `0 0 10px ${skill.color}80`,
              transition: isRevealed ? 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRef = useRef(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  // Section Intersection Observer for Scroll Reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsSectionInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionInView(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

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
    <section ref={sectionRef} id="skills" className="section" style={{ position: 'relative' }}>
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '420px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Heading with Staggered Scroll Reveal */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            className="section-tag"
            style={{
              opacity: isSectionInView ? 1 : 0,
              transform: isSectionInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
              filter: isSectionInView ? 'blur(0px)' : 'blur(4px)',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s'
            }}
          >
            <Sparkles size={14} />
            <span>Keahlian & Teknologi</span>
          </div>

          <h2
            className="section-title"
            style={{
              opacity: isSectionInView ? 1 : 0,
              transform: isSectionInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 28px, 0)',
              filter: isSectionInView ? 'blur(0px)' : 'blur(5px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 120ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 120ms, filter 0.7s 120ms'
            }}
          >
            Persenjataan <span className="gradient-text-purple">Teknologi</span> Saya
          </h2>

          <p
            className="section-subtitle"
            style={{
              margin: '0 auto',
              opacity: isSectionInView ? 1 : 0,
              transform: isSectionInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
              filter: isSectionInView ? 'blur(0px)' : 'blur(4px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 220ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 220ms, filter 0.7s 220ms'
            }}
          >
            Kombinasi alat modern untuk merancang pengalaman web interaktif dan mengembangkan game yang seru.
          </p>

          {/* LogoLoop Infinite Marquee from React Bits */}
          <div
            style={{
              margin: '2.5rem 0 1.25rem',
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              opacity: isSectionInView ? 1 : 0,
              transform: isSectionInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 260ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 260ms'
            }}
          >
            <LogoLoop
              logos={TECH_LOGOS}
              speed={55}
              direction="left"
              logoHeight={32}
              gap={24}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#000000"
              ariaLabel="Teknologi dan stack pemrograman"
              renderItem={(item) => (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '9999px',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.35)';
                  }}
                >
                  <span style={{ display: 'inline-flex', fontSize: '1.3rem' }}>
                    {item.node}
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#e2e8f0',
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.title}
                  </span>
                </a>
              )}
            />
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem',
              opacity: isSectionInView ? 1 : 0,
              transform: isSectionInView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 320ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 320ms'
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
                    transition: 'all 0.25s',
                    background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#000000' : 'var(--text-secondary)',
                    border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Cards Grid with Staggered Cascading Reveal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredSkills.map((skill, idx) => (
            <SkillCard
              key={`${activeCategory}-${skill.name}`}
              skill={skill}
              index={idx}
              isSectionInView={isSectionInView}
              activeCategory={activeCategory}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
