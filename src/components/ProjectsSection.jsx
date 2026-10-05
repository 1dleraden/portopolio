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
  FolderGit2
} from 'lucide-react';
import { GithubIcon } from './Icons';
import ProjectModal from './ProjectModal';
import ScrollReveal from './ScrollReveal';

export default function ProjectsSection() {
  const [viewMode, setViewMode] = useState('featured'); // 'featured' | 'live'
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Live GitHub state
  const [githubData, setGithubData] = useState(null);
  const [loadingGithub, setLoadingGithub] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [repoLangFilter, setRepoLangFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live repos from local API route
  const fetchGithubRepos = async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);
    try {
      const res = await fetch('/api/github/repos');
      if (res.ok) {
        const data = await res.json();
        setGithubData(data);
      }
    } catch (err) {
      console.error('Failed to load GitHub repos:', err);
    } finally {
      setLoadingGithub(false);
      if (showRefreshState) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGithubRepos();
  }, []);

  // Curated showcase projects (backed by user's real GitHub repositories)
  const featuredProjects = [
    {
      id: 'arsyavin',
      name: 'arsyavin',
      title: 'Sistem Informasi Perpustakaan SMKN 1 Ciomas',
      category: 'web',
      categoryLabel: 'Laravel 12 & MySQL',
      image: '/projects/arsyavin.jpg',
      shortDesc: 'Aplikasi otomasi sirkulasi dan pengelolaan perpustakaan di SMKN 1 Ciomas berbasis Laravel 12, MySQL, dan Tailwind CSS dengan 18 automated tests dan cetak slip peminjaman barcode.',
      detailedDesc: 'Dibangun khusus untuk memenuhi otomasi sirkulasi perpustakaan sekolah. Dilengkapi katalog buku dinamis, manajemen peminjaman & pengembalian 1-klik, kalkulasi denda keterlambatan otomatis (Rp 1.000/hari), cetak slip peminjaman ber-barcode, dan rekapitulasi laporan resmi ber-Kop Surat Dinas Pendidikan.',
      features: [
        'Dashboard ringkasan statistik judul buku, eksemplar, & sirkulasi aktif',
        'Katalog buku (CRUD) dengan pencarian, filter kategori & lokasi rak',
        'Sirkulasi peminjaman siswa dengan relasi otomatis ke stok buku',
        'Pengembalian & denda otomatis dengan kalkulasi keterlambatan',
        'Cetak slip peminjaman siswa dengan barcode dan kolom tanda tangan',
        '18 automated tests PHPUnit/Pest untuk validasi integritas CRUD'
      ],
      tech: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'PHPUnit', 'REST API'],
      liveUrl: null,
      githubUrl: 'https://github.com/1dleraden/arsyavin',
      stars: 0,
      forks: 1,
      language: 'Blade / PHP',
      languageColor: '#f05340'
    },
    {
      id: 'techinf',
      name: 'techinf',
      title: 'TechInf — AI, Coding & Cyber Portal',
      category: 'web',
      categoryLabel: 'Tech Media & Portal',
      image: '/projects/techinf.jpg',
      shortDesc: 'Website portal informasi edukasi teknologi modern seputar kecerdasan buatan (AI), programming, cybersecurity, dan gaming dengan UI dark cyber yang memikat.',
      detailedDesc: 'TechInf dirancang sebagai media portal teknologi untuk para pegiat IT dan siswa kejuruan. Memuat modul artikel kurasi seputar revolusi Machine Learning, tutorial pemrograman bahasa modern (Python, JavaScript), tren cybersecurity, serta dunia gaming tech.',
      features: [
        'Kategori tematik komprehensif: AI & ML, Programming Hub, Cybersecurity, dan Gaming Tech',
        'Desain antarmuka neon gelap yang responsif dan memanjakan mata',
        'Arsitektur navigasi instan dan kartu artikel terstruktur',
        'Terintegrasi dengan continuous deployment di Vercel'
      ],
      tech: ['HTML5', 'Modern CSS', 'JavaScript', 'Responsive UI', 'Vercel CI/CD'],
      liveUrl: 'https://techinf-wheat.vercel.app',
      githubUrl: 'https://github.com/1dleraden/techinf',
      stars: 0,
      forks: 0,
      language: 'CSS / Web',
      languageColor: '#563d7c'
    },
    {
      id: 'cybergame',
      name: 'cybergame',
      title: 'Cyber Odyssey — Neon Action Platformer',
      category: 'game',
      categoryLabel: 'Game Development',
      image: '/projects/cybergame.jpg',
      shortDesc: 'Prototipe gim platformer aksi 2D berkecepatan 60 FPS dengan simulasi partikel cuaca neon, collision physics, dan mini game playable langsung di portofolio ini.',
      detailedDesc: 'Eksplorasi mendalam arsitektur game loop, kalkulasi frame rate independen (delta time), dan deteksi tabrakan presisi. Memadukan estetika retro cyberpunk dengan kontrol responsif dan efek suara sintetis.',
      features: [
        'Game loop 60 FPS dengan delta time physics kalkulasi',
        'Sistem dash evasion, cooldown kemampuan, dan partikel neon',
        'Dapat dimainkan langsung di browser melalui canvas game arena web ini',
        'Pelacakan high-score lokal dan efek audio interaktif'
      ],
      tech: ['JavaScript', 'Canvas 2D', 'Game Physics', 'Web Audio API'],
      liveUrl: '#game',
      githubUrl: 'https://github.com/1dleraden',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      languageColor: '#f7df1e'
    },
    {
      id: 'portopolio',
      name: 'portopolio',
      title: 'Ajies Cyber Portfolio V2 — Next.js Masterpiece',
      category: 'web',
      categoryLabel: 'Creative Web App',
      image: '/projects/devnexus.jpg',
      shortDesc: 'Generasi baru portofolio personal dengan Next.js App Router, kartu 3D Lanyard interaktif, Canvas Starfield 2D, Mini-game terintegrasi, dan Buku Tamu.',
      detailedDesc: 'Arsitektur web tingkat lanjut yang menggabungkan Three.js untuk interaksi 3D fisik, Canvas 2D untuk starfield reaktif, Web Audio API untuk lo-fi synth & ambient tone, serta API route Next.js untuk buku tamu publik.',
      features: [
        'Next.js 16 App Router dengan performa rendering instan',
        'Interactive 3D Lanyard Card berbasis Three.js dengan rotasi dinamis',
        'Canvas Starfield 2D dengan reaksi gravitasi kursor mouse',
        'Sistem Buku Tamu real-time dengan kategori apresiasi, saran, dan kritik',
        'Music Player terintegrasi dengan visualisator spektrum audio'
      ],
      tech: ['Next.js 16', 'React 19', 'Canvas 2D', 'Web Audio API', 'Three.js'],
      liveUrl: 'https://portopolio-wheat.vercel.app',
      githubUrl: 'https://github.com/1dleraden/portopolio',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      languageColor: '#f7df1e'
    },
    {
      id: 'ultah',
      name: 'ultah',
      title: 'Felisha Birthday — Interactive Greetings Experience',
      category: 'creative',
      categoryLabel: 'Creative Web & Music',
      image: '/projects/ultah.jpg',
      shortDesc: 'Situs ucapan interaktif bertema neon perayaan romantis dengan pemutar musik terintegrasi, animasi partikel/konfeti perayaan, dan pesan manis khusus.',
      detailedDesc: 'Website perayaan yang menggabungkan seni interaksi web dengan nuansa visual neon romantis. Dirancang secara mobile-first agar pengalaman membuka ucapan terasa istimewa di perangkat smartphone.',
      features: [
        'Antarmuka bertema neon glow dengan animasi konfeti interaktif',
        'Pemutar musik latar terintegrasi',
        'Interactive Greeting Card dan hitung mundur momen perayaan',
        'Live deployment di Vercel dengan domain kustom'
      ],
      tech: ['JavaScript', 'CSS3 Animations', 'Audio API', 'Responsive UI', 'Vercel'],
      liveUrl: 'https://felisha-birthday.vercel.app',
      githubUrl: 'https://github.com/1dleraden/ultah',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      languageColor: '#f7df1e'
    },
    {
      id: 'crud-admin',
      name: 'crud-admin',
      title: 'Sistem Manajemen Data Siswa (CRUD Admin)',
      category: 'web',
      categoryLabel: 'Database Management',
      image: '/projects/crud-admin.jpg',
      shortDesc: 'Aplikasi pengelolaan basis data siswa dengan fungsionalitas CRUD lengkap, otentikasi admin, pencarian instan, dan struktur database relasional.',
      detailedDesc: 'Sistem manajemen database operasional yang dirancang untuk mempermudah pencatatan informasi siswa, pengelompokan kelas, dan status data secara terstruktur dengan relasi MySQL.',
      features: [
        'Dashboard manajemen data siswa dengan metrik real-time',
        'Operasi CRUD (Create, Read, Update, Delete) terstruktur',
        'Penyaringan dan pencarian siswa berbasis nama atau kelas',
        'Database relasional MySQL teroptimasi'
      ],
      tech: ['PHP', 'MySQL', 'Bootstrap / SCSS', 'JavaScript'],
      liveUrl: null,
      githubUrl: 'https://github.com/1dleraden/crud-admin',
      stars: 0,
      forks: 0,
      language: 'PHP',
      languageColor: '#4f5d95'
    }
  ];

  // Filter for featured projects
  const filteredFeatured = activeFilter === 'all'
    ? featuredProjects
    : activeFilter === 'game'
      ? featuredProjects.filter(p => p.category === 'game')
      : activeFilter === 'creative'
        ? featuredProjects.filter(p => p.category === 'creative')
        : featuredProjects.filter(p => p.category === 'web');

  // Filter for live GitHub repos
  const liveRepos = githubData?.repos || [];
  const filteredLiveRepos = liveRepos.filter((repo) => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.title && repo.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (repoLangFilter === 'all') return true;
    if (repoLangFilter === 'js') return repo.language === 'JavaScript' || repo.language === 'TypeScript';
    if (repoLangFilter === 'php') return repo.language === 'Blade' || repo.language === 'PHP';
    if (repoLangFilter === 'css') return repo.language === 'CSS' || repo.language === 'HTML';
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
              <span>Karya & Integrasi GitHub</span>
            </div>
            <h2 className="section-title">
              Proyek Nyata yang Telah <span className="gradient-text">Saya Kembangkan</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Terhubung langsung ke repositori resmi <strong>@1dleraden</strong> di GitHub. Jelajahi arsitektur, source code, dan live demo dari tiap proyek.
            </p>

            {/* Live GitHub Status Card */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.75rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                    animation: 'pulse-ring 2s infinite'
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
                <span>📦 <strong>{githubData?.totalRepos || 7}</strong> Repositori</span>
                <span>⭐ <strong>{githubData?.repos?.reduce((acc, r) => acc + (r.stars || 0), 0) || 0}</strong> Stars</span>
                <span>👥 <strong>{githubData?.profile?.followers || 2}</strong> Followers</span>
              </div>
            </div>

            {/* View Mode Switcher: Featured vs Live GitHub */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '2rem'
              }}
            >
              <button
                onClick={() => setViewMode('featured')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  background: viewMode === 'featured' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                  color: viewMode === 'featured' ? '#000000' : 'var(--text-secondary)',
                  border: viewMode === 'featured' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: viewMode === 'featured' ? '0 0 25px rgba(255, 255, 255, 0.25)' : 'none'
                }}
              >
                <Sparkles size={15} />
                <span>⭐ Proyek Unggulan (Case Studies)</span>
              </button>

              <button
                onClick={() => setViewMode('live')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  background: viewMode === 'live' ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
                  color: viewMode === 'live' ? '#000000' : 'var(--text-secondary)',
                  border: viewMode === 'live' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: viewMode === 'live' ? '0 0 25px rgba(56, 189, 248, 0.35)' : 'none'
                }}
              >
                <FolderGit2 size={15} />
                <span>⚡ Live Repositori GitHub ({githubData?.totalRepos || 7})</span>
              </button>
            </div>

            {/* Sub-Filters depending on view */}
            {viewMode === 'featured' ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.25rem',
                  flexWrap: 'wrap'
                }}
              >
                {[
                  { id: 'all', label: 'Semua Proyek' },
                  { id: 'web', label: 'Web Applications' },
                  { id: 'creative', label: 'Creative & Interactive' },
                  { id: 'game', label: 'Game Dev' }
                ].map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        color: isActive ? '#38bdf8' : 'var(--text-muted)',
                        border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Live Repos Search & Language Filter Bar */
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
                {/* Search Input */}
                <div
                  style={{
                    position: 'relative',
                    width: 'min(320px, 100%)'
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
                    placeholder="Cari repositori GitHub..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.85rem 0.5rem 2.25rem',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
                  />
                </div>

                {/* Language filter pills */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'js', label: 'JavaScript' },
                    { id: 'php', label: 'Laravel / PHP' },
                    { id: 'css', label: 'CSS / Web' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setRepoLangFilter(tab.id)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: repoLangFilter === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        color: repoLangFilter === tab.id ? '#38bdf8' : 'var(--text-muted)',
                        border: repoLangFilter === tab.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => fetchGithubRepos(true)}
                  disabled={refreshing}
                  title="Sinkronkan Ulang dengan GitHub API"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                  <span>{refreshing ? 'Sinkron...' : 'Sync'}</span>
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* VIEW 1: FEATURED PROJECTS (CASE STUDIES)                     */}
        {/* ============================================================ */}
        {viewMode === 'featured' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {filteredFeatured.map((project, idx) => (
              <ScrollReveal
                key={project.id}
                animation="fade-up"
                delay={idx * 100}
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
                    transition: 'transform 0.3s ease, border-color 0.3s ease'
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
                        {project.categoryLabel}
                      </span>
                    </div>

                    {/* GitHub Repo badge top right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 2
                      }}
                    >
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
                        background: 'rgba(0,0,0,0.75)',
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
        )}

        {/* ============================================================ */}
        {/* VIEW 2: LIVE GITHUB REPOSITORIES FEED                        */}
        {/* ============================================================ */}
        {viewMode === 'live' && (
          <div>
            {loadingGithub ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="glass-card"
                    style={{
                      height: '240px',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: 0.6
                    }}
                  >
                    <div style={{ height: '24px', width: '60%', background: 'rgba(255,255,255,0.08)', borderRadius: '6px' }} />
                    <div style={{ height: '48px', width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }} />
                    <div style={{ height: '32px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
                  </div>
                ))}
              </div>
            ) : filteredLiveRepos.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <FolderGit2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Tidak ada repositori yang cocok
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Coba ubah kata kunci pencarian atau reset filter bahasa pemrograman.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {filteredLiveRepos.map((repo, idx) => (
                  <ScrollReveal
                    key={repo.id}
                    animation="fade-up"
                    delay={idx * 60}
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
                            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{repo.language}</span>
                          </div>

                          {repo.forks > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <GitFork size={13} />
                              <span>{repo.forks}</span>
                            </div>
                          )}

                          <div style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>
                            Diperbarui {repo.updatedAt}
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

                          {repo.liveUrl && (
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
                            href={repo.githubUrl}
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
