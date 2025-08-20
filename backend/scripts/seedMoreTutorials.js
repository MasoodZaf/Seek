const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/seek_platform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const moreTutorials = [
  // Node.js Backend
  {
    title: 'Node.js API Development: Building RESTful Services',
    slug: 'nodejs-api-development',
    description: 'Learn to build scalable REST APIs with Node.js, Express, and MongoDB. Perfect for backend development.',
    category: 'Web Development',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 300,
    tags: ['nodejs', 'express', 'api', 'backend', 'mongodb'],
    prerequisites: ['JavaScript fundamentals', 'Basic HTTP knowledge'],
    learningObjectives: [
      'Set up a Node.js server with Express',
      'Create RESTful API endpoints',
      'Connect to MongoDB database',
      'Implement authentication and validation'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Setting up Express Server',
        content: 'Create your first Node.js server using Express framework and understand middleware.',
        codeExamples: [
          {
            language: 'javascript',
            code: `const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our API!',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            posts: '/api/posts'
        }
    });
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    res.json(users);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(\`🚀 Server running on port \${PORT}\`);
});`,
            explanation: 'Express provides a minimal framework for building web applications and APIs'
          }
        ]
      }
    ],
    author: {
      name: 'David Wilson',
      bio: 'Backend engineer with expertise in Node.js and microservices'
    },
    rating: { average: 4.6, count: 167 },
    stats: { views: 2156, completions: 1678, likes: 243 }
  },

  // TypeScript Tutorial
  {
    title: 'TypeScript Essentials: Type-Safe JavaScript',
    slug: 'typescript-essentials',
    description: 'Learn TypeScript to write more reliable and maintainable JavaScript applications with static typing.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 210,
    tags: ['typescript', 'javascript', 'types', 'static-typing'],
    prerequisites: ['Strong JavaScript knowledge', 'ES6+ features'],
    learningObjectives: [
      "Understand TypeScript's type system",
      'Use interfaces and type aliases',
      'Work with generics and advanced types',
      'Configure TypeScript for projects'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'TypeScript Types and Interfaces',
        content: "Learn TypeScript's fundamental types and how to create reusable interfaces.",
        codeExamples: [
          {
            language: 'typescript',
            code: `// Basic types
let userName: string = "John Doe";
let age: number = 30;
let isActive: boolean = true;
let hobbies: string[] = ["coding", "reading"];
let scores: number[] = [95, 87, 92];

// Interface definition
interface User {
    id: number;
    name: string;
    email: string;
    age?: number;  // Optional property
    readonly createdAt: Date;  // Read-only property
}

// Using interfaces
const user: User = {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 28,
    createdAt: new Date()
};

// Function with typed parameters and return type
function getUserInfo(user: User): string {
    return \`\${user.name} (\${user.email}) - Age: \${user.age || 'Unknown'}\`;
}

console.log(getUserInfo(user));

// Array of users
const users: User[] = [
    user,
    {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        createdAt: new Date()
    }
];

// Type alias for union types
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;

interface Task {
    id: ID;
    title: string;
    status: Status;
    assignee: User;
}`,
            explanation: 'TypeScript provides static typing to catch errors at compile time'
          }
        ]
      }
    ],
    author: {
      name: 'Rachel Green',
      bio: 'Senior TypeScript developer and open source contributor'
    },
    rating: { average: 4.8, count: 145 },
    stats: { views: 1987, completions: 1456, likes: 198 }
  },

  // Database Tutorial
  {
    title: 'SQL Database Fundamentals: Queries and Design',
    slug: 'sql-database-fundamentals',
    description: 'Master SQL database queries, table design, and relationships to manage data effectively.',
    category: 'Database',
    language: 'sql',
    difficulty: 'beginner',
    estimatedTime: 180,
    tags: ['sql', 'database', 'queries', 'mysql', 'postgresql'],
    prerequisites: ['Basic computer skills'],
    learningObjectives: [
      'Write SELECT, INSERT, UPDATE, DELETE queries',
      'Design normalized database tables',
      'Create relationships between tables',
      'Use joins and aggregate functions'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Basic SQL Queries',
        content: 'Learn to retrieve and manipulate data using fundamental SQL commands.',
        codeExamples: [
          {
            language: 'sql',
            code: `-- Create a sample database table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert sample data
INSERT INTO employees (first_name, last_name, email, department, salary, hire_date) VALUES
('John', 'Doe', 'john.doe@company.com', 'Engineering', 75000.00, '2022-01-15'),
('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 65000.00, '2022-02-20'),
('Mike', 'Johnson', 'mike.johnson@company.com', 'Engineering', 80000.00, '2021-11-10'),
('Sarah', 'Wilson', 'sarah.wilson@company.com', 'HR', 60000.00, '2023-03-05');

-- Basic SELECT queries
SELECT * FROM employees;

SELECT first_name, last_name, department 
FROM employees 
WHERE department = 'Engineering';

SELECT first_name, last_name, salary 
FROM employees 
WHERE salary > 70000 
ORDER BY salary DESC;

-- Aggregate functions
SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary
FROM employees 
WHERE is_active = TRUE
GROUP BY department
HAVING COUNT(*) > 1;

-- Update and delete
UPDATE employees 
SET salary = salary * 1.05 
WHERE department = 'Engineering';

-- Don't run this without WHERE clause!
DELETE FROM employees WHERE is_active = FALSE;`,
            explanation: 'SQL is the standard language for managing relational databases'
          }
        ]
      }
    ],
    author: {
      name: 'Dr. Maria Garcia',
      bio: 'Database architect with 15+ years of experience in SQL and NoSQL'
    },
    rating: { average: 4.7, count: 198 },
    stats: { views: 2567, completions: 1987, likes: 287 }
  },

  // Git Version Control
  {
    title: 'Git Version Control: Mastering Code Management',
    slug: 'git-version-control',
    description: 'Learn Git fundamentals to track changes, collaborate with teams, and manage your codebase effectively.',
    category: 'DevOps',
    language: 'general',
    difficulty: 'beginner',
    estimatedTime: 150,
    tags: ['git', 'version-control', 'github', 'collaboration', 'devops'],
    prerequisites: ['Basic command line knowledge'],
    learningObjectives: [
      'Understand Git workflow and commands',
      'Create and manage repositories',
      'Work with branches and merging',
      'Collaborate using remote repositories'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Git Basics and Repository Setup',
        content: 'Learn fundamental Git commands and how to initialize and manage repositories.',
        codeExamples: [
          {
            language: 'javascript',
            code: `# Initialize a new Git repository
git init my-project
cd my-project

# Configure Git (first time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check Git status
git status

# Create a file and add it to staging
echo "# My Project" > README.md
git add README.md

# Commit the changes
git commit -m "Initial commit: Add README"

# View commit history
git log --oneline

# Check differences
echo "This is my awesome project!" >> README.md
git diff README.md

# Stage and commit the changes
git add README.md
git commit -m "Update README with project description"

# Create a .gitignore file
echo -e "node_modules/\\n*.log\\n.env" > .gitignore
git add .gitignore
git commit -m "Add .gitignore file"

# View repository status
git status
git log --oneline --graph`,
            explanation: 'Git tracks changes to files and allows you to save snapshots of your project'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Branching and Merging',
        content: 'Learn to work with branches to develop features independently and merge them back.',
        codeExamples: [
          {
            language: 'javascript',
            code: `# Create and switch to a new branch
git branch feature/add-navigation
git checkout feature/add-navigation
# Or in one command: git checkout -b feature/add-navigation

# Make changes on the feature branch
mkdir src
echo "console.log('Navigation loaded');" > src/navigation.js
git add src/navigation.js
git commit -m "Add navigation component"

# Switch back to main branch
git checkout main

# View all branches
git branch -a

# Merge the feature branch into main
git merge feature/add-navigation

# Delete the merged branch
git branch -d feature/add-navigation

# Working with remote repositories
git remote add origin https://github.com/username/my-project.git

# Push to remote repository
git push -u origin main

# Clone an existing repository
git clone https://github.com/username/existing-project.git

# Pull changes from remote
git pull origin main

# Create a pull request workflow
git checkout -b feature/new-feature
# Make changes...
git add .
git commit -m "Implement new feature"
git push origin feature/new-feature
# Then create PR on GitHub`,
            explanation: 'Branches allow parallel development and safe experimentation'
          }
        ]
      }
    ],
    author: {
      name: 'Tom Anderson',
      bio: 'DevOps engineer and Git workflow specialist'
    },
    rating: { average: 4.9, count: 234 },
    stats: { views: 3456, completions: 2789, likes: 398 }
  },

  // Machine Learning Basics
  {
    title: 'Machine Learning with Python: Getting Started',
    slug: 'machine-learning-python-basics',
    description: 'Introduction to machine learning concepts using Python, pandas, and scikit-learn with practical examples.',
    category: 'Machine Learning',
    language: 'python',
    difficulty: 'intermediate',
    estimatedTime: 270,
    tags: ['machine-learning', 'python', 'pandas', 'scikit-learn', 'data-science'],
    prerequisites: ['Python programming', 'Basic statistics', 'High school math'],
    learningObjectives: [
      'Understand machine learning fundamentals',
      'Work with data using pandas',
      'Build and evaluate ML models',
      'Apply supervised learning algorithms'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Data Handling with Pandas',
        content: 'Learn to load, clean, and explore data using pandas - the foundation of ML projects.',
        codeExamples: [
          {
            language: 'python',
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Create sample dataset
np.random.seed(42)
data = {
    'house_size': np.random.normal(2000, 500, 1000),
    'bedrooms': np.random.randint(1, 6, 1000),
    'age': np.random.randint(1, 50, 1000),
    'location_score': np.random.uniform(1, 10, 1000)
}

# Add price based on features (with some noise)
data['price'] = (
    data['house_size'] * 150 + 
    data['bedrooms'] * 10000 + 
    (50 - data['age']) * 1000 + 
    data['location_score'] * 5000 + 
    np.random.normal(0, 20000, 1000)
)

# Create DataFrame
df = pd.DataFrame(data)

# Data exploration
print("Dataset Info:")
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print("\\nFirst 5 rows:")
print(df.head())

print("\\nStatistical Summary:")
print(df.describe())

print("\\nCorrelation with price:")
correlations = df.corr()['price'].sort_values(ascending=False)
print(correlations)

# Data visualization
plt.figure(figsize=(12, 8))
plt.subplot(2, 2, 1)
plt.scatter(df['house_size'], df['price'], alpha=0.5)
plt.xlabel('House Size (sq ft)')
plt.ylabel('Price ($)')
plt.title('Price vs House Size')

plt.subplot(2, 2, 2)
plt.scatter(df['bedrooms'], df['price'], alpha=0.5)
plt.xlabel('Bedrooms')
plt.ylabel('Price ($)')
plt.title('Price vs Bedrooms')

plt.tight_layout()
plt.show()`,
            explanation: 'Data exploration is crucial before building any ML model'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Building Your First ML Model',
        content: 'Create a linear regression model to predict house prices and evaluate its performance.',
        codeExamples: [
          {
            language: 'python',
            code: `# Prepare features and target
features = ['house_size', 'bedrooms', 'age', 'location_score']
X = df[features]
y = df['price']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Create and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

# Evaluate the model
train_mse = mean_squared_error(y_train, y_pred_train)
test_mse = mean_squared_error(y_test, y_pred_test)
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)

print("\\nModel Performance:")
print(f"Training MSE: {train_mse:,.2f}")
print(f"Test MSE: {test_mse:,.2f}")
print(f"Training R²: {train_r2:.3f}")
print(f"Test R²: {test_r2:.3f}")

# Feature importance (coefficients)
print("\\nFeature Importance:")
for feature, coef in zip(features, model.coef_):
    print(f"{feature}: {coef:,.2f}")

print(f"Intercept: {model.intercept_:,.2f}")

# Make predictions for new houses
new_houses = pd.DataFrame({
    'house_size': [1800, 2500, 3000],
    'bedrooms': [3, 4, 5],
    'age': [10, 5, 2],
    'location_score': [7.5, 8.0, 9.2]
})

predictions = model.predict(new_houses)
print("\\nPredictions for new houses:")
for i, pred in enumerate(predictions):
    print(f"House {i+1}: {pred:,.2f}")`,
            explanation: 'Linear regression is a great starting point for understanding ML concepts'
          }
        ]
      }
    ],
    author: {
      name: 'Dr. Jennifer Liu',
      bio: 'Data scientist and ML researcher with focus on practical applications'
    },
    rating: { average: 4.5, count: 167 },
    stats: { views: 2234, completions: 1567, likes: 223 }
  },

  // Web Security
  {
    title: 'Web Security Fundamentals: Protecting Applications',
    slug: 'web-security-fundamentals',
    description: 'Learn essential web security concepts and best practices to protect your applications from common vulnerabilities.',
    category: 'Security',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 200,
    tags: ['security', 'web-security', 'authentication', 'xss', 'csrf'],
    prerequisites: ['Web development basics', 'JavaScript knowledge', 'Basic HTTP understanding'],
    learningObjectives: [
      'Understand common web vulnerabilities',
      'Implement secure authentication',
      'Prevent XSS and CSRF attacks',
      'Follow security best practices'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Authentication and Authorization',
        content: 'Learn to implement secure user authentication and protect routes with proper authorization.',
        codeExamples: [
          {
            language: 'javascript',
            code: `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Password hashing
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Password verification
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// JWT token generation
const generateToken = (userId) => {
    return jwt.sign(
        { userId, timestamp: Date.now() },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Token verification middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.userId = decoded.userId;
        next();
    });
};

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Secure login endpoint
app.post('/api/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        // Find user (example with database query)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = generateToken(user._id);
        
        // Set secure cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});`,
            explanation: 'Secure authentication requires proper password hashing, token management, and rate limiting'
          }
        ]
      }
    ],
    author: {
      name: 'Alex Security',
      bio: 'Cybersecurity specialist with focus on web application security'
    },
    rating: { average: 4.8, count: 189 },
    stats: { views: 2678, completions: 1998, likes: 312 }
  }
];

// Function to add more tutorials
async function addMoreTutorials() {
  try {
    console.log('🌱 Adding more tutorials to database...');

    // Insert new tutorials (without clearing existing ones)
    const insertedTutorials = await MongoTutorial.insertMany(moreTutorials);
    console.log(`✅ Successfully added ${insertedTutorials.length} more tutorials:`);

    insertedTutorials.forEach((tutorial) => {
      console.log(`   📚 ${tutorial.title} (${tutorial.language})`);
    });

    // Get total count
    const totalCount = await MongoTutorial.countDocuments();
    console.log(`\n📊 Total tutorials in database: ${totalCount}`);

    console.log('\n🎉 Additional tutorials added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding tutorials:', error);
    process.exit(1);
  }
}

// Run the function
addMoreTutorials();
