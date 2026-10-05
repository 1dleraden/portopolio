'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music, 
  Disc, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Radio,
  Flame,
  Star,
  Maximize2
} from 'lucide-react';
import TopArtistsModal from './TopArtistsModal';
import { topArtists } from '@/data/artistsData';

const VISUALIZER_BARS = [
  { max: 14, dur: 0.62, delay: 0.05 },
  { max: 22, dur: 0.74, delay: 0.18 },
  { max: 12, dur: 0.54, delay: 0.32 },
  { max: 26, dur: 0.85, delay: 0.08 },
  { max: 18, dur: 0.66, delay: 0.22 },
  { max: 25, dur: 0.78, delay: 0.14 },
  { max: 15, dur: 0.56, delay: 0.28 },
  { max: 27, dur: 0.88, delay: 0.02 },
  { max: 19, dur: 0.68, delay: 0.25 },
  { max: 13, dur: 0.52, delay: 0.12 },
  { max: 24, dur: 0.76, delay: 0.30 },
  { max: 16, dur: 0.60, delay: 0.16 },
  { max: 23, dur: 0.72, delay: 0.06 },
  { max: 15, dur: 0.58, delay: 0.24 },
  { max: 12, dur: 0.50, delay: 0.10 }
];

export default function MusicPlayer({ autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [playerTab, setPlayerTab] = useState('player'); // 'player' | 'artists'
  const [selectedArtistId, setSelectedArtistId] = useState('taylor-swift');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(317); // 5:17 for Dewa 19 - Laskar Cinta

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const stepRef = useRef(0);
  const hasMountedRef = useRef(false);
  const closeTimeoutRef = useRef(null);
  const playerRootRef = useRef(null);

  // Smooth open / close handlers with exit animations
  const handleOpen = (tab = null) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (tab) setPlayerTab(tab);
    setIsClosing(false);
    setIsExpanded(true);
  };

  const handleClose = () => {
    if (!isExpanded || isClosing) return;
    setIsClosing(true);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 260); // 260ms matches exit animation duration
  };

  const handleToggleExpand = () => {
    if (isExpanded && !isClosing) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Close player when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isExpanded &&
        !isClosing &&
        playerRootRef.current &&
        !playerRootRef.current.contains(e.target)
      ) {
        if (e.target.closest && (e.target.closest('.top-artists-modal-overlay') || e.target.closest('.modal-glass-card'))) {
          return;
        }
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded && !isClosing && !modalOpen) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, isClosing, modalOpen]);

  // Global listener to open Top Artists modal from anywhere on page
  useEffect(() => {
    const handleOpenArtists = () => {
      setModalOpen(true);
    };
    window.addEventListener('open-top-artists', handleOpenArtists);
    return () => window.removeEventListener('open-top-artists', handleOpenArtists);
  }, []);


  const playlist = [
    {
      id: 1,
      title: 'Laskar Cinta',
      artist: 'Dewa 19',
      album: 'Republik Cinta',
      cover: '/artists/dewa19.jpg',
      src: '/music/laskar-cinta.mp3',
      genre: 'Pop Rock Indonesia • New Version',
      duration: '5:17',
      isAudioFile: true
    },
    {
      id: 2,
      title: "That's What I Like",
      artist: 'Bruno Mars',
      album: '24K Magic',
      cover: '/artists/bruno-mars.jpg',
      src: '/music/thats-what-i-like.mp3',
      genre: 'Funk • R&B • 24K Magic',
      duration: '3:26',
      isAudioFile: true
    },
    {
      id: 3,
      title: 'Please Me',
      artist: 'Cardi B & Bruno Mars',
      album: 'Single',
      cover: '/artists/bruno-mars.jpg',
      src: '/music/please-me.mp3',
      genre: 'Sensual 90s R&B',
      duration: '3:20',
      isAudioFile: true
    },
    {
      id: 4,
      title: 'Just the Way You Are',
      artist: 'Bruno Mars',
      album: 'Doo-Wops & Hooligans',
      cover: '/artists/bruno-mars.jpg',
      src: '/music/just-the-way-you-are.mp3',
      genre: 'Pop Ballad • Timeless Classic',
      duration: '3:40',
      isAudioFile: true
    },
    {
      id: 5,
      title: 'Runaway Baby',
      artist: 'Bruno Mars',
      album: 'Doo-Wops & Hooligans',
      cover: '/artists/bruno-mars.jpg',
      src: '/music/runaway-baby.mp3',
      genre: 'High-Octane Funk Rock',
      duration: '2:27',
      isAudioFile: true
    },
    {
      id: 6,
      title: 'Too Good to Say Goodbye',
      artist: 'Bruno Mars',
      album: '24K Magic',
      cover: '/artists/bruno-mars.jpg',
      src: '/music/too-good-to-say-goodbye.mp3',
      genre: 'Retro Soul Ballad',
      duration: '4:49',
      isAudioFile: true
    },
    {
      id: 7,
      title: 'exile',
      artist: 'Taylor Swift feat. Bon Iver',
      album: 'folklore',
      cover: '/artists/taylor-swift.png',
      src: '/music/exile.mp3',
      genre: 'Indie Alternative • Folk-Pop',
      duration: '4:45',
      isAudioFile: true
    },
    {
      id: 8,
      title: 'august',
      artist: 'Taylor Swift',
      album: 'folklore',
      cover: '/artists/taylor-swift.png',
      src: '/music/august.mp3',
      genre: 'Dream Pop • Summer Breeze',
      duration: '4:21',
      isAudioFile: true
    },
    {
      id: 9,
      title: 'cardigan',
      artist: 'Taylor Swift',
      album: 'folklore',
      cover: '/artists/taylor-swift.png',
      src: '/music/cardigan.mp3',
      genre: 'Indie Folk Magic',
      duration: '3:59',
      isAudioFile: true
    },
    {
      id: 10,
      title: 'so long, london',
      artist: 'Taylor Swift',
      album: 'TTPD',
      cover: '/artists/taylor-swift.png',
      src: '/music/so-long-london.mp3',
      genre: 'Synth-Pop • Poetic Farewell',
      duration: '3:47',
      isAudioFile: true
    },
    {
      id: 11,
      title: 'Guilty as Sin?',
      artist: 'Taylor Swift',
      album: 'TTPD',
      cover: '/artists/taylor-swift.png',
      src: '/music/guilty-as-sin.mp3',
      genre: '90s Alt-Rock • Dream Pop',
      duration: '4:14',
      isAudioFile: true
    }
  ];

  const [activeTrack, setActiveTrack] = useState(playlist[0]);
  const currentTrack = activeTrack;
  const selectedArtist = topArtists.find(a => a.id === selectedArtistId) || topArtists[0];

  // Artist specific chord progressions for procedural preview
  const getArtistChords = (artistId) => {
    switch (artistId) {
      case 'taylor-swift':
        return [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [196.00, 246.94, 293.66, 392.00], // G
          [220.00, 261.63, 329.63, 440.00], // Am7
          [174.61, 220.00, 261.63, 349.23]  // Fmaj7
        ];
      case 'dewa-19':
        return [
          [146.83, 220.00, 293.66, 369.99], // Dm
          [116.54, 174.61, 233.08, 293.66], // Bb
          [174.61, 220.00, 261.63, 349.23], // F
          [130.81, 196.00, 261.63, 329.63]  // C
        ];
      case 'bruno-mars':
        return [
          [155.56, 196.00, 233.08, 293.66], // Ebmaj7
          [146.83, 174.61, 220.00, 261.63], // Dm7
          [196.00, 233.08, 293.66, 349.23], // Gm7
          [130.81, 164.81, 196.00, 246.94]  // Cm7
        ];
      case 'laufey':
        return [
          [146.83, 220.00, 261.63, 329.63], // Dm9
          [196.00, 246.94, 329.63, 392.00], // G13
          [130.81, 196.00, 246.94, 329.63], // Cmaj9
          [110.00, 164.81, 220.00, 277.18]  // A7
        ];
      default:
        return [
          [220.00, 261.63, 329.63, 392.00],
          [174.61, 220.00, 261.63, 329.63],
          [261.63, 329.63, 392.00, 493.88],
          [196.00, 246.94, 293.66, 349.23]
        ];
    }
  };

  const getArtistBpm = (artistId) => {
    switch (artistId) {
      case 'bruno-mars': return 104;
      case 'dewa-19': return 84;
      case 'taylor-swift': return 76;
      case 'laufey': return 92;
      default: return 80;
    }
  };

  // Procedural synthesizer step player
  const playSynthStepCustom = (step, track) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    const chords = (track && track.chords) || currentTrack.chords;
    if (!chords || chords.length === 0) return;

    const chordIndex = Math.floor(step / 4) % chords.length;
    const chord = chords[chordIndex];
    const beatInChord = step % 4;

    if (beatInChord === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(chord[0] / 2, ctx.currentTime);
      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(isMuted ? 0 : (volume * 0.05) / (idx + 1), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + 1.2);
    });
  };

  // Instant Play function for any song clicked
  const playSong = (song, artist = null) => {
    // 1. Stop any currently active audio / synth immediately
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }

    const artistObj = artist || (typeof song.artist === 'string' ? topArtists.find(a => song.artist.toLowerCase().includes(a.name.toLowerCase())) : null) || topArtists.find(a => a.id === selectedArtistId) || topArtists[0];
    const audioSrc = song.src || (song.title === 'Laskar Cinta' ? '/music/laskar-cinta.mp3' : null);

    if (song.duration && typeof song.duration === 'string' && song.duration.includes(':')) {
      const parts = song.duration.split(':');
      const totalSecs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      if (!isNaN(totalSecs) && totalSecs > 0) {
        setDuration(totalSecs);
      }
    }

    const newTrack = {
      id: song.id || `song-${artistObj.id}-${song.rank || song.title}`,
      title: song.title,
      artist: song.artist || (artistObj ? artistObj.name + (song.feat ? ` ${song.feat}` : '') : 'Artist'),
      album: song.album || 'Featured Hits',
      cover: song.cover || artistObj?.photo || artistObj?.cover || '/artists/dewa19.jpg',
      src: audioSrc,
      genre: song.genre || artistObj?.genre || 'Pop / Rock',
      isAudioFile: Boolean(audioSrc),
      duration: song.duration || '3:30',
      vibe: song.vibe || '',
      chords: getArtistChords(artistObj.id),
      bpm: getArtistBpm(artistObj.id)
    };

    const foundIdx = playlist.findIndex(p => p.title.toLowerCase() === song.title.toLowerCase());
    if (foundIdx !== -1) {
      setCurrentTrackIndex(foundIdx);
    }

    setActiveTrack(newTrack);
    setPlaybackTime(0);
    stepRef.current = 0;

    if (newTrack.isAudioFile) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = newTrack.src;
        audio.currentTime = 0;
        audio.volume = isMuted ? 0 : volume;
        audio.muted = isMuted;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              audio.load();
              audio.play().then(() => setIsPlaying(true)).catch(() => {});
            });
        }
      }
    } else {
      // Procedural synthesizer preview with actual audio notes
      try {
        if (!audioCtxRef.current) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      } catch (e) {}

      setIsPlaying(true);
      const stepInterval = (60 / (newTrack.bpm || 80)) * 1000 * 0.5;
      playSynthStepCustom(0, newTrack);
      stepRef.current = 1;

      synthTimerRef.current = setInterval(() => {
        playSynthStepCustom(stepRef.current, newTrack);
        stepRef.current++;
        setPlaybackTime((prev) => (prev + 1) % 150);
      }, stepInterval);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (currentTrack.isAudioFile) {
      if (!audio) return;

      if (!audio.paused && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.volume = isMuted ? 0 : volume;
        audio.muted = isMuted;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn('Playback gesture error, reloading source:', err);
              audio.load();
              audio.play().then(() => setIsPlaying(true)).catch((e) => console.error(e));
            });
        }
      }
    } else {
      // Synth tracks
      if (isPlaying) {
        setIsPlaying(false);
        if (synthTimerRef.current) {
          clearInterval(synthTimerRef.current);
          synthTimerRef.current = null;
        }
      } else {
        try {
          if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
          }
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
          }
        } catch (e) {}

        setIsPlaying(true);
        const stepInterval = (60 / (currentTrack.bpm || 80)) * 1000 * 0.5;
        if (synthTimerRef.current) clearInterval(synthTimerRef.current);

        synthTimerRef.current = setInterval(() => {
          playSynthStepCustom(stepRef.current, currentTrack);
          stepRef.current++;
          setPlaybackTime((prev) => (prev + 1) % 150);
        }, stepInterval);
      }
    }
  };

  const nextTrack = () => {
    if (audioRef.current) audioRef.current.pause();
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    setIsPlaying(false);

    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    playSong(playlist[nextIdx]);
  };

  const prevTrack = () => {
    if (audioRef.current) audioRef.current.pause();
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    setIsPlaying(false);

    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    playSong(playlist[prevIdx]);
  };

  // Volume synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Direct play trigger method returning a promise
  const playTrackDirectly = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.isAudioFile) return Promise.reject(new Error('Audio not ready'));

    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      return playPromise
        .then(() => {
          setIsPlaying(true);
          return true;
        })
        .catch((err) => {
          console.warn('Browser autoplay policy prevented instant audio, attaching gesture trigger:', err);
          const playOnGesture = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
          };
          window.addEventListener('click', playOnGesture, { once: true, passive: true });
          window.addEventListener('keydown', playOnGesture, { once: true, passive: true });
          window.addEventListener('touchstart', playOnGesture, { once: true, passive: true });
          window.addEventListener('pointerdown', playOnGesture, { once: true, passive: true });
          throw err;
        });
    }
    return Promise.resolve(true);
  };

  // Expose play function to window for immediate synchronization with Preloader
  useEffect(() => {
    window.playPortfolioMusic = playTrackDirectly;
    const handleCustomTrigger = () => {
      playTrackDirectly().catch(() => {});
    };
    window.addEventListener('portfolio-play-music', handleCustomTrigger);
    return () => {
      delete window.playPortfolioMusic;
      window.removeEventListener('portfolio-play-music', handleCustomTrigger);
    };
  }, [currentTrack, isMuted, volume]);

  // Autoplay Laskar Cinta as soon as loading is finished
  useEffect(() => {
    if (autoPlay) {
      playTrackDirectly().catch(() => {});
    }
  }, [autoPlay]);

  // Seeking through progress bar
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const targetRatio = Math.max(0, Math.min(1, clickX / width));

    if (currentTrack.isAudioFile && audioRef.current && duration > 0) {
      const targetTime = targetRatio * duration;
      audioRef.current.currentTime = targetTime;
      setPlaybackTime(targetTime);
    } else {
      setPlaybackTime(targetRatio * 150);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={playerRootRef}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 90,
        fontFamily: 'var(--font-body)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="music-player-root"
    >
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        src={currentTrack.isAudioFile ? currentTrack.src : undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onPlaying={() => setIsPlaying(true)}
        onTimeUpdate={(e) => {
          setPlaybackTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => {
          if (e.currentTarget.duration) {
            setDuration(e.currentTarget.duration);
          }
        }}
        onEnded={() => {
          nextTrack();
        }}
      />

      {/* Expanded Music Player Card with Open & Close Animation */}
      {(isExpanded || isClosing) && (
        <div
          data-lenis-prevent
          className={`glass-card music-expanded-card custom-player-scrollbar ${isClosing ? 'player-card-closing' : 'player-card-opening'}`}
          style={{
            width: playerTab === 'artists' ? '360px' : '330px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: '1.25rem',
            marginBottom: '10px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(10, 10, 13, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.05)',
            transformOrigin: 'bottom left',
            pointerEvents: isClosing ? 'none' : 'auto',
            transition: 'width 0.2s ease'
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Header of expanded player */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Radio size={14} color="#10b981" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff', letterSpacing: '0.1em' }}>
                AJIES FM • LIVE AUDIO
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 600
                }}
                title="Buka Showcase Top Artist Lengkap"
              >
                <Maximize2 size={12} />
                <span>Showcase</span>
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  padding: 0,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title="Kecilkan / Tutup Pemutar"
                aria-label="Tutup Pemutar"
              >
                <ChevronDown size={17} />
              </button>
            </div>
          </div>

          {/* Dual Tab Selector: Now Playing vs Top Artist */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <button
              onClick={() => setPlayerTab('player')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '8px',
                border: 'none',
                background: playerTab === 'player' ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                color: playerTab === 'player' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: playerTab === 'player' ? 700 : 500,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s'
              }}
            >
              <Music size={13} />
              <span>Now Playing</span>
            </button>
            <button
              onClick={() => setPlayerTab('artists')}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                borderRadius: '8px',
                background: playerTab === 'artists' ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.3), rgba(251, 113, 133, 0.2))' : 'transparent',
                color: playerTab === 'artists' ? '#fb7185' : 'var(--text-muted)',
                fontWeight: playerTab === 'artists' ? 700 : 500,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s',
                border: playerTab === 'artists' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid transparent'
              }}
            >
              <Star size={13} fill={playerTab === 'artists' ? '#fb7185' : 'none'} />
              <span>Top Artist</span>
            </button>
          </div>

          {playerTab === 'player' ? (
            /* TAB 1: NOW PLAYING CONTROLS */
            <>
              {/* Track Display with spinning disk / album cover - Clickable to instantly Play */}
              <div
                onClick={togglePlay}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.45rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={isPlaying ? 'Klik untuk Jeda Musik' : 'Klik untuk Putar Musik'}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #18181b, #27272a)',
                    border: isPlaying ? '2px solid #22d3ee' : '2px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    animation: isPlaying ? 'spinSlow 5s linear infinite' : 'none',
                    boxShadow: isPlaying ? '0 0 25px rgba(34, 211, 238, 0.35)' : 'none',
                    flexShrink: 0
                  }}
                >
                  {currentTrack.cover ? (
                    <>
                      <img
                        src={currentTrack.cover}
                        alt={currentTrack.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: '#000000',
                          border: '2px solid #ffffff'
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Disc size={30} color="#ffffff" />
                      <div
                        style={{
                          position: 'absolute',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#000000',
                          border: '2px solid #ffffff'
                        }}
                      />
                    </>
                  )}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {currentTrack.title}
                    </h4>
                    {currentTrack.id === 1 && (
                      <span title="Lagu Spesial Dewa 19" style={{ display: 'flex' }}>
                        <Flame size={14} color="#f59e0b" />
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    {currentTrack.artist} {currentTrack.album ? `• ${currentTrack.album}` : ''}
                  </p>
                  <span className="badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                    {currentTrack.genre}
                  </span>
                </div>
              </div>

              {/* Animated visualizer spectrum bars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '3.5px',
                  height: '28px',
                  marginBottom: '1.1rem'
                }}
                title={isPlaying ? 'Visualizer Aktif' : 'Visualizer Jeda'}
              >
                {VISUALIZER_BARS.map((bar, i) => (
                  <div
                    key={i}
                    className={isPlaying ? 'eq-bar-playing' : 'eq-bar-paused'}
                    style={{
                      width: '3.5px',
                      borderRadius: '9999px',
                      '--target-height': `${bar.max}px`,
                      '--anim-dur': `${bar.dur}s`,
                      '--anim-delay': `${bar.delay}s`
                    }}
                  />
                ))}
              </div>

              {/* Seekable Progress bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  onClick={handleSeek}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    marginBottom: '0.4rem',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  title="Klik untuk melompat menit"
                >
                  <div
                    style={{
                      width: `${duration > 0 ? (playbackTime / duration) * 100 : 0}%`,
                      height: '100%',
                      background: '#ffffff',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>{formatTime(playbackTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Transport Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <button
                  onClick={prevTrack}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                  title="Track Sebelumnya"
                >
                  <SkipBack size={20} />
                </button>

                <button
                  onClick={togglePlay}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: 'none',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)',
                    transition: 'transform 0.15s'
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={24} fill="#000" /> : <Play size={24} fill="#000" style={{ marginLeft: '3px' }} />}
                </button>

                <button
                  onClick={nextTrack}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                  title="Track Selanjutnya"
                >
                  <SkipForward size={20} />
                </button>
              </div>

              {/* Volume Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  style={{
                    flexGrow: 1,
                    accentColor: '#ffffff',
                    height: '4px',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </>
          ) : (
            /* TAB 2: TOP ARTISTS & FAVORITE SONGS */
            <div>
              {/* Horizontal Artist Avatars Row */}
              <div
                data-lenis-prevent
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.85rem',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'none',
                  overscrollBehavior: 'contain'
                }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {topArtists.map((artist) => {
                  const isSel = selectedArtistId === artist.id;
                  return (
                    <button
                      key={artist.id}
                      onClick={() => setSelectedArtistId(artist.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.55rem',
                        borderRadius: '12px',
                        background: isSel ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSel ? `1.5px solid ${artist.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        minWidth: '72px',
                        flexShrink: 0,
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: isSel ? `2px solid ${artist.accentColor}` : '1px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: isSel ? `0 0 14px ${artist.color}70` : 'none',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={artist.photo}
                          alt={artist.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: isSel ? 800 : 500,
                          color: isSel ? '#ffffff' : '#a1a1aa',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {artist.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Artist Banner */}
              <div
                style={{
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${selectedArtist.color}18, rgba(255, 255, 255, 0.02))`,
                  border: `1px solid ${selectedArtist.accentColor}35`,
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `1.5px solid ${selectedArtist.accentColor}`,
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={selectedArtist.photo}
                      alt={selectedArtist.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                        {selectedArtist.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          color: selectedArtist.accentColor,
                          background: `${selectedArtist.color}25`,
                          padding: '0.1rem 0.35rem',
                          borderRadius: '9999px',
                          border: `1px solid ${selectedArtist.color}40`,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {selectedArtist.badge.split(' ')[0]}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Top 5 Lagu Favorit
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '0.3rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    flexShrink: 0
                  }}
                  title="Lihat profil artist dan lirik lagu"
                >
                  <Maximize2 size={10} />
                  <span>Detail</span>
                </button>
              </div>

              {/* List of 5 Favorite Songs */}
              <div
                data-lenis-prevent
                className="custom-player-scrollbar"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  maxHeight: '235px',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  paddingRight: '6px',
                  WebkitOverflowScrolling: 'touch'
                }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {selectedArtist.topSongs.map((song) => {
                  const isCurrentPlaying = currentTrack.title === song.title && isPlaying;
                  return (
                    <div
                      key={song.rank}
                      onClick={() => isCurrentPlaying ? togglePlay() : playSong(song, selectedArtist)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '10px',
                        background: isCurrentPlaying ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isCurrentPlaying ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrentPlaying) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.borderColor = `${selectedArtist.accentColor}50`;
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrentPlaying) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                      title={isCurrentPlaying ? `Klik untuk jeda ${song.title}` : `Klik untuk putar ${song.title}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: isCurrentPlaying ? '#22d3ee' : (song.rank === 1 ? `linear-gradient(135deg, ${selectedArtist.color}, ${selectedArtist.accentColor})` : 'rgba(255, 255, 255, 0.08)'),
                            color: isCurrentPlaying ? '#000000' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            flexShrink: 0
                          }}
                        >
                          {isCurrentPlaying ? <Volume2 size={12} /> : `0${song.rank}`}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCurrentPlaying ? '#22d3ee' : '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {song.title}
                            </span>
                            {song.feat && (
                              <span style={{ fontSize: '0.65rem', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                                {song.feat}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {song.album} ({song.year})
                            </span>
                            {song.playable && (
                              <span style={{ fontSize: '0.55rem', padding: '0.05rem 0.3rem', borderRadius: '3px', background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                HQ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrentPlaying) {
                              togglePlay();
                            } else {
                              playSong(song, selectedArtist);
                            }
                          }}
                          style={{
                            background: isCurrentPlaying ? '#22d3ee' : 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: isCurrentPlaying ? '#000000' : '#ffffff',
                            borderRadius: '9999px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'all 0.15s'
                          }}
                          title={isCurrentPlaying ? 'Jeda Lagu' : `Putar ${song.title}`}
                        >
                          {isCurrentPlaying ? <Pause size={9} fill="#000" /> : <Play size={9} fill={isCurrentPlaying ? '#000' : '#fff'} />}
                          <span>{isCurrentPlaying ? 'Pause' : 'Putar'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom modal launcher */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '0.45rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
                >
                  <Sparkles size={12} color="#fb7185" />
                  <span>Buka Showcase Semua Artis & Lirik</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Minimized Docked Pill Button */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.55rem 0.95rem',
          borderRadius: '9999px',
          background: 'rgba(10, 10, 14, 0.96)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isPlaying 
            ? '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(34, 211, 238, 0.2)' 
            : '0 10px 30px rgba(0, 0, 0, 0.85), 0 0 15px rgba(255, 255, 255, 0.05)',
          cursor: 'pointer'
        }}
        onClick={togglePlay}
        title={isPlaying ? 'Jeda Musik (Klik)' : 'Putar Dewa 19 - Laskar Cinta (Klik)'}
      >
        {/* Animated mini vinyl / album cover */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: isPlaying ? 'linear-gradient(135deg, #22d3ee, #0284c7)' : 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isPlaying ? 'spinSlow 4s linear infinite' : 'none',
            color: isPlaying ? '#000000' : '#ffffff',
            flexShrink: 0,
            border: isPlaying ? '1.5px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: isPlaying ? '0 0 12px rgba(34, 211, 238, 0.6)' : 'none',
            position: 'relative'
          }}
        >
          {currentTrack.cover ? (
            <>
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#000000',
                  border: '1.5px solid #ffffff'
                }}
              />
            </>
          ) : (
            <Music size={15} />
          )}
        </div>


        {/* Text summary */}
        <div style={{ maxWidth: '155px', overflow: 'hidden' }}>
          <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {currentTrack.title}
          </span>
          <span style={{ display: 'block', fontSize: '0.68rem', color: isPlaying ? '#22d3ee' : '#a1a1aa', fontWeight: 600 }}>
            {isPlaying ? '▶ Sedang Berputar' : '▶ Klik untuk Putar Musik'}
          </span>
        </div>

        {/* Quick Play/Pause button inside pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isPlaying ? '#22d3ee' : '#ffffff',
            border: 'none',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: isPlaying ? '0 0 10px rgba(34, 211, 238, 0.6)' : 'none'
          }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={15} fill="#000" /> : <Play size={15} fill="#000" style={{ marginLeft: '1px' }} />}
        </button>

        {/* Quick Top Artist button inside pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedArtistId('taylor-swift');
            handleOpen('artists');
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#fb7185',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)'; }}
          title="Top Artist & Lagu Favorit (Taylor Swift, dll)"
        >
          <Star size={14} fill="#fb7185" />
        </button>

        {/* Expand caret with rotating animation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
          style={{
            background: isExpanded && !isClosing ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = isExpanded && !isClosing ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)'; }}
          title={isExpanded && !isClosing ? 'Tutup Panel' : 'Buka Pengaturan Audio & Playlist'}
          aria-label={isExpanded && !isClosing ? 'Tutup Panel' : 'Buka Pengaturan Audio & Playlist'}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isExpanded && !isClosing ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <ChevronUp size={16} />
          </div>
        </button>
      </div>

      {/* Immersive Top Artists Modal */}
      <TopArtistsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialArtistId={selectedArtistId}
        currentPlayingTitle={isPlaying ? currentTrack.title : null}
        isMusicPlaying={isPlaying}
        onPlayTrack={(song, artist) => {
          if (currentTrack.title === song.title && isPlaying) {
            togglePlay();
          } else {
            playSong(song, artist || selectedArtist);
          }
        }}
      />

      <style jsx>{`
        @keyframes playerEnter {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.92);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes playerExit {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(22px) scale(0.92);
            filter: blur(8px);
          }
        }

        .player-card-opening {
          animation: playerEnter 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .player-card-closing {
          animation: playerExit 0.26s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .custom-player-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.04);
        }

        .custom-player-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .custom-player-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 9999px;
        }

        .custom-player-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.28);
          border-radius: 9999px;
          transition: background 0.2s;
        }

        .custom-player-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.55);
        }

        /* Equalizer Visualizer Bars: Fluid Wave when Playing, Perfectly Flat when Paused */
        .eq-bar-playing {
          height: 3px;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.45);
          animation: eqDance var(--anim-dur, 0.7s) ease-in-out var(--anim-delay, 0s) infinite alternate;
          transform-origin: bottom;
          will-change: height, opacity;
        }

        .eq-bar-paused {
          height: 3px !important;
          background: rgba(255, 255, 255, 0.22) !important;
          box-shadow: none !important;
          animation: none !important;
          opacity: 0.35 !important;
          transform: none !important;
          transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, opacity 0.3s ease !important;
        }

        @keyframes eqDance {
          0% {
            height: 3px;
            opacity: 0.4;
          }
          35% {
            height: calc(var(--target-height, 22px) * 0.4);
            opacity: 0.75;
          }
          70% {
            height: calc(var(--target-height, 22px) * 0.85);
            opacity: 0.95;
          }
          100% {
            height: var(--target-height, 22px);
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .music-player-root {
            bottom: 16px !important;
            left: 16px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .player-card-opening,
          .player-card-closing {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
