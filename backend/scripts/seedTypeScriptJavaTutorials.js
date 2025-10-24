require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

const typeScriptTutorials = [
  {
    title: 'TypeScript Fundamentals: Getting Started',
    slug: 'typescript-fundamentals',
    description: 'Learn TypeScript basics including types, interfaces, and type annotations for safer JavaScript development.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'beginner',
    estimatedTime: 45,
    tags: ['typescript', 'basics', 'types', 'fundamentals'],
    prerequisites: ['Basic JavaScript knowledge'],
    learningObjectives: [
      'Understand TypeScript type system',
      'Write type-safe code with interfaces',
      'Use type annotations effectively',
      'Configure TypeScript compiler'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.8, count: 245 },
    stats: { views: 4520, completions: 2340, likes: 456 }
  },
  {
    title: 'Advanced TypeScript: Generics and Utility Types',
    slug: 'typescript-generics-utility-types',
    description: 'Master TypeScript generics, utility types, and advanced type manipulation for building robust applications.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'advanced',
    estimatedTime: 60,
    tags: ['typescript', 'generics', 'utility types', 'advanced'],
    prerequisites: ['TypeScript Fundamentals', 'JavaScript ES6+'],
    learningObjectives: [
      'Create reusable generic components',
      'Use built-in utility types effectively',
      'Build custom utility types',
      'Implement conditional types'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.7, count: 189 },
    stats: { views: 3210, completions: 1450, likes: 312 }
  },
  {
    title: 'TypeScript with React: Type-Safe Components',
    slug: 'typescript-react-components',
    description: 'Build type-safe React applications with TypeScript, including props typing, hooks, and state management.',
    category: 'Web Development',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 55,
    tags: ['typescript', 'react', 'components', 'hooks'],
    prerequisites: ['TypeScript Fundamentals', 'React Basics'],
    learningObjectives: [
      'Type React components and props',
      'Use TypeScript with React hooks',
      'Implement type-safe event handlers',
      'Type context and state management'
    ],
    author: {
      name: 'React TypeScript Pro',
      bio: 'Full-stack developer specializing in React and TypeScript',
      email: ''
    },
    rating: { average: 4.9, count: 312 },
    stats: { views: 5890, completions: 3120, likes: 678 }
  },
  {
    title: 'TypeScript Decorators and Metadata',
    slug: 'typescript-decorators-metadata',
    description: 'Learn TypeScript decorators for classes, methods, and properties to add metadata and behavior.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'advanced',
    estimatedTime: 50,
    tags: ['typescript', 'decorators', 'metadata', 'advanced'],
    prerequisites: ['Advanced TypeScript knowledge', 'OOP concepts'],
    learningObjectives: [
      'Understand decorator pattern',
      'Create custom decorators',
      'Use reflect-metadata',
      'Apply decorators in real projects'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.6, count: 156 },
    stats: { views: 2780, completions: 1230, likes: 234 }
  },
  {
    title: 'TypeScript Modules and Namespaces',
    slug: 'typescript-modules-namespaces',
    description: 'Organize TypeScript code with modules, namespaces, and understand module resolution strategies.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 40,
    tags: ['typescript', 'modules', 'namespaces', 'organization'],
    prerequisites: ['TypeScript Fundamentals'],
    learningObjectives: [
      'Use ES6 modules in TypeScript',
      'Understand module resolution',
      'Work with namespaces',
      'Configure module settings'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.7, count: 198 },
    stats: { views: 3450, completions: 1890, likes: 389 }
  },
  {
    title: 'TypeScript Type Guards and Narrowing',
    slug: 'typescript-type-guards-narrowing',
    description: 'Master type guards, type predicates, and control flow analysis for safer TypeScript code.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['typescript', 'type guards', 'narrowing', 'safety'],
    prerequisites: ['TypeScript Fundamentals'],
    learningObjectives: [
      'Implement type guards effectively',
      'Use typeof and instanceof checks',
      'Create custom type predicates',
      'Understand discriminated unions'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.8, count: 221 },
    stats: { views: 3980, completions: 2100, likes: 445 }
  },
  {
    title: 'TypeScript with Node.js and Express',
    slug: 'typescript-nodejs-express',
    description: 'Build type-safe backend applications with TypeScript, Node.js, and Express framework.',
    category: 'Web Development',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 65,
    tags: ['typescript', 'nodejs', 'express', 'backend'],
    prerequisites: ['TypeScript Fundamentals', 'Node.js Basics'],
    learningObjectives: [
      'Set up TypeScript with Express',
      'Type request and response objects',
      'Implement type-safe middleware',
      'Build REST APIs with TypeScript'
    ],
    author: {
      name: 'Backend TypeScript Pro',
      bio: 'Backend developer specializing in TypeScript and Node.js',
      email: ''
    },
    rating: { average: 4.8, count: 267 },
    stats: { views: 4560, completions: 2340, likes: 512 }
  },
  {
    title: 'TypeScript Enums and Literal Types',
    slug: 'typescript-enums-literals',
    description: 'Learn to use enums and literal types for creating more expressive and type-safe code.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'beginner',
    estimatedTime: 35,
    tags: ['typescript', 'enums', 'literal types', 'basics'],
    prerequisites: ['TypeScript Fundamentals'],
    learningObjectives: [
      'Use numeric and string enums',
      'Understand literal types',
      'Create union types with literals',
      'Choose between enums and literals'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.7, count: 203 },
    stats: { views: 3670, completions: 1980, likes: 398 }
  },
  {
    title: 'TypeScript Classes and Inheritance',
    slug: 'typescript-classes-inheritance',
    description: 'Master object-oriented programming in TypeScript with classes, inheritance, and access modifiers.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 50,
    tags: ['typescript', 'oop', 'classes', 'inheritance'],
    prerequisites: ['TypeScript Fundamentals', 'OOP Basics'],
    learningObjectives: [
      'Create and use TypeScript classes',
      'Implement inheritance and polymorphism',
      'Use access modifiers effectively',
      'Work with abstract classes'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.7, count: 234 },
    stats: { views: 4120, completions: 2230, likes: 467 }
  },
  {
    title: 'TypeScript Async/Await and Promises',
    slug: 'typescript-async-await-promises',
    description: 'Handle asynchronous operations in TypeScript with promises, async/await, and proper error handling.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['typescript', 'async', 'promises', 'error handling'],
    prerequisites: ['TypeScript Fundamentals', 'JavaScript Async'],
    learningObjectives: [
      'Type promises and async functions',
      'Handle async errors properly',
      'Use Promise utility types',
      'Implement async patterns'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.8, count: 256 },
    stats: { views: 4890, completions: 2560, likes: 523 }
  },
  {
    title: 'TypeScript Configuration and Compiler Options',
    slug: 'typescript-config-compiler',
    description: 'Configure TypeScript projects with tsconfig.json and understand compiler options for optimal development.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 40,
    tags: ['typescript', 'configuration', 'tsconfig', 'compiler'],
    prerequisites: ['TypeScript Fundamentals'],
    learningObjectives: [
      'Configure tsconfig.json effectively',
      'Understand compiler options',
      'Set up project references',
      'Optimize build settings'
    ],
    author: {
      name: 'TypeScript Expert',
      bio: 'Senior TypeScript developer and educator',
      email: ''
    },
    rating: { average: 4.6, count: 187 },
    stats: { views: 3340, completions: 1760, likes: 345 }
  },
  {
    title: 'TypeScript Testing with Jest',
    slug: 'typescript-testing-jest',
    description: 'Write type-safe tests for TypeScript applications using Jest and TypeScript testing patterns.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 55,
    tags: ['typescript', 'testing', 'jest', 'tdd'],
    prerequisites: ['TypeScript Fundamentals', 'Testing Basics'],
    learningObjectives: [
      'Set up Jest with TypeScript',
      'Write type-safe unit tests',
      'Mock TypeScript modules',
      'Test async TypeScript code'
    ],
    author: {
      name: 'Testing TypeScript Pro',
      bio: 'QA engineer specializing in TypeScript testing',
      email: ''
    },
    rating: { average: 4.8, count: 198 },
    stats: { views: 3780, completions: 1990, likes: 421 }
  }
];

const javaTutorials = [
  {
    title: 'Java Fundamentals: Object-Oriented Programming',
    slug: 'java-fundamentals-oop',
    description: 'Master Java basics including classes, objects, inheritance, and core OOP principles.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'beginner',
    estimatedTime: 60,
    tags: ['java', 'oop', 'fundamentals', 'classes'],
    prerequisites: ['Basic programming concepts'],
    learningObjectives: [
      'Understand Java syntax and structure',
      'Create and use classes and objects',
      'Implement inheritance and polymorphism',
      'Work with interfaces and abstract classes'
    ],
    author: {
      name: 'Java Master',
      bio: 'Senior Java developer with 15+ years experience',
      email: ''
    },
    rating: { average: 4.8, count: 412 },
    stats: { views: 7890, completions: 4120, likes: 823 }
  },
  {
    title: 'Java Collections Framework Deep Dive',
    slug: 'java-collections-framework',
    description: 'Explore Java Collections including Lists, Sets, Maps, and advanced collection operations.',
    category: 'Data Structures',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 55,
    tags: ['java', 'collections', 'data structures', 'lists'],
    prerequisites: ['Java Fundamentals', 'OOP concepts'],
    learningObjectives: [
      'Master List, Set, and Map interfaces',
      'Choose right collection for the task',
      'Use iterators and streams',
      'Implement custom collections'
    ],
    author: {
      name: 'Java Master',
      bio: 'Senior Java developer with 15+ years experience',
      email: ''
    },
    rating: { average: 4.7, count: 356 },
    stats: { views: 6540, completions: 3340, likes: 678 }
  },
  {
    title: 'Java Streams API and Functional Programming',
    slug: 'java-streams-functional',
    description: 'Learn functional programming in Java with Streams API, lambdas, and method references.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 50,
    tags: ['java', 'streams', 'functional', 'lambdas'],
    prerequisites: ['Java Collections', 'Java 8+'],
    learningObjectives: [
      'Use Java Streams effectively',
      'Write lambda expressions',
      'Apply functional interfaces',
      'Perform stream operations'
    ],
    author: {
      name: 'Java Functional Pro',
      bio: 'Expert in modern Java and functional programming',
      email: ''
    },
    rating: { average: 4.9, count: 298 },
    stats: { views: 5670, completions: 2980, likes: 612 }
  },
  {
    title: 'Java Multithreading and Concurrency',
    slug: 'java-multithreading-concurrency',
    description: 'Master Java concurrency with threads, executors, synchronization, and concurrent collections.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'advanced',
    estimatedTime: 70,
    tags: ['java', 'multithreading', 'concurrency', 'threads'],
    prerequisites: ['Java Fundamentals', 'Advanced Java'],
    learningObjectives: [
      'Create and manage threads',
      'Use Executor framework',
      'Implement thread-safe code',
      'Work with concurrent collections'
    ],
    author: {
      name: 'Concurrency Expert',
      bio: 'Specialist in Java concurrency and performance',
      email: ''
    },
    rating: { average: 4.7, count: 267 },
    stats: { views: 4890, completions: 2340, likes: 489 }
  },
  {
    title: 'Java Exception Handling Best Practices',
    slug: 'java-exception-handling',
    description: 'Learn proper exception handling in Java including try-catch, custom exceptions, and error management.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['java', 'exceptions', 'error handling', 'best practices'],
    prerequisites: ['Java Fundamentals'],
    learningObjectives: [
      'Handle exceptions properly',
      'Create custom exceptions',
      'Use try-with-resources',
      'Follow exception best practices'
    ],
    author: {
      name: 'Java Master',
      bio: 'Senior Java developer with 15+ years experience',
      email: ''
    },
    rating: { average: 4.8, count: 289 },
    stats: { views: 5230, completions: 2780, likes: 545 }
  },
  {
    title: 'Java Generics and Type Safety',
    slug: 'java-generics-type-safety',
    description: 'Master Java generics for writing reusable, type-safe code with bounded types and wildcards.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 50,
    tags: ['java', 'generics', 'type safety', 'wildcards'],
    prerequisites: ['Java Fundamentals', 'Java Collections'],
    learningObjectives: [
      'Create generic classes and methods',
      'Use bounded type parameters',
      'Understand wildcards',
      'Implement type-safe collections'
    ],
    author: {
      name: 'Java Master',
      bio: 'Senior Java developer with 15+ years experience',
      email: ''
    },
    rating: { average: 4.7, count: 234 },
    stats: { views: 4560, completions: 2340, likes: 467 }
  },
  {
    title: 'Java Spring Boot REST API Development',
    slug: 'java-spring-boot-rest-api',
    description: 'Build production-ready REST APIs with Java Spring Boot, including security and best practices.',
    category: 'Web Development',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 75,
    tags: ['java', 'spring boot', 'rest api', 'backend'],
    prerequisites: ['Java Fundamentals', 'HTTP Basics'],
    learningObjectives: [
      'Set up Spring Boot projects',
      'Create RESTful endpoints',
      'Implement data persistence',
      'Add security and validation'
    ],
    author: {
      name: 'Spring Boot Expert',
      bio: 'Enterprise Java developer specializing in Spring',
      email: ''
    },
    rating: { average: 4.9, count: 456 },
    stats: { views: 8920, completions: 4560, likes: 934 }
  },
  {
    title: 'Java File I/O and NIO',
    slug: 'java-file-io-nio',
    description: 'Work with files and streams in Java using traditional I/O and modern NIO APIs.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['java', 'file io', 'nio', 'streams'],
    prerequisites: ['Java Fundamentals'],
    learningObjectives: [
      'Read and write files',
      'Use Java NIO effectively',
      'Work with buffers and channels',
      'Handle file paths properly'
    ],
    author: {
      name: 'Java Master',
      bio: 'Senior Java developer with 15+ years experience',
      email: ''
    },
    rating: { average: 4.6, count: 198 },
    stats: { views: 3890, completions: 1990, likes: 389 }
  },
  {
    title: 'Java Design Patterns',
    slug: 'java-design-patterns',
    description: 'Implement common design patterns in Java including Singleton, Factory, Observer, and more.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'advanced',
    estimatedTime: 65,
    tags: ['java', 'design patterns', 'architecture', 'best practices'],
    prerequisites: ['Java OOP', 'Software Design'],
    learningObjectives: [
      'Understand design pattern concepts',
      'Implement creational patterns',
      'Apply structural patterns',
      'Use behavioral patterns'
    ],
    author: {
      name: 'Architecture Expert',
      bio: 'Software architect with expertise in design patterns',
      email: ''
    },
    rating: { average: 4.8, count: 312 },
    stats: { views: 6120, completions: 3120, likes: 645 }
  },
  {
    title: 'Java JDBC and Database Programming',
    slug: 'java-jdbc-database',
    description: 'Connect Java applications to databases using JDBC for data persistence and retrieval.',
    category: 'Database',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 55,
    tags: ['java', 'jdbc', 'database', 'sql'],
    prerequisites: ['Java Fundamentals', 'SQL Basics'],
    learningObjectives: [
      'Connect to databases with JDBC',
      'Execute SQL queries from Java',
      'Handle database transactions',
      'Use prepared statements'
    ],
    author: {
      name: 'Database Java Pro',
      bio: 'Java developer specializing in database integration',
      email: ''
    },
    rating: { average: 4.7, count: 267 },
    stats: { views: 5340, completions: 2670, likes: 534 }
  },
  {
    title: 'Java Unit Testing with JUnit',
    slug: 'java-junit-testing',
    description: 'Write effective unit tests for Java applications using JUnit and testing best practices.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'intermediate',
    estimatedTime: 50,
    tags: ['java', 'junit', 'testing', 'tdd'],
    prerequisites: ['Java Fundamentals'],
    learningObjectives: [
      'Write JUnit test cases',
      'Use assertions effectively',
      'Mock dependencies',
      'Follow TDD practices'
    ],
    author: {
      name: 'Testing Expert',
      bio: 'QA engineer specializing in Java testing',
      email: ''
    },
    rating: { average: 4.8, count: 245 },
    stats: { views: 4890, completions: 2450, likes: 498 }
  },
  {
    title: 'Java Memory Management and Performance',
    slug: 'java-memory-performance',
    description: 'Understand Java memory management, garbage collection, and performance optimization techniques.',
    category: 'Programming Fundamentals',
    language: 'java',
    difficulty: 'advanced',
    estimatedTime: 60,
    tags: ['java', 'memory', 'performance', 'gc'],
    prerequisites: ['Advanced Java', 'JVM Knowledge'],
    learningObjectives: [
      'Understand JVM memory model',
      'Optimize garbage collection',
      'Profile Java applications',
      'Avoid memory leaks'
    ],
    author: {
      name: 'Performance Expert',
      bio: 'Java performance tuning specialist',
      email: ''
    },
    rating: { average: 4.7, count: 189 },
    stats: { views: 3780, completions: 1890, likes: 378 }
  }
];

async function seedTutorials() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing TypeScript and Java tutorials
    const deleteResult = await MongoTutorial.deleteMany({
      language: { $in: ['typescript', 'java'] }
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing TypeScript and Java tutorials\n`);

    // Insert new tutorials
    const allTutorials = [...typeScriptTutorials, ...javaTutorials];
    const result = await MongoTutorial.insertMany(allTutorials);
    console.log(`✅ Successfully seeded ${result.length} tutorials\n`);

    // Statistics
    const tsCount = typeScriptTutorials.length;
    const javaCount = javaTutorials.length;

    console.log('📊 Tutorial Distribution:');
    console.log(`   TypeScript: ${tsCount} tutorials`);
    console.log(`   Java: ${javaCount} tutorials`);
    console.log(`   Total: ${result.length} tutorials\n`);

    console.log('📈 By Difficulty:');
    const byDifficulty = allTutorials.reduce((acc, t) => {
      acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
      return acc;
    }, {});
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      console.log(`   ${diff}: ${count} tutorials`);
    });

    console.log('\n✨ TypeScript and Java tutorial seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tutorials:', error);
    process.exit(1);
  }
}

seedTutorials();
