/* eslint-disable */
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
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    search: '',
    language: '',
    difficulty: '',
    category: '',
  });

  const TABS = [
    { id: 'all', name: 'All Tutorials', filters: {} },
    { id: 'web-development', name: 'Web Development', filters: { category: 'web-development' } },
    { id: 'javascript', name: 'JavaScript', filters: { language: 'javascript' } },
    { id: 'python', name: 'Python', filters: { language: 'python' } },
    { id: 'database', name: 'Databases', filters: { category: 'Database' } },
    { id: 'algorithms', name: 'Algorithms', filters: { category: 'algorithms' } },
  ];
  
  const languages = [
    { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500' },
    { id: 'python', name: 'Python', color: 'bg-blue-500' },
    { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600' },
    { id: 'java', name: 'Java', color: 'bg-red-500' },
    { id: 'c', name: 'C', color: 'bg-purple-500' },
    { id: 'cpp', name: 'C++', color: 'bg-purple-600' },
    { id: 'sql', name: 'SQL', color: 'bg-blue-400' },
  ];
  
  const difficulties = [
    { id: 'beginner', name: 'Beginner', color: 'success' },
    { id: 'intermediate', name: 'Intermediate', color: 'warning' },
    { id: 'advanced', name: 'Advanced', color: 'error' },
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
        // Including all tutorials (both programming and database)
        setTutorials(response.data.data?.tutorials || []);
      } else {
        console.error('❌ API Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const tab = TABS.find(t => t.id === tabId);
    setFilters({
      search: searchQuery,
      language: tab.filters.language || '',
      difficulty: '',
      category: tab.filters.category || '',
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setFilters(prev => ({ ...prev, search: val }));
  };
  
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
        className="h-full"
      >
        <Card hover className={`p-6 h-full transition-colors duration-300 flex flex-col ${
          isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:border-gray-300'
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
              
              <h3 className={`text-lg font-semibold mb-2 line-clamp-1 ${
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
          </div>
          
          <div className="mt-auto">
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
            
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {tutorial.author?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-secondary-600'
                }`}>
                  {tutorial.author?.name || 'Seek Team'}
                </span>
              </div>
              
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-secondary-600'
              }`}>
                {tutorial.stepCount || (Array.isArray(tutorial.lessons) ? tutorial.lessons.length : (tutorial.lessonsCount || 3))} steps
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-secondary-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
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
        <div className="w-full md:w-72 relative">
          <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
            isDarkMode ? 'text-gray-500' : 'text-secondary-400'
          }`} />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500'
                : 'bg-white border-secondary-200 text-secondary-900 placeholder-secondary-400 focus:border-primary-500'
            } border focus:outline-none focus:ring-1 focus:ring-primary-500/30`}
          />
        </div>
      </div>

      {/* Udemy-style Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-secondary-200 dark:border-gray-800 overflow-x-auto no-scrollbar pb-[1px]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap pb-3 px-2 border-b-2 font-medium text-sm transition-colors duration-200 mr-6 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-secondary-500 hover:text-secondary-800 hover:border-secondary-300 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-secondary-600'}`}>
            Showing {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''}
          </p>

          <select className={`text-sm font-medium border-0 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500/30 cursor-pointer ${
            isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-secondary-700 hover:bg-gray-200'
          }`}>
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Highest Rated</option>
            <option>Shortest</option>
          </select>
        </div>
        
        {filteredTutorials.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="text-secondary-300 dark:text-gray-600 mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-200 mb-2">
              No tutorials found
            </h3>
            <p className="text-secondary-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              We couldn't find any tutorials matching your current tab or search criteria.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery('');
                handleTabChange('all');
              }}
            >
              Clear filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial, index) => (
                <Link key={tutorial._id || tutorial.id} to={`/tutorials/${tutorial.slug || tutorial.id}`} className="block h-full transition-transform hover:-translate-y-1 duration-300">
                  <TutorialCard tutorial={tutorial} />
                </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
