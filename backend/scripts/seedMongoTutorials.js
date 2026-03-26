/* eslint-disable */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/seek';

// Helper to build a step with correct schema shape
function makeStep({ num = 1, title, content, code, lang = 'javascript', explanation = '', concept = '', keyPoints = [], realWorld = '', mistakes = [], practiceInstructions = [], starterCode = '', hints = [], requirements = [], problemStatement = '' }) {
  return {
    stepNumber: num,
    title,
    content,
    codeExamples: [{ language: lang, code, explanation, isExecutable: true }],
    hints: [],
    expectedOutput: '',
    isCompleted: false,
    learnPhase: {
      conceptExplanation: concept || content,
      keyPoints: keyPoints.length ? keyPoints : [title + ' is a core MongoDB concept', 'Practice with real data to solidify understanding'],
      realWorldExample: realWorld || `Production applications rely on ${title.toLowerCase()} for scalable data management.`,
      commonMistakes: mistakes.length ? mistakes : ['Not testing with realistic data volumes', 'Skipping explain() to verify index usage']
    },
    practicePhase: {
      instructions: practiceInstructions.length ? practiceInstructions : [{ step: 1, instruction: `Apply ${title} concepts to the starter code below.`, hint: 'Use console.log to verify intermediate results' }],
      starterCode: starterCode || `// ${title} practice\nconsole.log("Practicing: ${title}");`,
      hints: hints.length ? hints : [{ level: 1, hint: 'Start simple and build up complexity', unlocked: true }]
    },
    challengePhase: {
      problemStatement: problemStatement || `Design and implement a solution using ${title} for a real-world scenario.`,
      difficulty: 'medium',
      requirements: requirements.length ? requirements : ['Uses correct MongoDB operators', 'Handles edge cases', 'Returns meaningful results']
    }
  };
}

// Content for each MongoDB tutorial
const contentMap = {

  // ── Fundamentals ──────────────────────────────────────────────────────────
  'mongodb-1-introduction-nosql': makeStep({
    title: 'What is NoSQL?',
    content: 'NoSQL databases store data in flexible, non-tabular formats. Unlike SQL databases, they do not require a fixed schema, making them ideal for rapidly changing data structures.',
    code: '// MongoDB stores data as flexible JSON-like documents\nconst user = {\n  name: "Alice",\n  email: "alice@example.com",\n  age: 30,\n  hobbies: ["coding", "reading"],  // Arrays are native\n  address: { city: "London", country: "UK" }  // Nested objects\n};\n\nconsole.log("Name:", user.name);\nconsole.log("City:", user.address.city);\nconsole.log("First hobby:", user.hobbies[0]);',
    keyPoints: ['Flexible schema — no ALTER TABLE needed', 'Horizontal scaling (sharding)', 'Document-oriented: related data lives together', 'Great for hierarchical/nested data'],
    realWorld: 'Social networks use MongoDB to store user profiles with varying fields — some have phone numbers, others have social links.',
    mistakes: ['Treating MongoDB exactly like a relational database', 'Ignoring query patterns when designing the schema'],
    practiceInstructions: [{ step: 1, instruction: 'Create a product document with name, price, category, and a specs nested object.', hint: 'Add at least 3 fields in the specs object' }],
    starterCode: '// Design a product document\nconst product = {\n  name: "Laptop",\n  // Add price, category, tags, and specs\n};\nconsole.log("Product:", JSON.stringify(product, null, 2));',
    hints: [{ level: 1, hint: 'specs can include { ram, storage, display }', unlocked: true }],
    requirements: ['Has name, price, category fields', 'Has tags array', 'Has nested specs object', 'All values are appropriate types'],
    problemStatement: 'Design a document for a hotel booking system with guest info, room details, dates, and a services array.'
  }),

  'mongodb-2-installation-setup': makeStep({
    title: 'Connecting to MongoDB',
    content: 'MongoDB runs as a service on port 27017. You connect using a connection string. Mongoose is the most popular Node.js ODM (Object Document Mapper) for MongoDB.',
    code: 'const mongoose = require("mongoose");\n\nasync function connect() {\n  try {\n    // Connection string format: mongodb://host:port/database\n    await mongoose.connect("mongodb://localhost:27017/myapp");\n    \n    console.log("✅ Connected to MongoDB");\n    console.log("Database:", mongoose.connection.name);\n    console.log("Host:", mongoose.connection.host);\n    \n    // Connection states: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting\n    console.log("State:", mongoose.connection.readyState);\n  } catch (err) {\n    console.error("❌ Connection failed:", err.message);\n  }\n}\n\nconnect();',
    keyPoints: ['Default port is 27017', 'MongoDB Atlas provides cloud-hosted MongoDB', 'Mongoose adds schema validation on top of MongoDB driver', 'Always handle connection errors'],
    realWorld: 'Production apps store the connection string in environment variables (MONGODB_URI) and use MongoDB Atlas for managed hosting.',
    mistakes: ['Hardcoding connection strings in source code', 'Not handling disconnection events in long-running apps'],
    practiceInstructions: [{ step: 1, instruction: 'Write a connection string for a database called "shopdb" on localhost port 27017.', hint: 'Start with mongodb://' }],
    starterCode: 'const connectionString = "";\nconsole.log("Connection string:", connectionString);\nconsole.log("Valid:", connectionString.startsWith("mongodb://"));',
    hints: [{ level: 1, hint: 'Format: mongodb://localhost:27017/shopdb', unlocked: true }],
    requirements: ['Starts with mongodb://', 'Includes localhost:27017', 'Ends with database name', 'Uses try/catch for error handling'],
    problemStatement: 'Write a connect() function with retry logic that attempts to reconnect up to 3 times if the initial connection fails.'
  }),

  'mongodb-3-document-structure-bson': makeStep({
    title: 'BSON Document Types',
    content: 'MongoDB stores documents in BSON (Binary JSON) format, which supports more data types than JSON: ObjectId, Date, Binary, Decimal128, and more.',
    code: '// BSON supports rich data types\nconst document = {\n  _id: "507f1f77bcf86cd799439011",  // ObjectId (24-char hex string)\n  name: "Alice",                    // String\n  age: 30,                          // Integer\n  score: 98.5,                      // Float/Double\n  active: true,                     // Boolean\n  createdAt: new Date(),            // Date\n  tags: ["admin", "user"],          // Array\n  profile: {                        // Embedded document\n    bio: "Developer",\n    website: "https://alice.dev"\n  },\n  data: null                        // Null\n};\n\nconsole.log("ID:", document._id);\nconsole.log("Name:", document.name);\nconsole.log("Date:", document.createdAt.toISOString());\nconsole.log("Tag count:", document.tags.length);\nconsole.log("Bio:", document.profile.bio);',
    keyPoints: ['_id is auto-generated as ObjectId (unique, indexed)', 'Documents in the same collection can have different fields', 'Max document size is 16MB', 'ObjectId encodes a timestamp in its first 4 bytes'],
    realWorld: 'A user document has a Date for createdAt (not a string) so MongoDB can query by date range efficiently.',
    mistakes: ['Storing dates as strings instead of Date objects', 'Using numbers for _id unless you have a specific reason'],
    practiceInstructions: [{ step: 1, instruction: 'Create a blog post document using correct BSON types for each field type.', hint: 'Use new Date() for publishedAt' }],
    starterCode: 'const post = {\n  _id: "generated-id",\n  title: "My First Post",\n  // Add: content (String), views (Number), published (Boolean),\n  // publishedAt (Date), tags (Array), author (embedded object)\n};\nconsole.log("Post type check:");\nconsole.log("title is string:", typeof post.title === "string");',
    hints: [{ level: 1, hint: 'new Date() creates a BSON Date', unlocked: true }],
    requirements: ['Has String, Number, Boolean fields', 'Has a Date field using new Date()', 'Has an Array field', 'Has a nested object'],
    problemStatement: 'Create a document for an e-commerce order with correct types: orderId (String), total (Number), isPaid (Boolean), items (Array of objects), createdAt (Date).'
  }),

  'mongodb-4-crud-create': makeStep({
    title: 'Inserting Documents',
    content: 'insertOne() adds a single document; insertMany() adds multiple documents in one operation. Both return information about the inserted document(s).',
    code: '// insertOne - add a single document\nconst newUser = {\n  name: "Alice",\n  email: "alice@example.com",\n  role: "user",\n  createdAt: new Date()\n};\n\n// Result: { acknowledged: true, insertedId: ObjectId("...") }\nconst result1 = { acknowledged: true, insertedId: "507f1f77bcf86cd799439011" };\nconsole.log("Inserted ID:", result1.insertedId);\n\n// insertMany - add multiple documents at once\nconst users = [\n  { name: "Bob",   email: "bob@example.com",   role: "user" },\n  { name: "Carol", email: "carol@example.com", role: "admin" }\n];\n\n// Result: { acknowledged: true, insertedCount: 2, insertedIds: { 0: ..., 1: ... } }\nconst result2 = { acknowledged: true, insertedCount: 2 };\nconsole.log("Inserted count:", result2.insertedCount);\n\n// MongoDB auto-creates the collection if it doesn\'t exist!\nconsole.log("Collection created automatically: true");',
    keyPoints: ['_id is automatically generated as ObjectId if not provided', 'insertMany() is faster than multiple insertOne() calls', 'MongoDB creates the collection on first insert', 'Use ordered: false in insertMany() to continue after errors'],
    realWorld: 'A user registration endpoint uses insertOne(). A data import script uses insertMany() for efficiency.',
    mistakes: ['Not handling duplicate _id errors (E11000)', 'Using multiple insertOne() when insertMany() would be faster'],
    practiceInstructions: [{ step: 1, instruction: 'Write the insertOne call to add a product with name, price, category, and stock fields.', hint: 'Include createdAt: new Date()' }],
    starterCode: 'const insertProduct = async (db) => {\n  const product = {\n    name: "Wireless Keyboard",\n    price: 79.99,\n    // Add category and stock\n  };\n  \n  // Write your insertOne call\n  console.log("Product to insert:", product.name);\n};\nconsole.log("Insert function ready");',
    hints: [{ level: 1, hint: 'db.collection("products").insertOne(product)', unlocked: true }],
    requirements: ['Uses insertOne()', 'Document has at least 4 fields', 'Logs the insertedId', 'Uses async/await'],
    problemStatement: 'Write a seed function that uses insertMany() to add 5 sample products with varied categories and prices.'
  }),

  'mongodb-5-crud-read': makeStep({
    title: 'Querying Documents',
    content: 'find() returns a cursor of matching documents; findOne() returns the first match or null. Use projections to control which fields are returned.',
    code: '// Simulating MongoDB query results\nconst users = [\n  { _id: 1, name: "Alice", age: 30, role: "admin",  active: true },\n  { _id: 2, name: "Bob",   age: 25, role: "user",   active: true },\n  { _id: 3, name: "Carol", age: 28, role: "user",   active: false }\n];\n\n// find({}) — all documents (simulated)\nconst all = users;\nconsole.log("All users:", all.length);\n\n// find with filter — active users\nconst activeUsers = users.filter(u => u.active);\nconsole.log("Active users:", activeUsers.length);\n\n// find with multiple conditions\nconst activeAdults = users.filter(u => u.active && u.age >= 25);\nconsole.log("Active adults:", activeAdults.length);\n\n// findOne — first match\nconst alice = users.find(u => u.name === "Alice");\nconsole.log("Found:", alice?.name);\n\n// Projection — only name and email\nconst names = users.map(({ name, role }) => ({ name, role }));\nconsole.log("Projected:", names);',
    keyPoints: ['find({}) returns all documents', 'findOne() returns null if not found (not undefined)', 'Projections use 1 (include) or 0 (exclude) — cannot mix', '_id is included by default; exclude with _id: 0'],
    realWorld: 'A user list page uses find() with { active: true } filter and projection to get only name/avatar, not password hashes.',
    mistakes: ['Mixing include and exclude in projections (only _id can be excluded when including others)', 'Not checking if findOne() returned null before accessing fields'],
    practiceInstructions: [{ step: 1, instruction: 'Write a query to find all products with price under $100 in the Electronics category.', hint: 'Use $lt for less than comparison' }],
    starterCode: 'const products = [\n  { name: "Mouse",    price: 29.99, category: "Electronics" },\n  { name: "Laptop",   price: 999,  category: "Electronics" },\n  { name: "Notebook", price: 5.99, category: "Stationery" }\n];\n\n// Filter: Electronics AND price < 100\nconst affordable = products.filter(p =>\n  // Your condition here\n  true\n);\nconsole.log("Affordable electronics:", affordable.map(p => p.name));',
    hints: [{ level: 1, hint: 'p.category === "Electronics" && p.price < 100', unlocked: true }],
    requirements: ['Filters by category', 'Filters by price', 'Returns matching documents', 'Handles empty results'],
    problemStatement: 'Write a paginated query function that takes page and pageSize parameters, returning the correct slice of results with a total count.'
  }),

  'mongodb-6-crud-update': makeStep({
    title: 'Update Operators',
    content: 'Always use update operators ($set, $inc, $push) when updating. Without them, you replace the entire document. $set modifies only specified fields.',
    code: '// Simulating document before update\nlet product = { _id: 1, name: "Laptop", price: 999, stock: 50, views: 100 };\n\n// $set — update specific fields\nproduct = { ...product, price: 899, updatedAt: new Date().toISOString() };\nconsole.log("After $set price:", product.price);\n\n// $inc — increment/decrement\nproduct.stock -= 1;    // $inc: { stock: -1 }\nproduct.views += 1;    // $inc: { views: 1 }\nconsole.log("After $inc — stock:", product.stock, "views:", product.views);\n\n// $push — add to array\nconst post = { _id: 2, title: "Post", tags: ["js", "web"] };\npost.tags.push("mongodb");  // $push: { tags: "mongodb" }\nconsole.log("Tags after push:", post.tags.join(", "));\n\n// $pull — remove from array\npost.tags = post.tags.filter(t => t !== "web");  // $pull: { tags: "web" }\nconsole.log("Tags after pull:", post.tags.join(", "));\n\n// $addToSet — add only if not duplicate\nconst roles = new Set(["user"]);\nroles.add("moderator");  // $addToSet: { roles: "moderator" }\nconsole.log("Roles:", [...roles].join(", "));',
    keyPoints: ['$set updates specific fields without touching others', '$inc adds/subtracts numbers atomically', '$push adds to arrays, $pull removes matches', '$addToSet prevents array duplicates'],
    realWorld: 'When a user views a product, $inc: { views: 1 } atomically increments the counter without a read-modify-write cycle.',
    mistakes: ['Calling updateOne(filter, document) without operators — this REPLACES the document', 'Using $push when $addToSet is safer (prevents duplicates)'],
    practiceInstructions: [{ step: 1, instruction: 'Write an update that increases a product price by 10% and records an updatedAt timestamp.', hint: 'Use $mul for multiplication or $set with a calculated value' }],
    starterCode: 'let item = { name: "Widget", price: 100, stock: 25 };\n\n// Apply a 10% price increase and add updatedAt\nconst updated = {\n  ...item,\n  price: item.price * 1.10,  // $mul: { price: 1.10 }\n  // Add updatedAt\n};\n\nconsole.log("Original price:", item.price);\nconsole.log("New price:", updated.price.toFixed(2));\nconsole.log("Updated at:", updated.updatedAt);',
    hints: [{ level: 1, hint: 'new Date().toISOString() for updatedAt', unlocked: true }],
    requirements: ['Updates price by 10%', 'Adds updatedAt timestamp', 'Does not affect other fields', 'Rounds price to 2 decimals'],
    problemStatement: 'Write a function that applies a bulk price discount to all products in a given category using updateMany().'
  }),

  'mongodb-7-crud-delete': makeStep({
    title: 'Deleting Documents',
    content: 'deleteOne() removes the first matching document; deleteMany() removes all matches. Consider soft delete (setting deleted=true) for data that may need recovery.',
    code: '// Simulating delete operations\nlet users = [\n  { _id: 1, name: "Alice", active: true,  lastLogin: new Date("2024-01-15") },\n  { _id: 2, name: "Bob",   active: false, lastLogin: new Date("2023-06-01") },\n  { _id: 3, name: "Carol", active: true,  lastLogin: new Date("2024-02-20") }\n];\n\n// deleteOne — remove first inactive user\nconst toDelete = users.find(u => !u.active);\nusers = users.filter(u => u._id !== toDelete?._id);\nconsole.log("After deleteOne:", users.map(u => u.name));\n\n// Soft delete — set deletedAt instead of removing\nconst softDelete = (id) => {\n  const user = users.find(u => u._id === id);\n  if (user) user.deletedAt = new Date().toISOString();\n  return user;\n};\nsoftDelete(1);\nconsole.log("Alice has deletedAt:", !!users.find(u => u._id === 1)?.deletedAt);\n\n// deleteMany — remove old inactive users\nconst sixMonthsAgo = new Date("2023-09-01");\nconst before = users.length;\nusers = users.filter(u => u.active || u.lastLogin >= sixMonthsAgo);\nconsole.log("Cleaned up:", before - users.length, "stale users");',
    keyPoints: ['deleteOne() removes only the first match', 'deleteMany({}) removes ALL documents — use with extreme caution!', 'Soft delete preserves data for audit/recovery', 'findOneAndDelete() returns the deleted document atomically'],
    realWorld: 'User account deletion is often a soft delete that hides the account but keeps the data for 30 days before permanent deletion.',
    mistakes: ['Using deleteMany({}) without a filter by accident', 'Hard deleting order history that might be needed for financial records'],
    practiceInstructions: [{ step: 1, instruction: 'Write code to soft-delete a user by setting their deletedAt and active=false.', hint: 'Use $set with both fields' }],
    starterCode: 'let user = { _id: 1, name: "Alice", active: true };\n\n// Soft delete: add deletedAt and set active=false\nconst softDeleted = {\n  ...user,\n  active: false,\n  // Add deletedAt field\n};\n\nconsole.log("Active:", softDeleted.active);\nconsole.log("Deleted at:", softDeleted.deletedAt);',
    hints: [{ level: 1, hint: 'deletedAt: new Date().toISOString()', unlocked: true }],
    requirements: ['Sets active to false', 'Adds deletedAt timestamp', 'Does not remove the document', 'Uses correct date format'],
    problemStatement: 'Implement a purge() function that permanently deletes all soft-deleted records older than 90 days.'
  }),

  'mongodb-8-query-operators': makeStep({
    title: 'Comparison and Logical Operators',
    content: 'MongoDB query operators filter documents with complex conditions. $gt, $lt, $in, $exists are comparison operators. $and, $or, $not are logical operators.',
    code: '// Simulating query operator logic\nconst products = [\n  { name: "Laptop",  price: 999,  category: "Electronics", stock: 5  },\n  { name: "Mouse",   price: 29,   category: "Electronics", stock: 50 },\n  { name: "Desk",    price: 299,  category: "Furniture",   stock: 10 },\n  { name: "Pen",     price: 2,    category: "Stationery",  stock: 200 }\n];\n\n// $gte / $lte: price between 20 and 300\nconst midRange = products.filter(p => p.price >= 20 && p.price <= 300);\nconsole.log("Mid-range:", midRange.map(p => p.name));\n\n// $in: specific categories\nconst techItems = products.filter(p =>\n  ["Electronics", "Gadgets"].includes(p.category)\n);\nconsole.log("Tech items:", techItems.map(p => p.name));\n\n// $or: expensive OR limited stock\nconst special = products.filter(p => p.price > 500 || p.stock < 10);\nconsole.log("Special items:", special.map(p => p.name));\n\n// $and: Electronics AND in stock AND affordable\nconst good = products.filter(p =>\n  p.category === "Electronics" && p.stock > 0 && p.price < 100\n);\nconsole.log("Good buys:", good.map(p => p.name));',
    keyPoints: ['$gt (>), $gte (>=), $lt (<), $lte (<=) for number/date comparisons', '$in checks if value is in an array; $nin is the inverse', '$and is implicit when multiple fields are in the filter', '$or requires an array of conditions'],
    realWorld: 'An e-commerce search filter: { price: { $gte: min, $lte: max }, category: { $in: selectedCategories }, stock: { $gt: 0 } }',
    mistakes: ['Using $and when implicit AND (multiple fields) is sufficient', 'Forgetting $or needs an array: $or: [cond1, cond2]'],
    practiceInstructions: [{ step: 1, instruction: 'Build a query for users aged 18-65 who are either admin role or have score > 90.', hint: 'Combine $gte/$lte with $or' }],
    starterCode: 'const users = [\n  { name: "Alice", age: 30, role: "admin", score: 85 },\n  { name: "Bob",   age: 17, role: "user",  score: 95 },\n  { name: "Carol", age: 45, role: "user",  score: 70 }\n];\n\n// Filter: age 18-65 AND (admin OR score > 90)\nconst eligible = users.filter(u =>\n  // Your conditions here\n  true\n);\nconsole.log("Eligible:", eligible.map(u => u.name));',
    hints: [{ level: 1, hint: 'u.age >= 18 && u.age <= 65 && (u.role === "admin" || u.score > 90)', unlocked: true }],
    requirements: ['Filters by age range', 'Uses OR for role/score condition', 'Returns correct results'],
    problemStatement: 'Build a job board query: find jobs that are (remote OR in "London") AND salary > 50000 AND not expired.'
  }),

  'mongodb-9-array-operators': makeStep({
    title: 'Array Operators',
    content: 'MongoDB provides $elemMatch for array element conditions, $all to match arrays containing all specified values, $size for array length, and $push/$pull for updates.',
    code: '// Array operator demonstrations\nconst posts = [\n  { title: "Intro JS",      tags: ["javascript", "beginner"],    scores: [{ subject: "JS", grade: 95 }] },\n  { title: "Advanced JS",   tags: ["javascript", "advanced"],    scores: [{ subject: "JS", grade: 88 }] },\n  { title: "MongoDB Tips",  tags: ["mongodb", "database"],       scores: [{ subject: "DB", grade: 92 }] }\n];\n\n// Contains "javascript"\nconst jsPosts = posts.filter(p => p.tags.includes("javascript"));\nconsole.log("JS posts:", jsPosts.map(p => p.title));\n\n// $all: contains ALL specified tags\nconst advancedJs = posts.filter(p =>\n  ["javascript", "advanced"].every(t => p.tags.includes(t))\n);\nconsole.log("Advanced JS:", advancedJs.map(p => p.title));\n\n// $elemMatch: score element where grade >= 90\nconst topScores = posts.filter(p =>\n  p.scores.some(s => s.grade >= 90)\n);\nconsole.log("Top score posts:", topScores.map(p => p.title));\n\n// $size: exactly 2 tags\nconst twoTags = posts.filter(p => p.tags.length === 2);\nconsole.log("Two-tag posts:", twoTags.length);',
    keyPoints: ['Simple equality (tags: "js") checks if any element equals the value', '$all requires ALL values to be present in the array', '$elemMatch matches multiple conditions on the SAME array element', '$addToSet prevents duplicates; $push always adds'],
    realWorld: 'A skill-matching platform uses $all to find candidates who have ALL required skills in their skills array.',
    mistakes: ['Using multiple conditions without $elemMatch — they can match different elements!', 'Using $push when $addToSet would prevent duplicates'],
    practiceInstructions: [{ step: 1, instruction: 'Find users who have BOTH "javascript" and "mongodb" skills. Then add "nodejs" to their skills without duplicates.', hint: '$all for finding, $addToSet for updating' }],
    starterCode: 'const users = [\n  { name: "Alice", skills: ["javascript", "mongodb", "react"] },\n  { name: "Bob",   skills: ["python", "mongodb"] },\n  { name: "Carol", skills: ["javascript", "mongodb", "nodejs"] }\n];\n\n// Find users with BOTH skills\nconst fullStack = users.filter(u =>\n  ["javascript", "mongodb"].every(s => u.skills.includes(s))\n);\nconsole.log("Full-stack devs:", fullStack.map(u => u.name));\n\n// Add "nodejs" without duplicates\nfullStack.forEach(u => {\n  if (!u.skills.includes("nodejs")) u.skills.push("nodejs");\n});\nconsole.log("Updated skills:", fullStack.map(u => ({ name: u.name, skills: u.skills })));',
    hints: [{ level: 1, hint: 'every() simulates $all; includes() check prevents $addToSet duplicates', unlocked: true }],
    requirements: ['Correctly finds users with all required skills', 'Prevents duplicate skill additions', 'Updates the correct documents'],
    problemStatement: 'Write queries for a shopping cart: find carts with a specific product, remove expired items, and find carts with more than 5 items.'
  }),

  'mongodb-10-indexing-fundamentals': makeStep({
    title: 'Indexes Speed Up Queries',
    content: 'Indexes create sorted data structures that MongoDB uses to find documents without scanning the entire collection. Without indexes, MongoDB does a COLLSCAN (collection scan).',
    code: '// Demonstrating index performance difference (simulated)\nconst COLLECTION_SIZE = 1000000; // 1 million documents\n\n// Without index: scan every document\nconst withoutIndex = () => {\n  const docsScanned = COLLECTION_SIZE;\n  const timeMsEstimate = COLLECTION_SIZE / 10000; // rough estimate\n  return { docsScanned, timeMsEstimate, plan: "COLLSCAN" };\n};\n\n// With index: jump directly to matching docs\nconst withIndex = () => {\n  const docsScanned = 1; // Only matching docs\n  const timeMsEstimate = 0.1;\n  return { docsScanned, timeMsEstimate, plan: "IXSCAN" };\n};\n\nconst noIdx = withoutIndex();\nconst idx = withIndex();\n\nconsole.log("Without index:");\nconsole.log("  Docs scanned:", noIdx.docsScanned.toLocaleString());\nconsole.log("  Plan:", noIdx.plan);\nconsole.log("With index:");\nconsole.log("  Docs scanned:", idx.docsScanned);\nconsole.log("  Plan:", idx.plan);\nconsole.log("  Speedup:", Math.round(noIdx.docsScanned / idx.docsScanned) + "x faster");',
    keyPoints: ['_id field is always indexed automatically', 'IXSCAN (index scan) is far faster than COLLSCAN', '1 = ascending index, -1 = descending', 'Use explain("executionStats") to verify index usage'],
    realWorld: 'Without an index on users.email, every login attempt scans the entire users collection. With the index, it\'s instant.',
    mistakes: ['Not indexing fields used in frequent queries', 'Over-indexing — each index slows down write operations'],
    practiceInstructions: [{ step: 1, instruction: 'Design indexes for a blog: posts queried by authorId, by tag, and sorted by publishedAt.', hint: 'Consider compound index for authorId + publishedAt' }],
    starterCode: '// Describe the indexes you would create\nconst indexes = [\n  // Index 1: for queries by authorId\n  { field: "authorId", direction: 1, reason: "Find posts by author" },\n  // Add more indexes\n];\n\nindexes.forEach((idx, i) => {\n  console.log(`Index ${i+1}: ${idx.field} (${idx.direction === 1 ? "asc" : "desc"})`);\n  console.log(`  Reason: ${idx.reason}`);\n});',
    hints: [{ level: 1, hint: 'tags array needs its own index; compound { authorId: 1, publishedAt: -1 } serves both fields', unlocked: true }],
    requirements: ['Identifies field(s) to index', 'Considers sort direction', 'Provides reasoning', 'Considers compound index where appropriate'],
    problemStatement: 'Analyze an e-commerce query that gets active products in a category sorted by price. Design the optimal compound index and explain why.'
  }),

};

// For tutorials not in the explicit map, generate a step from their title
function autoStep(title, slug) {
  const topic = title.replace(/MongoDB \d+: /, '');
  return makeStep({
    title: topic,
    content: `${topic} is an essential MongoDB concept. This tutorial walks you through the key patterns and techniques you need to work with ${topic.toLowerCase()} effectively.`,
    code: `// ${topic} demonstration\n\n// Sample data to work with\nconst sampleData = [\n  { _id: 1, name: "Document A", value: 100, category: "demo" },\n  { _id: 2, name: "Document B", value: 200, category: "demo" },\n  { _id: 3, name: "Document C", value: 300, category: "sample" }\n];\n\n// Apply ${topic} concepts\nconst processed = sampleData.map(doc => ({\n  ...doc,\n  processed: true,\n  topic: "${topic}"\n}));\n\nconsole.log("Topic:", "${topic}");\nconsole.log("Sample documents:", sampleData.length);\nconsole.log("First doc:", JSON.stringify(sampleData[0]));\nconsole.log("Processed:", processed.length, "documents");`,
    keyPoints: [
      `${topic} helps build scalable MongoDB applications`,
      'Always test with realistic data volumes',
      'Use explain() to verify query performance',
      'Follow MongoDB naming conventions'
    ],
    realWorld: `Production applications use ${topic.toLowerCase()} to handle high-volume data operations reliably.`,
    mistakes: [
      'Not testing with production-scale data',
      'Skipping error handling for edge cases'
    ],
    practiceInstructions: [{ step: 1, instruction: `Practice the core ${topic} pattern with the starter code below.`, hint: 'Modify the filter or transformation to see different results' }],
    starterCode: `// ${topic} practice\nconst data = [\n  { id: 1, name: "Item 1", active: true,  score: 85 },\n  { id: 2, name: "Item 2", active: false, score: 92 },\n  { id: 3, name: "Item 3", active: true,  score: 78 }\n];\n\n// Apply a filter and transformation\nconst result = data\n  .filter(d => d.active)\n  .map(d => ({ ...d, grade: d.score >= 90 ? "A" : "B" }));\n\nconsole.log("Results:", result.length);\nresult.forEach(r => console.log(" -", r.name, ":", r.grade));`,
    hints: [{ level: 1, hint: 'Try changing the filter condition to see different results', unlocked: true }],
    requirements: [
      `Demonstrates ${topic} pattern`,
      'Includes error handling',
      'Logs meaningful output',
      'Follows MongoDB best practices'
    ],
    problemStatement: `Design a complete implementation using ${topic} for a real-world scenario with at least 3 distinct operations.`
  });
}

async function seed() {
  await mongoose.connect(mongoURI);
  console.log('✅ Connected to MongoDB');

  const emptyTutorials = await MongoTutorial.find({ 'steps.0': { $exists: false } }).lean();
  console.log(`Found ${emptyTutorials.length} tutorials without steps`);

  let updated = 0, failed = 0;
  for (const t of emptyTutorials) {
    try {
      const step = contentMap[t.slug] || autoStep(t.title, t.slug);
      await MongoTutorial.updateOne({ _id: t._id }, { $set: { steps: [step] } });
      updated++;
      if (updated % 20 === 0) console.log(`  Progress: ${updated}/${emptyTutorials.length}`);
    } catch (err) {
      console.log(`  ✗ ${t.title}: ${err.message.slice(0, 80)}`);
      failed++;
    }
  }

  console.log(`\n✅ Done! Updated: ${updated}, Failed: ${failed}`);

  // Verify
  const withSteps = await MongoTutorial.countDocuments({ 'steps.0': { $exists: true } });
  console.log(`Tutorials with steps now: ${withSteps}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
