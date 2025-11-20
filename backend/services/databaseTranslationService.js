// Database Translation Service
// This service provides database query translation capabilities
// AI integration can be added later using Anthropic or OpenAI

class DatabaseTranslationService {
  constructor() {
    this.supportedDatabases = [
      'sql',           // Standard SQL
      'mysql',         // MySQL
      'postgresql',    // PostgreSQL
      'mongodb',       // MongoDB
      'redis',         // Redis
      'cassandra',     // Apache Cassandra
      'dynamodb',      // AWS DynamoDB
      'elasticsearch', // Elasticsearch
      'neo4j',         // Neo4j (Graph DB)
      'sqlite',        // SQLite
      'oracle',        // Oracle DB
      'mssql',         // Microsoft SQL Server
      'mariadb'        // MariaDB
    ];
  }

  /**
   * Translate database query from one syntax to another
   */
  async translateQuery(sourceQuery, sourceDB, targetDB, options = {}) {
    try {
      // Validate databases
      if (!this.supportedDatabases.includes(sourceDB.toLowerCase())) {
        throw new Error(`Unsupported source database: ${sourceDB}`);
      }
      if (!this.supportedDatabases.includes(targetDB.toLowerCase())) {
        throw new Error(`Unsupported target database: ${targetDB}`);
      }

      // For now, use rule-based translation for common patterns
      // TODO: Integrate with Anthropic Claude or OpenAI for AI-powered translations
      const result = this.ruleBasedTranslation(sourceQuery, sourceDB, targetDB);

      return result;

    } catch (error) {
      console.error('Database translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Rule-based translation for common patterns
   */
  ruleBasedTranslation(sourceQuery, sourceDB, targetDB) {
    const sourceDBLower = sourceDB.toLowerCase();
    const targetDBLower = targetDB.toLowerCase();

    // Normalize SQL variants to 'sql'
    const sqlVariants = ['sql', 'mysql', 'postgresql', 'sqlite', 'oracle', 'mssql', 'mariadb'];
    const normalizedSource = sqlVariants.includes(sourceDBLower) ? 'sql' : sourceDBLower;
    const normalizedTarget = sqlVariants.includes(targetDBLower) ? 'sql' : targetDBLower;

    // SQL to MongoDB
    if (normalizedSource === 'sql' && normalizedTarget === 'mongodb') {
      return this.sqlToMongoDB(sourceQuery, targetDBLower);
    }

    // MongoDB to SQL
    if (normalizedSource === 'mongodb' && normalizedTarget === 'sql') {
      return this.mongoDBToSQL(sourceQuery, targetDBLower);
    }

    // SQL to Redis
    if (normalizedSource === 'sql' && normalizedTarget === 'redis') {
      return this.sqlToRedis(sourceQuery);
    }

    // MongoDB to Redis
    if (normalizedSource === 'mongodb' && normalizedTarget === 'redis') {
      return this.mongoDBToRedis(sourceQuery);
    }

    // Redis to SQL
    if (normalizedSource === 'redis' && normalizedTarget === 'sql') {
      return this.redisToSQL(sourceQuery, targetDBLower);
    }

    // Redis to MongoDB
    if (normalizedSource === 'redis' && normalizedTarget === 'mongodb') {
      return this.redisToMongoDB(sourceQuery);
    }

    // SQL to Elasticsearch
    if (normalizedSource === 'sql' && normalizedTarget === 'elasticsearch') {
      return this.sqlToElasticsearch(sourceQuery);
    }

    // MongoDB to Elasticsearch
    if (normalizedSource === 'mongodb' && normalizedTarget === 'elasticsearch') {
      return this.mongoDBToElasticsearch(sourceQuery);
    }

    // Elasticsearch to SQL
    if (normalizedSource === 'elasticsearch' && normalizedTarget === 'sql') {
      return this.elasticsearchToSQL(sourceQuery, targetDBLower);
    }

    // Elasticsearch to MongoDB
    if (normalizedSource === 'elasticsearch' && normalizedTarget === 'mongodb') {
      return this.elasticsearchToMongoDB(sourceQuery);
    }

    // SQL variants to SQL variants
    if (normalizedSource === 'sql' && normalizedTarget === 'sql' && sourceDBLower !== targetDBLower) {
      return this.sqlToSQLVariant(sourceQuery, sourceDBLower, targetDBLower);
    }

    // Default: provide basic conversion guidance
    return this.provideConversionGuidance(sourceQuery, sourceDB, targetDB);
  }

  /**
   * Translate SQL to MongoDB
   */
  sqlToMongoDB(sqlQuery) {
    const query = sqlQuery.trim().toUpperCase();
    let translated = '';
    let explanation = '';
    let keyDifferences = [];

    // SELECT * FROM table WHERE condition
    if (query.includes('SELECT') && query.includes('FROM')) {
      const tableName = this.extractTableName(sqlQuery);
      const whereClause = this.extractWhereClause(sqlQuery);

      if (whereClause) {
        const mongoCondition = this.sqlWhereToMongoFilter(whereClause);
        translated = `db.${tableName}.find(${mongoCondition})`;
      } else {
        translated = `db.${tableName}.find({})`;
      }

      explanation = 'SQL SELECT translated to MongoDB find() operation';
      keyDifferences = [
        'MongoDB uses find() instead of SELECT',
        'No explicit column selection in basic find (use projection for that)',
        'WHERE clause becomes a filter object'
      ];
    }
    // INSERT INTO
    else if (query.includes('INSERT INTO')) {
      const tableName = this.extractTableName(sqlQuery);
      translated = `db.${tableName}.insertOne({ /* document fields */ })`;
      explanation = 'SQL INSERT translated to MongoDB insertOne()';
      keyDifferences = [
        'MongoDB stores documents instead of rows',
        'No need to specify columns - just provide the document',
        'Use insertMany() for multiple documents'
      ];
    }
    // UPDATE
    else if (query.includes('UPDATE')) {
      const tableName = this.extractTableName(sqlQuery);
      translated = `db.${tableName}.updateOne({/* filter */}, { $set: {/* updates */} })`;
      explanation = 'SQL UPDATE translated to MongoDB updateOne()';
      keyDifferences = [
        'MongoDB uses update operators like $set',
        'Filter replaces WHERE clause',
        'Use updateMany() to update multiple documents'
      ];
    }
    // DELETE
    else if (query.includes('DELETE FROM')) {
      const tableName = this.extractTableName(sqlQuery);
      translated = `db.${tableName}.deleteOne({/* filter */})`;
      explanation = 'SQL DELETE translated to MongoDB deleteOne()';
      keyDifferences = [
        'Use filter object instead of WHERE',
        'Use deleteMany() to delete multiple documents'
      ];
    }
    else {
      translated = `// Complex SQL query - requires manual translation\n// Original: ${sqlQuery}`;
      explanation = 'This SQL query requires manual translation or AI assistance';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences,
      compatibilityNotes: 'MongoDB is document-oriented while SQL is relational. Some SQL concepts (like JOINs) require different approaches in MongoDB (like $lookup in aggregation).',
      confidence: 'medium'
    };
  }

  /**
   * Translate MongoDB to SQL
   */
  mongoDBToSQL(mongoQuery) {
    const query = mongoQuery.trim();
    let translated = '';
    let explanation = '';

    if (query.includes('.find(')) {
      translated = `SELECT * FROM collection WHERE /* conditions */`;
      explanation = 'MongoDB find() translated to SQL SELECT';
    } else if (query.includes('.insertOne(')) {
      translated = `INSERT INTO collection (/* columns */) VALUES (/* values */)`;
      explanation = 'MongoDB insertOne() translated to SQL INSERT';
    } else {
      translated = `-- Complex MongoDB query - requires manual translation\n-- Original: ${mongoQuery}`;
      explanation = 'This MongoDB query requires manual translation or AI assistance';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'SQL uses tables and rows while MongoDB uses collections and documents',
        'SQL requires predefined schema',
        'MongoDB aggregation pipeline has no direct SQL equivalent'
      ],
      compatibilityNotes: 'Converting from document model to relational requires schema design decisions.',
      confidence: 'medium'
    };
  }

  /**
   * Translate SQL to Redis
   */
  sqlToRedis(sqlQuery) {
    const query = sqlQuery.trim().toUpperCase();
    let translated = '';
    let explanation = '';

    if (query.includes('SELECT') && query.includes('WHERE')) {
      const tableName = this.extractTableName(sqlQuery);
      translated = `# Conceptual Redis approach for SELECT with WHERE:\nGET ${tableName}:{id}\n# Or use HGETALL for hash structure:\nHGETALL ${tableName}:{id}`;
      explanation = 'Redis uses key-value lookups instead of SELECT queries. Structure your keys appropriately.';
    } else if (query.includes('INSERT INTO')) {
      const tableName = this.extractTableName(sqlQuery);
      translated = `# Redis approach for INSERT:\nHSET ${tableName}:{id} field1 "value1" field2 "value2"\n# Or use SET for simple values:\nSET ${tableName}:{id} "value"`;
      explanation = 'Redis INSERT uses HSET for hashes or SET for simple key-value pairs';
    } else {
      translated = `# Redis uses key-value storage\n# SQL queries don't directly map to Redis commands\n# Original: ${sqlQuery}\n\n# Suggested Redis approach:\n# 1. Define key naming convention (e.g., table:id)\n# 2. Use HSET for structured data\n# 3. Use SET for simple values\n# 4. Use indexes with ZADD for sorting`;
      explanation = 'Redis is a key-value store. Restructure your data model for key-based access.';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'Redis stores data as key-value pairs',
        'No query language like SQL',
        'Use specific data structures (strings, hashes, lists, sets, sorted sets)',
        'Queries become direct key lookups'
      ],
      compatibilityNotes: 'Consider using Redis as a cache layer or for specific use cases rather than as a direct SQL replacement.',
      confidence: 'low'
    };
  }

  /**
   * Translate MongoDB to Redis
   */
  mongoDBToRedis(mongoQuery) {
    const query = mongoQuery.trim();
    let translated = '';
    let explanation = '';

    if (query.includes('.find(')) {
      translated = `# Redis approach for MongoDB find:\nGET collection:{id}\n# Or use HGETALL:\nHGETALL collection:{id}\n# For queries, use indexes:\nZRANGE index:field minScore maxScore`;
      explanation = 'MongoDB find() operations become Redis key lookups or index range queries';
    } else if (query.includes('.insertOne(')) {
      translated = `# Redis approach for MongoDB insertOne:\nHSET collection:{id} field1 "value1" field2 "value2"\n# Set expiration if needed:\nEXPIRE collection:{id} 3600`;
      explanation = 'MongoDB documents can be stored as Redis hashes';
    } else if (query.includes('.updateOne(')) {
      translated = `# Redis approach for MongoDB updateOne:\nHSET collection:{id} field "new_value"\n# Or update multiple fields:\nHMSET collection:{id} field1 "value1" field2 "value2"`;
      explanation = 'MongoDB updates become Redis HSET operations';
    } else {
      translated = `# MongoDB to Redis conversion guidance:\n# Original: ${mongoQuery}\n\n# Redis approach:\n# 1. Map collection to key prefix\n# 2. Use document _id for key suffix\n# 3. Store documents as hashes (HSET)\n# 4. Create indexes using sorted sets (ZADD)`;
      explanation = 'Convert MongoDB document operations to Redis key-value operations';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'MongoDB uses documents, Redis uses key-value pairs',
        'MongoDB queries become Redis key lookups',
        'No direct equivalent for complex MongoDB queries',
        'Use Redis sorted sets for indexing and range queries'
      ],
      compatibilityNotes: 'Redis works best for caching MongoDB data or simple key-based lookups.',
      confidence: 'medium'
    };
  }

  /**
   * Translate Redis to SQL
   */
  redisToSQL(redisCommand, targetDB = 'sql') {
    const command = redisCommand.trim().toUpperCase();
    let translated = '';
    let explanation = '';

    if (command.startsWith('GET') || command.startsWith('HGET')) {
      translated = `SELECT * FROM table_name WHERE id = 'key';\n-- For specific fields:\nSELECT field FROM table_name WHERE id = 'key';`;
      explanation = 'Redis GET/HGET operations translate to SQL SELECT with WHERE clause';
    } else if (command.startsWith('SET') || command.startsWith('HSET')) {
      translated = `-- If record exists:\nUPDATE table_name SET field = 'value' WHERE id = 'key';\n\n-- If new record:\nINSERT INTO table_name (id, field) VALUES ('key', 'value');`;
      explanation = 'Redis SET/HSET can be either SQL INSERT or UPDATE depending on existence';
    } else if (command.startsWith('DEL')) {
      translated = `DELETE FROM table_name WHERE id = 'key';`;
      explanation = 'Redis DEL translates to SQL DELETE';
    } else {
      translated = `-- Redis to ${targetDB} conversion:\n-- Original: ${redisCommand}\n\n-- SQL approach:\n-- 1. Extract key structure to determine table and ID\n-- 2. Map Redis data types to SQL columns\n-- 3. Use appropriate SQL operations (INSERT/UPDATE/DELETE/SELECT)`;
      explanation = 'Convert Redis key-value operations to SQL table operations';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'Redis uses key-value pairs, SQL uses tables and rows',
        'Redis keys map to SQL WHERE clauses',
        'SQL requires schema definition',
        'Redis data structures need to be flattened for SQL'
      ],
      compatibilityNotes: 'Moving from Redis to SQL requires defining a proper schema and converting key structures to relational data.',
      confidence: 'medium'
    };
  }

  /**
   * Translate Redis to MongoDB
   */
  redisToMongoDB(redisCommand) {
    const command = redisCommand.trim().toUpperCase();
    let translated = '';
    let explanation = '';

    if (command.startsWith('GET') || command.startsWith('HGETALL')) {
      translated = `db.collection.findOne({ _id: "key" });\n// Or with specific fields:\ndb.collection.findOne({ _id: "key" }, { projection: { field: 1 } });`;
      explanation = 'Redis GET/HGETALL operations translate to MongoDB findOne()';
    } else if (command.startsWith('SET') || command.startsWith('HSET')) {
      translated = `db.collection.updateOne(\n  { _id: "key" },\n  { $set: { field: "value" } },\n  { upsert: true }\n);`;
      explanation = 'Redis SET/HSET translates to MongoDB updateOne with upsert';
    } else if (command.startsWith('DEL')) {
      translated = `db.collection.deleteOne({ _id: "key" });`;
      explanation = 'Redis DEL translates to MongoDB deleteOne()';
    } else {
      translated = `// Redis to MongoDB conversion:\n// Original: ${redisCommand}\n\n// MongoDB approach:\n// 1. Extract key to use as document _id\n// 2. Map Redis hash fields to document fields\n// 3. Use updateOne with upsert for SET operations\n// 4. Use findOne for GET operations`;
      explanation = 'Convert Redis key-value operations to MongoDB document operations';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'Redis uses key-value pairs, MongoDB uses documents',
        'Redis keys become MongoDB _id fields',
        'Redis hashes map naturally to MongoDB documents',
        'MongoDB provides more query flexibility than Redis'
      ],
      compatibilityNotes: 'MongoDB is a good target for Redis data migration, as Redis hashes map naturally to MongoDB documents.',
      confidence: 'high'
    };
  }

  /**
   * Translate SQL to Elasticsearch
   */
  sqlToElasticsearch(sqlQuery) {
    const query = sqlQuery.trim().toUpperCase();
    let translated = '';
    let explanation = '';

    if (query.includes('SELECT') && query.includes('FROM')) {
      const tableName = this.extractTableName(sqlQuery);
      const whereClause = this.extractWhereClause(sqlQuery);

      if (whereClause) {
        translated = `GET /${tableName}/_search\n{\n  "query": {\n    "match": {\n      "field": "value"\n    }\n  }\n}`;
        explanation = 'SQL SELECT with WHERE translates to Elasticsearch search query';
      } else {
        translated = `GET /${tableName}/_search\n{\n  "query": {\n    "match_all": {}\n  }\n}`;
        explanation = 'SQL SELECT without WHERE translates to Elasticsearch match_all query';
      }
    } else if (query.includes('INSERT INTO')) {
      const tableName = this.extractTableName(sqlQuery);
      translated = `POST /${tableName}/_doc\n{\n  "field1": "value1",\n  "field2": "value2"\n}`;
      explanation = 'SQL INSERT translates to Elasticsearch index document';
    } else {
      translated = `# SQL to Elasticsearch conversion:\n# Original: ${sqlQuery}\n\n# Elasticsearch approach:\nGET /index/_search\n{\n  "query": { ... },\n  "sort": [ ... ],\n  "size": 10\n}`;
      explanation = 'Convert SQL to Elasticsearch Query DSL';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'Elasticsearch uses Query DSL instead of SQL',
        'Tables become indices',
        'Full-text search capabilities',
        'Queries are JSON-based'
      ],
      compatibilityNotes: 'Elasticsearch excels at full-text search. For SQL-like queries, consider Elasticsearch SQL feature.',
      confidence: 'medium'
    };
  }

  /**
   * Translate MongoDB to Elasticsearch
   */
  mongoDBToElasticsearch(mongoQuery) {
    const query = mongoQuery.trim();
    let translated = '';
    let explanation = '';

    if (query.includes('.find(')) {
      translated = `GET /collection/_search\n{\n  "query": {\n    "bool": {\n      "must": [\n        { "match": { "field": "value" } }\n      ]\n    }\n  }\n}`;
      explanation = 'MongoDB find() translates to Elasticsearch search with bool query';
    } else if (query.includes('.insertOne(')) {
      translated = `POST /collection/_doc\n{\n  "field1": "value1",\n  "field2": "value2"\n}`;
      explanation = 'MongoDB insertOne() translates to Elasticsearch index document';
    } else {
      translated = `# MongoDB to Elasticsearch conversion:\n# Original: ${mongoQuery}\n\n# Elasticsearch approach:\nGET /index/_search\n{\n  "query": { "bool": { "must": [...] } }\n}`;
      explanation = 'Convert MongoDB queries to Elasticsearch Query DSL';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'MongoDB uses JavaScript-like syntax, Elasticsearch uses JSON Query DSL',
        'Both are document-oriented',
        'Elasticsearch has superior full-text search',
        'MongoDB aggregation vs Elasticsearch aggregations'
      ],
      compatibilityNotes: 'Both are document databases. Elasticsearch is optimized for search, MongoDB for general document storage.',
      confidence: 'high'
    };
  }

  /**
   * Translate Elasticsearch to SQL
   */
  elasticsearchToSQL(esQuery, targetDB = 'sql') {
    let translated = '';
    let explanation = '';

    try {
      const queryObj = typeof esQuery === 'string' ? JSON.parse(esQuery) : esQuery;
      translated = `SELECT * FROM index_name WHERE conditions;\n-- For full-text search:\n-- Consider using database-specific full-text search features`;
      explanation = 'Elasticsearch queries can be approximated in SQL, but full-text search capabilities differ';
    } catch (e) {
      translated = `-- Elasticsearch to ${targetDB} conversion:\n-- Original: ${esQuery}\n\n-- SQL approach:\nSELECT * FROM table\nWHERE column LIKE '%search_term%';`;
      explanation = 'Convert Elasticsearch Query DSL to SQL queries';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'Elasticsearch excels at full-text search',
        'SQL LIKE is less powerful than Elasticsearch matching',
        'Elasticsearch scoring vs SQL ordering',
        'Consider database-specific full-text features'
      ],
      compatibilityNotes: 'SQL databases may need additional full-text search extensions to match Elasticsearch capabilities.',
      confidence: 'low'
    };
  }

  /**
   * Translate Elasticsearch to MongoDB
   */
  elasticsearchToMongoDB(esQuery) {
    let translated = '';
    let explanation = '';

    try {
      const queryObj = typeof esQuery === 'string' ? JSON.parse(esQuery) : esQuery;
      translated = `db.collection.find({\n  $text: { $search: "search terms" }\n});\n// Or use regex for pattern matching:\ndb.collection.find({\n  field: { $regex: /pattern/i }\n});`;
      explanation = 'Elasticsearch queries can use MongoDB text search or regex patterns';
    } catch (e) {
      translated = `// Elasticsearch to MongoDB conversion:\n// Original: ${esQuery}\n\ndb.collection.find({\n  $text: { $search: "terms" }\n});`;
      explanation = 'Convert Elasticsearch Query DSL to MongoDB queries';
    }

    return {
      translatedQuery: translated,
      explanation,
      keyDifferences: [
        'Both support full-text search',
        'Elasticsearch has more advanced search features',
        'MongoDB uses $text operator for text search',
        'Both are document-oriented'
      ],
      compatibilityNotes: 'MongoDB can handle basic full-text search, but Elasticsearch is more powerful for search-heavy applications.',
      confidence: 'medium'
    };
  }

  /**
   * Translate between SQL variants
   */
  sqlToSQLVariant(sqlQuery, sourceDB, targetDB) {
    let translated = sqlQuery;
    let differences = [];

    // PostgreSQL specific features
    if (targetDB === 'postgresql') {
      translated = sqlQuery.replace(/LIMIT (\d+) OFFSET (\d+)/gi, 'LIMIT $1 OFFSET $2');
      differences.push('PostgreSQL uses LIMIT/OFFSET syntax');
      differences.push('PostgreSQL supports advanced features like JSONB, arrays');
    }

    // MySQL specific features
    if (targetDB === 'mysql') {
      translated = sqlQuery.replace(/LIMIT (\d+) OFFSET (\d+)/gi, 'LIMIT $2, $1');
      differences.push('MySQL uses LIMIT offset, count syntax');
      differences.push('MySQL has different string functions');
    }

    // SQLite specific
    if (targetDB === 'sqlite') {
      differences.push('SQLite has limited data types');
      differences.push('No stored procedures in SQLite');
    }

    return {
      translatedQuery: translated,
      explanation: `Converting from ${sourceDB} to ${targetDB}. Most SQL is compatible, but check syntax differences.`,
      keyDifferences: differences.length > 0 ? differences : ['SQL syntax is largely compatible between databases'],
      compatibilityNotes: `${targetDB} may have specific features or limitations. Test thoroughly.`,
      confidence: 'high'
    };
  }

  /**
   * Provide conversion guidance when direct translation isn't available
   */
  provideConversionGuidance(sourceQuery, sourceDB, targetDB) {
    return {
      translatedQuery: `# Conversion guidance from ${sourceDB} to ${targetDB}:\n# Original query:\n${sourceQuery}\n\n# Approach:\n# 1. Understand the data model differences\n# 2. Map ${sourceDB} concepts to ${targetDB} equivalents\n# 3. Rewrite the query using ${targetDB} syntax\n# 4. Test thoroughly with sample data`,
      explanation: `Direct conversion from ${sourceDB} to ${targetDB} requires understanding their different paradigms. Manual rewriting recommended.`,
      keyDifferences: [
        `${sourceDB} and ${targetDB} have different data models`,
        'Query syntax and capabilities differ significantly',
        'Consider data structure redesign for optimal performance'
      ],
      compatibilityNotes: `Converting between ${sourceDB} and ${targetDB} may require significant data model changes. Consider consulting database-specific documentation.`,
      confidence: 'low'
    };
  }

  // Helper methods
  extractTableName(sqlQuery) {
    const fromMatch = sqlQuery.match(/FROM\s+(\w+)/i);
    const intoMatch = sqlQuery.match(/INTO\s+(\w+)/i);
    const updateMatch = sqlQuery.match(/UPDATE\s+(\w+)/i);
    return (fromMatch || intoMatch || updateMatch)?.[1] || 'collection';
  }

  extractWhereClause(sqlQuery) {
    const whereMatch = sqlQuery.match(/WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|;|$)/i);
    return whereMatch?.[1]?.trim();
  }

  sqlWhereToMongoFilter(whereClause) {
    // Basic conversion - this is simplified
    if (whereClause.includes('>')) {
      const parts = whereClause.split('>');
      return `{ ${parts[0].trim()}: { $gt: ${parts[1].trim()} } }`;
    }
    if (whereClause.includes('=')) {
      const parts = whereClause.split('=');
      return `{ ${parts[0].trim()}: ${parts[1].trim()} }`;
    }
    return '{ /* conditions */ }';
  }

  /**
   * Build the translation prompt
   */
  buildTranslationPrompt(sourceQuery, sourceDB, targetDB, options) {
    const { includeExplanation = true, includeComments = true, optimized = false } = options;

    return `You are an expert database engineer proficient in all major database systems.

**Task:** Translate the following ${sourceDB.toUpperCase()} query to ${targetDB.toUpperCase()} syntax.

**Source Query (${sourceDB.toUpperCase()}):**
\`\`\`${sourceDB}
${sourceQuery}
\`\`\`

**Requirements:**
1. Provide the exact equivalent query in ${targetDB.toUpperCase()} syntax
2. Ensure the translation maintains the same functionality and logic
3. Use ${targetDB.toUpperCase()} best practices and idioms
${includeComments ? '4. Add inline comments explaining key differences' : ''}
${optimized ? '5. Optimize the query for ' + targetDB.toUpperCase() + ' performance' : ''}
6. If there's no direct equivalent, provide the closest alternative with explanation

**Response Format:**
Please structure your response as follows:

TRANSLATED_QUERY:
\`\`\`${targetDB}
[Your translated query here]
\`\`\`

${includeExplanation ? `EXPLANATION:
[Explain the translation, key differences, and any important notes]

KEY_DIFFERENCES:
- [List important differences between the source and target syntax]
- [Include performance considerations if relevant]

COMPATIBILITY_NOTES:
[Any compatibility issues, limitations, or alternative approaches]
` : ''}

CONFIDENCE: [high/medium/low]

Important Notes:
- For SQL to NoSQL conversions, explain the paradigm shift
- For NoSQL to SQL, show how to structure relational equivalents
- Highlight features that don't have direct equivalents
- Suggest indexes or optimizations where relevant`;
  }

  /**
   * Parse the AI response
   */
  parseTranslationResponse(response) {
    const result = {
      translatedQuery: '',
      explanation: '',
      keyDifferences: [],
      compatibilityNotes: '',
      confidence: 'medium'
    };

    // Extract translated query
    const queryMatch = response.match(/TRANSLATED_QUERY:\s*```[\w]*\n([\s\S]*?)```/);
    if (queryMatch) {
      result.translatedQuery = queryMatch[1].trim();
    }

    // Extract explanation
    const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]*?)(?=KEY_DIFFERENCES:|COMPATIBILITY_NOTES:|CONFIDENCE:|$)/);
    if (explanationMatch) {
      result.explanation = explanationMatch[1].trim();
    }

    // Extract key differences
    const differencesMatch = response.match(/KEY_DIFFERENCES:\s*([\s\S]*?)(?=COMPATIBILITY_NOTES:|CONFIDENCE:|$)/);
    if (differencesMatch) {
      const differences = differencesMatch[1].trim();
      result.keyDifferences = differences
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Extract compatibility notes
    const compatMatch = response.match(/COMPATIBILITY_NOTES:\s*([\s\S]*?)(?=CONFIDENCE:|$)/);
    if (compatMatch) {
      result.compatibilityNotes = compatMatch[1].trim();
    }

    // Extract confidence
    const confidenceMatch = response.match(/CONFIDENCE:\s*(\w+)/i);
    if (confidenceMatch) {
      result.confidence = confidenceMatch[1].toLowerCase();
    }

    return result;
  }

  /**
   * Get common query patterns for a database
   */
  getCommonPatterns(database) {
    const patterns = {
      sql: [
        'SELECT * FROM users WHERE age > 18',
        'INSERT INTO products (name, price) VALUES (?, ?)',
        'UPDATE orders SET status = ? WHERE id = ?',
        'DELETE FROM sessions WHERE expires_at < NOW()',
        'SELECT u.name, COUNT(o.id) FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id'
      ],
      mongodb: [
        'db.users.find({ age: { $gt: 18 } })',
        'db.products.insertOne({ name: "Product", price: 99.99 })',
        'db.orders.updateOne({ _id: ObjectId("...") }, { $set: { status: "completed" } })',
        'db.sessions.deleteMany({ expiresAt: { $lt: new Date() } })',
        'db.users.aggregate([{ $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } }])'
      ],
      redis: [
        'SET user:1001:name "John Doe"',
        'GET user:1001:name',
        'HSET user:1001 name "John" email "john@example.com"',
        'ZADD leaderboard 100 "player1" 200 "player2"',
        'SETEX session:abc123 3600 "session_data"'
      ],
      postgresql: [
        'SELECT * FROM users WHERE age > 18',
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id',
        'UPDATE orders SET status = $1 WHERE id = $2',
        'SELECT * FROM products WHERE data @> \'{"category": "electronics"}\'::jsonb',
        'SELECT * FROM generate_series(1, 10) AS numbers'
      ],
      elasticsearch: [
        'GET /products/_search { "query": { "match": { "name": "laptop" } } }',
        'POST /products/_doc { "name": "Product", "price": 99.99 }',
        'POST /products/_update/1 { "doc": { "price": 89.99 } }',
        'DELETE /products/_doc/1',
        'GET /products/_search { "query": { "bool": { "must": [{ "range": { "price": { "gte": 50 } } }] } } }'
      ]
    };

    return patterns[database.toLowerCase()] || [];
  }

  /**
   * Get database-specific features and limitations
   */
  getDatabaseInfo(database) {
    const info = {
      sql: {
        type: 'Relational',
        features: ['ACID transactions', 'JOINs', 'Constraints', 'Indexes'],
        strengths: 'Complex queries, data integrity, relationships',
        limitations: 'Horizontal scaling, schema flexibility'
      },
      mongodb: {
        type: 'Document (NoSQL)',
        features: ['Flexible schema', 'Embedded documents', 'Aggregation pipeline'],
        strengths: 'Scalability, flexible data models, JSON-like documents',
        limitations: 'Limited JOIN support, eventual consistency'
      },
      redis: {
        type: 'Key-Value (In-Memory)',
        features: ['Ultra-fast', 'Data structures', 'Pub/Sub', 'Caching'],
        strengths: 'Speed, simplicity, caching, real-time features',
        limitations: 'Memory-bound, limited query capabilities'
      },
      postgresql: {
        type: 'Relational (Advanced)',
        features: ['JSONB', 'Full-text search', 'Extensions', 'Advanced indexing'],
        strengths: 'Extensibility, JSON support, performance, ACID',
        limitations: 'Complexity, vertical scaling limits'
      },
      elasticsearch: {
        type: 'Search Engine',
        features: ['Full-text search', 'Analytics', 'Distributed', 'Real-time'],
        strengths: 'Search capabilities, scalability, analytics',
        limitations: 'Not a primary database, complexity'
      }
    };

    return info[database.toLowerCase()] || null;
  }
}

module.exports = new DatabaseTranslationService();
