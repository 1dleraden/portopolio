'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Website Development',
    message: ''
  });

  const copyEmail = () => {
    navigator.clipboard.writeText('putraradenn247@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 700);
  };

  return (
    <section id="contact" className="section" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up" delay={0}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag section-tag-cyan">
              <Sparkles size={14} />
              <span>Koneksi & Kolaborasi</span>
            </div>
            <h2 className="section-title">
              Mari Wujudkan <span className="gradient-text">Ide Digital Anda</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Punya ide website, aplikasi interaktif, atau proyek gim? Saya selalu siap berdiskusi dan berkolaborasi.
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Direct Info Cards */}
          <ScrollReveal animation="fade-right" delay={100} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
                  Saluran Komunikasi Langsung
                </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Respon cepat biasanya dalam waktu kurang dari 24 jam. Jangan ragu menyapa melalui email atau WhatsApp.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Email Item */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        EMAIL
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                        putraradenn247@gmail.com
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={copyEmail}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.45rem 0.75rem' }}
                    title="Salin Email"
                  >
                    {copiedEmail ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* WhatsApp Item */}
                <a
                  href="https://wa.me/6283877641571?text=Halo%20Putra,%20saya%20tertarik%20dengan%20portofolio%20Anda%20dan%20ingin%20berdiskusi%20proyek."
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6ee7b7'
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        WHATSAPP / TELEPON
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                        +62 838 7764 1571
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight size={18} color="#10b981" />
                </a>

                {/* Location Item */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      LOKASI
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                      Bogor, Jawa Barat, Indonesia
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Pitch Pill */}
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.9), rgba(8, 8, 10, 0.95))'
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                🚀 Siap Bekerja untuk Proyek Lepas (Freelance)
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Menerima pembuatan landing page interaktif, aplikasi web kustom, perbaikan frontend, dan asset/mechanic prototyping.
              </p>
            </div>
          </div>
        </ScrollReveal>


          {/* Right Column: Interactive Form */}
          <ScrollReveal animation="fade-left" delay={200} style={{ width: '100%' }}>
            <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
              {submitted ? (

              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                  }}
                >
                  <Check size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                  Pesan Berhasil Terkirim!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 1.75rem auto' }}>
                  Terima kasih, <strong>{formData.name}</strong>. Pesan Anda telah saya terima. Saya akan segera menghubungi Anda kembali melalui <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', projectType: 'Website Development', message: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
                  Kirim Pesan atau Penawaran
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Isi formulir di bawah ini dan saya akan merespon secepat mungkin.
                </p>

                {/* Name Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Raden Wijaya"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'var(--font-body)'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'var(--font-body)'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Kategori Kebutuhan
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: '#0d132a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    <option value="Website Development">Pembuatan Website Modern / Portofolio</option>
                    <option value="Frontend UI/UX">Frontend Engineering & UI/UX</option>
                    <option value="Game Prototyping">Prototyping Mekanik Game</option>
                    <option value="Kolaborasi / Lainnya">Kolaborasi Proyek / Tanya Santai</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Pesan & Rencana Proyek
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan gambaran ide, fitur yang diinginkan, atau pertanyaan Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'var(--font-body)'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#8b5cf6')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem' }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
