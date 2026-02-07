# Tutorial Seeding Script

## Overview

The comprehensive seeding script populates the MongoDB database with **240+ tutorials** covering 6 programming languages and 4 database types. Every tutorial includes full 3-phase learning content (Learn / Practice / Challenge).

## How to Run

```bash
cd backend
node scripts/seedAllComprehensive.js
```

**Warning:** This script **deletes all existing tutorials** before inserting new ones.

## What It Does

1. Connects to MongoDB (uses `MONGODB_URI` from `.env` or defaults to `mongodb://127.0.0.1:27017/seek_platform`)
2. Clears the `mongotutorials` collection
3. Loads 10 data files from `scripts/data/`
4. Inserts all tutorials with generated ratings and stats
5. Prints a summary by category and language

## Data Files

| File | Language | Category | Count |
|------|----------|----------|-------|
| `data/jsTutorials.js` | JavaScript | Programming / DS / Algorithms / Web | 25 |
| `data/pyTutorials.js` | Python | Programming / DS / Algorithms | ~25 |
| `data/tsTutorials.js` | TypeScript | Programming / Web | ~25 |
| `data/javaTutorials.js` | Java | Programming / DS / Algorithms | ~25 |
| `data/cTutorials.js` | C | Programming / DS / Algorithms | ~25 |
| `data/cppTutorials.js` | C++ | Programming / DS / Algorithms | ~25 |
| `data/mongodbTutorials.js` | JavaScript | Database (mongodb tag) | ~25 |
| `data/sqlTutorials.js` | SQL | Database (mysql/sql tag) | ~25 |
| `data/pgTutorials.js` | SQL/JavaScript | Database (postgresql/postgres tag) | ~25 |
| `data/redisTutorials.js` | JavaScript | Database (redis tag) | ~25 |

## Data File Format

Each data file exports a function that receives two helpers: `T()` (makeTutorial) and `S()` (makeStep).

```javascript
module.exports = function (T, S) {
  return [
    T({
      title: 'Tutorial Title',
      slug: 'unique-slug',
      description: 'Description text',
      language: 'javascript',       // javascript | python | java | cpp | c | typescript | sql
      difficulty: 'beginner',       // beginner | intermediate | advanced
      duration: 30,                 // estimated minutes
      tags: ['tag1', 'tag2'],
      category: 'Database',         // Programming Fundamentals | Web Development | Data Structures | Algorithms | Database
      objectives: ['Objective 1', 'Objective 2'],
      featured: true,               // optional, shows on homepage
      steps: [
        S(1, {
          title: 'Step Title',
          content: 'Step description',
          lang: 'javascript',       // code language for syntax highlighting
          code: 'console.log("hello");',

          // Learn Phase
          concept: 'Concept explanation paragraph',
          keyPoints: ['Point 1', 'Point 2'],
          realWorld: 'Real world example',
          mistakes: ['Common mistake 1', 'Common mistake 2'],

          // Practice Phase
          pInstructions: ['Step 1', 'Step 2'],
          starter: '// starter code',
          solution: '// solution code',
          hints: ['Hint 1', 'Hint 2'],

          // Challenge Phase
          challenge: 'Challenge problem statement',
          reqs: ['Requirement 1', 'Requirement 2'],
          tests: [['input', 'expected output', 5]]  // [input, expected, points]
        })
      ]
    }),
    // ... more tutorials
  ];
};
```

## Helper Functions

### `makeTutorial(t)` - Creates a tutorial document

Auto-generates:
- `isPublished: true`
- `author: { name: 'Seek Learning Platform' }`
- `rating: { average: 3.8-4.9, count: 50-250 }` (randomized)
- `stats: { views, completions, likes }` (randomized)
- `category` defaults to `'Programming Fundamentals'` if not set

### `makeStep(n, s)` - Creates a step with 3-phase content

Transforms flat properties into nested structure:
- `learnPhase: { conceptExplanation, keyPoints, realWorldExample, commonMistakes }`
- `practicePhase: { instructions[], starterCode, solution, hints[] }`
- `challengePhase: { problemStatement, requirements[], testCases[] }`

## Important Rules for Database Tutorials

For tutorials to appear on the Database Tutorials page:

1. **Category must be `'Database'`** - The frontend filters by `category === 'Database'`
2. **Tags must include the database name:**
   - MongoDB: include `'mongodb'` or `'mongo'`
   - SQL/MySQL: include `'mysql'` or `'sql'`
   - PostgreSQL: include `'postgresql'` or `'postgres'`
   - Redis: include `'redis'`

## Current Counts (after seeding)

```
Programming tutorials by language:
  c: 27
  cpp: 23
  java: 24
  javascript: 25
  python: 24
  typescript: 23

Database tutorials by type:
  mongodb: 23
  sql: 24
  postgresql: 23
  redis: 24

Total: 240
```

## Adding New Tutorials

1. Edit the relevant data file in `scripts/data/`
2. Add a new `T({ ... })` entry to the returned array
3. Ensure the `slug` is unique across ALL data files
4. Re-run the seed script: `node scripts/seedAllComprehensive.js`

## Gotchas

- **Python f-strings in JS template literals**: `${price:.2f}` inside backtick strings gets parsed as JS. Use single quotes instead of backticks for strings containing `${` that should not be interpolated.
- **Slug uniqueness**: Slugs must be unique across all 10 data files. Duplicate slugs will cause insertion failures (silently skipped due to `ordered: false`).
- **Language values**: Must match the enum in `MongoTutorial` model: `javascript`, `python`, `java`, `cpp`, `c`, `typescript`, `html`, `css`, `sql`, `general`.
