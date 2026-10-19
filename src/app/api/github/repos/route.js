import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache on server for max 60 seconds

const GITHUB_USERNAME = '1dleraden';

// Language colors map
const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  PHP: '#4f5d95',
  Blade: '#f05340',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Hack: '#878787',
  SCSS: '#c6538c',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584'
};

// Rich metadata enhancement for 1dleraden's known projects
const ENHANCED_PROJECT_DATA = {
  arsyavin: {
    customTitle: 'Sistem Informasi Perpustakaan SMKN 1 Ciomas',
    category: 'web',
    categoryLabel: 'Laravel & MySQL System',
    customDesc: 'Sistem otomasi sirkulasi dan pengelolaan perpustakaan di SMKN 1 Ciomas berbasis Laravel 12, MySQL, dan Tailwind CSS dengan 18 automated tests dan cetak slip peminjaman barcode.',
    features: [
      'Dashboard ringkasan statistik buku, sirkulasi aktif & buku jatuh tempo',
      'Katalog buku (CRUD) dengan pencarian, filter kategori & lokasi rak',
      'Sirkulasi peminjaman siswa dengan pemotongan stok otomatis',
      'Kalkulasi denda otomatis (Rp 1.000/hari) saat pengembalian telat',
      'Cetak Slip Peminjaman Siswa dengan barcode dan tanda tangan resmi',
      'Suite 18 automated tests PHPUnit/Pest untuk validasi integritas data'
    ],
    tech: ['Laravel 12', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'PHPUnit', 'REST API'],
    image: '/projects/arsyavin.jpg',
    homepage: null,
    isFeatured: true
  },
  techinf: {
    customTitle: 'TechInf — AI, Coding & Cyber Portal',
    category: 'web',
    categoryLabel: 'Tech Media & Portal',
    customDesc: 'Portal edukasi teknologi informasi dengan artikel seputar Artificial Intelligence, Programming, Cybersecurity, dan Gaming dalam antarmuka cyber modern.',
    features: [
      'Kategori informasi tematik: AI & ML, Programming Hub, Cybersecurity, dan Gaming Tech',
      'Desain antarmuka neon gelap yang responsif dan memikat',
      'Navigasi kategori dinamis untuk kemudahan eksplorasi konten',
      'Terintegrasi dengan deployment otomatis di Vercel'
    ],
    tech: ['HTML5', 'Modern CSS', 'JavaScript', 'Responsive UI', 'Vercel'],
    image: '/projects/techinf.jpg',
    homepage: 'https://techinf-wheat.vercel.app',
    isFeatured: true
  },
  portopolio: {
    customTitle: 'Ajies Cyber Portfolio V2 — Next.js Masterpiece',
    category: 'web',
    categoryLabel: 'Interactive Web',
    customDesc: 'Portofolio personal futuristik dengan Next.js App Router, kartu 3D Lanyard interaktif, Canvas Starfield 2D, mini-game, Dev Console terminal, dan sistem buku tamu real-time.',
    features: [
      'Next.js App Router performa tinggi dengan render instan',
      '3D Interactive Lanyard Card berbasis Three.js / React Three Fiber',
      'Starfield Canvas 2D yang bereaksi terhadap pergerakan mouse',
      'Cyber Dodge playable Mini Game di dalam browser',
      'Buku tamu interaktif (Kritik & Saran) dengan penyimpanan data real-time'
    ],
    tech: ['Next.js 16', 'React 19', 'Canvas 2D', 'Web Audio API', 'Lucide Icons'],
    image: '/projects/devnexus.jpg',
    homepage: 'https://portopolio-wheat.vercel.app',
    isFeatured: true
  },
  ultah: {
    customTitle: 'Felisha Birthday — Interactive Greetings Experience',
    category: 'creative',
    categoryLabel: 'Creative Web & Music',
    customDesc: 'Situs ucapan interaktif bertema neon perayaan romantis dengan pemutar musik terintegrasi, animasi partikel/konfeti perayaan, dan pesan manis khusus.',
    features: [
      'Antarmuka bertema neon glow dengan animasi partikel & confetti dinamis',
      'Pemutar musik audio terintegrasi langsung di web',
      'Interactive Greeting Card dan hitung mundur perayaan',
      'Desain mobile-first yang responsif untuk berbagai ukuran layar smartphone'
    ],
    tech: ['JavaScript', 'CSS3 Animations', 'Audio API', 'Responsive UI', 'Vercel'],
    image: '/projects/ultah.jpg',
    homepage: 'https://felisha-birthday.vercel.app',
    isFeatured: true
  },
  'crud-admin': {
    customTitle: 'Sistem Manajemen Data Siswa (CRUD Admin)',
    category: 'web',
    categoryLabel: 'Database Management',
    customDesc: 'Aplikasi pengelolaan basis data siswa dengan fungsionalitas CRUD lengkap, otentikasi admin, pencarian instan, dan struktur database relasional.',
    features: [
      'Dashboard manajemen data siswa dengan metrik real-time',
      'Operasi CRUD (Create, Read, Update, Delete) terstruktur',
      'Penyaringan dan pencarian siswa berbasis nama atau kelas',
      'Database relasional MySQL teroptimasi'
    ],
    tech: ['PHP', 'MySQL', 'Bootstrap / SCSS', 'JavaScript'],
    image: '/projects/crud-admin.jpg',
    homepage: null,
    isFeatured: true
  },
  birthday: {
    customTitle: 'Interactive Birthday Celebration Web',
    category: 'creative',
    categoryLabel: 'Creative Web',
    customDesc: 'Eksperimen website ucapan interaktif dengan elemen animasi visual dinamis dan deployment live di Vercel.',
    features: [
      'Animasi interaktif berbasis JavaScript murni',
      'Tampilan adaptif untuk perangkat mobile',
      'Live deployment di Vercel'
    ],
    tech: ['JavaScript', 'CSS3', 'Vercel'],
    image: '/projects/ultah.jpg',
    homepage: 'https://birthday-jade-gamma.vercel.app',
    isFeatured: false
  },
  portfolio: {
    customTitle: 'Portofolio Personal V1 (Arsip Klasik)',
    category: 'web',
    categoryLabel: 'Static Archive',
    customDesc: 'Arsip versi awal portofolio personal berbasis HTML dan CSS statis sebelum migrasi ke arsitektur modern Next.js.',
    features: [
      'Struktur web semantik murni tanpa build step',
      'Representasi tonggak awal perjalanan pemrograman',
      'Dokumentasi historis repositori publik'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: '/projects/taskforge.jpg',
    homepage: null,
    isFeatured: false
  }
};

// Built-in interactive showcase (local browser-playable lab experiment)
const LOCAL_SHOWCASE_PROJECTS = [
  {
    id: 'cybergame',
    name: 'cybergame',
    title: 'Cyber Odyssey — Neon Action Platformer',
    category: 'game',
    categoryLabel: 'Game Development',
    image: '/projects/cybergame.jpg',
    description: 'Prototipe gim platformer aksi 2D berkecepatan 60 FPS dengan simulasi partikel cuaca neon, collision physics, dan mini game playable langsung di portofolio ini.',
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
    languageColor: '#f7df1e',
    updatedAt: 'Playable Live',
    relativeTime: 'Live Game',
    isPlayableDemo: true,
    isFeatured: true
  }
];

// Helper: Format raw repo name into clean humanized title
function formatTitle(name) {
  if (!name) return 'Untitle Project';
  return name
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (['AI', 'API', 'UI', 'UX', 'SMK', 'CRUD', 'ML', 'CSS', 'JS', 'PHP', 'HTML', 'SEO', 'PPLG', 'REST'].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

// Helper: Infer category based on name, topics, and language
function inferCategory(repo) {
  const text = `${repo.name} ${(repo.topics || []).join(' ')} ${repo.language || ''} ${repo.description || ''}`.toLowerCase();
  
  if (text.includes('game') || text.includes('odyssey') || text.includes('canvas') || text.includes('unity') || text.includes('godot')) {
    return { category: 'game', label: 'Game Development' };
  }
  if (text.includes('creative') || text.includes('music') || text.includes('audio') || text.includes('birthday') || text.includes('ultah') || text.includes('greeting') || text.includes('animat')) {
    return { category: 'creative', label: 'Creative & Interactive' };
  }
  if (text.includes('ai') || text.includes('machine-learning') || text.includes('bot') || text.includes('gpt') || text.includes('nlp')) {
    return { category: 'ai', label: 'AI & Intelligent Systems' };
  }
  return { 
    category: 'web', 
    label: repo.language ? `${repo.language} Application` : 'Web Application' 
  };
}

// Helper: Human readable relative time in Indonesian
function getRelativeTime(dateString) {
  if (!dateString) return 'Baru saja';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return 'Kemarin';
  if (diffDay < 14) return `${diffDay} hari lalu`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} minggu lalu`;
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(past);
}

// Global cache object so webhooks and refreshes can purge immediately
if (!globalThis.__github_repos_cache) {
  globalThis.__github_repos_cache = {
    data: null,
    lastFetched: 0
  };
}

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';
  const now = Date.now();

  // Return cached data if still within TTL and not forcing refresh
  if (!forceRefresh && globalThis.__github_repos_cache.data && (now - globalThis.__github_repos_cache.lastFetched < CACHE_TTL_MS)) {
    return NextResponse.json(globalThis.__github_repos_cache.data);
  }

  try {
    const headers = {
      'User-Agent': 'PutraRadenPortfolio/2.0',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Use GitHub token if configured (boosts rate limit from 60 to 5,000 req/hr)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user profile and repos sorted by recent push activity
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        cache: 'no-store'
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`, {
        headers,
        cache: 'no-store'
      })
    ]);

    if (!reposResponse.ok) {
      throw new Error(`GitHub API returned status ${reposResponse.status}`);
    }

    const userData = userResponse.ok ? await userResponse.json() : null;
    const rawRepos = await reposResponse.json();

    if (!Array.isArray(rawRepos)) {
      throw new Error('Invalid repos response format');
    }

    // Process all repositories from GitHub
    const processedRepos = rawRepos.map((repo) => {
      const enhanced = ENHANCED_PROJECT_DATA[repo.name] || {};
      const inferred = inferCategory(repo);
      const language = repo.language || (enhanced.tech && enhanced.tech[0]) || 'Code';
      const languageColor = LANGUAGE_COLORS[language] || '#38bdf8';

      // Check if project is newly pushed (within last 14 days)
      const lastPushed = new Date(repo.pushed_at || repo.updated_at);
      const daysSincePushed = (now - lastPushed.getTime()) / (1000 * 60 * 60 * 24);
      const isNew = daysSincePushed <= 14;

      const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(lastPushed);

      // Tech tags: combine language and GitHub topics
      const techList = enhanced.tech || [
        language,
        ...(repo.topics || []).slice(0, 4),
        'Git'
      ].filter(Boolean);

      // High-res preview image
      // Priority: 1. Curated image -> 2. GitHub dynamic OpenGraph banner
      const ogBanner = `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`;
      const image = enhanced.image || ogBanner;

      return {
        id: repo.name,
        name: repo.name,
        title: enhanced.customTitle || formatTitle(repo.name),
        category: enhanced.category || inferred.category,
        categoryLabel: enhanced.categoryLabel || inferred.label,
        description: repo.description || enhanced.customDesc || `Proyek repositori open-source ${repo.name} yang dikembangkan dengan ${language}.`,
        detailedDesc: enhanced.customDesc || repo.description || `Repositori open-source publik ${repo.name} yang dikembangkan oleh Putra Raden Al Aziz di GitHub.`,
        features: enhanced.features || [
          `Bahasa pemrograman utama: ${language}`,
          `Default branch: ${repo.default_branch || 'main'}`,
          `Status repositori publik GitHub (${repo.visibility || 'public'})`,
          repo.homepage ? `Live deployment: ${repo.homepage}` : `Dapat di-clone via: git clone ${repo.clone_url || repo.html_url}`
        ],
        tech: techList,
        image,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language,
        languageColor,
        githubUrl: repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`,
        cloneUrl: repo.clone_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}.git`,
        liveUrl: repo.homepage || enhanced.homepage || null,
        updatedAt: formattedDate,
        rawUpdatedAt: repo.pushed_at || repo.updated_at,
        relativeTime: getRelativeTime(repo.pushed_at || repo.updated_at),
        isFork: repo.fork,
        isNew,
        isFeatured: enhanced.isFeatured !== undefined ? enhanced.isFeatured : isNew,
        topics: repo.topics || []
      };
    });

    // Merge with interactive showcase projects (like cybergame) if not already in repos
    const combinedRepos = [...processedRepos];
    LOCAL_SHOWCASE_PROJECTS.forEach((showcase) => {
      if (!combinedRepos.some(r => r.id === showcase.id)) {
        combinedRepos.push(showcase);
      }
    });

    const result = {
      profile: {
        username: GITHUB_USERNAME,
        name: userData?.name || 'Putra Raden Al Aziz',
        bio: userData?.bio || 'Siswa PPLG & Junior Web Developer',
        avatarUrl: userData?.avatar_url || 'https://avatars.githubusercontent.com/u/231167471?v=4',
        htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
        publicRepos: userData?.public_repos || rawRepos.length,
        followers: userData?.followers || 2,
        following: userData?.following || 2
      },
      repos: combinedRepos,
      totalRepos: rawRepos.length,
      connected: true,
      lastSynced: new Date().toISOString()
    };

    // Store in global cache
    globalThis.__github_repos_cache.data = result;
    globalThis.__github_repos_cache.lastFetched = now;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch live GitHub data:', error);

    // If cache existed from earlier, return stale cache instead of failure
    if (globalThis.__github_repos_cache.data) {
      return NextResponse.json({
        ...globalThis.__github_repos_cache.data,
        isStale: true
      });
    }

    // High quality fallback
    const fallbackRepos = Object.entries(ENHANCED_PROJECT_DATA).map(([repoName, meta]) => {
      const language = meta.tech[0] || 'JavaScript';
      return {
        id: repoName,
        name: repoName,
        title: meta.customTitle,
        category: meta.category,
        categoryLabel: meta.categoryLabel,
        description: meta.customDesc,
        detailedDesc: meta.customDesc,
        features: meta.features,
        tech: meta.tech,
        image: meta.image,
        stars: 0,
        forks: repoName === 'arsyavin' ? 1 : 0,
        language,
        languageColor: LANGUAGE_COLORS[language] || '#38bdf8',
        githubUrl: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
        cloneUrl: `https://github.com/${GITHUB_USERNAME}/${repoName}.git`,
        liveUrl: meta.homepage,
        updatedAt: 'Terbaru',
        relativeTime: 'Live Repo',
        rawUpdatedAt: new Date().toISOString(),
        isFork: false,
        isNew: false,
        isFeatured: meta.isFeatured,
        topics: []
      };
    });

    // Append local showcase
    LOCAL_SHOWCASE_PROJECTS.forEach((showcase) => {
      if (!fallbackRepos.some(r => r.id === showcase.id)) {
        fallbackRepos.push(showcase);
      }
    });

    return NextResponse.json({
      profile: {
        username: GITHUB_USERNAME,
        name: 'Putra Raden Al Aziz',
        bio: 'Siswa PPLG & Junior Web Developer',
        avatarUrl: 'https://avatars.githubusercontent.com/u/231167471?v=4',
        htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
        publicRepos: fallbackRepos.length,
        followers: 2,
        following: 2
      },
      repos: fallbackRepos,
      totalRepos: fallbackRepos.length,
      connected: true,
      isFallback: true,
      lastSynced: new Date().toISOString()
    });
  }
}
