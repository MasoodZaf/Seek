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
import offlineService from '../services/offlineService';

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
    { id: 'web-development', name: 'Web Development', filters: { category: 'Web Development' } },
    { id: 'javascript', name: 'JavaScript', filters: { language: 'javascript' } },
    { id: 'python', name: 'Python', filters: { language: 'python' } },
    { id: 'database', name: 'Databases', filters: { category: 'Database' } },
    { id: 'algorithms', name: 'Algorithms', filters: { category: 'Algorithms' } },
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
        const fetched = response.data.data?.tutorials || [];
        setTutorials(fetched);
        // Cache each tutorial in IndexedDB for offline access
        fetched.forEach(t => offlineService.storeTutorial({ ...t, id: t._id || t.id }));
      } else {
        console.error('❌ API Response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tutorials, trying offline cache:', error);
      // Serve from IndexedDB when offline
      const cached = await offlineService.getAllTutorials(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      );
      if (cached.length > 0) {
        setTutorials(cached);
      } else {
        setTutorials([]);
      }
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
        <Card hover className="p-6 h-full transition-colors duration-300 flex flex-col bg-codearc-900 border-white/10">
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
              
              <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-codearc-50">
                {tutorial.title}
              </h3>

              <p className="text-sm mb-4 line-clamp-2 text-codearc-300">
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
            
            <div className="flex items-center justify-between text-sm mb-4 text-codearc-500">
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
            
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {tutorial.author?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                  </span>
                </div>
                <span className="text-sm font-medium text-codearc-300">
                  {tutorial.author?.name || 'CodeArc Team'}
                </span>
              </div>

              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/8 text-codearc-300">
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
        <div className="h-32 bg-codearc-800 rounded-2xl animate-pulse" />
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
          <h1 className="text-2xl font-bold text-codearc-50">
            Explore Tutorials
          </h1>
          <p className="text-sm mt-1 text-codearc-300">
            From beginner to expert — find your next lesson.
          </p>
        </div>
        <div className="w-full md:w-72 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-codearc-500" />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors bg-codearc-800 border border-white/10 text-codearc-50 placeholder-codearc-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
          />
        </div>
      </div>

      {/* Learning Paths */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-codearc-300 uppercase tracking-wider mb-3">Learning Paths</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {[
            {
              title: 'JavaScript Track',
              desc: 'Variables → Functions → Control Flow → Arrays',
              color: 'from-yellow-500/20 to-yellow-600/10',
              border: 'border-yellow-500/30',
              dot: 'bg-yellow-500',
              slugs: ['javascript-basics-variables-data-types', 'javascript-functions-complete-guide', 'javascript-control-flow', 'arrays-lists-data-storage-fundamentals'],
              lang: 'javascript',
            },
            {
              title: 'Python Track',
              desc: 'Fundamentals → Functions → Data Structures',
              color: 'from-blue-500/20 to-blue-600/10',
              border: 'border-blue-500/30',
              dot: 'bg-blue-500',
              slugs: ['python-fundamentals-getting-started', 'python-functions-control-flow', 'python-lists-dicts-tuples'],
              lang: 'python',
            },
            {
              title: 'Web Dev Track',
              desc: 'HTML & CSS → JavaScript → TypeScript',
              color: 'from-pink-500/20 to-pink-600/10',
              border: 'border-pink-500/30',
              dot: 'bg-pink-500',
              slugs: ['html-css-first-webpage', 'javascript-basics-variables-data-types', 'typescript-getting-started'],
              lang: 'javascript',
            },
            {
              title: 'Algorithms Track',
              desc: 'Sorting → Binary Search → (more coming)',
              color: 'from-purple-500/20 to-purple-600/10',
              border: 'border-purple-500/30',
              dot: 'bg-purple-500',
              slugs: ['sorting-algorithms-bubble-quick-sort', 'algorithms-binary-search'],
              lang: 'javascript',
            },
          ].map((path) => {
            const pathTutorials = path.slugs.map(s => tutorials.find(t => t.slug === s)).filter(Boolean);
            const completed = pathTutorials.filter(t => t?.enrolled && t?.progress === 100).length;
            const pct = pathTutorials.length ? Math.round((completed / path.slugs.length) * 100) : 0;
            return (
              <button
                key={path.title}
                onClick={() => handleTabChange(path.lang === 'python' ? 'python' : path.lang === 'javascript' ? 'javascript' : 'all')}
                className={`flex-shrink-0 w-56 p-4 rounded-xl border bg-gradient-to-br ${path.color} ${path.border} text-left hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${path.dot}`} />
                  <span className="text-sm font-semibold text-codearc-50">{path.title}</span>
                </div>
                <p className="text-xs text-codearc-400 mb-3 leading-relaxed">{path.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 mr-2">
                    <div className={`h-1.5 rounded-full ${path.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-codearc-500 flex-shrink-0">{pct}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Udemy-style Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-white/10 overflow-x-auto no-scrollbar pb-[1px]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap pb-3 px-2 border-b-2 font-medium text-sm transition-colors duration-200 mr-6 ${
                activeTab === tab.id
                  ? 'border-primary-400 text-primary-400'
                  : 'border-transparent text-codearc-500 hover:text-codearc-50 hover:border-white/20'
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
          <p className="text-sm font-medium text-codearc-300">
            Showing {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''}
          </p>

          <select className="text-sm font-medium border-0 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500/30 cursor-pointer bg-codearc-800 text-codearc-300">
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Highest Rated</option>
            <option>Shortest</option>
          </select>
        </div>
        
        {filteredTutorials.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="text-codearc-500 mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-codearc-50 mb-2">
              No tutorials found
            </h3>
            <p className="text-codearc-300 mb-6 max-w-sm mx-auto">
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
