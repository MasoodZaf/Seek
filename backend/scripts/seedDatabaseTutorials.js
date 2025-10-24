require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Helper to create tutorial structure
const createTutorial = (data) => ({
  title: data.title,
  slug: data.slug,
  description: data.description,
  category: 'Database',
  language: data.language || 'javascript',
  difficulty: data.difficulty,
  estimatedTime: data.duration,
  tags: data.tags,
  prerequisites: data.prerequisites || [],
  learningObjectives: data.objectives,
  steps: data.steps || [],
  quizQuestions: data.quiz || [],
  resources: data.resources || [],
  author: { name: 'Database Expert', bio: 'Professional database administrator and educator' },
  rating: { average: 4.7, count: Math.floor(Math.random() * 200) + 50 },
  stats: { 
    views: Math.floor(Math.random() * 3000) + 500, 
    completions: Math.floor(Math.random() * 2000) + 300,
    likes: Math.floor(Math.random() * 300) + 50 
  }
});

const databaseTutorials = [
  // ==================== MONGODB TUTORIALS (12) ====================
  createTutorial({
    title: 'MongoDB Fundamentals: Introduction to NoSQL',
    slug: 'mongodb-fundamentals-intro-nosql',
    description: 'Learn MongoDB basics, NoSQL concepts, and document-based data models.',
    difficulty: 'beginner',
    duration: 25,
    tags: ['MongoDB', 'NoSQL', 'Database Basics'],
    objectives: [
      'Understand NoSQL vs SQL differences',
      'Learn MongoDB document structure',
      'Connect to MongoDB databases',
      'Perform basic operations'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'What is MongoDB',
        content: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.',
        codeExamples: [{
          language: 'javascript',
          code: `// MongoDB Document Example
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "addresses": [
    { "type": "home", "city": "New York" }
  ]
}`,
          explanation: 'Documents are flexible - fields can vary between documents'
        }]
      },
      {
        stepNumber: 2,
        title: 'Connecting to MongoDB',
        content: 'Use MongoDB driver or Mongoose to connect to a database.',
        codeExamples: [{
          language: 'javascript',
          code: `const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connect() {
  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db('myDatabase');
  return db;
}`,
          explanation: 'MongoClient handles connection pooling automatically'
        }]
      }
    ],
    resources: [{ title: 'MongoDB Manual', url: 'https://docs.mongodb.com/manual/', type: 'documentation' }]
  }),

  createTutorial({
    title: 'MongoDB CRUD Operations: Create and Read',
    slug: 'mongodb-crud-create-read',
    description: 'Master insertOne, insertMany, find, and findOne operations with query operators.',
    difficulty: 'beginner',
    duration: 30,
    tags: ['MongoDB', 'CRUD', 'Insert', 'Find'],
    prerequisites: ['MongoDB Fundamentals'],
    objectives: [
      'Insert documents into collections',
      'Query documents with filters',
      'Use comparison operators',
      'Apply sorting and projection'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Inserting Documents',
        content: 'Use insertOne() and insertMany() to add documents to a collection.',
        codeExamples: [{
          language: 'javascript',
          code: `const collection = db.collection('users');

// Insert single document
await collection.insertOne({
  name: 'Alice',
  age: 28,
  email: 'alice@example.com'
});

// Insert multiple
await collection.insertMany([
  { name: 'Bob', age: 35 },
  { name: 'Carol', age: 29 }
]);`,
          explanation: 'MongoDB auto-generates _id if not provided'
        }]
      },
      {
        stepNumber: 2,
        title: 'Reading Documents',
        content: 'Find documents using find() and findOne() with query filters.',
        codeExamples: [{
          language: 'javascript',
          code: `// Find all
const all = await collection.find({}).toArray();

// Find with filter
const young = await collection.find({
  age: { $lt: 30 }
}).toArray();

// Find one
const user = await collection.findOne({ name: 'Alice' });

// Sort and limit
const top5 = await collection.find({})
  .sort({ age: -1 })
  .limit(5)
  .toArray();`,
          explanation: 'Operators like $lt, $gt, $in allow complex queries'
        }]
      }
    ]
  }),

  createTutorial({
    title: 'MongoDB CRUD: Update and Delete',
    slug: 'mongodb-crud-update-delete',
    description: 'Learn updateOne, updateMany, deleteOne, and various update operators.',
    difficulty: 'beginner',
    duration: 35,
    tags: ['MongoDB', 'Update', 'Delete', 'Operators'],
    prerequisites: ['MongoDB CRUD: Create and Read'],
    objectives: [
      'Update documents with $set, $inc, $push',
      'Delete documents safely',
      'Use upsert operations',
      'Apply atomic updates'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Update Operations',
        content: 'Use update operators to modify documents atomically.',
        codeExamples: [{
          language: 'javascript',
          code: `// Set fields
await collection.updateOne(
  { name: 'Alice' },
  { $set: { age: 29, city: 'SF' } }
);

// Increment
await collection.updateOne(
  { name: 'Bob' },
  { $inc: { loginCount: 1 } }
);

// Push to array
await collection.updateOne(
  { name: 'Carol' },
  { $push: { skills: 'MongoDB' } }
);

// Upsert (insert if not exists)
await collection.updateOne(
  { email: 'new@example.com' },
  { $set: { name: 'New User' } },
  { upsert: true }
);`,
          explanation: 'Always use atomic operators for safe concurrent updates'
        }]
      }
    ]
  }),

  createTutorial({
    title: 'MongoDB Indexing for Performance',
    slug: 'mongodb-indexing-performance',
    description: 'Create and optimize indexes for faster queries. Learn compound, text, and geospatial indexes.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MongoDB', 'Indexing', 'Performance'],
    objectives: [
      'Create single and compound indexes',
      'Use explain() to analyze queries',
      'Optimize with the ESR rule',
      'Implement special index types'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Creating Indexes',
        content: 'Indexes dramatically improve query performance.',
        codeExamples: [{
          language: 'javascript',
          code: `// Single field index
await collection.createIndex({ email: 1 });

// Compound index (order matters!)
await collection.createIndex({ 
  city: 1, 
  age: 1 
});

// Unique index
await collection.createIndex(
  { username: 1 },
  { unique: true }
);

// Text search index
await collection.createIndex({
  title: 'text',
  content: 'text'
});`,
          explanation: '1 = ascending, -1 = descending order'
        }]
      },
      {
        stepNumber: 2,
        title: 'Query Optimization',
        content: 'Use explain() to verify index usage.',
        codeExamples: [{
          language: 'javascript',
          code: `// Check query execution
const explain = await collection
  .find({ city: 'NYC', age: { $gt: 25 } })
  .explain('executionStats');

console.log('Documents examined:', 
  explain.executionStats.totalDocsExamined);
console.log('Index used:', 
  explain.executionStats.executionStages.indexName);

// ESR Rule: Equality, Sort, Range
// Good index order:
await collection.createIndex({
  status: 1,      // Equality
  createdAt: -1,  // Sort
  price: 1        // Range
});`,
          explanation: 'Index usage saves scanning entire collection'
        }]
      }
    ]
  }),

  createTutorial({
    title: 'MongoDB Aggregation Framework',
    slug: 'mongodb-aggregation-framework',
    description: 'Master aggregation pipelines with $match, $group, $project, and $lookup stages.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Aggregation', 'Pipeline'],
    objectives: [
      'Build multi-stage pipelines',
      'Group and aggregate data',
      'Join collections with $lookup',
      'Transform documents'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Basic Pipeline Stages',
        content: 'Pipelines process documents through sequential stages.',
        codeExamples: [{
          language: 'javascript',
          code: `// Sales report
const report = await orders.aggregate([
  // Stage 1: Filter
  {
    $match: {
      status: 'completed',
      orderDate: { $gte: new Date('2024-01-01') }
    }
  },
  // Stage 2: Group and aggregate
  {
    $group: {
      _id: '$category',
      totalRevenue: { $sum: '$amount' },
      orderCount: { $sum: 1 },
      avgOrder: { $avg: '$amount' }
    }
  },
  // Stage 3: Sort
  {
    $sort: { totalRevenue: -1 }
  },
  // Stage 4: Limit
  {
    $limit: 10
  }
]);`,
          explanation: 'Each stage transforms data for next stage'
        }]
      }
    ]
  }),

  // Add 7 more MongoDB tutorials with similar structure...
  // (Continuing with remaining MongoDB and other databases)

  // ==================== SQL/MYSQL TUTORIALS (11) ====================
  createTutorial({
    title: 'SQL Basics: SELECT and WHERE',
    slug: 'sql-basics-select-where',
    description: 'Learn fundamental SQL queries with SELECT, WHERE, and ORDER BY.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 25,
    tags: ['SQL', 'MySQL', 'SELECT', 'WHERE'],
    objectives: [
      'Write SELECT statements',
      'Filter with WHERE clause',
      'Sort results with ORDER BY',
      'Use comparison operators'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Basic SELECT Queries',
        content: 'SELECT retrieves data from database tables.',
        codeExamples: [{
          language: 'sql',
          code: `-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email, age FROM users;

-- Filter with WHERE
SELECT * FROM users
WHERE age > 25;

-- Multiple conditions
SELECT * FROM users
WHERE age > 25 AND city = 'New York';

-- Sort results
SELECT * FROM users
ORDER BY age DESC
LIMIT 10;`,
          explanation: 'WHERE filters rows before returning results'
        }]
      }
    ]
  }),

  createTutorial({
    title: 'SQL Joins: Combining Tables',
    slug: 'sql-joins-combining-tables',
    description: 'Master INNER, LEFT, RIGHT, and FULL OUTER joins to combine data from multiple tables.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 35,
    tags: ['SQL', 'Joins', 'Tables'],
    objectives: [
      'Understand join types',
      'Combine data from multiple tables',
      'Use table aliases',
      'Handle NULL values in joins'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'INNER JOIN',
        content: 'Returns matching rows from both tables.',
        codeExamples: [{
          language: 'sql',
          code: `-- Get orders with customer info
SELECT 
  o.order_id,
  o.total,
  c.name,
  c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'completed';`,
          explanation: 'Only rows with matches in both tables are returned'
        }]
      },
      {
        stepNumber: 2,
        title: 'LEFT JOIN',
        content: 'Returns all rows from left table, matching rows from right.',
        codeExamples: [{
          language: 'sql',
          code: `-- All customers and their orders (if any)
SELECT 
  c.name,
  COUNT(o.id) as order_count,
  COALESCE(SUM(o.total), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;`,
          explanation: 'Customers without orders still appear with NULL'
        }]
      }
    ]
  }),

  // Continue with remaining 9 SQL tutorials...
  // (Aggregate Functions, Subqueries, Indexes, Transactions, Window Functions, etc.)

  // ==================== POSTGRESQL TUTORIALS (10) ====================
  createTutorial({
    title: 'PostgreSQL Fundamentals',
    slug: 'postgresql-fundamentals',
    description: 'Introduction to PostgreSQL features, setup, and basic operations.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 25,
    tags: ['PostgreSQL', 'SQL', 'Setup'],
    objectives: [
      'Understand PostgreSQL advantages',
      'Connect to PostgreSQL',
      'Create databases and tables',
      'Use psql command line'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'PostgreSQL Features',
        content: 'PostgreSQL is an advanced open-source relational database.',
        codeExamples: [{
          language: 'sql',
          code: `-- Create database
CREATE DATABASE myapp;

-- Connect (in psql)
\\c myapp

-- Create table with advanced types
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  profile JSONB,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert with RETURNING
INSERT INTO users (name, email, profile)
VALUES ('Alice', 'alice@example.com', '{"age": 28}'::jsonb)
RETURNING id, name;`,
          explanation: 'SERIAL auto-increments, JSONB stores JSON efficiently'
        }]
      }
    ]
  }),

  createTutorial({
    title: 'PostgreSQL JSONB Operations',
    slug: 'postgresql-jsonb-operations',
    description: 'Work with JSON data using PostgreSQL JSONB type and operators.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'JSONB', 'JSON'],
    objectives: [
      'Store and query JSON data',
      'Use JSONB operators',
      'Index JSON fields',
      'Update nested JSON'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'JSONB Queries',
        content: 'Query JSON data with specialized operators.',
        codeExamples: [{
          language: 'sql',
          code: `-- Query JSON fields
SELECT * FROM products
WHERE metadata->>'category' = 'electronics';

-- Nested access
SELECT name, 
  metadata->'specs'->>'cpu' as cpu
FROM products;

-- JSON array contains
SELECT * FROM users
WHERE tags @> '["premium"]';

-- Index JSONB for performance
CREATE INDEX idx_metadata_category 
ON products ((metadata->>'category'));`,
          explanation: '-> returns JSON, ->> returns text'
        }]
      }
    ]
  }),

  // Continue with remaining 8 PostgreSQL tutorials...
  // (CTEs, Full-Text Search, Window Functions, Partitioning, etc.)

  // ==================== REDIS TUTORIALS (10) ====================
  createTutorial({
    title: 'Redis Fundamentals: Key-Value Store',
    slug: 'redis-fundamentals-key-value',
    description: 'Learn Redis basics, data types, and common use cases.',
    language: 'javascript',
    difficulty: 'beginner',
    duration: 20,
    tags: ['Redis', 'Cache', 'Key-Value'],
    objectives: [
      'Understand Redis use cases',
      'Connect to Redis',
      'Work with strings and keys',
      'Set expiration times'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Getting Started with Redis',
        content: 'Redis is an in-memory data store used for caching and real-time applications.',
        codeExamples: [{
          language: 'javascript',
          code: `const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

await client.connect();

// Set key-value
await client.set('user:1:name', 'Alice');

// Get value
const name = await client.get('user:1:name');

// Set with expiration (TTL)
await client.setEx('session:abc123', 3600, 'user_data');

// Check if key exists
const exists = await client.exists('user:1:name');

// Delete key
await client.del('user:1:name');`,
          explanation: 'All Redis data is stored in RAM for speed'
        }]
      }
    ]
  }),

  createTutorial({
    title: 'Redis Data Types: Lists, Sets, Hashes',
    slug: 'redis-data-types',
    description: 'Master Redis data structures including lists, sets, sorted sets, and hashes.',
    language: 'javascript',
    difficulty: 'beginner',
    duration: 30,
    tags: ['Redis', 'Data Types', 'Lists', 'Sets'],
    objectives: [
      'Use Redis lists for queues',
      'Work with sets for uniqueness',
      'Store objects with hashes',
      'Implement sorted sets'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Lists (Ordered Collections)',
        content: 'Lists are ordered sequences of strings.',
        codeExamples: [{
          language: 'javascript',
          code: `// Push to list (queue)
await client.rPush('queue:tasks', 'task1');
await client.rPush('queue:tasks', 'task2');

// Pop from list
const task = await client.lPop('queue:tasks');

// Get range
const tasks = await client.lRange('queue:tasks', 0, -1);

// List length
const count = await client.lLen('queue:tasks');`,
          explanation: 'Use for queues, activity feeds, messaging'
        }]
      },
      {
        stepNumber: 2,
        title: 'Hashes (Objects)',
        content: 'Hashes store field-value pairs, like objects.',
        codeExamples: [{
          language: 'javascript',
          code: `// Set hash fields
await client.hSet('user:1', {
  name: 'Alice',
  email: 'alice@example.com',
  age: '28'
});

// Get single field
const name = await client.hGet('user:1', 'name');

// Get all fields
const user = await client.hGetAll('user:1');

// Increment numeric field
await client.hIncrBy('user:1', 'loginCount', 1);`,
          explanation: 'Efficient for storing objects with many fields'
        }]
      }
    ]
  }),

  // ==================== REMAINING MONGODB TUTORIALS ====================
  createTutorial({
    title: 'MongoDB Aggregation: Advanced Pipelines',
    slug: 'mongodb-aggregation-advanced',
    description: 'Master complex aggregation with $unwind, $facet, and $graphLookup.',
    difficulty: 'intermediate',
    duration: 50,
    tags: ['MongoDB', 'Aggregation', 'Advanced'],
    objectives: ['Use $unwind for arrays', 'Create faceted searches', 'Perform graph lookups'],
    steps: [{
      stepNumber: 1,
      title: 'Advanced Aggregation',
      content: '$unwind deconstructs arrays, $facet creates multiple pipelines.',
      codeExamples: [{
        language: 'javascript',
        code: `// Multi-faceted aggregation
const result = await collection.aggregate([
  { $match: { status: 'active' } },
  {
    $facet: {
      byCategory: [
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ],
      topProducts: [
        { $sort: { sales: -1 } },
        { $limit: 10 }
      ],
      priceRanges: [
        { $bucket: {
          groupBy: '$price',
          boundaries: [0, 50, 100, 500, 1000],
          default: 'expensive'
        }}
      ]
    }
  }
]);`,
        explanation: '$facet runs multiple sub-pipelines on same data'
      }]
    }]
  }),

  createTutorial({
    title: 'MongoDB Schema Design Patterns',
    slug: 'mongodb-schema-design',
    description: 'Learn embedding vs referencing, polymorphic patterns, and schema anti-patterns.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Schema', 'Design'],
    objectives: ['Choose embedding vs referencing', 'Design for read/write patterns', 'Avoid anti-patterns'],
    steps: [{
      stepNumber: 1,
      title: 'Embedding vs Referencing',
      content: 'Embed for one-to-few, reference for one-to-many relationships.',
      codeExamples: [{
        language: 'javascript',
        code: `// Embedded (one-to-few)
{
  _id: 1,
  name: "Blog Post",
  comments: [
    { user: "Alice", text: "Great!" },
    { user: "Bob", text: "Thanks" }
  ]
}

// Referenced (one-to-many)
// Post document
{ _id: 1, title: "Post", authorId: 101 }
// Author document
{ _id: 101, name: "John", posts: [1, 2, 3, ...] }`,
        explanation: 'Embed for atomic updates, reference for unbounded growth'
      }]
    }]
  }),

  createTutorial({
    title: 'MongoDB Transactions and ACID',
    slug: 'mongodb-transactions-acid',
    description: 'Implement multi-document transactions with MongoDB sessions.',
    difficulty: 'advanced',
    duration: 40,
    tags: ['MongoDB', 'Transactions', 'ACID'],
    objectives: ['Use multi-document transactions', 'Handle transaction errors', 'Ensure ACID compliance'],
    steps: [{
      stepNumber: 1,
      title: 'Multi-Document Transactions',
      content: 'Transactions ensure atomicity across multiple operations.',
      codeExamples: [{
        language: 'javascript',
        code: `const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne(
      { _id: 'alice' },
      { $inc: { balance: -100 } },
      { session }
    );
    await accounts.updateOne(
      { _id: 'bob' },
      { $inc: { balance: 100 } },
      { session }
    );
  });
} finally {
  await session.endSession();
}`,
        explanation: 'All operations succeed or all fail together'
      }]
    }]
  }),

  createTutorial({
    title: 'MongoDB Replication and High Availability',
    slug: 'mongodb-replication-ha',
    description: 'Set up replica sets for fault tolerance and read scaling.',
    difficulty: 'advanced',
    duration: 50,
    tags: ['MongoDB', 'Replication', 'HA'],
    objectives: ['Configure replica sets', 'Handle failover', 'Scale reads with secondaries'],
    steps: [{
      stepNumber: 1,
      title: 'Replica Set Configuration',
      content: 'Replica sets provide automatic failover and data redundancy.',
      codeExamples: [{
        language: 'javascript',
        code: `// Connect to replica set
const client = new MongoClient(
  'mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=myReplSet'
);

// Read from secondary
const db = client.db('mydb');
const collection = db.collection('data');
const data = await collection.find({})
  .readPreference('secondary')
  .toArray();`,
        explanation: 'Read from secondaries for read-heavy workloads'
      }]
    }]
  }),

  createTutorial({
    title: 'MongoDB Sharding and Scaling',
    slug: 'mongodb-sharding-scaling',
    description: 'Scale horizontally with sharding for massive datasets.',
    difficulty: 'advanced',
    duration: 55,
    tags: ['MongoDB', 'Sharding', 'Scaling'],
    objectives: ['Understand shard keys', 'Configure sharded clusters', 'Balance shard distribution'],
    steps: [{
      stepNumber: 1,
      title: 'Sharding Basics',
      content: 'Sharding distributes data across multiple servers.',
      codeExamples: [{
        language: 'javascript',
        code: `// Enable sharding
sh.enableSharding("mydb");

// Shard collection by key
sh.shardCollection("mydb.users", { "userId": "hashed" });

// Check shard distribution
db.users.getShardDistribution();`,
        explanation: 'Choose shard key carefully - it cannot be changed later'
      }]
    }]
  }),

  createTutorial({
    title: 'MongoDB Security Best Practices',
    slug: 'mongodb-security',
    description: 'Secure MongoDB with authentication, encryption, and access control.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['MongoDB', 'Security', 'Authentication'],
    objectives: ['Enable authentication', 'Create user roles', 'Encrypt connections'],
    steps: [{
      stepNumber: 1,
      title: 'Authentication and Authorization',
      content: 'Always enable auth and use role-based access control.',
      codeExamples: [{
        language: 'javascript',
        code: `// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strongpassword",
  roles: ["userAdminAnyDatabase"]
});

// Create app user with specific permissions
use myapp
db.createUser({
  user: "appuser",
  pwd: "password",
  roles: [{ role: "readWrite", db: "myapp" }]
});`,
        explanation: 'Never use default configuration in production'
      }]
    }]
  }),

  createTutorial({
    title: 'MongoDB Performance Optimization',
    slug: 'mongodb-performance',
    description: 'Advanced techniques for MongoDB performance tuning.',
    difficulty: 'advanced',
    duration: 60,
    tags: ['MongoDB', 'Performance', 'Tuning'],
    objectives: ['Profile slow queries', 'Optimize index usage', 'Configure WiredTiger'],
    steps: [{
      stepNumber: 1,
      title: 'Query Profiling',
      content: 'Use profiler to identify slow queries.',
      codeExamples: [{
        language: 'javascript',
        code: `// Enable profiling
db.setProfilingLevel(1, { slowms: 100 });

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } })
  .sort({ ts: -1 })
  .limit(10);

// Analyze query
db.collection.find({ field: value })
  .hint({ field: 1 })
  .explain("executionStats");`,
        explanation: 'Profile in staging, not production'
      }]
    }]
  }),

  // ==================== REMAINING SQL TUTORIALS ====================
  createTutorial({
    title: 'SQL Aggregate Functions and GROUP BY',
    slug: 'sql-aggregate-functions',
    description: 'Master COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'Aggregation', 'GROUP BY'],
    objectives: ['Use aggregate functions', 'Group results', 'Filter groups with HAVING'],
    steps: [{
      stepNumber: 1,
      title: 'Aggregation Basics',
      content: 'Aggregate functions perform calculations on sets of rows.',
      codeExamples: [{
        language: 'sql',
        code: `-- Sales by category
SELECT
  category,
  COUNT(*) as product_count,
  SUM(quantity) as total_sold,
  AVG(price) as avg_price,
  MAX(price) as max_price
FROM products
GROUP BY category
HAVING COUNT(*) > 10
ORDER BY total_sold DESC;`,
        explanation: 'HAVING filters groups, WHERE filters rows'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Subqueries and Nested Queries',
    slug: 'sql-subqueries',
    description: 'Use subqueries in SELECT, WHERE, and FROM clauses.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['SQL', 'Subqueries', 'Nested'],
    objectives: ['Write scalar subqueries', 'Use correlated subqueries', 'Optimize subquery performance'],
    steps: [{
      stepNumber: 1,
      title: 'Subquery Types',
      content: 'Subqueries can return single values, rows, or tables.',
      codeExamples: [{
        language: 'sql',
        code: `-- Find above-average products
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Correlated subquery
SELECT e.name, e.salary
FROM employees e
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department_id = e.department_id
);`,
        explanation: 'Correlated subqueries reference outer query'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Views and Stored Procedures',
    slug: 'sql-views-procedures',
    description: 'Create reusable views and stored procedures.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['SQL', 'Views', 'Procedures'],
    objectives: ['Create and use views', 'Write stored procedures', 'Use parameters and variables'],
    steps: [{
      stepNumber: 1,
      title: 'Creating Views',
      content: 'Views are virtual tables based on queries.',
      codeExamples: [{
        language: 'sql',
        code: `-- Create view
CREATE VIEW active_users AS
SELECT id, name, email, last_login
FROM users
WHERE status = 'active';

-- Use view
SELECT * FROM active_users
WHERE last_login > NOW() - INTERVAL 30 DAY;

-- Stored procedure
CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
  SELECT * FROM orders WHERE customer_id = user_id;
END;

CALL GetUserOrders(123);`,
        explanation: 'Views simplify complex queries'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Indexes and Query Optimization',
    slug: 'sql-indexes-optimization',
    description: 'Create indexes and optimize SQL query performance.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['SQL', 'Indexes', 'Optimization'],
    objectives: ['Create appropriate indexes', 'Use EXPLAIN plans', 'Optimize queries'],
    steps: [{
      stepNumber: 1,
      title: 'Index Creation',
      content: 'Indexes speed up WHERE, JOIN, and ORDER BY operations.',
      codeExamples: [{
        language: 'sql',
        code: `-- Single column index
CREATE INDEX idx_email ON users(email);

-- Composite index
CREATE INDEX idx_city_age ON users(city, age);

-- Unique index
CREATE UNIQUE INDEX idx_username ON users(username);

-- Check index usage
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';`,
        explanation: 'Too many indexes slow down INSERT/UPDATE'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Transactions and ACID Properties',
    slug: 'sql-transactions-acid',
    description: 'Ensure data integrity with transactions.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['SQL', 'Transactions', 'ACID'],
    objectives: ['Use BEGIN/COMMIT/ROLLBACK', 'Understand isolation levels', 'Handle deadlocks'],
    steps: [{
      stepNumber: 1,
      title: 'Transaction Basics',
      content: 'Transactions ensure all-or-nothing execution.',
      codeExamples: [{
        language: 'sql',
        code: `START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT; -- or ROLLBACK on error`,
        explanation: 'ACID: Atomicity, Consistency, Isolation, Durability'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Window Functions and Analytics',
    slug: 'sql-window-functions',
    description: 'Advanced analytics with ROW_NUMBER, RANK, and window functions.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 50,
    tags: ['SQL', 'Window Functions', 'Analytics'],
    objectives: ['Use ROW_NUMBER and RANK', 'Calculate running totals', 'Perform moving averages'],
    steps: [{
      stepNumber: 1,
      title: 'Window Functions',
      content: 'Perform calculations across rows related to current row.',
      codeExamples: [{
        language: 'sql',
        code: `-- Row numbers within groups
SELECT
  name,
  category,
  revenue,
  ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rank
FROM products;

-- Running total
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM sales;`,
        explanation: 'Window functions don not reduce result rows'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Database Design and Normalization',
    slug: 'sql-database-design',
    description: 'Design normalized databases with 1NF, 2NF, 3NF, and BCNF.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['SQL', 'Design', 'Normalization'],
    objectives: ['Understand normal forms', 'Design ER diagrams', 'Choose appropriate data types'],
    steps: [{
      stepNumber: 1,
      title: 'Normalization Basics',
      content: 'Normalization eliminates redundancy and anomalies.',
      codeExamples: [{
        language: 'sql',
        code: `-- Unnormalized (bad)
CREATE TABLE orders_bad (
  order_id INT,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  product_names TEXT  -- Comma-separated!
);

-- Normalized (good)
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);`,
        explanation: '3NF is usually sufficient for most applications'
      }]
    }]
  }),

  createTutorial({
    title: 'MySQL Specific Features',
    slug: 'mysql-specific-features',
    description: 'MySQL-specific features: JSON functions, full-text search, and more.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MySQL', 'JSON', 'Features'],
    objectives: ['Use JSON functions', 'Implement full-text search', 'Work with generated columns'],
    steps: [{
      stepNumber: 1,
      title: 'JSON Support',
      content: 'MySQL has native JSON support with operators and functions.',
      codeExamples: [{
        language: 'sql',
        code: `-- Create table with JSON
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  attributes JSON
);

-- Insert JSON
INSERT INTO products VALUES
(1, 'Laptop', '{"brand": "Dell", "ram": 16}');

-- Query JSON
SELECT id, name, attributes->'$.brand' as brand
FROM products
WHERE attributes->>'$.ram' >= 16;

-- Full-text search
CREATE FULLTEXT INDEX ft_description ON products(description);

SELECT * FROM products
WHERE MATCH(description) AGAINST('gaming laptop');`,
        explanation: 'JSON type is more efficient than TEXT'
      }]
    }]
  }),

  createTutorial({
    title: 'SQL Performance Tuning',
    slug: 'sql-performance-tuning',
    description: 'Advanced SQL performance optimization techniques.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 55,
    tags: ['SQL', 'Performance', 'Tuning'],
    objectives: ['Analyze slow queries', 'Optimize joins', 'Use query hints'],
    steps: [{
      stepNumber: 1,
      title: 'Query Optimization',
      content: 'Identify and fix performance bottlenecks.',
      codeExamples: [{
        language: 'sql',
        code: `-- Enable query logging
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Analyze query
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.city = 'NYC';

-- Optimize with index
CREATE INDEX idx_customer_city ON customers(city);

-- Force index usage
SELECT * FROM users FORCE INDEX (idx_email)
WHERE email LIKE 'test%';`,
        explanation: 'Always test optimizations with production-like data'
      }]
    }]
  }),

  // ==================== REMAINING POSTGRESQL TUTORIALS ====================
  createTutorial({
    title: 'PostgreSQL CTEs and Advanced Queries',
    slug: 'postgresql-ctes',
    description: 'Master Common Table Expressions and recursive queries.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'CTEs', 'Recursive'],
    objectives: ['Write CTEs', 'Create recursive queries', 'Optimize complex queries'],
    steps: [{
      stepNumber: 1,
      title: 'Common Table Expressions',
      content: 'CTEs make complex queries more readable.',
      codeExamples: [{
        language: 'sql',
        code: `-- Simple CTE
WITH high_value_customers AS (
  SELECT customer_id, SUM(amount) as total
  FROM orders
  GROUP BY customer_id
  HAVING SUM(amount) > 1000
)
SELECT c.name, hvc.total
FROM customers c
JOIN high_value_customers hvc ON c.id = hvc.customer_id;

-- Recursive CTE (organizational hierarchy)
WITH RECURSIVE org_tree AS (
  SELECT id, name, manager_id, 1 as level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id, e.name, e.manager_id, ot.level + 1
  FROM employees e
  JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT * FROM org_tree ORDER BY level;`,
        explanation: 'CTEs are evaluated once and can be referenced multiple times'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Full-Text Search',
    slug: 'postgresql-full-text-search',
    description: 'Implement powerful full-text search with tsvector and tsquery.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['PostgreSQL', 'Search', 'Text'],
    objectives: ['Create text search indexes', 'Rank search results', 'Use different languages'],
    steps: [{
      stepNumber: 1,
      title: 'Text Search Basics',
      content: 'PostgreSQL has built-in full-text search capabilities.',
      codeExamples: [{
        language: 'sql',
        code: `-- Add tsvector column
ALTER TABLE articles
ADD COLUMN search_vector tsvector;

-- Update search vector
UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || content);

-- Create GIN index for fast search
CREATE INDEX idx_search ON articles USING GIN(search_vector);

-- Search with ranking
SELECT title,
       ts_rank(search_vector, query) as rank
FROM articles,
     to_tsquery('english', 'postgresql & performance') query
WHERE search_vector @@ query
ORDER BY rank DESC;`,
        explanation: 'GIN indexes make text search very fast'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Array Operations',
    slug: 'postgresql-arrays',
    description: 'Work with array data types and operators.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'Arrays', 'Data Types'],
    objectives: ['Use array types', 'Query array elements', 'Perform array operations'],
    steps: [{
      stepNumber: 1,
      title: 'Array Basics',
      content: 'PostgreSQL supports multi-dimensional arrays.',
      codeExamples: [{
        language: 'sql',
        code: `-- Create table with array
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT,
  tags TEXT[]
);

-- Insert array data
INSERT INTO posts VALUES
(1, 'PostgreSQL Tutorial', ARRAY['database', 'sql', 'postgres']);

-- Query arrays
SELECT * FROM posts WHERE 'database' = ANY(tags);
SELECT * FROM posts WHERE tags @> ARRAY['sql'];

-- Array functions
SELECT id, array_length(tags, 1) as tag_count FROM posts;
SELECT unnest(tags) as tag, COUNT(*)
FROM posts
GROUP BY tag;`,
        explanation: 'Arrays are useful for storing lists without JOIN tables'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Window Functions',
    slug: 'postgresql-window-functions',
    description: 'Advanced analytics with PostgreSQL window functions.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['PostgreSQL', 'Window', 'Analytics'],
    objectives: ['Use window frames', 'Calculate moving averages', 'Perform gap analysis'],
    steps: [{
      stepNumber: 1,
      title: 'Advanced Windows',
      content: 'PostgreSQL has extensive window function support.',
      codeExamples: [{
        language: 'sql',
        code: `-- Moving average
SELECT
  date,
  revenue,
  AVG(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as moving_avg_7d
FROM daily_sales;

-- First and last value
SELECT
  category,
  product,
  sales,
  FIRST_VALUE(product) OVER (
    PARTITION BY category ORDER BY sales DESC
  ) as top_product
FROM products;`,
        explanation: 'Window frames define which rows to include in calculation'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Indexing Strategies',
    slug: 'postgresql-indexing',
    description: 'Advanced indexing with B-tree, GiST, GIN, and BRIN.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'Indexing', 'Performance'],
    objectives: ['Choose index types', 'Create partial indexes', 'Use expression indexes'],
    steps: [{
      stepNumber: 1,
      title: 'Index Types',
      content: 'Different index types for different use cases.',
      codeExamples: [{
        language: 'sql',
        code: `-- B-tree (default, for ordering)
CREATE INDEX idx_user_email ON users(email);

-- GIN (for full-text, JSONB, arrays)
CREATE INDEX idx_tags ON posts USING GIN(tags);

-- GiST (for geometric data)
CREATE INDEX idx_location ON places USING GIST(location);

-- Partial index (only some rows)
CREATE INDEX idx_active_users ON users(email)
WHERE status = 'active';

-- Expression index
CREATE INDEX idx_lower_email ON users(LOWER(email));`,
        explanation: 'Choose index type based on query patterns'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Partitioning',
    slug: 'postgresql-partitioning',
    description: 'Scale large tables with range and list partitioning.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 50,
    tags: ['PostgreSQL', 'Partitioning', 'Scaling'],
    objectives: ['Create partitioned tables', 'Manage partitions', 'Query partitioned data'],
    steps: [{
      stepNumber: 1,
      title: 'Table Partitioning',
      content: 'Partitioning improves query performance on large tables.',
      codeExamples: [{
        language: 'sql',
        code: `-- Create partitioned table
CREATE TABLE orders (
  id BIGSERIAL,
  order_date DATE NOT NULL,
  amount DECIMAL
) PARTITION BY RANGE (order_date);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Query automatically routes to correct partition
SELECT * FROM orders WHERE order_date >= '2024-01-15';`,
        explanation: 'Partitioning allows efficient data management and archival'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Replication and Backup',
    slug: 'postgresql-replication',
    description: 'Set up streaming replication and backup strategies.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 45,
    tags: ['PostgreSQL', 'Replication', 'Backup'],
    objectives: ['Configure streaming replication', 'Perform backups', 'Handle failover'],
    steps: [{
      stepNumber: 1,
      title: 'Streaming Replication',
      content: 'Replication provides high availability and read scaling.',
      codeExamples: [{
        language: 'sql',
        code: `-- On primary server (postgresql.conf)
-- wal_level = replica
-- max_wal_senders = 3

-- Create replication user
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'password';

-- pg_basebackup on standby
pg_basebackup -h primary_host -D /var/lib/postgresql/data -U replicator -P

-- Create standby.signal file
touch /var/lib/postgresql/data/standby.signal

-- Continuous backup
pg_dump dbname > backup.sql
pg_dumpall > all_databases.sql`,
        explanation: 'Always test restore procedures regularly'
      }]
    }]
  }),

  createTutorial({
    title: 'PostgreSQL Performance Optimization',
    slug: 'postgresql-performance',
    description: 'Advanced PostgreSQL performance tuning.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 55,
    tags: ['PostgreSQL', 'Performance', 'Tuning'],
    objectives: ['Tune configuration', 'Optimize queries', 'Monitor performance'],
    steps: [{
      stepNumber: 1,
      title: 'Performance Tuning',
      content: 'Optimize PostgreSQL for your workload.',
      codeExamples: [{
        language: 'sql',
        code: `-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Analyze table statistics
ANALYZE users;

-- Vacuum to reclaim space
VACUUM ANALYZE users;

-- Check table bloat
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Connection pooling with pgBouncer recommended`,
        explanation: 'Regular VACUUM and ANALYZE are essential'
      }]
    }]
  }),

  // ==================== REMAINING REDIS TUTORIALS ====================
  createTutorial({
    title: 'Redis Sorted Sets and Leaderboards',
    slug: 'redis-sorted-sets',
    description: 'Build leaderboards and ranked lists with sorted sets.',
    difficulty: 'beginner',
    duration: 25,
    tags: ['Redis', 'Sorted Sets', 'Leaderboards'],
    objectives: ['Use sorted sets', 'Build real-time leaderboards', 'Query by rank and score'],
    steps: [{
      stepNumber: 1,
      title: 'Sorted Sets Basics',
      content: 'Sorted sets maintain order by score automatically.',
      codeExamples: [{
        language: 'javascript',
        code: `// Add players with scores
await client.zAdd('leaderboard', [
  { score: 1000, value: 'player1' },
  { score: 850, value: 'player2' },
  { score: 920, value: 'player3' }
]);

// Get top 10
const top10 = await client.zRevRange('leaderboard', 0, 9, {
  withScores: true
});

// Get player rank
const rank = await client.zRevRank('leaderboard', 'player1');

// Increment score
await client.zIncrBy('leaderboard', 50, 'player2');`,
        explanation: 'Perfect for real-time leaderboards and ranking systems'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Pub/Sub Messaging',
    slug: 'redis-pubsub',
    description: 'Build real-time messaging with Redis Pub/Sub.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Pub/Sub', 'Messaging'],
    objectives: ['Publish messages', 'Subscribe to channels', 'Use pattern matching'],
    steps: [{
      stepNumber: 1,
      title: 'Pub/Sub Basics',
      content: 'Redis Pub/Sub enables real-time message broadcasting.',
      codeExamples: [{
        language: 'javascript',
        code: `// Subscriber
const subscriber = client.duplicate();
await subscriber.connect();

await subscriber.subscribe('notifications', (message) => {
  console.log('Received:', message);
});

// Publisher
await client.publish('notifications', JSON.stringify({
  type: 'new_order',
  orderId: 123
}));

// Pattern subscribe
await subscriber.pSubscribe('user:*:messages', (message, channel) => {
  console.log(\`Message on \${channel}: \${message}\`);
});`,
        explanation: 'Messages are not persisted, use Streams for persistence'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Caching Strategies',
    slug: 'redis-caching-strategies',
    description: 'Implement effective caching patterns with Redis.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Caching', 'Patterns'],
    objectives: ['Implement cache-aside', 'Use write-through caching', 'Handle cache invalidation'],
    steps: [{
      stepNumber: 1,
      title: 'Cache-Aside Pattern',
      content: 'Most common caching pattern for read-heavy workloads.',
      codeExamples: [{
        language: 'javascript',
        code: `async function getUser(userId) {
  // Try cache first
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from DB
  const user = await db.users.findById(userId);

  // Store in cache with TTL
  await redis.setEx(
    \`user:\${userId}\`,
    3600,
    JSON.stringify(user)
  );

  return user;
}

// Invalidate on update
async function updateUser(userId, data) {
  await db.users.update(userId, data);
  await redis.del(\`user:\${userId}\`); // Invalidate cache
}`,
        explanation: 'Always set TTL to prevent stale data'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Transactions and Lua Scripting',
    slug: 'redis-transactions-lua',
    description: 'Ensure atomicity with MULTI/EXEC and Lua scripts.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['Redis', 'Transactions', 'Lua'],
    objectives: ['Use MULTI/EXEC', 'Write Lua scripts', 'Ensure atomic operations'],
    steps: [{
      stepNumber: 1,
      title: 'Transactions',
      content: 'MULTI/EXEC ensures multiple commands execute atomically.',
      codeExamples: [{
        language: 'javascript',
        code: `// Transaction
const multi = client.multi();
multi.set('key1', 'value1');
multi.incr('counter');
multi.hSet('hash1', 'field1', 'value1');
await multi.exec();

// Lua script for atomic rate limiting
const script = \`
  local current = redis.call('INCR', KEYS[1])
  if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
  end
  if current > tonumber(ARGV[2]) then
    return 0
  end
  return 1
\`;

const allowed = await client.eval(script, {
  keys: ['rate_limit:user:123'],
  arguments: ['60', '10'] // 10 requests per 60 seconds
});`,
        explanation: 'Lua scripts are atomic and reduce network roundtrips'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Persistence: RDB and AOF',
    slug: 'redis-persistence',
    description: 'Configure Redis persistence for durability.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Persistence', 'RDB', 'AOF'],
    objectives: ['Configure RDB snapshots', 'Enable AOF', 'Choose persistence strategy'],
    steps: [{
      stepNumber: 1,
      title: 'Persistence Options',
      content: 'RDB for snapshots, AOF for write logging.',
      codeExamples: [{
        language: 'javascript',
        code: `# redis.conf

# RDB snapshots
save 900 1      # Save if 1 key changed in 900s
save 300 10     # Save if 10 keys changed in 300s
save 60 10000   # Save if 10000 keys changed in 60s

# AOF (Append Only File)
appendonly yes
appendfsync everysec  # fsync every second

# Hybrid mode (Redis 4.0+)
aof-use-rdb-preamble yes`,
        explanation: 'RDB is faster to load, AOF provides better durability'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Cluster and High Availability',
    slug: 'redis-cluster-ha',
    description: 'Scale Redis with clustering and ensure high availability.',
    difficulty: 'advanced',
    duration: 50,
    tags: ['Redis', 'Cluster', 'HA'],
    objectives: ['Set up Redis Cluster', 'Configure Sentinel', 'Handle failover'],
    steps: [{
      stepNumber: 1,
      title: 'Redis Cluster',
      content: 'Cluster automatically shards data across nodes.',
      codeExamples: [{
        language: 'javascript',
        code: `// Create cluster
redis-cli --cluster create \\
  127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \\
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \\
  --cluster-replicas 1

// Connect to cluster
const redis = require('redis');
const cluster = redis.createCluster({
  rootNodes: [
    { host: '127.0.0.1', port: 7000 },
    { host: '127.0.0.1', port: 7001 },
    { host: '127.0.0.1', port: 7002 }
  ]
});

await cluster.connect();`,
        explanation: 'Cluster provides automatic sharding and replication'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Streams for Event Sourcing',
    slug: 'redis-streams',
    description: 'Build event-driven architectures with Redis Streams.',
    difficulty: 'advanced',
    duration: 45,
    tags: ['Redis', 'Streams', 'Events'],
    objectives: ['Use Redis Streams', 'Implement consumer groups', 'Build event sourcing'],
    steps: [{
      stepNumber: 1,
      title: 'Streams Basics',
      content: 'Streams are append-only logs with consumer groups.',
      codeExamples: [{
        language: 'javascript',
        code: `// Add to stream
await client.xAdd('events', '*', {
  type: 'order_created',
  orderId: '123',
  amount: '99.99'
});

// Create consumer group
await client.xGroupCreate('events', 'processors', '0', {
  MKSTREAM: true
});

// Read from group
const messages = await client.xReadGroup('processors', 'consumer1', {
  key: 'events',
  id: '>'
}, { COUNT: 10 });

// Acknowledge
await client.xAck('events', 'processors', messageId);`,
        explanation: 'Streams provide at-least-once delivery guarantees'
      }]
    }]
  }),

  createTutorial({
    title: 'Redis Performance and Best Practices',
    slug: 'redis-performance',
    description: 'Optimize Redis for maximum performance.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Performance', 'Best Practices'],
    objectives: ['Optimize memory usage', 'Use pipelining', 'Monitor performance'],
    steps: [{
      stepNumber: 1,
      title: 'Performance Optimization',
      content: 'Redis is fast, but can be optimized further.',
      codeExamples: [{
        language: 'javascript',
        code: `// Pipeline multiple commands
const pipeline = client.multi();
for (let i = 0; i < 1000; i++) {
  pipeline.set(\`key\${i}\`, \`value\${i}\`);
}
await pipeline.exec();

// Use hashes for small objects (memory efficient)
await client.hSet('user:1', {
  name: 'Alice',
  age: '28',
  email: 'alice@example.com'
});

// Monitor memory
const info = await client.info('memory');
console.log(info);

// Scan instead of KEYS (non-blocking)
for await (const key of client.scanIterator({
  MATCH: 'user:*',
  COUNT: 100
})) {
  console.log(key);
}`,
        explanation: 'Never use KEYS in production - it blocks the server'
      }]
    }]
  })
];

async function seedDatabaseTutorials() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Delete existing database tutorials
    const deleteResult = await MongoTutorial.deleteMany({
      category: 'Database'
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing database tutorials`);

    // Insert new tutorials
    const result = await MongoTutorial.insertMany(databaseTutorials);
    console.log(`\n✅ Successfully seeded ${result.length} database tutorials`);

    // Display summary
    const byDifficulty = databaseTutorials.reduce((acc, t) => {
      acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
      return acc;
    }, {});

    const byTopic = databaseTutorials.reduce((acc, t) => {
      const topic = t.tags[0];
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Difficulty Distribution:');
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      console.log(`   ${diff}: ${count} tutorials`);
    });

    console.log('\n📈 By Database:');
    Object.entries(byTopic).forEach(([topic, count]) => {
      console.log(`   ${topic}: ${count} tutorials`);
    });

    mongoose.connection.close();
    console.log('\n✨ Database tutorial seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database tutorials:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabaseTutorials();
}

module.exports = seedDatabaseTutorials;
