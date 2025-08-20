require('dotenv').config();
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');
const logger = require('../config/logger');

const javaTutorials = [
  {
    title: 'Java Fundamentals: Getting Started with Programming',
    slug: 'java-fundamentals-getting-started',
    description: 'Learn the basics of Java programming including variables, data types, operators, and control structures. Perfect for beginners starting their Java journey.',
    language: 'java',
    difficulty: 'beginner',
    category: 'Programming Fundamentals',
    estimatedTime: 180, // 3 hours
    isFeatured: true,
    isPublished: true,
    author: {
      name: 'Java Expert Team',
      email: 'java@seek.com'
    },
    tags: ['java', 'basics', 'variables', 'data-types', 'fundamentals'],
    prerequisites: [],
    learningObjectives: [
      'Understand Java syntax and basic concepts',
      'Learn about variables and data types',
      'Master control flow statements',
      'Write your first Java programs'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Introduction to Java',
        content: `# Introduction to Java

Java is a powerful, object-oriented programming language that's widely used for enterprise applications, web development, and Android mobile apps.

## Key Features of Java:
- **Platform Independent**: Write once, run anywhere
- **Object-Oriented**: Everything is an object
- **Secure**: Built-in security features
- **Robust**: Strong memory management

## Setting Up Java Development Environment

First, you'll need to install the Java Development Kit (JDK).

## Your First Java Program

\`\`\`java
// Your first Java program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to Java programming!");
    }
}
\`\`\`

This is a basic Java program that prints messages to the console. Every Java program starts with a class definition and the main method.

**Exercise:** Create a Java program that prints your name and age.`,
        codeExamples: [{
          language: 'java',
          code: `// Your first Java program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to Java programming!");
    }
}`,
          explanation: 'This is a basic Java program that prints messages to the console. Every Java program starts with a class definition and the main method.',
          isExecutable: true
        }]
      },
      {
        stepNumber: 2,
        title: 'Variables and Data Types',
        content: `# Variables and Data Types in Java

Java is a strongly typed language, meaning every variable must have a declared type.

## Primitive Data Types:
- **int**: Integer numbers
- **double**: Decimal numbers
- **boolean**: true or false
- **char**: Single characters
- **String**: Text (reference type)

\`\`\`java
public class DataTypes {
    public static void main(String[] args) {
        // Integer variable
        int age = 25;
        
        // Double for decimal numbers
        double salary = 50000.50;
        
        // Boolean for true/false
        boolean isStudent = true;
        
        // Character
        char grade = 'A';
        
        // String for text
        String name = "John Doe";
        
        // Print all variables
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: $" + salary);
        System.out.println("Is Student: " + isStudent);
        System.out.println("Grade: " + grade);
    }
}
\`\`\`

Variables store data that can be used throughout your program. Each variable has a specific type that determines what kind of data it can hold.

**Exercise:** Create variables for a person's height (double), favorite number (int), and first initial (char).`,
        codeExamples: [{
          language: 'java',
          code: `public class DataTypes {
    public static void main(String[] args) {
        // Integer variable
        int age = 25;
        
        // Double for decimal numbers
        double salary = 50000.50;
        
        // Boolean for true/false
        boolean isStudent = true;
        
        // Character
        char grade = 'A';
        
        // String for text
        String name = "John Doe";
        
        // Print all variables
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: $" + salary);
        System.out.println("Is Student: " + isStudent);
        System.out.println("Grade: " + grade);
    }
}`,
          explanation: 'Variables store data that can be used throughout your program. Each variable has a specific type that determines what kind of data it can hold.',
          isExecutable: true
        }]
      },
      {
        stepNumber: 3,
        title: 'Control Flow - If Statements',
        content: `# Control Flow with If Statements

Control flow statements allow your program to make decisions and execute different code based on conditions.

## If Statement Syntax:
- **if**: Execute code if condition is true
- **else if**: Check another condition
- **else**: Execute if all conditions are false

\`\`\`java
public class ControlFlow {
    public static void main(String[] args) {
        int score = 85;
        
        // If-else if-else statement
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else if (score >= 70) {
            System.out.println("Grade: C");
        } else if (score >= 60) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }
        
        // Boolean conditions
        boolean hasLicense = true;
        int age = 18;
        
        if (age >= 18 && hasLicense) {
            System.out.println("Can drive a car");
        } else {
            System.out.println("Cannot drive a car");
        }
    }
}
\`\`\`

If statements allow your program to make decisions. You can combine conditions using && (and) and || (or) operators.

**Exercise:** Write a program that checks if a number is positive, negative, or zero.`,
        codeExamples: [{
          language: 'java',
          code: `public class ControlFlow {
    public static void main(String[] args) {
        int score = 85;
        
        // If-else if-else statement
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else if (score >= 70) {
            System.out.println("Grade: C");
        } else if (score >= 60) {
            System.out.println("Grade: D");
        } else {
            System.out.println("Grade: F");
        }
        
        // Boolean conditions
        boolean hasLicense = true;
        int age = 18;
        
        if (age >= 18 && hasLicense) {
            System.out.println("Can drive a car");
        } else {
            System.out.println("Cannot drive a car");
        }
    }
}`,
          explanation: 'If statements allow your program to make decisions. You can combine conditions using && (and) and || (or) operators.',
          isExecutable: true
        }]
      }
    ],
    quiz: [
      {
        question: 'What is the correct way to declare an integer variable in Java?',
        type: 'multiple-choice',
        options: [
          { text: 'int number = 10;', isCorrect: true },
          { text: 'integer number = 10;', isCorrect: false },
          { text: 'Integer number = 10;', isCorrect: false },
          { text: 'num number = 10;', isCorrect: false }
        ],
        explanation: "In Java, integers are declared using the 'int' keyword followed by the variable name."
      },
      {
        question: 'Which of the following is NOT a primitive data type in Java?',
        type: 'multiple-choice',
        options: [
          { text: 'int', isCorrect: false },
          { text: 'String', isCorrect: true },
          { text: 'boolean', isCorrect: false },
          { text: 'double', isCorrect: false }
        ],
        explanation: 'String is a reference type, not a primitive data type. The primitive types are int, double, boolean, char, byte, short, long, and float.'
      }
    ],
    resources: [
      {
        title: 'Oracle Java Documentation',
        url: 'https://docs.oracle.com/javase/',
        type: 'documentation'
      },
      {
        title: 'Java Tutorial - Oracle',
        url: 'https://docs.oracle.com/javase/tutorial/',
        type: 'reference'
      }
    ],
    stats: {
      views: 0,
      completions: 0
    },
    rating: {
      average: 0,
      count: 0
    }
  },
  {
    title: 'Object-Oriented Programming in Java',
    slug: 'java-oop-programming',
    description: 'Master the core concepts of Object-Oriented Programming in Java including classes, objects, inheritance, polymorphism, and encapsulation.',
    language: 'java',
    difficulty: 'intermediate',
    category: 'Programming Fundamentals',
    estimatedTime: 240, // 4 hours
    isFeatured: true,
    isPublished: true,
    author: {
      name: 'Java Expert Team',
      email: 'java@seek.com'
    },
    tags: ['java', 'oop', 'classes', 'objects', 'inheritance', 'polymorphism'],
    prerequisites: ['Java Fundamentals'],
    learningObjectives: [
      'Understand classes and objects',
      'Learn about inheritance and polymorphism',
      'Master encapsulation and data hiding',
      'Apply OOP principles in real projects'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Introduction to Classes and Objects',
        content: `# Classes and Objects in Java

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" which contain data (attributes) and code (methods).

## Key Concepts:
- **Class**: A blueprint or template for creating objects
- **Object**: An instance of a class
- **Attributes**: Variables that belong to a class
- **Methods**: Functions that belong to a class

\`\`\`java
// Define a Person class
public class Person {
    // Attributes (instance variables)
    private String name;
    private int age;
    private String email;
    
    // Constructor - special method to create objects
    public Person(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    
    // Methods (behaviors)
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
}
\`\`\`

Classes define the structure and behavior of objects. Objects are instances of classes that hold actual data and can perform actions through methods.

**Exercise:** Create a Car class with attributes like make, model, year, and methods like start(), stop(), and getInfo().`,
        codeExamples: [{
          language: 'java',
          code: `// Define a Person class
public class Person {
    // Attributes (instance variables)
    private String name;
    private int age;
    private String email;
    
    // Constructor - special method to create objects
    public Person(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }
    
    // Methods (behaviors)
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
}`,
          explanation: 'Classes define the structure and behavior of objects. Objects are instances of classes that hold actual data and can perform actions through methods.',
          isExecutable: true
        }]
      },
      {
        stepNumber: 2,
        title: 'Inheritance - Extending Classes',
        content: `# Inheritance in Java

Inheritance allows a new class to be based on an existing class, inheriting its attributes and methods while adding new functionality.

## Key Terms:
- **Superclass (Parent)**: The class being inherited from
- **Subclass (Child)**: The class that inherits from another class
- **extends**: Keyword used to inherit from a class
- **super**: Keyword to access parent class methods/constructor

\`\`\`java
// Superclass (Parent class)
public class Animal {
    protected String name;
    protected String species;
    
    public Animal(String name, String species) {
        this.name = name;
        this.species = species;
    }
    
    public void eat() {
        System.out.println(name + " is eating.");
    }
    
    public void makeSound() {
        System.out.println(name + " makes a sound.");
    }
}

// Subclass (Child class) - Dog inherits from Animal
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name, "Canine"); // Call parent constructor
        this.breed = breed;
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    public void fetch() {
        System.out.println(name + " is fetching the ball!");
    }
}
\`\`\`

Inheritance promotes code reuse and establishes relationships between classes. Child classes inherit parent attributes and methods, and can override or extend functionality.

**Exercise:** Create a Vehicle superclass and Car, Motorcycle subclasses with specific attributes and methods for each type.`,
        codeExamples: [{
          language: 'java',
          code: `// Superclass (Parent class)
public class Animal {
    protected String name;
    protected String species;
    
    public Animal(String name, String species) {
        this.name = name;
        this.species = species;
    }
    
    public void eat() {
        System.out.println(name + " is eating.");
    }
    
    public void makeSound() {
        System.out.println(name + " makes a sound.");
    }
}

// Subclass (Child class) - Dog inherits from Animal
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name, "Canine"); // Call parent constructor
        this.breed = breed;
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof! Woof!");
    }
    
    public void fetch() {
        System.out.println(name + " is fetching the ball!");
    }
}`,
          explanation: 'Inheritance promotes code reuse and establishes relationships between classes. Child classes inherit parent attributes and methods, and can override or extend functionality.',
          isExecutable: true
        }]
      }
    ],
    quiz: [
      {
        question: 'What is encapsulation in Java?',
        type: 'multiple-choice',
        options: [
          { text: 'Creating multiple classes', isCorrect: false },
          { text: 'Bundling data and methods together and restricting access', isCorrect: true },
          { text: 'Inheriting from parent classes', isCorrect: false },
          { text: 'Overriding methods', isCorrect: false }
        ],
        explanation: "Encapsulation is the bundling of data and methods within a class and controlling access to protect the object's internal state."
      },
      {
        question: 'Which keyword is used to inherit from a class in Java?',
        type: 'multiple-choice',
        options: [
          { text: 'inherit', isCorrect: false },
          { text: 'extends', isCorrect: true },
          { text: 'implements', isCorrect: false },
          { text: 'super', isCorrect: false }
        ],
        explanation: "'extends' is the keyword used in Java to create inheritance relationships between classes."
      }
    ],
    resources: [
      {
        title: 'Java OOP Concepts - Oracle',
        url: 'https://docs.oracle.com/javase/tutorial/java/concepts/',
        type: 'reference'
      },
      {
        title: 'Inheritance in Java',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
        type: 'documentation'
      }
    ],
    stats: {
      views: 0,
      completions: 0
    },
    rating: {
      average: 0,
      count: 0
    }
  },
  {
    title: 'Java Data Structures and Collections',
    slug: 'java-data-structures-collections',
    description: "Learn about Java's built-in data structures including Arrays, ArrayList, HashMap, and other collections framework classes.",
    language: 'java',
    difficulty: 'intermediate',
    category: 'Data Structures',
    estimatedTime: 200, // 3.3 hours
    isFeatured: false,
    isPublished: true,
    author: {
      name: 'Java Expert Team',
      email: 'java@seek.com'
    },
    tags: ['java', 'data-structures', 'collections', 'arrays', 'arraylist', 'hashmap'],
    prerequisites: ['Java Fundamentals', 'Object-Oriented Programming in Java'],
    learningObjectives: [
      'Understand Arrays and their operations',
      'Master ArrayList and dynamic arrays',
      'Learn HashMap and key-value storage',
      'Explore other collection classes'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Arrays in Java',
        content: `# Arrays in Java

Arrays are containers that hold multiple values of the same type in a fixed-size sequential collection.

## Key Features:
- **Fixed size**: Size is determined when created
- **Same type**: All elements must be the same data type
- **Zero-indexed**: First element is at index 0
- **Random access**: Direct access to any element by index

\`\`\`java
public class ArraysExample {
    public static void main(String[] args) {
        // Declaring and initializing arrays
        int[] numbers = {10, 20, 30, 40, 50};
        String[] names = new String[5]; // Array of size 5
        
        // Initialize string array
        names[0] = "Alice";
        names[1] = "Bob";
        names[2] = "Charlie";
        
        // Accessing array elements
        System.out.println("First number: " + numbers[0]);
        System.out.println("Third name: " + names[2]);
        
        // Array length
        System.out.println("Numbers array length: " + numbers.length);
        
        // Iterate through array using for loop
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Index " + i + ": " + numbers[i]);
        }
        
        // Enhanced for loop (for-each)
        for (String name : names) {
            if (name != null) {
                System.out.println("Name: " + name);
            }
        }
    }
}
\`\`\`

Arrays provide efficient storage and access for multiple values of the same type. They're fundamental to many algorithms and data processing tasks.

**Exercise:** Create a program that finds the second largest number in an array and counts how many times each number appears.`,
        codeExamples: [{
          language: 'java',
          code: `public class ArraysExample {
    public static void main(String[] args) {
        // Declaring and initializing arrays
        int[] numbers = {10, 20, 30, 40, 50};
        String[] names = new String[5]; // Array of size 5
        
        // Initialize string array
        names[0] = "Alice";
        names[1] = "Bob";
        names[2] = "Charlie";
        
        // Accessing array elements
        System.out.println("First number: " + numbers[0]);
        System.out.println("Third name: " + names[2]);
        
        // Array length
        System.out.println("Numbers array length: " + numbers.length);
        
        // Iterate through array using for loop
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Index " + i + ": " + numbers[i]);
        }
        
        // Enhanced for loop (for-each)
        for (String name : names) {
            if (name != null) {
                System.out.println("Name: " + name);
            }
        }
    }
}`,
          explanation: "Arrays provide efficient storage and access for multiple values of the same type. They're fundamental to many algorithms and data processing tasks.",
          isExecutable: true
        }]
      },
      {
        stepNumber: 2,
        title: 'ArrayList - Dynamic Arrays',
        content: `# ArrayList in Java

ArrayList is a resizable array implementation that can grow and shrink dynamically. It's part of Java's Collections Framework.

## Advantages over Arrays:
- **Dynamic size**: Can grow and shrink as needed
- **Built-in methods**: Many useful methods for manipulation
- **Type safety**: Can use generics for type checking
- **Easy to use**: Simplified syntax for common operations

\`\`\`java
import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {
        // Create ArrayList
        ArrayList<String> fruits = new ArrayList<>();
        
        // Add elements
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Orange");
        fruits.add("Grapes");
        
        System.out.println("Initial fruits: " + fruits);
        System.out.println("Size: " + fruits.size());
        
        // Access elements
        System.out.println("First fruit: " + fruits.get(0));
        
        // Insert element at specific position
        fruits.add(1, "Mango");
        System.out.println("After adding Mango: " + fruits);
        
        // Update element
        fruits.set(2, "Pineapple");
        System.out.println("After updating: " + fruits);
        
        // Check if element exists
        if (fruits.contains("Apple")) {
            System.out.println("Apple is in the list");
        }
        
        // Remove elements
        fruits.remove("Grapes");
        System.out.println("After removing Grapes: " + fruits);
        
        // Iterate through ArrayList
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }
    }
}
\`\`\`

ArrayList provides dynamic sizing and many convenient methods for list operations. It's ideal when you need a resizable array with built-in functionality.

**Exercise:** Create a student grade management system using ArrayList that can add grades, calculate GPA, and find highest/lowest grades.`,
        codeExamples: [{
          language: 'java',
          code: `import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {
        // Create ArrayList
        ArrayList<String> fruits = new ArrayList<>();
        
        // Add elements
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Orange");
        fruits.add("Grapes");
        
        System.out.println("Initial fruits: " + fruits);
        System.out.println("Size: " + fruits.size());
        
        // Access elements
        System.out.println("First fruit: " + fruits.get(0));
        
        // Insert element at specific position
        fruits.add(1, "Mango");
        System.out.println("After adding Mango: " + fruits);
        
        // Update element
        fruits.set(2, "Pineapple");
        System.out.println("After updating: " + fruits);
        
        // Check if element exists
        if (fruits.contains("Apple")) {
            System.out.println("Apple is in the list");
        }
        
        // Remove elements
        fruits.remove("Grapes");
        System.out.println("After removing Grapes: " + fruits);
        
        // Iterate through ArrayList
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }
    }
}`,
          explanation: "ArrayList provides dynamic sizing and many convenient methods for list operations. It's ideal when you need a resizable array with built-in functionality.",
          isExecutable: true
        }]
      }
    ],
    quiz: [
      {
        question: 'What is the main advantage of ArrayList over regular arrays?',
        type: 'multiple-choice',
        options: [
          { text: 'ArrayList is faster', isCorrect: false },
          { text: 'ArrayList can dynamically resize', isCorrect: true },
          { text: 'ArrayList uses less memory', isCorrect: false },
          { text: 'ArrayList only stores strings', isCorrect: false }
        ],
        explanation: 'ArrayList can grow and shrink dynamically, while regular arrays have a fixed size once created.'
      }
    ],
    resources: [
      {
        title: 'Java Collections Framework',
        url: 'https://docs.oracle.com/javase/tutorial/collections/',
        type: 'reference'
      },
      {
        title: 'ArrayList Documentation',
        url: 'https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html',
        type: 'documentation'
      }
    ],
    stats: {
      views: 0,
      completions: 0
    },
    rating: {
      average: 0,
      count: 0
    }
  }
];

const seedJavaTutorials = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seek_platform');

    console.log('🌱 Seeding Java tutorials...');

    // Check existing Java tutorials
    const existingJavaTutorials = await MongoTutorial.find({ language: 'java' });
    console.log(`📚 Found ${existingJavaTutorials.length} existing Java tutorials`);

    if (existingJavaTutorials.length > 0) {
      console.log('📚 Java tutorials already exist, skipping seed');
      return;
    }

    // Insert Java tutorials
    const insertedTutorials = await MongoTutorial.insertMany(javaTutorials);
    console.log(`✅ Successfully seeded ${insertedTutorials.length} Java tutorials`);

    // Log the seeded tutorials
    insertedTutorials.forEach((tutorial) => {
      console.log(`   - ${tutorial.title} (${tutorial.difficulty})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Java tutorials:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedJavaTutorials();
}

module.exports = { seedJavaTutorials, javaTutorials };
