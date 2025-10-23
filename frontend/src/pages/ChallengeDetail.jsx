import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlayIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Loading } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import MonacoEditor from '@monaco-editor/react';

const ChallengeDetail = () => {
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
        if (response.data.data.allPassed) {
          toast.success('All test cases passed!');
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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600',
      medium: 'text-orange-600',
      hard: 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge not found</h2>
          <Button onClick={() => navigate('/challenges')}>
            Back to Challenges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/challenges')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">
                  {challenge.number}. {challenge.title}
                </h1>
                <span className={`font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span>{challenge.category}</span>
                <span>•</span>
                <span>{challenge.acceptanceRate?.toFixed(1)}% Acceptance</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {challenge.starterCode?.map(sc => (
                <option key={sc.language} value={sc.language}>
                  {sc.language.charAt(0).toUpperCase() + sc.language.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
          <div className="p-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('testcase')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'testcase'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Test Results
              </button>
              <button
                onClick={() => setActiveTab('submission')}
                className={`pb-3 px-2 font-medium transition-colors ${
                  activeTab === 'submission'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Submissions
              </button>
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                {/* Problem Description */}
                <div>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br/>') }}
                  />
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
                  {challenge.examples?.map((example, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900 mb-2">Example {index + 1}:</p>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Input:</span>{' '}
                          <code className="bg-white px-2 py-1 rounded">{example.input}</code>
                        </p>
                        <p>
                          <span className="font-medium">Output:</span>{' '}
                          <code className="bg-white px-2 py-1 rounded">{example.output}</code>
                        </p>
                        {example.explanation && (
                          <p>
                            <span className="font-medium">Explanation:</span> {example.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {challenge.constraints?.map((constraint, index) => (
                      <li key={index} className="text-sm">
                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {constraint.description}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hints */}
                {challenge.hints && challenge.hints.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
                    >
                      <LightBulbIcon className="h-5 w-5" />
                      {showHints ? 'Hide' : 'Show'} Hints
                    </button>
                    {showHints && (
                      <div className="mt-4 space-y-3">
                        {challenge.hints.slice(0, visibleHints + 1).map((hint, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded"
                          >
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Hint {index + 1}:</span> {hint.text}
                            </p>
                          </motion.div>
                        ))}
                        {visibleHints < challenge.hints.length - 1 && (
                          <button
                            onClick={() => setVisibleHints(visibleHints + 1)}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Show next hint
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test Results Tab */}
            {activeTab === 'testcase' && (
              <div>
                {testResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Test Cases</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {testResults.passedTests} / {testResults.totalTests}
                        </p>
                      </div>
                      {testResults.allPassed ? (
                        <CheckCircleIcon className="h-12 w-12 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-12 w-12 text-red-600" />
                      )}
                    </div>

                    {testResults.results?.map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          result.passed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold">Test Case {index + 1}</span>
                          {result.passed ? (
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircleIcon className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Input:</span>{' '}
                            <code className="bg-white px-2 py-1 rounded">
                              {JSON.stringify(result.input)}
                            </code>
                          </p>
                          <p>
                            <span className="font-medium">Expected:</span>{' '}
                            <code className="bg-white px-2 py-1 rounded">
                              {JSON.stringify(result.expectedOutput)}
                            </code>
                          </p>
                          <p>
                            <span className="font-medium">Output:</span>{' '}
                            <code className="bg-white px-2 py-1 rounded">
                              {JSON.stringify(result.actualOutput)}
                            </code>
                          </p>
                          {result.runtime && (
                            <p>
                              <span className="font-medium">Runtime:</span> {result.runtime}ms
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    Run your code to see test results
                  </p>
                )}
              </div>
            )}

            {/* Submission Tab */}
            {activeTab === 'submission' && (
              <div>
                {submissionResult ? (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-lg ${
                      submissionResult.status === 'Accepted'
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-red-50 border-2 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">
                          {submissionResult.status}
                        </h3>
                        {submissionResult.status === 'Accepted' ? (
                          <CheckCircleIcon className="h-12 w-12 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-12 w-12 text-red-600" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Test Cases Passed</p>
                          <p className="text-xl font-bold">
                            {submissionResult.testCasesPassed} / {submissionResult.totalTestCases}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Runtime</p>
                          <p className="text-xl font-bold">{submissionResult.runtime}ms</p>
                        </div>
                      </div>

                      {submissionResult.failedTestCase && (
                        <div className="mt-4 p-4 bg-white rounded">
                          <p className="font-semibold mb-2">Failed Test Case:</p>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Input:</span>{' '}
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {JSON.stringify(submissionResult.failedTestCase.input)}
                              </code>
                            </p>
                            {submissionResult.failedTestCase.expectedOutput && (
                              <p>
                                <span className="font-medium">Expected:</span>{' '}
                                <code className="bg-gray-100 px-2 py-1 rounded">
                                  {JSON.stringify(submissionResult.failedTestCase.expectedOutput)}
                                </code>
                              </p>
                            )}
                            {submissionResult.failedTestCase.actualOutput && (
                              <p>
                                <span className="font-medium">Your Output:</span>{' '}
                                <code className="bg-gray-100 px-2 py-1 rounded">
                                  {JSON.stringify(submissionResult.failedTestCase.actualOutput)}
                                </code>
                              </p>
                            )}
                            {submissionResult.failedTestCase.error && (
                              <p className="text-red-600">
                                <span className="font-medium">Error:</span>{' '}
                                {submissionResult.failedTestCase.error}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    Submit your solution to see results
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    Run Code
                  </>
                )}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-2"
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
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
