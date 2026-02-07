import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  Button,
  Badge,
  Progress,
  LoadingCard
} from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState({
    search: '',
    language: '',
    difficulty: '',
    category: '',
  });
  
  const languages = [
    { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500' },
    { id: 'python', name: 'Python', color: 'bg-blue-500' },
    { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600' },
    { id: 'java', name: 'Java', color: 'bg-red-500' },
    { id: 'c', name: 'C', color: 'bg-purple-500' },
    { id: 'cpp', name: 'C++', color: 'bg-purple-600' },
  ];
  
  const difficulties = [
    { id: 'beginner', name: 'Beginner', color: 'success' },
    { id: 'intermediate', name: 'Intermediate', color: 'warning' },
    { id: 'advanced', name: 'Advanced', color: 'error' },
  ];
  
  const categories = [
    { id: 'fundamentals', name: 'Fundamentals' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'data-structures', name: 'Data Structures' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'frameworks', name: 'Frameworks' },
  ];
  
  useEffect(() => {
    fetchTutorials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mongo-tutorials', {
        params: {
          page: 1,
          limit: 50,
          ...(filters.search && { search: filters.search }),
          ...(filters.language && { language: filters.language }),
          ...(filters.difficulty && { difficulty: filters.difficulty }),
          ...(filters.category && { category: filters.category }),
        }
      });

      if (response.data.success) {
        // Filter out database tutorials (category: 'Database')
        const allTutorials = response.data.data?.tutorials || [];
        const programmingTutorials = allTutorials.filter(tutorial =>
          tutorial.category !== 'Database'
        );
        setTutorials(programmingTutorials);
      } else {
        console.error('❌ API Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      // Fallback to empty array on error
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };
  
  // The API handles filtering now, so we just use the returned tutorials
  const filteredTutorials = tutorials;
  
  
  const TutorialCard = ({ tutorial }) => {
    
    // Safe lookups with fallbacks
    const language = languages.find(l => l.id === tutorial.language) || { 
      id: tutorial.language, 
      name: tutorial.language || 'Unknown', 
      color: 'bg-gray-400' 
    };
    
    const difficulty = difficulties.find(d => d.id === tutorial.difficulty) || { 
      id: tutorial.difficulty, 
      name: tutorial.difficulty || 'Unknown', 
      color: 'primary' 
    };
    
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card hover className={`p-6 h-full transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${language.color}`} />
                <Badge variant={difficulty.color} size="sm">
                  {difficulty.name}
                </Badge>
                {tutorial.enrolled && (
                  <Badge variant="primary" size="sm">
                    Enrolled
                  </Badge>
                )}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-secondary-900'
              }`}>
                {tutorial.title}
              </h3>
              
              <p className={`text-sm mb-4 line-clamp-2 ${
                isDarkMode ? 'text-gray-400' : 'text-secondary-600'
              }`}>
                {tutorial.description}
              </p>
            </div>
            
            <Button variant="primary" size="sm">
              <PlayIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {tutorial.enrolled && tutorial.progress > 0 && (
            <div className="mb-4">
              <Progress 
                value={tutorial.progress} 
                size="sm" 
                showLabel={false}
              />
              <p className="text-xs text-secondary-600 mt-1">
                {tutorial.progress}% complete
              </p>
            </div>
          )}
          
          <div className={`flex items-center justify-between text-sm mb-4 ${
            isDarkMode ? 'text-gray-500' : 'text-secondary-500'
          }`}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{Math.floor((tutorial.estimatedTime || tutorial.estimatedDuration || 0) / 60)}h {(tutorial.estimatedTime || tutorial.estimatedDuration || 0) % 60}m</span>
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span>{tutorial.stats?.views || tutorial.stats?.enrollments || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span>{tutorial.rating?.average || tutorial.stats?.averageRating || 0}</span>
              <span className="text-secondary-400 ml-1">
                ({tutorial.rating?.count || tutorial.stats?.totalRatings || 0})
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {tutorial.author?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                </span>
              </div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-secondary-600'
              }`}>
                {tutorial.author?.name || 'Seek Team'}
              </span>
            </div>
            
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-secondary-600'
            }`}>
              {tutorial.stepCount || (Array.isArray(tutorial.lessons) ? tutorial.lessons.length : (tutorial.lessonsCount || 3))} steps
            </span>
          </div>
        </Card>
      </motion.div>
    );
  };
  
  const hasActiveFilters = filters.language || filters.difficulty || filters.category;

  const FilterChip = ({ label, active, onClick }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-primary-800 to-accent-500 text-white shadow-sm'
          : isDarkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            : 'bg-white text-secondary-600 hover:text-secondary-900 hover:border-accent-400 border border-secondary-200'
      }`}
    >
      {label}
    </motion.button>
  );

  const FilterSection = () => (
    <div className={`rounded-xl p-4 ${
      isDarkMode ? 'bg-gray-800/50' : 'bg-white border border-secondary-100 shadow-sm'
    }`}>
      {/* Search */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
          isDarkMode ? 'text-gray-500' : 'text-secondary-400'
        }`} />
        <input
          type="text"
          placeholder="Search tutorials..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors ${
            isDarkMode
              ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-accent-500'
              : 'bg-secondary-50 border-secondary-200 text-secondary-900 placeholder-secondary-400 focus:border-accent-500'
          } border focus:outline-none focus:ring-1 focus:ring-accent-500/30`}
        />
      </div>

      {/* Filter rows */}
      <div className="space-y-3">
        {/* Languages */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold uppercase tracking-wider min-w-[70px] ${
            isDarkMode ? 'text-gray-500' : 'text-secondary-400'
          }`}>Language</span>
          <div className="flex gap-1.5 flex-wrap">
            {languages.map((lang) => (
              <FilterChip
                key={lang.id}
                label={lang.name}
                active={filters.language === lang.id}
                onClick={() => setFilters({ ...filters, language: filters.language === lang.id ? '' : lang.id })}
              />
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold uppercase tracking-wider min-w-[70px] ${
            isDarkMode ? 'text-gray-500' : 'text-secondary-400'
          }`}>Level</span>
          <div className="flex gap-1.5 flex-wrap">
            {difficulties.map((diff) => (
              <FilterChip
                key={diff.id}
                label={diff.name}
                active={filters.difficulty === diff.id}
                onClick={() => setFilters({ ...filters, difficulty: filters.difficulty === diff.id ? '' : diff.id })}
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold uppercase tracking-wider min-w-[70px] ${
            isDarkMode ? 'text-gray-500' : 'text-secondary-400'
          }`}>Topic</span>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.name}
                active={filters.category === cat.id}
                onClick={() => setFilters({ ...filters, category: filters.category === cat.id ? '' : cat.id })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-secondary-100 flex justify-end">
          <button
            onClick={() => setFilters({ search: filters.search, language: '', difficulty: '', category: '' })}
            className={`text-xs font-medium ${
              isDarkMode ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-700'
            } transition-colors`}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-secondary-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${
            isDarkMode ? 'text-gray-100' : 'text-secondary-900'
          }`}>
            Explore Tutorials
          </h1>
          <p className={`text-sm mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-secondary-500'
          }`}>
            From beginner to expert — find your next lesson.
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterSection />
      
      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-secondary-500'}`}>
            <span className="font-semibold">{filteredTutorials.length}</span> tutorial{filteredTutorials.length !== 1 ? 's' : ''}
          </p>

          <select className={`text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent-500/30 ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-secondary-200 text-secondary-600'
          }`}>
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Highest Rated</option>
            <option>Shortest</option>
            <option>Longest</option>
          </select>
        </div>
        
        
        {filteredTutorials.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-secondary-400 mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No tutorials found
            </h3>
            <p className="text-secondary-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button
              variant="ghost"
              onClick={() => setFilters({ search: '', language: '', difficulty: '', category: '' })}
            >
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial, index) => (
                <Link key={tutorial._id || tutorial.id} to={`/tutorials/${tutorial.slug || tutorial.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TutorialCard tutorial={tutorial} />
                  </motion.div>
                </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;