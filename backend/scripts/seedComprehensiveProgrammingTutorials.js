require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Comprehensive content library for each programming language
const contentLibrary = {
  javascript: {
    topics: {
      'variables-datatypes': {
        learn: `Variables in JavaScript are containers for storing data values. Understanding variables and data types is fundamental to programming.

### Variable Declarations
JavaScript has three ways to declare variables:

**1. var** - Function-scoped, hoisted, can be redeclared
\`\`\`javascript
var name = "John";
var age = 30;
\`\`\`

**2. let** - Block-scoped, not hoisted, cannot be redeclared
\`\`\`javascript
let count = 0;
let isActive = true;
\`\`\`

**3. const** - Block-scoped, immutable reference, must be initialized
\`\`\`javascript
const PI = 3.14159;
const MAX_SIZE = 100;
\`\`\`

### Primitive Data Types

**1. Number** - Integers and floating-point numbers
\`\`\`javascript
let integer = 42;
let float = 3.14;
let negative = -10;
\`\`\`

**2. String** - Text data enclosed in quotes
\`\`\`javascript
let single = 'Hello';
let double = "World";
let template = \`Hello \${name}\`;
\`\`\`

**3. Boolean** - true or false values
\`\`\`javascript
let isValid = true;
let isComplete = false;
\`\`\`

**4. Undefined** - Variable declared but not assigned
\`\`\`javascript
let x;
console.log(x); // undefined
\`\`\`

**5. Null** - Intentional absence of value
\`\`\`javascript
let user = null;
\`\`\`

**6. Symbol** - Unique identifier (ES6)
\`\`\`javascript
const id = Symbol('id');
\`\`\`

**7. BigInt** - Large integers (ES2020)
\`\`\`javascript
const big = 1234567890123456789012345678901234567890n;
\`\`\`

### Type Checking
\`\`\`javascript
typeof 42;          // "number"
typeof "hello";     // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof null;        // "object" (known JavaScript quirk)
typeof Symbol();    // "symbol"
typeof 123n;        // "bigint"
\`\`\``,
        practice: `Let's practice working with variables and data types through hands-on exercises.

### Exercise 1: Variable Declarations
\`\`\`javascript
// Declare variables using different keywords
let firstName = "Alice";
const lastName = "Johnson";
var age = 25;

// Try to reassign
firstName = "Bob";     // Works
// lastName = "Smith"; // Error: Assignment to constant variable
age = 26;              // Works

console.log(\`\${firstName} \${lastName}, Age: \${age}\`);
\`\`\`

### Exercise 2: Working with Different Types
\`\`\`javascript
// Number operations
let x = 10;
let y = 3;
console.log(x + y);  // 13
console.log(x - y);  // 7
console.log(x * y);  // 30
console.log(x / y);  // 3.333...
console.log(x % y);  // 1 (remainder)

// String operations
let greeting = "Hello";
let name = "World";
let message = greeting + " " + name; // Concatenation
console.log(message); // "Hello World"

// Template literals
let fullMessage = \`\${greeting}, \${name}!\`;
console.log(fullMessage); // "Hello, World!"

// Type conversion
let str = "123";
let num = Number(str);    // Convert to number
console.log(num + 10);    // 133

let numStr = String(456); // Convert to string
console.log(numStr + 10); // "45610"
\`\`\`

### Exercise 3: Type Checking and Validation
\`\`\`javascript
function checkType(value) {
  console.log(\`Value: \${value}\`);
  console.log(\`Type: \${typeof value}\`);
  console.log(\`Is Number: \${typeof value === 'number'}\`);
  console.log(\`Is String: \${typeof value === 'string'}\`);
  console.log('---');
}

checkType(42);
checkType("Hello");
checkType(true);
checkType(undefined);
checkType(null);
\`\`\`

### Your Turn
1. Create variables for a person's profile (name, age, email, isActive)
2. Practice type conversions between strings and numbers
3. Use template literals to create formatted messages
4. Check types of different values using typeof`,
        challenge: `### Challenge: Build a Type-Safe Calculator

Create a calculator that handles different data types correctly and provides helpful error messages.

**Requirements:**
1. Accept two values and an operation
2. Validate that inputs are numbers
3. Handle string-to-number conversion
4. Provide clear error messages for invalid inputs
5. Support operations: +, -, *, /, %

**Starter Code:**
\`\`\`javascript
function calculator(value1, value2, operation) {
  // TODO: Validate inputs are not undefined or null

  // TODO: Convert strings to numbers if needed

  // TODO: Check if values are valid numbers

  // TODO: Perform the operation

  // TODO: Return result or error message
}

// Test cases
console.log(calculator(10, 5, '+'));     // Should return 15
console.log(calculator("20", "4", '-')); // Should return 16
console.log(calculator(8, 2, '*'));      // Should return 16
console.log(calculator(15, 3, '/'));     // Should return 5
console.log(calculator("abc", 5, '+'));  // Should return error
console.log(calculator(10, 0, '/'));     // Should handle division by zero
\`\`\`

**Bonus Challenges:**
1. Add support for more operations (power, square root)
2. Handle floating-point precision
3. Add input validation for operation parameter
4. Create a function to format the output nicely
5. Support chaining multiple operations`
      },
      'control-flow': {
        learn: `Control flow statements determine the order in which code executes. They allow your program to make decisions and respond to different conditions.

### If Statements
The if statement executes code when a condition is true.

\`\`\`javascript
let age = 18;

if (age >= 18) {
  console.log("You are an adult");
}

// If-else
if (age >= 18) {
  console.log("You can vote");
} else {
  console.log("You cannot vote yet");
}

// If-else if-else
let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
\`\`\`

### Ternary Operator
A concise way to write simple if-else statements.

\`\`\`javascript
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Can be nested (use sparingly)
let grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
\`\`\`

### Switch Statements
Used when you have multiple conditions based on the same variable.

\`\`\`javascript
let day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of work week");
    break;
  case "Friday":
    console.log("Almost weekend!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Midweek day");
}
\`\`\`

### Logical Operators

**AND (&&)** - Both conditions must be true
\`\`\`javascript
let age = 25;
let hasLicense = true;

if (age >= 18 && hasLicense) {
  console.log("You can drive");
}
\`\`\`

**OR (||)** - At least one condition must be true
\`\`\`javascript
let isWeekend = true;
let isHoliday = false;

if (isWeekend || isHoliday) {
  console.log("Time to relax!");
}
\`\`\`

**NOT (!)** - Inverts a boolean value
\`\`\`javascript
let isRaining = false;

if (!isRaining) {
  console.log("Let's go outside!");
}
\`\`\`

### Truthy and Falsy Values
JavaScript coerces values to boolean in conditional contexts.

**Falsy values:** false, 0, "", null, undefined, NaN
**Truthy values:** Everything else

\`\`\`javascript
let name = "";

if (name) {
  console.log(\`Hello, \${name}\`);
} else {
  console.log("Please enter your name");
}
\`\`\``,
        practice: `Practice control flow with real-world scenarios.

### Exercise 1: Age Verification System
\`\`\`javascript
function checkAge(age) {
  if (age < 0) {
    return "Invalid age";
  } else if (age < 13) {
    return "Child";
  } else if (age < 18) {
    return "Teenager";
  } else if (age < 65) {
    return "Adult";
  } else {
    return "Senior";
  }
}

console.log(checkAge(10));  // "Child"
console.log(checkAge(16));  // "Teenager"
console.log(checkAge(30));  // "Adult"
console.log(checkAge(70));  // "Senior"
\`\`\`

### Exercise 2: Login System
\`\`\`javascript
function login(username, password) {
  const validUsername = "admin";
  const validPassword = "password123";

  if (!username || !password) {
    return "Please enter both username and password";
  }

  if (username === validUsername && password === validPassword) {
    return "Login successful!";
  } else if (username !== validUsername) {
    return "Invalid username";
  } else {
    return "Invalid password";
  }
}

console.log(login("admin", "password123")); // "Login successful!"
console.log(login("user", "pass"));         // "Invalid username"
console.log(login("", ""));                 // "Please enter both..."
\`\`\`

### Exercise 3: Grade Calculator
\`\`\`javascript
function calculateGrade(score) {
  if (score < 0 || score > 100) {
    return "Invalid score";
  }

  switch (true) {
    case score >= 90:
      return "A";
    case score >= 80:
      return "B";
    case score >= 70:
      return "C";
    case score >= 60:
      return "D";
    default:
      return "F";
  }
}

console.log(calculateGrade(95));  // "A"
console.log(calculateGrade(75));  // "C"
console.log(calculateGrade(55));  // "F"
\`\`\`

### Your Turn
1. Create a function to check if a year is a leap year
2. Build a simple discount calculator based on purchase amount
3. Create a function that determines the season based on month
4. Build a password strength checker`,
        challenge: `### Challenge: Build a Smart Ticket Pricing System

Create a ticket pricing system for a theme park that considers multiple factors.

**Requirements:**
1. Base ticket price: $50
2. Discounts:
   - Children (under 12): 30% off
   - Seniors (65+): 25% off
   - Students (13-18 with valid ID): 15% off
3. Surcharges:
   - Weekends: +$10
   - Peak season (June-August): +$15
   - Holiday: +$20
4. Group discounts:
   - 5-10 people: 10% off total
   - 11+ people: 20% off total
5. Handle invalid inputs gracefully

**Starter Code:**
\`\`\`javascript
function calculateTicketPrice(age, isStudent, isWeekend, isPeakSeason, isHoliday, groupSize) {
  const BASE_PRICE = 50;

  // TODO: Validate inputs

  // TODO: Calculate age-based discount

  // TODO: Apply surcharges

  // TODO: Apply group discount

  // TODO: Return final price
}

// Test cases
console.log(calculateTicketPrice(10, false, false, false, false, 1));
// Expected: $35 (30% child discount)

console.log(calculateTicketPrice(25, false, true, true, false, 1));
// Expected: $75 (base + weekend + peak season)

console.log(calculateTicketPrice(16, true, false, false, false, 1));
// Expected: $42.50 (15% student discount)

console.log(calculateTicketPrice(30, false, false, false, false, 8));
// Expected: $360 (8 tickets with 10% group discount)
\`\`\`

**Bonus Challenges:**
1. Add a VIP pass option (double price, skip all lines)
2. Implement a loyalty program (repeat visitors get 5% off)
3. Add season pass calculation (if visiting 5+ times)
4. Create a function to recommend the best ticket option
5. Add validation for date ranges and holidays`
      }
    }
  },
  python: {
    topics: {
      'variables-datatypes': {
        learn: `Python is a dynamically-typed language where variables don't need explicit type declarations. Understanding Python's data types is essential for effective programming.

### Variable Assignment
Python variables are created when you assign a value to them.

\`\`\`python
# Simple assignment
name = "Alice"
age = 25
height = 5.6
is_student = True

# Multiple assignment
x, y, z = 1, 2, 3

# Same value to multiple variables
a = b = c = 10
\`\`\`

### Basic Data Types

**1. Numbers**
\`\`\`python
# Integer
count = 42
negative = -10

# Float
price = 19.99
pi = 3.14159

# Complex numbers
complex_num = 2 + 3j

# Type conversion
x = int(3.14)    # 3
y = float(5)     # 5.0
z = str(100)     # "100"
\`\`\`

**2. Strings**
\`\`\`python
# Different quote styles
single = 'Hello'
double = "World"
triple = '''Multi
line
string'''

# String formatting
name = "Bob"
age = 30
message = f"My name is {name} and I'm {age} years old"

# String operations
text = "Python"
print(text.upper())      # "PYTHON"
print(text.lower())      # "python"
print(text.replace("P", "J"))  # "Jython"
print(len(text))         # 6
\`\`\`

**3. Boolean**
\`\`\`python
is_valid = True
is_active = False

# Boolean operations
result = True and False  # False
result = True or False   # True
result = not True        # False
\`\`\`

**4. None**
\`\`\`python
# Represents absence of value
value = None

if value is None:
    print("No value assigned")
\`\`\`

### Data Type Checking
\`\`\`python
x = 42
print(type(x))           # <class 'int'>
print(isinstance(x, int))  # True

name = "Alice"
print(type(name))        # <class 'str'>
print(isinstance(name, str))  # True
\`\`\`

### Type Conversion
\`\`\`python
# String to number
num_str = "123"
num = int(num_str)
print(num + 10)  # 133

# Number to string
age = 25
age_str = str(age)
print("Age: " + age_str)

# List to tuple
my_list = [1, 2, 3]
my_tuple = tuple(my_list)
\`\`\``,
        practice: `Let's practice Python variables and data types with hands-on exercises.

### Exercise 1: Variable Operations
\`\`\`python
# Numeric operations
x = 15
y = 4

print(f"Addition: {x + y}")       # 19
print(f"Subtraction: {x - y}")    # 11
print(f"Multiplication: {x * y}") # 60
print(f"Division: {x / y}")       # 3.75
print(f"Integer Division: {x // y}") # 3
print(f"Modulus: {x % y}")        # 3
print(f"Exponent: {x ** y}")      # 50625
\`\`\`

### Exercise 2: String Manipulation
\`\`\`python
# String methods
text = "  Python Programming  "

print(text.strip())      # Remove whitespace
print(text.lower())      # Convert to lowercase
print(text.upper())      # Convert to uppercase
print(text.title())      # Title case

# String slicing
language = "Python"
print(language[0])       # 'P'
print(language[-1])      # 'n'
print(language[0:3])     # 'Pyt'
print(language[::-1])    # 'nohtyP' (reverse)

# String checking
email = "user@example.com"
print(email.startswith("user"))  # True
print(email.endswith(".com"))    # True
print("@" in email)              # True
\`\`\`

### Exercise 3: Type Conversion and Validation
\`\`\`python
def safe_convert_to_int(value):
    """Safely convert a value to integer"""
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

# Test the function
print(safe_convert_to_int("123"))    # 123
print(safe_convert_to_int("abc"))    # None
print(safe_convert_to_int(45.6))     # 45
print(safe_convert_to_int(None))     # None
\`\`\`

### Exercise 4: Input and Output
\`\`\`python
# Getting user input (returns string)
name = input("Enter your name: ")
age_str = input("Enter your age: ")
age = int(age_str)

# Formatted output
print(f"Hello, {name}!")
print(f"You are {age} years old")
print(f"Next year you'll be {age + 1}")
\`\`\`

### Your Turn
1. Create a program that converts temperature between Celsius and Fahrenheit
2. Build a simple BMI calculator
3. Create a function that validates email addresses
4. Practice string formatting with different styles`,
        challenge: `### Challenge: Build a Data Validator and Formatter

Create a comprehensive data validation and formatting system.

**Requirements:**
1. Validate different data types
2. Convert between types safely
3. Format data for display
4. Handle errors gracefully
5. Provide helpful error messages

**Starter Code:**
\`\`\`python
class DataValidator:
    def __init__(self):
        self.errors = []

    def validate_email(self, email):
        """
        Validate email format
        Rules:
        - Must contain @
        - Must have domain
        - No spaces
        """
        # TODO: Implement validation
        pass

    def validate_phone(self, phone):
        """
        Validate phone number
        Accept formats: (123) 456-7890, 123-456-7890, 1234567890
        """
        # TODO: Implement validation
        pass

    def validate_age(self, age):
        """
        Validate age
        Rules:
        - Must be integer or convertible to integer
        - Must be between 0 and 150
        """
        # TODO: Implement validation
        pass

    def format_currency(self, amount):
        """
        Format number as currency (USD)
        Example: 1234.56 -> "$1,234.56"
        """
        # TODO: Implement formatting
        pass

    def format_phone(self, phone):
        """
        Format phone number
        Convert any format to: (XXX) XXX-XXXX
        """
        # TODO: Implement formatting
        pass

    def get_errors(self):
        """Return all validation errors"""
        return self.errors

# Test cases
validator = DataValidator()

# Email validation
print(validator.validate_email("user@example.com"))  # True
print(validator.validate_email("invalid.email"))     # False

# Phone validation
print(validator.validate_phone("1234567890"))        # True
print(validator.validate_phone("(123) 456-7890"))    # True
print(validator.validate_phone("123"))               # False

# Age validation
print(validator.validate_age(25))                    # True
print(validator.validate_age("30"))                  # True
print(validator.validate_age(-5))                    # False
print(validator.validate_age(200))                   # False

# Currency formatting
print(validator.format_currency(1234.56))            # "$1,234.56"
print(validator.format_currency(1000000))            # "$1,000,000.00"

# Phone formatting
print(validator.format_phone("1234567890"))          # "(123) 456-7890"
print(validator.format_phone("123-456-7890"))        # "(123) 456-7890"
\`\`\`

**Bonus Challenges:**
1. Add credit card validation (Luhn algorithm)
2. Implement date validation and formatting
3. Add password strength validation
4. Create a batch validation method for multiple fields
5. Add support for different locales (currency, date formats)`
      }
    }
  },
  java: {
    topics: {
      'variables-datatypes': {
        learn: `Java is a statically-typed language where you must declare the type of every variable. Understanding Java's type system is fundamental to writing robust code.

### Variable Declaration
In Java, you must specify the type when declaring a variable.

\`\`\`java
// Declaration and initialization
int age = 25;
double price = 19.99;
String name = "Alice";
boolean isActive = true;

// Declaration without initialization
int count;
count = 10;

// Multiple variables of same type
int x = 1, y = 2, z = 3;
\`\`\`

### Primitive Data Types

**1. Integer Types**
\`\`\`java
byte b = 127;           // 8-bit: -128 to 127
short s = 32000;        // 16-bit: -32,768 to 32,767
int i = 2000000;        // 32-bit: -2^31 to 2^31-1
long l = 9000000000L;   // 64-bit: -2^63 to 2^63-1 (note the L suffix)
\`\`\`

**2. Floating-Point Types**
\`\`\`java
float f = 3.14f;        // 32-bit floating point (note the f suffix)
double d = 3.14159;     // 64-bit floating point (default for decimals)
\`\`\`

**3. Character Type**
\`\`\`java
char letter = 'A';      // 16-bit Unicode character
char digit = '9';
char symbol = '@';
\`\`\`

**4. Boolean Type**
\`\`\`java
boolean isValid = true;
boolean isComplete = false;
\`\`\`

### Reference Types

**String (most commonly used reference type)**
\`\`\`java
String greeting = "Hello, World!";
String name = new String("Alice");

// String methods
int length = greeting.length();
String upper = greeting.toUpperCase();
String lower = greeting.toLowerCase();
boolean contains = greeting.contains("Hello");
String replaced = greeting.replace("World", "Java");
\`\`\`

### Type Casting

**Widening (Automatic)**
\`\`\`java
int myInt = 100;
long myLong = myInt;     // Automatic casting: int to long
double myDouble = myInt;  // Automatic casting: int to double
\`\`\`

**Narrowing (Manual)**
\`\`\`java
double myDouble = 9.78;
int myInt = (int) myDouble;  // Manual casting: double to int (becomes 9)

long myLong = 100000L;
int myInt2 = (int) myLong;   // Manual casting: long to int
\`\`\`

### Constants
\`\`\`java
final double PI = 3.14159;
final int MAX_SIZE = 100;
final String APP_NAME = "MyApp";

// Constants cannot be reassigned
// PI = 3.14;  // This would cause a compilation error
\`\`\`

### Variable Naming Rules
1. Must start with letter, $, or _
2. Can contain letters, digits, $, _
3. Case-sensitive
4. Cannot use Java keywords
5. Convention: camelCase for variables

\`\`\`java
// Valid variable names
int myAge = 25;
int _count = 10;
int $price = 100;

// Invalid variable names
// int 2ndPlace = 2;     // Cannot start with digit
// int my-name = "Bob";  // Cannot contain hyphen
// int class = 5;        // Cannot use keyword
\`\`\``,
        practice: `Practice Java variables and data types with hands-on exercises.

### Exercise 1: Working with Primitive Types
\`\`\`java
public class DataTypesDemo {
    public static void main(String[] args) {
        // Integer operations
        int x = 10;
        int y = 3;

        System.out.println("Addition: " + (x + y));           // 13
        System.out.println("Subtraction: " + (x - y));        // 7
        System.out.println("Multiplication: " + (x * y));     // 30
        System.out.println("Division: " + (x / y));           // 3 (integer division)
        System.out.println("Division (double): " + (x / 3.0)); // 3.333...
        System.out.println("Modulus: " + (x % y));            // 1

        // Floating point precision
        double price = 19.99;
        double tax = 0.08;
        double total = price + (price * tax);
        System.out.printf("Total: $%.2f%n", total);  // Formatted output
    }
}
\`\`\`

### Exercise 2: String Manipulation
\`\`\`java
public class StringDemo {
    public static void main(String[] args) {
        String firstName = "John";
        String lastName = "Doe";

        // String concatenation
        String fullName = firstName + " " + lastName;
        System.out.println(fullName);

        // String methods
        System.out.println("Length: " + fullName.length());
        System.out.println("Uppercase: " + fullName.toUpperCase());
        System.out.println("Lowercase: " + fullName.toLowerCase());
        System.out.println("Starts with 'John': " + fullName.startsWith("John"));
        System.out.println("Contains 'Doe': " + fullName.contains("Doe"));

        // String formatting
        int age = 30;
        String message = String.format("%s is %d years old", fullName, age);
        System.out.println(message);

        // StringBuilder for efficient string building
        StringBuilder sb = new StringBuilder();
        sb.append("Hello");
        sb.append(" ");
        sb.append("World");
        String result = sb.toString();
        System.out.println(result);
    }
}
\`\`\`

### Exercise 3: Type Conversion
\`\`\`java
public class TypeConversionDemo {
    public static void main(String[] args) {
        // String to number
        String numStr = "123";
        int num = Integer.parseInt(numStr);
        double numDouble = Double.parseDouble("45.67");

        System.out.println(num + 10);        // 133
        System.out.println(numDouble + 5);   // 50.67

        // Number to string
        int age = 25;
        String ageStr = String.valueOf(age);
        String ageStr2 = Integer.toString(age);

        // Handling conversion errors
        try {
            int invalid = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Invalid number format");
        }

        // Casting between numeric types
        double d = 9.78;
        int i = (int) d;  // Truncates to 9
        System.out.println("Double: " + d + ", Int: " + i);
    }
}
\`\`\`

### Exercise 4: Constants and Final Variables
\`\`\`java
public class ConstantsDemo {
    // Class-level constants
    public static final double PI = 3.14159;
    public static final int MAX_USERS = 1000;

    public static void main(String[] args) {
        // Method-level constant
        final String APP_NAME = "MyApplication";

        // Calculate circle area
        double radius = 5.0;
        double area = PI * radius * radius;
        System.out.printf("Circle area: %.2f%n", area);

        // Using constants for clarity
        int currentUsers = 500;
        if (currentUsers < MAX_USERS) {
            System.out.println("Can add more users");
        }
    }
}
\`\`\`

### Your Turn
1. Create a program that converts between different units (miles to km, etc.)
2. Build a simple calculator with proper type handling
3. Practice string manipulation with user input
4. Create a program that demonstrates all primitive types`,
        challenge: `### Challenge: Build a Student Grade Management System

Create a comprehensive system to manage student grades with proper data types and validation.

**Requirements:**
1. Use appropriate data types for all fields
2. Implement data validation
3. Calculate statistics (average, letter grade)
4. Format output professionally
5. Handle errors gracefully

**Starter Code:**
\`\`\`java
public class StudentGradeSystem {

    // Constants
    private static final double GRADE_A = 90.0;
    private static final double GRADE_B = 80.0;
    private static final double GRADE_C = 70.0;
    private static final double GRADE_D = 60.0;

    // Student information
    private String studentName;
    private int studentId;
    private double[] grades;

    public StudentGradeSystem(String name, int id, int numberOfGrades) {
        // TODO: Initialize student information
        // TODO: Validate inputs
    }

    public void addGrade(int index, double grade) {
        // TODO: Validate index and grade (0-100)
        // TODO: Add grade to array
    }

    public double calculateAverage() {
        // TODO: Calculate average of all grades
        // TODO: Handle case when no grades exist
        return 0.0;
    }

    public String getLetterGrade(double average) {
        // TODO: Convert numeric average to letter grade
        // TODO: Return appropriate letter (A, B, C, D, F)
        return "";
    }

    public void printGradeReport() {
        // TODO: Print formatted grade report
        // Format:
        // Student: [Name] (ID: [ID])
        // Grades: [grade1, grade2, ...]
        // Average: [XX.XX]
        // Letter Grade: [X]
    }

    public boolean isPassing() {
        // TODO: Return true if average >= 60
        return false;
    }

    public static void main(String[] args) {
        // Test the system
        StudentGradeSystem student = new StudentGradeSystem("Alice Johnson", 12345, 5);

        student.addGrade(0, 85.5);
        student.addGrade(1, 92.0);
        student.addGrade(2, 78.5);
        student.addGrade(3, 88.0);
        student.addGrade(4, 95.5);

        student.printGradeReport();

        // Test error handling
        student.addGrade(10, 90.0);  // Invalid index
        student.addGrade(0, 150.0);  // Invalid grade
    }
}
\`\`\`

**Bonus Challenges:**
1. Add support for weighted grades (homework, exams, projects)
2. Implement grade curve functionality
3. Add comparison method to compare two students
4. Create a method to find highest and lowest grades
5. Implement GPA calculation on 4.0 scale
6. Add support for extra credit
7. Create a class to manage multiple students`
      }
    }
  },
  typescript: {
    topics: {
      'variables-datatypes': {
        learn: `TypeScript is a superset of JavaScript that adds static typing. Type annotations help catch errors at compile-time rather than runtime.

### Variable Declarations with Types

**Basic Type Annotations**
\`\`\`typescript
// Explicit type annotations
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;

// Type inference (TypeScript infers the type)
let city = "New York";  // inferred as string
let count = 10;         // inferred as number

// Variables can be declared without immediate assignment
let email: string;
email = "alice@example.com";
\`\`\`

### Primitive Types

**1. Number**
\`\`\`typescript
let integer: number = 42;
let float: number = 3.14;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
\`\`\`

**2. String**
\`\`\`typescript
let firstName: string = "John";
let lastName: string = 'Doe';
let fullName: string = \`\${firstName} \${lastName}\`;

// Multi-line strings
let message: string = \`
  Hello, \${firstName}!
  Welcome to TypeScript.
\`;
\`\`\`

**3. Boolean**
\`\`\`typescript
let isDone: boolean = false;
let isActive: boolean = true;
\`\`\`

**4. Null and Undefined**
\`\`\`typescript
let u: undefined = undefined;
let n: null = null;

// With strictNullChecks disabled
let name: string = null;      // Allowed
let age: number = undefined;  // Allowed
\`\`\`

### Special Types

**Any** - Opts out of type checking
\`\`\`typescript
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;  // All allowed
\`\`\`

**Unknown** - Type-safe version of any
\`\`\`typescript
let value: unknown = 4;
// value.toFixed(); // Error! Must check type first

if (typeof value === "number") {
  value.toFixed(2);  // Now it's safe
}
\`\`\`

**Void** - Absence of a return value
\`\`\`typescript
function logMessage(message: string): void {
  console.log(message);
}
\`\`\`

**Never** - Function never returns
\`\`\`typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
\`\`\`

### Array Types
\`\`\`typescript
// Array of numbers
let numbers: number[] = [1, 2, 3, 4, 5];
let moreNumbers: Array<number> = [6, 7, 8];

// Array of strings
let names: string[] = ["Alice", "Bob", "Charlie"];

// Mixed types using union
let mixed: (number | string)[] = [1, "two", 3, "four"];
\`\`\`

### Tuple Types
\`\`\`typescript
// Fixed-length array with specific types
let person: [string, number] = ["Alice", 25];

// Accessing tuple elements
let name: string = person[0];
let age: number = person[1];

// Tuple with optional elements
let user: [string, number?] = ["Bob"];  // age is optional
\`\`\`

### Enum Types
\`\`\`typescript
// Numeric enum
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

let dir: Direction = Direction.Up;

// String enum
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

let favoriteColor: Color = Color.Blue;
\`\`\`

### Type Assertions
\`\`\`typescript
// Telling TypeScript "trust me, I know what I'm doing"
let someValue: unknown = "this is a string";

// Using 'as' syntax
let strLength: number = (someValue as string).length;

// Using angle-bracket syntax (not usable in JSX)
let strLength2: number = (<string>someValue).length;
\`\`\`

### Union Types
\`\`\`typescript
// Variable can be one of several types
let id: number | string;
id = 101;      // OK
id = "ABC123"; // OK

function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(0));
  }
}
\`\`\`

### Type Aliases
\`\`\`typescript
// Create reusable type definitions
type StringOrNumber = string | number;
type Point = { x: number; y: number };

let value: StringOrNumber = "hello";
let coordinate: Point = { x: 10, y: 20 };
\`\`\``,
        practice: `Practice TypeScript types with hands-on exercises.

### Exercise 1: Type Annotations and Inference
\`\`\`typescript
// Explicit type annotations
let username: string = "john_doe";
let userAge: number = 28;
let isVerified: boolean = true;

// Type inference (TypeScript figures out the type)
let city = "San Francisco";  // string
let zipCode = 94102;         // number
let isOpen = true;           // boolean

// Function with type annotations
function greet(name: string, age: number): string {
  return \`Hello, \${name}! You are \${age} years old.\`;
}

console.log(greet("Alice", 25));
// console.log(greet(123, "25")); // Error: wrong types
\`\`\`

### Exercise 2: Working with Arrays and Tuples
\`\`\`typescript
// Typed arrays
let scores: number[] = [85, 92, 78, 90];
let students: string[] = ["Alice", "Bob", "Charlie"];

// Array methods with type safety
let doubledScores = scores.map((score: number): number => score * 2);
let passedStudents = scores.filter((score: number): boolean => score >= 80);

// Tuples for fixed structures
type Student = [string, number, boolean];
let student1: Student = ["Alice", 20, true];
let student2: Student = ["Bob", 22, false];

let [name, age, enrolled] = student1;  // Destructuring
console.log(\`\${name} is \${age} years old, Enrolled: \${enrolled}\`);

// Array of tuples
let classList: Student[] = [
  ["Alice", 20, true],
  ["Bob", 22, false],
  ["Charlie", 21, true]
];
\`\`\`

### Exercise 3: Union Types and Type Guards
\`\`\`typescript
// Union types
type ID = number | string;

function formatID(id: ID): string {
  // Type guard using typeof
  if (typeof id === "string") {
    return id.toUpperCase();
  } else {
    return id.toFixed(0);
  }
}

console.log(formatID("abc123"));  // "ABC123"
console.log(formatID(456));       // "456"

// Discriminated unions
type Success = { status: "success"; data: string };
type Error = { status: "error"; message: string };
type Result = Success | Error;

function handleResult(result: Result): void {
  if (result.status === "success") {
    console.log("Data:", result.data);
  } else {
    console.log("Error:", result.message);
  }
}
\`\`\`

### Exercise 4: Enums for Named Constants
\`\`\`typescript
// Numeric enum
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500
}

function getStatusMessage(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:
      return "Request successful";
    case HttpStatus.BadRequest:
      return "Invalid request";
    case HttpStatus.Unauthorized:
      return "Authentication required";
    case HttpStatus.NotFound:
      return "Resource not found";
    default:
      return "Unknown status";
  }
}

console.log(getStatusMessage(HttpStatus.OK));

// String enum for better debugging
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR"
}

function log(level: LogLevel, message: string): void {
  console.log(\`[\${level}] \${message}\`);
}

log(LogLevel.Info, "Application started");
log(LogLevel.Error, "Something went wrong");
\`\`\`

### Exercise 5: Type Aliases and Interfaces
\`\`\`typescript
// Type alias for complex types
type UserID = number | string;
type Coordinates = { lat: number; lng: number };
type Callback = (data: string) => void;

// Using type aliases
let userId: UserID = "user123";
let location: Coordinates = { lat: 37.7749, lng: -122.4194 };

// Interface for object shapes
interface User {
  id: UserID;
  name: string;
  email: string;
  age?: number;  // Optional property
  readonly createdAt: Date;  // Read-only property
}

let user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
};

// user.createdAt = new Date();  // Error: readonly property
\`\`\`

### Your Turn
1. Create a type-safe configuration object for an app
2. Build a function that handles multiple input types safely
3. Create an enum for application states
4. Practice with tuple types for function returns`,
        challenge: `### Challenge: Build a Type-Safe Shopping Cart System

Create a comprehensive shopping cart with full TypeScript type safety.

**Requirements:**
1. Define proper types for all data structures
2. Use enums for status values
3. Implement type guards for safety
4. Handle union types appropriately
5. Create readonly properties where needed

**Starter Code:**
\`\`\`typescript
// Define enums
enum ProductCategory {
  Electronics = "ELECTRONICS",
  Clothing = "CLOTHING",
  Books = "BOOKS",
  Food = "FOOD"
}

enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED"
}

// Define type aliases and interfaces
type ProductID = string | number;
type Price = number;

interface Product {
  id: ProductID;
  name: string;
  category: ProductCategory;
  price: Price;
  inStock: boolean;
  quantity?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface ShoppingCart {
  items: CartItem[];
  totalPrice: Price;
  status: OrderStatus;
}

// TODO: Implement the ShoppingCartManager class
class ShoppingCartManager {
  private cart: ShoppingCart;

  constructor() {
    // TODO: Initialize empty cart
  }

  addItem(product: Product, quantity: number): void {
    // TODO: Validate product is in stock
    // TODO: Validate quantity > 0
    // TODO: Add item to cart or update quantity if exists
    // TODO: Update total price
  }

  removeItem(productId: ProductID): boolean {
    // TODO: Find and remove item from cart
    // TODO: Update total price
    // TODO: Return success/failure
    return false;
  }

  updateQuantity(productId: ProductID, quantity: number): void {
    // TODO: Find item and update quantity
    // TODO: Validate quantity > 0
    // TODO: Update total price
  }

  calculateTotal(): Price {
    // TODO: Calculate total price of all items
    // TODO: Apply any discounts
    return 0;
  }

  getCartSummary(): string {
    // TODO: Return formatted cart summary
    // Include: number of items, total price, status
    return "";
  }

  checkout(): OrderStatus {
    // TODO: Validate cart is not empty
    // TODO: Validate all items are in stock
    // TODO: Update status to Processing
    // TODO: Return new status
    return OrderStatus.Pending;
  }

  clearCart(): void {
    // TODO: Remove all items
    // TODO: Reset total price
    // TODO: Reset status
  }
}

// Test the system
const cartManager = new ShoppingCartManager();

const laptop: Product = {
  id: "PROD001",
  name: "Laptop Pro 15",
  category: ProductCategory.Electronics,
  price: 1299.99,
  inStock: true
};

const book: Product = {
  id: "PROD002",
  name: "TypeScript Handbook",
  category: ProductCategory.Books,
  price: 39.99,
  inStock: true
};

// Test adding items
cartManager.addItem(laptop, 1);
cartManager.addItem(book, 2);

// Test cart operations
console.log(cartManager.getCartSummary());

// Test updating quantity
cartManager.updateQuantity("PROD001", 2);

// Test checkout
const status = cartManager.checkout();
console.log(\`Order status: \${status}\`);
\`\`\`

**Bonus Challenges:**
1. Add discount system with union types (percentage or fixed amount)
2. Implement coupon code validation
3. Add tax calculation based on location (use type aliases)
4. Create a payment method discriminated union
5. Add shipping calculation with weight-based pricing
6. Implement inventory management with stock updates
7. Add order history with readonly timestamps
8. Create a product search function with type guards`
      }
    }
  },
  c: {
    topics: {
      'variables-datatypes': {
        learn: `C is a statically-typed, compiled language that requires explicit type declarations. Understanding memory and data types is crucial in C programming.

### Variable Declaration and Initialization

In C, you must declare variables with their types before use.

\`\`\`c
#include <stdio.h>

int main() {
    // Declaration and initialization
    int age = 25;
    float price = 19.99;
    char grade = 'A';

    // Declaration without initialization
    int count;
    count = 10;

    // Multiple variables of same type
    int x = 1, y = 2, z = 3;

    return 0;
}
\`\`\`

### Integer Data Types

C provides several integer types of different sizes:

\`\`\`c
// Signed integers
char c = -128;           // 1 byte: -128 to 127
short s = -32768;        // 2 bytes: -32,768 to 32,767
int i = -2147483648;     // 4 bytes: -2^31 to 2^31-1
long l = -2147483648L;   // 4 or 8 bytes (platform dependent)
long long ll = 9223372036854775807LL;  // 8 bytes

// Unsigned integers
unsigned char uc = 255;          // 0 to 255
unsigned short us = 65535;       // 0 to 65,535
unsigned int ui = 4294967295U;   // 0 to 2^32-1
unsigned long ul = 4294967295UL;
unsigned long long ull = 18446744073709551615ULL;
\`\`\`

### Floating-Point Types

\`\`\`c
float f = 3.14f;         // 4 bytes, ~7 decimal digits precision
double d = 3.14159265;   // 8 bytes, ~15 decimal digits precision
long double ld = 3.14159265358979L;  // 10+ bytes, extended precision
\`\`\`

### Character Type

\`\`\`c
char letter = 'A';       // Single character
char digit = '9';
char newline = '\\n';    // Escape sequence
char tab = '\\t';

// Characters are actually small integers
char ch = 65;            // Same as 'A'
printf("%c", ch);        // Prints 'A'
printf("%d", ch);        // Prints 65
\`\`\`

### Boolean Type (C99 and later)

\`\`\`c
#include <stdbool.h>

bool isValid = true;
bool isComplete = false;

// Before C99, use int
int isActive = 1;   // true
int isDone = 0;     // false
\`\`\`

### Constants

**Using #define (preprocessor macro)**
\`\`\`c
#define PI 3.14159
#define MAX_SIZE 100
#define APP_NAME "MyApp"
\`\`\`

**Using const keyword**
\`\`\`c
const double PI = 3.14159;
const int MAX_USERS = 1000;
const char* MESSAGE = "Hello";
\`\`\`

### Type Modifiers

\`\`\`c
// signed, unsigned, short, long
signed int si = -100;      // Can be positive or negative
unsigned int ui = 100;     // Only positive values

short int si = 32767;      // Shorter integer
long int li = 2147483647L; // Longer integer
\`\`\`

### sizeof Operator

\`\`\`c
#include <stdio.h>

int main() {
    printf("Size of char: %zu bytes\\n", sizeof(char));
    printf("Size of int: %zu bytes\\n", sizeof(int));
    printf("Size of float: %zu bytes\\n", sizeof(float));
    printf("Size of double: %zu bytes\\n", sizeof(double));
    printf("Size of long: %zu bytes\\n", sizeof(long));

    int arr[10];
    printf("Size of array: %zu bytes\\n", sizeof(arr));

    return 0;
}
\`\`\`

### Type Casting

**Implicit Casting (Automatic)**
\`\`\`c
int i = 10;
float f = i;        // int to float (automatic)
double d = f;       // float to double (automatic)
\`\`\`

**Explicit Casting (Manual)**
\`\`\`c
double d = 9.78;
int i = (int)d;     // d becomes 9 (truncation)

float f = 3.14;
int x = (int)f;     // x becomes 3

// Casting for integer division
int a = 7, b = 2;
float result = (float)a / b;  // 3.5 instead of 3
\`\`\`

### Input and Output

\`\`\`c
#include <stdio.h>

int main() {
    int age;
    float height;
    char grade;

    // Reading input
    printf("Enter your age: ");
    scanf("%d", &age);

    printf("Enter your height: ");
    scanf("%f", &height);

    printf("Enter your grade: ");
    scanf(" %c", &grade);  // Space before %c to consume newline

    // Printing output
    printf("Age: %d\\n", age);
    printf("Height: %.2f\\n", height);
    printf("Grade: %c\\n", grade);

    return 0;
}
\`\`\`

### Format Specifiers

\`\`\`c
%d or %i    // int
%u          // unsigned int
%f          // float/double
%lf         // double (for scanf)
%c          // char
%s          // string
%p          // pointer
%x          // hexadecimal
%o          // octal
%%          // literal %
\`\`\``,
        practice: `Practice C variables and data types with hands-on examples.

### Exercise 1: Variable Declaration and Operations
\`\`\`c
#include <stdio.h>

int main() {
    // Integer operations
    int x = 15;
    int y = 4;

    printf("Addition: %d\\n", x + y);        // 19
    printf("Subtraction: %d\\n", x - y);     // 11
    printf("Multiplication: %d\\n", x * y);  // 60
    printf("Division: %d\\n", x / y);        // 3 (integer division)
    printf("Modulus: %d\\n", x % y);         // 3

    // Float division
    printf("Float Division: %.2f\\n", (float)x / y);  // 3.75

    // Increment and decrement
    int count = 5;
    printf("count: %d\\n", count);      // 5
    printf("count++: %d\\n", count++);  // 5 (post-increment)
    printf("count: %d\\n", count);      // 6
    printf("++count: %d\\n", ++count);  // 7 (pre-increment)

    return 0;
}
\`\`\`

### Exercise 2: Data Type Sizes and Ranges
\`\`\`c
#include <stdio.h>
#include <limits.h>
#include <float.h>

int main() {
    printf("Data Type Sizes:\\n");
    printf("char: %zu bytes\\n", sizeof(char));
    printf("short: %zu bytes\\n", sizeof(short));
    printf("int: %zu bytes\\n", sizeof(int));
    printf("long: %zu bytes\\n", sizeof(long));
    printf("float: %zu bytes\\n", sizeof(float));
    printf("double: %zu bytes\\n\\n", sizeof(double));

    printf("Integer Ranges:\\n");
    printf("char: %d to %d\\n", CHAR_MIN, CHAR_MAX);
    printf("short: %d to %d\\n", SHRT_MIN, SHRT_MAX);
    printf("int: %d to %d\\n", INT_MIN, INT_MAX);
    printf("long: %ld to %ld\\n\\n", LONG_MIN, LONG_MAX);

    printf("Floating Point Ranges:\\n");
    printf("float: %e to %e\\n", FLT_MIN, FLT_MAX);
    printf("double: %e to %e\\n", DBL_MIN, DBL_MAX);

    return 0;
}
\`\`\`

### Exercise 3: Type Casting and Conversion
\`\`\`c
#include <stdio.h>

int main() {
    // Implicit conversion
    int i = 10;
    float f = i;
    printf("int to float: %f\\n", f);  // 10.000000

    // Explicit conversion
    double d = 9.99;
    int truncated = (int)d;
    printf("double to int: %d\\n", truncated);  // 9

    // Integer division vs float division
    int a = 7, b = 2;
    printf("Integer division: %d\\n", a / b);           // 3
    printf("Float division: %.2f\\n", (float)a / b);    // 3.50

    // Character and integer relationship
    char ch = 'A';
    printf("Character: %c\\n", ch);         // A
    printf("ASCII value: %d\\n", ch);       // 65
    printf("Next character: %c\\n", ch + 1);  // B

    // Unsigned vs signed
    unsigned int ui = 4294967295U;
    int si = -1;
    printf("Unsigned: %u\\n", ui);
    printf("Signed: %d\\n", si);

    return 0;
}
\`\`\`

### Exercise 4: Input and Output Formatting
\`\`\`c
#include <stdio.h>

int main() {
    int age;
    float height, weight;
    char grade;

    // Reading user input
    printf("Enter your age: ");
    scanf("%d", &age);

    printf("Enter your height (meters): ");
    scanf("%f", &height);

    printf("Enter your weight (kg): ");
    scanf("%f", &weight);

    printf("Enter your grade: ");
    scanf(" %c", &grade);  // Space to consume newline

    // Formatted output
    printf("\\n--- Profile ---\\n");
    printf("Age: %d years old\\n", age);
    printf("Height: %.2f meters\\n", height);
    printf("Weight: %.1f kg\\n", weight);
    printf("Grade: %c\\n", grade);

    // Calculate BMI
    float bmi = weight / (height * height);
    printf("BMI: %.2f\\n", bmi);

    return 0;
}
\`\`\`

### Exercise 5: Constants and Macros
\`\`\`c
#include <stdio.h>

#define PI 3.14159
#define MAX_SIZE 100
#define SQUARE(x) ((x) * (x))

int main() {
    const double GRAVITY = 9.81;
    const int DAYS_IN_WEEK = 7;

    // Using constants
    double radius = 5.0;
    double area = PI * radius * radius;
    printf("Circle area: %.2f\\n", area);

    // Using macros
    int num = 5;
    printf("Square of %d: %d\\n", num, SQUARE(num));

    // Constants cannot be changed
    // PI = 3.14;  // Error
    // GRAVITY = 10.0;  // Error

    printf("Max size: %d\\n", MAX_SIZE);
    printf("Days in week: %d\\n", DAYS_IN_WEEK);

    return 0;
}
\`\`\`

### Your Turn
1. Create a program to convert temperatures (Celsius/Fahrenheit)
2. Build a simple calculator with proper type handling
3. Practice with character operations and ASCII values
4. Create a program that demonstrates all data type sizes`,
        challenge: `### Challenge: Build a Student Record System

Create a comprehensive student record system using appropriate C data types.

**Requirements:**
1. Use appropriate data types for all fields
2. Implement input validation
3. Perform calculations (average, GPA)
4. Format output professionally
5. Handle edge cases and errors
6. Use constants where appropriate

**Starter Code:**
\`\`\`c
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define MAX_NAME_LENGTH 50
#define MAX_SUBJECTS 5
#define PASSING_GRADE 60.0
#define MAX_GRADE 100.0

// TODO: Define a struct for student record (bonus challenge)

// Function declarations
void displayMenu();
float calculateAverage(float grades[], int count);
char getLetterGrade(float average);
float calculateGPA(float average);
bool isValidGrade(float grade);
void printReport(/* student parameters */);

int main() {
    // Student information variables
    char name[MAX_NAME_LENGTH];
    int studentID;
    int age;
    float grades[MAX_SUBJECTS];
    int numSubjects;

    // Display menu and get input
    displayMenu();

    // TODO: Get student information
    printf("Enter student name: ");
    fgets(name, MAX_NAME_LENGTH, stdin);
    name[strcspn(name, "\\n")] = 0;  // Remove newline

    printf("Enter student ID: ");
    scanf("%d", &studentID);

    printf("Enter age: ");
    scanf("%d", &age);

    // TODO: Validate age (5-100)

    printf("Enter number of subjects (1-%d): ", MAX_SUBJECTS);
    scanf("%d", &numSubjects);

    // TODO: Validate number of subjects

    // TODO: Get grades for each subject with validation
    for (int i = 0; i < numSubjects; i++) {
        printf("Enter grade for subject %d: ", i + 1);
        scanf("%f", &grades[i]);

        // TODO: Validate grade using isValidGrade()
    }

    // TODO: Calculate statistics
    float average = calculateAverage(grades, numSubjects);
    char letterGrade = getLetterGrade(average);
    float gpa = calculateGPA(average);

    // TODO: Print complete report
    printReport(/* parameters */);

    return 0;
}

void displayMenu() {
    printf("================================\\n");
    printf("   STUDENT RECORD SYSTEM\\n");
    printf("================================\\n\\n");
}

float calculateAverage(float grades[], int count) {
    // TODO: Calculate and return average of grades
    // Handle case when count is 0
    return 0.0;
}

char getLetterGrade(float average) {
    // TODO: Convert average to letter grade
    // A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: 0-59
    return 'F';
}

float calculateGPA(float average) {
    // TODO: Convert average to 4.0 scale
    // A(90-100): 4.0, B(80-89): 3.0, C(70-79): 2.0, D(60-69): 1.0, F: 0.0
    return 0.0;
}

bool isValidGrade(float grade) {
    // TODO: Return true if grade is between 0 and MAX_GRADE
    return false;
}

void printReport(/* student parameters */) {
    // TODO: Print formatted student report
    // Include: name, ID, age, all grades, average, letter grade, GPA
    // Format nicely with borders and alignment
}
\`\`\`

**Expected Output Format:**
\`\`\`
================================
   STUDENT RECORD SYSTEM
================================

Enter student name: Alice Johnson
Enter student ID: 12345
Enter age: 20
Enter number of subjects (1-5): 3
Enter grade for subject 1: 85.5
Enter grade for subject 2: 92.0
Enter grade for subject 3: 88.5

================================
      STUDENT REPORT
================================
Name:         Alice Johnson
Student ID:   12345
Age:          20 years old
--------------------------------
Grades:
  Subject 1:  85.50
  Subject 2:  92.00
  Subject 3:  88.50
--------------------------------
Average:      88.67
Letter Grade: B
GPA:          3.00/4.00
Status:       PASSING
================================
\`\`\`

**Bonus Challenges:**
1. Use a struct to organize student data
2. Add support for subject names
3. Implement weighted grades (exams worth more than homework)
4. Add multiple student support with arrays
5. Implement sorting by average grade
6. Add file I/O to save/load records
7. Create functions to find highest/lowest grades
8. Add grade distribution statistics`
      }
    }
  },
  cpp: {
    topics: {
      'variables-datatypes': {
        learn: `C++ is a statically-typed, object-oriented extension of C with additional features like references, classes, and the Standard Template Library.

### Variable Declaration and Initialization

C++ offers multiple ways to initialize variables:

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Traditional C-style initialization
    int age = 25;

    // Constructor initialization
    int count(10);

    // Uniform initialization (C++11)
    int score{95};

    // Auto keyword (type inference)
    auto pi = 3.14159;        // double
    auto name = "Alice";      // const char*
    auto isValid = true;      // bool

    return 0;
}
\`\`\`

### Fundamental Data Types

**Integer Types**
\`\`\`cpp
// Signed integers
char c = -128;           // 1 byte
short s = -32768;        // 2 bytes
int i = -2147483648;     // 4 bytes
long l = -2147483648L;   // 4 or 8 bytes
long long ll = -9223372036854775807LL;  // 8 bytes

// Unsigned integers
unsigned char uc = 255;
unsigned short us = 65535;
unsigned int ui = 4294967295U;
unsigned long ul = 4294967295UL;
unsigned long long ull = 18446744073709551615ULL;

// Fixed-width integers (C++11)
#include <cstdint>
int8_t i8 = -128;
uint8_t ui8 = 255;
int16_t i16 = -32768;
uint16_t ui16 = 65535;
int32_t i32 = -2147483648;
uint32_t ui32 = 4294967295U;
int64_t i64 = -9223372036854775807LL;
uint64_t ui64 = 18446744073709551615ULL;
\`\`\`

**Floating-Point Types**
\`\`\`cpp
float f = 3.14f;         // 4 bytes
double d = 3.14159265;   // 8 bytes
long double ld = 3.14159265358979L;  // 10+ bytes
\`\`\`

**Boolean Type**
\`\`\`cpp
bool isValid = true;
bool isComplete = false;

// Can convert to/from integers
bool flag = 1;    // true
int value = true; // 1
\`\`\`

**Character Types**
\`\`\`cpp
char ch = 'A';           // Single byte character
wchar_t wch = L'Ω';      // Wide character
char16_t c16 = u'A';     // UTF-16 character (C++11)
char32_t c32 = U'A';     // UTF-32 character (C++11)
\`\`\`

### String Types

**C-style Strings**
\`\`\`cpp
char str1[] = "Hello";
const char* str2 = "World";
\`\`\`

**C++ String Class**
\`\`\`cpp
#include <string>

string name = "Alice";
string greeting = "Hello, " + name;

// String methods
int length = name.length();
string upper = name;
// C++ strings don't have built-in toUpper, use algorithm
\`\`\`

### Constants

**Using const keyword**
\`\`\`cpp
const double PI = 3.14159;
const int MAX_SIZE = 100;
const string APP_NAME = "MyApp";

// const pointers
const int* ptr1;        // Pointer to constant int
int* const ptr2 = &x;   // Constant pointer to int
const int* const ptr3 = &x;  // Constant pointer to constant int
\`\`\`

**Using constexpr (C++11)**
\`\`\`cpp
constexpr int MAX_VALUE = 100;
constexpr double PI = 3.14159;

constexpr int square(int x) {
    return x * x;
}

constexpr int result = square(5);  // Computed at compile-time
\`\`\`

### References

C++ introduces references, which are aliases to existing variables:

\`\`\`cpp
int x = 10;
int& ref = x;    // ref is a reference to x

ref = 20;        // Changes x to 20
cout << x;       // Outputs: 20

// References must be initialized
// int& ref2;    // Error!

// References cannot be reassigned
int y = 30;
ref = y;         // This copies y's value to x, doesn't change ref
\`\`\`

### Type Aliases

**Using typedef**
\`\`\`cpp
typedef unsigned long ulong;
typedef int* IntPtr;

ulong bigNum = 1000000UL;
IntPtr ptr = &bigNum;
\`\`\`

**Using using (C++11)**
\`\`\`cpp
using ulong = unsigned long;
using IntPtr = int*;

ulong bigNum = 1000000UL;
IntPtr ptr = &bigNum;
\`\`\`

### Type Casting

**C-style Cast**
\`\`\`cpp
double d = 9.99;
int i = (int)d;  // i = 9
\`\`\`

**C++ Style Casts (Preferred)**
\`\`\`cpp
// static_cast (compile-time checks)
double d = 9.99;
int i = static_cast<int>(d);

// const_cast (remove const)
const int ci = 10;
int* ptr = const_cast<int*>(&ci);

// reinterpret_cast (low-level reinterpretation)
int i = 65;
char* ch = reinterpret_cast<char*>(&i);

// dynamic_cast (runtime checks for polymorphic types)
// Used with inheritance
\`\`\`

### Input and Output

**Using iostream**
\`\`\`cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int age;
    double height;
    string name;

    // Input
    cout << "Enter your name: ";
    getline(cin, name);  // Read entire line with spaces

    cout << "Enter your age: ";
    cin >> age;

    cout << "Enter your height: ";
    cin >> height;

    // Output
    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Height: " << fixed << setprecision(2) << height << endl;

    return 0;
}
\`\`\`

### Auto Keyword (C++11)

\`\`\`cpp
auto x = 10;           // int
auto y = 3.14;         // double
auto z = "Hello";      // const char*
auto w = true;         // bool
auto str = string("C++");  // string

// Useful with complex types
vector<int> vec = {1, 2, 3, 4, 5};
auto it = vec.begin();  // vector<int>::iterator
\`\`\``,
        practice: `Practice C++ variables and data types with hands-on examples.

### Exercise 1: Variable Declarations and Initialization
\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Different initialization styles
    int age = 25;              // Copy initialization
    int count(10);             // Direct initialization
    int score{95};             // Uniform initialization (C++11)

    // Auto keyword
    auto pi = 3.14159;         // double
    auto name = string("Alice");  // string
    auto isValid = true;       // bool

    // Multiple variables
    int x = 1, y = 2, z = 3;

    // Constants
    const double GRAVITY = 9.81;
    constexpr int MAX_SIZE = 100;

    // Output
    cout << "Age: " << age << endl;
    cout << "Name: " << name << endl;
    cout << "Pi: " << pi << endl;

    return 0;
}
\`\`\`

### Exercise 2: References and Pointers
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;

    // Reference (alias)
    int& ref = x;
    cout << "x: " << x << ", ref: " << ref << endl;

    ref = 20;  // Changes x
    cout << "After ref = 20:" << endl;
    cout << "x: " << x << ", ref: " << ref << endl;

    // Pointer
    int* ptr = &x;
    cout << "Value at pointer: " << *ptr << endl;
    cout << "Address: " << ptr << endl;

    *ptr = 30;  // Changes x through pointer
    cout << "After *ptr = 30:" << endl;
    cout << "x: " << x << endl;

    // Reference vs Pointer
    // Reference: Cannot be null, cannot be reassigned
    // Pointer: Can be null, can point to different variables

    return 0;
}
\`\`\`

### Exercise 3: String Operations
\`\`\`cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string firstName = "John";
    string lastName = "Doe";

    // Concatenation
    string fullName = firstName + " " + lastName;
    cout << "Full name: " << fullName << endl;

    // String methods
    cout << "Length: " << fullName.length() << endl;
    cout << "First char: " << fullName[0] << endl;
    cout << "Substring: " << fullName.substr(0, 4) << endl;

    // Find and replace
    size_t pos = fullName.find("Doe");
    if (pos != string::npos) {
        fullName.replace(pos, 3, "Smith");
    }
    cout << "After replace: " << fullName << endl;

    // Transform to uppercase
    string upper = fullName;
    transform(upper.begin(), upper.end(), upper.begin(), ::toupper);
    cout << "Uppercase: " << upper << endl;

    // String comparison
    string str1 = "apple";
    string str2 = "banana";
    if (str1 < str2) {
        cout << str1 << " comes before " << str2 << endl;
    }

    return 0;
}
\`\`\`

### Exercise 4: Type Casting and Conversion
\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Implicit conversion
    int i = 10;
    double d = i;  // int to double
    cout << "int to double: " << d << endl;

    // static_cast (preferred in C++)
    double d2 = 9.99;
    int i2 = static_cast<int>(d2);
    cout << "double to int: " << i2 << endl;

    // String to number
    string numStr = "123";
    int num = stoi(numStr);  // string to int
    double numDbl = stod("45.67");  // string to double
    cout << "String to int: " << num << endl;
    cout << "String to double: " << numDbl << endl;

    // Number to string
    int age = 25;
    string ageStr = to_string(age);
    cout << "Number to string: " << ageStr << endl;

    // Character and ASCII
    char ch = 'A';
    int ascii = static_cast<int>(ch);
    cout << "Character: " << ch << ", ASCII: " << ascii << endl;

    return 0;
}
\`\`\`

### Exercise 5: Input and Formatted Output
\`\`\`cpp
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    double height, weight;

    // Input with validation
    cout << "Enter your name: ";
    getline(cin, name);

    cout << "Enter your age: ";
    cin >> age;

    cout << "Enter your height (m): ";
    cin >> height;

    cout << "Enter your weight (kg): ";
    cin >> weight;

    // Formatted output
    cout << "\\n--- Profile ---" << endl;
    cout << "Name: " << name << endl;
    cout << "Age: " << age << " years" << endl;
    cout << fixed << setprecision(2);
    cout << "Height: " << height << " m" << endl;
    cout << "Weight: " << weight << " kg" << endl;

    // Calculate BMI
    double bmi = weight / (height * height);
    cout << "BMI: " << bmi << endl;

    // Table formatting
    cout << "\\n" << setw(15) << left << "Field"
         << setw(15) << "Value" << endl;
    cout << string(30, '-') << endl;
    cout << setw(15) << left << "Name" << setw(15) << name << endl;
    cout << setw(15) << left << "Age" << setw(15) << age << endl;
    cout << setw(15) << left << "BMI" << setw(15) << fixed
         << setprecision(2) << bmi << endl;

    return 0;
}
\`\`\`

### Your Turn
1. Create a program with references and demonstrate aliasing
2. Build a temperature converter using proper casting
3. Practice string manipulation with user input
4. Create a program using auto keyword with different types`,
        challenge: `### Challenge: Build a Personal Finance Tracker

Create a comprehensive personal finance tracker with proper C++ features.

**Requirements:**
1. Use appropriate C++ data types and features
2. Implement classes and objects
3. Use references and const correctness
4. Perform calculations with proper type handling
5. Format output professionally
6. Handle input validation

**Starter Code:**
\`\`\`cpp
#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
using namespace std;

// Constants
const double TAX_RATE = 0.15;
const double SAVINGS_GOAL_PERCENTAGE = 0.20;

// Enum for transaction types
enum class TransactionType {
    Income,
    Expense,
    Savings
};

// Transaction structure
struct Transaction {
    TransactionType type;
    string description;
    double amount;
    string date;
};

// TODO: Implement the FinanceTracker class
class FinanceTracker {
private:
    string ownerName;
    double totalIncome;
    double totalExpenses;
    double totalSavings;
    vector<Transaction> transactions;

public:
    // Constructor
    FinanceTracker(const string& name) {
        // TODO: Initialize member variables
    }

    // Add transaction
    void addTransaction(TransactionType type, const string& desc,
                       double amount, const string& date) {
        // TODO: Validate amount > 0
        // TODO: Create transaction and add to vector
        // TODO: Update totals based on transaction type
    }

    // Calculate net income
    double calculateNetIncome() const {
        // TODO: Return total income - total expenses
        return 0.0;
    }

    // Calculate savings percentage
    double calculateSavingsPercentage() const {
        // TODO: Return (totalSavings / totalIncome) * 100
        // TODO: Handle division by zero
        return 0.0;
    }

    // Calculate tax on income
    double calculateTax() const {
        // TODO: Return totalIncome * TAX_RATE
        return 0.0;
    }

    // Calculate income after tax
    double calculateIncomeAfterTax() const {
        // TODO: Return totalIncome - calculateTax()
        return 0.0;
    }

    // Get savings goal amount
    double getSavingsGoal() const {
        // TODO: Return totalIncome * SAVINGS_GOAL_PERCENTAGE
        return 0.0;
    }

    // Check if meeting savings goal
    bool isMeetingSavingsGoal() const {
        // TODO: Compare totalSavings with getSavingsGoal()
        return false;
    }

    // Print summary
    void printSummary() const {
        // TODO: Print formatted financial summary
        // Include:
        // - Owner name
        // - Total income
        // - Total expenses
        // - Total savings
        // - Net income
        // - Tax amount
        // - Income after tax
        // - Savings percentage
        // - Savings goal
        // - Goal status
    }

    // Print all transactions
    void printTransactions() const {
        // TODO: Print all transactions in table format
    }

    // Get transaction type as string
    static string transactionTypeToString(TransactionType type) {
        // TODO: Convert enum to string
        return "";
    }
};

// Helper function to get transaction type from user
TransactionType getTransactionTypeFromInput() {
    int choice;
    cout << "\\nTransaction Type:" << endl;
    cout << "1. Income" << endl;
    cout << "2. Expense" << endl;
    cout << "3. Savings" << endl;
    cout << "Choice: ";
    cin >> choice;

    // TODO: Validate and return appropriate TransactionType
    return TransactionType::Income;
}

int main() {
    string name;
    cout << "==================================" << endl;
    cout << "  PERSONAL FINANCE TRACKER" << endl;
    cout << "==================================" << endl;

    cout << "\\nEnter your name: ";
    getline(cin, name);

    FinanceTracker tracker(name);

    int numTransactions;
    cout << "How many transactions to enter? ";
    cin >> numTransactions;
    cin.ignore();  // Clear newline

    // Enter transactions
    for (int i = 0; i < numTransactions; i++) {
        cout << "\\n--- Transaction " << (i + 1) << " ---" << endl;

        TransactionType type = getTransactionTypeFromInput();
        cin.ignore();

        string description;
        cout << "Description: ";
        getline(cin, description);

        double amount;
        cout << "Amount: $";
        cin >> amount;
        cin.ignore();

        string date;
        cout << "Date (YYYY-MM-DD): ";
        getline(cin, date);

        tracker.addTransaction(type, description, amount, date);
    }

    // Display summary
    cout << "\\n==================================" << endl;
    tracker.printSummary();

    cout << "\\n==================================" << endl;
    tracker.printTransactions();

    return 0;
}
\`\`\`

**Expected Output:**
\`\`\`
==================================
  PERSONAL FINANCE TRACKER
==================================

Enter your name: Alice Johnson
How many transactions to enter? 4

--- Transaction 1 ---
Transaction Type:
1. Income
2. Expense
3. Savings
Choice: 1
Description: Monthly Salary
Amount: $5000
Date (YYYY-MM-DD): 2024-01-01

... (more transactions)

==================================
FINANCIAL SUMMARY
==================================
Owner: Alice Johnson

Income:          $5,000.00
Expenses:        $2,500.00
Savings:         $1,000.00
----------------------------------
Net Income:      $2,500.00
Tax (15%):       $750.00
After Tax:       $4,250.00
----------------------------------
Savings Rate:    20.00%
Savings Goal:    $1,000.00 (20%)
Status:          ✓ Goal Met!
==================================
\`\`\`

**Bonus Challenges:**
1. Add category support for expenses (food, rent, entertainment)
2. Implement budget limits per category
3. Add monthly/yearly reporting
4. Calculate average expenses per category
5. Implement data persistence (save/load from file)
6. Add investment tracking with returns
7. Create charts using ASCII art
8. Add recurring transaction support
9. Implement currency conversion
10. Add spending trend analysis`
      }
    }
  }
};

// Tutorial metadata for each language
const tutorialTopics = [
  // Beginner (1-17)
  { slug: 'variables-datatypes', title: 'Variables and Data Types', difficulty: 'beginner', order: 1 },
  { slug: 'operators-expressions', title: 'Operators and Expressions', difficulty: 'beginner', order: 2 },
  { slug: 'control-flow', title: 'Control Flow (if/else, switch)', difficulty: 'beginner', order: 3 },
  { slug: 'loops', title: 'Loops (for, while, do-while)', difficulty: 'beginner', order: 4 },
  { slug: 'functions-basics', title: 'Functions Basics', difficulty: 'beginner', order: 5 },
  { slug: 'arrays-basics', title: 'Arrays and Lists Basics', difficulty: 'beginner', order: 6 },
  { slug: 'string-manipulation', title: 'String Manipulation', difficulty: 'beginner', order: 7 },
  { slug: 'input-output', title: 'Basic Input and Output', difficulty: 'beginner', order: 8 },
  { slug: 'comments-docs', title: 'Comments and Documentation', difficulty: 'beginner', order: 9 },
  { slug: 'error-handling-basics', title: 'Error Handling Basics', difficulty: 'beginner', order: 10 },
  { slug: 'working-with-numbers', title: 'Working with Numbers', difficulty: 'beginner', order: 11 },
  { slug: 'boolean-logic', title: 'Boolean Logic and Conditions', difficulty: 'beginner', order: 12 },
  { slug: 'type-conversion', title: 'Type Conversion and Casting', difficulty: 'beginner', order: 13 },
  { slug: 'constants', title: 'Constants and Immutability', difficulty: 'beginner', order: 14 },
  { slug: 'debugging-basics', title: 'Basic Debugging Techniques', difficulty: 'beginner', order: 15 },
  { slug: 'code-organization', title: 'Code Organization Best Practices', difficulty: 'beginner', order: 16 },
  { slug: 'first-program', title: 'Your First Complete Program', difficulty: 'beginner', order: 17 },

  // Intermediate (18-35)
  { slug: 'advanced-functions', title: 'Advanced Functions (Closures, Callbacks)', difficulty: 'intermediate', order: 18 },
  { slug: 'oop-intro', title: 'Object-Oriented Programming Introduction', difficulty: 'intermediate', order: 19 },
  { slug: 'classes-objects', title: 'Classes and Objects', difficulty: 'intermediate', order: 20 },
  { slug: 'inheritance', title: 'Inheritance and Class Hierarchies', difficulty: 'intermediate', order: 21 },
  { slug: 'polymorphism', title: 'Polymorphism and Method Overriding', difficulty: 'intermediate', order: 22 },
  { slug: 'encapsulation', title: 'Encapsulation and Access Modifiers', difficulty: 'intermediate', order: 23 },
  { slug: 'file-io', title: 'File Input and Output', difficulty: 'intermediate', order: 24 },
  { slug: 'exception-handling', title: 'Exception Handling and Try-Catch', difficulty: 'intermediate', order: 25 },
  { slug: 'regular-expressions', title: 'Regular Expressions', difficulty: 'intermediate', order: 26 },
  { slug: 'modules-packages', title: 'Modules and Packages', difficulty: 'intermediate', order: 27 },
  { slug: 'data-structures', title: 'Data Structures (Stack, Queue, LinkedList)', difficulty: 'intermediate', order: 28 },
  { slug: 'recursion', title: 'Recursion and Recursive Algorithms', difficulty: 'intermediate', order: 29 },
  { slug: 'sorting-algorithms', title: 'Sorting Algorithms', difficulty: 'intermediate', order: 30 },
  { slug: 'searching-algorithms', title: 'Searching Algorithms', difficulty: 'intermediate', order: 31 },
  { slug: 'hash-tables', title: 'Hash Tables and Maps', difficulty: 'intermediate', order: 32 },
  { slug: 'sets', title: 'Sets and Set Operations', difficulty: 'intermediate', order: 33 },
  { slug: 'advanced-strings', title: 'Advanced String Operations', difficulty: 'intermediate', order: 34 },
  { slug: 'date-time', title: 'Date and Time Handling', difficulty: 'intermediate', order: 35 },

  // Advanced (36-50)
  { slug: 'design-patterns', title: 'Design Patterns', difficulty: 'advanced', order: 36 },
  { slug: 'async-programming', title: 'Asynchronous Programming', difficulty: 'advanced', order: 37 },
  { slug: 'concurrency', title: 'Multithreading and Concurrency', difficulty: 'advanced', order: 38 },
  { slug: 'memory-management', title: 'Memory Management', difficulty: 'advanced', order: 39 },
  { slug: 'performance-optimization', title: 'Performance Optimization', difficulty: 'advanced', order: 40 },
  { slug: 'testing-tdd', title: 'Testing and Test-Driven Development', difficulty: 'advanced', order: 41 },
  { slug: 'debugging-advanced', title: 'Advanced Debugging Techniques', difficulty: 'advanced', order: 42 },
  { slug: 'generics', title: 'Generics and Templates', difficulty: 'advanced', order: 43 },
  { slug: 'metaprogramming', title: 'Metaprogramming', difficulty: 'advanced', order: 44 },
  { slug: 'reflection', title: 'Reflection and Introspection', difficulty: 'advanced', order: 45 },
  { slug: 'decorators', title: 'Decorators and Annotations', difficulty: 'advanced', order: 46 },
  { slug: 'functional-programming', title: 'Functional Programming Concepts', difficulty: 'advanced', order: 47 },
  { slug: 'lambdas-streams', title: 'Lambdas and Streams', difficulty: 'advanced', order: 48 },
  { slug: 'api-development', title: 'API Development', difficulty: 'advanced', order: 49 },
  { slug: 'database-integration', title: 'Database Integration', difficulty: 'advanced', order: 50 }
];

// Generate comprehensive content for a tutorial
function generateTutorialContent(language, topic, topicIndex) {
  const langLibrary = contentLibrary[language];
  const topicSlug = topic.slug;

  // Get specific content if available, otherwise use generic template
  const topicContent = langLibrary?.topics?.[topicSlug] || {
    learn: `This tutorial covers ${topic.title} in ${language.toUpperCase()}.

### Introduction
${topic.title} is an essential concept in ${language} programming. Understanding this topic will help you write more efficient and maintainable code.

### Key Concepts
- Core principles and fundamentals
- Best practices and patterns
- Common use cases and applications
- Real-world examples

### Why It Matters
Mastering ${topic.title} is crucial for:
- Writing clean, efficient code
- Avoiding common pitfalls
- Building scalable applications
- Following industry standards

This comprehensive lesson will take you through everything you need to know about ${topic.title} in ${language}.`,
    practice: `Let's practice ${topic.title} with hands-on exercises and examples.

### Exercise 1: Basic Implementation
Practice the fundamental concepts with simple examples.

### Exercise 2: Intermediate Applications
Apply your knowledge to more complex scenarios.

### Exercise 3: Real-World Examples
Work with practical, real-world use cases.

### Your Turn
Now it's time to practice on your own. Try implementing variations of the examples above.`,
    challenge: `### Challenge: ${topic.title} Project

Put your knowledge to the test with this comprehensive challenge.

**Requirements:**
1. Implement the core functionality
2. Handle edge cases
3. Follow best practices
4. Write clean, maintainable code
5. Test your implementation thoroughly

**Starter Code:**
\`\`\`${getLanguageFormatKey(language)}
// TODO: Implement your solution here
\`\`\`

**Test Cases:**
Create test cases to verify your implementation works correctly.

**Bonus Challenges:**
1. Optimize for performance
2. Add error handling
3. Implement advanced features
4. Refactor for better design`
  };

  // Create language-appropriate code examples
  const languageKey = getLanguageFormatKey(language);
  const starterCode = generateStarterCode(language, topic);

  return [
    {
      stepNumber: 1,
      title: `Learn: ${topic.title}`,
      content: topicContent.learn,
      codeExamples: [],
      hints: [
        'Read through the concepts carefully and take notes',
        'Try to understand the "why" behind each concept',
        'Relate new concepts to what you already know',
        'Don\'t rush - take time to absorb the information'
      ],
      expectedOutput: '',
      isCompleted: false
    },
    {
      stepNumber: 2,
      title: `Practice: ${topic.title}`,
      content: topicContent.practice,
      codeExamples: [
        {
          language: languageKey,
          code: starterCode,
          explanation: `Practice ${topic.title} with this hands-on exercise. Modify the code, experiment with different approaches, and test your understanding.`,
          isExecutable: ['javascript', 'python', 'typescript'].includes(language)
        }
      ],
      hints: [
        'Start with the simplest example first',
        'Test your code frequently to catch errors early',
        'Try modifying the examples to see what happens',
        'Use console output to debug and understand the flow'
      ],
      expectedOutput: 'Results will vary based on your implementation. Focus on understanding the concepts rather than getting a specific output.',
      isCompleted: false
    },
    {
      stepNumber: 3,
      title: `Challenge: ${topic.title}`,
      content: topicContent.challenge,
      codeExamples: [
        {
          language: languageKey,
          code: generateChallengeCode(language, topic),
          explanation: `Complete this challenge to demonstrate your mastery of ${topic.title}. Implement all requirements and test thoroughly.`,
          isExecutable: ['javascript', 'python', 'typescript'].includes(language)
        }
      ],
      hints: [
        'Break down the problem into smaller sub-problems',
        'Refer back to the learning and practice sections if needed',
        'Test edge cases and error conditions',
        'Refactor your code for clarity and efficiency'
      ],
      expectedOutput: 'Your solution should handle all test cases correctly. Verify your implementation matches the requirements.',
      isCompleted: false
    }
  ];
}

// Helper function to get language format key
function getLanguageFormatKey(language) {
  const mapping = {
    'javascript': 'javascript',
    'python': 'python',
    'java': 'java',
    'typescript': 'typescript',
    'c': 'c',
    'cpp': 'cpp'
  };
  return mapping[language] || 'javascript';
}

// Generate starter code based on language and topic
function generateStarterCode(language, topic) {
  const templates = {
    javascript: `// ${topic.title} Practice\n// Try the examples and experiment with the code\n\nconsole.log("Starting ${topic.title} practice...");\n\n// Your code here\n`,
    python: `# ${topic.title} Practice\n# Try the examples and experiment with the code\n\nprint("Starting ${topic.title} practice...")\n\n# Your code here\n`,
    java: `// ${topic.title} Practice\npublic class Practice {\n    public static void main(String[] args) {\n        System.out.println("Starting ${topic.title} practice...");\n        \n        // Your code here\n    }\n}\n`,
    typescript: `// ${topic.title} Practice\n// Try the examples and experiment with the code\n\nconsole.log("Starting ${topic.title} practice...");\n\n// Your code here\n`,
    c: `// ${topic.title} Practice\n#include <stdio.h>\n\nint main() {\n    printf("Starting ${topic.title} practice...\\n");\n    \n    // Your code here\n    \n    return 0;\n}\n`,
    cpp: `// ${topic.title} Practice\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Starting ${topic.title} practice..." << endl;\n    \n    // Your code here\n    \n    return 0;\n}\n`
  };

  return templates[language] || templates.javascript;
}

// Generate challenge code template
function generateChallengeCode(language, topic) {
  const templates = {
    javascript: `// Challenge: ${topic.title}\n// Implement the requirements below\n\n// TODO: Implement your solution here\n\nfunction solution() {\n    // Your implementation\n}\n\n// Test your solution\nconsole.log(solution());\n`,
    python: `# Challenge: ${topic.title}\n# Implement the requirements below\n\n# TODO: Implement your solution here\n\ndef solution():\n    # Your implementation\n    pass\n\n# Test your solution\nprint(solution())\n`,
    java: `// Challenge: ${topic.title}\npublic class Challenge {\n    // TODO: Implement your solution here\n    \n    public static void solution() {\n        // Your implementation\n    }\n    \n    public static void main(String[] args) {\n        solution();\n    }\n}\n`,
    typescript: `// Challenge: ${topic.title}\n// Implement the requirements below\n\n// TODO: Implement your solution here\n\nfunction solution(): void {\n    // Your implementation\n}\n\n// Test your solution\nsolution();\n`,
    c: `// Challenge: ${topic.title}\n#include <stdio.h>\n\n// TODO: Implement your solution here\n\nvoid solution() {\n    // Your implementation\n}\n\nint main() {\n    solution();\n    return 0;\n}\n`,
    cpp: `// Challenge: ${topic.title}\n#include <iostream>\nusing namespace std;\n\n// TODO: Implement your solution here\n\nvoid solution() {\n    // Your implementation\n}\n\nint main() {\n    solution();\n    return 0;\n}\n`
  };

  return templates[language] || templates.javascript;
}

// Generate slug
function generateSlug(language, topicIndex, title) {
  const number = topicIndex + 1;
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return `${language}-${number}-${titleSlug}`;
}

// Main seeding function
async function seedProgrammingTutorials() {
  try {
    console.log('🚀 Starting comprehensive programming tutorials seed...\n');

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const languages = ['javascript', 'python', 'java', 'typescript', 'c', 'cpp'];
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const language of languages) {
      console.log(`\n📚 Processing ${language.toUpperCase()} tutorials...`);

      for (let i = 0; i < tutorialTopics.length; i++) {
        const topic = tutorialTopics[i];
        const slug = generateSlug(language, i, topic.title);

        // Check if tutorial already exists
        const existing = await MongoTutorial.findOne({ slug });

        const tutorialData = {
          title: `${language.toUpperCase()}: ${topic.title}`,
          slug: slug,
          description: `Master ${topic.title} in ${language.toUpperCase()} with hands-on examples, practice exercises, and real-world challenges. Learn through a comprehensive 3-step approach: Learn, Practice, and Challenge.`,
          category: 'Programming Fundamentals',
          language: language === 'cpp' ? 'cpp' : language,
          difficulty: topic.difficulty,
          estimatedTime: topic.difficulty === 'beginner' ? 30 : topic.difficulty === 'intermediate' ? 45 : 60,
          thumbnail: '',
          tags: [language, topic.difficulty, 'programming', topic.slug],
          prerequisites: i > 0 ? [`${language}-${i}-${tutorialTopics[i-1].slug}`] : [],
          learningObjectives: [
            `Understand core concepts of ${topic.title}`,
            `Apply ${topic.title} in practical scenarios`,
            `Master best practices and common patterns`,
            `Build real-world projects using ${topic.title}`
          ],
          steps: generateTutorialContent(language, topic, i),
          quiz: [],
          resources: [
            {
              title: `${language.toUpperCase()} Official Documentation`,
              url: `https://docs.${language}.org`,
              type: 'documentation'
            }
          ],
          author: {
            name: 'Seek Learning Platform',
            email: 'learn@seekplatform.com',
            bio: 'Comprehensive programming tutorials for all skill levels'
          },
          isPublished: true,
          isFeatured: [1, 3, 6, 10, 18, 20, 36, 40].includes(i + 1),
          rating: {
            average: 4.5 + Math.random() * 0.5,
            count: Math.floor(Math.random() * 100) + 50
          },
          stats: {
            views: Math.floor(Math.random() * 1000) + 100,
            completions: Math.floor(Math.random() * 500) + 50,
            likes: Math.floor(Math.random() * 200) + 20
          },
          seo: {
            metaTitle: `Learn ${topic.title} in ${language.toUpperCase()} | Seek Platform`,
            metaDescription: `Comprehensive ${topic.title} tutorial for ${language.toUpperCase()}. Learn with hands-on examples and challenges.`,
            keywords: [language, topic.title, 'tutorial', 'programming', topic.difficulty]
          }
        };

        if (existing) {
          await MongoTutorial.findOneAndUpdate({ slug }, tutorialData);
          totalUpdated++;
        } else {
          await MongoTutorial.create(tutorialData);
          totalCreated++;
        }

        if ((i + 1) % 10 === 0) {
          console.log(`   ✓ Processed ${i + 1}/${tutorialTopics.length} ${language} tutorials`);
        }
      }

      console.log(`✅ Completed ${language.toUpperCase()}: 50 tutorials`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📊 Statistics:`);
    console.log(`   • Languages: ${languages.length}`);
    console.log(`   • Tutorials per language: 50`);
    console.log(`   • Total tutorials: ${languages.length * tutorialTopics.length}`);
    console.log(`   • Created: ${totalCreated}`);
    console.log(`   • Updated: ${totalUpdated}`);
    console.log(`   • Beginner: ${tutorialTopics.filter(t => t.difficulty === 'beginner').length} per language`);
    console.log(`   • Intermediate: ${tutorialTopics.filter(t => t.difficulty === 'intermediate').length} per language`);
    console.log(`   • Advanced: ${tutorialTopics.filter(t => t.difficulty === 'advanced').length} per language`);
    console.log('='.repeat(60));

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('\n❌ Error seeding tutorials:', error);
    process.exit(1);
  }
}

// Run the seed script
if (require.main === module) {
  seedProgrammingTutorials();
}

module.exports = seedProgrammingTutorials;
