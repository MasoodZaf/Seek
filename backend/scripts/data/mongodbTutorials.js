// 25 MongoDB Tutorials with full 3-phase content
module.exports = function (T, S) {
  return [
    T({
      title: 'MongoDB Introduction and Setup', slug: 'mongodb-introduction-setup',
      description: 'Get started with MongoDB: understand document databases and perform basic operations.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['mongodb', 'nosql', 'database', 'setup'],
      category: 'Database',
      objectives: ['Understand document databases', 'Connect to MongoDB', 'Perform basic CRUD operations'],
      featured: true,
      steps: [
        S(1, {
          title: 'What is MongoDB?', content: 'MongoDB is a document-oriented NoSQL database that stores data in flexible JSON-like documents.',
          lang: 'javascript', code: '// Connect to MongoDB and insert a document\nconst { MongoClient } = require("mongodb");\n\nasync function main() {\n  const client = new MongoClient("mongodb://localhost:27017");\n  await client.connect();\n  const db = client.db("myapp");\n  const users = db.collection("users");\n  \n  await users.insertOne({ name: "Alice", age: 30, email: "alice@example.com" });\n  const user = await users.findOne({ name: "Alice" });\n  console.log(user);\n  await client.close();\n}\nmain();',
          concept: 'MongoDB stores data as BSON documents (binary JSON). Unlike SQL tables with fixed schemas, MongoDB collections can hold documents with different structures. Each document has a unique _id field.',
          keyPoints: ['Documents are JSON-like (BSON internally)', 'Collections hold related documents', 'No fixed schema required', 'Every document gets a unique _id'],
          realWorld: 'Content management systems use MongoDB because articles can have varying fields — some have images, some have videos, some have both.',
          mistakes: ['Forgetting to close the connection', 'Not awaiting async operations', 'Assuming SQL-like joins are available'],
          pInstructions: ['Connect to a MongoDB database', 'Insert a document with name, age, email', 'Find the document and log it'],
          starter: 'const { MongoClient } = require("mongodb");\n\nasync function main() {\n  const client = new MongoClient("mongodb://localhost:27017");\n  // Connect\n  // Get database and collection\n  // Insert a document\n  // Find and print it\n  // Close connection\n}\nmain();',
          solution: 'const { MongoClient } = require("mongodb");\nasync function main() {\n  const client = new MongoClient("mongodb://localhost:27017");\n  await client.connect();\n  const db = client.db("testdb");\n  const col = db.collection("people");\n  await col.insertOne({ name: "Bob", age: 25, email: "bob@test.com" });\n  const doc = await col.findOne({ name: "Bob" });\n  console.log(doc);\n  await client.close();\n}\nmain();',
          hints: ['Use await with all MongoDB operations', 'findOne returns a single document or null'],
          challenge: 'Create a complete CRUD script: insert 3 users, find all, update one, delete one, then list remaining.',
          reqs: ['insertMany for 3 users', 'find().toArray() for all', 'updateOne to change age', 'deleteOne to remove user'],
          tests: [['insertMany(3)', '3 inserted', 5], ['after delete', '2 remaining', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB CRUD Operations', slug: 'mongodb-crud-operations',
      description: 'Master Create, Read, Update, and Delete operations in MongoDB.',
      language: 'javascript', difficulty: 'beginner', duration: 40,
      tags: ['mongodb', 'crud', 'database', 'operations'],
      category: 'Database',
      objectives: ['Insert single and multiple documents', 'Query with filters', 'Update and delete documents'],
      steps: [
        S(1, {
          title: 'Insert and Find Operations', content: 'MongoDB provides insertOne, insertMany, findOne, and find for creating and reading documents.',
          lang: 'javascript', code: '// Insert operations\nawait collection.insertOne({ title: "Post 1", likes: 10 });\nawait collection.insertMany([\n  { title: "Post 2", likes: 25 },\n  { title: "Post 3", likes: 5 }\n]);\n\n// Find operations\nconst one = await collection.findOne({ title: "Post 1" });\nconst popular = await collection.find({ likes: { $gt: 10 } }).toArray();\nconst count = await collection.countDocuments({ likes: { $gte: 10 } });\nconsole.log(one, popular, count);',
          concept: 'insertOne adds a single document, insertMany adds an array. findOne returns the first match, find returns a cursor (use toArray to get all results). Comparison operators like $gt, $lt filter results.',
          keyPoints: ['insertOne returns insertedId', 'insertMany returns insertedIds', 'find returns a cursor, not array', 'Use $gt, $lt, $gte, $lte, $ne for comparisons'],
          realWorld: 'E-commerce platforms use insertMany to bulk-import product catalogs and find with filters to display search results.',
          mistakes: ['Forgetting .toArray() on find cursor', 'Not checking insertedCount', 'Using find when findOne is sufficient'],
          pInstructions: ['Insert 5 product documents', 'Find products over a certain price', 'Count products in a category'],
          starter: '// Assume collection is ready\n// Insert 5 products with name, price, category\n\n// Find expensive products (price > 50)\n\n// Count electronics',
          solution: 'await col.insertMany([\n  { name: "Laptop", price: 999, category: "electronics" },\n  { name: "Book", price: 15, category: "books" },\n  { name: "Phone", price: 699, category: "electronics" },\n  { name: "Pen", price: 2, category: "office" },\n  { name: "Tablet", price: 449, category: "electronics" }\n]);\nconst expensive = await col.find({ price: { $gt: 50 } }).toArray();\nconsole.log("Expensive:", expensive.length);\nconst elecCount = await col.countDocuments({ category: "electronics" });\nconsole.log("Electronics:", elecCount);',
          hints: ['$gt means greater than', 'countDocuments takes a filter object'],
          challenge: 'Build a product inventory system: add products, search by price range and category, find the most expensive item.',
          reqs: ['Insert at least 10 products', 'Search with $and combining price range and category', 'Sort by price descending to find most expensive', 'Use projection to return only name and price'],
          tests: [['find electronics > $100', 'filtered results', 5]]
        }),
        S(2, {
          title: 'Update and Delete Operations', content: 'updateOne, updateMany, deleteOne, and deleteMany modify or remove documents.',
          lang: 'javascript', code: '// Update operations\nawait collection.updateOne(\n  { title: "Post 1" },\n  { $set: { likes: 15 }, $inc: { views: 1 } }\n);\n\nawait collection.updateMany(\n  { likes: { $lt: 10 } },\n  { $set: { status: "low-engagement" } }\n);\n\n// Delete operations\nawait collection.deleteOne({ title: "Post 3" });\nconst result = await collection.deleteMany({ status: "low-engagement" });\nconsole.log("Deleted:", result.deletedCount);',
          concept: 'Update operators: $set changes fields, $inc increments numbers, $unset removes fields, $push adds to arrays. The first argument is the filter, second is the update.',
          keyPoints: ['$set replaces field values', '$inc adds to numeric fields', '$push appends to arrays', 'deleteMany removes all matches'],
          realWorld: 'Social media platforms use $inc to atomically increment like/view counters without read-modify-write races.',
          mistakes: ['Forgetting the $ operator in updates', 'Using updateOne when updateMany is needed', 'Accidentally deleting all documents with empty filter'],
          pInstructions: ['Update a single document with $set', 'Use $inc to increment a counter', 'Delete documents matching a condition'],
          starter: '// Update product price\n// Increment product stock\n// Delete out-of-stock products',
          solution: 'await col.updateOne({ name: "Laptop" }, { $set: { price: 899 } });\nawait col.updateOne({ name: "Phone" }, { $inc: { stock: 10 } });\nconst del = await col.deleteMany({ stock: { $lte: 0 } });\nconsole.log("Deleted:", del.deletedCount);',
          hints: ['$set: { field: newValue }', '$inc: { field: amount } (negative to decrement)'],
          challenge: 'Implement a shopping cart: add items ($push), update quantity ($set on nested), remove items ($pull), and clear cart (deleteOne).',
          reqs: ['Use $push to add items', 'Use $set with dot notation for nested updates', 'Use $pull to remove items', 'Handle empty cart'],
          tests: [['add 3 items', 'cart has 3', 5], ['remove 1', 'cart has 2', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Query Operators', slug: 'mongodb-query-operators',
      description: 'Use comparison, logical, array, and element query operators effectively.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['mongodb', 'queries', 'operators', 'database'],
      category: 'Database',
      objectives: ['Use comparison operators ($gt, $lt, $in)', 'Combine with logical operators ($and, $or)', 'Query arrays and nested documents'],
      steps: [
        S(1, {
          title: 'Comparison and Logical Operators', content: 'MongoDB provides rich query operators for filtering documents.',
          lang: 'javascript', code: '// Comparison operators\nconst results = await col.find({\n  age: { $gte: 18, $lte: 65 },\n  status: { $in: ["active", "pending"] },\n  role: { $ne: "admin" }\n}).toArray();\n\n// Logical operators\nconst complex = await col.find({\n  $or: [\n    { age: { $lt: 25 } },\n    { $and: [{ role: "premium" }, { balance: { $gt: 100 } }] }\n  ]\n}).toArray();',
          concept: '$gt/$lt/$gte/$lte compare values. $in matches any in an array. $or/$and combine conditions. $not/$nor negate. These can be nested for complex queries.',
          keyPoints: ['$in: match any value in array', '$nin: match none in array', '$or: at least one condition true', '$and: all conditions true (implicit for same field)'],
          realWorld: 'Job search platforms use complex query operators to filter by salary range, location, experience level, and job type simultaneously.',
          mistakes: ['Using $and when implicit AND works', 'Wrong nesting of $or and $and', 'Forgetting that multiple conditions on same field need explicit $and'],
          pInstructions: ['Find users aged 18-30', 'Find users who are either premium or have balance > 1000', 'Find users NOT in a blocked list'],
          starter: '// Find users aged 18-30\nconst young = await col.find(/* your query */).toArray();\n\n// Find premium OR high-balance users\nconst valuable = await col.find(/* your query */).toArray();\n\n// Find users not in blocked list\nconst allowed = await col.find(/* your query */).toArray();',
          solution: 'const young = await col.find({ age: { $gte: 18, $lte: 30 } }).toArray();\nconst valuable = await col.find({ $or: [{ tier: "premium" }, { balance: { $gt: 1000 } }] }).toArray();\nconst blocked = ["user1", "user2"];\nconst allowed = await col.find({ username: { $nin: blocked } }).toArray();',
          hints: ['$gte: 18, $lte: 30 for range', '$or takes an array of conditions'],
          challenge: 'Build a movie search engine that filters by genre (multiple), year range, minimum rating, and text in title. Support combining all filters.',
          reqs: ['Genre filter with $in', 'Year range with $gte/$lte', 'Rating with $gte', 'Title search with $regex'],
          tests: [['action movies 2020+ rating 8+', 'filtered results', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Indexing', slug: 'mongodb-indexing',
      description: 'Create and manage indexes for query performance optimization.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['mongodb', 'indexes', 'performance', 'database'],
      category: 'Database',
      objectives: ['Create single and compound indexes', 'Use explain() to analyze queries', 'Understand index types'],
      steps: [
        S(1, {
          title: 'Creating and Using Indexes', content: 'Indexes speed up queries by avoiding full collection scans.',
          lang: 'javascript', code: '// Create indexes\nawait col.createIndex({ email: 1 }, { unique: true });\nawait col.createIndex({ age: 1, name: 1 });  // Compound\nawait col.createIndex({ bio: "text" });        // Text index\n\n// Use explain to check if index is used\nconst plan = await col.find({ email: "alice@test.com" })\n  .explain("executionStats");\nconsole.log(plan.executionStats.executionStages.stage);\n// Should show IXSCAN, not COLLSCAN\n\n// List all indexes\nconst indexes = await col.indexes();\nconsole.log(indexes);',
          concept: 'Indexes are B-tree structures that allow MongoDB to find documents without scanning every document. 1 = ascending, -1 = descending. Compound indexes support queries on prefix fields.',
          keyPoints: ['1 = ascending, -1 = descending', 'Compound indexes support prefix queries', 'unique: true enforces uniqueness', 'Text indexes enable full-text search'],
          realWorld: 'E-commerce sites index product category + price to speed up filtered, sorted product listings.',
          mistakes: ['Too many indexes slow down writes', 'Compound index field order matters', 'Not using explain() to verify index usage'],
          pInstructions: ['Create a single-field index on email', 'Create a compound index on category + price', 'Use explain to verify the index is used'],
          starter: '// Create indexes\n\n// Run a query and check explain output\n\n// List all indexes',
          solution: 'await col.createIndex({ email: 1 }, { unique: true });\nawait col.createIndex({ category: 1, price: -1 });\nconst plan = await col.find({ category: "electronics" }).sort({ price: -1 }).explain();\nconsole.log("Stage:", plan.queryPlanner.winningPlan.stage);\nconst idxs = await col.indexes();\nconsole.log("Indexes:", idxs.length);',
          hints: ['explain() shows query execution plan', 'IXSCAN means index is used, COLLSCAN means full scan'],
          challenge: 'Benchmark a query with and without an index on a collection of 10000 documents. Report the execution time difference.',
          reqs: ['Insert 10000 documents', 'Time query without index', 'Create index and time same query', 'Report speedup factor'],
          tests: [['with index', 'IXSCAN', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Aggregation Pipeline', slug: 'mongodb-aggregation-pipeline',
      description: 'Build powerful data transformations with the aggregation framework.',
      language: 'javascript', difficulty: 'intermediate', duration: 50,
      tags: ['mongodb', 'aggregation', 'pipeline', 'database'],
      category: 'Database',
      objectives: ['Use $match, $group, $sort stages', 'Project and reshape documents', 'Build multi-stage pipelines'],
      featured: true,
      steps: [
        S(1, {
          title: 'Aggregation Basics', content: 'The aggregation pipeline processes documents through a series of stages.',
          lang: 'javascript', code: 'const results = await col.aggregate([\n  { $match: { status: "active" } },\n  { $group: {\n    _id: "$department",\n    avgSalary: { $avg: "$salary" },\n    count: { $sum: 1 },\n    maxSalary: { $max: "$salary" }\n  }},\n  { $sort: { avgSalary: -1 } },\n  { $project: {\n    department: "$_id",\n    avgSalary: { $round: ["$avgSalary", 2] },\n    count: 1,\n    _id: 0\n  }}\n]).toArray();\nconsole.log(results);',
          concept: '$match filters documents (like find). $group aggregates by a key with accumulators ($sum, $avg, $min, $max). $sort orders results. $project reshapes output. Stages run in sequence.',
          keyPoints: ['$match filters early for performance', '$group uses accumulators', '$sort: 1 ascending, -1 descending', '$project reshapes documents'],
          realWorld: 'Analytics dashboards use aggregation pipelines to compute real-time metrics like daily active users, average session duration, and revenue by region.',
          mistakes: ['Placing $match after $group (less efficient)', 'Forgetting $ prefix for field references in $group', 'Not handling null/missing values in aggregations'],
          pInstructions: ['Match orders from 2024', 'Group by product category with total sales', 'Sort by total sales descending'],
          starter: 'const pipeline = [\n  // Match 2024 orders\n  // Group by category with total and count\n  // Sort by total descending\n];\nconst results = await col.aggregate(pipeline).toArray();',
          solution: 'const pipeline = [\n  { $match: { year: 2024 } },\n  { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },\n  { $sort: { total: -1 } },\n  { $project: { category: "$_id", total: 1, count: 1, _id: 0 } }\n];\nconst results = await col.aggregate(pipeline).toArray();\nconsole.log(results);',
          hints: ['$sum: "$field" sums values, $sum: 1 counts documents', 'Put $match first to reduce documents early'],
          challenge: 'Build an aggregation pipeline that computes: top 5 customers by total spend, their average order value, and their most frequent category.',
          reqs: ['$match for completed orders', '$group by customer', '$sort by total spend', '$limit to top 5'],
          tests: [['top 5 by spend', 'sorted descending', 5]]
        }),
        S(2, {
          title: 'Advanced Pipeline Stages', content: '$lookup for joins, $unwind for arrays, $addFields for computed fields.',
          lang: 'javascript', code: '// $lookup (left outer join)\nconst withAuthor = await posts.aggregate([\n  { $lookup: {\n    from: "users",\n    localField: "authorId",\n    foreignField: "_id",\n    as: "author"\n  }},\n  { $unwind: "$author" },\n  { $addFields: {\n    authorName: "$author.name",\n    isPopular: { $gte: ["$likes", 100] }\n  }},\n  { $project: { title: 1, authorName: 1, isPopular: 1 } }\n]).toArray();',
          concept: '$lookup performs a left outer join with another collection. $unwind flattens arrays into separate documents. $addFields adds computed fields without removing existing ones.',
          keyPoints: ['$lookup joins collections', '$unwind deconstructs arrays', '$addFields adds without removing', '$facet runs parallel sub-pipelines'],
          realWorld: 'Reporting systems use $lookup to join orders with customers and products, then $group to compute sales summaries.',
          mistakes: ['$lookup returns an array even for 1:1 relations', 'Forgetting $unwind after $lookup for single results', '$unwind on missing field removes the document'],
          pInstructions: ['Join orders with products using $lookup', 'Unwind the joined array', 'Add a computed total field'],
          starter: 'const pipeline = [\n  // $lookup orders with products\n  // $unwind product\n  // $addFields to compute total\n];',
          solution: 'const pipeline = [\n  { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },\n  { $unwind: "$product" },\n  { $addFields: { total: { $multiply: ["$quantity", "$product.price"] } } },\n  { $project: { orderId: 1, total: 1, productName: "$product.name" } }\n];\nconst results = await orders.aggregate(pipeline).toArray();',
          hints: ['$lookup "as" field is always an array', 'Use $unwind to flatten the array'],
          challenge: 'Build a report that shows each category with its products, average price, and the number sold. Use $lookup, $unwind, $group, and $sort.',
          reqs: ['Join products with sales', 'Group by category', 'Calculate average price and total sold', 'Sort by total sold descending'],
          tests: [['category report', 'grouped results', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Schema Design', slug: 'mongodb-schema-design',
      description: 'Design effective document schemas with embedding vs referencing patterns.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['mongodb', 'schema-design', 'data-modeling', 'database'],
      category: 'Database',
      objectives: ['Choose between embedding and referencing', 'Apply common schema patterns', 'Handle one-to-many and many-to-many relationships'],
      steps: [
        S(1, {
          title: 'Embedding vs Referencing', content: 'MongoDB gives you flexibility in how you structure relationships between data.',
          lang: 'javascript', code: '// Embedded (denormalized) - good for 1:few\nconst userEmbedded = {\n  name: "Alice",\n  addresses: [\n    { street: "123 Main St", city: "NYC", zip: "10001" },\n    { street: "456 Oak Ave", city: "LA", zip: "90001" }\n  ]\n};\n\n// Referenced (normalized) - good for 1:many\nconst user = { _id: ObjectId("..."), name: "Alice" };\nconst order1 = { userId: ObjectId("..."), total: 99.99 };\nconst order2 = { userId: ObjectId("..."), total: 49.99 };',
          concept: 'Embedding stores related data in the same document (fast reads, atomic updates). Referencing stores IDs and joins at query time (avoids duplication, better for large/changing data). Choose based on access patterns.',
          keyPoints: ['Embed for 1:few, data read together', 'Reference for 1:many, independent access', 'Embed for atomic updates needed', 'Reference when data changes frequently'],
          realWorld: 'Blog posts embed comments (read together) but reference authors (shared across posts).',
          mistakes: ['Embedding too much (16MB document limit)', 'Over-normalizing (too many lookups)', 'Not considering read vs write patterns'],
          pInstructions: ['Design a blog post schema with embedded comments', 'Design an e-commerce schema with referenced products', 'Explain your choices'],
          starter: '// Design a blog post with embedded comments\nconst blogPost = {\n  // your schema\n};\n\n// Design an order referencing products\nconst order = {\n  // your schema\n};',
          solution: '// Blog post with embedded comments (read together, few comments)\nconst blogPost = {\n  title: "My Post",\n  content: "Content here...",\n  author: { name: "Alice", avatar: "url" },\n  comments: [\n    { user: "Bob", text: "Great post!", date: new Date() }\n  ],\n  tags: ["tech", "mongodb"]\n};\n\n// Order with referenced products (many products, independent)\nconst order = {\n  userId: "ObjectId(ref)",\n  items: [\n    { productId: "ObjectId(ref)", quantity: 2, priceAtPurchase: 29.99 }\n  ],\n  total: 59.98,\n  status: "shipped"\n};',
          hints: ['Embed data that is always read together', 'Store priceAtPurchase to avoid price changes affecting old orders'],
          challenge: 'Design a social media platform schema supporting users, posts, comments, likes, and followers. Justify each embedding/referencing choice.',
          reqs: ['User profile with embedded settings', 'Posts with embedded comments (max 100)', 'Followers as references', 'Like counts with separate collection for who-liked'],
          tests: [['user schema', 'has settings embedded', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Data Validation', slug: 'mongodb-data-validation',
      description: 'Enforce data integrity with JSON Schema validation rules.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['mongodb', 'validation', 'schema', 'database'],
      category: 'Database',
      objectives: ['Create collections with validation rules', 'Use JSON Schema for field types', 'Handle validation errors'],
      steps: [
        S(1, {
          title: 'Schema Validation', content: 'MongoDB supports JSON Schema validation to enforce document structure.',
          lang: 'javascript', code: 'await db.createCollection("products", {\n  validator: {\n    $jsonSchema: {\n      bsonType: "object",\n      required: ["name", "price", "category"],\n      properties: {\n        name: { bsonType: "string", description: "must be a string" },\n        price: { bsonType: "double", minimum: 0, description: "must be >= 0" },\n        category: { enum: ["electronics", "books", "clothing"] },\n        tags: {\n          bsonType: "array",\n          items: { bsonType: "string" }\n        }\n      }\n    }\n  },\n  validationLevel: "strict",\n  validationAction: "error"\n});',
          concept: 'JSON Schema validation lets you enforce types, required fields, allowed values, and patterns. validationLevel can be "strict" (all inserts/updates) or "moderate" (only valid docs). validationAction can be "error" or "warn".',
          keyPoints: ['required array lists mandatory fields', 'bsonType enforces data types', 'enum restricts to specific values', 'validationAction: "warn" logs but allows'],
          realWorld: 'Financial applications use strict validation to ensure transaction amounts are always positive numbers and currencies are from an allowed list.',
          mistakes: ['Not setting validationLevel to strict', 'Forgetting to handle validation errors', 'Over-constraining optional fields'],
          pInstructions: ['Create a collection with validation', 'Insert a valid document', 'Try inserting an invalid document and handle the error'],
          starter: '// Create validated collection\n// Insert valid document\n// Try invalid insert and catch error',
          solution: 'await db.createCollection("items", {\n  validator: { $jsonSchema: {\n    bsonType: "object",\n    required: ["name", "price"],\n    properties: {\n      name: { bsonType: "string" },\n      price: { bsonType: "number", minimum: 0 }\n    }\n  }}\n});\nawait db.collection("items").insertOne({ name: "Widget", price: 9.99 });\ntry {\n  await db.collection("items").insertOne({ name: "Bad", price: -5 });\n} catch (e) {\n  console.log("Validation failed:", e.message);\n}',
          hints: ['bsonType: "number" covers both int and double', 'Wrap invalid inserts in try/catch'],
          challenge: 'Create a user collection with validation: name (string, required), email (string, regex pattern), age (int, 0-150), role (enum). Test all validation rules.',
          reqs: ['Email regex validation', 'Age range validation', 'Role enum validation', 'Test each validation rule'],
          tests: [['invalid email', 'rejected', 5], ['age -1', 'rejected', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Mongoose ODM', slug: 'mongodb-mongoose-odm',
      description: 'Use Mongoose for elegant MongoDB interactions with schemas, models, and middleware.',
      language: 'javascript', difficulty: 'intermediate', duration: 50,
      tags: ['mongodb', 'mongoose', 'odm', 'database'],
      category: 'Database',
      objectives: ['Define schemas and models', 'Use instance and static methods', 'Implement middleware hooks'],
      steps: [
        S(1, {
          title: 'Schemas and Models', content: 'Mongoose provides a schema-based solution for modeling application data.',
          lang: 'javascript', code: 'const mongoose = require("mongoose");\n\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true, trim: true },\n  email: { type: String, required: true, unique: true, lowercase: true },\n  age: { type: Number, min: 0, max: 150 },\n  role: { type: String, enum: ["user", "admin"], default: "user" },\n  createdAt: { type: Date, default: Date.now }\n});\n\nuserSchema.methods.greet = function() {\n  return "Hello, " + this.name;\n};\n\nuserSchema.statics.findByEmail = function(email) {\n  return this.findOne({ email: email.toLowerCase() });\n};\n\nconst User = mongoose.model("User", userSchema);\n\nconst user = new User({ name: "Alice", email: "ALICE@TEST.COM" });\nawait user.save();\nconsole.log(user.greet());',
          concept: 'Schemas define the structure with types, validators, and defaults. Models are constructors compiled from schemas. Instance methods work on individual documents; static methods work on the model (collection level).',
          keyPoints: ['Schemas define structure and validation', 'Models compile schemas into constructors', 'Instance methods: document-level operations', 'Static methods: collection-level queries'],
          realWorld: 'Express.js APIs use Mongoose models as the data layer, with middleware for hashing passwords and instance methods for authentication.',
          mistakes: ['Defining methods with arrow functions (loses this binding)', 'Not awaiting save()', 'Forgetting unique index requires collection recreation'],
          pInstructions: ['Define a Product schema with name, price, category', 'Add an instance method for discount calculation', 'Add a static method to find by category'],
          starter: 'const mongoose = require("mongoose");\n\n// Define Product schema\n// Add instance method: getDiscountedPrice(percent)\n// Add static method: findByCategory(cat)\n// Create model and test',
          solution: 'const mongoose = require("mongoose");\nconst productSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  price: { type: Number, required: true, min: 0 },\n  category: { type: String, required: true }\n});\nproductSchema.methods.getDiscountedPrice = function(pct) {\n  return this.price * (1 - pct / 100);\n};\nproductSchema.statics.findByCategory = function(cat) {\n  return this.find({ category: cat });\n};\nconst Product = mongoose.model("Product", productSchema);',
          hints: ['Use function() not arrow for methods (needs this)', 'Static methods use this to refer to the model'],
          challenge: 'Build a complete User model with pre-save middleware that hashes passwords, an instance method to compare passwords, and virtual fields for fullName.',
          reqs: ['pre-save hook for password hashing', 'comparePassword instance method', 'Virtual fullName from firstName + lastName', 'Timestamps option'],
          tests: [['save user', 'password is hashed', 5], ['virtual fullName', 'returns combined', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Transactions', slug: 'mongodb-transactions',
      description: 'Ensure data consistency with multi-document transactions.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['mongodb', 'transactions', 'acid', 'database'],
      category: 'Database',
      objectives: ['Start and commit transactions', 'Handle transaction failures', 'Understand ACID properties'],
      steps: [
        S(1, {
          title: 'Multi-Document Transactions', content: 'MongoDB transactions ensure atomicity across multiple documents and collections.',
          lang: 'javascript', code: 'const session = client.startSession();\ntry {\n  session.startTransaction();\n  \n  await accounts.updateOne(\n    { _id: fromId },\n    { $inc: { balance: -amount } },\n    { session }\n  );\n  await accounts.updateOne(\n    { _id: toId },\n    { $inc: { balance: amount } },\n    { session }\n  );\n  await transfers.insertOne(\n    { from: fromId, to: toId, amount, date: new Date() },\n    { session }\n  );\n  \n  await session.commitTransaction();\n  console.log("Transfer complete");\n} catch (e) {\n  await session.abortTransaction();\n  console.log("Transfer failed:", e.message);\n} finally {\n  session.endSession();\n}',
          concept: 'Transactions group multiple operations into an atomic unit. Either all succeed (commit) or all fail (abort). Required for operations that must be consistent across documents.',
          keyPoints: ['startSession() creates transaction context', 'Pass { session } to each operation', 'commitTransaction() finalizes', 'abortTransaction() rolls back'],
          realWorld: 'Banking systems use transactions for transfers: debit one account and credit another must both succeed or both fail.',
          mistakes: ['Forgetting to pass session to operations', 'Not aborting on error', 'Not ending session in finally block'],
          pInstructions: ['Create a money transfer function', 'Use a transaction for atomicity', 'Handle errors with abort'],
          starter: 'async function transfer(client, from, to, amount) {\n  const session = client.startSession();\n  // Implement transaction\n}',
          solution: 'async function transfer(client, from, to, amount) {\n  const session = client.startSession();\n  const accounts = client.db("bank").collection("accounts");\n  try {\n    session.startTransaction();\n    await accounts.updateOne({ _id: from }, { $inc: { balance: -amount } }, { session });\n    await accounts.updateOne({ _id: to }, { $inc: { balance: amount } }, { session });\n    await session.commitTransaction();\n    return true;\n  } catch (e) {\n    await session.abortTransaction();\n    return false;\n  } finally {\n    session.endSession();\n  }\n}',
          hints: ['Always use try/catch/finally', 'Pass { session } as options to every operation'],
          challenge: 'Implement an order processing system: create order, update inventory for each item, charge customer — all in one transaction. Handle insufficient stock.',
          reqs: ['Check stock before processing', 'Create order document', 'Decrement stock for each item', 'Charge customer balance', 'Abort if any step fails'],
          tests: [['successful order', 'all updated', 5], ['insufficient stock', 'all rolled back', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Text Search', slug: 'mongodb-text-search',
      description: 'Implement full-text search with text indexes and search scores.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['mongodb', 'text-search', 'indexes', 'database'],
      category: 'Database',
      objectives: ['Create text indexes', 'Perform full-text searches', 'Use search scores for relevance'],
      steps: [
        S(1, {
          title: 'Text Indexes and Search', content: 'Text indexes enable searching string content across multiple fields.',
          lang: 'javascript', code: '// Create text index\nawait articles.createIndex({\n  title: "text",\n  content: "text",\n  tags: "text"\n}, {\n  weights: { title: 10, content: 5, tags: 1 }\n});\n\n// Search with text\nconst results = await articles.find(\n  { $text: { $search: "mongodb aggregation" } },\n  { score: { $meta: "textScore" } }\n).sort({ score: { $meta: "textScore" } }).toArray();\n\n// Phrase search\nconst exact = await articles.find(\n  { $text: { $search: \'"exact phrase"\' } }\n).toArray();',
          concept: 'Text indexes tokenize strings and enable keyword search. Weights control relevance of fields. $meta: "textScore" returns relevance scores. Quoted strings search exact phrases.',
          keyPoints: ['One text index per collection', 'Weights boost field importance', '$meta: textScore for relevance', 'Quotes for exact phrase matching'],
          realWorld: 'Documentation sites use text search to let users find relevant articles by typing keywords.',
          mistakes: ['Creating multiple text indexes (only one allowed)', 'Not using weights (all fields equal)', 'Forgetting to sort by textScore'],
          pInstructions: ['Create a text index on title and body', 'Search for keywords', 'Sort results by relevance score'],
          starter: '// Create text index with weights\n// Search for "javascript tutorial"\n// Sort by relevance',
          solution: 'await col.createIndex({ title: "text", body: "text" }, { weights: { title: 5, body: 1 } });\nconst results = await col.find(\n  { $text: { $search: "javascript tutorial" } },\n  { score: { $meta: "textScore" } }\n).sort({ score: { $meta: "textScore" } }).toArray();\nresults.forEach(r => console.log(r.title, r.score));',
          hints: ['Only one text index per collection', 'Higher weight = more important in scoring'],
          challenge: 'Build a search autocomplete system: create a text index, implement search with pagination, and highlight matching terms in results.',
          reqs: ['Text index on multiple fields', 'Pagination with skip/limit', 'Return relevance scores', 'Support negation (-term)'],
          tests: [['search "mongodb"', 'results sorted by score', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Change Streams', slug: 'mongodb-change-streams',
      description: 'React to real-time data changes with MongoDB change streams.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['mongodb', 'change-streams', 'real-time', 'database'],
      category: 'Database',
      objectives: ['Watch collections for changes', 'Filter change events', 'Build real-time features'],
      steps: [
        S(1, {
          title: 'Watching for Changes', content: 'Change streams let you subscribe to real-time data changes.',
          lang: 'javascript', code: '// Watch all changes on a collection\nconst changeStream = collection.watch();\n\nchangeStream.on("change", (change) => {\n  console.log("Operation:", change.operationType);\n  console.log("Document:", change.fullDocument);\n});\n\n// Watch with filter\nconst filtered = collection.watch([\n  { $match: { "fullDocument.status": "urgent" } }\n]);\n\nfiltered.on("change", (change) => {\n  console.log("Urgent update:", change.fullDocument);\n});\n\n// Close when done\nsetTimeout(() => changeStream.close(), 60000);',
          concept: 'Change streams use the oplog to detect inserts, updates, deletes, and replacements in real time. They support aggregation pipeline filters to receive only relevant changes.',
          keyPoints: ['watch() returns a change stream cursor', 'operationType: insert, update, delete, replace', 'fullDocument shows the complete document', 'Pipeline filters reduce event volume'],
          realWorld: 'Chat applications use change streams to push new messages to connected clients in real time without polling.',
          mistakes: ['Not closing change streams (resource leak)', 'Assuming change streams work without replica set', 'Missing resume token handling for restarts'],
          pInstructions: ['Set up a change stream on a collection', 'Filter for specific operation types', 'Log change details'],
          starter: '// Watch collection for inserts only\n// Log the inserted document\n// Close after 30 seconds',
          solution: 'const stream = col.watch([\n  { $match: { operationType: "insert" } }\n]);\nstream.on("change", (change) => {\n  console.log("New document:", change.fullDocument);\n});\nsetTimeout(() => { stream.close(); console.log("Stream closed"); }, 30000);',
          hints: ['Filter by operationType in $match', 'Always close streams when done'],
          challenge: 'Build a notification system: watch for changes to an orders collection, send notifications for new orders and status changes.',
          reqs: ['Watch for insert and update events', 'Distinguish new orders from status changes', 'Log notification type and details', 'Handle stream errors and resume'],
          tests: [['insert order', 'new order notification', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Geospatial Queries', slug: 'mongodb-geospatial',
      description: 'Store and query location data with 2dsphere indexes.',
      language: 'javascript', difficulty: 'advanced', duration: 45,
      tags: ['mongodb', 'geospatial', 'location', 'database'],
      category: 'Database',
      objectives: ['Store GeoJSON data', 'Create 2dsphere indexes', 'Query by proximity and within areas'],
      steps: [
        S(1, {
          title: 'Location Queries', content: 'MongoDB supports geospatial queries for finding nearby locations.',
          lang: 'javascript', code: '// Create 2dsphere index\nawait places.createIndex({ location: "2dsphere" });\n\n// Insert GeoJSON point\nawait places.insertOne({\n  name: "Central Park",\n  location: {\n    type: "Point",\n    coordinates: [-73.9654, 40.7829]  // [longitude, latitude]\n  }\n});\n\n// Find near a point\nconst nearby = await places.find({\n  location: {\n    $near: {\n      $geometry: { type: "Point", coordinates: [-73.97, 40.77] },\n      $maxDistance: 5000  // meters\n    }\n  }\n}).toArray();\n\nconsole.log("Nearby:", nearby);',
          concept: 'GeoJSON stores locations as [longitude, latitude] points. 2dsphere indexes enable queries like $near (distance), $geoWithin (area), and $geoIntersects (overlap).',
          keyPoints: ['Coordinates: [longitude, latitude] (not lat/lon)', '2dsphere for Earth-like spherical geometry', '$near sorts by distance automatically', '$maxDistance in meters'],
          realWorld: 'Ride-sharing apps use geospatial queries to find available drivers within a radius of the rider.',
          mistakes: ['Swapping latitude and longitude order', 'Forgetting 2dsphere index', 'Using 2d index for spherical data'],
          pInstructions: ['Insert location documents with GeoJSON points', 'Create a 2dsphere index', 'Find locations near a given point'],
          starter: '// Create 2dsphere index\n// Insert 5 locations\n// Find within 1km radius',
          solution: 'await col.createIndex({ loc: "2dsphere" });\nawait col.insertMany([\n  { name: "Cafe A", loc: { type: "Point", coordinates: [-73.99, 40.73] } },\n  { name: "Cafe B", loc: { type: "Point", coordinates: [-73.98, 40.74] } },\n  { name: "Cafe C", loc: { type: "Point", coordinates: [-73.97, 40.75] } }\n]);\nconst near = await col.find({\n  loc: { $near: { $geometry: { type: "Point", coordinates: [-73.985, 40.735] }, $maxDistance: 1000 } }\n}).toArray();\nconsole.log(near);',
          hints: ['Coordinates are [longitude, latitude]', '$maxDistance is in meters for 2dsphere'],
          challenge: 'Build a store locator: given a user location, find stores within a radius, sorted by distance, and also find stores within a polygon (delivery zone).',
          reqs: ['$near for radius search', '$geoWithin for polygon search', 'Sort by distance', 'Return distance in results'],
          tests: [['find within 5km', 'sorted by distance', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Bulk Operations', slug: 'mongodb-bulk-operations',
      description: 'Perform efficient batch inserts, updates, and deletes with bulk operations.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['mongodb', 'bulk-operations', 'performance', 'database'],
      category: 'Database',
      objectives: ['Use bulkWrite for batch operations', 'Mix insert, update, delete in one call', 'Handle bulk errors'],
      steps: [
        S(1, {
          title: 'Bulk Write Operations', content: 'bulkWrite sends multiple operations in a single request for efficiency.',
          lang: 'javascript', code: 'const result = await collection.bulkWrite([\n  { insertOne: { document: { name: "Item 1", qty: 10 } } },\n  { insertOne: { document: { name: "Item 2", qty: 5 } } },\n  { updateOne: {\n    filter: { name: "Item 1" },\n    update: { $inc: { qty: 5 } }\n  }},\n  { deleteOne: { filter: { name: "Old Item" } } },\n  { replaceOne: {\n    filter: { name: "Item 2" },\n    replacement: { name: "Item 2", qty: 20, updated: true }\n  }}\n], { ordered: true });\n\nconsole.log("Inserted:", result.insertedCount);\nconsole.log("Modified:", result.modifiedCount);\nconsole.log("Deleted:", result.deletedCount);',
          concept: 'bulkWrite accepts an array of operations (insertOne, updateOne, updateMany, deleteOne, deleteMany, replaceOne). ordered: true stops on first error; ordered: false continues through errors.',
          keyPoints: ['Reduces network round trips', 'Mix operation types in one call', 'ordered: true stops on error', 'ordered: false continues through errors'],
          realWorld: 'ETL pipelines use bulk operations to efficiently load thousands of records from CSV files into MongoDB.',
          mistakes: ['Not checking result counts', 'Using ordered: true when independent operations should continue', 'Exceeding 16MB batch size'],
          pInstructions: ['Create a bulk operation with 3 inserts, 1 update, 1 delete', 'Execute with ordered: false', 'Check the result counts'],
          starter: '// Create bulk operations array\nconst ops = [\n  // 3 inserts\n  // 1 update\n  // 1 delete\n];\n// Execute and check results',
          solution: 'const ops = [\n  { insertOne: { document: { name: "A", val: 1 } } },\n  { insertOne: { document: { name: "B", val: 2 } } },\n  { insertOne: { document: { name: "C", val: 3 } } },\n  { updateOne: { filter: { name: "A" }, update: { $set: { val: 10 } } } },\n  { deleteOne: { filter: { name: "C" } } }\n];\nconst res = await col.bulkWrite(ops, { ordered: false });\nconsole.log("Ins:", res.insertedCount, "Mod:", res.modifiedCount, "Del:", res.deletedCount);',
          hints: ['Each operation is an object with the operation type as key', 'ordered: false is faster for independent operations'],
          challenge: 'Import 1000 documents from a data array using bulk operations in batches of 100. Report progress and handle partial failures.',
          reqs: ['Split into batches of 100', 'Use bulkWrite for each batch', 'Report inserted count per batch', 'Handle errors without stopping'],
          tests: [['import 1000', 'all inserted', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Replica Sets', slug: 'mongodb-replica-sets',
      description: 'Understand replica sets for high availability and data redundancy.',
      language: 'javascript', difficulty: 'advanced', duration: 45,
      tags: ['mongodb', 'replica-sets', 'high-availability', 'database'],
      category: 'Database',
      objectives: ['Understand replica set architecture', 'Configure read preferences', 'Handle failover scenarios'],
      steps: [
        S(1, {
          title: 'Replica Set Concepts', content: 'Replica sets maintain copies of data across multiple servers for availability.',
          lang: 'javascript', code: '// Connect to replica set\nconst client = new MongoClient(\n  "mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=myReplicaSet"\n);\n\n// Read from secondary for analytics\nconst db = client.db("myapp");\nconst col = db.collection("logs");\nconst logs = await col.find({ level: "error" })\n  .readPreference("secondaryPreferred")\n  .toArray();\n\n// Write concern for durability\nawait col.insertOne(\n  { event: "important", data: "..." },\n  { writeConcern: { w: "majority", j: true } }\n);',
          concept: 'A replica set has one primary (handles writes) and multiple secondaries (replicate data). If the primary fails, an election promotes a secondary. Read preferences control where reads go.',
          keyPoints: ['Primary handles all writes', 'Secondaries replicate data asynchronously', 'Automatic failover via election', 'writeConcern: "majority" ensures durability'],
          realWorld: 'Production MongoDB deployments always use replica sets to survive server failures without data loss or downtime.',
          mistakes: ['Reading from secondary without understanding staleness', 'Not using write concern majority for critical data', 'Running without replica set (no transactions, no change streams)'],
          pInstructions: ['Connect to a replica set', 'Configure read preference to secondary', 'Use write concern majority for important writes'],
          starter: '// Connect with replica set URI\n// Read with secondaryPreferred\n// Write with majority concern',
          solution: 'const client = new MongoClient("mongodb://localhost:27017/?replicaSet=rs0");\nawait client.connect();\nconst col = client.db("test").collection("data");\n\nconst docs = await col.find({}).readPreference("secondaryPreferred").toArray();\nconsole.log("Read from secondary:", docs.length);\n\nawait col.insertOne({ key: "value" }, { writeConcern: { w: "majority" } });\nconsole.log("Written with majority concern");',
          hints: ['secondaryPreferred falls back to primary', 'w: "majority" waits for most nodes to acknowledge'],
          challenge: 'Set up a 3-member replica set locally using different ports. Test failover by stopping the primary and verifying automatic election.',
          reqs: ['Start 3 mongod instances', 'Initialize replica set', 'Insert data and verify replication', 'Stop primary and verify new election'],
          tests: [['stop primary', 'new primary elected', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Security and Authentication', slug: 'mongodb-security',
      description: 'Secure MongoDB with authentication, authorization, and encryption.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['mongodb', 'security', 'authentication', 'database'],
      category: 'Database',
      objectives: ['Enable authentication', 'Create users with roles', 'Implement connection security'],
      steps: [
        S(1, {
          title: 'Authentication and Roles', content: 'MongoDB uses role-based access control (RBAC) to restrict operations.',
          lang: 'javascript', code: '// Create admin user (run in mongosh)\n// use admin\n// db.createUser({\n//   user: "admin", pwd: "securePass123",\n//   roles: [{ role: "userAdminAnyDatabase", db: "admin" }]\n// });\n\n// Create application user\n// use myapp\n// db.createUser({\n//   user: "appuser", pwd: "appPass456",\n//   roles: [{ role: "readWrite", db: "myapp" }]\n// });\n\n// Connect with authentication\nconst client = new MongoClient(\n  "mongodb://appuser:appPass456@localhost:27017/myapp?authSource=myapp"\n);',
          concept: 'RBAC assigns users roles that grant specific permissions. Built-in roles: read, readWrite, dbAdmin, userAdmin. Custom roles can combine specific privileges. Enable auth with --auth flag.',
          keyPoints: ['Enable --auth to require authentication', 'Built-in roles: read, readWrite, dbAdmin', 'authSource specifies the auth database', 'Create admin user before enabling auth'],
          realWorld: 'Multi-tenant SaaS applications create separate database users per tenant with permissions scoped to only their database.',
          mistakes: ['Running production without authentication', 'Using admin credentials in application code', 'Not creating admin user before enabling auth'],
          pInstructions: ['Create an admin user', 'Create an app user with readWrite role', 'Connect with the app user credentials'],
          starter: '// 1. Create admin user command\n// 2. Create app user command\n// 3. Connection string with auth',
          solution: '// In mongosh:\n// use admin\n// db.createUser({ user: "admin", pwd: "pass", roles: ["userAdminAnyDatabase"] });\n// use mydb\n// db.createUser({ user: "app", pwd: "pass", roles: [{ role: "readWrite", db: "mydb" }] });\n\nconst client = new MongoClient("mongodb://app:pass@localhost:27017/mydb?authSource=mydb");\nawait client.connect();\nconsole.log("Authenticated successfully");',
          hints: ['authSource must match where the user was created', 'Create admin first, then enable auth'],
          challenge: 'Set up a complete security configuration: admin user, app user with limited permissions, audit logging, and TLS encryption.',
          reqs: ['Admin with full permissions', 'App user with readWrite on one database', 'Test that app user cannot access other databases', 'Connection with TLS'],
          tests: [['app user reads own db', 'success', 5], ['app user reads other db', 'denied', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Performance Tuning', slug: 'mongodb-performance-tuning',
      description: 'Optimize MongoDB queries and operations for better performance.',
      language: 'javascript', difficulty: 'advanced', duration: 45,
      tags: ['mongodb', 'performance', 'optimization', 'database'],
      category: 'Database',
      objectives: ['Profile slow queries', 'Optimize with proper indexes', 'Use projection and pagination'],
      steps: [
        S(1, {
          title: 'Query Optimization', content: 'Use profiling, explain, and proper indexes to speed up queries.',
          lang: 'javascript', code: '// Enable profiling for slow queries\nawait db.command({ profile: 1, slowms: 100 });\n\n// Check query plan\nconst plan = await col.find({ status: "active", createdAt: { $gt: new Date("2024-01-01") } })\n  .explain("executionStats");\nconsole.log("Docs examined:", plan.executionStats.totalDocsExamined);\nconsole.log("Docs returned:", plan.executionStats.nReturned);\n\n// Use projection to return only needed fields\nconst users = await col.find(\n  { status: "active" },\n  { projection: { name: 1, email: 1, _id: 0 } }\n).toArray();\n\n// Efficient pagination with cursor-based approach\nconst page = await col.find({ _id: { $gt: lastId } })\n  .sort({ _id: 1 })\n  .limit(20)\n  .toArray();',
          concept: 'Profile slow queries with the profiler. Use explain() to check if indexes are used. Projection reduces data transfer. Cursor-based pagination is faster than skip/limit for large offsets.',
          keyPoints: ['Profile level 1 logs slow queries', 'explain shows query execution plan', 'Projection reduces network transfer', 'Cursor pagination > skip pagination'],
          realWorld: 'High-traffic APIs use cursor-based pagination and covered queries to serve thousands of requests per second.',
          mistakes: ['Using skip for deep pagination (expensive)', 'Selecting all fields when only few needed', 'Not creating indexes for frequent queries'],
          pInstructions: ['Run explain on a query and check docs examined', 'Add an index to reduce examined docs', 'Use projection to return only needed fields'],
          starter: '// Check query plan without index\n// Add appropriate index\n// Re-check query plan\n// Use projection',
          solution: 'let plan = await col.find({ status: "active" }).explain("executionStats");\nconsole.log("Before index - examined:", plan.executionStats.totalDocsExamined);\n\nawait col.createIndex({ status: 1 });\nplan = await col.find({ status: "active" }).explain("executionStats");\nconsole.log("After index - examined:", plan.executionStats.totalDocsExamined);\n\nconst results = await col.find({ status: "active" }, { projection: { name: 1, _id: 0 } }).limit(10).toArray();',
          hints: ['totalDocsExamined should be close to nReturned', 'Covered queries never access documents (all data in index)'],
          challenge: 'Profile a slow aggregation pipeline, identify the bottleneck, add appropriate indexes, and measure the improvement.',
          reqs: ['Insert 100k test documents', 'Run aggregation and measure time', 'Create supporting indexes', 'Show before/after performance'],
          tests: [['after optimization', 'faster execution', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Atlas and Cloud Deployment', slug: 'mongodb-atlas-cloud',
      description: 'Deploy and manage MongoDB in the cloud with MongoDB Atlas.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['mongodb', 'atlas', 'cloud', 'database'],
      category: 'Database',
      objectives: ['Set up MongoDB Atlas cluster', 'Connect from Node.js', 'Configure network access and users'],
      steps: [
        S(1, {
          title: 'Connecting to Atlas', content: 'MongoDB Atlas provides managed cloud MongoDB clusters.',
          lang: 'javascript', code: '// Connection string from Atlas dashboard\nconst uri = "mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority";\n\nconst client = new MongoClient(uri);\n\nasync function run() {\n  try {\n    await client.connect();\n    await client.db("admin").command({ ping: 1 });\n    console.log("Connected to Atlas!");\n    \n    const db = client.db("myapp");\n    const col = db.collection("users");\n    await col.insertOne({ name: "Test", createdAt: new Date() });\n    const doc = await col.findOne({ name: "Test" });\n    console.log("Document:", doc);\n  } finally {\n    await client.close();\n  }\n}\nrun();',
          concept: 'Atlas handles server provisioning, backups, monitoring, and scaling. The connection string uses mongodb+srv:// protocol. Whitelist your IP and create database users in the Atlas UI.',
          keyPoints: ['mongodb+srv:// for Atlas connections', 'Whitelist IP in Network Access', 'Create database user in Database Access', 'Free tier (M0) available for development'],
          realWorld: 'Startups use Atlas free tier for MVPs, then scale to dedicated clusters as traffic grows.',
          mistakes: ['Not whitelisting IP address', 'Using connection string with wrong credentials', 'Not enabling retryWrites for resilience'],
          pInstructions: ['Set up a free Atlas cluster', 'Get the connection string', 'Connect from a Node.js script'],
          starter: 'const { MongoClient } = require("mongodb");\n// Replace with your Atlas URI\nconst uri = "mongodb+srv://...";\n\nasync function run() {\n  // Connect, ping, insert, find\n}\nrun();',
          solution: 'const { MongoClient } = require("mongodb");\nconst uri = "mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority";\nasync function run() {\n  const client = new MongoClient(uri);\n  try {\n    await client.connect();\n    await client.db("admin").command({ ping: 1 });\n    console.log("Connected!");\n  } finally {\n    await client.close();\n  }\n}\nrun();',
          hints: ['Get URI from Atlas Connect button', 'Replace <password> in the URI'],
          challenge: 'Deploy a complete application: create Atlas cluster, set up user and network access, connect from Express.js, and implement a REST API with CRUD operations.',
          reqs: ['Atlas cluster setup', 'Express.js REST API', 'All CRUD endpoints', 'Error handling and connection pooling'],
          tests: [['POST /users', 'creates user', 5], ['GET /users', 'returns list', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Sharding Basics', slug: 'mongodb-sharding',
      description: 'Understand horizontal scaling with MongoDB sharding.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['mongodb', 'sharding', 'scaling', 'database'],
      category: 'Database',
      objectives: ['Understand sharding concepts', 'Choose a shard key', 'Analyze query routing'],
      steps: [
        S(1, {
          title: 'Sharding Architecture', content: 'Sharding distributes data across multiple servers for horizontal scaling.',
          lang: 'javascript', code: '// Sharding setup (conceptual - run via mongosh)\n// sh.enableSharding("mydb")\n// sh.shardCollection("mydb.orders", { customerId: "hashed" })\n\n// Shard key affects query routing\n// Targeted query (hits one shard)\nawait orders.find({ customerId: "C123" }).toArray();\n\n// Scatter-gather query (hits all shards)\nawait orders.find({ status: "pending" }).toArray();\n\n// Check shard distribution\n// db.orders.getShardDistribution()',
          concept: 'Sharding splits a collection across shards based on a shard key. Queries that include the shard key are routed to specific shards (targeted). Queries without it must check all shards (scatter-gather).',
          keyPoints: ['Shard key determines data distribution', 'Targeted queries are fast', 'Scatter-gather queries check all shards', 'Hashed shard keys distribute evenly'],
          realWorld: 'Social media platforms shard user data by userId so all of a user\'s data lives on the same shard for fast profile loads.',
          mistakes: ['Choosing a low-cardinality shard key', 'Monotonically increasing shard key causes hotspots', 'Not considering query patterns when choosing shard key'],
          pInstructions: ['Identify a good shard key for an orders collection', 'Explain why it distributes data well', 'Identify a query that would be targeted vs scatter-gather'],
          starter: '// Given an orders collection with fields:\n// orderId, customerId, productId, amount, date, status\n// Choose the best shard key and explain why\n// Write a targeted query\n// Write a scatter-gather query',
          solution: '// Best shard key: { customerId: "hashed" }\n// - High cardinality (many unique customers)\n// - Hashed for even distribution\n// - Customer queries are targeted\n\n// Targeted: includes shard key\nawait orders.find({ customerId: "C123" }).toArray();\n\n// Scatter-gather: no shard key in filter\nawait orders.find({ status: "pending" }).toArray();\n\n// Better: compound shard key for common queries\n// sh.shardCollection("mydb.orders", { customerId: 1, date: 1 })',
          hints: ['Good shard keys have high cardinality', 'Include the shard key in frequent queries'],
          challenge: 'Design a sharding strategy for a multi-tenant SaaS application. Consider tenant isolation, query patterns, and even distribution.',
          reqs: ['Choose shard key with justification', 'Analyze 3 common queries for targeting', 'Plan for tenant data locality', 'Handle uneven tenant sizes'],
          tests: [['targeted query', 'routes to one shard', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Backup and Restore', slug: 'mongodb-backup-restore',
      description: 'Protect data with mongodump, mongorestore, and Atlas backup strategies.',
      language: 'javascript', difficulty: 'intermediate', duration: 30,
      tags: ['mongodb', 'backup', 'restore', 'database'],
      category: 'Database',
      objectives: ['Use mongodump and mongorestore', 'Implement backup strategies', 'Restore from backups'],
      steps: [
        S(1, {
          title: 'Backup and Restore Tools', content: 'mongodump and mongorestore create and restore binary backups.',
          lang: 'javascript', code: '// mongodump - backup entire database\n// $ mongodump --db myapp --out /backups/2024-01-15\n\n// mongodump - backup specific collection\n// $ mongodump --db myapp --collection users --out /backups/users\n\n// mongorestore - restore from backup\n// $ mongorestore --db myapp /backups/2024-01-15/myapp\n\n// mongoexport - export as JSON\n// $ mongoexport --db myapp --collection users --out users.json\n\n// mongoimport - import from JSON\n// $ mongoimport --db myapp --collection users --file users.json\n\n// Programmatic backup verification\nconst { MongoClient } = require("mongodb");\nasync function verifyBackup(uri, dbName) {\n  const client = new MongoClient(uri);\n  await client.connect();\n  const db = client.db(dbName);\n  const collections = await db.listCollections().toArray();\n  for (const col of collections) {\n    const count = await db.collection(col.name).countDocuments();\n    console.log(col.name + ": " + count + " documents");\n  }\n  await client.close();\n}',
          concept: 'mongodump creates binary BSON backups. mongoexport creates JSON/CSV. mongorestore imports binary backups. mongoimport imports JSON/CSV. For production, use replica sets with continuous backup.',
          keyPoints: ['mongodump: binary backup (fast, complete)', 'mongoexport: JSON/CSV (human-readable)', 'mongorestore: restore from dump', 'Atlas provides automated continuous backups'],
          realWorld: 'Companies run nightly mongodump jobs with weekly full backups and daily incrementals, storing them in cloud storage.',
          mistakes: ['Not testing restore process regularly', 'Backing up without locking (inconsistent state)', 'Not backing up config servers in sharded clusters'],
          pInstructions: ['Run mongodump to backup a database', 'Drop a collection', 'Restore it with mongorestore'],
          starter: '// Backup command\n// Drop collection command\n// Restore command\n// Verify restore',
          solution: '// $ mongodump --db testdb --out ./backup\n// $ mongosh --eval "use testdb; db.users.drop()"\n// $ mongorestore --db testdb ./backup/testdb\n// Verify:\n// $ mongosh --eval "use testdb; db.users.countDocuments()"',
          hints: ['mongodump creates a directory with BSON files', 'mongorestore needs the path to the database directory'],
          challenge: 'Create an automated backup script that: dumps the database, compresses the backup, uploads to a storage location, and retains only the last 7 backups.',
          reqs: ['mongodump with timestamp in name', 'Compress with gzip', 'Delete backups older than 7 days', 'Log success/failure'],
          tests: [['backup created', 'compressed file exists', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Aggregation: Advanced Patterns', slug: 'mongodb-aggregation-advanced',
      description: 'Master advanced aggregation with $facet, $bucket, $graphLookup.',
      language: 'javascript', difficulty: 'advanced', duration: 50,
      tags: ['mongodb', 'aggregation', 'advanced', 'database'],
      category: 'Database',
      objectives: ['Use $facet for parallel pipelines', 'Bucket data with $bucket and $bucketAuto', 'Traverse graphs with $graphLookup'],
      steps: [
        S(1, {
          title: 'Facets and Buckets', content: '$facet runs multiple aggregations in parallel. $bucket groups into ranges.',
          lang: 'javascript', code: '// $facet - multiple aggregations at once\nconst analytics = await products.aggregate([\n  { $facet: {\n    priceDistribution: [\n      { $bucket: {\n        groupBy: "$price",\n        boundaries: [0, 25, 50, 100, 500, Infinity],\n        default: "Other",\n        output: { count: { $sum: 1 }, avgPrice: { $avg: "$price" } }\n      }}\n    ],\n    topCategories: [\n      { $group: { _id: "$category", total: { $sum: "$sales" } } },\n      { $sort: { total: -1 } },\n      { $limit: 5 }\n    ],\n    summary: [\n      { $group: { _id: null, avgPrice: { $avg: "$price" }, totalProducts: { $sum: 1 } } }\n    ]\n  }}\n]).toArray();',
          concept: '$facet processes the same input documents through multiple separate pipelines in parallel, returning all results in a single document. $bucket groups documents into specified ranges.',
          keyPoints: ['$facet runs pipelines in parallel', '$bucket uses custom boundaries', '$bucketAuto determines boundaries automatically', 'Single pass over data for all facets'],
          realWorld: 'E-commerce filter sidebars show price ranges, top brands, and product counts simultaneously using $facet.',
          mistakes: ['Putting $facet inside another $facet', 'Not including Infinity in bucket boundaries', 'Facet pipelines cannot use $out or $merge'],
          pInstructions: ['Create a $facet with price buckets and category counts', 'Use $bucket with custom boundaries', 'Add a summary pipeline'],
          starter: 'const result = await col.aggregate([\n  { $facet: {\n    // price distribution\n    // category counts\n    // overall summary\n  }}\n]).toArray();',
          solution: 'const result = await col.aggregate([\n  { $facet: {\n    byPrice: [{ $bucket: { groupBy: "$price", boundaries: [0, 50, 100, 500], default: "500+", output: { count: { $sum: 1 } } } }],\n    byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }],\n    totals: [{ $group: { _id: null, avg: { $avg: "$price" }, total: { $sum: 1 } } }]\n  }}\n]).toArray();\nconsole.log(JSON.stringify(result[0], null, 2));',
          hints: ['$facet returns a single document with each pipeline as a field', '$bucket boundaries must be sorted'],
          challenge: 'Build a complete analytics dashboard pipeline: price distribution, sales by month, top 10 products, customer segments (using $bucketAuto), all in one $facet.',
          reqs: ['$bucket for price ranges', '$bucketAuto for customer segments', 'Monthly sales with $group by date', 'Top 10 products by revenue'],
          tests: [['facet result', 'all 4 sections present', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB with Express.js REST API', slug: 'mongodb-express-rest',
      description: 'Build a complete REST API with Express.js and MongoDB.',
      language: 'javascript', difficulty: 'intermediate', duration: 50,
      tags: ['mongodb', 'express', 'rest-api', 'database'],
      category: 'Database',
      objectives: ['Set up Express with MongoDB connection', 'Build CRUD endpoints', 'Handle errors and validation'],
      steps: [
        S(1, {
          title: 'Express + MongoDB Setup', content: 'Create a REST API that performs CRUD operations on MongoDB.',
          lang: 'javascript', code: 'const express = require("express");\nconst { MongoClient, ObjectId } = require("mongodb");\n\nconst app = express();\napp.use(express.json());\n\nlet db;\nMongoClient.connect("mongodb://localhost:27017")\n  .then(client => { db = client.db("shop"); });\n\napp.get("/products", async (req, res) => {\n  const products = await db.collection("products").find().toArray();\n  res.json(products);\n});\n\napp.post("/products", async (req, res) => {\n  const result = await db.collection("products").insertOne(req.body);\n  res.status(201).json({ id: result.insertedId });\n});\n\napp.put("/products/:id", async (req, res) => {\n  const result = await db.collection("products").updateOne(\n    { _id: new ObjectId(req.params.id) },\n    { $set: req.body }\n  );\n  res.json({ modified: result.modifiedCount });\n});\n\napp.delete("/products/:id", async (req, res) => {\n  await db.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });\n  res.json({ deleted: true });\n});\n\napp.listen(3000);',
          concept: 'Express handles HTTP routing. MongoDB stores the data. ObjectId converts string IDs from URL params. Connection pooling is built into the driver — connect once, reuse the client.',
          keyPoints: ['Connect once, reuse client', 'Use ObjectId for _id queries', 'express.json() parses request bodies', 'Status 201 for created resources'],
          realWorld: 'Most Node.js web applications use this exact pattern: Express for routing, MongoDB for storage, with middleware for auth and validation.',
          mistakes: ['Creating new connections per request', 'Not converting string to ObjectId', 'Missing error handling middleware', 'Not validating request body'],
          pInstructions: ['Set up Express with MongoDB connection', 'Create GET and POST endpoints for a resource', 'Add PUT and DELETE endpoints'],
          starter: 'const express = require("express");\nconst { MongoClient, ObjectId } = require("mongodb");\nconst app = express();\napp.use(express.json());\n\n// Connect to MongoDB\n// GET /items\n// POST /items\n// PUT /items/:id\n// DELETE /items/:id',
          solution: 'const express = require("express");\nconst { MongoClient, ObjectId } = require("mongodb");\nconst app = express();\napp.use(express.json());\nlet db;\nMongoClient.connect("mongodb://localhost:27017").then(c => db = c.db("test"));\n\napp.get("/items", async (req, res) => {\n  res.json(await db.collection("items").find().toArray());\n});\napp.post("/items", async (req, res) => {\n  const r = await db.collection("items").insertOne(req.body);\n  res.status(201).json({ id: r.insertedId });\n});\napp.put("/items/:id", async (req, res) => {\n  const r = await db.collection("items").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });\n  res.json({ modified: r.modifiedCount });\n});\napp.delete("/items/:id", async (req, res) => {\n  await db.collection("items").deleteOne({ _id: new ObjectId(req.params.id) });\n  res.json({ ok: true });\n});\napp.listen(3000);',
          hints: ['new ObjectId(string) converts string to ObjectId', 'Use async/await with try/catch for error handling'],
          challenge: 'Add pagination (page, limit query params), search (text search), filtering (category, price range), and sorting to the GET endpoint.',
          reqs: ['Pagination with skip/limit', 'Text search query param', 'Filter by category and price range', 'Sort by field and direction'],
          tests: [['GET /products?page=2&limit=10', 'paginated results', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Time Series Collections', slug: 'mongodb-time-series',
      description: 'Store and analyze time-stamped data efficiently with time series collections.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['mongodb', 'time-series', 'iot', 'database'],
      category: 'Database',
      objectives: ['Create time series collections', 'Insert and query time-stamped data', 'Use window functions for analysis'],
      steps: [
        S(1, {
          title: 'Time Series Collections', content: 'Time series collections are optimized for storing and querying temporal data.',
          lang: 'javascript', code: '// Create time series collection\nawait db.createCollection("sensorData", {\n  timeseries: {\n    timeField: "timestamp",\n    metaField: "sensorId",\n    granularity: "minutes"\n  },\n  expireAfterSeconds: 86400 * 30  // Auto-delete after 30 days\n});\n\n// Insert readings\nawait db.collection("sensorData").insertMany([\n  { timestamp: new Date(), sensorId: "temp-01", value: 22.5 },\n  { timestamp: new Date(), sensorId: "temp-02", value: 23.1 },\n  { timestamp: new Date(), sensorId: "humid-01", value: 65 }\n]);\n\n// Query with aggregation\nconst hourlyAvg = await db.collection("sensorData").aggregate([\n  { $match: { sensorId: "temp-01" } },\n  { $group: {\n    _id: { $dateTrunc: { date: "$timestamp", unit: "hour" } },\n    avgTemp: { $avg: "$value" },\n    maxTemp: { $max: "$value" },\n    readings: { $sum: 1 }\n  }},\n  { $sort: { _id: 1 } }\n]).toArray();',
          concept: 'Time series collections store measurements efficiently by bucketing data points with the same metadata. They support automatic data expiration (TTL) and optimized storage for temporal queries.',
          keyPoints: ['timeField: the timestamp field', 'metaField: groups related measurements', 'granularity: seconds, minutes, hours', 'TTL with expireAfterSeconds'],
          realWorld: 'IoT platforms store millions of sensor readings per day in time series collections for real-time monitoring dashboards.',
          mistakes: ['Wrong granularity (too fine wastes space)', 'Not using metaField for grouping', 'Querying without time range (scans all data)'],
          pInstructions: ['Create a time series collection for temperature data', 'Insert readings with timestamps', 'Query hourly averages'],
          starter: '// Create time series collection\n// Insert sample readings\n// Aggregate hourly averages',
          solution: 'await db.createCollection("temps", {\n  timeseries: { timeField: "ts", metaField: "sensor", granularity: "minutes" }\n});\nconst now = new Date();\nconst readings = [];\nfor (let i = 0; i < 60; i++) {\n  readings.push({ ts: new Date(now - i * 60000), sensor: "s1", val: 20 + Math.random() * 5 });\n}\nawait db.collection("temps").insertMany(readings);\nconst avgs = await db.collection("temps").aggregate([\n  { $group: { _id: { $dateTrunc: { date: "$ts", unit: "hour" } }, avg: { $avg: "$val" } } }\n]).toArray();\nconsole.log(avgs);',
          hints: ['$dateTrunc rounds timestamps to unit boundaries', 'granularity helps optimize storage bucket size'],
          challenge: 'Build a complete IoT monitoring system: collect data from multiple sensors, compute rolling averages, detect anomalies (values outside 2 standard deviations), and auto-expire old data.',
          reqs: ['Multiple sensor types', 'Rolling 1-hour averages', 'Anomaly detection with $stdDevPop', 'TTL for data expiration'],
          tests: [['insert 1000 readings', 'stored efficiently', 5], ['detect anomaly', 'flagged correctly', 5]]
        })
      ]
    }),

    T({
      title: 'MongoDB Map-Reduce and Views', slug: 'mongodb-mapreduce-views',
      description: 'Use MongoDB views for reusable queries and understand Map-Reduce legacy patterns.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['mongodb', 'views', 'map-reduce', 'database'],
      category: 'Database',
      objectives: ['Create and query views', 'Understand view performance', 'Know when to use views vs materialized views'],
      steps: [
        S(1, {
          title: 'MongoDB Views', content: 'Views are saved aggregation pipelines that act like read-only collections.',
          lang: 'javascript', code: '// Create a view\nawait db.createCollection("activeUsers", {\n  viewOn: "users",\n  pipeline: [\n    { $match: { status: "active", lastLogin: { $gt: new Date("2024-01-01") } } },\n    { $project: { name: 1, email: 1, role: 1, lastLogin: 1 } }\n  ]\n});\n\n// Query the view like a regular collection\nconst active = await db.collection("activeUsers").find().toArray();\nconsole.log("Active users:", active.length);\n\n// Views support further filtering\nconst admins = await db.collection("activeUsers")\n  .find({ role: "admin" })\n  .toArray();\n\n// Create on-demand materialized view with $merge\nawait db.collection("orders").aggregate([\n  { $group: { _id: "$customerId", totalSpent: { $sum: "$amount" } } },\n  { $merge: { into: "customerStats", whenMatched: "replace" } }\n]).toArray();',
          concept: 'Views run their pipeline on every query (computed). They simplify complex queries and enforce data access patterns. $merge creates materialized views (cached results) for better performance.',
          keyPoints: ['Views are read-only computed collections', 'Pipeline runs on every query', '$merge creates materialized views', 'Use views for access control patterns'],
          realWorld: 'Multi-tenant apps use views to automatically filter data by tenant ID, ensuring data isolation.',
          mistakes: ['Expecting view data to be cached (it is not)', 'Complex pipelines on views cause slow queries', 'Not indexing the underlying collection'],
          pInstructions: ['Create a view for high-value orders', 'Query the view with additional filters', 'Create a materialized view with $merge'],
          starter: '// Create view for orders > $100\n// Query the view\n// Create materialized summary with $merge',
          solution: 'await db.createCollection("bigOrders", {\n  viewOn: "orders",\n  pipeline: [\n    { $match: { total: { $gt: 100 } } },\n    { $project: { customerId: 1, total: 1, date: 1 } }\n  ]\n});\nconst big = await db.collection("bigOrders").find().toArray();\nconsole.log("Big orders:", big.length);\n\nawait db.collection("orders").aggregate([\n  { $group: { _id: "$customerId", totalSpent: { $sum: "$total" }, orderCount: { $sum: 1 } } },\n  { $merge: { into: "customerSummary", whenMatched: "replace" } }\n]).toArray();',
          hints: ['viewOn specifies the source collection', '$merge writes results to another collection'],
          challenge: 'Create a reporting system with views for: active users, monthly revenue, product performance. Include a scheduled $merge to refresh materialized views.',
          reqs: ['3 different views', 'Materialized view with $merge', 'Refresh script', 'Query performance comparison'],
          tests: [['query view', 'returns filtered data', 5]]
        })
      ]
    })
  ];
};
