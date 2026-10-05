import { NextResponse } from 'next/server';

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
  SCSS: '#c6538c'
};

// Rich metadata enhancement for 1dleraden's projects
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
    homepage: null
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
    homepage: 'https://techinf-wheat.vercel.app'
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
      'Buku tamu interaktif (Kritik & Saran) dengan penyimpanan data lokal'
    ],
    tech: ['Next.js 16', 'React 19', 'Canvas 2D', 'Web Audio API', 'Lucide Icons'],
    image: '/projects/devnexus.jpg',
    homepage: 'https://portopolio-wheat.vercel.app'
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
    homepage: 'https://felisha-birthday.vercel.app'
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
    homepage: null
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
    homepage: 'https://birthday-jade-gamma.vercel.app'
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
    homepage: null
  }
};

// In-memory cache
let cachedData = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function GET() {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedData && (now - lastCacheTime < CACHE_TTL_MS)) {
    return NextResponse.json(cachedData);
  }

  try {
    const headers = {
      'User-Agent': 'PutraRadenPortfolio/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Fetch user profile and repos in parallel
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 300 }
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`, {
        headers,
        next: { revalidate: 300 }
      })
    ]);

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const userData = userResponse.ok ? await userResponse.json() : null;
    const rawRepos = await reposResponse.json();

    if (!Array.isArray(rawRepos)) {
      throw new Error('Invalid repos response format');
    }

    const repos = rawRepos.map((repo) => {
      const enhanced = ENHANCED_PROJECT_DATA[repo.name] || {};
      const language = repo.language || (enhanced.tech && enhanced.tech[0]) || 'Code';
      const languageColor = LANGUAGE_COLORS[language] || '#94a3b8';

      // Format updated time
      const updatedAt = new Date(repo.updated_at);
      const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(updatedAt);

      return {
        id: repo.name,
        name: repo.name,
        title: enhanced.customTitle || repo.name,
        category: enhanced.category || 'web',
        categoryLabel: enhanced.categoryLabel || `${language} Project`,
        description: repo.description || enhanced.customDesc || 'Repositori proyek publik di GitHub.',
        detailedDesc: enhanced.customDesc || repo.description || 'Repositori open-source yang dikembangkan oleh Putra Raden Al Aziz.',
        features: enhanced.features || [
          `Bahasa pemrograman utama: ${language}`,
          `Branch utama: ${repo.default_branch || 'main'}`,
          `Status repositori publik di GitHub`,
          `Dapat di-clone dan dikembangkan lebih lanjut`
        ],
        tech: enhanced.tech || (language ? [language, 'Git', 'GitHub'] : ['Git', 'GitHub']),
        image: enhanced.image || '/projects/devnexus.jpg',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language,
        languageColor,
        githubUrl: repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`,
        liveUrl: repo.homepage || enhanced.homepage || null,
        updatedAt: formattedDate,
        rawUpdatedAt: repo.updated_at,
        isFork: repo.fork,
        topics: repo.topics || []
      };
    });

    const result = {
      profile: {
        username: GITHUB_USERNAME,
        name: userData?.name || 'Putra Raden Al Aziz',
        bio: userData?.bio || 'Siswa PPLG & Junior Web Developer',
        avatarUrl: userData?.avatar_url || 'https://avatars.githubusercontent.com/u/231167471?v=4',
        htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
        publicRepos: userData?.public_repos || repos.length,
        followers: userData?.followers || 2,
        following: userData?.following || 2
      },
      repos,
      totalRepos: repos.length,
      connected: true,
      lastSynced: new Date().toISOString()
    };

    cachedData = result;
    lastCacheTime = now;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch live GitHub data:', error);

    // Return high quality fallback built with known GitHub repos
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
        languageColor: LANGUAGE_COLORS[language] || '#94a3b8',
        githubUrl: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
        liveUrl: meta.homepage,
        updatedAt: 'Terbaru',
        rawUpdatedAt: new Date().toISOString(),
        isFork: false,
        topics: []
      };
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
