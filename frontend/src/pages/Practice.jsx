import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CodeBracketIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  LightBulbIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  XMarkIcon,
  PlayIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Badge, Loading, Input } from '../components/ui';
import MonacoEditor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Practice = () => {
  console.log('🎮 Practice Arena component loaded - ENHANCED VERSION');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completedGames, setCompletedGames] = useState(new Set());
  const [gameStats, setGameStats] = useState({ totalGames: 0, completedGames: 0, totalXP: 0 });

  // Enhanced features
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [activeTab, setActiveTab] = useState('description');
  const [outputTab, setOutputTab] = useState('testcase');
  const [customInput, setCustomInput] = useState('');
  const timerRef = useRef(null);

  // Point deduction tracking
  const [solutionViewed, setSolutionViewed] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [pointDeduction, setPointDeduction] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    difficulty: 'all',
    language: 'all',
    category: 'all',
    gameType: 'all',
    status: 'all',
    search: ''
  });

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // API functions
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/games', {
        params: {
          limit: '50',
          difficulty: filters.difficulty !== 'all' ? filters.difficulty : '',
          language: filters.language !== 'all' ? filters.language : '',
          category: filters.category !== 'all' ? filters.category : '',
          gameType: filters.gameType !== 'all' ? filters.gameType : '',
          search: filters.search
        }
      });

      if (response.data.success) {
        setGames(response.data.data);
        setFilteredGames(response.data.data);
      } else {
        toast.error('Failed to load games');
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const startGameSession = async (game) => {
    try {
      const response = await api.post(`/games/${game.slug}/start`, {
        userId: user?.id || 'guest'
      });

      if (response.data.success) {
        setCurrentSession(response.data.data.session);
        setSelectedGame(response.data.data.game);
        setChallengeIndex(0);
        setCurrentChallenge(response.data.data.game.challenges[0]);
        setUserCode(response.data.data.game.challenges[0]?.codeSnippet || '');
        setUserAnswer('');
        setTimer(0);
        setIsTimerRunning(true);

        // Reset point tracking
        setSolutionViewed(false);
        setHintsRevealed(0);
        setSubmitted(false);
        setPointDeduction(0);

        toast.success(`Started ${game.title}!`);
      } else {
        toast.error('Failed to start game session');
      }
    } catch (error) {
      console.error('Failed to start game session:', error);
      toast.error('Failed to start game session');
    }
  };

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'bg-gray-500' },
    { id: 'beginner', name: 'Beginner', color: 'bg-green-500' },
    { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-500' },
    { id: 'advanced', name: 'Advanced', color: 'bg-orange-500' },
    { id: 'expert', name: 'Expert', color: 'bg-red-500' }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Programming Fundamentals', name: 'Programming Fundamentals' },
    { id: 'Web Development', name: 'Web Development' },
    { id: 'Data Structures', name: 'Data Structures' },
    { id: 'Algorithms', name: 'Algorithms' },
    { id: 'Database', name: 'Database' },
    { id: 'Security', name: 'Security' },
    { id: 'Machine Learning', name: 'Machine Learning' },
    { id: 'DevOps', name: 'DevOps' }
  ];

  const gameTypes = [
    { id: 'all', name: 'All Game Types' },
    { id: 'quiz-rush', name: 'Quiz Rush' },
    { id: 'code-builder', name: 'Code Builder' },
    { id: 'debug-detective', name: 'Debug Detective' },
    { id: 'tower-defense', name: 'Tower Defense' },
    { id: 'escape-room', name: 'Escape Room' },
    { id: 'speed-coder', name: 'Speed Coder' },
    { id: 'logic-labyrinth', name: 'Logic Labyrinth' },
    { id: 'treasure-hunt', name: 'Treasure Hunt' }
  ];

  const languages = [
    { id: 'all', name: 'All Languages' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'cpp', name: 'C++' },
    { id: 'general', name: 'General' }
  ];

  useEffect(() => {
    fetchGames();

    // Load completed games from localStorage
    const completed = JSON.parse(localStorage.getItem('completedGames') || '[]');
    setCompletedGames(new Set(completed));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters();
  }, [filters, games]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (filters.difficulty !== 'all' || filters.language !== 'all' ||
        filters.category !== 'all' || filters.gameType !== 'all' ||
        filters.search) {
      fetchGames();
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    let filtered = games.filter(game => {
      const matchesDifficulty = filters.difficulty === 'all' || game.difficulty === filters.difficulty;
      const matchesCategory = filters.category === 'all' || game.category === filters.category;
      const matchesLanguage = filters.language === 'all' || game.language === filters.language;
      const matchesGameType = filters.gameType === 'all' || game.gameType === filters.gameType;
      const matchesSearch = !filters.search ||
        game.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        game.description.toLowerCase().includes(filters.search.toLowerCase());

      let matchesStatus = true;
      if (filters.status === 'completed') {
        matchesStatus = completedGames.has(game._id);
      } else if (filters.status === 'todo') {
        matchesStatus = !completedGames.has(game._id);
      }

      return matchesDifficulty && matchesCategory && matchesLanguage && matchesGameType && matchesSearch && matchesStatus;
    });

    setFilteredGames(filtered);
  };

  const selectGame = (game) => {
    startGameSession(game);
  };

  const submitAnswer = async () => {
    if (!currentSession || !currentChallenge) {
      toast.error('No active game session');
      return;
    }

    // Calculate final points (base points - deductions)
    const finalPoints = Math.max(0, currentChallenge.points - pointDeduction);

    try {
      setIsRunning(true);
      setSubmitted(true);

      const response = await api.put(`/game-sessions/${currentSession.sessionId}/answer`, {
        challengeId: currentChallenge.challengeId,
        userAnswer: currentChallenge.type === 'code-completion' ? userCode : userAnswer,
        timeSpent: timer,
        hintsUsed: hintsRevealed,
        solutionViewed: solutionViewed,
        pointDeduction: pointDeduction,
        finalPoints: finalPoints
      });

      const result = response.data;
      if (result.success) {
        setCurrentSession(prev => ({
          ...prev,
          score: result.data.session.score,
          progress: result.data.session.progress,
          gameState: result.data.session.gameState
        }));

        if (result.data.isCorrect) {
          const message = solutionViewed
            ? `Correct, but you viewed the solution. No points earned.`
            : pointDeduction > 0
            ? `Correct! Earned ${finalPoints} points (${pointDeduction} points deducted for hints)`
            : `Correct! Full ${finalPoints} points earned! 🎉`;

          toast.success(message, { duration: 3000 });

          // Move to next challenge
          if (challengeIndex < selectedGame.challenges.length - 1) {
            setTimeout(() => {
              const nextIndex = challengeIndex + 1;
              setChallengeIndex(nextIndex);
              setCurrentChallenge(selectedGame.challenges[nextIndex]);
              setUserCode(selectedGame.challenges[nextIndex]?.codeSnippet || '');
              setUserAnswer('');
              setShowHints(false);
              setCurrentHint(0);
              setTestResults([]);

              // Reset point tracking for new challenge
              setSolutionViewed(false);
              setHintsRevealed(0);
              setSubmitted(false);
              setPointDeduction(0);
            }, 2000);
          } else {
            // Game completed
            toast.success('Game completed! 🎉');
            setIsTimerRunning(false);
            markGameCompleted(selectedGame._id);
            setTimeout(() => {
              setSelectedGame(null);
              setCurrentSession(null);
            }, 2500);
          }
        } else {
          toast.error('Incorrect. ' + result.data.feedback);
        }
      } else {
        toast.error('Failed to submit answer');
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setIsRunning(false);
    }
  };

  const nextChallenge = () => {
    if (challengeIndex < selectedGame.challenges.length - 1) {
      const nextIndex = challengeIndex + 1;
      setChallengeIndex(nextIndex);
      setCurrentChallenge(selectedGame.challenges[nextIndex]);
      setUserCode(selectedGame.challenges[nextIndex]?.codeSnippet || '');
      setUserAnswer('');
      setShowHints(false);
      setCurrentHint(0);
      setTestResults([]);

      // Reset point tracking
      setSolutionViewed(false);
      setHintsRevealed(0);
      setSubmitted(false);
      setPointDeduction(0);
    }
  };

  const previousChallenge = () => {
    if (challengeIndex > 0) {
      const prevIndex = challengeIndex - 1;
      setChallengeIndex(prevIndex);
      setCurrentChallenge(selectedGame.challenges[prevIndex]);
      setUserCode(selectedGame.challenges[prevIndex]?.codeSnippet || '');
      setUserAnswer('');
      setShowHints(false);
      setCurrentHint(0);
      setTestResults([]);

      // Reset point tracking
      setSolutionViewed(false);
      setHintsRevealed(0);
      setSubmitted(false);
      setPointDeduction(0);
    }
  };

  const resetCode = () => {
    if (currentChallenge && currentChallenge.codeSnippet) {
      setUserCode(currentChallenge.codeSnippet);
      toast.success('Code reset to initial state');
    }
  };

  const markGameCompleted = (gameId) => {
    const newCompleted = new Set(completedGames).add(gameId);
    setCompletedGames(newCompleted);
    localStorage.setItem('completedGames', JSON.stringify([...newCompleted]));
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-orange-500',
      expert: 'bg-red-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  const showNextHint = () => {
    if (currentChallenge && currentHint < currentChallenge.hints.length - 1) {
      const nextHintIndex = currentHint + 1;
      setCurrentHint(nextHintIndex);
      setHintsRevealed(nextHintIndex + 1);

      // Deduct 10% of points per hint
      const deduction = Math.floor(currentChallenge.points * 0.1);
      setPointDeduction(prev => prev + deduction);

      toast(`Hint revealed! -${deduction} points`, {
        icon: '💡',
        duration: 2000,
        style: {
          background: '#fbbf24',
          color: '#fff',
        }
      });
    }
  };

  const viewSolution = () => {
    if (solutionViewed) {
      setActiveTab('solution');
      return;
    }

    // Show warning before viewing solution
    const totalPoints = currentChallenge.points;
    const deduction = totalPoints; // 100% point loss

    if (window.confirm(
      `⚠️ WARNING: Viewing the solution will result in losing ALL ${totalPoints} points for this challenge!\n\nAre you sure you want to continue?`
    )) {
      setSolutionViewed(true);
      setPointDeduction(totalPoints);
      setActiveTab('solution');

      toast.error(`Solution viewed! All ${totalPoints} points lost for this challenge`, {
        icon: '⚠️',
        duration: 3000
      });
    }
  };

  const getGameTypeIcon = (gameType) => {
    const iconMap = {
      'quiz-rush': 'lightbulb',
      'code-builder': 'code',
      'debug-detective': 'check',
      'tower-defense': 'trophy',
      'escape-room': 'academic',
      'speed-coder': 'clock',
      'logic-labyrinth': 'funnel',
      'treasure-hunt': 'star'
    };

    const iconComponents = {
      lightbulb: LightBulbIcon,
      code: CodeBracketIcon,
      check: CheckCircleIcon,
      trophy: TrophyIcon,
      academic: AcademicCapIcon,
      clock: ClockIcon,
      funnel: FunnelIcon,
      star: StarIcon
    };

    const iconType = iconMap[gameType] || 'code';
    return iconComponents[iconType];
  };

  const formatGameType = (gameType) => {
    if (!gameType) return 'N/A';
    return gameType.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <Loading text="Loading practice challenges..." />;
  }

  // Enhanced Game View
  if (selectedGame && currentChallenge) {
    return (
      <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
        {/* Enhanced Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => {
                setSelectedGame(null);
                setCurrentSession(null);
                setCurrentChallenge(null);
                setIsTimerRunning(false);
                setTimer(0);
              }}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="h-6 w-px bg-gray-600" />

            <div>
              <h2 className="text-lg font-semibold">{selectedGame.title}</h2>
              <p className="text-sm text-gray-400">
                Challenge {challengeIndex + 1} of {selectedGame.challenges.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className="flex items-center space-x-2 text-gray-300">
              <ClockIcon className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timer)}</span>
            </div>

            {/* Score */}
            <div className="flex items-center space-x-2">
              <TrophyIcon className="w-5 h-5 text-yellow-400" />
              <div className="flex flex-col items-end">
                <span className="font-semibold text-yellow-400">{currentSession?.score?.current || 0}</span>
                {pointDeduction > 0 && (
                  <span className="text-xs text-red-400">-{pointDeduction} pts</span>
                )}
              </div>
            </div>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-300" />
            </button>

            {/* Reset */}
            {currentChallenge.type === 'code-completion' && (
              <button
                onClick={resetCode}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="text-sm">Reset</span>
              </button>
            )}

            {/* Run/Submit */}
            <button
              onClick={submitAnswer}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-800 border-b border-gray-700 overflow-hidden"
            >
              <div className="px-6 py-4 flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-400">Theme:</label>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="vs-dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="hc-black">High Contrast</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-400">Font Size:</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Problem Description */}
          <div className="w-1/2 border-r border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'hints'
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Hints ({currentChallenge.hints?.length || 0})
              </button>
              <button
                onClick={viewSolution}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === 'solution'
                    ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                    : solutionViewed
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>Solution</span>
                  {!solutionViewed && !submitted && (
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">-100%</span>
                  )}
                  {solutionViewed && (
                    <span className="text-xs">✓</span>
                  )}
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{currentChallenge.question}</h3>
                    {currentChallenge.description && (
                      <p className="text-gray-300 leading-relaxed">{currentChallenge.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Difficulty</div>
                      <Badge variant={selectedGame.difficulty === 'beginner' ? 'success' :
                                     selectedGame.difficulty === 'intermediate' ? 'warning' : 'error'}>
                        {selectedGame.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Points</div>
                      <div className="text-yellow-400 font-semibold">{currentChallenge.points}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Time Limit</div>
                      <div className="text-white">{Math.floor(currentChallenge.timeLimit / 60)} min</div>
                    </div>
                  </div>

                  {/* Game Overview */}
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-medium mb-2 text-gray-300">Game Overview</h4>
                    <p className="text-gray-400 text-sm">{selectedGame.description}</p>
                  </div>
                </div>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">
                      Hints will help you solve the challenge. Each hint costs 10% of points.
                    </p>
                    {hintsRevealed > 0 && (
                      <div className="text-red-400 text-sm font-medium">
                        {hintsRevealed} hint{hintsRevealed > 1 ? 's' : ''} used
                      </div>
                    )}
                  </div>

                  {currentChallenge.hints && currentChallenge.hints.length > 0 ? (
                    <>
                      {currentChallenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg"
                        >
                          <div className="flex items-start">
                            <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-yellow-400 font-medium text-sm">Hint {index + 1}</div>
                                <div className="text-red-400 text-xs">-{Math.floor(currentChallenge.points * 0.1)} pts</div>
                              </div>
                              <p className="text-gray-300 text-sm">{hint}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {currentHint < currentChallenge.hints.length - 1 && (
                        <button
                          onClick={showNextHint}
                          className="w-full px-4 py-2 bg-yellow-900/30 hover:bg-yellow-900/40 text-yellow-400 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <LightBulbIcon className="w-4 h-4" />
                          <span>Reveal Next Hint ({currentHint + 1}/{currentChallenge.hints.length})</span>
                          <span className="text-xs text-red-400">-{Math.floor(currentChallenge.points * 0.1)} pts</span>
                        </button>
                      )}

                      {currentHint === currentChallenge.hints.length - 1 && (
                        <div className="text-center text-gray-500 text-sm mt-4 p-3 bg-gray-800 rounded-lg">
                          All hints revealed
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No hints available for this challenge
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'solution' && (
                <div className="space-y-4">
                  {!solutionViewed && !submitted ? (
                    <div className="text-center py-12">
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 mb-6">
                        <h3 className="text-red-400 font-semibold text-lg mb-3 flex items-center justify-center">
                          <XCircleIcon className="w-6 h-6 mr-2" />
                          Solution Locked
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Viewing the solution before submitting will result in <span className="text-red-400 font-bold">100% point loss</span> for this challenge.
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                          Try solving it yourself first, or use hints for partial credit!
                        </p>
                        <button
                          onClick={viewSolution}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                          View Solution Anyway (Lose All Points)
                        </button>
                      </div>
                    </div>
                  ) : submitted && !solutionViewed ? (
                    <div className="text-center py-12">
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6">
                        <h3 className="text-green-400 font-semibold text-lg mb-3 flex items-center justify-center">
                          <CheckCircleIcon className="w-6 h-6 mr-2" />
                          Solution Unlocked!
                        </h3>
                        <p className="text-gray-300 mb-6">
                          You can now view the solution since you've already submitted your answer.
                        </p>
                        <button
                          onClick={() => setSolutionViewed(true)}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          View Solution
                        </button>
                      </div>
                    </div>
                  ) : (currentChallenge.solution || currentChallenge.correctAnswer) ? (
                    <>
                      {!submitted && solutionViewed && (
                        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 mb-4">
                          <p className="text-red-400 text-sm font-medium flex items-center">
                            <XCircleIcon className="w-5 h-5 mr-2" />
                            You viewed the solution. All {currentChallenge.points} points lost for this challenge.
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-green-400 mb-3">Solution:</h4>
                        {currentChallenge.type === 'code-completion' && currentChallenge.solution ? (
                          <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
                            <code className="text-green-400 text-sm font-mono">{currentChallenge.solution}</code>
                          </pre>
                        ) : (
                          <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                            <p className="text-green-400 font-medium">
                              {currentChallenge.correctAnswer || currentChallenge.solution}
                            </p>
                          </div>
                        )}
                      </div>

                      {currentChallenge.explanation && (
                        <div>
                          <h4 className="font-medium text-blue-400 mb-3">Explanation:</h4>
                          <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                            <p className="text-gray-300 whitespace-pre-wrap text-sm">{currentChallenge.explanation}</p>
                          </div>
                        </div>
                      )}

                      {currentChallenge.keyPoints && currentChallenge.keyPoints.length > 0 && (
                        <div>
                          <h4 className="font-medium text-purple-400 mb-3">Key Points:</h4>
                          <ul className="space-y-2">
                            {currentChallenge.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Solution not available for this challenge
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor/Answer Area */}
          <div className="w-1/2 flex flex-col">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              {currentChallenge.type === 'code-completion' || currentChallenge.type === 'code-debug' ? (
                <MonacoEditor
                  height="100%"
                  language={selectedGame.language === 'cpp' ? 'cpp' : selectedGame.language}
                  value={userCode}
                  onChange={(value) => setUserCode(value || '')}
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
                    matchBrackets: 'always',
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    renderLineHighlight: 'all'
                  }}
                />
              ) : currentChallenge.type === 'multiple-choice' ? (
                <div className="p-6 space-y-3 overflow-y-auto h-full bg-gray-850">
                  <h4 className="font-medium text-gray-200 mb-4">Choose the correct answer:</h4>
                  {currentChallenge.options?.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        userAnswer === option.id
                          ? 'bg-blue-900/30 border-blue-500'
                          : 'border-gray-600 hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.id}
                        checked={userAnswer === option.id}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-200">{option.text}</span>
                    </label>
                  ))}
                </div>
              ) : currentChallenge.type === 'true-false' ? (
                <div className="p-6 space-y-4 overflow-y-auto h-full bg-gray-850">
                  <h4 className="font-medium text-gray-200 mb-4">True or False?</h4>
                  <div className="flex space-x-4">
                    <label className={`flex-1 flex items-center justify-center space-x-2 p-6 border rounded-lg cursor-pointer transition-colors ${
                      userAnswer === 'true' ? 'bg-green-900/30 border-green-500' : 'border-gray-600 hover:bg-gray-800'
                    }`}>
                      <input
                        type="radio"
                        name="answer"
                        value="true"
                        checked={userAnswer === 'true'}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-lg font-medium text-gray-200">True</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center space-x-2 p-6 border rounded-lg cursor-pointer transition-colors ${
                      userAnswer === 'false' ? 'bg-red-900/30 border-red-500' : 'border-gray-600 hover:bg-gray-800'
                    }`}>
                      <input
                        type="radio"
                        name="answer"
                        value="false"
                        checked={userAnswer === 'false'}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-lg font-medium text-gray-200">False</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-6 h-full bg-gray-850">
                  <h4 className="font-medium text-gray-200 mb-3">Your Answer:</h4>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-64 p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="border-t border-gray-700 bg-gray-850 p-4 max-h-64 overflow-y-auto">
                <h3 className="font-medium mb-3 text-gray-200">Test Results:</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-900/20 border-green-700/50'
                          : 'bg-red-900/20 border-red-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Test Case {index + 1}</span>
                        {result.passed ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="text-gray-400">Input: <span className="text-gray-200">{JSON.stringify(result.input)}</span></div>
                        <div className="text-gray-400">Expected: <span className="text-gray-200">{JSON.stringify(result.expected)}</span></div>
                        {!result.passed && (
                          <div className="text-red-400">Got: <span className="text-red-300">{JSON.stringify(result.actual)}</span></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
              <button
                onClick={previousChallenge}
                disabled={challengeIndex === 0}
                className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous Challenge
              </button>

              <div className="text-sm text-gray-400">
                Progress: {challengeIndex + 1} / {selectedGame.challenges.length}
              </div>

              <button
                onClick={nextChallenge}
                disabled={challengeIndex === selectedGame.challenges.length - 1}
                className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next Challenge →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Games List View (unchanged)
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
            <RocketLaunchIcon className="w-8 h-8 mr-3 text-primary-600" />
            Practice Arena
          </h1>
          <p className="text-secondary-600">
            Sharpen your coding skills with interactive challenges
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-secondary-600">
            <span className="font-medium">{completedGames.size}</span> / {games.length} completed
          </div>
          <div className="text-sm text-secondary-600">
            <FireIcon className="w-4 h-4 inline mr-1 text-orange-500" />
            {currentSession?.score?.current || 0} points
          </div>
          <div className="text-sm text-secondary-600">
            <TrophyIcon className="w-4 h-4 inline mr-1 text-yellow-500" />
            {gameStats.totalXP} XP earned
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <Input
              type="text"
              placeholder="Search learning games..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              icon={MagnifyingGlassIcon}
            />
          </div>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {difficulties.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.name}</option>
            ))}
          </select>

          <select
            value={filters.language}
            onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filters.gameType}
            onChange={(e) => setFilters(prev => ({ ...prev, gameType: e.target.value }))}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {gameTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="todo">To Do</option>
          </select>
        </div>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => {
          return (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectGame(game)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const GameIcon = getGameTypeIcon(game.gameType);
                      return <GameIcon className="w-5 h-5 text-primary-600" />;
                    })()}
                    <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
                      {completedGames.has(game._id) && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                      )}
                      {game.title}
                    </h3>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(game.difficulty)}`}></div>
                </div>

                <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" size="sm">
                    {formatGameType(game.gameType)}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {game.language}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {game.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-secondary-500">
                    <div className="flex items-center">
                      <TrophyIcon className="w-4 h-4 mr-1" />
                      {game.maxScore} pts
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {game.estimatedTime}m
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="w-4 h-4 mr-1" />
                      {game.challenges?.length || 0} challenges
                    </div>
                  </div>

                  <Badge
                    variant={game.difficulty === 'beginner' ? 'success' :
                            game.difficulty === 'intermediate' ? 'warning' :
                            game.difficulty === 'advanced' ? 'secondary' : 'error'}
                    size="sm"
                  >
                    {game.difficulty}
                  </Badge>
                </div>

                {game.isFeatured && (
                  <div className="mt-3 flex items-center text-xs text-yellow-600">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Featured Game
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredGames.length === 0 && !loading && (
        <div className="text-center py-12">
          <RocketLaunchIcon className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No games found</h3>
          <p className="text-secondary-600">Try adjusting your filters to see more learning games.</p>
        </div>
      )}
    </div>
  );
};

export default Practice;
