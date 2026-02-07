// 25 JavaScript Tutorials with full 3-phase content
module.exports = function (T, S) {
  return [
    T({
      title: 'JavaScript Variables and Data Types', slug: 'js-variables-data-types',
      description: 'Learn how to declare variables with let, const, and var, and understand JavaScript data types.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['javascript', 'variables', 'data-types', 'fundamentals'],
      objectives: ['Declare variables with let, const, var', 'Understand primitive data types', 'Use typeof operator'],
      featured: true,
      steps: [
        S(1, {
          title: 'Variable Declarations', content: 'JavaScript provides three ways to declare variables: let, const, and var.',
          lang: 'javascript', code: 'let name = "Alice";\nconst PI = 3.14;\nvar legacy = true;\nconsole.log(name, PI, legacy);',
          concept: 'Variables are containers for storing data. `let` allows reassignment, `const` does not, and `var` is function-scoped (legacy).',
          keyPoints: ['Use const by default', 'Use let when reassignment is needed', 'Avoid var in modern code'],
          realWorld: 'In a shopping cart, the cart items array uses let (items change), while the tax rate uses const (fixed).',
          mistakes: ['Using var instead of let/const', 'Trying to reassign a const variable', 'Not initializing const at declaration'],
          pInstructions: ['Declare a const for your name', 'Declare a let for your age', 'Log both to the console'],
          starter: '// Declare a const called myName\n\n// Declare a let called myAge\n\n// Log both values\n',
          solution: 'const myName = "Alice";\nlet myAge = 25;\nconsole.log(myName, myAge);',
          hints: ['Use const for values that won\'t change', 'Use let for values that will change'],
          challenge: 'Create variables for a user profile with name (const), age (let), and isActive (let). Log them, then update age and isActive.',
          reqs: ['Use const for name', 'Use let for age and isActive', 'Reassign age and isActive', 'Log before and after'],
          tests: [['name="Test"', 'const used', 5], ['age=25;age=26', '26', 5]]
        }),
        S(2, {
          title: 'Primitive Data Types', content: 'JavaScript has 7 primitive types: string, number, boolean, null, undefined, symbol, bigint.',
          lang: 'javascript', code: 'console.log(typeof "hello");  // string\nconsole.log(typeof 42);       // number\nconsole.log(typeof true);     // boolean\nconsole.log(typeof undefined);// undefined\nconsole.log(typeof null);     // object (bug!)',
          concept: 'Primitives are immutable values. typeof returns the type as a string. Note: typeof null returns "object" — a historical bug.',
          keyPoints: ['7 primitive types in JS', 'typeof returns a string', 'null is typeof "object" (historical bug)', 'undefined means declared but no value'],
          realWorld: 'Form validation checks types: is the email a string? Is the age a number? Is the checkbox a boolean?',
          mistakes: ['Confusing null and undefined', 'Assuming typeof null === "null"', 'Using == instead of === for type comparisons'],
          pInstructions: ['Create one variable of each primitive type', 'Use typeof on each and log the results'],
          starter: '// Create variables of different types\nlet myString = ;\nlet myNumber = ;\nlet myBoolean = ;\nlet myNull = ;\nlet myUndefined;\n\n// Log typeof for each\n',
          solution: 'let myString = "hello";\nlet myNumber = 42;\nlet myBoolean = true;\nlet myNull = null;\nlet myUndefined;\nconsole.log(typeof myString);\nconsole.log(typeof myNumber);\nconsole.log(typeof myBoolean);\nconsole.log(typeof myNull);\nconsole.log(typeof myUndefined);',
          hints: ['Strings use quotes', 'null is assigned explicitly'],
          challenge: 'Write a function that takes any value and returns a detailed type description including handling null correctly.',
          reqs: ['Handle null separately from object', 'Return descriptive strings', 'Handle all 7 primitives'],
          tests: [['getType(null)', '"null"', 5], ['getType(42)', '"number"', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Functions and Scope', slug: 'js-functions-scope',
      description: 'Master function declarations, expressions, arrow functions, and understand scope.',
      language: 'javascript', difficulty: 'beginner', duration: 40,
      tags: ['javascript', 'functions', 'scope', 'closures'],
      objectives: ['Write function declarations and expressions', 'Use arrow functions', 'Understand scope and closures'],
      steps: [
        S(1, {
          title: 'Function Basics', content: 'Functions are reusable blocks of code that perform tasks.',
          lang: 'javascript', code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\nconst greetArrow = (name) => `Hello, ${name}!`;\nconsole.log(greet("Alice"));\nconsole.log(greetArrow("Bob"));',
          concept: 'Functions can be declared with the function keyword or as arrow functions. Arrow functions have shorter syntax and lexical this binding.',
          keyPoints: ['Function declarations are hoisted', 'Arrow functions have concise syntax', 'Functions can have default parameters', 'Return is implicit in single-expression arrows'],
          realWorld: 'A payment processing system uses functions for each step: validateCard(), calculateTotal(), processPayment().',
          mistakes: ['Forgetting return in multi-line functions', 'Using this in arrow functions expecting dynamic binding', 'Not handling missing arguments'],
          pInstructions: ['Write a function declaration that adds two numbers', 'Convert it to an arrow function', 'Add a default parameter'],
          starter: '// Function declaration\nfunction add(a, b) {\n  // your code\n}\n\n// Arrow function version\nconst addArrow = \n\n// With default parameter\nconst addDefault = \n\nconsole.log(add(2, 3));\nconsole.log(addArrow(2, 3));\nconsole.log(addDefault(5));',
          solution: 'function add(a, b) {\n  return a + b;\n}\nconst addArrow = (a, b) => a + b;\nconst addDefault = (a, b = 10) => a + b;\nconsole.log(add(2, 3));\nconsole.log(addArrow(2, 3));\nconsole.log(addDefault(5));',
          hints: ['Arrow functions with one expression don\'t need braces or return', 'Default params use = in the parameter list'],
          challenge: 'Create a function calculator that takes an operator string (+, -, *, /) and returns a function that performs that operation.',
          reqs: ['Return a function from calculator()', 'Support +, -, *, / operators', 'Handle division by zero'],
          tests: [['calculator("+")(2,3)', '5', 5], ['calculator("*")(4,5)', '20', 5]]
        }),
        S(2, {
          title: 'Scope and Closures', content: 'Scope determines variable accessibility. Closures let inner functions access outer variables.',
          lang: 'javascript', code: 'function counter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\nconst c = counter();\nc.increment();\nc.increment();\nconsole.log(c.getCount()); // 2',
          concept: 'A closure is created when a function retains access to its lexical scope even after the outer function has returned.',
          keyPoints: ['Block scope with let/const', 'Function scope with var', 'Closures capture variables by reference', 'Each closure instance is independent'],
          realWorld: 'A rate limiter uses closures: the outer function stores the timestamp of the last call, and the inner function checks if enough time has passed.',
          mistakes: ['Var in loops creates shared reference', 'Assuming closures copy values', 'Memory leaks from unused closures'],
          pInstructions: ['Create a function that returns a counter object', 'The counter should have increment and decrement methods', 'Add a reset method'],
          starter: 'function createCounter(initial) {\n  // your code here\n  return {\n    increment: ,\n    decrement: ,\n    reset: ,\n    getValue: \n  };\n}\n\nconst counter = createCounter(0);\ncounter.increment();\ncounter.increment();\ncounter.decrement();\nconsole.log(counter.getValue());',
          solution: 'function createCounter(initial) {\n  let count = initial;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    reset: () => { count = initial; },\n    getValue: () => count\n  };\n}\nconst counter = createCounter(0);\ncounter.increment();\ncounter.increment();\ncounter.decrement();\nconsole.log(counter.getValue());',
          hints: ['Store count in the outer function', 'Each method is a closure over count'],
          challenge: 'Build a memoize function that caches results of expensive function calls.',
          reqs: ['Return cached result for repeated inputs', 'Work with any single-argument function', 'Include a cache.clear() method'],
          tests: [['memoized(5) called twice', 'computed once', 5], ['cache stores results', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Arrays Deep Dive', slug: 'js-arrays-deep-dive',
      description: 'Master array methods including map, filter, reduce, and more.',
      language: 'javascript', difficulty: 'beginner', duration: 45,
      tags: ['javascript', 'arrays', 'methods', 'iteration'],
      objectives: ['Use map, filter, reduce effectively', 'Chain array methods', 'Understand mutation vs immutability'],
      steps: [
        S(1, {
          title: 'Map and Filter', content: 'map transforms each element; filter selects elements matching a condition.',
          lang: 'javascript', code: 'const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log(doubled); // [2,4,6,8,10]\nconsole.log(evens);   // [2,4]',
          concept: 'map() creates a new array by applying a function to every element. filter() creates a new array with elements that pass a test. Neither mutates the original.',
          keyPoints: ['map returns same-length array', 'filter returns equal-or-shorter array', 'Both return new arrays', 'Callbacks receive (element, index, array)'],
          realWorld: 'An e-commerce site uses map to format prices and filter to show only in-stock items.',
          mistakes: ['Using map when forEach is appropriate', 'Forgetting map returns a new array', 'Not returning from map callback'],
          pInstructions: ['Create an array of numbers 1-10', 'Use map to square each number', 'Use filter to keep only squares > 25'],
          starter: 'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Square each number\nconst squared = \n\n// Keep only squares > 25\nconst large = \n\nconsole.log(squared);\nconsole.log(large);',
          solution: 'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst squared = numbers.map(n => n * n);\nconst large = squared.filter(n => n > 25);\nconsole.log(squared);\nconsole.log(large);',
          hints: ['map takes a function applied to each element', 'filter keeps elements where callback returns true'],
          challenge: 'Given an array of objects with name and score, use map and filter to get names of students scoring above 80, formatted as "Name: score%".',
          reqs: ['Filter scores > 80', 'Map to formatted strings', 'Chain the methods'],
          tests: [['[{name:"A",score:90}]', '["A: 90%"]', 5], ['[{name:"B",score:70}]', '[]', 5]]
        }),
        S(2, {
          title: 'Reduce and Advanced Methods', content: 'reduce accumulates array elements into a single value.',
          lang: 'javascript', code: 'const nums = [1, 2, 3, 4, 5];\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log(sum); // 15\n\nconst grouped = ["apple","avocado","banana","blueberry"]\n  .reduce((acc, f) => {\n    const key = f[0];\n    (acc[key] = acc[key] || []).push(f);\n    return acc;\n  }, {});\nconsole.log(grouped);',
          concept: 'reduce iterates through an array, maintaining an accumulator that builds up a result. It can produce any type: number, string, object, or array.',
          keyPoints: ['Always provide initial value', 'Accumulator can be any type', 'reduce can replace map+filter', 'find/some/every for specific checks'],
          realWorld: 'A shopping cart uses reduce to calculate the total price from an array of items with quantities and prices.',
          mistakes: ['Forgetting initial value', 'Not returning accumulator', 'Overusing reduce when map/filter is clearer'],
          pInstructions: ['Use reduce to sum an array', 'Use reduce to find the maximum value', 'Use reduce to count occurrences of each element'],
          starter: 'const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];\n\n// Sum all values\nconst sum = \n\n// Find max value\nconst max = \n\n// Count occurrences\nconst counts = \n\nconsole.log(sum, max, counts);',
          solution: 'const data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];\nconst sum = data.reduce((a, b) => a + b, 0);\nconst max = data.reduce((a, b) => a > b ? a : b);\nconst counts = data.reduce((acc, n) => { acc[n] = (acc[n] || 0) + 1; return acc; }, {});\nconsole.log(sum, max, counts);',
          hints: ['Sum starts with initial value 0', 'Max can skip initial value', 'Counts uses an object as accumulator'],
          challenge: 'Implement a groupBy function using reduce that groups array elements by a key function.',
          reqs: ['Accept array and key function', 'Return object with grouped arrays', 'Handle empty arrays'],
          tests: [['groupBy([1,2,3], n=>n%2)', '{0:[2],1:[1,3]}', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Objects and Prototypes', slug: 'js-objects-prototypes',
      description: 'Understand object creation, property access, destructuring, and the prototype chain.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['javascript', 'objects', 'prototypes', 'destructuring'],
      objectives: ['Create and manipulate objects', 'Use destructuring effectively', 'Understand prototype inheritance'],
      steps: [
        S(1, {
          title: 'Object Fundamentals', content: 'Objects store key-value pairs and are the building blocks of JavaScript.',
          lang: 'javascript', code: 'const user = { name: "Alice", age: 30, greet() { return `Hi, I\'m ${this.name}`; } };\nconsole.log(user.greet());\n\nconst { name, age } = user;\nconsole.log(name, age);',
          concept: 'Objects group related data and behavior. Destructuring extracts properties into variables. Shorthand methods omit the function keyword.',
          keyPoints: ['Dot vs bracket notation', 'Shorthand property and method syntax', 'Destructuring with defaults', 'Spread operator for cloning'],
          realWorld: 'API responses are objects. Destructuring extracts just the fields you need from a large response.',
          mistakes: ['Mutating objects passed to functions', 'Shallow vs deep copy confusion', 'this in nested functions'],
          pInstructions: ['Create a person object with name, age, hobbies', 'Destructure the object', 'Use spread to clone and modify'],
          starter: '// Create person object\nconst person = {\n  // add properties\n};\n\n// Destructure\nconst {  } = person;\n\n// Clone and modify\nconst updated = \n\nconsole.log(person);\nconsole.log(updated);',
          solution: 'const person = { name: "Alice", age: 30, hobbies: ["reading", "coding"] };\nconst { name, age, hobbies } = person;\nconst updated = { ...person, age: 31 };\nconsole.log(person);\nconsole.log(updated);',
          hints: ['Spread operator: { ...obj }', 'Override props after spread'],
          challenge: 'Create a deepMerge function that recursively merges two objects, handling nested objects and arrays.',
          reqs: ['Handle nested objects', 'Concatenate arrays', 'Don\'t mutate originals'],
          tests: [['deepMerge({a:1},{b:2})', '{a:1,b:2}', 5], ['deepMerge({a:{b:1}},{a:{c:2}})', '{a:{b:1,c:2}}', 5]]
        }),
        S(2, {
          title: 'Prototypes and Classes', content: 'JavaScript uses prototypal inheritance. Classes are syntactic sugar over prototypes.',
          lang: 'javascript', code: 'class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a sound`; }\n}\nclass Dog extends Animal {\n  speak() { return `${this.name} barks`; }\n}\nconst d = new Dog("Rex");\nconsole.log(d.speak());',
          concept: 'Every object has a prototype chain. When accessing a property, JS walks up the chain. Classes provide clean syntax for constructor functions and inheritance.',
          keyPoints: ['Prototype chain for property lookup', 'class is sugar over prototypes', 'extends for inheritance', 'super calls parent constructor'],
          realWorld: 'UI frameworks use class inheritance: Component → Button → SubmitButton, each adding behavior.',
          mistakes: ['Forgetting super() in constructor', 'Arrow methods lose prototype benefits', 'Overcomplicating inheritance hierarchies'],
          pInstructions: ['Create a Shape base class with area method', 'Create Circle and Rectangle subclasses', 'Override area in each'],
          starter: 'class Shape {\n  constructor(name) { this.name = name; }\n  area() { return 0; }\n}\n\nclass Circle extends Shape {\n  // constructor and area\n}\n\nclass Rectangle extends Shape {\n  // constructor and area\n}\n\nconsole.log(new Circle(5).area());\nconsole.log(new Rectangle(4, 6).area());',
          solution: 'class Shape {\n  constructor(name) { this.name = name; }\n  area() { return 0; }\n}\nclass Circle extends Shape {\n  constructor(r) { super("circle"); this.r = r; }\n  area() { return Math.PI * this.r ** 2; }\n}\nclass Rectangle extends Shape {\n  constructor(w, h) { super("rectangle"); this.w = w; this.h = h; }\n  area() { return this.w * this.h; }\n}\nconsole.log(new Circle(5).area());\nconsole.log(new Rectangle(4, 6).area());',
          hints: ['Call super() before using this', 'Circle area = π * r²'],
          challenge: 'Build a simple event emitter class with on(), emit(), and off() methods.',
          reqs: ['on(event, callback) registers listeners', 'emit(event, ...args) triggers all listeners', 'off(event, callback) removes a listener'],
          tests: [['emitter.emit("test")', 'listeners called', 5], ['emitter.off removes', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Promises and Async/Await', slug: 'js-promises-async-await',
      description: 'Master asynchronous JavaScript with Promises, async/await, and error handling.',
      language: 'javascript', difficulty: 'intermediate', duration: 50,
      tags: ['javascript', 'async', 'promises', 'await'],
      objectives: ['Create and chain Promises', 'Use async/await syntax', 'Handle async errors properly'],
      featured: true,
      steps: [
        S(1, {
          title: 'Understanding Promises', content: 'Promises represent eventual completion or failure of async operations.',
          lang: 'javascript', code: 'const fetchData = () => new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Data loaded!"), 1000);\n});\n\nfetchData()\n  .then(data => console.log(data))\n  .catch(err => console.error(err));',
          concept: 'A Promise is an object representing a future value. It can be pending, fulfilled, or rejected. .then() handles success, .catch() handles failure.',
          keyPoints: ['Three states: pending, fulfilled, rejected', '.then() chains transformations', '.catch() handles any error in the chain', 'Promise.all() for parallel execution'],
          realWorld: 'Fetching user data from an API returns a Promise. You chain .then() to parse JSON and .catch() to show an error message.',
          mistakes: ['Not returning in .then() chains', 'Forgetting .catch()', 'Creating unnecessary new Promises around existing ones'],
          pInstructions: ['Create a Promise that resolves after 1 second', 'Chain .then() to transform the result', 'Add .catch() for error handling'],
          starter: '// Create a delayed Promise\nfunction delay(ms) {\n  return new Promise((resolve) => {\n    // your code\n  });\n}\n\ndelay(1000)\n  .then(() => "Step 1 done")\n  .then(msg => {\n    console.log(msg);\n    // return next step\n  })\n  .catch(err => console.error(err));',
          solution: 'function delay(ms) {\n  return new Promise((resolve) => {\n    setTimeout(resolve, ms);\n  });\n}\n\ndelay(1000)\n  .then(() => "Step 1 done")\n  .then(msg => {\n    console.log(msg);\n    return "Step 2 done";\n  })\n  .then(msg => console.log(msg))\n  .catch(err => console.error(err));',
          hints: ['setTimeout calls resolve after ms', 'Return values in .then() pass to next .then()'],
          challenge: 'Implement a retry function that attempts a Promise-returning function up to N times before failing.',
          reqs: ['Accept a function and max retries', 'Return the first successful result', 'Reject with last error after all retries fail'],
          tests: [['retry succeeds on 2nd try', 'resolves', 5], ['retry fails after max', 'rejects', 5]]
        }),
        S(2, {
          title: 'Async/Await', content: 'async/await provides synchronous-looking syntax for asynchronous code.',
          lang: 'javascript', code: 'async function loadUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    const user = await response.json();\n    console.log(user.name);\n  } catch (err) {\n    console.error("Failed:", err.message);\n  }\n}\n// loadUser(1);',
          concept: 'async marks a function as returning a Promise. await pauses execution until the Promise settles. try/catch handles errors naturally.',
          keyPoints: ['async functions always return Promises', 'await only works inside async functions', 'try/catch for error handling', 'Promise.all with await for parallelism'],
          realWorld: 'Loading a dashboard: await user data, then await their orders and settings in parallel with Promise.all.',
          mistakes: ['Sequential awaits when parallel is possible', 'Missing try/catch', 'Forgetting await keyword'],
          pInstructions: ['Convert a .then() chain to async/await', 'Add try/catch error handling', 'Use Promise.all for parallel operations'],
          starter: 'function fetchData(id) {\n  return new Promise(resolve => setTimeout(() => resolve({ id, name: "Item " + id }), 100));\n}\n\n// Convert to async/await\nasync function loadItems() {\n  // Fetch items 1, 2, 3 in parallel\n  // Log all results\n}\n\nloadItems();',
          solution: 'function fetchData(id) {\n  return new Promise(resolve => setTimeout(() => resolve({ id, name: "Item " + id }), 100));\n}\n\nasync function loadItems() {\n  try {\n    const items = await Promise.all([fetchData(1), fetchData(2), fetchData(3)]);\n    items.forEach(item => console.log(item.name));\n  } catch (err) {\n    console.error("Failed:", err);\n  }\n}\n\nloadItems();',
          hints: ['Promise.all takes an array of promises', 'await the Promise.all result'],
          challenge: 'Build an async queue that processes tasks sequentially with concurrency limit.',
          reqs: ['Accept array of async functions', 'Process with max concurrency', 'Return all results in order'],
          tests: [['queue with limit 2', 'processes 2 at a time', 5], ['results in order', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript DOM Manipulation', slug: 'js-dom-manipulation',
      description: 'Learn to select, create, modify, and remove DOM elements with JavaScript.',
      language: 'javascript', difficulty: 'beginner', duration: 40,
      tags: ['javascript', 'dom', 'web', 'html'],
      category: 'Web Development',
      objectives: ['Select elements with querySelector', 'Create and append elements', 'Handle events'],
      steps: [
        S(1, {
          title: 'Selecting and Modifying Elements', content: 'Use querySelector and DOM properties to interact with the page.',
          lang: 'javascript', code: 'const heading = document.querySelector("h1");\nheading.textContent = "Updated!";\nheading.style.color = "blue";\nheading.classList.add("highlight");\nconsole.log("Element updated");',
          concept: 'querySelector uses CSS selectors to find elements. Once selected, you can modify text, styles, classes, and attributes.',
          keyPoints: ['querySelector returns first match', 'querySelectorAll returns NodeList', 'textContent vs innerHTML', 'classList.add/remove/toggle'],
          realWorld: 'A dark mode toggle uses classList.toggle to swap themes on the body element.',
          mistakes: ['Using innerHTML for text (XSS risk)', 'Querying before DOM loads', 'Confusing NodeList with Array'],
          pInstructions: ['Select an element by ID', 'Change its text content', 'Add a CSS class to it'],
          starter: '// Simulating DOM operations\nconst mockElement = { textContent: "", className: "", classList: { add(c) { this.classes = this.classes || []; this.classes.push(c); } } };\n\n// Update the element\nmockElement.textContent = // your text\nmockElement.classList.add(// your class)\n\nconsole.log(mockElement.textContent);\nconsole.log(mockElement.classList.classes);',
          solution: 'const mockElement = { textContent: "", className: "", classList: { add(c) { this.classes = this.classes || []; this.classes.push(c); } } };\nmockElement.textContent = "Hello World";\nmockElement.classList.add("highlight");\nconsole.log(mockElement.textContent);\nconsole.log(mockElement.classList.classes);',
          hints: ['textContent sets plain text', 'classList.add adds a class'],
          challenge: 'Build a function that creates a dynamic table from an array of objects, adding it to the DOM.',
          reqs: ['Accept array of objects', 'Generate table headers from keys', 'Create rows for each object'],
          tests: [['createTable([{a:1}])', 'table with 1 row', 5]]
        }),
        S(2, {
          title: 'Event Handling', content: 'Events let you respond to user interactions like clicks, inputs, and keyboard presses.',
          lang: 'javascript', code: 'const button = { listeners: {}, addEventListener(e, fn) { this.listeners[e] = fn; }, click() { this.listeners.click && this.listeners.click(); } };\nbutton.addEventListener("click", () => console.log("Clicked!"));\nbutton.click();',
          concept: 'addEventListener attaches event handlers. Events bubble up the DOM tree. Use event.preventDefault() to stop default behavior.',
          keyPoints: ['addEventListener for attaching handlers', 'Event object contains details', 'Event delegation for dynamic elements', 'removeEventListener to clean up'],
          realWorld: 'Form validation listens for submit events, prevents default, validates fields, then submits via fetch.',
          mistakes: ['Not removing listeners (memory leaks)', 'Adding listeners in loops without delegation', 'Forgetting event.preventDefault on forms'],
          pInstructions: ['Create a mock event system', 'Add click and keydown handlers', 'Trigger events programmatically'],
          starter: 'class EventTarget {\n  constructor() { this.listeners = {}; }\n  addEventListener(event, fn) {\n    // your code\n  }\n  dispatchEvent(event) {\n    // your code\n  }\n}\n\nconst target = new EventTarget();\ntarget.addEventListener("click", () => console.log("clicked"));\ntarget.dispatchEvent("click");',
          solution: 'class EventTarget {\n  constructor() { this.listeners = {}; }\n  addEventListener(event, fn) {\n    if (!this.listeners[event]) this.listeners[event] = [];\n    this.listeners[event].push(fn);\n  }\n  dispatchEvent(event) {\n    (this.listeners[event] || []).forEach(fn => fn());\n  }\n}\nconst target = new EventTarget();\ntarget.addEventListener("click", () => console.log("clicked"));\ntarget.dispatchEvent("click");',
          hints: ['Store listeners in an array per event', 'Loop through and call each listener'],
          challenge: 'Implement event delegation: a single handler on a parent that routes events to children based on selectors.',
          reqs: ['Single parent listener', 'Match child by attribute', 'Support multiple child handlers'],
          tests: [['delegate handles child click', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Error Handling', slug: 'js-error-handling',
      description: 'Learn try/catch, custom errors, and defensive programming techniques.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['javascript', 'errors', 'debugging', 'exceptions'],
      objectives: ['Use try/catch/finally', 'Create custom error classes', 'Implement defensive coding'],
      steps: [
        S(1, {
          title: 'Try/Catch and Error Types', content: 'Handle runtime errors gracefully with try/catch blocks.',
          lang: 'javascript', code: 'try {\n  const data = JSON.parse("invalid json");\n} catch (err) {\n  console.log(err.name);    // SyntaxError\n  console.log(err.message); // Unexpected token...\n} finally {\n  console.log("Always runs");\n}',
          concept: 'try/catch prevents crashes from runtime errors. finally always executes. JavaScript has built-in error types: TypeError, RangeError, SyntaxError, ReferenceError.',
          keyPoints: ['try/catch/finally structure', 'Built-in error types', 'finally always executes', 'Only catch what you can handle'],
          realWorld: 'An API client wraps fetch calls in try/catch to show user-friendly messages instead of crashing.',
          mistakes: ['Catching and silencing errors', 'Too broad catch blocks', 'Not logging errors for debugging'],
          pInstructions: ['Write a function that parses JSON safely', 'Return a default value on error', 'Log the error for debugging'],
          starter: 'function safeJsonParse(str, defaultValue) {\n  // your code\n}\n\nconsole.log(safeJsonParse(\'{"a":1}\', {}));\nconsole.log(safeJsonParse("bad", {}));',
          solution: 'function safeJsonParse(str, defaultValue) {\n  try {\n    return JSON.parse(str);\n  } catch (err) {\n    console.error("Parse error:", err.message);\n    return defaultValue;\n  }\n}\nconsole.log(safeJsonParse(\'{"a":1}\', {}));\nconsole.log(safeJsonParse("bad", {}));',
          hints: ['Wrap JSON.parse in try block', 'Return defaultValue in catch'],
          challenge: 'Create a custom ValidationError class and a validate function that throws it for invalid data.',
          reqs: ['Extend Error class', 'Include field name and rule', 'Catch and display nicely'],
          tests: [['new ValidationError("email","required")', 'has field and rule', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript String Methods', slug: 'js-string-methods',
      description: 'Master string manipulation with built-in methods and template literals.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['javascript', 'strings', 'methods', 'fundamentals'],
      objectives: ['Use common string methods', 'Work with template literals', 'Parse and format strings'],
      steps: [
        S(1, {
          title: 'Essential String Methods', content: 'Strings have many built-in methods for searching, slicing, and transforming.',
          lang: 'javascript', code: 'const str = "Hello, World!";\nconsole.log(str.toUpperCase());     // HELLO, WORLD!\nconsole.log(str.slice(0, 5));        // Hello\nconsole.log(str.includes("World")); // true\nconsole.log(str.split(", "));       // ["Hello", "World!"]\nconsole.log(str.replace("World", "JS")); // Hello, JS!',
          concept: 'Strings are immutable — methods return new strings. Common methods: slice, includes, split, replace, trim, padStart, startsWith, endsWith.',
          keyPoints: ['Strings are immutable', 'Methods return new strings', 'slice(start, end) extracts portions', 'split/join for string<->array conversion'],
          realWorld: 'Cleaning user input: trim whitespace, check if email includes @, split full name into first/last.',
          mistakes: ['Assuming methods mutate the string', 'Off-by-one in slice indices', 'Using replace for all occurrences (use replaceAll)'],
          pInstructions: ['Create a string and use 5 different methods on it', 'Chain methods together', 'Convert between string and array'],
          starter: 'const email = "  User@Example.COM  ";\n\n// Clean the email: trim, lowercase\nconst cleaned = \n\n// Check if valid (contains @)\nconst isValid = \n\n// Extract username and domain\nconst [username, domain] = \n\nconsole.log(cleaned, isValid, username, domain);',
          solution: 'const email = "  User@Example.COM  ";\nconst cleaned = email.trim().toLowerCase();\nconst isValid = cleaned.includes("@");\nconst [username, domain] = cleaned.split("@");\nconsole.log(cleaned, isValid, username, domain);',
          hints: ['trim() removes whitespace', 'split("@") gives [username, domain]'],
          challenge: 'Build a slugify function that converts titles to URL-friendly slugs.',
          reqs: ['Convert to lowercase', 'Replace spaces with hyphens', 'Remove special characters', 'Trim leading/trailing hyphens'],
          tests: [['slugify("Hello World!")', '"hello-world"', 5], ['slugify("  Multiple   Spaces  ")', '"multiple-spaces"', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript ES6+ Features', slug: 'js-es6-features',
      description: 'Explore modern JavaScript features: destructuring, spread, modules, and more.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['javascript', 'es6', 'modern', 'features'],
      objectives: ['Use destructuring and spread/rest', 'Understand modules', 'Apply modern syntax patterns'],
      steps: [
        S(1, {
          title: 'Destructuring and Spread', content: 'Destructuring extracts values; spread expands iterables.',
          lang: 'javascript', code: 'const [first, ...rest] = [1, 2, 3, 4];\nconsole.log(first, rest); // 1 [2,3,4]\n\nconst { name, ...details } = { name: "Alice", age: 30, city: "NYC" };\nconsole.log(name, details); // Alice {age:30,city:"NYC"}\n\nconst merged = { ...details, country: "US" };\nconsole.log(merged);',
          concept: 'Destructuring unpacks values from arrays/objects into variables. Rest (...) collects remaining elements. Spread (...) expands elements.',
          keyPoints: ['Array destructuring uses position', 'Object destructuring uses keys', 'Rest collects remaining items', 'Spread copies/merges'],
          realWorld: 'React components destructure props: function Button({ label, onClick, ...rest }).',
          mistakes: ['Confusing rest and spread syntax', 'Destructuring undefined without defaults', 'Shallow copy with spread'],
          pInstructions: ['Destructure an array with rest', 'Destructure an object with renaming', 'Merge objects with spread'],
          starter: 'const coords = [10, 20, 30, 40, 50];\n// Get first two, rest in array\nconst [x, y, ...remaining] = coords;\n\nconst config = { host: "localhost", port: 3000, debug: true };\n// Destructure with rename\nconst { host: hostname, ...options } = config;\n\nconsole.log(x, y, remaining);\nconsole.log(hostname, options);',
          solution: 'const coords = [10, 20, 30, 40, 50];\nconst [x, y, ...remaining] = coords;\n\nconst config = { host: "localhost", port: 3000, debug: true };\nconst { host: hostname, ...options } = config;\n\nconsole.log(x, y, remaining);\nconsole.log(hostname, options);',
          hints: ['Rename with { key: newName }', 'Rest must be last'],
          challenge: 'Write a function that deep-clones an object using only spread syntax and recursion.',
          reqs: ['Handle nested objects', 'Handle arrays', 'Don\'t use JSON.parse/stringify'],
          tests: [['deepClone({a:{b:1}})', '{a:{b:1}} and not same ref', 5]]
        }),
        S(2, {
          title: 'Optional Chaining and Nullish Coalescing', content: 'Safely access nested properties and provide fallback values.',
          lang: 'javascript', code: 'const user = { profile: { address: { city: "NYC" } } };\nconsole.log(user?.profile?.address?.city); // NYC\nconsole.log(user?.settings?.theme); // undefined\n\nconst theme = user?.settings?.theme ?? "light";\nconsole.log(theme); // light',
          concept: 'Optional chaining (?.) short-circuits to undefined if any part is null/undefined. Nullish coalescing (??) provides defaults only for null/undefined (not falsy values).',
          keyPoints: ['?. stops at null/undefined', '?? only catches null/undefined', '|| catches all falsy values', 'Use ?. for deep property access'],
          realWorld: 'Accessing API response data safely: response?.data?.users?.[0]?.name ?? "Unknown".',
          mistakes: ['Using || when ?? is needed (0 and "" are valid values)', 'Chaining too deeply (code smell)', 'Optional chaining on assignment target'],
          pInstructions: ['Access deeply nested properties safely', 'Provide default values with ??', 'Compare ?? vs || behavior'],
          starter: 'const data = { users: [{ name: "Alice", score: 0 }] };\n\n// Safe access\nconst name = \nconst email = \n\n// Default with ?? (preserves 0)\nconst score = \n\n// Compare with || (would override 0)\nconst scoreOr = \n\nconsole.log(name, email, score, scoreOr);',
          solution: 'const data = { users: [{ name: "Alice", score: 0 }] };\nconst name = data?.users?.[0]?.name;\nconst email = data?.users?.[0]?.email ?? "no email";\nconst score = data?.users?.[0]?.score ?? 100;\nconst scoreOr = data?.users?.[0]?.score || 100;\nconsole.log(name, email, score, scoreOr);',
          hints: ['?. works on arrays too: arr?.[0]', '?? only replaces null/undefined'],
          challenge: 'Build a safe get function like lodash\'s _.get() that takes an object, a dot-separated path, and a default value.',
          reqs: ['Support dot notation paths', 'Support array indices', 'Return default for missing paths'],
          tests: [['get({a:{b:1}}, "a.b")', '1', 5], ['get({}, "a.b.c", 42)', '42', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Closures and Higher-Order Functions', slug: 'js-closures-hof',
      description: 'Deep dive into closures, currying, composition, and functional patterns.',
      language: 'javascript', difficulty: 'intermediate', duration: 50,
      tags: ['javascript', 'closures', 'functional', 'higher-order'],
      objectives: ['Understand closure mechanics', 'Write higher-order functions', 'Apply functional patterns'],
      steps: [
        S(1, {
          title: 'Closures in Depth', content: 'Closures capture and preserve the lexical environment of their creation.',
          lang: 'javascript', code: 'function makeMultiplier(x) {\n  return (y) => x * y;\n}\nconst double = makeMultiplier(2);\nconst triple = makeMultiplier(3);\nconsole.log(double(5));  // 10\nconsole.log(triple(5));  // 15',
          concept: 'When a function is created, it captures references to all variables in its scope. This captured environment persists even after the outer function returns.',
          keyPoints: ['Closures capture by reference', 'Each call creates a new closure', 'Private state via closures', 'Module pattern uses closures'],
          realWorld: 'Middleware in Express uses closures: the outer function accepts config, the inner function handles requests.',
          mistakes: ['Loop variable capture with var', 'Memory leaks from large closures', 'Assuming value capture instead of reference capture'],
          pInstructions: ['Create a function factory using closures', 'Build a private counter', 'Create a logger with configurable prefix'],
          starter: '// Create a prefix logger\nfunction createLogger(prefix) {\n  // return a function that logs with the prefix\n}\n\nconst infoLog = createLogger("[INFO]");\nconst errorLog = createLogger("[ERROR]");\n\ninfoLog("Server started");\nerrorLog("Connection failed");',
          solution: 'function createLogger(prefix) {\n  return (message) => console.log(`${prefix} ${message}`);\n}\nconst infoLog = createLogger("[INFO]");\nconst errorLog = createLogger("[ERROR]");\ninfoLog("Server started");\nerrorLog("Connection failed");',
          hints: ['The returned function captures prefix', 'Template literals for string building'],
          challenge: 'Implement a once() function that ensures a callback is only called once, returning the cached result for subsequent calls.',
          reqs: ['First call executes and caches result', 'Subsequent calls return cached result', 'Arguments after first call are ignored'],
          tests: [['once(fn) called 3 times', 'fn runs once', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Array Iteration Patterns', slug: 'js-array-iteration',
      description: 'Master every array iteration method: forEach, map, filter, reduce, find, some, every.',
      language: 'javascript', difficulty: 'beginner', duration: 35,
      tags: ['javascript', 'arrays', 'iteration', 'loops'],
      objectives: ['Choose the right iteration method', 'Chain methods effectively', 'Understand performance implications'],
      steps: [
        S(1, {
          title: 'Choosing the Right Method', content: 'Each array method serves a specific purpose — choosing the right one makes code cleaner.',
          lang: 'javascript', code: 'const products = [\n  { name: "Phone", price: 999, inStock: true },\n  { name: "Laptop", price: 1999, inStock: false },\n  { name: "Tablet", price: 499, inStock: true }\n];\n\nconst available = products.filter(p => p.inStock);\nconst names = available.map(p => p.name);\nconst total = available.reduce((sum, p) => sum + p.price, 0);\nconst hasExpensive = products.some(p => p.price > 1500);\n\nconsole.log(names, total, hasExpensive);',
          concept: 'forEach: side effects only. map: transform each element. filter: select elements. reduce: accumulate. find: first match. some/every: boolean checks.',
          keyPoints: ['forEach returns undefined', 'map returns new array of same length', 'find returns first match or undefined', 'some/every return booleans'],
          realWorld: 'Shopping cart: filter available items, map to display format, reduce for total, some to check if any item needs shipping.',
          mistakes: ['Using forEach when map is appropriate', 'Chaining too many operations (readability)', 'Using find when filter is needed'],
          pInstructions: ['Given an array of students, find all passing students', 'Calculate the class average', 'Check if any student has perfect score'],
          starter: 'const students = [\n  { name: "Alice", score: 92 },\n  { name: "Bob", score: 78 },\n  { name: "Charlie", score: 100 },\n  { name: "Diana", score: 65 }\n];\n\nconst passing = // filter score >= 70\nconst average = // reduce to get average\nconst hasPerfect = // some with score === 100\n\nconsole.log(passing.map(s => s.name));\nconsole.log(average);\nconsole.log(hasPerfect);',
          solution: 'const students = [\n  { name: "Alice", score: 92 },\n  { name: "Bob", score: 78 },\n  { name: "Charlie", score: 100 },\n  { name: "Diana", score: 65 }\n];\nconst passing = students.filter(s => s.score >= 70);\nconst average = students.reduce((sum, s) => sum + s.score, 0) / students.length;\nconst hasPerfect = students.some(s => s.score === 100);\nconsole.log(passing.map(s => s.name));\nconsole.log(average);\nconsole.log(hasPerfect);',
          hints: ['filter keeps elements where callback returns true', 'reduce sum divided by length = average'],
          challenge: 'Implement a pipe function that chains array transformations: pipe(data, filter(...), map(...), reduce(...)).',
          reqs: ['Accept data and array of transform functions', 'Apply each transform in order', 'Return final result'],
          tests: [['pipe([1,2,3], filter(n=>n>1), map(n=>n*2))', '[4,6]', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Regular Expressions', slug: 'js-regex',
      description: 'Learn regex patterns for validation, searching, and text transformation.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['javascript', 'regex', 'patterns', 'validation'],
      objectives: ['Write regex patterns', 'Use test, match, replace with regex', 'Validate common formats'],
      steps: [
        S(1, {
          title: 'Regex Fundamentals', content: 'Regular expressions define search patterns for strings.',
          lang: 'javascript', code: 'const emailRegex = /^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$/;\nconsole.log(emailRegex.test("user@example.com")); // true\nconsole.log(emailRegex.test("invalid@"));          // false\n\nconst text = "Call 555-1234 or 555-5678";\nconst phones = text.match(/\\d{3}-\\d{4}/g);\nconsole.log(phones); // ["555-1234", "555-5678"]',
          concept: 'Regex uses special characters to define patterns. test() returns boolean, match() returns matches, replace() substitutes matches.',
          keyPoints: ['\\d for digits, \\w for word chars, \\s for spaces', '+ one or more, * zero or more, ? optional', '^ start, $ end anchors', 'g global, i case-insensitive flags'],
          realWorld: 'Form validation uses regex for emails, phone numbers, passwords, and postal codes.',
          mistakes: ['Not escaping special characters', 'Greedy vs lazy quantifiers', 'Forgetting g flag for multiple matches'],
          pInstructions: ['Write a regex for phone numbers', 'Write a regex for email validation', 'Use replace with regex to format text'],
          starter: '// Phone regex: (XXX) XXX-XXXX or XXX-XXX-XXXX\nconst phoneRegex = /your regex/;\n\nconsole.log(phoneRegex.test("(555) 123-4567"));\nconsole.log(phoneRegex.test("555-123-4567"));\nconsole.log(phoneRegex.test("12345"));',
          solution: 'const phoneRegex = /^\\(?\\d{3}\\)?[\\s-]?\\d{3}-?\\d{4}$/;\nconsole.log(phoneRegex.test("(555) 123-4567"));\nconsole.log(phoneRegex.test("555-123-4567"));\nconsole.log(phoneRegex.test("12345"));',
          hints: ['\\(? makes parenthesis optional', '\\d{3} matches exactly 3 digits'],
          challenge: 'Build a template engine that replaces {{variable}} placeholders with values from an object.',
          reqs: ['Match {{key}} patterns', 'Replace with corresponding values', 'Handle missing keys gracefully'],
          tests: [['template("Hi {{name}}", {name:"Bob"})', '"Hi Bob"', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Map, Set, and WeakRef', slug: 'js-map-set',
      description: 'Learn Map, Set, WeakMap, and WeakSet for specialized data storage.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['javascript', 'map', 'set', 'data-structures'],
      category: 'Data Structures',
      objectives: ['Use Map for key-value pairs', 'Use Set for unique values', 'Understand weak references'],
      steps: [
        S(1, {
          title: 'Map and Set Basics', content: 'Map stores key-value pairs with any key type. Set stores unique values.',
          lang: 'javascript', code: 'const userRoles = new Map();\nuserRoles.set("alice", "admin");\nuserRoles.set("bob", "user");\nconsole.log(userRoles.get("alice")); // admin\nconsole.log(userRoles.size);          // 2\n\nconst unique = new Set([1, 2, 2, 3, 3, 3]);\nconsole.log([...unique]); // [1, 2, 3]',
          concept: 'Map is like an object but allows any key type and maintains insertion order. Set automatically removes duplicates.',
          keyPoints: ['Map keys can be any type', 'Map preserves insertion order', 'Set values are unique', 'Both are iterable'],
          realWorld: 'A cache uses Map with object keys for memoization. A tag system uses Set to prevent duplicate tags.',
          mistakes: ['Using objects as Map keys without understanding reference equality', 'Confusing Map.set() with object assignment', 'Forgetting Set uses reference equality for objects'],
          pInstructions: ['Create a Map for user settings', 'Create a Set for unique tags', 'Convert between Map/Set and arrays'],
          starter: '// User settings Map\nconst settings = new Map();\n// Add settings\n\n// Unique tags Set\nconst tags = new Set();\n// Add tags (some duplicates)\n\nconsole.log(settings.size);\nconsole.log([...tags]);',
          solution: 'const settings = new Map();\nsettings.set("theme", "dark");\nsettings.set("language", "en");\nsettings.set("notifications", true);\n\nconst tags = new Set();\ntags.add("javascript");\ntags.add("tutorial");\ntags.add("javascript");\ntags.add("beginner");\n\nconsole.log(settings.size);\nconsole.log([...tags]);',
          hints: ['Map uses set(key, value)', 'Set uses add(value)'],
          challenge: 'Implement a LRU (Least Recently Used) cache using Map.',
          reqs: ['Fixed capacity', 'get() moves item to most recent', 'set() evicts oldest when full'],
          tests: [['cache.set(1,"a"); cache.get(1)', '"a"', 5], ['evicts oldest', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Modules and Imports', slug: 'js-modules-imports',
      description: 'Understand ES modules, CommonJS, dynamic imports, and module patterns.',
      language: 'javascript', difficulty: 'intermediate', duration: 35,
      tags: ['javascript', 'modules', 'imports', 'es6'],
      objectives: ['Use import/export syntax', 'Understand module systems', 'Apply module patterns'],
      steps: [
        S(1, {
          title: 'ES Modules', content: 'ES modules use import/export for sharing code between files.',
          lang: 'javascript', code: '// math.js (module)\n// export const add = (a, b) => a + b;\n// export const multiply = (a, b) => a * b;\n// export default class Calculator { ... }\n\n// main.js\n// import Calculator, { add, multiply } from "./math.js";\n\n// Simulated:\nconst add = (a, b) => a + b;\nconst multiply = (a, b) => a * b;\nconsole.log(add(2, 3));\nconsole.log(multiply(4, 5));',
          concept: 'Named exports allow multiple exports per file. Default exports allow one main export. Import destructures named exports.',
          keyPoints: ['Named exports: export const x', 'Default export: export default', 'Import named: { x } from', 'Import default: x from'],
          realWorld: 'React apps split components into modules: each component file exports the component and imports dependencies.',
          mistakes: ['Mixing default and named confusingly', 'Circular dependencies', 'Forgetting file extensions in some environments'],
          pInstructions: ['Create a simulated module with named exports', 'Add a default export', 'Import and use the exports'],
          starter: '// Simulated module pattern\nconst MathModule = (() => {\n  // Define add, subtract, multiply, divide\n  // Return public API\n  return {\n    // your exports\n  };\n})();\n\nconsole.log(MathModule.add(10, 5));\nconsole.log(MathModule.subtract(10, 5));',
          solution: 'const MathModule = (() => {\n  const add = (a, b) => a + b;\n  const subtract = (a, b) => a - b;\n  const multiply = (a, b) => a * b;\n  const divide = (a, b) => b !== 0 ? a / b : "Error";\n  return { add, subtract, multiply, divide };\n})();\nconsole.log(MathModule.add(10, 5));\nconsole.log(MathModule.subtract(10, 5));',
          hints: ['IIFE creates a module scope', 'Return an object with public methods'],
          challenge: 'Build a plugin system where modules can register and be loaded dynamically.',
          reqs: ['Register plugins by name', 'Load and initialize plugins', 'Handle missing plugins gracefully'],
          tests: [['register("log", logPlugin)', 'registered', 5], ['load("log")', 'initialized', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript JSON and Data Processing', slug: 'js-json-processing',
      description: 'Parse, transform, and serialize JSON data for APIs and storage.',
      language: 'javascript', difficulty: 'beginner', duration: 30,
      tags: ['javascript', 'json', 'data', 'api'],
      objectives: ['Parse and stringify JSON', 'Transform nested data', 'Handle API responses'],
      steps: [
        S(1, {
          title: 'Working with JSON', content: 'JSON is the standard format for data exchange in web applications.',
          lang: 'javascript', code: 'const jsonStr = \'{"name":"Alice","scores":[90,85,92]}\';\nconst data = JSON.parse(jsonStr);\nconsole.log(data.name);  // Alice\nconsole.log(data.scores); // [90, 85, 92]\n\nconst output = JSON.stringify(data, null, 2);\nconsole.log(output);',
          concept: 'JSON.parse converts strings to objects. JSON.stringify converts objects to strings. The replacer and space parameters control serialization.',
          keyPoints: ['JSON.parse for string→object', 'JSON.stringify for object→string', 'Handles nested structures', 'Cannot store functions, undefined, or symbols'],
          realWorld: 'Every fetch() call to an API returns JSON that needs parsing; every POST request stringifies data.',
          mistakes: ['Not wrapping parse in try/catch', 'Assuming all JSON is valid', 'Circular references break stringify'],
          pInstructions: ['Parse a JSON string', 'Modify the data', 'Stringify with formatting'],
          starter: 'const apiResponse = \'[{"id":1,"name":"Widget","price":9.99},{"id":2,"name":"Gadget","price":24.99}]\';\n\n// Parse the response\nconst products = \n\n// Add a discount field to each\nconst withDiscount = \n\n// Stringify with pretty printing\nconst output = \n\nconsole.log(output);',
          solution: 'const apiResponse = \'[{"id":1,"name":"Widget","price":9.99},{"id":2,"name":"Gadget","price":24.99}]\';\nconst products = JSON.parse(apiResponse);\nconst withDiscount = products.map(p => ({ ...p, discount: +(p.price * 0.9).toFixed(2) }));\nconst output = JSON.stringify(withDiscount, null, 2);\nconsole.log(output);',
          hints: ['JSON.parse converts string to JS', 'JSON.stringify(data, null, 2) for pretty print'],
          challenge: 'Build a diff function that compares two JSON objects and returns the differences.',
          reqs: ['Detect added, removed, and changed fields', 'Handle nested objects', 'Return a structured diff report'],
          tests: [['diff({a:1},{a:2})', '{a:{old:1,new:2}}', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Event Loop and Concurrency', slug: 'js-event-loop',
      description: 'Understand the event loop, microtasks, macrotasks, and execution order.',
      language: 'javascript', difficulty: 'advanced', duration: 50,
      tags: ['javascript', 'event-loop', 'async', 'concurrency'],
      objectives: ['Understand the event loop model', 'Predict execution order', 'Use queueMicrotask'],
      steps: [
        S(1, {
          title: 'Event Loop Mechanics', content: 'JavaScript is single-threaded but handles async operations via the event loop.',
          lang: 'javascript', code: 'console.log("1 - sync");\nsetTimeout(() => console.log("2 - macrotask"), 0);\nPromise.resolve().then(() => console.log("3 - microtask"));\nconsole.log("4 - sync");\n// Output: 1, 4, 3, 2',
          concept: 'The event loop processes: 1) Call stack (sync code), 2) Microtask queue (Promises, queueMicrotask), 3) Macrotask queue (setTimeout, setInterval). Microtasks always run before macrotasks.',
          keyPoints: ['Call stack executes sync code first', 'Microtasks run before macrotasks', 'Promises use the microtask queue', 'setTimeout uses the macrotask queue'],
          realWorld: 'Understanding execution order is crucial when combining fetch (microtask) with setTimeout (macrotask) in UI updates.',
          mistakes: ['Assuming setTimeout(fn, 0) runs immediately', 'Starving macrotasks with endless microtasks', 'Blocking the event loop with heavy sync code'],
          pInstructions: ['Predict the output order of mixed async code', 'Write code that demonstrates microtask priority', 'Create an example showing event loop phases'],
          starter: '// Predict the output order:\nconsole.log("A");\n\nsetTimeout(() => {\n  console.log("B");\n  Promise.resolve().then(() => console.log("C"));\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("D");\n  setTimeout(() => console.log("E"), 0);\n});\n\nconsole.log("F");\n// Write your predicted order below:',
          solution: 'console.log("A");\nsetTimeout(() => {\n  console.log("B");\n  Promise.resolve().then(() => console.log("C"));\n}, 0);\nPromise.resolve().then(() => {\n  console.log("D");\n  setTimeout(() => console.log("E"), 0);\n});\nconsole.log("F");\n// Order: A, F, D, B, C, E',
          hints: ['Sync runs first: A, F', 'Then microtasks: D', 'Then macrotasks: B, then its microtask C, then E'],
          challenge: 'Implement a task scheduler that balances microtasks and macrotasks to prevent UI freezing.',
          reqs: ['Schedule work in chunks', 'Yield to the event loop between chunks', 'Support priority levels'],
          tests: [['scheduler processes chunks', 'true', 5], ['high priority runs first', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Design Patterns', slug: 'js-design-patterns',
      description: 'Learn essential design patterns: Singleton, Observer, Factory, and Strategy.',
      language: 'javascript', difficulty: 'advanced', duration: 55,
      tags: ['javascript', 'patterns', 'architecture', 'design'],
      objectives: ['Implement common design patterns', 'Know when to apply each pattern', 'Recognize patterns in frameworks'],
      steps: [
        S(1, {
          title: 'Singleton and Observer', content: 'Singleton ensures one instance; Observer enables pub/sub communication.',
          lang: 'javascript', code: 'class EventBus {\n  static instance = null;\n  static getInstance() {\n    if (!this.instance) this.instance = new EventBus();\n    return this.instance;\n  }\n  constructor() { this.listeners = {}; }\n  on(event, fn) { (this.listeners[event] ||= []).push(fn); }\n  emit(event, data) { (this.listeners[event] || []).forEach(fn => fn(data)); }\n}\nconst bus = EventBus.getInstance();\nbus.on("msg", d => console.log("Got:", d));\nbus.emit("msg", "hello");',
          concept: 'Singleton restricts instantiation to one object — useful for shared resources. Observer (pub/sub) decouples event producers from consumers.',
          keyPoints: ['Singleton via static getInstance()', 'Observer decouples components', 'EventEmitter is Observer pattern', 'Can combine patterns'],
          realWorld: 'Redux store is a singleton. React\'s useState updaters follow Observer pattern. Express middleware is Chain of Responsibility.',
          mistakes: ['Overusing Singleton (hidden global state)', 'Memory leaks from unremoved listeners', 'Too many events making code hard to follow'],
          pInstructions: ['Implement a Singleton logger', 'Add Observer pattern to it', 'Subscribe and emit log events'],
          starter: 'class Logger {\n  // Make it a singleton\n  // Add on() and emit() for Observer pattern\n  // Add log(), warn(), error() methods\n}\n\nconst logger = Logger.getInstance();\nlogger.on("log", (msg) => console.log("[LOG]", msg));\nlogger.log("App started");',
          solution: 'class Logger {\n  static instance = null;\n  static getInstance() { if (!this.instance) this.instance = new Logger(); return this.instance; }\n  constructor() { this.listeners = {}; }\n  on(event, fn) { (this.listeners[event] ||= []).push(fn); }\n  emit(event, data) { (this.listeners[event] || []).forEach(fn => fn(data)); }\n  log(msg) { this.emit("log", msg); }\n  warn(msg) { this.emit("warn", msg); }\n  error(msg) { this.emit("error", msg); }\n}\nconst logger = Logger.getInstance();\nlogger.on("log", (msg) => console.log("[LOG]", msg));\nlogger.log("App started");',
          hints: ['Static instance stores the singleton', 'emit calls all registered listeners'],
          challenge: 'Implement the Strategy pattern: a Sorter class that accepts different sorting strategies (bubble, merge, quick).',
          reqs: ['Sorter accepts a strategy function', 'Strategies are interchangeable', 'Add at least 2 sorting strategies'],
          tests: [['sorter.setStrategy(bubbleSort)', 'sorts correctly', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Generators and Iterators', slug: 'js-generators-iterators',
      description: 'Learn generator functions, custom iterators, and lazy evaluation.',
      language: 'javascript', difficulty: 'advanced', duration: 45,
      tags: ['javascript', 'generators', 'iterators', 'lazy'],
      objectives: ['Create generator functions', 'Build custom iterators', 'Use lazy evaluation'],
      steps: [
        S(1, {
          title: 'Generator Basics', content: 'Generators produce values on demand using yield.',
          lang: 'javascript', code: 'function* range(start, end) {\n  for (let i = start; i < end; i++) yield i;\n}\n\nfor (const n of range(1, 6)) {\n  console.log(n); // 1, 2, 3, 4, 5\n}\n\nconst gen = range(1, 4);\nconsole.log(gen.next()); // {value:1,done:false}\nconsole.log(gen.next()); // {value:2,done:false}',
          concept: 'Generator functions (function*) produce iterators that yield values lazily. They pause at each yield and resume when next() is called.',
          keyPoints: ['function* declares a generator', 'yield pauses and produces a value', '.next() resumes execution', 'Generators are iterable (for...of)'],
          realWorld: 'Paginated API calls: a generator yields pages of data on demand, fetching the next page only when needed.',
          mistakes: ['Forgetting the * in function*', 'Not handling the done state', 'Infinite generators without break condition'],
          pInstructions: ['Create a fibonacci generator', 'Use for...of to consume values', 'Take only the first N values'],
          starter: 'function* fibonacci() {\n  // yield fibonacci numbers\n}\n\n// Take first 10 fibonacci numbers\nconst fibs = [];\nfor (const n of fibonacci()) {\n  fibs.push(n);\n  if (fibs.length >= 10) break;\n}\nconsole.log(fibs);',
          solution: 'function* fibonacci() {\n  let a = 0, b = 1;\n  while (true) {\n    yield a;\n    [a, b] = [b, a + b];\n  }\n}\nconst fibs = [];\nfor (const n of fibonacci()) {\n  fibs.push(n);\n  if (fibs.length >= 10) break;\n}\nconsole.log(fibs);',
          hints: ['Use while(true) for infinite generator', 'Destructuring swap: [a,b] = [b, a+b]'],
          challenge: 'Build a lazy evaluation library with map, filter, take that work with generators.',
          reqs: ['Lazy map transforms on demand', 'Lazy filter skips non-matching', 'take(n) limits output'],
          tests: [['take(3, map(x=>x*2, range(1,100)))', '[2,4,6]', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Proxy and Reflect', slug: 'js-proxy-reflect',
      description: 'Intercept object operations with Proxy and implement meta-programming.',
      language: 'javascript', difficulty: 'advanced', duration: 45,
      tags: ['javascript', 'proxy', 'reflect', 'metaprogramming'],
      objectives: ['Create Proxy handlers', 'Use Reflect API', 'Build reactive systems'],
      steps: [
        S(1, {
          title: 'Proxy Traps', content: 'Proxy wraps an object and intercepts operations like get, set, and delete.',
          lang: 'javascript', code: 'const handler = {\n  get(target, prop) {\n    console.log(`Reading ${prop}`);\n    return prop in target ? target[prop] : `No ${prop}`;\n  },\n  set(target, prop, value) {\n    console.log(`Setting ${prop} = ${value}`);\n    target[prop] = value;\n    return true;\n  }\n};\nconst data = new Proxy({}, handler);\ndata.name = "Alice";\nconsole.log(data.name);\nconsole.log(data.missing);',
          concept: 'Proxy intercepts fundamental operations (get, set, delete, etc.) via handler traps. This enables validation, logging, and reactive programming.',
          keyPoints: ['get trap for property access', 'set trap for assignment', 'has trap for "in" operator', 'Reflect provides default behavior'],
          realWorld: 'Vue.js 3 uses Proxy for reactivity — when data changes, the UI updates automatically.',
          mistakes: ['Infinite loops from accessing proxy in handler', 'Not returning true from set trap', 'Performance overhead on hot paths'],
          pInstructions: ['Create a validating proxy that type-checks assignments', 'Add a logging proxy that tracks all operations', 'Combine both behaviors'],
          starter: 'function createValidated(schema) {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      // Validate against schema\n      // your code\n    }\n  });\n}\n\nconst user = createValidated({\n  name: "string",\n  age: "number"\n});\nuser.name = "Alice";\nuser.age = 30;\nconsole.log(user.name, user.age);\ntry { user.age = "thirty"; } catch(e) { console.log(e.message); }',
          solution: 'function createValidated(schema) {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      if (schema[prop] && typeof value !== schema[prop]) {\n        throw new TypeError(`${prop} must be ${schema[prop]}`);\n      }\n      target[prop] = value;\n      return true;\n    }\n  });\n}\nconst user = createValidated({ name: "string", age: "number" });\nuser.name = "Alice";\nuser.age = 30;\nconsole.log(user.name, user.age);\ntry { user.age = "thirty"; } catch(e) { console.log(e.message); }',
          hints: ['typeof checks the type', 'Throw TypeError for invalid values'],
          challenge: 'Build a simple reactive system where changing a proxy\'s properties triggers registered watchers.',
          reqs: ['watch(proxy, prop, callback)', 'Callback fires on change', 'Support multiple watchers per property'],
          tests: [['setting value triggers watcher', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Web APIs', slug: 'js-web-apis',
      description: 'Work with Fetch API, LocalStorage, Web Workers, and other browser APIs.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['javascript', 'web-api', 'fetch', 'browser'],
      category: 'Web Development',
      objectives: ['Use Fetch for HTTP requests', 'Store data with LocalStorage', 'Understand Web Workers'],
      steps: [
        S(1, {
          title: 'Fetch API', content: 'Fetch provides a modern interface for making HTTP requests.',
          lang: 'javascript', code: '// Simulated fetch\nasync function fetchUser() {\n  // In browser: const res = await fetch("/api/user");\n  // Simulation:\n  const mockResponse = { id: 1, name: "Alice", email: "alice@example.com" };\n  console.log("User:", mockResponse.name);\n  return mockResponse;\n}\nfetchUser();',
          concept: 'fetch() returns a Promise that resolves to a Response object. Use .json() to parse the body. Always check response.ok for error handling.',
          keyPoints: ['fetch returns a Promise', 'response.json() parses body', 'Check response.ok for errors', 'AbortController for cancellation'],
          realWorld: 'A React app fetches user data on mount, displays a loading spinner, then renders the profile or shows an error.',
          mistakes: ['Not checking response.ok', 'Not handling network errors', 'Missing Content-Type header on POST'],
          pInstructions: ['Create a mock fetch function', 'Handle success and error cases', 'Add request configuration (method, headers, body)'],
          starter: '// Mock fetch function\nfunction mockFetch(url, options = {}) {\n  return new Promise((resolve, reject) => {\n    // Simulate network delay\n    setTimeout(() => {\n      if (url.includes("error")) reject(new Error("Network error"));\n      else resolve({ ok: true, json: () => Promise.resolve({ data: "success" }) });\n    }, 100);\n  });\n}\n\nasync function getData() {\n  // Use mockFetch, handle errors\n}\ngetData();',
          solution: 'function mockFetch(url, options = {}) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (url.includes("error")) reject(new Error("Network error"));\n      else resolve({ ok: true, json: () => Promise.resolve({ data: "success", method: options.method || "GET" }) });\n    }, 100);\n  });\n}\nasync function getData() {\n  try {\n    const res = await mockFetch("/api/data");\n    if (!res.ok) throw new Error("Request failed");\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error("Error:", err.message);\n  }\n}\ngetData();',
          hints: ['await the fetch call', 'await the .json() call too'],
          challenge: 'Build a request wrapper with retry logic, timeout, and caching.',
          reqs: ['Retry on failure up to 3 times', 'Timeout after 5 seconds', 'Cache GET responses'],
          tests: [['wrapper retries on fail', 'succeeds after retry', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Testing Fundamentals', slug: 'js-testing-fundamentals',
      description: 'Learn unit testing concepts, assertions, and test-driven development.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['javascript', 'testing', 'tdd', 'unit-tests'],
      objectives: ['Write unit tests', 'Understand test structure', 'Practice TDD workflow'],
      steps: [
        S(1, {
          title: 'Writing Test Assertions', content: 'Tests verify that code produces expected outputs for given inputs.',
          lang: 'javascript', code: '// Simple test framework\nfunction assert(condition, message) {\n  if (!condition) throw new Error(`FAIL: ${message}`);\n  console.log(`PASS: ${message}`);\n}\n\nfunction add(a, b) { return a + b; }\n\nassert(add(2, 3) === 5, "2 + 3 = 5");\nassert(add(-1, 1) === 0, "-1 + 1 = 0");\nassert(add(0, 0) === 0, "0 + 0 = 0");',
          concept: 'Assertions check conditions and report pass/fail. Good tests are independent, focused, and test both happy paths and edge cases.',
          keyPoints: ['Arrange-Act-Assert pattern', 'Test happy paths and edge cases', 'One assertion concept per test', 'Tests should be independent'],
          realWorld: 'CI/CD pipelines run tests on every commit. A failing test blocks deployment, catching bugs before production.',
          mistakes: ['Testing implementation instead of behavior', 'Not testing edge cases', 'Tests depending on each other'],
          pInstructions: ['Create a simple assert function', 'Write tests for a calculator', 'Test edge cases like division by zero'],
          starter: 'function assert(condition, msg) {\n  if (!condition) throw new Error("FAIL: " + msg);\n  console.log("PASS: " + msg);\n}\n\nfunction divide(a, b) {\n  if (b === 0) throw new Error("Division by zero");\n  return a / b;\n}\n\n// Write tests:\nassert(divide(10, 2) === 5, "10 / 2 = 5");\n// Add more tests...',
          solution: 'function assert(condition, msg) {\n  if (!condition) throw new Error("FAIL: " + msg);\n  console.log("PASS: " + msg);\n}\nfunction divide(a, b) {\n  if (b === 0) throw new Error("Division by zero");\n  return a / b;\n}\nassert(divide(10, 2) === 5, "10 / 2 = 5");\nassert(divide(-6, 3) === -2, "-6 / 3 = -2");\nassert(divide(0, 5) === 0, "0 / 5 = 0");\ntry { divide(1, 0); assert(false, "should throw"); } catch(e) { assert(e.message === "Division by zero", "throws on /0"); }',
          hints: ['Wrap expected throws in try/catch', 'Test with negative and zero values'],
          challenge: 'Build a mini test runner with describe(), it(), and expect().toBe() syntax.',
          reqs: ['describe groups tests', 'it defines a test case', 'expect().toBe() for assertions'],
          tests: [['describe/it structure works', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Linked Lists', slug: 'js-linked-lists',
      description: 'Implement singly and doubly linked lists with common operations.',
      language: 'javascript', difficulty: 'intermediate', duration: 45,
      tags: ['javascript', 'linked-list', 'data-structures', 'algorithms'],
      category: 'Data Structures',
      objectives: ['Build a linked list from scratch', 'Implement insert, delete, search', 'Understand time complexity trade-offs'],
      steps: [
        S(1, {
          title: 'Singly Linked List', content: 'A linked list stores elements as nodes with data and a next pointer.',
          lang: 'javascript', code: 'class Node {\n  constructor(data) { this.data = data; this.next = null; }\n}\nclass LinkedList {\n  constructor() { this.head = null; this.size = 0; }\n  append(data) {\n    const node = new Node(data);\n    if (!this.head) { this.head = node; }\n    else {\n      let curr = this.head;\n      while (curr.next) curr = curr.next;\n      curr.next = node;\n    }\n    this.size++;\n  }\n  print() {\n    let curr = this.head;\n    const vals = [];\n    while (curr) { vals.push(curr.data); curr = curr.next; }\n    console.log(vals.join(" -> "));\n  }\n}\nconst list = new LinkedList();\nlist.append(1); list.append(2); list.append(3);\nlist.print();',
          concept: 'Linked lists allocate memory dynamically. Each node points to the next. Unlike arrays, insertion/deletion at the head is O(1), but access by index is O(n).',
          keyPoints: ['O(1) insertion at head', 'O(n) access by index', 'No wasted memory', 'Nodes stored non-contiguously'],
          realWorld: 'Browser history uses a linked list — each page points to the previous page for back navigation.',
          mistakes: ['Forgetting to update size', 'Losing reference to head', 'Not handling empty list cases'],
          pInstructions: ['Create a Node class', 'Build a LinkedList with append and prepend', 'Add a delete method'],
          starter: 'class Node {\n  constructor(data) { this.data = data; this.next = null; }\n}\nclass LinkedList {\n  constructor() { this.head = null; this.size = 0; }\n  append(data) { /* add to end */ }\n  prepend(data) { /* add to beginning */ }\n  delete(data) { /* remove first occurrence */ }\n  print() {\n    let c = this.head, v = [];\n    while(c) { v.push(c.data); c = c.next; }\n    console.log(v.join(" -> ") || "empty");\n  }\n}\nconst list = new LinkedList();\nlist.append(1); list.append(2); list.prepend(0);\nlist.print();\nlist.delete(2);\nlist.print();',
          solution: 'class Node {\n  constructor(data) { this.data = data; this.next = null; }\n}\nclass LinkedList {\n  constructor() { this.head = null; this.size = 0; }\n  append(data) {\n    const n = new Node(data);\n    if (!this.head) this.head = n;\n    else { let c = this.head; while(c.next) c = c.next; c.next = n; }\n    this.size++;\n  }\n  prepend(data) {\n    const n = new Node(data);\n    n.next = this.head;\n    this.head = n;\n    this.size++;\n  }\n  delete(data) {\n    if (!this.head) return;\n    if (this.head.data === data) { this.head = this.head.next; this.size--; return; }\n    let c = this.head;\n    while (c.next && c.next.data !== data) c = c.next;\n    if (c.next) { c.next = c.next.next; this.size--; }\n  }\n  print() {\n    let c = this.head, v = [];\n    while(c) { v.push(c.data); c = c.next; }\n    console.log(v.join(" -> ") || "empty");\n  }\n}\nconst list = new LinkedList();\nlist.append(1); list.append(2); list.prepend(0);\nlist.print();\nlist.delete(2);\nlist.print();',
          hints: ['Prepend: new node.next = head, then head = new node', 'Delete: find node before target, skip over it'],
          challenge: 'Implement a method to reverse a linked list in-place and detect cycles.',
          reqs: ['reverse() modifies the list in-place', 'hasCycle() returns true if list has a cycle', 'O(1) extra space for both'],
          tests: [['reverse [1,2,3]', '3->2->1', 5], ['detect cycle', 'true', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Stack and Queue', slug: 'js-stack-queue',
      description: 'Implement stack (LIFO) and queue (FIFO) data structures.',
      language: 'javascript', difficulty: 'beginner', duration: 35,
      tags: ['javascript', 'stack', 'queue', 'data-structures'],
      category: 'Data Structures',
      objectives: ['Build stack with push/pop', 'Build queue with enqueue/dequeue', 'Solve problems using both'],
      steps: [
        S(1, {
          title: 'Stack Implementation', content: 'A stack follows Last-In-First-Out (LIFO) ordering.',
          lang: 'javascript', code: 'class Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n  size() { return this.items.length; }\n}\nconst stack = new Stack();\nstack.push(1); stack.push(2); stack.push(3);\nconsole.log(stack.pop());  // 3\nconsole.log(stack.peek()); // 2',
          concept: 'Stack operations: push adds to top, pop removes from top, peek views top without removing. All operations are O(1).',
          keyPoints: ['LIFO: Last In, First Out', 'push, pop, peek are O(1)', 'Used for undo, call stack, parsing', 'Can be built with array or linked list'],
          realWorld: 'Browser back button uses a stack — each page visited is pushed, back button pops the most recent.',
          mistakes: ['Popping from empty stack', 'Using shift instead of pop (that\'s a queue)', 'Not checking isEmpty before pop'],
          pInstructions: ['Build a Stack class', 'Use it to reverse a string', 'Use it to check balanced parentheses'],
          starter: 'class Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  isEmpty() { return this.items.length === 0; }\n}\n\n// Reverse a string using stack\nfunction reverseString(str) {\n  const stack = new Stack();\n  // your code\n}\n\nconsole.log(reverseString("hello")); // olleh',
          solution: 'class Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  isEmpty() { return this.items.length === 0; }\n}\nfunction reverseString(str) {\n  const stack = new Stack();\n  for (const ch of str) stack.push(ch);\n  let result = "";\n  while (!stack.isEmpty()) result += stack.pop();\n  return result;\n}\nconsole.log(reverseString("hello"));',
          hints: ['Push each character onto the stack', 'Pop all characters to build reversed string'],
          challenge: 'Implement a MinStack that supports push, pop, and getMin in O(1) time.',
          reqs: ['getMin() returns minimum in O(1)', 'All operations O(1)', 'Handle empty stack'],
          tests: [['push 3,1,2 getMin()', '1', 5], ['pop, getMin()', '3', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Binary Search', slug: 'js-binary-search',
      description: 'Implement binary search and its variations for efficient searching.',
      language: 'javascript', difficulty: 'intermediate', duration: 40,
      tags: ['javascript', 'binary-search', 'algorithms', 'searching'],
      category: 'Algorithms',
      objectives: ['Implement iterative and recursive binary search', 'Find insertion points', 'Apply to rotated arrays'],
      steps: [
        S(1, {
          title: 'Binary Search Algorithm', content: 'Binary search efficiently finds elements in sorted arrays by halving the search space.',
          lang: 'javascript', code: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\nconst sorted = [1, 3, 5, 7, 9, 11, 13];\nconsole.log(binarySearch(sorted, 7));  // 3\nconsole.log(binarySearch(sorted, 4));  // -1',
          concept: 'Binary search works on sorted arrays. At each step, compare the middle element with the target and eliminate half the remaining elements.',
          keyPoints: ['Requires sorted input', 'O(log n) time complexity', 'left <= right loop condition', 'mid = Math.floor((left+right)/2)'],
          realWorld: 'Looking up a word in a dictionary — you open to the middle, then choose the correct half.',
          mistakes: ['Applying to unsorted arrays', 'Off-by-one in left/right updates', 'Integer overflow in mid calculation'],
          pInstructions: ['Implement iterative binary search', 'Test with various arrays', 'Return index or -1 if not found'],
          starter: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  // your code\n}\n\nconst nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];\nconsole.log(binarySearch(nums, 23));  // expected: 5\nconsole.log(binarySearch(nums, 50));  // expected: -1',
          solution: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\nconst nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];\nconsole.log(binarySearch(nums, 23));\nconsole.log(binarySearch(nums, 50));',
          hints: ['Compare mid element with target', 'Move left or right boundary based on comparison'],
          challenge: 'Implement binary search on a rotated sorted array (e.g., [4,5,6,7,0,1,2]).',
          reqs: ['Handle rotation point', 'Still achieve O(log n)', 'Return index or -1'],
          tests: [['search([4,5,6,7,0,1,2], 0)', '4', 5], ['search([4,5,6,7,0,1,2], 3)', '-1', 5]]
        })
      ]
    }),

    T({
      title: 'JavaScript Sorting Algorithms', slug: 'js-sorting-algorithms',
      description: 'Implement and compare bubble sort, merge sort, and quick sort.',
      language: 'javascript', difficulty: 'intermediate', duration: 50,
      tags: ['javascript', 'sorting', 'algorithms', 'complexity'],
      category: 'Algorithms',
      objectives: ['Implement multiple sorting algorithms', 'Compare time complexities', 'Choose the right sort for the job'],
      steps: [
        S(1, {
          title: 'Comparison Sorts', content: 'Sorting algorithms arrange elements in order. Different algorithms have different performance characteristics.',
          lang: 'javascript', code: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(a, b) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length)\n    result.push(a[i] <= b[j] ? a[i++] : b[j++]);\n  return [...result, ...a.slice(i), ...b.slice(j)];\n}\nconsole.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));',
          concept: 'Bubble sort is O(n²) but simple. Merge sort is O(n log n) and stable. Quick sort is O(n log n) average but O(n²) worst case.',
          keyPoints: ['Bubble: O(n²), simple, stable', 'Merge: O(n log n), stable, extra space', 'Quick: O(n log n) avg, in-place', 'Built-in .sort() is often Timsort'],
          realWorld: 'Database ORDER BY uses optimized sorting. Choosing the right algorithm depends on data size and memory constraints.',
          mistakes: ['Using bubble sort for large datasets', 'Not handling edge cases (empty, single element)', 'Unstable sorts reordering equal elements'],
          pInstructions: ['Implement bubble sort', 'Implement merge sort', 'Compare their performance on a large array'],
          starter: 'function bubbleSort(arr) {\n  const a = [...arr];\n  // your code\n  return a;\n}\n\nfunction mergeSort(arr) {\n  // your code\n}\n\nconst data = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Bubble:", bubbleSort(data));\nconsole.log("Merge:", mergeSort(data));',
          solution: 'function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length; i++)\n    for (let j = 0; j < a.length - i - 1; j++)\n      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];\n  return a;\n}\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const l = mergeSort(arr.slice(0, mid)), r = mergeSort(arr.slice(mid));\n  const res = []; let i = 0, j = 0;\n  while (i < l.length && j < r.length) res.push(l[i] <= r[j] ? l[i++] : r[j++]);\n  return [...res, ...l.slice(i), ...r.slice(j)];\n}\nconst data = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Bubble:", bubbleSort(data));\nconsole.log("Merge:", mergeSort(data));',
          hints: ['Bubble: swap adjacent if out of order', 'Merge: split, sort halves, merge back'],
          challenge: 'Implement quick sort with a random pivot and benchmark all three sorts.',
          reqs: ['Random pivot selection', 'In-place partitioning', 'Count comparisons for benchmarking'],
          tests: [['quickSort([3,1,4,1,5])', '[1,1,3,4,5]', 5]]
        })
      ]
    }),

  ];
};
