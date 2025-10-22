import React, { useState, useEffect } from 'react';
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Badge, Loading, Input } from '../components/ui';
import CodeEditor from '../components/editor/CodeEditor/CodeEditor';
import OutputPanel from '../components/editor/OutputPanel/OutputPanel';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Practice = () => {
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
  
  // Filters
  const [filters, setFilters] = useState({
    difficulty: 'all',
    language: 'all',
    category: 'all',
    gameType: 'all',
    status: 'all',
    search: ''
  });

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

    try {
      setIsRunning(true);
      const response = await api.put(`/game-sessions/${currentSession.sessionId}/answer`, {
        challengeId: currentChallenge.challengeId,
        userAnswer: currentChallenge.type === 'code-completion' ? userCode : userAnswer,
        timeSpent: 30, // Would track actual time
        hintsUsed: showHints ? currentHint + 1 : 0
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
          toast.success('Correct! ' + result.data.feedback);
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
            }, 1500);
          } else {
            // Game completed
            toast.success('Game completed! 🎉');
            markGameCompleted(selectedGame.id);
            setTimeout(() => {
              setSelectedGame(null);
              setCurrentSession(null);
            }, 2000);
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
      setCurrentHint(prev => prev + 1);
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

      {selectedGame && currentChallenge ? (
        // Game View
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Left Panel - Game Description */}
          <div className="flex flex-col space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-secondary-900">
                    {selectedGame.title}
                  </h2>
                  <Badge 
                    variant={selectedGame.difficulty === 'beginner' ? 'success' : 
                            selectedGame.difficulty === 'intermediate' ? 'warning' : 
                            selectedGame.difficulty === 'advanced' ? 'secondary' : 'error'}
                  >
                    {selectedGame.difficulty}
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    {formatGameType(selectedGame.gameType)}
                  </Badge>
                  {completedGames.has(selectedGame._id) && (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedGame(null);
                    setCurrentSession(null);
                    setCurrentChallenge(null);
                  }}
                >
                  ← Back to List
                </Button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-secondary-900 mb-2">Game Overview</h3>
                <p className="text-secondary-700 mb-3">
                  {selectedGame.description}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-blue-900 mb-1">Challenge {challengeIndex + 1} of {selectedGame.challenges.length}</h4>
                  <p className="text-blue-800 text-sm">{currentChallenge.question}</p>
                  {currentChallenge.description && (
                    <p className="text-blue-700 text-sm mt-1">{currentChallenge.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-4">
                <div className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-1" />
                  {currentChallenge.points} points
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {Math.floor(currentChallenge.timeLimit / 60)} min
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                  Score: {currentSession?.score?.current || 0} / {currentSession?.score?.maximum || 1000}
                </div>
              </div>
              
              {/* Hints */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-secondary-900 flex items-center">
                    <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
                    Hints
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                  >
                    {showHints ? 'Hide' : 'Show'} Hints
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {currentChallenge.hints && currentChallenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Hint {index + 1}:</strong> {hint}
                          </p>
                        </div>
                      ))}
                      
                      {currentChallenge.hints && currentHint < currentChallenge.hints.length - 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={showNextHint}
                          className="text-yellow-600"
                        >
                          Show Next Hint
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
            
            {/* Test Results */}
            {testResults.length > 0 && (
              <Card className="p-4">
                <h3 className="font-medium text-secondary-900 mb-3">Test Results</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Test Case {index + 1}
                        </span>
                        {result.passed ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs mt-2">
                        <div>Input: {JSON.stringify(result.input)}</div>
                        <div>Expected: {JSON.stringify(result.expected)}</div>
                        {!result.passed && (
                          <div className="text-red-600">
                            Got: {JSON.stringify(result.actual)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {/* Right Panel - Challenge Interface */}
          <div className="flex flex-col space-y-4">
            <Card className="p-0 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between p-4 border-b border-secondary-200">
                <h3 className="font-medium text-secondary-900">
                  {currentChallenge.type === 'code-completion' ? 'Code Editor' : 'Challenge Response'}
                </h3>
                <div className="flex items-center space-x-2">
                  {challengeIndex > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={previousChallenge}
                    >
                      ← Previous
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolution(true)}
                    icon={BookOpenIcon}
                  >
                    Show Solution
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={submitAnswer}
                    loading={isRunning}
                    icon={CheckCircleIcon}
                  >
                    Submit Answer
                  </Button>
                  {challengeIndex < selectedGame.challenges.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextChallenge}
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-h-0 p-4">
                {currentChallenge.type === 'code-completion' || currentChallenge.type === 'code-debug' ? (
                  <CodeEditor
                    value={userCode}
                    language={selectedGame.language === 'cpp' ? 'cpp' : selectedGame.language}
                    theme="vs-dark"
                    onChange={setUserCode}
                    height="100%"
                    options={{
                      fontSize: 14,
                      wordWrap: 'on',
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                ) : currentChallenge.type === 'multiple-choice' ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">Choose the correct answer:</h4>
                    {currentChallenge.options?.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          value={option.id}
                          checked={userAnswer === option.id}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="text-primary-600"
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                ) : currentChallenge.type === 'true-false' ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">True or False?</h4>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          value="true"
                          checked={userAnswer === 'true'}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="text-primary-600"
                        />
                        <span>True</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="answer"
                          value="false"
                          checked={userAnswer === 'false'}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="text-primary-600"
                        />
                        <span>False</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium">Your Answer:</h4>
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-0 h-48">
              <div className="p-3 border-b border-secondary-200">
                <h3 className="font-medium text-secondary-900">Output</h3>
              </div>
              <div className="flex-1">
                <OutputPanel
                  output={output}
                  error={error}
                  isLoading={isRunning}
                  height="100%"
                  className="rounded-none border-0"
                />
              </div>
            </Card>
          </div>
        </div>
      ) : (
        // Games List View
        <>
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
        </>
      )}

      {/* Solution Modal */}
      <AnimatePresence>
        {showSolution && currentChallenge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-secondary-900">
                  Challenge Solution
                </h3>
                <button
                  onClick={() => setShowSolution(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-2">Solution:</h4>
                    {currentChallenge.type === 'code-completion' && currentChallenge.solution ? (
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        <code>{currentChallenge.solution}</code>
                      </pre>
                    ) : (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-green-800 font-medium">
                          {currentChallenge.correctAnswer || currentChallenge.solution || 'Solution not available'}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentChallenge.explanation && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Explanation:</h4>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-secondary-700 whitespace-pre-wrap">
                          {currentChallenge.explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentChallenge.keyPoints && currentChallenge.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Key Points:</h4>
                      <ul className="list-disc list-inside space-y-2 text-secondary-700">
                        {currentChallenge.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end p-6 border-t">
                <Button
                  variant="primary"
                  onClick={() => setShowSolution(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;