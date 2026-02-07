// 25 PostgreSQL Tutorials with full 3-phase content
module.exports = function (T, S) {
  return [
    T({
      title: 'PostgreSQL Introduction and Setup', slug: 'pg-introduction-setup',
      description: 'Get started with PostgreSQL: connect, create databases, and run your first queries.',
      language: 'sql', difficulty: 'beginner', duration: 30,
      tags: ['postgresql', 'postgres', 'setup', 'database'],
      category: 'Database',
      objectives: ['Install and connect to PostgreSQL', 'Create databases and tables', 'Run basic queries with psql'],
      featured: true,
      steps: [
        S(1, {
          title: 'Getting Started with PostgreSQL', content: 'PostgreSQL is a powerful open-source relational database with advanced features.',
          lang: 'sql', code: '-- Connect with psql\n-- $ psql -U postgres\n\n-- Create a database\nCREATE DATABASE myapp;\n\\c myapp\n\n-- Create a table\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(100) NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Insert data\nINSERT INTO users (username, email)\nVALUES (\'alice\', \'alice@example.com\'),\n       (\'bob\', \'bob@example.com\');\n\n-- Query\nSELECT * FROM users;',
          concept: 'PostgreSQL (Postgres) is an advanced SQL database with support for JSON, full-text search, custom types, and more. SERIAL auto-generates IDs. psql is the command-line client.',
          keyPoints: ['SERIAL = auto-incrementing integer', 'TIMESTAMP DEFAULT NOW() for creation time', 'psql is the interactive terminal', '\\c connects to a database, \\dt lists tables'],
          realWorld: 'Companies like Instagram, Spotify, and Reddit use PostgreSQL for its reliability, performance, and advanced features.',
          mistakes: ['Forgetting semicolons in psql', 'Not connecting to the right database', 'Using MySQL syntax (AUTO_INCREMENT vs SERIAL)'],
          pInstructions: ['Create a database and connect to it', 'Create a users table with appropriate types', 'Insert and query data'],
          starter: '-- Create a products table\n-- Insert 3 products\n-- Query all products',
          solution: 'CREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  price NUMERIC(10,2) NOT NULL CHECK (price > 0),\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nINSERT INTO products (name, price) VALUES\n  (\'Laptop\', 999.99), (\'Mouse\', 29.99), (\'Keyboard\', 79.99);\n\nSELECT * FROM products ORDER BY price DESC;',
          hints: ['Use NUMERIC instead of DECIMAL for precision', 'SERIAL creates a sequence automatically'],
          challenge: 'Create a complete schema for a blog: users, posts, comments, tags, and a post_tags junction table. Include all constraints.',
          reqs: ['SERIAL primary keys', 'Foreign keys with ON DELETE', 'CHECK constraints', 'UNIQUE constraints'],
          tests: [['all tables created', 'no errors', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Data Types', slug: 'pg-data-types',
      description: 'Explore PostgreSQL unique data types: arrays, JSON, UUID, and custom types.',
      language: 'sql', difficulty: 'beginner', duration: 35,
      tags: ['postgresql', 'postgres', 'data-types', 'database'],
      category: 'Database',
      objectives: ['Use PostgreSQL-specific data types', 'Work with arrays and JSON', 'Create custom enum types'],
      steps: [
        S(1, {
          title: 'Advanced Data Types', content: 'PostgreSQL offers rich data types beyond standard SQL.',
          lang: 'sql', code: '-- Array type\nCREATE TABLE articles (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL,\n  tags TEXT[] DEFAULT \'{}\'\n);\nINSERT INTO articles (title, tags) VALUES (\'Postgres Tips\', ARRAY[\'sql\', \'database\', \'tips\']);\nSELECT * FROM articles WHERE \'sql\' = ANY(tags);\n\n-- JSON/JSONB\nCREATE TABLE events (\n  id SERIAL PRIMARY KEY,\n  data JSONB NOT NULL\n);\nINSERT INTO events (data) VALUES (\'{"type": "click", "page": "/home", "count": 5}\'::jsonb);\nSELECT data->\'type\' AS event_type, data->>\'page\' AS page FROM events;\n\n-- UUID\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nCREATE TABLE sessions (\n  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,\n  user_id INT NOT NULL\n);\n\n-- Custom enum\nCREATE TYPE mood AS ENUM (\'happy\', \'sad\', \'neutral\');\nCREATE TABLE diary (id SERIAL, feeling mood);',
          concept: 'PostgreSQL arrays store multiple values in one column. JSONB stores binary JSON with indexing support. UUID provides globally unique IDs. Custom enums restrict values to a defined set.',
          keyPoints: ['TEXT[] for arrays, ANY() to search', 'JSONB > JSON (faster, indexable)', '-> returns JSON, ->> returns text', 'CREATE TYPE for custom enums'],
          realWorld: 'E-commerce platforms store product attributes as JSONB since different products have different attributes (color, size, wattage).',
          mistakes: ['Using JSON instead of JSONB (slower queries)', 'Forgetting ::jsonb cast', 'Array indexing starts at 1 in Postgres'],
          pInstructions: ['Create a table with array and JSONB columns', 'Insert data with arrays and JSON', 'Query using array and JSON operators'],
          starter: '-- Create table with tags array and metadata JSONB\n-- Insert records\n-- Query by array element and JSON field',
          solution: 'CREATE TABLE posts (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL,\n  tags TEXT[],\n  metadata JSONB DEFAULT \'{}\'\n);\nINSERT INTO posts (title, tags, metadata) VALUES\n  (\'Post 1\', ARRAY[\'tech\',\'pg\'], \'{"views": 100}\'::jsonb);\nSELECT * FROM posts WHERE \'tech\' = ANY(tags);\nSELECT title, metadata->>\'views\' AS views FROM posts;',
          hints: ['ANY(array) checks if element exists', '->> extracts as text, -> extracts as JSON'],
          challenge: 'Design a product catalog using JSONB for flexible attributes, arrays for tags, and UUID for public-facing IDs.',
          reqs: ['JSONB for product attributes', 'Text array for tags', 'UUID for public ID', 'Query by JSON fields and array elements'],
          tests: [['JSON query', 'returns correct data', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL JSONB Deep Dive', slug: 'pg-jsonb-deep-dive',
      description: 'Master JSONB querying, indexing, and manipulation in PostgreSQL.',
      language: 'sql', difficulty: 'intermediate', duration: 45,
      tags: ['postgresql', 'postgres', 'jsonb', 'json', 'database'],
      category: 'Database',
      objectives: ['Query nested JSONB data', 'Create GIN indexes on JSONB', 'Update JSONB fields'],
      featured: true,
      steps: [
        S(1, {
          title: 'JSONB Queries and Indexes', content: 'JSONB supports rich querying with containment, existence, and path operators.',
          lang: 'sql', code: '-- Containment operator @>\nSELECT * FROM products WHERE attributes @> \'{"color": "red"}\';\n\n-- Existence operator ?\nSELECT * FROM products WHERE attributes ? \'warranty\';\n\n-- Path query\nSELECT attributes #>> \'{dimensions, width}\' AS width FROM products;\n\n-- GIN index for fast JSONB queries\nCREATE INDEX idx_attrs ON products USING GIN (attributes);\n\n-- Update JSONB fields\nUPDATE products\nSET attributes = jsonb_set(attributes, \'{price}\', \'29.99\');\n\n-- Remove a key\nUPDATE products\nSET attributes = attributes - \'old_field\';\n\n-- Aggregate JSONB\nSELECT jsonb_object_agg(key, value) FROM products,\n  jsonb_each(attributes) AS t(key, value);',
          concept: '@> checks if JSONB contains another JSONB. ? checks if a key exists. #>> extracts nested values as text. GIN indexes make these operations fast. jsonb_set updates nested values.',
          keyPoints: ['@> containment operator', '? key existence check', '#>> path extraction as text', 'GIN index for JSONB performance'],
          realWorld: 'Feature flag systems store flags as JSONB and query with @> to check if a user has specific feature flags enabled.',
          mistakes: ['Using JSON instead of JSONB for queries', 'Missing GIN index on large JSONB columns', 'jsonb_set creates path if it does not exist'],
          pInstructions: ['Query JSONB with containment operator', 'Create a GIN index', 'Update nested JSONB values'],
          starter: '-- Find products with color red\n-- Create GIN index\n-- Update a nested field',
          solution: 'SELECT * FROM products WHERE attributes @> \'{"color": "red"}\'::jsonb;\n\nCREATE INDEX idx_prod_attrs ON products USING GIN (attributes);\n\nUPDATE products SET attributes = jsonb_set(attributes, \'{stock}\', \'50\') WHERE id = 1;\n\nSELECT * FROM products WHERE attributes ? \'warranty\';',
          hints: ['@> is the containment operator', 'jsonb_set(target, path, new_value)'],
          challenge: 'Build a dynamic form system where form definitions and responses are stored as JSONB. Support querying responses by any field value.',
          reqs: ['Form definitions as JSONB', 'Responses as JSONB', 'Query by any response field', 'GIN index for performance'],
          tests: [['query by response field', 'uses index', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Window Functions', slug: 'pg-window-functions',
      description: 'Master advanced analytics with PostgreSQL window functions.',
      language: 'sql', difficulty: 'advanced', duration: 50,
      tags: ['postgresql', 'postgres', 'window-functions', 'analytics', 'database'],
      category: 'Database',
      objectives: ['Use ranking functions', 'Calculate running totals and moving averages', 'Define custom window frames'],
      steps: [
        S(1, {
          title: 'Advanced Window Functions', content: 'PostgreSQL has comprehensive window function support for analytics.',
          lang: 'sql', code: '-- Ranking with PARTITION\nSELECT\n  department, first_name, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,\n  NTILE(4) OVER (ORDER BY salary DESC) AS quartile\nFROM employees;\n\n-- Running total and moving average\nSELECT\n  order_date, amount,\n  SUM(amount) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING) AS running_total,\n  AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7d\nFROM orders;\n\n-- LAG/LEAD with offset\nSELECT\n  month, revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,\n  LEAD(revenue, 1) OVER (ORDER BY month) AS next_month,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS mom_growth\nFROM monthly_revenue;\n\n-- FIRST_VALUE / LAST_VALUE\nSELECT department, first_name, salary,\n  FIRST_VALUE(first_name) OVER (PARTITION BY department ORDER BY salary DESC) AS top_earner\nFROM employees;',
          concept: 'Window frames define which rows to include: ROWS BETWEEN ... AND ... UNBOUNDED PRECEDING means from start. CURRENT ROW is current. NTILE divides into equal groups. FIRST_VALUE/LAST_VALUE get boundary values.',
          keyPoints: ['ROWS BETWEEN defines the window frame', 'NTILE(n) divides into n equal groups', 'LAG/LEAD access adjacent rows', 'FIRST_VALUE/LAST_VALUE get boundary values'],
          realWorld: 'Stock trading platforms use window functions for moving averages, cumulative returns, and relative strength indicators.',
          mistakes: ['LAST_VALUE needs ROWS BETWEEN ... AND UNBOUNDED FOLLOWING', 'Default frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW', 'Not partitioning when needed'],
          pInstructions: ['Rank employees by salary per department', 'Calculate 7-day moving average', 'Show month-over-month growth'],
          starter: '-- Department salary rank\n-- 7-day moving average of sales\n-- Month-over-month revenue change',
          solution: 'SELECT department, first_name, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM employees;\n\nSELECT sale_date, amount,\n  AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg_7d\nFROM sales;\n\nSELECT month, revenue,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS growth,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 2) AS pct_growth\nFROM monthly_revenue;',
          hints: ['ROWS 6 PRECEDING = current + 6 before = 7 rows', 'Cast to NUMERIC for percentage calculations'],
          challenge: 'Build a complete sales dashboard: running total, 30-day moving average, year-over-year comparison, top product per month, and percentile distribution.',
          reqs: ['Running total with SUM OVER', '30-day moving average', 'YoY with LAG(revenue, 12)', 'Top product per month with RANK'],
          tests: [['dashboard query', 'all metrics calculated', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Full-Text Search', slug: 'pg-full-text-search',
      description: 'Implement powerful full-text search with tsvector, tsquery, and ranking.',
      language: 'sql', difficulty: 'intermediate', duration: 45,
      tags: ['postgresql', 'postgres', 'full-text-search', 'database'],
      category: 'Database',
      objectives: ['Create tsvector columns and indexes', 'Query with tsquery', 'Rank results by relevance'],
      steps: [
        S(1, {
          title: 'Full-Text Search', content: 'PostgreSQL has built-in full-text search with stemming, ranking, and highlighting.',
          lang: 'sql', code: '-- Create tsvector column\nALTER TABLE articles ADD COLUMN search_vector tsvector;\n\n-- Populate it\nUPDATE articles SET search_vector =\n  setweight(to_tsvector(\'english\', coalesce(title, \'\')), \'A\') ||\n  setweight(to_tsvector(\'english\', coalesce(body, \'\')), \'B\');\n\n-- Create GIN index\nCREATE INDEX idx_search ON articles USING GIN (search_vector);\n\n-- Search with tsquery\nSELECT title, ts_rank(search_vector, query) AS rank\nFROM articles, to_tsquery(\'english\', \'postgres & performance\') AS query\nWHERE search_vector @@ query\nORDER BY rank DESC;\n\n-- Highlight matches\nSELECT title,\n  ts_headline(\'english\', body, to_tsquery(\'postgres & tips\'),\n    \'StartSel=<b>, StopSel=</b>\') AS excerpt\nFROM articles\nWHERE search_vector @@ to_tsquery(\'postgres & tips\');',
          concept: 'tsvector stores preprocessed text (stemmed, stop-words removed). tsquery defines search terms with & (AND), | (OR), ! (NOT). Weights (A-D) boost field importance. ts_rank scores relevance.',
          keyPoints: ['tsvector: preprocessed searchable text', 'tsquery: search expression', '@@ operator matches tsvector against tsquery', 'setweight boosts field importance (A highest)'],
          realWorld: 'Content platforms use PostgreSQL full-text search instead of Elasticsearch for simpler deployments with good-enough search quality.',
          mistakes: ['Forgetting GIN index (slow full scans)', 'Not updating tsvector on row changes', 'Using LIKE instead of FTS for text search'],
          pInstructions: ['Add a tsvector column and populate it', 'Create a GIN index', 'Search and rank results'],
          starter: '-- Add search vector column\n-- Populate with weighted fields\n-- Create index\n-- Search query with ranking',
          solution: 'ALTER TABLE posts ADD COLUMN tsv tsvector;\nUPDATE posts SET tsv = setweight(to_tsvector(\'english\', title), \'A\') || setweight(to_tsvector(\'english\', content), \'B\');\nCREATE INDEX idx_posts_tsv ON posts USING GIN (tsv);\n\nSELECT title, ts_rank(tsv, q) AS rank\nFROM posts, to_tsquery(\'english\', \'database & tutorial\') q\nWHERE tsv @@ q ORDER BY rank DESC LIMIT 10;',
          hints: ['setweight A is highest priority', '& means AND, | means OR in tsquery'],
          challenge: 'Build a search API: multi-field weighted search, phrase matching, fuzzy matching with pg_trgm, search suggestions, and paginated results.',
          reqs: ['Weighted tsvector across 3 fields', 'Phrase search support', 'Trigram similarity for typo tolerance', 'Pagination with OFFSET/LIMIT'],
          tests: [['search "database"', 'ranked results', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Indexes Deep Dive', slug: 'pg-indexes',
      description: 'Use B-tree, GIN, GiST, and partial indexes for optimal performance.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['postgresql', 'postgres', 'indexes', 'performance', 'database'],
      category: 'Database',
      objectives: ['Choose the right index type', 'Create partial and expression indexes', 'Analyze with EXPLAIN ANALYZE'],
      steps: [
        S(1, {
          title: 'Index Types and Strategies', content: 'PostgreSQL supports multiple index types optimized for different query patterns.',
          lang: 'sql', code: '-- B-tree (default): equality and range\nCREATE INDEX idx_salary ON employees (salary);\n\n-- GIN: arrays, JSONB, full-text\nCREATE INDEX idx_tags ON articles USING GIN (tags);\n\n-- Partial index: only index matching rows\nCREATE INDEX idx_active ON users (email) WHERE is_active = true;\n\n-- Expression index: index on function result\nCREATE INDEX idx_lower_email ON users (LOWER(email));\n\n-- Multicolumn index\nCREATE INDEX idx_dept_sal ON employees (department_id, salary DESC);\n\n-- EXPLAIN ANALYZE shows actual execution\nEXPLAIN ANALYZE SELECT * FROM employees WHERE salary > 80000;\n\n-- Check index usage\nSELECT indexrelname, idx_scan, idx_tup_read\nFROM pg_stat_user_indexes WHERE relname = \'employees\';',
          concept: 'B-tree for equality/range (default). GIN for arrays/JSONB/FTS. GiST for geometry/ranges. Partial indexes only index rows matching a condition (smaller, faster). Expression indexes support function-based lookups.',
          keyPoints: ['B-tree: =, <, >, BETWEEN, ORDER BY', 'GIN: arrays, JSONB, full-text search', 'Partial: smaller index for common queries', 'Expression: index on computed values'],
          realWorld: 'SaaS applications use partial indexes on active users (5% of rows), making login queries fast without indexing inactive accounts.',
          mistakes: ['Using GIN when B-tree suffices', 'Too many indexes slowing writes', 'Not using EXPLAIN ANALYZE to verify'],
          pInstructions: ['Create appropriate indexes for common queries', 'Create a partial index for active users', 'Use EXPLAIN ANALYZE to verify'],
          starter: '-- B-tree on frequently filtered column\n-- Partial index for active records\n-- EXPLAIN ANALYZE to verify',
          solution: 'CREATE INDEX idx_email ON users (email);\nCREATE INDEX idx_active_users ON users (email, name) WHERE is_active = true;\nEXPLAIN ANALYZE SELECT * FROM users WHERE email = \'test@test.com\' AND is_active = true;',
          hints: ['Partial indexes reduce index size dramatically', 'EXPLAIN ANALYZE shows actual timing'],
          challenge: 'Optimize a slow query dashboard: identify the 5 slowest queries, create appropriate indexes (B-tree, GIN, partial), and measure improvement with EXPLAIN ANALYZE.',
          reqs: ['Identify slow queries from pg_stat_statements', 'Create appropriate index types', 'Show EXPLAIN before/after', 'Measure timing improvement'],
          tests: [['after indexing', 'Seq Scan becomes Index Scan', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Transactions and Isolation', slug: 'pg-transactions',
      description: 'Master transactions with SAVEPOINT, isolation levels, and advisory locks.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['postgresql', 'postgres', 'transactions', 'isolation', 'database'],
      category: 'Database',
      objectives: ['Use SAVEPOINTs for partial rollback', 'Understand isolation levels', 'Handle concurrent access'],
      steps: [
        S(1, {
          title: 'Advanced Transactions', content: 'PostgreSQL supports savepoints and configurable isolation levels.',
          lang: 'sql', code: '-- Transaction with SAVEPOINT\nBEGIN;\nINSERT INTO orders (customer_id, total) VALUES (1, 100);\nSAVEPOINT order_created;\n\nINSERT INTO order_items (order_id, product_id, qty) VALUES (1, 10, 2);\n-- If this fails, rollback to savepoint\nROLLBACK TO SAVEPOINT order_created;\n-- Order still exists, try again or adjust\nCOMMIT;\n\n-- Isolation levels\nBEGIN ISOLATION LEVEL SERIALIZABLE;\nSELECT balance FROM accounts WHERE id = 1;\n-- Other transactions cannot modify this row until we commit\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;\n\n-- Advisory locks\nSELECT pg_advisory_lock(12345);  -- Acquire named lock\n-- Do exclusive work\nSELECT pg_advisory_unlock(12345);  -- Release',
          concept: 'SAVEPOINT creates rollback points within a transaction. Isolation levels control how concurrent transactions see each other: READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE. Advisory locks provide application-level locking.',
          keyPoints: ['SAVEPOINT allows partial rollback', 'READ COMMITTED: sees committed data', 'SERIALIZABLE: strictest isolation', 'Advisory locks for application logic'],
          realWorld: 'Reservation systems use SERIALIZABLE isolation to prevent double-booking when multiple users try to book the same slot simultaneously.',
          mistakes: ['Not handling serialization failures (retry needed)', 'Holding locks too long (blocking)', 'Forgetting to release advisory locks'],
          pInstructions: ['Write a transaction with savepoint', 'Use SERIALIZABLE isolation for a critical update', 'Demonstrate advisory lock usage'],
          starter: '-- Transaction with savepoint\nBEGIN;\n-- Insert order\n-- SAVEPOINT\n-- Try inserting items\n-- ROLLBACK TO SAVEPOINT if needed\nCOMMIT;',
          solution: 'BEGIN;\nINSERT INTO orders (customer_id, total) VALUES (1, 50.00);\nSAVEPOINT sp1;\nINSERT INTO order_items (order_id, product_id, qty) VALUES (currval(\'orders_id_seq\'), 5, 1);\n-- If the above fails:\n-- ROLLBACK TO SAVEPOINT sp1;\nCOMMIT;\n\nBEGIN ISOLATION LEVEL SERIALIZABLE;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nCOMMIT;',
          hints: ['ROLLBACK TO SAVEPOINT keeps the transaction open', 'SERIALIZABLE may throw serialization_failure errors'],
          challenge: 'Implement a ticket booking system that handles concurrent bookings using SERIALIZABLE isolation, with retry logic for serialization failures.',
          reqs: ['SERIALIZABLE isolation', 'Check availability before booking', 'Handle serialization failure with retry', 'SAVEPOINT for multi-step booking'],
          tests: [['concurrent booking', 'no double-book', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Views and Materialized Views', slug: 'pg-views',
      description: 'Create regular and materialized views for reusable queries and caching.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['postgresql', 'postgres', 'views', 'materialized-views', 'database'],
      category: 'Database',
      objectives: ['Create and query views', 'Use materialized views for caching', 'Refresh materialized views'],
      steps: [
        S(1, {
          title: 'Views and Materialized Views', content: 'Views are saved queries. Materialized views cache the results for fast reads.',
          lang: 'sql', code: '-- Regular view\nCREATE VIEW active_users AS\nSELECT id, username, email, last_login\nFROM users WHERE is_active = true;\n\n-- Query like a table\nSELECT * FROM active_users WHERE last_login > NOW() - INTERVAL \'30 days\';\n\n-- Materialized view (cached)\nCREATE MATERIALIZED VIEW monthly_stats AS\nSELECT\n  date_trunc(\'month\', order_date) AS month,\n  COUNT(*) AS order_count,\n  SUM(total) AS revenue\nFROM orders\nGROUP BY 1\nORDER BY 1;\n\n-- Index the materialized view\nCREATE INDEX idx_monthly ON monthly_stats (month);\n\n-- Refresh when data changes\nREFRESH MATERIALIZED VIEW CONCURRENTLY monthly_stats;',
          concept: 'Regular views compute on every query (always fresh but slower). Materialized views store results on disk (fast reads but stale until refreshed). CONCURRENTLY refreshes without blocking reads.',
          keyPoints: ['Views: always current, computed each query', 'Materialized views: cached, need REFRESH', 'CONCURRENTLY: refresh without locking', 'Materialized views can be indexed'],
          realWorld: 'Analytics dashboards use materialized views refreshed hourly to show reports instantly without running expensive aggregations on each page load.',
          mistakes: ['Stale data in materialized views', 'Refreshing too frequently (expensive)', 'CONCURRENTLY requires a UNIQUE index'],
          pInstructions: ['Create a regular view for active users', 'Create a materialized view for monthly stats', 'Refresh the materialized view'],
          starter: '-- Regular view\n-- Materialized view with aggregation\n-- Refresh command',
          solution: 'CREATE VIEW active_users AS\nSELECT * FROM users WHERE is_active = true;\n\nCREATE MATERIALIZED VIEW sales_summary AS\nSELECT date_trunc(\'month\', created_at) AS month, SUM(amount) AS total\nFROM sales GROUP BY 1;\n\nCREATE UNIQUE INDEX ON sales_summary (month);\nREFRESH MATERIALIZED VIEW CONCURRENTLY sales_summary;',
          hints: ['CONCURRENTLY requires a UNIQUE index on the materialized view', 'Use pg_cron to schedule automatic refreshes'],
          challenge: 'Build a reporting layer with: real-time views for current data, materialized views for historical reports, and a scheduled refresh system.',
          reqs: ['Regular view for live metrics', 'Materialized view for historical', 'Unique index for concurrent refresh', 'Cron job for scheduled refresh'],
          tests: [['materialized view', 'data is cached', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Common Table Expressions', slug: 'pg-ctes',
      description: 'Write elegant queries with CTEs and recursive queries in PostgreSQL.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['postgresql', 'postgres', 'cte', 'recursive', 'database'],
      category: 'Database',
      objectives: ['Write CTEs for readable queries', 'Use recursive CTEs for hierarchies', 'Understand CTE materialization'],
      steps: [
        S(1, {
          title: 'CTEs and Recursion', content: 'PostgreSQL CTEs support recursion and data-modifying statements.',
          lang: 'sql', code: '-- CTE for readability\nWITH top_departments AS (\n  SELECT department_id, AVG(salary) AS avg_sal\n  FROM employees GROUP BY department_id\n  HAVING AVG(salary) > 70000\n)\nSELECT d.name, td.avg_sal\nFROM top_departments td\nJOIN departments d ON td.department_id = d.id;\n\n-- Recursive CTE for org chart\nWITH RECURSIVE org_tree AS (\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, ot.depth + 1\n  FROM employees e JOIN org_tree ot ON e.manager_id = ot.id\n)\nSELECT repeat(\'  \', depth - 1) || name AS tree, depth\nFROM org_tree ORDER BY depth;\n\n-- Writable CTE (DML in CTE)\nWITH deleted AS (\n  DELETE FROM logs WHERE created_at < NOW() - INTERVAL \'90 days\'\n  RETURNING *\n)\nINSERT INTO archived_logs SELECT * FROM deleted;',
          concept: 'CTEs create named subresults for readability. Recursive CTEs traverse hierarchies. PostgreSQL uniquely supports writable CTEs (DELETE/INSERT/UPDATE in WITH clause) for complex data movements.',
          keyPoints: ['WITH creates temporary named results', 'RECURSIVE enables self-referencing', 'Writable CTEs support DML', 'RETURNING captures affected rows'],
          realWorld: 'Content management systems use recursive CTEs to build category breadcrumbs and nested comment threads.',
          mistakes: ['Infinite recursion without depth limit', 'Writable CTE runs once (not like a trigger)', 'CTE materialization may prevent optimization'],
          pInstructions: ['Write a CTE for department stats', 'Write a recursive CTE for categories', 'Use a writable CTE to archive old data'],
          starter: '-- Department stats CTE\n-- Recursive category tree\n-- Archive and delete in one statement',
          solution: 'WITH dept_stats AS (\n  SELECT department_id, COUNT(*) AS cnt, AVG(salary) AS avg_sal\n  FROM employees GROUP BY department_id\n)\nSELECT d.name, ds.cnt, ROUND(ds.avg_sal, 2)\nFROM dept_stats ds JOIN departments d ON ds.department_id = d.id;\n\nWITH RECURSIVE cat_tree AS (\n  SELECT id, name, parent_id, 0 AS level FROM categories WHERE parent_id IS NULL\n  UNION ALL\n  SELECT c.id, c.name, c.parent_id, ct.level + 1\n  FROM categories c JOIN cat_tree ct ON c.parent_id = ct.id\n)\nSELECT * FROM cat_tree ORDER BY level;\n\nWITH archived AS (\n  DELETE FROM events WHERE created_at < NOW() - INTERVAL \'30 days\' RETURNING *\n)\nINSERT INTO event_archive SELECT * FROM archived;',
          hints: ['RETURNING * captures all deleted rows', 'Add WHERE depth < 100 to prevent infinite recursion'],
          challenge: 'Build a bill-of-materials query: given a product, recursively find all components, their quantities, and total cost at each level.',
          reqs: ['Recursive CTE for component tree', 'Calculate cumulative quantity', 'Calculate total cost per level', 'Handle circular references'],
          tests: [['product BOM', 'all components listed', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Stored Functions', slug: 'pg-functions',
      description: 'Write PL/pgSQL functions for server-side logic and custom operations.',
      language: 'sql', difficulty: 'advanced', duration: 45,
      tags: ['postgresql', 'postgres', 'functions', 'plpgsql', 'database'],
      category: 'Database',
      objectives: ['Write PL/pgSQL functions', 'Return tables and records', 'Handle exceptions'],
      steps: [
        S(1, {
          title: 'PL/pgSQL Functions', content: 'PostgreSQL supports server-side functions in PL/pgSQL and other languages.',
          lang: 'sql', code: '-- Simple function\nCREATE OR REPLACE FUNCTION calculate_tax(price NUMERIC, rate NUMERIC DEFAULT 0.1)\nRETURNS NUMERIC AS $$\nBEGIN\n  RETURN ROUND(price * rate, 2);\nEND;\n$$ LANGUAGE plpgsql;\n\nSELECT calculate_tax(100);  -- 10.00\n\n-- Function returning a table\nCREATE OR REPLACE FUNCTION get_department_stats(dept_name TEXT)\nRETURNS TABLE(emp_count BIGINT, avg_salary NUMERIC, max_salary NUMERIC) AS $$\nBEGIN\n  RETURN QUERY\n  SELECT COUNT(*), ROUND(AVG(salary), 2), MAX(salary)\n  FROM employees e JOIN departments d ON e.department_id = d.id\n  WHERE d.name = dept_name;\nEND;\n$$ LANGUAGE plpgsql;\n\n-- With exception handling\nCREATE OR REPLACE FUNCTION safe_divide(a NUMERIC, b NUMERIC)\nRETURNS NUMERIC AS $$\nBEGIN\n  RETURN a / b;\nEXCEPTION\n  WHEN division_by_zero THEN RETURN NULL;\nEND;\n$$ LANGUAGE plpgsql;',
          concept: 'PL/pgSQL is PostgreSQL procedural language. Functions can return scalars, records, or tables. Exception blocks handle errors. Functions run within the caller transaction.',
          keyPoints: ['CREATE OR REPLACE for idempotent creation', 'RETURNS TABLE for set-returning functions', 'EXCEPTION block for error handling', 'Functions run in caller transaction'],
          realWorld: 'Database-heavy applications use PL/pgSQL functions for complex business logic that needs to run close to the data for performance.',
          mistakes: ['Not using SECURITY DEFINER carefully', 'Heavy logic in functions (hard to debug)', 'Forgetting LANGUAGE plpgsql'],
          pInstructions: ['Write a function with parameters and default', 'Write a set-returning function', 'Add exception handling'],
          starter: '-- Tax calculation function\n-- Department stats function\n-- Division with error handling',
          solution: 'CREATE OR REPLACE FUNCTION calc_total(price NUMERIC, qty INT DEFAULT 1, tax_rate NUMERIC DEFAULT 0.1)\nRETURNS NUMERIC AS $$\nBEGIN\n  RETURN ROUND(price * qty * (1 + tax_rate), 2);\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE OR REPLACE FUNCTION search_users(term TEXT)\nRETURNS TABLE(id INT, name TEXT, email TEXT) AS $$\nBEGIN\n  RETURN QUERY SELECT u.id, u.name, u.email FROM users u\n  WHERE u.name ILIKE \'%\' || term || \'%\' OR u.email ILIKE \'%\' || term || \'%\';\nEND;\n$$ LANGUAGE plpgsql;',
          hints: ['RETURNS TABLE allows SELECT * FROM function()', 'RETURN QUERY runs a query and returns results'],
          challenge: 'Create a user registration function that validates email, checks for duplicates, hashes the password (using pgcrypto), creates the user, and returns the new user record.',
          reqs: ['Email validation with regex', 'Duplicate check', 'Password hashing', 'Return new user record', 'Exception handling'],
          tests: [['valid registration', 'returns user', 5], ['duplicate email', 'raises error', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Triggers', slug: 'pg-triggers',
      description: 'Automate database actions with PostgreSQL trigger functions.',
      language: 'sql', difficulty: 'advanced', duration: 40,
      tags: ['postgresql', 'postgres', 'triggers', 'automation', 'database'],
      category: 'Database',
      objectives: ['Create trigger functions', 'Use BEFORE and AFTER triggers', 'Access OLD and NEW records'],
      steps: [
        S(1, {
          title: 'Trigger Functions', content: 'PostgreSQL triggers call functions automatically on data changes.',
          lang: 'sql', code: '-- Trigger function for updated_at\nCREATE OR REPLACE FUNCTION update_timestamp()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER set_updated_at\n  BEFORE UPDATE ON users\n  FOR EACH ROW\n  EXECUTE FUNCTION update_timestamp();\n\n-- Audit trigger\nCREATE OR REPLACE FUNCTION audit_changes()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO audit_log (table_name, operation, old_data, new_data, changed_at)\n  VALUES (\n    TG_TABLE_NAME, TG_OP,\n    CASE WHEN TG_OP = \'DELETE\' THEN row_to_json(OLD)::jsonb END,\n    CASE WHEN TG_OP != \'DELETE\' THEN row_to_json(NEW)::jsonb END,\n    NOW()\n  );\n  RETURN COALESCE(NEW, OLD);\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER users_audit\n  AFTER INSERT OR UPDATE OR DELETE ON users\n  FOR EACH ROW EXECUTE FUNCTION audit_changes();',
          concept: 'Trigger functions return TRIGGER type. TG_TABLE_NAME, TG_OP give context. BEFORE triggers can modify NEW. AFTER triggers are for logging. row_to_json converts records to JSON for audit logging.',
          keyPoints: ['Trigger functions return TRIGGER', 'BEFORE can modify NEW', 'TG_OP: INSERT, UPDATE, DELETE', 'row_to_json for audit logging'],
          realWorld: 'Every enterprise database uses triggers for audit trails, automatic timestamps, and denormalized counter maintenance.',
          mistakes: ['Trigger loops (trigger causes trigger)', 'Heavy logic in triggers (slow writes)', 'Not returning NEW in BEFORE trigger'],
          pInstructions: ['Create a timestamp trigger', 'Create an audit trigger', 'Test with INSERT, UPDATE, DELETE'],
          starter: '-- Timestamp trigger function\n-- Audit trigger function\n-- Create triggers on a table',
          solution: 'CREATE OR REPLACE FUNCTION set_updated()\nRETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_updated BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION set_updated();\n\nCREATE OR REPLACE FUNCTION log_audit()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO audit (tbl, op, data, ts)\n  VALUES (TG_TABLE_NAME, TG_OP, row_to_json(COALESCE(NEW, OLD))::jsonb, NOW());\n  RETURN COALESCE(NEW, OLD);\nEND; $$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_audit AFTER INSERT OR UPDATE OR DELETE ON posts\nFOR EACH ROW EXECUTE FUNCTION log_audit();',
          hints: ['COALESCE(NEW, OLD) works for all operations', 'row_to_json converts a row to JSON'],
          challenge: 'Create a complete audit system with: change tracking, user attribution (who made the change), rollback capability, and a view to see change history.',
          reqs: ['Track INSERT, UPDATE, DELETE', 'Store both old and new values', 'Include the user who made the change', 'Provide a rollback function'],
          tests: [['update triggers audit', 'old/new values stored', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Partitioning', slug: 'pg-partitioning',
      description: 'Manage large tables efficiently with declarative partitioning.',
      language: 'sql', difficulty: 'advanced', duration: 45,
      tags: ['postgresql', 'postgres', 'partitioning', 'performance', 'database'],
      category: 'Database',
      objectives: ['Create range and list partitions', 'Manage partition lifecycle', 'Understand partition pruning'],
      steps: [
        S(1, {
          title: 'Table Partitioning', content: 'Partitioning splits a large table into smaller physical pieces for performance.',
          lang: 'sql', code: '-- Range partitioning by date\nCREATE TABLE orders (\n  id SERIAL,\n  customer_id INT NOT NULL,\n  total NUMERIC(10,2),\n  order_date DATE NOT NULL\n) PARTITION BY RANGE (order_date);\n\nCREATE TABLE orders_2024_q1 PARTITION OF orders\n  FOR VALUES FROM (\'2024-01-01\') TO (\'2024-04-01\');\nCREATE TABLE orders_2024_q2 PARTITION OF orders\n  FOR VALUES FROM (\'2024-04-01\') TO (\'2024-07-01\');\n\n-- List partitioning by region\nCREATE TABLE sales (\n  id SERIAL, region TEXT, amount NUMERIC\n) PARTITION BY LIST (region);\n\nCREATE TABLE sales_us PARTITION OF sales FOR VALUES IN (\'US\', \'CA\');\nCREATE TABLE sales_eu PARTITION OF sales FOR VALUES IN (\'UK\', \'DE\', \'FR\');\n\n-- Query with partition pruning\nEXPLAIN SELECT * FROM orders WHERE order_date = \'2024-02-15\';\n-- Only scans orders_2024_q1!',
          concept: 'Declarative partitioning (PG 10+) transparently splits tables. RANGE for dates/numbers, LIST for categories. The optimizer prunes irrelevant partitions automatically. Queries work on the parent table.',
          keyPoints: ['RANGE: date ranges, numeric ranges', 'LIST: categorical values', 'Partition pruning skips irrelevant partitions', 'Queries use parent table name'],
          realWorld: 'Time-series databases partition by month/quarter, allowing fast queries on recent data and easy archival of old partitions.',
          mistakes: ['Forgetting to create partitions for new ranges', 'Not including partition key in queries (no pruning)', 'Primary keys must include partition key'],
          pInstructions: ['Create a range-partitioned table by date', 'Create quarterly partitions', 'Verify partition pruning with EXPLAIN'],
          starter: '-- Create partitioned orders table\n-- Create quarterly partitions for 2024\n-- EXPLAIN a query to verify pruning',
          solution: 'CREATE TABLE events (id SERIAL, event_date DATE NOT NULL, data TEXT)\nPARTITION BY RANGE (event_date);\n\nCREATE TABLE events_q1 PARTITION OF events FOR VALUES FROM (\'2024-01-01\') TO (\'2024-04-01\');\nCREATE TABLE events_q2 PARTITION OF events FOR VALUES FROM (\'2024-04-01\') TO (\'2024-07-01\');\n\nINSERT INTO events (event_date, data) VALUES (\'2024-02-15\', \'test\');\nEXPLAIN SELECT * FROM events WHERE event_date = \'2024-02-15\';',
          hints: ['RANGE bounds: FROM is inclusive, TO is exclusive', 'Include the partition key in frequently used queries'],
          challenge: 'Set up automatic partition management: create partitions for the next quarter, attach/detach partitions, and move old partitions to cold storage.',
          reqs: ['Auto-create future partitions', 'Detach old partitions', 'Move to archive tablespace', 'Verify partition pruning'],
          tests: [['query Q1 data', 'only Q1 partition scanned', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Extensions', slug: 'pg-extensions',
      description: 'Extend PostgreSQL with powerful extensions: pg_trgm, pgcrypto, PostGIS.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['postgresql', 'postgres', 'extensions', 'database'],
      category: 'Database',
      objectives: ['Install and use common extensions', 'Fuzzy matching with pg_trgm', 'Encryption with pgcrypto'],
      steps: [
        S(1, {
          title: 'Popular Extensions', content: 'PostgreSQL extensions add powerful features without leaving the database.',
          lang: 'sql', code: '-- pg_trgm: fuzzy string matching\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\nSELECT similarity(\'PostgreSQL\', \'Postgres\');  -- 0.5\nSELECT * FROM products WHERE name % \'laptop\';  -- fuzzy match\nCREATE INDEX idx_trgm ON products USING GIN (name gin_trgm_ops);\n\n-- pgcrypto: encryption\nCREATE EXTENSION IF NOT EXISTS pgcrypto;\nINSERT INTO users (email, password_hash)\nVALUES (\'alice@test.com\', crypt(\'mypassword\', gen_salt(\'bf\')));\n-- Verify password\nSELECT * FROM users\nWHERE password_hash = crypt(\'mypassword\', password_hash);\n\n-- uuid-ossp: UUID generation\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nSELECT uuid_generate_v4();',
          concept: 'Extensions are pre-built modules. pg_trgm enables fuzzy string matching and typo tolerance. pgcrypto provides hashing and encryption. uuid-ossp generates UUIDs. Over 100 extensions available.',
          keyPoints: ['CREATE EXTENSION installs an extension', 'pg_trgm: fuzzy matching with % operator', 'pgcrypto: crypt() for password hashing', 'uuid-ossp: UUID generation'],
          realWorld: 'Search autocomplete features use pg_trgm to show results even when users misspell their queries.',
          mistakes: ['Not installing extension before use', 'Using MD5 instead of bcrypt for passwords', 'Forgetting GIN index for pg_trgm'],
          pInstructions: ['Install pg_trgm and test fuzzy matching', 'Use pgcrypto for password hashing', 'Generate UUIDs'],
          starter: '-- Install and test pg_trgm\n-- Hash a password with pgcrypto\n-- Generate a UUID',
          solution: 'CREATE EXTENSION IF NOT EXISTS pg_trgm;\nSELECT similarity(\'hello\', \'helo\');\nSELECT * FROM products WHERE similarity(name, \'lapttop\') > 0.3;\n\nCREATE EXTENSION IF NOT EXISTS pgcrypto;\nSELECT crypt(\'password123\', gen_salt(\'bf\'));\n\nCREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nSELECT uuid_generate_v4();',
          hints: ['similarity() returns 0-1 (1 = exact match)', 'gen_salt(\'bf\') creates bcrypt salt'],
          challenge: 'Build a secure user system: UUID primary keys, bcrypt passwords, fuzzy name search, and encrypted sensitive fields.',
          reqs: ['UUID-ossp for IDs', 'pgcrypto for passwords', 'pg_trgm for name search', 'pgp_sym_encrypt for sensitive data'],
          tests: [['password verify', 'correct match', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Row-Level Security', slug: 'pg-row-level-security',
      description: 'Implement fine-grained access control with row-level security policies.',
      language: 'sql', difficulty: 'advanced', duration: 40,
      tags: ['postgresql', 'postgres', 'rls', 'security', 'database'],
      category: 'Database',
      objectives: ['Enable row-level security', 'Create policies for users/roles', 'Implement multi-tenant isolation'],
      steps: [
        S(1, {
          title: 'Row-Level Security Policies', content: 'RLS restricts which rows a user can see or modify based on policies.',
          lang: 'sql', code: '-- Enable RLS\nALTER TABLE documents ENABLE ROW LEVEL SECURITY;\n\n-- Policy: users see only their own documents\nCREATE POLICY user_docs ON documents\n  USING (owner_id = current_setting(\'app.user_id\')::INT);\n\n-- Policy: admins see everything\nCREATE POLICY admin_all ON documents\n  TO admin_role\n  USING (true);\n\n-- Set current user context\nSET app.user_id = \'42\';\nSELECT * FROM documents;  -- Only sees user 42 docs\n\n-- Multi-tenant isolation\nCREATE POLICY tenant_isolation ON orders\n  USING (tenant_id = current_setting(\'app.tenant_id\')::INT)\n  WITH CHECK (tenant_id = current_setting(\'app.tenant_id\')::INT);',
          concept: 'RLS adds automatic WHERE clauses to every query. USING controls SELECT/DELETE. WITH CHECK controls INSERT/UPDATE. Policies can target specific roles. current_setting() reads session variables.',
          keyPoints: ['ALTER TABLE ENABLE ROW LEVEL SECURITY', 'USING: filter for SELECT/DELETE', 'WITH CHECK: filter for INSERT/UPDATE', 'current_setting reads session variables'],
          realWorld: 'Multi-tenant SaaS applications use RLS to ensure tenants can never access each other\'s data, even if there are application bugs.',
          mistakes: ['Table owner bypasses RLS (use FORCE)', 'Forgetting WITH CHECK for inserts', 'Not setting session variables before queries'],
          pInstructions: ['Enable RLS on a table', 'Create a policy for user data isolation', 'Test with different user contexts'],
          starter: '-- Enable RLS on documents\n-- Create user isolation policy\n-- Test with different users',
          solution: 'ALTER TABLE documents ENABLE ROW LEVEL SECURITY;\nALTER TABLE documents FORCE ROW LEVEL SECURITY;\n\nCREATE POLICY own_docs ON documents\n  USING (user_id = current_setting(\'app.uid\')::INT)\n  WITH CHECK (user_id = current_setting(\'app.uid\')::INT);\n\nSET app.uid = \'1\';\nSELECT * FROM documents;  -- Only user 1 docs\n\nSET app.uid = \'2\';\nSELECT * FROM documents;  -- Only user 2 docs',
          hints: ['FORCE RLS applies even to table owner', 'WITH CHECK prevents inserting rows you cannot see'],
          challenge: 'Implement a complete multi-tenant system: tenant isolation, admin override, shared data, and audit logging — all with RLS.',
          reqs: ['Tenant isolation policy', 'Admin bypass policy', 'Shared data policy', 'Cannot insert for other tenants'],
          tests: [['tenant A query', 'only tenant A data', 5], ['insert for tenant B', 'denied', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Performance Tuning', slug: 'pg-performance-tuning',
      description: 'Optimize PostgreSQL performance with EXPLAIN ANALYZE, config tuning, and query optimization.',
      language: 'sql', difficulty: 'advanced', duration: 50,
      tags: ['postgresql', 'postgres', 'performance', 'optimization', 'database'],
      category: 'Database',
      objectives: ['Read EXPLAIN ANALYZE output', 'Tune key configuration parameters', 'Identify and fix performance bottlenecks'],
      steps: [
        S(1, {
          title: 'Performance Analysis', content: 'Use EXPLAIN ANALYZE and pg_stat to find and fix slow queries.',
          lang: 'sql', code: '-- EXPLAIN ANALYZE shows actual timing\nEXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)\nSELECT e.*, d.name\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nWHERE e.salary > 80000;\n\n-- Check table statistics\nSELECT\n  relname, seq_scan, idx_scan,\n  n_tup_ins, n_tup_upd, n_tup_del\nFROM pg_stat_user_tables\nORDER BY seq_scan DESC;\n\n-- Find slow queries\nSELECT query, calls, mean_exec_time, total_exec_time\nFROM pg_stat_statements\nORDER BY total_exec_time DESC LIMIT 10;\n\n-- Key configuration\n-- shared_buffers = 25% of RAM\n-- effective_cache_size = 75% of RAM\n-- work_mem = 256MB for analytics, 4MB for OLTP\n-- maintenance_work_mem = 512MB',
          concept: 'EXPLAIN ANALYZE runs the query and shows actual timing. BUFFERS shows disk I/O. pg_stat_user_tables reveals sequential vs index scans. Key config: shared_buffers (cache), work_mem (sort/hash memory).',
          keyPoints: ['EXPLAIN ANALYZE: actual execution stats', 'BUFFERS: shows I/O operations', 'seq_scan high = missing index', 'shared_buffers = ~25% of RAM'],
          realWorld: 'DBAs review pg_stat_statements weekly to find the top 10 most expensive queries and optimize them systematically.',
          mistakes: ['Running EXPLAIN without ANALYZE (estimates only)', 'Setting work_mem too high (per-sort, per-connection)', 'Not running VACUUM ANALYZE regularly'],
          pInstructions: ['Run EXPLAIN ANALYZE on a query', 'Check table scan statistics', 'Identify configuration to tune'],
          starter: '-- EXPLAIN ANALYZE a join query\n-- Check sequential scan counts\n-- Review configuration recommendations',
          solution: 'EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE customer_id = 42;\n\nSELECT relname, seq_scan, idx_scan FROM pg_stat_user_tables\nWHERE seq_scan > 100 ORDER BY seq_scan DESC;\n\nSHOW shared_buffers;\nSHOW work_mem;\nSHOW effective_cache_size;',
          hints: ['High seq_scan with low idx_scan means missing index', 'BUFFERS shows buffer hits (cache) vs reads (disk)'],
          challenge: 'Profile a slow application: identify the top 5 slow queries, analyze each with EXPLAIN, create indexes, tune configuration, and measure overall improvement.',
          reqs: ['Find slow queries from pg_stat_statements', 'EXPLAIN ANALYZE each one', 'Create appropriate indexes', 'Recommend config changes', 'Before/after timing comparison'],
          tests: [['after optimization', 'queries faster', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Backup and Recovery', slug: 'pg-backup-recovery',
      description: 'Protect data with pg_dump, WAL archiving, and point-in-time recovery.',
      language: 'sql', difficulty: 'intermediate', duration: 40,
      tags: ['postgresql', 'postgres', 'backup', 'recovery', 'database'],
      category: 'Database',
      objectives: ['Use pg_dump and pg_restore', 'Understand WAL archiving', 'Perform point-in-time recovery'],
      steps: [
        S(1, {
          title: 'Backup Strategies', content: 'PostgreSQL offers logical (pg_dump) and physical (WAL) backup methods.',
          lang: 'sql', code: '-- Logical backup with pg_dump\n-- $ pg_dump -U postgres mydb > backup.sql\n-- $ pg_dump -U postgres -Fc mydb > backup.dump  (custom format)\n\n-- Restore\n-- $ psql -U postgres mydb < backup.sql\n-- $ pg_restore -U postgres -d mydb backup.dump\n\n-- Backup specific tables\n-- $ pg_dump -U postgres -t users -t orders mydb > tables.sql\n\n-- Schema only\n-- $ pg_dump -U postgres --schema-only mydb > schema.sql\n\n-- Data only\n-- $ pg_dump -U postgres --data-only mydb > data.sql\n\n-- WAL archiving configuration (postgresql.conf)\n-- wal_level = replica\n-- archive_mode = on\n-- archive_command = \'cp %p /archive/%f\'\n\n-- Check backup status\nSELECT pg_is_in_backup(), pg_backup_start_time();',
          concept: 'pg_dump creates logical backups (SQL or custom format). WAL (Write-Ahead Log) records every change for point-in-time recovery. Combine pg_basebackup + WAL archiving for continuous backup.',
          keyPoints: ['pg_dump: logical backup (portable)', 'pg_dump -Fc: custom format (compressed)', 'WAL archiving: continuous backup', 'pg_basebackup: physical backup'],
          realWorld: 'Production PostgreSQL databases use a combination of nightly pg_dump and continuous WAL archiving for both disaster recovery and point-in-time recovery.',
          mistakes: ['Not testing restore process', 'pg_dump while schema changes happen', 'WAL archive filling up disk'],
          pInstructions: ['Create a pg_dump backup', 'Restore from the backup', 'Check WAL configuration'],
          starter: '-- pg_dump command for full backup\n-- pg_dump for specific tables\n-- Restore command\n-- Check WAL settings',
          solution: '-- $ pg_dump -U postgres -Fc mydb > mydb_$(date +%Y%m%d).dump\n-- $ pg_dump -U postgres -t important_table mydb > table.sql\n-- $ pg_restore -U postgres -d mydb_new mydb_20240115.dump\nSHOW wal_level;\nSHOW archive_mode;',
          hints: ['-Fc creates compressed custom format', 'pg_restore works with -Fc format, psql works with SQL format'],
          challenge: 'Set up a complete disaster recovery system: automated pg_dump, WAL archiving, test recovery to a new database, and verify data integrity.',
          reqs: ['Automated pg_dump with cron', 'WAL archiving enabled', 'Recovery to new database', 'Data integrity verification'],
          tests: [['recovery complete', 'data matches', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL LISTEN/NOTIFY', slug: 'pg-listen-notify',
      description: 'Build real-time features with PostgreSQL pub/sub messaging.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['postgresql', 'postgres', 'listen-notify', 'pub-sub', 'database'],
      category: 'Database',
      objectives: ['Use LISTEN and NOTIFY for messaging', 'Send payloads with notifications', 'Build real-time features'],
      steps: [
        S(1, {
          title: 'Pub/Sub with LISTEN/NOTIFY', content: 'PostgreSQL has built-in publish/subscribe messaging.',
          lang: 'sql', code: '-- Session 1: Subscribe\nLISTEN new_orders;\n\n-- Session 2: Publish\nNOTIFY new_orders, \'{"order_id": 42, "total": 99.99}\';\n\n-- Trigger-based notifications\nCREATE OR REPLACE FUNCTION notify_order_change()\nRETURNS TRIGGER AS $$\nBEGIN\n  PERFORM pg_notify(\'order_changes\',\n    json_build_object(\n      \'operation\', TG_OP,\n      \'order_id\', NEW.id,\n      \'status\', NEW.status\n    )::text\n  );\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_order_notify\n  AFTER INSERT OR UPDATE ON orders\n  FOR EACH ROW EXECUTE FUNCTION notify_order_change();\n\n-- Node.js listener\n-- client.query("LISTEN order_changes");\n-- client.on("notification", (msg) => console.log(msg.payload));',
          concept: 'LISTEN subscribes to a channel. NOTIFY sends a message (up to 8000 bytes). pg_notify() sends from functions/triggers. This enables real-time updates without polling.',
          keyPoints: ['LISTEN subscribes to a channel', 'NOTIFY sends to all listeners', 'pg_notify() works in functions', 'Payload max 8000 bytes'],
          realWorld: 'Real-time dashboards use LISTEN/NOTIFY to push database changes to connected WebSocket clients without polling.',
          mistakes: ['Payload exceeding 8000 bytes', 'Notifications lost if no listener', 'Not handling reconnection in clients'],
          pInstructions: ['Set up a LISTEN on a channel', 'NOTIFY with a JSON payload', 'Create a trigger that notifies on changes'],
          starter: '-- Listen to a channel\n-- Notify with payload\n-- Create trigger notification function',
          solution: 'LISTEN updates;\nNOTIFY updates, \'{"action": "test"}\';\n\nCREATE OR REPLACE FUNCTION notify_change()\nRETURNS TRIGGER AS $$\nBEGIN\n  PERFORM pg_notify(\'updates\', json_build_object(\'op\', TG_OP, \'id\', NEW.id)::text);\n  RETURN NEW;\nEND; $$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trg_notify AFTER INSERT OR UPDATE ON items\nFOR EACH ROW EXECUTE FUNCTION notify_change();',
          hints: ['pg_notify(channel, payload) sends from code', 'json_build_object creates JSON payloads'],
          challenge: 'Build a real-time notification system: database triggers send notifications, a Node.js worker processes them and sends WebSocket updates to clients.',
          reqs: ['Trigger on multiple tables', 'JSON payloads with operation details', 'Node.js LISTEN handler', 'WebSocket broadcast to clients'],
          tests: [['insert triggers notify', 'listener receives', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Connection with Node.js', slug: 'pg-nodejs',
      description: 'Connect to PostgreSQL from Node.js using the pg library.',
      language: 'javascript', difficulty: 'beginner', duration: 35,
      tags: ['postgresql', 'postgres', 'nodejs', 'database'],
      category: 'Database',
      objectives: ['Connect with connection pool', 'Execute parameterized queries', 'Handle transactions in Node.js'],
      steps: [
        S(1, {
          title: 'Node.js and PostgreSQL', content: 'The pg library provides a connection pool and query interface for PostgreSQL.',
          lang: 'javascript', code: 'const { Pool } = require("pg");\n\nconst pool = new Pool({\n  host: "localhost",\n  port: 5432,\n  database: "myapp",\n  user: "postgres",\n  password: "password",\n  max: 20\n});\n\n// Parameterized query (prevents SQL injection)\nconst result = await pool.query(\n  "SELECT * FROM users WHERE email = $1 AND is_active = $2",\n  ["alice@test.com", true]\n);\nconsole.log(result.rows);\n\n// Transaction\nconst client = await pool.connect();\ntry {\n  await client.query("BEGIN");\n  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [100, 1]);\n  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [100, 2]);\n  await client.query("COMMIT");\n} catch (e) {\n  await client.query("ROLLBACK");\n} finally {\n  client.release();\n}',
          concept: 'Pool manages reusable connections. Parameterized queries ($1, $2) prevent SQL injection. For transactions, acquire a client from the pool, run BEGIN/COMMIT/ROLLBACK, then release.',
          keyPoints: ['Pool: reusable connection management', '$1, $2 for parameterized queries', 'client.release() returns connection to pool', 'Always ROLLBACK on error'],
          realWorld: 'Express.js APIs use a shared Pool instance to handle thousands of concurrent database queries efficiently.',
          mistakes: ['Not releasing client after transaction', 'String interpolation instead of parameters (SQL injection)', 'Creating new Pool per request'],
          pInstructions: ['Set up a connection pool', 'Execute a parameterized query', 'Run a transaction with error handling'],
          starter: 'const { Pool } = require("pg");\nconst pool = new Pool({ /* config */ });\n\n// Query with parameters\n// Transaction with BEGIN/COMMIT/ROLLBACK',
          solution: 'const { Pool } = require("pg");\nconst pool = new Pool({ connectionString: "postgresql://localhost/myapp" });\n\nasync function getUser(email) {\n  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);\n  return rows[0];\n}\n\nasync function transfer(from, to, amount) {\n  const client = await pool.connect();\n  try {\n    await client.query("BEGIN");\n    await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, from]);\n    await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, to]);\n    await client.query("COMMIT");\n  } catch (e) {\n    await client.query("ROLLBACK");\n    throw e;\n  } finally {\n    client.release();\n  }\n}',
          hints: ['Use $1, $2 (not ?) for parameters', 'Always release client in finally block'],
          challenge: 'Build a complete CRUD API with Express.js and PostgreSQL: connection pooling, parameterized queries, transactions, and error handling.',
          reqs: ['Shared pool instance', 'All CRUD endpoints', 'Parameterized queries everywhere', 'Transaction for complex operations'],
          tests: [['POST /users', 'creates user', 5], ['GET /users', 'returns list', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Aggregate and Set Functions', slug: 'pg-aggregates',
      description: 'Master advanced aggregation with array_agg, string_agg, and custom aggregates.',
      language: 'sql', difficulty: 'intermediate', duration: 35,
      tags: ['postgresql', 'postgres', 'aggregation', 'database'],
      category: 'Database',
      objectives: ['Use PostgreSQL-specific aggregates', 'Build complex reports', 'Create custom aggregate functions'],
      steps: [
        S(1, {
          title: 'Advanced Aggregation', content: 'PostgreSQL provides powerful aggregate functions beyond standard SQL.',
          lang: 'sql', code: '-- array_agg: collect values into array\nSELECT department, array_agg(first_name ORDER BY first_name) AS members\nFROM employees GROUP BY department;\n\n-- string_agg: concatenate strings\nSELECT department, string_agg(first_name, \', \' ORDER BY first_name) AS member_list\nFROM employees GROUP BY department;\n\n-- jsonb_agg: collect as JSON array\nSELECT department,\n  jsonb_agg(jsonb_build_object(\'name\', first_name, \'salary\', salary)) AS members\nFROM employees GROUP BY department;\n\n-- FILTER clause\nSELECT\n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE salary > 80000) AS high_earners,\n  AVG(salary) FILTER (WHERE department = \'Engineering\') AS eng_avg\nFROM employees;\n\n-- GROUPING SETS\nSELECT department, role, COUNT(*), AVG(salary)\nFROM employees\nGROUP BY GROUPING SETS ((department), (role), (department, role), ());',
          concept: 'array_agg collects values into arrays. string_agg concatenates. jsonb_agg builds JSON arrays. FILTER conditionally includes rows. GROUPING SETS computes multiple groupings in one query.',
          keyPoints: ['array_agg: values to array', 'string_agg: values to comma-separated string', 'FILTER: conditional aggregation', 'GROUPING SETS: multiple GROUP BYs in one query'],
          realWorld: 'Report generators use GROUPING SETS to produce subtotals and grand totals in a single query instead of multiple UNION queries.',
          mistakes: ['Forgetting ORDER BY in array_agg', 'FILTER vs CASE WHEN (FILTER is cleaner)', 'NULL handling in aggregates'],
          pInstructions: ['Aggregate employee names into arrays per department', 'Use FILTER for conditional counts', 'Use GROUPING SETS for multi-level summary'],
          starter: '-- Array of names per department\n-- Conditional counts with FILTER\n-- GROUPING SETS for summary',
          solution: 'SELECT department, array_agg(first_name ORDER BY first_name) AS names\nFROM employees GROUP BY department;\n\nSELECT\n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE salary > 80000) AS high,\n  COUNT(*) FILTER (WHERE salary <= 80000) AS low\nFROM employees;\n\nSELECT department, role, COUNT(*)\nFROM employees\nGROUP BY GROUPING SETS ((department), (role), ());',
          hints: ['FILTER (WHERE ...) is cleaner than CASE in aggregates', 'GROUPING SETS () gives grand total'],
          challenge: 'Build a comprehensive pivot report: departments as columns, roles as rows, with counts, averages, and totals using GROUPING SETS and FILTER.',
          reqs: ['Pivot table structure', 'Row and column totals', 'FILTER for each column', 'GROUPING SETS for subtotals'],
          tests: [['pivot report', 'all cells filled', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL COPY and Bulk Loading', slug: 'pg-copy-bulk-loading',
      description: 'Efficiently load large datasets with COPY and bulk insert techniques.',
      language: 'sql', difficulty: 'intermediate', duration: 30,
      tags: ['postgresql', 'postgres', 'copy', 'bulk-loading', 'database'],
      category: 'Database',
      objectives: ['Use COPY for fast data loading', 'Export data with COPY TO', 'Optimize bulk insert performance'],
      steps: [
        S(1, {
          title: 'COPY for Bulk Operations', content: 'COPY is the fastest way to load data into PostgreSQL.',
          lang: 'sql', code: '-- COPY from CSV file (server-side)\nCOPY users (username, email, created_at)\nFROM \'/path/to/users.csv\'\nWITH (FORMAT csv, HEADER true, DELIMITER \',\');\n\n-- \\copy from client (psql)\n-- \\copy users FROM \'users.csv\' WITH (FORMAT csv, HEADER true)\n\n-- COPY to file (export)\nCOPY (SELECT * FROM users WHERE is_active = true)\nTO \'/tmp/active_users.csv\'\nWITH (FORMAT csv, HEADER true);\n\n-- Performance tips for bulk loading\nBEGIN;\nSET LOCAL synchronous_commit = off;\n-- Drop indexes before bulk load\nDROP INDEX IF EXISTS idx_users_email;\nCOPY users FROM \'/path/to/big_file.csv\' WITH (FORMAT csv);\n-- Recreate indexes after\nCREATE INDEX idx_users_email ON users (email);\nCOMMIT;\nANALYZE users;',
          concept: 'COPY loads data directly from files (much faster than INSERT). Drop indexes before loading, recreate after. ANALYZE updates statistics. synchronous_commit=off speeds up bulk writes.',
          keyPoints: ['COPY is 10-100x faster than INSERT', '\\copy works from client, COPY from server', 'Drop indexes before bulk load', 'ANALYZE after loading'],
          realWorld: 'Data warehouses use COPY to load millions of rows from ETL pipelines in minutes instead of hours.',
          mistakes: ['COPY needs server file access (use \\copy for client)', 'Not ANALYZEing after bulk load', 'Keeping indexes during load (slow)'],
          pInstructions: ['Load a CSV file with COPY', 'Export query results to CSV', 'Optimize a bulk load operation'],
          starter: '-- Load from CSV\n-- Export active users\n-- Optimize bulk loading',
          solution: 'COPY products (name, price, category)\nFROM \'/tmp/products.csv\'\nWITH (FORMAT csv, HEADER true);\n\nCOPY (SELECT name, price FROM products WHERE price > 100)\nTO \'/tmp/expensive.csv\'\nWITH (FORMAT csv, HEADER true);\n\n-- Optimized bulk load\nBEGIN;\nDROP INDEX IF EXISTS idx_products_name;\nCOPY products FROM \'/tmp/bulk.csv\' WITH (FORMAT csv);\nCREATE INDEX idx_products_name ON products (name);\nCOMMIT;\nANALYZE products;',
          hints: ['HEADER true skips/includes the header row', 'ANALYZE updates query planner statistics'],
          challenge: 'Build an ETL pipeline: load 1M rows from CSV, transform with SQL, load into destination table, verify counts, and measure throughput.',
          reqs: ['COPY for fast loading', 'SQL transformations', 'Verification queries', 'Report rows/second throughput'],
          tests: [['load 1M rows', 'all loaded', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Inheritance and Table Types', slug: 'pg-inheritance',
      description: 'Use table inheritance and custom types for advanced schema design.',
      language: 'sql', difficulty: 'advanced', duration: 35,
      tags: ['postgresql', 'postgres', 'inheritance', 'custom-types', 'database'],
      category: 'Database',
      objectives: ['Use table inheritance', 'Create composite types', 'Understand domain types'],
      steps: [
        S(1, {
          title: 'Table Inheritance and Types', content: 'PostgreSQL supports object-relational features like table inheritance.',
          lang: 'sql', code: '-- Table inheritance\nCREATE TABLE vehicles (\n  id SERIAL PRIMARY KEY,\n  make VARCHAR(50),\n  model VARCHAR(50),\n  year INT\n);\n\nCREATE TABLE cars (\n  doors INT DEFAULT 4,\n  trunk_size NUMERIC\n) INHERITS (vehicles);\n\nCREATE TABLE trucks (\n  payload_tons NUMERIC,\n  bed_length NUMERIC\n) INHERITS (vehicles);\n\n-- Query all vehicles (includes cars and trucks)\nSELECT * FROM vehicles;\n-- Query only cars\nSELECT * FROM ONLY vehicles;\n\n-- Domain type (constrained type)\nCREATE DOMAIN email AS VARCHAR(255)\n  CHECK (VALUE ~ \'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\');\n\nCREATE TABLE contacts (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL,\n  email_address email NOT NULL\n);',
          concept: 'Table inheritance lets child tables inherit columns from parent. Queries on parent include child rows. ONLY keyword excludes children. Domains create reusable constrained types.',
          keyPoints: ['INHERITS adds parent columns to child', 'Parent queries include all children', 'ONLY queries exclude children', 'Domains create reusable type constraints'],
          realWorld: 'Geographic information systems use inheritance: base location table with specialized subtypes for buildings, roads, and parks.',
          mistakes: ['Inheritance does not inherit indexes', 'UNIQUE constraints do not span inheritance', 'Foreign keys do not work well with inheritance'],
          pInstructions: ['Create a parent table and two child tables', 'Query parent to see all rows', 'Create a domain type with validation'],
          starter: '-- Parent and child tables\n-- Query parent and ONLY parent\n-- Domain type with constraint',
          solution: 'CREATE TABLE shapes (id SERIAL PRIMARY KEY, color VARCHAR(30));\nCREATE TABLE circles (radius NUMERIC) INHERITS (shapes);\nCREATE TABLE rectangles (width NUMERIC, height NUMERIC) INHERITS (shapes);\n\nINSERT INTO circles (color, radius) VALUES (\'red\', 5);\nINSERT INTO rectangles (color, width, height) VALUES (\'blue\', 10, 20);\n\nSELECT * FROM shapes;  -- Both\nSELECT * FROM ONLY shapes;  -- Neither\n\nCREATE DOMAIN positive_int AS INT CHECK (VALUE > 0);',
          hints: ['SELECT FROM parent includes all child rows', 'ONLY keyword restricts to that exact table'],
          challenge: 'Design a content management system using inheritance: base content type with specialized blog posts, pages, and media. Include common fields in parent.',
          reqs: ['Parent content table', 'At least 3 child types', 'Domain types for URLs and slugs', 'Query across all content types'],
          tests: [['query parent', 'all types included', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Foreign Data Wrappers', slug: 'pg-fdw',
      description: 'Query external data sources directly from PostgreSQL.',
      language: 'sql', difficulty: 'advanced', duration: 40,
      tags: ['postgresql', 'postgres', 'fdw', 'integration', 'database'],
      category: 'Database',
      objectives: ['Set up postgres_fdw', 'Query remote PostgreSQL databases', 'Understand FDW performance'],
      steps: [
        S(1, {
          title: 'Foreign Data Wrappers', content: 'FDW lets PostgreSQL query external data sources as if they were local tables.',
          lang: 'sql', code: '-- Install extension\nCREATE EXTENSION IF NOT EXISTS postgres_fdw;\n\n-- Create foreign server\nCREATE SERVER remote_db\n  FOREIGN DATA WRAPPER postgres_fdw\n  OPTIONS (host \'remote-host\', port \'5432\', dbname \'analytics\');\n\n-- Create user mapping\nCREATE USER MAPPING FOR current_user\n  SERVER remote_db\n  OPTIONS (user \'reader\', password \'readpass\');\n\n-- Create foreign table\nCREATE FOREIGN TABLE remote_orders (\n  id INT, customer_id INT, total NUMERIC, order_date DATE\n)\n  SERVER remote_db\n  OPTIONS (schema_name \'public\', table_name \'orders\');\n\n-- Query as if local\nSELECT * FROM remote_orders WHERE order_date > \'2024-01-01\';\n\n-- JOIN local and remote\nSELECT c.name, r.total\nFROM customers c\nJOIN remote_orders r ON c.id = r.customer_id;',
          concept: 'FDW creates virtual tables that proxy queries to external sources. postgres_fdw connects to other PostgreSQL databases. Other FDWs exist for MySQL, MongoDB, CSV files, and more.',
          keyPoints: ['FDW makes remote data look local', 'postgres_fdw for PostgreSQL-to-PostgreSQL', 'WHERE pushdown sends filters to remote', 'JOINs between local and remote tables'],
          realWorld: 'Microservice architectures use FDW to query across service databases without ETL or API calls.',
          mistakes: ['Network latency for large queries', 'Not all operations push down to remote', 'Security: credentials stored in server'],
          pInstructions: ['Set up postgres_fdw extension', 'Create a foreign server and table', 'Query remote data and join with local'],
          starter: '-- Create extension\n-- Create server\n-- Create user mapping\n-- Create foreign table\n-- Query',
          solution: 'CREATE EXTENSION IF NOT EXISTS postgres_fdw;\n\nCREATE SERVER remote FOREIGN DATA WRAPPER postgres_fdw\n  OPTIONS (host \'db2\', dbname \'analytics\');\n\nCREATE USER MAPPING FOR CURRENT_USER SERVER remote\n  OPTIONS (user \'readonly\', password \'pass\');\n\nCREATE FOREIGN TABLE remote_stats (month DATE, revenue NUMERIC)\n  SERVER remote OPTIONS (table_name \'monthly_stats\');\n\nSELECT * FROM remote_stats WHERE month >= \'2024-01-01\';',
          hints: ['IMPORT FOREIGN SCHEMA can auto-create all foreign tables', 'Use EXPLAIN to verify filter pushdown'],
          challenge: 'Set up cross-database reporting: connect to 2 remote databases, create foreign tables, and build a unified reporting view that joins data from all three sources.',
          reqs: ['2 foreign servers', 'Foreign tables from each', 'View joining all sources', 'Verify filter pushdown with EXPLAIN'],
          tests: [['cross-database join', 'returns combined data', 5]]
        })
      ]
    }),

    T({
      title: 'PostgreSQL Migration with Node.js', slug: 'pg-migrations-nodejs',
      description: 'Manage database schema changes with versioned migrations in Node.js.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['postgresql', 'postgres', 'migrations', 'nodejs', 'database'],
      category: 'Database',
      objectives: ['Write up and down migrations', 'Track migration versions', 'Roll back safely'],
      steps: [
        S(1, {
          title: 'Database Migrations', content: 'Migrations version-control your database schema changes.',
          lang: 'javascript', code: '// Simple migration runner\nconst { Pool } = require("pg");\nconst pool = new Pool({ connectionString: "postgresql://localhost/myapp" });\n\nconst migrations = [\n  {\n    version: 1,\n    up: "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE)",\n    down: "DROP TABLE users"\n  },\n  {\n    version: 2,\n    up: "ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT NOW()",\n    down: "ALTER TABLE users DROP COLUMN created_at"\n  }\n];\n\nasync function migrate() {\n  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (version INT PRIMARY KEY)");\n  const { rows } = await pool.query("SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1");\n  const current = rows[0]?.version || 0;\n  \n  for (const m of migrations) {\n    if (m.version > current) {\n      await pool.query("BEGIN");\n      await pool.query(m.up);\n      await pool.query("INSERT INTO schema_migrations (version) VALUES ($1)", [m.version]);\n      await pool.query("COMMIT");\n      console.log("Applied migration", m.version);\n    }\n  }\n}\nmigrate();',
          concept: 'Migrations track schema changes as versioned scripts. Each has an up (apply) and down (rollback). A schema_migrations table records which versions have been applied. Run in transactions for safety.',
          keyPoints: ['Migrations = versioned schema changes', 'up: apply change, down: rollback', 'schema_migrations tracks current version', 'Run each migration in a transaction'],
          realWorld: 'Every production application uses migrations to safely evolve the database schema alongside code deployments.',
          mistakes: ['Not wrapping migrations in transactions', 'Irreversible migrations without down', 'Running migrations without testing rollback'],
          pInstructions: ['Create a migration tracking table', 'Write 2 migrations with up and down', 'Run migrations and verify'],
          starter: 'const migrations = [\n  { version: 1, up: "...", down: "..." },\n  { version: 2, up: "...", down: "..." }\n];\n\nasync function migrate(pool) {\n  // Track and apply migrations\n}',
          solution: 'async function migrate(pool) {\n  await pool.query("CREATE TABLE IF NOT EXISTS migrations (version INT PRIMARY KEY, applied_at TIMESTAMP DEFAULT NOW())");\n  const { rows } = await pool.query("SELECT MAX(version) AS v FROM migrations");\n  const current = rows[0].v || 0;\n  const pending = migrations.filter(m => m.version > current);\n  for (const m of pending) {\n    const client = await pool.connect();\n    try {\n      await client.query("BEGIN");\n      await client.query(m.up);\n      await client.query("INSERT INTO migrations (version) VALUES ($1)", [m.version]);\n      await client.query("COMMIT");\n    } catch (e) {\n      await client.query("ROLLBACK");\n      throw e;\n    } finally {\n      client.release();\n    }\n  }\n}',
          hints: ['Use transactions so failed migrations leave no partial changes', 'MAX(version) finds the current state'],
          challenge: 'Build a complete migration tool: up/down commands, dry-run mode, status display, and seed data support.',
          reqs: ['migrate up/down commands', 'Rollback specific number of versions', 'Status showing pending migrations', 'Seed data after migrations'],
          tests: [['migrate up', 'tables created', 5], ['migrate down', 'tables dropped', 5]]
        })
      ]
    })
  ];
};
