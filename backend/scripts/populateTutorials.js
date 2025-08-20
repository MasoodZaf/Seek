const { connectSQLite } = require('../config/sqlite');
const { Tutorial, User } = require('../models');
const logger = require('../config/logger');

const createTutorials = async () => {
  try {
    // Connect to database
    await connectSQLite();

    // Get admin user to be the author
    const adminUser = await User.findOne({ where: { email: 'admin@seek.com' } });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    const tutorials = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the core concepts of JavaScript programming including variables, functions, objects, and control flow. Perfect for beginners starting their coding journey.',
        language: 'javascript',
        category: 'fundamentals',
        difficulty: 'beginner',
        tags: ['variables', 'functions', 'objects', 'basics'],
        prerequisites: [],
        authorId: adminUser.id,
        isPublished: true,
        lessons: [
          {
            id: 1,
            title: 'Variables and Data Types',
            description: 'Learn about JavaScript variables and data types',
            estimatedTime: 20,
            content: 'Variables are containers for storing data...',
            exercises: [
              {
                question: "Create a variable named 'age' with your age",
                startingCode: '// Create your variable here\n',
                solution: 'let age = 25;'
              }
            ]
          },
          {
            id: 2,
            title: 'Functions',
            description: 'Understanding JavaScript functions',
            estimatedTime: 25,
            content: 'Functions are reusable blocks of code...',
            exercises: [
              {
                question: 'Create a function that greets a person',
                startingCode: '// Create a greeting function\n',
                solution: 'function greet(name) {\n  return `Hello, ${name}!`;\n}'
              }
            ]
          },
          {
            id: 3,
            title: 'Objects and Arrays',
            description: 'Working with objects and arrays in JavaScript',
            estimatedTime: 30,
            content: 'Objects and arrays are fundamental data structures...',
            exercises: [
              {
                question: 'Create an object representing a book',
                startingCode: '// Create a book object\n',
                solution: "const book = {\n  title: 'JavaScript Guide',\n  author: 'John Doe',\n  pages: 300\n};"
              }
            ]
          }
        ],
        stats: {
          enrollments: 156,
          completions: 89,
          averageRating: 4.7,
          totalRatings: 45
        }
      },

      {
        title: 'Python for Beginners',
        description: 'Start your Python programming journey with this comprehensive beginner course covering syntax, data structures, and basic programming concepts.',
        language: 'python',
        category: 'fundamentals',
        difficulty: 'beginner',
        tags: ['python', 'syntax', 'basics', 'programming'],
        prerequisites: [],
        authorId: adminUser.id,
        isPublished: true,
        lessons: [
          {
            id: 1,
            title: 'Python Syntax Basics',
            description: "Learn Python's clean and readable syntax",
            estimatedTime: 25,
            content: 'Python is known for its clean, readable syntax...',
            exercises: [
              {
                question: 'Create a variable and print it',
                startingCode: '# Write your code here\n',
                solution: "message = 'Hello, Python!'\nprint(message)"
              }
            ]
          },
          {
            id: 2,
            title: 'Lists and Dictionaries',
            description: "Working with Python's built-in data structures",
            estimatedTime: 30,
            content: 'Lists and dictionaries are essential Python data structures...',
            exercises: [
              {
                question: 'Create a list of fruits and iterate through it',
                startingCode: '# Create and iterate through a list\n',
                solution: "fruits = ['apple', 'banana', 'orange']\nfor fruit in fruits:\n    print(fruit)"
              }
            ]
          }
        ],
        stats: {
          enrollments: 203,
          completions: 127,
          averageRating: 4.5,
          totalRatings: 67
        }
      },

      {
        title: 'Data Structures in JavaScript',
        description: 'Master essential data structures like arrays, objects, sets, and maps in JavaScript. Learn when and how to use each effectively.',
        language: 'javascript',
        category: 'data-structures',
        difficulty: 'intermediate',
        tags: ['arrays', 'objects', 'sets', 'maps', 'data-structures'],
        prerequisites: ['JavaScript Fundamentals'],
        authorId: adminUser.id,
        isPublished: true,
        lessons: [
          {
            id: 1,
            title: 'Arrays Deep Dive',
            description: 'Advanced array methods and techniques',
            estimatedTime: 35,
            content: 'Arrays are one of the most important data structures...',
            exercises: [
              {
                question: 'Use map, filter, and reduce to process an array',
                startingCode: 'const numbers = [1, 2, 3, 4, 5];\n// Process the array\n',
                solution: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);\nconst sum = numbers.reduce((acc, n) => acc + n, 0);'
              }
            ]
          },
          {
            id: 2,
            title: 'Sets and Maps',
            description: 'Modern JavaScript collections',
            estimatedTime: 30,
            content: 'Sets and Maps provide powerful collection capabilities...',
            exercises: [
              {
                question: 'Remove duplicates from an array using Set',
                startingCode: 'const arr = [1, 2, 2, 3, 3, 4];\n// Remove duplicates\n',
                solution: 'const arr = [1, 2, 2, 3, 3, 4];\nconst unique = [...new Set(arr)];'
              }
            ]
          }
        ],
        stats: {
          enrollments: 89,
          completions: 45,
          averageRating: 4.8,
          totalRatings: 23
        }
      },

      {
        title: 'Algorithm Fundamentals',
        description: 'Learn essential algorithms including sorting, searching, and basic problem-solving techniques. Build a strong foundation for technical interviews.',
        language: 'javascript',
        category: 'algorithms',
        difficulty: 'intermediate',
        tags: ['algorithms', 'sorting', 'searching', 'problem-solving'],
        prerequisites: ['JavaScript Fundamentals', 'Data Structures in JavaScript'],
        authorId: adminUser.id,
        isPublished: true,
        lessons: [
          {
            id: 1,
            title: 'Sorting Algorithms',
            description: 'Bubble sort, selection sort, and quick sort',
            estimatedTime: 40,
            content: 'Sorting is one of the most fundamental algorithmic problems...',
            exercises: [
              {
                question: 'Implement bubble sort algorithm',
                startingCode: 'function bubbleSort(arr) {\n  // Your implementation here\n}\n',
                solution: 'function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}'
              }
            ]
          },
          {
            id: 2,
            title: 'Binary Search',
            description: 'Efficient searching in sorted arrays',
            estimatedTime: 35,
            content: 'Binary search is an efficient algorithm for searching sorted arrays...',
            exercises: [
              {
                question: 'Implement binary search',
                startingCode: 'function binarySearch(arr, target) {\n  // Your implementation here\n}\n',
                solution: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}'
              }
            ]
          }
        ],
        stats: {
          enrollments: 67,
          completions: 31,
          averageRating: 4.6,
          totalRatings: 18
        }
      },

      {
        title: 'Web Development with JavaScript',
        description: 'Build dynamic web applications using vanilla JavaScript. Learn DOM manipulation, event handling, and modern web development practices.',
        language: 'javascript',
        category: 'web-development',
        difficulty: 'intermediate',
        tags: ['dom', 'events', 'web', 'frontend'],
        prerequisites: ['JavaScript Fundamentals'],
        authorId: adminUser.id,
        isPublished: true,
        lessons: [
          {
            id: 1,
            title: 'DOM Manipulation',
            description: 'Select and modify HTML elements with JavaScript',
            estimatedTime: 30,
            content: 'The DOM (Document Object Model) represents your HTML as JavaScript objects...',
            exercises: [
              {
                question: 'Change the text content of an element',
                startingCode: '// Select an element and change its text\n',
                solution: "const element = document.getElementById('myElement');\nelement.textContent = 'Hello, World!';"
              }
            ]
          },
          {
            id: 2,
            title: 'Event Handling',
            description: 'Respond to user interactions',
            estimatedTime: 35,
            content: 'Events allow your web page to respond to user interactions...',
            exercises: [
              {
                question: 'Add a click event listener to a button',
                startingCode: '// Add event listener to button\n',
                solution: "const button = document.getElementById('myButton');\nbutton.addEventListener('click', function() {\n  alert('Button clicked!');\n});"
              }
            ]
          }
        ],
        stats: {
          enrollments: 145,
          completions: 78,
          averageRating: 4.4,
          totalRatings: 34
        }
      },

      {
        title: 'TypeScript Essentials',
        description: 'Learn TypeScript to add static typing to your JavaScript projects. Understand interfaces, generics, and advanced TypeScript features.',
        language: 'typescript',
        category: 'fundamentals',
        difficulty: 'intermediate',
        tags: ['typescript', 'types', 'interfaces', 'generics'],
        prerequisites: ['JavaScript Fundamentals'],
        authorId: adminUser.id,
        isPublished: true,
        lessons: [
          {
            id: 1,
            title: 'Basic Types',
            description: "Understanding TypeScript's type system",
            estimatedTime: 25,
            content: 'TypeScript adds static type checking to JavaScript...',
            exercises: [
              {
                question: 'Create a function with typed parameters',
                startingCode: '// Create a typed function\n',
                solution: 'function greet(name: string, age: number): string {\n  return `Hello ${name}, you are ${age} years old.`;\n}'
              }
            ]
          },
          {
            id: 2,
            title: 'Interfaces',
            description: 'Defining object shapes with interfaces',
            estimatedTime: 30,
            content: 'Interfaces define the structure of objects in TypeScript...',
            exercises: [
              {
                question: 'Define an interface for a User object',
                startingCode: '// Define User interface\n',
                solution: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n}'
              }
            ]
          }
        ],
        stats: {
          enrollments: 112,
          completions: 67,
          averageRating: 4.7,
          totalRatings: 29
        }
      }
    ];

    // Check if tutorials already exist
    const existingTutorials = await Tutorial.count();
    if (existingTutorials > 0) {
      logger.info(`Found ${existingTutorials} existing tutorials, skipping creation`);
      return;
    }

    // Create tutorials
    for (const tutorialData of tutorials) {
      await Tutorial.create(tutorialData);
      logger.info(`✅ Created tutorial: ${tutorialData.title}`);
    }

    logger.info('🎉 All tutorials created successfully!');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error creating tutorials:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  createTutorials();
}

module.exports = { createTutorials };
