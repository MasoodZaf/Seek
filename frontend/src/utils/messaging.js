/**
 * Professional messaging system for consistent UI copy and tone
 * Follows brand guidelines for voice and tone
 */

// Error Messages - Helpful and actionable
export const errorMessages = {
  // Network errors
  networkError: {
    title: "Connection Issue",
    message: "We're having trouble connecting to our servers. Please check your internet connection and try again.",
    action: "Try Again"
  },
  
  serverError: {
    title: "Something Went Wrong",
    message: "We encountered an unexpected error. Our team has been notified and is working on a fix.",
    action: "Refresh Page"
  },
  
  timeoutError: {
    title: "Request Timed Out",
    message: "This is taking longer than expected. Please try again or check your connection.",
    action: "Retry"
  },
  
  // Authentication errors
  loginFailed: {
    title: "Login Failed",
    message: "We couldn't verify your credentials. Please check your email and password and try again.",
    action: "Try Again"
  },
  
  sessionExpired: {
    title: "Session Expired",
    message: "For your security, you've been logged out. Please sign in again to continue.",
    action: "Sign In"
  },
  
  unauthorized: {
    title: "Access Denied",
    message: "You don't have permission to access this resource. Please contact support if you believe this is an error.",
    action: "Go Back"
  },
  
  // Code execution errors
  codeExecutionFailed: {
    title: "Code Execution Failed",
    message: "There was an issue running your code. Check for syntax errors and try again.",
    action: "Debug Code"
  },
  
  compilationError: {
    title: "Compilation Error",
    message: "Your code has syntax errors that prevent it from running. Review the highlighted issues below.",
    action: "Fix Errors"
  },
  
  runtimeError: {
    title: "Runtime Error",
    message: "Your code encountered an error while running. Check the error details and debug your logic.",
    action: "Debug"
  },
  
  // Form validation errors
  invalidEmail: "Please enter a valid email address",
  passwordTooShort: "Password must be at least 8 characters long",
  passwordsNoMatch: "Passwords don't match. Please try again",
  requiredField: "This field is required",
  invalidFormat: "Please check the format and try again",
  
  // File errors
  fileUploadFailed: {
    title: "Upload Failed",
    message: "We couldn't upload your file. Please check the file size and format, then try again.",
    action: "Try Again"
  },
  
  fileTooLarge: {
    title: "File Too Large",
    message: "Your file exceeds the maximum size limit. Please choose a smaller file or compress it.",
    action: "Choose Another File"
  },
  
  unsupportedFormat: {
    title: "Unsupported Format",
    message: "This file format isn't supported. Please use a supported format and try again.",
    action: "Choose Different File"
  }
};

// Success Messages - Encouraging and motivating
export const successMessages = {
  // Account actions
  accountCreated: {
    title: "Welcome to Seek! 🎉",
    message: "Your account has been created successfully. Let's start your coding journey!",
    action: "Get Started"
  },
  
  profileUpdated: {
    title: "Profile Updated",
    message: "Your profile changes have been saved successfully.",
    action: "Continue"
  },
  
  passwordChanged: {
    title: "Password Updated",
    message: "Your password has been changed successfully. Your account is now more secure.",
    action: "Continue"
  },
  
  // Learning progress
  tutorialCompleted: {
    title: "Tutorial Completed! 🏆",
    message: "Great job! You've successfully completed this tutorial. Ready for the next challenge?",
    action: "Next Tutorial"
  },
  
  levelUp: {
    title: "Level Up! ⭐",
    message: "Congratulations! Your dedication to learning has earned you a new level.",
    action: "View Progress"
  },
  
  streakAchieved: {
    title: "Streak Achievement! 🔥",
    message: "Amazing! You've maintained your learning streak. Keep up the excellent work!",
    action: "Continue Learning"
  },
  
  // Code actions
  codeSaved: {
    title: "Code Saved",
    message: "Your code has been saved successfully. You can access it anytime from your projects.",
    action: "Continue Coding"
  },
  
  codeShared: {
    title: "Code Shared",
    message: "Your code snippet has been shared successfully. Others can now learn from your work!",
    action: "Share More"
  },
  
  projectCreated: {
    title: "Project Created",
    message: "Your new project is ready! Start coding and bring your ideas to life.",
    action: "Start Coding"
  },
  
  // Achievements
  badgeEarned: {
    title: "Badge Earned! 🎖️",
    message: "Congratulations! Your hard work has earned you a new achievement badge.",
    action: "View Achievements"
  },
  
  milestoneReached: {
    title: "Milestone Reached! 🎯",
    message: "Fantastic! You've reached an important milestone in your learning journey.",
    action: "Keep Going"
  }
};

// Progress Messages - Motivating and encouraging
export const progressMessages = {
  // Learning encouragement
  keepGoing: [
    "You're doing great! Keep up the momentum.",
    "Every line of code brings you closer to mastery.",
    "Your dedication to learning is inspiring!",
    "Progress takes time, but you're on the right track.",
    "Small steps lead to big achievements."
  ],
  
  almostThere: [
    "You're almost there! Just a little more to go.",
    "So close to completing this challenge!",
    "The finish line is in sight. Keep pushing!",
    "You've come so far already. Don't stop now!",
    "One more step and you'll have it mastered."
  ],
  
  wellDone: [
    "Excellent work! Your skills are really improving.",
    "That was handled like a pro! Well done.",
    "Your problem-solving skills are getting stronger.",
    "Great job! You're becoming a better developer every day.",
    "Impressive! Your code is clean and efficient."
  ],
  
  // Streak encouragement
  streakMotivation: [
    "Your consistency is paying off! Keep the streak alive.",
    "Daily practice makes perfect. You're proving it!",
    "Your learning streak shows real dedication.",
    "Consistency is key to mastery, and you've got it!",
    "Every day you code, you get a little bit better."
  ]
};

// Onboarding Messages - Welcoming and guiding
export const onboardingMessages = {
  welcome: {
    title: "Welcome to Seek! 👋",
    message: "We're excited to help you on your coding journey. Let's get you set up for success.",
    steps: [
      "Complete your profile",
      "Choose your learning path",
      "Start your first tutorial",
      "Join the community"
    ]
  },
  
  profileSetup: {
    title: "Tell Us About Yourself",
    message: "Help us personalize your learning experience by sharing a bit about your background and goals.",
    benefits: [
      "Personalized tutorial recommendations",
      "Progress tracking tailored to your goals",
      "Connect with learners at your level"
    ]
  },
  
  firstTutorial: {
    title: "Ready for Your First Tutorial?",
    message: "We've selected a perfect starting point based on your experience level. Let's begin!",
    encouragement: "Remember, everyone starts somewhere. Take your time and don't hesitate to ask for help."
  },
  
  playgroundIntro: {
    title: "Meet Your Code Playground",
    message: "This is where the magic happens! Write, test, and experiment with code in a safe environment.",
    features: [
      "Real-time code execution",
      "Multiple programming languages",
      "Save and share your projects",
      "Get instant feedback"
    ]
  }
};

// Helper functions for dynamic messaging
export const getRandomMessage = (messageArray) => {
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};

export const getProgressMessage = (percentage) => {
  if (percentage >= 90) {
    return getRandomMessage(progressMessages.almostThere);
  } else if (percentage >= 70) {
    return getRandomMessage(progressMessages.wellDone);
  } else {
    return getRandomMessage(progressMessages.keepGoing);
  }
};

export const getStreakMessage = (streakDays) => {
  if (streakDays >= 7) {
    return `🔥 ${streakDays} day streak! ${getRandomMessage(progressMessages.streakMotivation)}`;
  } else if (streakDays >= 3) {
    return `⭐ ${streakDays} days in a row! You're building a great habit.`;
  } else {
    return `🌟 Day ${streakDays}! Every day counts towards your growth.`;
  }
};

// Error message formatter
export const formatErrorMessage = (error, context = {}) => {
  const errorType = error.type || 'serverError';
  const baseMessage = errorMessages[errorType] || errorMessages.serverError;
  
  return {
    ...baseMessage,
    context,
    timestamp: new Date().toISOString()
  };
};

// Success message formatter
export const formatSuccessMessage = (type, data = {}) => {
  const baseMessage = successMessages[type];
  
  if (!baseMessage) {
    return {
      title: "Success!",
      message: "Your action was completed successfully.",
      action: "Continue"
    };
  }
  
  return {
    ...baseMessage,
    data,
    timestamp: new Date().toISOString()
  };
};

// Validation messages
export const validationMessages = {
  email: {
    required: "Email address is required",
    invalid: "Please enter a valid email address",
    taken: "This email is already registered. Try signing in instead."
  },
  
  password: {
    required: "Password is required",
    tooShort: "Password must be at least 8 characters long",
    tooWeak: "Password should include uppercase, lowercase, numbers, and symbols",
    noMatch: "Passwords don't match"
  },
  
  username: {
    required: "Username is required",
    tooShort: "Username must be at least 3 characters long",
    invalid: "Username can only contain letters, numbers, and underscores",
    taken: "This username is already taken. Please choose another."
  },
  
  code: {
    empty: "Please write some code before running",
    tooLong: "Code is too long. Please keep it under 10,000 characters",
    invalid: "There are syntax errors in your code. Please fix them and try again."
  }
};

export default {
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
};