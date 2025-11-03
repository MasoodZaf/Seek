require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const DatabaseTutorial = require('../models/DatabaseTutorial');

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

// DOUBLED: 86 total database tutorials (was 43)
const databaseTutorials = [
  // ==================== MONGODB TUTORIALS (24 - DOUBLED from 12) ====================
  createTutorial({
    title: 'MongoDB Fundamentals: Introduction to NoSQL',
    slug: 'mongodb-fundamentals-intro-nosql',
    description: 'Learn MongoDB basics, NoSQL concepts, and document-based data models.',
    difficulty: 'beginner',
    duration: 25,
    tags: ['MongoDB', 'NoSQL', 'Database Basics'],
    objectives: ['Understand NoSQL vs SQL', 'Learn MongoDB document structure', 'Connect to MongoDB', 'Perform basic operations'],
    steps: [{ stepNumber: 1, title: 'What is MongoDB', content: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.', codeExamples: [{ language: 'javascript', code: '// Example MongoDB document\n{ "_id": ObjectId("507f..."), "name": "John Doe", "age": 30 }', explanation: 'Documents are flexible - fields can vary' }] }]
  }),
  createTutorial({
    title: 'MongoDB CRUD Operations: Create and Read',
    slug: 'mongodb-crud-create-read',
    description: 'Master insertOne, insertMany, find, and findOne operations with query operators.',
    difficulty: 'beginner',
    duration: 30,
    tags: ['MongoDB', 'CRUD', 'Insert', 'Find'],
    objectives: ['Insert documents', 'Query with filters', 'Use comparison operators', 'Sort and project'],
    steps: [{ stepNumber: 1, title: 'Inserting Documents', content: 'Use insertOne() and insertMany() to add documents.', codeExamples: [{ language: 'javascript', code: 'await collection.insertOne({ name: "Alice", age: 28 });', explanation: 'MongoDB auto-generates _id' }] }]
  }),
  createTutorial({
    title: 'MongoDB CRUD: Update and Delete',
    slug: 'mongodb-crud-update-delete',
    description: 'Learn updateOne, updateMany, deleteOne, and various update operators.',
    difficulty: 'beginner',
    duration: 35,
    tags: ['MongoDB', 'Update', 'Delete', 'Operators'],
    objectives: ['Update with $set, $inc, $push', 'Delete documents safely', 'Use upsert operations'],
    steps: [{ stepNumber: 1, title: 'Update Operations', content: 'Use update operators to modify documents atomically.', codeExamples: [{ language: 'javascript', code: 'await collection.updateOne({ name: "Alice" }, { $set: { age: 29 } });', explanation: 'Always use atomic operators' }] }]
  }),
  createTutorial({
    title: 'MongoDB Indexing for Performance',
    slug: 'mongodb-indexing-performance',
    description: 'Create and optimize indexes for faster queries.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MongoDB', 'Indexing', 'Performance'],
    objectives: ['Create single and compound indexes', 'Use explain() to analyze queries', 'Optimize with ESR rule'],
    steps: [{ stepNumber: 1, title: 'Creating Indexes', content: 'Indexes dramatically improve query performance.', codeExamples: [{ language: 'javascript', code: 'await collection.createIndex({ email: 1 });', explanation: '1 = ascending, -1 = descending' }] }]
  }),
  createTutorial({
    title: 'MongoDB Aggregation Framework',
    slug: 'mongodb-aggregation-framework',
    description: 'Master aggregation pipelines with $match, $group, $project, and $lookup.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Aggregation', 'Pipeline'],
    objectives: ['Build multi-stage pipelines', 'Group and aggregate data', 'Join collections with $lookup'],
    steps: [{ stepNumber: 1, title: 'Basic Pipeline Stages', content: 'Pipelines process documents through sequential stages.', codeExamples: [{ language: 'javascript', code: 'await orders.aggregate([{ $match: { status: "completed" }}, { $group: { _id: "$category", total: { $sum: "$amount" }}}]);', explanation: 'Each stage transforms data' }] }]
  }),
  createTutorial({
    title: 'MongoDB Aggregation: Advanced Pipelines',
    slug: 'mongodb-aggregation-advanced',
    description: 'Master complex aggregation with $unwind, $facet, and $graphLookup.',
    difficulty: 'intermediate',
    duration: 50,
    tags: ['MongoDB', 'Aggregation', 'Advanced'],
    objectives: ['Use $unwind for arrays', 'Create faceted searches', 'Perform graph lookups'],
    steps: [{ stepNumber: 1, title: 'Advanced Aggregation', content: '$unwind deconstructs arrays, $facet creates multiple pipelines.', codeExamples: [{ language: 'javascript', code: '// Multi-faceted aggregation example', explanation: '$facet runs multiple sub-pipelines' }] }]
  }),
  createTutorial({
    title: 'MongoDB Schema Design Patterns',
    slug: 'mongodb-schema-design',
    description: 'Learn embedding vs referencing, polymorphic patterns, and schema anti-patterns.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Schema', 'Design'],
    objectives: ['Choose embedding vs referencing', 'Design for read/write patterns', 'Avoid anti-patterns'],
    steps: [{ stepNumber: 1, title: 'Embedding vs Referencing', content: 'Embed for one-to-few, reference for one-to-many.', codeExamples: [{ language: 'javascript', code: '// Embedded document example', explanation: 'Embed for atomic updates' }] }]
  }),
  createTutorial({
    title: 'MongoDB Transactions and ACID',
    slug: 'mongodb-transactions-acid',
    description: 'Implement multi-document transactions with MongoDB sessions.',
    difficulty: 'advanced',
    duration: 40,
    tags: ['MongoDB', 'Transactions', 'ACID'],
    objectives: ['Use multi-document transactions', 'Handle transaction errors', 'Ensure ACID compliance'],
    steps: [{ stepNumber: 1, title: 'Multi-Document Transactions', content: 'Transactions ensure atomicity across multiple operations.', codeExamples: [{ language: 'javascript', code: 'const session = client.startSession();\nawait session.withTransaction(async () => { /* operations */ });', explanation: 'All operations succeed or all fail' }] }]
  }),
  createTutorial({
    title: 'MongoDB Replication and High Availability',
    slug: 'mongodb-replication-ha',
    description: 'Set up replica sets for fault tolerance and read scaling.',
    difficulty: 'advanced',
    duration: 50,
    tags: ['MongoDB', 'Replication', 'HA'],
    objectives: ['Configure replica sets', 'Handle failover', 'Scale reads with secondaries'],
    steps: [{ stepNumber: 1, title: 'Replica Set Configuration', content: 'Replica sets provide automatic failover.', codeExamples: [{ language: 'javascript', code: '// Connect to replica set', explanation: 'Read from secondaries for read-heavy workloads' }] }]
  }),
  createTutorial({
    title: 'MongoDB Sharding and Scaling',
    slug: 'mongodb-sharding-scaling',
    description: 'Scale horizontally with sharding for massive datasets.',
    difficulty: 'advanced',
    duration: 55,
    tags: ['MongoDB', 'Sharding', 'Scaling'],
    objectives: ['Understand shard keys', 'Configure sharded clusters', 'Balance shard distribution'],
    steps: [{ stepNumber: 1, title: 'Sharding Basics', content: 'Sharding distributes data across multiple servers.', codeExamples: [{ language: 'javascript', code: 'sh.enableSharding("mydb");\nsh.shardCollection("mydb.users", { "userId": "hashed" });', explanation: 'Choose shard key carefully' }] }]
  }),
  createTutorial({
    title: 'MongoDB Security Best Practices',
    slug: 'mongodb-security',
    description: 'Secure MongoDB with authentication, encryption, and access control.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['MongoDB', 'Security', 'Authentication'],
    objectives: ['Enable authentication', 'Create user roles', 'Encrypt connections'],
    steps: [{ stepNumber: 1, title: 'Authentication and Authorization', content: 'Always enable auth and use role-based access control.', codeExamples: [{ language: 'javascript', code: 'db.createUser({ user: "admin", pwd: "password", roles: ["userAdminAnyDatabase"] });', explanation: 'Never use default configuration' }] }]
  }),
  createTutorial({
    title: 'MongoDB Performance Optimization',
    slug: 'mongodb-performance',
    description: 'Advanced techniques for MongoDB performance tuning.',
    difficulty: 'advanced',
    duration: 60,
    tags: ['MongoDB', 'Performance', 'Tuning'],
    objectives: ['Profile slow queries', 'Optimize index usage', 'Configure WiredTiger'],
    steps: [{ stepNumber: 1, title: 'Query Profiling', content: 'Use profiler to identify slow queries.', codeExamples: [{ language: 'javascript', code: 'db.setProfilingLevel(1, { slowms: 100 });', explanation: 'Profile in staging, not production' }] }]
  }),

  // NEW MONGODB TUTORIALS (12 additional)
  createTutorial({
    title: 'MongoDB Change Streams',
    slug: 'mongodb-change-streams',
    description: 'Real-time data monitoring with MongoDB change streams.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MongoDB', 'Change Streams', 'Real-time'],
    objectives: ['Set up change streams', 'Handle change events', 'Build reactive applications'],
    steps: [{ stepNumber: 1, title: 'Change Streams Basics', content: 'Monitor real-time changes to your data.', codeExamples: [{ language: 'javascript', code: 'const changeStream = collection.watch();\nchangeStream.on("change", (change) => console.log(change));', explanation: 'React to database changes in real-time' }] }]
  }),
  createTutorial({
    title: 'MongoDB GridFS for Large Files',
    slug: 'mongodb-gridfs-files',
    description: 'Store and retrieve large files with GridFS.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['MongoDB', 'GridFS', 'Files'],
    objectives: ['Store files in GridFS', 'Retrieve file streams', 'Manage file metadata'],
    steps: [{ stepNumber: 1, title: 'GridFS Fundamentals', content: 'GridFS stores files larger than 16MB.', codeExamples: [{ language: 'javascript', code: 'const bucket = new GridFSBucket(db);\nfs.createReadStream("./file.pdf").pipe(bucket.openUploadStream("file.pdf"));', explanation: 'Files are split into chunks' }] }]
  }),
  createTutorial({
    title: 'MongoDB Atlas Cloud Database',
    slug: 'mongodb-atlas-cloud',
    description: 'Deploy and manage MongoDB in the cloud with Atlas.',
    difficulty: 'beginner',
    duration: 30,
    tags: ['MongoDB', 'Atlas', 'Cloud'],
    objectives: ['Create Atlas cluster', 'Connect to Atlas', 'Use Atlas features'],
    steps: [{ stepNumber: 1, title: 'Atlas Setup', content: 'MongoDB Atlas is a fully managed cloud database.', codeExamples: [{ language: 'javascript', code: '// Connect to Atlas cluster', explanation: 'Use connection string from Atlas dashboard' }] }]
  }),
  createTutorial({
    title: 'MongoDB Geospatial Queries',
    slug: 'mongodb-geospatial-queries',
    description: 'Query location data with geospatial indexes.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Geospatial', 'Location'],
    objectives: ['Create geospatial indexes', 'Find nearby locations', 'Calculate distances'],
    steps: [{ stepNumber: 1, title: 'Geospatial Indexing', content: 'Store and query geographic coordinates.', codeExamples: [{ language: 'javascript', code: 'await collection.createIndex({ location: "2dsphere" });\nconst nearby = await collection.find({ location: { $near: { $geometry: { type: "Point", coordinates: [-73.97, 40.77] }, $maxDistance: 5000 }}});', explanation: 'Find locations within radius' }] }]
  }),
  createTutorial({
    title: 'MongoDB Text Search Optimization',
    slug: 'mongodb-text-search',
    description: 'Full-text search with weighted fields and language support.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MongoDB', 'Text Search', 'Indexing'],
    objectives: ['Create text indexes', 'Search with weights', 'Use text score'],
    steps: [{ stepNumber: 1, title: 'Text Index Creation', content: 'Enable full-text search on string fields.', codeExamples: [{ language: 'javascript', code: 'await collection.createIndex({ title: "text", content: "text" });\nconst results = await collection.find({ $text: { $search: "mongodb tutorial" }});', explanation: 'Text indexes support multiple languages' }] }]
  }),
  createTutorial({
    title: 'MongoDB TTL Indexes for Auto-Deletion',
    slug: 'mongodb-ttl-indexes',
    description: 'Automatically delete expired documents with TTL indexes.',
    difficulty: 'beginner',
    duration: 25,
    tags: ['MongoDB', 'TTL', 'Expiration'],
    objectives: ['Create TTL indexes', 'Set expiration times', 'Manage session data'],
    steps: [{ stepNumber: 1, title: 'TTL Index Setup', content: 'TTL indexes automatically remove old documents.', codeExamples: [{ language: 'javascript', code: 'await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });', explanation: 'Documents expire after specified seconds' }] }]
  }),
  createTutorial({
    title: 'MongoDB Validation Rules',
    slug: 'mongodb-validation-rules',
    description: 'Enforce data quality with schema validation.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['MongoDB', 'Validation', 'Schema'],
    objectives: ['Define validation rules', 'Use JSON Schema', 'Handle validation errors'],
    steps: [{ stepNumber: 1, title: 'Schema Validation', content: 'Enforce document structure and data types.', codeExamples: [{ language: 'javascript', code: 'db.createCollection("users", { validator: { $jsonSchema: { required: ["email", "name"], properties: { email: { bsonType: "string", pattern: "^.+@.+$" }}}}});', explanation: 'Validation rules prevent invalid data' }] }]
  }),
  createTutorial({
    title: 'MongoDB Backup and Restore Strategies',
    slug: 'mongodb-backup-restore',
    description: 'Implement robust backup and disaster recovery.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Backup', 'Recovery'],
    objectives: ['Create backups with mongodump', 'Restore with mongorestore', 'Implement backup automation'],
    steps: [{ stepNumber: 1, title: 'Backup Methods', content: 'Regular backups are essential for data protection.', codeExamples: [{ language: 'javascript', code: '// mongodump --uri="mongodb://localhost:27017/mydb" --out=/backup\n// mongorestore --uri="mongodb://localhost:27017" /backup/mydb', explanation: 'Automate backups with cron jobs' }] }]
  }),
  createTutorial({
    title: 'MongoDB Monitoring and Metrics',
    slug: 'mongodb-monitoring-metrics',
    description: 'Monitor database health and performance metrics.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MongoDB', 'Monitoring', 'Metrics'],
    objectives: ['Use mongostat and mongotop', 'Set up alerts', 'Track key metrics'],
    steps: [{ stepNumber: 1, title: 'Monitoring Tools', content: 'Track database performance in real-time.', codeExamples: [{ language: 'javascript', code: '// mongostat --uri="mongodb://localhost:27017"\n// mongotop --uri="mongodb://localhost:27017"', explanation: 'Monitor ops/sec and collection activity' }] }]
  }),
  createTutorial({
    title: 'MongoDB Multi-Tenancy Patterns',
    slug: 'mongodb-multi-tenancy',
    description: 'Design multi-tenant applications with MongoDB.',
    difficulty: 'advanced',
    duration: 50,
    tags: ['MongoDB', 'Multi-Tenancy', 'Architecture'],
    objectives: ['Implement database-per-tenant', 'Use collection-per-tenant', 'Manage tenant isolation'],
    steps: [{ stepNumber: 1, title: 'Tenancy Strategies', content: 'Choose the right multi-tenancy pattern.', codeExamples: [{ language: 'javascript', code: '// Database per tenant\nconst tenantDb = client.db(`tenant_${tenantId}`);\n// Collection per tenant\nconst tenantCollection = db.collection(`tenant_${tenantId}_users`);', explanation: 'Balance isolation vs resource usage' }] }]
  }),
  createTutorial({
    title: 'MongoDB Time Series Collections',
    slug: 'mongodb-time-series',
    description: 'Optimize time-series data with specialized collections.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['MongoDB', 'Time Series', 'IoT'],
    objectives: ['Create time series collections', 'Query time-based data', 'Optimize for metrics'],
    steps: [{ stepNumber: 1, title: 'Time Series Setup', content: 'Time series collections optimize IoT and metrics data.', codeExamples: [{ language: 'javascript', code: 'db.createCollection("weather", { timeseries: { timeField: "timestamp", metaField: "metadata", granularity: "hours" }});', explanation: 'Automatically compressed and optimized' }] }]
  }),
  createTutorial({
    title: 'MongoDB Capped Collections',
    slug: 'mongodb-capped-collections',
    description: 'Fixed-size collections for high-throughput logging.',
    difficulty: 'beginner',
    duration: 30,
    tags: ['MongoDB', 'Capped Collections', 'Logging'],
    objectives: ['Create capped collections', 'Understand FIFO behavior', 'Use for logs and caches'],
    steps: [{ stepNumber: 1, title: 'Capped Collection Basics', content: 'Capped collections maintain insertion order.', codeExamples: [{ language: 'javascript', code: 'db.createCollection("logs", { capped: true, size: 100000, max: 5000 });', explanation: 'Oldest documents auto-removed when full' }] }]
  }),

  // ==================== SQL/MYSQL TUTORIALS (22 - DOUBLED from 11) ====================
  createTutorial({
    title: 'SQL Basics: SELECT and WHERE',
    slug: 'sql-basics-select-where',
    description: 'Learn fundamental SQL queries with SELECT, WHERE, and ORDER BY.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 25,
    tags: ['SQL', 'MySQL', 'SELECT', 'WHERE'],
    objectives: ['Write SELECT statements', 'Filter with WHERE', 'Sort with ORDER BY'],
    steps: [{ stepNumber: 1, title: 'Basic SELECT', content: 'SELECT retrieves data from tables.', codeExamples: [{ language: 'sql', code: 'SELECT * FROM users WHERE age > 25;', explanation: 'WHERE filters rows' }] }]
  }),
  createTutorial({
    title: 'SQL Joins: Combining Tables',
    slug: 'sql-joins-combining-tables',
    description: 'Master INNER, LEFT, RIGHT, and FULL OUTER joins.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 35,
    tags: ['SQL', 'Joins', 'Tables'],
    objectives: ['Understand join types', 'Combine data from multiple tables', 'Handle NULL values'],
    steps: [{ stepNumber: 1, title: 'INNER JOIN', content: 'Returns matching rows from both tables.', codeExamples: [{ language: 'sql', code: 'SELECT o.*, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id;', explanation: 'Only matching rows returned' }] }]
  }),
  createTutorial({
    title: 'SQL Aggregate Functions and GROUP BY',
    slug: 'sql-aggregate-functions',
    description: 'Master COUNT, SUM, AVG, MIN, MAX with GROUP BY.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'Aggregation', 'GROUP BY'],
    objectives: ['Use aggregate functions', 'Group results', 'Filter with HAVING'],
    steps: [{ stepNumber: 1, title: 'Aggregation Basics', content: 'Aggregate functions perform calculations.', codeExamples: [{ language: 'sql', code: 'SELECT category, COUNT(*), AVG(price) FROM products GROUP BY category HAVING COUNT(*) > 10;', explanation: 'HAVING filters groups' }] }]
  }),
  createTutorial({
    title: 'SQL Subqueries and Nested Queries',
    slug: 'sql-subqueries',
    description: 'Use subqueries in SELECT, WHERE, and FROM clauses.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['SQL', 'Subqueries', 'Nested'],
    objectives: ['Write scalar subqueries', 'Use correlated subqueries', 'Optimize performance'],
    steps: [{ stepNumber: 1, title: 'Subquery Types', content: 'Subqueries return single values, rows, or tables.', codeExamples: [{ language: 'sql', code: 'SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products);', explanation: 'Correlated subqueries reference outer query' }] }]
  }),
  createTutorial({
    title: 'SQL Views and Stored Procedures',
    slug: 'sql-views-procedures',
    description: 'Create reusable views and stored procedures.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['SQL', 'Views', 'Procedures'],
    objectives: ['Create views', 'Write stored procedures', 'Use parameters'],
    steps: [{ stepNumber: 1, title: 'Creating Views', content: 'Views are virtual tables.', codeExamples: [{ language: 'sql', code: 'CREATE VIEW active_users AS SELECT * FROM users WHERE status = "active";', explanation: 'Views simplify complex queries' }] }]
  }),
  createTutorial({
    title: 'SQL Indexes and Query Optimization',
    slug: 'sql-indexes-optimization',
    description: 'Create indexes and optimize SQL query performance.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['SQL', 'Indexes', 'Optimization'],
    objectives: ['Create indexes', 'Use EXPLAIN plans', 'Optimize queries'],
    steps: [{ stepNumber: 1, title: 'Index Creation', content: 'Indexes speed up WHERE, JOIN, ORDER BY.', codeExamples: [{ language: 'sql', code: 'CREATE INDEX idx_email ON users(email);\nEXPLAIN SELECT * FROM users WHERE email = "test@example.com";', explanation: 'Too many indexes slow INSERT/UPDATE' }] }]
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
    steps: [{ stepNumber: 1, title: 'Transaction Basics', content: 'Transactions ensure all-or-nothing execution.', codeExamples: [{ language: 'sql', code: 'START TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;', explanation: 'ACID: Atomicity, Consistency, Isolation, Durability' }] }]
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
    steps: [{ stepNumber: 1, title: 'Window Functions', content: 'Perform calculations across related rows.', codeExamples: [{ language: 'sql', code: 'SELECT name, ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) FROM products;', explanation: 'Window functions do not reduce rows' }] }]
  }),
  createTutorial({
    title: 'SQL Database Design and Normalization',
    slug: 'sql-database-design',
    description: 'Design normalized databases with 1NF, 2NF, 3NF, and BCNF.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['SQL', 'Design', 'Normalization'],
    objectives: ['Understand normal forms', 'Design ER diagrams', 'Choose data types'],
    steps: [{ stepNumber: 1, title: 'Normalization Basics', content: 'Normalization eliminates redundancy.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100));\nCREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, FOREIGN KEY (customer_id) REFERENCES customers(id));', explanation: '3NF is usually sufficient' }] }]
  }),
  createTutorial({
    title: 'MySQL Specific Features',
    slug: 'mysql-specific-features',
    description: 'MySQL-specific features: JSON functions, full-text search.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['MySQL', 'JSON', 'Features'],
    objectives: ['Use JSON functions', 'Implement full-text search', 'Work with generated columns'],
    steps: [{ stepNumber: 1, title: 'JSON Support', content: 'MySQL has native JSON support.', codeExamples: [{ language: 'sql', code: 'SELECT id, attributes->>"$.brand" FROM products WHERE attributes->>"$.ram" >= 16;', explanation: 'JSON type is more efficient than TEXT' }] }]
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
    steps: [{ stepNumber: 1, title: 'Query Optimization', content: 'Identify and fix performance bottlenecks.', codeExamples: [{ language: 'sql', code: 'EXPLAIN ANALYZE SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.city = "NYC";', explanation: 'Test with production-like data' }] }]
  }),

  // NEW SQL TUTORIALS (11 additional)
  createTutorial({
    title: 'SQL Triggers and Automation',
    slug: 'sql-triggers-automation',
    description: 'Automate actions with database triggers.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['SQL', 'Triggers', 'Automation'],
    objectives: ['Create BEFORE/AFTER triggers', 'Audit data changes', 'Maintain data integrity'],
    steps: [{ stepNumber: 1, title: 'Trigger Basics', content: 'Triggers execute automatically on INSERT/UPDATE/DELETE.', codeExamples: [{ language: 'sql', code: 'CREATE TRIGGER audit_log AFTER UPDATE ON users FOR EACH ROW INSERT INTO audit (user_id, old_value, new_value) VALUES (OLD.id, OLD.email, NEW.email);', explanation: 'Triggers enable automatic logging' }] }]
  }),
  createTutorial({
    title: 'SQL Common Table Expressions (CTEs)',
    slug: 'sql-ctes',
    description: 'Simplify complex queries with CTEs and recursive queries.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['SQL', 'CTE', 'WITH'],
    objectives: ['Write CTEs', 'Create recursive queries', 'Improve query readability'],
    steps: [{ stepNumber: 1, title: 'CTE Basics', content: 'CTEs make queries more readable.', codeExamples: [{ language: 'sql', code: 'WITH high_value AS (SELECT * FROM customers WHERE total_spent > 1000)\nSELECT * FROM high_value WHERE city = "NYC";', explanation: 'CTEs are temporary named result sets' }] }]
  }),
  createTutorial({
    title: 'SQL Foreign Keys and Referential Integrity',
    slug: 'sql-foreign-keys',
    description: 'Maintain data consistency with foreign key constraints.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'Foreign Keys', 'Constraints'],
    objectives: ['Define foreign keys', 'Set ON DELETE/UPDATE actions', 'Maintain referential integrity'],
    steps: [{ stepNumber: 1, title: 'Foreign Key Constraints', content: 'Foreign keys link tables and prevent orphaned records.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE orders (id INT, customer_id INT, FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE);', explanation: 'CASCADE deletes related records automatically' }] }]
  }),
  createTutorial({
    title: 'SQL UNION and Set Operations',
    slug: 'sql-union-set-operations',
    description: 'Combine query results with UNION, INTERSECT, and EXCEPT.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'UNION', 'Set Operations'],
    objectives: ['Use UNION and UNION ALL', 'Understand INTERSECT and EXCEPT', 'Combine multiple queries'],
    steps: [{ stepNumber: 1, title: 'Set Operations', content: 'Combine results from multiple SELECT statements.', codeExamples: [{ language: 'sql', code: 'SELECT name FROM customers WHERE city = "NYC"\nUNION\nSELECT name FROM customers WHERE city = "LA";', explanation: 'UNION removes duplicates, UNION ALL keeps all' }] }]
  }),
  createTutorial({
    title: 'SQL Data Types and Constraints',
    slug: 'sql-data-types-constraints',
    description: 'Choose appropriate data types and enforce constraints.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 35,
    tags: ['SQL', 'Data Types', 'Constraints'],
    objectives: ['Select appropriate data types', 'Use NOT NULL, UNIQUE, CHECK constraints', 'Define default values'],
    steps: [{ stepNumber: 1, title: 'Data Types', content: 'Choosing the right data type optimizes storage and performance.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, age INT CHECK (age >= 18), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);', explanation: 'Constraints enforce data quality' }] }]
  }),
  createTutorial({
    title: 'SQL CASE Statements and Conditional Logic',
    slug: 'sql-case-statements',
    description: 'Implement conditional logic in SQL queries.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'CASE', 'Conditional'],
    objectives: ['Use CASE expressions', 'Create conditional columns', 'Implement IF-THEN logic'],
    steps: [{ stepNumber: 1, title: 'CASE Expression', content: 'CASE adds conditional logic to queries.', codeExamples: [{ language: 'sql', code: 'SELECT name, CASE WHEN age < 18 THEN "Minor" WHEN age < 65 THEN "Adult" ELSE "Senior" END AS age_group FROM users;', explanation: 'CASE evaluates conditions sequentially' }] }]
  }),
  createTutorial({
    title: 'SQL String Functions and Pattern Matching',
    slug: 'sql-string-functions',
    description: 'Manipulate text with SQL string functions.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'Strings', 'Functions'],
    objectives: ['Use CONCAT, SUBSTRING, UPPER/LOWER', 'Pattern matching with LIKE', 'String manipulation'],
    steps: [{ stepNumber: 1, title: 'String Functions', content: 'SQL provides many text manipulation functions.', codeExamples: [{ language: 'sql', code: 'SELECT CONCAT(first_name, " ", last_name) AS full_name, UPPER(email), SUBSTRING(phone, 1, 3) FROM users WHERE email LIKE "%@gmail.com";', explanation: 'LIKE supports % (any chars) and _ (single char)' }] }]
  }),
  createTutorial({
    title: 'SQL Date and Time Functions',
    slug: 'sql-date-time-functions',
    description: 'Work with dates and times in SQL.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 35,
    tags: ['SQL', 'Date', 'Time'],
    objectives: ['Use DATE, TIME, DATETIME functions', 'Calculate date differences', 'Format dates'],
    steps: [{ stepNumber: 1, title: 'Date Functions', content: 'SQL has comprehensive date/time support.', codeExamples: [{ language: 'sql', code: 'SELECT NOW(), CURDATE(), DATE_ADD(NOW(), INTERVAL 7 DAY), DATEDIFF(NOW(), created_at) AS days_old FROM orders WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH);', explanation: 'Date arithmetic makes filtering easy' }] }]
  }),
  createTutorial({
    title: 'SQL NULL Handling',
    slug: 'sql-null-handling',
    description: 'Handle NULL values correctly in SQL.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 25,
    tags: ['SQL', 'NULL', 'Missing Data'],
    objectives: ['Understand NULL behavior', 'Use IS NULL / IS NOT NULL', 'Handle NULLs with COALESCE'],
    steps: [{ stepNumber: 1, title: 'NULL Values', content: 'NULL represents missing or unknown data.', codeExamples: [{ language: 'sql', code: 'SELECT name, COALESCE(phone, "No phone") AS phone FROM users WHERE email IS NOT NULL AND phone IS NULL;', explanation: 'NULL != NULL, use IS NULL for comparisons' }] }]
  }),
  createTutorial({
    title: 'SQL User Management and Permissions',
    slug: 'sql-user-management',
    description: 'Manage database users and permissions.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['SQL', 'Users', 'Permissions'],
    objectives: ['Create database users', 'Grant and revoke permissions', 'Implement least privilege'],
    steps: [{ stepNumber: 1, title: 'User Management', content: 'Control access with user permissions.', codeExamples: [{ language: 'sql', code: 'CREATE USER "appuser"@"localhost" IDENTIFIED BY "password";\nGRANT SELECT, INSERT, UPDATE ON mydb.* TO "appuser"@"localhost";\nREVOKE DELETE ON mydb.* FROM "appuser"@"localhost";', explanation: 'Follow principle of least privilege' }] }]
  }),
  createTutorial({
    title: 'SQL Import and Export Data',
    slug: 'sql-import-export',
    description: 'Import and export data with SQL.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 30,
    tags: ['SQL', 'Import', 'Export'],
    objectives: ['Export to CSV', 'Import from files', 'Bulk data operations'],
    steps: [{ stepNumber: 1, title: 'Data Import/Export', content: 'Move data between database and files.', codeExamples: [{ language: 'sql', code: 'LOAD DATA INFILE "/path/users.csv" INTO TABLE users FIELDS TERMINATED BY "," LINES TERMINATED BY "\\n";\nSELECT * INTO OUTFILE "/path/export.csv" FIELDS TERMINATED BY "," FROM users;', explanation: 'Use LOAD DATA for bulk imports' }] }]
  }),

  // ==================== POSTGRESQL TUTORIALS (20 - DOUBLED from 10) ====================
  createTutorial({
    title: 'PostgreSQL Fundamentals',
    slug: 'postgresql-fundamentals',
    description: 'Introduction to PostgreSQL features, setup, and basic operations.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 25,
    tags: ['PostgreSQL', 'SQL', 'Setup'],
    objectives: ['Understand PostgreSQL advantages', 'Connect to PostgreSQL', 'Create databases and tables'],
    steps: [{ stepNumber: 1, title: 'PostgreSQL Features', content: 'PostgreSQL is an advanced open-source relational database.', codeExamples: [{ language: 'sql', code: 'CREATE DATABASE myapp;\nCREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), profile JSONB);', explanation: 'SERIAL auto-increments' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL JSONB Operations',
    slug: 'postgresql-jsonb-operations',
    description: 'Work with JSON data using PostgreSQL JSONB type.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'JSONB', 'JSON'],
    objectives: ['Store and query JSON data', 'Use JSONB operators', 'Index JSON fields'],
    steps: [{ stepNumber: 1, title: 'JSONB Queries', content: 'Query JSON data with specialized operators.', codeExamples: [{ language: 'sql', code: 'SELECT * FROM products WHERE metadata->>"category" = "electronics";\nCREATE INDEX idx_metadata ON products ((metadata->>"category"));', explanation: '-> returns JSON, ->> returns text' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL CTEs and Advanced Queries',
    slug: 'postgresql-ctes',
    description: 'Master Common Table Expressions and recursive queries.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'CTEs', 'Recursive'],
    objectives: ['Write CTEs', 'Create recursive queries', 'Optimize complex queries'],
    steps: [{ stepNumber: 1, title: 'Common Table Expressions', content: 'CTEs make queries more readable.', codeExamples: [{ language: 'sql', code: 'WITH RECURSIVE org_tree AS (SELECT * FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.* FROM employees e JOIN org_tree ot ON e.manager_id = ot.id) SELECT * FROM org_tree;', explanation: 'Recursive CTEs handle hierarchies' }] }]
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
    steps: [{ stepNumber: 1, title: 'Text Search Basics', content: 'PostgreSQL has built-in full-text search.', codeExamples: [{ language: 'sql', code: 'ALTER TABLE articles ADD COLUMN search_vector tsvector;\nCREATE INDEX idx_search ON articles USING GIN(search_vector);\nSELECT * FROM articles WHERE search_vector @@ to_tsquery("postgresql & performance");', explanation: 'GIN indexes make text search very fast' }] }]
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
    steps: [{ stepNumber: 1, title: 'Array Basics', content: 'PostgreSQL supports multi-dimensional arrays.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE posts (id SERIAL, tags TEXT[]);\nINSERT INTO posts VALUES (1, ARRAY["database", "sql"]);\nSELECT * FROM posts WHERE "database" = ANY(tags);', explanation: 'Arrays avoid JOIN tables' }] }]
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
    steps: [{ stepNumber: 1, title: 'Advanced Windows', content: 'PostgreSQL has extensive window function support.', codeExamples: [{ language: 'sql', code: 'SELECT date, revenue, AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg FROM sales;', explanation: 'Window frames define calculation scope' }] }]
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
    steps: [{ stepNumber: 1, title: 'Index Types', content: 'Different index types for different use cases.', codeExamples: [{ language: 'sql', code: 'CREATE INDEX idx_tags ON posts USING GIN(tags);\nCREATE INDEX idx_active ON users(email) WHERE status = "active";\nCREATE INDEX idx_lower_email ON users(LOWER(email));', explanation: 'Choose based on query patterns' }] }]
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
    steps: [{ stepNumber: 1, title: 'Table Partitioning', content: 'Partitioning improves query performance on large tables.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE orders (id BIGSERIAL, order_date DATE) PARTITION BY RANGE (order_date);\nCREATE TABLE orders_2024_q1 PARTITION OF orders FOR VALUES FROM ("2024-01-01") TO ("2024-04-01");', explanation: 'Automatic partition routing' }] }]
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
    steps: [{ stepNumber: 1, title: 'Streaming Replication', content: 'Replication provides high availability.', codeExamples: [{ language: 'sql', code: 'CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD "password";\n-- Use pg_basebackup for standby setup', explanation: 'Test restore procedures regularly' }] }]
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
    steps: [{ stepNumber: 1, title: 'Performance Tuning', content: 'Optimize PostgreSQL for your workload.', codeExamples: [{ language: 'sql', code: 'ANALYZE users;\nVACUUM ANALYZE users;\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = "test@example.com";', explanation: 'Regular VACUUM is essential' }] }]
  }),

  // NEW POSTGRESQL TUTORIALS (10 additional)
  createTutorial({
    title: 'PostgreSQL Extensions and Plugins',
    slug: 'postgresql-extensions',
    description: 'Extend PostgreSQL functionality with extensions.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['PostgreSQL', 'Extensions', 'Plugins'],
    objectives: ['Install extensions', 'Use PostGIS for geospatial', 'Enable pg_trgm for fuzzy search'],
    steps: [{ stepNumber: 1, title: 'Extension Management', content: 'Extensions add powerful features to PostgreSQL.', codeExamples: [{ language: 'sql', code: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\nCREATE EXTENSION IF NOT EXISTS postgis;', explanation: 'Extensions enable specialized functionality' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Materialized Views',
    slug: 'postgresql-materialized-views',
    description: 'Cache complex query results with materialized views.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['PostgreSQL', 'Materialized Views', 'Performance'],
    objectives: ['Create materialized views', 'Refresh views', 'Index materialized views'],
    steps: [{ stepNumber: 1, title: 'Materialized Views', content: 'Store query results for fast access.', codeExamples: [{ language: 'sql', code: 'CREATE MATERIALIZED VIEW sales_summary AS SELECT category, SUM(amount) FROM orders GROUP BY category;\nREFRESH MATERIALIZED VIEW sales_summary;', explanation: 'Refresh periodically to update data' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Foreign Data Wrappers',
    slug: 'postgresql-foreign-data-wrappers',
    description: 'Access external data sources from PostgreSQL.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 45,
    tags: ['PostgreSQL', 'FDW', 'Integration'],
    objectives: ['Set up FDW', 'Query remote databases', 'Join local and remote tables'],
    steps: [{ stepNumber: 1, title: 'Foreign Data Wrappers', content: 'Query data from other databases and APIs.', codeExamples: [{ language: 'sql', code: 'CREATE EXTENSION postgres_fdw;\nCREATE SERVER foreign_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host "remote_host", dbname "remote_db");', explanation: 'FDW enables federated queries' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Row-Level Security',
    slug: 'postgresql-row-level-security',
    description: 'Implement fine-grained access control with RLS.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 40,
    tags: ['PostgreSQL', 'Security', 'RLS'],
    objectives: ['Enable row-level security', 'Create security policies', 'Multi-tenant isolation'],
    steps: [{ stepNumber: 1, title: 'Row-Level Security', content: 'Control which rows users can access.', codeExamples: [{ language: 'sql', code: 'ALTER TABLE documents ENABLE ROW LEVEL SECURITY;\nCREATE POLICY user_documents ON documents FOR ALL TO app_user USING (user_id = current_user_id());', explanation: 'RLS enforces access at the row level' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Enum Types',
    slug: 'postgresql-enum-types',
    description: 'Create custom enumerated types for constrained values.',
    language: 'sql',
    difficulty: 'beginner',
    duration: 25,
    tags: ['PostgreSQL', 'Enum', 'Types'],
    objectives: ['Create enum types', 'Use enums in tables', 'Alter enum types'],
    steps: [{ stepNumber: 1, title: 'Enum Types', content: 'Enums enforce a set of allowed values.', codeExamples: [{ language: 'sql', code: 'CREATE TYPE status_enum AS ENUM ("pending", "active", "completed");\nCREATE TABLE orders (id SERIAL, status status_enum);', explanation: 'Enums are more efficient than CHECK constraints' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Generated Columns',
    slug: 'postgresql-generated-columns',
    description: 'Auto-compute column values with generated columns.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 30,
    tags: ['PostgreSQL', 'Generated Columns', 'Computed'],
    objectives: ['Create generated columns', 'Use STORED vs VIRTUAL', 'Index generated columns'],
    steps: [{ stepNumber: 1, title: 'Generated Columns', content: 'Computed columns automatically derived from other columns.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE products (price DECIMAL, tax DECIMAL, total DECIMAL GENERATED ALWAYS AS (price + tax) STORED);', explanation: 'STORED persists the value, VIRTUAL computes on read' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Listen/Notify',
    slug: 'postgresql-listen-notify',
    description: 'Real-time notifications between database sessions.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['PostgreSQL', 'Listen', 'Notify'],
    objectives: ['Use LISTEN and NOTIFY', 'Build real-time features', 'Implement pub/sub patterns'],
    steps: [{ stepNumber: 1, title: 'Listen/Notify Basics', content: 'Enable real-time communication between clients.', codeExamples: [{ language: 'sql', code: 'LISTEN new_orders;\nNOTIFY new_orders, "Order #123 created";', explanation: 'Lightweight pub/sub within PostgreSQL' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Connection Pooling',
    slug: 'postgresql-connection-pooling',
    description: 'Optimize connections with PgBouncer.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['PostgreSQL', 'PgBouncer', 'Pooling'],
    objectives: ['Set up PgBouncer', 'Configure pool modes', 'Optimize connection usage'],
    steps: [{ stepNumber: 1, title: 'Connection Pooling', content: 'PgBouncer reduces connection overhead.', codeExamples: [{ language: 'javascript', code: '// [databases]\n// mydb = host=localhost port=5432 dbname=mydb\n// [pgbouncer]\n// pool_mode = transaction\n// max_client_conn = 100', explanation: 'Pool modes: session, transaction, statement' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Logical Replication',
    slug: 'postgresql-logical-replication',
    description: 'Replicate specific tables and data with logical replication.',
    language: 'sql',
    difficulty: 'advanced',
    duration: 50,
    tags: ['PostgreSQL', 'Logical Replication', 'Sync'],
    objectives: ['Set up logical replication', 'Replicate selected tables', 'Handle conflicts'],
    steps: [{ stepNumber: 1, title: 'Logical Replication Setup', content: 'Replicate data at the logical level.', codeExamples: [{ language: 'sql', code: 'CREATE PUBLICATION my_pub FOR TABLE users, orders;\nCREATE SUBSCRIPTION my_sub CONNECTION "host=publisher" PUBLICATION my_pub;', explanation: 'Logical replication allows selective data sync' }] }]
  }),
  createTutorial({
    title: 'PostgreSQL Advanced Data Types',
    slug: 'postgresql-advanced-types',
    description: 'Work with UUID, INET, CIDR, and other advanced types.',
    language: 'sql',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['PostgreSQL', 'Data Types', 'Advanced'],
    objectives: ['Use UUID for primary keys', 'Store IP addresses with INET', 'Work with ranges and network types'],
    steps: [{ stepNumber: 1, title: 'Advanced Types', content: 'PostgreSQL offers specialized data types.', codeExamples: [{ language: 'sql', code: 'CREATE TABLE sessions (id UUID DEFAULT gen_random_uuid(), ip INET, created_at TSTZRANGE);\nSELECT * FROM sessions WHERE ip << "192.168.1.0/24"::inet;', explanation: 'Native types provide better performance and validation' }] }]
  }),

  // ==================== REDIS TUTORIALS (20 - DOUBLED from 10) ====================
  createTutorial({
    title: 'Redis Fundamentals: Key-Value Store',
    slug: 'redis-fundamentals-key-value',
    description: 'Learn Redis basics, data types, and common use cases.',
    difficulty: 'beginner',
    duration: 20,
    tags: ['Redis', 'Cache', 'Key-Value'],
    objectives: ['Understand Redis use cases', 'Connect to Redis', 'Work with strings and keys'],
    steps: [{ stepNumber: 1, title: 'Getting Started', content: 'Redis is an in-memory data store.', codeExamples: [{ language: 'javascript', code: 'await client.set("user:1", "Alice");\nconst value = await client.get("user:1");', explanation: 'All data stored in RAM for speed' }] }]
  }),
  createTutorial({
    title: 'Redis Data Types: Lists, Sets, Hashes',
    slug: 'redis-data-types',
    description: 'Master Redis data structures.',
    difficulty: 'beginner',
    duration: 30,
    tags: ['Redis', 'Data Types', 'Lists'],
    objectives: ['Use Redis lists', 'Work with sets', 'Store objects with hashes'],
    steps: [{ stepNumber: 1, title: 'Lists', content: 'Lists are ordered sequences.', codeExamples: [{ language: 'javascript', code: 'await client.rPush("queue", "task1");\nconst task = await client.lPop("queue");', explanation: 'Perfect for queues' }] }]
  }),
  createTutorial({
    title: 'Redis Sorted Sets and Leaderboards',
    slug: 'redis-sorted-sets',
    description: 'Build leaderboards with sorted sets.',
    difficulty: 'beginner',
    duration: 25,
    tags: ['Redis', 'Sorted Sets', 'Leaderboards'],
    objectives: ['Use sorted sets', 'Build leaderboards', 'Query by rank'],
    steps: [{ stepNumber: 1, title: 'Sorted Sets', content: 'Maintain order by score automatically.', codeExamples: [{ language: 'javascript', code: 'await client.zAdd("leaderboard", { score: 1000, value: "player1" });\nconst top10 = await client.zRevRange("leaderboard", 0, 9);', explanation: 'Perfect for real-time rankings' }] }]
  }),
  createTutorial({
    title: 'Redis Pub/Sub Messaging',
    slug: 'redis-pubsub',
    description: 'Build real-time messaging with Redis Pub/Sub.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Pub/Sub', 'Messaging'],
    objectives: ['Publish messages', 'Subscribe to channels', 'Use pattern matching'],
    steps: [{ stepNumber: 1, title: 'Pub/Sub Basics', content: 'Enable real-time message broadcasting.', codeExamples: [{ language: 'javascript', code: 'await subscriber.subscribe("notifications");\nawait client.publish("notifications", "New message");', explanation: 'Messages not persisted' }] }]
  }),
  createTutorial({
    title: 'Redis Caching Strategies',
    slug: 'redis-caching-strategies',
    description: 'Implement effective caching patterns.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Caching', 'Patterns'],
    objectives: ['Implement cache-aside', 'Use write-through', 'Handle invalidation'],
    steps: [{ stepNumber: 1, title: 'Cache-Aside Pattern', content: 'Most common caching pattern.', codeExamples: [{ language: 'javascript', code: 'const cached = await redis.get(`user:${id}`);\nif (cached) return JSON.parse(cached);\nconst user = await db.findById(id);\nawait redis.setEx(`user:${id}`, 3600, JSON.stringify(user));', explanation: 'Always set TTL' }] }]
  }),
  createTutorial({
    title: 'Redis Transactions and Lua Scripting',
    slug: 'redis-transactions-lua',
    description: 'Ensure atomicity with MULTI/EXEC and Lua.',
    difficulty: 'intermediate',
    duration: 45,
    tags: ['Redis', 'Transactions', 'Lua'],
    objectives: ['Use MULTI/EXEC', 'Write Lua scripts', 'Ensure atomic operations'],
    steps: [{ stepNumber: 1, title: 'Transactions', content: 'MULTI/EXEC ensures atomicity.', codeExamples: [{ language: 'javascript', code: 'const multi = client.multi();\nmulti.set("key1", "value1");\nmulti.incr("counter");\nawait multi.exec();', explanation: 'Lua scripts are atomic' }] }]
  }),
  createTutorial({
    title: 'Redis Persistence: RDB and AOF',
    slug: 'redis-persistence',
    description: 'Configure Redis persistence for durability.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Persistence', 'RDB'],
    objectives: ['Configure RDB snapshots', 'Enable AOF', 'Choose strategy'],
    steps: [{ stepNumber: 1, title: 'Persistence Options', content: 'RDB for snapshots, AOF for write logging.', codeExamples: [{ language: 'javascript', code: '// redis.conf\n// save 900 1\n// appendonly yes', explanation: 'RDB faster to load, AOF better durability' }] }]
  }),
  createTutorial({
    title: 'Redis Cluster and High Availability',
    slug: 'redis-cluster-ha',
    description: 'Scale Redis with clustering.',
    difficulty: 'advanced',
    duration: 50,
    tags: ['Redis', 'Cluster', 'HA'],
    objectives: ['Set up Redis Cluster', 'Configure Sentinel', 'Handle failover'],
    steps: [{ stepNumber: 1, title: 'Redis Cluster', content: 'Cluster automatically shards data.', codeExamples: [{ language: 'javascript', code: '// redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 --cluster-replicas 1', explanation: 'Automatic sharding and replication' }] }]
  }),
  createTutorial({
    title: 'Redis Streams for Event Sourcing',
    slug: 'redis-streams',
    description: 'Build event-driven architectures with Redis Streams.',
    difficulty: 'advanced',
    duration: 45,
    tags: ['Redis', 'Streams', 'Events'],
    objectives: ['Use Redis Streams', 'Implement consumer groups', 'Build event sourcing'],
    steps: [{ stepNumber: 1, title: 'Streams Basics', content: 'Streams are append-only logs.', codeExamples: [{ language: 'javascript', code: 'await client.xAdd("events", "*", { type: "order", id: "123" });\nconst messages = await client.xReadGroup("processors", "consumer1", { key: "events", id: ">" });', explanation: 'At-least-once delivery' }] }]
  }),
  createTutorial({
    title: 'Redis Performance and Best Practices',
    slug: 'redis-performance',
    description: 'Optimize Redis for maximum performance.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Performance', 'Best Practices'],
    objectives: ['Optimize memory usage', 'Use pipelining', 'Monitor performance'],
    steps: [{ stepNumber: 1, title: 'Performance Optimization', content: 'Redis is fast but can be optimized.', codeExamples: [{ language: 'javascript', code: 'const pipeline = client.multi();\nfor (let i = 0; i < 1000; i++) pipeline.set(`key${i}`, `value${i}`);\nawait pipeline.exec();', explanation: 'Never use KEYS in production' }] }]
  }),

  // NEW REDIS TUTORIALS (10 additional)
  createTutorial({
    title: 'Redis Bitmap Operations',
    slug: 'redis-bitmaps',
    description: 'Efficient analytics with Redis bitmaps.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Bitmaps', 'Analytics'],
    objectives: ['Use bitmap commands', 'Track user activity', 'Perform bitwise operations'],
    steps: [{ stepNumber: 1, title: 'Bitmap Basics', content: 'Bitmaps enable space-efficient data tracking.', codeExamples: [{ language: 'javascript', code: 'await client.setBit("user:1001:login:2024", 15, 1);\nconst loggedIn = await client.getBit("user:1001:login:2024", 15);\nconst totalDays = await client.bitCount("user:1001:login:2024");', explanation: 'Track millions of events efficiently' }] }]
  }),
  createTutorial({
    title: 'Redis HyperLogLog for Cardinality',
    slug: 'redis-hyperloglog',
    description: 'Count unique items with minimal memory.',
    difficulty: 'intermediate',
    duration: 30,
    tags: ['Redis', 'HyperLogLog', 'Counting'],
    objectives: ['Use HyperLogLog', 'Count unique visitors', 'Merge HyperLogLogs'],
    steps: [{ stepNumber: 1, title: 'HyperLogLog Basics', content: 'Probabilistic counting with 0.81% error rate.', codeExamples: [{ language: 'javascript', code: 'await client.pfAdd("unique_visitors", "user1", "user2");\nconst count = await client.pfCount("unique_visitors");', explanation: 'Uses only 12KB per key' }] }]
  }),
  createTutorial({
    title: 'Redis Geospatial Indexing',
    slug: 'redis-geospatial',
    description: 'Store and query location data with Redis.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Geospatial', 'Location'],
    objectives: ['Store coordinates', 'Find nearby locations', 'Calculate distances'],
    steps: [{ stepNumber: 1, title: 'Geospatial Commands', content: 'Redis has built-in geospatial support.', codeExamples: [{ language: 'javascript', code: 'await client.geoAdd("locations", { longitude: -73.97, latitude: 40.77, member: "NYC" });\nconst nearby = await client.geoRadius("locations", { longitude: -73.97, latitude: 40.77 }, 50, "km");', explanation: 'Find locations within radius' }] }]
  }),
  createTutorial({
    title: 'Redis Rate Limiting',
    slug: 'redis-rate-limiting',
    description: 'Implement API rate limiting with Redis.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Rate Limiting', 'API'],
    objectives: ['Implement fixed window', 'Use sliding window', 'Token bucket algorithm'],
    steps: [{ stepNumber: 1, title: 'Rate Limiting Patterns', content: 'Control API usage with rate limits.', codeExamples: [{ language: 'javascript', code: 'const key = `rate:${userId}:${Date.now() / 60000 | 0}`;\nconst count = await client.incr(key);\nif (count === 1) await client.expire(key, 60);\nif (count > 100) throw new Error("Rate limit exceeded");', explanation: 'Fixed window rate limiting' }] }]
  }),
  createTutorial({
    title: 'Redis Session Management',
    slug: 'redis-session-management',
    description: 'Store user sessions in Redis for scalability.',
    difficulty: 'beginner',
    duration: 30,
    tags: ['Redis', 'Sessions', 'Auth'],
    objectives: ['Store session data', 'Set expiration', 'Handle session refresh'],
    steps: [{ stepNumber: 1, title: 'Session Storage', content: 'Redis is ideal for session management.', codeExamples: [{ language: 'javascript', code: 'await client.setEx(`session:${sessionId}`, 3600, JSON.stringify(userData));\nconst session = JSON.parse(await client.get(`session:${sessionId}`));', explanation: 'Sessions auto-expire with TTL' }] }]
  }),
  createTutorial({
    title: 'Redis Queue Patterns',
    slug: 'redis-queue-patterns',
    description: 'Build reliable job queues with Redis.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Queues', 'Jobs'],
    objectives: ['Implement simple queue', 'Use priority queues', 'Handle delayed jobs'],
    steps: [{ stepNumber: 1, title: 'Queue Patterns', content: 'Redis lists work great as queues.', codeExamples: [{ language: 'javascript', code: '// Producer\nawait client.rPush("jobs", JSON.stringify(job));\n// Consumer\nconst job = JSON.parse(await client.blPop("jobs", 0));', explanation: 'BLPOP blocks until item available' }] }]
  }),
  createTutorial({
    title: 'Redis Distributed Locking',
    slug: 'redis-distributed-locks',
    description: 'Implement distributed locks for coordination.',
    difficulty: 'advanced',
    duration: 45,
    tags: ['Redis', 'Locks', 'Distributed'],
    objectives: ['Implement Redlock algorithm', 'Handle lock timeouts', 'Prevent race conditions'],
    steps: [{ stepNumber: 1, title: 'Distributed Locking', content: 'Coordinate across multiple servers.', codeExamples: [{ language: 'javascript', code: 'const acquired = await client.set("lock:resource", token, { NX: true, EX: 10 });\nif (acquired) {\n  // Do work\n  await client.del("lock:resource");\n}', explanation: 'Use unique token to prevent unlock by wrong client' }] }]
  }),
  createTutorial({
    title: 'Redis Memory Optimization',
    slug: 'redis-memory-optimization',
    description: 'Optimize Redis memory usage and eviction policies.',
    difficulty: 'intermediate',
    duration: 40,
    tags: ['Redis', 'Memory', 'Optimization'],
    objectives: ['Configure eviction policies', 'Use memory-efficient data types', 'Monitor memory usage'],
    steps: [{ stepNumber: 1, title: 'Memory Management', content: 'Control memory usage with eviction policies.', codeExamples: [{ language: 'javascript', code: '// redis.conf\n// maxmemory 256mb\n// maxmemory-policy allkeys-lru\n// Check memory: INFO memory', explanation: 'Choose eviction policy based on use case' }] }]
  }),
  createTutorial({
    title: 'Redis Monitoring and Debugging',
    slug: 'redis-monitoring-debugging',
    description: 'Monitor and troubleshoot Redis performance.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Monitoring', 'Debugging'],
    objectives: ['Use redis-cli monitoring', 'Analyze slow log', 'Track key patterns'],
    steps: [{ stepNumber: 1, title: 'Monitoring Tools', content: 'Keep Redis healthy with monitoring.', codeExamples: [{ language: 'javascript', code: '// redis-cli --latency\n// redis-cli --bigkeys\n// redis-cli SLOWLOG GET 10', explanation: 'Monitor latency and slow commands' }] }]
  }),
  createTutorial({
    title: 'Redis Security Hardening',
    slug: 'redis-security-hardening',
    description: 'Secure Redis deployments with authentication and encryption.',
    difficulty: 'intermediate',
    duration: 35,
    tags: ['Redis', 'Security', 'Authentication'],
    objectives: ['Enable authentication', 'Use TLS encryption', 'Disable dangerous commands'],
    steps: [{ stepNumber: 1, title: 'Security Best Practices', content: 'Protect Redis from unauthorized access.', codeExamples: [{ language: 'javascript', code: '// redis.conf\n// requirepass strongpassword\n// rename-command FLUSHDB ""\n// rename-command FLUSHALL ""\n// Use TLS for encryption', explanation: 'Never expose Redis to public internet' }] }]
  })
];

async function seedDatabaseTutorials() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const deleteResult = await DatabaseTutorial.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing database tutorials`);

    const result = await DatabaseTutorial.insertMany(databaseTutorials);
    console.log(`\n✅ Successfully seeded ${result.length} database tutorials (DOUBLED from 43 to 86)`);

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
      console.log(`   ${topic}: ${count} tutorials (was ${count/2})`);
    });

    mongoose.connection.close();
    console.log('\n✨ Database tutorial seeding complete! DOUBLED from 43 to 86 tutorials');
  } catch (error) {
    console.error('❌ Error seeding database tutorials:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabaseTutorials();
}

module.exports = seedDatabaseTutorials;
