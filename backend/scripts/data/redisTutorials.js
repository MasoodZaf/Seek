// 25 Redis Tutorials with full 3-phase content
module.exports = function (T, S) {
  return [
    T({
      title: 'Redis Introduction and Setup', slug: 'redis-introduction-setup',
      description: 'Get started with Redis: understand in-memory data storage and basic commands.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['redis', 'nosql', 'cache', 'database'],
      category: 'Database',
      objectives: ['Understand Redis as an in-memory store', 'Connect to Redis', 'Use basic SET/GET commands'],
      featured: true,
      steps: [
        S(1, {
          title: 'What is Redis?', content: 'Redis is an in-memory key-value data store used for caching, sessions, and real-time data.',
          lang: 'javascript', code: 'const Redis = require("ioredis");\nconst redis = new Redis();\n\n// SET and GET\nawait redis.set("greeting", "Hello Redis!");\nconst value = await redis.get("greeting");\nconsole.log(value); // "Hello Redis!"\n\n// SET with expiration (seconds)\nawait redis.set("session", "abc123", "EX", 3600);\n\n// Check TTL\nconst ttl = await redis.ttl("session");\nconsole.log("TTL:", ttl);\n\n// DELETE\nawait redis.del("greeting");\n\n// Check existence\nconst exists = await redis.exists("greeting");\nconsole.log("Exists:", exists); // 0',
          concept: 'Redis stores data in memory for ultra-fast access. Keys are strings. Values can be strings, lists, sets, hashes, and more. Data can have TTL (time-to-live) for automatic expiration.',
          keyPoints: ['In-memory: sub-millisecond reads', 'Key-value pairs', 'SET/GET for strings', 'EX sets expiration in seconds'],
          realWorld: 'Web applications use Redis to cache database query results, reducing response times from 100ms to under 1ms.',
          mistakes: ['Not setting TTL on cache keys (memory leak)', 'Storing too much data (RAM is expensive)', 'Not handling connection errors'],
          pInstructions: ['Connect to Redis', 'SET a key with a value', 'GET the value and log it', 'SET with expiration and check TTL'],
          starter: 'const Redis = require("ioredis");\nconst redis = new Redis();\n\n// Set a key\n// Get and log it\n// Set with TTL\n// Check TTL',
          solution: 'const Redis = require("ioredis");\nconst redis = new Redis();\n\nawait redis.set("name", "Alice");\nconsole.log(await redis.get("name"));\n\nawait redis.set("token", "xyz", "EX", 300);\nconsole.log("TTL:", await redis.ttl("token"));\n\nawait redis.del("name");\nconsole.log("Exists:", await redis.exists("name"));',
          hints: ['EX sets seconds, PX sets milliseconds', 'TTL returns -1 if no expiry, -2 if key missing'],
          challenge: 'Build a simple key-value store CLI: support SET, GET, DEL, TTL, KEYS commands with error handling.',
          reqs: ['SET key value [EX seconds]', 'GET key', 'DEL key', 'TTL key', 'KEYS pattern'],
          tests: [['SET then GET', 'returns value', 5], ['DEL then GET', 'returns null', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Strings and Numbers', slug: 'redis-strings-numbers',
      description: 'Work with string operations, counters, and atomic increments.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['redis', 'strings', 'counters', 'database'],
      category: 'Database',
      objectives: ['Use string manipulation commands', 'Implement counters with INCR/DECR', 'Use MSET/MGET for batch operations'],
      steps: [
        S(1, {
          title: 'String Operations and Counters', content: 'Redis strings support append, range operations, and atomic numeric operations.',
          lang: 'javascript', code: '// Counters\nawait redis.set("visitors", 0);\nawait redis.incr("visitors");\nawait redis.incr("visitors");\nawait redis.incrby("visitors", 10);\nconsole.log(await redis.get("visitors")); // "12"\n\n// MSET/MGET for batch operations\nawait redis.mset("name", "Alice", "age", "30", "city", "NYC");\nconst values = await redis.mget("name", "age", "city");\nconsole.log(values); // ["Alice", "30", "NYC"]\n\n// String operations\nawait redis.set("msg", "Hello");\nawait redis.append("msg", " World");\nconsole.log(await redis.get("msg")); // "Hello World"\nconsole.log(await redis.strlen("msg")); // 11\n\n// SETNX - set only if not exists\nconst wasSet = await redis.setnx("lock", "acquired");\nconsole.log(wasSet); // 1 (set) or 0 (already exists)',
          concept: 'INCR/DECR atomically increment/decrement integers. MSET/MGET handle multiple keys in one call. SETNX (SET if Not eXists) is the basis for distributed locks. All operations are atomic.',
          keyPoints: ['INCR/INCRBY: atomic counters', 'MSET/MGET: batch operations', 'SETNX: set only if key does not exist', 'All Redis operations are atomic'],
          realWorld: 'Social media platforms use INCR for real-time like counts, view counts, and rate limiting counters.',
          mistakes: ['Forgetting INCR works on strings that look like numbers', 'MGET returns null for missing keys', 'Not using EX with SETNX for locks (deadlock risk)'],
          pInstructions: ['Create a page view counter', 'Use MSET/MGET for user profile', 'Implement SETNX for simple locking'],
          starter: '// Page view counter with INCR\n// User profile with MSET/MGET\n// Simple lock with SETNX',
          solution: 'await redis.set("page:home:views", 0);\nawait redis.incr("page:home:views");\nawait redis.incr("page:home:views");\nconsole.log("Views:", await redis.get("page:home:views"));\n\nawait redis.mset("user:1:name", "Alice", "user:1:email", "alice@test.com");\nconst profile = await redis.mget("user:1:name", "user:1:email");\nconsole.log("Profile:", profile);\n\nconst locked = await redis.set("lock:resource", "owner1", "NX", "EX", 30);\nconsole.log("Lock acquired:", locked === "OK");',
          hints: ['SET key value NX EX 30 combines SETNX with expiry', 'Use key namespacing: prefix:id:field'],
          challenge: 'Build a rate limiter: allow N requests per minute per user. Use INCR and EXPIRE to track and limit.',
          reqs: ['Track requests per user per minute', 'Return remaining requests', 'Block when limit exceeded', 'Auto-reset with TTL'],
          tests: [['5 requests allowed', '5 succeed', 5], ['6th request', 'blocked', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Lists', slug: 'redis-lists',
      description: 'Use Redis lists for queues, stacks, and ordered collections.',
      language: 'javascript', difficulty: 'beginner', duration: 35,
      tags: ['redis', 'lists', 'queues', 'database'],
      category: 'Database',
      objectives: ['Push and pop from lists', 'Build queues and stacks', 'Use blocking list operations'],
      steps: [
        S(1, {
          title: 'List Operations', content: 'Redis lists are linked lists supporting push/pop from both ends.',
          lang: 'javascript', code: '// Push to list\nawait redis.rpush("tasks", "task1", "task2", "task3");\nawait redis.lpush("tasks", "urgent-task");\n\n// Get list range\nconst all = await redis.lrange("tasks", 0, -1);\nconsole.log(all); // ["urgent-task", "task1", "task2", "task3"]\n\n// Pop from list\nconst first = await redis.lpop("tasks");  // Remove from left\nconst last = await redis.rpop("tasks");   // Remove from right\n\n// Get length\nconsole.log(await redis.llen("tasks"));\n\n// Blocking pop (waits for data)\n// const [key, value] = await redis.blpop("queue", 5); // 5 second timeout\n\n// Trim to last N elements\nawait redis.ltrim("logs", -100, -1); // Keep last 100',
          concept: 'RPUSH adds to the right, LPUSH to the left. RPOP/LPOP remove from right/left. LRANGE reads a range (0 to -1 = all). BLPOP blocks until data is available — perfect for worker queues.',
          keyPoints: ['RPUSH/LPUSH: add to right/left', 'RPOP/LPOP: remove from right/left', 'LRANGE: read range without removing', 'BLPOP: blocking pop for queues'],
          realWorld: 'Job queues use RPUSH to enqueue and BLPOP to dequeue — workers block until a job is available.',
          mistakes: ['Using LRANGE on very large lists (O(n))', 'Not using LTRIM to cap list size', 'Blocking operations in main thread'],
          pInstructions: ['Build a task queue with RPUSH and LPOP', 'Use LRANGE to view all tasks', 'Use LTRIM to limit queue size'],
          starter: '// Add tasks to queue\n// View all tasks\n// Process (pop) a task\n// Limit to 100 items',
          solution: 'await redis.rpush("queue", "email:send", "image:resize", "report:generate");\nconst tasks = await redis.lrange("queue", 0, -1);\nconsole.log("Queue:", tasks);\n\nconst task = await redis.lpop("queue");\nconsole.log("Processing:", task);\n\nawait redis.ltrim("queue", 0, 99);',
          hints: ['LPOP for FIFO queue, RPOP for LIFO stack', 'LTRIM keeps elements in the specified range'],
          challenge: 'Build a priority task queue: urgent tasks go to the front (LPUSH), normal tasks to the back (RPUSH). Add a worker that processes tasks with BLPOP.',
          reqs: ['Urgent tasks use LPUSH', 'Normal tasks use RPUSH', 'Worker uses BLPOP', 'Log processed tasks'],
          tests: [['urgent first', 'processed before normal', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Hashes', slug: 'redis-hashes',
      description: 'Store and manipulate structured data with Redis hash maps.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['redis', 'hashes', 'data-structures', 'database'],
      category: 'Database',
      objectives: ['Store objects as hashes', 'Get and set individual fields', 'Use hash operations efficiently'],
      steps: [
        S(1, {
          title: 'Hash Operations', content: 'Redis hashes store field-value pairs under a single key — like a mini dictionary.',
          lang: 'javascript', code: '// Set hash fields\nawait redis.hset("user:1", "name", "Alice", "age", "30", "email", "alice@test.com");\n\n// Get single field\nconst name = await redis.hget("user:1", "name");\nconsole.log(name); // "Alice"\n\n// Get all fields\nconst user = await redis.hgetall("user:1");\nconsole.log(user); // { name: "Alice", age: "30", email: "alice@test.com" }\n\n// Increment a numeric field\nawait redis.hincrby("user:1", "login_count", 1);\n\n// Check field existence\nconst hasEmail = await redis.hexists("user:1", "email");\n\n// Delete a field\nawait redis.hdel("user:1", "email");\n\n// Get specific fields\nconst partial = await redis.hmget("user:1", "name", "age");\nconsole.log(partial); // ["Alice", "30"]',
          concept: 'Hashes group related fields under one key. More memory-efficient than separate keys for small objects. HSET sets fields, HGET reads one, HGETALL reads all. HINCRBY atomically increments.',
          keyPoints: ['HSET key field value for setting', 'HGETALL returns all fields as object', 'HINCRBY for atomic field increment', 'More efficient than separate string keys'],
          realWorld: 'User sessions store user profile data in a hash: name, email, role, login time — all accessible by session ID.',
          mistakes: ['All hash values are strings', 'HGETALL on large hashes is expensive', 'Not checking HEXISTS before HGET'],
          pInstructions: ['Create a product hash with multiple fields', 'Read individual and all fields', 'Increment a numeric field'],
          starter: '// Create product hash\n// Read name field\n// Read all fields\n// Increment stock count',
          solution: 'await redis.hset("product:1", "name", "Laptop", "price", "999.99", "stock", "50");\nconsole.log("Name:", await redis.hget("product:1", "name"));\nconsole.log("All:", await redis.hgetall("product:1"));\nawait redis.hincrby("product:1", "stock", -1);\nconsole.log("Stock after sale:", await redis.hget("product:1", "stock"));',
          hints: ['HINCRBY with negative value decrements', 'All values are stored as strings'],
          challenge: 'Build a user profile system: store profiles as hashes, support partial updates, track login counts, and list all users.',
          reqs: ['Store profiles with HSET', 'Update individual fields', 'Track login count with HINCRBY', 'List all user keys with SCAN'],
          tests: [['create and read profile', 'all fields returned', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Sets', slug: 'redis-sets',
      description: 'Use Redis sets for unique collections, intersections, and unions.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['redis', 'sets', 'data-structures', 'database'],
      category: 'Database',
      objectives: ['Add and check set members', 'Perform set operations (union, intersect, diff)', 'Use sets for unique tracking'],
      steps: [
        S(1, {
          title: 'Set Operations', content: 'Redis sets store unique members with O(1) add/check and support set math.',
          lang: 'javascript', code: '// Add members\nawait redis.sadd("tags:post1", "javascript", "nodejs", "redis");\nawait redis.sadd("tags:post2", "python", "redis", "database");\n\n// Check membership\nconst isMember = await redis.sismember("tags:post1", "redis"); // 1\n\n// Get all members\nconst tags = await redis.smembers("tags:post1");\nconsole.log(tags);\n\n// Set operations\nconst common = await redis.sinter("tags:post1", "tags:post2"); // ["redis"]\nconst all = await redis.sunion("tags:post1", "tags:post2");\nconst unique = await redis.sdiff("tags:post1", "tags:post2"); // ["javascript", "nodejs"]\n\n// Random member\nconst random = await redis.srandmember("tags:post1");\n\n// Count\nconsole.log(await redis.scard("tags:post1")); // 3',
          concept: 'Sets guarantee uniqueness. SADD adds members (duplicates ignored). SISMEMBER checks in O(1). SINTER finds common members, SUNION combines, SDIFF finds differences.',
          keyPoints: ['SADD: add unique members', 'SISMEMBER: O(1) membership check', 'SINTER: intersection', 'SUNION: union, SDIFF: difference'],
          realWorld: 'Social media platforms use sets for followers/following, tracking unique visitors, and finding mutual friends (SINTER).',
          mistakes: ['Sets are unordered', 'SMEMBERS on huge sets is expensive', 'Not using SSCAN for large sets'],
          pInstructions: ['Create sets for user skills', 'Find common skills between two users', 'Find unique skills for each user'],
          starter: '// Create skill sets for two users\n// Find common skills\n// Find skills unique to user 1',
          solution: 'await redis.sadd("skills:alice", "javascript", "python", "redis", "sql");\nawait redis.sadd("skills:bob", "python", "java", "redis", "mongodb");\n\nconst common = await redis.sinter("skills:alice", "skills:bob");\nconsole.log("Common:", common);\n\nconst aliceOnly = await redis.sdiff("skills:alice", "skills:bob");\nconsole.log("Alice unique:", aliceOnly);',
          hints: ['SINTER finds intersection (common elements)', 'SDIFF finds elements in first set not in second'],
          challenge: 'Build a tagging system: add tags to items, find items by tag, find related tags, and get tag popularity (SCARD).',
          reqs: ['Tag items with SADD', 'Find items by tag', 'Find related tags with SINTER', 'Sort tags by popularity'],
          tests: [['find common tags', 'correct intersection', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Sorted Sets', slug: 'redis-sorted-sets',
      description: 'Build leaderboards and ranking systems with sorted sets.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['redis', 'sorted-sets', 'leaderboards', 'database'],
      category: 'Database',
      objectives: ['Add members with scores', 'Query by rank and score range', 'Build real-time leaderboards'],
      featured: true,
      steps: [
        S(1, {
          title: 'Sorted Set Operations', content: 'Sorted sets maintain members ordered by score, perfect for leaderboards.',
          lang: 'javascript', code: '// Add with scores\nawait redis.zadd("leaderboard", 100, "alice", 85, "bob", 92, "carol", 78, "dave");\n\n// Top players (highest first)\nconst top = await redis.zrevrange("leaderboard", 0, 2, "WITHSCORES");\nconsole.log(top); // ["alice", "100", "carol", "92", "bob", "85"]\n\n// Get rank (0-based, highest=0)\nconst rank = await redis.zrevrank("leaderboard", "bob");\nconsole.log("Bob rank:", rank); // 2\n\n// Get score\nconst score = await redis.zscore("leaderboard", "alice");\n\n// Increment score\nawait redis.zincrby("leaderboard", 15, "bob"); // bob now 100\n\n// Range by score\nconst above90 = await redis.zrangebyscore("leaderboard", 90, "+inf", "WITHSCORES");\n\n// Count in range\nconst count = await redis.zcount("leaderboard", 80, 100);',
          concept: 'ZADD adds members with scores. ZREVRANGE returns top N (descending). ZREVRANK gives rank position. ZINCRBY atomically updates scores. Perfect for leaderboards, priority queues, and time-series.',
          keyPoints: ['ZADD: add with score', 'ZREVRANGE: top N descending', 'ZREVRANK: rank position', 'ZINCRBY: atomic score update'],
          realWorld: 'Gaming platforms use sorted sets for real-time leaderboards that update instantly as players earn points.',
          mistakes: ['ZRANGE is ascending, ZREVRANGE is descending', 'Rank is 0-based', 'Large sorted sets: use ZSCAN for iteration'],
          pInstructions: ['Create a leaderboard with player scores', 'Get top 3 players', 'Update a score and check new rank'],
          starter: '// Add players with scores\n// Get top 3\n// Increment a score\n// Check new rankings',
          solution: 'await redis.zadd("scores", 250, "player1", 180, "player2", 320, "player3", 290, "player4");\n\nconst top3 = await redis.zrevrange("scores", 0, 2, "WITHSCORES");\nconsole.log("Top 3:", top3);\n\nawait redis.zincrby("scores", 50, "player2");\nconsole.log("Player2 new rank:", await redis.zrevrank("scores", "player2"));\nconsole.log("Player2 new score:", await redis.zscore("scores", "player2"));',
          hints: ['ZREVRANGE for descending order (typical leaderboard)', 'WITHSCORES includes scores in results'],
          challenge: 'Build a complete leaderboard system: add scores, get top N, get player rank, get players around a rank, and support multiple time periods (daily, weekly, all-time).',
          reqs: ['Daily and all-time leaderboards', 'Top N query', 'Rank and surrounding players', 'Score update with ZINCRBY'],
          tests: [['top 5 query', '5 players descending', 5], ['rank query', 'correct position', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Pub/Sub', slug: 'redis-pubsub',
      description: 'Implement real-time messaging with Redis publish/subscribe.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'pub-sub', 'messaging', 'database'],
      category: 'Database',
      objectives: ['Publish messages to channels', 'Subscribe to channels', 'Use pattern subscriptions'],
      steps: [
        S(1, {
          title: 'Publish and Subscribe', content: 'Redis pub/sub enables real-time message broadcasting between processes.',
          lang: 'javascript', code: 'const Redis = require("ioredis");\n\n// Subscriber (dedicated connection)\nconst sub = new Redis();\nsub.subscribe("notifications", "alerts");\nsub.on("message", (channel, message) => {\n  console.log("Channel:", channel, "Message:", message);\n});\n\n// Pattern subscribe\nsub.psubscribe("user:*");\nsub.on("pmessage", (pattern, channel, message) => {\n  console.log("Pattern:", pattern, "Channel:", channel, "Msg:", message);\n});\n\n// Publisher (separate connection)\nconst pub = new Redis();\nawait pub.publish("notifications", JSON.stringify({ type: "info", text: "Hello!" }));\nawait pub.publish("user:42", "logged_in");\nawait pub.publish("alerts", "Server CPU high");',
          concept: 'SUBSCRIBE listens on specific channels. PSUBSCRIBE uses patterns (user:*). PUBLISH sends to a channel. All subscribers receive the message. Subscriber connections are dedicated — they cannot run other commands.',
          keyPoints: ['SUBSCRIBE: listen on channels', 'PSUBSCRIBE: pattern matching (*)' , 'PUBLISH: send to channel', 'Subscriber connection is dedicated'],
          realWorld: 'Chat applications use Redis pub/sub to broadcast messages to all connected clients in real time.',
          mistakes: ['Using subscriber connection for other commands', 'Messages lost if no subscriber is listening', 'No persistence (use Streams for durability)'],
          pInstructions: ['Create a subscriber for a channel', 'Create a publisher and send messages', 'Use pattern subscribe for namespaced channels'],
          starter: '// Subscriber\nconst sub = new Redis();\n// Subscribe and handle messages\n\n// Publisher\nconst pub = new Redis();\n// Publish messages',
          solution: 'const sub = new Redis();\nsub.subscribe("chat");\nsub.on("message", (ch, msg) => console.log("Chat:", msg));\n\nsub.psubscribe("room:*");\nsub.on("pmessage", (pat, ch, msg) => console.log(ch, ":", msg));\n\nconst pub = new Redis();\nawait pub.publish("chat", "Hello everyone!");\nawait pub.publish("room:general", "Hi from general");\nawait pub.publish("room:tech", "New article posted");',
          hints: ['Need separate Redis connections for pub and sub', 'Pattern * matches any characters'],
          challenge: 'Build a real-time notification system: users subscribe to personal and group channels, messages include type and payload, and unsubscribe on disconnect.',
          reqs: ['Personal channels (user:ID)', 'Group channels (group:NAME)', 'JSON payloads', 'Unsubscribe handling'],
          tests: [['publish to user channel', 'subscriber receives', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Streams', slug: 'redis-streams',
      description: 'Build durable message queues with Redis Streams and consumer groups.',
      language: 'javascript', difficulty: 'advanced', duration: 50,
      tags: ['redis', 'streams', 'message-queue', 'database'],
      category: 'Database',
      objectives: ['Add entries to streams', 'Create consumer groups', 'Acknowledge processed messages'],
      steps: [
        S(1, {
          title: 'Streams and Consumer Groups', content: 'Redis Streams provide persistent, ordered, consumer-group messaging.',
          lang: 'javascript', code: '// Add to stream\nawait redis.xadd("events", "*", "type", "click", "page", "/home", "user", "42");\nawait redis.xadd("events", "*", "type", "purchase", "amount", "99.99", "user", "42");\n\n// Read entries\nconst entries = await redis.xrange("events", "-", "+", "COUNT", 10);\nconsole.log(entries);\n\n// Create consumer group\nawait redis.xgroup("CREATE", "events", "workers", "0", "MKSTREAM");\n\n// Read as consumer in group\nconst messages = await redis.xreadgroup(\n  "GROUP", "workers", "worker-1",\n  "COUNT", 1, "BLOCK", 5000,\n  "STREAMS", "events", ">"\n);\n\nif (messages) {\n  const [stream, entries] = messages[0];\n  for (const [id, fields] of entries) {\n    console.log("Processing:", id, fields);\n    // Acknowledge after processing\n    await redis.xack("events", "workers", id);\n  }\n}',
          concept: 'Streams are append-only logs with IDs. Consumer groups distribute messages among workers. XACK acknowledges processing. Unacknowledged messages can be reclaimed by other workers.',
          keyPoints: ['XADD: append entry with auto-ID (*)', 'XREADGROUP: read as group consumer', 'XACK: acknowledge processing', '> reads only new undelivered messages'],
          realWorld: 'Microservice architectures use Redis Streams for event sourcing and reliable message passing between services.',
          mistakes: ['Forgetting XACK (message stays pending)', 'Not handling consumer failures (XCLAIM)', 'Stream growing unbounded (use MAXLEN)'],
          pInstructions: ['Add events to a stream', 'Create a consumer group', 'Read and acknowledge messages'],
          starter: '// Add events\n// Create consumer group\n// Read as consumer\n// Acknowledge',
          solution: 'await redis.xadd("orders", "*", "action", "created", "orderId", "123");\nawait redis.xadd("orders", "*", "action", "paid", "orderId", "123");\n\ntry { await redis.xgroup("CREATE", "orders", "processors", "0", "MKSTREAM"); } catch(e) {}\n\nconst msgs = await redis.xreadgroup("GROUP", "processors", "proc-1", "COUNT", 5, "STREAMS", "orders", ">");\nif (msgs) {\n  for (const [id, fields] of msgs[0][1]) {\n    console.log("Process:", fields);\n    await redis.xack("orders", "processors", id);\n  }\n}',
          hints: ['* auto-generates a time-based ID', 'MKSTREAM creates stream if it does not exist'],
          challenge: 'Build a reliable task processing system: producers add tasks, multiple consumers process them, failed tasks are reclaimed, and completed tasks are tracked.',
          reqs: ['XADD for task submission', 'Consumer group with multiple workers', 'XCLAIM for failed task recovery', 'XPENDING to monitor unprocessed'],
          tests: [['submit and process', 'acknowledged', 5], ['worker failure', 'task reclaimed', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Caching Strategies', slug: 'redis-caching-strategies',
      description: 'Implement cache-aside, write-through, and cache invalidation patterns.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['redis', 'caching', 'patterns', 'database'],
      category: 'Database',
      objectives: ['Implement cache-aside pattern', 'Handle cache invalidation', 'Set appropriate TTLs'],
      steps: [
        S(1, {
          title: 'Caching Patterns', content: 'Effective caching requires the right strategy for your data access patterns.',
          lang: 'javascript', code: '// Cache-aside (lazy loading)\nasync function getUser(userId) {\n  const cacheKey = "user:" + userId;\n  \n  // Try cache first\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n  \n  // Cache miss: fetch from DB\n  const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);\n  \n  // Store in cache with TTL\n  await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);\n  return user;\n}\n\n// Write-through: update cache on write\nasync function updateUser(userId, data) {\n  await db.query("UPDATE users SET name = $1 WHERE id = $2", [data.name, userId]);\n  await redis.set("user:" + userId, JSON.stringify(data), "EX", 3600);\n}\n\n// Cache invalidation on update\nasync function deleteUserCache(userId) {\n  await redis.del("user:" + userId);\n}',
          concept: 'Cache-aside: read from cache first, fetch from DB on miss. Write-through: update cache on every write. TTL prevents stale data. Invalidation removes cache when data changes.',
          keyPoints: ['Cache-aside: check cache -> DB on miss -> store', 'Write-through: write DB + cache together', 'TTL prevents indefinitely stale data', 'Invalidate on updates/deletes'],
          realWorld: 'E-commerce product pages use cache-aside with 5-minute TTL: 99% of reads hit cache, database load drops 100x.',
          mistakes: ['Cache stampede (many misses at once)', 'Stale cache without TTL', 'Not invalidating on updates'],
          pInstructions: ['Implement cache-aside for a product', 'Add write-through on product update', 'Invalidate cache on product delete'],
          starter: 'async function getProduct(id) {\n  // Cache-aside pattern\n}\n\nasync function updateProduct(id, data) {\n  // Write-through pattern\n}\n\nasync function deleteProduct(id) {\n  // Invalidate cache\n}',
          solution: 'async function getProduct(id) {\n  const key = "product:" + id;\n  const cached = await redis.get(key);\n  if (cached) return JSON.parse(cached);\n  const product = await db.findProduct(id);\n  if (product) await redis.set(key, JSON.stringify(product), "EX", 300);\n  return product;\n}\n\nasync function updateProduct(id, data) {\n  await db.updateProduct(id, data);\n  await redis.del("product:" + id);\n}\n\nasync function deleteProduct(id) {\n  await db.deleteProduct(id);\n  await redis.del("product:" + id);\n}',
          hints: ['Invalidate (DEL) is simpler than write-through', 'Short TTL (5 min) balances freshness and performance'],
          challenge: 'Implement a caching layer with: cache-aside reads, invalidation on writes, cache stampede protection (mutex lock), and cache warming on startup.',
          reqs: ['Cache-aside with TTL', 'Invalidation on update/delete', 'Mutex lock for stampede protection', 'Cache warming function'],
          tests: [['cache hit', 'returns from cache', 5], ['after update', 'cache invalidated', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Transactions and Pipelines', slug: 'redis-transactions',
      description: 'Execute atomic operations with MULTI/EXEC and boost throughput with pipelines.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'transactions', 'pipelines', 'database'],
      category: 'Database',
      objectives: ['Use MULTI/EXEC for transactions', 'Pipeline commands for throughput', 'Implement optimistic locking with WATCH'],
      steps: [
        S(1, {
          title: 'Transactions and Pipelines', content: 'MULTI/EXEC groups commands atomically. Pipelines batch commands for throughput.',
          lang: 'javascript', code: '// Transaction: MULTI/EXEC\nconst results = await redis.multi()\n  .set("balance:1", "500")\n  .set("balance:2", "300")\n  .incrby("balance:1", -100)\n  .incrby("balance:2", 100)\n  .exec();\nconsole.log(results); // [[null, "OK"], [null, "OK"], [null, 400], [null, 400]]\n\n// Pipeline: batch without atomicity\nconst pipeline = redis.pipeline();\nfor (let i = 0; i < 1000; i++) {\n  pipeline.set("key:" + i, "value:" + i);\n}\nconst pipeResults = await pipeline.exec();\nconsole.log("Set 1000 keys");\n\n// Optimistic locking with WATCH\nasync function transferSafe(from, to, amount) {\n  await redis.watch("balance:" + from);\n  const balance = parseInt(await redis.get("balance:" + from));\n  if (balance < amount) {\n    await redis.unwatch();\n    throw new Error("Insufficient funds");\n  }\n  const result = await redis.multi()\n    .decrby("balance:" + from, amount)\n    .incrby("balance:" + to, amount)\n    .exec();\n  if (!result) throw new Error("Transaction aborted (concurrent modification)");\n}',
          concept: 'MULTI queues commands, EXEC runs them atomically. Pipelines send multiple commands without waiting for each response (reduced latency). WATCH enables optimistic locking — EXEC fails if watched keys changed.',
          keyPoints: ['MULTI/EXEC: atomic command group', 'Pipeline: batch for throughput', 'WATCH: optimistic locking', 'EXEC returns null if WATCH key changed'],
          realWorld: 'High-throughput systems use pipelines to set thousands of keys per second, and WATCH/MULTI for safe concurrent updates.',
          mistakes: ['MULTI is not rollback — all commands run', 'Pipeline is not atomic (just batched)', 'Forgetting to handle null EXEC (WATCH abort)'],
          pInstructions: ['Use MULTI/EXEC for a transfer', 'Pipeline 100 SET commands', 'Implement WATCH-based optimistic locking'],
          starter: '// MULTI/EXEC transfer\n// Pipeline bulk operations\n// WATCH-based safe update',
          solution: 'const txResult = await redis.multi()\n  .decrby("account:1", 50)\n  .incrby("account:2", 50)\n  .exec();\nconsole.log("Transfer:", txResult);\n\nconst pipe = redis.pipeline();\nfor (let i = 0; i < 100; i++) pipe.set("bulk:" + i, i);\nawait pipe.exec();\nconsole.log("Bulk set done");\n\nawait redis.watch("counter");\nconst val = await redis.get("counter");\nconst res = await redis.multi().set("counter", parseInt(val) + 1).exec();\nif (!res) console.log("Retry needed");',
          hints: ['multi() returns a chain, exec() executes all', 'Pipeline exec returns array of [error, result] pairs'],
          challenge: 'Implement a ticket purchasing system: use WATCH to prevent overselling, MULTI for atomic purchase, and pipeline for bulk inventory loading.',
          reqs: ['WATCH ticket count before purchase', 'MULTI/EXEC for atomic decrement', 'Handle concurrent buyers', 'Pipeline for loading initial inventory'],
          tests: [['concurrent purchase', 'no oversell', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Session Management', slug: 'redis-session-management',
      description: 'Store and manage user sessions with Redis for scalable web applications.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'sessions', 'authentication', 'database'],
      category: 'Database',
      objectives: ['Store sessions in Redis', 'Implement session expiration', 'Scale sessions across servers'],
      steps: [
        S(1, {
          title: 'Session Storage', content: 'Redis is ideal for session storage: fast reads, automatic expiration, and shared across servers.',
          lang: 'javascript', code: 'const crypto = require("crypto");\n\n// Create session\nasync function createSession(userId) {\n  const sessionId = crypto.randomUUID();\n  const session = {\n    userId, createdAt: Date.now(), lastActive: Date.now()\n  };\n  await redis.hset("session:" + sessionId, session);\n  await redis.expire("session:" + sessionId, 86400); // 24 hours\n  return sessionId;\n}\n\n// Get session\nasync function getSession(sessionId) {\n  const session = await redis.hgetall("session:" + sessionId);\n  if (!session || !session.userId) return null;\n  // Refresh TTL on activity\n  await redis.expire("session:" + sessionId, 86400);\n  await redis.hset("session:" + sessionId, "lastActive", Date.now());\n  return session;\n}\n\n// Destroy session\nasync function destroySession(sessionId) {\n  await redis.del("session:" + sessionId);\n}\n\n// Express middleware\nfunction sessionMiddleware(req, res, next) {\n  const sid = req.cookies.sessionId;\n  if (sid) {\n    getSession(sid).then(session => {\n      req.session = session;\n      next();\n    });\n  } else next();\n}',
          concept: 'Sessions stored as Redis hashes with TTL. Each request refreshes the TTL (sliding expiration). Shared Redis instance means sessions work across multiple app servers.',
          keyPoints: ['Hash stores session data', 'TTL for automatic expiration', 'Sliding expiration: refresh on activity', 'Shared across all app servers'],
          realWorld: 'Load-balanced web applications store sessions in Redis so users can be routed to any server and maintain their login state.',
          mistakes: ['Not refreshing TTL (session expires during use)', 'Storing too much data in session', 'Not destroying session on logout'],
          pInstructions: ['Create a session with UUID', 'Retrieve and refresh a session', 'Implement logout (destroy session)'],
          starter: '// Create session function\n// Get session with TTL refresh\n// Destroy session function',
          solution: 'async function createSession(userId) {\n  const id = crypto.randomUUID();\n  await redis.hset("sess:" + id, { userId: String(userId), created: String(Date.now()) });\n  await redis.expire("sess:" + id, 3600);\n  return id;\n}\n\nasync function getSession(id) {\n  const data = await redis.hgetall("sess:" + id);\n  if (data.userId) {\n    await redis.expire("sess:" + id, 3600);\n    return data;\n  }\n  return null;\n}\n\nasync function logout(id) { await redis.del("sess:" + id); }',
          hints: ['Use EXPIRE to reset TTL on each access', 'randomUUID generates secure session IDs'],
          challenge: 'Build a complete session system: create, read, refresh, destroy sessions. Add concurrent session limit (max 3 per user) and active session listing.',
          reqs: ['Session CRUD', 'Sliding expiration', 'Max 3 sessions per user', 'List active sessions'],
          tests: [['create and read', 'session data returned', 5], ['4th session', 'oldest destroyed', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Rate Limiting', slug: 'redis-rate-limiting',
      description: 'Implement rate limiting with sliding window and token bucket algorithms.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['redis', 'rate-limiting', 'security', 'database'],
      category: 'Database',
      objectives: ['Implement fixed window rate limiting', 'Build sliding window rate limiter', 'Create token bucket algorithm'],
      steps: [
        S(1, {
          title: 'Rate Limiting Algorithms', content: 'Redis enables efficient rate limiting with atomic operations and TTL.',
          lang: 'javascript', code: '// Fixed window (simple)\nasync function fixedWindowLimit(userId, limit, windowSec) {\n  const key = "ratelimit:" + userId + ":" + Math.floor(Date.now() / 1000 / windowSec);\n  const count = await redis.incr(key);\n  if (count === 1) await redis.expire(key, windowSec);\n  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };\n}\n\n// Sliding window log\nasync function slidingWindowLimit(userId, limit, windowMs) {\n  const key = "ratelimit:" + userId;\n  const now = Date.now();\n  const windowStart = now - windowMs;\n  \n  await redis.multi()\n    .zremrangebyscore(key, 0, windowStart)  // Remove old entries\n    .zadd(key, now, now + ":" + Math.random()) // Add current\n    .zcard(key)  // Count entries\n    .expire(key, Math.ceil(windowMs / 1000))  // TTL\n    .exec()\n    .then(results => {\n      const count = results[2][1];\n      return { allowed: count <= limit, count };\n    });\n}\n\n// Usage in Express middleware\nasync function rateLimitMiddleware(req, res, next) {\n  const result = await fixedWindowLimit(req.ip, 100, 60); // 100 req/min\n  res.set("X-RateLimit-Remaining", result.remaining);\n  if (!result.allowed) return res.status(429).json({ error: "Rate limit exceeded" });\n  next();\n}',
          concept: 'Fixed window: count requests per time window. Simple but has edge-case burst at window boundaries. Sliding window: tracks each request timestamp, removes old entries — more accurate. Token bucket: refill tokens over time.',
          keyPoints: ['INCR + EXPIRE for fixed window', 'Sorted set for sliding window', 'MULTI for atomic rate check', 'Set rate limit headers in response'],
          realWorld: 'API gateways use Redis rate limiting to protect backend services from abuse while allowing legitimate traffic.',
          mistakes: ['Race condition without MULTI/pipeline', 'Not setting EXPIRE (keys accumulate)', 'Fixed window burst at boundaries'],
          pInstructions: ['Implement fixed window rate limiter', 'Add remaining count to response', 'Build Express middleware'],
          starter: 'async function rateLimit(key, limit, windowSec) {\n  // Implement fixed window\n  // Return { allowed, remaining }\n}',
          solution: 'async function rateLimit(key, limit, windowSec) {\n  const windowKey = "rl:" + key + ":" + Math.floor(Date.now() / 1000 / windowSec);\n  const count = await redis.incr(windowKey);\n  if (count === 1) await redis.expire(windowKey, windowSec);\n  return { allowed: count <= limit, remaining: Math.max(0, limit - count), total: limit };\n}\n\n// Test\nfor (let i = 0; i < 12; i++) {\n  const result = await rateLimit("user:1", 10, 60);\n  console.log("Request", i + 1, result.allowed ? "OK" : "BLOCKED", "remaining:", result.remaining);\n}',
          hints: ['INCR is atomic — no race conditions', 'First INCR returns 1, set EXPIRE then'],
          challenge: 'Build a multi-tier rate limiter: 10 req/sec, 100 req/min, 1000 req/hour. All three must pass. Include IP-based and API-key-based limits.',
          reqs: ['Three rate limit tiers', 'All must pass for request to proceed', 'Different limits for different API keys', 'Rate limit headers in response'],
          tests: [['within limits', 'all pass', 5], ['exceed per-second', 'blocked', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Lua Scripting', slug: 'redis-lua-scripting',
      description: 'Write atomic Redis operations with Lua scripts.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['redis', 'lua', 'scripting', 'database'],
      category: 'Database',
      objectives: ['Write Lua scripts for Redis', 'Pass keys and arguments', 'Implement complex atomic operations'],
      steps: [
        S(1, {
          title: 'Lua Scripts in Redis', content: 'Lua scripts run atomically on the Redis server — no other command can interrupt.',
          lang: 'javascript', code: '// Simple Lua script\nconst result = await redis.eval(\n  "return redis.call(\'SET\', KEYS[1], ARGV[1])",\n  1, "mykey", "myvalue"\n);\n\n// Atomic compare-and-set\nconst casScript = `\n  local current = redis.call(\'GET\', KEYS[1])\n  if current == ARGV[1] then\n    redis.call(\'SET\', KEYS[1], ARGV[2])\n    return 1\n  end\n  return 0\n`;\nconst swapped = await redis.eval(casScript, 1, "status", "pending", "active");\n\n// Rate limiter as Lua script (atomic)\nconst rateLimitScript = `\n  local key = KEYS[1]\n  local limit = tonumber(ARGV[1])\n  local window = tonumber(ARGV[2])\n  local current = tonumber(redis.call(\'GET\', key) or 0)\n  if current < limit then\n    redis.call(\'INCR\', key)\n    if current == 0 then redis.call(\'EXPIRE\', key, window) end\n    return 1\n  end\n  return 0\n`;\nconst allowed = await redis.eval(rateLimitScript, 1, "rl:user:1", 100, 60);\n\n// Define reusable script\nredis.defineCommand("rateLimit", {\n  numberOfKeys: 1,\n  lua: rateLimitScript\n});\nawait redis.rateLimit("rl:user:1", 100, 60);',
          concept: 'EVAL runs Lua scripts atomically. KEYS[] contains key arguments, ARGV[] contains value arguments. redis.call() executes Redis commands within the script. defineCommand creates reusable custom commands.',
          keyPoints: ['Lua scripts are atomic (no interruption)', 'KEYS[1] for key arguments', 'ARGV[1] for value arguments', 'defineCommand for reusable scripts'],
          realWorld: 'Distributed lock implementations use Lua scripts to atomically check ownership and release, preventing race conditions.',
          mistakes: ['Not separating KEYS and ARGV (breaks cluster)', 'Long-running Lua blocks all Redis commands', 'Forgetting Lua arrays are 1-indexed'],
          pInstructions: ['Write a compare-and-set Lua script', 'Implement atomic rate limiter', 'Create a custom command'],
          starter: '// Compare-and-set script\n// Rate limiter script\n// Define as custom command',
          solution: 'const cas = `\nlocal cur = redis.call("GET", KEYS[1])\nif cur == ARGV[1] then redis.call("SET", KEYS[1], ARGV[2]); return 1 end\nreturn 0`;\n\nconst ok = await redis.eval(cas, 1, "state", "old", "new");\nconsole.log("CAS:", ok);\n\nredis.defineCommand("atomicIncr", {\n  numberOfKeys: 1,\n  lua: `\n    local v = tonumber(redis.call("GET", KEYS[1]) or 0)\n    if v < tonumber(ARGV[1]) then\n      return redis.call("INCR", KEYS[1])\n    end\n    return -1\n  `\n});\nconst r = await redis.atomicIncr("counter", 100);',
          hints: ['KEYS and ARGV are 1-indexed in Lua', 'redis.call returns Redis responses'],
          challenge: 'Implement a distributed lock with Lua: acquire with owner ID and TTL, release only by owner, extend lock, and handle expiration.',
          reqs: ['Atomic acquire with SETNX + TTL', 'Release only if owner matches', 'Extend TTL while holding lock', 'All operations in Lua for atomicity'],
          tests: [['acquire lock', 'returns OK', 5], ['release by wrong owner', 'rejected', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Distributed Locks', slug: 'redis-distributed-locks',
      description: 'Implement distributed locks for coordinating between multiple processes.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['redis', 'distributed-locks', 'concurrency', 'database'],
      category: 'Database',
      objectives: ['Implement distributed lock', 'Handle lock expiration and renewal', 'Understand Redlock algorithm'],
      steps: [
        S(1, {
          title: 'Distributed Locking', content: 'Distributed locks prevent multiple processes from accessing shared resources simultaneously.',
          lang: 'javascript', code: 'const crypto = require("crypto");\n\nclass DistributedLock {\n  constructor(redis, resource, ttlMs = 10000) {\n    this.redis = redis;\n    this.key = "lock:" + resource;\n    this.value = crypto.randomUUID();\n    this.ttlMs = ttlMs;\n  }\n  \n  async acquire() {\n    const result = await this.redis.set(this.key, this.value, "PX", this.ttlMs, "NX");\n    return result === "OK";\n  }\n  \n  async release() {\n    const script = `\n      if redis.call("GET", KEYS[1]) == ARGV[1] then\n        return redis.call("DEL", KEYS[1])\n      end\n      return 0\n    `;\n    return await this.redis.eval(script, 1, this.key, this.value);\n  }\n  \n  async extend(ttlMs) {\n    const script = `\n      if redis.call("GET", KEYS[1]) == ARGV[1] then\n        return redis.call("PEXPIRE", KEYS[1], ARGV[2])\n      end\n      return 0\n    `;\n    return await this.redis.eval(script, 1, this.key, this.value, ttlMs);\n  }\n}\n\n// Usage\nconst lock = new DistributedLock(redis, "payment:42");\nif (await lock.acquire()) {\n  try {\n    // Critical section\n    await processPayment(42);\n  } finally {\n    await lock.release();\n  }\n}',
          concept: 'SET NX PX atomically creates a lock with TTL. The random value ensures only the owner can release (checked with Lua). TTL prevents deadlocks if the owner crashes.',
          keyPoints: ['SET key value NX PX ttl: atomic acquire', 'Random value prevents wrong-owner release', 'Lua script for safe release', 'TTL prevents deadlock on crash'],
          realWorld: 'Payment systems use distributed locks to prevent double-charging when multiple servers might process the same payment.',
          mistakes: ['Releasing without checking ownership', 'TTL too short (lock expires during work)', 'Not using NX (non-exclusive lock)'],
          pInstructions: ['Implement lock acquire with SET NX PX', 'Implement safe release with Lua', 'Add lock extension'],
          starter: 'class Lock {\n  // acquire() - SET NX PX\n  // release() - Lua check and DEL\n  // extend() - Lua check and PEXPIRE\n}',
          solution: 'class Lock {\n  constructor(redis, name) {\n    this.redis = redis;\n    this.key = "lock:" + name;\n    this.val = crypto.randomUUID();\n  }\n  async acquire(ttl = 10000) {\n    return (await this.redis.set(this.key, this.val, "PX", ttl, "NX")) === "OK";\n  }\n  async release() {\n    return await this.redis.eval(\n      \'if redis.call("GET",KEYS[1])==ARGV[1] then return redis.call("DEL",KEYS[1]) end return 0\',\n      1, this.key, this.val\n    );\n  }\n}',
          hints: ['NX = only if Not eXists', 'PX = TTL in milliseconds'],
          challenge: 'Implement a robust distributed lock with: retry with backoff, lock extension (watchdog), and Redlock algorithm for multi-instance Redis.',
          reqs: ['Retry with exponential backoff', 'Auto-extend while holding lock', 'Implement Redlock (majority of N instances)', 'Handle network partitions'],
          tests: [['acquire and release', 'works correctly', 5], ['concurrent acquire', 'only one succeeds', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Data Expiration and Eviction', slug: 'redis-expiration-eviction',
      description: 'Manage Redis memory with TTL, eviction policies, and memory optimization.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'expiration', 'eviction', 'memory', 'database'],
      category: 'Database',
      objectives: ['Set and manage key expiration', 'Understand eviction policies', 'Monitor and optimize memory usage'],
      steps: [
        S(1, {
          title: 'Expiration and Memory Management', content: 'Redis provides TTL for key expiration and configurable eviction when memory is full.',
          lang: 'javascript', code: '// Set expiration\nawait redis.set("temp", "data");\nawait redis.expire("temp", 60);     // 60 seconds\nawait redis.pexpire("temp", 5000);  // 5000 milliseconds\nawait redis.expireat("temp", Math.floor(Date.now()/1000) + 3600); // Unix timestamp\n\n// Check TTL\nconsole.log(await redis.ttl("temp"));   // Seconds remaining\nconsole.log(await redis.pttl("temp"));  // Milliseconds remaining\n\n// Remove expiration\nawait redis.persist("temp");\n\n// SET with inline TTL\nawait redis.set("cache:data", "value", "EX", 300); // 5 min\nawait redis.set("cache:data", "value", "PX", 5000); // 5 sec\n\n// Memory info\nconst info = await redis.info("memory");\nconsole.log(info);\n\n// Memory usage per key\nconst bytes = await redis.memory("USAGE", "mykey");\nconsole.log("Key size:", bytes, "bytes");',
          concept: 'EXPIRE sets TTL in seconds. Keys are lazily deleted (on access) and periodically scanned. When maxmemory is reached, eviction policy decides what to remove. Options: volatile-lru, allkeys-lru, noeviction.',
          keyPoints: ['EXPIRE/PEXPIRE: set TTL', 'TTL returns -1 (no expiry), -2 (not found)', 'PERSIST removes expiration', 'maxmemory + eviction policy controls memory'],
          realWorld: 'Cache systems set different TTLs based on data staleness tolerance: product info (5 min), user sessions (24h), rate limits (1 min).',
          mistakes: ['Not setting TTL on cache keys', 'Using noeviction without monitoring', 'Forgetting SET overwrites TTL'],
          pInstructions: ['Set keys with different TTLs', 'Check remaining time', 'Monitor memory usage'],
          starter: '// Set key with TTL\n// Check TTL\n// Remove TTL\n// Check memory usage',
          solution: 'await redis.set("short", "data", "EX", 10);\nawait redis.set("medium", "data", "EX", 300);\nawait redis.set("long", "data", "EX", 86400);\n\nconsole.log("short TTL:", await redis.ttl("short"));\nconsole.log("medium TTL:", await redis.ttl("medium"));\n\nawait redis.persist("long");\nconsole.log("long TTL after persist:", await redis.ttl("long"));\n\nconst mem = await redis.memory("USAGE", "medium");\nconsole.log("Memory:", mem, "bytes");',
          hints: ['TTL -1 means no expiration set', 'SET key value EX 60 is preferred over separate EXPIRE'],
          challenge: 'Build a memory-aware cache: track total cache size, implement LRU-like eviction in application code, set appropriate TTLs, and alert when memory usage exceeds threshold.',
          reqs: ['Track cache key count and size', 'Application-level LRU eviction', 'Different TTLs per data type', 'Memory threshold alerting'],
          tests: [['check TTL', 'correct remaining', 5], ['memory usage', 'reported correctly', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Geospatial Data', slug: 'redis-geospatial',
      description: 'Store and query location data with Redis geospatial commands.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'geospatial', 'location', 'database'],
      category: 'Database',
      objectives: ['Store geographic coordinates', 'Find nearby locations', 'Calculate distances'],
      steps: [
        S(1, {
          title: 'Geospatial Commands', content: 'Redis supports geospatial indexing for location-based queries.',
          lang: 'javascript', code: '// Add locations (longitude, latitude, name)\nawait redis.geoadd("stores",\n  -73.935242, 40.730610, "NYC-Store",\n  -118.243685, 34.052234, "LA-Store",\n  -87.629798, 41.878114, "Chicago-Store"\n);\n\n// Get distance between two members\nconst dist = await redis.geodist("stores", "NYC-Store", "LA-Store", "mi");\nconsole.log("NYC to LA:", dist, "miles");\n\n// Find nearby (within radius)\nconst nearby = await redis.georadius("stores",\n  -73.9, 40.7,  // search from this point\n  100, "mi",     // 100 mile radius\n  "WITHCOORD", "WITHDIST", "ASC"\n);\nconsole.log("Nearby:", nearby);\n\n// Get coordinates\nconst pos = await redis.geopos("stores", "NYC-Store");\nconsole.log("NYC coords:", pos);\n\n// Search by member\nconst nearNYC = await redis.georadiusbymember("stores", "NYC-Store", 500, "mi");',
          concept: 'GEOADD stores longitude/latitude pairs. GEODIST calculates distance. GEORADIUS finds members within a radius from a point. Data is stored in a sorted set using geohash.',
          keyPoints: ['GEOADD: longitude, latitude, member', 'GEODIST: distance between members', 'GEORADIUS: find within radius', 'Units: m, km, mi, ft'],
          realWorld: 'Food delivery apps use Redis geospatial to find restaurants within delivery range of the customer.',
          mistakes: ['Longitude before latitude (not lat/lon)', 'Not specifying distance units', 'GEORADIUS returns are configurable'],
          pInstructions: ['Add store locations', 'Find distance between two stores', 'Find stores near a coordinate'],
          starter: '// Add locations\n// Calculate distance\n// Find nearby within 50 miles',
          solution: 'await redis.geoadd("cafes",\n  -73.985, 40.748, "Times-Square-Cafe",\n  -73.968, 40.785, "Central-Park-Cafe",\n  -74.006, 40.714, "Wall-St-Cafe"\n);\n\nconst dist = await redis.geodist("cafes", "Times-Square-Cafe", "Wall-St-Cafe", "mi");\nconsole.log("Distance:", dist, "miles");\n\nconst near = await redis.georadius("cafes", -73.98, 40.75, 5, "mi", "WITHDIST", "ASC");\nconsole.log("Near:", near);',
          hints: ['Order is: longitude, latitude (x, y)', 'WITHDIST includes distance in results'],
          challenge: 'Build a store locator API: add stores with coordinates, find nearest N stores, get distance to each, and filter by open hours.',
          reqs: ['GEOADD for store locations', 'GEORADIUS for nearest search', 'Distance calculation', 'Combine with hash data for details'],
          tests: [['find nearest 3', 'sorted by distance', 5]]
        })
      ]
    }),

    T({
      title: 'Redis HyperLogLog', slug: 'redis-hyperloglog',
      description: 'Count unique elements efficiently with probabilistic HyperLogLog.',
      language: 'javascript', difficulty: 'intermediate', duration: 30,
      tags: ['redis', 'hyperloglog', 'cardinality', 'database'],
      category: 'Database',
      objectives: ['Count unique items with PFADD/PFCOUNT', 'Merge HyperLogLogs', 'Understand probabilistic counting'],
      steps: [
        S(1, {
          title: 'Probabilistic Counting', content: 'HyperLogLog counts unique elements using only ~12KB regardless of count size.',
          lang: 'javascript', code: '// Add elements\nawait redis.pfadd("visitors:2024-01-15", "user1", "user2", "user3");\nawait redis.pfadd("visitors:2024-01-15", "user1", "user4"); // user1 duplicate\n\n// Count unique\nconst count = await redis.pfcount("visitors:2024-01-15");\nconsole.log("Unique visitors:", count); // ~4\n\n// Daily counts\nawait redis.pfadd("visitors:2024-01-16", "user2", "user5", "user6");\n\n// Merge for weekly count\nawait redis.pfmerge("visitors:week3", "visitors:2024-01-15", "visitors:2024-01-16");\nconst weeklyUnique = await redis.pfcount("visitors:week3");\nconsole.log("Weekly unique:", weeklyUnique);\n\n// Compare memory: Set vs HyperLogLog\n// Set with 1M members: ~50MB\n// HyperLogLog with 1M members: ~12KB\n// HLL error rate: ~0.81%',
          concept: 'HyperLogLog (HLL) is a probabilistic data structure that estimates cardinality (unique count) with ~0.81% error using only 12KB. PFADD adds elements, PFCOUNT returns estimate, PFMERGE combines.',
          keyPoints: ['~12KB memory regardless of count', '~0.81% standard error', 'PFADD adds, PFCOUNT counts', 'PFMERGE combines multiple HLLs'],
          realWorld: 'Analytics platforms count daily unique visitors across billions of page views using HyperLogLog, saving terabytes of memory.',
          mistakes: ['Expecting exact counts (it is probabilistic)', 'Using sets when HLL suffices', 'Cannot retrieve individual elements from HLL'],
          pInstructions: ['Track unique visitors per day', 'Get daily unique count', 'Merge days for weekly count'],
          starter: '// Track daily visitors\n// Count uniques\n// Merge for weekly',
          solution: 'await redis.pfadd("dv:mon", "u1", "u2", "u3", "u4");\nawait redis.pfadd("dv:tue", "u2", "u3", "u5", "u6");\nawait redis.pfadd("dv:wed", "u1", "u5", "u7");\n\nconsole.log("Mon unique:", await redis.pfcount("dv:mon"));\nconsole.log("Tue unique:", await redis.pfcount("dv:tue"));\n\nawait redis.pfmerge("dv:week", "dv:mon", "dv:tue", "dv:wed");\nconsole.log("Week unique:", await redis.pfcount("dv:week"));',
          hints: ['HLL is perfect when you need counts, not members', 'PFMERGE creates union of all HLLs'],
          challenge: 'Build an analytics system: track unique visitors per page per day, compute daily/weekly/monthly uniques, and compare memory usage with sets.',
          reqs: ['Daily HLL per page', 'Weekly merge', 'Monthly merge', 'Memory comparison with sets'],
          tests: [['daily count', 'approximately correct', 5], ['weekly merge', 'correct unique count', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Bitmaps', slug: 'redis-bitmaps',
      description: 'Use bit-level operations for efficient boolean tracking and analytics.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'bitmaps', 'analytics', 'database'],
      category: 'Database',
      objectives: ['Set and get individual bits', 'Count set bits', 'Use bitmaps for user activity tracking'],
      steps: [
        S(1, {
          title: 'Bitmap Operations', content: 'Bitmaps use individual bits for boolean storage — 1 billion users in ~125MB.',
          lang: 'javascript', code: '// Track daily active users (bit per user ID)\nconst today = "active:2024-01-15";\nawait redis.setbit(today, 1001, 1);  // User 1001 active\nawait redis.setbit(today, 1002, 1);  // User 1002 active\nawait redis.setbit(today, 2005, 1);  // User 2005 active\n\n// Check if user was active\nconst wasActive = await redis.getbit(today, 1001); // 1\nconst wasInactive = await redis.getbit(today, 9999); // 0\n\n// Count active users\nconst activeCount = await redis.bitcount(today);\nconsole.log("Active today:", activeCount);\n\n// Users active on BOTH days (AND)\nconst day1 = "active:2024-01-15";\nconst day2 = "active:2024-01-16";\nawait redis.bitop("AND", "active:both-days", day1, day2);\nconst bothDays = await redis.bitcount("active:both-days");\n\n// Users active on EITHER day (OR)\nawait redis.bitop("OR", "active:either-day", day1, day2);\nconst eitherDay = await redis.bitcount("active:either-day");',
          concept: 'SETBIT sets a single bit at an offset. GETBIT reads it. BITCOUNT counts all set bits. BITOP performs AND/OR/XOR/NOT across multiple bitmaps. Extremely memory-efficient for boolean per-user tracking.',
          keyPoints: ['1 bit per user for boolean tracking', 'BITCOUNT: count set bits', 'BITOP AND: users active on all days', 'BITOP OR: users active on any day'],
          realWorld: 'Retention analysis: track daily logins as bitmaps, AND them together to find users active every day of the week.',
          mistakes: ['Large offset creates large bitmap', 'Bit positions are 0-indexed', 'BITOP result goes to a destination key'],
          pInstructions: ['Track user logins for two days', 'Count daily active users', 'Find users active both days'],
          starter: '// Day 1 active users\n// Day 2 active users\n// Count each day\n// Find intersection (both days)',
          solution: 'await redis.setbit("day1", 1, 1);\nawait redis.setbit("day1", 2, 1);\nawait redis.setbit("day1", 3, 1);\n\nawait redis.setbit("day2", 2, 1);\nawait redis.setbit("day2", 3, 1);\nawait redis.setbit("day2", 4, 1);\n\nconsole.log("Day1:", await redis.bitcount("day1"));\nconsole.log("Day2:", await redis.bitcount("day2"));\n\nawait redis.bitop("AND", "both", "day1", "day2");\nconsole.log("Both days:", await redis.bitcount("both"));',
          hints: ['User ID maps directly to bit offset', 'AND gives intersection, OR gives union'],
          challenge: 'Build a weekly retention report: track daily active users with bitmaps, calculate DAU, WAU, retention rate, and churn rate.',
          reqs: ['Daily bitmaps for active users', 'BITOP AND for 7-day retention', 'BITOP OR for WAU', 'Calculate retention percentage'],
          tests: [['DAU count', 'correct', 5], ['retention rate', 'calculated', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Cluster Basics', slug: 'redis-cluster',
      description: 'Understand Redis Cluster for horizontal scaling and high availability.',
      language: 'javascript', difficulty: 'advanced', duration: 45,
      tags: ['redis', 'cluster', 'scaling', 'database'],
      category: 'Database',
      objectives: ['Understand hash slots and sharding', 'Connect to Redis Cluster', 'Handle MOVED and ASK redirects'],
      steps: [
        S(1, {
          title: 'Redis Cluster Architecture', content: 'Redis Cluster distributes data across multiple nodes using hash slots.',
          lang: 'javascript', code: 'const Redis = require("ioredis");\n\n// Connect to cluster\nconst cluster = new Redis.Cluster([\n  { port: 7000, host: "127.0.0.1" },\n  { port: 7001, host: "127.0.0.1" },\n  { port: 7002, host: "127.0.0.1" }\n]);\n\n// Regular commands work transparently\nawait cluster.set("user:1", "Alice");\nconst val = await cluster.get("user:1");\nconsole.log(val);\n\n// Multi-key operations need hash tags\n// These go to same slot because of {user}:\nawait cluster.mset("{user}:1:name", "Alice", "{user}:1:email", "alice@test.com");\nconst result = await cluster.mget("{user}:1:name", "{user}:1:email");\n\n// Pipeline (auto-splits by slot)\nconst pipe = cluster.pipeline();\npipe.set("a", 1);\npipe.set("b", 2);\npipe.get("a");\nawait pipe.exec();\n\n// Cluster info\nconst info = await cluster.cluster("INFO");\nconsole.log(info);',
          concept: 'Redis Cluster has 16384 hash slots distributed across nodes. Each key maps to a slot via CRC16. Multi-key commands require keys in the same slot (use {hash-tags}). ioredis handles routing automatically.',
          keyPoints: ['16384 hash slots across nodes', 'CRC16(key) determines slot', '{hash-tag} forces same slot', 'ioredis handles routing transparently'],
          realWorld: 'High-traffic social media platforms use Redis Cluster to handle millions of operations per second across dozens of nodes.',
          mistakes: ['Multi-key commands across different slots', 'Not using hash tags for related keys', 'Lua scripts must use keys on same node'],
          pInstructions: ['Connect to a Redis Cluster', 'Set and get values', 'Use hash tags for related keys'],
          starter: '// Connect to cluster\n// Set/get operations\n// Multi-key with hash tags',
          solution: 'const cluster = new Redis.Cluster([{ port: 7000, host: "localhost" }]);\n\nawait cluster.set("key1", "value1");\nconsole.log(await cluster.get("key1"));\n\nawait cluster.mset("{order:1}:status", "pending", "{order:1}:total", "99.99");\nconst order = await cluster.mget("{order:1}:status", "{order:1}:total");\nconsole.log("Order:", order);',
          hints: ['{order:1} hash tag ensures same slot', 'ioredis.Cluster auto-discovers all nodes'],
          challenge: 'Design a key naming strategy for a cluster: use hash tags for related data, implement a session store that works across cluster, and handle node failures.',
          reqs: ['Hash tag strategy for related keys', 'Session store with hash tags', 'Test with node failure', 'Monitor cluster health'],
          tests: [['related keys same slot', 'MGET works', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Persistence: RDB and AOF', slug: 'redis-persistence',
      description: 'Configure Redis data persistence with RDB snapshots and AOF logging.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'persistence', 'rdb', 'aof', 'database'],
      category: 'Database',
      objectives: ['Understand RDB snapshots', 'Configure AOF persistence', 'Choose the right persistence strategy'],
      steps: [
        S(1, {
          title: 'RDB and AOF Persistence', content: 'Redis can persist data to disk with RDB (snapshots) and/or AOF (append-only file).',
          lang: 'javascript', code: '// Redis configuration (redis.conf)\n// RDB: Save snapshot every N seconds if M keys changed\n// save 900 1      (15 min if 1+ key changed)\n// save 300 10     (5 min if 10+ keys changed)\n// save 60 10000   (1 min if 10000+ keys changed)\n\n// AOF: Log every write command\n// appendonly yes\n// appendfsync everysec  (fsync once per second)\n\n// Check persistence status\nconst info = await redis.info("persistence");\nconsole.log(info);\n\n// Manual RDB save\nawait redis.bgsave();  // Background save\n// await redis.save();  // Blocking save (avoid in production!)\n\n// Check last save time\nconst lastSave = await redis.lastsave();\nconsole.log("Last save:", new Date(lastSave * 1000));\n\n// AOF rewrite (compact the file)\nawait redis.bgrewriteaof();',
          concept: 'RDB takes point-in-time snapshots (compact, fast restore, some data loss). AOF logs every write command (durable, larger files). Use both for best balance. appendfsync everysec loses at most 1 second.',
          keyPoints: ['RDB: snapshots, compact, some data loss', 'AOF: every write logged, more durable', 'appendfsync: always / everysec / no', 'Use both for best reliability'],
          realWorld: 'Production Redis deployments use both RDB (for fast restarts) and AOF with everysec (for minimal data loss).',
          mistakes: ['No persistence = all data lost on restart', 'appendfsync always is slow', 'Not monitoring RDB save failures'],
          pInstructions: ['Check current persistence config', 'Trigger a manual RDB save', 'Verify last save time'],
          starter: '// Check persistence info\n// Trigger background save\n// Check last save time',
          solution: 'const info = await redis.info("persistence");\nconsole.log("Persistence:", info);\n\nawait redis.bgsave();\nconsole.log("Background save started");\n\nconst ts = await redis.lastsave();\nconsole.log("Last save:", new Date(ts * 1000));\n\nconst dbSize = await redis.dbsize();\nconsole.log("Keys in DB:", dbSize);',
          hints: ['bgsave is non-blocking (use in production)', 'info persistence shows RDB and AOF status'],
          challenge: 'Set up optimal persistence for different use cases: cache-only (no persistence), session store (AOF everysec), and primary database (RDB + AOF).',
          reqs: ['Configure each scenario', 'Test data survives restart', 'Measure performance impact', 'Monitor persistence status'],
          tests: [['restart with AOF', 'data preserved', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Sentinel for High Availability', slug: 'redis-sentinel',
      description: 'Set up automatic failover with Redis Sentinel.',
      language: 'javascript', difficulty: 'advanced', duration: 40,
      tags: ['redis', 'sentinel', 'high-availability', 'database'],
      category: 'Database',
      objectives: ['Understand Sentinel architecture', 'Connect through Sentinel', 'Handle failover in applications'],
      steps: [
        S(1, {
          title: 'Redis Sentinel', content: 'Sentinel monitors Redis instances and performs automatic failover.',
          lang: 'javascript', code: 'const Redis = require("ioredis");\n\n// Connect via Sentinel\nconst redis = new Redis({\n  sentinels: [\n    { host: "sentinel1", port: 26379 },\n    { host: "sentinel2", port: 26379 },\n    { host: "sentinel3", port: 26379 }\n  ],\n  name: "mymaster",  // Master name\n  role: "master"     // or "slave" for read replicas\n});\n\n// Regular operations (auto-routes to master)\nawait redis.set("key", "value");\n\n// Read from replica\nconst replica = new Redis({\n  sentinels: [\n    { host: "sentinel1", port: 26379 },\n    { host: "sentinel2", port: 26379 }\n  ],\n  name: "mymaster",\n  role: "slave"\n});\nconst val = await replica.get("key");\n\n// Sentinel events\nredis.on("reconnecting", () => console.log("Reconnecting..."));\nredis.on("connect", () => console.log("Connected to master"));\nredis.on("error", (err) => console.log("Error:", err.message));',
          concept: 'Sentinel runs as separate processes that monitor Redis master/replica. If master fails, Sentinel promotes a replica to master and reconfigures others. Clients connect through Sentinel for automatic discovery.',
          keyPoints: ['Sentinels monitor master health', 'Automatic failover to replica', 'Client discovers master via Sentinel', 'Need 3+ Sentinels for quorum'],
          realWorld: 'Production Redis deployments use Sentinel for automatic failover: when the master crashes, the system recovers in seconds without manual intervention.',
          mistakes: ['Using only 1 Sentinel (need 3+ for quorum)', 'Not handling reconnection in application', 'Hardcoding master address instead of using Sentinel'],
          pInstructions: ['Connect to Redis through Sentinel', 'Set up read from replica', 'Handle failover events'],
          starter: '// Connect via Sentinel for writes\n// Connect via Sentinel for reads\n// Handle reconnection events',
          solution: 'const master = new Redis({\n  sentinels: [{ host: "localhost", port: 26379 }],\n  name: "mymaster"\n});\n\nmaster.on("connect", () => console.log("Connected to master"));\nmaster.on("error", (e) => console.log("Error:", e.message));\n\nawait master.set("test", "hello");\nconsole.log(await master.get("test"));',
          hints: ['ioredis auto-reconnects on failover', 'role: "slave" routes reads to replicas'],
          challenge: 'Set up a complete HA environment: 1 master, 2 replicas, 3 sentinels. Simulate master failure and verify automatic failover.',
          reqs: ['Master + 2 replicas', '3 Sentinel instances', 'Simulate master failure', 'Verify automatic promotion'],
          tests: [['master fails', 'replica promoted', 5]]
        })
      ]
    }),

    T({
      title: 'Redis with Express.js Middleware', slug: 'redis-express-middleware',
      description: 'Build Express.js middleware for caching, rate limiting, and sessions with Redis.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['redis', 'express', 'middleware', 'database'],
      category: 'Database',
      objectives: ['Build caching middleware', 'Implement rate limiting middleware', 'Add session middleware'],
      steps: [
        S(1, {
          title: 'Redis Middleware', content: 'Redis-powered middleware adds caching, rate limiting, and sessions to Express.',
          lang: 'javascript', code: 'const express = require("express");\nconst Redis = require("ioredis");\nconst redis = new Redis();\nconst app = express();\n\n// Cache middleware\nfunction cache(ttl) {\n  return async (req, res, next) => {\n    const key = "cache:" + req.originalUrl;\n    const cached = await redis.get(key);\n    if (cached) return res.json(JSON.parse(cached));\n    \n    const originalJson = res.json.bind(res);\n    res.json = (data) => {\n      redis.set(key, JSON.stringify(data), "EX", ttl);\n      return originalJson(data);\n    };\n    next();\n  };\n}\n\n// Rate limit middleware\nfunction rateLimit(limit, windowSec) {\n  return async (req, res, next) => {\n    const key = "rl:" + req.ip;\n    const count = await redis.incr(key);\n    if (count === 1) await redis.expire(key, windowSec);\n    if (count > limit) return res.status(429).json({ error: "Too many requests" });\n    res.set("X-RateLimit-Remaining", Math.max(0, limit - count));\n    next();\n  };\n}\n\n// Usage\napp.get("/api/products", cache(300), async (req, res) => {\n  const products = await db.getProducts();\n  res.json(products);\n});\n\napp.use("/api/", rateLimit(100, 60));',
          concept: 'Middleware intercepts requests before handlers. Cache middleware checks Redis first, stores response on miss. Rate limit middleware tracks requests per IP. Both are reusable across routes.',
          keyPoints: ['Cache: check before handler, store after', 'Rate limit: INCR + EXPIRE per client', 'Override res.json to intercept response', 'Apply per-route or globally'],
          realWorld: 'API gateways use Redis middleware for caching (reduce backend load 10x), rate limiting (prevent abuse), and session management (stateless servers).',
          mistakes: ['Caching personalized data (use user-specific keys)', 'Not clearing cache on data updates', 'Rate limiting by IP fails behind load balancers'],
          pInstructions: ['Build a cache middleware with configurable TTL', 'Build a rate limit middleware', 'Apply both to an API route'],
          starter: '// Cache middleware factory\nfunction cache(ttl) {\n  return async (req, res, next) => {\n    // Check cache, intercept response\n  };\n}\n\n// Rate limit middleware\nfunction rateLimit(max, window) {\n  return async (req, res, next) => {\n    // Track and limit\n  };\n}',
          solution: 'function cache(ttl) {\n  return async (req, res, next) => {\n    const key = "c:" + req.url;\n    const hit = await redis.get(key);\n    if (hit) return res.json(JSON.parse(hit));\n    const orig = res.json.bind(res);\n    res.json = (data) => { redis.set(key, JSON.stringify(data), "EX", ttl); return orig(data); };\n    next();\n  };\n}\n\nfunction rateLimit(max, sec) {\n  return async (req, res, next) => {\n    const k = "rl:" + req.ip;\n    const n = await redis.incr(k);\n    if (n === 1) await redis.expire(k, sec);\n    if (n > max) return res.status(429).json({ error: "Rate limited" });\n    next();\n  };\n}',
          hints: ['Override res.json to capture and cache the response', 'INCR returns the new count atomically'],
          challenge: 'Build a complete API middleware stack: request caching, rate limiting with different tiers (free/premium), session authentication, and request logging — all backed by Redis.',
          reqs: ['Cache middleware with invalidation', 'Tiered rate limiting', 'Session auth middleware', 'Request logging to Redis list'],
          tests: [['cached response', 'served from Redis', 5], ['rate limit exceeded', 'returns 429', 5]]
        })
      ]
    }),

    T({
      title: 'Redis Monitoring and Debugging', slug: 'redis-monitoring',
      description: 'Monitor Redis performance with INFO, MONITOR, and SLOWLOG.',
      language: 'javascript', difficulty: 'intermediate', duration: 30,
      tags: ['redis', 'monitoring', 'performance', 'database'],
      category: 'Database',
      objectives: ['Read INFO output', 'Use MONITOR for debugging', 'Analyze slow commands with SLOWLOG'],
      steps: [
        S(1, {
          title: 'Monitoring Tools', content: 'Redis provides built-in tools for monitoring performance and debugging.',
          lang: 'javascript', code: '// INFO: comprehensive server stats\nconst info = await redis.info();\nconsole.log(info); // memory, clients, stats, etc.\n\n// Specific section\nconst memory = await redis.info("memory");\nconsole.log("Used memory:", memory);\n\nconst stats = await redis.info("stats");\nconsole.log("Stats:", stats);\n\n// SLOWLOG: find slow commands\nconst slowLogs = await redis.slowlog("GET", 10);\nfor (const log of slowLogs) {\n  console.log("ID:", log[0], "Timestamp:", log[1], "Duration (us):", log[2], "Command:", log[3]);\n}\n\n// CLIENT LIST: see connected clients\nconst clients = await redis.client("LIST");\nconsole.log(clients);\n\n// DBSIZE: total keys\nconsole.log("Total keys:", await redis.dbsize());\n\n// CONFIG GET: check settings\nconst maxMem = await redis.config("GET", "maxmemory");\nconsole.log("Max memory:", maxMem);',
          concept: 'INFO returns server metrics in sections (memory, clients, stats, keyspace). SLOWLOG records commands exceeding a time threshold. CLIENT LIST shows all connections. These are essential for production monitoring.',
          keyPoints: ['INFO: memory, clients, stats, keyspace', 'SLOWLOG: commands slower than threshold', 'CLIENT LIST: connected clients', 'DBSIZE: total key count'],
          realWorld: 'DevOps teams set up monitoring dashboards that poll Redis INFO every 10 seconds to track memory usage, hit rate, and connected clients.',
          mistakes: ['MONITOR in production (slows Redis 50%)', 'Not checking memory usage regularly', 'Ignoring slow log entries'],
          pInstructions: ['Get memory usage from INFO', 'Check slow log for slow commands', 'List connected clients'],
          starter: '// Get memory info\n// Check slow log\n// List clients\n// Get key count',
          solution: 'const mem = await redis.info("memory");\nconsole.log(mem);\n\nconst slow = await redis.slowlog("GET", 5);\nconsole.log("Slow commands:", slow.length);\n\nconsole.log("DB size:", await redis.dbsize());\n\nconst maxmem = await redis.config("GET", "maxmemory");\nconsole.log("Max memory:", maxmem);',
          hints: ['INFO memory shows used_memory_human', 'SLOWLOG threshold is in microseconds'],
          challenge: 'Build a Redis health dashboard: track memory usage, hit rate, connected clients, slow commands, and key count over time. Alert on thresholds.',
          reqs: ['Poll INFO every 10 seconds', 'Track metrics over time', 'Calculate cache hit rate', 'Alert on memory > 80%'],
          tests: [['health check', 'all metrics collected', 5]]
        })
      ]
    }),

    T({
      title: 'Redis JSON (RedisJSON)', slug: 'redis-json',
      description: 'Store and query JSON documents natively with the RedisJSON module.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['redis', 'json', 'redisjson', 'database'],
      category: 'Database',
      objectives: ['Store JSON documents', 'Query nested JSON paths', 'Update specific JSON fields'],
      steps: [
        S(1, {
          title: 'JSON Document Operations', content: 'RedisJSON adds native JSON support with path-based get/set operations.',
          lang: 'javascript', code: '// Store JSON document\nawait redis.call("JSON.SET", "user:1", "$", JSON.stringify({\n  name: "Alice",\n  age: 30,\n  address: { city: "NYC", zip: "10001" },\n  hobbies: ["reading", "coding", "hiking"]\n}));\n\n// Get entire document\nconst user = JSON.parse(await redis.call("JSON.GET", "user:1"));\nconsole.log(user);\n\n// Get specific path\nconst city = await redis.call("JSON.GET", "user:1", "$.address.city");\nconsole.log("City:", JSON.parse(city));\n\n// Update specific field\nawait redis.call("JSON.SET", "user:1", "$.age", "31");\n\n// Array operations\nawait redis.call("JSON.ARRAPPEND", "user:1", "$.hobbies", \'"gaming"\');\nconst hobbies = await redis.call("JSON.GET", "user:1", "$.hobbies");\nconsole.log("Hobbies:", JSON.parse(hobbies));\n\n// Increment numeric field\nawait redis.call("JSON.NUMINCRBY", "user:1", "$.age", "1");',
          concept: 'RedisJSON stores JSON natively (not as string). JSONPath syntax ($. prefix) targets specific fields. Atomic operations on JSON fields without loading the entire document.',
          keyPoints: ['JSON.SET: store document', 'JSON.GET with path: read specific fields', 'JSON.ARRAPPEND: add to array', 'JSON.NUMINCRBY: atomic increment'],
          realWorld: 'Product catalogs store complex product data as JSON documents with nested attributes, enabling partial updates without replacing the entire document.',
          mistakes: ['Not having RedisJSON module installed', 'JSON.SET requires stringified JSON', 'JSONPath starts with $ for root'],
          pInstructions: ['Store a JSON document', 'Read a nested field', 'Update a specific field'],
          starter: '// Store user as JSON\n// Read city from nested address\n// Update age\n// Append to hobbies array',
          solution: 'await redis.call("JSON.SET", "product:1", "$", JSON.stringify({\n  name: "Laptop", price: 999, specs: { ram: 16, storage: 512 }, tags: ["electronics"]\n}));\n\nconst ram = await redis.call("JSON.GET", "product:1", "$.specs.ram");\nconsole.log("RAM:", JSON.parse(ram));\n\nawait redis.call("JSON.SET", "product:1", "$.price", "899");\nawait redis.call("JSON.ARRAPPEND", "product:1", "$.tags", \'"sale"\');',
          hints: ['JSONPath $. starts from root', 'String values need extra quotes in ARRAPPEND'],
          challenge: 'Build a document store API: CRUD operations on JSON documents, query by nested field values, array manipulation, and atomic field updates.',
          reqs: ['Full CRUD with JSON.SET/GET/DEL', 'Nested path queries', 'Array push/pop', 'Atomic numeric updates'],
          tests: [['store and retrieve', 'correct JSON', 5], ['update nested field', 'only field changed', 5]]
        })
      ]
    })
  ];
};
