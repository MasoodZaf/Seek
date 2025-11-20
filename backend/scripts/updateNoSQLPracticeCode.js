require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// MongoDB practice code templates
const mongodbPracticeTemplates = {
  'introduction-nosql': `// Practice: Introduction to NoSQL Databases
// Complete the exercises below using MongoDB

// Exercise 1: Connect to MongoDB
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

async function practice() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');

    // Exercise 2: Get database and collection
    const db = client.db('practice_db');
    const collection = db.collection('users');

    // Exercise 3: Insert a document
    const result = await collection.insertOne({
      name: 'Alice',
      email: 'alice@example.com',
      age: 25
    });
    console.log('Inserted document:', result.insertedId);

    // Your turn: Practice NoSQL operations
    // TODO: Insert multiple documents
    // TODO: Query the collection
    // TODO: Update a document
  } finally {
    await client.close();
  }
}

practice().catch(console.error);
`,

  default: `// Practice: MongoDB Operations
// Complete the exercises below

const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

async function practice() {
  try {
    await client.connect();
    const db = client.db('practice_db');
    const collection = db.collection('test');

    // TODO: Practice MongoDB operations here
    console.log('MongoDB practice starting...');

  } finally {
    await client.close();
  }
}

practice().catch(console.error);
`
};

// Redis practice code templates
const redisPracticeTemplates = {
  'introduction-to-redis': `// Practice: Introduction to Redis
// Complete the exercises below

const redis = require('redis');
const client = redis.createClient();

async function practice() {
  try {
    await client.connect();
    console.log('Connected to Redis!');

    // Exercise 1: SET and GET operations
    await client.set('user:1:name', 'Alice');
    const name = await client.get('user:1:name');
    console.log('Retrieved name:', name);

    // Exercise 2: Working with numbers
    await client.set('page:views', '0');
    await client.incr('page:views');
    await client.incr('page:views');
    const views = await client.get('page:views');
    console.log('Page views:', views);

    // Exercise 3: Expiring keys
    await client.set('session:token', 'abc123', {
      EX: 60 // Expires in 60 seconds
    });

    // Your turn: Practice Redis operations
    // TODO: Set multiple key-value pairs
    // TODO: Use INCR and DECR commands
    // TODO: Set keys with expiration
  } finally {
    await client.quit();
  }
}

practice().catch(console.error);
`,

  'rate-limiting': `// Practice: Redis Rate Limiting
// Complete the exercises below

const redis = require('redis');
const client = redis.createClient();

async function checkRateLimit(userId, maxRequests = 10, windowSeconds = 60) {
  const key = \`rate_limit:\${userId}\`;

  // Get current request count
  const current = await client.get(key);

  if (current === null) {
    // First request in the window
    await client.set(key, '1', { EX: windowSeconds });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  const count = parseInt(current);

  if (count >= maxRequests) {
    // Rate limit exceeded
    const ttl = await client.ttl(key);
    return { allowed: false, remaining: 0, retryAfter: ttl };
  }

  // Increment counter
  await client.incr(key);
  return { allowed: true, remaining: maxRequests - count - 1 };
}

async function practice() {
  try {
    await client.connect();

    // Exercise: Test rate limiting
    for (let i = 1; i <= 12; i++) {
      const result = await checkRateLimit('user:123', 10, 60);
      console.log(\`Request \${i}:\`, result);
    }

    // Your turn: Practice rate limiting
    // TODO: Implement rate limiting for different users
    // TODO: Try different time windows
    // TODO: Handle rate limit exceeded scenarios
  } finally {
    await client.quit();
  }
}

practice().catch(console.error);
`,

  default: `// Practice: Redis Operations
// Complete the exercises below

const redis = require('redis');
const client = redis.createClient();

async function practice() {
  try {
    await client.connect();
    console.log('Redis practice starting...');

    // TODO: Practice Redis commands here

  } finally {
    await client.quit();
  }
}

practice().catch(console.error);
`
};

async function updateNoSQLPracticeCode() {
  try {
    console.log('🚀 Updating practice code for MongoDB and Redis tutorials...\n');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    let totalUpdated = 0;

    // Update MongoDB tutorials
    console.log('📝 Processing MongoDB tutorials...');
    const mongoTutorials = await MongoTutorial.find({
      category: 'Database',
      language: 'javascript',
      slug: /^mongodb-/
    });

    let mongoUpdated = 0;
    for (const tutorial of mongoTutorials) {
      if (tutorial.steps && tutorial.steps.length >= 2) {
        const practiceStep = tutorial.steps[1];

        // Extract topic slug
        const topicMatch = tutorial.slug.match(/^mongodb-\d+-(.+)$/);
        const topicSlug = topicMatch ? topicMatch[1] : 'default';

        // Get appropriate practice code
        const practiceCode = mongodbPracticeTemplates[topicSlug] || mongodbPracticeTemplates.default;

        // Update both codeExamples and practicePhase
        if (practiceStep.codeExamples && practiceStep.codeExamples.length > 0) {
          practiceStep.codeExamples[0].code = practiceCode;
        }

        if (practiceStep.practicePhase) {
          practiceStep.practicePhase.starterCode = practiceCode;
        }

        await tutorial.save();
        mongoUpdated++;
        totalUpdated++;

        if (mongoUpdated % 10 === 0) {
          console.log(`  ✓ Updated ${mongoUpdated} MongoDB tutorials...`);
        }
      }
    }
    console.log(`  ✓ Updated ${mongoUpdated} MongoDB tutorials`);

    // Update Redis tutorials
    console.log('\n📝 Processing Redis tutorials...');
    const redisTutorials = await MongoTutorial.find({
      category: 'Database',
      language: 'javascript',
      slug: /^redis-/
    });

    let redisUpdated = 0;
    for (const tutorial of redisTutorials) {
      if (tutorial.steps && tutorial.steps.length >= 2) {
        const practiceStep = tutorial.steps[1];

        // Extract topic slug
        const topicMatch = tutorial.slug.match(/^redis-\d+-(.+)$/);
        const topicSlug = topicMatch ? topicMatch[1] : 'default';

        // Get appropriate practice code
        const practiceCode = redisPracticeTemplates[topicSlug] || redisPracticeTemplates.default;

        // Update both codeExamples and practicePhase
        if (practiceStep.codeExamples && practiceStep.codeExamples.length > 0) {
          practiceStep.codeExamples[0].code = practiceCode;
        }

        if (practiceStep.practicePhase) {
          practiceStep.practicePhase.starterCode = practiceCode;
        }

        await tutorial.save();
        redisUpdated++;
        totalUpdated++;

        if (redisUpdated % 10 === 0) {
          console.log(`  ✓ Updated ${redisUpdated} Redis tutorials...`);
        }
      }
    }
    console.log(`  ✓ Updated ${redisUpdated} Redis tutorials`);

    console.log(`\n✅ Successfully updated ${totalUpdated} NoSQL database tutorials!`);
    console.log(`   - MongoDB: ${mongoUpdated}`);
    console.log(`   - Redis: ${redisUpdated}`);

    mongoose.connection.close();
    console.log('\n🎉 Update complete!');
  } catch (error) {
    console.error('❌ Error updating practice code:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateNoSQLPracticeCode();
}

module.exports = updateNoSQLPracticeCode;
