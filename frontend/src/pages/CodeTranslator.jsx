import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  ArrowRightIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  LanguageIcon,
  SparklesIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  AcademicCapIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import SimpleCodeEditor from '../components/CodeEditor/SimpleCodeEditor';
import api from '../utils/api';

const CodeTranslator = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [fromLanguage, setFromLanguage] = useState('javascript');
  const [toLanguage, setToLanguage] = useState('python');
  const [isTranslating, setIsTranslating] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [translationSuccess, setTranslationSuccess] = useState(false);

  // Calculate current line count
  const currentLineCount = sourceCode.split('\n').length;

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Comprehensive examples organized by difficulty and category
  const codeExamples = {
    javascript: {
      beginner: [
        {
          title: "Hello World",
          description: "Basic function and variable usage",
          category: "Basics",
          code: `function greet(name) {
    console.log("Hello, " + name + "!");
}

let userName = "World";
greet(userName);`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic operations",
          category: "Functions",
          code: `function calculator(a, b, operation) {
    switch(operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 'Error: Division by zero';
        default: return 'Error: Invalid operation';
    }
}

console.log(calculator(10, 5, '+'));  // 15
console.log(calculator(10, 3, '*'));  // 30`
        },
        {
          title: "Array Operations",
          description: "Working with arrays",
          category: "Data Structures",
          code: `let numbers = [1, 2, 3, 4, 5];

// Filter even numbers
let evenNumbers = numbers.filter(n => n % 2 === 0);
console.log("Even numbers:", evenNumbers);

// Sum all numbers
let sum = numbers.reduce((total, n) => total + n, 0);
console.log("Sum:", sum);

// Square each number
let squares = numbers.map(n => n * n);
console.log("Squares:", squares);`
        }
      ],
      intermediate: [
        {
          title: "Object-Oriented Programming",
          description: "Classes and inheritance",
          category: "OOP",
          code: `class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }

    makeSound() {
        console.log(\`\${this.name} makes a sound\`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name, 'Canine');
        this.breed = breed;
    }

    makeSound() {
        console.log(\`\${this.name} barks!\`);
    }

    fetch() {
        console.log(\`\${this.name} fetches the ball!\`);
    }
}

const myDog = new Dog("Buddy", "Golden Retriever");
myDog.makeSound();
myDog.fetch();`
        },
        {
          title: "Async/Await with Error Handling",
          description: "Asynchronous programming patterns",
          category: "Async",
          code: `async function fetchUserData(userId) {
    try {
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);

        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return null;
    }
}

async function displayUser(userId) {
    const user = await fetchUserData(userId);
    if (user) {
        console.log('User:', user.name);
        console.log('Email:', user.email);
    } else {
        console.log('Failed to load user data');
    }
}

displayUser(123);`
        }
      ],
      advanced: [
        {
          title: "Custom Promise Implementation",
          description: "Advanced async patterns and custom Promise",
          category: "Advanced",
          code: `class CustomPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onResolvedCallbacks.forEach(callback => callback(value));
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.value = reason;
                this.onRejectedCallbacks.forEach(callback => callback(reason));
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onResolved, onRejected) {
        return new CustomPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                try {
                    const result = onResolved ? onResolved(this.value) : this.value;
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            } else if (this.state === 'rejected') {
                if (onRejected) {
                    try {
                        const result = onRejected(this.value);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(this.value);
                }
            } else {
                this.onResolvedCallbacks.push((value) => {
                    try {
                        const result = onResolved ? onResolved(value) : value;
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });

                this.onRejectedCallbacks.push((reason) => {
                    if (onRejected) {
                        try {
                            const result = onRejected(reason);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(reason);
                    }
                });
            }
        });
    }
}

// Usage example
const promise = new CustomPromise((resolve, reject) => {
    setTimeout(() => resolve("Success!"), 1000);
});

promise.then(result => {
    console.log(result);
    return result.toUpperCase();
}).then(upperResult => {
    console.log("Uppercase:", upperResult);
});`
        }
      ]
    },
    python: {
      beginner: [
        {
          title: "Hello World",
          description: "Basic function and variable usage",
          category: "Basics",
          code: `def greet(name):
    print(f"Hello, {name}!")

user_name = "World"
greet(user_name)`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic operations",
          category: "Functions",
          code: `def calculator(a, b, operation):
    operations = {
        '+': lambda x, y: x + y,
        '-': lambda x, y: x - y,
        '*': lambda x, y: x * y,
        '/': lambda x, y: x / y if y != 0 else "Error: Division by zero"
    }

    return operations.get(operation, "Error: Invalid operation")(a, b)

print(calculator(10, 5, '+'))  # 15
print(calculator(10, 3, '*'))  # 30
print(calculator(10, 0, '/'))  # Error: Division by zero`
        },
        {
          title: "List Operations",
          description: "Working with lists",
          category: "Data Structures",
          code: `numbers = [1, 2, 3, 4, 5]

# Filter even numbers
even_numbers = [n for n in numbers if n % 2 == 0]
print("Even numbers:", even_numbers)

# Sum all numbers
total = sum(numbers)
print("Sum:", total)

# Square each number
squares = [n ** 2 for n in numbers]
print("Squares:", squares)

# Using built-in functions
print("Max:", max(numbers))
print("Min:", min(numbers))
print("Length:", len(numbers))`
        }
      ],
      intermediate: [
        {
          title: "Object-Oriented Programming",
          description: "Classes and inheritance",
          category: "OOP",
          code: `class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

    def make_sound(self):
        print(f"{self.name} makes a sound")

    def __str__(self):
        return f"{self.name} ({self.species})"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, 'Canine')
        self.breed = breed

    def make_sound(self):
        print(f"{self.name} barks!")

    def fetch(self):
        print(f"{self.name} fetches the ball!")

# Usage
my_dog = Dog("Buddy", "Golden Retriever")
print(my_dog)
my_dog.make_sound()
my_dog.fetch()`
        },
        {
          title: "Decorators and Context Managers",
          description: "Advanced Python features",
          category: "Advanced",
          code: `import time
import functools
from contextlib import contextmanager

# Decorator for timing functions
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

# Context manager for file operations
@contextmanager
def managed_file(filename, mode):
    try:
        file = open(filename, mode)
        yield file
    finally:
        file.close()
        print(f"File {filename} closed")

# Usage examples
@timer
def slow_function():
    time.sleep(1)
    return "Done!"

result = slow_function()

# Context manager usage
with managed_file("example.txt", "w") as f:
    f.write("Hello, World!")

print("Context manager completed")`
        }
      ],
      advanced: [
        {
          title: "Metaclasses and Descriptors",
          description: "Advanced Python metaclasses",
          category: "Metaprogramming",
          code: `class ValidatedAttribute:
    def __init__(self, validator, name=None):
        self.validator = validator
        self.name = name

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name)

    def __set__(self, instance, value):
        if not self.validator(value):
            raise ValueError(f"Invalid value for {self.name}: {value}")
        instance.__dict__[self.name] = value

class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Person(metaclass=SingletonMeta):
    name = ValidatedAttribute(lambda x: isinstance(x, str) and len(x) > 0)
    age = ValidatedAttribute(lambda x: isinstance(x, int) and 0 <= x <= 150)

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"Person(name='{self.name}', age={self.age})"

# Usage - will always return the same instance due to Singleton
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)  # This will still be Alice!
print(person1)  # Person(name='Alice', age=25)
print(person2)  # Person(name='Alice', age=25)
print(person1 is person2)  # True

# Validation in action
try:
    person1.age = -5  # Will raise ValueError
except ValueError as e:
    print(f"Validation error: {e}")`
        }
      ]
    },
    java: {
      beginner: [
        {
          title: "Hello World",
          description: "Basic class and method structure",
          category: "Basics",
          code: `public class HelloWorld {
    public static void main(String[] args) {
        String name = "World";
        greet(name);
    }

    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic with methods",
          category: "Methods",
          code: `public class Calculator {
    public static void main(String[] args) {
        Calculator calc = new Calculator();

        System.out.println("10 + 5 = " + calc.add(10, 5));
        System.out.println("10 - 3 = " + calc.subtract(10, 3));
        System.out.println("10 * 2 = " + calc.multiply(10, 2));
        System.out.println("10 / 2 = " + calc.divide(10, 2));
    }

    public double add(double a, double b) {
        return a + b;
    }

    public double subtract(double a, double b) {
        return a - b;
    }

    public double multiply(double a, double b) {
        return a * b;
    }

    public double divide(double a, double b) {
        if (b == 0) {
            System.out.println("Error: Division by zero");
            return Double.NaN;
        }
        return a / b;
    }
}`
        }
      ],
      intermediate: [
        {
          title: "Object-Oriented Programming",
          description: "Classes, inheritance, and polymorphism",
          category: "OOP",
          code: `abstract class Animal {
    protected String name;
    protected String species;

    public Animal(String name, String species) {
        this.name = name;
        this.species = species;
    }

    public abstract void makeSound();

    public void displayInfo() {
        System.out.println("Name: " + name + ", Species: " + species);
    }
}

interface Trainable {
    void train(String command);
}

class Dog extends Animal implements Trainable {
    private String breed;

    public Dog(String name, String breed) {
        super(name, "Canine");
        this.breed = breed;
    }

    @Override
    public void makeSound() {
        System.out.println(name + " barks!");
    }

    @Override
    public void train(String command) {
        System.out.println(name + " is learning: " + command);
    }

    public void fetch() {
        System.out.println(name + " fetches the ball!");
    }
}

public class AnimalDemo {
    public static void main(String[] args) {
        Dog myDog = new Dog("Buddy", "Golden Retriever");
        myDog.displayInfo();
        myDog.makeSound();
        myDog.train("sit");
        myDog.fetch();
    }
}`
        }
      ],
      advanced: [
        {
          title: "Generic Collections with Streams",
          description: "Advanced generics and functional programming",
          category: "Generics",
          code: `import java.util.*;
import java.util.stream.*;
import java.util.function.*;

public class GenericExample<T extends Comparable<T>> {
    private List<T> items = new ArrayList<>();

    public void add(T item) {
        items.add(item);
    }

    public Optional<T> findMax() {
        return items.stream().max(T::compareTo);
    }

    public List<T> filterAndSort(Predicate<T> filter) {
        return items.stream()
                   .filter(filter)
                   .sorted()
                   .collect(Collectors.toList());
    }

    public <R> List<R> transformAndCollect(Function<T, R> mapper) {
        return items.stream()
                   .map(mapper)
                   .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        GenericExample<Integer> numbers = new GenericExample<>();
        numbers.add(5);
        numbers.add(2);
        numbers.add(8);
        numbers.add(1);
        numbers.add(9);

        // Find maximum
        numbers.findMax().ifPresent(max ->
            System.out.println("Max: " + max));

        // Filter even numbers and sort
        List<Integer> evenNumbers = numbers.filterAndSort(n -> n % 2 == 0);
        System.out.println("Even numbers: " + evenNumbers);

        // Transform to strings
        List<String> strings = numbers.transformAndCollect(n -> "Number: " + n);
        strings.forEach(System.out::println);

        // Complex stream operations
        Map<Boolean, List<Integer>> partitioned = numbers.items.stream()
            .collect(Collectors.partitioningBy(n -> n > 5));
        System.out.println("Numbers > 5: " + partitioned.get(true));
        System.out.println("Numbers <= 5: " + partitioned.get(false));
    }
}`
        }
      ]
    },
    typescript: {
      beginner: [
        {
          title: "Hello World",
          description: "Basic TypeScript with types",
          category: "Basics",
          code: `function greet(name: string): void {
    console.log(\`Hello, \${name}!\`);
}

const userName: string = "World";
greet(userName);`
        },
        {
          title: "Interface and Types",
          description: "Working with interfaces and custom types",
          category: "Types",
          code: `interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
}

type Role = 'admin' | 'user' | 'guest';

function createUser(userData: Omit<User, 'id'>, role: Role = 'user'): User {
    return {
        id: Math.random(),
        ...userData
    };
}

const newUser = createUser({
    name: "John Doe",
    email: "john@example.com",
    age: 25
}, 'admin');

console.log(newUser);`
        }
      ],
      intermediate: [
        {
          title: "Generic Functions and Classes",
          description: "Advanced TypeScript generics",
          category: "Generics",
          code: `class Repository<T extends { id: string | number }> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    findById(id: T['id']): T | undefined {
        return this.items.find(item => item.id === id);
    }

    getAll(): ReadonlyArray<T> {
        return [...this.items];
    }

    update(id: T['id'], updates: Partial<T>): T | null {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) return null;

        this.items[index] = { ...this.items[index], ...updates };
        return this.items[index];
    }
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
}

const productRepo = new Repository<Product>();
productRepo.add({ id: '1', name: 'Laptop', price: 999, category: 'Electronics' });

const laptop = productRepo.findById('1');
console.log(laptop);`
        }
      ],
      advanced: [
        {
          title: "Advanced Type Manipulation",
          description: "Conditional types and mapped types",
          category: "Advanced Types",
          code: `// Utility types
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type NonNullable<T> = T extends null | undefined ? never : T;

// Conditional types
type ApiResponse<T> = T extends string
    ? { message: T }
    : T extends number
    ? { count: T }
    : T extends boolean
    ? { success: T }
    : { data: T };

// Template literal types
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type MouseEvents = EventName<'click' | 'hover' | 'focus'>;

// Advanced generic constraints
interface Serializable {
    serialize(): string;
}

class DataProcessor<T extends Serializable> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    export(): string {
        return JSON.stringify(
            this.items.map(item => item.serialize())
        );
    }

    process<U>(mapper: (item: T) => U): U[] {
        return this.items.map(mapper);
    }
}

class User implements Serializable {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string
    ) {}

    serialize(): string {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            email: this.email
        });
    }
}

const processor = new DataProcessor<User>();
processor.add(new User('1', 'John', 'john@example.com'));
console.log(processor.export());`
        }
      ]
    },
    cpp: {
      beginner: [
        {
          title: "Hello World",
          description: "Basic C++ structure",
          category: "Basics",
          code: `#include <iostream>
#include <string>
using namespace std;

void greet(const string& name) {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    string userName = "World";
    greet(userName);
    return 0;
}`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic operations",
          category: "Classes",
          code: `#include <iostream>
using namespace std;

class Calculator {
public:
    double add(double a, double b) { return a + b; }
    double subtract(double a, double b) { return a - b; }
    double multiply(double a, double b) { return a * b; }

    double divide(double a, double b) {
        if (b == 0) {
            cout << "Error: Division by zero" << endl;
            return 0;
        }
        return a / b;
    }
};

int main() {
    Calculator calc;

    cout << "10 + 5 = " << calc.add(10, 5) << endl;
    cout << "10 - 3 = " << calc.subtract(10, 3) << endl;
    cout << "10 * 2 = " << calc.multiply(10, 2) << endl;
    cout << "10 / 2 = " << calc.divide(10, 2) << endl;

    return 0;
}`
        }
      ],
      intermediate: [
        {
          title: "Object-Oriented Programming",
          description: "Classes, inheritance, and virtual functions",
          category: "OOP",
          code: `#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Animal {
protected:
    string name;
    string species;

public:
    Animal(const string& n, const string& s) : name(n), species(s) {}
    virtual ~Animal() = default;

    virtual void makeSound() const = 0;

    void displayInfo() const {
        cout << "Name: " << name << ", Species: " << species << endl;
    }
};

class Dog : public Animal {
private:
    string breed;

public:
    Dog(const string& name, const string& breed)
        : Animal(name, "Canine"), breed(breed) {}

    void makeSound() const override {
        cout << name << " barks!" << endl;
    }

    void fetch() const {
        cout << name << " fetches the ball!" << endl;
    }
};

int main() {
    auto myDog = make_unique<Dog>("Buddy", "Golden Retriever");
    myDog->displayInfo();
    myDog->makeSound();
    myDog->fetch();

    return 0;
}`
        }
      ],
      advanced: [
        {
          title: "Template Metaprogramming",
          description: "Advanced templates and SFINAE",
          category: "Templates",
          code: `#include <iostream>
#include <vector>
#include <type_traits>
#include <iterator>
using namespace std;

// SFINAE helper
template<typename T>
using enable_if_integral_t = enable_if_t<is_integral_v<T>>;

template<typename T>
using enable_if_floating_t = enable_if_t<is_floating_point_v<T>>;

// Template specialization for different types
template<typename T, typename = void>
struct Processor {
    static void process(const T& value) {
        cout << "Processing generic type: " << value << endl;
    }
};

template<typename T>
struct Processor<T, enable_if_integral_t<T>> {
    static void process(const T& value) {
        cout << "Processing integer: " << value << " (doubled: " << value * 2 << ")" << endl;
    }
};

template<typename T>
struct Processor<T, enable_if_floating_t<T>> {
    static void process(const T& value) {
        cout << "Processing float: " << value << " (squared: " << value * value << ")" << endl;
    }
};

// Variadic template function
template<typename... Args>
void processAll(Args... args) {
    (Processor<Args>::process(args), ...); // C++17 fold expression
}

// Template class with iterator support
template<typename T>
class Container {
private:
    vector<T> data;

public:
    void add(const T& item) { data.push_back(item); }

    // Iterator support
    using iterator = typename vector<T>::iterator;
    using const_iterator = typename vector<T>::const_iterator;

    iterator begin() { return data.begin(); }
    iterator end() { return data.end(); }
    const_iterator begin() const { return data.begin(); }
    const_iterator end() const { return data.end(); }

    // Template member function
    template<typename Predicate>
    vector<T> filter(Predicate pred) const {
        vector<T> result;
        copy_if(data.begin(), data.end(), back_inserter(result), pred);
        return result;
    }
};

int main() {
    // Template specialization demo
    processAll(42, 3.14, "hello");

    // Container demo
    Container<int> numbers;
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(4);
    numbers.add(5);

    auto evens = numbers.filter([](int n) { return n % 2 == 0; });

    cout << "Even numbers: ";
    for (const auto& n : evens) {
        cout << n << " ";
    }
    cout << endl;

    return 0;
}`
        }
      ]
    },
    c: {
      beginner: [
        {
          title: "Hello World",
          description: "Basic C program structure",
          category: "Basics",
          code: `#include <stdio.h>
#include <string.h>

void greet(const char* name) {
    printf("Hello, %s!\\n", name);
}

int main() {
    char userName[] = "World";
    greet(userName);
    return 0;
}`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic with functions",
          category: "Functions",
          code: `#include <stdio.h>

typedef struct {
    double (*add)(double, double);
    double (*subtract)(double, double);
    double (*multiply)(double, double);
    double (*divide)(double, double);
} Calculator;

double add(double a, double b) { return a + b; }
double subtract(double a, double b) { return a - b; }
double multiply(double a, double b) { return a * b; }

double divide(double a, double b) {
    if (b == 0.0) {
        printf("Error: Division by zero\\n");
        return 0.0;
    }
    return a / b;
}

int main() {
    Calculator calc = {add, subtract, multiply, divide};

    printf("10 + 5 = %.2f\\n", calc.add(10, 5));
    printf("10 - 3 = %.2f\\n", calc.subtract(10, 3));
    printf("10 * 2 = %.2f\\n", calc.multiply(10, 2));
    printf("10 / 2 = %.2f\\n", calc.divide(10, 2));

    return 0;
}`
        }
      ],
      intermediate: [
        {
          title: "Structures and Dynamic Memory",
          description: "Working with structs and malloc",
          category: "Memory",
          code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char* name;
    int age;
    char* breed;
} Dog;

typedef struct {
    Dog** dogs;
    int count;
    int capacity;
} DogArray;

DogArray* createDogArray() {
    DogArray* arr = malloc(sizeof(DogArray));
    arr->dogs = malloc(sizeof(Dog*) * 2);
    arr->count = 0;
    arr->capacity = 2;
    return arr;
}

void addDog(DogArray* arr, const char* name, int age, const char* breed) {
    if (arr->count >= arr->capacity) {
        arr->capacity *= 2;
        arr->dogs = realloc(arr->dogs, sizeof(Dog*) * arr->capacity);
    }

    Dog* dog = malloc(sizeof(Dog));
    dog->name = malloc(strlen(name) + 1);
    strcpy(dog->name, name);
    dog->age = age;
    dog->breed = malloc(strlen(breed) + 1);
    strcpy(dog->breed, breed);

    arr->dogs[arr->count++] = dog;
}

void printDogs(const DogArray* arr) {
    for (int i = 0; i < arr->count; i++) {
        printf("Dog %d: %s (age %d, breed: %s)\\n",
               i + 1, arr->dogs[i]->name, arr->dogs[i]->age, arr->dogs[i]->breed);
    }
}

void freeDogArray(DogArray* arr) {
    for (int i = 0; i < arr->count; i++) {
        free(arr->dogs[i]->name);
        free(arr->dogs[i]->breed);
        free(arr->dogs[i]);
    }
    free(arr->dogs);
    free(arr);
}

int main() {
    DogArray* dogs = createDogArray();

    addDog(dogs, "Buddy", 5, "Golden Retriever");
    addDog(dogs, "Max", 3, "German Shepherd");
    addDog(dogs, "Luna", 2, "Border Collie");

    printDogs(dogs);

    freeDogArray(dogs);
    return 0;
}`
        }
      ],
      advanced: [
        {
          title: "Function Pointers and Callbacks",
          description: "Advanced function pointer usage",
          category: "Pointers",
          code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function pointer types
typedef int (*CompareFunc)(const void* a, const void* b);
typedef void (*ProcessFunc)(void* item, void* context);

// Generic dynamic array structure
typedef struct {
    void** items;
    int count;
    int capacity;
    size_t itemSize;
} GenericArray;

GenericArray* createArray(size_t itemSize) {
    GenericArray* arr = malloc(sizeof(GenericArray));
    arr->items = malloc(sizeof(void*) * 2);
    arr->count = 0;
    arr->capacity = 2;
    arr->itemSize = itemSize;
    return arr;
}

void addItem(GenericArray* arr, void* item) {
    if (arr->count >= arr->capacity) {
        arr->capacity *= 2;
        arr->items = realloc(arr->items, sizeof(void*) * arr->capacity);
    }

    void* newItem = malloc(arr->itemSize);
    memcpy(newItem, item, arr->itemSize);
    arr->items[arr->count++] = newItem;
}

void sortArray(GenericArray* arr, CompareFunc compare) {
    for (int i = 0; i < arr->count - 1; i++) {
        for (int j = 0; j < arr->count - i - 1; j++) {
            if (compare(arr->items[j], arr->items[j + 1]) > 0) {
                void* temp = arr->items[j];
                arr->items[j] = arr->items[j + 1];
                arr->items[j + 1] = temp;
            }
        }
    }
}

void processArray(GenericArray* arr, ProcessFunc process, void* context) {
    for (int i = 0; i < arr->count; i++) {
        process(arr->items[i], context);
    }
}

// Specific implementations for integers
int compareInts(const void* a, const void* b) {
    int intA = *(const int*)a;
    int intB = *(const int*)b;
    return intA - intB;
}

void printInt(void* item, void* context) {
    const char* prefix = (const char*)context;
    printf("%s%d\\n", prefix, *(int*)item);
}

void freeArray(GenericArray* arr) {
    for (int i = 0; i < arr->count; i++) {
        free(arr->items[i]);
    }
    free(arr->items);
    free(arr);
}

int main() {
    GenericArray* numbers = createArray(sizeof(int));

    int values[] = {5, 2, 8, 1, 9, 3};
    for (int i = 0; i < 6; i++) {
        addItem(numbers, &values[i]);
    }

    printf("Original array:\\n");
    processArray(numbers, printInt, "  ");

    sortArray(numbers, compareInts);

    printf("\\nSorted array:\\n");
    processArray(numbers, printInt, "  ");

    freeArray(numbers);
    return 0;
}`
        }
      ]
    }
  };

  // Current selected example state
  const [selectedCategory, setSelectedCategory] = useState('beginner');
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await api.get('/translation/languages');

      if (response.data.success) {
        setSupportedLanguages(response.data.data.languages);
      } else {
        toast.error('Failed to load supported languages');
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error loading languages');
    }
  };

  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      toast.error('Please enter some code to translate');
      setTranslatedCode('// Please enter your code in the left panel\n// Then click "Translate Code" to convert it');
      return;
    }

    // Check educational line limit (1000 lines)
    const lineCount = sourceCode.split('\n').length;
    if (lineCount > 1000) {
      toast.error(`Code exceeds educational limit of 1000 lines (current: ${lineCount})`);
      setTranslatedCode(`// Educational System Limit Exceeded\n// Current lines: ${lineCount}\n// Maximum allowed: 1000 lines\n// Please use smaller code snippets for learning purposes`);
      return;
    }

    if (fromLanguage === toLanguage) {
      toast.error('Please select different source and target languages');
      setTranslatedCode('// Please select different source and target languages\n// Use the language dropdowns above to choose different languages');
      return;
    }

    setIsTranslating(true);
    setTranslationSuccess(false);

    try {
      const response = await api.post('/translation/translate', {
        code: sourceCode,
        fromLanguage,
        toLanguage
      });

      if (response.data.success) {
        setTranslatedCode(response.data.data.translatedCode);
        setTranslationSuccess(true);
        toast.success(`Code translated from ${fromLanguage} to ${toLanguage}!`, {
          icon: '✨',
          duration: 3000,
        });
      } else {
        toast.error(response.data.message || 'Translation failed');
        setTranslatedCode(`// Translation Error:\n// ${response.data.error || response.data.message || 'Please check your code and try again'}`);
      }
    } catch (error) {
      console.error('Translation error:', error);

      const errorMessage = error.response?.data?.message || error.message || 'Error during translation';
      toast.error(errorMessage);
      setTranslatedCode(`// Translation Error:\n// ${errorMessage}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempLang);

    // Swap the code too if there's translated code
    if (translatedCode && !translatedCode.startsWith('// Translation Error') && !translatedCode.startsWith('// Please')) {
      setSourceCode(translatedCode);
      setTranslatedCode('');
      setTranslationSuccess(false);
    }

    toast.success('Languages swapped!', { icon: '🔄' });
  };

  const handleCopyCode = (code, type) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`${type} code copied to clipboard!`, {
        icon: '📋',
        duration: 2000,
      });
    }).catch(() => {
      toast.error('Failed to copy code');
    });
  };

  const loadExample = (category = selectedCategory, index = selectedExampleIndex) => {
    const languageExamples = codeExamples[fromLanguage];
    if (languageExamples && languageExamples[category] && languageExamples[category][index]) {
      const example = languageExamples[category][index];
      setSourceCode(example.code);
      setTranslatedCode('');
      setTranslationSuccess(false);
      toast.success(`${example.title} example loaded!`, {
        icon: '📖',
        duration: 2000,
      });
    } else {
      toast.error(`No example found for ${fromLanguage} in ${category} category`);
    }
  };

  const getCurrentExample = () => {
    const languageExamples = codeExamples[fromLanguage];
    if (languageExamples && languageExamples[selectedCategory] && languageExamples[selectedCategory][selectedExampleIndex]) {
      return languageExamples[selectedCategory][selectedExampleIndex];
    }
    return null;
  };

  // Reset example selection when language changes
  React.useEffect(() => {
    setSelectedExampleIndex(0);
  }, [fromLanguage, selectedCategory]);

  const clearCode = () => {
    setSourceCode('');
    setTranslatedCode('');
    setTranslationSuccess(false);
    toast.success('Code cleared!', { icon: '🗑️' });
  };

  const getLanguageName = (langId) => {
    const lang = supportedLanguages.find(l => l.id === langId);
    return lang ? lang.name : langId.toUpperCase();
  };

  const getLanguageIcon = (langId) => {
    const lang = supportedLanguages.find(l => l.id === langId);
    return lang ? lang.icon : '📄';
  };

  const getDifficultyColor = (category) => {
    switch(category) {
      case 'beginner':
        return 'from-green-500 to-emerald-600';
      case 'intermediate':
        return 'from-yellow-500 to-orange-600';
      case 'advanced':
        return 'from-red-500 to-purple-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const getDifficultyBadge = (category) => {
    switch(category) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Animated Header with Glassmorphism */}
        <div className="text-center mb-12 relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-5">
            <CodeBracketIcon className="w-96 h-96 text-indigo-600 animate-pulse" />
          </div>

          {/* Main Header Content */}
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-2xl opacity-20 animate-pulse"></div>
                <LanguageIcon className="w-16 h-16 text-indigo-600 dark:text-indigo-400 relative animate-bounce" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-4 tracking-tight">
              AI Code Translator
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              Transform code between languages with <span className="font-semibold text-indigo-600 dark:text-indigo-400">AI-powered intelligence</span>
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                <BoltIcon className="w-4 h-4 inline mr-1 text-yellow-500" />
                Lightning Fast
              </span>
              <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                <AcademicCapIcon className="w-4 h-4 inline mr-1 text-blue-500" />
                Educational
              </span>
              <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                <SparklesIcon className="w-4 h-4 inline mr-1 text-purple-500" />
                AI-Powered
              </span>
            </div>
          </div>
        </div>

        {/* Language Selection Card with Glassmorphism */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            {/* Language Selector */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* From Language */}
                <div className="flex-1 w-full md:w-auto">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center md:text-left uppercase tracking-wide">
                    Source Language
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-lg">
                      <span className="text-4xl">{getLanguageIcon(fromLanguage)}</span>
                      <select
                        value={fromLanguage}
                        onChange={(e) => setFromLanguage(e.target.value)}
                        className="flex-1 bg-transparent text-lg font-semibold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                      >
                        {supportedLanguages.map(lang => (
                          <option key={lang.id} value={lang.id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Swap Button with Animation */}
                <button
                  onClick={handleSwapLanguages}
                  className="relative group p-4 md:mt-8"
                  title="Swap languages"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur group-hover:blur-lg transition-all duration-300 opacity-50 group-hover:opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-180 transition-all duration-500">
                    <ArrowPathIcon className="w-7 h-7" />
                  </div>
                </button>

                {/* To Language */}
                <div className="flex-1 w-full md:w-auto">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center md:text-left uppercase tracking-wide">
                    Target Language
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 shadow-lg">
                      <span className="text-4xl">{getLanguageIcon(toLanguage)}</span>
                      <select
                        value={toLanguage}
                        onChange={(e) => setToLanguage(e.target.value)}
                        className="flex-1 bg-transparent text-lg font-semibold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
                      >
                        {supportedLanguages.map(lang => (
                          <option key={lang.id} value={lang.id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Selection with Modern Design */}
            {showExamples && codeExamples[fromLanguage] && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Code Examples: {getLanguageName(fromLanguage)}
                    </h3>
                  </div>

                  {/* Difficulty Pills */}
                  <div className="flex space-x-2">
                    {['beginner', 'intermediate', 'advanced'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                          selectedCategory === category
                            ? `bg-gradient-to-r ${getDifficultyColor(category)} text-white shadow-lg`
                            : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                        }`}
                      >
                        {selectedCategory === category && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${getDifficultyColor(category)} rounded-xl blur opacity-50 animate-pulse`}></div>
                        )}
                        <span className="relative capitalize">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Example Cards Grid */}
                {codeExamples[fromLanguage]?.[selectedCategory] && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {codeExamples[fromLanguage][selectedCategory].map((example, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedExampleIndex(index)}
                        className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                          selectedExampleIndex === index ? 'scale-105' : ''
                        }`}
                      >
                        {/* Glow Effect */}
                        {selectedExampleIndex === index && (
                          <div className={`absolute inset-0 bg-gradient-to-r ${getDifficultyColor(selectedCategory)} rounded-2xl blur-xl opacity-50 animate-pulse`}></div>
                        )}

                        {/* Card Content */}
                        <div className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                          selectedExampleIndex === index
                            ? 'bg-white dark:bg-gray-800 border-indigo-400 dark:border-indigo-500 shadow-2xl'
                            : 'bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-lg'
                        }`}>
                          {/* Category Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBadge(selectedCategory)}`}>
                              {example.category}
                            </span>
                            {selectedExampleIndex === index && (
                              <CheckCircleIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                            {example.title}
                          </h4>

                          {/* Description */}
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {example.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <CodeBracketIcon className="w-4 h-4 mr-1" />
                              {example.code.split('\n').length} lines
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load Example Button */}
                {getCurrentExample() && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        {getCurrentExample().title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getCurrentExample().description}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => loadExample()}
                        className="relative group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                        <span className="relative flex items-center space-x-2">
                          <SparklesIcon className="w-5 h-5" />
                          <span>Load Example</span>
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getCurrentExample().code).then(() => {
                            toast.success('Example copied!', { icon: '📋' });
                          });
                        }}
                        className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <DocumentDuplicateIcon className="w-5 h-5 inline" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Code Editors Panel - Enhanced Design */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Source Code Editor */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <span className="text-2xl">{getLanguageIcon(fromLanguage)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {getLanguageName(fromLanguage)} Code
                        </h3>
                        <p className="text-xs text-white/70">Source code input</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        currentLineCount > 1000
                          ? 'bg-red-500 text-white animate-pulse'
                          : currentLineCount > 800
                          ? 'bg-yellow-400 text-gray-900'
                          : 'bg-green-400 text-gray-900'
                      }`}>
                        {currentLineCount}/1000 lines
                      </span>
                      <button
                        onClick={() => handleCopyCode(sourceCode, 'Source')}
                        disabled={!sourceCode.trim()}
                        className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                      >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="p-6">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700" style={{height: '500px'}}>
                    <SimpleCodeEditor
                      code={sourceCode}
                      onChange={setSourceCode}
                      language={fromLanguage}
                      placeholder={`// Enter your ${getLanguageName(fromLanguage)} code here...\n// Try our examples above to get started!`}
                      isDark={isDarkMode}
                      readOnly={false}
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <InformationCircleIcon className="w-4 h-4 mr-1" />
                      <span>Hover over keywords for syntax help</span>
                    </div>
                    <button
                      onClick={clearCode}
                      disabled={!sourceCode.trim()}
                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Clear Code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Translated Code Editor */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className={`absolute inset-0 ${
                translationSuccess
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              } rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>

              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 ${
                  translationSuccess
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                } border-b border-white/10 transition-all duration-500`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <span className="text-2xl">{getLanguageIcon(toLanguage)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                          <span>{getLanguageName(toLanguage)} Code</span>
                          {translationSuccess && (
                            <CheckCircleIcon className="w-5 h-5 animate-bounce" />
                          )}
                        </h3>
                        <p className="text-xs text-white/70">
                          {translationSuccess ? 'Translation complete!' : 'Translated output'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(translatedCode, 'Translated')}
                      disabled={!translatedCode.trim()}
                      className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <div className="p-6">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700" style={{height: '500px'}}>
                    <SimpleCodeEditor
                      code={translatedCode}
                      onChange={() => {}}
                      language={toLanguage}
                      placeholder={`// Translated ${getLanguageName(toLanguage)} code will appear here...\n// Click "Translate Code" below to start!`}
                      isDark={isDarkMode}
                      readOnly={true}
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <InformationCircleIcon className="w-4 h-4 mr-1" />
                    <span>Hover over translated code for syntax explanations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Translate Button - Centered & Enhanced */}
          <div className="flex justify-center mb-12">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceCode.trim()}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75 group-hover:opacity-100 animate-pulse"></div>

              {/* Button */}
              <div className={`relative px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl ${
                isTranslating || !sourceCode.trim()
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white transform hover:scale-105 cursor-pointer'
              }`}>
                {isTranslating ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                    </div>
                    <span className="font-bold">Translating with AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <BoltIcon className="w-7 h-7" />
                    <span>Translate Code</span>
                    <ArrowRightIcon className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Info Panel - Enhanced */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex-shrink-0">
                  <InformationCircleIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                    How AI Code Translation Works
                    <SparklesIcon className="w-6 h-6 ml-2 text-yellow-500 animate-pulse" />
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 dark:text-blue-200">
                        Analyzes code structure, variables, and control flow
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 dark:text-blue-200">
                        Maps language-specific constructs intelligently
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 dark:text-blue-200">
                        Generates syntactically correct target code
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-800 dark:text-blue-200">
                        Adds helpful TODO comments where needed
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong className="font-bold">💡 Pro Tip:</strong> Translated code provides an excellent foundation, but may require manual refinement for complex logic, library-specific features, and performance optimization. Educational limit: 1000 lines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTranslator;
