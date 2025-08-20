const MongoTutorial = require('../models/MongoTutorial');
const logger = require('../config/logger');

const tutorialData = [
  // JavaScript Fundamentals
  {
    title: 'JavaScript Basics: Variables and Data Types',
    slug: 'javascript-basics-variables-data-types',
    description: 'Learn the fundamentals of JavaScript including variables, data types, and basic operations. Perfect for beginners starting their JavaScript journey.',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 45,
    thumbnail: '/images/tutorials/js-basics.png',
    tags: ['javascript', 'variables', 'data-types', 'fundamentals', 'beginner'],
    prerequisites: [],
    learningObjectives: [
      'Understand different data types in JavaScript',
      'Learn how to declare and use variables',
      'Practice basic JavaScript operations',
      'Write your first JavaScript programs'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'What are Variables?',
        content: `Variables are containers that store data values. In JavaScript, you can create variables using \`let\`, \`const\`, or \`var\` keywords.

**Key Points:**
- \`let\`: For variables that can change
- \`const\`: For variables that won't change  
- \`var\`: Older way (avoid in modern JavaScript)

Variables make your code dynamic and reusable!`,
        codeExamples: [
          {
            language: 'javascript',
            code: `// Declaring variables
let userName = "John";
const age = 25;
let isStudent = true;

console.log("Name:", userName);
console.log("Age:", age);
console.log("Is Student:", isStudent);`,
            explanation: 'This example shows how to declare different types of variables and display their values.',
            isExecutable: true
          }
        ],
        hints: [
          'Use descriptive variable names',
          'Start variable names with lowercase letters',
          'Use camelCase for multi-word variables'
        ],
        expectedOutput: 'Name: John\nAge: 25\nIs Student: true'
      },
      {
        stepNumber: 2,
        title: 'JavaScript Data Types',
        content: `JavaScript has several built-in data types. Understanding these is crucial for writing effective code.

**Primitive Data Types:**
1. **String**: Text data
2. **Number**: Numeric data  
3. **Boolean**: True/false values
4. **Undefined**: Variable declared but not assigned
5. **Null**: Intentionally empty value

**Complex Data Types:**
6. **Object**: Collections of key-value pairs
7. **Array**: Ordered lists of values`,
        codeExamples: [
          {
            language: 'javascript',
            code: `// Different data types
let name = "Alice";           // String
let score = 95.5;            // Number
let passed = true;           // Boolean
let grade;                   // Undefined
let notes = null;            // Null

// Complex types
let student = {              // Object
  name: "Alice",
  age: 20
};
let colors = ["red", "blue", "green"]; // Array

// Check types
console.log(typeof name);     // "string"
console.log(typeof score);    // "number" 
console.log(typeof passed);   // "boolean"`,
            explanation: 'This demonstrates all major JavaScript data types and how to check them using typeof.',
            isExecutable: true
          }
        ],
        expectedOutput: 'string\nnumber\nboolean'
      },
      {
        stepNumber: 3,
        title: 'Working with Strings',
        content: `Strings are one of the most commonly used data types. JavaScript provides many methods to work with strings.

**String Operations:**
- Concatenation (joining strings)
- Template literals (modern string formatting)
- String methods (length, uppercase, etc.)`,
        codeExamples: [
          {
            language: 'javascript',
            code: `// String operations
let firstName = "John";
let lastName = "Doe";

// Concatenation
let fullName = firstName + " " + lastName;
console.log("Full name:", fullName);

// Template literals (recommended)
let greeting = \`Hello, \${firstName}!\`;
console.log(greeting);

// String methods
console.log("Length:", fullName.length);
console.log("Uppercase:", fullName.toUpperCase());
console.log("First char:", fullName.charAt(0));`,
            explanation: 'Shows different ways to work with strings, including modern template literal syntax.',
            isExecutable: true
          }
        ],
        hints: [
          'Template literals use backticks (``) instead of quotes',
          'Use \\${variable} inside template literals',
          "String methods don't change the original string"
        ]
      }
    ],
    quiz: [
      {
        question: "Which keyword should you use for a variable that won't change?",
        type: 'multiple-choice',
        options: [
          { text: 'let', isCorrect: false },
          { text: 'const', isCorrect: true },
          { text: 'var', isCorrect: false },
          { text: 'final', isCorrect: false }
        ],
        explanation: "Use 'const' for variables that won't be reassigned after declaration.",
        points: 1
      },
      {
        question: "What is the result of typeof 'Hello'?",
        type: 'multiple-choice',
        options: [
          { text: 'text', isCorrect: false },
          { text: 'string', isCorrect: true },
          { text: 'String', isCorrect: false },
          { text: 'char', isCorrect: false }
        ],
        explanation: "The typeof operator returns 'string' (lowercase) for string values.",
        points: 1
      }
    ],
    resources: [
      {
        title: 'MDN JavaScript Variables',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
        type: 'documentation'
      },
      {
        title: 'JavaScript.info - Variables',
        url: 'https://javascript.info/variables',
        type: 'article'
      }
    ],
    author: {
      name: 'Seek Learning Platform',
      bio: 'Professional programming education platform'
    },
    rating: { average: 4.8, count: 156 },
    stats: { views: 1240, completions: 987, likes: 432 }
  },

  // Python Basics
  {
    title: 'Python Fundamentals: Getting Started',
    slug: 'python-fundamentals-getting-started',
    description: 'Master Python basics including syntax, variables, and control structures. Your first step into the world of Python programming.',
    category: 'Programming Fundamentals',
    language: 'python',
    difficulty: 'beginner',
    estimatedTime: 60,
    tags: ['python', 'basics', 'syntax', 'variables', 'beginner'],
    prerequisites: [],
    learningObjectives: [
      'Understand Python syntax and indentation',
      'Learn Python data types and variables',
      'Master basic input/output operations',
      'Write simple Python programs'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Python Syntax and Indentation',
        content: `Python is known for its clean, readable syntax. Unlike other languages that use braces {}, Python uses indentation to define code blocks.

**Key Features:**
- No semicolons needed
- Indentation matters (usually 4 spaces)
- Case-sensitive
- Comments start with #`,
        codeExamples: [
          {
            language: 'python',
            code: `# This is a comment
print("Hello, Python!")

# Variables don't need declaration
name = "Alice"
age = 25

# Indentation defines code blocks
if age >= 18:
    print(f"{name} is an adult")
    print("Can vote!")
else:
    print(f"{name} is a minor")

print("This is outside the if block")`,
            explanation: 'Notice how indentation (4 spaces) groups the code inside the if/else blocks.',
            isExecutable: true
          }
        ],
        expectedOutput: 'Hello, Python!\nAlice is an adult\nCan vote!\nThis is outside the if block'
      },
      {
        stepNumber: 2,
        title: 'Python Data Types and Variables',
        content: `Python has dynamic typing, meaning you don't need to declare variable types explicitly. Python will figure it out!

**Common Data Types:**
- **int**: Whole numbers (1, -5, 1000)
- **float**: Decimal numbers (3.14, -2.5)
- **str**: Text ("hello", 'world')
- **bool**: True or False
- **list**: Ordered collection [1, 2, 3]
- **dict**: Key-value pairs {"name": "John"}`,
        codeExamples: [
          {
            language: 'python',
            code: `# Python automatically detects types
number = 42                    # int
price = 19.99                  # float
name = "Python"                # str
is_fun = True                  # bool

# Collections
fruits = ["apple", "banana", "orange"]     # list
person = {"name": "John", "age": 30}       # dict

# Check types
print(f"number is {type(number)}")
print(f"price is {type(price)}")
print(f"name is {type(name)}")

# Working with collections
print(f"First fruit: {fruits[0]}")
print(f"Person's name: {person['name']}")`,
            explanation: "Python's type() function shows the data type of any variable.",
            isExecutable: true
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Input and Output',
        content: `Python makes it easy to interact with users through input and output operations.

**Key Functions:**
- **print()**: Display output to screen
- **input()**: Get input from user
- **f-strings**: Format strings with variables`,
        codeExamples: [
          {
            language: 'python',
            code: `# Output with print()
print("Welcome to Python!")
print("You can print", "multiple", "items")

# Variables in print
name = "Student"
score = 95
print(f"Congratulations {name}! Your score is {score}%")

# Different formatting options
print(f"Score as decimal: {score/100:.2f}")
print("Traditional format: {}".format(name))
print("Old style: %s scored %d%%" % (name, score))

# Input (commented out for demo - would wait for user input)
# user_name = input("What's your name? ")
# print(f"Hello, {user_name}!")`,
            explanation: "f-strings (f'...') are the modern, preferred way to format strings in Python.",
            isExecutable: true
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'How many spaces are typically used for indentation in Python?',
        type: 'multiple-choice',
        options: [
          { text: '2', isCorrect: false },
          { text: '4', isCorrect: true },
          { text: '6', isCorrect: false },
          { text: '8', isCorrect: false }
        ],
        explanation: 'Python convention is to use 4 spaces for each indentation level.',
        points: 1
      }
    ],
    resources: [
      {
        title: 'Python.org Tutorial',
        url: 'https://docs.python.org/3/tutorial/',
        type: 'documentation'
      }
    ],
    rating: { average: 4.7, count: 203 },
    stats: { views: 1580, completions: 1247, likes: 567 }
  },

  // Web Development
  {
    title: 'HTML & CSS: Building Your First Webpage',
    slug: 'html-css-first-webpage',
    description: 'Create beautiful, responsive webpages from scratch. Learn HTML structure and CSS styling with hands-on examples.',
    category: 'Web Development',
    language: 'html',
    difficulty: 'beginner',
    estimatedTime: 90,
    tags: ['html', 'css', 'web', 'frontend', 'responsive'],
    prerequisites: [],
    learningObjectives: [
      'Understand HTML document structure',
      'Learn essential HTML tags and elements',
      'Style elements with CSS',
      'Create responsive layouts'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'HTML Document Structure',
        content: `Every HTML document follows a standard structure. Think of HTML as the skeleton of your webpage - it provides structure and meaning to your content.

**Essential Elements:**
- **\\<!DOCTYPE html\\>**: Tells browser this is HTML5
- **\\<html\\>**: Root element containing everything
- **\\<head\\>**: Metadata (title, styles, etc.)
- **\\<body\\>**: Visible content`,
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
    <h1>Welcome to My Website!</h1>
    <p>This is my first paragraph.</p>
    <p>HTML is <strong>awesome</strong> and <em>easy</em> to learn!</p>
</body>
</html>`,
            explanation: 'This is a complete, valid HTML document with proper structure.',
            isExecutable: false
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Common HTML Elements',
        content: `HTML provides many elements for different types of content. Each element has a specific purpose and meaning.

**Text Elements:**
- Headers: \\<h1\\> to \\<h6\\>
- Paragraphs: \\<p\\>
- Emphasis: \\<strong\\>, \\<em\\>

**Lists:**
- Ordered: \\<ol\\> with \\<li\\>
- Unordered: \\<ul\\> with \\<li\\>

**Links and Media:**
- Links: \\<a href="..."\\>
- Images: \\<img src="..."\\>`,
        codeExamples: [
          {
            language: 'html',
            code: `<body>
    <!-- Headers -->
    <h1>Main Title</h1>
    <h2>Subtitle</h2>
    <h3>Section Title</h3>
    
    <!-- Text content -->
    <p>This is a <strong>paragraph</strong> with <em>emphasis</em>.</p>
    
    <!-- Lists -->
    <h3>My Favorite Languages:</h3>
    <ul>
        <li>JavaScript</li>
        <li>Python</li>
        <li>HTML/CSS</li>
    </ul>
    
    <!-- Links and images -->
    <a href="https://www.example.com">Visit Example</a>
    <img src="logo.png" alt="Website Logo" width="200">
    
    <!-- Divisions for organization -->
    <div class="section">
        <p>Content organized in sections</p>
    </div>
</body>`,
            explanation: 'This shows the most commonly used HTML elements with proper structure.',
            isExecutable: false
          }
        ]
      },
      {
        stepNumber: 3,
        title: 'Styling with CSS',
        content: `CSS (Cascading Style Sheets) makes your HTML look beautiful. CSS controls colors, fonts, spacing, layout, and more.

**Three Ways to Add CSS:**
1. **Inline**: style attribute on elements
2. **Internal**: \\<style\\> tag in \\<head\\>
3. **External**: separate .css file (recommended)

**CSS Syntax:**
\`\`\`css
selector {
    property: value;
    property: value;
}
\`\`\``,
        codeExamples: [
          {
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Styled Webpage</title>
    <style>
        /* CSS styles */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        
        .highlight {
            background-color: #f39c12;
            padding: 10px;
            border-radius: 5px;
            color: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Styled Website</h1>
        <p>This paragraph has beautiful styling!</p>
        <div class="highlight">
            This section is highlighted with CSS!
        </div>
    </div>
</body>
</html>`,
            explanation: 'This complete example shows HTML structure with CSS styling for a professional look.',
            isExecutable: false
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'Which HTML element is used for the main heading of a page?',
        type: 'multiple-choice',
        options: [
          { text: '<header>', isCorrect: false },
          { text: '<h1>', isCorrect: true },
          { text: '<title>', isCorrect: false },
          { text: '<heading>', isCorrect: false }
        ],
        explanation: '<h1> is used for the most important heading on a page.',
        points: 1
      }
    ],
    resources: [
      {
        title: 'MDN HTML Basics',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics',
        type: 'documentation'
      },
      {
        title: 'CSS-Tricks',
        url: 'https://css-tricks.com/',
        type: 'reference'
      }
    ],
    rating: { average: 4.9, count: 342 },
    stats: { views: 2150, completions: 1876, likes: 789 }
  },

  // Data Structures
  {
    title: 'Arrays and Lists: Data Storage Fundamentals',
    slug: 'arrays-lists-data-storage-fundamentals',
    description: 'Master arrays and lists - the building blocks of data storage. Learn operations, algorithms, and best practices.',
    category: 'Data Structures',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 75,
    tags: ['arrays', 'lists', 'data-structures', 'algorithms', 'javascript'],
    prerequisites: ['Basic JavaScript knowledge', 'Variables and functions'],
    learningObjectives: [
      'Understand array data structure',
      'Learn array methods and operations',
      'Implement common array algorithms',
      'Analyze time complexity of operations'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Understanding Arrays',
        content: `Arrays are ordered collections of elements, perfect for storing lists of related data. Each element has an index (position) starting from 0.

**Key Concepts:**
- **Index**: Position of element (0, 1, 2, ...)
- **Length**: Number of elements
- **Dynamic**: Can grow/shrink in JavaScript
- **Zero-indexed**: First element is at index 0`,
        codeExamples: [
          {
            language: 'javascript',
            code: `// Creating arrays
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = ["hello", 42, true, null];

// Accessing elements
console.log("First fruit:", fruits[0]);        // "apple"
console.log("Last number:", numbers[4]);       // 5
console.log("Array length:", fruits.length);   // 3

// Modifying elements
fruits[1] = "grape";
console.log("Modified:", fruits);              // ["apple", "grape", "orange"]

// Array properties
console.log("Is array:", Array.isArray(fruits)); // true
console.log("Index of orange:", fruits.indexOf("orange")); // 2`,
            explanation: 'This shows basic array creation, access, and modification operations.',
            isExecutable: true
          }
        ]
      },
      {
        stepNumber: 2,
        title: 'Essential Array Methods',
        content: `JavaScript provides many built-in methods to work with arrays efficiently. These methods fall into categories: adding/removing, searching, and transforming.

**Adding/Removing:**
- push() - add to end
- pop() - remove from end  
- unshift() - add to beginning
- shift() - remove from beginning
- splice() - add/remove at specific position

**Searching/Testing:**
- includes() - check if element exists
- find() - find first matching element
- filter() - get all matching elements`,
        codeExamples: [
          {
            language: 'javascript',
            code: `let fruits = ["apple", "banana"];

// Adding elements
fruits.push("orange");           // Add to end
fruits.unshift("grape");         // Add to beginning
console.log("After adding:", fruits); // ["grape", "apple", "banana", "orange"]

// Removing elements  
let last = fruits.pop();         // Remove and return last
let first = fruits.shift();      // Remove and return first
console.log("Removed:", first, last); // "grape" "orange"
console.log("After removing:", fruits); // ["apple", "banana"]

// Searching
let hasApple = fruits.includes("apple");    // true
let foundFruit = fruits.find(f => f.startsWith("b")); // "banana"

// Advanced: splice (remove/add at position)
fruits.splice(1, 0, "mango");    // At index 1, remove 0, add "mango"
console.log("After splice:", fruits); // ["apple", "mango", "banana"]`,
            explanation: 'These are the most commonly used array methods for manipulation and searching.',
            isExecutable: true
          }
        ]
      }
    ],
    quiz: [
      {
        question: 'What does arr.push(item) do?',
        type: 'multiple-choice',
        options: [
          { text: 'Adds item to the beginning', isCorrect: false },
          { text: 'Adds item to the end', isCorrect: true },
          { text: 'Replaces the first item', isCorrect: false },
          { text: 'Removes the last item', isCorrect: false }
        ],
        explanation: 'push() adds one or more elements to the end of an array.',
        points: 1
      }
    ],
    resources: [
      {
        title: 'MDN Array Methods',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
        type: 'documentation'
      }
    ],
    rating: { average: 4.6, count: 89 },
    stats: { views: 756, completions: 543, likes: 234 }
  },

  // Algorithms
  {
    title: 'Sorting Algorithms: From Bubble to Quick Sort',
    slug: 'sorting-algorithms-bubble-quick-sort',
    description: 'Explore fundamental sorting algorithms, understand their complexity, and learn when to use each one.',
    category: 'Algorithms',
    language: 'python',
    difficulty: 'advanced',
    estimatedTime: 120,
    tags: ['algorithms', 'sorting', 'complexity', 'python', 'computer-science'],
    prerequisites: ['Arrays/Lists', 'Functions', 'Basic complexity analysis'],
    learningObjectives: [
      'Understand different sorting algorithms',
      'Analyze time and space complexity',
      'Implement sorting algorithms from scratch',
      'Choose appropriate sorting algorithm for different scenarios'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Bubble Sort - The Simplest Sort',
        content: `Bubble Sort is the most intuitive sorting algorithm. It repeatedly compares adjacent elements and swaps them if they're in the wrong order.

**How it works:**
1. Compare each pair of adjacent elements
2. Swap if left > right (for ascending order)  
3. Repeat until no swaps are needed

**Complexity:**
- Time: O(n²) - worst and average case
- Space: O(1) - sorts in place
- Good for: Understanding sorting, very small datasets`,
        codeExamples: [
          {
            language: 'python',
            code: `def bubble_sort(arr):
    """
    Sorts array using bubble sort algorithm
    Time: O(n²), Space: O(1)
    """
    n = len(arr)
    
    # Track if any swaps were made
    for i in range(n):
        swapped = False
        
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            # Swap if elements are in wrong order
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swaps were made, array is sorted
        if not swapped:
            break
    
    return arr

# Test the algorithm
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original:", test_array)

sorted_array = bubble_sort(test_array.copy())
print("Sorted:", sorted_array)

# Demonstration with step-by-step
def bubble_sort_demo(arr):
    print(f"Sorting: {arr}")
    n = len(arr)
    
    for i in range(n):
        print(f"\\nPass {i + 1}:")
        swapped = False
        
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                print(f"  Swap {arr[j]} and {arr[j + 1]}")
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        print(f"  After pass: {arr}")
        
        if not swapped:
            print("  No swaps needed - array is sorted!")
            break

# Demo with smaller array
bubble_sort_demo([5, 2, 8, 1, 9])`,
            explanation: 'Bubble sort with optimizations and step-by-step demonstration.',
            isExecutable: true
          }
        ]
      }
    ],
    rating: { average: 4.4, count: 67 },
    stats: { views: 432, completions: 287, likes: 156 }
  }
];

const seedTutorials = async () => {
  try {
    logger.info('🌱 Seeding tutorials database...');

    // Check if we already have tutorials
    const existingCount = await MongoTutorial.countDocuments();
    if (existingCount > 0) {
      logger.info(`📚 Found ${existingCount} existing tutorials, skipping seed`);
      return;
    }

    // Insert tutorial data
    const createdTutorials = await MongoTutorial.insertMany(tutorialData);

    logger.info(`✅ Successfully created ${createdTutorials.length} tutorials`);

    // Log summary by category
    const categories = await MongoTutorial.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    logger.info('📊 Tutorial summary by category:');
    categories.forEach((cat) => {
      logger.info(`   ${cat._id}: ${cat.count} tutorials`);
    });

    return createdTutorials;
  } catch (error) {
    logger.error('❌ Error seeding tutorials:', error);
    throw error;
  }
};

module.exports = {
  seedTutorials,
  tutorialData
};
