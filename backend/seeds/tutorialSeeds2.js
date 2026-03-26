/* eslint-disable */
// Additional tutorial seeds — loaded automatically by tutorialSeeds.js
// Exports a plain array (no MongoTutorial import needed here)

const tutorialData2 = [
  // ─── JavaScript: Functions ───────────────────────────────────────────────
  {
    title: 'JavaScript Functions: Declaration, Expression & Arrow',
    slug: 'javascript-functions-complete-guide',
    description: 'Master JavaScript functions — from classic declarations to modern arrow functions. Learn scope, parameters, return values, and higher-order functions.',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 50,
    thumbnail: '/images/tutorials/js-functions.png',
    tags: ['javascript', 'functions', 'arrow-functions', 'scope', 'closures'],
    prerequisites: ['javascript-basics-variables-data-types'],
    learningObjectives: [
      'Declare and call functions in three different ways',
      'Understand parameters, arguments, and return values',
      'Use arrow functions for concise syntax',
      'Understand scope and closures at a basic level'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Function Declarations',
        content: `A **function** is a reusable block of code that performs a specific task.

**Syntax:**
\`\`\`
function functionName(parameters) {
  // code to run
  return value;
}
\`\`\`

Functions are defined once and can be called many times, keeping your code DRY (Don't Repeat Yourself).`,
        codeExamples: [
          {
            language: 'javascript',
            code: `function greet(name) {
  return "Hello, " + name + "!";
}

function add(a, b) {
  return a + b;
}

console.log(greet("Alice"));   // Hello, Alice!
console.log(add(3, 7));        // 10
console.log(add(100, 200));    // 300`,
            explanation: 'Functions accept input (parameters) and return output. You can call them as many times as you need.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Write a function called `multiply` that takes two numbers and returns their product.',
          starterCode: `function multiply(a, b) {
  // Your code here
}

console.log(multiply(4, 5));  // Should print 20
console.log(multiply(3, 3));  // Should print 9`,
          solution: `function multiply(a, b) {
  return a * b;
}

console.log(multiply(4, 5));
console.log(multiply(3, 3));`,
          hints: ['Use the return keyword', 'Multiply with the * operator']
        },
        quiz: {
          question: 'What does a function return if you do not include a `return` statement?',
          options: [
            { text: '0', isCorrect: false },
            { text: 'undefined', isCorrect: true },
            { text: 'null', isCorrect: false },
            { text: 'An error is thrown', isCorrect: false }
          ],
          explanation: 'Functions without a return statement (or with a bare `return`) implicitly return `undefined`.'
        }
      },
      {
        stepNumber: 2,
        title: 'Arrow Functions',
        content: `Arrow functions, introduced in ES6, provide a shorter syntax for writing functions.

**Classic vs Arrow:**
\`\`\`
// Classic
function square(x) { return x * x; }

// Arrow (full)
const square = (x) => { return x * x; };

// Arrow (concise — single expression, implicit return)
const square = x => x * x;
\`\`\`

Arrow functions are especially handy as callbacks.`,
        codeExamples: [
          {
            language: 'javascript',
            code: `// Classic function
function double(n) { return n * 2; }

// Arrow function
const triple = n => n * 3;

// Arrow with multiple params
const sum = (a, b) => a + b;

// Arrow with block body
const describe = name => {
  const msg = "My name is " + name;
  return msg.toUpperCase();
};

console.log(double(5));          // 10
console.log(triple(5));          // 15
console.log(sum(4, 6));          // 10
console.log(describe("Bob"));    // MY NAME IS BOB`,
            explanation: 'Arrow functions are syntactic sugar. They behave slightly differently regarding `this`, but for most beginner use cases they work the same as regular functions.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Rewrite the following function as a concise arrow function:\n`function isEven(n) { return n % 2 === 0; }`',
          starterCode: `// Rewrite as an arrow function
const isEven = // your code here

console.log(isEven(4));  // true
console.log(isEven(7));  // false`,
          solution: `const isEven = n => n % 2 === 0;

console.log(isEven(4));
console.log(isEven(7));`,
          hints: ['Single parameter — no parentheses needed', 'Single expression — no braces or return needed']
        },
        quiz: {
          question: 'Which arrow function syntax is valid for a single-expression return?',
          options: [
            { text: 'const f = x => { x * 2 }', isCorrect: false },
            { text: 'const f = x => x * 2', isCorrect: true },
            { text: 'const f = (x) { return x * 2 }', isCorrect: false },
            { text: 'const f = => x * 2', isCorrect: false }
          ],
          explanation: 'Without curly braces, the expression after `=>` is implicitly returned. No `return` keyword needed.'
        }
      },
      {
        stepNumber: 3,
        title: 'Higher-Order Functions',
        content: `A **higher-order function** is a function that takes another function as an argument or returns a function.

The most common built-in higher-order functions in JavaScript are:
- **\`array.map(fn)\`** — transform every element
- **\`array.filter(fn)\`** — keep elements that pass a test
- **\`array.reduce(fn, init)\`** — accumulate elements into a single value

These replace many manual for-loops and make code more readable.`,
        codeExamples: [
          {
            language: 'javascript',
            code: `const numbers = [1, 2, 3, 4, 5, 6];

// map: double every number
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);
// [2, 4, 6, 8, 10, 12]

// filter: keep only even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);
// [2, 4, 6]

// reduce: sum all numbers
const total = numbers.reduce((acc, n) => acc + n, 0);
console.log("Total:", total);
// 21`,
            explanation: 'map, filter, and reduce are the workhorses of functional-style JavaScript. Practice these until they feel natural.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Use `.filter()` and `.map()` to: 1) Filter the array to only words longer than 3 characters, 2) Convert those words to uppercase.',
          starterCode: `const words = ["hi", "hello", "go", "world", "ok", "javascript"];

// Step 1: filter words longer than 3 chars
// Step 2: map to uppercase
const result = words
  // your code here

console.log(result); // ["HELLO", "WORLD", "JAVASCRIPT"]`,
          solution: `const words = ["hi", "hello", "go", "world", "ok", "javascript"];

const result = words
  .filter(w => w.length > 3)
  .map(w => w.toUpperCase());

console.log(result);`,
          hints: ['Chain .filter() before .map()', 'Use w.length > 3 in filter', 'Use w.toUpperCase() in map']
        },
        quiz: {
          question: 'What does `[1,2,3].map(x => x * x)` return?',
          options: [
            { text: '[1, 4, 9]', isCorrect: true },
            { text: '[2, 4, 6]', isCorrect: false },
            { text: '14', isCorrect: false },
            { text: '[1, 2, 3, 1, 4, 9]', isCorrect: false }
          ],
          explanation: 'map() transforms each element. 1² = 1, 2² = 4, 3² = 9, so the result is [1, 4, 9].'
        }
      }
    ],
    author: { name: 'CodeArc Team', avatar: null },
    rating: { average: 4.8, count: 92 },
    stats: { views: 680, completions: 410, likes: 234 }
  },

  // ─── JavaScript: Control Flow ─────────────────────────────────────────────
  {
    title: 'JavaScript Control Flow: Conditions & Loops',
    slug: 'javascript-control-flow',
    description: 'Take control of your code with if/else statements, switch, for/while loops, and the ternary operator. Build logic that responds to any situation.',
    category: 'Programming Fundamentals',
    language: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 40,
    thumbnail: '/images/tutorials/js-control-flow.png',
    tags: ['javascript', 'if-else', 'loops', 'control-flow', 'beginner'],
    prerequisites: ['javascript-basics-variables-data-types'],
    learningObjectives: [
      'Use if, else if, and else to branch code',
      'Use the switch statement for multiple cases',
      'Write for, while, and for...of loops',
      'Use the ternary operator for concise conditionals'
    ],
    isFeatured: false,
    steps: [
      {
        stepNumber: 1,
        title: 'If / Else Statements',
        content: `The **if** statement runs code only when a condition is true. **else** provides an alternative branch.

\`\`\`
if (condition) {
  // runs when condition is true
} else if (anotherCondition) {
  // runs if first is false but this is true
} else {
  // fallback
}
\`\`\`

Conditions evaluate to **truthy** or **falsy** values. Use comparison operators: \`===\`, \`!==\`, \`>\`, \`<\`, \`>=\`, \`<=\`.`,
        codeExamples: [
          {
            language: 'javascript',
            code: `const score = 72;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
// Grade: C

// Ternary operator (shorthand for simple if/else)
const status = score >= 60 ? "Pass" : "Fail";
console.log(status); // Pass`,
            explanation: 'Conditions are evaluated top to bottom. The first true branch executes, then the rest are skipped.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Write a function `getTicketPrice(age)` that returns:\n- "Free" if age < 5\n- "Child (£3)" if age < 12\n- "Adult (£10)" otherwise',
          starterCode: `function getTicketPrice(age) {
  // Your code here
}

console.log(getTicketPrice(3));   // Free
console.log(getTicketPrice(8));   // Child (£3)
console.log(getTicketPrice(25));  // Adult (£10)`,
          solution: `function getTicketPrice(age) {
  if (age < 5) return "Free";
  if (age < 12) return "Child (£3)";
  return "Adult (£10)";
}

console.log(getTicketPrice(3));
console.log(getTicketPrice(8));
console.log(getTicketPrice(25));`,
          hints: ['Check youngest age first', 'Each if with return exits the function immediately']
        },
        quiz: {
          question: 'What is the output of: `const x = 5; console.log(x > 3 ? "big" : "small")`?',
          options: [
            { text: '"small"', isCorrect: false },
            { text: '"big"', isCorrect: true },
            { text: 'true', isCorrect: false },
            { text: 'undefined', isCorrect: false }
          ],
          explanation: '5 > 3 is true, so the ternary returns "big".'
        }
      },
      {
        stepNumber: 2,
        title: 'Loops: for, while, for...of',
        content: `Loops repeat code a number of times or until a condition changes.

**Types of loops:**
- **\`for\`**: when you know the number of iterations
- **\`while\`**: when you repeat until a condition becomes false
- **\`for...of\`**: to iterate over the items of an array or string

**for syntax:**
\`\`\`
for (let i = 0; i < 5; i++) {
  console.log(i);
}
\`\`\``,
        codeExamples: [
          {
            language: 'javascript',
            code: `// for loop: count 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}

// while loop
let countdown = 3;
while (countdown > 0) {
  console.log("T-minus", countdown);
  countdown--;
}

// for...of: iterate an array
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log("Fruit:", fruit);
}`,
            explanation: 'Use for when you have a known range, while when you have an unknown stop condition, for...of for clean array iteration.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Use a `for` loop to calculate the sum of numbers from 1 to 100.',
          starterCode: `let sum = 0;

// for loop from 1 to 100

console.log("Sum:", sum); // Sum: 5050`,
          solution: `let sum = 0;
for (let i = 1; i <= 100; i++) {
  sum += i;
}
console.log("Sum:", sum);`,
          hints: ['Start i at 1, go up to and including 100', 'Use sum += i inside the loop']
        },
        quiz: {
          question: 'Which loop is best for iterating over an array\'s items without needing the index?',
          options: [
            { text: 'for (let i = 0; ...)', isCorrect: false },
            { text: 'while (...)', isCorrect: false },
            { text: 'for...of', isCorrect: true },
            { text: 'do...while', isCorrect: false }
          ],
          explanation: 'for...of cleanly gives you each item without managing an index variable.'
        }
      }
    ],
    author: { name: 'CodeArc Team', avatar: null },
    rating: { average: 4.6, count: 78 },
    stats: { views: 520, completions: 345, likes: 189 }
  },

  // ─── Python: Functions & Control Flow ────────────────────────────────────
  {
    title: 'Python Functions and Control Flow',
    slug: 'python-functions-control-flow',
    description: 'Learn to write reusable Python functions, handle conditions with if/elif/else, and repeat actions with for and while loops.',
    category: 'Programming Fundamentals',
    language: 'python',
    difficulty: 'beginner',
    estimatedTime: 45,
    thumbnail: '/images/tutorials/python-functions.png',
    tags: ['python', 'functions', 'if-else', 'loops', 'beginner'],
    prerequisites: ['python-fundamentals-getting-started'],
    learningObjectives: [
      'Define and call Python functions with def',
      'Use default parameters and return multiple values',
      'Write if/elif/else decision trees',
      'Iterate with for and while loops'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Defining Functions',
        content: `In Python, you define a function using the **def** keyword.

\`\`\`
def function_name(parameters):
    # indented body
    return value
\`\`\`

Python uses **indentation** (4 spaces or 1 tab) to define code blocks — there are no curly braces.

You can give parameters **default values** so callers can omit them.`,
        codeExamples: [
          {
            language: 'python',
            code: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

def power(base, exponent=2):
    return base ** exponent

print(greet("Alice"))           # Hello, Alice!
print(greet("Bob", "Hi"))       # Hi, Bob!
print(power(3))                 # 9 (3^2)
print(power(2, 10))             # 1024 (2^10)`,
            explanation: 'Default parameters make functions flexible. If a caller omits the argument, the default value is used.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Write a function `celsius_to_fahrenheit(c)` that converts Celsius to Fahrenheit. Formula: F = (C × 9/5) + 32',
          starterCode: `def celsius_to_fahrenheit(c):
    # Your code here
    pass

print(celsius_to_fahrenheit(0))    # 32.0
print(celsius_to_fahrenheit(100))  # 212.0
print(celsius_to_fahrenheit(37))   # 98.6`,
          solution: `def celsius_to_fahrenheit(c):
    return (c * 9 / 5) + 32

print(celsius_to_fahrenheit(0))
print(celsius_to_fahrenheit(100))
print(celsius_to_fahrenheit(37))`,
          hints: ['Multiply by 9, divide by 5, then add 32', 'Use return to send back the result']
        },
        quiz: {
          question: 'What keyword is used to define a function in Python?',
          options: [
            { text: 'function', isCorrect: false },
            { text: 'fn', isCorrect: false },
            { text: 'def', isCorrect: true },
            { text: 'lambda', isCorrect: false }
          ],
          explanation: 'Python uses `def` to define named functions. `lambda` creates anonymous one-liner functions.'
        }
      },
      {
        stepNumber: 2,
        title: 'Conditions and Loops',
        content: `**if / elif / else** in Python works like other languages but with cleaner syntax:

\`\`\`
if condition:
    # block
elif another_condition:
    # block
else:
    # block
\`\`\`

**for loops** iterate over any iterable (list, string, range):
\`\`\`
for item in collection:
    # use item
\`\`\`

**range(n)** generates numbers 0 to n-1.`,
        codeExamples: [
          {
            language: 'python',
            code: `# if/elif/else
def classify_temp(temp):
    if temp < 0:
        return "Freezing"
    elif temp < 15:
        return "Cold"
    elif temp < 25:
        return "Comfortable"
    else:
        return "Hot"

print(classify_temp(-5))   # Freezing
print(classify_temp(20))   # Comfortable
print(classify_temp(35))   # Hot

# for loop with range
total = 0
for i in range(1, 6):   # 1, 2, 3, 4, 5
    total += i
print("Sum 1-5:", total)  # 15

# for loop over list
colors = ["red", "green", "blue"]
for color in colors:
    print(color.upper())`,
            explanation: 'Python\'s for loop is elegant — no manual index needed when iterating a collection. Use range() when you need indices.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Write a function `fizzbuzz(n)` that prints numbers 1 to n. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".',
          starterCode: `def fizzbuzz(n):
    for i in range(1, n + 1):
        # Your code here
        pass

fizzbuzz(15)`,
          solution: `def fizzbuzz(n):
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

fizzbuzz(15)`,
          hints: ['Check divisible by both 3 AND 5 first', 'Use % (modulo) operator to check divisibility']
        },
        quiz: {
          question: 'What does `range(1, 5)` produce?',
          options: [
            { text: '[1, 2, 3, 4, 5]', isCorrect: false },
            { text: '[1, 2, 3, 4]', isCorrect: true },
            { text: '[0, 1, 2, 3, 4]', isCorrect: false },
            { text: '[1, 5]', isCorrect: false }
          ],
          explanation: 'range(start, stop) generates numbers from start up to (but not including) stop. So range(1, 5) = 1, 2, 3, 4.'
        }
      }
    ],
    author: { name: 'CodeArc Team', avatar: null },
    rating: { average: 4.7, count: 103 },
    stats: { views: 742, completions: 489, likes: 267 }
  },

  // ─── Python: Lists, Dicts, Tuples ────────────────────────────────────────
  {
    title: 'Python Data Structures: Lists, Dicts & Tuples',
    slug: 'python-lists-dicts-tuples',
    description: 'Master Python\'s core data structures. Learn to store, access, and manipulate collections of data using lists, dictionaries, and tuples.',
    category: 'Programming Fundamentals',
    language: 'python',
    difficulty: 'beginner',
    estimatedTime: 55,
    thumbnail: '/images/tutorials/python-data-structures.png',
    tags: ['python', 'lists', 'dictionaries', 'tuples', 'data-structures'],
    prerequisites: ['python-fundamentals-getting-started'],
    learningObjectives: [
      'Create and manipulate Python lists',
      'Use list comprehensions for concise transformations',
      'Work with dictionaries for key-value storage',
      'Understand when to use tuples vs lists'
    ],
    isFeatured: false,
    steps: [
      {
        stepNumber: 1,
        title: 'Lists',
        content: `A **list** is an ordered, mutable (changeable) collection of items. Lists can hold any mix of types.

\`\`\`
my_list = [1, "hello", True, 3.14]
\`\`\`

**Key operations:**
- Access: \`my_list[0]\` (0-indexed)
- Slice: \`my_list[1:3]\`
- Append: \`my_list.append(item)\`
- Remove: \`my_list.remove(item)\` or \`del my_list[index]\`
- Length: \`len(my_list)\``,
        codeExamples: [
          {
            language: 'python',
            code: `fruits = ["apple", "banana", "cherry"]

# Access
print(fruits[0])      # apple
print(fruits[-1])     # cherry (last item)

# Slice
print(fruits[0:2])    # ['apple', 'banana']

# Modify
fruits.append("date")
fruits[1] = "blueberry"
print(fruits)         # ['apple', 'blueberry', 'cherry', 'date']

# List comprehension: squares of 1-5
squares = [x**2 for x in range(1, 6)]
print(squares)        # [1, 4, 9, 16, 25]`,
            explanation: 'Lists are Python\'s most versatile data structure. List comprehensions let you build lists in one readable line.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Create a list of numbers 1-10. Use a list comprehension to create a new list containing only the even numbers from that list.',
          starterCode: `numbers = list(range(1, 11))

# Use list comprehension to filter even numbers
evens = # your code here

print(evens)  # [2, 4, 6, 8, 10]`,
          solution: `numbers = list(range(1, 11))
evens = [n for n in numbers if n % 2 == 0]
print(evens)`,
          hints: ['Add an if condition inside the comprehension', 'n % 2 == 0 checks for even numbers']
        },
        quiz: {
          question: 'What does `["a", "b", "c"][-1]` return?',
          options: [
            { text: '"a"', isCorrect: false },
            { text: '"b"', isCorrect: false },
            { text: '"c"', isCorrect: true },
            { text: 'An IndexError', isCorrect: false }
          ],
          explanation: 'Negative indices count from the end. -1 is the last element, so "c".'
        }
      },
      {
        stepNumber: 2,
        title: 'Dictionaries',
        content: `A **dictionary** stores key-value pairs — like a real dictionary where a word maps to a definition.

\`\`\`
person = {"name": "Alice", "age": 30}
\`\`\`

Keys must be unique and immutable (strings, numbers). Values can be anything.

**Key operations:**
- Access: \`person["name"]\` or \`person.get("name")\`
- Add/update: \`person["email"] = "alice@x.com"\`
- Delete: \`del person["age"]\`
- Iterate: \`person.items()\`, \`person.keys()\`, \`person.values()\``,
        codeExamples: [
          {
            language: 'python',
            code: `student = {
    "name": "Bob",
    "age": 20,
    "grades": [85, 92, 78]
}

# Access
print(student["name"])          # Bob
print(student.get("gpa", "N/A"))  # N/A (safe default)

# Add/update
student["gpa"] = 3.5
student["age"] = 21

# Iterate key-value pairs
for key, value in student.items():
    print(f"{key}: {value}")

# Dict comprehension: word lengths
words = ["python", "is", "awesome"]
lengths = {word: len(word) for word in words}
print(lengths)  # {'python': 6, 'is': 2, 'awesome': 7}`,
            explanation: 'Use .get() instead of [] when a key might not exist — it returns None (or a default) instead of raising KeyError.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Write a function `count_chars(text)` that returns a dictionary counting how many times each character appears in the string.',
          starterCode: `def count_chars(text):
    counts = {}
    for char in text:
        # Your code here
        pass
    return counts

print(count_chars("hello"))
# {'h': 1, 'e': 1, 'l': 2, 'o': 1}`,
          solution: `def count_chars(text):
    counts = {}
    for char in text:
        counts[char] = counts.get(char, 0) + 1
    return counts

print(count_chars("hello"))`,
          hints: ['Use .get(char, 0) to safely get current count', 'Add 1 to the count for each character seen']
        },
        quiz: {
          question: 'What does `{}.get("key", "default")` return when "key" is not in the dictionary?',
          options: [
            { text: 'None', isCorrect: false },
            { text: '"default"', isCorrect: true },
            { text: 'A KeyError', isCorrect: false },
            { text: '""', isCorrect: false }
          ],
          explanation: '.get(key, default) returns the default value when the key is missing, avoiding a KeyError.'
        }
      }
    ],
    author: { name: 'CodeArc Team', avatar: null },
    rating: { average: 4.7, count: 89 },
    stats: { views: 614, completions: 378, likes: 201 }
  },

  // ─── TypeScript: Getting Started ─────────────────────────────────────────
  {
    title: 'TypeScript: Type Safety for JavaScript Developers',
    slug: 'typescript-getting-started',
    description: 'Discover how TypeScript adds static types to JavaScript. Learn type annotations, interfaces, and how types catch bugs before your code runs.',
    category: 'Programming Fundamentals',
    language: 'typescript',
    difficulty: 'beginner',
    estimatedTime: 50,
    thumbnail: '/images/tutorials/typescript-basics.png',
    tags: ['typescript', 'types', 'interfaces', 'javascript', 'beginner'],
    prerequisites: ['javascript-basics-variables-data-types', 'javascript-functions-complete-guide'],
    learningObjectives: [
      'Understand what TypeScript adds to JavaScript',
      'Annotate variables and function parameters with types',
      'Define object shapes with interfaces',
      'Use union types and optional properties'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Basic Type Annotations',
        content: `TypeScript lets you annotate variables with types, so the compiler catches mismatches before runtime.

**Primitive types:** \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`

\`\`\`
let name: string = "Alice";
let age: number = 30;
let isStudent: boolean = true;
\`\`\`

**Functions:**
\`\`\`
function greet(name: string): string {
  return "Hello " + name;
}
\`\`\`

If you pass the wrong type, TypeScript shows an error immediately in your editor.`,
        codeExamples: [
          {
            language: 'typescript',
            code: `// Variable annotations
let username: string = "Alice";
let score: number = 100;
let isActive: boolean = true;

// Function with typed params and return type
function add(a: number, b: number): number {
  return a + b;
}

// Array types
const tags: string[] = ["typescript", "coding"];

console.log(username, score, isActive);
console.log(add(3, 7));
console.log(tags);`,
            explanation: 'TypeScript\'s type system is a layer on top of JavaScript. At compile time it checks your types, then strips them out to produce plain JS.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Write a typed function `describe(name: string, age: number): string` that returns a sentence like "Alice is 30 years old."',
          starterCode: `function describe(name: string, age: number): string {
  // Your code here
  return "";
}

console.log(describe("Alice", 30));  // Alice is 30 years old.
console.log(describe("Bob", 25));    // Bob is 25 years old.`,
          solution: `function describe(name: string, age: number): string {
  return name + " is " + age + " years old.";
}

console.log(describe("Alice", 30));
console.log(describe("Bob", 25));`,
          hints: ['Concatenate name, " is ", age, and " years old."', 'The return type annotation is : string after the params']
        },
        quiz: {
          question: 'What TypeScript type would you use for a variable that holds `true` or `false`?',
          options: [
            { text: 'string', isCorrect: false },
            { text: 'number', isCorrect: false },
            { text: 'boolean', isCorrect: true },
            { text: 'any', isCorrect: false }
          ],
          explanation: '`boolean` is the TypeScript type for true/false values. Using `any` defeats the purpose of TypeScript.'
        }
      },
      {
        stepNumber: 2,
        title: 'Interfaces and Union Types',
        content: `An **interface** describes the shape of an object — what properties it must have and their types.

\`\`\`
interface User {
  name: string;
  age: number;
  email?: string; // optional
}
\`\`\`

A **union type** allows a value to be one of several types:
\`\`\`
let id: number | string = 101;
id = "user-101"; // also valid
\`\`\``,
        codeExamples: [
          {
            language: 'typescript',
            code: `interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number; // optional
}

function formatProduct(p: Product): string {
  const finalPrice = p.price - (p.discount ?? 0);
  return p.name + " — $" + finalPrice.toFixed(2);
}

const laptop: Product = { id: 1, name: "Laptop", price: 999, discount: 50 };
const book: Product = { id: 2, name: "TypeScript Handbook", price: 29 };

console.log(formatProduct(laptop)); // Laptop — $949.00
console.log(formatProduct(book));   // TypeScript Handbook — $29.00

// Union types
function printId(id: number | string): void {
  console.log("ID:", id);
}
printId(101);
printId("user-101");`,
            explanation: 'Interfaces act as contracts for objects. The optional `?` means the property doesn\'t have to be present. Union types give flexibility while staying typed.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Define an interface `Shape` with `type: string` and `area: number`. Then write a function `describeShape(s: Shape): string` that returns "A {type} with area {area}".',
          starterCode: `interface Shape {
  // Define properties here
}

function describeShape(s: Shape): string {
  // Your code here
  return "";
}

const circle: Shape = { type: "circle", area: 78.5 };
console.log(describeShape(circle));  // A circle with area 78.5`,
          solution: `interface Shape {
  type: string;
  area: number;
}

function describeShape(s: Shape): string {
  return "A " + s.type + " with area " + s.area;
}

const circle: Shape = { type: "circle", area: 78.5 };
console.log(describeShape(circle));`,
          hints: ['Interface properties: type: string; area: number;', 'Access properties with s.type and s.area']
        },
        quiz: {
          question: 'In an interface, what does the `?` after a property name mean?',
          options: [
            { text: 'The property can be null', isCorrect: false },
            { text: 'The property is optional', isCorrect: true },
            { text: 'The property type is unknown', isCorrect: false },
            { text: 'The property is read-only', isCorrect: false }
          ],
          explanation: '`property?: type` marks a property as optional — objects implementing the interface don\'t have to include it.'
        }
      }
    ],
    author: { name: 'CodeArc Team', avatar: null },
    rating: { average: 4.8, count: 71 },
    stats: { views: 498, completions: 312, likes: 178 }
  },

  // ─── Algorithms: Binary Search ────────────────────────────────────────────
  {
    title: 'Binary Search: Efficient Searching in Sorted Arrays',
    slug: 'algorithms-binary-search',
    description: 'Understand why linear search is slow and how binary search achieves O(log n) time. Implement it iteratively and recursively, and know when to use it.',
    category: 'Algorithms',
    language: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 40,
    thumbnail: '/images/tutorials/binary-search.png',
    tags: ['algorithms', 'binary-search', 'search', 'big-o', 'intermediate'],
    prerequisites: ['arrays-lists-data-storage-fundamentals'],
    learningObjectives: [
      'Understand the limitation of linear search',
      'Implement binary search iteratively',
      'Implement binary search recursively',
      'Analyse O(log n) time complexity'
    ],
    isFeatured: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Why Binary Search?',
        content: `**Linear search** checks every element one by one — O(n). For a million-element array that's up to 1,000,000 comparisons.

**Binary search** works on *sorted* arrays by repeatedly halving the search space:
1. Look at the middle element
2. If it matches → done!
3. If target is smaller → search the left half
4. If target is larger → search the right half
5. Repeat until found or space is empty

At most **log₂(n)** comparisons. For a million elements: only ~20 comparisons!`,
        codeExamples: [
          {
            language: 'javascript',
            code: `// Linear search — O(n)
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Binary search — O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // not found
}

const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

console.log(binarySearch(sorted, 23)); // 5 (index)
console.log(binarySearch(sorted, 10)); // -1 (not found)
console.log(linearSearch(sorted, 23)); // 5`,
            explanation: 'Both return the index of the target. Binary search is dramatically faster on large sorted arrays.',
            isExecutable: true
          }
        ],
        practice: {
          type: 'code',
          instructions: 'Implement binary search. Return the index of the target, or -1 if not found.',
          starterCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // Your logic here
  }
  return -1;
}

const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7));   // 3
console.log(binarySearch(arr, 10));  // -1`,
          solution: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7));
console.log(binarySearch(arr, 10));`,
          hints: ['Compare arr[mid] to target', 'If too small, search right half: left = mid + 1', 'If too big, search left half: right = mid - 1']
        },
        quiz: {
          question: 'What is the prerequisite for binary search to work?',
          options: [
            { text: 'The array must have an even number of elements', isCorrect: false },
            { text: 'The array must be sorted', isCorrect: true },
            { text: 'The array must contain only numbers', isCorrect: false },
            { text: 'The target must be in the array', isCorrect: false }
          ],
          explanation: 'Binary search relies on the sorted order to know which half to discard. It will not work correctly on unsorted arrays.'
        }
      }
    ],
    author: { name: 'CodeArc Team', avatar: null },
    rating: { average: 4.9, count: 84 },
    stats: { views: 590, completions: 401, likes: 245 }
  }
];

module.exports = tutorialData2;
