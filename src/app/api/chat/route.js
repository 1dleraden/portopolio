import { NextResponse } from 'next/server';

// Comprehensive Knowledge Base of Putra Raden Al Aziz (ajies)
const AJIES_KNOWLEDGE = {
  name: 'Putra Raden Al Aziz',
  nickname: 'ajies / Raden',
  role: 'Junior Web Developer & Game Development Enthusiast',
  school: 'SMK Negeri 1 Ciomas (Kabupaten Bogor)',
  major: 'PPLG (Pengembangan Perangkat Lunak dan Gim)',
  years: '2023 — Sekarang',
  location: 'Bogor, Jawa Barat, Indonesia (WIB / UTC+7)',
  email: 'putraradenn247@gmail.com',
  phone: '+62 838 7764 1571',
  githubUrl: 'https://github.com/1dleraden',
  instagram: '@1dleraden',
  portfolioUrl: 'https://portopolio-wheat.vercel.app',
  skills: {
    frontend: ['Next.js 16', 'React 19', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5', 'Modern CSS', 'Canvas 2D', 'Three.js'],
    backend: ['Laravel 12', 'PHP 8.2+', 'Node.js', 'Express', 'REST API', 'MySQL', 'MariaDB', 'SQLite'],
    game: ['Python', 'Pygame', 'Canvas 2D Physics', 'Game Loop Architecture'],
    tools: ['Git', 'GitHub', 'Docker', 'VS Code', 'Figma', 'Vercel']
  },
  projects: [
    {
      name: 'Sistem Informasi Perpustakaan SMKN 1 Ciomas (arsyavin)',
      stack: 'Laravel 12, PHP 8.2, MySQL, Tailwind CSS',
      desc: 'Aplikasi otomasi sirkulasi dan pengelolaan perpustakaan di SMKN 1 Ciomas. Fitur: Dashboard statistik, katalog buku CRUD, sirkulasi peminjaman siswa, denda otomatis Rp 1.000/hari saat telat, cetak slip peminjaman barcode resmi, dan suite 18 automated unit/feature tests.',
      url: 'https://github.com/1dleraden/arsyavin'
    },
    {
      name: 'TechInf — AI, Coding & Cyber Portal',
      stack: 'HTML5, Modern CSS, JavaScript, Vercel',
      desc: 'Media portal edukasi teknologi seputar revolusi Artificial Intelligence, tips programming, cybersecurity, dan game tech dengan tema cyber neon responsif.',
      url: 'https://github.com/1dleraden/techinf',
      live: 'https://techinf-wheat.vercel.app'
    },
    {
      name: 'Ajies Cyber Portfolio V2 (portopolio)',
      stack: 'Next.js 16, React 19, Canvas 2D, Three.js, Web Audio API',
      desc: 'Generasi baru portofolio personal dengan kartu 3D Lanyard interaktif, Canvas Starfield 2D, mini-game Cyber Dodge di dalam web, developer console terminal, dan sistem buku tamu.',
      url: 'https://github.com/1dleraden/portopolio',
      live: 'https://portopolio-wheat.vercel.app'
    },
    {
      name: 'Felisha Birthday (ultah)',
      stack: 'JavaScript, CSS3 Animations, Audio API, Vercel',
      desc: 'Website ucapan interaktif bertema neon glow romantis dengan audio background player, animasi partikel/konfeti, dan greeting countdown.',
      url: 'https://github.com/1dleraden/ultah',
      live: 'https://felisha-birthday.vercel.app'
    },
    {
      name: 'CRUD Admin Manajemen Siswa (crud-admin)',
      stack: 'PHP, MySQL, Bootstrap / SCSS, JavaScript',
      desc: 'Sistem administrasi database siswa dengan operasi CRUD komprehensif, filtering kelas cepat, dan struktur relasional MySQL.',
      url: 'https://github.com/1dleraden/crud-admin'
    },
    {
      name: 'Cyber Odyssey — 2D Neon Action Platformer',
      stack: 'JavaScript Canvas 2D, Game Physics',
      desc: 'Prototipe gim aksi berkecepatan 60 FPS dengan simulasi partikel cuaca neon dan collision physics, dapat dimainkan langsung di Game Arena portofolio ini.',
      url: '#game'
    }
  ],
  musicFavorites: ['Bruno Mars', 'Laufey', 'Dewa 19', 'Taylor Swift', 'Coldplay', 'Rex Orange County', 'wave to earth'],
  workStatus: 'Terbuka untuk kesempatan Magang/PKL, freelance proyek web development, kolaborasi open-source, dan konsultasi IT.'
};

// System Prompt for real LLM (Gemini)
const SYSTEM_PROMPT = `
Kamu adalah "Ajies AI", asisten kecerdasan buatan virtual resmi dari Putra Raden Al Aziz (nama panggilan: ajies atau Raden).
Tugasmu adalah menyapa pengunjung website portofolio dengan ramah, profesional, cerdas, dan antusias, serta menjawab segala pertanyaan mengenai Putra Raden Al Aziz secara akurat.

Berikut adalah informasi fakta lengkap mengenai Putra Raden Al Aziz:
- Nama Lengkap: Putra Raden Al Aziz (sering disapa "ajies" atau "Raden")
- Profesi / Peran: Junior Web Developer & Game Development Enthusiast
- Pendidikan: Siswa di SMK Negeri 1 Ciomas (Kabupaten Bogor), Jurusan PPLG (Pengembangan Perangkat Lunak dan Gim), Angkatan 2023–Sekarang.
- Lokasi: Bogor, Jawa Barat, Indonesia (WIB, UTC+7).
- Kontak:
  * Email: putraradenn247@gmail.com
  * WhatsApp / Telepon: +62 838 7764 1571
  * GitHub: https://github.com/1dleraden
  * Instagram: @1dleraden
  * Website Portofolio: https://portopolio-wheat.vercel.app
- Keahlian Teknis:
  * Frontend: Next.js 16, React 19, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, Canvas 2D, Three.js
  * Backend: Laravel 12, PHP 8.2+, Node.js, Express, REST APIs, MySQL, MariaDB
  * Game & Tools: Pygame, Python, Git & GitHub, Docker, VS Code, Figma, Vercel
- Proyek Unggulan di GitHub (@1dleraden):
  1. Sistem Informasi Perpustakaan SMKN 1 Ciomas (arsyavin): Dibuat dengan Laravel 12, PHP 8.2, MySQL, Tailwind CSS. Fitur otomasi sirkulasi buku, denda Rp 1.000/hari, slip peminjaman barcode, dan 18 automated unit/feature tests.
  2. TechInf (techinf): Portal edukasi informasi AI, Programming, Cyber Security & Gaming (Live: https://techinf-wheat.vercel.app).
  3. Ajies Cyber Portfolio V2 (portopolio): Portofolio Next.js 16 dengan 3D Lanyard, Starfield Canvas 2D, Mini-game terintegrasi, dan Buku Tamu.
  4. Felisha Birthday (ultah): Web ucapan interaktif bertema neon glow dengan pemutar musik (Live: https://felisha-birthday.vercel.app).
  5. CRUD Admin Siswa (crud-admin): Sistem manajemen data siswa berbasis PHP & MySQL.
  6. Cyber Odyssey: Game platformer/dodge 2D neon 60 FPS yang dapat dimainkan langsung di Game Arena web ini.
- Minat & Hobi: Musik (Bruno Mars, Laufey, Dewa 19), eksperimen fisika game 2D, coding front-end interaktif.
- Status Ketersediaan: Terbuka untuk magang (PKL), freelance pembuatan website modern, dan kolaborasi proyek.

Panduan Gaya Jawaban:
1. Bersikap ramah, sopan, antusias, dan percaya diri.
2. Gunakan Bahasa Indonesia yang luwes (bisa merespons bahasa Inggris jika pengguna bertanya dalam bahasa Inggris).
3. Gunakan markdown (bullet points, bolding, link format) agar jawaban rapi dan enak dibaca.
4. Jika ditanya kontak, berikan email (putraradenn247@gmail.com) dan WhatsApp (+62 838 7764 1571).
5. Jangan pernah mengarang informasi palsu yang bertentangan dengan data di atas.
`;

// Contextual Knowledge Fallback Engine
function generateAjiesAiResponse(userMessage) {
  const query = userMessage.toLowerCase().trim();

  // 1. Greetings
  if (/^(halo|hai|hi|hello|p|tes|test|hey|assalamualaikum|pagi|siang|sore|malam)/i.test(query)) {
    return {
      reply: `Halo! 👋 Selamat datang di portofolio **Putra Raden Al Aziz (ajies)**!\n\nSaya adalah **Ajies AI**, asisten virtual pribadi yang siap menjawab pertanyaan seputar profil, keahlian coding, proyek di GitHub, maupun cara menghubunginya.\n\nAda yang ingin Anda ketahui lebih lanjut?`,
      suggestions: [
        'Siapa Putra Raden Al Aziz?',
        'Apa saja proyek unggulan di GitHub?',
        'Teknologi apa saja yang dikuasai?',
        'Bagaimana cara menghubungi Ajies?'
      ]
    };
  }

  // 2. Who is Ajies / Biodata / Background
  if (/(siapa|profil|biodata|tentang|background|nama|about|tentang ajies|mengenal)/i.test(query)) {
    return {
      reply: `**Putra Raden Al Aziz** (biasa disapa **ajies** atau **Raden**) adalah seorang **Junior Web Developer & Game Development Enthusiast** asal Bogor, Jawa Barat, Indonesia 🇮🇩.\n\nSaat ini, ia menempuh pendidikan kejuruan di **SMK Negeri 1 Ciomas**, spesialisasi jurusan **PPLG (Pengembangan Perangkat Lunak dan Gim)**.\n\nIa berfokus pada pengembangan antarmuka web modern yang estetis, cepat, dan responsif (Next.js & React), serta arsitektur backend yang tangguh (Laravel, PHP, MySQL).`,
      suggestions: [
        'Di mana ia bersekolah?',
        'Apa saja proyek GitHub buatannya?',
        'Bagaimana cara menghubunginya?'
      ]
    };
  }

  // 3. School / Education
  if (/(sekolah|smk|ciomas|pendidikan|jurusan|pplg|kuliah|kelas|edukasi)/i.test(query)) {
    return {
      reply: `Putra Raden Al Aziz saat ini menempuh pendidikan di:\n\n🏫 **SMK Negeri 1 Ciomas** (Kabupaten Bogor, Jawa Barat)\n🎯 **Jurusan:** PPLG *(Pengembangan Perangkat Lunak dan Gim)*\n📅 **Periode:** 2023 — Sekarang\n\nFokus studi meliputi rekayasa perangkat lunak, algoritma pemrograman, perancangan basis data relasional, desain UI/UX modern, dan logika game development.`,
      suggestions: [
        'Proyek perpustakaan SMKN 1 Ciomas?',
        'Keahlian teknis apa saja yang dikuasai?',
        'Apakah ia terbuka untuk magang/PKL?'
      ]
    };
  }

  // 4. Projects / Karya / Portofolio / GitHub
  if (/(proyek|project|karya|portofolio|portfolio|github|repo|arsyavin|techinf|crud|ultah)/i.test(query)) {
    return {
      reply: `Berikut beberapa proyek unggulan nyata yang telah dikembangkan oleh Putra Raden dan terhubung langsung ke GitHub **[@1dleraden](https://github.com/1dleraden)**:\n\n` +
        `1. 📚 **[Sistem Informasi Perpustakaan SMKN 1 Ciomas (arsyavin)](https://github.com/1dleraden/arsyavin)**\n` +
        `   * **Stack:** Laravel 12, PHP 8.2, MySQL, Tailwind CSS\n` +
        `   * Otomasi sirkulasi buku, denda otomatis Rp 1.000/hari, cetak slip peminjaman barcode, dan 18 *automated unit tests*.\n\n` +
        `2. 🌐 **[TechInf — AI & Coding Portal](https://github.com/1dleraden/techinf)**\n` +
        `   * **Stack:** HTML5, Modern CSS, JavaScript, Vercel\n` +
        `   * Media edukasi IT bertema cyber seputar AI, cybersecurity, dan game tech. *(Live: [techinf-wheat.vercel.app](https://techinf-wheat.vercel.app))*\n\n` +
        `3. ⚡ **[Ajies Cyber Portfolio V2](https://github.com/1dleraden/portopolio)**\n` +
        `   * **Stack:** Next.js 16, React 19, Canvas 2D, Three.js, Web Audio API\n` +
        `   * Dilengkapi 3D Lanyard Card, Canvas Starfield 2D, Mini-Game, dan Asisten AI.\n\n` +
        `4. 🎂 **[Felisha Birthday](https://github.com/1dleraden/ultah)**\n` +
        `   * Web ucapan interaktif bertema neon glow dengan pemutar audio dan animasi konfeti. *(Live: [felisha-birthday.vercel.app](https://felisha-birthday.vercel.app))*\n\n` +
        `5. 🗄️ **[Sistem CRUD Admin Siswa](https://github.com/1dleraden/crud-admin)**\n` +
        `   * Manajemen database siswa terintegrasi berbasis PHP & MySQL.\n\n` +
        `6. 🎮 **Cyber Odyssey (Game Arena)**\n` +
        `   * Gim aksi neon 2D yang dapat Anda mainkan langsung di halaman ini pada bagian Game Arena!`,
      suggestions: [
        'Ceritakan lebih detail proyek perpustakaan Laravel!',
        'Teknologi apa saja yang dikuasai?',
        'Bagaimana cara menghubunginya?'
      ]
    };
  }

  // 5. Skills / Technologies / Stack
  if (/(skill|keahlian|teknologi|tech|stack|bahasa|tools|kemampuan|bisa apa)/i.test(query)) {
    return {
      reply: `Keahlian dan persenjataan teknologi yang dikuasai oleh Putra Raden meliputi:\n\n` +
        `💻 **Frontend Development:**\n` +
        `* Next.js 16 & React 19 (App Router, Server Actions)\n` +
        `* JavaScript Modern (ES6+), HTML5 Semantik, CSS3\n` +
        `* Tailwind CSS & Vanilla CSS untuk dynamic animation\n` +
        `* Interactive Canvas 2D & Three.js 3D\n\n` +
        `⚙️ **Backend & Database:**\n` +
        `* Laravel 12 & PHP 8.2+\n` +
        `* Node.js & RESTful APIs\n` +
        `* MySQL, MariaDB, Database Normalization\n\n` +
        `🎮 **Game Prototyping & Tools:**\n` +
        `* Python & Pygame (Game loop, physics & collision)\n` +
        `* Git & GitHub Version Control\n` +
        `* Docker, VS Code, Figma, Vercel`,
      suggestions: [
        'Apa saja proyek buatannya?',
        'Apakah ia bisa membuat website custom?',
        'Kontak yang bisa dihubungi?'
      ]
    };
  }

  // 6. Contact / Hire / Freelance / Magang (PKL) / WhatsApp / Email
  if (/(kontak|contact|hubungi|email|wa|whatsapp|telepon|hp|hire|rekrut|magang|pkl|jasa|freelance|kerja sama|collab)/i.test(query)) {
    return {
      reply: `Putra Raden Al Aziz **sangat terbuka** untuk kesempatan **Magang / PKL**, proyek **Freelance Web Development**, dan kolaborasi tim!\n\nAnda dapat menghubunginya langsung melalui saluran berikut:\n\n` +
        `✉️ **Email:** [putraradenn247@gmail.com](mailto:putraradenn247@gmail.com)\n` +
        `📱 **WhatsApp:** [+62 838 7764 1571](https://wa.me/6283877641571)\n` +
        `🌐 **GitHub:** [github.com/1dleraden](https://github.com/1dleraden)\n` +
        `📸 **Instagram:** [@1dleraden](https://instagram.com/1dleraden)\n` +
        `📍 **Lokasi:** Bogor, Jawa Barat, Indonesia (Siap remote maupun onsite di area Bogor & sekitarnya).\n\nJangan ragu untuk menyapa atau mendiskusikan ide proyek Anda!`,
      suggestions: [
        'Berapa lama pengalaman codingnya?',
        'Bisa lihat proyek Laravel dan Next.js?',
        'Siapa Putra Raden Al Aziz?'
      ]
    };
  }

  // 7. Music / Favorite Artists / Dewa 19 / Bruno Mars / Laufey
  if (/(musik|lagu|artist|favorit|bruno mars|laufey|dewa 19|taylor swift|coldplay|play)/i.test(query)) {
    return {
      reply: `Ajies sangat menikmati mendengarkan musik saat koding untuk menjaga fokus dan kreativitas! 🎧\n\nBeberapa musisi favoritnya meliputi:\n* **Bruno Mars** *(That's What I Like, Grenade)*\n* **Laufey** *(From The Start, Valentine, Promise)*\n* **Dewa 19** *(Laskar Cinta, Kangen)*\n* **Taylor Swift** *(Cruel Summer, Lover)*\n* **Coldplay**, **Rex Orange County**, & **wave to earth**\n\nAnda juga bisa menikmati pemutar musik mini yang ada di pojok kiri bawah website ini untuk mendengarkan lagu sambil melihat portofolio!`,
      suggestions: [
        'Fitur apa saja di website portofolio ini?',
        'Apa proyek terbaru di GitHub?',
        'Bagaimana cara menghubungi Ajies?'
      ]
    };
  }

  // 8. Website Features / Easter Eggs
  if (/(fitur|website|web ini|game|lanyard|console|terminal|buku tamu)/i.test(query)) {
    return {
      reply: `Website portofolio ini dibangun dengan Next.js 16 dan memiliki banyak fitur interaktif menarik:\n\n` +
        `* 🪪 **3D Lanyard ID Card:** Kartu identitas interaktif yang bereaksi terhadap kursor.\n` +
        `* ✨ **Interactive Starfield Canvas:** Latar bintang bergerak dinamis 60 FPS.\n` +
        `* 🎮 **Game Arena (Cyber Dodge):** Mini-game playable langsung di dalam web!\n` +
        `* 🎵 **Integrated Music Player:** Pemutar audio latar dengan visualisator spektrum.\n` +
        `* 💻 **Developer Console CLI:** Terminal interaktif (tekan \`Ctrl + K\` atau \`Ctrl + \`\`\`)\n` +
        `* 📝 **Buku Tamu Real-time:** Pengunjung dapat memberikan pesan apresiasi, kritik, atau saran.\n` +
        `* 🤖 **Ajies AI:** Asisten virtual yang sedang Anda ajak bicara sekarang!`,
      suggestions: [
        'Mainkan mini game di website',
        'Lihat proyek unggulan di GitHub',
        'Hubungi Putra Raden'
      ]
    };
  }

  // 9. Location / Bogor
  if (/(lokasi|tinggal|bogor|asal|domisili|tempat)/i.test(query)) {
    return {
      reply: `Putra Raden Al Aziz berdomisili di **Kota Hujan, Bogor, Jawa Barat, Indonesia** 🌧️.\n\nIa terbuka untuk kolaborasi kerja jarak jauh (*remote work*) ke seluruh Indonesia maupun pekerjaan onsite di wilayah Jabodetabek (khususnya Bogor).`,
      suggestions: [
        'Hubungi Ajies lewat WhatsApp',
        'Keahlian teknis apa saja yang dimiliki?',
        'Lihat proyek di GitHub'
      ]
    };
  }

  // 10. Default / Fallback intelligent response
  return {
    reply: `Terima kasih atas pertanyaannya! Mengenai hal tersebut, **Putra Raden Al Aziz (ajies)** adalah Junior Web Developer asal Bogor dan siswa PPLG di SMKN 1 Ciomas yang berfokus pada ekosistem **Next.js, React, Laravel, PHP, dan MySQL**.\n\nUntuk informasi lebih spesifik, Anda bisa bertanya mengenai:\n* 👨‍💻 **Biodata & Latar Belakang**\n* 💻 **Proyek Nyata di GitHub ([@1dleraden](https://github.com/1dleraden))**\n* 🛠️ **Penguasaan Teknologi & Tools**\n* 📬 **Kontak Langsung & Ketersediaan Magang/Freelance**\n\nAtau hubungi langsung melalui WhatsApp di [+62 838 7764 1571](https://wa.me/6283877641571) atau email [putraradenn247@gmail.com](mailto:putraradenn247@gmail.com).`,
    suggestions: [
      'Siapa Putra Raden Al Aziz?',
      'Apa saja proyek di GitHub miliknya?',
      'Teknologi apa saja yang dikuasai?',
      'Bagaimana cara menghubungi Ajies?'
    ]
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1];
    const userPrompt = lastUserMessage?.content || '';

    // Check if GEMINI_API_KEY is available for real LLM inference
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        // Convert chat history to Gemini format
        const contents = [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\nPertanyaan Pengunjung: ${userPrompt}` }]
          }
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({
              reply: candidateText,
              source: 'gemini',
              suggestions: [
                'Apa proyek Laravel unggulannya?',
                'Keahlian teknis apa saja?',
                'Bagaimana cara menghubungi Ajies?'
              ]
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiError);
      }
    }

    // Built-in Contextual Knowledge Fallback Engine (Runs instantly, 100% reliable)
    const localResult = generateAjiesAiResponse(userPrompt);

    return NextResponse.json({
      reply: localResult.reply,
      suggestions: localResult.suggestions,
      source: 'local-engine'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        reply: 'Maaf, terjadi kesalahan teknis sementara. Anda bisa menghubungi Putra Raden langsung melalui WhatsApp di +62 838 7764 1571 atau email putraradenn247@gmail.com.',
        suggestions: ['Siapa Putra Raden?', 'Proyek GitHub?', 'Kontak Ajies']
      },
      { status: 500 }
    );
  }
}
