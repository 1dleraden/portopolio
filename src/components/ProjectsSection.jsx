'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ArrowUpRight, 
  Code, 
  Eye, 
  GitBranch, 
  Star, 
  GitFork, 
  RefreshCw, 
  Search, 
  CheckCircle2,
  Layers,
  FolderGit2,
  Terminal,
  Grid3X3,
  ListFilter
} from 'lucide-react';
import { GithubIcon } from './Icons';
import ProjectModal from './ProjectModal';
import ScrollReveal from './ScrollReveal';

// Default initial projects for immediate zero-latency SSR/first-paint
const INITIAL_FALLBACK_PROJECTS = [
  {
    id: 'portopolio',
    name: 'portopolio',
    title: 'Ajies Cyber Portfolio V2 — Next.js Masterpiece',
    category: 'web',
    categoryLabel: 'Interactive Web',
    image: '/projects/devnexus.jpg',
    description: 'Portofolio personal futuristik dengan Next.js App Router, kartu 3D Lanyard interaktif, Canvas Starfield 2D, mini-game, Dev Console terminal, dan sistem buku tamu real-time.',
    detailedDesc: 'Arsitektur web tingkat lanjut yang menggabungkan Three.js untuk interaksi 3D fisik, Canvas 2D untuk starfield reaktif, Web Audio API untuk lo-fi synth, serta sistem buku tamu real-time.',
    features: [
      'Next.js 16 App Router dengan performa rendering instan',
      'Interactive 3D Lanyard Card berbasis Three.js dengan rotasi dinamis',
      'Canvas Starfield 2D dengan reaksi gravitasi kursor mouse',
      'Sistem Buku Tamu real-time dengan kategori apresiasi, saran, dan kritik'
    ],
    tech: ['Next.js 16', 'React 19', 'Canvas 2D', 'Web Audio API', 'Three.js'],
    liveUrl: 'https://portopolio-wheat.vercel.app',
    githubUrl: 'https://github.com/1dleraden/portopolio',
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    languageColor: '#f7df1e',
    relativeTime: 'Terbaru',
    isNew: true,
    isFeatured: true
  },
  {
    id: 'ultah',
    name: 'ultah',
    title: 'Felisha Birthday — Interactive Greetings Experience',
    category: 'creative',
    categoryLabel: 'Creative Web & Music',
    image: '/projects/ultah.jpg',
    description: 'Situs ucapan interaktif bertema neon perayaan romantis dengan pemutar musik terintegrasi, animasi partikel/konfeti perayaan, dan pesan manis khusus.',
    detailedDesc: 'Website perayaan yang memadukan seni interaksi web dengan nuansa visual neon romantis. Dirancang secara mobile-first agar pengalaman membuka ucapan terasa istimewa di smartphone.',
    features: [
      'Antarmuka bertema neon glow dengan animasi konfeti interaktif',
      'Pemutar musik latar terintegrasi',
      'Interactive Greeting Card dan hitung mundur momen perayaan'
    ],
    tech: ['JavaScript', 'CSS3 Animations', 'Audio API', 'Responsive UI', 'Vercel'],
    liveUrl: 'https://felisha-birthday.vercel.app',
    githubUrl: 'https://github.com/1dleraden/ultah',
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    languageColor: '#f7df1e',
    relativeTime: 'Terbaru',
    isNew: true,
    isFeatured: true
  },
  {
    id: 'arsyavin',
    name: 'arsyavin',
    title: 'Sistem Informasi Perpustakaan SMKN 1 Ciomas',
    category: 'web',
    categoryLabel: 'Laravel 12 & MySQL',
    image: '/projects/arsyavin.jpg',
    description: 'Aplikasi otomasi sirkulasi dan pengelolaan perpustakaan di SMKN 1 Ciomas berbasis Laravel 12, MySQL, dan Tailwind CSS dengan 18 automated tests dan cetak slip peminjaman barcode.',
    detailedDesc: 'Dibangun khusus untuk memenuhi otomasi sirkulasi perpustakaan sekolah. Dilengkapi katalog buku dinamis, manajemen peminjaman & pengembalian 1-klik, kalkulasi denda keterlambatan otomatis, dan cetak slip peminjaman ber-barcode.',
    features: [
      'Dashboard ringkasan statistik judul buku, eksemplar, & sirkulasi aktif',
      'Katalog buku (CRUD) dengan pencarian, filter kategori & lokasi rak',
      'Sirkulasi peminjaman siswa dengan relasi otomatis ke stok buku',
      '18 automated tests PHPUnit/Pest untuk validasi integritas CRUD'
    ],
    tech: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'PHPUnit', 'REST API'],
    liveUrl: null,
    githubUrl: 'https://github.com/1dleraden/arsyavin',
    stars: 0,
    forks: 1,
    language: 'Blade / PHP',
    languageColor: '#f05340',
    relativeTime: 'Aktif',
    isFeatured: true
  },
  {
    id: 'techinf',
    name: 'techinf',
    title: 'TechInf — AI, Coding & Cyber Portal',
    category: 'web',
    categoryLabel: 'Tech Media & Portal',
    image: '/projects/techinf.jpg',
    description: 'Website portal informasi edukasi teknologi modern seputar kecerdasan buatan (AI), programming, cybersecurity, dan gaming dengan UI dark cyber yang memikat.',
    detailedDesc: 'TechInf dirancang sebagai media portal teknologi untuk para pegiat IT dan siswa kejuruan. Memuat modul artikel kurasi seputar revolusi Machine Learning, tutorial pemrograman bahasa modern, dan tren cybersecurity.',
    features: [
      'Kategori tematik komprehensif: AI & ML, Programming Hub, Cybersecurity, dan Gaming Tech',
      'Desain antarmuka neon gelap yang responsif dan memanjakan mata',
      'Arsitektur navigasi instan dan kartu artikel terstruktur'
    ],
    tech: ['HTML5', 'Modern CSS', 'JavaScript', 'Responsive UI', 'Vercel CI/CD'],
    liveUrl: 'https://techinf-wheat.vercel.app',
    githubUrl: 'https://github.com/1dleraden/techinf',
    stars: 0,
    forks: 0,
    language: 'CSS / Web',
    languageColor: '#563d7c',
    relativeTime: 'Aktif',
    isFeatured: true
  },
  {
    id: 'cybergame',
    name: 'cybergame',
    title: 'Cyber Odyssey — Neon Action Platformer',
    category: 'game',
    categoryLabel: 'Game Development',
    image: '/projects/cybergame.jpg',
    description: 'Prototipe gim platformer aksi 2D berkecepatan 60 FPS dengan simulasi partikel cuaca neon, collision physics, dan mini game playable langsung di portofolio ini.',
    detailedDesc: 'Eksplorasi mendalam arsitektur game loop, kalkulasi frame rate independen (delta time), dan deteksi tabrakan presisi. Memadukan estetika retro cyberpunk dengan kontrol responsif.',
    features: [
      'Game loop 60 FPS dengan delta time physics kalkulasi',
      'Sistem dash evasion, cooldown kemampuan, dan partikel neon',
      'Dapat dimainkan langsung di browser melalui canvas game arena web ini'
    ],
    tech: ['JavaScript', 'Canvas 2D', 'Game Physics', 'Web Audio API'],
    liveUrl: '#game',
    githubUrl: 'https://github.com/1dleraden',
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    languageColor: '#f7df1e',
    relativeTime: 'Live Game',
    isFeatured: true
  },
  {
    id: 'crud-admin',
    name: 'crud-admin',
    title: 'Sistem Manajemen Data Siswa (CRUD Admin)',
    category: 'web',
    categoryLabel: 'Database Management',
    image: '/projects/crud-admin.jpg',
    description: 'Aplikasi pengelolaan basis data siswa dengan fungsionalitas CRUD lengkap, otentikasi admin, pencarian instan, dan struktur database relasional.',
    detailedDesc: 'Sistem manajemen database operasional yang dirancang untuk mempermudah pencatatan informasi siswa, pengelompokan kelas, dan status data secara terstruktur dengan relasi MySQL.',
    features: [
      'Dashboard manajemen data siswa dengan metrik real-time',
      'Operasi CRUD (Create, Read, Update, Delete) terstruktur',
      'Penyaringan dan pencarian siswa berbasis nama atau kelas'
    ],
    tech: ['PHP', 'MySQL', 'Bootstrap / SCSS', 'JavaScript'],
    liveUrl: null,
    githubUrl: 'https://github.com/1dleraden/crud-admin',
    stars: 0,
    forks: 0,
    language: 'PHP',
    languageColor: '#4f5d95',
    relativeTime: 'Aktif',
    isFeatured: true
  }
];

export default function ProjectsSection() {
  const [layoutView, setLayoutView] = useState('cards'); // 'cards' | 'matrix'
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Live GitHub state
  const [githubData, setGithubData] = useState(null);
  const [loadingGithub, setLoadingGithub] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [repoLangFilter, setRepoLangFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');

  // Fetch live repos from local API route
  const fetchGithubRepos = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    try {
      const url = forceRefresh ? '/api/github/repos?refresh=true' : '/api/github/repos';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGithubData(data);
        if (forceRefresh) {
          setSyncFeedback('Tersinkronisasi dengan GitHub!');
          setTimeout(() => setSyncFeedback(''), 3000);
        }
      }
    } catch (err) {
      console.error('Failed to load GitHub repos:', err);
      if (forceRefresh) {
        setSyncFeedback('Gagal sinkron. Menggunakan cache lokal.');
        setTimeout(() => setSyncFeedback(''), 3000);
      }
    } finally {
      setLoadingGithub(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGithubRepos();
  }, []);

  // Use dynamic repos from GitHub if available, otherwise fall back to curated list
  const allProjects = (githubData?.repos && githubData.repos.length > 0)
    ? githubData.repos
    : INITIAL_FALLBACK_PROJECTS;

  // Filter projects based on active filter, search, and language
  const filteredProjects = allProjects.filter((project) => {
    // Search query filter
    const searchMatch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.tech && project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!searchMatch) return false;

    // Category / Status Filter
    if (activeFilter === 'featured' && !project.isFeatured) return false;
    if (activeFilter === 'web' && project.category !== 'web') return false;
    if (activeFilter === 'creative' && project.category !== 'creative' && project.category !== 'game') return false;
    if (activeFilter === 'new' && !project.isNew) return false;

    // Language Filter
    if (repoLangFilter === 'js' && !['JavaScript', 'TypeScript'].includes(project.language)) return false;
    if (repoLangFilter === 'php' && !['PHP', 'Blade'].includes(project.language)) return false;
    if (repoLangFilter === 'css' && !['CSS', 'HTML', 'SCSS'].includes(project.language)) return false;

    return true;
  });

  return (
    <section id="projects" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag section-tag-cyan">
              <Sparkles size={14} />
              <span>✦ Real-Time GitHub Synchronization</span>
            </div>
            <h2 className="section-title">
              Deep-Space Expeditions &amp; <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Terhubung langsung dengan GitHub. Setiap repositori atau proyek baru yang dibuat di akun <strong style={{ color: '#38bdf8' }}>@1dleraden</strong> akan otomatis muncul di halaman ini.
            </p>

            {/* Live GitHub Status Card */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.75rem',
                padding: '0.65rem 1.35rem',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)'
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  Live GitHub Sync:
                </span>
                <a
                  href="https://github.com/1dleraden"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  @1dleraden
                  <ExternalLink size={12} />
                </a>
              </div>

              <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>📦 <strong>{allProjects.length}</strong> Proyek Aktif</span>
                <span>⭐ <strong>{githubData?.repos?.reduce((acc, r) => acc + (r.stars || 0), 0) || 0}</strong> Stars</span>
                <span>👥 <strong>{githubData?.profile?.followers || 2}</strong> Followers</span>
              </div>

              <div style={{ height: '14px', width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />

              {/* Instant Refresh Button */}
              <button
                onClick={() => fetchGithubRepos(true)}
                disabled={refreshing}
                title="Sinkronkan data proyek terbaru dari GitHub API"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  background: refreshing ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Sinkron...' : 'Sync GitHub'}</span>
              </button>
            </div>

            {/* Sync feedback notification */}
            {syncFeedback && (
              <div
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#34d399',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                ✓ {syncFeedback}
              </div>
            )}

            {/* Main Category Filter Tabs */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '2rem',
                flexWrap: 'wrap'
              }}
            >
              {[
                { id: 'all', label: `Semua Proyek (${allProjects.length})` },
                { id: 'featured', label: '⭐ Case Studies / Unggulan' },
                { id: 'web', label: '🌐 Web Applications' },
                { id: 'creative', label: '🎮 Game & Kreatif' },
                { id: 'new', label: '⚡ Baru di GitHub' }
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#000000' : 'var(--text-secondary)',
                      border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isActive ? '0 0 20px rgba(255, 255, 255, 0.25)' : 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search, Language Filter & Layout Switcher Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              {/* Search Bar */}
              <div
                style={{
                  position: 'relative',
                  width: 'min(300px, 100%)'
                }}
              >
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  type="text"
                  placeholder="Cari nama proyek, deskripsi, teknologi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.48rem 0.85rem 0.48rem 2.25rem',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                />
              </div>

              {/* Language filter pills */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'Semua Bahasa' },
                  { id: 'js', label: 'JavaScript' },
                  { id: 'php', label: 'Laravel / PHP' },
                  { id: 'css', label: 'CSS / Web' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRepoLangFilter(tab.id)}
                    style={{
                      padding: '0.38rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: repoLangFilter === tab.id ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      color: repoLangFilter === tab.id ? '#38bdf8' : 'var(--text-muted)',
                      border: repoLangFilter === tab.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* View Layout Switcher (Cards vs Matrix) */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <button
                  onClick={() => setLayoutView('cards')}
                  title="Tampilan Galeri Visual"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: layoutView === 'cards' ? '#38bdf8' : 'transparent',
                    color: layoutView === 'cards' ? '#000000' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Grid3X3 size={13} />
                  <span>Galeri</span>
                </button>

                <button
                  onClick={() => setLayoutView('matrix')}
                  title="Tampilan Telemetri Repositori"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: layoutView === 'matrix' ? '#38bdf8' : 'transparent',
                    color: layoutView === 'matrix' ? '#000000' : 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  <FolderGit2 size={13} />
                  <span>Telemetry</span>
                </button>
              </div>

            </div>

          </div>
        </ScrollReveal>

        {/* Empty state when no projects match filter */}
        {filteredProjects.length === 0 && (
          <div
            className="glass-card"
            style={{
              textAlign: 'center',
              padding: '3.5rem 2rem',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <FolderGit2 size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
              Tidak ada proyek yang cocok
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Coba gunakan kata kunci pencarian lain atau klik tombol reset filter.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setRepoLangFilter('all');
                setSearchQuery('');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* LAYOUT 1: VISUAL CARDS GALLERY (PRIMARY VIEW)                */}
        {/* ============================================================ */}
        {layoutView === 'cards' && filteredProjects.length > 0 && (
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
                delay={idx * 60}
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
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    position: 'relative'
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
                      background: 'linear-gradient(135deg, #0a0f24, #080a14)'
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      onError={(e) => {
                        // Fallback to dark branded SVG or GitHub OpenGraph
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://opengraph.githubassets.com/1/1dleraden/${project.name}`;
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />

                    {/* Category badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 2
                      }}
                    >
                      <span className="badge badge-purple" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 50, 0.85)' }}>
                        {project.categoryLabel || 'Web Application'}
                      </span>
                    </div>

                    {/* Top right: New badge or GitHub repo badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {project.isNew && (
                        <span
                          className="badge badge-cyan"
                          style={{
                            backdropFilter: 'blur(8px)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontWeight: 700,
                            boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)'
                          }}
                        >
                          <Sparkles size={11} />
                          <span>BARU</span>
                        </span>
                      )}

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '9999px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          backdropFilter: 'blur(6px)',
                          fontSize: '0.72rem',
                          color: '#e2e8f0',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <GithubIcon size={12} />
                        <span>1dleraden/{project.name}</span>
                      </span>
                    </div>

                    {/* Bottom Right: Quick View Peek Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '0.85rem',
                        right: '0.85rem',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '9999px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      <Eye size={12} color="#22d3ee" />
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
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          marginBottom: '0.65rem',
                          color: '#f8fafc',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <span>{project.title}</span>
                        <ArrowUpRight size={18} color="#a78bfa" style={{ flexShrink: 0, marginTop: '2px' }} />
                      </h3>

                      <p
                        style={{
                          fontSize: '0.88rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.65,
                          marginBottom: '1.25rem'
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech stack badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                        {(project.tech || []).slice(0, 4).map((t) => (
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

                      {/* GitHub Stats & Timestamp Bar */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginBottom: '1rem',
                          paddingBottom: '0.75rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: project.languageColor || '#38bdf8'
                            }}
                          />
                          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{project.language || 'Code'}</span>
                        </div>

                        {project.forks > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <GitFork size={12} />
                            <span>{project.forks}</span>
                          </div>
                        )}

                        <div style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>
                          {project.relativeTime || project.updatedAt}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
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

                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm"
                            title="Buka Live Demo"
                            style={{ padding: '0.55rem 0.75rem' }}
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}

                        <a
                          href={project.githubUrl || `https://github.com/1dleraden/${project.name}`}
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
        )}

        {/* ============================================================ */}
        {/* LAYOUT 2: MATRIX TELEMETRY (COMPACT ENGINEER VIEW)           */}
        {/* ============================================================ */}
        {layoutView === 'matrix' && filteredProjects.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredProjects.map((repo, idx) => (
              <ScrollReveal
                key={repo.id}
                animation="fade-up"
                delay={idx * 50}
                style={{ display: 'flex' }}
              >
                <div
                  className="glass-card"
                  style={{
                    width: '100%',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'linear-gradient(145deg, rgba(16, 20, 36, 0.8), rgba(9, 11, 20, 0.95))',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                >
                  <div>
                    {/* Top repo header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#38bdf8',
                          fontWeight: 700
                        }}
                      >
                        <GithubIcon size={14} />
                        <span>1dleraden/{repo.name}</span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {repo.isNew && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              border: '1px solid rgba(56, 189, 248, 0.4)'
                            }}
                          >
                            Baru
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          Public
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginBottom: '0.6rem',
                        lineHeight: 1.35
                      }}
                    >
                      {repo.title}
                    </h4>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '1.25rem'
                      }}
                    >
                      {repo.description}
                    </p>
                  </div>

                  <div>
                    {/* Language & Stats Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginBottom: '1.25rem',
                        paddingBottom: '0.85rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: repo.languageColor || '#38bdf8'
                          }}
                        />
                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{repo.language || 'Code'}</span>
                      </div>

                      {repo.forks > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <GitFork size={13} />
                          <span>{repo.forks}</span>
                        </div>
                      )}

                      <div style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>
                        {repo.relativeTime || repo.updatedAt}
                      </div>
                    </div>

                    {/* Repo Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedProject(repo)}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, minWidth: '110px', fontSize: '0.78rem' }}
                      >
                        <Eye size={13} />
                        <span>Detail</span>
                      </button>

                      {repo.liveUrl && repo.liveUrl !== '#' && (
                        <a
                          href={repo.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, minWidth: '110px', fontSize: '0.78rem' }}
                        >
                          <ExternalLink size={13} />
                          <span>Live Demo</span>
                        </a>
                      )}

                      <a
                        href={repo.githubUrl || `https://github.com/1dleraden/${repo.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="Buka Repositori di GitHub"
                        style={{ padding: '0.5rem 0.75rem' }}
                      >
                        <GithubIcon size={14} />
                      </a>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

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
