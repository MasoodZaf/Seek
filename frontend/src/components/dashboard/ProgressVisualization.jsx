import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CpuChipIcon,
  DatabaseIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  ProgressRing,
  SkillTree,
  StreakIndicator,
  XPProgressBar,
  MilestoneCelebration,
  Button,
} from '../ui';

const ProgressVisualization = ({ userStats, className, ...props }) => {
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);

  // Mock skill tree data
  const skillTreeData = [
    {
      id: 'html-basics',
      title: 'HTML Basics',
      description: 'Learn the fundamentals of HTML markup',
      position: { x: 20, y: 80 },
      unlocked: true,
      completed: true,
      type: 'skill',
      icon: GlobeAltIcon,
      xpReward: 100,
      rewards: ['HTML Certificate', '100 XP'],
    },
    {
      id: 'css-basics',
      title: 'CSS Basics',
      description: 'Style your web pages with CSS',
      position: { x: 40, y: 60 },
      unlocked: true,
      completed: true,
      type: 'skill',
      icon: GlobeAltIcon,
      prerequisites: ['html-basics'],
      xpReward: 150,
      rewards: ['CSS Certificate', '150 XP'],
    },
    {
      id: 'js-basics',
      title: 'JavaScript Basics',
      description: 'Add interactivity with JavaScript',
      position: { x: 60, y: 40 },
      unlocked: true,
      completed: false,
      progress: 67,
      type: 'skill',
      icon: CodeBracketIcon,
      prerequisites: ['css-basics'],
      xpReward: 200,
      rewards: ['JavaScript Certificate', '200 XP'],
    },
    {
      id: 'react-basics',
      title: 'React Basics',
      description: 'Build modern UIs with React',
      position: { x: 80, y: 20 },
      unlocked: true,
      completed: false,
      progress: 25,
      type: 'skill',
      icon: CodeBracketIcon,
      prerequisites: ['js-basics'],
      xpReward: 300,
      rewards: ['React Certificate', '300 XP'],
    },
    {
      id: 'frontend-master',
      title: 'Frontend Master',
      description: 'Complete mastery of frontend development',
      position: { x: 50, y: 10 },
      unlocked: false,
      completed: false,
      type: 'milestone',
      icon: AcademicCapIcon,
      prerequisites: ['react-basics', 'js-advanced'],
      xpReward: 500,
      rewards: ['Frontend Master Badge', '500 XP', 'Special Certificate'],
    },
    {
      id: 'js-advanced',
      title: 'Advanced JS',
      description: 'Master advanced JavaScript concepts',
      position: { x: 70, y: 30 },
      unlocked: false,
      completed: false,
      type: 'skill',
      icon: CpuChipIcon,
      prerequisites: ['js-basics'],
      xpReward: 250,
      rewards: ['Advanced JS Certificate', '250 XP'],
    },
    {
      id: 'database-basics',
      title: 'Database Basics',
      description: 'Learn database fundamentals',
      position: { x: 30, y: 70 },
      unlocked: true,
      completed: false,
      progress: 40,
      type: 'skill',
      icon: DatabaseIcon,
      prerequisites: ['html-basics'],
      xpReward: 180,
      rewards: ['Database Certificate', '180 XP'],
    },
  ];

  const handleSkillClick = (skill) => {
    if (skill.completed) {
      setCurrentMilestone({
        type: 'completion',
        title: `${skill.title} Completed!`,
        description: `Congratulations! You've mastered ${skill.title}.`,
        rewards: skill.rewards,
      });
      setShowMilestone(true);
    }
  };

  const handleMilestoneShare = (milestone) => {
    // Mock share functionality
    console.log('Sharing milestone:', milestone);
    setShowMilestone(false);
  };

  return (
    <div className={className} {...props}>
      <div className="space-y-8">
        {/* XP and Level Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Level Progress
            </h3>
            <StreakIndicator
              streak={userStats?.currentStreak || 0}
              maxStreak={userStats?.maxStreak || 0}
              size="md"
              variant="fire"
            />
          </div>
          
          <XPProgressBar
            currentXP={userStats?.xp || 0}
            nextLevelXP={userStats?.nextLevelXp || 1000}
            level={userStats?.level || 1}
            size="lg"
            variant="gradient"
            animate
          />
        </Card>

        {/* Skill Progress Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Skill Progress
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <ProgressRing
                value={85}
                size="lg"
                variant="primary"
                showLabel={false}
                className="mb-3"
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary-900 dark:text-secondary-100">85%</div>
                  <div className="text-xs text-secondary-500">Frontend</div>
                </div>
              </ProgressRing>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Frontend</p>
            </div>
            
            <div className="text-center">
              <ProgressRing
                value={40}
                size="lg"
                variant="success"
                showLabel={false}
                className="mb-3"
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary-900 dark:text-secondary-100">40%</div>
                  <div className="text-xs text-secondary-500">Backend</div>
                </div>
              </ProgressRing>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Backend</p>
            </div>
            
            <div className="text-center">
              <ProgressRing
                value={60}
                size="lg"
                variant="warning"
                showLabel={false}
                className="mb-3"
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary-900 dark:text-secondary-100">60%</div>
                  <div className="text-xs text-secondary-500">Database</div>
                </div>
              </ProgressRing>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Database</p>
            </div>
            
            <div className="text-center">
              <ProgressRing
                value={25}
                size="lg"
                variant="error"
                showLabel={false}
                className="mb-3"
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-secondary-900 dark:text-secondary-100">25%</div>
                  <div className="text-xs text-secondary-500">DevOps</div>
                </div>
              </ProgressRing>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">DevOps</p>
            </div>
          </div>
        </Card>

        {/* Interactive Skill Tree */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Learning Path
            </h3>
            <Button variant="ghost" size="sm">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              View Full Tree
            </Button>
          </div>
          
          <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg" style={{ height: '400px' }}>
            <SkillTree
              skills={skillTreeData}
              onNodeClick={handleSkillClick}
              className="w-full h-full"
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-300 rounded-full"></div>
                <span>Locked</span>
              </div>
            </div>
            <span>{skillTreeData.filter(s => s.completed).length} of {skillTreeData.length} completed</span>
          </div>
        </Card>

        {/* Weekly Goals */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
            Weekly Goals
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                <span>Complete 3 tutorials</span>
                <span>2/3</span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '67%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                <span>Practice 5 days</span>
                <span>4/5</span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                <span>Earn 500 XP</span>
                <span>320/500</span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-warning-500 to-warning-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Milestone Celebration Modal */}
      <MilestoneCelebration
        isVisible={showMilestone}
        milestone={currentMilestone}
        onClose={() => setShowMilestone(false)}
        onShare={handleMilestoneShare}
      />
    </div>
  );
};

export default ProgressVisualization;