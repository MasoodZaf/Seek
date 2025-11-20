/**
 * Database Syntax Validator Service
 * Validates SQL, MongoDB, Redis, and PostgreSQL code syntax without execution
 */

class DatabaseSyntaxValidator {
  /**
   * Main validation entry point
   */
  static validate(code, language) {
    const normalizedLanguage = language.toLowerCase();

    switch (normalizedLanguage) {
      case 'sql':
      case 'mysql':
        return this.validateSQL(code);

      case 'postgresql':
      case 'postgres':
        return this.validatePostgreSQL(code);

      case 'mongodb':
      case 'mongo':
        return this.validateMongoDB(code);

      case 'redis':
        return this.validateRedis(code);

      default:
        return {
          valid: false,
          errors: [`Unsupported database language: ${language}`],
          warnings: [],
          suggestions: []
        };
    }
  }

  /**
   * Validate SQL/MySQL syntax
   */
  static validateSQL(code) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    if (!code || code.trim().length === 0) {
      return {
        valid: false,
        errors: ['Code cannot be empty'],
        warnings: [],
        suggestions: ['Try writing a SELECT, INSERT, UPDATE, or DELETE statement']
      };
    }

    // Remove comments
    const cleanCode = this.removeComments(code);

    // Split into statements
    const statements = cleanCode
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (statements.length === 0) {
      errors.push('No valid SQL statements found');
    }

    statements.forEach((stmt, index) => {
      const stmtUpper = stmt.toUpperCase();
      const stmtNumber = index + 1;

      // Check for basic SQL keywords
      const validKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER',
                            'DROP', 'TRUNCATE', 'GRANT', 'REVOKE', 'WITH', 'SHOW', 'DESCRIBE'];

      const startsWithKeyword = validKeywords.some(kw => stmtUpper.startsWith(kw));

      if (!startsWithKeyword) {
        errors.push(`Statement ${stmtNumber}: Must start with a valid SQL keyword (SELECT, INSERT, etc.)`);
      }

      // Validate SELECT statements
      if (stmtUpper.startsWith('SELECT')) {
        this.validateSELECT(stmt, stmtNumber, errors, warnings, suggestions);
      }

      // Validate INSERT statements
      if (stmtUpper.startsWith('INSERT')) {
        this.validateINSERT(stmt, stmtNumber, errors, warnings, suggestions);
      }

      // Validate UPDATE statements
      if (stmtUpper.startsWith('UPDATE')) {
        this.validateUPDATE(stmt, stmtNumber, errors, warnings, suggestions);
      }

      // Validate DELETE statements
      if (stmtUpper.startsWith('DELETE')) {
        this.validateDELETE(stmt, stmtNumber, errors, warnings, suggestions);
      }

      // Validate CREATE statements
      if (stmtUpper.startsWith('CREATE')) {
        this.validateCREATE(stmt, stmtNumber, errors, warnings, suggestions);
      }

      // Check for common syntax errors
      this.checkCommonSQLErrors(stmt, stmtNumber, errors, warnings);
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      statementCount: statements.length
    };
  }

  static validateSELECT(stmt, stmtNumber, errors, warnings, suggestions) {
    const stmtUpper = stmt.toUpperCase();

    // Check if FROM clause exists (unless using functions like SELECT NOW())
    if (!stmtUpper.includes('FROM') && !stmtUpper.match(/SELECT\s+(NOW|CURRENT_|USER|DATABASE|VERSION)/)) {
      warnings.push(`Statement ${stmtNumber}: SELECT without FROM clause - this is valid but unusual`);
    }

    // Check for SELECT *
    if (stmt.match(/SELECT\s+\*/i)) {
      suggestions.push(`Statement ${stmtNumber}: Consider specifying column names instead of SELECT *`);
    }

    // Check for basic parenthesis matching
    const openParens = (stmt.match(/\(/g) || []).length;
    const closeParens = (stmt.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Statement ${stmtNumber}: Mismatched parentheses`);
    }

    // Check for proper string quotes
    if (stmt.match(/WHERE.*=.*[^'"]/i)) {
      const whereClause = stmt.substring(stmt.toUpperCase().indexOf('WHERE'));
      if (whereClause.match(/=\s*[a-zA-Z][a-zA-Z0-9]*\s*(?:AND|OR|$)/i)) {
        warnings.push(`Statement ${stmtNumber}: String values should be quoted in WHERE clause`);
      }
    }
  }

  static validateINSERT(stmt, stmtNumber, errors, warnings, suggestions) {
    const stmtUpper = stmt.toUpperCase();

    // Check for INTO keyword
    if (!stmtUpper.includes('INTO')) {
      errors.push(`Statement ${stmtNumber}: INSERT must include INTO keyword`);
    }

    // Check for VALUES or SELECT
    if (!stmtUpper.includes('VALUES') && !stmtUpper.includes('SELECT')) {
      errors.push(`Statement ${stmtNumber}: INSERT must include VALUES or SELECT clause`);
    }

    // Check parentheses matching
    const openParens = (stmt.match(/\(/g) || []).length;
    const closeParens = (stmt.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Statement ${stmtNumber}: Mismatched parentheses in INSERT statement`);
    }
  }

  static validateUPDATE(stmt, stmtNumber, errors, warnings, suggestions) {
    const stmtUpper = stmt.toUpperCase();

    // Check for SET keyword
    if (!stmtUpper.includes('SET')) {
      errors.push(`Statement ${stmtNumber}: UPDATE must include SET clause`);
    }

    // Warn if no WHERE clause
    if (!stmtUpper.includes('WHERE')) {
      warnings.push(`Statement ${stmtNumber}: UPDATE without WHERE clause will modify all rows - this might not be intended`);
    }
  }

  static validateDELETE(stmt, stmtNumber, errors, warnings, suggestions) {
    const stmtUpper = stmt.toUpperCase();

    // Check for FROM keyword
    if (!stmtUpper.includes('FROM')) {
      errors.push(`Statement ${stmtNumber}: DELETE must include FROM clause`);
    }

    // Warn if no WHERE clause
    if (!stmtUpper.includes('WHERE')) {
      warnings.push(`Statement ${stmtNumber}: DELETE without WHERE clause will remove all rows - this is dangerous!`);
    }
  }

  static validateCREATE(stmt, stmtNumber, errors, warnings, suggestions) {
    const stmtUpper = stmt.toUpperCase();

    // Check what's being created
    const createTypes = ['TABLE', 'DATABASE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION'];
    const hasType = createTypes.some(type => stmtUpper.includes(type));

    if (!hasType) {
      errors.push(`Statement ${stmtNumber}: CREATE must specify what to create (TABLE, DATABASE, INDEX, etc.)`);
    }

    // Check parentheses for CREATE TABLE
    if (stmtUpper.includes('TABLE')) {
      const openParens = (stmt.match(/\(/g) || []).length;
      const closeParens = (stmt.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push(`Statement ${stmtNumber}: Mismatched parentheses in CREATE TABLE`);
      }
      if (openParens === 0) {
        errors.push(`Statement ${stmtNumber}: CREATE TABLE must include column definitions in parentheses`);
      }
    }
  }

  static checkCommonSQLErrors(stmt, stmtNumber, errors, warnings) {
    // Check for unquoted strings after = in WHERE clauses
    const whereMatch = stmt.match(/WHERE\s+.*?(?:;|$)/i);
    if (whereMatch) {
      const whereClause = whereMatch[0];
      // Simple check for = followed by unquoted text
      if (whereClause.match(/=\s*[a-zA-Z_][a-zA-Z0-9_]*(?:\s|$)/i)) {
        const word = whereClause.match(/=\s*([a-zA-Z_][a-zA-Z0-9_]*)/i)[1].toUpperCase();
        // Check if it's not a column name or keyword
        if (!['TRUE', 'FALSE', 'NULL'].includes(word)) {
          warnings.push(`Statement ${stmtNumber}: Possible unquoted string value after =`);
        }
      }
    }

    // Check for semicolon inside the statement (nested statements)
    const semicolonCount = (stmt.match(/;/g) || []).length;
    if (semicolonCount > 1) {
      warnings.push(`Statement ${stmtNumber}: Multiple semicolons detected - check for statement separation`);
    }
  }

  /**
   * Validate PostgreSQL-specific syntax
   */
  static validatePostgreSQL(code) {
    // Start with standard SQL validation
    const result = this.validateSQL(code);

    // Add PostgreSQL-specific checks
    const pgKeywords = ['RETURNING', 'JSONB', 'ARRAY', 'SERIAL', 'BIGSERIAL', 'UUID', 'HSTORE'];
    const hasPostgreSQLFeatures = pgKeywords.some(kw => code.toUpperCase().includes(kw));

    if (hasPostgreSQLFeatures) {
      result.suggestions.push('Code uses PostgreSQL-specific features - not compatible with MySQL');
    }

    // Check for $1, $2 style parameters
    if (code.match(/\$\d+/)) {
      result.suggestions.push('Using parameterized queries ($1, $2) - good practice for security');
    }

    return result;
  }

  /**
   * Validate MongoDB query syntax
   */
  static validateMongoDB(code) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    if (!code || code.trim().length === 0) {
      return {
        valid: false,
        errors: ['Code cannot be empty'],
        warnings: [],
        suggestions: ['Try writing a MongoDB query like: db.collection.find()']
      };
    }

    const cleanCode = code.trim();

    // Check if it looks like MongoDB syntax
    if (!cleanCode.includes('db.') && !cleanCode.includes('await')) {
      warnings.push('Code does not appear to use MongoDB syntax (db.collection...)');
    }

    // Common MongoDB methods
    const mongoMethods = ['find', 'findOne', 'insertOne', 'insertMany', 'updateOne',
                          'updateMany', 'deleteOne', 'deleteMany', 'aggregate', 'countDocuments'];

    const hasMongoMethod = mongoMethods.some(method => cleanCode.includes(method));

    if (cleanCode.includes('db.') && !hasMongoMethod) {
      suggestions.push('Did you mean to use a MongoDB method like find(), insertOne(), etc.?');
    }

    // Check for proper JSON syntax in queries
    try {
      // Try to find JSON-like objects in the code
      const jsonMatches = cleanCode.match(/\{[^}]*\}/g);
      if (jsonMatches) {
        jsonMatches.forEach((match, index) => {
          try {
            // Try to parse as JSON (with some cleaning)
            const cleaned = match
              .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
              .replace(/'/g, '"');           // Replace single quotes
            JSON.parse(cleaned);
          } catch (e) {
            warnings.push(`Possible JSON syntax error in query object ${index + 1}`);
          }
        });
      }
    } catch (e) {
      // Ignore parsing errors in this context
    }

    // Check for common mistakes
    if (cleanCode.match(/db\.\w+\.find\(\)\s*$/)) {
      suggestions.push('Remember to use .toArray() or await the cursor for async operations');
    }

    // Check for update operators
    if (cleanCode.includes('updateOne') || cleanCode.includes('updateMany')) {
      if (!cleanCode.match(/\$set|\$inc|\$push|\$pull/)) {
        warnings.push('Update operations usually require update operators like $set, $inc, etc.');
      }
    }

    // Check parentheses matching
    const openParens = (cleanCode.match(/\(/g) || []).length;
    const closeParens = (cleanCode.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Mismatched parentheses');
    }

    // Check braces matching
    const openBraces = (cleanCode.match(/\{/g) || []).length;
    const closeBraces = (cleanCode.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Mismatched curly braces');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate Redis command syntax
   */
  static validateRedis(code) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    if (!code || code.trim().length === 0) {
      return {
        valid: false,
        errors: ['Code cannot be empty'],
        warnings: [],
        suggestions: ['Try a Redis command like: SET key value or GET key']
      };
    }

    const cleanCode = this.removeComments(code);
    const lines = cleanCode.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const redisCommands = [
      // String commands
      'GET', 'SET', 'SETEX', 'SETNX', 'MGET', 'MSET', 'INCR', 'DECR', 'INCRBY', 'DECRBY',
      // List commands
      'LPUSH', 'RPUSH', 'LPOP', 'RPOP', 'LRANGE', 'LLEN', 'LINDEX', 'LSET', 'BLPOP', 'BRPOP',
      // Set commands
      'SADD', 'SREM', 'SMEMBERS', 'SISMEMBER', 'SCARD', 'SUNION', 'SINTER', 'SDIFF',
      // Sorted Set commands
      'ZADD', 'ZREM', 'ZRANGE', 'ZREVRANGE', 'ZRANK', 'ZSCORE', 'ZINCRBY', 'ZCARD',
      // Hash commands
      'HSET', 'HGET', 'HMSET', 'HMGET', 'HGETALL', 'HDEL', 'HEXISTS', 'HKEYS', 'HVALS', 'HINCRBY',
      // Key commands
      'DEL', 'EXISTS', 'EXPIRE', 'TTL', 'PERSIST', 'KEYS', 'SCAN', 'TYPE',
      // Pub/Sub
      'PUBLISH', 'SUBSCRIBE', 'UNSUBSCRIBE',
      // Transaction
      'MULTI', 'EXEC', 'DISCARD', 'WATCH',
      // JavaScript client methods
      'client.set', 'client.get', 'client.hSet', 'client.hGet', 'client.lPush',
      'client.zAdd', 'client.exists', 'client.expire'
    ];

    lines.forEach((line, index) => {
      const lineUpper = line.toUpperCase();
      const lineNumber = index + 1;

      // Check if line contains a Redis command or client method
      const hasCommand = redisCommands.some(cmd =>
        lineUpper.startsWith(cmd.toUpperCase()) ||
        line.includes(`client.${cmd.toLowerCase()}`) ||
        line.includes(`await client.${cmd.toLowerCase()}`)
      );

      if (!hasCommand && !line.startsWith('//') && !line.startsWith('/*')) {
        // Check if it's a variable or async/await
        if (!line.match(/^(const|let|var|await|async|return)/i)) {
          warnings.push(`Line ${lineNumber}: Does not appear to be a valid Redis command`);
        }
      }

      // Check for common JavaScript client usage
      if (line.includes('client.') && !line.includes('await')) {
        suggestions.push(`Line ${lineNumber}: Redis client methods are async - consider using 'await'`);
      }

      // Check for proper string quoting
      if (lineUpper.startsWith('SET') || lineUpper.startsWith('GET')) {
        const parts = line.split(/\s+/);
        if (parts.length < 2) {
          errors.push(`Line ${lineNumber}: ${parts[0]} command requires a key argument`);
        }
        if (lineUpper.startsWith('SET') && parts.length < 3) {
          errors.push(`Line ${lineNumber}: SET command requires both key and value`);
        }
      }
    });

    // Check parentheses matching (for JavaScript client code)
    const openParens = (cleanCode.match(/\(/g) || []).length;
    const closeParens = (cleanCode.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push('Mismatched parentheses in client method calls');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Remove comments from code
   */
  static removeComments(code) {
    // Remove single-line comments (-- and //)
    let cleaned = code.replace(/--.*$/gm, '');
    cleaned = cleaned.replace(/\/\/.*$/gm, '');

    // Remove multi-line comments (/* ... */)
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

    return cleaned;
  }
}

module.exports = DatabaseSyntaxValidator;
