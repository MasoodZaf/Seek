require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// SQL practice code templates based on topic
const sqlPracticeTemplates = {
  'introduction-relational': `-- Practice: Introduction to Relational Databases
-- Complete the exercises below

-- Exercise 1: Understanding Tables and Relationships
-- View the structure of a simple users table
SELECT * FROM users LIMIT 5;

-- Exercise 2: Identify columns and data types
-- This query shows table structure (works in most SQL databases)
-- DESCRIBE users; -- MySQL/MariaDB
-- \\d users;      -- PostgreSQL
-- PRAGMA table_info(users); -- SQLite

-- Exercise 3: Understanding Primary Keys
-- Find a specific user by their unique ID
SELECT * FROM users WHERE id = 1;

-- Your turn: Practice basic SELECT queries
-- TODO: Select all columns from a different table
-- TODO: Find a record by its primary key
-- TODO: List the first 10 records from any table
`,

  'basic-queries': `-- Practice: Basic SQL Queries
-- Complete the exercises below

-- Exercise 1: SELECT specific columns
SELECT
  first_name,
  last_name,
  email
FROM users;

-- Exercise 2: WHERE clause filtering
SELECT * FROM products
WHERE price > 50;

-- Exercise 3: Multiple conditions with AND/OR
SELECT * FROM orders
WHERE status = 'completed'
  AND total_amount > 100;

-- Exercise 4: LIKE operator for pattern matching
SELECT * FROM customers
WHERE email LIKE '%@gmail.com';

-- Your turn: Write your own queries
-- TODO: Select specific columns from a table
-- TODO: Filter records with a WHERE clause
-- TODO: Use LIKE to search for patterns
-- TODO: Combine multiple conditions with AND/OR
`,

  'sorting-limiting': `-- Practice: Sorting and Limiting Results
-- Complete the exercises below

-- Exercise 1: ORDER BY ascending
SELECT
  product_name,
  price
FROM products
ORDER BY price ASC;

-- Exercise 2: ORDER BY descending
SELECT
  customer_name,
  total_purchases
FROM customers
ORDER BY total_purchases DESC;

-- Exercise 3: LIMIT results
SELECT * FROM orders
ORDER BY order_date DESC
LIMIT 10;

-- Exercise 4: Combining ORDER BY with multiple columns
SELECT
  category,
  product_name,
  price
FROM products
ORDER BY category ASC, price DESC;

-- Your turn: Practice sorting and limiting
-- TODO: Sort a table by different columns
-- TODO: Use LIMIT to get top N records
-- TODO: Order by multiple columns
-- TODO: Combine WHERE, ORDER BY, and LIMIT
`,

  'aggregate-functions': `-- Practice: Aggregate Functions
-- Complete the exercises below

-- Exercise 1: COUNT - Total number of records
SELECT COUNT(*) as total_users
FROM users;

-- Exercise 2: SUM - Calculate total
SELECT SUM(amount) as total_sales
FROM orders;

-- Exercise 3: AVG - Calculate average
SELECT AVG(price) as average_price
FROM products;

-- Exercise 4: MIN and MAX
SELECT
  MIN(price) as lowest_price,
  MAX(price) as highest_price
FROM products;

-- Exercise 5: GROUP BY with aggregates
SELECT
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price
FROM products
GROUP BY category;

-- Your turn: Practice aggregate functions
-- TODO: Count records in different tables
-- TODO: Calculate sum and average of numeric columns
-- TODO: Find minimum and maximum values
-- TODO: Use GROUP BY with aggregate functions
`,

  'joins': `-- Practice: SQL Joins
-- Complete the exercises below

-- Exercise 1: INNER JOIN - Match records from both tables
SELECT
  orders.id,
  orders.order_date,
  customers.name,
  customers.email
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

-- Exercise 2: LEFT JOIN - All records from left table
SELECT
  customers.name,
  orders.id as order_id,
  orders.total_amount
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;

-- Exercise 3: JOIN with WHERE clause
SELECT
  products.name,
  categories.name as category,
  products.price
FROM products
INNER JOIN categories ON products.category_id = categories.id
WHERE products.price > 100;

-- Exercise 4: Multiple JOINs
SELECT
  orders.id,
  customers.name,
  products.name as product,
  order_items.quantity
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id;

-- Your turn: Practice different types of joins
-- TODO: Write an INNER JOIN query
-- TODO: Use LEFT JOIN to include all records from one table
-- TODO: Combine JOIN with WHERE clause
-- TODO: Join three or more tables
`,

  'insert-data': `-- Practice: Inserting Data
-- Complete the exercises below

-- Exercise 1: INSERT single record
INSERT INTO users (first_name, last_name, email, created_at)
VALUES ('John', 'Doe', 'john.doe@example.com', CURRENT_TIMESTAMP);

-- Exercise 2: INSERT multiple records
INSERT INTO products (name, price, category_id)
VALUES
  ('Laptop', 999.99, 1),
  ('Mouse', 29.99, 2),
  ('Keyboard', 79.99, 2);

-- Exercise 3: INSERT with SELECT (copy data)
INSERT INTO archived_orders (order_id, customer_id, order_date)
SELECT id, customer_id, order_date
FROM orders
WHERE order_date < '2023-01-01';

-- Exercise 4: INSERT with specific columns
INSERT INTO customers (name, email)
VALUES ('Jane Smith', 'jane@example.com');
-- Note: Other columns will use default values or NULL

-- Your turn: Practice inserting data
-- TODO: Insert a single record into a table
-- TODO: Insert multiple records at once
-- TODO: Insert data with a SELECT statement
-- TODO: Insert records with only required columns
`,

  'update-data': `-- Practice: Updating Data
-- Complete the exercises below

-- Exercise 1: UPDATE single record
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;

-- Exercise 2: UPDATE multiple columns
UPDATE products
SET
  price = 89.99,
  stock_quantity = 100,
  updated_at = CURRENT_TIMESTAMP
WHERE id = 5;

-- Exercise 3: UPDATE with calculation
UPDATE products
SET price = price * 1.1  -- Increase price by 10%
WHERE category_id = 3;

-- Exercise 4: UPDATE with WHERE conditions
UPDATE orders
SET status = 'shipped'
WHERE status = 'processing'
  AND order_date < DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY);

-- IMPORTANT: Always use WHERE clause to avoid updating all records!
-- Exercise 5: Safe update pattern
-- First, check what will be updated:
SELECT * FROM users WHERE last_login < '2023-01-01';
-- Then update:
UPDATE users
SET active = false
WHERE last_login < '2023-01-01';

-- Your turn: Practice updating data
-- TODO: Update a single record by ID
-- TODO: Update multiple columns at once
-- TODO: Use calculations in UPDATE statements
-- TODO: Always verify with SELECT before updating
`,

  'delete-data': `-- Practice: Deleting Data
-- Complete the exercises below

-- Exercise 1: DELETE single record
DELETE FROM users
WHERE id = 999;

-- Exercise 2: DELETE with conditions
DELETE FROM orders
WHERE status = 'cancelled'
  AND order_date < '2022-01-01';

-- Exercise 3: DELETE with subquery
DELETE FROM order_items
WHERE order_id IN (
  SELECT id FROM orders
  WHERE status = 'cancelled'
);

-- IMPORTANT: Always use WHERE clause to avoid deleting all records!
-- Exercise 4: Safe delete pattern
-- First, check what will be deleted:
SELECT * FROM products WHERE stock_quantity = 0 AND discontinued = true;
-- Then delete:
DELETE FROM products
WHERE stock_quantity = 0 AND discontinued = true;

-- Exercise 5: Soft delete (marking as deleted instead of removing)
UPDATE users
SET deleted_at = CURRENT_TIMESTAMP,
    active = false
WHERE id = 123;
-- This is often preferred over hard delete for data integrity

-- Your turn: Practice deleting data
-- TODO: Delete a specific record by ID
-- TODO: Delete records matching certain conditions
-- TODO: Always SELECT before DELETE to verify
-- TODO: Consider using soft deletes for important data
`,

  default: `-- Practice: SQL Fundamentals
-- Complete the exercises below

-- Exercise 1: Basic SELECT
SELECT * FROM table_name
LIMIT 10;

-- Exercise 2: Filtering with WHERE
SELECT column1, column2
FROM table_name
WHERE condition = true;

-- Exercise 3: Sorting results
SELECT *
FROM table_name
ORDER BY column_name DESC;

-- Your turn: Practice SQL queries
-- TODO: Write SELECT statements
-- TODO: Filter data with WHERE clause
-- TODO: Sort and limit your results
-- TODO: Experiment with different SQL operations
`
};

async function updateDatabasePracticeCode() {
  try {
    console.log('🚀 Updating practice code for all database tutorials...\n');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Currently we only have SQL tutorials
    console.log('📝 Processing SQL tutorials...');

    const tutorials = await MongoTutorial.find({
      category: 'Database',
      language: 'sql'
    });

    let updated = 0;

    for (const tutorial of tutorials) {
      if (tutorial.steps && tutorial.steps.length >= 2) {
        const practiceStep = tutorial.steps[1]; // Step 2 is practice

        // Extract topic slug from tutorial slug (format: sql-N-topic-name)
        const topicMatch = tutorial.slug.match(/^sql-\d+-(.+)$/);
        const topicSlug = topicMatch ? topicMatch[1] : 'default';

        // Get appropriate practice code
        const practiceCode = sqlPracticeTemplates[topicSlug] || sqlPracticeTemplates.default;

        // Update the code example
        if (practiceStep.codeExamples && practiceStep.codeExamples.length > 0) {
          practiceStep.codeExamples[0].code = practiceCode;

          // IMPORTANT: Also update practicePhase.starterCode if it exists
          if (practiceStep.practicePhase) {
            practiceStep.practicePhase.starterCode = practiceCode;
          }

          await tutorial.save();
          updated++;

          if (updated % 10 === 0) {
            console.log(`  ✓ Updated ${updated} tutorials...`);
          }
        }
      }
    }

    console.log(`  ✓ Updated ${updated} SQL tutorials`);
    console.log(`\n✅ Successfully updated ${updated} database tutorials with meaningful practice code!`);

    mongoose.connection.close();
    console.log('\n🎉 Update complete!');
  } catch (error) {
    console.error('❌ Error updating practice code:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateDatabasePracticeCode();
}

module.exports = updateDatabasePracticeCode;
