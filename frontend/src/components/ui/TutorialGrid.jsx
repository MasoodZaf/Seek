import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { Input, Select, Button, Badge, TutorialCard } from './';

const TutorialGrid = ({
  tutorials = [],
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  viewToggle = true,
  onTutorialClick,
  onBookmark,
  onRate,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filters
  const languages = useMemo(() => {
    const unique = [...new Set(tutorials.map(t => t.language).filter(Boolean))];
    return [
      { value: 'all', label: 'All Languages' },
      ...unique.map(lang => ({ value: lang, label: lang.charAt(0).toUpperCase() + lang.slice(1) }))
    ];
  }, [tutorials]);

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const categories = useMemo(() => {
    const unique = [...new Set(tutorials.map(t => t.category).filter(Boolean))];
    return [
      { value: 'all', label: 'All Categories' },
      ...unique.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
    ];
  }, [tutorials]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' },
    { value: 'progress', label: 'My Progress' },
  ];

  // Filter and sort tutorials
  const filteredAndSortedTutorials = useMemo(() => {
    let filtered = tutorials;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.language?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.language === selectedLanguage);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === selectedDifficulty);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'popular':
          return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'duration':
          return (a.estimatedDuration || 0) - (b.estimatedDuration || 0);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    return filtered;
  }, [tutorials, searchTerm, selectedLanguage, selectedDifficulty, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const hasActiveFilters = searchTerm || selectedLanguage !== 'all' || selectedDifficulty !== 'all' || selectedCategory !== 'all';

  if (loading) {
    return (
      <div className={clsx('space-y-6', className)}>
        {/* Loading skeleton for filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse" />
            <div className="w-32 h-10 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse" />
          </div>
        </div>
        
        {/* Loading skeleton for grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-secondary-200 dark:bg-secondary-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-6', className)} {...props}>
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Main search and controls */}
        <div className="flex flex-col md:flex-row gap-4">
          {searchable && (
            <div className="flex-1">
              <Input
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={MagnifyingGlassIcon}
                className="w-full"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            {filterable && (
              <Button
                variant={showFilters ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="primary" size="xs" className="ml-2">
                    {[searchTerm, selectedLanguage !== 'all', selectedDifficulty !== 'all', selectedCategory !== 'all'].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            )}
            
            {viewToggle && (
              <div className="flex border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
                <button
                  className={clsx(
                    'p-2 transition-colors',
                    viewMode === 'grid' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  className={clsx(
                    'p-2 transition-colors',
                    viewMode === 'list' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    options={languages}
                    className="flex-1"
                  />
                  <Select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    options={difficulties}
                    className="flex-1"
                  />
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    options={categories}
                    className="flex-1"
                  />
                  {sortable && (
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      options={sortOptions}
                      className="flex-1"
                    />
                  )}
                </div>
                
                {hasActiveFilters && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {filteredAndSortedTutorials.length} of {tutorials.length} tutorials
                    </span>
                    <Button variant="ghost" size="xs" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Results header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Tutorials'}
          </h3>
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            {filteredAndSortedTutorials.length} tutorial{filteredAndSortedTutorials.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tutorial grid/list */}
        {filteredAndSortedTutorials.length > 0 ? (
          <div className={clsx(
            'gap-6',
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'space-y-4'
          )}>
            <AnimatePresence>
              {filteredAndSortedTutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <TutorialCard
                    tutorial={tutorial}
                    size={viewMode === 'list' ? 'sm' : 'md'}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                    onClick={onTutorialClick}
                    onBookmark={onBookmark}
                    onRate={onRate}
                    animate
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-secondary-200 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              No tutorials found
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              {searchTerm 
                ? `No tutorials match your search for "${searchTerm}"`
                : 'No tutorials match your current filters'
              }
            </p>
            {hasActiveFilters && (
              <Button variant="primary" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TutorialGrid;