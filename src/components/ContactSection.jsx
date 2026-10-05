'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  MessageSquare, 
  Send, 
  Check, 
  Sparkles, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  ExternalLink,
  Lightbulb,
  Zap,
  Flame,
  MessageCircle,
  Filter,
  Trash2
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const CATEGORIES = [
  { id: 'saran', label: '💡 Saran Fitur', icon: Lightbulb, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' },
  { id: 'kritik', label: '⚡ Kritik Konstruktif', icon: Zap, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)' },
  { id: 'apresiasi', label: '🔥 Apresiasi', icon: Flame, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)' },
  { id: 'umum', label: '💬 Diskusi Santai', icon: MessageCircle, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' }
];

const INITIAL_COMMENTS = [];

const getInitials = (name) => {
  if (!name) return 'P';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Baru saja';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSeconds < 60) return 'Baru saja';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ContactSection() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [likedComments, setLikedComments] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    category: 'saran',
    message: ''
  });

  // Fetch comments from API and load persisted likes from localStorage
  useEffect(() => {
    // 1. Load likes from localStorage
    try {
      const storedLikes = localStorage.getItem('portfolio_liked_comments');
      if (storedLikes) {
        setLikedComments(JSON.parse(storedLikes));
      }
    } catch (e) {}

    // 2. Fetch fresh comments from API route
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comments');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setComments(data);
            try {
              localStorage.setItem('portfolio_comments_cache', JSON.stringify(data));
            } catch (e) {}
            return;
          }
        }
      } catch (err) {
        // Fallback to localStorage if offline
        try {
          const cached = localStorage.getItem('portfolio_comments_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
              const clean = parsed.filter(c => !c.id?.startsWith('c_init_'));
              setComments(clean);
            }
          }
        } catch (e) {}
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (id) => {
    const updated = comments.filter((c) => c.id !== id);
    setComments(updated);
    try {
      localStorage.setItem('portfolio_comments_cache', JSON.stringify(updated));
    } catch (e) {}

    try {
      await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleClearAllComments = async () => {
    if (comments.length === 0) return;
    if (!window.confirm('Hapus semua komentar suara pengunjung?')) return;

    setComments([]);
    try {
      localStorage.setItem('portfolio_comments_cache', JSON.stringify([]));
    } catch (e) {}

    try {
      await fetch('/api/comments?id=all', {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to clear comments:', err);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('putraradenn247@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleLike = (id) => {
    if (likedComments[id]) return;

    const newLiked = { ...likedComments, [id]: true };
    setLikedComments(newLiked);
    try {
      localStorage.setItem('portfolio_liked_comments', JSON.stringify(newLiked));
    } catch (e) {}

    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);

    const newComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: formData.name.trim() || 'Pengunjung Anonim',
      category: formData.category,
      message: formData.message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    // 1. Optimistically display comment immediately in real-time
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    try {
      localStorage.setItem('portfolio_comments_cache', JSON.stringify(updatedComments));
    } catch (e) {}

    // 2. Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // 3. Clear form and show success notification
    setFormData({ name: '', category: formData.category, message: '' });
    setIsSubmitting(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);

    // 4. Send to server API in background
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newComment.name,
          category: newComment.category,
          message: newComment.message
        })
      });
    } catch (err) {
      console.error('Failed to post comment to API:', err);
    }
  };

  const filteredComments = selectedFilter === 'all'
    ? comments
    : comments.filter((c) => c.category === selectedFilter);

  const countSaran = comments.filter((c) => c.category === 'saran').length;
  const countKritik = comments.filter((c) => c.category === 'kritik').length;
  const countApresiasi = comments.filter((c) => c.category === 'apresiasi').length;

  return (
    <section id="contact" className="section" style={{ position: 'relative' }}>
      {/* Background Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag section-tag-purple">
              <Sparkles size={14} />
              <span>Kotak Suara & Feedback</span>
            </div>
            <h2 className="section-title">
              Kritik, Saran & <span className="gradient-text">Suara Pengunjung</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '640px' }}>
              Punya saran fitur baru, kritik tampilan, atau masukan untuk website ini? Tuliskan komentar Anda di bawah — masukan Anda langsung tampil secara publik!
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}
        >
          {/* ============================================================ */}
          {/* KOLOM 1: FORMULIR KIRIM KRITIK & SARAN                       */}
          {/* ============================================================ */}
          <ScrollReveal animation="fade-right" delay={100} style={{ width: '100%' }}>
            <div
              className="glass-card"
              style={{
                padding: '2.25rem',
                borderRadius: 'var(--radius-xl)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc'
                  }}
                >
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                    Beri Kritik & Saran
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    // TERBUKA UNTUK SEMUA PENGUNJUNG
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Tinggalkan masukan jujur untuk menyempurnakan portofolio dan proyek saya. Komentar Anda akan langsung muncul di daftar samping.
              </p>

              {/* Success Alert Banner */}
              {successToast && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    fontSize: '0.84rem',
                    marginBottom: '1.25rem',
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  <Check size={18} style={{ flexShrink: 0 }} />
                  <span>Kritik & saran berhasil dikirim dan langsung tampil di feed! Terima kasih banyak!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Nama Lengkap / Panggilan */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Nama / Panggilan <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Bisa Nama Samaran)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Raden Wijaya / Anonim"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    maxLength={50}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#c084fc')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  />
                </div>

                {/* Kategori Masukan (Interactive Pills) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                    Kategori Masukan
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.5rem'
                    }}
                  >
                    {CATEGORIES.map((cat) => {
                      const isSelected = formData.category === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          style={{
                            padding: '0.65rem 0.75rem',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: isSelected ? cat.bg : 'rgba(255, 255, 255, 0.03)',
                            color: isSelected ? cat.color : 'var(--text-secondary)',
                            border: isSelected ? `1px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: isSelected ? `0 0 14px ${cat.color}30` : 'none',
                            textAlign: 'left'
                          }}
                        >
                          <Icon size={14} color={isSelected ? cat.color : 'var(--text-muted)'} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Isi Kritik & Saran */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0' }}>
                      Pesan Kritik & Saran <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {formData.message.length}/600
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan masukan Anda, kritik tentang performa/tampilan, ide fitur game baru, atau sekadar sapaan santai..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    maxLength={600}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.6,
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#c084fc')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.message.trim()}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.92rem',
                    cursor: (!formData.message.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
                    opacity: (!formData.message.trim() || isSubmitting) ? 0.6 : 1
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Menerbitkan Masukan...' : 'Kirim Kritik & Saran Sekarang'}</span>
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* ============================================================ */}
          {/* KOLOM 2: FEED DINDING KRITIK & SARAN PUBLIK (REAL-TIME)     */}
          {/* ============================================================ */}
          <ScrollReveal animation="fade-left" delay={200} style={{ width: '100%' }}>
            <div
              className="glass-card"
              style={{
                padding: '2.25rem',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Header Feed */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                      Suara Pengunjung
                    </h3>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981'
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                      LIVE FEED
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Masukan dan opini yang langsung tampil tanpa sensor.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {comments.length > 0 && (
                    <button
                      onClick={handleClearAllComments}
                      title="Hapus semua komentar masukan"
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '9999px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        fontSize: '0.72rem',
                        color: '#f87171',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                    >
                      <Trash2 size={11} />
                      <span>Bersihkan</span>
                    </button>
                  )}

                  <div
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#c084fc',
                      fontWeight: 700
                    }}
                  >
                    {comments.length} Masukan
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  paddingBottom: '0.65rem',
                  marginBottom: '1rem',
                  scrollbarWidth: 'none'
                }}
              >
                {[
                  { id: 'all', label: `Semua (${comments.length})` },
                  { id: 'saran', label: `💡 Saran (${countSaran})` },
                  { id: 'kritik', label: `⚡ Kritik (${countKritik})` },
                  { id: 'apresiasi', label: `🔥 Apresiasi (${countApresiasi})` }
                ].map((tab) => {
                  const isActive = selectedFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedFilter(tab.id)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                        color: isActive ? '#000000' : 'var(--text-secondary)',
                        border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Comments List with Lenis Prevention */}
              <div
                className="lenis-prevent comments-scroll-container custom-player-scrollbar"
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                style={{
                  maxHeight: '440px',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                  paddingRight: '0.45rem'
                }}
              >
                {filteredComments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.35, color: '#38bdf8' }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0' }}>
                      Belum ada masukan pengunjung.
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      Jadilah yang pertama memberikan saran, kritik, atau apresiasi melalui form di samping!
                    </p>
                  </div>
                ) : (
                  filteredComments.map((comment) => {
                    const catInfo = CATEGORIES.find((c) => c.id === comment.category) || CATEGORIES[0];
                    const isLiked = !!likedComments[comment.id];
                    return (
                      <div
                        key={comment.id}
                        style={{
                          padding: '1.1rem 1.25rem',
                          borderRadius: '14px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        }}
                      >
                        {/* Author Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {/* Avatar Initials */}
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${catInfo.color}, #38bdf8)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                flexShrink: 0
                              }}
                            >
                              {getInitials(comment.name)}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                                  {comment.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    color: '#22d3ee',
                                    fontFamily: 'var(--font-mono)'
                                  }}
                                  title="Pengunjung Website"
                                >
                                  ✓
                                </span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {formatTimeAgo(comment.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Category Tag */}
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontFamily: 'var(--font-mono)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              background: catInfo.bg,
                              color: catInfo.color,
                              border: `1px solid ${catInfo.border}`,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {catInfo.label}
                          </span>
                        </div>

                        {/* Comment Message */}
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: '#e2e8f0',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {comment.message}
                        </p>

                        {/* Footer: Delete Action & Like Action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title="Hapus masukan ini"
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                          >
                            <Trash2 size={12} />
                            <span>Hapus</span>
                          </button>

                          <button
                            onClick={() => handleLike(comment.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: isLiked ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                              border: isLiked ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                              color: isLiked ? '#f43f5e' : 'var(--text-muted)',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              cursor: isLiked ? 'default' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title="Sukai komentar ini"
                          >
                            <Heart
                              size={12}
                              fill={isLiked ? '#f43f5e' : 'none'}
                              color={isLiked ? '#f43f5e' : 'currentColor'}
                            />
                            <span>{comment.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ============================================================ */}
        {/* DIRECT CONTACT QUICK ACCESS BAR (BAWAH)                      */}
        {/* ============================================================ */}
        <ScrollReveal animation="fade-up" delay={250}>
          <div
            className="glass-card"
            style={{
              marginTop: '2.5rem',
              padding: '1.25rem 2rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>
                // JALUR KOMUNIKASI LANGSUNG
              </span>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600 }}>
                Ingin berdiskusi secara privat? Hubungi saya langsung via Email atau WhatsApp.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem' }}>
              {/* Copy Email Button */}
              <button
                onClick={copyEmail}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.8rem'
                }}
                title="Salin alamat email"
              >
                {copiedEmail ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedEmail ? 'Email Disalin!' : 'putraradenn247@gmail.com'}</span>
              </button>

              {/* WhatsApp Link */}
              <a
                href="https://wa.me/6283877641571?text=Halo%20Putra,%20saya%20melihat%20portofolio%20Anda."
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.8rem',
                  textDecoration: 'none'
                }}
              >
                <Phone size={14} color="#22c55e" />
                <span>WhatsApp (+62 838-7764-1571)</span>
                <ExternalLink size={12} />
              </a>

              {/* Lokasi */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  padding: '0.5rem'
                }}
              >
                <MapPin size={13} color="#38bdf8" />
                <span>Bogor, Jawa Barat</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      <style jsx global>{`
        .comments-scroll-container {
          overflow-y: auto !important;
          overscroll-behavior: contain !important;
          touch-action: pan-y !important;
          scrollbar-width: thin;
          scrollbar-color: rgba(192, 132, 252, 0.4) rgba(255, 255, 255, 0.04);
        }
        .comments-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .comments-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 9999px;
        }
        .comments-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(192, 132, 252, 0.4);
          border-radius: 9999px;
        }
        .comments-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(192, 132, 252, 0.8);
        }
      `}</style>
    </section>
  );
}
