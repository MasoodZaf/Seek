import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const getStrength = (pw) => {
  if (!pw) return null;
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 2) return { label: 'Weak',   color: '#ef4444', bars: 1 };
  if (score === 3) return { label: 'Fair',   color: '#f59e0b', bars: 2 };
  if (score === 4) return { label: 'Good',   color: '#3b82f6', bars: 3 };
  return              { label: 'Strong', color: '#10b981', bars: 4 };
};

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(form.password);
  const reqs = [
    { key: 'len',     label: 'At least 8 characters',      met: form.password.length >= 8 },
    { key: 'upper',   label: 'Uppercase letter (A–Z)',      met: /[A-Z]/.test(form.password) },
    { key: 'lower',   label: 'Lowercase letter (a–z)',      met: /[a-z]/.test(form.password) },
    { key: 'number',  label: 'Number (0–9)',                 met: /[0-9]/.test(form.password) },
    { key: 'special', label: 'Special character (!@#$…)',   met: /[^A-Za-z0-9]/.test(form.password) },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim())  errs.lastName  = 'Last name is required';
    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'At least 8 characters required';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      errs.password = 'Must include uppercase, lowercase, and a number';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...payload } = form;
    const result = await register(payload);
    if (result.success) {
      ['seek_onboarding_done', 'seek_skill_level', 'seek_preferred_language', 'seek_theme'].forEach(k => localStorage.removeItem(k));
      navigate('/playground');
    }
    setLoading(false);
  };

  const inputBase = (name) => ({
    width: '100%', boxSizing: 'border-box',
    background: '#0d0d0f',
    border: `1.5px solid ${errors[name] ? 'rgba(239,68,68,0.6)' : focused === name ? 'rgba(110,231,183,0.45)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 9, padding: '11px 14px',
    fontSize: 14, color: '#f0ede8', outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
    letterSpacing: '0.01em',
  });

  const withToggle = (name) => ({ ...inputBase(name), paddingRight: 52 });

  const Label = ({ children }) => (
    <label style={{ display: 'block', fontSize: 12, color: '#908c88', marginBottom: 6, fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {children}
    </label>
  );

  const Err = ({ msg }) => msg ? (
    <div style={{ fontSize: 11, color: '#fca5a5', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span>⚠</span> {msg}
    </div>
  ) : null;

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} tabIndex={-1}
      style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6565', padding: 0, fontFamily: 'inherit', fontSize: 18, lineHeight: 1, display: 'flex' }}>
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 40px #0d0d0f inset !important; -webkit-text-fill-color: #f0ede8 !important; }
        ::selection { background: rgba(110,231,183,0.25); }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0c0c10 0%, #111110 60%, #0e0f0c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <motion.div style={{ width: '100%', maxWidth: 448 }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>

          {/* Back */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Link to="/" style={{ fontSize: 13, color: '#5a5655', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#908c88'}
              onMouseLeave={e => e.currentTarget.style.color = '#5a5655'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back to CodeArc
            </Link>
          </div>

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: 28, background: 'radial-gradient(circle, rgba(110,231,183,0.15) 0%, transparent 70%)', filter: 'blur(8px)' }} />
              <img src="/logo512.png" alt="CodeArc" style={{ width: 68, height: 68, borderRadius: 18, display: 'block', position: 'relative', border: '1px solid rgba(110,231,183,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f0ede8', letterSpacing: '-0.025em', lineHeight: 1 }}>CodeArc</div>
            <div style={{ fontSize: 10.5, color: '#5a5655', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4 }}>Learning Platform</div>
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#f0ede8', margin: '0 0 6px', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 13.5, color: '#6b6565', margin: 0, lineHeight: 1.5 }}>
              Free forever · No credit card needed
            </p>
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 28px 24px', backdropFilter: 'blur(12px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
            <form onSubmit={handleSubmit} noValidate>

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <Label>First name</Label>
                  <input name="firstName" type="text" placeholder="Jane" autoComplete="given-name" value={form.firstName} onChange={handleChange}
                    style={inputBase('firstName')} onFocus={() => setFocused('firstName')} onBlur={() => setFocused(null)} />
                  <Err msg={errors.firstName} />
                </div>
                <div>
                  <Label>Last name</Label>
                  <input name="lastName" type="text" placeholder="Doe" autoComplete="family-name" value={form.lastName} onChange={handleChange}
                    style={inputBase('lastName')} onFocus={() => setFocused('lastName')} onBlur={() => setFocused(null)} />
                  <Err msg={errors.lastName} />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0 16px' }} />

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <Label>Email address</Label>
                <input name="email" type="email" placeholder="jane@example.com" autoComplete="email" value={form.email} onChange={handleChange}
                  style={inputBase('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
                <Err msg={errors.email} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Label>Password</Label>
                  {strength && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPw ? 'text' : 'password'} placeholder="Create a strong password" autoComplete="new-password"
                    value={form.password} onChange={handleChange}
                    style={withToggle('password')} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} />
                  <EyeBtn show={showPw} onToggle={() => setShowPw(v => !v)} />
                </div>
                <Err msg={errors.password} />

                {/* Strength bars */}
                <AnimatePresence>
                  {form.password && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                        {[1, 2, 3, 4].map(i => (
                          <motion.div key={i} style={{ flex: 1, height: 3, borderRadius: 3 }}
                            animate={{ background: strength && strength.bars >= i ? strength.color : 'rgba(255,255,255,0.1)' }}
                            transition={{ duration: 0.3 }} />
                        ))}
                      </div>
                      {/* Requirements */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', marginTop: 8 }}>
                        {reqs.map(r => (
                          <motion.div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5 }}
                            animate={{ color: r.met ? '#6ee7b7' : '#5a5655' }} transition={{ duration: 0.2 }}>
                            <motion.span animate={{ opacity: r.met ? 1 : 0.5 }} style={{ fontSize: 10, fontWeight: 700 }}>
                              {r.met ? '✓' : '○'}
                            </motion.span>
                            {r.label}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: 24 }}>
                <Label>Confirm password</Label>
                <div style={{ position: 'relative' }}>
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" autoComplete="new-password"
                    value={form.confirmPassword} onChange={handleChange}
                    style={withToggle('confirmPassword')} onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused(null)} />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                </div>
                <Err msg={errors.confirmPassword} />
                <AnimatePresence>
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 11.5, color: '#6ee7b7', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontWeight: 700 }}>✓</span> Passwords match
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)', color: '#0a1a12', border: 'none', borderRadius: 9, padding: '13px 0', fontSize: 14.5, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, letterSpacing: '0.01em', boxShadow: '0 4px 20px rgba(52,211,153,0.2)' }}
                whileHover={!loading ? { boxShadow: '0 6px 28px rgba(52,211,153,0.35)', y: -1 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Creating account…
                  </span>
                ) : 'Create account →'}
              </motion.button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>

            <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: '#5a5655' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#6ee7b7', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
            </div>
          </div>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 11.5, color: '#3d3a38', lineHeight: 1.6 }}>
            By creating an account you agree to our{' '}
            <Link to="/terms" style={{ color: '#5a5655', textDecoration: 'none', borderBottom: '1px solid rgba(90,86,85,0.3)' }}>Terms</Link>
            {' & '}
            <Link to="/privacy" style={{ color: '#5a5655', textDecoration: 'none', borderBottom: '1px solid rgba(90,86,85,0.3)' }}>Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
