import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  HomeIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { Card, Button, Progress } from '../components/ui';
import { useTheme } from '../context/ThemeContext';

const TutorialLearn = () => {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState('content'); // content, exercise, quiz
  const [loading, setLoading] = useState(true);
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseResults, setExerciseResults] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [lessonProgress, setLessonProgress] = useState({});
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    fetchTutorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (tutorial && currentLessonIndex >= 0) {
      const lesson = (tutorial.steps || tutorial.lessons || [])[currentLessonIndex];
      if (lesson?.exercises?.[0]) {
        setExerciseCode(lesson.exercises[0].starterCode || '');
      }
    }
  }, [tutorial, currentLessonIndex]);

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/mongo-tutorials/${id}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTutorial(data.data.tutorial);
      }
    } catch (error) {
      console.error('Error fetching tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLesson = (tutorial?.steps || tutorial?.lessons || [])[currentLessonIndex];
  const totalLessons = (tutorial?.steps || tutorial?.lessons || []).length;
  const progressPercentage = totalLessons > 0 ? ((currentLessonIndex + 1) / totalLessons) * 100 : 0;

  const goToNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentStep('content');
      setExerciseResults(null);
      setQuizAnswers({});
      setQuizResults({});
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentStep('content');
      setExerciseResults(null);
      setQuizAnswers({});
      setQuizResults({});
    }
  };

  const runExercise = () => {
    const lesson = currentLesson;
    const exercise = lesson.exercises?.[0];
    
    if (!exercise) return;
    
    try {
      // Simple test runner for demonstration
      const testResults = exercise.tests.map(test => {
        try {
          // This is a simplified test runner - in production you'd want a more secure sandbox
          const testCode = `
            ${exerciseCode}
            
            // Test: ${test.description}
            const result = ${test.code};
            result;
          `;
          
          // eslint-disable-next-line no-eval
          const result = eval(testCode);
          return {
            description: test.description,
            passed: !!result,
            error: null
          };
        } catch (error) {
          return {
            description: test.description,
            passed: false,
            error: error.message
          };
        }
      });

      setExerciseResults({
        tests: testResults,
        passed: testResults.every(t => t.passed),
        score: Math.round((testResults.filter(t => t.passed).length / testResults.length) * 100)
      });
      
      if (testResults.every(t => t.passed)) {
        setLessonProgress(prev => ({
          ...prev,
          [currentLesson.id]: { ...prev[currentLesson.id], exercise: true }
        }));
      }
    } catch (error) {
      console.error('Exercise execution error:', error);
    }
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    const lesson = currentLesson;
    const quiz = lesson.quiz || [];
    
    const results = quiz.reduce((acc, question) => {
      const userAnswer = quizAnswers[question.id];
      const correct = userAnswer === question.correctAnswer;
      
      acc[question.id] = {
        correct,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
      
      return acc;
    }, {});
    
    const score = Math.round((Object.values(results).filter(r => r.correct).length / quiz.length) * 100);
    
    setQuizResults({ ...results, score });
    
    if (score >= 70) {
      setLessonProgress(prev => ({
        ...prev,
        [currentLesson.id]: { ...prev[currentLesson.id], quiz: true }
      }));
    }
  };

  const completeContent = () => {
    setLessonProgress(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], content: true }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!tutorial || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutorial Not Found</h1>
          <Link to="/tutorials">
            <Button variant="primary">Back to Tutorials</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b sticky top-0 z-10 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/tutorials/${id}`}
                className={`inline-flex items-center transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                <HomeIcon className="h-4 w-4" />
              </Link>
              
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {tutorial.title}
                </span>
                <span className="mx-2">•</span>
                <span>Lesson {currentLessonIndex + 1} of {totalLessons}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </button>
              
              <div className="w-32">
                <Progress value={progressPercentage} size="sm" />
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Lesson Navigation */}
          <div className="lg:col-span-1">
            <Card className={`p-4 sticky top-24 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Lessons
              </h3>
              <div className="space-y-2">
                {(tutorial.steps || tutorial.lessons || []).map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setCurrentStep('content');
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentLessonIndex
                        ? isDarkMode 
                          ? 'bg-blue-900 text-blue-200 border border-blue-800'
                          : 'bg-primary-100 text-primary-900 border border-primary-200'
                        : isDarkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {lesson.duration || '15'}min
                        </p>
                      </div>
                      {lessonProgress[lesson.id] && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Lesson Header */}
              <div className="text-center">
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {currentLesson.title}
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentLesson.description || (currentLesson.content ? currentLesson.content.substring(0, 100) + '...' : '')}
                </p>
                
                {/* Step Navigation */}
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep('content')}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        currentStep === 'content'
                          ? isDarkMode
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-primary-100 text-primary-900'
                          : isDarkMode
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <BookOpenIcon className="h-5 w-5 mr-2" />
                      Content
                    </button>
                    
                    {currentLesson.exercises?.length > 0 && (
                      <button
                        onClick={() => setCurrentStep('exercise')}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          currentStep === 'exercise'
                            ? isDarkMode
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-primary-100 text-primary-900'
                            : isDarkMode
                              ? 'text-gray-400 hover:text-gray-200'
                              : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <CodeBracketIcon className="h-5 w-5 mr-2" />
                        Exercise
                        {lessonProgress[currentLesson.id]?.exercise && (
                          <CheckCircleIcon className="h-4 w-4 ml-1 text-green-500" />
                        )}
                      </button>
                    )}
                    
                    {currentLesson.quiz?.length > 0 && (
                      <button
                        onClick={() => setCurrentStep('quiz')}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          currentStep === 'quiz'
                            ? isDarkMode
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-primary-100 text-primary-900'
                            : isDarkMode
                              ? 'text-gray-400 hover:text-gray-200'
                              : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                        Quiz
                        {lessonProgress[currentLesson.id]?.quiz && (
                          <CheckCircleIcon className="h-4 w-4 ml-1 text-green-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentLessonIndex}-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 'content' && (
                    <Card className={`p-8 transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="prose prose-lg max-w-none">
                        <div className={`whitespace-pre-wrap ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {currentLesson.content?.text || currentLesson.content}
                        </div>
                        
                        {(currentLesson.codeExamples || currentLesson.content?.examples || []).map((example, index) => (
                          <div key={index} className="mt-8">
                            <h3 className={`text-lg font-semibold mb-4 ${
                              isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {example.title || `${example.language} Example`}
                            </h3>
                            <div className={`rounded-lg p-4 overflow-x-auto ${
                              isDarkMode ? 'bg-gray-900' : 'bg-gray-900'
                            }`}>
                              <pre className="text-green-400 text-sm">
                                <code>{example.code}</code>
                              </pre>
                            </div>
                            {example.explanation && (
                              <p className={`mt-2 text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {example.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <Button
                          variant="outline"
                          onClick={goToPreviousLesson}
                          disabled={currentLessonIndex === 0}
                        >
                          <ChevronLeftIcon className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        
                        <div className="space-x-4">
                          <Button variant="primary" onClick={completeContent}>
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                          
                          {currentLesson.exercises?.length > 0 ? (
                            <Button
                              variant="primary"
                              onClick={() => setCurrentStep('exercise')}
                            >
                              Try Exercise
                              <ChevronRightIcon className="h-4 w-4 ml-2" />
                            </Button>
                          ) : (
                            <Button variant="primary" onClick={goToNextLesson}>
                              Next Lesson
                              <ChevronRightIcon className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}

                  {currentStep === 'exercise' && currentLesson.exercises?.length > 0 && (
                    <div className="space-y-6">
                      <Card className={`p-6 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}>
                        <h2 className={`text-xl font-semibold mb-4 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {currentLesson.exercises[0].title}
                        </h2>
                        <p className={`mb-6 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {currentLesson.exercises[0].description}
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className={`font-medium mb-3 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                              Your Code
                            </h3>
                            <textarea
                              value={exerciseCode}
                              onChange={(e) => setExerciseCode(e.target.value)}
                              className="w-full h-64 font-mono text-sm border rounded-lg p-4 bg-gray-900 text-green-400"
                              placeholder="Write your code here..."
                            />
                            
                            <div className="mt-4 flex space-x-3">
                              <Button variant="primary" onClick={runExercise}>
                                <PlayIcon className="h-4 w-4 mr-2" />
                                Run Code
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => setExerciseCode(currentLesson.exercises[0].solution)}
                              >
                                Show Solution
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className={`font-medium mb-3 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}>
                              Test Results
                            </h3>
                            <div className={`border rounded-lg p-4 h-64 overflow-y-auto ${
                              isDarkMode 
                                ? 'border-gray-600 bg-gray-700' 
                                : 'border-gray-200 bg-gray-50'
                            }`}>
                              {exerciseResults ? (
                                <div className="space-y-3">
                                  <div className={`p-3 rounded-lg ${
                                    exerciseResults.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {exerciseResults.passed ? (
                                      <div className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        All tests passed! Score: {exerciseResults.score}%
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <XCircleIcon className="h-5 w-5 mr-2" />
                                        Some tests failed. Score: {exerciseResults.score}%
                                      </div>
                                    )}
                                  </div>
                                  
                                  {exerciseResults.tests.map((test, index) => (
                                    <div key={index} className={`p-3 rounded border ${
                                      test.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                    }`}>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">{test.description}</span>
                                        {test.passed ? (
                                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircleIcon className="h-4 w-4 text-red-500" />
                                        )}
                                      </div>
                                      {test.error && (
                                        <p className="text-xs text-red-600 mt-1">{test.error}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className={`text-center mt-12 ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Run your code to see test results
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentStep('content')}>
                          <ChevronLeftIcon className="h-4 w-4 mr-2" />
                          Back to Content
                        </Button>
                        
                        {currentLesson.quiz?.length > 0 ? (
                          <Button
                            variant="primary"
                            onClick={() => setCurrentStep('quiz')}
                            disabled={!exerciseResults?.passed}
                          >
                            Take Quiz
                            <ChevronRightIcon className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={goToNextLesson}
                            disabled={!exerciseResults?.passed}
                          >
                            Next Lesson
                            <ChevronRightIcon className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 'quiz' && currentLesson.quiz?.length > 0 && (
                    <div className="space-y-6">
                      <Card className={`p-6 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}>
                        <h2 className={`text-xl font-semibold mb-6 ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          Quiz Time!
                        </h2>
                        
                        <div className="space-y-6">
                          {currentLesson.quiz.map((question, index) => (
                            <div key={question.id} className={`border-b pb-6 ${
                              isDarkMode ? 'border-gray-600' : 'border-gray-200'
                            }`}>
                              <h3 className={`font-medium mb-4 ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-900'
                              }`}>
                                {index + 1}. {question.question}
                              </h3>
                              
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                    isDarkMode 
                                      ? 'hover:bg-gray-700' 
                                      : 'hover:bg-gray-50'
                                  }`}>
                                    <input
                                      type="radio"
                                      name={question.id}
                                      value={optionIndex}
                                      checked={quizAnswers[question.id] === optionIndex}
                                      onChange={() => handleQuizAnswer(question.id, optionIndex)}
                                      className="text-primary-600"
                                    />
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                                      {option}
                                    </span>
                                  </label>
                                ))}
                              </div>
                              
                              {quizResults[question.id] && (
                                <div className={`mt-4 p-3 rounded-lg ${
                                  quizResults[question.id].correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  <div className="flex items-center mb-2">
                                    {quizResults[question.id].correct ? (
                                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                                    ) : (
                                      <XCircleIcon className="h-5 w-5 mr-2" />
                                    )}
                                    {quizResults[question.id].correct ? 'Correct!' : 'Incorrect'}
                                  </div>
                                  <p className="text-sm">{question.explanation}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {!quizResults.score && (
                          <div className="mt-6">
                            <Button
                              variant="primary"
                              onClick={submitQuiz}
                              disabled={Object.keys(quizAnswers).length < currentLesson.quiz.length}
                            >
                              Submit Quiz
                            </Button>
                          </div>
                        )}
                        
                        {quizResults.score !== undefined && (
                          <div className="mt-6">
                            <div className={`p-4 rounded-lg text-center ${
                              quizResults.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              <h3 className="font-semibold text-lg mb-2">
                                Quiz Score: {quizResults.score}%
                              </h3>
                              <p>
                                {quizResults.score >= 70
                                  ? 'Great job! You passed the quiz.'
                                  : 'You need 70% to pass. Try again!'}
                              </p>
                            </div>
                          </div>
                        )}
                      </Card>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentStep('exercise')}>
                          <ChevronLeftIcon className="h-4 w-4 mr-2" />
                          Back to Exercise
                        </Button>
                        
                        <Button
                          variant="primary"
                          onClick={goToNextLesson}
                          disabled={!quizResults.score || quizResults.score < 70}
                        >
                          Next Lesson
                          <ChevronRightIcon className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialLearn;