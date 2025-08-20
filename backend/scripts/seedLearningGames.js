const mongoose = require('mongoose');
const LearningGame = require('../models/LearningGame');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/seek_platform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Helper function to generate unique challenge IDs
const generateChallengeId = () => `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Comprehensive Learning Games Collection
const learningGames = [
  // ==================== BEGINNER LEVEL GAMES (15 games) ====================
  {
    title: 'Variable Adventure: Your First Code Journey',
    slug: 'variable-adventure-first-code',
    description: 'Embark on your coding adventure by learning how to create and use variables. Perfect for absolute beginners!',
    gameType: 'quiz-rush',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 10,
    maxScore: 500,
    passingScore: 300,
    thumbnail: '/images/games/variable-adventure.png',
    tags: ['variables', 'javascript', 'basics', 'beginner'],
    prerequisites: ['Basic computer literacy'],
    learningObjectives: [
      'Understand what variables are',
      'Learn to declare variables in JavaScript',
      'Practice assigning values to variables',
      'Recognize different variable types'
    ],
    gameInstructions: 'Help the coding hero collect variables and assign them correct values to progress through the adventure!',
    gameRules: [
      'Answer questions about variables correctly to earn points',
      'You have 3 lives - wrong answers cost a life',
      'Complete all challenges to win the game',
      'Use hints if you get stuck'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which keyword is used to declare a variable in JavaScript?',
        description: 'Choose the correct keyword for creating variables',
        options: [
          { id: 'a', text: 'var', isCorrect: false },
          { id: 'b', text: 'let', isCorrect: true },
          { id: 'c', text: 'variable', isCorrect: false },
          { id: 'd', text: 'create', isCorrect: false }
        ],
        explanation: "In modern JavaScript, 'let' is the preferred way to declare variables as it has block scope.",
        points: 50,
        timeLimit: 30,
        difficulty: 'easy'
      },
      {
        challengeId: generateChallengeId(),
        type: 'fill-blank',
        question: "Complete the code: ___ name = 'Alice';",
        description: 'Fill in the blank to properly declare a variable',
        codeSnippet: "___ name = 'Alice';",
        expectedOutput: 'let',
        explanation: "Use 'let' to declare the variable 'name' and assign it the value 'Alice'.",
        points: 50,
        timeLimit: 30,
        difficulty: 'easy'
      },
      {
        challengeId: generateChallengeId(),
        type: 'true-false',
        question: 'Variables in JavaScript can store different types of data.',
        description: 'Determine if this statement about JavaScript variables is true or false',
        options: [
          { id: 'true', text: 'True', isCorrect: true },
          { id: 'false', text: 'False', isCorrect: false }
        ],
        explanation: 'JavaScript is dynamically typed, so variables can store strings, numbers, booleans, objects, and more.',
        points: 40,
        timeLimit: 20,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Variable Explorer',
        description: "You've learned the basics of variables!",
        icon: '🎯',
        value: 50
      },
      {
        type: 'points',
        name: 'First Steps',
        description: 'Earned for completing your first coding game',
        value: 100
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 10,
      hintsAllowed: 2,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 156 },
    isFeatured: true
  },

  {
    title: 'Function Factory: Build Your First Functions',
    slug: 'function-factory-build-functions',
    description: 'Learn to create and use functions by building them in an interactive factory setting!',
    gameType: 'code-builder',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 15,
    maxScore: 600,
    passingScore: 360,
    tags: ['functions', 'javascript', 'basics', 'coding'],
    prerequisites: ['Variables basics'],
    learningObjectives: [
      "Understand what functions are and why they're useful",
      'Learn to declare functions',
      'Practice calling functions',
      'Use parameters and return values'
    ],
    gameInstructions: 'Work in the Function Factory to build useful functions by dragging and dropping code blocks!',
    gameRules: [
      'Drag code blocks to create working functions',
      'Test your functions with different inputs',
      'Complete all function challenges to advance',
      'Earn bonus points for efficient solutions'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'drag-drop',
        question: 'Create a function that greets a person by name',
        description: 'Arrange the code blocks to create a greeting function',
        options: [
          { id: '1', text: 'function greet(name) {', isCorrect: true },
          { id: '2', text: "return 'Hello, ' + name;", isCorrect: true },
          { id: '3', text: '}', isCorrect: true },
          { id: '4', text: "console.log('Hi');", isCorrect: false }
        ],
        explanation: "Functions are declared with the 'function' keyword, take parameters, and can return values.",
        points: 75,
        timeLimit: 60,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Function Builder',
        description: 'You can create basic functions!',
        icon: '🏭',
        value: 75
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 15,
      hintsAllowed: 3,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.6, count: 134 }
  },

  {
    title: 'Loop Land: Master Repetition',
    slug: 'loop-land-master-repetition',
    description: 'Journey through Loop Land to master for loops, while loops, and iteration concepts!',
    gameType: 'pattern-puzzle',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 12,
    maxScore: 550,
    passingScore: 330,
    tags: ['loops', 'for-loop', 'while-loop', 'iteration'],
    prerequisites: ['Functions basics'],
    learningObjectives: [
      'Understand when to use loops',
      'Learn for loop syntax',
      'Practice while loops',
      'Recognize loop patterns'
    ],
    gameInstructions: 'Navigate through Loop Land by solving repetition puzzles and creating efficient loops!',
    gameRules: [
      'Solve loop puzzles to unlock new areas',
      'Choose the most efficient loop type',
      'Avoid infinite loops - they cost lives!',
      'Complete patterns to earn bonus points'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which loop should you use when you know exactly how many times to repeat?',
        options: [
          { id: 'a', text: 'for loop', isCorrect: true },
          { id: 'b', text: 'while loop', isCorrect: false },
          { id: 'c', text: 'if statement', isCorrect: false },
          { id: 'd', text: 'function', isCorrect: false }
        ],
        explanation: 'For loops are ideal when you know the exact number of iterations needed.',
        points: 60,
        timeLimit: 30,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Loop Master',
        description: "You've mastered the art of repetition!",
        icon: '🔄',
        value: 80
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 12,
      hintsAllowed: 3,
      skipAllowed: true,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.5, count: 189 }
  },

  {
    title: 'Array Academy: Organize Your Data',
    slug: 'array-academy-organize-data',
    description: 'Learn to store and manipulate lists of data with arrays in this interactive academy!',
    gameType: 'memory-match',
    category: 'Data Structures',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 14,
    maxScore: 650,
    passingScore: 390,
    tags: ['arrays', 'lists', 'data-structures', 'indexing'],
    prerequisites: ['Loops basics'],
    learningObjectives: [
      'Understand what arrays are',
      'Learn to create and access arrays',
      'Practice array methods',
      'Work with array indices'
    ],
    gameInstructions: 'Match array operations with their results to graduate from Array Academy!',
    gameRules: [
      'Match array code with correct outputs',
      'Remember array indexing starts at 0',
      'Use array methods to manipulate data',
      'Complete all matches to win'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'pattern-match',
        question: 'Match the array operation with its result',
        description: 'Connect array operations to their correct outcomes',
        options: [
          { id: '1', text: '[1,2,3].length', isCorrect: true },
          { id: '2', text: '3', isCorrect: true },
          { id: '3', text: '[1,2,3][0]', isCorrect: true },
          { id: '4', text: '1', isCorrect: true }
        ],
        explanation: 'Arrays have a length property and are indexed starting from 0.',
        points: 70,
        timeLimit: 45,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Array Scholar',
        description: 'You understand data organization!',
        icon: '📚',
        value: 85
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 14,
      hintsAllowed: 3,
      skipAllowed: false,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.4, count: 203 }
  },

  {
    title: 'Object Odyssey: Explore Data Relationships',
    slug: 'object-odyssey-explore-data',
    description: 'Embark on an odyssey to discover how objects store related data in key-value pairs!',
    gameType: 'treasure-hunt',
    category: 'Data Structures',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 16,
    maxScore: 700,
    passingScore: 420,
    tags: ['objects', 'key-value', 'properties', 'methods'],
    prerequisites: ['Arrays basics'],
    learningObjectives: [
      'Understand object structure',
      'Learn to access object properties',
      'Practice creating objects',
      'Work with nested objects'
    ],
    gameInstructions: 'Hunt for treasure by navigating through objects and finding the correct properties!',
    gameRules: [
      'Follow object property paths to find treasures',
      'Use dot notation and bracket notation',
      'Solve object puzzles to unlock chests',
      'Collect all treasures to complete the odyssey'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Access the name property of the person object',
        description: "Complete the code to get the person's name",
        codeSnippet: "const person = { name: 'Alice', age: 25 };\nconst personName = person.____;",
        expectedOutput: 'name',
        explanation: 'Use dot notation (person.name) to access object properties.',
        points: 80,
        timeLimit: 40,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Object Explorer',
        description: "You've discovered the power of objects!",
        icon: '🗝️',
        value: 90
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 16,
      hintsAllowed: 4,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.6, count: 167 }
  },

  {
    title: 'Conditional Castle: Make Smart Decisions',
    slug: 'conditional-castle-smart-decisions',
    description: 'Navigate through Conditional Castle by making smart decisions with if statements and logical operators!',
    gameType: 'logic-labyrinth',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 13,
    maxScore: 600,
    passingScore: 360,
    tags: ['conditionals', 'if-statements', 'logic', 'boolean'],
    prerequisites: ['Objects basics'],
    learningObjectives: [
      'Master if-else statements',
      'Understand logical operators',
      'Practice boolean logic',
      'Make complex decisions in code'
    ],
    gameInstructions: 'Navigate the castle by making the right logical decisions at each checkpoint!',
    gameRules: [
      'Choose the correct conditional statements',
      'Use logical operators (&&, ||, !) properly',
      'Solve logic puzzles to open doors',
      "Reach the castle's treasure room to win"
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'What will this condition evaluate to: (5 > 3 && 2 < 4)?',
        options: [
          { id: 'a', text: 'true', isCorrect: true },
          { id: 'b', text: 'false', isCorrect: false },
          { id: 'c', text: 'undefined', isCorrect: false },
          { id: 'd', text: 'null', isCorrect: false }
        ],
        explanation: 'Both conditions (5 > 3 and 2 < 4) are true, so the && operator returns true.',
        points: 65,
        timeLimit: 35,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Logic Lord',
        description: "You've mastered logical decision making!",
        icon: '🏰',
        value: 85
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 13,
      hintsAllowed: 3,
      skipAllowed: true,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.5, count: 145 }
  },

  {
    title: 'String Symphony: Master Text Manipulation',
    slug: 'string-symphony-text-manipulation',
    description: 'Conduct a symphony of strings by learning text manipulation and string methods!',
    gameType: 'typing-master',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 11,
    maxScore: 550,
    passingScore: 330,
    tags: ['strings', 'text', 'methods', 'manipulation'],
    prerequisites: ['Conditionals basics'],
    learningObjectives: [
      'Work with string concatenation',
      'Use string methods effectively',
      'Understand string properties',
      'Practice text formatting'
    ],
    gameInstructions: 'Create beautiful string melodies by combining and manipulating text in various ways!',
    gameRules: [
      'Type string methods correctly to create music',
      'Combine strings to form melodies',
      'Use proper string formatting',
      'Complete the symphony to win'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'fill-blank',
        question: "Complete the code to make the string uppercase: 'hello'.______()",
        codeSnippet: "'hello'.______()",
        expectedOutput: 'toUpperCase',
        explanation: 'The toUpperCase() method converts a string to uppercase letters.',
        points: 55,
        timeLimit: 30,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'String Virtuoso',
        description: "You're a master of text manipulation!",
        icon: '🎼',
        value: 75
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 11,
      hintsAllowed: 2,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.3, count: 198 }
  },

  {
    title: 'Python Pet Park: Variables and Data Types',
    slug: 'python-pet-park-variables',
    description: 'Take care of virtual pets while learning Python variables and data types!',
    gameType: 'role-playing',
    category: 'Programming Fundamentals',
    language: 'python',
    difficulty: 'beginner',
    estimatedTime: 15,
    maxScore: 650,
    passingScore: 390,
    tags: ['python', 'variables', 'data-types', 'basics'],
    prerequisites: ['Basic computer literacy'],
    learningObjectives: [
      'Learn Python variable syntax',
      'Understand Python data types',
      'Practice variable assignment',
      'Work with different data types'
    ],
    gameInstructions: 'Care for your virtual pets by using Python variables to track their needs and stats!',
    gameRules: [
      'Use variables to store pet information',
      'Choose correct data types for different values',
      'Feed and care for pets using code',
      'Keep all pets happy to win the game'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which is the correct way to create a variable in Python?',
        options: [
          { id: 'a', text: "pet_name = 'Fluffy'", isCorrect: true },
          { id: 'b', text: "var pet_name = 'Fluffy'", isCorrect: false },
          { id: 'c', text: "let pet_name = 'Fluffy'", isCorrect: false },
          { id: 'd', text: "petName := 'Fluffy'", isCorrect: false }
        ],
        explanation: 'Python uses simple assignment with the equals sign, no special keywords needed.',
        points: 70,
        timeLimit: 30,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Pet Caretaker',
        description: 'You can manage data like a pro pet caretaker!',
        icon: '🐕',
        value: 80
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 15,
      hintsAllowed: 3,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 142 }
  },

  {
    title: 'HTML House Builder: Create Your First Webpage',
    slug: 'html-house-builder-webpage',
    description: 'Build your dream house using HTML elements and learn web development fundamentals!',
    gameType: 'code-builder',
    category: 'Web Development',
    language: 'html',
    difficulty: 'beginner',
    estimatedTime: 18,
    maxScore: 750,
    passingScore: 450,
    tags: ['html', 'web-development', 'elements', 'structure'],
    prerequisites: ['Basic computer literacy'],
    learningObjectives: [
      'Learn HTML element structure',
      'Understand HTML tags',
      'Practice creating web content',
      'Build a complete webpage'
    ],
    gameInstructions: 'Construct your dream house by placing HTML elements in the right structure!',
    gameRules: [
      'Drag HTML elements to build rooms',
      'Use proper nesting for structure',
      'Add content to make rooms functional',
      'Complete all rooms to finish your house'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'drag-drop',
        question: 'Build a basic HTML page structure',
        description: 'Arrange these elements to create a proper HTML document',
        options: [
          { id: '1', text: '<!DOCTYPE html>', isCorrect: true },
          { id: '2', text: '<html>', isCorrect: true },
          { id: '3', text: '<head>', isCorrect: true },
          { id: '4', text: '<body>', isCorrect: true },
          { id: '5', text: '<div>', isCorrect: false }
        ],
        explanation: 'HTML documents start with DOCTYPE, then html, head, and body elements.',
        points: 85,
        timeLimit: 60,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Web Architect',
        description: 'You can build web structures!',
        icon: '🏠',
        value: 90
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 18,
      hintsAllowed: 4,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.6, count: 178 }
  },

  {
    title: 'CSS Color Splash: Style Your World',
    slug: 'css-color-splash-styling',
    description: 'Paint and style web elements using CSS properties in this colorful adventure!',
    gameType: 'pattern-puzzle',
    category: 'Web Development',
    language: 'css',
    difficulty: 'beginner',
    estimatedTime: 14,
    maxScore: 600,
    passingScore: 360,
    tags: ['css', 'styling', 'colors', 'properties'],
    prerequisites: ['HTML basics'],
    learningObjectives: [
      'Learn CSS syntax',
      'Understand selectors',
      'Practice styling properties',
      'Create visual designs'
    ],
    gameInstructions: 'Splash colors and styles across the web canvas to create beautiful designs!',
    gameRules: [
      'Apply CSS styles to transform elements',
      'Match colors and layouts to targets',
      'Use proper CSS syntax',
      'Complete all design challenges'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which CSS property changes the text color?',
        options: [
          { id: 'a', text: 'color', isCorrect: true },
          { id: 'b', text: 'text-color', isCorrect: false },
          { id: 'c', text: 'font-color', isCorrect: false },
          { id: 'd', text: 'background-color', isCorrect: false }
        ],
        explanation: "The 'color' property is used to set the color of text in CSS.",
        points: 60,
        timeLimit: 25,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Style Artist',
        description: 'You create beautiful web designs!',
        icon: '🎨',
        value: 75
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 14,
      hintsAllowed: 3,
      skipAllowed: true,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.4, count: 165 }
  },

  {
    title: 'Java Journey: Object-Oriented Basics',
    slug: 'java-journey-oop-basics',
    description: 'Begin your Java adventure by learning classes, objects, and object-oriented programming fundamentals!',
    gameType: 'role-playing',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'beginner',
    estimatedTime: 20,
    maxScore: 800,
    passingScore: 480,
    tags: ['java', 'oop', 'classes', 'objects'],
    prerequisites: ['Basic programming concepts'],
    learningObjectives: [
      'Understand classes and objects',
      'Learn Java syntax',
      'Practice object creation',
      'Use methods and properties'
    ],
    gameInstructions: 'Create characters and items using Java classes in this role-playing adventure!',
    gameRules: [
      'Design classes for game characters',
      'Create objects from your classes',
      'Use methods to make characters interact',
      'Complete quests to advance the story'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the Java class declaration',
        description: 'Fill in the missing keyword to create a class',
        codeSnippet: '_____ class Hero {\n    String name;\n    int level;\n}',
        expectedOutput: 'public',
        explanation: "Java classes are typically declared as 'public' to make them accessible.",
        points: 80,
        timeLimit: 45,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Java Pioneer',
        description: "You've started your Java journey!",
        icon: '☕',
        value: 95
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 20,
      hintsAllowed: 4,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.5, count: 134 }
  },

  {
    title: 'C++ Code Craft: Memory and Pointers',
    slug: 'cpp-code-craft-memory-pointers',
    description: 'Craft efficient C++ code by mastering memory management and pointer concepts!',
    gameType: 'debug-detective',
    category: 'Programming Fundamentals',
    language: 'cpp',
    difficulty: 'beginner',
    estimatedTime: 22,
    maxScore: 850,
    passingScore: 510,
    tags: ['cpp', 'pointers', 'memory', 'variables'],
    prerequisites: ['Basic programming concepts'],
    learningObjectives: [
      'Understand C++ syntax',
      'Learn about pointers',
      'Practice memory concepts',
      'Debug simple programs'
    ],
    gameInstructions: 'Solve memory puzzles and fix pointer problems in this C++ crafting adventure!',
    gameRules: [
      'Debug C++ code snippets',
      'Fix memory-related issues',
      'Understand pointer syntax',
      'Complete all crafting challenges'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-debug',
        question: 'Fix the pointer declaration',
        description: 'Correct the syntax error in this pointer declaration',
        codeSnippet: 'int* ptr = &value;\nint value = 42;',
        expectedOutput: 'int value = 42;\nint* ptr = &value;',
        explanation: 'Variables must be declared before they can be referenced with the address-of operator.',
        points: 90,
        timeLimit: 60,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Memory Master',
        description: 'You understand C++ memory management!',
        icon: '🔧',
        value: 100
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 22,
      hintsAllowed: 5,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.3, count: 98 }
  },

  {
    title: 'TypeScript Type Detective: Solve Type Mysteries',
    slug: 'typescript-type-detective-mysteries',
    description: 'Become a type detective and solve mysterious type-related cases in TypeScript!',
    gameType: 'debug-detective',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'beginner',
    estimatedTime: 17,
    maxScore: 700,
    passingScore: 420,
    tags: ['typescript', 'types', 'interfaces', 'debugging'],
    prerequisites: ['JavaScript basics'],
    learningObjectives: [
      'Understand TypeScript types',
      'Learn type annotations',
      'Practice interface usage',
      'Debug type errors'
    ],
    gameInstructions: 'Investigate type crimes and solve mysteries using your TypeScript detective skills!',
    gameRules: [
      'Analyze type-related clues',
      'Fix type errors in code',
      'Use proper type annotations',
      'Solve all cases to become a master detective'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: "What's the correct type annotation for a variable that stores a person's age?",
        options: [
          { id: 'a', text: 'let age: number;', isCorrect: true },
          { id: 'b', text: 'let age: string;', isCorrect: false },
          { id: 'c', text: 'let age: boolean;', isCorrect: false },
          { id: 'd', text: 'let age: any;', isCorrect: false }
        ],
        explanation: 'Age is typically represented as a number in programming.',
        points: 70,
        timeLimit: 35,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Type Detective',
        description: 'You solve type mysteries with ease!',
        icon: '🕵️',
        value: 85
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 17,
      hintsAllowed: 3,
      skipAllowed: true,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.4, count: 156 }
  },

  {
    title: 'Algorithm Arcade: Sorting Game Spectacular',
    slug: 'algorithm-arcade-sorting-spectacular',
    description: 'Play classic arcade games while learning fundamental sorting algorithms!',
    gameType: 'speed-coder',
    category: 'Algorithms',
    language: 'general',
    difficulty: 'beginner',
    estimatedTime: 16,
    maxScore: 650,
    passingScore: 390,
    tags: ['algorithms', 'sorting', 'logic', 'problem-solving'],
    prerequisites: ['Basic programming concepts'],
    learningObjectives: [
      'Understand sorting concepts',
      'Learn algorithm thinking',
      'Practice step-by-step problem solving',
      'Recognize patterns in data'
    ],
    gameInstructions: 'Sort data quickly and efficiently in these fun arcade-style challenges!',
    gameRules: [
      'Sort numbers in ascending order',
      'Beat the timer for bonus points',
      'Use the most efficient method',
      'Complete all sorting challenges'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'sequence-order',
        question: 'Sort these numbers in ascending order: [5, 2, 8, 1, 9]',
        description: 'Arrange the numbers from smallest to largest',
        options: [
          { id: '1', text: '1', isCorrect: true },
          { id: '2', text: '2', isCorrect: true },
          { id: '3', text: '5', isCorrect: true },
          { id: '4', text: '8', isCorrect: true },
          { id: '5', text: '9', isCorrect: true }
        ],
        explanation: 'Ascending order means arranging from smallest to largest value.',
        points: 75,
        timeLimit: 40,
        difficulty: 'easy'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Sorting Specialist',
        description: 'You can organize data efficiently!',
        icon: '🎯',
        value: 80
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 16,
      hintsAllowed: 3,
      skipAllowed: false,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.6, count: 187 }
  },

  // ==================== INTERMEDIATE LEVEL GAMES (12 games) ====================
  {
    title: 'Advanced Function Forge: Higher-Order Functions',
    slug: 'advanced-function-forge-higher-order',
    description: 'Master advanced function concepts including callbacks, closures, and higher-order functions!',
    gameType: 'code-builder',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 25,
    maxScore: 1000,
    passingScore: 600,
    tags: ['functions', 'callbacks', 'closures', 'higher-order'],
    prerequisites: ['Basic functions', 'Arrays and objects'],
    learningObjectives: [
      'Master callback functions',
      'Understand closures',
      'Use higher-order functions',
      'Apply functional programming concepts'
    ],
    gameInstructions: 'Forge powerful functions using advanced techniques in this challenging workshop!',
    gameRules: [
      'Build complex functions using callbacks',
      'Create closures for data privacy',
      'Use map, filter, and reduce effectively',
      'Complete all forging challenges'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the higher-order function that applies a callback to each array element',
        description: 'Fill in the missing parts of this map implementation',
        codeSnippet: 'function customMap(array, callback) {\n  const result = [];\n  for (let i = 0; i < array.length; i++) {\n    result.push(callback(___, ___));\n  }\n  return result;\n}',
        expectedOutput: 'array[i], i',
        explanation: 'The callback receives the current element and its index as parameters.',
        points: 120,
        timeLimit: 90,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Function Artisan',
        description: 'You craft sophisticated functions!',
        icon: '⚒️',
        value: 150
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 25,
      hintsAllowed: 4,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 145 }
  },

  {
    title: 'API Quest: Fetch and Conquer',
    slug: 'api-quest-fetch-conquer',
    description: 'Embark on an epic quest to master API calls, async/await, and data fetching!',
    gameType: 'treasure-hunt',
    category: 'Web Development',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 30,
    maxScore: 1200,
    passingScore: 720,
    tags: ['api', 'fetch', 'async', 'promises', 'ajax'],
    prerequisites: ['Functions', 'Promises basics'],
    learningObjectives: [
      'Master the Fetch API',
      'Handle async operations',
      'Process JSON responses',
      'Implement error handling'
    ],
    gameInstructions: 'Quest through different kingdoms collecting data treasures using API calls!',
    gameRules: [
      'Fetch data from various API endpoints',
      'Handle both success and error responses',
      'Transform and display fetched data',
      'Complete all kingdom quests'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-debug',
        question: 'Fix the async/await API call',
        description: 'This code has errors - fix them to make a proper API request',
        codeSnippet: 'function fetchUserData(userId) {\n  const response = await fetch(`/api/users/${userId}`);\n  const userData = await response.json();\n  return userData;\n}',
        expectedOutput: 'async function fetchUserData(userId) {\n  const response = await fetch(`/api/users/${userId}`);\n  const userData = await response.json();\n  return userData;\n}',
        explanation: 'Functions using await must be declared as async functions.',
        points: 140,
        timeLimit: 120,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'API Master',
        description: 'You command the power of APIs!',
        icon: '🗡️',
        value: 200
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 30,
      hintsAllowed: 5,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 134 }
  },

  {
    title: 'React Component Kingdom: Build Interactive UIs',
    slug: 'react-component-kingdom',
    description: 'Rule the React Component Kingdom by building interactive user interfaces with hooks and state!',
    gameType: 'tower-defense',
    category: 'Web Development',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 35,
    maxScore: 1400,
    passingScore: 840,
    tags: ['react', 'components', 'hooks', 'state', 'jsx'],
    prerequisites: ['JavaScript ES6+', 'HTML/CSS'],
    learningObjectives: [
      'Create React components',
      'Use hooks effectively',
      'Manage component state',
      'Handle user interactions'
    ],
    gameInstructions: 'Defend your kingdom by building React components that respond to user attacks!',
    gameRules: [
      'Build component towers with different abilities',
      'Use state to track enemy positions',
      'Implement event handlers for user input',
      'Survive all waves to protect the kingdom'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'drag-drop',
        question: 'Build a React component with state',
        description: 'Arrange these parts to create a working React component',
        options: [
          { id: '1', text: "import React, { useState } from 'react';", isCorrect: true },
          { id: '2', text: 'function Counter() {', isCorrect: true },
          { id: '3', text: '  const [count, setCount] = useState(0);', isCorrect: true },
          { id: '4', text: '  return <button onClick={() => setCount(count + 1)}>{count}</button>;', isCorrect: true },
          { id: '5', text: '}', isCorrect: true }
        ],
        explanation: 'React components use hooks like useState to manage state and JSX for the UI.',
        points: 160,
        timeLimit: 180,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'React Ruler',
        description: 'You command React components!',
        icon: '👑',
        value: 250
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 35,
      hintsAllowed: 6,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.6, count: 198 }
  },

  {
    title: 'Database Detective: SQL Query Mysteries',
    slug: 'database-detective-sql-mysteries',
    description: 'Solve complex database mysteries using advanced SQL queries and joins!',
    gameType: 'debug-detective',
    category: 'Database',
    language: 'sql',
    difficulty: 'intermediate',
    estimatedTime: 28,
    maxScore: 1100,
    passingScore: 660,
    tags: ['sql', 'database', 'queries', 'joins', 'relations'],
    prerequisites: ['Basic SQL', 'Database concepts'],
    learningObjectives: [
      'Master complex SQL queries',
      'Use joins effectively',
      'Optimize query performance',
      'Solve data analysis problems'
    ],
    gameInstructions: 'Investigate database crimes by writing SQL queries to uncover hidden evidence!',
    gameRules: [
      'Write SQL queries to find clues',
      'Use joins to connect related data',
      'Optimize queries for performance',
      'Solve all cases to close the investigation'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the SQL query to find users with their order totals',
        description: 'Write a JOIN query to combine users and orders data',
        codeSnippet: 'SELECT u.name, SUM(o.total) as order_total\nFROM users u\n_____ orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;',
        expectedOutput: 'LEFT JOIN',
        explanation: 'LEFT JOIN includes all users, even those without orders, showing NULL for order totals.',
        points: 130,
        timeLimit: 100,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'SQL Sleuth',
        description: 'You solve database mysteries!',
        icon: '🔍',
        value: 180
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 28,
      hintsAllowed: 4,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.5, count: 167 }
  },

  {
    title: 'Python Data Science Lab: Pandas and NumPy',
    slug: 'python-data-science-lab',
    description: 'Conduct experiments in the data science lab using Pandas and NumPy for data analysis!',
    gameType: 'escape-room',
    category: 'Data Structures',
    language: 'python',
    difficulty: 'intermediate',
    estimatedTime: 32,
    maxScore: 1300,
    passingScore: 780,
    tags: ['python', 'pandas', 'numpy', 'data-analysis', 'data-science'],
    prerequisites: ['Python basics', 'Data structures'],
    learningObjectives: [
      'Master Pandas DataFrames',
      'Use NumPy for numerical computing',
      'Perform data analysis tasks',
      'Visualize data insights'
    ],
    gameInstructions: 'Escape the lab by solving data analysis puzzles using Pandas and NumPy!',
    gameRules: [
      'Analyze datasets to find escape codes',
      'Use Pandas operations to transform data',
      'Apply NumPy for calculations',
      'Solve all experiments to escape'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the Pandas code to filter data',
        description: 'Filter the DataFrame to show only rows where age > 25',
        codeSnippet: "import pandas as pd\ndf = pd.DataFrame({'name': ['Alice', 'Bob', 'Charlie'], 'age': [23, 30, 28]})\nfiltered_df = df[df['age'] ___ 25]",
        expectedOutput: '>',
        explanation: 'Use the > operator to filter rows where the age column is greater than 25.',
        points: 140,
        timeLimit: 90,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Data Scientist',
        description: 'You master data with Python!',
        icon: '🧪',
        value: 220
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 32,
      hintsAllowed: 5,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 123 }
  },

  {
    title: 'Java Spring Boot Fortress: Build Microservices',
    slug: 'java-spring-boot-fortress',
    description: 'Construct a mighty fortress using Java Spring Boot microservices architecture!',
    gameType: 'tower-defense',
    category: 'Web Development',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 40,
    maxScore: 1500,
    passingScore: 900,
    tags: ['java', 'spring-boot', 'microservices', 'rest-api', 'backend'],
    prerequisites: ['Java OOP', 'Web concepts'],
    learningObjectives: [
      'Build REST APIs with Spring Boot',
      'Understand microservices architecture',
      'Implement dependency injection',
      'Handle HTTP requests and responses'
    ],
    gameInstructions: 'Defend your fortress by building Spring Boot microservices that handle different types of attacks!',
    gameRules: [
      'Create REST endpoints for different defenses',
      'Use Spring Boot annotations correctly',
      'Handle various HTTP methods',
      'Build a complete microservices architecture'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the Spring Boot REST controller',
        description: 'Add the missing annotations to create a working REST endpoint',
        codeSnippet: '___\n___("/api/users")\npublic class UserController {\n    ___\n    public List<User> getAllUsers() {\n        return userService.findAll();\n    }\n}',
        expectedOutput: '@RestController\n@RequestMapping\n@GetMapping',
        explanation: 'Spring Boot uses annotations to define REST controllers and mapping endpoints.',
        points: 150,
        timeLimit: 120,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Spring Boot Architect',
        description: 'You build robust Java applications!',
        icon: '🏰',
        value: 280
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 40,
      hintsAllowed: 6,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.4, count: 187 }
  },

  {
    title: 'Algorithm Olympics: Advanced Sorting & Searching',
    slug: 'algorithm-olympics-advanced',
    description: 'Compete in the Algorithm Olympics by implementing advanced sorting and searching algorithms!',
    gameType: 'speed-coder',
    category: 'Algorithms',
    language: 'general',
    difficulty: 'intermediate',
    estimatedTime: 35,
    maxScore: 1400,
    passingScore: 840,
    tags: ['algorithms', 'sorting', 'searching', 'optimization', 'complexity'],
    prerequisites: ['Basic algorithms', 'Data structures'],
    learningObjectives: [
      'Implement advanced sorting algorithms',
      'Master binary search techniques',
      'Understand algorithm complexity',
      'Optimize algorithm performance'
    ],
    gameInstructions: 'Compete in various algorithmic events to win the gold medal in programming!',
    gameRules: [
      'Implement algorithms within time limits',
      'Optimize for best time complexity',
      'Handle edge cases correctly',
      'Score points based on efficiency'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement binary search algorithm',
        description: 'Complete the binary search function to find a target value',
        codeSnippet: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return ___;\n    if (arr[mid] < target) left = ___;\n    else right = ___;\n  }\n  return -1;\n}',
        expectedOutput: 'mid; mid + 1; mid - 1',
        explanation: 'Binary search divides the search space in half each iteration for O(log n) complexity.',
        points: 160,
        timeLimit: 150,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Algorithm Olympian',
        description: 'You excel at algorithmic problem solving!',
        icon: '🥇',
        value: 300
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 35,
      hintsAllowed: 4,
      skipAllowed: false,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: true,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 156 }
  },

  {
    title: 'TypeScript Generics Workshop: Type-Safe Programming',
    slug: 'typescript-generics-workshop',
    description: 'Master TypeScript generics and advanced type features in this comprehensive workshop!',
    gameType: 'code-builder',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 30,
    maxScore: 1200,
    passingScore: 720,
    tags: ['typescript', 'generics', 'types', 'advanced', 'type-safety'],
    prerequisites: ['TypeScript basics', 'JavaScript ES6+'],
    learningObjectives: [
      'Master generic functions and classes',
      'Use utility types effectively',
      'Implement conditional types',
      'Create type-safe APIs'
    ],
    gameInstructions: "Build type-safe tools and utilities using TypeScript's advanced type system!",
    gameRules: [
      'Create generic functions that work with multiple types',
      'Use utility types to transform existing types',
      'Implement proper type constraints',
      'Build a complete type-safe library'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the generic function with proper constraints',
        description: "Add type constraints to ensure the generic works with objects that have an 'id' property",
        codeSnippet: 'function findById<T ___>(items: T[], id: number): T | undefined {\n  return items.find(item => item.id === id);\n}',
        expectedOutput: 'extends { id: number }',
        explanation: 'Type constraints ensure that generic types have required properties or methods.',
        points: 140,
        timeLimit: 100,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Type Master',
        description: 'You create type-safe code!',
        icon: '🛡️',
        value: 240
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 30,
      hintsAllowed: 5,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.6, count: 142 }
  },

  {
    title: 'C++ Memory Arena: Smart Pointers & RAII',
    slug: 'cpp-memory-arena-smart-pointers',
    description: 'Battle memory leaks and manage resources efficiently using modern C++ techniques!',
    gameType: 'tower-defense',
    category: 'Programming Fundamentals',
    language: 'cpp',
    difficulty: 'intermediate',
    estimatedTime: 38,
    maxScore: 1450,
    passingScore: 870,
    tags: ['cpp', 'memory-management', 'smart-pointers', 'raii', 'modern-cpp'],
    prerequisites: ['C++ basics', 'Pointers'],
    learningObjectives: [
      'Master smart pointers (unique_ptr, shared_ptr)',
      'Understand RAII principles',
      'Prevent memory leaks',
      'Use modern C++ best practices'
    ],
    gameInstructions: 'Defend against memory leaks by deploying smart pointers and RAII techniques!',
    gameRules: [
      'Use appropriate smart pointer types',
      'Implement RAII for resource management',
      'Prevent memory leaks and dangling pointers',
      'Survive waves of memory management challenges'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which smart pointer should be used for exclusive ownership?',
        options: [
          { id: 'a', text: 'std::unique_ptr', isCorrect: true },
          { id: 'b', text: 'std::shared_ptr', isCorrect: false },
          { id: 'c', text: 'std::weak_ptr', isCorrect: false },
          { id: 'd', text: 'std::auto_ptr', isCorrect: false }
        ],
        explanation: 'std::unique_ptr provides exclusive ownership and automatically deletes the resource.',
        points: 130,
        timeLimit: 60,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Memory Guardian',
        description: 'You protect against memory leaks!',
        icon: '🛡️',
        value: 260
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 38,
      hintsAllowed: 6,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.5, count: 98 }
  },

  {
    title: 'DevOps Pipeline Puzzle: CI/CD Mastery',
    slug: 'devops-pipeline-puzzle-cicd',
    description: 'Build and optimize CI/CD pipelines to deploy applications efficiently and reliably!',
    gameType: 'logic-labyrinth',
    category: 'DevOps',
    language: 'general',
    difficulty: 'intermediate',
    estimatedTime: 35,
    maxScore: 1350,
    passingScore: 810,
    tags: ['devops', 'cicd', 'deployment', 'automation', 'pipeline'],
    prerequisites: ['Basic programming', 'Command line'],
    learningObjectives: [
      'Design CI/CD pipelines',
      'Understand deployment strategies',
      'Automate testing and deployment',
      'Monitor application performance'
    ],
    gameInstructions: 'Navigate through deployment challenges by building efficient CI/CD pipelines!',
    gameRules: [
      'Design pipeline stages correctly',
      'Implement proper testing strategies',
      'Choose appropriate deployment methods',
      'Optimize for speed and reliability'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'sequence-order',
        question: 'Arrange these CI/CD pipeline stages in the correct order',
        description: 'Put the pipeline stages in the proper sequence for software delivery',
        options: [
          { id: '1', text: 'Source Code Checkout', isCorrect: true },
          { id: '2', text: 'Build Application', isCorrect: true },
          { id: '3', text: 'Run Tests', isCorrect: true },
          { id: '4', text: 'Deploy to Staging', isCorrect: true },
          { id: '5', text: 'Deploy to Production', isCorrect: true }
        ],
        explanation: 'CI/CD pipelines follow a logical flow from source to production deployment.',
        points: 145,
        timeLimit: 90,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Pipeline Master',
        description: 'You automate software delivery!',
        icon: '🔧',
        value: 250
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 35,
      hintsAllowed: 5,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.4, count: 134 }
  },

  {
    title: 'Security Fortress: Web Application Security',
    slug: 'security-fortress-web-app-security',
    description: 'Defend web applications against common security vulnerabilities and attacks!',
    gameType: 'tower-defense',
    category: 'Security',
    language: 'general',
    difficulty: 'intermediate',
    estimatedTime: 32,
    maxScore: 1250,
    passingScore: 750,
    tags: ['security', 'web-security', 'vulnerabilities', 'defense', 'owasp'],
    prerequisites: ['Web development', 'HTTP basics'],
    learningObjectives: [
      'Identify common security vulnerabilities',
      'Implement security best practices',
      'Understand OWASP Top 10',
      'Secure web applications'
    ],
    gameInstructions: 'Fortify your web application against various security attacks using defensive programming!',
    gameRules: [
      'Identify and fix security vulnerabilities',
      'Implement proper input validation',
      'Use secure authentication methods',
      'Defend against all attack types'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which technique helps prevent SQL injection attacks?',
        options: [
          { id: 'a', text: 'Parameterized queries', isCorrect: true },
          { id: 'b', text: 'String concatenation', isCorrect: false },
          { id: 'c', text: 'Dynamic SQL', isCorrect: false },
          { id: 'd', text: 'Stored procedures only', isCorrect: false }
        ],
        explanation: 'Parameterized queries separate SQL code from data, preventing injection attacks.',
        points: 135,
        timeLimit: 70,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Security Expert',
        description: 'You protect against cyber threats!',
        icon: '🔒',
        value: 270
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 32,
      hintsAllowed: 5,
      skipAllowed: true,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 156 }
  },

  {
    title: 'Machine Learning Maze: AI Algorithm Adventure',
    slug: 'machine-learning-maze-ai-algorithms',
    description: 'Navigate through a maze of machine learning algorithms and build your first AI models!',
    gameType: 'escape-room',
    category: 'Machine Learning',
    language: 'python',
    difficulty: 'intermediate',
    estimatedTime: 42,
    maxScore: 1600,
    passingScore: 960,
    tags: ['machine-learning', 'ai', 'algorithms', 'scikit-learn', 'classification'],
    prerequisites: ['Python data science', 'Statistics basics'],
    learningObjectives: [
      'Understand ML algorithm types',
      'Implement classification models',
      'Evaluate model performance',
      'Apply feature engineering'
    ],
    gameInstructions: 'Escape the maze by training machine learning models to solve AI puzzles!',
    gameRules: [
      'Choose appropriate algorithms for problems',
      'Train models with provided datasets',
      'Achieve target accuracy scores',
      'Complete all ML challenges to escape'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Complete the machine learning model training code',
        description: 'Fill in the missing parts to train a classification model',
        codeSnippet: 'from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = RandomForestClassifier()\nmodel.___(X_train, y_train)\naccuracy = model.___(X_test, y_test)',
        expectedOutput: 'fit; score',
        explanation: 'Use fit() to train the model and score() to evaluate its accuracy on test data.',
        points: 170,
        timeLimit: 180,
        difficulty: 'medium'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'AI Pioneer',
        description: 'You build intelligent systems!',
        icon: '🤖',
        value: 350
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 42,
      hintsAllowed: 7,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 89 }
  },

  // ==================== ADVANCED/EXPERT LEVEL GAMES (13 games) ====================
  {
    title: 'Microservices Architect: Distributed Systems Design',
    slug: 'microservices-architect-distributed-systems',
    description: 'Design and implement complex distributed systems using microservices architecture patterns!',
    gameType: 'tower-defense',
    category: 'Web Development',
    language: 'general',
    difficulty: 'advanced',
    estimatedTime: 60,
    maxScore: 2000,
    passingScore: 1200,
    tags: ['microservices', 'distributed-systems', 'architecture', 'scalability', 'containers'],
    prerequisites: ['REST APIs', 'Database design', 'System design'],
    learningObjectives: [
      'Design microservices architecture',
      'Implement service communication patterns',
      'Handle distributed system challenges',
      'Apply scalability and resilience patterns'
    ],
    gameInstructions: 'Architect a resilient microservices ecosystem that can handle massive scale and complex business requirements!',
    gameRules: [
      'Design services with proper boundaries',
      'Implement communication patterns (sync/async)',
      'Handle failures and maintain data consistency',
      'Scale services based on demand'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which pattern is best for handling distributed transactions across microservices?',
        options: [
          { id: 'a', text: 'Saga Pattern', isCorrect: true },
          { id: 'b', text: 'Two-Phase Commit', isCorrect: false },
          { id: 'c', text: 'Database per Service', isCorrect: false },
          { id: 'd', text: 'Event Sourcing', isCorrect: false }
        ],
        explanation: 'Saga pattern manages distributed transactions through compensating actions, ideal for microservices.',
        points: 200,
        timeLimit: 120,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Systems Architect',
        description: 'You design complex distributed systems!',
        icon: '🏗️',
        value: 500
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 60,
      hintsAllowed: 8,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: true,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.9, count: 67 }
  },

  {
    title: 'Advanced Algorithm Arena: Dynamic Programming Master',
    slug: 'advanced-algorithm-arena-dynamic-programming',
    description: 'Master complex algorithmic problems using dynamic programming and advanced optimization techniques!',
    gameType: 'code-golf',
    category: 'Algorithms',
    language: 'general',
    difficulty: 'expert',
    estimatedTime: 75,
    maxScore: 2500,
    passingScore: 1500,
    tags: ['algorithms', 'dynamic-programming', 'optimization', 'competitive-programming', 'complexity'],
    prerequisites: ['Advanced data structures', 'Algorithm complexity', 'Mathematical foundations'],
    learningObjectives: [
      'Master dynamic programming patterns',
      'Optimize complex algorithms',
      'Solve NP-hard problems with approximations',
      'Implement advanced data structures'
    ],
    gameInstructions: 'Compete in the ultimate algorithm arena by solving the most challenging computational problems!',
    gameRules: [
      'Solve problems with optimal time/space complexity',
      'Implement elegant and efficient solutions',
      'Handle large datasets and edge cases',
      'Compete for the shortest, most efficient code'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement the optimal solution for the 0-1 Knapsack problem using dynamic programming',
        description: 'Complete the DP solution that finds maximum value within weight capacity',
        codeSnippet: 'function knapsack(weights, values, capacity) {\n  const n = weights.length;\n  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));\n  \n  for (let i = 1; i <= n; i++) {\n    for (let w = 1; w <= capacity; w++) {\n      if (weights[i-1] <= w) {\n        dp[i][w] = Math.max(\n          values[i-1] + dp[___][___],\n          dp[___][___]\n        );\n      } else {\n        dp[i][w] = dp[___][___];\n      }\n    }\n  }\n  return dp[n][capacity];\n}',
        expectedOutput: 'i-1; w-weights[i-1]; i-1; w; i-1; w',
        explanation: 'DP builds solutions by considering whether to include each item, comparing with/without scenarios.',
        points: 300,
        timeLimit: 300,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Algorithm Grandmaster',
        description: 'You solve the most complex algorithmic challenges!',
        icon: '🧠',
        value: 750
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 75,
      hintsAllowed: 5,
      skipAllowed: false,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: true,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 45 }
  },

  {
    title: 'Concurrent Programming Chaos: Thread-Safe Systems',
    slug: 'concurrent-programming-chaos-thread-safe',
    description: 'Master the chaos of concurrent programming by building thread-safe, high-performance systems!',
    gameType: 'debug-detective',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'expert',
    estimatedTime: 80,
    maxScore: 2400,
    passingScore: 1440,
    tags: ['concurrency', 'threading', 'parallelism', 'synchronization', 'performance'],
    prerequisites: ['Multithreading basics', 'Java advanced', 'System design'],
    learningObjectives: [
      'Master thread synchronization techniques',
      'Implement lock-free data structures',
      'Handle race conditions and deadlocks',
      'Optimize concurrent performance'
    ],
    gameInstructions: 'Debug and optimize concurrent systems while avoiding race conditions, deadlocks, and performance bottlenecks!',
    gameRules: [
      'Fix concurrency bugs in complex systems',
      'Implement thread-safe data structures',
      'Optimize for maximum throughput',
      'Prevent deadlocks and race conditions'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-debug',
        question: 'Fix the race condition in this thread-safe counter implementation',
        description: 'The counter has a race condition - fix it using proper synchronization',
        codeSnippet: 'public class Counter {\n    private int count = 0;\n    \n    public void increment() {\n        count++;\n    }\n    \n    public int getCount() {\n        return count;\n    }\n}',
        expectedOutput: 'public class Counter {\n    private volatile int count = 0;\n    private final Object lock = new Object();\n    \n    public void increment() {\n        synchronized(lock) {\n            count++;\n        }\n    }\n    \n    public int getCount() {\n        synchronized(lock) {\n            return count;\n        }\n    }\n}',
        explanation: 'Use synchronization blocks and volatile keyword to ensure thread-safe access to shared state.',
        points: 280,
        timeLimit: 240,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Concurrency Master',
        description: 'You tame the chaos of concurrent programming!',
        icon: '⚡',
        value: 600
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 80,
      hintsAllowed: 6,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 52 }
  },

  {
    title: 'Cryptography Cipher Challenge: Security Protocol Design',
    slug: 'cryptography-cipher-challenge-security',
    description: 'Design and implement advanced cryptographic protocols to secure digital communications!',
    gameType: 'escape-room',
    category: 'Security',
    language: 'general',
    difficulty: 'expert',
    estimatedTime: 70,
    maxScore: 2300,
    passingScore: 1380,
    tags: ['cryptography', 'security', 'encryption', 'protocols', 'mathematics'],
    prerequisites: ['Advanced mathematics', 'Security fundamentals', 'Network protocols'],
    learningObjectives: [
      'Implement cryptographic algorithms',
      'Design secure communication protocols',
      'Understand cryptographic attacks',
      'Apply zero-knowledge proofs'
    ],
    gameInstructions: 'Escape the digital fortress by cracking codes and implementing unbreakable encryption schemes!',
    gameRules: [
      'Implement various encryption algorithms',
      'Design secure key exchange protocols',
      'Defend against cryptographic attacks',
      'Prove security properties mathematically'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement a simplified Diffie-Hellman key exchange',
        description: 'Complete the key exchange algorithm for secure communication',
        codeSnippet: 'function diffieHellman(p, g, privateA, privateB) {\n  // Public keys\n  const publicA = Math.pow(g, privateA) % p;\n  const publicB = Math.pow(g, privateB) % p;\n  \n  // Shared secrets\n  const sharedA = Math.pow(publicB, ___) % p;\n  const sharedB = Math.pow(publicA, ___) % p;\n  \n  return { sharedA, sharedB, areEqual: sharedA === sharedB };\n}',
        expectedOutput: 'privateA; privateB',
        explanation: "Each party uses their private key with the other's public key to derive the same shared secret.",
        points: 270,
        timeLimit: 200,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Cryptography Expert',
        description: 'You secure digital communications!',
        icon: '🔐',
        value: 650
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 70,
      hintsAllowed: 7,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.9, count: 38 }
  },

  {
    title: 'Machine Learning Production Pipeline: MLOps Excellence',
    slug: 'ml-production-pipeline-mlops',
    description: 'Build production-ready machine learning pipelines with automated training, deployment, and monitoring!',
    gameType: 'logic-labyrinth',
    category: 'Machine Learning',
    language: 'python',
    difficulty: 'expert',
    estimatedTime: 85,
    maxScore: 2600,
    passingScore: 1560,
    tags: ['mlops', 'machine-learning', 'pipelines', 'deployment', 'monitoring'],
    prerequisites: ['Advanced ML', 'Cloud platforms', 'DevOps', 'Data engineering'],
    learningObjectives: [
      'Design ML production pipelines',
      'Implement automated model training',
      'Deploy models at scale',
      'Monitor model performance in production'
    ],
    gameInstructions: 'Navigate the complex labyrinth of ML production by building end-to-end MLOps pipelines!',
    gameRules: [
      'Design scalable ML pipelines',
      'Implement automated model validation',
      'Deploy models with zero downtime',
      'Monitor and maintain model performance'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'sequence-order',
        question: 'Arrange the MLOps pipeline stages in the correct order for production deployment',
        description: 'Put these ML pipeline components in the proper sequence',
        options: [
          { id: '1', text: 'Data Ingestion & Validation', isCorrect: true },
          { id: '2', text: 'Feature Engineering', isCorrect: true },
          { id: '3', text: 'Model Training & Validation', isCorrect: true },
          { id: '4', text: 'Model Testing & A/B Testing', isCorrect: true },
          { id: '5', text: 'Model Deployment', isCorrect: true },
          { id: '6', text: 'Model Monitoring & Feedback', isCorrect: true }
        ],
        explanation: 'MLOps pipelines follow a structured flow from data to production deployment with continuous monitoring.',
        points: 290,
        timeLimit: 180,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'MLOps Engineer',
        description: 'You productionize machine learning systems!',
        icon: '🚀',
        value: 700
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 85,
      hintsAllowed: 8,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 41 }
  },

  {
    title: 'Quantum Computing Quest: Algorithm Implementation',
    slug: 'quantum-computing-quest-algorithms',
    description: 'Explore the quantum realm by implementing quantum algorithms and understanding quantum computing principles!',
    gameType: 'escape-room',
    category: 'Algorithms',
    language: 'python',
    difficulty: 'expert',
    estimatedTime: 90,
    maxScore: 2800,
    passingScore: 1680,
    tags: ['quantum-computing', 'quantum-algorithms', 'qubits', 'superposition', 'entanglement'],
    prerequisites: ['Advanced mathematics', 'Linear algebra', 'Physics fundamentals', 'Python'],
    learningObjectives: [
      'Understand quantum computing principles',
      'Implement quantum algorithms',
      'Work with quantum gates and circuits',
      'Explore quantum advantage applications'
    ],
    gameInstructions: 'Escape the classical computing limitations by mastering quantum algorithms and harnessing quantum advantage!',
    gameRules: [
      'Implement quantum algorithms correctly',
      'Understand quantum state manipulation',
      'Solve problems using quantum advantage',
      'Handle quantum decoherence and error correction'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement a basic quantum teleportation circuit',
        description: 'Complete the quantum teleportation protocol using quantum gates',
        codeSnippet: "from qiskit import QuantumCircuit\n\ndef quantum_teleportation():\n    qc = QuantumCircuit(3, 3)\n    \n    # Create Bell pair between qubits 1 and 2\n    qc.h(1)\n    qc.cx(1, 2)\n    \n    # Alice's operations\n    qc.cx(0, 1)\n    qc.h(0)\n    \n    # Measure Alice's qubits\n    qc.measure(0, 0)\n    qc.measure(1, 1)\n    \n    # Bob's corrections based on measurements\n    qc.cx(1, 2)\n    qc._____(0, 2)  # Conditional Z gate\n    \n    return qc",
        expectedOutput: 'cz',
        explanation: 'Quantum teleportation requires conditional operations based on classical measurement results.',
        points: 350,
        timeLimit: 300,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Quantum Pioneer',
        description: 'You explore the quantum computing frontier!',
        icon: '⚛️',
        value: 800
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 90,
      hintsAllowed: 10,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.9, count: 23 }
  },

  {
    title: 'Blockchain Protocol Architect: Decentralized Systems',
    slug: 'blockchain-protocol-architect-decentralized',
    description: 'Architect secure blockchain protocols and implement decentralized consensus mechanisms!',
    gameType: 'tower-defense',
    category: 'Security',
    language: 'general',
    difficulty: 'expert',
    estimatedTime: 95,
    maxScore: 2700,
    passingScore: 1620,
    tags: ['blockchain', 'consensus', 'cryptography', 'decentralized', 'smart-contracts'],
    prerequisites: ['Cryptography', 'Distributed systems', 'Network protocols', 'Mathematics'],
    learningObjectives: [
      'Design blockchain consensus protocols',
      'Implement proof-of-work and proof-of-stake',
      'Create secure smart contracts',
      'Build decentralized applications'
    ],
    gameInstructions: 'Defend the decentralized network by implementing robust consensus protocols and securing blockchain systems!',
    gameRules: [
      'Design consensus algorithms for different scenarios',
      'Implement attack-resistant protocols',
      'Optimize for security and performance',
      'Handle network partitions and Byzantine faults'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'multiple-choice',
        question: 'Which consensus mechanism is most energy-efficient for a permissioned blockchain network?',
        options: [
          { id: 'a', text: 'Practical Byzantine Fault Tolerance (pBFT)', isCorrect: true },
          { id: 'b', text: 'Proof of Work (PoW)', isCorrect: false },
          { id: 'c', text: 'Proof of Stake (PoS)', isCorrect: false },
          { id: 'd', text: 'Delegated Proof of Stake (DPoS)', isCorrect: false }
        ],
        explanation: "pBFT is designed for permissioned networks and doesn't require energy-intensive mining.",
        points: 320,
        timeLimit: 150,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Blockchain Architect',
        description: 'You build decentralized systems!',
        icon: '⛓️',
        value: 750
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 95,
      hintsAllowed: 8,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: true,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 34 }
  },

  {
    title: 'Compiler Construction Challenge: Language Design',
    slug: 'compiler-construction-challenge-language',
    description: 'Design and implement a complete compiler for a custom programming language!',
    gameType: 'code-builder',
    category: 'Programming Fundamentals',
    language: 'cpp',
    difficulty: 'expert',
    estimatedTime: 120,
    maxScore: 3000,
    passingScore: 1800,
    tags: ['compilers', 'language-design', 'parsing', 'code-generation', 'optimization'],
    prerequisites: ['Advanced C++', 'Formal languages', 'Data structures', 'Computer architecture'],
    learningObjectives: [
      'Design programming language syntax',
      'Implement lexical and syntax analysis',
      'Generate intermediate and machine code',
      'Optimize compiler performance'
    ],
    gameInstructions: 'Build a complete compiler from scratch, designing your own programming language and implementing all compilation phases!',
    gameRules: [
      'Design a coherent language syntax',
      'Implement all compiler phases correctly',
      'Generate efficient target code',
      'Handle error recovery and optimization'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement a recursive descent parser for arithmetic expressions',
        description: 'Complete the parser that handles operator precedence correctly',
        codeSnippet: 'class Parser {\n    Token currentToken;\n    \n    Expr parseExpression() {\n        Expr left = parseTerm();\n        while (currentToken.type == PLUS || currentToken.type == MINUS) {\n            TokenType op = currentToken.type;\n            advance();\n            Expr right = ___();\n            left = new BinaryExpr(left, op, right);\n        }\n        return left;\n    }\n    \n    Expr parseTerm() {\n        Expr left = parseFactor();\n        while (currentToken.type == MULTIPLY || currentToken.type == DIVIDE) {\n            TokenType op = currentToken.type;\n            advance();\n            Expr right = ___();\n            left = new BinaryExpr(left, op, right);\n        }\n        return left;\n    }\n}',
        expectedOutput: 'parseTerm; parseFactor',
        explanation: 'Recursive descent parsing respects operator precedence by calling appropriate parsing methods.',
        points: 400,
        timeLimit: 360,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Language Creator',
        description: 'You create programming languages!',
        icon: '🔨',
        value: 1000
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 120,
      hintsAllowed: 10,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.9, count: 18 }
  },

  {
    title: 'High-Performance Computing: Parallel Algorithm Optimization',
    slug: 'hpc-parallel-algorithm-optimization',
    description: 'Optimize algorithms for massively parallel systems using advanced HPC techniques!',
    gameType: 'speed-coder',
    category: 'Programming Fundamentals',
    language: 'cpp',
    difficulty: 'expert',
    estimatedTime: 100,
    maxScore: 2900,
    passingScore: 1740,
    tags: ['hpc', 'parallel-computing', 'optimization', 'cuda', 'openmp'],
    prerequisites: ['Advanced C++', 'Computer architecture', 'Parallel programming', 'Linear algebra'],
    learningObjectives: [
      'Optimize algorithms for parallel execution',
      'Implement GPU computing with CUDA',
      'Use vectorization and SIMD instructions',
      'Achieve maximum computational throughput'
    ],
    gameInstructions: 'Race against time to optimize computational algorithms for supercomputer-level performance!',
    gameRules: [
      'Optimize algorithms for maximum parallelism',
      'Minimize memory access bottlenecks',
      'Achieve target performance benchmarks',
      'Scale efficiently across multiple cores/GPUs'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Optimize this matrix multiplication for parallel execution using OpenMP',
        description: 'Add OpenMP directives to parallelize the matrix multiplication efficiently',
        codeSnippet: 'void matrixMultiply(float** A, float** B, float** C, int n) {\n    ___\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            float sum = 0.0;\n            for (int k = 0; k < n; k++) {\n                sum += A[i][k] * B[k][j];\n            }\n            C[i][j] = sum;\n        }\n    }\n}',
        expectedOutput: '#pragma omp parallel for collapse(2)',
        explanation: 'OpenMP parallel for with collapse directive parallelizes nested loops for better CPU utilization.',
        points: 380,
        timeLimit: 300,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'HPC Specialist',
        description: 'You optimize for supercomputer performance!',
        icon: '💻',
        value: 900
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 100,
      hintsAllowed: 7,
      skipAllowed: false,
      randomizeQuestions: true,
      showProgress: true,
      allowRetry: true,
      multiplayer: true,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.7, count: 28 }
  },

  {
    title: 'Advanced AI Systems: Neural Architecture Search',
    slug: 'advanced-ai-neural-architecture-search',
    description: 'Design cutting-edge neural network architectures using automated search and optimization techniques!',
    gameType: 'logic-labyrinth',
    category: 'Machine Learning',
    language: 'python',
    difficulty: 'expert',
    estimatedTime: 110,
    maxScore: 3200,
    passingScore: 1920,
    tags: ['neural-networks', 'deep-learning', 'architecture-search', 'automl', 'optimization'],
    prerequisites: ['Deep learning', 'PyTorch/TensorFlow', 'Optimization theory', 'Research experience'],
    learningObjectives: [
      'Design novel neural architectures',
      'Implement neural architecture search',
      'Optimize model efficiency and accuracy',
      'Apply cutting-edge AI research'
    ],
    gameInstructions: 'Navigate the labyrinth of AI research by designing breakthrough neural architectures that push the boundaries of machine learning!',
    gameRules: [
      'Design architectures that balance accuracy and efficiency',
      'Implement automated architecture search',
      'Optimize for specific hardware constraints',
      'Achieve state-of-the-art performance benchmarks'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement a differentiable neural architecture search cell',
        description: 'Complete the DARTS-style searchable cell with mixed operations',
        codeSnippet: 'class SearchCell(nn.Module):\n    def __init__(self, input_dim, output_dim):\n        super().__init__()\n        self.operations = nn.ModuleList([\n            nn.Conv2d(input_dim, output_dim, 3, padding=1),\n            nn.Conv2d(input_dim, output_dim, 5, padding=2),\n            nn.MaxPool2d(3, stride=1, padding=1),\n            nn.Identity()\n        ])\n        self.alphas = nn.Parameter(torch.randn(len(self.operations)))\n    \n    def forward(self, x):\n        weights = F._____(self.alphas, dim=0)\n        output = sum(w * op(x) for w, op in zip(weights, self.operations))\n        return output',
        expectedOutput: 'softmax',
        explanation: 'DARTS uses softmax to create differentiable architecture weights for gradient-based optimization.',
        points: 450,
        timeLimit: 400,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'AI Researcher',
        description: 'You advance the frontiers of artificial intelligence!',
        icon: '🧬',
        value: 1200
      }
    ],
    gameSettings: {
      livesCount: 4,
      timeLimit: 110,
      hintsAllowed: 12,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.9, count: 15 }
  },

  {
    title: 'Database Internals Architect: Storage Engine Design',
    slug: 'database-internals-storage-engine',
    description: 'Design and implement a complete database storage engine with advanced indexing and transaction support!',
    gameType: 'code-builder',
    category: 'Database',
    language: 'cpp',
    difficulty: 'expert',
    estimatedTime: 130,
    maxScore: 3500,
    passingScore: 2100,
    tags: ['database-internals', 'storage-engines', 'indexing', 'transactions', 'acid'],
    prerequisites: ['Advanced data structures', 'File systems', 'Concurrency', 'Database theory'],
    learningObjectives: [
      'Implement B+ tree indexing structures',
      'Design transaction management systems',
      'Optimize storage and retrieval performance',
      'Ensure ACID compliance'
    ],
    gameInstructions: 'Build a production-quality database storage engine from the ground up, implementing all core database internals!',
    gameRules: [
      'Implement efficient storage structures',
      'Ensure ACID transaction properties',
      'Optimize for concurrent access',
      'Handle crash recovery correctly'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-completion',
        question: 'Implement B+ tree node splitting for database indexing',
        description: 'Complete the node split operation that maintains B+ tree properties',
        codeSnippet: 'class BPlusNode {\n    void split(BPlusNode* parent, int index) {\n        BPlusNode* newNode = new BPlusNode(isLeaf);\n        int mid = (maxKeys + 1) / 2;\n        \n        // Move half the keys to new node\n        for (int i = mid; i < numKeys; i++) {\n            newNode->keys[i - mid] = keys[i];\n            if (!isLeaf) {\n                newNode->children[i - mid] = children[i];\n            }\n        }\n        \n        if (isLeaf) {\n            newNode->next = this->next;\n            this->next = newNode;\n        }\n        \n        numKeys = mid;\n        newNode->numKeys = maxKeys - mid;\n        \n        // Promote middle key to parent\n        parent->insertKey(___[___], newNode);\n    }\n};',
        expectedOutput: 'keys; mid',
        explanation: 'B+ tree splitting promotes the middle key to the parent while maintaining sorted order.',
        points: 500,
        timeLimit: 480,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Database Architect',
        description: 'You build the foundation of data systems!',
        icon: '🗃️',
        value: 1500
      }
    ],
    gameSettings: {
      livesCount: 5,
      timeLimit: 130,
      hintsAllowed: 15,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.8, count: 12 }
  },

  {
    title: 'Operating System Kernel: System Programming Mastery',
    slug: 'operating-system-kernel-programming',
    description: 'Implement core operating system components including schedulers, memory management, and file systems!',
    gameType: 'debug-detective',
    category: 'Programming Fundamentals',
    language: 'c',
    difficulty: 'expert',
    estimatedTime: 150,
    maxScore: 4000,
    passingScore: 2400,
    tags: ['operating-systems', 'kernel', 'system-programming', 'memory-management', 'scheduling'],
    prerequisites: ['Advanced C', 'Computer architecture', 'Assembly language', 'Operating systems theory'],
    learningObjectives: [
      'Implement process scheduling algorithms',
      'Design memory management systems',
      'Create file system implementations',
      'Handle hardware interrupts and system calls'
    ],
    gameInstructions: 'Debug and implement critical operating system components while maintaining system stability and performance!',
    gameRules: [
      'Implement kernel components without causing crashes',
      'Ensure thread safety in critical sections',
      'Optimize for system performance',
      'Handle all edge cases and error conditions'
    ],
    challenges: [
      {
        challengeId: generateChallengeId(),
        type: 'code-debug',
        question: 'Fix the race condition in this kernel scheduler implementation',
        description: 'The scheduler has a critical race condition that causes system instability',
        codeSnippet: 'void schedule() {\n    struct task_struct *prev = current;\n    struct task_struct *next = NULL;\n    \n    // Find next runnable task\n    list_for_each_entry(next, &runqueue, list) {\n        if (next->state == TASK_RUNNING) {\n            break;\n        }\n    }\n    \n    if (next && next != prev) {\n        current = next;\n        context_switch(prev, next);\n    }\n}',
        expectedOutput: 'void schedule() {\n    unsigned long flags;\n    struct task_struct *prev = current;\n    struct task_struct *next = NULL;\n    \n    spin_lock_irqsave(&runqueue_lock, flags);\n    \n    // Find next runnable task\n    list_for_each_entry(next, &runqueue, list) {\n        if (next->state == TASK_RUNNING) {\n            break;\n        }\n    }\n    \n    if (next && next != prev) {\n        current = next;\n        context_switch(prev, next);\n    }\n    \n    spin_unlock_irqrestore(&runqueue_lock, flags);\n}',
        explanation: 'Kernel schedulers must disable interrupts and use spinlocks to protect critical sections.',
        points: 600,
        timeLimit: 600,
        difficulty: 'hard'
      }
    ],
    rewards: [
      {
        type: 'badge',
        name: 'Kernel Hacker',
        description: 'You master the deepest levels of system programming!',
        icon: '⚙️',
        value: 2000
      },
      {
        type: 'certificate',
        name: 'Expert System Programmer',
        description: 'Certified expert in operating system internals',
        value: 5000
      }
    ],
    gameSettings: {
      livesCount: 3,
      timeLimit: 150,
      hintsAllowed: 10,
      skipAllowed: true,
      randomizeQuestions: false,
      showProgress: true,
      allowRetry: true,
      multiplayer: false,
      leaderboard: true
    },
    author: {
      name: 'Seek Learning Team',
      bio: 'Passionate educators creating engaging learning experiences'
    },
    rating: { average: 4.9, count: 8 }
  }
];

// Function to seed the database
async function seedLearningGames() {
  try {
    console.log('🎮 Starting learning games seeding...');
    console.log(`🕹️ Preparing to seed ${learningGames.length} learning games`);

    // Clear existing games
    await LearningGame.deleteMany({});
    console.log('🧹 Cleared existing learning games');

    // Insert new games in batches for better performance
    const batchSize = 20;
    let insertedCount = 0;

    for (let i = 0; i < learningGames.length; i += batchSize) {
      const batch = learningGames.slice(i, i + batchSize);
      await LearningGame.insertMany(batch);
      insertedCount += batch.length;
      console.log(`✅ Inserted batch: ${insertedCount}/${learningGames.length} games`);
    }

    // Generate summary statistics
    const gamesByDifficulty = {};
    const gamesByCategory = {};
    const gamesByLanguage = {};
    const gamesByType = {};

    learningGames.forEach((game) => {
      // Count by difficulty
      gamesByDifficulty[game.difficulty] = (gamesByDifficulty[game.difficulty] || 0) + 1;

      // Count by category
      gamesByCategory[game.category] = (gamesByCategory[game.category] || 0) + 1;

      // Count by language
      gamesByLanguage[game.language] = (gamesByLanguage[game.language] || 0) + 1;

      // Count by game type
      gamesByType[game.gameType] = (gamesByType[game.gameType] || 0) + 1;
    });

    console.log('\n🎯 === LEARNING GAMES SEEDING COMPLETE ===');
    console.log(`🎮 Total games: ${insertedCount}`);

    console.log('\n📊 Games by Difficulty:');
    Object.entries(gamesByDifficulty)
      .sort(([, a], [, b]) => b - a)
      .forEach(([difficulty, count]) => {
        const emoji = {
          beginner: '🟢',
          intermediate: '🟡',
          advanced: '🟠',
          expert: '🔴'
        };
        console.log(`   ${emoji[difficulty] || '⚪'} ${difficulty}: ${count} games`);
      });

    console.log('\n🏷️ Games by Category:');
    Object.entries(gamesByCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   📚 ${category}: ${count} games`);
      });

    console.log('\n💻 Games by Language:');
    Object.entries(gamesByLanguage)
      .sort(([, a], [, b]) => b - a)
      .forEach(([language, count]) => {
        console.log(`   🔤 ${language}: ${count} games`);
      });

    console.log('\n🎲 Games by Type:');
    Object.entries(gamesByType)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   🎯 ${type}: ${count} games`);
      });

    console.log('\n🏆 Difficulty Distribution:');
    const beginnerCount = gamesByDifficulty.beginner || 0;
    const intermediateCount = gamesByDifficulty.intermediate || 0;
    const advancedCount = gamesByDifficulty.advanced || 0;
    const expertCount = gamesByDifficulty.expert || 0;

    console.log(`   🟢 Beginner: ${beginnerCount} games (${(beginnerCount / insertedCount * 100).toFixed(1)}%)`);
    console.log(`   🟡 Intermediate: ${intermediateCount} games (${(intermediateCount / insertedCount * 100).toFixed(1)}%)`);
    console.log(`   🟠 Advanced: ${advancedCount} games (${(advancedCount / insertedCount * 100).toFixed(1)}%)`);
    console.log(`   🔴 Expert: ${expertCount} games (${(expertCount / insertedCount * 100).toFixed(1)}%)`);

    console.log('\n🎉 Learning games seeding completed successfully!');
    console.log('🚀 Your platform now features comprehensive gamified learning experiences!');
    console.log('🏅 Students can now enjoy learning through engaging, interactive games!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding learning games:', error);
    process.exit(1);
  }
}

// Run the seed function
seedLearningGames();
