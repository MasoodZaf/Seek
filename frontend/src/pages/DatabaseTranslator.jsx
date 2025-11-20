import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowsRightLeftIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon,
  SparklesIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Loading } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DatabaseTranslator = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [sourceQuery, setSourceQuery] = useState('');
  const [translatedQuery, setTranslatedQuery] = useState('');
  const [sourceDB, setSourceDB] = useState('sql');
  const [targetDB, setTargetDB] = useState('mongodb');
  const [translationResult, setTranslationResult] = useState(null);
  const [supportedDatabases, setSupportedDatabases] = useState([]);
  const [commonPatterns, setCommonPatterns] = useState([]);

  const popularDatabases = ['sql', 'mongodb', 'postgresql', 'redis', 'mysql', 'elasticsearch'];

  useEffect(() => {
    fetchSupportedDatabases();
  }, []);

  useEffect(() => {
    if (sourceDB) {
      fetchCommonPatterns(sourceDB);
    }
  }, [sourceDB]);

  const fetchSupportedDatabases = async () => {
    try {
      const response = await api.get('/database-translation/supported');
      if (response.data.success) {
        setSupportedDatabases(response.data.data.databases);
      }
    } catch (error) {
      console.error('Failed to fetch supported databases:', error);
    }
  };

  const fetchCommonPatterns = async (database) => {
    try {
      const response = await api.get(`/database-translation/patterns/${database}`);
      if (response.data.success) {
        setCommonPatterns(response.data.data.patterns);
      }
    } catch (error) {
      setCommonPatterns([]);
    }
  };

  const handleTranslate = async () => {
    if (!sourceQuery.trim()) {
      toast.error('Please enter a query to translate');
      return;
    }

    if (sourceDB === targetDB) {
      toast.error('Source and target databases must be different');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/database-translation/translate', {
        sourceQuery: sourceQuery.trim(),
        sourceDB,
        targetDB,
        options: {
          includeExplanation: true,
          includeComments: true
        }
      });

      if (response.data.success) {
        setTranslationResult(response.data.data);
        setTranslatedQuery(response.data.data.translatedQuery);
        toast.success('Query translated successfully!');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error.response?.data?.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const swapDatabases = () => {
    const temp = sourceDB;
    setSourceDB(targetDB);
    setTargetDB(temp);
    setSourceQuery(translatedQuery);
    setTranslatedQuery('');
    setTranslationResult(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const loadExample = (pattern) => {
    setSourceQuery(pattern);
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <CircleStackIcon className="h-10 w-10 text-blue-500" />
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Database Query Translator
            </h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Translate queries between different database systems (SQL, MongoDB, Redis, and more)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Translation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Database Selectors */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Source Database */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    From
                  </label>
                  <select
                    value={sourceDB}
                    onChange={(e) => setSourceDB(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    {popularDatabases.map((db) => (
                      <option key={db} value={db}>
                        {db.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapDatabases}
                    className={`p-3 rounded-full ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors`}
                    title="Swap databases"
                  >
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Target Database */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    To
                  </label>
                  <select
                    value={targetDB}
                    onChange={(e) => setTargetDB(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    {popularDatabases.map((db) => (
                      <option key={db} value={db}>
                        {db.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Source Query Input */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {sourceDB.toUpperCase()} Query
                </h2>
                {sourceQuery && (
                  <button
                    onClick={() => copyToClipboard(sourceQuery)}
                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                    Copy
                  </button>
                )}
              </div>
              <textarea
                value={sourceQuery}
                onChange={(e) => setSourceQuery(e.target.value)}
                placeholder={`Enter your ${sourceDB.toUpperCase()} query here...`}
                rows={8}
                className={`w-full px-4 py-3 rounded-lg border font-mono text-sm ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-100'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {sourceQuery.length} characters
                </span>
                <Button
                  onClick={handleTranslate}
                  disabled={loading || !sourceQuery.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loading size="sm" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      Translate Query
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Translated Query Output */}
            {translatedQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {targetDB.toUpperCase()} Query
                    </h2>
                    <div className="flex items-center gap-3">
                      {translationResult?.confidence && (
                        <span className={`text-sm font-medium ${getConfidenceColor(translationResult.confidence)}`}>
                          {translationResult.confidence.charAt(0).toUpperCase() + translationResult.confidence.slice(1)} Confidence
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(translatedQuery)}
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                      >
                        <ClipboardDocumentCheckIcon className="h-4 w-4" />
                        Copy
                      </button>
                    </div>
                  </div>
                  <pre
                    className={`w-full px-4 py-3 rounded-lg border font-mono text-sm overflow-x-auto ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-gray-100'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    {translatedQuery}
                  </pre>
                </Card>

                {/* Translation Details */}
                {translationResult && (
                  <Card className="p-6 mt-6">
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Translation Details
                    </h3>

                    {translationResult.explanation && (
                      <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Explanation
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translationResult.explanation}
                        </p>
                      </div>
                    )}

                    {translationResult.keyDifferences && translationResult.keyDifferences.length > 0 && (
                      <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Key Differences
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {translationResult.keyDifferences.map((diff, index) => (
                            <li key={index} className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {diff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {translationResult.compatibilityNotes && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        <div className="flex items-start gap-2">
                          <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                              Compatibility Notes
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                              {translationResult.compatibilityNotes}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Common Patterns */}
            <Card className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Common {sourceDB.toUpperCase()} Patterns
              </h3>
              {commonPatterns.length > 0 ? (
                <div className="space-y-2">
                  {commonPatterns.map((pattern, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(pattern)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-mono ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      } transition-colors`}
                    >
                      {pattern.length > 50 ? pattern.substring(0, 50) + '...' : pattern}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No common patterns available for {sourceDB.toUpperCase()}
                </p>
              )}
            </Card>

            {/* Supported Databases */}
            <Card className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Supported Databases
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularDatabases.map((db) => (
                  <span
                    key={db}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {db.toUpperCase()}
                  </span>
                ))}
              </div>
              <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                + {supportedDatabases.length - popularDatabases.length} more databases supported
              </p>
            </Card>

            {/* Help Card */}
            <Card className={`p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                💡 How it works
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Select source and target databases</li>
                <li>• Enter your query in the source database syntax</li>
                <li>• Click "Translate Query" to convert</li>
                <li>• Review the translation and compatibility notes</li>
                <li>• Use common patterns as examples</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTranslator;
