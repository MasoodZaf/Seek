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

// Generate 50 tutorials for each language (250 total - DOUBLED from original 125)
const generateTutorials = () => {
  const topics = {
    python: [
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
    ],
    javascript: [
      'Variables and Data Types', 'Functions and Scope', 'Arrays and Objects', 'DOM Manipulation', 'Event Handling',
      'Promises and Async', 'ES6+ Features', 'Modules', 'Error Handling', 'Closures',
      'Prototypes and Inheritance', 'Regular Expressions', 'AJAX and Fetch', 'Local Storage', 'Canvas and Graphics',
      'Web APIs', 'Testing with Jest', 'Node.js Basics', 'Express.js', 'Database Integration',
      'Authentication', 'Real-time with WebSockets', 'Build Tools', 'Performance Optimization', 'Security Best Practices',
      'TypeScript Integration', 'React Fundamentals', 'Vue.js', 'Angular', 'State Management',
      'Redux', 'MobX', 'GraphQL', 'REST APIs', 'Server-Side Rendering',
      'Progressive Web Apps', 'Service Workers', 'IndexedDB', 'Web Components', 'Shadow DOM',
      'Custom Elements', 'Observables', 'RxJS', 'Micro-frontends', 'Monorepos',
      'Code Splitting', 'Tree Shaking', 'Hot Module Replacement', 'ESLint', 'Prettier'
    ],
    java: [
      'Java Fundamentals', 'Classes and Objects', 'Inheritance', 'Polymorphism', 'Interfaces',
      'Exception Handling', 'Collections Framework', 'Generics', 'I/O Streams', 'Multithreading',
      'Lambda Expressions', 'Stream API', 'JDBC Database', 'Servlets', 'Spring Framework',
      'Spring Boot', 'RESTful Services', 'JUnit Testing', 'Maven Build Tool', 'Design Patterns',
      'Annotations', 'Reflection API', 'Networking', 'Security', 'Performance Tuning',
      'Gradle', 'Hibernate ORM', 'JPA', 'Spring Data', 'Spring Security',
      'Microservices', 'Docker Deployment', 'Kubernetes', 'Reactive Programming', 'Spring WebFlux',
      'Apache Kafka', 'RabbitMQ', 'Redis Integration', 'MongoDB Java', 'Elasticsearch',
      'Logging with SLF4J', 'Log4j2', 'Monitoring', 'Metrics', 'Distributed Tracing',
      'Circuit Breaker', 'API Gateway', 'Service Discovery', 'Config Management', 'Cloud Native'
    ],
    typescript: [
      'TypeScript Basics', 'Types and Interfaces', 'Classes', 'Generics', 'Advanced Types',
      'Modules', 'Decorators', 'Async Programming', 'Testing', 'Node.js with TypeScript',
      'React with TypeScript', 'Express API', 'Database Integration', 'Error Handling', 'Utility Types',
      'Type Guards', 'Conditional Types', 'Mapped Types', 'Namespace', 'Declaration Files',
      'Build Configuration', 'Linting and Formatting', 'Performance', 'Migration Strategies', 'Best Practices',
      'Strict Mode', 'Type Inference', 'Type Narrowing', 'Union Types', 'Intersection Types',
      'Literal Types', 'Template Literal Types', 'Enum Types', 'Tuple Types', 'Unknown vs Any',
      'Never Type', 'Void Type', 'Type Assertions', 'Non-null Assertion', 'Optional Chaining',
      'Nullish Coalescing', 'Discriminated Unions', 'Index Signatures', 'ReadOnly Properties', 'Const Assertions',
      'Type Predicates', 'Variadic Tuple Types', 'Recursive Types', 'Module Augmentation', 'Triple-Slash Directives'
    ],
    cpp: [
      'C++ Fundamentals', 'Pointers and References', 'Classes and Objects', 'Inheritance', 'Polymorphism',
      'Templates', 'STL Containers', 'Algorithms', 'Memory Management', 'Exception Handling',
      'File I/O', 'Multithreading', 'Smart Pointers', 'Move Semantics', 'Lambda Expressions',
      'Operator Overloading', 'Virtual Functions', 'Abstract Classes', 'Design Patterns', 'Debugging',
      'Performance Optimization', 'Modern C++', 'Concurrency', 'Networking', 'Best Practices',
      'C++11 Features', 'C++14 Features', 'C++17 Features', 'C++20 Features', 'Constexpr',
      'RAII Pattern', 'Rule of Five', 'Perfect Forwarding', 'Variadic Templates', 'SFINAE',
      'Concepts', 'Ranges', 'Coroutines', 'Modules', 'Atomic Operations',
      'Memory Model', 'Cache Optimization', 'SIMD', 'Boost Libraries', 'CMake',
      'Unit Testing', 'Valgrind', 'Address Sanitizer', 'Static Analysis', 'Code Coverage'
    ]
  };

  const slugs = {};
  const descriptions = {};
  const categories = {};
  const difficulties = {};
  const times = {};
  const tags = {};

  // Generate slugs for all languages
  Object.keys(topics).forEach(lang => {
    slugs[lang] = topics[lang].map(t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    // Generate varied descriptions
    descriptions[lang] = topics[lang].map(t => `Master ${t.toLowerCase()} in ${lang.toUpperCase()} with hands-on examples and best practices`);

    // Generate categories
    categories[lang] = topics[lang].map((_, i) => {
      if (i < 10) return 'Programming Fundamentals';
      if (i < 20) return i % 2 === 0 ? 'Programming Fundamentals' : 'Web Development';
      if (i < 30) return i % 3 === 0 ? 'Database' : 'Web Development';
      if (i < 40) return i % 2 === 0 ? 'DevOps' : 'Web Development';
      return i % 2 === 0 ? 'Security' : 'Programming Fundamentals';
    });

    // Generate difficulties
    difficulties[lang] = topics[lang].map((_, i) => {
      if (i < 10) return 'beginner';
      if (i < 25) return 'intermediate';
      if (i < 40) return i % 2 === 0 ? 'intermediate' : 'advanced';
      return 'advanced';
    });

    // Generate estimated times (90-240 minutes)
    times[lang] = topics[lang].map((_, i) => 90 + (i * 3) + Math.floor(Math.random() * 30));

    // Generate tags
    tags[lang] = topics[lang].map(t => {
      const words = t.toLowerCase().split(/\s+/).slice(0, 3);
      return [lang, ...words];
    });
  });

  const allTutorials = [];

  // Python tutorials (50)
  for (let i = 0; i < 50; i++) {
    allTutorials.push(createTutorial({
      title: `Python Tutorial ${i + 1}: ${topics.python[i]}`,
      slug: `python-tutorial-${i + 1}-${slugs.python[i]}`,
      description: descriptions.python[i],
      category: categories.python[i],
      language: 'python',
      difficulty: difficulties.python[i],
      estimatedTime: times.python[i],
      tags: tags.python[i],
      rating: { average: 4.5 + Math.random() * 0.4, count: 50 + Math.floor(Math.random() * 200) },
      stats: {
        views: 1000 + Math.floor(Math.random() * 3000),
        completions: 800 + Math.floor(Math.random() * 2000),
        likes: 100 + Math.floor(Math.random() * 400)
      }
    }));
  }

  // JavaScript tutorials (50)
  for (let i = 0; i < 50; i++) {
    allTutorials.push(createTutorial({
      title: `JavaScript Tutorial ${i + 1}: ${topics.javascript[i]}`,
      slug: `javascript-tutorial-${i + 1}-${slugs.javascript[i]}`,
      description: descriptions.javascript[i],
      category: categories.javascript[i],
      language: 'javascript',
      difficulty: difficulties.javascript[i],
      estimatedTime: times.javascript[i],
      tags: tags.javascript[i],
      rating: { average: 4.4 + Math.random() * 0.5, count: 60 + Math.floor(Math.random() * 180) },
      stats: {
        views: 1200 + Math.floor(Math.random() * 2800),
        completions: 900 + Math.floor(Math.random() * 1800),
        likes: 120 + Math.floor(Math.random() * 350)
      }
    }));
  }

  // Java tutorials (50)
  for (let i = 0; i < 50; i++) {
    allTutorials.push(createTutorial({
      title: `Java Tutorial ${i + 1}: ${topics.java[i]}`,
      slug: `java-tutorial-${i + 1}-${slugs.java[i]}`,
      description: descriptions.java[i],
      category: categories.java[i],
      language: 'java',
      difficulty: difficulties.java[i],
      estimatedTime: times.java[i],
      tags: tags.java[i],
      rating: { average: 4.3 + Math.random() * 0.6, count: 40 + Math.floor(Math.random() * 160) },
      stats: {
        views: 800 + Math.floor(Math.random() * 2500),
        completions: 600 + Math.floor(Math.random() * 1500),
        likes: 80 + Math.floor(Math.random() * 300)
      }
    }));
  }

  // TypeScript tutorials (50)
  for (let i = 0; i < 50; i++) {
    allTutorials.push(createTutorial({
      title: `TypeScript Tutorial ${i + 1}: ${topics.typescript[i]}`,
      slug: `typescript-tutorial-${i + 1}-${slugs.typescript[i]}`,
      description: descriptions.typescript[i],
      category: categories.typescript[i],
      language: 'typescript',
      difficulty: difficulties.typescript[i],
      estimatedTime: times.typescript[i],
      tags: tags.typescript[i],
      rating: { average: 4.5 + Math.random() * 0.4, count: 30 + Math.floor(Math.random() * 120) },
      stats: {
        views: 600 + Math.floor(Math.random() * 2000),
        completions: 450 + Math.floor(Math.random() * 1200),
        likes: 60 + Math.floor(Math.random() * 250)
      }
    }));
  }

  // C++ tutorials (50)
  for (let i = 0; i < 50; i++) {
    allTutorials.push(createTutorial({
      title: `C++ Tutorial ${i + 1}: ${topics.cpp[i]}`,
      slug: `cpp-tutorial-${i + 1}-${slugs.cpp[i]}`,
      description: descriptions.cpp[i],
      category: categories.cpp[i],
      language: 'cpp',
      difficulty: difficulties.cpp[i],
      estimatedTime: times.cpp[i],
      tags: tags.cpp[i],
      rating: { average: 4.2 + Math.random() * 0.6, count: 25 + Math.floor(Math.random() * 100) },
      stats: {
        views: 500 + Math.floor(Math.random() * 1800),
        completions: 350 + Math.floor(Math.random() * 1000),
        likes: 40 + Math.floor(Math.random() * 200)
      }
    }));
  }

  return allTutorials;
};

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting DOUBLED tutorial seeding (250 tutorials)...');

    const allTutorials = generateTutorials();
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
    console.log(`📊 Total tutorials: ${insertedCount} (DOUBLED from 125 to 250)`);

    console.log('\n📚 Tutorials by Language:');
    Object.entries(tutorialsByLanguage)
      .sort(([, a], [, b]) => b - a)
      .forEach(([language, count]) => {
        console.log(`   ${language.toUpperCase()}: ${count} tutorials (was ${count/2})`);
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
    console.log('🚀 Your MongoDB now contains 250 comprehensive tutorials (DOUBLED)!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
