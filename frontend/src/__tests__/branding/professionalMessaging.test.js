/**
 * Professional Messaging Tests
 * Tests messaging consistency, tone, and professional copy across components
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  errorMessages,
  successMessages,
  progressMessages,
  onboardingMessages,
  validationMessages,
  getRandomMessage,
  getProgressMessage,
  getStreakMessage,
  formatErrorMessage,
  formatSuccessMessage
} from '../../utils/messaging';

import ErrorState from '../../components/ui/ErrorState';
import SuccessNotification from '../../components/ui/SuccessNotification';
import ProgressMessage from '../../components/ui/ProgressMessage';

describe('Professional Messaging System', () => {
  describe('Error Messages', () => {
    test('error messages are helpful and actionable', () => {
      Object.entries(errorMessages).forEach(([errorType, config]) => {
        expect(config).toHaveProperty('title');
        expect(config).toHaveProperty('message');
        expect(config).toHaveProperty('action');
        
        // Title should be concise and clear
        expect(config.title.length).toBeLessThan(50);
        expect(config.title).not.toMatch(/error|fail/i); // Avoid negative language in titles
        
        // Message should be helpful and professional
        expect(config.message.length).toBeGreaterThan(20);
        expect(config.message).toMatch(/\./); // Should end with punctuation
        
        // Action should be actionable
        expect(config.action.length).toBeLessThan(20);
        expect(config.action).not.toMatch(/\./); // Actions shouldn't have periods
      });
    });

    test('error messages avoid blame and technical jargon', () => {
      Object.values(errorMessages).forEach(config => {
        const combinedText = `${config.title} ${config.message}`.toLowerCase();
        
        // Avoid blaming the user
        expect(combinedText).not.toMatch(/you (did|made|caused|broke)/);
        expect(combinedText).not.toMatch(/your (fault|mistake|error)/);
        
        // Avoid overly technical language
        expect(combinedText).not.toMatch(/500|404|exception|stack trace/);
        
        // Should be encouraging
        expect(combinedText).toMatch(/try|check|please|help/);
      });
    });

    test('error messages provide context and solutions', () => {
      const networkError = errorMessages.networkError;
      expect(networkError.message).toMatch(/connection/i);
      expect(networkError.message).toMatch(/try again/i);
      
      const loginError = errorMessages.loginFailed;
      expect(loginError.message).toMatch(/credentials/i);
      expect(loginError.message).toMatch(/check/i);
      
      const codeError = errorMessages.codeExecutionFailed;
      expect(codeError.message).toMatch(/code/i);
      expect(codeError.message).toMatch(/syntax/i);
    });
  });

  describe('Success Messages', () => {
    test('success messages are encouraging and motivating', () => {
      Object.entries(successMessages).forEach(([successType, config]) => {
        expect(config).toHaveProperty('title');
        expect(config).toHaveProperty('message');
        expect(config).toHaveProperty('action');
        
        // Title should be celebratory
        expect(config.title).toMatch(/!/); // Should have exclamation
        
        // Message should be encouraging
        const encouragingWords = /great|excellent|amazing|congratulations|well done|fantastic|awesome/i;
        expect(config.message).toMatch(encouragingWords);
        
        // Action should encourage continuation
        expect(config.action).toMatch(/continue|next|view|start|get/i);
      });
    });

    test('success messages use positive language', () => {
      Object.values(successMessages).forEach(config => {
        const combinedText = `${config.title} ${config.message}`.toLowerCase();
        
        // Should use positive words
        const positiveWords = /success|complete|achieve|earn|unlock|progress|learn|grow/;
        expect(combinedText).toMatch(positiveWords);
        
        // Should avoid negative words
        expect(combinedText).not.toMatch(/fail|error|wrong|bad|difficult/);
      });
    });

    test('achievement messages include celebration elements', () => {
      const tutorialCompleted = successMessages.tutorialCompleted;
      expect(tutorialCompleted.title).toMatch(/🏆|🎉|⭐/);
      
      const levelUp = successMessages.levelUp;
      expect(levelUp.title).toMatch(/⭐|🎯|🏆/);
      
      const streakAchieved = successMessages.streakAchieved;
      expect(streakAchieved.title).toMatch(/🔥|⭐|🎉/);
    });
  });

  describe('Progress Messages', () => {
    test('progress messages adapt to completion percentage', () => {
      const lowProgress = getProgressMessage(25);
      const mediumProgress = getProgressMessage(60);
      const highProgress = getProgressMessage(90);
      
      // Low progress should be encouraging
      expect(lowProgress).toMatch(/keep|going|progress|step/i);
      
      // Medium progress should acknowledge effort
      expect(mediumProgress).toMatch(/great|good|well|doing/i);
      
      // High progress should build excitement
      expect(highProgress).toMatch(/almost|close|finish|there/i);
    });

    test('streak messages scale with streak length', () => {
      const shortStreak = getStreakMessage(2);
      const mediumStreak = getStreakMessage(5);
      const longStreak = getStreakMessage(10);
      
      expect(shortStreak).toContain('Day 2');
      expect(mediumStreak).toContain('5 days');
      expect(longStreak).toContain('10 day streak');
      
      // All should be encouraging
      [shortStreak, mediumStreak, longStreak].forEach(message => {
        expect(message).toMatch(/🔥|⭐|🌟/);
      });
    });

    test('progress messages maintain consistent tone', () => {
      progressMessages.keepGoing.forEach(message => {
        expect(message).toMatch(/you|your/i); // Personal
        expect(message).toMatch(/!/); // Encouraging
        expect(message.length).toBeLessThan(100); // Concise
      });
      
      progressMessages.wellDone.forEach(message => {
        expect(message).toMatch(/excellent|great|good|well|impressive/i);
        expect(message).toMatch(/!/);
      });
    });
  });

  describe('Onboarding Messages', () => {
    test('onboarding messages are welcoming and clear', () => {
      const welcome = onboardingMessages.welcome;
      
      expect(welcome.title).toMatch(/welcome/i);
      expect(welcome.title).toMatch(/👋/);
      expect(welcome.message).toMatch(/excited|help|journey/i);
      expect(welcome.steps).toHaveLength(4);
      
      welcome.steps.forEach(step => {
        expect(step.length).toBeLessThan(50);
        expect(step).toMatch(/^[A-Z]/); // Should start with capital
      });
    });

    test('onboarding messages explain benefits clearly', () => {
      const profileSetup = onboardingMessages.profileSetup;
      
      expect(profileSetup.benefits).toHaveLength(3);
      profileSetup.benefits.forEach(benefit => {
        expect(benefit).toMatch(/^[A-Z]/);
        expect(benefit.length).toBeLessThan(100);
      });
    });

    test('onboarding messages reduce anxiety', () => {
      const firstTutorial = onboardingMessages.firstTutorial;
      
      expect(firstTutorial.encouragement).toMatch(/remember|everyone|starts|time|help/i);
      expect(firstTutorial.encouragement).not.toMatch(/difficult|hard|complex|challenging/i);
    });
  });

  describe('Validation Messages', () => {
    test('validation messages are specific and helpful', () => {
      Object.entries(validationMessages).forEach(([field, messages]) => {
        Object.entries(messages).forEach(([type, message]) => {
          // Should be specific to the field and error type
          expect(message.length).toBeGreaterThan(10);
          expect(message.length).toBeLessThan(100);
          
          // Should not be overly technical
          expect(message).not.toMatch(/regex|validation|constraint/i);
          
          // Should be actionable
          if (type === 'required') {
            expect(message).toMatch(/required|needed/i);
          }
          if (type === 'invalid') {
            expect(message).toMatch(/valid|correct|check/i);
          }
        });
      });
    });

    test('password validation is encouraging', () => {
      const passwordMessages = validationMessages.password;
      
      expect(passwordMessages.tooWeak).toMatch(/should|include/i);
      expect(passwordMessages.tooWeak).not.toMatch(/weak|bad|terrible/i);
      
      expect(passwordMessages.tooShort).toMatch(/at least/i);
      expect(passwordMessages.noMatch).toMatch(/don't match/i);
    });
  });

  describe('Message Formatting Functions', () => {
    test('formatErrorMessage adds context and timestamp', () => {
      const error = { type: 'networkError', details: { code: 500 } };
      const context = { page: 'dashboard' };
      
      const formatted = formatErrorMessage(error, context);
      
      expect(formatted).toHaveProperty('title');
      expect(formatted).toHaveProperty('message');
      expect(formatted).toHaveProperty('action');
      expect(formatted).toHaveProperty('context', context);
      expect(formatted).toHaveProperty('timestamp');
      expect(formatted.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    test('formatSuccessMessage handles missing types gracefully', () => {
      const formatted = formatSuccessMessage('nonexistentType', { test: true });
      
      expect(formatted.title).toBe('Success!');
      expect(formatted.message).toBe('Your action was completed successfully.');
      expect(formatted.action).toBe('Continue');
      expect(formatted.data).toEqual({ test: true });
    });

    test('getRandomMessage returns different messages', () => {
      const messages = ['Message 1', 'Message 2', 'Message 3'];
      const results = new Set();
      
      // Get multiple random messages
      for (let i = 0; i < 20; i++) {
        results.add(getRandomMessage(messages));
      }
      
      // Should get different messages (with high probability)
      expect(results.size).toBeGreaterThan(1);
      
      // All results should be from the original array
      results.forEach(result => {
        expect(messages).toContain(result);
      });
    });
  });
});

describe('Component Message Integration', () => {
  describe('ErrorState Component', () => {
    test('displays professional error messages', () => {
      render(<ErrorState error="networkError" />);
      
      expect(screen.getByText('Connection Issue')).toBeInTheDocument();
      expect(screen.getByText(/trouble connecting/i)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('handles custom error objects', () => {
      const customError = {
        type: 'codeExecutionFailed',
        details: { line: 5, message: 'Syntax error' }
      };
      
      render(<ErrorState error={customError} showDetails={true} />);
      
      expect(screen.getByText('Code Execution Failed')).toBeInTheDocument();
      expect(screen.getByText('Technical Details')).toBeInTheDocument();
    });

    test('maintains professional tone across variants', () => {
      const variants = ['default', 'minimal', 'inline', 'toast'];
      
      variants.forEach(variant => {
        const { unmount } = render(
          <ErrorState error="loginFailed" variant={variant} />
        );
        
        expect(screen.getByText('Login Failed')).toBeInTheDocument();
        expect(screen.getByText(/credentials/i)).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('SuccessNotification Component', () => {
    test('displays encouraging success messages', () => {
      render(<SuccessNotification type="tutorialCompleted" />);
      
      expect(screen.getByText(/Tutorial Completed!/)).toBeInTheDocument();
      expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
      expect(screen.getByText('Next Tutorial')).toBeInTheDocument();
    });

    test('includes celebration elements for achievements', () => {
      render(<SuccessNotification type="levelUp" variant="celebration" />);
      
      expect(screen.getByText(/Level Up!/)).toBeInTheDocument();
      expect(screen.getByText(/⭐/)).toBeInTheDocument();
    });

    test('maintains encouraging tone across types', () => {
      const successTypes = ['accountCreated', 'codeSaved', 'badgeEarned'];
      
      successTypes.forEach(type => {
        const { unmount } = render(<SuccessNotification type={type} />);
        
        const titleElement = screen.getByRole('heading', { level: 4 });
        expect(titleElement.textContent).toMatch(/!/);
        
        unmount();
      });
    });
  });

  describe('ProgressMessage Component', () => {
    test('displays motivating progress messages', () => {
      render(<ProgressMessage type="progress" percentage={75} />);
      
      const messageElement = screen.getByText(/./);
      expect(messageElement.textContent.length).toBeGreaterThan(10);
    });

    test('adapts message tone to progress level', () => {
      const { rerender } = render(
        <ProgressMessage type="progress" percentage={25} />
      );
      
      let messageElement = screen.getByText(/./);
      const lowProgressMessage = messageElement.textContent;
      
      rerender(<ProgressMessage type="progress" percentage={90} />);
      
      messageElement = screen.getByText(/./);
      const highProgressMessage = messageElement.textContent;
      
      expect(lowProgressMessage).not.toBe(highProgressMessage);
    });

    test('displays streak messages with fire emoji', () => {
      render(<ProgressMessage type="streak" streakDays={7} />);
      
      expect(screen.getByText(/🔥/)).toBeInTheDocument();
      expect(screen.getByText(/7 day streak/i)).toBeInTheDocument();
    });
  });
});

describe('Tone and Voice Consistency', () => {
  test('all messages maintain professional tone', () => {
    const allMessages = [
      ...Object.values(errorMessages).map(m => m.message),
      ...Object.values(successMessages).map(m => m.message),
      ...progressMessages.keepGoing,
      ...progressMessages.wellDone,
      ...progressMessages.almostThere
    ];
    
    allMessages.forEach(message => {
      // Should be professional but friendly
      expect(message).not.toMatch(/dude|hey|yo|sup/i);
      expect(message).not.toMatch(/awesome sauce|epic|lit/i);
      
      // Should avoid overly formal language
      expect(message).not.toMatch(/pursuant|heretofore|aforementioned/i);
      
      // Should be encouraging
      expect(message.length).toBeGreaterThan(5);
    });
  });

  test('messages use inclusive language', () => {
    const allMessages = [
      ...Object.values(errorMessages).map(m => `${m.title} ${m.message}`),
      ...Object.values(successMessages).map(m => `${m.title} ${m.message}`)
    ];
    
    allMessages.forEach(message => {
      const lowerMessage = message.toLowerCase();
      
      // Avoid gendered language
      expect(lowerMessage).not.toMatch(/\bhe\b|\bhis\b|\bher\b|\bshe\b/);
      expect(lowerMessage).not.toMatch(/guys|dudes|ladies/);
      
      // Avoid ableist language
      expect(lowerMessage).not.toMatch(/crazy|insane|lame|dumb|stupid/);
      
      // Should use "you" to be personal but inclusive
      expect(lowerMessage).toMatch(/you|your|we|our/);
    });
  });

  test('error messages focus on solutions', () => {
    Object.values(errorMessages).forEach(config => {
      const message = config.message.toLowerCase();
      
      // Should suggest actions
      expect(message).toMatch(/try|check|please|contact|refresh|reload/);
      
      // Should not just state the problem
      expect(message.split(' ').length).toBeGreaterThan(8);
    });
  });

  test('success messages encourage continued engagement', () => {
    Object.values(successMessages).forEach(config => {
      const action = config.action.toLowerCase();
      
      // Actions should encourage next steps
      expect(action).toMatch(/continue|next|view|start|get|keep|explore/);
      
      // Should not be dismissive
      expect(action).not.toMatch(/ok|close|dismiss|done/);
    });
  });
});

describe('Localization Readiness', () => {
  test('messages avoid cultural references', () => {
    const allMessages = [
      ...Object.values(errorMessages).map(m => `${m.title} ${m.message}`),
      ...Object.values(successMessages).map(m => `${m.title} ${m.message}`)
    ];
    
    allMessages.forEach(message => {
      const lowerMessage = message.toLowerCase();
      
      // Avoid cultural idioms
      expect(lowerMessage).not.toMatch(/piece of cake|break a leg|hit the nail/);
      
      // Avoid region-specific references
      expect(lowerMessage).not.toMatch(/football|baseball|cricket/);
    });
  });

  test('messages use simple sentence structure', () => {
    Object.values(errorMessages).forEach(config => {
      const sentences = config.message.split(/[.!?]+/).filter(s => s.trim());
      
      // Most sentences should be reasonably short for translation
      sentences.forEach(sentence => {
        expect(sentence.trim().split(' ').length).toBeLessThan(25);
      });
    });
  });

  test('emojis are used consistently and appropriately', () => {
    const emojiMessages = [
      ...Object.values(successMessages).map(m => m.title),
      ...progressMessages.streakMotivation
    ];
    
    emojiMessages.forEach(message => {
      const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
      
      // Should not overuse emojis
      expect(emojiCount).toBeLessThanOrEqual(2);
    });
  });
});