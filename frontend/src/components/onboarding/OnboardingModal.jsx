import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const SKILL_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    desc: "I'm just starting out. New to programming.",
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    icon: '🔥',
    desc: "I know the basics and want to level up.",
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: '⚡',
    desc: "I'm experienced and want challenges.",
  },
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: '🟨', tutorial: 'javascript-basics' },
  { id: 'python',     label: 'Python',     icon: '🐍', tutorial: 'python-basics' },
  { id: 'java',       label: 'Java',       icon: '☕', tutorial: 'java-basics' },
  { id: 'cpp',        label: 'C++',        icon: '⚙️', tutorial: 'cpp-basics' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', tutorial: 'typescript-basics' },
  { id: 'go',         label: 'Go',         icon: '🐹', tutorial: 'go-basics' },
];

const STEPS = ['Skill Level', 'Language', "Let's Go!"];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [skillLevel, setSkillLevel] = useState(null);
  const [language, setLanguage] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleFinish = async () => {
    // Save to localStorage as fast local cache
    localStorage.setItem('seek_onboarding_done', '1');
    localStorage.setItem('seek_skill_level', skillLevel);
    localStorage.setItem('seek_preferred_language', language);

    // Persist to DB so it survives device/browser switches
    try {
      await api.put('/auth/profile', {
        preferences: {
          skillLevel,
          preferredLanguage: language,
          language, // also sets the editor default language
          onboardingDone: true
        }
      });
    } catch (e) {
      // Non-fatal — localStorage copy is the fallback
    }

    onComplete();
    navigate(`/tutorials`);
  };

  const handleExit = async () => {
    // Must log out first — otherwise HomeRoute redirects authenticated users
    // back to /playground → ProtectedRoute → onboarding loop
    await logout();
    // logout() already does window.location.href = '/' so this is a safety fallback
    window.location.href = '/';
  };

  const canNext = step === 0 ? !!skillLevel : step === 1 ? !!language : true;

  return (
    <div style={fullPage}>
      {/* Exit link — top left */}
      <button style={exitBtn} onClick={handleExit}>
        ← Back to Home
      </button>

      <div style={container}>
        {/* Progress steps */}
        <div style={dotsRow}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  ...dot,
                  background: i <= step ? '#6366f1' : '#2d2d44',
                  transform: i === step ? 'scale(1.25)' : 'scale(1)',
                }} />
                <span style={{
                  fontSize: 11,
                  color: i <= step ? '#a5b4fc' : '#4b5563',
                  fontWeight: i === step ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ ...line, marginBottom: 16 }} />}
            </div>
          ))}
        </div>

        <p style={stepLabel}>{`Step ${step + 1} of ${STEPS.length}`}</p>

        {/* Step 0: Skill level */}
        {step === 0 && (
          <div style={stepContent}>
            <h2 style={heading}>What's your experience level?</h2>
            <p style={subtext}>We'll tailor tutorials and challenges to match your skills.</p>
            <div style={{ ...grid, gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 640, margin: '0 auto' }}>
              {SKILL_LEVELS.map(s => (
                <button
                  key={s.id}
                  style={{ ...card, ...(skillLevel === s.id ? cardActive : {}) }}
                  onClick={() => setSkillLevel(s.id)}
                >
                  <span style={{ fontSize: 42 }}>{s.icon}</span>
                  <strong style={{ color: '#f1f1f5', marginTop: 10, fontSize: 16 }}>{s.label}</strong>
                  <span style={{ color: '#9999b3', fontSize: 13, textAlign: 'center', lineHeight: 1.4 }}>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Language */}
        {step === 1 && (
          <div style={stepContent}>
            <h2 style={heading}>Pick your first language</h2>
            <p style={subtext}>You can explore all languages later — this just sets your starting point.</p>
            <div style={{ ...grid, gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 560, margin: '0 auto' }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  style={{ ...card, ...(language === l.id ? cardActive : {}) }}
                  onClick={() => setLanguage(l.id)}
                >
                  <span style={{ fontSize: 36 }}>{l.icon}</span>
                  <strong style={{ color: '#f1f1f5', marginTop: 8, fontSize: 15 }}>{l.label}</strong>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div style={{ ...stepContent, alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: 72 }}>🚀</span>
            <h2 style={{ ...heading, marginTop: 16, fontSize: 32 }}>You're all set!</h2>
            <p style={{ ...subtext, fontSize: 16, maxWidth: 480 }}>
              We've set your level to <strong style={{ color: '#a5b4fc' }}>{SKILL_LEVELS.find(s => s.id === skillLevel)?.label}</strong> and
              your starting language to <strong style={{ color: '#a5b4fc' }}>{LANGUAGES.find(l => l.id === language)?.label}</strong>.
            </p>
            <p style={{ ...subtext, fontSize: 15, marginTop: 8, maxWidth: 440 }}>
              We'll open the Tutorials page — find your first lesson and start coding!
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={navRow}>
          {step > 0 ? (
            <button style={backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
          ) : (
            <div />
          )}
          {step < 2 ? (
            <button
              style={{ ...nextBtn, opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed' }}
              disabled={!canNext}
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button style={nextBtn} onClick={handleFinish}>
              Start Learning →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const fullPage = {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: '#0e0e16',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  overflow: 'auto',
};
const exitBtn = {
  position: 'absolute', top: 24, left: 28,
  background: 'transparent', border: '1px solid #2d2d44',
  color: '#9999b3', padding: '8px 18px', borderRadius: 8,
  cursor: 'pointer', fontSize: 14, fontWeight: 500,
  transition: 'all 0.15s',
};
const container = {
  width: '100%', maxWidth: 760, padding: '48px 40px',
  display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center',
};
const dotsRow = { display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 8, gap: 0 };
const dot = { width: 12, height: 12, borderRadius: '50%', transition: 'all 0.2s' };
const line = { width: 60, height: 2, background: '#2d2d44', borderRadius: 1, marginTop: -8 };
const stepLabel = { textAlign: 'center', color: '#6b7280', fontSize: 13, marginBottom: 32, marginTop: 4 };
const stepContent = { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' };
const heading = { color: '#f1f1f5', fontSize: 28, fontWeight: 700, margin: 0, textAlign: 'center' };
const subtext = { color: '#9999b3', fontSize: 15, margin: '6px 0 24px', textAlign: 'center' };
const grid = { display: 'grid', gap: 16, width: '100%' };
const card = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  padding: '24px 20px', borderRadius: 14, border: '1px solid #2d2d44',
  background: '#1e1e2a', cursor: 'pointer', transition: 'all 0.15s',
};
const cardActive = {
  border: '2px solid #6366f1', background: 'rgba(99,102,241,0.12)',
  boxShadow: '0 0 0 4px rgba(99,102,241,0.08)',
};
const navRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, width: '100%', maxWidth: 560 };
const backBtn = {
  background: 'transparent', border: '1px solid #2d2d44',
  color: '#9999b3', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
};
const nextBtn = {
  background: '#6366f1', color: '#fff', border: 'none',
  padding: '12px 36px', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 600,
  transition: 'opacity 0.15s',
};
