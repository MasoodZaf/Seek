import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChatBubbleLeftEllipsisIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    BookOpenIcon,
    FireIcon,
    TagIcon,
} from '@heroicons/react/24/outline';
import { Card, Button, Input, Badge } from '../components/ui';
import { useTheme } from '../context/ThemeContext';

const mockPosts = [
    {
        id: 1,
        type: 'question',
        title: 'How to handle state in deep React component trees without Redux?',
        content: 'I have a React application that is growing quite large. I am trying to avoid bringing in Redux or RTK immediately. What are the best practices for passing state down deep component trees? Is Context API sufficient for high-frequency updates?',
        author: { name: 'Sarah Developer', avatar: 'S' },
        upvotes: 42,
        answers: 8,
        tags: ['React', 'State Management'],
        timeAgo: '2 hours ago',
    },
    {
        id: 2,
        type: 'tutorial',
        title: 'Building a custom React Hook for WebSockets',
        content: 'In this tutorial, I will show you how to build a robust custom React hook for managing WebSocket connections, handling reconnections, and subscribing to specific channels.',
        author: { name: 'Alex TechInsight', avatar: 'A' },
        upvotes: 156,
        answers: 23,
        tags: ['React', 'Hooks', 'WebSockets'],
        timeAgo: '5 hours ago',
    },
    {
        id: 3,
        type: 'question',
        title: 'Docker Compose networking issue between Node and PostgreSQL',
        content: 'My Node.js backend cannot connect to the PostgreSQL database when running via Docker Compose. I get a ECONNREFUSED error. My docker-compose.yml uses the default bridge network. Any ideas?',
        author: { name: 'DevOps Beginner', avatar: 'D' },
        upvotes: 15,
        answers: 3,
        tags: ['Docker', 'PostgreSQL', 'NodeJS'],
        timeAgo: '1 day ago',
    },
    {
        id: 4,
        type: 'tutorial',
        title: 'Advanced TypeScript Patterns: Conditional Types',
        content: "Conditional types let you describe the relation between types based on a condition... Let's explore how to create powerfully reusable type utilities.",
        author: { name: 'TS Master', avatar: 'T' },
        upvotes: 89,
        answers: 12,
        tags: ['TypeScript', 'Advanced'],
        timeAgo: '2 days ago',
    }
];

const Community = () => {
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = mockPosts.filter((post) => {
        if (activeTab === 'questions' && post.type !== 'question') return false;
        if (activeTab === 'tutorials' && post.type !== 'tutorial') return false;
        if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-secondary-900'}`}>
                        Community Central
                    </h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-secondary-600'}`}>
                        Ask questions, share your knowledge, and connect with other developers.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <PencilSquareIcon className="h-5 w-5" />
                        Ask Question
                    </Button>
                    <Button variant="primary" className="flex items-center gap-2">
                        <BookOpenIcon className="h-5 w-5" />
                        Share Tutorial
                    </Button>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column - Feed */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Controls */}
                    <Card className={`p-4 flex flex-col md:flex-row gap-4 justify-between transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex space-x-1 border-b border-transparent md:border-secondary-200 md:dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`py-2 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === 'all'
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-b-2 border-primary-600'
                                        : 'text-secondary-600 hover:text-secondary-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Hot
                            </button>
                            <button
                                onClick={() => setActiveTab('questions')}
                                className={`py-2 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === 'questions'
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-b-2 border-primary-600'
                                        : 'text-secondary-600 hover:text-secondary-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Questions
                            </button>
                            <button
                                onClick={() => setActiveTab('tutorials')}
                                className={`py-2 px-4 font-medium text-sm transition-colors rounded-t-lg ${activeTab === 'tutorials'
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-b-2 border-primary-600'
                                        : 'text-secondary-600 hover:text-secondary-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                User Tutorials
                            </button>
                        </div>
                        <div className="w-full md:w-64">
                            <Input
                                placeholder="Search community..."
                                leftIcon={MagnifyingGlassIcon}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : ''}
                            />
                        </div>
                    </Card>

                    {/* Posts Feed */}
                    <div className="space-y-4">
                        {filteredPosts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className={`flex overflow-hidden transition-colors duration-300 hover:border-primary-300 dark:hover:border-primary-700 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    {/* Upvote Column */}
                                    <div className={`w-12 flex flex-col items-center py-4 border-r ${isDarkMode ? 'bg-gray-900/30 border-gray-700/50' : 'bg-gray-50/50 border-gray-100'} flex-shrink-0`}>
                                        <button className="text-secondary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-800 p-1 rounded transition-colors">
                                            <ArrowUpIcon className="h-5 w-5 font-bold" />
                                        </button>
                                        <span className={`text-sm font-bold my-1 ${isDarkMode ? 'text-gray-300' : 'text-secondary-700'}`}>{post.upvotes}</span>
                                        <button className="text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 p-1 rounded transition-colors">
                                            <ArrowDownIcon className="h-5 w-5 font-bold" />
                                        </button>
                                    </div>

                                    {/* Content Column */}
                                    <div className="p-4 flex-1">
                                        <div className="flex items-center gap-2 mb-2 text-xs">
                                            <div className="h-5 w-5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                                                {post.author.avatar}
                                            </div>
                                            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary-700'}`}>{post.author.name}</span>
                                            <span className="text-secondary-400">•</span>
                                            <span className="text-secondary-400">{post.timeAgo}</span>
                                            <span className="text-secondary-400">•</span>
                                            <Badge variant={post.type === 'question' ? 'warning' : 'success'} size="sm" className="text-[10px] px-1.5 py-0">
                                                {post.type.toUpperCase()}
                                            </Badge>
                                        </div>

                                        <h3 className={`text-lg font-bold mb-1 cursor-pointer hover:text-primary-600 transition-colors ${isDarkMode ? 'text-gray-100' : 'text-secondary-900'}`}>
                                            {post.title}
                                        </h3>

                                        <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-secondary-600'}`}>
                                            {post.content}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {post.tags.map(tag => (
                                                    <span key={tag} className={`text-xs px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-secondary-100 text-secondary-600'}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className={`flex items-center gap-1 text-sm font-medium ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-secondary-500 hover:text-secondary-800'} transition-colors cursor-pointer`}>
                                                <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                                                <span>{post.answers} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <Card className={`p-5 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-primary-900/40 to-purple-900/40 border-primary-800' : 'bg-gradient-to-br from-primary-50 to-purple-50 border-primary-100'}`}>
                        <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-secondary-900'}`}>
                            About Community
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-secondary-600'}`}>
                            A place for developers to share technical knowledge, publish user-made tutorials, and get help with tricky bugs.
                        </p>
                        <div className={`flex justify-between items-center text-sm font-medium border-t pt-4 ${isDarkMode ? 'border-primary-800/50 text-gray-300' : 'border-primary-200/50 text-secondary-700'}`}>
                            <div>
                                <p className="text-xl font-bold">12.4k</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-secondary-500'}`}>Members</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span> 421</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-secondary-500'}`}>Online</p>
                            </div>
                        </div>
                    </Card>

                    <Card className={`p-5 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-secondary-900'}`}>
                            <FireIcon className="h-5 w-5 text-orange-500" />
                            Trending Topics
                        </h3>
                        <div className="space-y-3">
                            {['React 19 Hooks', 'Docker networking', 'Advanced SQL', 'System Design', 'NextJS SSR'].map(tag => (
                                <div key={tag} className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <TagIcon className={`h-4 w-4 ${isDarkMode ? 'text-gray-500 group-hover:text-primary-400' : 'text-secondary-400 group-hover:text-primary-600'} transition-colors`} />
                                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300 group-hover:text-primary-400' : 'text-secondary-600 group-hover:text-primary-600'} transition-colors`}>{tag}</span>
                                    </div>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-secondary-400'}`}>+{Math.floor(Math.random() * 50) + 10}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Community;
