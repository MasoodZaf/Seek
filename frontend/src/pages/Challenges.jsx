/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CodeBracketIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { Card, Button, Loading } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DIFF_COLORS = {
  easy: { badge: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/40', dot: 'bg-emerald-400' },
  medium: { badge: 'bg-amber-900/50 text-amber-300 border border-amber-700/40', dot: 'bg-amber-400' },
  hard: { badge: 'bg-red-900/50 text-red-300 border border-red-700/40', dot: 'bg-red-400' }
};

const DiffBadge = ({ d }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${DIFF_COLORS[d]?.badge || ''}`}>
    {d.charAt(0).toUpperCase() + d.slice(1)}
  </span>
);

const Challenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userLevel = user?.progress?.level || 1;

  // Mode: 'deck' (default for logged-in) or 'browse' (full list)
  const [mode, setMode] = useState(user ? 'deck' : 'browse');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Deck state
  const [deck, setDeck] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(200);
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Browse state
  const [challenges, setChallenges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ difficulty: 'all', category: 'all', search: '' });
  const [stats, setStats] = useState(null);

  const categories = [
    'all','Array','String','Hash Table','Dynamic Programming','Math','Sorting',
    'Greedy','Binary Search','Stack','Linked List','Two Pointers','Sliding Window',
    'Graph','Tree','Backtracking','Design','Union Find','Breadth-First Search','Depth-First Search'
  ];

  // ── Fetch deck ───────────────────────────────────────────────────────────
  const fetchDeck = useCallback(async (isRefresh = false) => {
    if (!user) return;
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      const res = await api.get('/challenges/deck');
      if (res.data.success) {
        setDeck(res.data.data.challenges);
        setSolvedCount(res.data.data.solvedCount);
        setTotalCount(res.data.data.totalCount);
      }
    } catch (e) {
      toast.error('Failed to load challenge deck');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const fetchCompleted = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/challenges/deck?showCompleted=true');
      if (res.data.success) {
        setCompletedChallenges(res.data.data.challenges);
        setSolvedCount(res.data.data.solvedCount);
      }
    } catch (e) {}
  }, [user]);

  // ── Fetch browse list ────────────────────────────────────────────────────
  const fetchBrowse = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        difficulty: filters.difficulty !== 'all' ? filters.difficulty : '',
        category: filters.category !== 'all' ? filters.category : '',
        search: filters.search,
        userId: user?.id || '',
        page: currentPage,
        limit: 50
      };
      const res = await api.get('/challenges', { params });
      if (res.data.success) {
        setChallenges(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, user]);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/challenges/stats/summary', { params: { userId: user.id } });
      if (res.data.success) setStats(res.data.data);
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    if (mode === 'deck') {
      if (showCompleted) fetchCompleted();
      else fetchDeck();
    } else {
      fetchBrowse();
    }
    if (user) fetchStats();
  }, [mode, showCompleted, filters, currentPage]);

  const handleRefreshDeck = () => fetchDeck(true);

  const progressPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const displayList = mode === 'deck'
    ? (showCompleted ? completedChallenges : deck)
    : challenges;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-50 tracking-tight">Coding Challenges</h1>
              <p className="text-gray-400 mt-1 text-sm">200 problems · Easy → Hard</p>
            </div>
            <CodeBracketIcon className="h-12 w-12 text-indigo-500 opacity-80" />
          </div>

          {/* Progress bar */}
          {user && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{solvedCount} solved</span>
                <span>{totalCount - solvedCount} remaining · {progressPct}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div
                  className="bg-indigo-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Stats row ── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Solved', value: `${stats.solvedChallenges}/${stats.totalChallenges}`, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-700/30' },
              { label: 'Easy', value: stats.byDifficulty.easy, color: 'text-emerald-300', bg: 'bg-gray-800/60 border-gray-700/30' },
              { label: 'Medium', value: stats.byDifficulty.medium, color: 'text-amber-300', bg: 'bg-gray-800/60 border-gray-700/30' },
              { label: 'Hard', value: stats.byDifficulty.hard, color: 'text-red-300', bg: 'bg-gray-800/60 border-gray-700/30' }
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`${s.bg} border rounded-xl p-3 flex items-center justify-between`}>
                <span className="text-xs text-gray-400 font-medium">{s.label}</span>
                <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Mode switcher + deck controls ── */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {user && (
            <>
              <div className="flex bg-gray-800 rounded-xl p-1 gap-1">
                <button
                  onClick={() => { setMode('deck'); setShowCompleted(false); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === 'deck' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  My Deck
                </button>
                <button
                  onClick={() => setMode('browse')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === 'browse' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Browse All
                </button>
              </div>

              {mode === 'deck' && (
                <>
                  <button
                    onClick={handleRefreshDeck}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 hover:border-indigo-500 hover:text-indigo-300 transition-all"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Deck
                  </button>

                  <button
                    onClick={() => setShowCompleted(v => !v)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all ${
                      showCompleted
                        ? 'bg-emerald-900/40 border-emerald-600 text-emerald-300'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-emerald-600 hover:text-emerald-300'
                    }`}
                  >
                    {showCompleted ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    {showCompleted ? 'Hide Completed' : `View Completed (${solvedCount})`}
                  </button>
                </>
              )}
            </>
          )}

          {/* Search (always visible in browse mode, or for guests) */}
          {(mode === 'browse' || !user) && (
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Filters for browse mode */}
        {mode === 'browse' && (
          <div className="flex flex-wrap gap-3 mb-5">
            <select
              value={filters.difficulty}
              onChange={e => { setFilters({ ...filters, difficulty: e.target.value }); setCurrentPage(1); }}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={filters.category}
              onChange={e => { setFilters({ ...filters, category: e.target.value }); setCurrentPage(1); }}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        )}

        {/* Deck label */}
        {mode === 'deck' && !showCompleted && !loading && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 font-mono">
            <span className="bg-indigo-900/40 text-indigo-400 border border-indigo-700/30 px-2 py-0.5 rounded">
              {deck.length} challenges · weighted for Level {userLevel}
            </span>
            <span>New deck on each refresh · completed problems hidden automatically</span>
          </div>
        )}
        {mode === 'deck' && showCompleted && !loading && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            <CheckCircleSolid className="h-4 w-4 text-emerald-400" />
            <span>Showing {completedChallenges.length} completed challenges</span>
          </div>
        )}

        {/* ── Challenge grid ── */}
        {loading ? (
          <div className="flex justify-center py-16"><Loading size="large" /></div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CodeBracketIcon className="h-14 w-14 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">
              {mode === 'deck' && showCompleted
                ? "You haven't solved any challenges yet — let's change that!"
                : "No challenges match your filters"}
            </p>
            {mode === 'deck' && !showCompleted && (
              <p className="text-sm mt-1">All challenges in this difficulty range are completed! Try refreshing.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {displayList.map((challenge, i) => (
                  <motion.div
                    key={challenge._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.4) }}
                  >
                    <div
                      onClick={() => navigate(`/challenges/${challenge.slug}`)}
                      className={`
                        relative p-5 rounded-xl border cursor-pointer flex flex-col h-full transition-all duration-150
                        ${challenge.solved
                          ? 'bg-emerald-900/10 border-emerald-700/30 hover:border-emerald-500/50'
                          : 'bg-gray-800/60 border-gray-700/40 hover:border-indigo-500/60 hover:bg-gray-800'
                        }
                        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30
                      `}
                    >
                      {/* Solved checkmark */}
                      {challenge.solved && (
                        <CheckCircleSolid className="absolute top-4 right-4 h-5 w-5 text-emerald-400 opacity-70" />
                      )}

                      {/* Number + difficulty */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-500">#{challenge.number}</span>
                        <DiffBadge d={challenge.difficulty} />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-100 leading-snug mb-1.5 pr-6 flex-1">
                        {challenge.title}
                      </h3>

                      {/* Category */}
                      <p className="text-xs text-gray-500 mb-3">{challenge.category}</p>

                      {/* Companies */}
                      {challenge.companies?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {challenge.companies.slice(0, 3).map(co => (
                            <span key={co} className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded text-xs border border-blue-700/30">
                              {co}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-700/50 mt-auto">
                        <span className="text-xs text-gray-500">Acceptance</span>
                        <span className="text-xs font-semibold text-emerald-400">
                          {challenge.acceptanceRate > 0 ? `${challenge.acceptanceRate.toFixed(0)}%` : '—'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Browse pagination */}
            {mode === 'browse' && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 p-4 bg-gray-800/50 border border-gray-700/40 rounded-xl">
                <span className="text-sm text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages} · {pagination.totalItems} challenges
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-600 transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const p = currentPage <= 3 ? i + 1
                      : currentPage >= pagination.totalPages - 2 ? pagination.totalPages - 4 + i
                      : currentPage - 2 + i;
                    if (p < 1 || p > pagination.totalPages) return null;
                    return (
                      <button key={p} onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          currentPage === p ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >{p}</button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-600 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Challenges;
