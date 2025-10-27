import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlayIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  FireIcon,
  TrophyIcon,
  CodeBracketIcon,
  SparklesIcon,
  ArrowPathIcon,
  BookOpenIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Loading } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import MonacoEditor from '@monaco-editor/react';

const ChallengeDetailEnhanced = () => {
  console.log('🚀 ChallengeDetailEnhanced component loaded - NEW VERSION');
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [visibleHints, setVisibleHints] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState(null);
  const [isRunningCustom, setIsRunningCustom] = useState(false);
  const [outputTab, setOutputTab] = useState('testcase');
  const [splitPosition, setSplitPosition] = useState(50);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchChallenge();
  }, [slug]);

  useEffect(() => {
    if (challenge && challenge.starterCode) {
      const starter = challenge.starterCode.find(sc => sc.language === language);
      if (starter) {
        setCode(starter.code);
      }
    }
  }, [language, challenge]);

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/challenges/${slug}`, {
        params: { userId: user?.id || 'guest' }
      });

      if (response.data.success) {
        setChallenge(response.data.data.challenge);
        const starter = response.data.data.challenge.starterCode[0];
        setCode(starter?.code || '');
        setLanguage(starter?.language || 'javascript');
        setIsTimerRunning(true);
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
      toast.error('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setTestResults(null);
      setSubmissionResult(null);

      const response = await api.post(`/challenges/${slug}/run`, {
        code,
        language
      });

      if (response.data.success) {
        setTestResults(response.data.data);
        setActiveTab('testcase');
        setOutputTab('testcase');
        if (response.data.data.allPassed) {
          toast.success('All test cases passed! 🎉');
        } else {
          toast.error('Some test cases failed');
        }
      }
    } catch (error) {
      console.error('Run failed:', error);
      toast.error(error.response?.data?.message || 'Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCustomInput = async () => {
    try {
      setIsRunningCustom(true);
      setCustomOutput(null);

      const response = await api.post('/code/execute', {
        code,
        language,
        input: customInput
      });

      if (response.data.success) {
        setCustomOutput({
          success: true,
          output: response.data.data.output,
          executionTime: response.data.data.executionTime
        });
        setOutputTab('custom');
      } else {
        setCustomOutput({
          success: false,
          error: response.data.error || 'Execution failed'
        });
        setOutputTab('custom');
      }
    } catch (error) {
      setCustomOutput({
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to execute code'
      });
      setOutputTab('custom');
    } finally {
      setIsRunningCustom(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);

      const response = await api.post(`/challenges/${slug}/submit`, {
        code,
        language,
        userId: user?.id || 'guest'
      });

      if (response.data.success) {
        setSubmissionResult(response.data.data);
        setActiveTab('submission');
        setIsTimerRunning(false);

        if (response.data.data.status === 'Accepted') {
          toast.success('Accepted! Great job! 🎉');
        } else {
          toast.error(`${response.data.data.status}`);
        }
      }
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCode = () => {
    const starter = challenge.starterCode.find(sc => sc.language === language);
    if (starter) {
      setCode(starter.code);
      toast.success('Code reset to starter template');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600 bg-green-50',
      medium: 'text-orange-600 bg-orange-50',
      hard: 'text-red-600 bg-red-50',
      expert: 'text-purple-600 bg-purple-50'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loading size="large" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge not found</h2>
          <Button onClick={() => navigate('/challenges')}>
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Enhanced Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-800 border-b border-gray-700 px-6 py-3 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/challenges')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
            </motion.button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <CodeBracketIcon className="h-6 w-6 text-indigo-400" />
                  {challenge.number}. {challenge.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <TrophyIcon className="h-4 w-4" />
                  {challenge.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ChartBarIcon className="h-4 w-4" />
                  {challenge.acceptanceRate?.toFixed(1)}% Acceptance
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {formatTime(timer)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:bg-gray-600 transition-colors"
            >
              {challenge.starterCode?.map(sc => (
                <option key={sc.language} value={sc.language}>
                  {sc.language.charAt(0).toUpperCase() + sc.language.slice(1)}
                </option>
              ))}
            </select>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-300" />
            </motion.button>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetCode}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Reset Code"
            >
              <ArrowPathIcon className="h-5 w-5 text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Theme:</label>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value)}
                    className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="vs-dark">Dark</option>
                    <option value="vs-light">Light</option>
                    <option value="hc-black">High Contrast</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Font Size:</label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min="10"
                    max="24"
                    className="w-16 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border-r border-gray-700 overflow-y-auto bg-gray-850"
          style={{ width: `${splitPosition}%` }}
        >
          <div className="p-6">
            {/* Tabs with Icons */}
            <div className="flex gap-2 border-b border-gray-700 mb-6">
              {[
                { id: 'description', label: 'Description', icon: BookOpenIcon },
                { id: 'testcase', label: 'Results', icon: CheckCircleIcon },
                { id: 'submission', label: 'Submission', icon: PaperAirplaneIcon }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-4 font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-indigo-400 border-b-2 border-indigo-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Problem Statement */}
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br/>') }}
                  />
                </div>

                {/* Examples with Better Styling */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-yellow-400" />
                    Examples
                  </h3>
                  {challenge.examples?.map((example, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors"
                    >
                      <p className="font-semibold text-indigo-400 mb-3">Example {index + 1}:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-400 min-w-16">Input:</span>
                          <code className="flex-1 bg-gray-900 px-3 py-1.5 rounded text-green-400 font-mono">{example.input}</code>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-400 min-w-16">Output:</span>
                          <code className="flex-1 bg-gray-900 px-3 py-1.5 rounded text-blue-400 font-mono">{example.output}</code>
                        </div>
                        {example.explanation && (
                          <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-700">
                            <span className="font-medium text-gray-400 min-w-16">Note:</span>
                            <span className="flex-1 text-gray-300">{example.explanation}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                  <ul className="space-y-2">
                    {challenge.constraints?.map((constraint, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <code className="bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-300">
                          {constraint.description}
                        </code>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Hints System */}
                {challenge.hints && challenge.hints.length > 0 && (
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 text-yellow-400 font-medium hover:text-yellow-300 transition-colors"
                    >
                      <LightBulbIcon className="h-5 w-5" />
                      {showHints ? 'Hide' : 'Show'} Hints ({challenge.hints.length})
                    </motion.button>
                    <AnimatePresence>
                      {showHints && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-3"
                        >
                          {challenge.hints.slice(0, visibleHints + 1).map((hint, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-yellow-900/20 border-l-4 border-yellow-400 rounded"
                            >
                              <p className="text-sm text-gray-300">
                                <span className="font-semibold text-yellow-400">Hint {index + 1}:</span> {hint.text}
                              </p>
                            </motion.div>
                          ))}
                          {visibleHints < challenge.hints.length - 1 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setVisibleHints(visibleHints + 1)}
                              className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
                            >
                              → Show next hint
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map(tag => (
                        <motion.span
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 bg-gray-800 text-indigo-400 rounded-full text-sm border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Test Results Tab - Enhanced */}
            {activeTab === 'testcase' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {testResults ? (
                  <div className="space-y-4">
                    {/* Summary Card */}
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-6 rounded-lg border-2 ${
                        testResults.allPassed
                          ? 'bg-green-900/20 border-green-500'
                          : 'bg-red-900/20 border-red-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Test Cases</p>
                          <p className="text-3xl font-bold text-white">
                            {testResults.passedTests} / {testResults.totalTests}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {((testResults.passedTests / testResults.totalTests) * 100).toFixed(1)}% passed
                          </p>
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                        >
                          {testResults.allPassed ? (
                            <CheckCircleIcon className="h-16 w-16 text-green-400" />
                          ) : (
                            <XCircleIcon className="h-16 w-16 text-red-400" />
                          )}
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Individual Test Results */}
                    {testResults.results?.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${
                          result.passed
                            ? 'bg-green-900/10 border-green-700'
                            : 'bg-red-900/10 border-red-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-white">Test Case {index + 1}</span>
                          {result.passed ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-400" />
                          ) : (
                            <XCircleIcon className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-400">Input:</span>{' '}
                            <code className="ml-2 bg-gray-800 px-2 py-1 rounded text-green-400 font-mono">
                              {JSON.stringify(result.input)}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Expected:</span>{' '}
                            <code className="ml-2 bg-gray-800 px-2 py-1 rounded text-blue-400 font-mono">
                              {JSON.stringify(result.expectedOutput)}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Output:</span>{' '}
                            <code className={`ml-2 bg-gray-800 px-2 py-1 rounded font-mono ${
                              result.passed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {JSON.stringify(result.actualOutput)}
                            </code>
                          </div>
                          {result.runtime && (
                            <div>
                              <span className="font-medium text-gray-400">Runtime:</span>{' '}
                              <span className="ml-2 text-gray-300">{result.runtime}ms</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CodeBracketIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Run your code to see test results</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Submission Tab - Enhanced */}
            {activeTab === 'submission' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submissionResult ? (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-6 rounded-lg border-2 ${
                        submissionResult.status === 'Accepted'
                          ? 'bg-green-900/20 border-green-500'
                          : 'bg-red-900/20 border-red-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {submissionResult.status}
                          </h3>
                          <p className="text-gray-400">
                            Completed in {formatTime(timer)}
                          </p>
                        </div>
                        <motion.div
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          {submissionResult.status === 'Accepted' ? (
                            <div className="relative">
                              <TrophyIcon className="h-16 w-16 text-yellow-400" />
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <FireIcon className="h-8 w-8 text-orange-400" />
                              </motion.div>
                            </div>
                          ) : (
                            <XCircleIcon className="h-16 w-16 text-red-400" />
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">Test Cases</p>
                          <p className="text-2xl font-bold text-white">
                            {submissionResult.testCasesPassed} / {submissionResult.totalTestCases}
                          </p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">Runtime</p>
                          <p className="text-2xl font-bold text-white">{submissionResult.runtime}ms</p>
                        </div>
                      </div>

                      {submissionResult.failedTestCase && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 p-4 bg-gray-800 rounded-lg"
                        >
                          <p className="font-semibold text-red-400 mb-3">Failed Test Case:</p>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-400">Input:</span>{' '}
                              <code className="ml-2 bg-gray-900 px-2 py-1 rounded text-green-400 font-mono">
                                {JSON.stringify(submissionResult.failedTestCase.input)}
                              </code>
                            </div>
                            {submissionResult.failedTestCase.expectedOutput && (
                              <div>
                                <span className="font-medium text-gray-400">Expected:</span>{' '}
                                <code className="ml-2 bg-gray-900 px-2 py-1 rounded text-blue-400 font-mono">
                                  {JSON.stringify(submissionResult.failedTestCase.expectedOutput)}
                                </code>
                              </div>
                            )}
                            {submissionResult.failedTestCase.actualOutput && (
                              <div>
                                <span className="font-medium text-gray-400">Your Output:</span>{' '}
                                <code className="ml-2 bg-gray-900 px-2 py-1 rounded text-red-400 font-mono">
                                  {JSON.stringify(submissionResult.failedTestCase.actualOutput)}
                                </code>
                              </div>
                            )}
                            {submissionResult.failedTestCase.error && (
                              <div className="mt-2 p-3 bg-red-900/20 rounded border-l-4 border-red-500">
                                <p className="text-red-400 text-xs font-mono">
                                  {submissionResult.failedTestCase.error}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PaperAirplaneIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Submit your solution to see results</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Right Panel - Code Editor & Console */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col bg-gray-900"
          style={{ width: `${100 - splitPosition}%` }}
        >
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden border-b border-gray-700">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={editorTheme}
              options={{
                minimap: { enabled: true },
                fontSize: fontSize,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                snippetSuggestions: 'inline',
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'always',
                matchBrackets: 'always',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                renderLineHighlight: 'all'
              }}
            />
          </div>

          {/* Console/Output Section */}
          <div className="flex flex-col" style={{ height: '35%' }}>
            {/* Output Tabs */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
              <button
                onClick={() => setOutputTab('testcase')}
                className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                  outputTab === 'testcase'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setOutputTab('custom')}
                className={`px-4 py-2 text-sm font-medium rounded transition-all ${
                  outputTab === 'custom'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                Custom Input
              </button>
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-950 text-gray-100 font-mono text-sm">
              <AnimatePresence mode="wait">
                {outputTab === 'testcase' ? (
                  <motion.div
                    key="testcase"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {testResults ? (
                      <div className="space-y-2">
                        <div className={`font-semibold text-lg mb-3 ${testResults.allPassed ? 'text-green-400' : 'text-red-400'}`}>
                          {testResults.allPassed ? '✓ All test cases passed!' : '✗ Some test cases failed'}
                        </div>
                        {testResults.results?.map((result, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="pl-2 py-1"
                          >
                            <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                              {result.passed ? '✓' : '✗'} Test {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                            </span>
                            {!result.passed && result.error && (
                              <div className="text-red-300 text-xs mt-1 ml-4">{result.error}</div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        <PlayIcon className="h-6 w-6 inline mr-2" />
                        Press "Run Code" to execute test cases
                        <br />
                        <span className="text-xs">Output will appear here...</span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-gray-400 text-xs mb-2 block font-sans">Custom Input:</label>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder='Enter input (e.g., [1, 2, 3] or "hello")'
                        className="w-full bg-gray-900 text-gray-100 p-3 rounded border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
                        rows={4}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRunCustomInput}
                      disabled={isRunningCustom}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium font-sans flex items-center gap-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      {isRunningCustom ? 'Running...' : 'Run with Custom Input'}
                    </motion.button>
                    {customOutput && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                      >
                        <label className="text-gray-400 text-xs mb-2 block font-sans">Output:</label>
                        <div className={`p-3 rounded border ${
                          customOutput.success
                            ? 'bg-gray-900 border-green-600'
                            : 'bg-red-900/20 border-red-600'
                        }`}>
                          {customOutput.success ? (
                            <>
                              <pre className="whitespace-pre-wrap text-green-400">{customOutput.output}</pre>
                              {customOutput.executionTime && (
                                <p className="text-xs text-gray-500 mt-2 font-sans">
                                  ⚡ Execution time: {customOutput.executionTime}ms
                                </p>
                              )}
                            </>
                          ) : (
                            <pre className="whitespace-pre-wrap text-red-400">{customOutput.error}</pre>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-700 p-4 bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ClockIcon className="h-4 w-4" />
                <span>{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4" />
                      Run Code
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengeDetailEnhanced;
