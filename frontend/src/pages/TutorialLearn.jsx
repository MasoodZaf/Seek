/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  CodeBracketIcon,
  LightBulbIcon,
  CheckCircleIcon,
  PlayIcon,
  HomeIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import EnhancedCodeEditor from '../components/CodeEditor/EnhancedCodeEditor.jsx';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const normaliseSteps = (tutorial) => {
  const raw = tutorial?.steps || tutorial?.lessons || [];
  return raw.map((s, i) => ({ ...s, _idx: i }));
};

/* ─── sub-components ──────────────────────────────────────────────────────── */

const SectionHeader = ({ icon, title, subtitle, color = 'blue' }) => {
  const colors = {
    blue:   'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green:  'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red:    'bg-red-100 text-red-600',
  };
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};

const CodeBlock = ({ code, language = 'javascript', explanation, onRun }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-gray-900 flex items-center justify-between px-4 py-2.5">
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">{language}</span>
        {onRun && (
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md transition-colors"
          >
            <PlayIcon className="h-3.5 w-3.5" /> Run
          </button>
        )}
      </div>
      <pre className="bg-gray-900 p-4 overflow-x-auto text-sm font-mono text-green-300 leading-relaxed">
        <code>{code}</code>
      </pre>
      {explanation && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
};

const HintCard = ({ hints }) => {
  const [revealed, setRevealed] = useState(0);
  if (!hints?.length) return null;
  return (
    <div className="border border-yellow-200 rounded-xl bg-yellow-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <LightBulbIcon className="h-5 w-5 text-yellow-500" />
        <span className="font-semibold text-yellow-800 text-sm">Hints</span>
        <span className="text-xs text-yellow-600">({revealed}/{hints.length} revealed)</span>
      </div>
      <div className="space-y-2">
        {hints.slice(0, revealed).map((h, i) => (
          <div key={i} className="text-sm text-yellow-900 bg-yellow-100 rounded-lg px-3 py-2">
            💡 {typeof h === 'object' ? h.hint : h}
          </div>
        ))}
      </div>
      {revealed < hints.length && (
        <button
          onClick={() => setRevealed(r => r + 1)}
          className="mt-3 text-sm text-yellow-700 hover:text-yellow-900 font-medium flex items-center gap-1"
        >
          <ChevronDownIcon className="h-4 w-4" /> Reveal next hint
        </button>
      )}
    </div>
  );
};

/* ─── main component ───────────────────────────────────────────────────────── */

const TutorialLearn = () => {
  const { id } = useParams();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [tutorial, setTutorial] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [practiceCode, setPracticeCode] = useState('');
  const [practiceOutput, setPracticeOutput] = useState(null);
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeOutput, setChallengeOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  /* fetch tutorial */
  useEffect(() => {
    const fetchTutorial = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/mongo-tutorials/${id}`);
        const t = res.data?.data?.tutorial;
        if (!t) throw new Error('Tutorial data not found in response');
        setTutorial(t);
        const s = normaliseSteps(t);
        setSteps(s);
        if (s.length > 0) {
          const practice = s[0].practicePhase?.starterCode || s[0].practice?.starterCode || s[0].codeExamples?.[0]?.code || '// Start coding here\n';
          setPracticeCode(practice);
          const challenge = s[0].challengePhase?.starterCode || s[0].challenge?.starterCode || '';
          setChallengeCode(challenge);
        }
      } catch (err) {
        console.error('Failed to fetch tutorial:', err);
        setError(err.message || 'Could not load tutorial');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorial();
  }, [id]);

  /* update code when step changes */
  useEffect(() => {
    if (!steps.length) return;
    const s = steps[stepIdx];
    setPracticeCode(s?.practicePhase?.starterCode || s?.practice?.starterCode || s?.codeExamples?.[0]?.code || '// Start coding here\n');
    setChallengeCode(s?.challengePhase?.starterCode || s?.challenge?.starterCode || '');
    setPracticeOutput(null);
    setChallengeOutput(null);
  }, [stepIdx, steps]);

  const runCode = useCallback(async (code, setter) => {
    if (!code.trim()) return;
    setIsRunning(true);
    setter(null);
    try {
      const res = await api.post('/code/execute', {
        code,
        language: tutorial?.language || 'javascript',
      });
      if (res.data.success) {
        setter({ success: true, output: res.data.data.output, time: res.data.data.executionTime });
      } else {
        setter({ success: false, error: res.data.error || 'Execution failed' });
      }
    } catch (e) {
      setter({ success: false, error: e.response?.data?.message || 'Execution error' });
    } finally {
      setIsRunning(false);
    }
  }, [tutorial]);

  const markComplete = useCallback((idx = stepIdx) => {
    setCompleted(prev => new Set([...prev, idx]));
  }, [stepIdx]);

  const goNext = () => {
    markComplete();
    if (stepIdx < steps.length - 1) {
      setStepIdx(i => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (stepIdx > 0) {
      setStepIdx(i => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ── loading / error states ─────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading tutorial…</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'This tutorial could not be loaded. It may not exist or is temporarily unavailable.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <ArrowPathIcon className="h-4 w-4" /> Retry
            </button>
            <Link
              to="/tutorials"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Tutorials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Lessons Yet</h1>
          <p className="text-gray-500 mb-6">This tutorial has no lessons yet. Check back soon!</p>
          <Link to="/tutorials" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const step = steps[stepIdx];
  const progress = Math.round(((completed.size) / steps.length) * 100);
  const isLastStep = stepIdx === steps.length - 1;

  /* practice/challenge data */
  const practiceInstructions = step.practicePhase?.instructions || step.practice?.instructions;
  const practiceHints = step.practicePhase?.hints || step.practice?.hints || step.hints || [];
  const challengeStatement = step.challengePhase?.problemStatement || step.challenge?.problemStatement;
  const challengeRequirements = step.challengePhase?.requirements || step.challenge?.requirements || [];

  const hasPractice = !!(practiceInstructions || step.practicePhase?.starterCode || step.practice?.starterCode);
  const hasChallenge = !!(challengeStatement || step.challengePhase || step.challenge);

  const OutputPanel = ({ result }) => {
    if (!result) return null;
    return (
      <div className={`mt-3 rounded-xl p-4 font-mono text-sm ${result.success ? 'bg-gray-900' : 'bg-red-50 border border-red-200'}`}>
        {result.success ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleSolid className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-xs font-sans">Output {result.time ? `· ${result.time}ms` : ''}</span>
            </div>
            <pre className="text-green-300 whitespace-pre-wrap">{result.output || '(no output)'}</pre>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
              <span className="text-red-600 text-xs font-sans">Error</span>
            </div>
            <pre className="text-red-700 whitespace-pre-wrap">{result.error}</pre>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className={`sticky top-0 z-20 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            to={`/tutorials/${tutorial.slug || id}`}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <HomeIcon className="h-4 w-4" />
          </Link>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{tutorial.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`h-1.5 rounded-full flex-1 max-w-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-1.5 bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Step {stepIdx + 1}/{steps.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSidebar(s => !s)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
            >
              All Steps
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Sidebar overlay (all steps) ─────────────────────────────────────── */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30"
              onClick={() => setShowSidebar(false)}
            />
            <motion.div
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed left-0 top-0 bottom-0 w-72 z-40 overflow-y-auto shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>All Steps</h3>
                  <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="space-y-1.5">
                  {steps.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setStepIdx(i); setShowSidebar(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
                        i === stepIdx
                          ? 'bg-indigo-600 text-white'
                          : completed.has(i)
                          ? isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-800'
                          : isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === stepIdx ? 'bg-white text-indigo-600' :
                        completed.has(i) ? 'bg-green-500 text-white' :
                        isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {completed.has(i) && i !== stepIdx ? '✓' : i + 1}
                      </div>
                      <span className="text-sm leading-snug">{s.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Step badge + title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wide">
                  Step {stepIdx + 1} of {steps.length}
                </span>
                {completed.has(stepIdx) && (
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Completed</span>
                )}
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {step.title}
              </h1>
              {step.description && (
                <p className={`mt-2 text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{step.description}</p>
              )}
            </div>

            {/* ── 1. LEARN — Concept Explanation ─────────────────────────── */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <SectionHeader
                icon={<BookOpenIcon className="h-5 w-5" />}
                title="Concept Explanation"
                subtitle="Read and understand before you code"
                color="blue"
              />
              <div className={`prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {step.learnPhase?.conceptExplanation || step.content || 'No explanation provided for this step.'}
              </div>

              {/* Key Points */}
              {(step.learnPhase?.keyPoints || []).length > 0 && (
                <div className={`mt-5 rounded-xl p-4 ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50'}`}>
                  <p className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    💡 Key Takeaways
                  </p>
                  <ul className="space-y-1.5">
                    {step.learnPhase.keyPoints.map((pt, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-blue-500 font-bold mt-0.5">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Real world example */}
              {step.learnPhase?.realWorldExample && (
                <div className={`mt-4 border-l-4 border-green-500 pl-4 py-3 rounded-r-xl ${isDarkMode ? 'bg-green-900/10' : 'bg-green-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <GlobeAltIcon className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Real-World Analogy</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{step.learnPhase.realWorldExample}</p>
                </div>
              )}

              {/* Common mistakes */}
              {(step.learnPhase?.commonMistakes || []).length > 0 && (
                <div className={`mt-4 border-l-4 border-red-400 pl-4 py-3 rounded-r-xl ${isDarkMode ? 'bg-red-900/10' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Common Mistakes to Avoid</span>
                  </div>
                  <ul className="space-y-1">
                    {step.learnPhase.commonMistakes.map((m, i) => (
                      <li key={i} className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>• {m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── 2. CODE EXAMPLES ─────────────────────────────────────────── */}
            {(step.codeExamples || []).length > 0 && (
              <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <SectionHeader
                  icon={<CodeBracketIcon className="h-5 w-5" />}
                  title="Code Examples"
                  subtitle="Study the examples before trying yourself"
                  color="purple"
                />
                <div className="space-y-5">
                  {step.codeExamples.map((ex, i) => (
                    <div key={i}>
                      {ex.title && (
                        <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Example {i + 1}{ex.title ? `: ${ex.title}` : ''}
                        </p>
                      )}
                      <CodeBlock
                        code={ex.code}
                        language={ex.language || tutorial.language || 'javascript'}
                        explanation={ex.explanation}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 3. PRACTICE ──────────────────────────────────────────────── */}
            {hasPractice && (
              <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <SectionHeader
                  icon={<PlayIcon className="h-5 w-5" />}
                  title="Practice"
                  subtitle="Apply what you just learned"
                  color="green"
                />

                {/* Step-by-step instructions */}
                {Array.isArray(practiceInstructions) && practiceInstructions.length > 0 && (
                  <div className="mb-5 space-y-2">
                    {practiceInstructions.map((instr, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                        <div className="w-7 h-7 shrink-0 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                          {typeof instr === 'object' ? instr.step : i + 1}
                        </div>
                        <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {typeof instr === 'object' ? instr.instruction : instr}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {typeof practiceInstructions === 'string' && (
                  <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{practiceInstructions}</p>
                )}

                {/* Code editor */}
                <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 280 }}>
                  <EnhancedCodeEditor
                    code={practiceCode}
                    onChange={setPracticeCode}
                    language={tutorial.language || 'javascript'}
                    className="h-full"
                  />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => runCode(practiceCode, setPracticeOutput)}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {isRunning ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <PlayIcon className="h-4 w-4" />}
                    {isRunning ? 'Running…' : 'Run Code'}
                  </button>
                  <button
                    onClick={() => {
                      const starter = step.practicePhase?.starterCode || step.practice?.starterCode || '// Start coding here\n';
                      setPracticeCode(starter);
                      setPracticeOutput(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Reset
                  </button>
                </div>

                <OutputPanel result={practiceOutput} />
                <HintCard hints={practiceHints} />
              </div>
            )}

            {/* ── 4. CHALLENGE ─────────────────────────────────────────────── */}
            {hasChallenge && (
              <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800 border border-orange-900' : 'bg-white border border-orange-200 shadow-sm'}`}>
                <SectionHeader
                  icon={<CheckCircleIcon className="h-5 w-5" />}
                  title="Challenge Yourself"
                  subtitle="A harder problem to test your understanding"
                  color="orange"
                />

                {challengeStatement && (
                  <div className={`mb-4 p-4 rounded-xl ${isDarkMode ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50'}`}>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-orange-200' : 'text-orange-900'}`}>{challengeStatement}</p>
                  </div>
                )}

                {challengeRequirements.length > 0 && (
                  <div className="mb-4">
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Requirements</p>
                    <ul className="space-y-1">
                      {challengeRequirements.map((r, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-orange-500 mt-0.5">▸</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 280 }}>
                  <EnhancedCodeEditor
                    code={challengeCode}
                    onChange={setChallengeCode}
                    language={tutorial.language || 'javascript'}
                    className="h-full"
                  />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => runCode(challengeCode, setChallengeOutput)}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {isRunning ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <PlayIcon className="h-4 w-4" />}
                    {isRunning ? 'Running…' : 'Run Code'}
                  </button>
                </div>

                <OutputPanel result={challengeOutput} />
              </div>
            )}

            {/* ── Navigation ─────────────────────────────────────────────────── */}
            <div className={`rounded-2xl p-5 flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
              <button
                onClick={goPrev}
                disabled={stepIdx === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" /> Previous
              </button>

              <div className="text-center">
                {!completed.has(stepIdx) && (
                  <button
                    onClick={() => markComplete(stepIdx)}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline"
                  >
                    Mark as complete
                  </button>
                )}
                {completed.has(stepIdx) && (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircleSolid className="h-4 w-4" /> Step complete
                  </span>
                )}
              </div>

              {isLastStep ? (
                <Link
                  to="/tutorials"
                  onClick={() => markComplete(stepIdx)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  <CheckCircleSolid className="h-4 w-4" /> Finish Tutorial
                </Link>
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  Next Step <ChevronRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TutorialLearn;
