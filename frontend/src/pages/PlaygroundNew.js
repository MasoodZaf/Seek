import React, { useState, useEffect } from 'react';
import {
  PlayIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  TrashIcon,
  CheckIcon,
  ClipboardIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui';
import MonacoCodeEditor from '../components/CodeEditor/MonacoCodeEditor';
import api from '../utils/api';

const PlaygroundNew = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedCodes, setSavedCodes] = useState([]);
  const [currentCodeName, setCurrentCodeName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Execute code using backend API
  const runCode = async () => {
    if (!code.trim()) {
      setOutput('❌ Error: No code to execute');
      return;
    }

    setIsExecuting(true);
    setOutput('🔄 Executing code...');

    try {
      const response = await api.post('/code/execute', {
        code,
        language,
        input: '' // No input for now
      });

      const result = response.data;
      console.log('API Response:', result); // Debug log

      if (result.success) {
        const executionData = result.data;
        console.log('Execution Data:', executionData); // Debug execution data
        let output = '';
        
        // Safely handle output - support multiple response formats
        let outputText = '';
        if (executionData.output) {
          if (typeof executionData.output === 'string') {
            // Legacy string format
            outputText = executionData.output.trim();
          } else if (typeof executionData.output === 'object') {
            // Check for different object formats
            if (executionData.output.stdout && executionData.output.stdout.trim()) {
              // Format: { stdout: "output", stderr: "" }
              outputText = executionData.output.stdout.trim();
            } else if (executionData.output.output && executionData.output.output.trim()) {
              // Format: { output: "Hello World", stderr: "" }
              outputText = executionData.output.output.trim();
            }
            
            // Add stderr if present and different from stdout
            if (executionData.output.stderr && executionData.output.stderr.trim()) {
              if (outputText) outputText += '\n';
              outputText += `❌ Error:\n${executionData.output.stderr.trim()}`;
            }
          }
        }
        
        if (outputText) {
          output += `📤 Output:\n${outputText}\n`;
        } else {
          console.log('No output or output is empty:', executionData.output);
        }
        
        // Safely handle error
        if (executionData.error && typeof executionData.error === 'string' && executionData.error.trim()) {
          output += `❌ Error:\n${executionData.error}\n`;
        }
        
        // Add execution time if available
        if (executionData.executionTime) {
          output += `⏱️  Execution time: ${executionData.executionTime}ms\n`;
        }
        
        // If no output, show success message  
        if (!output.trim()) {
          output = '✅ Code executed successfully (no output)';
        }
        
        setOutput(output);
      } else {
        setOutput(`❌ Execution failed: ${result.message || result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setOutput(`❌ Network error: ${error.message}\n\nPlease check your connection and try again.`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Code templates
  const codeTemplates = {
    javascript: {
      'Hello World': `// Hello World Example
console.log('Hello, World!');

// Try modifying this message
const message = 'Welcome to Seek Playground!';
console.log(message);`,
      'Variables & Functions': `// Variables and Functions
let name = 'Developer';
const age = 25;

function greet(person, years) {
  return \`Hello \${person}, you are \${years} years old!\`;
}

const greeting = greet(name, age);
console.log(greeting);

// Arrow function
const square = (n) => n * n;
console.log('Square of 5:', square(5));`,
      'Arrays & Objects': `// Working with Arrays and Objects
const fruits = ['apple', 'banana', 'orange'];
const person = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'coding', 'hiking']
};

console.log('Fruits:', fruits);
console.log('Person:', person);

// Array methods
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log('Uppercase fruits:', upperFruits);

// Object destructuring
const { name, hobbies } = person;
console.log(\`\${name} enjoys: \${hobbies.join(', ')}\`);`,
      'Async/Await': `// Async/Await Example
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncExample() {
  console.log('Starting async operation...');
  
  await delay(1000);
  console.log('Operation completed after 1 second!');
  
  return 'Async function finished';
}

// Call the async function
asyncExample().then(result => {
  console.log(result);
});`
    },
    python: {
      'Hello World': `# Hello World in Python
print("Hello, World!")

# Variables
name = "Developer"
age = 25
print(f"Hello {name}, you are {age} years old!")`,
      'Lists & Dictionaries': `# Working with Lists and Dictionaries
fruits = ['apple', 'banana', 'orange']
person = {
    'name': 'Alice',
    'age': 30,
    'hobbies': ['reading', 'coding', 'hiking']
}

print('Fruits:', fruits)
print('Person:', person)

# List comprehension
upper_fruits = [fruit.upper() for fruit in fruits]
print('Uppercase fruits:', upper_fruits)`
    },
    java: {
      'Hello World': `// Hello World in Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        String name = "Developer";
        int age = 25;
        System.out.println("Hello " + name + ", you are " + age + " years old!");
    }
}`,
      'Classes & Objects': `// Classes and Objects in Java
class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void greet() {
        System.out.println("Hello, I'm " + name + " and I'm " + age + " years old.");
    }
}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice", 30);
        person.greet();
    }
}`
    },
    go: {
      'Hello World': `// Hello World in Go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    name := "Developer"
    age := 25
    fmt.Printf("Hello %s, you are %d years old!\\n", name, age)
}`,
      'Structs & Functions': `// Structs and Functions in Go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

func (p Person) greet() {
    fmt.Printf("Hello, I'm %s and I'm %d years old.\\n", p.Name, p.Age)
}

func main() {
    person := Person{Name: "Alice", Age: 30}
    person.greet()
    
    // Slice example
    fruits := []string{"apple", "banana", "orange"}
    fmt.Println("Fruits:", fruits)
}`
    },
    cpp: {
      'Hello World': `// Hello World in C++
#include <iostream>
#include <string>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    std::string name = "Developer";
    int age = 25;
    std::cout << "Hello " << name << ", you are " << age << " years old!" << std::endl;
    
    return 0;
}`,
      'Classes & Objects': `// Classes and Objects in C++
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& n, int a) : name(n), age(a) {}
    
    void greet() {
        std::cout << "Hello, I'm " << name << " and I'm " << age << " years old." << std::endl;
    }
};

int main() {
    Person person("Alice", 30);
    person.greet();
    return 0;
}`
    },
    rust: {
      'Hello World': `// Hello World in Rust
fn main() {
    println!("Hello, World!");
    
    let name = "Developer";
    let age = 25;
    println!("Hello {}, you are {} years old!", name, age);
}`,
      'Structs & Methods': `// Structs and Methods in Rust
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }
    
    fn greet(&self) {
        println!("Hello, I'm {} and I'm {} years old.", self.name, self.age);
    }
}

fn main() {
    let person = Person::new("Alice".to_string(), 30);
    person.greet();
    
    // Vector example
    let fruits = vec!["apple", "banana", "orange"];
    println!("Fruits: {:?}", fruits);
}`
    },
    csharp: {
      'Hello World': `// Hello World in C#
using System;

class Program 
{
    static void Main() 
    {
        Console.WriteLine("Hello, World!");
        
        string name = "Developer";
        int age = 25;
        Console.WriteLine($"Hello {name}, you are {age} years old!");
    }
}`,
      'Classes & Objects': `// Classes and Objects in C#
using System;

public class Person 
{
    private string name;
    private int age;
    
    public Person(string name, int age) 
    {
        this.name = name;
        this.age = age;
    }
    
    public void Greet() 
    {
        Console.WriteLine($"Hello, I'm {name} and I'm {age} years old.");
    }
}

class Program 
{
    static void Main() 
    {
        Person person = new Person("Alice", 30);
        person.Greet();
    }
}`
    },
    php: {
      'Hello World': `<?php
// Hello World in PHP
echo "Hello, World!\\n";

$name = "Developer";
$age = 25;
echo "Hello $name, you are $age years old!\\n";
?>`,
      'Classes & Objects': `<?php
// Classes and Objects in PHP
class Person 
{
    private $name;
    private $age;
    
    public function __construct($name, $age) 
    {
        $this->name = $name;
        $this->age = $age;
    }
    
    public function greet() 
    {
        echo "Hello, I'm {$this->name} and I'm {$this->age} years old.\\n";
    }
}

$person = new Person("Alice", 30);
$person->greet();

// Array example
$fruits = ["apple", "banana", "orange"];
echo "Fruits: " . implode(", ", $fruits) . "\\n";
?>`
    }
  };

  // Load saved codes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('playground_saved_codes');
    if (saved) {
      setSavedCodes(JSON.parse(saved));
    }
  }, []);

  // Load default template when language changes
  useEffect(() => {
    const defaultTemplates = {
      javascript: `// JavaScript Examples - Functions, Arrays, Objects
console.log("=== JavaScript Playground ===");

// Variables and basic operations
let name = "JavaScript";
let version = 2024;
console.log(\`Welcome to \${name} - \${version}!\`);

// Function example
function calculateSum(a, b) {
    return a + b;
}

console.log("Sum of 5 + 3 =", calculateSum(5, 3));

// Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Object example
const person = {
    name: "Alice",
    age: 30,
    greet: function() {
        return \`Hello, I'm \${this.name} and I'm \${this.age} years old!\`;
    }
};

console.log(person.greet());`,

      python: `# Python Examples - Functions, Classes, Data Structures
print("=== Python Playground ===")

# Variables and basic operations
name = "Python"
version = 3.12
print(f"Welcome to {name} - {version}!")

# Function example
def calculate_sum(a, b):
    """Calculate the sum of two numbers"""
    return a + b

print(f"Sum of 5 + 3 = {calculate_sum(5, 3)}")

# List operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(f"Original: {numbers}")
print(f"Doubled: {doubled}")

# Class example
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name} and I'm {self.age} years old!"

person = Person("Alice", 30)
print(person.greet())

# Dictionary example
student_grades = {"Math": 95, "Science": 87, "English": 92}
average = sum(student_grades.values()) / len(student_grades)
print(f"Average grade: {average:.1f}")`,

      java: `// Java Examples - Classes, Objects, Collections
public class JavaPlayground {
    public static void main(String[] args) {
        System.out.println("=== Java Playground ===");
        
        // Variables and basic operations
        String language = "Java";
        int version = 21;
        System.out.println("Welcome to " + language + " - " + version + "!");
        
        // Method call
        int sum = calculateSum(5, 3);
        System.out.println("Sum of 5 + 3 = " + sum);
        
        // Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Original: ");
        printArray(numbers);
        
        // Object example
        Person person = new Person("Alice", 30);
        System.out.println(person.greet());
    }
    
    public static int calculateSum(int a, int b) {
        return a + b;
    }
    
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(", ");
        }
        System.out.println();
    }
}

class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String greet() {
        return "Hello, I'm " + name + " and I'm " + age + " years old!";
    }
}`,

      go: `// Go Examples - Functions, Structs, Slices
package main

import (
    "fmt"
    "strings"
)

// Struct definition
type Person struct {
    Name string
    Age  int
}

// Method on struct
func (p Person) Greet() string {
    return fmt.Sprintf("Hello, I'm %s and I'm %d years old!", p.Name, p.Age)
}

// Function example
func calculateSum(a, b int) int {
    return a + b
}

func main() {
    fmt.Println("=== Go Playground ===")
    
    // Variables and basic operations
    language := "Go"
    version := 1.21
    fmt.Printf("Welcome to %s - %.2f!\\n", language, version)
    
    // Function call
    sum := calculateSum(5, 3)
    fmt.Printf("Sum of 5 + 3 = %d\\n", sum)
    
    // Slice operations
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Printf("Original: %v\\n", numbers)
    
    var doubled []int
    for _, n := range numbers {
        doubled = append(doubled, n*2)
    }
    fmt.Printf("Doubled: %v\\n", doubled)
    
    // Struct example
    person := Person{Name: "Alice", Age: 30}
    fmt.Println(person.Greet())
    
    // String operations
    words := []string{"Go", "is", "awesome"}
    sentence := strings.Join(words, " ")
    fmt.Printf("Joined: %s\\n", sentence)
}`,

      cpp: `// C++ Examples - Classes, STL, Templates
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

// Class definition
class Person {
private:
    std::string name;
    int age;

public:
    Person(const std::string& n, int a) : name(n), age(a) {}
    
    void greet() const {
        std::cout << "Hello, I'm " << name << " and I'm " << age << " years old!" << std::endl;
    }
    
    const std::string& getName() const { return name; }
    int getAge() const { return age; }
};

// Function template
template<typename T>
T calculateSum(T a, T b) {
    return a + b;
}

int main() {
    std::cout << "=== C++ Playground ===" << std::endl;
    
    // Variables and basic operations
    std::string language = "C++";
    int version = 23;
    std::cout << "Welcome to " << language << " - " << version << "!" << std::endl;
    
    // Template function call
    int sum = calculateSum(5, 3);
    std::cout << "Sum of 5 + 3 = " << sum << std::endl;
    
    // Vector operations
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::cout << "Original: ";
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    // STL algorithm
    std::vector<int> doubled(numbers.size());
    std::transform(numbers.begin(), numbers.end(), doubled.begin(), 
                   [](int n) { return n * 2; });
    
    std::cout << "Doubled: ";
    for (int n : doubled) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    // Object example
    Person person("Alice", 30);
    person.greet();
    
    return 0;
}`,

      rust: `// Rust Examples - Structs, Enums, Ownership
use std::collections::HashMap;

// Struct definition
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Self {
        Person { name, age }
    }
    
    fn greet(&self) {
        println!("Hello, I'm {} and I'm {} years old!", self.name, self.age);
    }
}

// Enum example
#[derive(Debug)]
enum Color {
    Red,
    Green,
    Blue,
}

// Function example
fn calculate_sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    println!("=== Rust Playground ===");
    
    // Variables and basic operations
    let language = "Rust";
    let version = 1.75;
    println!("Welcome to {} - {:.2}!", language, version);
    
    // Function call
    let sum = calculate_sum(5, 3);
    println!("Sum of 5 + 3 = {}", sum);
    
    // Vector operations
    let numbers = vec![1, 2, 3, 4, 5];
    println!("Original: {:?}", numbers);
    
    let doubled: Vec<i32> = numbers.iter().map(|&n| n * 2).collect();
    println!("Doubled: {:?}", doubled);
    
    // Struct example
    let person = Person::new("Alice".to_string(), 30);
    person.greet();
    
    // HashMap example
    let mut scores = HashMap::new();
    scores.insert("Math", 95);
    scores.insert("Science", 87);
    scores.insert("English", 92);
    
    println!("Scores: {:?}", scores);
    
    // Enum example
    let color = Color::Blue;
    println!("Selected color: {:?}", color);
}`,

      csharp: `// C# Examples - Classes, LINQ, Generics
using System;
using System.Collections.Generic;
using System.Linq;

// Class definition
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
    
    public void Greet()
    {
        Console.WriteLine($"Hello, I'm {Name} and I'm {Age} years old!");
    }
}

// Generic class
public class Calculator<T> where T : struct
{
    public T Add(T a, T b)
    {
        return (dynamic)a + (dynamic)b;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("=== C# Playground ===");
        
        // Variables and basic operations
        string language = "C#";
        double version = 12.0;
        Console.WriteLine($"Welcome to {language} - {version}!");
        
        // Generic method call
        var calculator = new Calculator<int>();
        int sum = calculator.Add(5, 3);
        Console.WriteLine($"Sum of 5 + 3 = {sum}");
        
        // List operations with LINQ
        var numbers = new List<int> { 1, 2, 3, 4, 5 };
        Console.WriteLine($"Original: [{string.Join(", ", numbers)}]");
        
        var doubled = numbers.Select(n => n * 2).ToList();
        Console.WriteLine($"Doubled: [{string.Join(", ", doubled)}]");
        
        // Object example
        var person = new Person("Alice", 30);
        person.Greet();
        
        // Dictionary example
        var studentGrades = new Dictionary<string, int>
        {
            {"Math", 95},
            {"Science", 87},
            {"English", 92}
        };
        
        double average = studentGrades.Values.Average();
        Console.WriteLine($"Average grade: {average:F1}");
        
        // LINQ query
        var highGrades = studentGrades.Where(kv => kv.Value > 90)
                                    .Select(kv => kv.Key);
        Console.WriteLine($"High scoring subjects: {string.Join(", ", highGrades)}");
    }
}`,

      php: `<?php
// PHP Examples - Classes, Arrays, Functions

echo "=== PHP Playground ===\\n";

// Variables and basic operations
$language = "PHP";
$version = 8.3;
echo "Welcome to $language - $version!\\n";

// Function example
function calculateSum($a, $b) {
    return $a + $b;
}

$sum = calculateSum(5, 3);
echo "Sum of 5 + 3 = $sum\\n";

// Array operations
$numbers = [1, 2, 3, 4, 5];
echo "Original: [" . implode(", ", $numbers) . "]\\n";

$doubled = array_map(function($n) { return $n * 2; }, $numbers);
echo "Doubled: [" . implode(", ", $doubled) . "]\\n";

// Class example
class Person {
    private $name;
    private $age;
    
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
    
    public function greet() {
        return "Hello, I'm {$this->name} and I'm {$this->age} years old!";
    }
    
    public function getName() {
        return $this->name;
    }
    
    public function getAge() {
        return $this->age;
    }
}

$person = new Person("Alice", 30);
echo $person->greet() . "\\n";

// Associative array example
$studentGrades = [
    "Math" => 95,
    "Science" => 87,
    "English" => 92
];

$total = array_sum($studentGrades);
$average = $total / count($studentGrades);
echo "Average grade: " . number_format($average, 1) . "\\n";

// Array filtering
$highGrades = array_filter($studentGrades, function($grade) {
    return $grade > 90;
});

echo "High scoring subjects: " . implode(", ", array_keys($highGrades)) . "\\n";

// String operations
$words = ["PHP", "is", "powerful"];
$sentence = implode(" ", $words);
echo "Joined: $sentence\\n";
?>`
    };
    
    if (code === '') {
      setCode(defaultTemplates[language] || '// Write your code here');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Load shared code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedParam = urlParams.get('shared');
    
    if (sharedParam) {
      try {
        const decodedData = JSON.parse(atob(sharedParam));
        if (decodedData.code && decodedData.language) {
          setCode(decodedData.code);
          setLanguage(decodedData.language);
          setOutput('✨ Shared code loaded successfully!');
          
          // Clean up URL after loading
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (error) {
        console.error('Failed to load shared code:', error);
        setOutput('❌ Invalid shared code link');
      }
    }
  }, []);

  // Save code functionality
  const saveCode = () => {
    if (!currentCodeName.trim()) return;
    
    const newSavedCode = {
      id: Date.now(),
      name: currentCodeName,
      code,
      language,
      createdAt: new Date().toISOString(),
      userId: user?.id
    };
    
    const updatedCodes = [...savedCodes, newSavedCode];
    setSavedCodes(updatedCodes);
    localStorage.setItem('playground_saved_codes', JSON.stringify(updatedCodes));
    setCurrentCodeName('');
    setShowSaveDialog(false);
  };

  // Load saved code
  const loadCode = (savedCode) => {
    setCode(savedCode.code);
    setLanguage(savedCode.language);
    setOutput('');
  };

  // Delete saved code
  const deleteSavedCode = (id) => {
    const updatedCodes = savedCodes.filter(code => code.id !== id);
    setSavedCodes(updatedCodes);
    localStorage.setItem('playground_saved_codes', JSON.stringify(updatedCodes));
  };

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Failed to copy code
    }
  };

  // Download code as file
  const downloadCode = () => {
    const fileExtensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      go: 'go',
      cpp: 'cpp',
      rust: 'rs',
      csharp: 'cs',
      php: 'php'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground_code.${fileExtensions[language] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share code - generate shareable URL
  const shareCode = async () => {
    try {
      const shareableCode = {
        code,
        language,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      // Encode the code data
      const encodedData = btoa(JSON.stringify(shareableCode));
      const shareableUrl = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to share code:', err);
      // Fallback - just show the current URL
      const currentUrl = window.location.href;
      try {
        await navigator.clipboard.writeText(currentUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (fallbackErr) {
        // Both attempts failed
        console.error('Failed to copy URL:', fallbackErr);
      }
    }
  };

  // Load template
  const loadTemplate = (templateName) => {
    const template = codeTemplates[language]?.[templateName];
    if (template) {
      setCode(template);
      setOutput('');
    }
  };

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-white" 
    : "min-h-screen";
    
  const bgClasses = isDarkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-50 text-gray-900";

  return (
    <div className={`${containerClasses} ${bgClasses} transition-colors duration-300`}>
      <div className={`${isFullscreen ? 'h-full' : ''} p-6`}>
        <div className="max-w-7xl mx-auto h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Code Playground
              </h1>
              {user && (
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome, {user.firstName}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="sm"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <ArrowsPointingInIcon className="h-5 w-5" /> : <ArrowsPointingOutIcon className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex flex-col ${isFullscreen ? 'h-[calc(100vh-8rem)]' : ''} gap-6`}>
            {/* Code Editor Section */}
            <div className={`flex-shrink-0 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Code Editor
                  </h2>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    <option value="cpp">C++</option>
                    <option value="rust">Rust</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Templates Dropdown */}
                  <select
                    onChange={(e) => e.target.value && loadTemplate(e.target.value)}
                    value=""
                    className={`px-3 py-1 border rounded-md text-sm ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="">Load Template...</option>
                    {Object.keys(codeTemplates[language] || {}).map(template => (
                      <option key={template} value={template}>{template}</option>
                    ))}
                  </select>
                  
                  {/* Action Buttons */}
                  <button
                    onClick={copyCode}
                    className={`p-2 rounded-lg transition-colors ${
                      copySuccess
                        ? 'bg-green-600 text-white'
                        : isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Copy Code"
                  >
                    {copySuccess ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={downloadCode}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Download Code"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Save Code"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={shareCode}
                    className={`p-2 rounded-lg transition-colors ${
                      shareSuccess
                        ? 'bg-green-600 text-white'
                        : isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-200 text-gray-600'
                    }`}
                    title={shareSuccess ? "Link copied!" : "Share Code"}
                  >
                    {shareSuccess ? <CheckIcon className="h-4 w-4" /> : <ShareIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Code Editor */}
              <div className={`relative border rounded-md overflow-hidden ${
                isDarkMode 
                  ? 'border-gray-600' 
                  : 'border-gray-300'
              }`}>
                <MonacoCodeEditor
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  language={language}
                  theme={isDarkMode ? 'vs-dark' : 'light'}
                  height={isFullscreen ? '400px' : '400px'}
                  options={{
                    minimap: { enabled: !isFullscreen },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    tabSize: 2,
                    insertSpaces: true,
                    automaticLayout: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    cursorBlinking: 'blink',
                    cursorStyle: 'line',
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8
                    }
                  }}
                />
              </div>
              
              {/* Editor Footer */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={runCode}
                    disabled={isExecuting}
                    loading={isExecuting}
                    variant="primary"
                    size="md"
                    className="px-6"
                  >
                    <PlayIcon className="h-4 w-4" />
                    {isExecuting ? 'Running...' : 'Run Code'}
                  </Button>
                  
                  <Button
                    onClick={() => setCode('')}
                    variant="secondary"
                    size="md"
                    className="px-4"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lines: {code.split('\n').length} | Characters: {code.length}
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className={`flex-1 min-h-0 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Output
                </h2>
                <button
                  onClick={() => setOutput('')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
              
              <div className={`${isFullscreen ? 'flex-1' : 'h-60'} p-4 border rounded-md font-mono text-sm overflow-auto ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-900 text-green-400' 
                  : 'border-gray-300 bg-gray-900 text-green-400'
              }`}>
                {output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-gray-500">Click "Run Code" to see output here...</div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Codes Section */}
          {!isFullscreen && savedCodes.length > 0 && (
            <div className={`mt-8 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Saved Codes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCodes.map((savedCode) => (
                  <div key={savedCode.id} className={`p-4 border rounded-lg ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {savedCode.name}
                      </h3>
                      <button
                        onClick={() => deleteSavedCode(savedCode.id)}
                        className={`p-1 rounded hover:bg-red-100 text-red-600`}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {savedCode.language} • {new Date(savedCode.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => loadCode(savedCode)}
                      className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Load Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {!isFullscreen && (
            <div className={`mt-8 rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Syntax Highlighting
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Beautiful code highlighting
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Save & Load
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Save your code snippets
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Templates
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Pre-built code examples
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Console Capture
                  </h3>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    See all console output
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Save Code
            </h3>
            <input
              type="text"
              value={currentCodeName}
              onChange={(e) => setCurrentCodeName(e.target.value)}
              placeholder="Enter a name for your code..."
              className={`w-full p-3 border rounded-md mb-4 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setCurrentCodeName('');
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveCode}
                disabled={!currentCodeName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundNew;