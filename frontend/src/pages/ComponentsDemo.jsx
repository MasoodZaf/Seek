import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  PlayIcon,
  CodeBracketIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  Card, 
  Button, 
  Progress, 
  Badge,
  TutorialCardSkeleton,
  StaggeredContainer,
  StaggeredItem
} from '../components/ui';
import DarkModeToggle from '../components/ui/DarkModeToggle';
import { useGlobalToast } from '../components/ui/Toast';

const ComponentsDemo = () => {
  const [progress, setProgress] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useGlobalToast();

  const handleToastDemo = (type) => {
    const messages = {
      success: 'Successfully completed the tutorial!',
      error: 'Failed to execute code. Please try again.',
      warning: 'Your session will expire in 5 minutes.',
      info: 'New features available in the playground!'
    };
    toast[type](messages[type]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Enhanced UI Components
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Modern, animated, and sophisticated components for the Seek platform
          </p>
          <div className="flex justify-center space-x-4">
            <DarkModeToggle variant="toggle" />
            <DarkModeToggle variant="default" showLabel />
          </div>
        </motion.div>

        {/* Toast Demo */}
        <Card variant="glass" className="p-8">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-purple-500" />
              Toast Notifications
            </Card.Title>
            <Card.Description>
              Beautiful, animated toast notifications with different variants
            </Card.Description>
          </Card.Header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="success" onClick={() => handleToastDemo('success')}>
              Success Toast
            </Button>
            <Button variant="error" onClick={() => handleToastDemo('error')}>
              Error Toast
            </Button>
            <Button variant="warning" onClick={() => handleToastDemo('warning')}>
              Warning Toast
            </Button>
            <Button variant="primary" onClick={() => handleToastDemo('info')}>
              Info Toast
            </Button>
          </div>
        </Card>

        {/* Enhanced Cards */}
        <StaggeredContainer className="grid md:grid-cols-3 gap-6">
          <StaggeredItem>
            <Card variant="default" hover className="h-full">
              <Card.Header>
                <Card.Title>Default Card</Card.Title>
                <Card.Description>Standard card with hover effects</Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This is a default card with smooth hover animations and shadows.
                </p>
                <Badge variant="primary">New</Badge>
              </Card.Content>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <Card variant="glass" className="h-full">
              <Card.Header>
                <Card.Title>Glassmorphism</Card.Title>
                <Card.Description>Modern glass effect with backdrop blur</Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Glassmorphism design with beautiful transparency effects.
                </p>
                <Badge variant="success">Popular</Badge>
              </Card.Content>
            </Card>
          </StaggeredItem>

          <StaggeredItem>
            <Card variant="elevated" hover gradient className="h-full">
              <Card.Header>
                <Card.Title>Gradient Card</Card.Title>
                <Card.Description>Elevated card with gradient overlay</Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Enhanced card with gradient background and elevation.
                </p>
                <Badge variant="warning">Premium</Badge>
              </Card.Content>
            </Card>
          </StaggeredItem>
        </StaggeredContainer>

        {/* Enhanced Buttons */}
        <Card className="p-8">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <PlayIcon className="w-6 h-6 text-blue-500" />
              Interactive Buttons
            </Card.Title>
            <Card.Description>
              Buttons with enhanced hover states, animations, and loading states
            </Card.Description>
          </Card.Header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary" icon={StarIcon}>
              Primary Button
            </Button>
            <Button variant="success" icon={HeartIcon} iconPosition="right">
              Success Button  
            </Button>
            <Button variant="warning" size="lg">
              Large Warning
            </Button>
            <Button 
              variant="error" 
              loading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
            >
              Loading Demo
            </Button>
          </div>
        </Card>

        {/* Enhanced Progress Bars */}
        <Card className="p-8">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <CodeBracketIcon className="w-6 h-6 text-green-500" />
              Progress Indicators
            </Card.Title>
            <Card.Description>
              Animated progress bars with different styles and effects
            </Card.Description>
          </Card.Header>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Learning Progress</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setProgress(Math.max(0, progress - 10))}>
                    -10%
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setProgress(Math.min(100, progress + 10))}>
                    +10%
                  </Button>
                </div>
              </div>
              <Progress 
                value={progress} 
                variant="primary" 
                size="lg"
                animated 
              />
            </div>

            <Progress 
              value={85} 
              variant="success" 
              label="JavaScript Mastery"
              size="md"
              striped
              glowing
            />

            <Progress 
              value={45} 
              variant="warning" 
              label="Python Fundamentals"
              size="sm"
              className="glass"
            />

            <Progress 
              value={92} 
              variant="gradient" 
              label="Overall Progress"
              size="xl"
              animated
            />
          </div>
        </Card>

        {/* Loading Skeletons Demo */}
        <Card className="p-8">
          <Card.Header>
            <Card.Title>Loading Skeletons</Card.Title>
            <Card.Description>
              Sophisticated loading states that match your content layout
            </Card.Description>
          </Card.Header>
          <div className="space-y-6">
            <Button 
              variant="primary" 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 3000);
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Demo Loading States'}
            </Button>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <TutorialCardSkeleton />
                <TutorialCardSkeleton />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <Card hover>
                  <Card.Header>
                    <Card.Title>JavaScript Fundamentals</Card.Title>
                    <Card.Description>Learn the basics of JavaScript programming</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <Progress value={75} label="Progress" size="sm" />
                    <div className="flex gap-2 mt-4">
                      <Badge variant="primary">JavaScript</Badge>
                      <Badge variant="success">Beginner</Badge>
                    </div>
                  </Card.Content>
                </Card>

                <Card hover>
                  <Card.Header>
                    <Card.Title>React Components</Card.Title>
                    <Card.Description>Build reusable React components</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <Progress value={60} label="Progress" size="sm" />
                    <div className="flex gap-2 mt-4">
                      <Badge variant="primary">React</Badge>
                      <Badge variant="warning">Intermediate</Badge>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎉 All Enhancements Complete!
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>✅ Loading Skeletons</div>
            <div>✅ Page Transitions</div>
            <div>✅ Button Animations</div>
            <div>✅ Toast Notifications</div>
            <div>✅ Dark/Light Toggle</div>
            <div>✅ Glassmorphism Cards</div>
            <div>✅ Animated Progress</div>
            <div>✅ Focus States</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ComponentsDemo;