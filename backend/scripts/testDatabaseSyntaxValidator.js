const DatabaseSyntaxValidator = require('../services/databaseSyntaxValidator');

console.log('='.repeat(60));
console.log('DATABASE SYNTAX VALIDATOR - TEST SUITE');
console.log('='.repeat(60));

// Test SQL
console.log('\n### TEST 1: Valid SQL SELECT');
console.log('Code: SELECT * FROM users WHERE age > 18;');
const test1 = DatabaseSyntaxValidator.validate(
  'SELECT * FROM users WHERE age > 18;',
  'sql'
);
console.log('Result:', test1.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test1.errors);
console.log('Warnings:', test1.warnings);
console.log('Suggestions:', test1.suggestions);

// Test SQL with error
console.log('\n### TEST 2: Invalid SQL (missing FROM)');
console.log('Code: SELECT * WHERE age > 18;');
const test2 = DatabaseSyntaxValidator.validate(
  'SELECT * WHERE age > 18;',
  'sql'
);
console.log('Result:', test2.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test2.errors);
console.log('Warnings:', test2.warnings);

// Test SQL INSERT
console.log('\n### TEST 3: Valid SQL INSERT');
const insertCode = `INSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 30);`;
console.log('Code:', insertCode);
const test3 = DatabaseSyntaxValidator.validate(insertCode, 'sql');
console.log('Result:', test3.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test3.errors);
console.log('Warnings:', test3.warnings);

// Test SQL UPDATE without WHERE
console.log('\n### TEST 4: SQL UPDATE without WHERE (dangerous)');
const updateCode = `UPDATE users SET status = 'active';`;
console.log('Code:', updateCode);
const test4 = DatabaseSyntaxValidator.validate(updateCode, 'sql');
console.log('Result:', test4.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test4.errors);
console.log('Warnings:', test4.warnings);

// Test MongoDB
console.log('\n### TEST 5: Valid MongoDB query');
const mongoCode = `db.users.find({ age: { $gte: 18 } })`;
console.log('Code:', mongoCode);
const test5 = DatabaseSyntaxValidator.validate(mongoCode, 'mongodb');
console.log('Result:', test5.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test5.errors);
console.log('Warnings:', test5.warnings);
console.log('Suggestions:', test5.suggestions);

// Test MongoDB with missing parentheses
console.log('\n### TEST 6: MongoDB with syntax error');
const mongoErrorCode = `db.users.find({ age: { $gte: 18 }`;
console.log('Code:', mongoErrorCode);
const test6 = DatabaseSyntaxValidator.validate(mongoErrorCode, 'mongodb');
console.log('Result:', test6.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test6.errors);

// Test Redis
console.log('\n### TEST 7: Valid Redis commands');
const redisCode = `SET user:1:name "John Doe"
GET user:1:name
INCR page:views`;
console.log('Code:', redisCode);
const test7 = DatabaseSyntaxValidator.validate(redisCode, 'redis');
console.log('Result:', test7.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test7.errors);
console.log('Warnings:', test7.warnings);

// Test Redis JavaScript client
console.log('\n### TEST 8: Redis JavaScript client code');
const redisJSCode = `await client.set('user:1', JSON.stringify({ name: 'John' }));
const user = await client.get('user:1');`;
console.log('Code:', redisJSCode);
const test8 = DatabaseSyntaxValidator.validate(redisJSCode, 'redis');
console.log('Result:', test8.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test8.errors);
console.log('Warnings:', test8.warnings);
console.log('Suggestions:', test8.suggestions);

// Test PostgreSQL
console.log('\n### TEST 9: PostgreSQL with JSONB');
const pgCode = `SELECT * FROM products WHERE specs @> '{"cpu": "Intel i7"}'::JSONB;`;
console.log('Code:', pgCode);
const test9 = DatabaseSyntaxValidator.validate(pgCode, 'postgresql');
console.log('Result:', test9.valid ? '✅ PASS' : '❌ FAIL');
console.log('Errors:', test9.errors);
console.log('Warnings:', test9.warnings);
console.log('Suggestions:', test9.suggestions);

// Test multiple SQL statements
console.log('\n### TEST 10: Multiple SQL statements');
const multiCode = `SELECT * FROM users;
INSERT INTO logs (action, timestamp) VALUES ('login', NOW());
UPDATE users SET last_login = NOW() WHERE id = 1;`;
console.log('Code:', multiCode);
const test10 = DatabaseSyntaxValidator.validate(multiCode, 'sql');
console.log('Result:', test10.valid ? '✅ PASS' : '❌ FAIL');
console.log('Statement count:', test10.statementCount);
console.log('Errors:', test10.errors);
console.log('Warnings:', test10.warnings);

console.log('\n' + '='.repeat(60));
console.log('TEST SUITE COMPLETE');
console.log('='.repeat(60));

// Summary
const tests = [test1, test2, test3, test4, test5, test6, test7, test8, test9, test10];
const passed = tests.filter(t => t.valid).length;
const failed = tests.filter(t => !t.valid).length;

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
