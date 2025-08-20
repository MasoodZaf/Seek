# Tutorial Seeding Guide

This document explains how to populate your MongoDB database with comprehensive tutorials for the Seek Learning Platform.

## Overview

The Seek platform now includes **125 comprehensive tutorials** covering 5 major programming languages:
- **Python**: 25 tutorials
- **JavaScript**: 25 tutorials  
- **Java**: 25 tutorials
- **TypeScript**: 25 tutorials
- **C++**: 25 tutorials

## Available Seeding Scripts

### 1. Full Tutorial Seeding (Recommended)
```bash
npm run seed:full
```
**What it does:**
- Seeds 125 comprehensive tutorials (25 per language)
- Covers all difficulty levels: beginner, intermediate, advanced
- Includes detailed code examples and explanations
- Provides structured learning paths for each language

**Tutorial Distribution:**
- Programming Fundamentals: 86 tutorials
- Web Development: 18 tutorials
- Data Structures: 8 tutorials
- Database: 4 tutorials
- DevOps: 4 tutorials
- Security: 3 tutorials
- Machine Learning: 1 tutorial
- Algorithms: 1 tutorial

### 2. Basic Tutorial Seeding
```bash
npm run seed:tutorials
```
**What it does:**
- Seeds a smaller set of foundational tutorials
- Good for development and testing
- Includes core tutorials for each language

### 3. Legacy Comprehensive Seeding
```bash
npm run seed:comprehensive
```
**What it does:**
- Seeds detailed tutorials with extensive code examples
- Focuses on in-depth content for each topic

## Tutorial Structure

Each tutorial includes:

### Basic Information
- **Title**: Descriptive tutorial name
- **Slug**: URL-friendly identifier
- **Description**: Comprehensive tutorial description
- **Category**: Subject area (Programming Fundamentals, Web Development, etc.)
- **Language**: Programming language (python, javascript, java, typescript, cpp)
- **Difficulty**: beginner, intermediate, or advanced
- **Estimated Time**: Duration in minutes
- **Tags**: Searchable keywords

### Learning Content
- **Prerequisites**: Required knowledge before starting
- **Learning Objectives**: What students will learn
- **Steps**: Detailed learning steps with code examples
- **Resources**: Additional learning materials
- **Author Information**: Tutorial creator details

### Metadata
- **Rating**: Average rating and count
- **Stats**: Views, completions, and likes
- **Timestamps**: Creation and update dates

## Language-Specific Tutorial Topics

### Python (25 tutorials)
1. Variables and Data Types
2. Control Flow
3. Functions
4. Lists and Tuples
5. Dictionaries
6. File I/O
7. Classes and OOP
8. Inheritance
9. Modules
10. Error Handling
11. Lambda Functions
12. Iterators and Generators
13. Decorators
14. Regular Expressions
15. Web Scraping
16. Database Programming
17. Testing
18. Concurrency
19. API Development
20. Data Analysis
21. Machine Learning Basics
22. Data Visualization
23. File Processing
24. Design Patterns
25. Performance Optimization

### JavaScript (25 tutorials)
1. Variables and Data Types
2. Functions and Scope
3. Arrays and Objects
4. DOM Manipulation
5. Event Handling
6. Promises and Async
7. ES6+ Features
8. Modules
9. Error Handling
10. Closures
11. Prototypes and Inheritance
12. Regular Expressions
13. AJAX and Fetch
14. Local Storage
15. Canvas and Graphics
16. Web APIs
17. Testing with Jest
18. Node.js Basics
19. Express.js
20. Database Integration
21. Authentication
22. Real-time with WebSockets
23. Build Tools
24. Performance Optimization
25. Security Best Practices

### Java (25 tutorials)
1. Java Fundamentals
2. Classes and Objects
3. Inheritance
4. Polymorphism
5. Interfaces
6. Exception Handling
7. Collections Framework
8. Generics
9. I/O Streams
10. Multithreading
11. Lambda Expressions
12. Stream API
13. JDBC Database
14. Servlets
15. Spring Framework
16. Spring Boot
17. RESTful Services
18. JUnit Testing
19. Maven Build Tool
20. Design Patterns
21. Annotations
22. Reflection API
23. Networking
24. Security
25. Performance Tuning

### TypeScript (25 tutorials)
1. TypeScript Basics
2. Types and Interfaces
3. Classes
4. Generics
5. Advanced Types
6. Modules
7. Decorators
8. Async Programming
9. Testing
10. Node.js with TypeScript
11. React with TypeScript
12. Express API
13. Database Integration
14. Error Handling
15. Utility Types
16. Type Guards
17. Conditional Types
18. Mapped Types
19. Namespace
20. Declaration Files
21. Build Configuration
22. Linting and Formatting
23. Performance
24. Migration Strategies
25. Best Practices

### C++ (25 tutorials)
1. C++ Fundamentals
2. Pointers and References
3. Classes and Objects
4. Inheritance
5. Polymorphism
6. Templates
7. STL Containers
8. Algorithms
9. Memory Management
10. Exception Handling
11. File I/O
12. Multithreading
13. Smart Pointers
14. Move Semantics
15. Lambda Expressions
16. Operator Overloading
17. Virtual Functions
18. Abstract Classes
19. Design Patterns
20. Debugging
21. Performance Optimization
22. Modern C++
23. Concurrency
24. Networking
25. Best Practices

## Database Schema

Tutorials are stored in the `tutorials` collection with the following schema:

```javascript
{
  title: String (required),
  slug: String (required, unique),
  description: String (required),
  category: String (enum),
  language: String (enum),
  difficulty: String (enum: beginner, intermediate, advanced),
  estimatedTime: Number (minutes),
  tags: [String],
  prerequisites: [String],
  learningObjectives: [String],
  steps: [{
    stepNumber: Number,
    title: String,
    content: String,
    codeExamples: [{
      language: String,
      code: String,
      explanation: String
    }]
  }],
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  author: {
    name: String,
    bio: String
  },
  rating: {
    average: Number,
    count: Number
  },
  stats: {
    views: Number,
    completions: Number,
    likes: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Instructions

1. **Start MongoDB**: Ensure MongoDB is running on `mongodb://127.0.0.1:27017/seek_platform`

2. **Navigate to Backend Directory**:
   ```bash
   cd backend
   ```

3. **Run the Seeding Script**:
   ```bash
   npm run seed:full
   ```

4. **Verify Seeding**: Check the console output for success messages and tutorial counts

## Verification

After seeding, you can verify the tutorials in your MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use the seek_platform database
use seek_platform

# Count total tutorials
db.tutorials.countDocuments()

# Count tutorials by language
db.tutorials.aggregate([
  { $group: { _id: "$language", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

# Count tutorials by difficulty
db.tutorials.aggregate([
  { $group: { _id: "$difficulty", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

## API Endpoints

Once seeded, tutorials can be accessed via the following API endpoints:

- `GET /api/tutorials` - Get all tutorials
- `GET /api/tutorials/:slug` - Get specific tutorial
- `GET /api/tutorials/language/:language` - Get tutorials by language
- `GET /api/tutorials/category/:category` - Get tutorials by category
- `GET /api/tutorials/difficulty/:difficulty` - Get tutorials by difficulty

## Notes

- **Performance**: Seeding is done in batches of 50 tutorials for optimal performance
- **Uniqueness**: Each tutorial has a unique slug for URL routing
- **Ratings**: Random ratings between 4.2-5.0 for realistic distribution
- **Statistics**: Random view counts, completions, and likes for demo purposes
- **Extensibility**: Easy to add more tutorials by extending the arrays in the seeding scripts

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running
- Check connection string in the seeding scripts
- Verify database permissions

**Duplicate Slug Errors:**
- Clear existing tutorials before seeding
- Check for duplicate slug generation in scripts

**Memory Issues:**
- Seeding uses batched inserts to prevent memory overflow
- Reduce batch size if needed in the script

---

**Happy Learning! 🚀**