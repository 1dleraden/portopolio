'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Music, 
  Play, 
  Pause, 
  Headphones, 
  Flame, 
  Heart, 
  Disc, 
  ExternalLink,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { topArtists } from '@/data/artistsData';

/**
 * TopArtistsModal Component
 * Interactive modal showcasing favorite musical artists and their top 5 ranked songs.
 * Clicking any artist displays their curated tracklist with custom rankings, album tags, and curator notes.
 */
export default function TopArtistsModal({ 
  isOpen, 
  onClose, 
  onPlayTrack,
  currentPlayingTitle = null,
  isMusicPlaying = false,
  initialArtistId = 'taylor-swift'
}) {
  const [selectedArtistId, setSelectedArtistId] = useState(initialArtistId || 'taylor-swift');
  const [playingTrackTitle, setPlayingTrackTitle] = useState(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
      if (initialArtistId) {
        setSelectedArtistId(initialArtistId);
      }
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    } else if (isRendered && !isClosing) {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 260);
    }
  }, [isOpen, initialArtistId]);

  const handleClose = () => {
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
      onClose();
    }, 260);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  if (!isRendered && !isOpen) return null;

  const currentArtist = topArtists.find(a => a.id === selectedArtistId) || topArtists[0];

  const handlePlaySong = (song) => {
    if (onPlayTrack) {
      onPlayTrack(song, currentArtist);
      setPlayingTrackTitle(song.title);
    }
  };

  return (
    <div
      className="top-artists-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: isClosing ? 'modalFadeOut 0.26s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
      onClick={handleClose}
    >
      <div
        className="glass-card modal-glass-card"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-xl)',
          background: 'rgba(10, 10, 14, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(244, 63, 94, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: isClosing ? 'modalSlideDown 0.26s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'modalSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)',
                flexShrink: 0
              }}
            >
              <Headphones size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
                Top Artist & Lagu Favorit
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Inspirasi Musikal & Playlist Paling Berpengaruh bagi Putra Raden
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Artist Selection Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
            background: 'rgba(0, 0, 0, 0.4)',
            scrollbarWidth: 'none',
            flexShrink: 0
          }}
        >
          {topArtists.map((artist) => {
            const isSelected = selectedArtistId === artist.id;
            return (
              <button
                key={artist.id}
                onClick={() => setSelectedArtistId(artist.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 1rem 0.5rem 0.6rem',
                  borderRadius: '9999px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `1.5px solid ${artist.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? `0 0 16px ${artist.color}50` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: isSelected ? `2px solid ${artist.accentColor}` : '1px solid rgba(255, 255, 255, 0.2)',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={artist.photo}
                    alt={artist.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#d4d4d8' }}>
                    {artist.name}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: isSelected ? artist.accentColor : 'var(--text-muted)' }}>
                    {artist.topSongs.length} Lagu Favorit
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Body: Artist Banner & Song List */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          {/* Artist Hero Header */}
          <div
            className="top-artists-hero-banner"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              background: `linear-gradient(135deg, rgba(20, 20, 26, 0.95), rgba(12, 12, 16, 0.98))`,
              border: `1px solid ${currentArtist.color}45`,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px ${currentArtist.color}15`,
              flexShrink: 0,
              minHeight: 'fit-content'
            }}
          >
            {/* Background Ambient Glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${currentArtist.color}30 0%, transparent 70%)`,
                filter: 'blur(45px)',
                pointerEvents: 'none'
              }}
            />

            {/* Artist Photo */}
            <div
              className="top-artists-photo"
              style={{
                width: '92px',
                height: '92px',
                minWidth: '92px',
                minHeight: '92px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${currentArtist.accentColor}`,
                boxShadow: `0 0 25px ${currentArtist.color}60`,
                flexShrink: 0,
                position: 'relative'
              }}
            >
              <img
                src={currentArtist.photo}
                alt={currentArtist.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Artist Info */}
            <div className="top-artists-info" style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    background: `${currentArtist.color}25`,
                    color: currentArtist.accentColor,
                    border: `1px solid ${currentArtist.color}60`,
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  {currentArtist.badge}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {currentArtist.genre}
                </span>
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                {currentArtist.name}
              </h2>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.65rem' }}>
                {currentArtist.bio}
              </p>

              {currentArtist.quote && (
                <p style={{ fontSize: '0.78rem', color: '#e2e8f0', fontStyle: 'italic', opacity: 0.9, lineHeight: 1.5 }}>
                  {currentArtist.quote}
                </p>
              )}
            </div>
          </div>

          {/* Top 5 Songs List */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color={currentArtist.accentColor} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                  5 Lagu Paling Favorit & Berkesan
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Pilihan Pribadi
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currentArtist.topSongs.map((song) => {
                const isSelectedTrack = (currentPlayingTitle === song.title && isMusicPlaying) || (playingTrackTitle === song.title && isMusicPlaying);

                return (
                  <div
                    key={song.rank}
                    className="glass-card"
                    onClick={() => handlePlaySong(song)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.15rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      background: isSelectedTrack ? 'rgba(34, 211, 238, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelectedTrack ? `1.5px solid ${currentArtist.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelectedTrack ? `0 0 20px ${currentArtist.color}40` : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelectedTrack) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = `${currentArtist.accentColor}60`;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelectedTrack) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                    title={isSelectedTrack ? `Klik untuk jeda ${song.title}` : `Klik untuk putar ${song.title}`}
                  >
                    {/* Rank Badge #1 - #5 */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isSelectedTrack ? '#22d3ee' : (song.rank === 1 ? `linear-gradient(135deg, ${currentArtist.color}, ${currentArtist.accentColor})` : 'rgba(255, 255, 255, 0.06)'),
                        border: song.rank === 1 || isSelectedTrack ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: '1rem',
                        color: isSelectedTrack ? '#000000' : (song.rank === 1 ? '#ffffff' : '#a1a1aa'),
                        flexShrink: 0,
                        boxShadow: isSelectedTrack ? '0 0 15px rgba(34, 211, 238, 0.5)' : (song.rank === 1 ? `0 0 15px ${currentArtist.color}70` : 'none')
                      }}
                    >
                      {isSelectedTrack ? <Volume2 size={18} /> : song.rank}
                    </div>

                    {/* Track Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isSelectedTrack ? '#22d3ee' : '#ffffff' }}>
                          {song.title}
                        </span>
                        {song.feat && (
                          <span style={{ fontSize: '0.8rem', color: currentArtist.accentColor, fontWeight: 600 }}>
                            {song.feat}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#cbd5e1',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {song.album} ({song.year})
                        </span>
                        {song.playable && (
                          <span
                            style={{
                              fontSize: '0.66rem',
                              padding: '0.12rem 0.45rem',
                              borderRadius: '4px',
                              background: 'rgba(34, 211, 238, 0.12)',
                              color: '#22d3ee',
                              border: '1px solid rgba(34, 211, 238, 0.35)',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <Music size={10} />
                            <span>Audio Asli</span>
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                        {song.note}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: currentArtist.accentColor,
                            fontWeight: 600,
                            letterSpacing: '0.02em'
                          }}
                        >
                          ✨ {song.vibe}
                        </span>
                      </div>
                    </div>

                    {/* Right side Duration / Action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {song.duration}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(song);
                        }}
                        className="btn btn-sm btn-primary"
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.78rem',
                          background: isSelectedTrack ? '#22d3ee' : undefined,
                          color: isSelectedTrack ? '#000000' : undefined
                        }}
                        title={isSelectedTrack ? `Jeda ${song.title}` : `Putar ${song.title} di Pemutar`}
                      >
                        {isSelectedTrack ? (
                          <>
                            <Pause size={13} fill="#000" />
                            <span>Jeda</span>
                          </>
                        ) : (
                          <>
                            <Play size={13} fill="#000" />
                            <span>Putar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Total {topArtists.length} Artis Unggulan • {topArtists.reduce((acc, a) => acc + a.topSongs.length, 0)} Lagu Terkurasi
          </span>

          <button
            onClick={handleClose}
            className="btn btn-secondary btn-sm"
          >
            Tutup
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalSlideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
        }

        @media (max-width: 640px) {
          .top-artists-hero-banner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
            padding: 1.25rem !important;
          }
          .top-artists-photo {
            width: 72px !important;
            height: 72px !important;
            min-width: 72px !important;
            min-height: 72px !important;
          }
        }
      `}</style>
    </div>
  );
}
