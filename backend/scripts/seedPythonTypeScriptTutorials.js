const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/seek_platform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const pythonTypeScriptTutorials = [
  // Python Web Development
  {
    title: 'Python Web Development with Flask: Building APIs',
    slug: 'python-flask-web-development',
    description: 'Learn to build RESTful web APIs using Flask, handle databases, and create scalable web applications.',
    category: 'Web Development',
    language: 'python',
    difficulty: 'intermediate',
    estimatedTime: 280,
    tags: ['python', 'flask', 'web-development', 'api', 'rest'],
    prerequisites: ['Python fundamentals', 'Basic HTML knowledge', 'HTTP concepts'],
    learningObjectives: [
      'Build REST APIs with Flask',
      'Handle database operations',
      'Implement authentication',
      'Deploy Flask applications'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Flask Application Setup',
        content: 'Learn to create a Flask application with routes, request handling, and JSON responses.',
        codeExamples: [
          {
            language: 'python',
            code: `from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Sample data (in real app, this would be a database)
books = [
    {
        "id": 1,
        "title": "Python Programming",
        "author": "John Smith",
        "published_year": 2022,
        "isbn": "978-1234567890",
        "available": True
    },
    {
        "id": 2,
        "title": "Web Development with Flask",
        "author": "Jane Doe",
        "published_year": 2023,
        "isbn": "978-0987654321",
        "available": True
    }
]

# Helper function to find book by ID
def find_book(book_id):
    return next((book for book in books if book["id"] == book_id), None)

# Routes
@app.route('/')
def home():
    """Home endpoint with API information"""
    return jsonify({
        "message": "Welcome to the Library API",
        "version": "1.0",
        "endpoints": {
            "GET /api/books": "Get all books",
            "GET /api/books/<id>": "Get specific book",
            "POST /api/books": "Add new book",
            "PUT /api/books/<id>": "Update book",
            "DELETE /api/books/<id>": "Delete book"
        },
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books with optional filtering"""
    # Get query parameters
    author = request.args.get('author')
    available = request.args.get('available')
    
    filtered_books = books.copy()
    
    # Apply filters
    if author:
        filtered_books = [book for book in filtered_books 
                         if author.lower() in book['author'].lower()]
    
    if available is not None:
        is_available = available.lower() == 'true'
        filtered_books = [book for book in filtered_books 
                         if book['available'] == is_available]
    
    return jsonify({
        "books": filtered_books,
        "total": len(filtered_books),
        "filters_applied": {
            "author": author,
            "available": available
        }
    })

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book by ID"""
    book = find_book(book_id)
    
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    return jsonify({"book": book})

@app.route('/api/books', methods=['POST'])
def create_book():
    """Create a new book"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'author', 'published_year', 'isbn']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create new book
        new_book = {
            "id": max([book["id"] for book in books]) + 1 if books else 1,
            "title": data['title'],
            "author": data['author'],
            "published_year": data['published_year'],
            "isbn": data['isbn'],
            "available": data.get('available', True)
        }
        
        books.append(new_book)
        
        return jsonify({
            "message": "Book created successfully",
            "book": new_book
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("Starting Flask Library API...")
    print("Available at: http://localhost:5000")
    app.run(debug=True, port=5000)`,
            explanation: 'Flask makes it easy to create web APIs with clean routing and JSON responses'
          }
        ]
      }
    ],
    author: {
      name: 'Miguel Rodriguez',
      bio: 'Full-stack Python developer with expertise in Flask and Django'
    },
    rating: { average: 4.7, count: 167 },
    stats: { views: 2234, completions: 1567, likes: 223 }
  },

  // Python Data Science
  {
    title: 'Python Data Analysis: Pandas and Visualization',
    slug: 'python-pandas-data-analysis',
    description: 'Master data analysis with pandas, create visualizations with matplotlib, and perform statistical analysis.',
    category: 'Machine Learning',
    language: 'python',
    difficulty: 'intermediate',
    estimatedTime: 250,
    tags: ['python', 'pandas', 'data-analysis', 'matplotlib', 'statistics'],
    prerequisites: ['Python basics', 'Basic statistics', 'NumPy knowledge helpful'],
    learningObjectives: [
      'Master pandas for data manipulation',
      'Create effective data visualizations',
      'Perform statistical analysis',
      'Clean and prepare real-world data'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Data Loading and Exploration with Pandas',
        content: 'Learn to load, explore, and understand your data using pandas DataFrames.',
        codeExamples: [
          {
            language: 'python',
            code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

# Set display options
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)

# Create sample sales data
np.random.seed(42)
n_records = 1000

# Generate sample data
data = {
    'date': pd.date_range(start='2023-01-01', periods=n_records, freq='D')[:n_records],
    'product': np.random.choice(['Laptop', 'Phone', 'Tablet', 'Headphones', 'Monitor'], n_records),
    'sales_amount': np.random.exponential(500, n_records) + 100,
    'quantity': np.random.randint(1, 10, n_records),
    'customer_age': np.random.normal(35, 15, n_records),
    'region': np.random.choice(['North', 'South', 'East', 'West'], n_records),
    'is_weekend': None  # We'll calculate this
}

# Create DataFrame
df = pd.DataFrame(data)

# Calculate weekend flag
df['is_weekend'] = df['date'].dt.dayofweek >= 5

# Add some missing values to make it realistic
missing_indices = np.random.choice(df.index, size=50, replace=False)
df.loc[missing_indices, 'customer_age'] = np.nan

print("=== DATASET OVERVIEW ===")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print()

print("=== FIRST 5 ROWS ===")
print(df.head())
print()

print("=== DATA TYPES ===")
print(df.dtypes)
print()

print("=== STATISTICAL SUMMARY ===")
print(df.describe())
print()

print("=== MISSING VALUES ===")
missing_data = df.isnull().sum()
print(missing_data[missing_data > 0])
print()

print("=== UNIQUE VALUES PER CATEGORICAL COLUMN ===")
categorical_columns = ['product', 'region']
for col in categorical_columns:
    print(f"{col}: {df[col].unique()}")
    print(f"Value counts:")
    print(df[col].value_counts())
    print()

# Basic filtering and grouping
print("=== DATA ANALYSIS EXAMPLES ===")

# Filter high-value sales
high_value_sales = df[df['sales_amount'] > 1000]
print(f"High-value sales (>$1000): {len(high_value_sales)} records")

# Group by product
product_stats = df.groupby('product').agg({
    'sales_amount': ['sum', 'mean', 'count'],
    'quantity': 'sum'
}).round(2)
print("\\nSales by Product:")
print(product_stats)

# Group by region and weekend
region_weekend_stats = df.groupby(['region', 'is_weekend'])['sales_amount'].agg(['sum', 'mean']).round(2)
print("\\nSales by Region and Weekend:")
print(region_weekend_stats)

# Time-based analysis
df['month'] = df['date'].dt.month
monthly_sales = df.groupby('month')['sales_amount'].sum().round(2)
print("\\nMonthly Sales:")
print(monthly_sales)`,
            explanation: 'Pandas provides powerful tools for loading, exploring, and analyzing structured data'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Data Visualization and Insights',
        content: 'Create compelling visualizations to understand patterns and communicate findings.',
        codeExamples: [
          {
            language: 'python',
            code: `# Set up plotting style
plt.style.use('seaborn-v0_8')
fig, axes = plt.subplots(2, 3, figsize=(18, 12))
fig.suptitle('Sales Data Analysis Dashboard', fontsize=16, fontweight='bold')

# 1. Sales distribution histogram
axes[0, 0].hist(df['sales_amount'], bins=50, alpha=0.7, color='skyblue', edgecolor='black')
axes[0, 0].set_title('Distribution of Sales Amounts')
axes[0, 0].set_xlabel('Sales Amount ($)')
axes[0, 0].set_ylabel('Frequency')
axes[0, 0].axvline(df['sales_amount'].mean(), color='red', linestyle='--', 
                   label=f'Mean: {df["sales_amount"].mean():.2f}')
axes[0, 0].legend()

# 2. Sales by product (bar chart)
product_sales = df.groupby('product')['sales_amount'].sum().sort_values(ascending=True)
axes[0, 1].barh(product_sales.index, product_sales.values, color='lightgreen')
axes[0, 1].set_title('Total Sales by Product')
axes[0, 1].set_xlabel('Total Sales ($)')

# 3. Sales over time (line chart)
daily_sales = df.groupby('date')['sales_amount'].sum()
axes[0, 2].plot(daily_sales.index, daily_sales.values, linewidth=1, color='purple')
axes[0, 2].set_title('Daily Sales Trend')
axes[0, 2].set_xlabel('Date')
axes[0, 2].set_ylabel('Daily Sales ($)')
axes[0, 2].tick_params(axis='x', rotation=45)

# 4. Sales by region (pie chart)
region_sales = df.groupby('region')['sales_amount'].sum()
axes[1, 0].pie(region_sales.values, labels=region_sales.index, autopct='%1.1f%%', 
               startangle=90, colors=['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'])
axes[1, 0].set_title('Sales Distribution by Region')

# 5. Weekend vs Weekday sales (box plot)
weekend_data = [df[df['is_weekend'] == False]['sales_amount'], 
                df[df['is_weekend'] == True]['sales_amount']]
axes[1, 1].boxplot(weekend_data, labels=['Weekday', 'Weekend'])
axes[1, 1].set_title('Sales Amount: Weekday vs Weekend')
axes[1, 1].set_ylabel('Sales Amount ($)')

# 6. Correlation heatmap
numeric_cols = ['sales_amount', 'quantity', 'customer_age']
correlation_matrix = df[numeric_cols].corr()
im = axes[1, 2].imshow(correlation_matrix, cmap='coolwarm', aspect='auto')
axes[1, 2].set_xticks(range(len(numeric_cols)))
axes[1, 2].set_yticks(range(len(numeric_cols)))
axes[1, 2].set_xticklabels(numeric_cols, rotation=45)
axes[1, 2].set_yticklabels(numeric_cols)
axes[1, 2].set_title('Correlation Matrix')

# Add correlation values to heatmap
for i in range(len(numeric_cols)):
    for j in range(len(numeric_cols)):
        text = axes[1, 2].text(j, i, f'{correlation_matrix.iloc[i, j]:.2f}',
                              ha="center", va="center", color="black")

plt.tight_layout()
plt.show()

# Advanced analysis
print("=== ADVANCED INSIGHTS ===")

# Statistical tests and insights
weekend_sales = df[df['is_weekend'] == True]['sales_amount']
weekday_sales = df[df['is_weekend'] == False]['sales_amount']

print(f"Weekend sales average: {weekend_sales.mean():.2f}")
print(f"Weekday sales average: {weekday_sales.mean():.2f}")
print(f"Difference: {weekend_sales.mean() - weekday_sales.mean():.2f}")

# Top performing products
print("\\nTop 3 products by total revenue:")
top_products = df.groupby('product')['sales_amount'].sum().sort_values(ascending=False).head(3)
for product, revenue in top_products.items():
    print(f"  {product}: {revenue:,.2f}")

# Regional performance
print("\\nRegional performance metrics:")
regional_metrics = df.groupby('region').agg({
    'sales_amount': ['sum', 'mean', 'std'],
    'quantity': 'sum'
}).round(2)
print(regional_metrics)

# Customer age insights
age_no_na = df['customer_age'].dropna()
print(f"\\nCustomer age insights:")
print(f"  Average age: {age_no_na.mean():.1f} years")
print(f"  Age range: {age_no_na.min():.1f} - {age_no_na.max():.1f} years")
print(f"  Most common age group: {pd.cut(age_no_na, bins=[0, 25, 35, 50, 100], labels=['18-25', '26-35', '36-50', '50+']).value_counts().index[0]}")`,
            explanation: 'Effective visualizations help identify patterns, trends, and insights in your data'
          }
        ]
      }
    ],
    author: {
      name: 'Dr. Jennifer Liu',
      bio: 'Data scientist specializing in Python analytics and visualization'
    },
    rating: { average: 4.6, count: 189 },
    stats: { views: 2456, completions: 1789, likes: 267 }
  },

  // Advanced TypeScript
  {
    title: 'Advanced TypeScript: Generics and Utility Types',
    slug: 'typescript-generics-utility-types',
    description: 'Master advanced TypeScript features including generics, utility types, and type manipulation for robust applications.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'advanced',
    estimatedTime: 240,
    tags: ['typescript', 'generics', 'utility-types', 'advanced'],
    prerequisites: ['TypeScript basics', 'JavaScript ES6+', 'Basic type theory'],
    learningObjectives: [
      'Master generic types and constraints',
      'Use utility types effectively',
      'Create complex type definitions',
      'Apply advanced TypeScript patterns'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Generic Types and Functions',
        content: 'Learn to create flexible, reusable code with TypeScript generics and type constraints.',
        codeExamples: [
          {
            language: 'typescript',
            code: `// Basic generic function
function identity<T>(arg: T): T {
    return arg;
}

// Usage
const numberResult = identity<number>(42);
const stringResult = identity<string>("Hello TypeScript");
const booleanResult = identity(true); // Type inference

// Generic interface
interface Repository<T> {
    items: T[];
    add(item: T): void;
    findById(id: string): T | undefined;
    findAll(): T[];
    update(id: string, item: Partial<T>): boolean;
    delete(id: string): boolean;
}

// Generic class implementation
class GenericRepository<T extends { id: string }> implements Repository<T> {
    public items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    findById(id: string): T | undefined {
        return this.items.find(item => item.id === id);
    }

    findAll(): T[] {
        return [...this.items]; // Return copy
    }

    update(id: string, updatedItem: Partial<T>): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updatedItem };
            return true;
        }
        return false;
    }

    delete(id: string): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}

// Define types for our entities
interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

// Create repositories
const userRepository = new GenericRepository<User>();
const productRepository = new GenericRepository<Product>();

// Use the repositories
userRepository.add({
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin"
});

productRepository.add({
    id: "prod1",
    name: "TypeScript Book",
    price: 29.99,
    category: "Books",
    inStock: true
});

// Generic constraint example
interface Lengthy {
    length: number;
}

function logLength<T extends Lengthy>(item: T): T {
    console.log(\`Item has length: \{item.length}\`);
    return item;
}

// These work because they have length property
logLength("Hello World"); // string has length
logLength([1, 2, 3, 4]); // array has length
logLength({ length: 5, data: "test" }); // object with length

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

const merged = merge({ name: "John" }, { age: 30 });
console.log(merged.name); // TypeScript knows this exists
console.log(merged.age);  // TypeScript knows this exists too

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

type StringOrNull = string | null;
type JustString = NonNullable<StringOrNull>; // This becomes just 'string'

// Generic utility function with constraints
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
        result[key] = obj[key];
    }
    return result;
}

const user: User = {
    id: "user2",
    name: "Jane Smith", 
    email: "jane@example.com",
    role: "user"
};

// Pick only specific properties
const userSummary = pick(user, ['name', 'email']);
console.log(userSummary); // { name: "Jane Smith", email: "jane@example.com" }`,
            explanation: 'Generics provide type safety while maintaining flexibility and reusability'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Utility Types and Advanced Patterns',
        content: "Master TypeScript's built-in utility types and create sophisticated type manipulations.",
        codeExamples: [
          {
            language: 'typescript',
            code: `// Utility Types Examples

// 1. Partial - makes all properties optional
interface CreateUserRequest {
    name: string;
    email: string;
    age: number;
    role: 'admin' | 'user';
}

function updateUser(id: string, updates: Partial<CreateUserRequest>) {
    // Can pass any subset of properties
    console.log(\`Updating user \{id} with:, updates\`);
}

// Usage
updateUser("user1", { name: "New Name" }); // Only name
updateUser("user2", { email: "new@email.com", age: 25 }); // Email and age

// 2. Required - makes all properties required
interface OptionalConfig {
    apiUrl?: string;
    timeout?: number;
    retries?: number;
    debug?: boolean;
}

function initializeApp(config: Required<OptionalConfig>) {
    // All properties are now required
    console.log(\`Initializing with API: \{config.apiUrl}\`);
    console.log(\`Timeout: \{config.timeout}ms\`);
}

// 3. Pick - select specific properties
type UserSummary = Pick<CreateUserRequest, 'name' | 'email'>;

const summary: UserSummary = {
    name: "John Doe",
    email: "john@example.com"
    // age and role are not required
};

// 4. Omit - exclude specific properties
type CreateUserWithoutRole = Omit<CreateUserRequest, 'role'>;

const newUser: CreateUserWithoutRole = {
    name: "Alice Johnson",
    email: "alice@example.com", 
    age: 28
    // role is excluded
};

// 5. Record - create object type with specific keys and values
type UserRoles = 'admin' | 'user' | 'moderator';
type RolePermissions = Record<UserRoles, string[]>;

const permissions: RolePermissions = {
    admin: ['read', 'write', 'delete', 'manage'],
    user: ['read'],
    moderator: ['read', 'write']
};

// 6. Advanced mapped types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type ReadonlyUser = Readonly<CreateUserRequest>;
// All properties become readonly

// 7. Conditional types and type manipulation
type ApiResponse<T> = {
    data: T;
    status: 'success' | 'error';
    message: string;
    timestamp: Date;
};

type ExtractData<T> = T extends ApiResponse<infer U> ? U : never;

type UserResponse = ApiResponse<User>;
type ExtractedUserData = ExtractData<UserResponse>; // This is User type

// 8. Template literal types (TypeScript 4.1+)
type EmailDomain = 'gmail.com' | 'yahoo.com' | 'outlook.com';
type Email<T extends string> = \`\{string}@\{T}\`;

type ValidEmail = Email<EmailDomain>;
// This creates types like "string@gmail.com" | "string@yahoo.com" | "string@outlook.com"

// 9. Complex type manipulation
interface DatabaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

type CreateRequest<T> = Omit<T, keyof DatabaseEntity>;
type UpdateRequest<T> = Partial<CreateRequest<T>>;

interface BlogPost extends DatabaseEntity {
    title: string;
    content: string;
    authorId: string;
    published: boolean;
}

type CreateBlogPostRequest = CreateRequest<BlogPost>;
// { title: string; content: string; authorId: string; published: boolean; }

type UpdateBlogPostRequest = UpdateRequest<BlogPost>;
// { title?: string; content?: string; authorId?: string; published?: boolean; }

// 10. Function type utilities
type EventHandler<T = any> = (event: T) => void;
type AsyncFunction<T, R> = (arg: T) => Promise<R>;

// Extract parameter and return types
type HandlerParam<T> = T extends EventHandler<infer P> ? P : never;
type FunctionReturn<T> = T extends AsyncFunction<any, infer R> ? R : never;

type ClickHandler = EventHandler<MouseEvent>;
type ClickEventType = HandlerParam<ClickHandler>; // MouseEvent

type ApiCall = AsyncFunction<string, User>;
type ApiCallReturn = FunctionReturn<ApiCall>; // User

// 11. Discriminated unions with type guards
interface LoadingState {
    status: 'loading';
}

interface SuccessState {
    status: 'success';
    data: any;
}

interface ErrorState {
    status: 'error';
    error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleAsyncState(state: AsyncState) {
    switch (state.status) {
        case 'loading':
            console.log('Loading...');
            break;
        case 'success':
            console.log('Data:', state.data); // TypeScript knows 'data' exists
            break;
        case 'error':
            console.log('Error:', state.error); // TypeScript knows 'error' exists
            break;
    }
}`,
            explanation: 'Utility types and advanced patterns enable precise type manipulation and safer code'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'TypeScript Handbook - Advanced Types',
        url: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
        type: 'documentation'
      }
    ],
    author: {
      name: 'Alex Thompson',
      bio: 'Senior TypeScript developer and type system expert'
    },
    rating: { average: 4.9, count: 123 },
    stats: { views: 1567, completions: 1123, likes: 189 }
  },

  // TypeScript with React
  {
    title: 'TypeScript with React: Building Type-Safe Components',
    slug: 'typescript-react-type-safe-components',
    description: 'Learn to build robust React applications with TypeScript, including hooks, props, and state management.',
    category: 'Web Development',
    language: 'typescript',
    difficulty: 'intermediate',
    estimatedTime: 220,
    tags: ['typescript', 'react', 'components', 'hooks', 'jsx'],
    prerequisites: ['React fundamentals', 'TypeScript basics', 'Modern JavaScript'],
    learningObjectives: [
      'Type React components and props',
      'Use TypeScript with React hooks',
      'Handle events with proper typing',
      'Implement form handling with types'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'TypeScript React Components and Props',
        content: 'Learn to create type-safe React components with proper prop definitions and interfaces.',
        codeExamples: [
          {
            language: 'typescript',
            code: `import React from 'react';

// Interface for component props
interface UserCardProps {
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string; // Optional property
        role: 'admin' | 'user' | 'moderator'; // Union type
    };
    showEmail?: boolean; // Optional prop with default
    onUserClick?: (userId: string) => void; // Optional callback
    className?: string;
}

// Functional component with typed props
const UserCard: React.FC<UserCardProps> = ({ 
    user, 
    showEmail = true, 
    onUserClick,
    className = "" 
}) => {
    const handleClick = () => {
        onUserClick?.(user.id); // Optional chaining for callback
    };

    return (
        <div 
            className={\`user-card \{className}\`}
            onClick={handleClick}
            style={{ 
                cursor: onUserClick ? 'pointer' : 'default',
                border: '1px solid #ccc',
                padding: '16px',
                borderRadius: '8px',
                margin: '8px 0'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.avatar && (
                    <img 
                        src={user.avatar} 
                        alt={\`\{user.name}'s avatar\`}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                )}
                <div>
                    <h3 style={{ margin: 0, color: '#333' }}>{user.name}</h3>
                    {showEmail && (
                        <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                            {user.email}
                        </p>
                    )}
                    <span 
                        style={{ 
                            fontSize: '12px', 
                            padding: '2px 8px', 
                            backgroundColor: user.role === 'admin' ? '#ff6b6b' : '#4ecdc4',
                            color: 'white',
                            borderRadius: '12px'
                        }}
                    >
                        {user.role}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Interface for a list of users
interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user' | 'moderator';
}

interface UserListProps {
    users: User[];
    title?: string;
    onUserSelect: (user: User) => void; // Required callback
    emptyMessage?: string;
}

const UserList: React.FC<UserListProps> = ({ 
    users, 
    title = "Users", 
    onUserSelect,
    emptyMessage = "No users found" 
}) => {
    if (users.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '16px', color: '#333' }}>{title}</h2>
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    onUserClick={() => onUserSelect(user)}
                    showEmail={true}
                />
            ))}
        </div>
    );
};

// Generic component with type parameter
interface ListItemProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T) => string | number;
    emptyText?: string;
}

function GenericList<T>({ 
    items, 
    renderItem, 
    keyExtractor, 
    emptyText = "No items" 
}: ListItemProps<T>) {
    if (items.length === 0) {
        return <div>{emptyText}</div>;
    }

    return (
        <div>
            {items.map((item, index) => (
                <div key={keyExtractor(item)}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    );
}

// Usage example
const App: React.FC = () => {
    const users: User[] = [
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            avatar: 'https://via.placeholder.com/40'
        },
        {
            id: '2', 
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user'
        }
    ];

    const handleUserSelect = (user: User) => {
        console.log('Selected user:', user.name);
        alert(\`Selected: \{user.name} (\{user.role})\`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>TypeScript React Demo</h1>
            
            <UserList 
                users={users}
                title="Team Members"
                onUserSelect={handleUserSelect}
                emptyMessage="No team members available"
            />

            <h2>Generic List Example</h2>
            <GenericList
                items={users}
                renderItem={(user, index) => (
                    <div style={{ padding: '8px', backgroundColor: '#f0f0f0', margin: '4px 0' }}>
                        {index + 1}. {user.name} - {user.role}
                    </div>
                )}
                keyExtractor={(user) => user.id}
                emptyText="No users in generic list"
            />
        </div>
    );
};

export default App;`,
            explanation: 'TypeScript enables type-safe React development with clear prop interfaces and generic components'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'React Hooks with TypeScript',
        content: 'Master using React hooks with proper TypeScript typing for state management and side effects.',
        codeExamples: [
          {
            language: 'typescript',
            code: `import React, { useState, useEffect, useReducer, useContext, createContext } from 'react';

// Type-safe useState examples
interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
}

const TodoApp: React.FC = () => {
    // Basic useState with explicit typing
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [priority, setPriority] = useState<Todo['priority']>('medium');
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

    // useEffect with cleanup and dependencies
    useEffect(() => {
        // Load todos from localStorage on mount
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            try {
                const parsed: Todo[] = JSON.parse(savedTodos);
                setTodos(parsed.map(todo => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt) // Convert date strings back to Date objects
                })));
            } catch (error) {
                console.error('Failed to load todos:', error);
            }
        }
    }, []); // Empty dependency array - run once on mount

    // useEffect to save todos to localStorage whenever todos change
    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }, [todos]);

    const addTodo = () => {
        if (inputText.trim()) {
            const newTodo: Todo = {
                id: Date.now().toString(),
                text: inputText.trim(),
                completed: false,
                priority,
                createdAt: new Date()
            };
            setTodos(prev => [...prev, newTodo]);
            setInputText('');
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    // Filtered todos with proper typing
    const filteredTodos: Todo[] = todos.filter(todo => {
        switch (filter) {
            case 'completed':
                return todo.completed;
            case 'pending':
                return !todo.completed;
            default:
                return true;
        }
    });

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>TypeScript Todo App</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setInputText(e.target.value)
                    }
                    placeholder="Enter todo text"
                    style={{ marginRight: '10px', padding: '8px' }}
                />
                <select
                    value={priority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setPriority(e.target.value as Todo['priority'])
                    }
                    style={{ marginRight: '10px', padding: '8px' }}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button onClick={addTodo} style={{ padding: '8px 16px' }}>
                    Add Todo
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Filter: </label>
                {(['all', 'completed', 'pending'] as const).map((filterOption) => (
                    <label key={filterOption} style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            value={filterOption}
                            checked={filter === filterOption}
                            onChange={(e) => setFilter(e.target.value as typeof filter)}
                        />
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </label>
                ))}
            </div>

            <div>
                {filteredTodos.map((todo) => (
                    <div
                        key={todo.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px',
                            margin: '5px 0',
                            backgroundColor: todo.completed ? '#e8f5e8' : '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            style={{ marginRight: '10px' }}
                        />
                        <span
                            style={{
                                flex: 1,
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                color: todo.completed ? '#666' : '#333'
                            }}
                        >
                            {todo.text}
                        </span>
                        <span
                            style={{
                                fontSize: '12px',
                                padding: '2px 6px',
                                backgroundColor: 
                                    todo.priority === 'high' ? '#ff6b6b' :
                                    todo.priority === 'medium' ? '#feca57' : '#48cae4',
                                color: 'white',
                                borderRadius: '10px',
                                marginRight: '10px'
                            }}
                        >
                            {todo.priority}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {filteredTodos.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                        No todos found for the current filter.
                    </p>
                )}
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                <p><strong>Statistics:</strong></p>
                <p>Total: {todos.length}</p>
                <p>Completed: {todos.filter(t => t.completed).length}</p>
                <p>Pending: {todos.filter(t => !t.completed).length}</p>
            </div>
        </div>
    );
};

// Context API with TypeScript
interface User {
    id: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse saved user:', error);
            }
        }
    }, []);

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated: user !== null
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default TodoApp;`,
            explanation: 'TypeScript with React hooks provides excellent type safety for state management and side effects'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'React TypeScript Cheatsheet',
        url: 'https://github.com/typescript-cheatsheets/react',
        type: 'reference'
      }
    ],
    author: {
      name: 'Sarah Kim',
      bio: 'React and TypeScript specialist with focus on modern development patterns'
    },
    rating: { average: 4.7, count: 156 },
    stats: { views: 2134, completions: 1567, likes: 234 }
  }
];

// Function to add Python and TypeScript tutorials
async function addPythonTypeScriptTutorials() {
  try {
    console.log('🐍📘 Adding Python and TypeScript tutorials...');

    // Insert new tutorials
    const insertedTutorials = await MongoTutorial.insertMany(pythonTypeScriptTutorials);
    console.log(`✅ Successfully added ${insertedTutorials.length} tutorials:`);

    insertedTutorials.forEach((tutorial) => {
      console.log(`   📚 ${tutorial.title} (${tutorial.language})`);
    });

    // Get total count
    const totalCount = await MongoTutorial.countDocuments();
    console.log(`\n📊 Total tutorials in database: ${totalCount}`);

    console.log('\n🎉 Python and TypeScript tutorials added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding tutorials:', error);
    process.exit(1);
  }
}

// Run the function
addPythonTypeScriptTutorials();
