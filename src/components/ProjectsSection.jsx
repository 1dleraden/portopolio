'use client';

import { useState } from 'react';
import { Sparkles, ExternalLink, ArrowUpRight, Code, Eye } from 'lucide-react';
import { GithubIcon } from './Icons';
import ProjectModal from './ProjectModal';
import ScrollReveal from './ScrollReveal';

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 'taskforge',
      title: 'TaskForge — Agile Workspace & Board',
      category: 'web',
      categoryLabel: 'Web Application',
      image: '/projects/taskforge.jpg',
      shortDesc: 'Aplikasi manajemen tugas dan Kanban board dengan visualisasi metrik penyelesaian, pelacakan deadline, dan UI SaaS gelap yang memikat.',
      detailedDesc: 'TaskForge dirancang untuk mempermudah alur kerja pengembangan perangkat lunak modern. Dilengkapi dengan kanban multi-kolom yang dinamis, kartu tugas dengan tag prioritas, metrik penyelesaian otomatis, dan antarmuka gelap yang nyaman untuk mata saat bekerja seharian.',
      features: [
        'Interactive Kanban board dengan drag and move',
        'Visualisasi analitik progres tugas dan performa tim',
        'Sistem prioritas tugas dan deadline tracker dinamis',
        'Database relasional teroptimasi dengan foreign key constraints'
      ],
      tech: ['Next.js', 'React', 'PHP', 'MySQL', 'REST API', 'CSS Grid'],
      liveUrl: '#',
      githubUrl: 'https://github.com/1dleraden'
    },
    {
      id: 'cybergame',
      title: 'Cyber Odyssey — Neon Action Platformer',
      category: 'game',
      categoryLabel: 'Game Development',
      image: '/projects/cybergame.jpg',
      shortDesc: 'Prototipe gim platformer 2D futuristik dengan mekanik cyberblade dash, simulasi partikel cuaca neon, dan sistem HUD real-time.',
      detailedDesc: 'Cyber Odyssey dibangun sebagai eksplorasi mendalam atas game loop arsitektur, kalkulasi frame rate independen, dan collision detection kustom. Memadukan estetika retro cyberpunk dengan gameplay bertempo cepat, musuh patroli cerdas, dan audio synthesizer sintetis.',
      features: [
        'Game loop 60 FPS dengan delta time physics kalkulasi',
        'Sistem pertarungan pedang energi, dash evasion, dan cooldown',
        'Partikel hujan neon interaktif dan pencahayaan dinamis 2D',
        'Modular finite state machine untuk navigasi musuh'
      ],
      tech: ['Python', 'Pygame', 'Game Physics', 'Pixel Art UI', 'Audio Synthesizer'],
      liveUrl: '#game',
      githubUrl: 'https://github.com/1dleraden'
    },
    {
      id: 'devnexus',
      title: 'DevNexus — Snippet & API Studio',
      category: 'web',
      categoryLabel: 'Developer Tools',
      image: '/projects/devnexus.jpg',
      shortDesc: 'Workbench interaktif bagi software developer untuk menyimpan kode penting dengan syntax highlight, serta menguji respons endpoint API.',
      detailedDesc: 'DevNexus memecahkan masalah developer yang sering kehilangan konfigurasi kode dan fungsi helper berharga. Menyediakan editor syntax highlighter berbasis browser, parser JSON cepat dengan penanda status HTTP, serta penyimpanan lokal berkecepatan tinggi.',
      features: [
        'Syntax highlighting untuk JavaScript, Python, PHP, dan JSON',
        'Live HTTP API tester dengan payload JSON inspector',
        'One-click instant copy & export format',
        'Glassmorphic dark design terintegrasi'
      ],
      tech: ['Next.js', 'React', 'TypeScript', 'Web Storage API', 'CSS Modules'],
      liveUrl: '#',
      githubUrl: 'https://github.com/1dleraden'
    },
    {
      id: 'portfolio-v2',
      title: 'Ajies Portfolio V2 — Next.js Masterpiece',
      category: 'web',
      categoryLabel: 'Creative Web',
      image: '/projects/devnexus.jpg',
      shortDesc: 'Generasi baru portofolio personal dengan Next.js App Router, canvas starfield interaktif, mini game terintegrasi, dan terminal CLI.',
      detailedDesc: 'Mengubah portofolio statis lama menjadi web app modern dengan standar visual kelas dunia. Mengintegrasikan sistem audio Web Audio API, Canvas game physics, Bento grid responsif, dan modal preview CV interaktif.',
      features: [
        'App Router dengan rendering performa tinggi',
        'Interactive Canvas Starfield dengan reaksi kursor mouse',
        'Easter egg Cyber Dodge Canvas mini-game di dalam web',
        'Bento Grid interaktif dengan jam real-time Bogor WIB'
      ],
      tech: ['Next.js 16', 'React 19', 'Canvas 2D', 'Web Audio API', 'Confetti FX'],
      liveUrl: '#',
      githubUrl: 'https://github.com/1dleraden'
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag section-tag-cyan">
              <Sparkles size={14} />
              <span>Karya & Portofolio Proyek</span>
            </div>
            <h2 className="section-title">
              Proyek Unggulan yang Telah <span className="gradient-text">Saya Rancang</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Dari aplikasi manajemen data yang tangguh hingga gim aksi interaktif, klik untuk melihat arsitektur lengkapnya.
            </p>

            {/* Filter Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.6rem',
                marginTop: '2rem',
                flexWrap: 'wrap'
              }}
            >
              {[
                { id: 'all', label: 'Semua Karya' },
                { id: 'web', label: 'Web Applications' },
                { id: 'game', label: 'Game Development' }
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      padding: '0.5rem 1.25rem',
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
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Project Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {filteredProjects.map((project, idx) => (
            <ScrollReveal
              key={project.id}
              animation="fade-up"
              delay={idx * 120}
              style={{ display: 'flex' }}
            >
              <article
                className="glass-card"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedProject(project)}
              >
              {/* Card Image Banner */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  overflow: 'hidden',
                  background: '#0d132a'
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />

                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 2
                  }}
                >
                  <span className="badge badge-purple" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 50, 0.85)' }}>
                    {project.categoryLabel}
                  </span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  <Eye size={13} color="#22d3ee" />
                  <span>Lihat Detail</span>
                </div>
              </div>

              {/* Card Content Body */}
              <div
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      marginBottom: '0.65rem',
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{project.title}</span>
                    <ArrowUpRight size={18} color="#a78bfa" />
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      marginBottom: '1.25rem'
                    }}
                  >
                    {project.shortDesc}
                  </p>
                </div>

                <div>
                  {/* Tech stack badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#c4b5fd'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Eye size={14} />
                      <span>Detail Arsitektur</span>
                    </button>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="Lihat Source Code di GitHub"
                      style={{ padding: '0.55rem 0.75rem' }}
                    >
                      <GithubIcon size={15} />
                    </a>
                  </div>
                </div>

              </div>
            </article>
          </ScrollReveal>
        ))}

        </div>

      </div>

      {/* Render Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
