import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  PencilIcon,
  CalendarIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Badge, Progress, Loading } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || 'Passionate learner exploring the world of code!',
    website: user?.website || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
    location: user?.location || ''
  });

  useEffect(() => {
    loadProfileStats();
    loadRecentActivity();
    loadAchievements();
  }, []);

  const loadProfileStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/progress/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const response = await fetch('/api/v1/code/history?limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.data?.executions || []);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  };

  const loadAchievements = async () => {
    // Mock achievements for now
    setAchievements([
      {
        id: 1,
        name: 'First Steps',
        description: 'Executed your first code!',
        icon: '🚀',
        earned: true,
        earnedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'Code Warrior',
        description: 'Executed 50 code snippets',
        icon: '⚔️',
        earned: true,
        earnedAt: new Date('2024-01-20')
      },
      {
        id: 3,
        name: 'Multi-lingual',
        description: 'Used 3 different programming languages',
        icon: '🌍',
        earned: false
      },
      {
        id: 4,
        name: 'Speed Demon',
        description: 'Solved 10 problems in under 5 minutes each',
        icon: '⚡',
        earned: false
      }
    ]);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: 'bg-yellow-500',
      python: 'bg-blue-500',
      typescript: 'bg-blue-600',
      java: 'bg-red-500'
    };
    return colors[language] || 'bg-gray-500';
  };

  if (loading && !stats) {
    return <Loading text="Loading your profile..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Profile</h1>
          <p className="text-secondary-600">Manage your account and view your progress</p>
        </div>
        
        <Button
          variant={isEditing ? "secondary" : "primary"}
          icon={isEditing ? CheckCircleIcon : PencilIcon}
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          loading={loading}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="w-12 h-12 text-primary-600" />
              </div>
              
              <div className="text-center w-full">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full text-center text-xl font-bold bg-transparent border-b border-secondary-300 focus:border-primary-500 outline-none"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full text-center text-xl font-bold bg-transparent border-b border-secondary-300 focus:border-primary-500 outline-none"
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full text-center text-secondary-600 bg-transparent border-b border-secondary-300 focus:border-primary-500 outline-none"
                      placeholder="@username"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-secondary-900">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-secondary-600">@{profileData.username}</p>
                  </>
                )}
                
                <div className="mt-4">
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full text-sm text-secondary-700 bg-transparent border border-secondary-300 rounded-lg p-2 focus:border-primary-500 outline-none resize-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-sm text-secondary-700">{profileData.bio}</p>
                  )}
                </div>

                {/* Contact Info */}
                {isEditing && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full text-sm bg-transparent border border-secondary-300 rounded-lg p-2 focus:border-primary-500 outline-none"
                      placeholder="Email address"
                    />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full text-sm bg-transparent border border-secondary-300 rounded-lg p-2 focus:border-primary-500 outline-none"
                      placeholder="Location"
                    />
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full text-sm bg-transparent border border-secondary-300 rounded-lg p-2 focus:border-primary-500 outline-none"
                      placeholder="Website URL"
                    />
                    <input
                      type="text"
                      value={profileData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      className="w-full text-sm bg-transparent border border-secondary-300 rounded-lg p-2 focus:border-primary-500 outline-none"
                      placeholder="GitHub username"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-primary-600" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {stats?.totalExecutions || 0}
                </div>
                <div className="text-xs text-secondary-600">Code Runs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.successRate || 0}%
                </div>
                <div className="text-xs text-secondary-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {user?.progress?.currentStreak || 0}
                </div>
                <div className="text-xs text-secondary-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {user?.progress?.level || 1}
                </div>
                <div className="text-xs text-secondary-600">Level</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Activity & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card className="p-6">
            <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-primary-600" />
              Learning Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Completion</span>
                  <span>{user?.completionRate || 0}%</span>
                </div>
                <Progress value={user?.completionRate || 0} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats?.languageDistribution || {}).map(([language, count]) => (
                  <div key={language} className="text-center">
                    <div className={`w-8 h-8 ${getLanguageColor(language)} rounded-full mx-auto mb-2`}></div>
                    <div className="text-sm font-medium capitalize">{language}</div>
                    <div className="text-xs text-secondary-600">{count} runs</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-primary-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${getLanguageColor(activity.language)} rounded-full`}></div>
                      <div>
                        <div className="text-sm font-medium">
                          Executed {activity.language} code
                        </div>
                        <div className="text-xs text-secondary-600">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.status === 'completed' ? 'success' : 'error'} 
                      size="sm"
                    >
                      {activity.status === 'completed' ? '✓' : '✗'}
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-secondary-500">
                  <CodeBracketIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start coding to see your activity here!</p>
                </div>
              )}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-primary-600" />
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-secondary-200 bg-secondary-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-green-900' : 'text-secondary-600'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-700' : 'text-secondary-500'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.earnedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Earned {achievement.earnedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {achievement.earned && (
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;