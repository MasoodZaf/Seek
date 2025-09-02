import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  ArrowRightIcon, 
  ArrowPathIcon,
  DocumentDuplicateIcon,
  LanguageIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import SimpleCodeEditor from '../components/CodeEditor/SimpleCodeEditor';

const CodeTranslator = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [fromLanguage, setFromLanguage] = useState('javascript');
  const [toLanguage, setToLanguage] = useState('python');
  const [isTranslating, setIsTranslating] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
          code: `function greet(name) {
    console.log("Hello, " + name + "!");
}

let userName = "World";
greet(userName);`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic operations",
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
          code: `def greet(name):
    print(f"Hello, {name}!")

user_name = "World"
greet(user_name)`
        },
        {
          title: "Simple Calculator",
          description: "Basic arithmetic operations",
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
          code: `function greet(name: string): void {
    console.log(\`Hello, \${name}!\`);
}

const userName: string = "World";
greet(userName);`
        },
        {
          title: "Interface and Types",
          description: "Working with interfaces and custom types",
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
      const response = await fetch('/api/v1/translation/languages');
      const result = await response.json();
      
      if (result.success) {
        setSupportedLanguages(result.data.languages);
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
      setTranslatedCode('// Please enter your code in the left panel\\n// Then click "Translate Code" to convert it');
      return;
    }

    // Check educational line limit (1000 lines)
    const lineCount = sourceCode.split('\n').length;
    if (lineCount > 1000) {
      toast.error(`Code exceeds educational limit of 1000 lines (current: ${lineCount})`);
      setTranslatedCode(`// Educational System Limit Exceeded\\n// Current lines: ${lineCount}\\n// Maximum allowed: 1000 lines\\n// Please use smaller code snippets for learning purposes`);
      return;
    }

    if (fromLanguage === toLanguage) {
      toast.error('Please select different source and target languages');
      setTranslatedCode('// Please select different source and target languages\\n// Use the language dropdowns above to choose different languages');
      return;
    }

    setIsTranslating(true);
    
    try {
      // Try to get token from multiple sources
      let token = localStorage.getItem('token');
      if (!token) {
        token = localStorage.getItem('accessToken');
      }
      
      if (!token) {
        toast.error('Please log in to use the code translator');
        setTranslatedCode('// Authentication Required\\n// Please log in to use the code translator');
        setIsTranslating(false);
        return;
      }

      const response = await fetch('/api/v1/translation/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: sourceCode,
          fromLanguage,
          toLanguage
        })
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          
          toast.error('Your session has expired. Please log in again.');
          setTranslatedCode('// Session Expired\\n// Please log in again to use the translator');
          
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        } else if (response.status >= 500) {
          toast.error('Server error. Please try again later.');
          setTranslatedCode('// Server Error\\n// Please try again later');
          return;
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          toast.error(errorData.message || `Error ${response.status}: Translation failed`);
          setTranslatedCode(`// Error ${response.status}\\n// ${errorData.message || 'Translation failed'}`);
          return;
        }
      }

      const result = await response.json();

      if (result.success) {
        setTranslatedCode(result.data.translatedCode);
        toast.success(`Code translated from ${fromLanguage} to ${toLanguage}!`);
      } else {
        toast.error(result.message || 'Translation failed');
        setTranslatedCode(`// Translation Error:\\n// ${result.error || result.message || 'Please check your code and try again'}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
        setTranslatedCode('// Network Error\\n// Please check your internet connection and try again');
      } else {
        toast.error('Error during translation');
        setTranslatedCode('// Unexpected Error\\n// Please try again or contact support');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const tempLang = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempLang);
    
    // Swap the code too if there's translated code
    if (translatedCode && translatedCode !== '// Error: Unable to translate code') {
      setSourceCode(translatedCode);
      setTranslatedCode('');
    }
  };

  const handleCopyCode = (code, type) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`${type} code copied to clipboard!`);
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
      toast.success(`${example.title} example loaded!`);
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
  };

  const getLanguageName = (langId) => {
    const lang = supportedLanguages.find(l => l.id === langId);
    return lang ? lang.name : langId.toUpperCase();
  };

  const getLanguageIcon = (langId) => {
    const lang = supportedLanguages.find(l => l.id === langId);
    return lang ? lang.icon : '📄';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <LanguageIcon className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Code Translator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your code between different programming languages instantly
          </p>
        </div>

        {/* Language Selection */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center space-x-4">
              {/* From Language */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getLanguageIcon(fromLanguage)}</span>
                  <select
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapLanguages}
                className="p-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                title="Swap languages"
              >
                <ArrowPathIcon className="w-6 h-6" />
              </button>

              {/* To Language */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getLanguageIcon(toLanguage)}</span>
                  <select
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

            {/* Example Selection Interface - Compact Version */}
            {codeExamples[fromLanguage] && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Examples: {getLanguageName(fromLanguage)}
                  </h3>
                  {/* Compact Difficulty Selector */}
                  <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-md p-0.5 border border-gray-200 dark:border-gray-600">
                    {['beginner', 'intermediate', 'advanced'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex items-center space-x-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            category === 'beginner' ? 'bg-green-400' :
                            category === 'intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></span>
                          <span className="capitalize">{category}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Example Grid */}
                {codeExamples[fromLanguage]?.[selectedCategory] && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    {codeExamples[fromLanguage][selectedCategory].map((example, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                          selectedExampleIndex === index
                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 dark:border-indigo-400'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                        }`}
                        onClick={() => setSelectedExampleIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {example.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {example.description}
                            </p>
                          </div>
                          {selectedExampleIndex === index && (
                            <div className="ml-2 text-indigo-600 dark:text-indigo-400">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Compact Action Bar */}
                {getCurrentExample() && (
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {getCurrentExample().title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {getCurrentExample().code.split('\\n').length} lines
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {getCurrentExample().description}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <button
                        onClick={() => loadExample()}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-1.5 text-sm"
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>Load</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getCurrentExample().code).then(() => {
                            toast.success('Example copied to clipboard!');
                          }).catch(() => {
                            toast.error('Failed to copy example');
                          });
                        }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors flex items-center space-x-1.5 text-sm"
                      >
                        <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Code Translation Panel - Vertical Layout */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Source Code */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{getLanguageIcon(fromLanguage)}</span>
                    <span>{getLanguageName(fromLanguage)} Code</span>
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      currentLineCount > 1000 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                        : currentLineCount > 800 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {currentLineCount}/1000 lines
                    </span>
                    <button
                      onClick={() => handleCopyCode(sourceCode, 'Source')}
                      disabled={!sourceCode.trim()}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="relative" style={{height: '384px'}}>
                  <SimpleCodeEditor
                    code={sourceCode}
                    onChange={setSourceCode}
                    language={fromLanguage}
                    placeholder={`Enter your ${getLanguageName(fromLanguage)} code here...`}
                    isDark={isDarkMode}
                    readOnly={false}
                  />
                </div>
                
                {/* Syntax Help Info */}
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <InformationCircleIcon className="w-4 h-4 mr-1" />
                  <span>Hover over keywords and functions for syntax help</span>
                </div>
              </div>
            </div>


            {/* Translate Button */}
            <div className="flex justify-center">
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !sourceCode.trim()}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isTranslating || !sourceCode.trim()
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isTranslating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="w-6 h-6 transform rotate-90" />
                    <span>Translate Code</span>
                    <span className="text-sm opacity-80">({getLanguageName(fromLanguage)} → {getLanguageName(toLanguage)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Translated Code */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{getLanguageIcon(toLanguage)}</span>
                    <span>{getLanguageName(toLanguage)} Code</span>
                  </h3>
                  <button
                    onClick={() => handleCopyCode(translatedCode, 'Translated')}
                    disabled={!translatedCode.trim()}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="relative" style={{height: '384px'}}>
                  <SimpleCodeEditor
                    code={translatedCode}
                    onChange={() => {}} // Read-only
                    language={toLanguage}
                    placeholder={`Translated ${getLanguageName(toLanguage)} code will appear here...`}
                    isDark={isDarkMode}
                    readOnly={true}
                  />
                </div>
                
                {/* Translation Help Info */}
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <InformationCircleIcon className="w-4 h-4 mr-1" />
                  <span>Hover over translated code for syntax explanations</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Info Panel */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              🔍 How Code Translation Works
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Analyzes your source code structure (variables, functions, control flow)</li>
              <li>• Maps language-specific constructs to equivalent patterns</li>
              <li>• Generates syntactically correct code in the target language</li>
              <li>• Provides TODO comments where manual implementation is needed</li>
              <li>• Educational limit: Maximum 1000 lines for optimal learning</li>
              <li>• Best for learning syntax differences between languages</li>
            </ul>
            <p className="text-blue-700 dark:text-blue-300 mt-4 text-sm">
              <strong>Note:</strong> Translated code provides a structural foundation but may need manual refinement 
              for complex logic, library-specific features, and optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTranslator;