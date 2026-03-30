import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
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
  
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, lowercase letter, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };
  
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      navigate('/playground');
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
    steps: { display: 'flex', gap: 6, marginBottom: 24 },
    stepBar: (active) => ({
      flex: 1, height: 3, borderRadius: 2,
      background: active ? '#6ee7b7' : 'rgba(255,255,255,0.1)',
      transition: 'background 0.3s',
    }),
    label: { display: 'block', fontSize: 13, color: '#a09898', marginBottom: 6, fontWeight: 500 },
    input: {
      width: '100%', background: '#111110', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#f5f0e8',
      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
      transition: 'border-color 0.2s',
    },
    inputFocus: { borderColor: 'rgba(110,231,183,0.4)' },
    fieldGroup: { marginBottom: 14 },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 },
    error: { fontSize: 12, color: '#fca5a5', marginTop: 4 },
    helper: { fontSize: 12, color: '#6b6565', marginTop: 4 },
    btnRow: { display: 'flex', gap: 10, marginTop: 20 },
    btn: (primary) => ({
      flex: 1, border: primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '11px 0', fontSize: 14, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
      background: primary ? '#6ee7b7' : 'transparent',
      color: primary ? '#111' : '#a09898',
    }),
    footer: { marginTop: 20, textAlign: 'center', fontSize: 13, color: '#6b6565' },
    footerLink: { color: '#6ee7b7', textDecoration: 'none' },
    legal: { marginTop: 24, textAlign: 'center', fontSize: 12, color: '#4a4545' },
    legalLink: { color: '#6b6565', textDecoration: 'none' },
  };

  const [focusedField, setFocusedField] = useState(null);
  const inputProps = (name) => ({
    style: {
      ...S.input,
      ...(focusedField === name ? S.inputFocus : {}),
      ...(errors[name] ? { borderColor: 'rgba(252,165,165,0.5)' } : {}),
    },
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
  });

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div style={S.page}>
        <motion.div
          style={S.wrap}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Link to="/" style={{ fontSize: 13, color: '#6b6565', textDecoration: 'none' }}>
              ← Back to CodeArc
            </Link>
          </div>

          <div style={S.logoWrap}>
            <img src="/logo512.png" alt="CodeArc" style={S.logoMark} />
            <div style={S.logoBrand}>CodeArc</div>
            <div style={S.logoTagline}>Learning Platform</div>
          </div>
          <h1 style={S.heading}>Create your account</h1>
          <p style={S.sub}>Free forever. No credit card needed.</p>

          <div style={S.card}>
            {/* Step indicators */}
            <div style={S.steps}>
              <div style={S.stepBar(currentStep >= 1)} />
              <div style={S.stepBar(currentStep >= 2)} />
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  <div style={S.row2}>
                    <div>
                      <label style={S.label}>First name</label>
                      <input name="firstName" type="text" placeholder="Jane" value={formData.firstName} onChange={handleChange} {...inputProps('firstName')} />
                      {errors.firstName && <div style={S.error}>{errors.firstName}</div>}
                    </div>
                    <div>
                      <label style={S.label}>Last name</label>
                      <input name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange} {...inputProps('lastName')} />
                      {errors.lastName && <div style={S.error}>{errors.lastName}</div>}
                    </div>
                  </div>
                  <motion.button type="button" style={S.btn(true)} whileHover={{ background: '#a7f3d0' }} onClick={handleNext}>
                    Continue →
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Email address</label>
                    <input name="email" type="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange} {...inputProps('email')} />
                    {errors.email && <div style={S.error}>{errors.email}</div>}
                  </div>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Password</label>
                    <input name="password" type="password" placeholder="At least 8 characters" value={formData.password} onChange={handleChange} {...inputProps('password')} />
                    {errors.password && <div style={S.error}>{errors.password}</div>}
                  </div>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Confirm password</label>
                    <input name="confirmPassword" type="password" placeholder="Same password again" value={formData.confirmPassword} onChange={handleChange} {...inputProps('confirmPassword')} />
                    {errors.confirmPassword && <div style={S.error}>{errors.confirmPassword}</div>}
                  </div>
                  <div style={S.btnRow}>
                    <motion.button type="button" style={S.btn(false)} whileHover={{ color: '#f5f0e8' }} onClick={handleBack}>
                      ← Back
                    </motion.button>
                    <motion.button type="submit" style={{ ...S.btn(true), opacity: loading ? 0.7 : 1 }} whileHover={{ background: loading ? '#6ee7b7' : '#a7f3d0' }} disabled={loading}>
                      {loading ? 'Creating…' : 'Create account'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>

            <div style={S.footer}>
              Already have an account?{' '}
              <Link to="/login" style={S.footerLink}>Sign in</Link>
            </div>
          </div>

          <p style={S.legal}>
            By creating an account you agree to our{' '}
            <Link to="/terms" style={S.legalLink}>Terms</Link>
            {' & '}
            <Link to="/privacy" style={S.legalLink}>Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;