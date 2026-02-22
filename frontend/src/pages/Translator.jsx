/* eslint-disable */
import React, { useState, useEffect } from 'react';

import {
    LanguageIcon,
    CircleStackIcon,
    CodeBracketIcon,
    ArrowsRightLeftIcon,
    SparklesIcon,
    DocumentDuplicateIcon,
    InformationCircleIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import MonacoEditor from '@monaco-editor/react';
import api from '../utils/api';

// Code Languages
const codeLanguages = [
    { id: 'javascript', name: 'JavaScript', icon: '📜' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'c', name: 'C', icon: '🔩' },
];

// DB Languages
const dbLanguages = [
    { id: 'sql', name: 'Standard SQL', icon: '🗄️' },
    { id: 'mysql', name: 'MySQL', icon: '🐬' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
    { id: 'redis', name: 'Redis', icon: '🔴' },
    { id: 'elasticsearch', name: 'Elasticsearch', icon: '🔍' },
];

const translatorExamples = {
    code: [
        { id: 'c1', name: 'Fibonacci Sequence', code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}', lang: 'javascript' },
        { id: 'c2', name: 'Reverse array in place', code: 'def reverse_array(arr):\n    left = 0\n    right = len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n    return arr', lang: 'python' },
        { id: 'c3', name: 'Fetch Data from API', code: 'fetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data));', lang: 'javascript' }
    ],
    database: [
        { id: 'd1', name: 'Select Adult Users', code: 'SELECT id, name, email\nFROM users\nWHERE age >= 18\nORDER BY created_at DESC;', lang: 'sql' },
        { id: 'd2', name: 'Count Orders per Customer', code: 'SELECT customer_id, COUNT(*) as total_orders\nFROM orders\nGROUP BY customer_id;', lang: 'sql' },
        { id: 'd3', name: 'Find Active Documents', code: 'db.users.find({ status: "active" })', lang: 'mongodb' }
    ]
};

const Translator = () => {
    const [mode, setMode] = useState('code'); // 'code' or 'database'
    const [sourceCode, setSourceCode] = useState('// Enter your code here...');
    const [translatedCode, setTranslatedCode] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const currentLanguages = mode === 'code' ? codeLanguages : dbLanguages;

    const [sourceLang, setSourceLang] = useState(currentLanguages[0].id);
    const [targetLang, setTargetLang] = useState(currentLanguages[1].id);

    // Switch modes safely
    useEffect(() => {
        const langs = mode === 'code' ? codeLanguages : dbLanguages;
        setSourceLang(langs[0].id);
        setTargetLang(langs[1].id);
        if (mode === 'code') {
            setSourceCode('// Enter code here to translate');
        } else {
            setSourceCode('-- Enter query here to translate');
        }
        setTranslatedCode('');
    }, [mode]);

    const handleTranslate = async () => {
        if (!sourceCode.trim()) {
            toast.error('Please enter something to translate');
            return;
        }
        if (sourceLang === targetLang) {
            toast.error('Source and target languages must be different');
            return;
        }

        setIsTranslating(true);
        setTranslatedCode('⏳ Translating using Vertex AI Model...');

        try {
            if (mode === 'code') {
                const response = await api.post('/translation/translate', {
                    code: sourceCode,
                    fromLanguage: sourceLang,
                    toLanguage: targetLang
                });
                if (response.data.success) {
                    setTranslatedCode(response.data.data.translatedCode);
                    toast.success('Code translated successfully!');
                }
            } else {
                const response = await api.post('/database-translation/translate', {
                    sourceQuery: sourceCode,
                    sourceDB: sourceLang,
                    targetDB: targetLang,
                    options: { includeExplanation: true, includeComments: true }
                });
                if (response.data.success) {
                    setTranslatedCode(response.data.data.translatedQuery + (response.data.data.explanation ? `\n\n/* \nExplanation:\n${response.data.data.explanation}\n*/` : ''));
                    toast.success('Query translated successfully!');
                }
            }
        } catch (error) {
            console.error('Translation error:', error);
            setTranslatedCode('❌ Translation failed. Please try again.');
            toast.error(error.response?.data?.message || 'Translation failed');
        } finally {
            setIsTranslating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(translatedCode);
        toast.success('Copied to clipboard!');
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceCode(translatedCode || sourceCode);
        setTranslatedCode('');
    };

    const getMonacoLang = (langId) => {
        if (['sql', 'mysql', 'postgresql'].includes(langId)) return 'sql';
        if (langId === 'mongodb') return 'javascript';
        if (langId === 'redis' || langId === 'elasticsearch') return 'json';
        return langId;
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] w-full bg-gray-900 text-white overflow-hidden rounded-xl shadow-2xl border border-gray-700/50">

                {/* Top Action Bar */}
                <div className="flex-shrink-0 bg-gray-800/80 border-b border-gray-700/50 px-4 py-3 flex items-center justify-between z-20">

                    {/* Left: Mode Selection */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-lg font-bold hidden sm:block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                AI Translator
                            </h1>
                        </div>

                        <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>

                        {/* Mode Switcher */}
                        <div className="flex bg-gray-900/50 p-1 rounded-lg border border-gray-700/50">
                            <button
                                onClick={() => setMode('code')}
                                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'code' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <CodeBracketIcon className="w-4 h-4 mr-2" />
                                Code
                            </button>
                            <button
                                onClick={() => setMode('database')}
                                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'database' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <CircleStackIcon className="w-4 h-4 mr-2" />
                                Database
                            </button>
                        </div>
                    </div>

                    {/* Right: Translate Button */}
                    <div className="flex items-center">
                        <button
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all font-bold text-sm flex items-center shadow-lg"
                        >
                            {isTranslating ? (
                                <span className="flex items-center">
                                    <SparklesIcon className="w-4 h-4 mr-2 animate-pulse" /> Translating...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <SparklesIcon className="w-4 h-4 mr-2" />
                                    {mode === 'code' ? 'Translate Code' : 'Translate Query'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Info Banner at top of page as requested */}
                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-blue-800/30 px-6 py-3 flex items-start gap-4">
                    <InformationCircleIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-blue-200">How AI Code Translation Works</h3>
                        <div className="flex flex-col sm:flex-row gap-x-8 gap-y-1 mt-1">
                            <span className="text-xs text-blue-300/80 flex items-center gap-1.5"><CheckCircleIcon className="w-3.5 h-3.5 text-blue-400" /> Analyzes code structure, variables, and context flow</span>
                            <span className="text-xs text-blue-300/80 flex items-center gap-1.5"><CheckCircleIcon className="w-3.5 h-3.5 text-blue-400" /> Generates syntactically correct target code</span>
                            <span className="text-xs text-blue-300/80 flex items-center gap-1.5"><CheckCircleIcon className="w-3.5 h-3.5 text-blue-400" /> Maps language-specific constructs intelligently</span>
                            <span className="text-xs text-blue-300/80 flex items-center gap-1.5"><CheckCircleIcon className="w-3.5 h-3.5 text-blue-400" /> Adds helpful comments powered by Vertex AI</span>
                        </div>
                    </div>
                </div>

                {/* Language Selectors Area */}
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-6 py-4 bg-gray-800/30 border-b border-gray-700/50 gap-4 overflow-x-auto">

                    {/* Load Example Dropdown - NEW */}
                    <div className="w-full md:w-auto md:flex-1 max-w-[200px] border-r border-gray-700/50 pr-4 mr-2 hidden lg:block shrink-0">
                        <label className="text-xs text-indigo-400 uppercase tracking-wider font-bold mb-1.5 block">Examples</label>
                        <div className="relative">
                            <select
                                onChange={(e) => {
                                    const ex = translatorExamples[mode].find(x => x.id === e.target.value);
                                    if (ex) {
                                        setSourceLang(ex.lang);
                                        setSourceCode(ex.code);
                                    }
                                    e.target.value = ""; // reset
                                }}
                                className="w-full appearance-none bg-indigo-900/20 border border-indigo-700/50 text-indigo-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-sm shadow-sm"
                            >
                                <option value="">Load Example...</option>
                                {translatorExamples[mode].map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-base text-indigo-400">
                                💡
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto max-w-sm shrink-0">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1.5 block">Source Language</label>
                        <div className="relative">
                            <select
                                value={sourceLang}
                                onChange={(e) => setSourceLang(e.target.value)}
                                className="w-full appearance-none bg-gray-800 border border-gray-600 rounded-lg px-8 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                {currentLanguages.map(lang => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-base">
                                {currentLanguages.find(l => l.id === sourceLang)?.icon}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={swapLanguages}
                        className="mx-4 mt-5 p-2 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 transition-colors border border-gray-600 shadow-sm"
                        title="Swap Languages"
                    >
                        <ArrowsRightLeftIcon className="w-5 h-5" />
                    </button>

                    <div className="flex-1 max-w-sm">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1.5 block">Target Language</label>
                        <div className="relative">
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="w-full appearance-none bg-blue-900/30 border border-blue-700/50 text-blue-100 rounded-lg px-8 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                {currentLanguages.map(lang => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-base">
                                {currentLanguages.find(l => l.id === targetLang)?.icon}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Google Translate Side by Side Split layout */}
                <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full relative bg-gray-900">

                    {/* Left Side: Source Editor */}
                    <div className="flex-1 flex flex-col border-r border-gray-700/50 min-h-0">
                        <div className="px-4 py-2 bg-gray-800/20 text-xs font-mono text-gray-400 border-b border-gray-700/50 flex justify-between items-center">
                            <span>Input</span>
                            <div className="flex space-x-3 text-gray-500">
                                <button onClick={() => setSourceCode('')} className="hover:text-gray-300">Clear</button>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <MonacoEditor
                                value={sourceCode}
                                onChange={(value) => setSourceCode(value || '')}
                                language={getMonacoLang(sourceLang)}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    lineNumbers: 'on',
                                    wordWrap: 'on',
                                    scrollBeyondLastLine: false,
                                    padding: { top: 16, bottom: 16 },
                                    renderLineHighlight: 'all',
                                    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                                }}
                            />
                        </div>

                        <div className="bg-gray-800/30 border-t border-gray-700/50 px-4 py-2 flex justify-between items-center text-xs text-gray-500 font-mono shadow-inner">
                            <span>{sourceCode.length} characters</span>
                            <span className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity" onClick={() => setSourceCode('')}>
                                {sourceCode.split('\n').length} lines
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Translation Result */}
                    <div className="flex-1 flex flex-col min-h-0 lg:max-w-1/2 bg-gray-800/10">
                        <div className="px-4 py-2 bg-indigo-900/20 border-b border-indigo-800/30 flex justify-between items-center">
                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Translation Output</span>
                            {translatedCode && (
                                <button
                                    onClick={copyToClipboard}
                                    className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium bg-indigo-500/10 px-2 py-1 rounded"
                                >
                                    <DocumentDuplicateIcon className="w-3.5 h-3.5" /> Copy
                                </button>
                            )}
                        </div>
                        <div className="flex-1 relative">
                            {translatedCode ? (
                                <MonacoEditor
                                    value={translatedCode}
                                    language={getMonacoLang(targetLang)}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 15,
                                        wordWrap: 'on',
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16, bottom: 16 },
                                        renderLineHighlight: 'none',
                                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                                    }}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                    <LanguageIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg opacity-50">Translation will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Translator;
