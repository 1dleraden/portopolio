'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  MessageSquare,
  ArrowUpRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Halo! 👋 Saya adalah **Ajies AI**, asisten kecerdasan buatan virtual resmi dari **Putra Raden Al Aziz**.\n\nAnda dapat menanyakan apa saja seputar profil, keahlian coding, proyek di GitHub ([@1dleraden](https://github.com/1dleraden)), ketersediaan magang/freelance, atau kontak langsung.',
    timestamp: 'Baru saja'
  }
];

const DEFAULT_SUGGESTIONS = [
  'Siapa Putra Raden Al Aziz?',
  'Apa saja proyek unggulan di GitHub?',
  'Teknologi apa saja yang dikuasai?',
  'Bagaimana cara menghubungi Ajies?',
  'Di mana ia bersekolah & apa jurusannya?'
];

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [copiedId, setCopiedId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const chatScrollContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const inputRef = useRef(null);

  const openChat = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  // Directly scroll the chat container without touching window or Lenis
  const scrollToBottom = (instant = false) => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  };

  // Auto-scroll when new messages arrive (messages count increases)
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      if (messages.length > prevMessagesLengthRef.current) {
        scrollToBottom(false);
      }
      prevMessagesLengthRef.current = messages.length;
    }
  }, [isOpen, messages]);

  // Initial scroll to bottom when modal is opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToBottom(true);
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleContainerScroll = (e) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 80);
  };

  // Listen for global custom events to open chat from anywhere
  useEffect(() => {
    const handleOpenChat = (e) => {
      openChat();
      if (e.detail?.query) {
        handleSendMessage(e.detail.query);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const handleSendMessage = async (customText = null) => {
    const messageToSend = customText || inputMessage;
    if (!messageToSend || !messageToSend.trim() || isLoading) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: messageToSend.trim(),
      timestamp: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date())
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Gagal menghubungi asisten AI');

      const data = await response.json();

      const aiReply = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Maaf, saya tidak dapat memproses jawaban saat ini.',
        timestamp: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date())
      };

      setMessages((prev) => [...prev, aiReply]);
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Terjadi sedikit kendala jaringan. Anda dapat menghubungi Putra Raden langsung melalui WhatsApp di [+62 838 7764 1571](https://wa.me/6283877641571) atau email [putraradenn247@gmail.com](mailto:putraradenn247@gmail.com).',
          timestamp: 'Sekarang'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setSuggestions(DEFAULT_SUGGESTIONS);
  };

  // Helper parser for simple markdown bold and links
  const renderFormattedText = (text) => {
    // Split by newlines first
    const lines = text.split('\n');

    return lines.map((line, lIdx) => {
      // Parse markdown bold **text** and links [text](url)
      const parts = [];
      let lastIndex = 0;
      const combinedRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
      let match;

      while ((match = combinedRegex.exec(line)) !== null) {
        // Plain text before match
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }

        const token = match[0];
        if (token.startsWith('**') && token.endsWith('**')) {
          parts.push(
            <strong key={`b_${lIdx}_${match.index}`} style={{ color: '#fff', fontWeight: 700 }}>
              {token.slice(2, -2)}
            </strong>
          );
        } else if (token.startsWith('[') && token.includes('](')) {
          const closeBracket = token.indexOf('](');
          const linkText = token.slice(1, closeBracket);
          const linkUrl = token.slice(closeBracket + 2, -1);
          parts.push(
            <a
              key={`a_${lIdx}_${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#38bdf8',
                textDecoration: 'underline',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <span>{linkText}</span>
              <ExternalLink size={10} />
            </a>
          );
        }

        lastIndex = match.index + token.length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <span key={lIdx} style={{ display: 'block', minHeight: line.trim() === '' ? '0.65rem' : 'auto' }}>
          {parts.length > 0 ? parts : line}
        </span>
      );
    });
  };

  return (
    <>
      {/* ============================================================ */}
      {/* FLOATING TRIGGER BUTTON (Bottom Right Corner)                */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}
      >
        {/* Helper Pill Tag */}
        {!isOpen && !isClosing && (
          <button
            onClick={openChat}
            className="ai-chat-pill-tag"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }}
            />
            <span>Tanya AI Ajies</span>
            <Sparkles size={13} color="#38bdf8" />
          </button>
        )}

        {/* Main Floating Button */}
        <button
          onClick={toggleChat}
          aria-label={isOpen ? 'Tutup Chat AI' : 'Buka Chat AI'}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isOpen
              ? 'rgba(255, 255, 255, 0.1)'
              : 'linear-gradient(135deg, #0284c7, #6366f1)',
            border: isOpen
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(56, 189, 248, 0.5)',
            boxShadow: isOpen
              ? '0 10px 25px rgba(0,0,0,0.6)'
              : '0 0 30px rgba(56, 189, 248, 0.45), 0 8px 20px rgba(0,0,0,0.5)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            animation: isOpen ? 'none' : 'aiAuraPulse 3s infinite ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isOpen ? 'rotate(90deg) scale(1.05)' : 'rotate(0deg) scale(1)'
            }}
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <>
                <Bot size={26} />
                {hasUnread && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      border: '2px solid #000'
                    }}
                  />
                )}
              </>
            )}
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* CHAT POPUP WINDOW WITH CYBERNETIC ENTRANCE ANIMATION        */}
      {/* ============================================================ */}
      {(isOpen || isClosing) && (
        <div
          className={`glass-card ai-chat-modal lenis-prevent ${isClosing ? 'ai-chat-closing' : 'ai-chat-opening'}`}
          data-lenis-prevent="true"
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: 'min(440px, calc(100vw - 32px))',
            height: 'min(620px, calc(100vh - 120px))',
            zIndex: 95,
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgba(8, 12, 24, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.22)',
            transformOrigin: 'bottom right',
            pointerEvents: isClosing ? 'none' : 'auto'
          }}
        >
          {/* Holographic Glowing Scanner Top Bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, #c084fc, transparent)',
              zIndex: 10,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
                animation: 'aiLaserScan 2.4s linear infinite'
              }}
            />
          </div>
          {/* Header */}
          <div
            style={{
              padding: '1.15rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)',
                  position: 'relative'
                }}
              >
                <Bot size={22} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid #080c18'
                  }}
                />
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Ajies AI</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontWeight: 700
                    }}
                  >
                    Assistant
                  </span>
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Asisten Virtual Putra Raden Al Aziz
                </p>
              </div>
            </div>

            {/* Actions: Clear & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handleResetChat}
                title="Reset Percakapan"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={closeChat}
                title="Tutup Chat"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream Wrapper */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
              ref={chatScrollContainerRef}
              className="ai-chat-messages lenis-prevent"
              data-lenis-prevent="true"
              onScroll={handleContainerScroll}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                    gap: '0.25rem',
                    maxWidth: '100%',
                    animation: 'aiBubbleFadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      padding: '0.85rem 1.1rem',
                      borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                      background: isAi
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'linear-gradient(135deg, #0284c7, #4f46e5)',
                      border: isAi
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#e2e8f0',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      boxShadow: isAi
                        ? '0 4px 15px rgba(0, 0, 0, 0.2)'
                        : '0 4px 15px rgba(2, 132, 199, 0.3)',
                      wordBreak: 'break-word',
                      position: 'relative'
                    }}
                  >
                    {renderFormattedText(msg.content)}

                    {/* Copy button for AI replies */}
                    {isAi && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '0.5rem',
                          paddingTop: '0.4rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            cursor: 'pointer',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                          {copiedId === msg.id ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                          <span>{copiedId === msg.id ? 'Tersalin' : 'Salin'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '0 0.25rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '16px 16px 16px 4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 1s infinite alternate' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7', animation: 'pulse 1.2s infinite alternate' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 0.9s infinite alternate' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                    Ajies AI sedang mengetik...
                  </span>
                </div>
              </div>
            )}

            </div>

            {/* Floating Scroll to Bottom Button */}
            {showScrollBottom && (
              <button
                onClick={() => scrollToBottom(false)}
                title="Scroll ke pesan terbaru"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '16px',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 23, 42, 0.94)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  backdropFilter: 'blur(8px)',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(56, 189, 248, 0.25)',
                  zIndex: 10,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <ChevronDown size={14} />
                <span>Ke Bawah</span>
              </button>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions && suggestions.length > 0 && !isLoading && (
            <div
              style={{
                padding: '0.6rem 1rem',
                display: 'flex',
                gap: '0.45rem',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(0, 0, 0, 0.2)'
              }}
              className="no-scrollbar"
            >
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#bae6fd',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                    e.currentTarget.style.borderColor = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(10, 15, 30, 0.98)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '0.35rem 0.5rem 0.35rem 1rem',
                transition: 'border-color 0.2s'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan seputar Putra Raden..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-body)'
                }}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Kirim Pesan"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: inputMessage.trim() && !isLoading
                    ? 'linear-gradient(135deg, #0284c7, #6366f1)'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={15} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.45rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Ditenagai oleh Ajies Contextual AI Engine • Respon Cepat
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
