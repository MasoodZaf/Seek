/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/playground';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrors({ general: result.error || 'Invalid login credentials. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Invalid login credentials. Please try again.' });
    }

    setLoading(false);
  };
  
  const demoCredentials = [
    {
      email: 'admin@codearc.dev',
      password: 'admin123456',
      role: 'Admin',
      name: 'Admin User',
      icon: '👑',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'Full access to all features'
    },
    {
      email: 'test@codearc.dev',
      password: 'test123456',
      role: 'Student',
      name: 'Test User',
      icon: '👤',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      description: 'Standard user experience'
    },
  ];

  const handleQuickLogin = async (credentials) => {
    setFormData({ email: credentials.email, password: credentials.password });
    setErrors({});
    setLoading(true);
    try {
      const result = await login(credentials.email, credentials.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setErrors({ general: result.error || 'Invalid login credentials. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Invalid login credentials. Please try again.' });
    }
    setLoading(false);
  };

  const S = {
    page: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#111110', padding: '48px 16px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    wrap: { width: '100%', maxWidth: 420 },
    logoWrap: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      marginBottom: 24,
    },
    logoMark: {
      width: 80, height: 80, borderRadius: 20,
      overflow: 'hidden', display: 'block',
      boxShadow: '0 0 32px rgba(110,231,183,0.25), 0 8px 24px rgba(0,0,0,0.5)',
      border: '1px solid rgba(110,231,183,0.2)',
      marginBottom: 14,
    },
    logoBrand: {
      fontSize: 26, fontWeight: 700, color: '#f5f0e8',
      letterSpacing: '-0.02em', lineHeight: 1,
    },
    logoTagline: {
      fontSize: 12, color: '#6b6565', fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4,
    },
    backLink: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: '#6b6565', textDecoration: 'none',
      marginBottom: 32, transition: 'color 0.2s',
    },
    heading: {
      fontFamily: "'Fraunces', Georgia, serif",
      fontSize: 28, fontWeight: 600, color: '#f5f0e8',
      textAlign: 'center', marginBottom: 6, letterSpacing: '-0.02em',
    },
    sub: { fontSize: 14, color: '#6b6565', textAlign: 'center', marginBottom: 32 },
    card: {
      background: '#17171a', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: 28,
    },
    demoLabel: {
      fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: '#6b6565', marginBottom: 12,
      fontFamily: "'JetBrains Mono', monospace",
    },
    demoBtn: {
      width: '100%', border: 'none', borderRadius: 10, padding: '12px 16px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
      marginBottom: 8, transition: 'opacity 0.15s, transform 0.15s',
      textAlign: 'left',
    },
    demoIcon: { fontSize: 22, flexShrink: 0 },
    demoName: { fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.3 },
    demoDesc: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
    demoBadge: {
      marginLeft: 'auto', padding: '3px 10px', borderRadius: 100,
      background: 'rgba(255,255,255,0.15)', fontSize: 11, color: '#fff',
      fontWeight: 500, flexShrink: 0,
    },
    divider: {
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '20px 0',
    },
    dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' },
    dividerText: { fontSize: 12, color: '#6b6565', whiteSpace: 'nowrap' },
    label: { display: 'block', fontSize: 13, color: '#a09898', marginBottom: 6, fontWeight: 500 },
    input: {
      width: '100%', background: '#111110', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#f5f0e8',
      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
      transition: 'border-color 0.2s',
    },
    inputFocus: { borderColor: 'rgba(110,231,183,0.4)' },
    fieldGroup: { marginBottom: 16 },
    error: { fontSize: 12, color: '#fca5a5', marginTop: 4 },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#a09898', cursor: 'pointer' },
    forgotLink: { fontSize: 13, color: '#6ee7b7', textDecoration: 'none' },
    submitBtn: {
      width: '100%', background: '#6ee7b7', color: '#111', border: 'none',
      borderRadius: 8, padding: '11px 0', fontSize: 14, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
    },
    footer: { marginTop: 20, textAlign: 'center', fontSize: 13, color: '#6b6565' },
    footerLink: { color: '#6ee7b7', textDecoration: 'none' },
    legal: { marginTop: 24, textAlign: 'center', fontSize: 12, color: '#4a4545' },
    legalLink: { color: '#6b6565', textDecoration: 'none' },
  };

  const [focusedField, setFocusedField] = useState(null);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');`}</style>
      <div style={S.page}>
        <motion.div
          style={S.wrap}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back to home */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Link to="/" style={S.backLink}>
              ← Back to CodeArc
            </Link>
          </div>

          {/* Logo + heading */}
          <div style={S.logoWrap}>
            <img src="/logo512.png" alt="CodeArc" style={S.logoMark} />
            <div style={S.logoBrand}>CodeArc</div>
            <div style={S.logoTagline}>Learning Platform</div>
          </div>
          <h1 style={S.heading}>Welcome back</h1>
          <p style={S.sub}>Sign in to continue your coding journey</p>

          <div style={S.card}>
            {/* Quick login */}
            <div style={S.demoLabel}>Quick access</div>
            {demoCredentials.map((cred, i) => (
              <motion.button
                key={i}
                type="button"
                style={{
                  ...S.demoBtn,
                  background: i === 0
                    ? 'linear-gradient(135deg, #6d28d9, #ec4899)'
                    : 'linear-gradient(135deg, #1d4ed8, #0891b2)',
                  opacity: loading ? 0.5 : 1,
                }}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                onClick={() => !loading && handleQuickLogin(cred)}
                disabled={loading}
              >
                <span style={S.demoIcon}>{cred.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={S.demoName}>{cred.name}</div>
                  <div style={S.demoDesc}>{cred.email}</div>
                </div>
                <span style={S.demoBadge}>{cred.role}</span>
              </motion.button>
            ))}

            {/* General error (e.g. failed quick login) */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                  color: '#fca5a5', fontSize: 13, textAlign: 'center'
                }}
              >
                {errors.general}
              </motion.div>
            )}

            {/* Divider */}
            <div style={S.divider}>
              <div style={S.dividerLine} />
              <span style={S.dividerText}>or sign in manually</span>
              <div style={S.dividerLine} />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit}>
              <div style={S.fieldGroup}>
                <label style={S.label}>Email address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...S.input,
                    ...(focusedField === 'email' ? S.inputFocus : {}),
                    ...(errors.email ? { borderColor: 'rgba(252,165,165,0.5)' } : {}),
                  }}
                />
                {errors.email && <div style={S.error}>{errors.email}</div>}
              </div>

              <div style={S.fieldGroup}>
                <label style={S.label}>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...S.input,
                    ...(focusedField === 'password' ? S.inputFocus : {}),
                    ...(errors.password ? { borderColor: 'rgba(252,165,165,0.5)' } : {}),
                  }}
                />
                {errors.password && <div style={S.error}>{errors.password}</div>}
              </div>

              <div style={S.row}>
                <label style={S.checkLabel}>
                  <input type="checkbox" style={{ accentColor: '#6ee7b7' }} />
                  Remember me
                </label>
                <Link to="/forgot-password" style={S.forgotLink}>Forgot password?</Link>
              </div>

              <motion.button
                type="submit"
                style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
                whileHover={{ background: loading ? '#6ee7b7' : '#a7f3d0' }}
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </motion.button>
            </form>

            <div style={S.footer}>
              No account?{' '}
              <Link to="/register" style={S.footerLink}>Create one free</Link>
            </div>
          </div>

          <p style={S.legal}>
            By signing in you agree to our{' '}
            <Link to="/terms" style={S.legalLink}>Terms</Link>
            {' & '}
            <Link to="/privacy" style={S.legalLink}>Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;