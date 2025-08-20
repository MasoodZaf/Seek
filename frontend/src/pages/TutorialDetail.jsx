import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  BookOpenIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { Card, Button, Badge, Progress } from '../components/ui';
import { useTheme } from '../context/ThemeContext';

const TutorialDetail = () => {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchTutorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/mongo-tutorials/${id}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTutorial(data.data.tutorial);
        setEnrolled(false); // MongoDB tutorials don't have enrollment yet
        setProgress(0); // MongoDB tutorials don't have progress tracking yet
      }
    } catch (error) {
      console.error('Error fetching tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    // TODO: Implement enrollment with user progress tracking
    // For now, just mark as enrolled locally
    setEnrolled(true);
    setProgress(0);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-500',
      python: 'bg-blue-500',
      typescript: 'bg-blue-600',
      java: 'bg-red-500',
    };
    return colors[language] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutorial Not Found</h1>
        <Link to="/tutorials">
          <Button variant="primary">Back to Tutorials</Button>
        </Link>
      </div>
    );
  }

  const totalLessons = tutorial.steps?.length || tutorial.lessons?.length || 0;
  const completedLessons = Math.floor((progress / 100) * totalLessons);

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 transition-colors duration-300 ${
      isDarkMode ? 'text-gray-100' : 'text-gray-900'
    }`}>
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/tutorials"
          className={`inline-flex items-center transition-colors ${
            isDarkMode 
              ? 'text-primary-400 hover:text-primary-300' 
              : 'text-primary-600 hover:text-primary-500'
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to Tutorials
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className={`p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-4 h-4 rounded-full ${getLanguageColor(tutorial.language)}`} />
                <Badge variant={getDifficultyColor(tutorial.difficulty)} size="sm">
                  {tutorial.difficulty}
                </Badge>
                {enrolled && (
                  <Badge variant="primary" size="sm">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Enrolled
                  </Badge>
                )}
              </div>
              
              <h1 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {tutorial.title}
              </h1>
              
              <p className={`text-lg mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {tutorial.description}
              </p>
              
              <div className={`flex items-center space-x-6 text-sm mb-6 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{Math.floor((tutorial.estimatedTime || tutorial.estimatedDuration || 0) / 60)}h {(tutorial.estimatedTime || tutorial.estimatedDuration || 0) % 60}m</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  <span>{tutorial.stats?.views || tutorial.stats?.enrollments || 0} views</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{tutorial.rating?.average || tutorial.stats?.averageRating || 0}</span>
                  <span className="text-gray-400 ml-1">({tutorial.rating?.count || tutorial.stats?.totalRatings || 0})</span>
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 mr-1" />
                  <span>{totalLessons} steps</span>
                </div>
              </div>

              {enrolled && progress > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} size="lg" />
                  <p className="text-xs text-gray-500 mt-1">
                    {completedLessons} of {totalLessons} lessons completed
                  </p>
                </div>
              )}
              
              <div className="flex space-x-4">
                {!enrolled ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleEnroll}
                    className="flex items-center"
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start Learning
                  </Button>
                ) : (
                  <Link to={`/tutorials/${id}/learn`}>
                    <Button variant="primary" size="lg" className="flex items-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" size="lg">
                  Add to Wishlist
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Interactive Tutorial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`p-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
                What You'll Learn
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(tutorial.learningObjectives || tutorial.lessons?.slice(0, 6) || []).map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {typeof objective === 'string' ? objective : objective.title}
                      </p>
                      {typeof objective === 'object' && objective.description && (
                        <p className="text-gray-600 text-xs">{objective.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Course Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-2 text-blue-500" />
                Course Content
              </h2>
              
              <div className="space-y-4">
                {(tutorial.steps || tutorial.lessons || []).map((step, index) => (
                  <div key={step.id || index} className="border border-gray-200 rounded-lg">
                    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {step.stepNumber || index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{step.title}</h3>
                          <p className="text-gray-600 text-sm">
                            {step.description || (step.content ? step.content.substring(0, 100) + '...' : '')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{step.duration || 15}min</span>
                        {enrolled ? (
                          <PlayIcon className="h-4 w-4" />
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded-full" />
                        )}
                      </div>
                    </div>
                    
                    {(step.codeExamples?.length > 0 || step.concepts) && (
                      <div className="px-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {step.codeExamples?.slice(0, 2).map((example, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                              <CodeBracketIcon className="h-3 w-3 mr-1" />
                              {example.language}
                            </span>
                          ))}
                          {step.concepts?.slice(0, 3).map((concept, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                              {concept}
                            </span>
                          )) || []}
                          {(step.codeExamples?.length > 2 || step.concepts?.length > 3) && (
                            <span className="text-xs text-gray-500">
                              +{Math.max(0, (step.codeExamples?.length || 0) - 2) + Math.max(0, (step.concepts?.length || 0) - 3)} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {tutorial.author?.name?.split(' ').map(n => n[0]).join('') || 'ST'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{tutorial.author?.name || 'Seek Team'}</h4>
                  <p className="text-gray-600 text-sm">Expert Instructor</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Certificate */}
          {tutorial.certificate?.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-6 w-6 mr-2 text-purple-500" />
                  Certificate
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Earn a certificate upon completion of this tutorial
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complete lessons</span>
                    <span className="font-medium">{tutorial.certificate.requirements.completedLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pass quizzes</span>
                    <span className="font-medium">{tutorial.certificate.requirements.passedQuizzes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complete exercises</span>
                    <span className="font-medium">{tutorial.certificate.requirements.completedExercises}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final project score</span>
                    <span className="font-medium">{tutorial.certificate.requirements.finalProjectScore}%+</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This tutorial includes</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <BookOpenIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">{totalLessons} interactive lessons</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CodeBracketIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Hands-on exercises</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-700">Quiz assessments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">Real-world projects</span>
                </div>
                {tutorial.certificate?.available && (
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">Certificate of completion</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;