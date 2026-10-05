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

export default function MusicPlayer({ autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
      isAudioFile: true
    },
    {
      id: 2,
      title: 'Midnight Code',
      artist: 'ajies • Lo-Fi Beats',
      genre: 'Lo-Fi / Focus Chill',
      bpm: 78,
      isAudioFile: false,
      chords: [
        [220, 261.63, 329.63, 392.00], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ]
    },
    {
      id: 3,
      title: 'Cyber Odyssey',
      artist: 'ajies • Synthwave',
      genre: 'Retro 80s Cyberpunk',
      bpm: 110,
      isAudioFile: false,
      chords: [
        [146.83, 220, 293.66, 369.99], // Dm
        [116.54, 174.61, 233.08, 293.66], // Bb
        [130.81, 196.00, 261.63, 329.63], // C
        [110.00, 164.81, 220, 261.63]  // Am
      ]
    }
  ];

  const currentTrack = playlist[currentTrackIndex];
  const selectedArtist = topArtists.find(a => a.id === selectedArtistId) || topArtists[0];

  // Procedural synthesizer fallback for ambient tracks
  const playSynthStep = (step) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    if (!currentTrack.chords) return;

    const chordIndex = Math.floor(step / 4) % currentTrack.chords.length;
    const chord = currentTrack.chords[chordIndex];
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

  const togglePlay = () => {
    const audio = audioRef.current;

    if (currentTrack.isAudioFile) {
      if (!audio) return;

      if (!audio.paused) {
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
          playSynthStep(stepRef.current);
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
    setPlaybackTime(0);
    stepRef.current = 0;
  };

  const prevTrack = () => {
    if (audioRef.current) audioRef.current.pause();
    if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    setIsPlaying(false);

    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    setPlaybackTime(0);
    stepRef.current = 0;
  };

  // Only switch audio source when track changes after initial mount
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (audioRef.current && currentTrack.isAudioFile) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

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

      {/* Expanded Music Player Card */}
      {isExpanded && (
        <div
          className="glass-card"
          style={{
            width: playerTab === 'artists' ? '360px' : '330px',
            maxWidth: 'calc(100vw - 32px)',
            padding: '1.25rem',
            marginBottom: '10px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(10, 10, 13, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.05)',
            transition: 'width 0.2s ease'
          }}
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
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
                title="Kecilkan Pemutar"
              >
                <ChevronDown size={18} />
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
              {/* Track Display with spinning disk / album cover */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
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
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '26px', marginBottom: '1.1rem' }}>
                {[16, 24, 12, 26, 20, 14, 22, 18, 10, 24, 15, 21, 12].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '3.5px',
                      height: isPlaying ? `${Math.max(4, (h * ((Math.floor(playbackTime) + i) % 5 + 1)) % 26)}px` : '4px',
                      borderRadius: '2px',
                      background: isPlaying ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                      transition: 'height 0.12s ease'
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
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.85rem',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'none'
                }}
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  maxHeight: '215px',
                  overflowY: 'auto',
                  paddingRight: '2px'
                }}
              >
                {selectedArtist.topSongs.map((song) => (
                  <div
                    key={song.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = `${selectedArtist.accentColor}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: song.rank === 1 ? `linear-gradient(135deg, ${selectedArtist.color}, ${selectedArtist.accentColor})` : 'rgba(255, 255, 255, 0.08)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          fontFamily: 'var(--font-mono)',
                          flexShrink: 0
                        }}
                      >
                        0{song.rank}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {song.title}
                          </span>
                          {song.feat && (
                            <span style={{ fontSize: '0.65rem', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                              {song.feat}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {song.album} ({song.year})
                        </div>
                      </div>
                    </div>

                    {song.playable ? (
                      <button
                        onClick={() => {
                          setCurrentTrackIndex(0);
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                          }
                        }}
                        style={{
                          background: '#22d3ee',
                          border: 'none',
                          color: '#000000',
                          borderRadius: '9999px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          flexShrink: 0,
                          marginLeft: '0.4rem'
                        }}
                        title="Putar Lagu Dewa 19 Ini"
                      >
                        <Play size={9} fill="#000" />
                        <span>Putar</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: '0.4rem', flexShrink: 0 }}>
                        {song.duration}
                      </span>
                    )}
                  </div>
                ))}
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
            setPlayerTab('artists');
            setIsExpanded(true);
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

        {/* Expand caret */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
          title={isExpanded ? 'Tutup Panel' : 'Buka Pengaturan Audio & Playlist'}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Immersive Top Artists Modal */}
      <TopArtistsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onPlayTrack={(song) => {
          if (song.playable) {
            setCurrentTrackIndex(0);
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          }
        }}
      />

      <style jsx>{`
        @media (max-width: 600px) {
          .music-player-root {
            bottom: 16px !important;
            left: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
