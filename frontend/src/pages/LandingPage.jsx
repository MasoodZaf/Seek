/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   SEEK — Landing Page
   Aesthetic: Warm studio dark · editorial · human-proportioned
   Palette: Slate-black · warm ivory · sage green · amber
   Fonts: Fraunces (serif display) · DM Sans (body) · JetBrains Mono (code)
───────────────────────────────────────────────────────── */

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #111110;
    --bg-2:        #17171a;
    --bg-3:        #1e1e24;
    --border:      rgba(255,255,255,0.08);
    --border-2:    rgba(255,255,255,0.14);
    --text:        #f5f0e8;
    --text-2:      #a09898;
    --text-3:      #6b6565;
    --green:       #6ee7b7;
    --green-dim:   rgba(110,231,183,0.12);
    --green-glow:  rgba(110,231,183,0.25);
    --amber:       #fbbf24;
    --amber-dim:   rgba(251,191,36,0.10);
    --blue:        #93c5fd;
    --purple:      #c4b5fd;
    --red:         #fca5a5;
  }

  .lp {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Scrollbar ── */
  .lp ::-webkit-scrollbar { width: 6px; }
  .lp ::-webkit-scrollbar-track { background: var(--bg); }
  .lp ::-webkit-scrollbar-thumb { background: var(--bg-3); border-radius: 3px; }

  /* ── Nav ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    transition: background 0.3s, border-color 0.3s;
  }
  .lp-nav.stuck {
    background: rgba(17,17,16,0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .lp-logo {
    display: flex; align-items: center; gap: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 20px;
    color: var(--text); text-decoration: none;
    letter-spacing: -0.02em;
  }
  .lp-logo-mark {
    width: 44px; height: 44px; border-radius: 12px;
    background: transparent;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 18px rgba(110,231,183,0.22), 0 4px 12px rgba(0,0,0,0.4);
    border: 1px solid rgba(110,231,183,0.18);
  }
  .lp-nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  .lp-nav-links a {
    font-size: 14px; font-weight: 400; color: var(--text-2);
    text-decoration: none; transition: color 0.2s;
  }
  .lp-nav-links a:hover { color: var(--text); }
  .lp-nav-actions { display: flex; align-items: center; gap: 12px; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px; font-size: 14px;
    font-weight: 500; cursor: pointer; border: none;
    text-decoration: none; transition: all 0.2s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-ghost {
    background: transparent; color: var(--text-2);
    border: 1px solid transparent;
  }
  .btn-ghost:hover { color: var(--text); background: rgba(255,255,255,0.05); }
  .btn-outline {
    background: transparent; color: var(--text);
    border: 1px solid var(--border-2);
  }
  .btn-outline:hover { background: rgba(255,255,255,0.05); }
  .btn-primary {
    background: var(--green); color: #111;
    border: 1px solid var(--green);
    font-weight: 600;
  }
  .btn-primary:hover {
    background: #a7f3d0;
    border-color: #a7f3d0;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px var(--green-glow);
  }
  .btn-sm { padding: 7px 14px; font-size: 13px; }
  .btn-lg { padding: 13px 28px; font-size: 15px; border-radius: 10px; }

  /* ── Section wrapper ── */
  .lp-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* ── Hero ── */
  .lp-hero {
    padding-top: 120px;
    padding-bottom: 80px;
  }
  .lp-hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  .lp-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: 100px;
    background: var(--green-dim);
    border: 1px solid rgba(110,231,183,0.2);
    font-size: 12px; font-weight: 500;
    color: var(--green); margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.02em;
  }
  .lp-hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .lp-headline {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    font-size: 52px;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 20px;
  }
  .lp-headline em {
    font-style: italic;
    font-weight: 400;
    color: var(--green);
  }
  .lp-hero-sub {
    font-size: 17px;
    line-height: 1.65;
    color: var(--text-2);
    max-width: 420px;
    margin-bottom: 36px;
    font-weight: 300;
  }
  .lp-hero-ctas {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .lp-hero-note {
    margin-top: 20px;
    font-size: 13px; color: var(--text-3);
    display: flex; align-items: center; gap: 6px;
  }
  .lp-hero-note svg { flex-shrink: 0; }

  /* ── Code editor widget ── */
  @keyframes slideInLine {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes livePulse {
    0%, 100% { transform: scale(1);   opacity: 1;   }
    50%      { transform: scale(1.5); opacity: 0.5; }
  }
  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 0   rgba(251,191,36,0.6); }
    50%      { box-shadow: 0 0 0 4px rgba(251,191,36,0);   }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes outputFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-editor {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset;
  }
  .lp-editor-bar {
    padding: 10px 16px;
    background: var(--bg-3);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 6px;
  }
  .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
  .lp-live-badge {
    display: flex; align-items: center; gap: 4px;
    margin-left: 8px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
    color: var(--green);
    font-family: 'JetBrains Mono', monospace;
  }
  .lp-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    animation: livePulse 1.4s ease-in-out infinite;
  }
  .lp-editor-tabs {
    margin-left: auto;
    display: flex; gap: 2px;
  }
  .lp-tab {
    padding: 3px 10px; border-radius: 4px; font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer; transition: all 0.2s;
    color: var(--text-3);
  }
  .lp-tab.active {
    background: rgba(110,231,183,0.12);
    color: var(--green);
  }
  .lp-editor-body {
    padding: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    min-height: 220px;
  }
  .lp-code-line {
    min-height: 1.7em;
    opacity: 0;
  }
  .lp-code-line.visible {
    animation: slideInLine 0.18s ease forwards;
  }
  .lp-editor-footer {
    padding: 10px 16px;
    background: var(--bg-3);
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .lp-run-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 6px;
    background: var(--green); color: #111;
    font-size: 12px; font-weight: 600;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    min-width: 62px; justify-content: center;
  }
  .lp-run-btn:hover:not(:disabled) { background: #a7f3d0; transform: scale(1.03); }
  .lp-run-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .lp-spinner {
    width: 10px; height: 10px; border-radius: 50%;
    border: 1.5px solid rgba(0,0,0,0.25);
    border-top-color: #111;
    animation: spin 0.55s linear infinite;
    flex-shrink: 0;
  }
  .lp-output-label {
    font-size: 11px; color: var(--text-3);
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 5px;
  }
  .lp-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--text-3); flex-shrink: 0;
    display: inline-block;
  }
  .lp-status-dot.green { background: var(--green); }
  .lp-status-dot.amber {
    background: #fbbf24;
    animation: statusPulse 0.75s ease-in-out infinite;
  }
  .lp-output {
    padding: 12px 20px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--green);
    border-top: 1px solid var(--border);
    background: rgba(0,0,0,0.2);
    animation: outputFadeIn 0.2s ease;
  }
  .lp-cursor {
    display: inline-block; width: 2px; height: 1em;
    background: var(--green); vertical-align: text-bottom;
    margin-left: 1px;
    animation: blink 1.1s step-end infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* Syntax */
  .kw  { color: var(--purple); }
  .fn  { color: var(--blue); }
  .str { color: var(--green); }
  .num { color: var(--amber); }
  .cmt { color: var(--text-3); font-style: italic; }
  .ty  { color: #fb923c; }
  .op  { color: var(--text-2); }

  /* ── Divider ── */
  .lp-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 64px 0;
  }

  /* ── Stats strip ── */
  .lp-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    background: var(--bg-2);
  }
  .lp-stat {
    padding: 28px 24px;
    border-right: 1px solid var(--border);
    transition: background 0.2s;
  }
  .lp-stat:last-child { border-right: none; }
  .lp-stat:hover { background: rgba(255,255,255,0.02); }
  .lp-stat-num {
    font-family: 'Fraunces', serif;
    font-size: 36px; font-weight: 600;
    color: var(--text);
    line-height: 1;
    margin-bottom: 6px;
  }
  .lp-stat-num span { color: var(--green); }
  .lp-stat-label {
    font-size: 13px; color: var(--text-3);
    font-weight: 400;
  }

  /* ── Section heading ── */
  .lp-section-label {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--green);
    margin-bottom: 12px;
    font-family: 'JetBrains Mono', monospace;
  }
  .lp-section-title {
    font-family: 'Fraunces', serif;
    font-size: 38px; font-weight: 600;
    line-height: 1.15; letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 16px;
  }
  .lp-section-title em {
    font-style: italic; font-weight: 400; color: var(--text-2);
  }
  .lp-section-sub {
    font-size: 16px; color: var(--text-2);
    line-height: 1.65; max-width: 520px;
    font-weight: 300;
  }

  /* ── Features ── */
  .lp-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .lp-feature {
    background: var(--bg-2);
    padding: 28px 24px;
    transition: background 0.2s;
  }
  .lp-feature:hover { background: var(--bg-3); }
  .lp-feature-icon {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    background: var(--green-dim);
    color: var(--green);
    font-size: 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(110,231,183,0.15);
  }
  .lp-feature-title {
    font-size: 15px; font-weight: 600;
    color: var(--text); margin-bottom: 8px;
  }
  .lp-feature-desc {
    font-size: 13px; color: var(--text-2);
    line-height: 1.6; font-weight: 300;
  }

  /* ── Languages ── */
  .lp-langs {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin-top: 32px;
  }
  .lp-lang {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 8px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    font-size: 13px; font-weight: 500; color: var(--text-2);
    transition: all 0.15s;
    cursor: default;
  }
  .lp-lang:hover {
    border-color: var(--border-2);
    color: var(--text);
    background: var(--bg-3);
  }
  .lp-lang-dot {
    width: 7px; height: 7px; border-radius: 50%;
  }

  /* ── How it works ── */
  .lp-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .lp-step { position: relative; }
  .lp-step-num {
    font-family: 'Fraunces', serif;
    font-size: 48px; font-weight: 300;
    color: var(--bg-3);
    line-height: 1;
    margin-bottom: 16px;
    user-select: none;
  }
  .lp-step-title {
    font-size: 16px; font-weight: 600;
    color: var(--text); margin-bottom: 8px;
  }
  .lp-step-desc {
    font-size: 14px; color: var(--text-2);
    line-height: 1.65; font-weight: 300;
  }
  .lp-step-connector {
    position: absolute; top: 24px; right: -18px;
    color: var(--text-3); font-size: 18px;
    pointer-events: none;
  }

  /* ── CTA section ── */
  .lp-cta-box {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 64px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .lp-cta-box::before {
    content: '';
    position: absolute;
    top: -80px; left: 50%; transform: translateX(-50%);
    width: 400px; height: 200px;
    background: radial-gradient(ellipse, var(--green-glow) 0%, transparent 70%);
    pointer-events: none;
  }
  .lp-cta-title {
    font-family: 'Fraunces', serif;
    font-size: 44px; font-weight: 600;
    line-height: 1.15; letter-spacing: -0.02em;
    margin-bottom: 16px; position: relative;
  }
  .lp-cta-sub {
    font-size: 16px; color: var(--text-2);
    font-weight: 300; margin-bottom: 36px;
    position: relative;
  }
  .lp-cta-actions {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; position: relative;
  }

  /* ── Footer ── */
  .lp-footer {
    border-top: 1px solid var(--border);
    padding: 40px 0;
  }
  .lp-footer-inner {
    display: flex; align-items: center; justify-content: space-between;
  }
  .lp-footer-links {
    display: flex; gap: 24px; list-style: none;
  }
  .lp-footer-links a {
    font-size: 13px; color: var(--text-3);
    text-decoration: none; transition: color 0.2s;
  }
  .lp-footer-links a:hover { color: var(--text-2); }
  .lp-footer-copy {
    font-size: 13px; color: var(--text-3);
  }

  /* ── Reveal animation ── */
  .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .lp-hero-inner { grid-template-columns: 1fr; gap: 48px; }
    .lp-editor { display: none; }
    .lp-headline { font-size: 40px; }
    .lp-features-grid { grid-template-columns: 1fr 1fr; }
    .lp-steps { grid-template-columns: 1fr; gap: 24px; }
    .lp-testimonials { grid-template-columns: 1fr; }
    .lp-stats { grid-template-columns: 1fr 1fr; }
    .lp-cta-box { padding: 40px 24px; }
    .lp-cta-title { font-size: 32px; }
    .lp-nav-links { display: none; }
  }
  @media (max-width: 600px) {
    .lp-section { padding: 0 20px; }
    .lp-features-grid { grid-template-columns: 1fr; }
    .lp-stats { grid-template-columns: 1fr 1fr; }
    .lp-hero { padding-top: 100px; padding-bottom: 60px; }
  }
`;

// ── Language colours ───────────────────────────────────────
const LANGS = [
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'Python',     color: '#3776ab' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Java',       color: '#f89820' },
  { name: 'Go',         color: '#00add8' },
  { name: 'Rust',       color: '#ce422b' },
  { name: 'C++',        color: '#00599c' },
  { name: 'C',          color: '#a8b9cc' },
  { name: 'PHP',        color: '#777bb4' },
  { name: 'Ruby',       color: '#cc342d' },
  { name: 'Kotlin',     color: '#7f52ff' },
  { name: 'Swift',      color: '#f05138' },
];

// ── Code snippets for each tab ─────────────────────────────
const SNIPPETS = {
  JS: {
    label: 'main.js',
    lines: [
      <><span className="cmt">// Fibonacci with memoisation</span></>,
      <><span className="kw">function</span> <span className="fn">fib</span><span className="op">(n, memo = </span><span className="op">{'{'}</span><span className="op">{'}'}</span><span className="op">)</span> <span className="op">{'{'}</span></>,
      <>&nbsp;&nbsp;<span className="kw">if</span> <span className="op">(</span>n <span className="op">&lt;=</span> <span className="num">1</span><span className="op">)</span> <span className="kw">return</span> n<span className="op">;</span></>,
      <>&nbsp;&nbsp;<span className="kw">if</span> <span className="op">(</span>memo<span className="op">[</span>n<span className="op">])</span> <span className="kw">return</span> memo<span className="op">[</span>n<span className="op">];</span></>,
      <>&nbsp;&nbsp;memo<span className="op">[</span>n<span className="op">]</span> <span className="op">=</span> <span className="fn">fib</span><span className="op">(</span>n<span className="op">-</span><span className="num">1</span><span className="op">, </span>memo<span className="op">) +</span> <span className="fn">fib</span><span className="op">(</span>n<span className="op">-</span><span className="num">2</span><span className="op">, </span>memo<span className="op">);</span></>,
      <>&nbsp;&nbsp;<span className="kw">return</span> memo<span className="op">[</span>n<span className="op">];</span></>,
      <><span className="op">{'}'}</span></>,
      <></>,
      <>console<span className="op">.</span><span className="fn">log</span><span className="op">(</span><span className="fn">fib</span><span className="op">(</span><span className="num">10</span><span className="op">));</span></>,
    ],
    output: '55',
  },
  PY: {
    label: 'main.py',
    lines: [
      <><span className="cmt"># Binary search</span></>,
      <><span className="kw">def</span> <span className="fn">binary_search</span><span className="op">(</span>arr<span className="op">,</span> target<span className="op">):</span></>,
      <>&nbsp;&nbsp;lo<span className="op">,</span> hi <span className="op">=</span> <span className="num">0</span><span className="op">,</span> <span className="fn">len</span><span className="op">(</span>arr<span className="op">) -</span> <span className="num">1</span></>,
      <>&nbsp;&nbsp;<span className="kw">while</span> lo <span className="op">&lt;=</span> hi<span className="op">:</span></>,
      <>&nbsp;&nbsp;&nbsp;&nbsp;mid <span className="op">=</span> <span className="op">(</span>lo <span className="op">+</span> hi<span className="op">) //</span> <span className="num">2</span></>,
      <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">if</span> arr<span className="op">[</span>mid<span className="op">] ==</span> target<span className="op">:</span> <span className="kw">return</span> mid</>,
      <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">elif</span> arr<span className="op">[</span>mid<span className="op">] &lt;</span> target<span className="op">:</span> lo <span className="op">=</span> mid <span className="op">+</span> <span className="num">1</span></>,
      <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">else</span><span className="op">:</span> hi <span className="op">=</span> mid <span className="op">-</span> <span className="num">1</span></>,
      <>&nbsp;&nbsp;<span className="kw">return</span> <span className="op">-</span><span className="num">1</span></>,
    ],
    output: 'Found at index: 4',
  },
  TS: {
    label: 'types.ts',
    lines: [
      <><span className="kw">interface</span> <span className="ty">User</span> <span className="op">{'{'}</span></>,
      <>&nbsp;&nbsp;id<span className="op">:</span> <span className="ty">number</span><span className="op">;</span></>,
      <>&nbsp;&nbsp;name<span className="op">:</span> <span className="ty">string</span><span className="op">;</span></>,
      <>&nbsp;&nbsp;role<span className="op">:</span> <span className="str">'admin'</span> <span className="op">|</span> <span className="str">'learner'</span><span className="op">;</span></>,
      <><span className="op">{'}'}</span></>,
      <></>,
      <><span className="kw">const</span> greet <span className="op">=</span> <span className="op">(</span>user<span className="op">:</span> <span className="ty">User</span><span className="op">):</span> <span className="ty">string</span> <span className="op">=&gt;</span></>,
      <>&nbsp;&nbsp;<span className="str">`Hello, </span><span className="op">{'${'}</span>user<span className="op">.</span>name<span className="op">{'}'}</span><span className="str"> [</span><span className="op">{'${'}</span>user<span className="op">.</span>role<span className="op">{'}'}</span><span className="str">]`</span><span className="op">;</span></>,
      <></>,
      <>console<span className="op">.</span><span className="fn">log</span><span className="op">(</span><span className="fn">greet</span><span className="op">({'{'}</span> id<span className="op">:</span> <span className="num">1</span><span className="op">,</span> name<span className="op">:</span> <span className="str">'Alex'</span><span className="op">,</span> role<span className="op">:</span> <span className="str">'learner'</span> <span className="op">{'}'}</span><span className="op">));</span></>,
    ],
    output: 'Hello, Alex [learner]',
  },
};

// ── Code editor widget ─────────────────────────────────────
const TAB_KEYS = Object.keys(SNIPPETS);

function CodeWidget() {
  const [activeTab, setActiveTab]     = useState('JS');
  const [visibleLines, setVisibleLines] = useState(0);
  // phase: 'typing' | 'running' | 'output'
  const [phase, setPhase]             = useState('typing');
  const [outputChars, setOutputChars] = useState(0);

  const snippet = SNIPPETS[activeTab];

  // ── Reset animation when tab changes ──────────────────────
  useEffect(() => {
    setVisibleLines(0);
    setPhase('typing');
    setOutputChars(0);
  }, [activeTab]);

  // ── Reveal lines one-by-one ───────────────────────────────
  useEffect(() => {
    if (phase !== 'typing') return;
    if (visibleLines < snippet.lines.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 160);
      return () => clearTimeout(t);
    }
    // All lines shown — pause then auto-run
    const t = setTimeout(() => setPhase('running'), 700);
    return () => clearTimeout(t);
  }, [phase, visibleLines, snippet.lines.length]);

  // ── Running → output ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'running') return;
    const t = setTimeout(() => { setPhase('output'); setOutputChars(0); }, 950);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Output typewriter ─────────────────────────────────────
  useEffect(() => {
    if (phase !== 'output') return;
    if (outputChars < snippet.output.length) {
      const t = setTimeout(() => setOutputChars(c => c + 1), 55);
      return () => clearTimeout(t);
    }
  }, [phase, outputChars, snippet.output.length]);

  // ── Auto-cycle to next tab ────────────────────────────────
  useEffect(() => {
    // Total time ≈ lines×160 + 700 + 950 + output×55 + 2200 hold
    const total =
      snippet.lines.length * 160 + 700 + 950 +
      snippet.output.length * 55 + 2200;
    const t = setTimeout(() => {
      setActiveTab(prev => {
        const idx = TAB_KEYS.indexOf(prev);
        return TAB_KEYS[(idx + 1) % TAB_KEYS.length];
      });
    }, total);
    return () => clearTimeout(t);
  }, [activeTab, snippet.lines.length, snippet.output.length]);

  // ── Manual run ────────────────────────────────────────────
  const handleRun = () => {
    setPhase('running');
    setOutputChars(0);
  };

  const isTyping  = phase === 'typing';
  const isRunning = phase === 'running';
  const isDone    = phase === 'output';

  return (
    <div className="lp-editor">
      {/* ── Title bar ── */}
      <div className="lp-editor-bar">
        <div className="lp-dot" style={{ background: '#ff5f57' }} />
        <div className="lp-dot" style={{ background: '#febc2e' }} />
        <div className="lp-dot" style={{ background: '#28c840' }} />
        <div className="lp-live-badge">
          <span className="lp-live-dot" />
          LIVE
        </div>
        <div className="lp-editor-tabs">
          {Object.entries(SNIPPETS).map(([key, s]) => (
            <div
              key={key}
              className={`lp-tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Code body ── */}
      <div className="lp-editor-body">
        {snippet.lines.map((line, i) => (
          <div
            key={`${activeTab}-${i}`}
            className={`lp-code-line${i < visibleLines ? ' visible' : ''}`}
          >
            {line}
            {/* blinking cursor on the last typed line */}
            {isTyping && i === visibleLines - 1 && (
              <span className="lp-cursor" style={{ animation: 'cursorBlink 0.8s step-end infinite' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="lp-editor-footer">
        <span className="lp-output-label">
          <span className={`lp-status-dot${isDone ? ' green' : isRunning ? ' amber' : ''}`} />
          {isDone ? 'output' : isRunning ? 'running…' : 'ready'}
        </span>
        <button
          className="lp-run-btn"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning
            ? <><span className="lp-spinner" /> Running</>
            : <><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6V0z"/></svg> Run</>
          }
        </button>
      </div>

      {/* ── Output panel ── */}
      {(isRunning || isDone) && (
        <div className="lp-output">
          <span style={{ color: 'var(--text-3)' }}>$ </span>
          {isRunning
            ? <><span style={{ opacity: 0.45 }}>executing…</span><span className="lp-cursor" style={{ animation: 'cursorBlink 0.6s step-end infinite' }} /></>
            : <>
                {snippet.output.slice(0, outputChars)}
                {outputChars < snippet.output.length && (
                  <span className="lp-cursor" style={{ animation: 'cursorBlink 0.8s step-end infinite' }} />
                )}
              </>
          }
        </div>
      )}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const dur = 1200, start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Reveal on scroll ──────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Main page ──────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="lp">

        {/* ── Nav ── */}
        <nav className={`lp-nav${scrolled ? ' stuck' : ''}`}>
          <a href="/" className="lp-logo">
            <div className="lp-logo-mark">
              <img src="/logo192.png" alt="CodeArc" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            CodeArc
          </a>
          <ul className="lp-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#languages">Languages</a></li>
            <li><a href="#how-it-works">How it works</a></li>
          </ul>
          <div className="lp-nav-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started free</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="lp-section lp-hero">
          <div className="lp-hero-inner">
            <div>
              <div className="lp-hero-badge reveal">
                <div className="lp-hero-badge-dot" />
                12 languages · Docker sandboxed
              </div>
              <h1 className="lp-headline reveal reveal-delay-1">
                Learn the craft.<br />
                Master the art.<br />
                Shape the <em>future</em>.
              </h1>
              <p className="lp-hero-sub reveal reveal-delay-2">
                CodeArc is a coding playground and learning platform where you can
                write, run, and debug real code in 12 languages — right in
                your browser, no setup required.
              </p>
              <div className="lp-hero-ctas reveal reveal-delay-3">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start for free
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7h10M7 2l5 5-5 5"/></svg>
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">Sign in</Link>
              </div>
              <p className="lp-hero-note reveal reveal-delay-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="6"/><path d="M7 4v4l2.5 2"/></svg>
                Free to use · No credit card
              </p>
            </div>
            <div className="reveal reveal-delay-2">
              <CodeWidget />
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="lp-section" style={{ paddingBottom: 64 }}>
          <div className="lp-stats reveal">
            <div className="lp-stat">
              <div className="lp-stat-num"><Counter to={12} /><span>+</span></div>
              <div className="lp-stat-label">Languages supported</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-num"><Counter to={50} /><span>+</span></div>
              <div className="lp-stat-label">Structured tutorials</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-num"><Counter to={100} /><span>ms</span></div>
              <div className="lp-stat-label">Avg execution time</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-num"><Counter to={0} /><span> setup</span></div>
              <div className="lp-stat-label">Zero config required</div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="lp-section" id="features" style={{ paddingBottom: 80 }}>
          <div className="reveal" style={{ marginBottom: 40 }}>
            <div className="lp-section-label">Features</div>
            <h2 className="lp-section-title">Everything you need to<br /><em>actually learn</em></h2>
            <p className="lp-section-sub">
              Not another video course. CodeArc is built around doing — write real code,
              see real output, understand what went wrong.
            </p>
          </div>
          <div className="lp-features-grid">
            {[
              {
                icon: '▶',
                title: 'Live code execution',
                desc: 'Run code instantly in a Docker-sandboxed environment. Every language, zero risk to your machine.',
              },
              {
                icon: '📖',
                title: 'Structured tutorials',
                desc: 'Step-by-step lessons with embedded editors. Learn concepts, practice in the same view.',
              },
              {
                icon: '⚔',
                title: 'Coding challenges',
                desc: 'Test yourself with progressively harder problems. Track your score and revisit weak spots.',
              },
              {
                icon: '🔄',
                title: 'Language translator',
                desc: 'Paste code in one language, see the equivalent in another. Great for polyglots.',
              },
              {
                icon: '📊',
                title: 'Progress tracking',
                desc: "See exactly where you are, what you've completed, and what needs more practice.",
              },
              {
                icon: '🎮',
                title: 'Learning games',
                desc: 'Gamified exercises that make grinding through fundamentals actually enjoyable.',
              },
            ].map((f, i) => (
              <div key={i} className={`lp-feature reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="lp-feature-icon">{f.icon}</div>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Languages ── */}
        <section className="lp-section" id="languages" style={{ paddingBottom: 80 }}>
          <div className="reveal" style={{ marginBottom: 0 }}>
            <div className="lp-section-label">Languages</div>
            <h2 className="lp-section-title">Code in your language,<br /><em>or discover a new one</em></h2>
          </div>
          <div className="lp-langs reveal reveal-delay-1">
            {LANGS.map(l => (
              <div key={l.name} className="lp-lang">
                <div className="lp-lang-dot" style={{ background: l.color }} />
                {l.name}
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="lp-section" id="how-it-works" style={{ paddingBottom: 80 }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <div className="lp-section-label">How it works</div>
            <h2 className="lp-section-title">From zero to running<br /><em>in under a minute</em></h2>
          </div>
          <div className="lp-steps">
            {[
              {
                n: '01',
                title: 'Create a free account',
                desc: 'Sign up in seconds. No credit card, no email verification loop, no setup wizard.',
              },
              {
                n: '02',
                title: 'Open the playground',
                desc: 'Choose a language, paste or write your code, and hit run. Output appears immediately.',
              },
              {
                n: '03',
                title: 'Follow a learning path',
                desc: 'Pick a structured tutorial track. Each lesson builds on the last, with practice built in.',
              },
            ].map((s, i) => (
              <div key={i} className={`lp-step reveal reveal-delay-${i + 1}`} style={{ position: 'relative' }}>
                {i < 2 && <div className="lp-step-connector">→</div>}
                <div className="lp-step-num">{s.n}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-section" style={{ paddingBottom: 80 }}>
          <div className="lp-cta-box reveal">
            <h2 className="lp-cta-title">
              Stop reading about coding.<br />Start doing it.
            </h2>
            <p className="lp-cta-sub">
              Free to use. Open in your browser. Working in 30 seconds.
            </p>
            <div className="lp-cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create free account
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7h10M7 2l5 5-5 5"/></svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">I have an account</Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="lp-footer">
          <div className="lp-section">
            <div className="lp-footer-inner">
              <a href="/" className="lp-logo" style={{ fontSize: 15 }}>
                <div className="lp-logo-mark" style={{ width: 26, height: 26, overflow: 'hidden', borderRadius: 6 }}>
                  <img src="/logo192.png" alt="CodeArc" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                CodeArc
              </a>
              <ul className="lp-footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#languages">Languages</a></li>
                <li><Link to="/login">Sign in</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
              <p className="lp-footer-copy">© {new Date().getFullYear()} CodeArc</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
