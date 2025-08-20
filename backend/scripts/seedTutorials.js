const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/seek_platform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const tutorials = [
  // HTML & CSS Tutorials
  {
    title: 'HTML & CSS: Building Your First Webpage',
    slug: 'html-css-basics',
    description: 'Learn the fundamentals of HTML and CSS by building a complete webpage from scratch. Perfect for absolute beginners.',
    category: 'Web Development',
    language: 'html',
    difficulty: 'beginner',
    estimatedTime: 120,
    tags: ['html', 'css', 'web', 'frontend', 'beginner'],
    prerequisites: ['Basic computer skills'],
    learningObjectives: [
      'Understand HTML structure and semantics',
      'Learn CSS styling and layout techniques',
      'Build a complete responsive webpage',
      'Understand the box model and flexbox'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'HTML Structure Basics',
        content: "Learn the basic structure of an HTML document including doctype, html, head, and body elements. We'll create your first webpage structure.",
        codeExamples: [
          {
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is my first webpage!</p>
</body>
</html>`,
            explanation: 'This is the basic structure every HTML document needs'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Adding Content with HTML Elements',
        content: "Learn about headings, paragraphs, links, images, and lists. We'll add meaningful content to your webpage.",
        codeExamples: [
          {
            language: 'html',
            code: `<header>
    <h1>My Portfolio</h1>
    <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
    </nav>
</header>
<main>
    <section id="about">
        <h2>About Me</h2>
        <p>I'm a web developer passionate about creating amazing experiences.</p>
        <img src="profile.jpg" alt="My Profile Picture">
    </section>
</main>`,
            explanation: 'Semantic HTML elements help organize content meaningfully'
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Styling with CSS',
        content: 'Introduction to CSS selectors, properties, and values. Learn how to make your webpage look beautiful.',
        codeExamples: [
          {
            language: 'css',
            code: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    background-color: #333;
    color: white;
    padding: 1rem 0;
    text-align: center;
}

h1 {
    margin: 0;
    font-size: 2.5rem;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem;
}

nav a:hover {
    background-color: #555;
    border-radius: 4px;
}`,
            explanation: 'CSS styles control the visual presentation of HTML elements'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'MDN HTML Reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        type: 'documentation'
      },
      {
        title: 'CSS Tricks Flexbox Guide',
        url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
        type: 'article'
      }
    ],
    author: {
      name: 'Seek Learning Team',
      bio: 'Experienced web developers passionate about teaching'
    },
    isFeatured: true,
    rating: { average: 4.8, count: 156 },
    stats: { views: 2340, completions: 1890, likes: 234 }
  },

  // JavaScript Fundamentals
  {
    title: 'JavaScript Fundamentals: Variables and Functions',
    slug: 'javascript-fundamentals',
    description: 'Master the core concepts of JavaScript including variables, data types, functions, and control structures.',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 180,
    tags: ['javascript', 'variables', 'functions', 'programming', 'beginner'],
    prerequisites: ['Basic HTML knowledge'],
    learningObjectives: [
      'Understand JavaScript variables and data types',
      'Write and call functions effectively',
      'Use conditional statements and loops',
      'Handle user input and DOM manipulation'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Variables and Data Types',
        content: 'Learn how to declare variables and work with different data types in JavaScript.',
        codeExamples: [
          {
            language: 'javascript',
            code: `// Variables and data types
let name = "John Doe";          // String
let age = 25;                   // Number
let isStudent = true;           // Boolean
let hobbies = ["coding", "reading", "gaming"]; // Array
let person = {                  // Object
    firstName: "John",
    lastName: "Doe",
    age: 25
};

console.log("Name:", name);
console.log("Age:", age);
console.log("Is student:", isStudent);
console.log("Hobbies:", hobbies);
console.log("Person:", person);`,
            explanation: 'JavaScript has dynamic typing - variables can hold different types of values'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Functions',
        content: 'Learn how to create reusable code with functions, including parameters and return values.',
        codeExamples: [
          {
            language: 'javascript',
            code: `// Function declaration
function greetUser(name, timeOfDay = "day") {
    return \`Good \${timeOfDay}, \${name}! Welcome to JavaScript.\`;
}

// Function call
let greeting = greetUser("Alice", "morning");
console.log(greeting); // Good morning, Alice! Welcome to JavaScript.

// Arrow function
const calculateArea = (length, width) => {
    return length * width;
};

// Using the function
let rectangleArea = calculateArea(5, 3);
console.log("Rectangle area:", rectangleArea); // 15`,
            explanation: 'Functions help organize code into reusable blocks'
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Control Structures',
        content: 'Master if statements, loops, and other control flow mechanisms.',
        codeExamples: [
          {
            language: 'javascript',
            code: `// Conditional statements
let score = 85;

if (score >= 90) {
    console.log("Excellent!");
} else if (score >= 80) {
    console.log("Good job!");
} else if (score >= 70) {
    console.log("Keep trying!");
} else {
    console.log("Need more practice!");
}

// Loops
console.log("\\nCounting to 5:");
for (let i = 1; i <= 5; i++) {
    console.log("Count:", i);
}

// Array iteration
let fruits = ["apple", "banana", "orange"];
console.log("\\nFruits:");
fruits.forEach((fruit, index) => {
    console.log(\`\${index + 1}. \${fruit}\`);
});`,
            explanation: 'Control structures help make decisions and repeat code'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'MDN JavaScript Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        type: 'documentation'
      }
    ],
    author: {
      name: 'Sarah Johnson',
      bio: 'Full-stack developer with 8 years of experience'
    },
    isFeatured: true,
    rating: { average: 4.7, count: 203 },
    stats: { views: 3120, completions: 2456, likes: 312 }
  },

  // Python Basics
  {
    title: 'Python Programming: Getting Started',
    slug: 'python-basics',
    description: 'Learn Python programming from scratch with hands-on examples and practical exercises.',
    category: 'Programming Fundamentals',
    language: 'python',
    difficulty: 'beginner',
    estimatedTime: 150,
    tags: ['python', 'programming', 'basics', 'beginner'],
    prerequisites: ['Basic computer literacy'],
    learningObjectives: [
      'Understand Python syntax and structure',
      'Work with variables and data types',
      'Create functions and modules',
      'Handle files and exceptions'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Python Syntax and Variables',
        content: 'Learn the clean and readable syntax of Python and how to work with variables.',
        codeExamples: [
          {
            language: 'python',
            code: `# Python basics - variables and data types
name = "Python Developer"
age = 30
height = 5.9
is_programmer = True
skills = ["Python", "JavaScript", "SQL"]

# Python uses indentation for code blocks
print(f"Hello! My name is {name}")
print(f"I am {age} years old and {height} feet tall")
print(f"Am I a programmer? {is_programmer}")
print("My skills include:")
for skill in skills:
    print(f"  - {skill}")

# Lists and dictionaries
person = {
    "name": name,
    "age": age,
    "skills": skills
}
print("\\nPerson info:", person)`,
            explanation: 'Python uses indentation and has clean, readable syntax'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Functions and Control Flow',
        content: 'Master Python functions, conditionals, and loops to write efficient programs.',
        codeExamples: [
          {
            language: 'python',
            code: `def calculate_grade(score):
    """Calculate letter grade based on numeric score"""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

# Test the function
scores = [95, 87, 72, 65, 45]
print("Grade Report:")
print("-" * 20)

for i, score in enumerate(scores, 1):
    grade = calculate_grade(score)
    print(f"Student {i}: {score} points = Grade {grade}")

# List comprehension (advanced)
passing_scores = [score for score in scores if score >= 60]
print(f"\\nPassing scores: {passing_scores}")
print(f"Average passing score: {sum(passing_scores) / len(passing_scores):.1f}")`,
            explanation: "Python functions are defined with 'def' and can include docstrings"
          }
        ]
      }
    ],
    resources: [
      {
        title: 'Python.org Tutorial',
        url: 'https://docs.python.org/3/tutorial/',
        type: 'documentation'
      }
    ],
    author: {
      name: 'Dr. Alex Chen',
      bio: 'Computer Science professor and Python expert'
    },
    rating: { average: 4.9, count: 178 },
    stats: { views: 2890, completions: 2234, likes: 289 }
  },

  // React Tutorial
  {
    title: 'React Fundamentals: Building Interactive UIs',
    slug: 'react-fundamentals',
    description: 'Learn React.js from the ground up and build your first interactive web applications.',
    category: 'Web Development',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 240,
    tags: ['react', 'javascript', 'frontend', 'components', 'jsx'],
    prerequisites: ['JavaScript fundamentals', 'HTML/CSS knowledge'],
    learningObjectives: [
      'Understand React components and JSX',
      'Manage component state with useState',
      'Handle events and user interactions',
      'Build a complete React application'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Your First React Component',
        content: 'Learn about React components, JSX syntax, and how to create reusable UI elements.',
        codeExamples: [
          {
            language: 'javascript',
            code: `import React from 'react';

// Functional component
function Welcome(props) {
    return (
        <div className="welcome-container">
            <h1>Hello, {props.name}!</h1>
            <p>Welcome to React development.</p>
        </div>
    );
}

// Using the component
function App() {
    return (
        <div className="app">
            <Welcome name="Sarah" />
            <Welcome name="John" />
            <Welcome name="Alice" />
        </div>
    );
}

export default App;`,
            explanation: 'React components are JavaScript functions that return JSX'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'State and Event Handling',
        content: 'Learn how to add interactivity to your React components with state and event handlers.',
        codeExamples: [
          {
            language: 'javascript',
            code: `import React, { useState } from 'react';

function Counter() {
    // State hook
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState("Click the buttons!");

    // Event handlers
    const increment = () => {
        setCount(count + 1);
        setMessage(\`Count increased to \${count + 1}\`);
    };

    const decrement = () => {
        setCount(count - 1);
        setMessage(\`Count decreased to \${count - 1}\`);
    };

    const reset = () => {
        setCount(0);
        setMessage("Counter reset!");
    };

    return (
        <div className="counter">
            <h2>Interactive Counter</h2>
            <div className="count-display">
                <span className="count-number">{count}</span>
            </div>
            <div className="controls">
                <button onClick={decrement}>- Decrease</button>
                <button onClick={reset}>Reset</button>
                <button onClick={increment}>+ Increase</button>
            </div>
            <p className="message">{message}</p>
        </div>
    );
}

export default Counter;`,
            explanation: 'useState hook manages component state and re-renders when state changes'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'React Official Documentation',
        url: 'https://react.dev/',
        type: 'documentation'
      }
    ],
    author: {
      name: 'Emma Rodriguez',
      bio: 'Senior React developer at a major tech company'
    },
    rating: { average: 4.6, count: 134 },
    stats: { views: 1890, completions: 1234, likes: 167 }
  },

  // Data Structures
  {
    title: 'Data Structures: Arrays and Objects',
    slug: 'data-structures-basics',
    description: 'Master fundamental data structures and learn when and how to use them effectively in your programs.',
    category: 'Data Structures',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 200,
    tags: ['data-structures', 'arrays', 'objects', 'algorithms', 'javascript'],
    prerequisites: ['JavaScript fundamentals', 'Basic programming concepts'],
    learningObjectives: [
      'Understand array operations and methods',
      'Work with objects and nested data structures',
      'Choose the right data structure for different scenarios',
      'Implement common data structure algorithms'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Array Fundamentals',
        content: 'Deep dive into JavaScript arrays, methods, and common operations.',
        codeExamples: [
          {
            language: 'javascript',
            code: `// Array creation and manipulation
let numbers = [1, 2, 3, 4, 5];
let fruits = ["apple", "banana", "orange"];
let mixed = [1, "hello", true, { name: "John" }];

console.log("Original arrays:");
console.log("Numbers:", numbers);
console.log("Fruits:", fruits);

// Array methods
numbers.push(6);                    // Add to end
numbers.unshift(0);                 // Add to beginning
let lastNumber = numbers.pop();     // Remove from end
let firstNumber = numbers.shift();  // Remove from beginning

console.log("\\nAfter modifications:");
console.log("Numbers:", numbers);
console.log("Removed:", firstNumber, "and", lastNumber);

// Array iteration and transformation
let doubled = numbers.map(num => num * 2);
let evenNumbers = numbers.filter(num => num % 2 === 0);
let sum = numbers.reduce((total, num) => total + num, 0);

console.log("\\nTransformations:");
console.log("Doubled:", doubled);
console.log("Even numbers:", evenNumbers);
console.log("Sum:", sum);`,
            explanation: 'Arrays are ordered collections with powerful built-in methods'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Working with Objects',
        content: 'Learn to create, modify, and work with JavaScript objects and nested structures.',
        codeExamples: [
          {
            language: 'javascript',
            code: `// Object creation and manipulation
let student = {
    name: "Alice Johnson",
    age: 22,
    major: "Computer Science",
    grades: [85, 92, 78, 96],
    address: {
        street: "123 University Ave",
        city: "Tech City",
        zipCode: "12345"
    }
};

// Accessing object properties
console.log("Student Info:");
console.log("Name:", student.name);
console.log("Age:", student.age);
console.log("City:", student.address.city);

// Adding and modifying properties
student.gpa = student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length;
student.graduationYear = 2025;
student.address.state = "CA";

console.log("\\nUpdated student:");
console.log("GPA:", student.gpa.toFixed(2));
console.log("Graduation:", student.graduationYear);

// Object methods and destructuring
const displayStudent = ({ name, age, major, gpa }) => {
    return \`\${name} is a \${age}-year-old \${major} student with a \${gpa.toFixed(2)} GPA\`;
};

console.log("\\nSummary:", displayStudent(student));

// Object.keys, Object.values, Object.entries
console.log("\\nObject analysis:");
console.log("Keys:", Object.keys(student));
console.log("Grade values:", Object.values(student.grades));`,
            explanation: 'Objects store key-value pairs and can contain nested structures'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'JavaScript Data Structures Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
        type: 'documentation'
      }
    ],
    author: {
      name: 'Prof. Michael Kim',
      bio: 'Data structures and algorithms instructor'
    },
    rating: { average: 4.5, count: 89 },
    stats: { views: 1456, completions: 987, likes: 134 }
  },

  // CSS Advanced
  {
    title: 'Advanced CSS: Flexbox and Grid Layouts',
    slug: 'css-flexbox-grid',
    description: 'Master modern CSS layout techniques with Flexbox and CSS Grid to create responsive, professional designs.',
    category: 'Web Development',
    language: 'css',
    difficulty: 'intermediate',
    estimatedTime: 160,
    tags: ['css', 'flexbox', 'grid', 'layout', 'responsive'],
    prerequisites: ['Basic CSS knowledge', 'HTML fundamentals'],
    learningObjectives: [
      'Master Flexbox for one-dimensional layouts',
      'Learn CSS Grid for two-dimensional layouts',
      'Create responsive designs without media queries',
      'Build complex layouts with modern CSS'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Flexbox Fundamentals',
        content: 'Learn to create flexible layouts with CSS Flexbox - perfect for navigation bars, cards, and content alignment.',
        codeExamples: [
          {
            language: 'css',
            code: `/* Flexbox Container */
.flex-container {
    display: flex;
    flex-direction: row;        /* row | column */
    justify-content: center;    /* main axis alignment */
    align-items: center;        /* cross axis alignment */
    gap: 1rem;                 /* space between items */
    padding: 1rem;
    background-color: #f0f0f0;
}

/* Flexbox Items */
.flex-item {
    flex: 1;                   /* grow, shrink, basis */
    padding: 1rem;
    background-color: #007bff;
    color: white;
    text-align: center;
    border-radius: 4px;
}

/* Responsive Flexbox Navigation */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #333;
}

.nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-links a:hover {
    background-color: #555;
}`,
            explanation: 'Flexbox excels at distributing space and aligning items in one dimension'
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'CSS Grid Layouts',
        content: 'Master CSS Grid for creating complex two-dimensional layouts with precise control.',
        codeExamples: [
          {
            language: 'css',
            code: `/* Grid Container */
.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* 3 columns */
    grid-template-rows: auto 1fr auto;   /* 3 rows */
    grid-gap: 1rem;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
}

/* Grid Areas */
.header {
    grid-column: 1 / -1;  /* span all columns */
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
}

.sidebar {
    grid-column: 1;
    background-color: #f4f4f4;
    padding: 1rem;
}

.main-content {
    grid-column: 2;
    padding: 1rem;
    background-color: white;
}

.aside {
    grid-column: 3;
    background-color: #e9ecef;
    padding: 1rem;
}

.footer {
    grid-column: 1 / -1;  /* span all columns */
    background-color: #333;
    color: white;
    padding: 1rem;
    text-align: center;
}

/* Responsive Grid */
@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto 1fr auto auto;
    }
    
    .header, .sidebar, .main-content, .aside, .footer {
        grid-column: 1;
    }
}`,
            explanation: 'CSS Grid provides powerful two-dimensional layout control'
          }
        ]
      }
    ],
    resources: [
      {
        title: 'CSS Grid Complete Guide',
        url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
        type: 'article'
      }
    ],
    author: {
      name: 'Lisa Park',
      bio: 'Senior UI/UX Designer specializing in modern CSS'
    },
    rating: { average: 4.7, count: 112 },
    stats: { views: 1789, completions: 1345, likes: 201 }
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing tutorials
    await MongoTutorial.deleteMany({});
    console.log('🧹 Cleared existing tutorials');

    // Insert new tutorials
    const insertedTutorials = await MongoTutorial.insertMany(tutorials);
    console.log(`✅ Successfully added ${insertedTutorials.length} tutorials:`);

    insertedTutorials.forEach((tutorial) => {
      console.log(`   📚 ${tutorial.title} (${tutorial.language})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
