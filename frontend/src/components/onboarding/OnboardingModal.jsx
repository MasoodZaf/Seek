import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SKILL_LEVELS = [
  { id: 'beginner',     label: 'Beginner',     emoji: '🌱', desc: "New to programming" },
  { id: 'intermediate', label: 'Intermediate',  emoji: '🔥', desc: "Know the basics" },
  { id: 'advanced',     label: 'Advanced',      emoji: '⚡', desc: "Ready for challenges" },
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: 'JS',  color: '#f7df1e', bg: '#1a1800' },
  { id: 'python',     label: 'Python',     icon: 'Py',  color: '#3776ab', bg: '#001020' },
  { id: 'java',       label: 'Java',       icon: 'Jv',  color: '#ed8b00', bg: '#1a0e00' },
  { id: 'cpp',        label: 'C++',        icon: 'C++', color: '#659ad2', bg: '#00101a' },
  { id: 'typescript', label: 'TypeScript', icon: 'TS',  color: '#3178c6', bg: '#00102a' },
  { id: 'go',         label: 'Go',         icon: 'Go',  color: '#00add8', bg: '#001a20' },
];

const THEMES = [
  { id: 'midnight', label: 'Midnight', desc: 'Deep black · Indigo accents',  swatches: ['#0e0e16', '#17171a', '#6366f1'] },
  { id: 'ocean',    label: 'Ocean',    desc: 'Deep navy · Cyan highlights',   swatches: ['#0d1b2a', '#141b28', '#2CB5E3'] },
  { id: 'daylight', label: 'Daylight', desc: 'Clean white · Navy accents',    swatches: ['#f4f6f8', '#ffffff', '#1B2A6B'] },
];

export default function OnboardingModal({ onComplete }) {
  const [skillLevel, setSkillLevel] = useState(null);
  const [language, setLanguage] = useState(null);
  const [theme, setThemeChoice] = useState('midnight');

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setTheme } = useTheme();

  const canFinish = !!skillLevel && !!language;

  const handleFinish = async () => {
    setTheme(theme);
    localStorage.setItem('seek_onboarding_done', '1');
    localStorage.setItem('seek_skill_level', skillLevel);
    localStorage.setItem('seek_preferred_language', language);
    localStorage.setItem('seek_theme', theme);

    try {
      await api.put('/auth/profile', {
        preferences: { skillLevel, preferredLanguage: language, language, theme, onboardingDone: true }
      });
    } catch {
      // Non-fatal — localStorage is the fallback
    }

    onComplete();
    navigate('/tutorials');
  };

  const handleExit = async () => {
    await logout();
    window.location.href = '/';
  };

  const selectedSkill = SKILL_LEVELS.find(s => s.id === skillLevel);
  const selectedLang  = LANGUAGES.find(l => l.id === language);
  const selectedTheme = THEMES.find(t => t.id === theme);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .ob-card { transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; }
        .ob-card:hover { border-color: rgba(255,255,255,0.18) !important; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'linear-gradient(160deg, #0c0c10 0%, #0e0e16 100%)', overflow: 'auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Top bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(12,12,16,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
          <button onClick={handleExit}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7280', padding: '7px 16px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Home
          </button>

          <div style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>
            CodeArc · Setup
          </div>

          {/* Mini summary chips */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {selectedSkill && (
              <span style={{ fontSize: 11, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: 20, fontWeight: 600, border: '1px solid rgba(99,102,241,0.25)' }}>
                {selectedSkill.emoji} {selectedSkill.label}
              </span>
            )}
            {selectedLang && (
              <span style={{ fontSize: 11, background: `rgba(${selectedLang.color.slice(1).match(/../g).map(h => parseInt(h,16)).join(',')},0.15)`, color: selectedLang.color, padding: '3px 8px', borderRadius: 20, fontWeight: 600, border: `1px solid rgba(${selectedLang.color.slice(1).match(/../g).map(h => parseInt(h,16)).join(',')},0.3)` }}>
                {selectedLang.label}
              </span>
            )}
          </div>
        </div>

        {/* Main content */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 24px 100px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#f1f1f5', margin: '0 0 10px', letterSpacing: '-0.025em' }}>
                Personalize your experience
              </h1>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>
                Quick setup — takes under a minute. You can change everything later.
              </p>
            </div>

            {/* ── Section 1: Skill Level ──────────────────────────── */}
            <Section number="01" title="What's your experience level?" subtitle="We'll tailor content and challenges to match your skills.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {SKILL_LEVELS.map(s => (
                  <OptionCard
                    key={s.id}
                    selected={skillLevel === s.id}
                    onClick={() => setSkillLevel(s.id)}
                    accentColor="#6366f1"
                  >
                    <span style={{ fontSize: 36, lineHeight: 1 }}>{s.emoji}</span>
                    <strong style={{ color: '#f1f1f5', fontSize: 15, fontWeight: 600, marginTop: 6 }}>{s.label}</strong>
                    <span style={{ color: '#6b7280', fontSize: 12.5, textAlign: 'center', lineHeight: 1.4 }}>{s.desc}</span>
                  </OptionCard>
                ))}
              </div>
            </Section>

            <SectionDivider />

            {/* ── Section 2: Language ─────────────────────────────── */}
            <Section number="02" title="Pick your starting language" subtitle="You'll have access to all languages — this just sets your default.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {LANGUAGES.map(l => (
                  <LanguageCard
                    key={l.id}
                    lang={l}
                    selected={language === l.id}
                    onClick={() => setLanguage(l.id)}
                  />
                ))}
              </div>
            </Section>

            <SectionDivider />

            {/* ── Section 3: Theme ────────────────────────────────── */}
            <Section number="03" title="Choose your theme" subtitle="Sets the editor and UI colour scheme. Swap anytime in settings.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {THEMES.map(t => (
                  <ThemeCard
                    key={t.id}
                    thm={t}
                    selected={theme === t.id}
                    onClick={() => setThemeChoice(t.id)}
                  />
                ))}
              </div>
            </Section>

            {/* ── CTA ─────────────────────────────────────────────── */}
            <div style={{ marginTop: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              {!canFinish && (
                <p style={{ fontSize: 12.5, color: '#4b5563', margin: 0 }}>
                  Select a skill level and language to continue
                </p>
              )}

              {/* Summary pill */}
              <AnimatePresence>
                {canFinish && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 28, fontSize: 13, color: '#a5b4fc', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span>{selectedSkill?.emoji} {selectedSkill?.label}</span>
                    <span style={{ color: '#374151' }}>·</span>
                    <span>{selectedLang?.label}</span>
                    <span style={{ color: '#374151' }}>·</span>
                    <span>{selectedTheme?.label} theme</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleFinish}
                disabled={!canFinish}
                style={{
                  background: canFinish ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : '#1e1e2a',
                  color: canFinish ? '#fff' : '#374151',
                  border: 'none', borderRadius: 10,
                  padding: '14px 44px', fontSize: 15.5, fontWeight: 700,
                  cursor: canFinish ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  boxShadow: canFinish ? '0 8px 32px rgba(99,102,241,0.35)' : 'none',
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                  minWidth: 220,
                }}
                whileHover={canFinish ? { boxShadow: '0 12px 40px rgba(99,102,241,0.5)', y: -2 } : {}}
                whileTap={canFinish ? { scale: 0.98 } : {}}>
                Start Learning →
              </motion.button>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Section({ number, title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', letterSpacing: '0.08em', fontVariantNumeric: 'tabular-nums' }}>{number}</span>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: '#f1f1f5', margin: 0, letterSpacing: '-0.015em' }}>{title}</h2>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', margin: '0 0 20px' }}>{subtitle}</p>
      {children}
    </div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent)', margin: '40px 0' }} />;
}

function OptionCard({ selected, onClick, accentColor, children }) {
  return (
    <motion.button className="ob-card" onClick={onClick} whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '22px 16px', borderRadius: 12, cursor: 'pointer',
        background: selected ? `rgba(${hexToRgb(accentColor)},0.12)` : 'rgba(255,255,255,0.03)',
        border: selected ? `2px solid ${accentColor}` : '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: selected ? `0 0 0 4px rgba(${hexToRgb(accentColor)},0.1)` : 'none',
        fontFamily: 'inherit', transition: 'all 0.18s',
      }}>
      {children}
    </motion.button>
  );
}

function LanguageCard({ lang, selected, onClick }) {
  const rgb = hexToRgb(lang.color);
  return (
    <motion.button className="ob-card" onClick={onClick} whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
        background: selected ? `rgba(${rgb},0.14)` : 'rgba(255,255,255,0.03)',
        border: selected ? `2px solid ${lang.color}` : '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: selected ? `0 0 0 4px rgba(${rgb},0.1)` : 'none',
        fontFamily: 'inherit', textAlign: 'left',
      }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: `rgba(${rgb},0.15)`,
        border: `1px solid rgba(${rgb},0.3)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: lang.color, letterSpacing: '-0.03em',
      }}>
        {lang.icon}
      </div>
      <strong style={{ color: '#f1f1f5', fontSize: 14, fontWeight: 600 }}>{lang.label}</strong>
    </motion.button>
  );
}

function ThemeCard({ thm, selected, onClick }) {
  return (
    <motion.button className="ob-card" onClick={onClick} whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        padding: '20px 16px', borderRadius: 12, cursor: 'pointer',
        background: selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
        border: selected ? '2px solid #6366f1' : '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: selected ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
        fontFamily: 'inherit',
      }}>
      {/* Swatch */}
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', width: 72, height: 40, border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
        {thm.swatches.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
      </div>
      <strong style={{ color: '#f1f1f5', fontSize: 14, fontWeight: 600 }}>{thm.label}</strong>
      <span style={{ color: '#6b7280', fontSize: 11.5, textAlign: 'center', lineHeight: 1.4 }}>{thm.desc}</span>
    </motion.button>
  );
}

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/../g);
  if (!m) return '255,255,255';
  return m.map(h => parseInt(h, 16)).join(',');
}
