/**
 * Feedback Collector Component
 * Collects user feedback for continuous improvement
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  StarIcon,
  FaceSmileIcon,
  FaceFrownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Textarea from './Textarea';

const FeedbackCollector = ({ 
  onSubmit, 
  position = 'bottom-right',
  trigger = 'floating' // 'floating', 'inline', 'modal'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: rating, 2: details, 3: thank you
  const [feedback, setFeedback] = useState({
    rating: 0,
    category: '',
    message: '',
    email: '',
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  const handleRatingChange = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
    setTimeout(() => setStep(2), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await onSubmit(feedback);
      setStep(3);
      setTimeout(() => {
        setIsOpen(false);
        setStep(1);
        setFeedback({
          rating: 0,
          category: '',
          message: '',
          email: '',
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6 z-50',
    'bottom-left': 'fixed bottom-6 left-6 z-50',
    'top-right': 'fixed top-6 right-6 z-50',
    'top-left': 'fixed top-6 left-6 z-50'
  };

  if (trigger === 'inline') {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <FeedbackForm 
          step={step}
          feedback={feedback}
          setFeedback={setFeedback}
          onRatingChange={handleRatingChange}
          onSubmit={handleSubmit}
          onClose={() => {}}
        />
      </Card>
    );
  }

  return (
    <div className={positionClasses[position]}>
      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
            aria-label="Give feedback"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feedback Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-w-[calc(100vw-2rem)]"
          >
            <FeedbackForm 
              step={step}
              feedback={feedback}
              setFeedback={setFeedback}
              onRatingChange={handleRatingChange}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeedbackForm = ({ 
  step, 
  feedback, 
  setFeedback, 
  onRatingChange, 
  onSubmit, 
  onClose 
}) => {
  const categories = [
    { id: 'ui-design', label: 'UI/Design', icon: '🎨' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'usability', label: 'Usability', icon: '👆' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'bug', label: 'Bug Report', icon: '🐛' },
    { id: 'other', label: 'Other', icon: '💬' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {step === 1 && 'How was your experience?'}
          {step === 2 && 'Tell us more'}
          {step === 3 && 'Thank you!'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close feedback"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Step 1: Rating */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6">
            Rate your overall experience with the platform
          </p>
          
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRatingChange(star)}
                className="text-3xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label={`Rate ${star} stars`}
              >
                {star <= feedback.rating ? (
                  <StarIconSolid className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarIcon className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <FaceFrownIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">Poor</span>
            </div>
            <div className="text-center">
              <FaceSmileIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">Excellent</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's this about?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFeedback(prev => ({ ...prev, category: category.id }))}
                  className={`p-3 rounded-lg border text-sm transition-colors ${
                    feedback.category === category.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your feedback
            </label>
            <Textarea
              value={feedback.message}
              onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Email (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <Input
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll only use this to follow up on your feedback
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={!feedback.message.trim()}
            >
              Send Feedback
            </Button>
          </div>
        </motion.form>
      )}

      {/* Step 3: Thank You */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Thank you for your feedback!
          </h4>
          <p className="text-gray-600">
            Your input helps us make the platform better for everyone.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FeedbackCollector;