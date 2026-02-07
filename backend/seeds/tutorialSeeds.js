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
        expectedOutput: 'Name: John\nAge: 25\nIs Student: true',
        learnPhase: {
          conceptExplanation: `Variables are like labeled containers that hold data in your program. Just as you might label a box "Books" or "Photos" to remember what's inside, variables give names to pieces of data so you can use them later.

In JavaScript, there are three keywords for creating variables:
• let — creates a variable whose value can be reassigned later
• const — creates a variable whose value cannot be reassigned (a constant)
• var — the original way to declare variables (avoid in modern code because of scoping issues)

When you declare a variable, JavaScript reserves a spot in memory and associates it with the name you chose.`,
          keyPoints: [
            'Use "let" when the value will change later',
            'Use "const" when the value should stay the same',
            'Avoid "var" in modern JavaScript — it has confusing scoping rules',
            'Variable names are case-sensitive: myVar and myvar are different',
            'Names must start with a letter, underscore, or dollar sign'
          ],
          realWorldExample: 'Think of a shopping cart: the items inside change (let), but the cart itself stays the same object. The store name never changes (const).',
          commonMistakes: [
            'Trying to reassign a const variable — this throws an error',
            'Using var inside a block and expecting block scope — var is function-scoped',
            'Starting variable names with numbers — this causes a syntax error',
            'Forgetting to initialize a let variable — it will be undefined'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Declare a variable called "city" using let and assign it your city name as a string', hint: 'Use let city = "YourCity";' },
            { step: 2, instruction: 'Declare a constant called "country" and assign it your country name', hint: 'Use const country = "YourCountry";' },
            { step: 3, instruction: 'Log both variables to the console using console.log()', hint: 'console.log(city, country);' }
          ],
          starterCode: `// Step 1: Declare a variable for your city\n\n// Step 2: Declare a constant for your country\n\n// Step 3: Log both values\n`,
          solution: `let city = "New York";\nconst country = "USA";\nconsole.log("City:", city);\nconsole.log("Country:", country);`,
          hints: [
            { level: 1, hint: 'Remember: let is for values that might change, const is for values that stay the same.' },
            { level: 2, hint: 'String values need to be wrapped in quotes: "hello" or \'hello\'.' },
            { level: 3, hint: 'Full example: let city = "London"; const country = "UK"; console.log(city, country);' }
          ]
        },
        challengePhase: {
          problemStatement: 'Create a mini user profile using variables. Declare variables for a user\'s name, age, email, and whether they are a premium member. Then print a formatted summary.',
          requirements: [
            'Use const for values that won\'t change (name, email)',
            'Use let for values that could change (age, premium status)',
            'Print a formatted message using all four variables',
            'Reassign the age variable to a new value and print again'
          ],
          testCases: [
            { input: 'Any valid name string', expected: 'Name printed correctly', points: 5 },
            { input: 'Age as a number', expected: 'Age printed as number, then updated', points: 5 },
            { input: 'Premium as boolean', expected: 'true or false printed', points: 5 }
          ]
        }
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
        expectedOutput: 'string\nnumber\nboolean',
        learnPhase: {
          conceptExplanation: `Every value in JavaScript has a type. Types tell the engine how to store the data and what operations are valid on it.

Primitive types are immutable (they can't be changed in place):
• String — text wrapped in quotes ("hello", 'world', \`template\`)
• Number — integers and decimals (42, 3.14, -7)
• Boolean — logical true or false
• Undefined — a variable declared but never assigned
• Null — an intentional "no value"
• Symbol & BigInt — advanced types you'll meet later

Reference types hold collections of data:
• Object — key-value pairs { name: "Alice" }
• Array — ordered lists [1, 2, 3]

Use the typeof operator to check any value's type at runtime.`,
          keyPoints: [
            'JavaScript has 7 primitive types and several reference types',
            'typeof returns a lowercase string like "string", "number", "boolean"',
            'typeof null returns "object" — this is a known JavaScript quirk',
            'Arrays are technically objects (typeof [] === "object")',
            'Undefined means "not yet assigned"; null means "intentionally empty"'
          ],
          realWorldExample: 'A form collects different data types: your name (string), your age (number), and whether you agree to terms (boolean). The server needs to know each type to process the data correctly.',
          commonMistakes: [
            'Confusing undefined and null — they are related but have different purposes',
            'Assuming typeof null === "null" — it actually returns "object"',
            'Mixing up strings and numbers: "5" + 3 gives "53" (string concat), not 8',
            'Forgetting that JavaScript is loosely typed — a variable can hold any type'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create one variable of each primitive type: string, number, boolean, undefined, and null', hint: 'let myString = "hello"; let myNum = 42; etc.' },
            { step: 2, instruction: 'Use typeof on each variable and log the result', hint: 'console.log(typeof myString);' },
            { step: 3, instruction: 'Create an object and an array, then check their types', hint: 'let obj = {}; let arr = []; console.log(typeof obj, typeof arr);' }
          ],
          starterCode: `// Step 1: Create variables of different types\n\n// Step 2: Check types with typeof\n\n// Step 3: Create an object and array, check their types\n`,
          solution: `let myString = "hello";\nlet myNum = 42;\nlet myBool = true;\nlet myUndefined;\nlet myNull = null;\n\nconsole.log(typeof myString);   // "string"\nconsole.log(typeof myNum);      // "number"\nconsole.log(typeof myBool);     // "boolean"\nconsole.log(typeof myUndefined);// "undefined"\nconsole.log(typeof myNull);     // "object" (JS quirk!)\n\nlet obj = { name: "Alice" };\nlet arr = [1, 2, 3];\nconsole.log(typeof obj);  // "object"\nconsole.log(typeof arr);  // "object"`,
          hints: [
            { level: 1, hint: 'To create an undefined variable, simply declare it without assigning: let x;' },
            { level: 2, hint: 'typeof always returns a string — you can compare it: typeof x === "number"' },
            { level: 3, hint: 'To check if something is an array, use Array.isArray(arr) instead of typeof.' }
          ]
        },
        challengePhase: {
          problemStatement: 'Build a type-checker function that takes any value and returns a descriptive string about it, including its type and a human-readable label. Handle the null quirk correctly!',
          requirements: [
            'Create a function called describeValue(val)',
            'Return the typeof result for each value',
            'Handle null correctly — detect it as "null" not "object"',
            'Handle arrays correctly — detect them as "array" not "object"',
            'Test with at least 5 different types of values'
          ],
          testCases: [
            { input: 'describeValue("hello")', expected: 'Outputs "string"', points: 5 },
            { input: 'describeValue(null)', expected: 'Outputs "null" (not "object")', points: 10 },
            { input: 'describeValue([1,2])', expected: 'Outputs "array" (not "object")', points: 10 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `Strings are sequences of characters used to represent text. JavaScript gives you powerful tools for creating and manipulating strings.

Three ways to create strings:
• Single quotes: 'hello'
• Double quotes: "hello"
• Backticks (template literals): \`hello \${name}\` — the modern, preferred way

Template literals let you embed expressions directly inside strings using \${...} syntax and can span multiple lines.

Strings are immutable — methods like toUpperCase() return a NEW string; the original is unchanged.`,
          keyPoints: [
            'Strings are immutable — methods return new strings, they don\'t modify the original',
            'Template literals (backticks) allow embedded expressions and multi-line strings',
            'Common methods: length, toUpperCase(), toLowerCase(), includes(), slice(), split()',
            'Use + or template literals to concatenate strings',
            'Strings have a .length property (not a method — no parentheses)'
          ],
          realWorldExample: 'Building a welcome email: "Hello, ${firstName}! Your order #${orderId} ships on ${date}." Template literals make dynamic text easy to read and maintain.',
          commonMistakes: [
            'Using regular quotes instead of backticks for template literals',
            'Calling .length() with parentheses — length is a property, not a method',
            'Forgetting that string methods are case-sensitive: "Hello".includes("hello") is false',
            'Assuming string concatenation with + converts numbers automatically in all contexts'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create two string variables: firstName and lastName', hint: 'let firstName = "Jane";' },
            { step: 2, instruction: 'Create a greeting using a template literal that includes the full name', hint: 'let greeting = `Hello, ${firstName} ${lastName}!`;' },
            { step: 3, instruction: 'Use at least 3 string methods (e.g., toUpperCase, includes, slice) and log results', hint: 'console.log(greeting.toUpperCase());' }
          ],
          starterCode: `// Step 1: Create firstName and lastName\n\n// Step 2: Create a greeting with template literal\n\n// Step 3: Try string methods\n`,
          solution: `let firstName = "Jane";\nlet lastName = "Doe";\n\nlet greeting = \`Hello, \${firstName} \${lastName}!\`;\nconsole.log(greeting);\n\nconsole.log("Upper:", greeting.toUpperCase());\nconsole.log("Includes Jane:", greeting.includes("Jane"));\nconsole.log("First 5 chars:", greeting.slice(0, 5));\nconsole.log("Length:", greeting.length);`,
          hints: [
            { level: 1, hint: 'Template literals use backticks ` not regular quotes.' },
            { level: 2, hint: 'String methods: .toUpperCase(), .toLowerCase(), .includes(), .slice(start, end), .trim()' },
            { level: 3, hint: 'Full: let g = `Hi ${firstName}`; console.log(g.toUpperCase()); console.log(g.includes("Hi"));' }
          ]
        },
        challengePhase: {
          problemStatement: 'Build a username generator function. Given a first name and last name, create a username that is lowercase, replaces spaces with underscores, and appends a random 3-digit number.',
          requirements: [
            'Create a function generateUsername(first, last)',
            'Combine first and last name with an underscore',
            'Convert to lowercase',
            'Append a random number between 100-999',
            'Return the final username string'
          ],
          testCases: [
            { input: 'generateUsername("John", "Doe")', expected: 'Something like "john_doe_427"', points: 10 },
            { input: 'generateUsername("ALICE", "Smith")', expected: 'All lowercase: "alice_smith_XXX"', points: 5 },
            { input: 'Result length check', expected: 'Username length > 5', points: 5 }
          ]
        }
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
        expectedOutput: 'Hello, Python!\nAlice is an adult\nCan vote!\nThis is outside the if block',
        learnPhase: {
          conceptExplanation: `Python stands out from other languages because it uses indentation to define code structure rather than curly braces {} or keywords like "end".

This design choice makes Python code clean and readable, but it also means indentation is not optional — it's part of the syntax. Getting it wrong causes an IndentationError.

Key syntax rules:
• Statements end at the newline — no semicolons needed
• Code blocks start after a colon (:) and are indented
• Standard indentation is 4 spaces (not tabs)
• Comments begin with # and are ignored by the interpreter
• Python is case-sensitive: Print is not the same as print`,
          keyPoints: [
            'Indentation is mandatory in Python — it defines code blocks',
            'Use 4 spaces per indentation level (PEP 8 standard)',
            'No semicolons or curly braces needed',
            'Colons (:) start new code blocks in if, for, while, def, class',
            'Python is case-sensitive — print() works, Print() does not'
          ],
          realWorldExample: 'Python\'s clean syntax is why it\'s the top choice for data science and AI. Data scientists can focus on logic, not syntax — readability matters when sharing notebooks with teammates.',
          commonMistakes: [
            'Mixing tabs and spaces — use spaces only (configure your editor)',
            'Forgetting the colon after if, else, for, while, def, class',
            'Inconsistent indentation — every line in a block must match',
            'Using print without parentheses — in Python 3, print() is a function'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Write a print statement that says "Hello, Python!"', hint: 'print("Hello, Python!")' },
            { step: 2, instruction: 'Create a variable age and write an if/else block checking if age >= 18', hint: 'age = 20\\nif age >= 18:\\n    print("Adult")' },
            { step: 3, instruction: 'Add a comment above each section explaining what it does', hint: '# This checks if the user is an adult' }
          ],
          starterCode: `# Step 1: Print a greeting\n\n# Step 2: Create age variable and if/else block\n\n# Step 3: Make sure each section has a comment\n`,
          solution: `# Greeting message\nprint("Hello, Python!")\n\n# Check if user is an adult\nage = 20\nif age >= 18:\n    print("You are an adult")\n    print("You can vote!")\nelse:\n    print("You are a minor")\n\nprint("Program complete")`,
          hints: [
            { level: 1, hint: 'Remember: the if statement ends with a colon, and the body is indented 4 spaces.' },
            { level: 2, hint: 'else must be at the same indentation level as if, followed by a colon.' },
            { level: 3, hint: 'if age >= 18:\\n    print("Adult")\\nelse:\\n    print("Minor")' }
          ]
        },
        challengePhase: {
          problemStatement: 'Write a program that categorizes a person by age group. Given an age, print whether they are a child (0-12), teenager (13-17), adult (18-64), or senior (65+).',
          requirements: [
            'Create a variable called age with a numeric value',
            'Use if/elif/else to categorize into the correct age group',
            'Print the category name',
            'Handle edge cases: negative ages should print "Invalid age"'
          ],
          testCases: [
            { input: 'age = 8', expected: '"Child"', points: 5 },
            { input: 'age = 15', expected: '"Teenager"', points: 5 },
            { input: 'age = 30', expected: '"Adult"', points: 5 },
            { input: 'age = 70', expected: '"Senior"', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `Python uses dynamic typing — you don't need to declare the type of a variable; Python figures it out automatically when you assign a value.

Common data types:
• int — whole numbers: 42, -7, 0
• float — decimal numbers: 3.14, -0.5
• str — text strings: "hello", 'world'
• bool — True or False (capital T and F!)
• list — ordered, mutable collection: [1, 2, 3]
• dict — key-value pairs: {"name": "Alice", "age": 25}
• tuple — ordered, immutable collection: (1, 2, 3)

Use type() to check any variable's type at runtime. Python also supports type conversion with int(), float(), str(), bool().`,
          keyPoints: [
            'Python is dynamically typed — no need to declare types',
            'Use type() to check the type of any variable',
            'bool values are capitalized: True and False (not true/false)',
            'Lists are mutable (can change), tuples are immutable (cannot change)',
            'Dictionaries use key-value pairs for fast lookups'
          ],
          realWorldExample: 'A weather app stores temperature as float (23.5), city as str ("London"), is_raining as bool (True), and hourly_temps as a list ([20.1, 21.3, 22.0]).',
          commonMistakes: [
            'Writing true/false instead of True/False — Python booleans are capitalized',
            'Confusing lists [] and tuples () — lists are mutable, tuples are not',
            'Forgetting that dict keys must be immutable (strings, numbers, tuples)',
            'Using = (assignment) instead of == (comparison) in conditions'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create variables of types int, float, str, and bool', hint: 'count = 10; price = 9.99; name = "Bob"; active = True' },
            { step: 2, instruction: 'Create a list of your favorite foods and a dict with your personal info', hint: 'foods = ["pizza", "sushi"]; info = {"name": "Bob", "age": 25}' },
            { step: 3, instruction: 'Print the type of each variable using type()', hint: 'print(type(count))' }
          ],
          starterCode: `# Step 1: Create variables of different types\n\n# Step 2: Create a list and a dictionary\n\n# Step 3: Print the type of each variable\n`,
          solution: `count = 10\nprice = 9.99\nname = "Bob"\nactive = True\n\nfoods = ["pizza", "sushi", "tacos"]\ninfo = {"name": "Bob", "age": 25}\n\nprint(f"count: {type(count)}")\nprint(f"price: {type(price)}")\nprint(f"name: {type(name)}")\nprint(f"active: {type(active)}")\nprint(f"foods: {type(foods)}")\nprint(f"info: {type(info)}")`,
          hints: [
            { level: 1, hint: 'Python booleans are True and False (capitalized).' },
            { level: 2, hint: 'Lists use square brackets: [1, 2, 3]. Dicts use curly braces: {"key": "value"}.' },
            { level: 3, hint: 'print(type(my_var)) shows something like <class \'int\'>.' }
          ]
        },
        challengePhase: {
          problemStatement: 'Create a student report card program. Store a student\'s name, grades (as a list of numbers), and personal info (as a dict). Calculate and print the average grade.',
          requirements: [
            'Store the student name as a string',
            'Store grades as a list of at least 5 numbers',
            'Calculate the average using sum() and len()',
            'Store everything in a dictionary and print a formatted report'
          ],
          testCases: [
            { input: 'grades = [85, 92, 78, 95, 88]', expected: 'Average: 87.6', points: 10 },
            { input: 'type(grades)', expected: '<class \'list\'>', points: 5 },
            { input: 'Formatted output', expected: 'Clean report with name and average', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `Input and output are how your program communicates with the outside world.

Output — print():
• print() sends text to the console
• You can print multiple items separated by commas
• f-strings (f"...") are the modern way to embed variables in text
• .format() and % formatting are older alternatives

Input — input():
• input() pauses the program and waits for user text
• It always returns a string — use int() or float() to convert numbers
• You can pass a prompt message: input("Enter name: ")

Formatting numbers:
• f"{value:.2f}" — 2 decimal places
• f"{value:,}" — thousands separator
• f"{value:>10}" — right-align in 10 chars`,
          keyPoints: [
            'print() outputs to the console; input() reads from the user',
            'f-strings (f"...{var}...") are the cleanest way to format output',
            'input() always returns a string — convert with int() or float() if needed',
            'print() accepts multiple arguments separated by commas',
            'Use format specifiers like :.2f for decimal places'
          ],
          realWorldExample: 'A command-line calculator: it uses input() to get two numbers and an operator from the user, processes the calculation, and uses print() with f-strings to display the formatted result.',
          commonMistakes: [
            'Forgetting that input() returns a string — int("5") + 3 = 8, but "5" + 3 = Error',
            'Using print without parentheses — in Python 3, print is a function',
            'Confusing f-strings with regular strings — the f prefix is required',
            'Forgetting to convert input to the right type before doing math'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Use print() with an f-string to display your name and age', hint: 'name = "Alice"; age = 25; print(f"I am {name}, age {age}")' },
            { step: 2, instruction: 'Format a price variable to show exactly 2 decimal places', hint: 'price = 19.5; print(f"Price: {price:.2f}")' },
            { step: 3, instruction: 'Print multiple items using comma-separated arguments in print()', hint: 'print("Name:", name, "Age:", age)' }
          ],
          starterCode: `# Step 1: Print your name and age with an f-string\nname = "Student"\nage = 20\n\n# Step 2: Format a price to 2 decimal places\nprice = 19.5\n\n# Step 3: Use print with multiple arguments\n`,
          solution: 'name = "Student"\nage = 20\nprint(f"My name is {name} and I am {age} years old")\n\nprice = 19.5\nprint(f"Price: ${price:.2f}")\n\nprint("Name:", name, "| Age:", age, "| Price:", price)',
          hints: [
            { level: 1, hint: 'f-strings start with the letter f before the opening quote: f"text {variable}"' },
            { level: 2, hint: 'For 2 decimal places, use :.2f inside the curly braces: f"{price:.2f}"' },
            { level: 3, hint: 'print() with commas automatically adds spaces: print("a", "b") → "a b"' }
          ]
        },
        challengePhase: {
          problemStatement: 'Build a receipt printer. Given a list of item names and prices, print a formatted receipt with aligned columns, a subtotal, tax (8%), and total.',
          requirements: [
            'Create lists for item names and prices',
            'Print each item with right-aligned price (2 decimal places)',
            'Calculate and print subtotal, tax (8%), and total',
            'Add a decorative border to make it look like a real receipt'
          ],
          testCases: [
            { input: 'items = ["Coffee", "Muffin"], prices = [4.50, 3.25]', expected: 'Formatted receipt with totals', points: 10 },
            { input: 'Tax calculation', expected: '8% of subtotal', points: 5 },
            { input: 'Total', expected: 'Subtotal + tax', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `An HTML document is like the blueprint of a building. Every webpage you visit is built on HTML — it provides the structure and meaning to the content.

Every HTML document has this skeleton:
• <!DOCTYPE html> — tells the browser this is an HTML5 document
• <html> — the root element wrapping everything
• <head> — contains metadata: title, character set, linked styles, SEO tags
• <body> — contains all visible content: text, images, links, etc.

HTML uses "tags" — pairs of angle-bracket labels that wrap content:
• Opening tag: <p>
• Closing tag: </p>
• Self-closing: <img />, <br />
• Attributes add info: <a href="url">Link</a>`,
          keyPoints: [
            'Every HTML page needs <!DOCTYPE html>, <html>, <head>, and <body>',
            'The <head> contains metadata — it is not visible on the page',
            'The <body> contains everything the user sees',
            'Tags come in pairs: <p>text</p> — a few are self-closing like <img> and <br>',
            'Attributes provide extra info: <a href="..."> sets the link destination'
          ],
          realWorldExample: 'When you visit google.com, your browser receives an HTML document. The <head> sets the page title ("Google") and loads styles. The <body> contains the search bar, logo, and buttons.',
          commonMistakes: [
            'Forgetting to close tags — <p>text without </p> can break layout',
            'Putting visible content in <head> instead of <body>',
            'Missing the <!DOCTYPE html> declaration — can trigger quirks mode',
            'Nesting tags incorrectly: <b><i>text</b></i> should be <b><i>text</i></b>'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Write the basic HTML5 skeleton: DOCTYPE, html, head, and body', hint: '<!DOCTYPE html><html><head></head><body></body></html>' },
            { step: 2, instruction: 'Add a <title> inside <head> and an <h1> heading inside <body>', hint: '<title>My Page</title> goes in head; <h1>Hello</h1> goes in body' },
            { step: 3, instruction: 'Add a paragraph <p> and a <strong> tag to emphasize a word', hint: '<p>HTML is <strong>important</strong></p>' }
          ],
          starterCode: `<!-- Step 1: Write the HTML5 skeleton -->\n\n<!-- Step 2: Add title and heading -->\n\n<!-- Step 3: Add a paragraph with emphasis -->`,
          solution: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>HTML is <strong>awesome</strong> and <em>easy</em> to learn.</p>\n</body>\n</html>`,
          hints: [
            { level: 1, hint: 'The skeleton order is: <!DOCTYPE html>, <html>, <head>...</head>, <body>...</body>, </html>' },
            { level: 2, hint: '<title> goes inside <head>. <h1> and <p> go inside <body>.' },
            { level: 3, hint: '<strong> makes text bold, <em> makes text italic.' }
          ]
        },
        challengePhase: {
          problemStatement: 'Create a complete HTML page for a personal portfolio. Include a proper head section with metadata and a body with at least a heading, intro paragraph, and a list of skills.',
          requirements: [
            'Include proper DOCTYPE and html lang attribute',
            'Add charset meta tag, viewport meta tag, and title in <head>',
            'Add an <h1> with your name and a <p> intro paragraph',
            'Add an unordered list <ul> with at least 3 skills'
          ],
          testCases: [
            { input: 'HTML structure', expected: 'Valid DOCTYPE, html, head, body', points: 5 },
            { input: 'Head content', expected: 'charset, viewport, title present', points: 5 },
            { input: 'Body content', expected: 'h1, p, and ul with li items', points: 10 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `HTML has dozens of elements, each designed for a specific type of content. Using the right element for the right content is called "semantic HTML" — and it matters for accessibility, SEO, and maintainability.

Text elements:
• <h1> to <h6> — headings (h1 is the most important)
• <p> — paragraphs
• <strong> — important text (bold)
• <em> — emphasized text (italic)
• <span> — inline container for styling

Lists:
• <ul> — unordered (bullet) list
• <ol> — ordered (numbered) list
• <li> — list item (goes inside ul or ol)

Links & media:
• <a href="url"> — hyperlink
• <img src="url" alt="description"> — image (self-closing)
• <div> — block-level container for grouping`,
          keyPoints: [
            'Use heading levels in order — don\'t skip from <h1> to <h4>',
            '<img> requires an alt attribute for accessibility',
            '<a> links need an href attribute to specify the destination',
            'Use <ul> for unordered lists and <ol> for ordered/numbered lists',
            '<div> is for grouping block elements; <span> is for inline styling'
          ],
          realWorldExample: 'A blog post uses <h1> for the title, <p> for paragraphs, <img> for photos, <ul> for bullet points, and <a> for links to related articles — each element gives meaning to the content.',
          commonMistakes: [
            'Using <div> for everything instead of semantic elements',
            'Forgetting the alt attribute on images — breaks accessibility',
            'Nesting block elements inside inline elements (e.g., <span><div>)',
            'Using <br> for spacing instead of CSS margins/padding'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create headings at 3 different levels (h1, h2, h3)', hint: '<h1>Main</h1><h2>Sub</h2><h3>Section</h3>' },
            { step: 2, instruction: 'Add an unordered list with 3 items and an ordered list with 3 items', hint: '<ul><li>Item</li></ul>' },
            { step: 3, instruction: 'Add a link and an image element', hint: '<a href="https://example.com">Click</a> <img src="photo.jpg" alt="Photo">' }
          ],
          starterCode: `<!-- Step 1: Add headings -->\n\n<!-- Step 2: Create lists -->\n\n<!-- Step 3: Add a link and image -->`,
          solution: `<h1>My Website</h1>\n<h2>About Me</h2>\n<h3>My Hobbies</h3>\n\n<ul>\n    <li>Coding</li>\n    <li>Reading</li>\n    <li>Gaming</li>\n</ul>\n\n<ol>\n    <li>Learn HTML</li>\n    <li>Learn CSS</li>\n    <li>Build a project</li>\n</ol>\n\n<a href="https://example.com">Visit Example</a>\n<img src="photo.jpg" alt="A description of the photo">`,
          hints: [
            { level: 1, hint: 'Lists need a container (<ul> or <ol>) with <li> items inside.' },
            { level: 2, hint: '<a> needs href for the URL. <img> needs src for the image path and alt for description.' },
            { level: 3, hint: 'Always include alt text on images — screen readers depend on it.' }
          ]
        },
        challengePhase: {
          problemStatement: 'Build an HTML recipe page. Include a title, a short description, an image placeholder, an ingredient list (unordered), and step-by-step instructions (ordered list).',
          requirements: [
            'Use <h1> for the recipe name and <h2> for section headings',
            'Add a <p> description and an <img> with alt text',
            'Create a <ul> for ingredients (at least 5)',
            'Create an <ol> for cooking steps (at least 4)',
            'Add a link to the recipe source'
          ],
          testCases: [
            { input: 'Page structure', expected: 'h1, h2, p, img present', points: 5 },
            { input: 'Ingredients list', expected: 'ul with 5+ li items', points: 5 },
            { input: 'Steps list', expected: 'ol with 4+ li items', points: 5 },
            { input: 'Link element', expected: 'a with href attribute', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `CSS (Cascading Style Sheets) controls how HTML elements look. Without CSS, webpages would be plain black text on a white background.

CSS syntax:
selector { property: value; }

Selectors target which elements to style:
• Element: p { } — all paragraphs
• Class: .highlight { } — elements with class="highlight"
• ID: #header { } — the element with id="header"
• Combinators: div p { } — paragraphs inside divs

The "cascade" means styles can come from multiple sources, and more specific rules win. Inline > ID > Class > Element.

Three ways to add CSS:
1. Inline: <p style="color: red;">
2. Internal: <style> tag in <head>
3. External: <link rel="stylesheet" href="style.css"> (best practice)`,
          keyPoints: [
            'CSS selectors target elements: element, .class, #id',
            'Properties control appearance: color, font-size, margin, padding, background',
            'The box model: content → padding → border → margin',
            'Specificity determines which rule wins: inline > #id > .class > element',
            'External stylesheets (<link>) are the best practice for real projects'
          ],
          realWorldExample: 'Every website you use is styled with CSS. Google\'s simple white page, Twitter\'s blue theme, Netflix\'s dark design — all CSS controlling colors, layouts, fonts, and animations.',
          commonMistakes: [
            'Forgetting the semicolon at the end of a CSS declaration',
            'Using margin when you mean padding (margin is outside, padding is inside)',
            'Not understanding specificity — wondering why a style won\'t apply',
            'Using IDs for styling instead of classes — IDs should be unique'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create an internal <style> block and style the body with a font-family and background-color', hint: 'body { font-family: Arial; background-color: #f0f0f0; }' },
            { step: 2, instruction: 'Add a class selector .card with padding, border-radius, and a box-shadow', hint: '.card { padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }' },
            { step: 3, instruction: 'Style a heading with color, text-align, and a bottom border', hint: 'h1 { color: #333; text-align: center; border-bottom: 2px solid blue; }' }
          ],
          starterCode: `<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        /* Step 1: Style the body */\n\n        /* Step 2: Create a .card class */\n\n        /* Step 3: Style the heading */\n    </style>\n</head>\n<body>\n    <div class="card">\n        <h1>My Styled Page</h1>\n        <p>This should look great!</p>\n    </div>\n</body>\n</html>`,
          solution: `<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            background-color: #f0f0f0;\n            padding: 20px;\n        }\n        .card {\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n            max-width: 600px;\n            margin: 0 auto;\n        }\n        h1 {\n            color: #2c3e50;\n            text-align: center;\n            border-bottom: 2px solid #3498db;\n            padding-bottom: 10px;\n        }\n    </style>\n</head>\n<body>\n    <div class="card">\n        <h1>My Styled Page</h1>\n        <p>This looks great with CSS!</p>\n    </div>\n</body>\n</html>`,
          hints: [
            { level: 1, hint: 'CSS goes inside <style> tags in the <head>. Each rule: selector { property: value; }' },
            { level: 2, hint: 'box-shadow syntax: x-offset y-offset blur color. Example: 0 2px 4px rgba(0,0,0,0.1)' },
            { level: 3, hint: 'border-bottom shorthand: width style color. Example: 2px solid #3498db' }
          ]
        },
        challengePhase: {
          problemStatement: 'Create a styled profile card with CSS. The card should have a centered layout, a colored header section, avatar placeholder, name, bio, and social links styled as buttons.',
          requirements: [
            'Create a card with max-width, centered with margin: auto',
            'Add a gradient or colored background to the header area',
            'Style a circular avatar placeholder (hint: border-radius: 50%)',
            'Add hover effects to the social link buttons',
            'Use at least 3 different CSS properties you learned'
          ],
          testCases: [
            { input: 'Card centering', expected: 'Card is centered on page', points: 5 },
            { input: 'Avatar styling', expected: 'Circular shape with border-radius', points: 5 },
            { input: 'Hover effects', expected: 'Buttons change on hover', points: 5 },
            { input: 'Overall design', expected: 'Clean, professional look', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `Arrays are one of the most fundamental data structures in programming. They store an ordered collection of elements that you can access by their position (index).

Key characteristics:
• Ordered — elements maintain their insertion order
• Zero-indexed — the first element is at index 0, not 1
• Dynamic in JavaScript — arrays can grow and shrink
• Heterogeneous — JS arrays can hold mixed types (unlike many other languages)

Memory model: arrays store elements in contiguous memory locations, which makes access by index very fast — O(1) constant time.

Common operations and their time complexity:
• Access by index: O(1) — instant
• Search for value: O(n) — must check each element
• Add/remove at end: O(1) — fast
• Add/remove at beginning: O(n) — must shift all elements`,
          keyPoints: [
            'Arrays are zero-indexed: first element is arr[0]',
            'arr.length gives the number of elements',
            'Access by index is O(1) — extremely fast',
            'Arrays in JavaScript can hold mixed types',
            'Use Array.isArray() to check if something is an array (typeof returns "object")'
          ],
          realWorldExample: 'A playlist app stores songs in an array. You can jump to any song by index (O(1)), add songs to the end (push), remove the current song, or shuffle the order.',
          commonMistakes: [
            'Accessing an index that doesn\'t exist — returns undefined, not an error',
            'Confusing .length (count) with last index (length - 1)',
            'Using typeof to check for arrays — it returns "object"; use Array.isArray()',
            'Forgetting arrays are zero-indexed — arr[1] is the SECOND element'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create an array of 5 numbers and log the first and last element', hint: 'let nums = [10, 20, 30, 40, 50]; console.log(nums[0], nums[nums.length - 1]);' },
            { step: 2, instruction: 'Modify the third element and log the updated array', hint: 'nums[2] = 99; console.log(nums);' },
            { step: 3, instruction: 'Check the array length and use Array.isArray() to verify it is an array', hint: 'console.log(nums.length, Array.isArray(nums));' }
          ],
          starterCode: `// Step 1: Create an array and access elements\n\n// Step 2: Modify an element\n\n// Step 3: Check length and type\n`,
          solution: `let nums = [10, 20, 30, 40, 50];\nconsole.log("First:", nums[0]);\nconsole.log("Last:", nums[nums.length - 1]);\n\nnums[2] = 99;\nconsole.log("Modified:", nums);\n\nconsole.log("Length:", nums.length);\nconsole.log("Is array:", Array.isArray(nums));`,
          hints: [
            { level: 1, hint: 'The last element is at index arr.length - 1.' },
            { level: 2, hint: 'You can change any element by assigning to its index: arr[2] = newValue;' },
            { level: 3, hint: 'Array.isArray([1,2,3]) returns true. typeof [1,2,3] returns "object".' }
          ]
        },
        challengePhase: {
          problemStatement: 'Create a function that takes an array of numbers and returns an object with statistics: min, max, sum, average, and count.',
          requirements: [
            'Create a function called arrayStats(arr)',
            'Calculate minimum, maximum, sum, average, and count',
            'Return an object with all five values',
            'Handle edge case: empty array should return null',
            'Test with at least 2 different arrays'
          ],
          testCases: [
            { input: 'arrayStats([1, 2, 3, 4, 5])', expected: '{ min: 1, max: 5, sum: 15, average: 3, count: 5 }', points: 10 },
            { input: 'arrayStats([10, -3, 7])', expected: '{ min: -3, max: 10, sum: 14, average: 4.67, count: 3 }', points: 5 },
            { input: 'arrayStats([])', expected: 'null', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `JavaScript arrays come with a rich set of built-in methods that save you from writing common operations by hand.

Mutating methods (change the original array):
• push(item) — add to end, returns new length
• pop() — remove from end, returns removed item
• unshift(item) — add to beginning
• shift() — remove from beginning
• splice(index, deleteCount, ...items) — add/remove at any position
• sort() — sorts in place (careful: sorts as strings by default!)
• reverse() — reverses in place

Non-mutating methods (return a new array):
• slice(start, end) — extract a section
• concat(arr2) — merge arrays
• map(fn) — transform each element
• filter(fn) — keep elements that pass a test
• find(fn) — get first matching element
• includes(item) — check if item exists (returns boolean)`,
          keyPoints: [
            'push/pop work at the end (fast); unshift/shift work at the beginning (slow)',
            'splice can insert, remove, or replace elements at any position',
            'map, filter, and find do NOT modify the original array',
            'sort() without a comparator sorts as strings: [10, 2] sorts to [10, 2] not [2, 10]',
            'includes() is simpler than indexOf() for checking existence'
          ],
          realWorldExample: 'An e-commerce cart uses push() to add items, filter() to remove items by ID, map() to calculate prices with tax, and find() to locate a specific product.',
          commonMistakes: [
            'Forgetting that sort() modifies the original array',
            'Using sort() on numbers without a comparator — [10, 2, 1].sort() gives [1, 10, 2]',
            'Confusing find() (returns first match) with filter() (returns all matches)',
            'Using splice() when you mean slice() — splice mutates, slice doesn\'t'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Create an array of fruits. Use push to add one and unshift to add another. Log the result.', hint: 'let fruits = ["apple"]; fruits.push("banana"); fruits.unshift("grape");' },
            { step: 2, instruction: 'Use filter to get only fruits that start with "a" or "b"', hint: 'let filtered = fruits.filter(f => f.startsWith("a") || f.startsWith("b"));' },
            { step: 3, instruction: 'Use map to create a new array with each fruit name in uppercase', hint: 'let upper = fruits.map(f => f.toUpperCase());' }
          ],
          starterCode: `// Step 1: Create array, push, unshift\nlet fruits = ["apple", "banana"];\n\n// Step 2: Use filter\n\n// Step 3: Use map\n`,
          solution: `let fruits = ["apple", "banana"];\nfruits.push("orange");\nfruits.unshift("grape");\nconsole.log("After add:", fruits);\n\nlet filtered = fruits.filter(f => f.startsWith("a") || f.startsWith("b"));\nconsole.log("Filtered:", filtered);\n\nlet upper = fruits.map(f => f.toUpperCase());\nconsole.log("Uppercase:", upper);`,
          hints: [
            { level: 1, hint: 'push() adds to end, unshift() adds to beginning. Both modify the original array.' },
            { level: 2, hint: 'filter(fn) keeps items where fn returns true. Example: arr.filter(x => x > 5)' },
            { level: 3, hint: 'map(fn) transforms each item. Example: arr.map(x => x * 2) doubles each number.' }
          ]
        },
        challengePhase: {
          problemStatement: 'Build a todo list manager using array methods. Implement functions to add, remove, toggle completion, and filter todos.',
          requirements: [
            'Create a todos array where each item is an object with { id, text, completed }',
            'Write addTodo(text) that pushes a new todo',
            'Write removeTodo(id) using filter',
            'Write toggleTodo(id) using map',
            'Write getCompleted() and getPending() using filter'
          ],
          testCases: [
            { input: 'addTodo("Learn arrays")', expected: 'Todo added with completed: false', points: 5 },
            { input: 'toggleTodo(1)', expected: 'Todo completed status flipped', points: 5 },
            { input: 'getCompleted()', expected: 'Only completed todos returned', points: 5 },
            { input: 'removeTodo(1)', expected: 'Todo removed from list', points: 5 }
          ]
        }
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
        ],
        learnPhase: {
          conceptExplanation: `Bubble Sort is the simplest sorting algorithm and a great starting point for understanding how sorting works.

The algorithm repeatedly walks through the list, compares adjacent elements, and swaps them if they're in the wrong order. After each full pass, the largest unsorted element "bubbles up" to its correct position at the end.

How it works step by step:
1. Start at the beginning of the array
2. Compare element at index i with element at index i+1
3. If arr[i] > arr[i+1], swap them
4. Move to the next pair
5. After a complete pass, the last element is sorted
6. Repeat for the remaining unsorted portion
7. Stop early if a pass makes no swaps (array is sorted)

Complexity analysis:
• Best case: O(n) — already sorted, one pass with no swaps
• Average case: O(n²) — quadratic
• Worst case: O(n²) — reverse sorted
• Space: O(1) — sorts in place, only needs a temp variable for swapping`,
          keyPoints: [
            'Bubble sort compares and swaps adjacent elements',
            'After each pass, the largest unsorted element is in its final position',
            'The "swapped" flag optimization can make best case O(n)',
            'Time complexity is O(n²) — inefficient for large datasets',
            'Space complexity is O(1) — it sorts in place'
          ],
          realWorldExample: 'Bubble sort is rarely used in production due to O(n²) performance, but it\'s used in education to teach sorting concepts. Some embedded systems with tiny datasets and tight memory constraints still use it because of its O(1) space.',
          commonMistakes: [
            'Forgetting the -i in the inner loop — re-comparing already sorted elements',
            'Not implementing the swapped flag — missing the O(n) best case optimization',
            'Off-by-one errors in loop bounds causing index out of range',
            'Assuming bubble sort is efficient — it\'s O(n²) and should be avoided for large data'
          ]
        },
        practicePhase: {
          instructions: [
            { step: 1, instruction: 'Implement a basic bubble sort function that sorts a list in ascending order', hint: 'Use nested loops: outer for passes, inner for comparisons' },
            { step: 2, instruction: 'Add the swapped flag optimization to exit early if the array is already sorted', hint: 'Set swapped = False before inner loop; break outer loop if no swaps' },
            { step: 3, instruction: 'Test with at least 3 different arrays: random, already sorted, and reverse sorted', hint: 'Test with [5,2,8,1], [1,2,3,4], and [4,3,2,1]' }
          ],
          starterCode: `def bubble_sort(arr):\n    """Sort array using bubble sort"""\n    n = len(arr)\n    # TODO: Implement bubble sort\n    # Hint: outer loop for passes, inner loop for comparisons\n    pass\n\n# Test cases\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))\nprint(bubble_sort([1, 2, 3, 4, 5]))\nprint(bubble_sort([5, 4, 3, 2, 1]))`,
          solution: `def bubble_sort(arr):\n    """Sort array using bubble sort with optimization"""\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))\nprint(bubble_sort([1, 2, 3, 4, 5]))\nprint(bubble_sort([5, 4, 3, 2, 1]))`,
          hints: [
            { level: 1, hint: 'Outer loop runs n times. Inner loop compares arr[j] with arr[j+1].' },
            { level: 2, hint: 'Python swap syntax: a, b = b, a — no temp variable needed!' },
            { level: 3, hint: 'Inner loop range is (0, n - i - 1) because last i elements are already sorted.' }
          ]
        },
        challengePhase: {
          problemStatement: 'Implement bubble sort and count the exact number of comparisons and swaps for a given array. Then implement a descending-order version.',
          requirements: [
            'Implement bubble_sort that returns the sorted array',
            'Count and print the total number of comparisons made',
            'Count and print the total number of swaps made',
            'Implement bubble_sort_desc for descending order',
            'Test both with the array [64, 34, 25, 12, 22, 11, 90]'
          ],
          testCases: [
            { input: '[64, 34, 25, 12, 22, 11, 90]', expected: '[11, 12, 22, 25, 34, 64, 90] ascending', points: 10 },
            { input: 'Comparison count', expected: 'Exact number of comparisons printed', points: 5 },
            { input: 'Descending sort', expected: '[90, 64, 34, 25, 22, 12, 11]', points: 5 }
          ]
        }
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
