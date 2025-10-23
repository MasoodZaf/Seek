import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CodeBracketIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { Card, Button, Input, Loading } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Challenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    category: 'all',
    status: 'all',
    search: ''
  });

  // Check if user is admin (you can customize this check)
  const isAdmin = user?.role === 'admin' || user?.email?.includes('admin');

  const difficulties = ['all', 'easy', 'medium', 'hard'];
  const categories = [
    'all',
    'Array',
    'String',
    'Hash Table',
    'Dynamic Programming',
    'Math',
    'Sorting',
    'Greedy',
    'Binary Search',
    'Stack',
    'Linked List',
    'Two Pointers',
    'Sliding Window'
  ];

  useEffect(() => {
    fetchChallenges();
    if (user) {
      fetchStats();
    }
  }, [filters, currentPage]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const params = {
        difficulty: filters.difficulty !== 'all' ? filters.difficulty : '',
        category: filters.category !== 'all' ? filters.category : '',
        status: filters.status !== 'all' ? filters.status : '',
        search: filters.search,
        userId: user?.id || '',
        page: currentPage,
        limit: isAdmin ? 1000 : 50, // Admin sees all challenges
        admin: isAdmin ? 'true' : 'false'
      };

      const response = await api.get('/challenges', { params });

      if (response.data.success) {
        setChallenges(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/challenges/stats/summary', {
        params: { userId: user.id }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600 bg-green-50',
      medium: 'text-orange-600 bg-orange-50',
      hard: 'text-red-600 bg-red-50'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-50';
  };

  const getDifficultyBadge = (difficulty) => {
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Coding Challenges
              </h1>
              <p className="text-gray-600">
                Master algorithms and data structures with LeetCode-style problems
              </p>
            </div>
            <CodeBracketIcon className="h-16 w-16 text-indigo-600" />
          </div>

          {/* User Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Solved</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.solvedChallenges}
                      <span className="text-lg text-gray-500">/{stats.totalChallenges}</span>
                    </p>
                  </div>
                  <CheckCircleSolid className="h-10 w-10 text-green-600" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Easy</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.byDifficulty.easy}
                    </p>
                  </div>
                  <TrophyIcon className="h-8 w-8 text-blue-600" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Medium</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.byDifficulty.medium}
                    </p>
                  </div>
                  <FireIcon className="h-8 w-8 text-orange-600" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hard</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.byDifficulty.hard}
                    </p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-red-600" />
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {user && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, status: 'all' })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.status === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: 'accepted' })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.status === 'accepted'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Solved
              </button>
              <button
                onClick={() => setFilters({ ...filters, status: 'todo' })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.status === 'todo'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                To Do
              </button>
            </div>
          )}
        </Card>

        {/* Challenges List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loading size="large" />
          </div>
        ) : challenges.length === 0 ? (
          <Card className="p-12 text-center">
            <CodeBracketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No challenges found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/challenges/${challenge.slug}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Number */}
                        <div className="w-16 text-center">
                          <span className="text-lg font-semibold text-gray-700">
                            #{challenge.number}
                          </span>
                        </div>

                        {/* Status Icon */}
                        <div className="w-8">
                          {challenge.solved && (
                            <CheckCircleSolid className="h-6 w-6 text-green-600" />
                          )}
                        </div>

                        {/* Title & Category */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600">
                            {challenge.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="font-medium">{challenge.category}</span>
                            {challenge.companies && challenge.companies.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex gap-2">
                                  {challenge.companies.slice(0, 3).map(company => (
                                    <span
                                      key={company}
                                      className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                                    >
                                      {company}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Acceptance Rate */}
                        <div className="hidden md:block text-center w-24">
                          <p className="text-sm text-gray-600 mb-1">Acceptance</p>
                          <p className="text-lg font-semibold text-green-600">
                            {challenge.acceptanceRate?.toFixed(1)}%
                          </p>
                        </div>

                        {/* Difficulty */}
                        <div className="w-28">
                          {getDifficultyBadge(challenge.difficulty)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination - Only show for non-admin users */}
            {!isAdmin && pagination && pagination.totalPages > 1 && (
              <Card className="p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing page {pagination.currentPage} of {pagination.totalPages}
                    <span className="ml-2">({pagination.totalItems} total challenges)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = currentPage <= 3
                          ? i + 1
                          : currentPage >= pagination.totalPages - 2
                            ? pagination.totalPages - 4 + i
                            : currentPage - 2 + i;

                        if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 rounded ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Admin indicator */}
            {isAdmin && (
              <Card className="p-4 mt-6 bg-purple-50 border-purple-200">
                <div className="flex items-center justify-center gap-2 text-purple-700">
                  <TrophyIcon className="h-5 w-5" />
                  <span className="font-semibold">Admin Mode: Showing all {pagination?.totalItems || challenges.length} challenges</span>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Challenges;
