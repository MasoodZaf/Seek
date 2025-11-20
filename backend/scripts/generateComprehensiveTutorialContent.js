require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Comprehensive content templates for each database type
const contentLibrary = {
  mongodb: {
    topics: {
      'introduction': {
        learn: `MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. Unlike traditional relational databases, MongoDB does not require a predefined schema, making it ideal for applications with evolving data requirements.

### Key Characteristics
- **Document-Oriented**: Data is stored in BSON (Binary JSON) documents
- **Flexible Schema**: No rigid table structure required
- **Scalability**: Built-in horizontal scaling with sharding
- **High Performance**: Indexes, aggregation framework, and native replication

### When to Use MongoDB
- Applications with rapidly changing schemas
- Content management systems
- Real-time analytics
- Internet of Things (IoT) applications
- Mobile applications requiring offline sync

### Core Concepts
1. **Database**: Container for collections
2. **Collection**: Group of MongoDB documents (like a table)
3. **Document**: A record in MongoDB (like a row)
4. **Field**: A key-value pair in a document (like a column)`,
        practice: `Let's practice connecting to MongoDB and performing basic operations.

### Setup
First, ensure MongoDB is running on your local machine or use MongoDB Atlas for a cloud instance.

### Connection Example
\`\`\`javascript
const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // List databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(\` - \${db.name}\`));
  } finally {
    await client.close();
  }
}

connect().catch(console.error);
\`\`\`

### Exercise
Modify the code above to:
1. Connect to a database named "myFirstDB"
2. Create a collection called "users"
3. List all collections in the database`,
        challenge: `### Challenge: Build a User Management System

Create a simple user management system with the following requirements:

**Requirements:**
1. Connect to MongoDB
2. Create a "users" collection
3. Implement CRUD operations:
   - Create a new user with name, email, age
   - Read all users
   - Update a user's information
   - Delete a user by email

**Bonus:**
- Add validation to ensure email is unique
- Add error handling for all operations
- Implement a search function to find users by name

**Starter Code:**
\`\`\`javascript
const { MongoClient } = require('mongodb');

class UserManager {
  constructor(uri, dbName) {
    this.client = new MongoClient(uri);
    this.dbName = dbName;
  }

  async connect() {
    // TODO: Implement connection
  }

  async createUser(userData) {
    // TODO: Implement user creation
  }

  async getAllUsers() {
    // TODO: Implement fetching all users
  }

  async updateUser(email, updates) {
    // TODO: Implement user update
  }

  async deleteUser(email) {
    // TODO: Implement user deletion
  }
}

// Test your implementation
const manager = new UserManager('mongodb://localhost:27017', 'myFirstDB');
\`\`\``
      },
      'crud': {
        learn: `CRUD operations (Create, Read, Update, Delete) are the foundation of working with MongoDB. Understanding these operations is essential for building any database-driven application.

### Create Operations
MongoDB provides two primary methods for inserting documents:

**insertOne()** - Insert a single document
\`\`\`javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  createdAt: new Date()
});
\`\`\`

**insertMany()** - Insert multiple documents
\`\`\`javascript
db.users.insertMany([
  { name: "Alice", email: "alice@example.com", age: 25 },
  { name: "Bob", email: "bob@example.com", age: 28 }
]);
\`\`\`

### Read Operations
**find()** - Query for multiple documents
\`\`\`javascript
// Find all documents
db.users.find()

// Find with conditions
db.users.find({ age: { $gte: 25 } })

// Find with projection (select specific fields)
db.users.find({}, { name: 1, email: 1, _id: 0 })
\`\`\`

**findOne()** - Query for a single document
\`\`\`javascript
db.users.findOne({ email: "john@example.com" })
\`\`\`

### Update Operations
**updateOne()** - Update a single document
\`\`\`javascript
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31 } }
);
\`\`\`

**updateMany()** - Update multiple documents
\`\`\`javascript
db.users.updateMany(
  { age: { $lt: 30 } },
  { $set: { status: "young" } }
);
\`\`\`

### Delete Operations
**deleteOne()** - Delete a single document
\`\`\`javascript
db.users.deleteOne({ email: "john@example.com" });
\`\`\`

**deleteMany()** - Delete multiple documents
\`\`\`javascript
db.users.deleteMany({ age: { $lt: 18 } });
\`\`\``,
        practice: `### Practice Exercise: Building a Blog System

Let's build a simple blog post management system using CRUD operations.

**Task 1: Create Posts**
\`\`\`javascript
// Create a single blog post
db.posts.insertOne({
  title: "Getting Started with MongoDB",
  content: "MongoDB is a powerful NoSQL database...",
  author: "Jane Doe",
  tags: ["mongodb", "nosql", "database"],
  publishedAt: new Date(),
  views: 0,
  comments: []
});

// Your turn: Create 3 more blog posts with different topics
// TODO: Add your code here
\`\`\`

**Task 2: Read Posts**
\`\`\`javascript
// Find all posts
const allPosts = db.posts.find().toArray();

// Find posts by a specific author
const janePosts = db.posts.find({ author: "Jane Doe" });

// Your turn:
// 1. Find all posts with the tag "mongodb"
// 2. Find posts with more than 100 views
// 3. Find the 5 most recent posts
// TODO: Add your code here
\`\`\`

**Task 3: Update Posts**
\`\`\`javascript
// Increment view count
db.posts.updateOne(
  { title: "Getting Started with MongoDB" },
  { $inc: { views: 1 } }
);

// Add a comment
db.posts.updateOne(
  { title: "Getting Started with MongoDB" },
  {
    $push: {
      comments: {
        author: "Reader1",
        text: "Great article!",
        date: new Date()
      }
    }
  }
);

// Your turn:
// 1. Add a new tag to a post
// 2. Update the content of a post
// TODO: Add your code here
\`\`\`

**Task 4: Delete Posts**
\`\`\`javascript
// Delete a specific post
db.posts.deleteOne({ title: "Old Post" });

// Your turn:
// 1. Delete all posts with 0 views
// 2. Delete posts older than 1 year
// TODO: Add your code here
\`\`\``,
        challenge: `### Advanced Challenge: Complete Blog API

Build a complete blog management system with the following features:

**Requirements:**
1. **Post Management**
   - Create posts with title, content, author, tags
   - Edit existing posts
   - Delete posts (with confirmation)
   - Publish/unpublish posts (status field)

2. **Advanced Queries**
   - Search posts by keyword in title or content
   - Filter posts by tags
   - Sort by publish date or view count
   - Implement pagination (10 posts per page)

3. **Analytics**
   - Track view count for each post
   - Calculate average views per post
   - Find most popular tags
   - Generate author statistics

4. **Comment System**
   - Add comments to posts
   - Update/delete comments
   - Count comments per post

**Starter Template:**
\`\`\`javascript
class BlogManager {
  constructor(db) {
    this.posts = db.collection('posts');
  }

  async createPost(postData) {
    // TODO: Validate and create post
    // Add timestamps, initialize views to 0
  }

  async updatePost(postId, updates) {
    // TODO: Update post with validation
  }

  async deletePost(postId) {
    // TODO: Delete post and handle references
  }

  async searchPosts(keyword) {
    // TODO: Search in title and content
    // Hint: Use $or and $regex
  }

  async getPostsByTag(tag) {
    // TODO: Find posts with specific tag
  }

  async incrementViews(postId) {
    // TODO: Use $inc operator
  }

  async addComment(postId, comment) {
    // TODO: Use $push operator
  }

  async getPopularPosts(limit = 10) {
    // TODO: Sort by views, limit results
  }

  async getPostAnalytics() {
    // TODO: Use aggregation framework
    // Return: total posts, avg views, top tags
  }
}
\`\`\`

**Test Cases:**
Create tests to verify:
- Posts are created with correct structure
- Updates modify only specified fields
- Searches return relevant results
- Analytics calculations are accurate`
      }
    }
  },
  sql: {
    topics: {
      'introduction': {
        learn: `SQL (Structured Query Language) is the standard language for managing relational databases. It has been the foundation of data management for decades and remains essential for modern applications.

### What is a Relational Database?
A relational database organizes data into tables (relations) with rows and columns. Each table represents an entity, and relationships between tables are established through keys.

### Key Concepts

**1. Tables (Relations)**
- Structure: Rows and columns
- Each row represents a record
- Each column represents an attribute

**2. Primary Keys**
- Uniquely identifies each row
- Cannot be NULL
- Must be unique

**3. Foreign Keys**
- Creates relationships between tables
- References primary key in another table
- Maintains referential integrity

**4. ACID Properties**
- **Atomicity**: Transactions are all-or-nothing
- **Consistency**: Data remains valid after transactions
- **Isolation**: Concurrent transactions do not interfere
- **Durability**: Committed data persists

### SQL Categories

**DDL (Data Definition Language)**
- CREATE, ALTER, DROP
- Define database structure

**DML (Data Manipulation Language)**
- SELECT, INSERT, UPDATE, DELETE
- Manipulate data

**DCL (Data Control Language)**
- GRANT, REVOKE
- Control access permissions

**TCL (Transaction Control Language)**
- COMMIT, ROLLBACK, SAVEPOINT
- Manage transactions`,
        practice: `### Practice: Creating Your First Database

Let's create a simple library management database.

**Step 1: Create Database**
\`\`\`sql
CREATE DATABASE LibraryDB;
USE LibraryDB;
\`\`\`

**Step 2: Create Tables**
\`\`\`sql
-- Books table
CREATE TABLE Books (
    BookID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    ISBN VARCHAR(13) UNIQUE,
    PublishedYear INT,
    AvailableCopies INT DEFAULT 0
);

-- Members table
CREATE TABLE Members (
    MemberID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    JoinDate DATE DEFAULT CURRENT_DATE
);

-- Loans table (relationship between Books and Members)
CREATE TABLE Loans (
    LoanID INT PRIMARY KEY AUTO_INCREMENT,
    BookID INT,
    MemberID INT,
    LoanDate DATE NOT NULL,
    DueDate DATE NOT NULL,
    ReturnDate DATE,
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
);
\`\`\`

**Step 3: Insert Sample Data**
\`\`\`sql
-- Add books
INSERT INTO Books (Title, Author, ISBN, PublishedYear, AvailableCopies)
VALUES
    ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 3),
    ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, 2),
    ('1984', 'George Orwell', '9780451524935', 1949, 4);

-- Add members
INSERT INTO Members (FirstName, LastName, Email)
VALUES
    ('John', 'Doe', 'john.doe@email.com'),
    ('Jane', 'Smith', 'jane.smith@email.com');

-- Record a loan
INSERT INTO Loans (BookID, MemberID, LoanDate, DueDate)
VALUES (1, 1, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 14 DAY));
\`\`\`

**Your Exercise:**
1. Add 3 more books to the Books table
2. Add 2 more members
3. Create loan records for different books and members
4. Write a query to find all available books (AvailableCopies > 0)`,
        challenge: `### Challenge: Complete Library Management System

Build a comprehensive library system with advanced features:

**Part 1: Enhanced Schema**
\`\`\`sql
-- Add Categories table
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(50) NOT NULL UNIQUE,
    Description TEXT
);

-- Add BookCategories (many-to-many relationship)
CREATE TABLE BookCategories (
    BookID INT,
    CategoryID INT,
    PRIMARY KEY (BookID, CategoryID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Add Reviews table
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    BookID INT,
    MemberID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    ReviewText TEXT,
    ReviewDate DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
);
\`\`\`

**Part 2: Complex Queries**
Write SQL queries to:

1. Find all books in a specific category
2. Calculate average rating for each book
3. Find members with overdue books
4. List top 10 most borrowed books
5. Find members who have never borrowed a book
6. Calculate total books borrowed per member
7. Find books with rating above 4 stars
8. List all books currently on loan

**Part 3: Stored Procedures**
Create procedures for:

1. **CheckoutBook**
   - Input: BookID, MemberID
   - Validate book availability
   - Create loan record
   - Decrease available copies

2. **ReturnBook**
   - Input: LoanID
   - Update return date
   - Increase available copies
   - Calculate late fees if overdue

3. **AddBookReview**
   - Input: BookID, MemberID, Rating, ReviewText
   - Validate member has borrowed the book
   - Insert review

**Part 4: Reports**
Generate:
1. Monthly loan statistics
2. Popular genres report
3. Member activity report
4. Overdue books report

**Bonus:**
- Implement triggers to automatically update book availability
- Create views for common queries
- Add indexes for performance optimization`
      }
    }
  },
  postgresql: {
    topics: {
      'introduction': {
        learn: `PostgreSQL is a powerful, open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance. It is known for its advanced features and standards compliance.

### Why PostgreSQL?

**1. ACID Compliant**
- Full transaction support
- Data integrity guaranteed
- Reliable and consistent

**2. Advanced Features**
- Complex queries with window functions
- Full-text search
- JSON/JSONB support
- Array data types
- Table inheritance
- Custom functions and stored procedures

**3. Extensibility**
- Custom data types
- Custom operators
- Extensions (PostGIS, pg_trgm, etc.)
- Multiple programming languages (PL/pgSQL, PL/Python, etc.)

**4. Performance**
- Query optimization
- Parallel queries
- Table partitioning
- Index types (B-tree, Hash, GiST, GIN, BRIN)

### PostgreSQL vs Other Databases

**PostgreSQL vs MySQL:**
- Better compliance with SQL standards
- More advanced features (window functions, CTEs)
- Superior handling of complex queries
- Better data integrity

**PostgreSQL vs MongoDB:**
- Structured data with relationships
- Strong consistency guarantees
- JSONB support for flexible schemas
- Better for complex transactions

### Use Cases
- Financial applications requiring ACID compliance
- Geographic information systems (PostGIS)
- Applications with complex data relationships
- Analytics and data warehousing
- Applications requiring full-text search`,
        practice: `### Practice: Building with PostgreSQL

**Step 1: Create Database**
\`\`\`sql
CREATE DATABASE ecommerce;
\\c ecommerce
\`\`\`

**Step 2: Create Tables with Advanced Features**
\`\`\`sql
-- Users table with JSONB for preferences
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with array types
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    tags TEXT[],  -- Array of tags
    specifications JSONB,  -- Flexible product specs
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- Order items
CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);
\`\`\`

**Step 3: Insert Data with Advanced Types**
\`\`\`sql
-- Insert user with JSONB preferences
INSERT INTO users (username, email, password_hash, preferences)
VALUES (
    'john_doe',
    'john@example.com',
    'hashed_password_here',
    '{"theme": "dark", "notifications": true, "language": "en"}'::JSONB
);

-- Insert product with arrays and JSONB
INSERT INTO products (name, description, price, tags, specifications)
VALUES (
    'Laptop Pro 15',
    'High-performance laptop',
    1299.99,
    ARRAY['electronics', 'computers', 'laptops'],
    '{"cpu": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}'::JSONB
);
\`\`\`

**Your Exercise:**
1. Create an index on the email column of users table
2. Insert 5 products with different tags and specifications
3. Query products by tags using ANY operator
4. Update JSONB preferences for a user
5. Use array operators to find products with specific tags`,
        challenge: `### Advanced PostgreSQL Challenge

**Part 1: Advanced Schema Design**
\`\`\`sql
-- Reviews with full-text search
CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    user_id INTEGER REFERENCES users(user_id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    helpful_count INTEGER DEFAULT 0,
    review_tsv TSVECTOR,  -- For full-text search
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create full-text search index
CREATE INDEX review_search_idx ON product_reviews
USING GIN (review_tsv);

-- Trigger to update full-text search vector
CREATE OR REPLACE FUNCTION update_review_tsv()
RETURNS TRIGGER AS $$
BEGIN
    NEW.review_tsv := to_tsvector('english', COALESCE(NEW.review_text, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_tsv_update
BEFORE INSERT OR UPDATE ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_review_tsv();
\`\`\`

**Part 2: Window Functions**
Write queries using window functions:

1. Rank products by average rating within each category
\`\`\`sql
-- Your query here
\`\`\`

2. Calculate running total of orders per user
\`\`\`sql
-- Your query here
\`\`\`

3. Find top 3 products in each category by sales
\`\`\`sql
-- Your query here
\`\`\`

**Part 3: Common Table Expressions (CTEs)**

1. Find users who have spent more than average
\`\`\`sql
WITH user_totals AS (
    SELECT user_id, SUM(total_amount) as total_spent
    FROM orders
    GROUP BY user_id
),
avg_spending AS (
    SELECT AVG(total_spent) as avg_amount
    FROM user_totals
)
-- Complete this query
\`\`\`

**Part 4: JSONB Operations**

1. Query products with specific specifications
2. Update nested JSONB values
3. Aggregate JSONB data
4. Create GIN index on JSONB columns

**Part 5: Advanced Functions**

Create a stored procedure that:
1. Accepts order details as JSON
2. Validates product availability
3. Creates order and order items in a transaction
4. Updates product stock
5. Returns order ID or error message

**Bonus Challenges:**
- Implement table partitioning by order date
- Create materialized views for analytics
- Set up logical replication
- Implement row-level security
- Use PostGIS for location-based features`
      }
    }
  },
  redis: {
    topics: {
      'introduction': {
        learn: `Redis (Remote Dictionary Server) is an in-memory data structure store used as a database, cache, message broker, and streaming engine. It is renowned for its exceptional speed and versatility.

### Why Redis?

**1. In-Memory Performance**
- Sub-millisecond latency
- Millions of operations per second
- Ideal for real-time applications

**2. Rich Data Structures**
- Strings
- Lists
- Sets
- Sorted Sets (Z-sets)
- Hashes
- Bitmaps
- HyperLogLogs
- Streams
- Geospatial indexes

**3. Use Cases**
- Caching
- Session management
- Real-time analytics
- Leaderboards
- Message queues
- Rate limiting
- Pub/Sub messaging

**4. Persistence Options**
- RDB (snapshots)
- AOF (append-only file)
- Hybrid persistence

### Key Characteristics

**Atomic Operations**
- All operations are atomic
- Thread-safe by design
- No race conditions

**Replication**
- Master-slave replication
- High availability with Sentinel
- Clustering for horizontal scaling

**Expiration**
- TTL (Time To Live) on keys
- Automatic memory management
- LRU eviction policies`,
        practice: `### Practice: Redis Basics

**Step 1: Basic String Operations**
\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

await client.connect();

// SET and GET
await client.set('user:1:name', 'John Doe');
const name = await client.get('user:1:name');
console.log(name); // "John Doe"

// SET with expiration (EX = seconds)
await client.set('session:abc123', 'user_data', {
    EX: 3600  // Expires in 1 hour
});

// SETEX - Set with expiration in one command
await client.setEx('temp:key', 60, 'temporary value');

// Increment operations
await client.set('page:views', '0');
await client.incr('page:views');  // Returns 1
await client.incrBy('page:views', 10);  // Returns 11

// Check key existence
const exists = await client.exists('user:1:name');  // Returns 1
\`\`\`

**Step 2: Lists (Task Queues)**
\`\`\`javascript
// Push items to list
await client.rPush('tasks', 'task1');
await client.rPush('tasks', ['task2', 'task3', 'task4']);

// Pop items from list
const task = await client.lPop('tasks');  // Returns 'task1'

// Get list length
const length = await client.lLen('tasks');  // Returns 3

// Get range of items
const allTasks = await client.lRange('tasks', 0, -1);
// Returns ['task2', 'task3', 'task4']

// Blocking pop (wait for items)
const nextTask = await client.blPop('tasks', 5);  // Wait 5 seconds
\`\`\`

**Step 3: Hashes (Objects)**
\`\`\`javascript
// Store user object
await client.hSet('user:1', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});

// Get single field
const email = await client.hGet('user:1', 'email');

// Get all fields
const user = await client.hGetAll('user:1');
// Returns { name: 'John Doe', email: 'john@example.com', age: '30' }

// Increment field
await client.hIncrBy('user:1', 'age', 1);  // age = 31

// Check if field exists
const hasEmail = await client.hExists('user:1', 'email');
\`\`\`

**Your Exercise:**
1. Create a counter for website visits using INCR
2. Implement a task queue using lists
3. Store user profiles using hashes
4. Set expiration on cache keys
5. Use EXISTS to check key presence before operations`,
        challenge: `### Advanced Redis Challenge: E-commerce Features

**Part 1: Session Management**
\`\`\`javascript
class SessionManager {
    constructor(redisClient) {
        this.client = redisClient;
    }

    async createSession(userId, sessionData) {
        const sessionId = this.generateSessionId();
        const sessionKey = \`session:\${sessionId}\`;

        // Store session with 24-hour expiration
        await this.client.hSet(sessionKey, {
            userId: userId.toString(),
            ...sessionData,
            createdAt: Date.now().toString()
        });

        await this.client.expire(sessionKey, 86400);
        return sessionId;
    }

    async getSession(sessionId) {
        // TODO: Implement session retrieval
        // Also refresh expiration time
    }

    async updateSession(sessionId, updates) {
        // TODO: Implement session update
    }

    async deleteSession(sessionId) {
        // TODO: Implement session deletion
    }
}
\`\`\`

**Part 2: Shopping Cart**
\`\`\`javascript
class ShoppingCart {
    constructor(redisClient) {
        this.client = redisClient;
    }

    async addItem(userId, productId, quantity, price) {
        const cartKey = \`cart:\${userId}\`;

        // Store item with quantity
        await this.client.hSet(cartKey, productId, JSON.stringify({
            quantity,
            price,
            addedAt: Date.now()
        }));

        // TODO: Calculate and store cart total
    }

    async removeItem(userId, productId) {
        // TODO: Implement item removal
    }

    async getCart(userId) {
        // TODO: Get all items and parse JSON
        // Return structured cart data with total
    }

    async clearCart(userId) {
        // TODO: Clear entire cart
    }
}
\`\`\`

**Part 3: Product View Counter**
\`\`\`javascript
class Analytics {
    constructor(redisClient) {
        this.client = redisClient;
    }

    async recordView(productId) {
        const key = \`product:\${productId}:views\`;
        await this.client.incr(key);

        // Also add to sorted set for trending products
        await this.client.zIncrBy('trending:products', 1, productId);
    }

    async getTrendingProducts(limit = 10) {
        // TODO: Get top products from sorted set
        // Use ZREVRANGE with scores
    }

    async getViewCount(productId) {
        // TODO: Get view count
    }
}
\`\`\`

**Part 4: Rate Limiting**
\`\`\`javascript
class RateLimiter {
    constructor(redisClient) {
        this.client = redisClient;
    }

    async checkLimit(userId, action, maxRequests = 100, windowSeconds = 3600) {
        const key = \`ratelimit:\${userId}:\${action}\`;

        // TODO: Implement sliding window rate limiter
        // Hint: Use INCR and EXPIRE
        // Return: { allowed: boolean, remaining: number, resetAt: timestamp }
    }
}
\`\`\`

**Part 5: Caching Strategy**
\`\`\`javascript
class ProductCache {
    constructor(redisClient, database) {
        this.client = redisClient;
        this.db = database;
    }

    async getProduct(productId) {
        // Check cache first
        const cached = await this.client.get(\`product:\${productId}\`);
        if (cached) {
            return JSON.parse(cached);
        }

        // Cache miss - fetch from database
        const product = await this.db.getProduct(productId);

        // Store in cache with 1 hour expiration
        await this.client.setEx(
            \`product:\${productId}\`,
            3600,
            JSON.stringify(product)
        );

        return product;
    }

    async invalidateProduct(productId) {
        // TODO: Remove from cache when product is updated
    }

    async batchGetProducts(productIds) {
        // TODO: Implement using MGET for multiple products
        // Use pipeline for efficiency
    }
}
\`\`\`

**Part 6: Leaderboard**
\`\`\`javascript
class Leaderboard {
    constructor(redisClient) {
        this.client = redisClient;
    }

    async addScore(userId, score) {
        // TODO: Add user score to sorted set
        // Key: 'leaderboard:global'
    }

    async getTopPlayers(limit = 10) {
        // TODO: Get top players with scores
        // Use ZREVRANGE WITHSCORES
    }

    async getUserRank(userId) {
        // TODO: Get user's rank
        // Use ZREVRANK
    }

    async getUsersNearby(userId, range = 5) {
        // TODO: Get users ranked near this user
    }
}
\`\`\`

**Requirements:**
- Implement all TODO methods
- Add error handling
- Use pipelines for multiple operations
- Implement proper key naming conventions
- Add unit tests

**Bonus:**
- Implement Pub/Sub for real-time notifications
- Use Redis Streams for event sourcing
- Implement distributed locking
- Add monitoring and metrics`
      }
    }
  }
};

// Helper function to generate content based on tutorial metadata
function generateDetailedContent(tutorial) {
  const dbType = tutorial.tags[0]?.toLowerCase();
  const titleLower = tutorial.title.toLowerCase();

  // Extract topic from title
  let topicKey = 'introduction';
  if (titleLower.includes('crud') || titleLower.includes('insert') || titleLower.includes('create') ||
      titleLower.includes('read') || titleLower.includes('update') || titleLower.includes('delete')) {
    topicKey = 'crud';
  }

  // Get content template
  const dbContent = contentLibrary[dbType]?.topics?.[topicKey] || contentLibrary.mongodb.topics.introduction;

  const language = dbType === 'sql' || dbType === 'postgresql' ? 'sql' : 'javascript';

  return [
    {
      stepNumber: 1,
      title: 'Understanding the Concept',
      content: dbContent.learn,
      codeExamples: [],
      hints: [
        'Read through the concepts carefully',
        'Take notes on key terms',
        'Try to understand why these concepts matter',
        'Relate concepts to real-world scenarios'
      ],
      expectedOutput: '',
      isCompleted: false
    },
    {
      stepNumber: 2,
      title: 'Hands-On Practice',
      content: dbContent.practice,
      codeExamples: [
        {
          language: language,
          code: language === 'sql' ?
            '-- Practice your SQL skills here\\nSELECT * FROM users WHERE active = true;' :
            '// Practice your code here\\nconst result = await client.query();\\nconsole.log(result);',
          explanation: 'Use this space to practice the concepts you have learned. Try the exercises above.'
        }
      ],
      hints: [
        'Start with simple examples',
        'Test each concept incrementally',
        'Verify your results',
        'Experiment with variations'
      ],
      expectedOutput: '',
      isCompleted: false
    },
    {
      stepNumber: 3,
      title: 'Challenge & Advanced Concepts',
      content: dbContent.challenge,
      codeExamples: [
        {
          language: language,
          code: language === 'sql' ?
            '-- Complete the challenge here\\n-- Implement the requirements step by step' :
            '// Complete the challenge here\\n// Implement the requirements step by step',
          explanation: 'This is your final challenge. Apply everything you have learned to solve this problem.'
        }
      ],
      hints: [
        'Break down the problem into smaller parts',
        'Refer back to earlier steps if needed',
        'Test edge cases',
        'Optimize your solution'
      ],
      expectedOutput: '',
      isCompleted: false
    }
  ];
}

async function updateTutorialsWithComprehensiveContent() {
  try {
    console.log('🚀 Starting comprehensive content generation...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const tutorials = await MongoTutorial.find({ category: 'Database' });
    console.log(`📚 Found ${tutorials.length} database tutorials`);

    let updated = 0;
    for (const tutorial of tutorials) {
      const steps = generateDetailedContent(tutorial);
      tutorial.steps = steps;
      await tutorial.save();
      updated++;

      if (updated % 20 === 0) {
        console.log(`   Progress: ${updated}/${tutorials.length} tutorials updated`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} tutorials with comprehensive content`);
    console.log(`📊 Each tutorial now has detailed learning material, practice exercises, and challenges`);

    mongoose.connection.close();
    console.log('\n🎉 Process complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateTutorialsWithComprehensiveContent();
}

module.exports = updateTutorialsWithComprehensiveContent;
