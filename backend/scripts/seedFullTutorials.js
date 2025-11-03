require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Helper function to create tutorial template
const createTutorial = (overrides) => ({
  title: 'Default Tutorial',
  slug: 'default-tutorial',
  description: 'A default tutorial description',
  category: 'Programming Fundamentals',
  language: 'javascript',
  difficulty: 'beginner',
  estimatedTime: 120,
  tags: ['programming', 'basics'],
  prerequisites: ['Basic computer literacy'],
  learningObjectives: ['Learn programming concepts', 'Apply basic skills'],
  steps: [
    {
      stepNumber: 1,
      title: 'Getting Started',
      content: 'Introduction to the topic',
      codeExamples: [{
        language: 'javascript',
        code: "console.log('Hello, World!');",
        explanation: 'Basic example to get started'
      }]
    }
  ],
  resources: [
    {
      title: 'Documentation',
      url: 'https://example.com/docs',
      type: 'documentation'
    }
  ],
  author: {
    name: 'Seek Learning Team',
    bio: 'Experienced educators passionate about teaching'
  },
  rating: { average: 4.5, count: 100 },
  stats: { views: 1500, completions: 1200, likes: 150 },
  ...overrides
});

// Create 50 comprehensive tutorials for each major language (DOUBLED)
const allTutorials = [
  // ==================== PYTHON TUTORIALS (50 tutorials) ====================
  ...Array.from({ length: 50 }, (_, i) => createTutorial({
    title: `Python Tutorial ${i + 1}: ${[
      'Variables and Data Types', 'Control Flow', 'Functions', 'Lists and Tuples', 'Dictionaries',
      'File I/O', 'Classes and OOP', 'Inheritance', 'Modules', 'Error Handling',
      'Lambda Functions', 'Iterators and Generators', 'Decorators', 'Regular Expressions', 'Web Scraping',
      'Database Programming', 'Testing', 'Concurrency', 'API Development', 'Data Analysis',
      'Machine Learning Basics', 'Data Visualization', 'File Processing', 'Design Patterns', 'Performance Optimization',
      'Virtual Environments', 'Package Management', 'Type Hints', 'Context Managers', 'Metaclasses',
      'Async/Await', 'SQLAlchemy ORM', 'Django Framework', 'Flask REST APIs', 'NumPy Arrays',
      'Pandas DataFrames', 'Web Scraping with Selenium', 'Pytest Advanced', 'Code Profiling', 'Memory Management',
      'Multiprocessing', 'Network Programming', 'GraphQL APIs', 'Docker Integration', 'CI/CD Pipelines',
      'Security Best Practices', 'Logging and Monitoring', 'Data Validation', 'Celery Task Queues', 'WebSockets'
    ][i]}`,
    slug: `python-tutorial-${i + 1}-${[
      'variables-data-types', 'control-flow', 'functions', 'lists-tuples', 'dictionaries',
      'file-io', 'classes-oop', 'inheritance', 'modules', 'error-handling',
      'lambda-functions', 'iterators-generators', 'decorators', 'regex', 'web-scraping',
      'database-programming', 'testing', 'concurrency', 'api-development', 'data-analysis',
      'machine-learning', 'data-visualization', 'file-processing', 'design-patterns', 'performance',
      'virtual-environments', 'package-management', 'type-hints', 'context-managers', 'metaclasses',
      'async-await', 'sqlalchemy-orm', 'django-framework', 'flask-rest-apis', 'numpy-arrays',
      'pandas-dataframes', 'selenium-scraping', 'pytest-advanced', 'code-profiling', 'memory-management',
      'multiprocessing', 'network-programming', 'graphql-apis', 'docker-integration', 'cicd-pipelines',
      'security-best-practices', 'logging-monitoring', 'data-validation', 'celery-tasks', 'websockets'
    ][i]}`,
    description: `Learn ${[
      "Python's fundamental data types and variable handling",
      'control flow structures including loops and conditionals',
      'function definition and advanced parameter handling',
      "Python's sequence types: lists and tuples",
      'dictionary operations and data manipulation',
      'file operations and data persistence',
      'object-oriented programming with classes',
      'inheritance and polymorphism concepts',
      'code organization with modules and packages',
      'exception handling and debugging techniques',
      'functional programming with lambda expressions',
      'memory-efficient programming with iterators',
      'function enhancement with decorators',
      'pattern matching with regular expressions',
      'web data extraction techniques',
      'database connectivity and operations',
      'code testing and quality assurance',
      'concurrent programming techniques',
      'REST API development with Flask/FastAPI',
      'data analysis with Pandas and NumPy',
      'introduction to machine learning concepts',
      'creating charts and graphs with matplotlib',
      'advanced file processing techniques',
      'common software design patterns',
      'code optimization and performance tuning',
      'Python virtual environment management',
      'pip and package dependency management',
      'static type checking with type hints',
      'resource management with context managers',
      'advanced Python metaclass programming',
      'asynchronous programming patterns',
      'ORM development with SQLAlchemy',
      'full-stack development with Django',
      'building RESTful APIs with Flask',
      'numerical computing with NumPy',
      'data manipulation with Pandas',
      'browser automation with Selenium',
      'advanced testing with Pytest',
      'Python code profiling and optimization',
      'Python memory management techniques',
      'parallel processing with multiprocessing',
      'socket programming and networking',
      'GraphQL API development',
      'containerization with Docker',
      'continuous integration and deployment',
      'Python security and encryption',
      'application logging and monitoring',
      'data validation with Pydantic',
      'distributed task queues with Celery',
      'real-time communication with WebSockets'
    ][i]}`,
    category: [
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Data Structures', 'Data Structures',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Web Development',
      'Database', 'Programming Fundamentals', 'Programming Fundamentals', 'Web Development', 'Data Structures',
      'Machine Learning', 'Data Structures', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'DevOps', 'DevOps', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Database', 'Web Development', 'Web Development', 'Data Structures',
      'Data Structures', 'Web Development', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Web Development', 'DevOps', 'DevOps',
      'Security', 'DevOps', 'Programming Fundamentals', 'Web Development', 'Web Development'
    ][i],
    language: 'python',
    difficulty: ['beginner', 'beginner', 'beginner', 'beginner', 'beginner',
      'intermediate', 'intermediate', 'intermediate', 'intermediate', 'intermediate',
      'intermediate', 'advanced', 'advanced', 'intermediate', 'intermediate',
      'intermediate', 'intermediate', 'advanced', 'intermediate', 'intermediate',
      'advanced', 'intermediate', 'intermediate', 'advanced', 'advanced',
      'beginner', 'beginner', 'intermediate', 'intermediate', 'advanced',
      'advanced', 'advanced', 'advanced', 'intermediate', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'advanced', 'advanced',
      'advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'advanced', 'intermediate'][i],
    estimatedTime: [90, 110, 130, 120, 115, 140, 180, 160, 125, 135,
      155, 170, 180, 150, 160, 175, 145, 200, 190, 165,
      210, 155, 140, 195, 175, 100, 105, 145, 150, 200,
      185, 210, 240, 190, 155, 165, 170, 160, 175, 180,
      195, 170, 185, 155, 165, 175, 160, 150, 200, 175][i],
    tags: [
      ['python', 'variables', 'data-types'],
      ['python', 'control-flow', 'loops', 'conditionals'],
      ['python', 'functions', 'parameters', 'return'],
      ['python', 'lists', 'tuples', 'sequences'],
      ['python', 'dictionaries', 'key-value', 'data'],
      ['python', 'files', 'io', 'persistence'],
      ['python', 'oop', 'classes', 'objects'],
      ['python', 'inheritance', 'polymorphism'],
      ['python', 'modules', 'packages', 'imports'],
      ['python', 'exceptions', 'debugging', 'errors'],
      ['python', 'lambda', 'functional', 'map', 'filter'],
      ['python', 'iterators', 'generators', 'yield'],
      ['python', 'decorators', 'functions', 'wrappers'],
      ['python', 'regex', 'patterns', 'text'],
      ['python', 'web-scraping', 'requests', 'beautifulsoup'],
      ['python', 'database', 'sqlite', 'sql'],
      ['python', 'testing', 'unittest', 'quality'],
      ['python', 'concurrency', 'threading', 'async'],
      ['python', 'api', 'flask', 'fastapi', 'web'],
      ['python', 'data-analysis', 'pandas', 'numpy'],
      ['python', 'machine-learning', 'scikit-learn'],
      ['python', 'visualization', 'matplotlib', 'charts'],
      ['python', 'files', 'csv', 'json', 'processing'],
      ['python', 'design-patterns', 'architecture'],
      ['python', 'performance', 'optimization', 'profiling'],
      ['python', 'venv', 'virtualenv', 'environment'],
      ['python', 'pip', 'packages', 'dependencies'],
      ['python', 'type-hints', 'mypy', 'typing'],
      ['python', 'context-managers', 'with', 'resources'],
      ['python', 'metaclasses', 'advanced', 'meta'],
      ['python', 'async', 'await', 'asyncio'],
      ['python', 'sqlalchemy', 'orm', 'database'],
      ['python', 'django', 'framework', 'web'],
      ['python', 'flask', 'rest', 'api'],
      ['python', 'numpy', 'arrays', 'numerical'],
      ['python', 'pandas', 'dataframes', 'data'],
      ['python', 'selenium', 'automation', 'web'],
      ['python', 'pytest', 'testing', 'advanced'],
      ['python', 'profiling', 'cprofile', 'optimization'],
      ['python', 'memory', 'gc', 'management'],
      ['python', 'multiprocessing', 'parallel', 'processes'],
      ['python', 'networking', 'sockets', 'tcp'],
      ['python', 'graphql', 'api', 'schema'],
      ['python', 'docker', 'containers', 'deployment'],
      ['python', 'ci-cd', 'github-actions', 'automation'],
      ['python', 'security', 'cryptography', 'encryption'],
      ['python', 'logging', 'monitoring', 'observability'],
      ['python', 'pydantic', 'validation', 'models'],
      ['python', 'celery', 'tasks', 'queues'],
      ['python', 'websockets', 'real-time', 'socketio']
    ][i],
    rating: { average: 4.5 + Math.random() * 0.4, count: 50 + Math.floor(Math.random() * 200) },
    stats: {
      views: 1000 + Math.floor(Math.random() * 3000),
      completions: 800 + Math.floor(Math.random() * 2000),
      likes: 100 + Math.floor(Math.random() * 400)
    }
  })),

  // ==================== JAVASCRIPT TUTORIALS (50 tutorials) ====================
  ...Array.from({ length: 50 }, (_, i) => createTutorial({
    title: `JavaScript Tutorial ${i + 1}: ${[
      'Variables and Data Types', 'Functions and Scope', 'Arrays and Objects', 'DOM Manipulation', 'Event Handling',
      'Promises and Async', 'ES6+ Features', 'Modules', 'Error Handling', 'Closures',
      'Prototypes and Inheritance', 'Regular Expressions', 'AJAX and Fetch', 'Local Storage', 'Canvas and Graphics',
      'Web APIs', 'Testing with Jest', 'Node.js Basics', 'Express.js', 'Database Integration',
      'Authentication', 'Real-time with WebSockets', 'Build Tools', 'Performance Optimization', 'Security Best Practices'
    ][i]}`,
    slug: `javascript-tutorial-${i + 1}-${[
      'variables-data-types', 'functions-scope', 'arrays-objects', 'dom-manipulation', 'event-handling',
      'promises-async', 'es6-features', 'modules', 'error-handling', 'closures',
      'prototypes-inheritance', 'regex', 'ajax-fetch', 'local-storage', 'canvas-graphics',
      'web-apis', 'testing-jest', 'nodejs-basics', 'expressjs', 'database-integration',
      'authentication', 'websockets', 'build-tools', 'performance', 'security'
    ][i]}`,
    description: `Master ${[
      "JavaScript's dynamic typing and variable declarations",
      'function definitions, scope, and closures',
      'data structures: arrays and objects manipulation',
      'dynamic HTML manipulation with DOM API',
      'interactive web development with event handling',
      'asynchronous programming with promises and async/await',
      'modern JavaScript features and syntax',
      'code organization with ES6 modules',
      'robust error handling and debugging',
      'advanced function concepts and closures',
      'object-oriented programming in JavaScript',
      'pattern matching with regular expressions',
      'HTTP requests and API communication',
      'client-side data persistence techniques',
      'graphics and animation with HTML5 Canvas',
      'browser APIs for enhanced functionality',
      'automated testing with Jest framework',
      'server-side JavaScript with Node.js',
      'web server development with Express.js',
      'connecting JavaScript apps to databases',
      'user authentication and authorization',
      'real-time communication with WebSockets',
      'modern build tools and workflows',
      'JavaScript performance optimization techniques',
      'security considerations and best practices'
    ][i]}`,
    category: [
      'Programming Fundamentals', 'Programming Fundamentals', 'Data Structures', 'Web Development', 'Web Development',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Web Development', 'Web Development', 'Web Development',
      'Web Development', 'Programming Fundamentals', 'Web Development', 'Web Development', 'Database',
      'Security', 'Web Development', 'DevOps', 'Programming Fundamentals', 'Security'
    ][i],
    language: 'javascript',
    difficulty: ['beginner', 'beginner', 'beginner', 'beginner', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'beginner', 'advanced',
      'intermediate', 'intermediate', 'intermediate', 'beginner', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'intermediate', 'intermediate',
      'intermediate', 'advanced', 'intermediate', 'advanced', 'intermediate'][i],
    estimatedTime: [95, 120, 110, 135, 145, 170, 150, 125, 115, 160,
      175, 140, 160, 90, 180, 155, 165, 140, 185, 170,
      190, 200, 155, 175, 165][i],
    tags: [
      ['javascript', 'variables', 'data-types'],
      ['javascript', 'functions', 'scope', 'closures'],
      ['javascript', 'arrays', 'objects', 'data-structures'],
      ['javascript', 'dom', 'manipulation', 'html'],
      ['javascript', 'events', 'handlers', 'interaction'],
      ['javascript', 'promises', 'async', 'await'],
      ['javascript', 'es6', 'modern', 'features'],
      ['javascript', 'modules', 'import', 'export'],
      ['javascript', 'error-handling', 'debugging'],
      ['javascript', 'closures', 'advanced-functions'],
      ['javascript', 'prototypes', 'inheritance', 'oop'],
      ['javascript', 'regex', 'patterns', 'validation'],
      ['javascript', 'ajax', 'fetch', 'http', 'api'],
      ['javascript', 'storage', 'localStorage', 'persistence'],
      ['javascript', 'canvas', 'graphics', 'animation'],
      ['javascript', 'web-apis', 'browser', 'features'],
      ['javascript', 'testing', 'jest', 'unit-tests'],
      ['javascript', 'nodejs', 'server-side'],
      ['javascript', 'express', 'web-server', 'routing'],
      ['javascript', 'database', 'mongodb', 'sql'],
      ['javascript', 'auth', 'security', 'tokens'],
      ['javascript', 'websockets', 'real-time'],
      ['javascript', 'build-tools', 'webpack', 'babel'],
      ['javascript', 'performance', 'optimization'],
      ['javascript', 'security', 'best-practices', 'xss']
    ][i],
    rating: { average: 4.4 + Math.random() * 0.5, count: 60 + Math.floor(Math.random() * 180) },
    stats: {
      views: 1200 + Math.floor(Math.random() * 2800),
      completions: 900 + Math.floor(Math.random() * 1800),
      likes: 120 + Math.floor(Math.random() * 350)
    }
  })),

  // ==================== JAVA TUTORIALS (25 tutorials) ====================
  ...Array.from({ length: 25 }, (_, i) => createTutorial({
    title: `Java Tutorial ${i + 1}: ${[
      'Java Fundamentals', 'Classes and Objects', 'Inheritance', 'Polymorphism', 'Interfaces',
      'Exception Handling', 'Collections Framework', 'Generics', 'I/O Streams', 'Multithreading',
      'Lambda Expressions', 'Stream API', 'JDBC Database', 'Servlets', 'Spring Framework',
      'Spring Boot', 'RESTful Services', 'JUnit Testing', 'Maven Build Tool', 'Design Patterns',
      'Annotations', 'Reflection API', 'Networking', 'Security', 'Performance Tuning'
    ][i]}`,
    slug: `java-tutorial-${i + 1}-${[
      'fundamentals', 'classes-objects', 'inheritance', 'polymorphism', 'interfaces',
      'exception-handling', 'collections', 'generics', 'io-streams', 'multithreading',
      'lambda-expressions', 'stream-api', 'jdbc-database', 'servlets', 'spring-framework',
      'spring-boot', 'rest-services', 'junit-testing', 'maven', 'design-patterns',
      'annotations', 'reflection', 'networking', 'security', 'performance'
    ][i]}`,
    description: `Learn ${[
      'Java syntax, variables, and basic programming concepts',
      'object-oriented programming with classes and objects',
      'code reuse through inheritance hierarchies',
      'runtime method resolution with polymorphism',
      'contract-based programming with interfaces',
      'robust error handling with exceptions',
      "Java's built-in data structures and algorithms",
      'type-safe programming with generics',
      'file operations and input/output streams',
      'concurrent programming with threads',
      'functional programming with lambda expressions',
      'data processing with Java Stream API',
      'database connectivity and operations',
      'web development with Java servlets',
      'enterprise application development with Spring',
      'rapid application development with Spring Boot',
      'web service development and consumption',
      'automated testing with JUnit framework',
      'project management and build automation',
      'common software design patterns in Java',
      'metadata programming with annotations',
      'runtime code analysis with reflection',
      'network programming and protocols',
      'application security and best practices',
      'Java application performance optimization'
    ][i]}`,
    category: [
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Data Structures', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Data Structures', 'Database', 'Web Development', 'Web Development',
      'Web Development', 'Web Development', 'Programming Fundamentals', 'DevOps', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Security', 'Programming Fundamentals'
    ][i],
    language: 'java',
    difficulty: ['beginner', 'beginner', 'intermediate', 'intermediate', 'intermediate',
      'intermediate', 'intermediate', 'advanced', 'intermediate', 'advanced',
      'intermediate', 'intermediate', 'intermediate', 'intermediate', 'advanced',
      'intermediate', 'intermediate', 'intermediate', 'beginner', 'advanced',
      'intermediate', 'advanced', 'intermediate', 'intermediate', 'advanced'][i],
    estimatedTime: [120, 140, 160, 150, 145, 135, 170, 180, 155, 190,
      165, 175, 185, 170, 200, 180, 175, 145, 130, 195,
      160, 185, 170, 165, 190][i],
    tags: [
      ['java', 'fundamentals', 'syntax', 'basics'],
      ['java', 'oop', 'classes', 'objects'],
      ['java', 'inheritance', 'extends', 'super'],
      ['java', 'polymorphism', 'overriding', 'dynamic'],
      ['java', 'interfaces', 'contracts', 'implements'],
      ['java', 'exceptions', 'try-catch', 'error-handling'],
      ['java', 'collections', 'list', 'map', 'set'],
      ['java', 'generics', 'type-safety', 'templates'],
      ['java', 'io', 'streams', 'files', 'serialization'],
      ['java', 'threads', 'concurrency', 'synchronization'],
      ['java', 'lambda', 'functional', 'expressions'],
      ['java', 'streams', 'api', 'data-processing'],
      ['java', 'jdbc', 'database', 'sql', 'connections'],
      ['java', 'servlets', 'web', 'http', 'requests'],
      ['java', 'spring', 'framework', 'dependency-injection'],
      ['java', 'spring-boot', 'microservices', 'auto-config'],
      ['java', 'rest', 'web-services', 'api', 'json'],
      ['java', 'junit', 'testing', 'unit-tests', 'assertions'],
      ['java', 'maven', 'build', 'dependencies', 'lifecycle'],
      ['java', 'design-patterns', 'singleton', 'factory'],
      ['java', 'annotations', 'metadata', 'reflection'],
      ['java', 'reflection', 'runtime', 'introspection'],
      ['java', 'networking', 'sockets', 'protocols'],
      ['java', 'security', 'authentication', 'encryption'],
      ['java', 'performance', 'optimization', 'jvm', 'tuning']
    ][i],
    rating: { average: 4.3 + Math.random() * 0.6, count: 40 + Math.floor(Math.random() * 160) },
    stats: {
      views: 800 + Math.floor(Math.random() * 2500),
      completions: 600 + Math.floor(Math.random() * 1500),
      likes: 80 + Math.floor(Math.random() * 300)
    }
  })),

  // ==================== TYPESCRIPT TUTORIALS (25 tutorials) ====================
  ...Array.from({ length: 25 }, (_, i) => createTutorial({
    title: `TypeScript Tutorial ${i + 1}: ${[
      'TypeScript Basics', 'Types and Interfaces', 'Classes', 'Generics', 'Advanced Types',
      'Modules', 'Decorators', 'Async Programming', 'Testing', 'Node.js with TypeScript',
      'React with TypeScript', 'Express API', 'Database Integration', 'Error Handling', 'Utility Types',
      'Type Guards', 'Conditional Types', 'Mapped Types', 'Namespace', 'Declaration Files',
      'Build Configuration', 'Linting and Formatting', 'Performance', 'Migration Strategies', 'Best Practices'
    ][i]}`,
    slug: `typescript-tutorial-${i + 1}-${[
      'basics', 'types-interfaces', 'classes', 'generics', 'advanced-types',
      'modules', 'decorators', 'async', 'testing', 'nodejs',
      'react', 'express-api', 'database', 'error-handling', 'utility-types',
      'type-guards', 'conditional-types', 'mapped-types', 'namespace', 'declaration-files',
      'build-config', 'linting', 'performance', 'migration', 'best-practices'
    ][i]}`,
    description: `Master ${[
      'TypeScript fundamentals and type system',
      'type definitions and interface declarations',
      'object-oriented programming with TypeScript classes',
      'reusable code with generic types',
      'advanced type manipulation techniques',
      'code organization with modules',
      'metadata programming with decorators',
      'asynchronous programming patterns',
      'testing TypeScript applications',
      'server-side development with Node.js',
      'building React applications with TypeScript',
      'creating typed REST APIs with Express',
      'database integration with type safety',
      'robust error handling strategies',
      'built-in utility types for transformations',
      'runtime type checking with type guards',
      'dynamic type creation with conditional types',
      'type transformations with mapped types',
      'code organization with namespaces',
      'creating and using declaration files',
      'TypeScript build and configuration',
      'code quality with linting and formatting',
      'TypeScript performance optimization',
      'migrating JavaScript projects to TypeScript',
      'TypeScript development best practices'
    ][i]}`,
    category: [
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Web Development',
      'Web Development', 'Web Development', 'Database', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'DevOps', 'DevOps', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals'
    ][i],
    language: 'typescript',
    difficulty: ['beginner', 'beginner', 'intermediate', 'intermediate', 'advanced',
      'intermediate', 'advanced', 'intermediate', 'intermediate', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'intermediate', 'intermediate',
      'advanced', 'advanced', 'advanced', 'intermediate', 'intermediate',
      'intermediate', 'beginner', 'advanced', 'intermediate', 'intermediate'][i],
    estimatedTime: [110, 145, 160, 155, 180, 140, 170, 150, 165, 175,
      185, 180, 170, 145, 135, 160, 190, 185, 130, 155,
      140, 120, 175, 165, 150][i],
    tags: [
      ['typescript', 'basics', 'types', 'fundamentals'],
      ['typescript', 'types', 'interfaces', 'declarations'],
      ['typescript', 'classes', 'oop', 'inheritance'],
      ['typescript', 'generics', 'type-parameters'],
      ['typescript', 'advanced-types', 'union', 'intersection'],
      ['typescript', 'modules', 'imports', 'exports'],
      ['typescript', 'decorators', 'metadata', 'annotations'],
      ['typescript', 'async', 'promises', 'await'],
      ['typescript', 'testing', 'jest', 'unit-tests'],
      ['typescript', 'nodejs', 'server-side'],
      ['typescript', 'react', 'components', 'jsx'],
      ['typescript', 'express', 'api', 'rest'],
      ['typescript', 'database', 'orm', 'prisma'],
      ['typescript', 'error-handling', 'exceptions'],
      ['typescript', 'utility-types', 'pick', 'omit'],
      ['typescript', 'type-guards', 'narrowing'],
      ['typescript', 'conditional-types', 'infer'],
      ['typescript', 'mapped-types', 'keyof'],
      ['typescript', 'namespace', 'modules'],
      ['typescript', 'declaration-files', 'd.ts'],
      ['typescript', 'build', 'tsconfig', 'webpack'],
      ['typescript', 'eslint', 'prettier', 'formatting'],
      ['typescript', 'performance', 'compilation'],
      ['typescript', 'migration', 'javascript'],
      ['typescript', 'best-practices', 'conventions']
    ][i],
    rating: { average: 4.5 + Math.random() * 0.4, count: 30 + Math.floor(Math.random() * 120) },
    stats: {
      views: 600 + Math.floor(Math.random() * 2000),
      completions: 450 + Math.floor(Math.random() * 1200),
      likes: 60 + Math.floor(Math.random() * 250)
    }
  })),

  // ==================== C++ TUTORIALS (25 tutorials) ====================
  ...Array.from({ length: 25 }, (_, i) => createTutorial({
    title: `C++ Tutorial ${i + 1}: ${[
      'C++ Fundamentals', 'Pointers and References', 'Classes and Objects', 'Inheritance', 'Polymorphism',
      'Templates', 'STL Containers', 'Algorithms', 'Memory Management', 'Exception Handling',
      'File I/O', 'Multithreading', 'Smart Pointers', 'Move Semantics', 'Lambda Expressions',
      'Operator Overloading', 'Virtual Functions', 'Abstract Classes', 'Design Patterns', 'Debugging',
      'Performance Optimization', 'Modern C++', 'Concurrency', 'Networking', 'Best Practices'
    ][i]}`,
    slug: `cpp-tutorial-${i + 1}-${[
      'fundamentals', 'pointers-references', 'classes-objects', 'inheritance', 'polymorphism',
      'templates', 'stl-containers', 'algorithms', 'memory-management', 'exception-handling',
      'file-io', 'multithreading', 'smart-pointers', 'move-semantics', 'lambda-expressions',
      'operator-overloading', 'virtual-functions', 'abstract-classes', 'design-patterns', 'debugging',
      'performance', 'modern-cpp', 'concurrency', 'networking', 'best-practices'
    ][i]}`,
    description: `Learn ${[
      'C++ syntax, variables, and basic programming concepts',
      'memory addresses, pointers, and reference variables',
      'object-oriented programming with classes',
      'code reuse through inheritance mechanisms',
      'runtime polymorphism and virtual functions',
      'generic programming with templates',
      'Standard Template Library containers',
      'STL algorithms and iterators',
      'dynamic memory allocation and management',
      'error handling with exceptions',
      'file input/output operations',
      'concurrent programming with threads',
      'automatic memory management with smart pointers',
      'efficient resource management with move semantics',
      'anonymous functions with lambda expressions',
      'custom operator definitions',
      'runtime method resolution',
      'pure virtual functions and abstract base classes',
      'common design patterns in C++',
      'debugging techniques and tools',
      'C++ performance optimization strategies',
      'C++11/14/17/20 modern features',
      'parallel programming and synchronization',
      'network programming with sockets',
      'C++ development best practices'
    ][i]}`,
    category: [
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Data Structures', 'Algorithms', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals',
      'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals', 'Programming Fundamentals'
    ][i],
    language: 'cpp',
    difficulty: ['beginner', 'intermediate', 'beginner', 'intermediate', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'advanced', 'intermediate',
      'beginner', 'advanced', 'intermediate', 'advanced', 'intermediate',
      'intermediate', 'intermediate', 'intermediate', 'advanced', 'intermediate',
      'advanced', 'intermediate', 'advanced', 'intermediate', 'intermediate'][i],
    estimatedTime: [130, 190, 150, 170, 165, 180, 175, 185, 200, 145,
      140, 210, 175, 195, 160, 170, 165, 175, 200, 155,
      190, 170, 220, 180, 160][i],
    tags: [
      ['cpp', 'fundamentals', 'syntax', 'basics'],
      ['cpp', 'pointers', 'references', 'memory'],
      ['cpp', 'classes', 'objects', 'oop'],
      ['cpp', 'inheritance', 'derived', 'base'],
      ['cpp', 'polymorphism', 'virtual', 'dynamic'],
      ['cpp', 'templates', 'generic', 'metaprogramming'],
      ['cpp', 'stl', 'containers', 'vector', 'map'],
      ['cpp', 'algorithms', 'sort', 'search', 'iterators'],
      ['cpp', 'memory', 'allocation', 'new', 'delete'],
      ['cpp', 'exceptions', 'try-catch', 'error-handling'],
      ['cpp', 'file-io', 'streams', 'fstream'],
      ['cpp', 'threads', 'multithreading', 'concurrency'],
      ['cpp', 'smart-pointers', 'unique-ptr', 'shared-ptr'],
      ['cpp', 'move-semantics', 'rvalue', 'efficiency'],
      ['cpp', 'lambda', 'expressions', 'closures'],
      ['cpp', 'operator-overloading', 'custom-operators'],
      ['cpp', 'virtual-functions', 'vtable', 'polymorphism'],
      ['cpp', 'abstract-classes', 'pure-virtual'],
      ['cpp', 'design-patterns', 'singleton', 'factory'],
      ['cpp', 'debugging', 'gdb', 'tools'],
      ['cpp', 'performance', 'optimization', 'profiling'],
      ['cpp', 'modern', 'cpp11', 'cpp14', 'cpp17'],
      ['cpp', 'concurrency', 'parallel', 'async'],
      ['cpp', 'networking', 'sockets', 'tcp'],
      ['cpp', 'best-practices', 'coding-standards']
    ][i],
    rating: { average: 4.2 + Math.random() * 0.6, count: 25 + Math.floor(Math.random() * 100) },
    stats: {
      views: 500 + Math.floor(Math.random() * 1800),
      completions: 350 + Math.floor(Math.random() * 1000),
      likes: 40 + Math.floor(Math.random() * 200)
    }
  }))
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive tutorial seeding...');
    console.log(`📚 Preparing to seed ${allTutorials.length} tutorials`);

    // Clear existing tutorials
    await MongoTutorial.deleteMany({});
    console.log('🧹 Cleared existing tutorials');

    // Insert new tutorials in batches for better performance
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < allTutorials.length; i += batchSize) {
      const batch = allTutorials.slice(i, i + batchSize);
      await MongoTutorial.insertMany(batch);
      insertedCount += batch.length;
      console.log(`✅ Inserted batch: ${insertedCount}/${allTutorials.length} tutorials`);
    }

    // Generate summary statistics
    const tutorialsByLanguage = {};
    const tutorialsByCategory = {};
    const tutorialsByDifficulty = {};

    allTutorials.forEach((tutorial) => {
      // Count by language
      tutorialsByLanguage[tutorial.language] = (tutorialsByLanguage[tutorial.language] || 0) + 1;

      // Count by category
      tutorialsByCategory[tutorial.category] = (tutorialsByCategory[tutorial.category] || 0) + 1;

      // Count by difficulty
      tutorialsByDifficulty[tutorial.difficulty] = (tutorialsByDifficulty[tutorial.difficulty] || 0) + 1;
    });

    console.log('\n🎯 === SEEDING COMPLETE ===');
    console.log(`📊 Total tutorials: ${insertedCount}`);

    console.log('\n📚 Tutorials by Language:');
    Object.entries(tutorialsByLanguage)
      .sort(([, a], [, b]) => b - a)
      .forEach(([language, count]) => {
        console.log(`   ${language.toUpperCase()}: ${count} tutorials`);
      });

    console.log('\n🏷️  Tutorials by Category:');
    Object.entries(tutorialsByCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} tutorials`);
      });

    console.log('\n🎚️  Tutorials by Difficulty:');
    Object.entries(tutorialsByDifficulty)
      .sort(([, a], [, b]) => b - a)
      .forEach(([difficulty, count]) => {
        console.log(`   ${difficulty}: ${count} tutorials`);
      });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🚀 Your MongoDB now contains comprehensive tutorials for all major programming languages!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
