import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FunnelIcon,
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
  Input, 
  Progress,
  LoadingCard 
} from '../components/ui';
import { useTheme } from '../context/ThemeContext';

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
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 20,
        ...(filters.search && { search: filters.search }),
        ...(filters.language && { language: filters.language }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.category && { category: filters.category }),
      });
      
      const response = await fetch(`/api/v1/mongo-tutorials?${queryParams}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTutorials(data.data?.tutorials || []);
      } else {
        console.error('❌ API Response not OK:', response.status, response.statusText);
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
  
  const FilterSection = () => (
    <Card className={`p-6 mb-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${
          isDarkMode ? 'text-gray-100' : 'text-secondary-900'
        }`}>
          Find Your Perfect Tutorial
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters({ search: '', language: '', difficulty: '', category: '' })}
        >
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search tutorials..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          leftIcon={MagnifyingGlassIcon}
        />
        
        <select
          className="input"
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
        >
          <option value="">All Languages</option>
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>
        
        <select
          className="input"
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
        >
          <option value="">All Difficulties</option>
          {difficulties.map(diff => (
            <option key={diff.id} value={diff.id}>{diff.name}</option>
          ))}
        </select>
        
        <select
          className="input"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    </Card>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-3xl font-bold mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-secondary-900'
        }`}>
          Explore Tutorials
        </h1>
        <p className={`max-w-2xl mx-auto ${
          isDarkMode ? 'text-gray-400' : 'text-secondary-600'
        }`}>
          Discover our comprehensive collection of programming tutorials designed to take you from beginner to expert.
        </p>
      </div>
      
      {/* Filters */}
      <FilterSection />
      
      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            {filteredTutorials.length} Tutorial{filteredTutorials.length !== 1 ? 's' : ''} Found
          </h2>
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-secondary-400" />
            <select className="text-sm border-0 bg-transparent focus:ring-0 text-secondary-600">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Highest Rated</option>
              <option>Shortest</option>
              <option>Longest</option>
            </select>
          </div>
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