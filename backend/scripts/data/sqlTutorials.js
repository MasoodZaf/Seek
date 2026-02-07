// 25 SQL/MySQL Tutorials with full 3-phase content
module.exports = function (T, S) {
  return [
    T({
      title: 'SQL Basics: SELECT Queries', slug: 'sql-select-basics',
      description: 'Learn the fundamentals of querying data with SELECT, WHERE, and ORDER BY.',
      language: 'sql', difficulty: 'beginner', duration: 30,
      tags: ['sql', 'mysql', 'select', 'database'],
      category: 'Database',
      objectives: ['Write basic SELECT queries', 'Filter with WHERE clause', 'Sort results with ORDER BY'],
      featured: true,
      steps: [
        S(1, {
          title: 'SELECT and WHERE', content: 'SELECT retrieves data from tables. WHERE filters rows based on conditions.',
          lang: 'sql', code: '-- Select all columns\nSELECT * FROM employees;\n\n-- Select specific columns\nSELECT first_name, last_name, salary FROM employees;\n\n-- Filter with WHERE\nSELECT first_name, salary FROM employees\nWHERE salary > 50000;\n\n-- Multiple conditions\nSELECT * FROM employees\nWHERE department = \'Engineering\'\n  AND salary >= 60000\nORDER BY salary DESC;',
          concept: 'SELECT specifies which columns to retrieve. FROM specifies the table. WHERE filters rows using conditions. ORDER BY sorts results (ASC ascending, DESC descending).',
          keyPoints: ['SELECT * gets all columns', 'WHERE filters before results', 'AND/OR combine conditions', 'ORDER BY sorts results'],
          realWorld: 'Business analysts query employee databases daily to generate reports on headcount, salaries, and department distribution.',
          mistakes: ['Using SELECT * in production (inefficient)', 'Forgetting quotes around string values', 'Confusing AND/OR precedence'],
          pInstructions: ['Write a SELECT to get all employees', 'Add WHERE to filter by department', 'Sort by salary descending'],
          starter: '-- Get all employees in Engineering department\n-- sorted by salary highest first\nSELECT \nFROM \nWHERE \nORDER BY ;',
          solution: 'SELECT first_name, last_name, salary\nFROM employees\nWHERE department = \'Engineering\'\nORDER BY salary DESC;',
          hints: ['Use DESC for highest first', 'String values need quotes in WHERE'],
          challenge: 'Write a query to find the top 10 highest-paid employees who joined after 2020 and work in either Engineering or Marketing.',
          reqs: ['Filter by hire_date > 2020', 'Filter by department IN list', 'Order by salary DESC', 'LIMIT to 10'],
          tests: [['query runs', 'returns max 10 rows', 5], ['filtered correctly', 'only 2 departments', 5]]
        }),
        S(2, {
          title: 'DISTINCT, LIKE, and IN', content: 'Additional filtering tools for more precise queries.',
          lang: 'sql', code: '-- DISTINCT removes duplicates\nSELECT DISTINCT department FROM employees;\n\n-- LIKE for pattern matching\nSELECT * FROM employees WHERE last_name LIKE \'Sm%\';  -- starts with Sm\nSELECT * FROM employees WHERE email LIKE \'%@gmail.com\';  -- ends with\n\n-- IN for matching a list\nSELECT * FROM employees\nWHERE department IN (\'Engineering\', \'Marketing\', \'Sales\');\n\n-- BETWEEN for ranges\nSELECT * FROM employees\nWHERE salary BETWEEN 50000 AND 80000;',
          concept: 'DISTINCT eliminates duplicate rows. LIKE uses % (any characters) and _ (single character) for pattern matching. IN matches against a list. BETWEEN defines inclusive ranges.',
          keyPoints: ['DISTINCT removes duplicate rows', '% matches zero or more characters', '_ matches exactly one character', 'BETWEEN is inclusive on both ends'],
          realWorld: 'Customer support teams use LIKE queries to search for customers by partial name or email address.',
          mistakes: ['LIKE is case-sensitive in some databases', 'BETWEEN includes both endpoints', 'NOT IN with NULL values returns no rows'],
          pInstructions: ['Find all unique departments', 'Find employees whose name starts with A', 'Find employees in a list of departments'],
          starter: '-- All unique departments\n\n-- Names starting with A\n\n-- Employees in Engineering or Sales',
          solution: 'SELECT DISTINCT department FROM employees;\nSELECT * FROM employees WHERE first_name LIKE \'A%\';\nSELECT * FROM employees WHERE department IN (\'Engineering\', \'Sales\');',
          hints: ['DISTINCT goes right after SELECT', 'LIKE patterns need single quotes'],
          challenge: 'Find employees whose email is from gmail or yahoo, name contains "son", and salary is between 40k-80k.',
          reqs: ['LIKE for email patterns', 'LIKE for name pattern', 'BETWEEN for salary range', 'Combine with AND'],
          tests: [['query runs', 'filters applied', 5]]
        })
      ]
    }),

    T({
      title: 'SQL INSERT, UPDATE, DELETE', slug: 'sql-insert-update-delete',
      description: 'Learn to modify data with INSERT, UPDATE, and DELETE statements.',
      language: 'sql', difficulty: 'beginner', duration: 30,
      tags: ['sql', 'mysql', 'dml', 'database'],
      category: 'Database',
      objectives: ['Insert new rows', 'Update existing data', 'Delete rows safely'],
      steps: [
        S(1, {
          title: 'Data Modification', content: 'INSERT adds rows, UPDATE modifies existing rows, DELETE removes rows.',
          lang: 'sql', code: '-- INSERT single row\nINSERT INTO employees (first_name, last_name, department, salary)\nVALUES (\'Alice\', \'Smith\', \'Engineering\', 75000);\n\n-- INSERT multiple rows\nINSERT INTO employees (first_name, last_name, department, salary)\nVALUES\n  (\'Bob\', \'Jones\', \'Marketing\', 65000),\n  (\'Carol\', \'Williams\', \'Sales\', 55000);\n\n-- UPDATE with WHERE\nUPDATE employees SET salary = salary * 1.10\nWHERE department = \'Engineering\';\n\n-- DELETE with WHERE\nDELETE FROM employees WHERE id = 42;\n\n-- CAREFUL: without WHERE affects ALL rows!\n-- DELETE FROM employees;  -- deletes everything!',
          concept: 'INSERT adds new rows. UPDATE changes existing rows matching the WHERE condition. DELETE removes rows matching WHERE. Always use WHERE with UPDATE/DELETE to avoid affecting all rows.',
          keyPoints: ['INSERT INTO table (cols) VALUES (vals)', 'UPDATE SET col=val WHERE condition', 'DELETE FROM table WHERE condition', 'ALWAYS use WHERE with UPDATE/DELETE'],
          realWorld: 'E-commerce systems use INSERT for new orders, UPDATE to change order status, and soft-delete (status flag) instead of DELETE.',
          mistakes: ['UPDATE/DELETE without WHERE (affects all rows)', 'Column count mismatch in INSERT', 'Violating NOT NULL or UNIQUE constraints'],
          pInstructions: ['Insert a new employee', 'Give all employees in Sales a 5% raise', 'Delete an employee by ID'],
          starter: '-- Insert new employee\n\n-- Give Sales a 5% raise\n\n-- Delete employee with id=99',
          solution: 'INSERT INTO employees (first_name, last_name, department, salary)\nVALUES (\'Dave\', \'Brown\', \'Sales\', 50000);\n\nUPDATE employees SET salary = salary * 1.05\nWHERE department = \'Sales\';\n\nDELETE FROM employees WHERE id = 99;',
          hints: ['salary * 1.05 gives a 5% raise', 'Always test WHERE clause with SELECT first'],
          challenge: 'Write a transaction that transfers an employee to a new department: update their department, update both old and new department headcounts, and log the transfer.',
          reqs: ['UPDATE employee department', 'UPDATE department counts', 'INSERT into transfer_log', 'Use a transaction'],
          tests: [['transfer complete', 'all tables updated', 5]]
        })
      ]
    }),

    T({
      title: 'SQL CREATE TABLE and Data Types', slug: 'sql-create-table',
      description: 'Design tables with proper data types, constraints, and keys.',
      language: 'sql', difficulty: 'beginner', duration: 35,
      tags: ['sql', 'mysql', 'ddl', 'database'],
      category: 'Database',
      objectives: ['Create tables with appropriate data types', 'Add primary and foreign keys', 'Use constraints (NOT NULL, UNIQUE, DEFAULT)'],
      steps: [
        S(1, {
          title: 'Table Creation', content: 'CREATE TABLE defines the structure of a new table.',
          lang: 'sql', code: 'CREATE TABLE employees (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  first_name VARCHAR(50) NOT NULL,\n  last_name VARCHAR(50) NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  department_id INT,\n  salary DECIMAL(10, 2) DEFAULT 0.00,\n  hire_date DATE NOT NULL,\n  is_active BOOLEAN DEFAULT TRUE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (department_id) REFERENCES departments(id)\n);\n\nCREATE TABLE departments (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) UNIQUE NOT NULL,\n  budget DECIMAL(15, 2)\n);',
          concept: 'Data types define what values a column can hold. Constraints enforce rules. PRIMARY KEY uniquely identifies rows. FOREIGN KEY links to another table. AUTO_INCREMENT generates unique IDs.',
          keyPoints: ['INT, VARCHAR, DECIMAL, DATE, BOOLEAN, TIMESTAMP', 'PRIMARY KEY = unique + not null', 'FOREIGN KEY references another table', 'NOT NULL prevents empty values'],
          realWorld: 'Database architects spend significant time designing table schemas because changing them later is expensive with millions of rows.',
          mistakes: ['VARCHAR too short for real data', 'Using FLOAT for money (use DECIMAL)', 'Missing NOT NULL on required fields', 'Forgetting foreign key constraints'],
          pInstructions: ['Create a products table', 'Create a categories table', 'Add a foreign key from products to categories'],
          starter: '-- Create categories table\n\n-- Create products table with foreign key to categories',
          solution: 'CREATE TABLE categories (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100) UNIQUE NOT NULL\n);\n\nCREATE TABLE products (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(200) NOT NULL,\n  price DECIMAL(10, 2) NOT NULL,\n  category_id INT,\n  stock INT DEFAULT 0,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (category_id) REFERENCES categories(id)\n);',
          hints: ['Create the referenced table first', 'DECIMAL(10,2) = 10 digits total, 2 after decimal'],
          challenge: 'Design a complete e-commerce schema: users, products, orders, order_items, reviews. Include all appropriate constraints and relationships.',
          reqs: ['At least 5 tables', 'Primary and foreign keys', 'Appropriate data types', 'NOT NULL and DEFAULT constraints'],
          tests: [['all tables created', 'no errors', 5]]
        })
      ]
    }),

    T({
      title: 'SQL JOINs', slug: 'sql-joins',
      description: 'Combine data from multiple tables using INNER, LEFT, RIGHT, and FULL JOINs.',
      language: 'sql', difficulty: 'intermediate', duration: 45,
      tags: ['sql', 'mysql', 'joins', 'database'],
      category: 'Database',
      objectives: ['Use INNER JOIN for matching rows', 'Use LEFT/RIGHT JOIN for unmatched rows', 'Join multiple tables'],
      featured: true,
      steps: [
        S(1, {
          title: 'Join Types', content: 'JOINs combine rows from two or more tables based on related columns.',
          lang: 'sql', code: '-- INNER JOIN: only matching rows\nSELECT e.first_name, e.last_name, d.name AS department\nFROM employees e\nINNER JOIN departments d ON e.department_id = d.id;\n\n-- LEFT JOIN: all left rows + matching right\nSELECT e.first_name, d.name AS department\nFROM employees e\nLEFT JOIN departments d ON e.department_id = d.id;\n\n-- Multiple JOINs\nSELECT e.first_name, d.name, p.title\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nJOIN projects p ON e.id = p.lead_id;',
          concept: 'INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all left-table rows plus matches (NULL for no match). RIGHT JOIN is the mirror. FULL JOIN returns all rows from both.',
          keyPoints: ['INNER JOIN: only matching rows', 'LEFT JOIN: all left + matches', 'RIGHT JOIN: all right + matches', 'Use table aliases for readability'],
          realWorld: 'Reporting systems JOIN orders with customers and products to create comprehensive sales reports.',
          mistakes: ['Missing ON clause creates cartesian product', 'Using wrong join type (losing data)', 'Ambiguous column names without aliases'],
          pInstructions: ['INNER JOIN employees with departments', 'LEFT JOIN to include employees without departments', 'Join 3 tables together'],
          starter: '-- INNER JOIN employees and departments\n\n-- LEFT JOIN to see all employees\n\n-- Join employees, departments, and projects',
          solution: 'SELECT e.first_name, d.name FROM employees e\nINNER JOIN departments d ON e.department_id = d.id;\n\nSELECT e.first_name, COALESCE(d.name, \'Unassigned\') AS dept\nFROM employees e\nLEFT JOIN departments d ON e.department_id = d.id;\n\nSELECT e.first_name, d.name, p.title\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nJOIN projects p ON e.id = p.lead_id;',
          hints: ['COALESCE handles NULL from LEFT JOIN', 'Table aliases (e, d, p) shorten queries'],
          challenge: 'Write a query that shows each department with its employee count, average salary, and the name of the highest-paid employee. Include departments with no employees.',
          reqs: ['LEFT JOIN departments to employees', 'GROUP BY department', 'Subquery or window function for top earner', 'Include empty departments with 0 count'],
          tests: [['includes empty dept', 'count=0 shown', 5]]
        })
      ]
    }),

    T({
      title: 'SQL GROUP BY and Aggregate Functions', slug: 'sql-group-by-aggregates',
      description: 'Summarize data with COUNT, SUM, AVG, MIN, MAX and GROUP BY.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['sql', 'mysql', 'aggregation', 'database'],
      category: 'Database',
      objectives: ['Use aggregate functions', 'Group results with GROUP BY', 'Filter groups with HAVING'],
      steps: [
        S(1, {
          title: 'Aggregation and Grouping', content: 'Aggregate functions calculate values across rows. GROUP BY creates groups.',
          lang: 'sql', code: '-- Aggregate functions\nSELECT\n  COUNT(*) AS total_employees,\n  AVG(salary) AS avg_salary,\n  MIN(salary) AS min_salary,\n  MAX(salary) AS max_salary,\n  SUM(salary) AS total_payroll\nFROM employees;\n\n-- GROUP BY\nSELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;\n\n-- HAVING filters groups (WHERE filters rows)\nSELECT department, COUNT(*) AS headcount\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5\nORDER BY headcount DESC;',
          concept: 'COUNT counts rows. SUM/AVG/MIN/MAX operate on column values. GROUP BY creates groups for aggregation. HAVING filters groups after aggregation (WHERE filters before).',
          keyPoints: ['COUNT(*) counts all rows, COUNT(col) counts non-NULL', 'GROUP BY groups rows for aggregate calculation', 'HAVING filters groups (after aggregation)', 'WHERE filters rows (before aggregation)'],
          realWorld: 'Financial dashboards use GROUP BY with date functions to show monthly revenue, quarterly growth, and yearly totals.',
          mistakes: ['Selecting non-aggregated columns without GROUP BY', 'Using WHERE instead of HAVING for aggregate conditions', 'COUNT(col) vs COUNT(*) with NULL values'],
          pInstructions: ['Count employees per department', 'Calculate average salary per department', 'Filter to departments with average salary > 60000'],
          starter: '-- Count per department\n\n-- Average salary per department\n\n-- Only departments with avg salary > 60000',
          solution: 'SELECT department, COUNT(*) AS headcount FROM employees\nGROUP BY department;\n\nSELECT department, ROUND(AVG(salary), 2) AS avg_salary FROM employees\nGROUP BY department;\n\nSELECT department, ROUND(AVG(salary), 2) AS avg_salary FROM employees\nGROUP BY department\nHAVING AVG(salary) > 60000\nORDER BY avg_salary DESC;',
          hints: ['HAVING uses aggregate functions', 'ROUND(value, 2) rounds to 2 decimals'],
          challenge: 'Create a monthly sales report: total revenue, order count, average order value, and top product per month. Show only months with revenue > $10000.',
          reqs: ['GROUP BY year and month', 'Multiple aggregate functions', 'HAVING for revenue filter', 'Subquery for top product per month'],
          tests: [['monthly report', 'grouped by month', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Subqueries', slug: 'sql-subqueries',
      description: 'Use subqueries in SELECT, WHERE, and FROM clauses for complex queries.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['sql', 'mysql', 'subqueries', 'database'],
      category: 'Database',
      objectives: ['Write scalar subqueries', 'Use subqueries in WHERE with IN, EXISTS', 'Use derived tables in FROM'],
      steps: [
        S(1, {
          title: 'Subquery Patterns', content: 'A subquery is a query nested inside another query.',
          lang: 'sql', code: '-- Scalar subquery in WHERE\nSELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n\n-- IN subquery\nSELECT * FROM employees\nWHERE department_id IN (\n  SELECT id FROM departments WHERE budget > 100000\n);\n\n-- EXISTS subquery\nSELECT d.name FROM departments d\nWHERE EXISTS (\n  SELECT 1 FROM employees e\n  WHERE e.department_id = d.id AND e.salary > 80000\n);\n\n-- Derived table (subquery in FROM)\nSELECT dept, avg_sal FROM (\n  SELECT department AS dept, AVG(salary) AS avg_sal\n  FROM employees GROUP BY department\n) AS dept_avgs\nWHERE avg_sal > 60000;',
          concept: 'Scalar subqueries return a single value. IN subqueries return a list for matching. EXISTS checks if any rows exist. Derived tables create a temporary result set in FROM.',
          keyPoints: ['Scalar: returns single value', 'IN: matches against a list', 'EXISTS: checks for existence (often faster)', 'Derived table needs an alias'],
          realWorld: 'HR systems use subqueries to find employees earning above average, departments with budget overruns, or employees without project assignments.',
          mistakes: ['Subquery returning multiple rows where scalar expected', 'Correlated subquery performance (runs per row)', 'Forgetting alias for derived table'],
          pInstructions: ['Find employees earning above average', 'Find departments with at least one high earner', 'Use a derived table for department stats'],
          starter: '-- Employees above average salary\n\n-- Departments with someone earning > 80k\n\n-- Department averages above 60k using derived table',
          solution: 'SELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n\nSELECT name FROM departments WHERE id IN (\n  SELECT department_id FROM employees WHERE salary > 80000\n);\n\nSELECT * FROM (\n  SELECT department AS dept, AVG(salary) AS avg_sal\n  FROM employees GROUP BY department\n) AS stats WHERE avg_sal > 60000;',
          hints: ['EXISTS is often faster than IN for large datasets', 'Every derived table must have an alias'],
          challenge: 'Find the second highest salary in each department without using window functions (use subqueries only).',
          reqs: ['Correlated subquery approach', 'Handle departments with < 2 employees', 'Show department name, second highest salary', 'No window functions allowed'],
          tests: [['returns correct 2nd highest', 'verified per dept', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Window Functions', slug: 'sql-window-functions',
      description: 'Use ROW_NUMBER, RANK, DENSE_RANK, and other window functions for analytics.',
      language: 'sql', difficulty: 'advanced', duration: 50,
      tags: ['sql', 'mysql', 'window-functions', 'database'],
      category: 'Database',
      objectives: ['Use ROW_NUMBER, RANK, DENSE_RANK', 'Calculate running totals with SUM OVER', 'Partition windows by groups'],
      steps: [
        S(1, {
          title: 'Window Functions', content: 'Window functions perform calculations across related rows without collapsing them.',
          lang: 'sql', code: '-- ROW_NUMBER: unique sequential number\nSELECT\n  first_name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept\nFROM employees;\n\n-- Running total\nSELECT\n  order_date, amount,\n  SUM(amount) OVER (ORDER BY order_date) AS running_total\nFROM orders;\n\n-- RANK and DENSE_RANK\nSELECT\n  first_name, salary,\n  RANK() OVER (ORDER BY salary DESC) AS rank,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank\nFROM employees;\n\n-- LAG and LEAD\nSELECT\n  month, revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_month,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS growth\nFROM monthly_sales;',
          concept: 'Window functions compute values over a set of rows related to the current row. PARTITION BY creates groups. ORDER BY defines the window frame. Unlike GROUP BY, window functions keep all rows.',
          keyPoints: ['OVER() defines the window', 'PARTITION BY creates groups within the window', 'ROW_NUMBER gives unique sequential numbers', 'LAG/LEAD access previous/next row values'],
          realWorld: 'Financial analysts use window functions for running totals, month-over-month growth, and ranking top performers.',
          mistakes: ['Confusing RANK (gaps) vs DENSE_RANK (no gaps)', 'Forgetting ORDER BY in OVER clause', 'Not partitioning when needed'],
          pInstructions: ['Rank employees by salary within each department', 'Calculate running total of orders', 'Show month-over-month change with LAG'],
          starter: '-- Rank by salary per department\n\n-- Running total of order amounts\n\n-- Month-over-month revenue change',
          solution: 'SELECT first_name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees;\n\nSELECT order_date, amount,\n  SUM(amount) OVER (ORDER BY order_date) AS running_total\nFROM orders;\n\nSELECT month, revenue,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS mom_change\nFROM monthly_sales;',
          hints: ['PARTITION BY is like GROUP BY but keeps all rows', 'LAG(col, 1) gets the previous row value'],
          challenge: 'For each employee, show their salary, department average, company average, percentile rank, and whether they are above/below department average.',
          reqs: ['Department average with AVG OVER PARTITION', 'Company average with AVG OVER ()', 'PERCENT_RANK for percentile', 'CASE for above/below label'],
          tests: [['window functions', 'all columns calculated', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Indexes and Performance', slug: 'sql-indexes-performance',
      description: 'Optimize query performance with proper indexing strategies.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['sql', 'mysql', 'indexes', 'performance', 'database'],
      category: 'Database',
      objectives: ['Create single and composite indexes', 'Use EXPLAIN to analyze queries', 'Understand index types'],
      steps: [
        S(1, {
          title: 'Index Creation and Analysis', content: 'Indexes speed up SELECT queries at the cost of slower writes.',
          lang: 'sql', code: '-- Create single-column index\nCREATE INDEX idx_department ON employees(department);\n\n-- Create composite index\nCREATE INDEX idx_dept_salary ON employees(department, salary);\n\n-- Create unique index\nCREATE UNIQUE INDEX idx_email ON employees(email);\n\n-- Analyze query plan\nEXPLAIN SELECT * FROM employees WHERE department = \'Engineering\';\n\n-- Show indexes on a table\nSHOW INDEX FROM employees;\n\n-- Drop an index\nDROP INDEX idx_department ON employees;',
          concept: 'Indexes are B-tree structures that allow the database to find rows without scanning the entire table. Composite indexes support queries on the leftmost prefix of columns. EXPLAIN shows if the optimizer uses an index.',
          keyPoints: ['Indexes speed up reads, slow down writes', 'Composite index column order matters', 'EXPLAIN shows the query execution plan', 'Unique indexes enforce uniqueness'],
          realWorld: 'High-traffic web applications create indexes based on EXPLAIN analysis of their slowest queries identified in the slow query log.',
          mistakes: ['Too many indexes (slow inserts/updates)', 'Wrong column order in composite indexes', 'Indexing low-cardinality columns', 'Not using EXPLAIN to verify index usage'],
          pInstructions: ['Create an index on a frequently queried column', 'Use EXPLAIN to check if the index is used', 'Create a composite index for a common query pattern'],
          starter: '-- Create index on department\n-- EXPLAIN a query using department\n-- Create composite index for department + salary queries',
          solution: 'CREATE INDEX idx_dept ON employees(department);\nEXPLAIN SELECT * FROM employees WHERE department = \'Engineering\';\nCREATE INDEX idx_dept_sal ON employees(department, salary);',
          hints: ['EXPLAIN output shows "type: ref" when using index', 'Leftmost prefix rule: (a,b,c) supports queries on a, (a,b), and (a,b,c)'],
          challenge: 'Given a slow query, add appropriate indexes and demonstrate the performance improvement using EXPLAIN output.',
          reqs: ['Identify the slow query pattern', 'Create appropriate index', 'Show EXPLAIN before and after', 'Explain why the index helps'],
          tests: [['after indexing', 'type changes from ALL to ref', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Transactions and ACID', slug: 'sql-transactions',
      description: 'Ensure data integrity with transactions, commits, and rollbacks.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['sql', 'mysql', 'transactions', 'acid', 'database'],
      category: 'Database',
      objectives: ['Start and commit transactions', 'Roll back on errors', 'Understand isolation levels'],
      steps: [
        S(1, {
          title: 'Transaction Basics', content: 'Transactions group SQL statements into atomic units of work.',
          lang: 'sql', code: '-- Start a transaction\nSTART TRANSACTION;\n\n-- Transfer money between accounts\nUPDATE accounts SET balance = balance - 500\nWHERE account_id = 1;\n\nUPDATE accounts SET balance = balance + 500\nWHERE account_id = 2;\n\nINSERT INTO transfers (from_id, to_id, amount, transfer_date)\nVALUES (1, 2, 500, NOW());\n\n-- If everything succeeded\nCOMMIT;\n\n-- If something went wrong\n-- ROLLBACK;',
          concept: 'ACID: Atomic (all or nothing), Consistent (valid state), Isolated (transactions independent), Durable (committed data persists). START TRANSACTION begins, COMMIT saves, ROLLBACK undoes.',
          keyPoints: ['START TRANSACTION begins atomic block', 'COMMIT saves all changes', 'ROLLBACK undoes all changes', 'ACID guarantees data integrity'],
          realWorld: 'Banking systems wrap every transfer in a transaction — if the debit succeeds but the credit fails, the entire operation rolls back.',
          mistakes: ['Forgetting to COMMIT (locks held)', 'Long transactions blocking other users', 'Not handling ROLLBACK in application code'],
          pInstructions: ['Write a transaction for a money transfer', 'Include debit, credit, and log entry', 'Add a ROLLBACK scenario'],
          starter: '-- Transfer $200 from account 1 to account 2\nSTART TRANSACTION;\n-- Debit account 1\n-- Credit account 2\n-- Log the transfer\nCOMMIT;',
          solution: 'START TRANSACTION;\nUPDATE accounts SET balance = balance - 200 WHERE account_id = 1;\nUPDATE accounts SET balance = balance + 200 WHERE account_id = 2;\nINSERT INTO transfers (from_id, to_id, amount, transfer_date)\nVALUES (1, 2, 200, NOW());\nCOMMIT;',
          hints: ['Always pair START TRANSACTION with COMMIT or ROLLBACK', 'Check balance before debit to prevent negative'],
          challenge: 'Implement an order processing transaction: create order, deduct inventory for each item, charge the customer, and handle failures (insufficient stock, insufficient funds).',
          reqs: ['Check inventory before deducting', 'Check customer balance', 'ROLLBACK if any check fails', 'COMMIT only if all succeed'],
          tests: [['successful order', 'all updated', 5], ['insufficient stock', 'all rolled back', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Views', slug: 'sql-views',
      description: 'Create reusable virtual tables with SQL views.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['sql', 'mysql', 'views', 'database'],
      category: 'Database',
      objectives: ['Create and query views', 'Understand updatable views', 'Use views for security'],
      steps: [
        S(1, {
          title: 'Creating Views', content: 'A view is a saved query that acts like a virtual table.',
          lang: 'sql', code: '-- Create a view\nCREATE VIEW active_employees AS\nSELECT e.id, e.first_name, e.last_name, e.email, d.name AS department\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nWHERE e.is_active = TRUE;\n\n-- Query the view like a table\nSELECT * FROM active_employees WHERE department = \'Engineering\';\n\n-- Create a summary view\nCREATE VIEW department_stats AS\nSELECT\n  d.name AS department,\n  COUNT(e.id) AS headcount,\n  ROUND(AVG(e.salary), 2) AS avg_salary\nFROM departments d\nLEFT JOIN employees e ON d.id = e.department_id\nGROUP BY d.name;\n\n-- Drop a view\nDROP VIEW IF EXISTS active_employees;',
          concept: 'Views encapsulate complex queries behind a simple name. They do not store data — the underlying query runs each time. Views can restrict access to sensitive columns.',
          keyPoints: ['Views do not store data (computed on query)', 'Query views like regular tables', 'Views can simplify complex JOINs', 'Views can restrict column access for security'],
          realWorld: 'Companies create views that exclude salary data for non-HR users, enforcing column-level security.',
          mistakes: ['Expecting views to cache data', 'Complex views causing slow queries', 'Trying to UPDATE through non-updatable views'],
          pInstructions: ['Create a view joining employees and departments', 'Create a summary view with aggregates', 'Query both views'],
          starter: '-- Create employee detail view\n\n-- Create department summary view\n\n-- Query both',
          solution: 'CREATE VIEW emp_detail AS\nSELECT e.first_name, e.last_name, d.name AS dept, e.salary\nFROM employees e JOIN departments d ON e.department_id = d.id;\n\nCREATE VIEW dept_summary AS\nSELECT d.name, COUNT(e.id) AS size, ROUND(AVG(e.salary),2) AS avg_sal\nFROM departments d LEFT JOIN employees e ON d.id = e.department_id\nGROUP BY d.name;\n\nSELECT * FROM emp_detail WHERE dept = \'Engineering\';\nSELECT * FROM dept_summary ORDER BY size DESC;',
          hints: ['Use LEFT JOIN in summary to include empty departments', 'Views can be used in other views'],
          challenge: 'Create a data access layer using views: a public view (no salaries), an HR view (with salaries), and a dashboard view (aggregates only).',
          reqs: ['Public view excludes salary and email', 'HR view includes all fields', 'Dashboard view shows department aggregates', 'Show how each view restricts data'],
          tests: [['public view', 'no salary column', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Stored Procedures', slug: 'sql-stored-procedures',
      description: 'Write reusable server-side logic with stored procedures.',
      language: 'sql', difficulty: 'advanced', duration: 45,
      tags: ['sql', 'mysql', 'stored-procedures', 'database'],
      category: 'Database',
      objectives: ['Create stored procedures with parameters', 'Use variables and control flow', 'Handle errors in procedures'],
      steps: [
        S(1, {
          title: 'Stored Procedures', content: 'Stored procedures are reusable SQL programs stored in the database.',
          lang: 'sql', code: 'DELIMITER //\n\nCREATE PROCEDURE give_raise(\n  IN dept_name VARCHAR(100),\n  IN raise_pct DECIMAL(5,2),\n  OUT affected_count INT\n)\nBEGIN\n  UPDATE employees e\n  JOIN departments d ON e.department_id = d.id\n  SET e.salary = e.salary * (1 + raise_pct / 100)\n  WHERE d.name = dept_name;\n  \n  SET affected_count = ROW_COUNT();\n  \n  INSERT INTO salary_log (department, raise_percent, employees_affected, log_date)\n  VALUES (dept_name, raise_pct, affected_count, NOW());\nEND //\n\nDELIMITER ;\n\n-- Call the procedure\nCALL give_raise(\'Engineering\', 5.00, @count);\nSELECT @count AS employees_affected;',
          concept: 'Stored procedures encapsulate business logic in the database. They accept IN parameters (input), OUT parameters (output), and INOUT parameters (both). They reduce network roundtrips and centralize logic.',
          keyPoints: ['IN: input parameter', 'OUT: output parameter', 'DELIMITER changes statement terminator', 'CALL executes the procedure'],
          realWorld: 'ERP systems use stored procedures for complex operations like month-end closing, ensuring consistent business rules across applications.',
          mistakes: ['Forgetting DELIMITER change', 'Not using transactions in procedures', 'Hard-coding values instead of parameters'],
          pInstructions: ['Create a procedure to add a new employee', 'Include validation logic', 'Return the new employee ID'],
          starter: 'DELIMITER //\nCREATE PROCEDURE add_employee(\n  IN p_first_name VARCHAR(50),\n  IN p_last_name VARCHAR(50),\n  IN p_dept VARCHAR(100),\n  OUT p_id INT\n)\nBEGIN\n  -- Validate and insert\nEND //\nDELIMITER ;',
          solution: 'DELIMITER //\nCREATE PROCEDURE add_employee(\n  IN p_first VARCHAR(50), IN p_last VARCHAR(50),\n  IN p_dept VARCHAR(100), IN p_salary DECIMAL(10,2),\n  OUT p_id INT\n)\nBEGIN\n  DECLARE dept_id INT;\n  SELECT id INTO dept_id FROM departments WHERE name = p_dept;\n  IF dept_id IS NULL THEN\n    SIGNAL SQLSTATE \'45000\' SET MESSAGE_TEXT = \'Department not found\';\n  END IF;\n  INSERT INTO employees (first_name, last_name, department_id, salary)\n  VALUES (p_first, p_last, dept_id, p_salary);\n  SET p_id = LAST_INSERT_ID();\nEND //\nDELIMITER ;',
          hints: ['SIGNAL raises custom errors', 'LAST_INSERT_ID() gets the auto-increment value'],
          challenge: 'Create a stored procedure for order processing that validates inventory, calculates totals with tax, creates the order, updates stock, and returns order details.',
          reqs: ['Validate all items in stock', 'Calculate subtotal, tax, total', 'Insert order and order items', 'Update inventory', 'Transaction with rollback on error'],
          tests: [['valid order', 'returns order id', 5], ['invalid item', 'raises error', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Triggers', slug: 'sql-triggers',
      description: 'Automate actions with BEFORE and AFTER triggers on INSERT, UPDATE, DELETE.',
      language: 'sql', difficulty: 'advanced', duration: 40,
      tags: ['sql', 'mysql', 'triggers', 'automation', 'database'],
      category: 'Database',
      objectives: ['Create BEFORE and AFTER triggers', 'Access OLD and NEW values', 'Use triggers for auditing'],
      steps: [
        S(1, {
          title: 'Creating Triggers', content: 'Triggers automatically execute when INSERT, UPDATE, or DELETE occurs.',
          lang: 'sql', code: 'DELIMITER //\n\n-- Audit trigger\nCREATE TRIGGER employee_salary_audit\nAFTER UPDATE ON employees\nFOR EACH ROW\nBEGIN\n  IF OLD.salary != NEW.salary THEN\n    INSERT INTO salary_audit (employee_id, old_salary, new_salary, changed_at)\n    VALUES (NEW.id, OLD.salary, NEW.salary, NOW());\n  END IF;\nEND //\n\n-- Validation trigger\nCREATE TRIGGER validate_salary\nBEFORE INSERT ON employees\nFOR EACH ROW\nBEGIN\n  IF NEW.salary < 0 THEN\n    SIGNAL SQLSTATE \'45000\'\n    SET MESSAGE_TEXT = \'Salary cannot be negative\';\n  END IF;\nEND //\n\nDELIMITER ;',
          concept: 'BEFORE triggers run before the operation (can modify NEW or prevent it). AFTER triggers run after (good for logging). OLD has pre-change values, NEW has post-change values.',
          keyPoints: ['BEFORE: can modify NEW values', 'AFTER: good for auditing', 'OLD: values before change', 'NEW: values after change'],
          realWorld: 'Audit trails in financial systems use AFTER triggers to log every change to account balances with timestamps.',
          mistakes: ['Triggers on triggers (cascading issues)', 'Heavy logic in triggers (slow writes)', 'Forgetting triggers exist (confusing side effects)'],
          pInstructions: ['Create an audit trigger for salary changes', 'Create a validation trigger for new employees', 'Test both triggers'],
          starter: 'DELIMITER //\n-- Create audit trigger for employee updates\n-- Create validation trigger for inserts\nDELIMITER ;',
          solution: 'DELIMITER //\nCREATE TRIGGER emp_audit AFTER UPDATE ON employees\nFOR EACH ROW\nBEGIN\n  IF OLD.salary != NEW.salary THEN\n    INSERT INTO audit_log (emp_id, field, old_val, new_val, ts)\n    VALUES (NEW.id, \'salary\', OLD.salary, NEW.salary, NOW());\n  END IF;\nEND //\n\nCREATE TRIGGER emp_validate BEFORE INSERT ON employees\nFOR EACH ROW\nBEGIN\n  IF NEW.salary < 30000 THEN\n    SET NEW.salary = 30000;\n  END IF;\nEND //\nDELIMITER ;',
          hints: ['BEFORE triggers can modify NEW values', 'SIGNAL raises an error to prevent the operation'],
          challenge: 'Create a complete audit system: log all changes (insert, update, delete) to any tracked table, recording who changed what, when, and the old/new values.',
          reqs: ['Triggers for INSERT, UPDATE, DELETE', 'Store operation type', 'Store old and new values as JSON', 'Include timestamp and user'],
          tests: [['update triggers audit', 'log entry created', 5]]
        })
      ]
    }),

    T({
      title: 'SQL String Functions', slug: 'sql-string-functions',
      description: 'Manipulate text data with CONCAT, SUBSTRING, TRIM, REPLACE, and more.',
      language: 'sql', difficulty: 'beginner', duration: 30,
      tags: ['sql', 'mysql', 'string-functions', 'database'],
      category: 'Database',
      objectives: ['Use common string functions', 'Format and clean text data', 'Pattern matching with REGEXP'],
      steps: [
        S(1, {
          title: 'String Manipulation', content: 'SQL provides functions to manipulate and format text data.',
          lang: 'sql', code: '-- Concatenation\nSELECT CONCAT(first_name, \' \', last_name) AS full_name FROM employees;\n\n-- Case conversion\nSELECT UPPER(first_name), LOWER(email) FROM employees;\n\n-- Substring and length\nSELECT SUBSTRING(phone, 1, 3) AS area_code, LENGTH(email) FROM employees;\n\n-- Trim and replace\nSELECT TRIM(name), REPLACE(phone, \'-\', \'\') FROM contacts;\n\n-- Pattern matching with REGEXP\nSELECT * FROM employees WHERE email REGEXP \'^[a-z]+@company\\.com$\';',
          concept: 'CONCAT joins strings. UPPER/LOWER change case. SUBSTRING extracts parts. TRIM removes whitespace. REPLACE substitutes text. REGEXP provides regex matching.',
          keyPoints: ['CONCAT combines strings', 'SUBSTRING(str, start, length)', 'TRIM removes leading/trailing whitespace', 'REGEXP for complex pattern matching'],
          realWorld: 'Data cleaning pipelines use string functions to normalize names, format phone numbers, and validate email addresses.',
          mistakes: ['SUBSTRING index starts at 1 (not 0)', 'CONCAT with NULL returns NULL', 'Forgetting to escape special REGEXP characters'],
          pInstructions: ['Create full names with CONCAT', 'Extract area codes from phone numbers', 'Find employees with gmail addresses'],
          starter: '-- Full name\nSELECT /* CONCAT first and last */ FROM employees;\n\n-- Area code\nSELECT /* SUBSTRING of phone */ FROM employees;\n\n-- Gmail users\nSELECT * FROM employees WHERE email /* LIKE or REGEXP */;',
          solution: 'SELECT CONCAT(first_name, \' \', last_name) AS full_name FROM employees;\nSELECT SUBSTRING(phone, 1, 3) AS area_code FROM employees;\nSELECT * FROM employees WHERE email LIKE \'%@gmail.com\';',
          hints: ['CONCAT_WS(\' \', a, b) adds separator automatically', 'LIKE is simpler than REGEXP for basic patterns'],
          challenge: 'Clean a messy contacts table: normalize names (capitalize first letter), format phone numbers (XXX-XXX-XXXX), and validate email format.',
          reqs: ['CONCAT + UPPER + LOWER for name normalization', 'INSERT function for phone formatting', 'REGEXP to validate email', 'UPDATE with string functions'],
          tests: [['clean names', 'properly capitalized', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Date and Time Functions', slug: 'sql-date-functions',
      description: 'Work with dates using DATE functions, formatting, and date arithmetic.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['sql', 'mysql', 'date-functions', 'database'],
      category: 'Database',
      objectives: ['Extract date parts with YEAR, MONTH, DAY', 'Calculate date differences', 'Format dates for display'],
      steps: [
        S(1, {
          title: 'Date Functions', content: 'SQL provides functions for extracting, formatting, and calculating dates.',
          lang: 'sql', code: '-- Current date and time\nSELECT NOW(), CURDATE(), CURTIME();\n\n-- Extract date parts\nSELECT\n  YEAR(hire_date) AS year,\n  MONTH(hire_date) AS month,\n  DAY(hire_date) AS day,\n  DAYNAME(hire_date) AS day_name\nFROM employees;\n\n-- Date arithmetic\nSELECT\n  first_name,\n  hire_date,\n  DATEDIFF(CURDATE(), hire_date) AS days_employed,\n  DATE_ADD(hire_date, INTERVAL 1 YEAR) AS anniversary\nFROM employees;\n\n-- Date formatting\nSELECT DATE_FORMAT(hire_date, \'%M %d, %Y\') AS formatted\nFROM employees;',
          concept: 'NOW() returns current datetime. YEAR/MONTH/DAY extract parts. DATEDIFF calculates days between dates. DATE_ADD/DATE_SUB perform date arithmetic. DATE_FORMAT controls display.',
          keyPoints: ['NOW() = current datetime', 'DATEDIFF(end, start) = days between', 'DATE_ADD(date, INTERVAL n unit)', 'DATE_FORMAT with %Y, %m, %d, %M patterns'],
          realWorld: 'Subscription services use date functions to calculate trial periods, renewal dates, and send expiration reminders.',
          mistakes: ['DATEDIFF order: (later, earlier) for positive result', 'Mixing DATE and DATETIME comparisons', 'Time zone issues with NOW()'],
          pInstructions: ['Find employees hired this year', 'Calculate years of employment', 'Find employees with anniversaries this month'],
          starter: '-- Hired this year\n\n-- Years of employment\n\n-- Anniversary this month',
          solution: 'SELECT * FROM employees WHERE YEAR(hire_date) = YEAR(CURDATE());\n\nSELECT first_name, TIMESTAMPDIFF(YEAR, hire_date, CURDATE()) AS years\nFROM employees;\n\nSELECT first_name, hire_date FROM employees\nWHERE MONTH(hire_date) = MONTH(CURDATE());',
          hints: ['TIMESTAMPDIFF(YEAR, start, end) for precise year diff', 'MONTH() returns 1-12'],
          challenge: 'Create a report showing: employees hired per quarter, average tenure by department, upcoming 5-year anniversaries, and employees who joined on a weekend.',
          reqs: ['QUARTER function for quarterly grouping', 'TIMESTAMPDIFF for tenure', 'DATE_ADD for anniversary calculation', 'DAYOFWEEK for weekend detection'],
          tests: [['quarterly hire count', 'grouped by quarter', 5]]
        })
      ]
    }),

    T({
      title: 'SQL CASE Expressions', slug: 'sql-case-expressions',
      description: 'Add conditional logic to queries with CASE WHEN expressions.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['sql', 'mysql', 'case', 'conditional', 'database'],
      category: 'Database',
      objectives: ['Write simple and searched CASE', 'Use CASE in SELECT, WHERE, ORDER BY', 'Combine CASE with aggregations'],
      steps: [
        S(1, {
          title: 'CASE Expressions', content: 'CASE adds if-then-else logic to SQL queries.',
          lang: 'sql', code: '-- Simple CASE\nSELECT first_name, salary,\n  CASE\n    WHEN salary >= 90000 THEN \'Senior\'\n    WHEN salary >= 60000 THEN \'Mid\'\n    ELSE \'Junior\'\n  END AS level\nFROM employees;\n\n-- CASE in aggregation\nSELECT department,\n  COUNT(CASE WHEN salary > 80000 THEN 1 END) AS high_earners,\n  COUNT(CASE WHEN salary <= 80000 THEN 1 END) AS others\nFROM employees GROUP BY department;\n\n-- CASE in ORDER BY\nSELECT * FROM tasks ORDER BY\n  CASE priority\n    WHEN \'urgent\' THEN 1\n    WHEN \'high\' THEN 2\n    WHEN \'medium\' THEN 3\n    ELSE 4\n  END;',
          concept: 'CASE evaluates conditions in order and returns the first match. It can be used in SELECT (computed columns), WHERE (conditional filtering), ORDER BY (custom sorting), and with aggregates (conditional counting).',
          keyPoints: ['CASE WHEN condition THEN result END', 'First matching WHEN is returned', 'ELSE handles no-match (NULL if omitted)', 'Works in SELECT, WHERE, ORDER BY, GROUP BY'],
          realWorld: 'Reports use CASE to categorize data: salary bands, age groups, customer segments, risk levels.',
          mistakes: ['Forgetting END keyword', 'Overlapping conditions (order matters)', 'NULL handling (use COALESCE)'],
          pInstructions: ['Create salary level labels with CASE', 'Count employees per level per department', 'Sort by custom priority'],
          starter: '-- Label salary levels\n\n-- Count per level per department\n\n-- Custom sort',
          solution: 'SELECT first_name, CASE WHEN salary >= 90000 THEN \'Senior\' WHEN salary >= 60000 THEN \'Mid\' ELSE \'Junior\' END AS level FROM employees;\n\nSELECT department,\n  SUM(CASE WHEN salary >= 90000 THEN 1 ELSE 0 END) AS senior_count,\n  SUM(CASE WHEN salary < 90000 THEN 1 ELSE 0 END) AS other_count\nFROM employees GROUP BY department;\n\nSELECT * FROM tasks ORDER BY CASE priority WHEN \'urgent\' THEN 1 WHEN \'high\' THEN 2 ELSE 3 END;',
          hints: ['SUM(CASE WHEN ... THEN 1 ELSE 0 END) counts conditionally', 'CASE conditions are checked in order'],
          challenge: 'Create a comprehensive employee report with: salary band, performance rating label, tenure category, and a composite score that combines all three.',
          reqs: ['Salary band: 4 levels', 'Performance label from numeric score', 'Tenure: new/experienced/veteran', 'Composite score calculation'],
          tests: [['all labels present', 'correct categorization', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Common Table Expressions (CTEs)', slug: 'sql-ctes',
      description: 'Write cleaner queries with WITH clauses and recursive CTEs.',
      language: 'sql', difficulty: 'advanced', duration: 40,
      tags: ['sql', 'mysql', 'cte', 'recursive', 'database'],
      category: 'Database',
      objectives: ['Write CTEs with WITH clause', 'Chain multiple CTEs', 'Use recursive CTEs for hierarchies'],
      steps: [
        S(1, {
          title: 'CTEs and Recursive Queries', content: 'CTEs create named temporary result sets that make complex queries readable.',
          lang: 'sql', code: '-- Simple CTE\nWITH dept_stats AS (\n  SELECT department_id, AVG(salary) AS avg_sal, COUNT(*) AS cnt\n  FROM employees GROUP BY department_id\n)\nSELECT d.name, ds.avg_sal, ds.cnt\nFROM dept_stats ds\nJOIN departments d ON ds.department_id = d.id\nWHERE ds.avg_sal > 60000;\n\n-- Multiple CTEs\nWITH high_earners AS (\n  SELECT * FROM employees WHERE salary > 80000\n),\nsmall_depts AS (\n  SELECT department_id FROM employees\n  GROUP BY department_id HAVING COUNT(*) < 10\n)\nSELECT h.* FROM high_earners h\nWHERE h.department_id IN (SELECT department_id FROM small_depts);\n\n-- Recursive CTE (org chart)\nWITH RECURSIVE org_chart AS (\n  SELECT id, name, manager_id, 0 AS level\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, oc.level + 1\n  FROM employees e\n  JOIN org_chart oc ON e.manager_id = oc.id\n)\nSELECT REPEAT(\'  \', level) || name AS org FROM org_chart;',
          concept: 'CTEs (WITH clause) create named temporary result sets. They improve readability over subqueries. Recursive CTEs self-reference to traverse hierarchies (trees, org charts, bill of materials).',
          keyPoints: ['WITH name AS (query) creates a CTE', 'Multiple CTEs separated by commas', 'Recursive CTEs have anchor + recursive member', 'UNION ALL connects anchor and recursive parts'],
          realWorld: 'Organization charts, category trees, and bill-of-materials queries all use recursive CTEs to traverse parent-child hierarchies.',
          mistakes: ['Forgetting UNION ALL in recursive CTE', 'No termination condition (infinite loop)', 'Using CTE where a simple subquery suffices'],
          pInstructions: ['Write a CTE for department statistics', 'Chain two CTEs together', 'Write a recursive CTE for org hierarchy'],
          starter: '-- CTE for dept stats\nWITH dept_stats AS (\n  -- your query\n)\nSELECT * FROM dept_stats;\n\n-- Recursive org chart\nWITH RECURSIVE org AS (\n  -- anchor\n  -- UNION ALL\n  -- recursive member\n)\nSELECT * FROM org;',
          solution: 'WITH dept_stats AS (\n  SELECT department_id, ROUND(AVG(salary),2) AS avg_sal\n  FROM employees GROUP BY department_id\n)\nSELECT d.name, ds.avg_sal FROM dept_stats ds\nJOIN departments d ON ds.department_id = d.id;\n\nWITH RECURSIVE org AS (\n  SELECT id, name, 0 AS lvl FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, o.lvl + 1 FROM employees e JOIN org o ON e.manager_id = o.id\n)\nSELECT * FROM org ORDER BY lvl;',
          hints: ['Anchor member: the root rows (no parent)', 'Recursive member joins back to the CTE'],
          challenge: 'Using recursive CTE, find all employees under a specific manager (any depth), their total team size, and the longest management chain in the company.',
          reqs: ['Recursive CTE for team members', 'Count team size at each level', 'Find max depth of hierarchy', 'Show manager chain for any employee'],
          tests: [['team under CEO', 'all employees', 5], ['max depth', 'correct level', 5]]
        })
      ]
    }),

    T({
      title: 'SQL ALTER TABLE and Migrations', slug: 'sql-alter-table',
      description: 'Modify table structure with ALTER TABLE: add, drop, modify columns.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['sql', 'mysql', 'alter-table', 'migrations', 'database'],
      category: 'Database',
      objectives: ['Add and drop columns', 'Modify column types and constraints', 'Plan safe migrations'],
      steps: [
        S(1, {
          title: 'Modifying Tables', content: 'ALTER TABLE changes the structure of an existing table.',
          lang: 'sql', code: '-- Add a column\nALTER TABLE employees ADD COLUMN phone VARCHAR(20);\n\n-- Add column with default\nALTER TABLE employees ADD COLUMN status VARCHAR(20) DEFAULT \'active\';\n\n-- Modify column type\nALTER TABLE employees MODIFY COLUMN phone VARCHAR(30);\n\n-- Rename column\nALTER TABLE employees RENAME COLUMN phone TO phone_number;\n\n-- Drop column\nALTER TABLE employees DROP COLUMN phone_number;\n\n-- Add index\nALTER TABLE employees ADD INDEX idx_status (status);\n\n-- Add foreign key\nALTER TABLE orders ADD CONSTRAINT fk_customer\n  FOREIGN KEY (customer_id) REFERENCES customers(id);',
          concept: 'ALTER TABLE modifies structure without recreating. ADD adds columns/indexes. MODIFY changes types. DROP removes columns. Large table alterations can lock the table.',
          keyPoints: ['ADD COLUMN appends a new column', 'MODIFY COLUMN changes type/constraints', 'DROP COLUMN removes permanently', 'Large ALTERs may lock the table'],
          realWorld: 'Database migrations in deployment pipelines use ALTER TABLE to evolve the schema as the application changes over time.',
          mistakes: ['Dropping a column that is referenced', 'ALTER on huge tables without planning (locks)', 'Not providing defaults for NOT NULL additions'],
          pInstructions: ['Add a new column to employees', 'Change its data type', 'Add an index on the new column'],
          starter: '-- Add a middle_name column\n\n-- Change it to allow longer strings\n\n-- Add an index',
          solution: 'ALTER TABLE employees ADD COLUMN middle_name VARCHAR(30);\nALTER TABLE employees MODIFY COLUMN middle_name VARCHAR(50);\nALTER TABLE employees ADD INDEX idx_middle (middle_name);',
          hints: ['New columns are added at the end by default', 'Use AFTER column_name to place it'],
          challenge: 'Plan and execute a migration that splits a full_name column into first_name and last_name: add new columns, populate them, verify, then drop the old column.',
          reqs: ['Add first_name and last_name columns', 'UPDATE to split full_name', 'Verify data integrity', 'Drop full_name column'],
          tests: [['after migration', 'no data loss', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Constraints and Normalization', slug: 'sql-constraints-normalization',
      description: 'Enforce data integrity with constraints and normalize your database design.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['sql', 'mysql', 'normalization', 'constraints', 'database'],
      category: 'Database',
      objectives: ['Understand 1NF, 2NF, 3NF', 'Apply CHECK, UNIQUE, FOREIGN KEY constraints', 'Design normalized schemas'],
      steps: [
        S(1, {
          title: 'Constraints and Normal Forms', content: 'Constraints enforce data rules. Normalization reduces redundancy.',
          lang: 'sql', code: '-- CHECK constraint\nCREATE TABLE products (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  price DECIMAL(10,2) CHECK (price > 0),\n  stock INT CHECK (stock >= 0),\n  category VARCHAR(50) NOT NULL\n);\n\n-- UNIQUE constraint\nALTER TABLE users ADD CONSTRAINT uq_email UNIQUE (email);\n\n-- Composite unique constraint\nALTER TABLE enrollments ADD CONSTRAINT uq_enrollment\n  UNIQUE (student_id, course_id);\n\n-- Named foreign key with actions\nALTER TABLE orders ADD CONSTRAINT fk_orders_customer\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n  ON DELETE SET NULL\n  ON UPDATE CASCADE;',
          concept: 'Constraints: NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY. Normal forms: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). Normalization reduces redundancy.',
          keyPoints: ['CHECK enforces value rules', 'UNIQUE prevents duplicates', 'ON DELETE CASCADE/SET NULL', 'Normalization: 1NF -> 2NF -> 3NF'],
          realWorld: 'Healthcare databases use strict constraints to ensure patient IDs are unique, ages are positive, and referential integrity is maintained across all related records.',
          mistakes: ['Over-normalization (too many joins)', 'Missing foreign key constraints', 'CHECK constraints not supported in older MySQL'],
          pInstructions: ['Create a table with CHECK constraints', 'Add a composite UNIQUE constraint', 'Design a normalized 3NF schema'],
          starter: '-- Create table with CHECK constraints\n-- Add composite UNIQUE\n-- Design normalized schema',
          solution: 'CREATE TABLE orders (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  customer_id INT NOT NULL,\n  total DECIMAL(10,2) CHECK (total >= 0),\n  status ENUM(\'pending\',\'shipped\',\'delivered\') DEFAULT \'pending\',\n  FOREIGN KEY (customer_id) REFERENCES customers(id)\n);\n\nCREATE TABLE order_items (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  order_id INT NOT NULL,\n  product_id INT NOT NULL,\n  quantity INT CHECK (quantity > 0),\n  UNIQUE (order_id, product_id),\n  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,\n  FOREIGN KEY (product_id) REFERENCES products(id)\n);',
          hints: ['ON DELETE CASCADE removes child rows when parent is deleted', 'Composite UNIQUE prevents duplicate combinations'],
          challenge: 'Take a denormalized spreadsheet-style table and normalize it to 3NF. Show the original, identify violations, and create the normalized schema.',
          reqs: ['Identify 1NF violations', 'Identify 2NF violations', 'Identify 3NF violations', 'Create normalized tables with constraints'],
          tests: [['3NF schema', 'no redundancy', 5]]
        })
      ]
    }),

    T({
      title: 'SQL User Management and Permissions', slug: 'sql-user-management',
      description: 'Create users, grant permissions, and manage database access control.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['sql', 'mysql', 'security', 'permissions', 'database'],
      category: 'Database',
      objectives: ['Create and manage database users', 'Grant and revoke privileges', 'Understand permission hierarchy'],
      steps: [
        S(1, {
          title: 'Users and Privileges', content: 'MySQL uses GRANT and REVOKE to control user access.',
          lang: 'sql', code: '-- Create a user\nCREATE USER \'appuser\'@\'localhost\' IDENTIFIED BY \'securePass123\';\n\n-- Grant specific privileges\nGRANT SELECT, INSERT, UPDATE ON mydb.* TO \'appuser\'@\'localhost\';\n\n-- Grant all on specific table\nGRANT ALL PRIVILEGES ON mydb.products TO \'appuser\'@\'localhost\';\n\n-- Revoke a privilege\nREVOKE DELETE ON mydb.* FROM \'appuser\'@\'localhost\';\n\n-- Show grants\nSHOW GRANTS FOR \'appuser\'@\'localhost\';\n\n-- Create read-only user\nCREATE USER \'reader\'@\'%\' IDENTIFIED BY \'readPass456\';\nGRANT SELECT ON mydb.* TO \'reader\'@\'%\';\n\n-- Apply changes\nFLUSH PRIVILEGES;',
          concept: 'MySQL authentication uses user@host pairs. GRANT assigns permissions. REVOKE removes them. Privileges can be global, database-level, table-level, or column-level.',
          keyPoints: ['user@host defines access source', 'GRANT privilege ON scope TO user', 'REVOKE removes privileges', 'FLUSH PRIVILEGES applies changes'],
          realWorld: 'Production databases have separate users: app user (read/write), analytics user (read-only), admin (full access), with permissions matching their role.',
          mistakes: ['Using root user in application code', 'Granting ALL PRIVILEGES unnecessarily', 'Forgetting to FLUSH PRIVILEGES'],
          pInstructions: ['Create an application user with limited access', 'Create a read-only user for reporting', 'Show and verify grants'],
          starter: '-- Create app user with SELECT, INSERT, UPDATE\n-- Create read-only user\n-- Show grants for both',
          solution: 'CREATE USER \'app\'@\'localhost\' IDENTIFIED BY \'pass123\';\nGRANT SELECT, INSERT, UPDATE ON shop.* TO \'app\'@\'localhost\';\n\nCREATE USER \'report\'@\'%\' IDENTIFIED BY \'pass456\';\nGRANT SELECT ON shop.* TO \'report\'@\'%\';\n\nSHOW GRANTS FOR \'app\'@\'localhost\';\nSHOW GRANTS FOR \'report\'@\'%\';\nFLUSH PRIVILEGES;',
          hints: ['% means any host', 'localhost restricts to local connections only'],
          challenge: 'Set up a complete access control system: admin, developer, application, and read-only users. Test that each can only perform their allowed operations.',
          reqs: ['4 users with different privilege levels', 'Test allowed operations succeed', 'Test denied operations fail', 'Document the permission matrix'],
          tests: [['reader DELETE', 'denied', 5], ['app INSERT', 'allowed', 5]]
        })
      ]
    }),

    T({
      title: 'SQL UNION and Set Operations', slug: 'sql-union-set-operations',
      description: 'Combine query results with UNION, INTERSECT, and EXCEPT.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['sql', 'mysql', 'union', 'set-operations', 'database'],
      category: 'Database',
      objectives: ['Combine results with UNION and UNION ALL', 'Understand INTERSECT and EXCEPT', 'Use set operations for reporting'],
      steps: [
        S(1, {
          title: 'Set Operations', content: 'UNION combines results from multiple SELECT queries.',
          lang: 'sql', code: '-- UNION removes duplicates\nSELECT first_name, \'employee\' AS source FROM employees\nUNION\nSELECT name, \'contractor\' FROM contractors;\n\n-- UNION ALL keeps duplicates (faster)\nSELECT product_name FROM store_a\nUNION ALL\nSELECT product_name FROM store_b;\n\n-- Combine different date ranges\nSELECT \'Q1\' AS quarter, SUM(amount) AS total FROM orders WHERE order_date BETWEEN \'2024-01-01\' AND \'2024-03-31\'\nUNION ALL\nSELECT \'Q2\', SUM(amount) FROM orders WHERE order_date BETWEEN \'2024-04-01\' AND \'2024-06-30\'\nUNION ALL\nSELECT \'Q3\', SUM(amount) FROM orders WHERE order_date BETWEEN \'2024-07-01\' AND \'2024-09-30\'\nUNION ALL\nSELECT \'Q4\', SUM(amount) FROM orders WHERE order_date BETWEEN \'2024-10-01\' AND \'2024-12-31\';',
          concept: 'UNION combines result sets vertically. UNION removes duplicates. UNION ALL keeps duplicates and is faster. Both require matching column count and compatible types.',
          keyPoints: ['UNION removes duplicates', 'UNION ALL keeps all rows (faster)', 'Column count and types must match', 'Column names come from first SELECT'],
          realWorld: 'Multi-region databases use UNION to combine results from regional tables into a global report.',
          mistakes: ['Different column counts in UNION queries', 'Using UNION when UNION ALL is intended (losing data)', 'Ordering individual SELECTs instead of final result'],
          pInstructions: ['UNION employees and contractors', 'Create quarterly report with UNION ALL', 'Find names in both tables'],
          starter: '-- Combine employees and contractors\n\n-- Quarterly revenue report',
          solution: 'SELECT first_name AS name, \'employee\' AS type FROM employees\nUNION ALL\nSELECT name, \'contractor\' FROM contractors\nORDER BY name;\n\nSELECT \'Q1\' AS q, SUM(amount) AS total FROM orders WHERE QUARTER(order_date) = 1\nUNION ALL\nSELECT \'Q2\', SUM(amount) FROM orders WHERE QUARTER(order_date) = 2;',
          hints: ['ORDER BY applies to the entire UNION result', 'UNION ALL is preferred when you know there are no duplicates'],
          challenge: 'Create a comprehensive people directory that combines employees, contractors, and clients with their contact info, type, and status. Handle different column structures.',
          reqs: ['UNION from 3 different tables', 'Normalize columns across tables', 'Add type label for each source', 'Sort by name across all sources'],
          tests: [['combined results', 'all sources present', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Temporary Tables and Variables', slug: 'sql-temp-tables',
      description: 'Use temporary tables and user variables for complex multi-step queries.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['sql', 'mysql', 'temp-tables', 'variables', 'database'],
      category: 'Database',
      objectives: ['Create and use temporary tables', 'Set and use user variables', 'Break complex queries into steps'],
      steps: [
        S(1, {
          title: 'Temporary Tables and Variables', content: 'Temporary tables exist for the session. Variables store intermediate values.',
          lang: 'sql', code: '-- Create temporary table\nCREATE TEMPORARY TABLE top_earners AS\nSELECT first_name, last_name, salary, department\nFROM employees\nWHERE salary > 80000;\n\n-- Use it like a regular table\nSELECT department, COUNT(*) AS count, AVG(salary) AS avg_sal\nFROM top_earners\nGROUP BY department;\n\n-- User variables\nSET @avg_salary = (SELECT AVG(salary) FROM employees);\nSELECT first_name, salary,\n  salary - @avg_salary AS diff_from_avg\nFROM employees\nWHERE salary > @avg_salary;\n\n-- Variables in queries\nSELECT @row_num := @row_num + 1 AS row_num, first_name\nFROM employees, (SELECT @row_num := 0) AS init\nORDER BY salary DESC;',
          concept: 'TEMPORARY tables are session-scoped (auto-dropped). User variables (@var) persist within the session. Both help break complex operations into manageable steps.',
          keyPoints: ['TEMPORARY tables auto-drop at session end', 'User variables persist in session', 'SET @var = value assigns', 'Temp tables can be indexed'],
          realWorld: 'ETL processes create temporary tables for staging data, transforming it, then loading into final tables.',
          mistakes: ['Referencing temp table in another session', 'User variable scope (session only)', 'Temp tables disappear on disconnect'],
          pInstructions: ['Create a temp table with filtered data', 'Use variables for computed thresholds', 'Query the temp table with the variable'],
          starter: '-- Create temp table for active employees\n-- Set variable for average salary\n-- Query temp table comparing to variable',
          solution: 'CREATE TEMPORARY TABLE active_emps AS\nSELECT * FROM employees WHERE is_active = TRUE;\n\nSET @avg = (SELECT AVG(salary) FROM active_emps);\n\nSELECT first_name, salary, salary - @avg AS above_avg\nFROM active_emps WHERE salary > @avg\nORDER BY salary DESC;',
          hints: ['CREATE TEMPORARY TABLE ... AS SELECT copies data', '@variable values persist for the session'],
          challenge: 'Build a multi-step analysis: create temp tables for each department, calculate cross-department metrics, and produce a final comparison report.',
          reqs: ['Multiple temp tables', 'Variables for thresholds', 'JOIN temp tables for final report', 'Clean up temp tables'],
          tests: [['final report', 'all departments compared', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Data Import and Export', slug: 'sql-data-import-export',
      description: 'Load data from CSV files and export query results.',
      language: 'sql', difficulty: 'beginner', duration: 30,
      tags: ['sql', 'mysql', 'import', 'export', 'database'],
      category: 'Database',
      objectives: ['Import data from CSV', 'Export query results to file', 'Handle data loading errors'],
      steps: [
        S(1, {
          title: 'Loading and Exporting Data', content: 'MySQL provides LOAD DATA and SELECT INTO OUTFILE for bulk data operations.',
          lang: 'sql', code: '-- Import from CSV\nLOAD DATA INFILE \'/path/to/employees.csv\'\nINTO TABLE employees\nFIELDS TERMINATED BY \',\'\nENCLOSED BY \'"\'\nLINES TERMINATED BY \'\\n\'\nIGNORE 1 LINES\n(first_name, last_name, email, department, salary);\n\n-- Export to CSV\nSELECT first_name, last_name, email, salary\nINTO OUTFILE \'/tmp/export.csv\'\nFIELDS TERMINATED BY \',\'\nENCLOSED BY \'"\'\nLINES TERMINATED BY \'\\n\'\nFROM employees\nWHERE department = \'Engineering\';\n\n-- INSERT ... SELECT (copy between tables)\nINSERT INTO archived_employees\nSELECT * FROM employees WHERE is_active = FALSE;',
          concept: 'LOAD DATA INFILE imports CSV/TSV files in bulk (much faster than INSERT). SELECT INTO OUTFILE exports results to files. INSERT SELECT copies data between tables.',
          keyPoints: ['LOAD DATA is fastest for bulk import', 'IGNORE 1 LINES skips header row', 'INTO OUTFILE exports to server filesystem', 'INSERT SELECT copies between tables'],
          realWorld: 'Data warehouses load daily sales data from CSV files generated by point-of-sale systems.',
          mistakes: ['File permissions (MySQL needs read access)', 'Character encoding mismatches', 'Not handling NULL values in CSV'],
          pInstructions: ['Write a LOAD DATA command for a CSV', 'Export Engineering employees to CSV', 'Copy inactive employees to archive'],
          starter: '-- Import CSV\n-- Export to CSV\n-- Archive inactive employees',
          solution: 'LOAD DATA INFILE \'/tmp/data.csv\' INTO TABLE products\nFIELDS TERMINATED BY \',\' ENCLOSED BY \'"\'\nLINES TERMINATED BY \'\\n\' IGNORE 1 LINES;\n\nSELECT * INTO OUTFILE \'/tmp/engineering.csv\'\nFIELDS TERMINATED BY \',\' ENCLOSED BY \'"\'\nFROM employees WHERE department = \'Engineering\';\n\nINSERT INTO archived SELECT * FROM employees WHERE is_active = FALSE;',
          hints: ['IGNORE 1 LINES skips the header row', 'Check file permissions and secure_file_priv setting'],
          challenge: 'Build a complete data pipeline: import from CSV, validate with queries, transform with UPDATE, export cleaned data, and generate a summary report.',
          reqs: ['Import raw data from CSV', 'Validate: find invalid rows', 'Clean: fix common issues', 'Export: write clean data'],
          tests: [['import complete', 'all rows loaded', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Query Optimization', slug: 'sql-query-optimization',
      description: 'Write efficient SQL queries and understand the query optimizer.',
      language: 'sql', difficulty: 'advanced', duration: 45,
      tags: ['sql', 'mysql', 'optimization', 'performance', 'database'],
      category: 'Database',
      objectives: ['Read EXPLAIN output', 'Identify and fix slow queries', 'Write optimizer-friendly SQL'],
      steps: [
        S(1, {
          title: 'Query Optimization Techniques', content: 'Understanding how MySQL executes queries helps you write faster SQL.',
          lang: 'sql', code: '-- EXPLAIN to see query plan\nEXPLAIN SELECT e.*, d.name\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nWHERE e.salary > 50000;\n\n-- Avoid SELECT *\n-- Bad:\nSELECT * FROM employees WHERE department = \'Eng\';\n-- Good:\nSELECT id, first_name, salary FROM employees WHERE department = \'Eng\';\n\n-- Covering index (all columns in index)\nCREATE INDEX idx_covering ON employees(department, salary, first_name);\n-- This query uses only the index, no table access:\nSELECT first_name, salary FROM employees WHERE department = \'Eng\';\n\n-- Avoid functions on indexed columns\n-- Bad (can\'t use index):\nSELECT * FROM orders WHERE YEAR(order_date) = 2024;\n-- Good (uses index):\nSELECT * FROM orders WHERE order_date >= \'2024-01-01\' AND order_date < \'2025-01-01\';',
          concept: 'The query optimizer decides how to execute queries. EXPLAIN shows its plan. Covering indexes avoid table lookups. Functions on indexed columns prevent index use. Selectivity matters.',
          keyPoints: ['EXPLAIN shows execution plan', 'Avoid SELECT * - specify columns', 'Covering indexes include all needed columns', 'Functions on columns prevent index use'],
          realWorld: 'Database administrators use EXPLAIN and the slow query log to identify and optimize the top 10 slowest queries each week.',
          mistakes: ['SELECT * in production', 'Functions on WHERE columns', 'OR conditions that prevent index use', 'Not analyzing EXPLAIN output'],
          pInstructions: ['Run EXPLAIN on a JOIN query', 'Create a covering index', 'Rewrite a query to use indexes'],
          starter: '-- EXPLAIN a query\n-- Create a covering index\n-- Rewrite to avoid function on column',
          solution: 'EXPLAIN SELECT e.first_name, e.salary, d.name\nFROM employees e JOIN departments d ON e.department_id = d.id\nWHERE e.department_id = 3;\n\nCREATE INDEX idx_emp_cover ON employees(department_id, salary, first_name);\n\n-- Rewrite: function on column\n-- Before: WHERE YEAR(created_at) = 2024\nSELECT * FROM orders\nWHERE created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\';',
          hints: ['type: ref or eq_ref in EXPLAIN means index is used', 'Extra: Using index means covering index'],
          challenge: 'Take 5 slow queries, analyze with EXPLAIN, optimize each (indexes, rewrites, restructuring), and measure the improvement.',
          reqs: ['EXPLAIN each query before/after', 'Create appropriate indexes', 'Rewrite queries to be optimizer-friendly', 'Document improvement percentage'],
          tests: [['all queries optimized', 'EXPLAIN shows index use', 5]]
        })
      ]
    }),

    T({
      title: 'SQL Backup and Recovery', slug: 'sql-backup-recovery',
      description: 'Protect your data with mysqldump, binary logs, and recovery procedures.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['sql', 'mysql', 'backup', 'recovery', 'database'],
      category: 'Database',
      objectives: ['Use mysqldump for backups', 'Understand binary logs', 'Perform point-in-time recovery'],
      steps: [
        S(1, {
          title: 'Backup Strategies', content: 'mysqldump creates SQL script backups. Binary logs enable point-in-time recovery.',
          lang: 'sql', code: '-- Full database backup\n-- $ mysqldump -u root -p mydb > backup.sql\n\n-- Specific tables\n-- $ mysqldump -u root -p mydb employees departments > tables.sql\n\n-- All databases\n-- $ mysqldump -u root -p --all-databases > all_backup.sql\n\n-- Restore from backup\n-- $ mysql -u root -p mydb < backup.sql\n\n-- Binary log for point-in-time recovery\n-- SHOW BINARY LOGS;\n-- SHOW BINLOG EVENTS IN \'binlog.000001\';\n\n-- Restore to specific point in time\n-- $ mysqlbinlog --stop-datetime="2024-01-15 14:30:00" binlog.000001 | mysql -u root -p',
          concept: 'mysqldump creates logical backups (SQL statements). Binary logs record all changes and enable point-in-time recovery. Combine full backups with binary logs for minimal data loss.',
          keyPoints: ['mysqldump: logical backup as SQL', 'Binary logs: continuous change recording', 'Restore: mysql < backup.sql', 'Point-in-time: mysqlbinlog + filter'],
          realWorld: 'Production databases run mysqldump nightly and continuously write binary logs, enabling recovery to any point in time after accidental data loss.',
          mistakes: ['Not testing restore process', 'Forgetting --single-transaction for consistent backups', 'Binary logs filling disk space'],
          pInstructions: ['Create a mysqldump backup', 'Restore from the backup', 'Check binary log status'],
          starter: '-- Backup command\n-- Restore command\n-- Check binary logs',
          solution: '-- $ mysqldump -u root -p --single-transaction mydb > backup_$(date +%Y%m%d).sql\n-- $ mysql -u root -p mydb < backup_20240115.sql\nSHOW VARIABLES LIKE \'log_bin\';\nSHOW BINARY LOGS;',
          hints: ['--single-transaction ensures consistent backup', 'Binary logging must be enabled in my.cnf'],
          challenge: 'Create a disaster recovery plan: full backup, simulated data loss, point-in-time recovery, and verification that no data was lost.',
          reqs: ['Full mysqldump backup', 'Insert more data after backup', 'Simulate accidental DELETE', 'Recover using backup + binlog', 'Verify all data recovered'],
          tests: [['recovery complete', 'no data loss', 5]]
        })
      ]
    })
  ];
};
