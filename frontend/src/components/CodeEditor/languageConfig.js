// Language configuration for the code playground
export const SUPPORTED_LANGUAGES = [
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    monacoLanguage: 'javascript',
    icon: '🟨',
    category: 'Web',
    description: 'Modern JavaScript with ES6+ features',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `// JavaScript - Dynamic, versatile programming language
console.log('Hello, World!');

// Variables and functions
const name = 'Developer';
function greet(person) {
  return \`Hello, \${person}!\`;
}

console.log(greet(name));`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    extension: 'ts',
    monacoLanguage: 'typescript',
    icon: '🔷',
    category: 'Web',
    description: 'JavaScript with static type checking',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// TypeScript - JavaScript with static typing
interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const developer: Person = {
  name: 'Developer',
  age: 25
};

console.log(greet(developer));`
  },
  {
    id: 'python',
    name: 'Python',
    extension: 'py',
    monacoLanguage: 'python',
    icon: '🐍',
    category: 'General',
    description: 'Simple, readable, and powerful',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `# Python - Simple, readable, and powerful
print("Hello, World!")

# Variables and functions
name = "Developer"
age = 25

def greet(person, years):
    return f"Hello, {person}! You are {years} years old."

print(greet(name, age))

# List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers]
print(f"Squares: {squares}")`
  },
  {
    id: 'java',
    name: 'Java',
    extension: 'java',
    monacoLanguage: 'java',
    icon: '☕',
    category: 'Enterprise',
    description: 'Object-oriented, platform-independent',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// Java - Object-oriented, platform-independent
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        String name = "Developer";
        int age = 25;
        
        String greeting = greet(name, age);
        System.out.println(greeting);
    }
    
    public static String greet(String person, int years) {
        return "Hello, " + person + "! You are " + years + " years old.";
    }
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: 'cpp',
    monacoLanguage: 'cpp',
    icon: '⚡',
    category: 'Systems',
    description: 'High-performance system programming',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// C++ - High-performance system programming
#include <iostream>
#include <string>
#include <vector>

using namespace std;

string greet(const string& person, int age) {
    return "Hello, " + person + "! You are " + to_string(age) + " years old.";
}

int main() {
    cout << "Hello, World!" << endl;
    
    string name = "Developer";
    int age = 25;
    
    cout << greet(name, age) << endl;
    
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Numbers: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}`
  },
  {
    id: 'c',
    name: 'C',
    extension: 'c',
    monacoLanguage: 'c',
    icon: '🔧',
    category: 'Systems',
    description: 'Low-level system programming',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// C - Low-level system programming
#include <stdio.h>
#include <string.h>

void greet(const char* person, int age) {
    printf("Hello, %s! You are %d years old.\\n", person, age);
}

int main() {
    printf("Hello, World!\\n");
    
    const char* name = "Developer";
    int age = 25;
    
    greet(name, age);
    
    // Array example
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    return 0;
}`
  },
  {
    id: 'go',
    name: 'Go',
    extension: 'go',
    monacoLanguage: 'go',
    icon: '🐹',
    category: 'Systems',
    description: 'Simple, fast, and reliable',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// Go - Simple, fast, and reliable
package main

import (
    "fmt"
)

func greet(person string, age int) string {
    return fmt.Sprintf("Hello, %s! You are %d years old.", person, age)
}

func main() {
    fmt.Println("Hello, World!")
    
    name := "Developer"
    age := 25
    
    fmt.Println(greet(name, age))
    
    // Slice example
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Printf("Numbers: %v\\n", numbers)
}`
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: 'rs',
    monacoLanguage: 'rust',
    icon: '🦀',
    category: 'Systems',
    description: 'Memory-safe systems programming',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// Rust - Memory-safe systems programming
fn greet(person: &str, age: u32) -> String {
    format!("Hello, {}! You are {} years old.", person, age)
}

fn main() {
    println!("Hello, World!");
    
    let name = "Developer";
    let age = 25;
    
    println!("{}", greet(name, age));
    
    // Vector example
    let numbers = vec![1, 2, 3, 4, 5];
    println!("Numbers: {:?}", numbers);
}`
  },
  {
    id: 'csharp',
    name: 'C#',
    extension: 'cs',
    monacoLanguage: 'csharp',
    icon: '💜',
    category: 'Enterprise',
    description: 'Modern .NET programming language',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// C# - Modern .NET programming language
using System;
using System.Collections.Generic;

class Program
{
    static string Greet(string person, int age)
    {
        return $"Hello, {person}! You are {age} years old.";
    }
    
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        string name = "Developer";
        int age = 25;
        
        Console.WriteLine(Greet(name, age));
        
        // List example
        var numbers = new List<int> {1, 2, 3, 4, 5};
        Console.WriteLine($"Numbers: [{string.Join(", ", numbers)}]");
    }
}`
  },
  {
    id: 'php',
    name: 'PHP',
    extension: 'php',
    monacoLanguage: 'php',
    icon: '🐘',
    category: 'Web',
    description: 'Server-side web development',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `<?php
// PHP - Server-side web development

function greet($person, $age) {
    return "Hello, $person! You are $age years old.";
}

echo "Hello, World!\\n";

$name = "Developer";
$age = 25;

echo greet($name, $age) . "\\n";

// Array example
$numbers = [1, 2, 3, 4, 5];
echo "Numbers: " . implode(", ", $numbers) . "\\n";
?>`
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extension: 'rb',
    monacoLanguage: 'ruby',
    icon: '💎',
    category: 'Web',
    description: 'Elegant and expressive',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `# Ruby - Elegant and expressive

def greet(person, age)
  "Hello, #{person}! You are #{age} years old."
end

puts "Hello, World!"

name = "Developer"
age = 25

puts greet(name, age)

# Array example
numbers = [1, 2, 3, 4, 5]
puts "Numbers: #{numbers.join(', ')}"

# Block example
squares = numbers.map { |n| n ** 2 }
puts "Squares: #{squares.join(', ')}"`
  },
  {
    id: 'swift',
    name: 'Swift',
    extension: 'swift',
    monacoLanguage: 'swift',
    icon: '🦉',
    category: 'Mobile',
    description: 'Modern language for Apple platforms',
    executionSupported: false, // Complex setup required
    compilerRequired: true,
    defaultTemplate: `// Swift - Modern language for Apple platforms
import Foundation

func greet(person: String, age: Int) -> String {
    return "Hello, \\(person)! You are \\(age) years old."
}

print("Hello, World!")

let name = "Developer"
let age = 25

print(greet(person: name, age: age))

// Array example
let numbers = [1, 2, 3, 4, 5]
print("Numbers: \\(numbers)")

// Higher-order functions
let squares = numbers.map { $0 * $0 }
print("Squares: \\(squares)")`
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    extension: 'kt',
    monacoLanguage: 'kotlin',
    icon: '🟣',
    category: 'Mobile',
    description: 'Modern JVM language',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// Kotlin - Modern JVM language

fun greet(person: String, age: Int): String {
    return "Hello, $person! You are $age years old."
}

fun main() {
    println("Hello, World!")
    
    val name = "Developer"
    val age = 25
    
    println(greet(name, age))
    
    // List example
    val numbers = listOf(1, 2, 3, 4, 5)
    println("Numbers: $numbers")
    
    // Higher-order functions
    val squares = numbers.map { it * it }
    println("Squares: $squares")
}`
  },
  {
    id: 'scala',
    name: 'Scala',
    extension: 'scala',
    monacoLanguage: 'scala',
    icon: '🌿',
    category: 'Functional',
    description: 'Functional programming on JVM',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `// Scala - Functional programming on JVM

object Main extends App {
  def greet(person: String, age: Int): String = {
    s"Hello, $person! You are $age years old."
  }
  
  println("Hello, World!")
  
  val name = "Developer"
  val age = 25
  
  println(greet(name, age))
  
  // List example
  val numbers = List(1, 2, 3, 4, 5)
  println(s"Numbers: $numbers")
  
  // Functional programming
  val squares = numbers.map(_ * _)
  println(s"Squares: $squares")
}`
  },
  {
    id: 'r',
    name: 'R',
    extension: 'r',
    monacoLanguage: 'r',
    icon: '📊',
    category: 'Data Science',
    description: 'Statistical computing and graphics',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `# R - Statistical computing and graphics

greet <- function(person, age) {
  paste("Hello,", person, "! You are", age, "years old.")
}

cat("Hello, World!\\n")

name <- "Developer"
age <- 25

cat(greet(name, age), "\\n")

# Vector example
numbers <- c(1, 2, 3, 4, 5)
cat("Numbers:", numbers, "\\n")

# Vectorized operations
squares <- numbers ^ 2
cat("Squares:", squares, "\\n")`
  },
  {
    id: 'julia',
    name: 'Julia',
    extension: 'jl',
    monacoLanguage: 'julia',
    icon: '🔮',
    category: 'Scientific',
    description: 'High-performance scientific computing',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `# Julia - High-performance scientific computing

function greet(person, age)
    "Hello, $person! You are $age years old."
end

println("Hello, World!")

name = "Developer"
age = 25

println(greet(name, age))

# Array example
numbers = [1, 2, 3, 4, 5]
println("Numbers: $numbers")

# Broadcasting
squares = numbers .^ 2
println("Squares: $squares")`
  },
  {
    id: 'perl',
    name: 'Perl',
    extension: 'pl',
    monacoLanguage: 'perl',
    icon: '🐪',
    category: 'Scripting',
    description: 'Text processing and system administration',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `#!/usr/bin/perl
# Perl - Text processing and system administration

use strict;
use warnings;

sub greet {
    my ($person, $age) = @_;
    return "Hello, $person! You are $age years old.";
}

print "Hello, World!\\n";

my $name = "Developer";
my $age = 25;

print greet($name, $age) . "\\n";

# Array example
my @numbers = (1, 2, 3, 4, 5);
print "Numbers: " . join(", ", @numbers) . "\\n";

# Map example
my @squares = map { $_ * $_ } @numbers;
print "Squares: " . join(", ", @squares) . "\\n";`
  },
  {
    id: 'dart',
    name: 'Dart',
    extension: 'dart',
    monacoLanguage: 'dart',
    icon: '🎯',
    category: 'Mobile',
    description: 'Flutter and web development',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `// Dart - Flutter and web development

String greet(String person, int age) {
  return 'Hello, $person! You are $age years old.';
}

void main() {
  print('Hello, World!');
  
  String name = 'Developer';
  int age = 25;
  
  print(greet(name, age));
  
  // List example
  List<int> numbers = [1, 2, 3, 4, 5];
  print('Numbers: $numbers');
  
  // Higher-order functions
  List<int> squares = numbers.map((n) => n * n).toList();
  print('Squares: $squares');
}`
  },
  {
    id: 'elixir',
    name: 'Elixir',
    extension: 'ex',
    monacoLanguage: 'elixir',
    icon: '💧',
    category: 'Functional',
    description: 'Concurrent, fault-tolerant programming',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `# Elixir - Concurrent, fault-tolerant programming

defmodule Playground do
  def greet(person, age) do
    "Hello, #{person}! You are #{age} years old."
  end
  
  def main do
    IO.puts("Hello, World!")
    
    name = "Developer"
    age = 25
    
    IO.puts(greet(name, age))
    
    # List example
    numbers = [1, 2, 3, 4, 5]
    IO.puts("Numbers: #{inspect(numbers)}")
    
    # Enum module
    squares = Enum.map(numbers, fn n -> n * n end)
    IO.puts("Squares: #{inspect(squares)}")
  end
end

Playground.main()`
  },
  {
    id: 'haskell',
    name: 'Haskell',
    extension: 'hs',
    monacoLanguage: 'haskell',
    icon: '🔢',
    category: 'Functional',
    description: 'Pure functional programming',
    executionSupported: true,
    compilerRequired: true,
    defaultTemplate: `-- Haskell - Pure functional programming

greet :: String -> Int -> String
greet person age = "Hello, " ++ person ++ "! You are " ++ show age ++ " years old."

main :: IO ()
main = do
  putStrLn "Hello, World!"
  
  let name = "Developer"
  let age = 25
  
  putStrLn $ greet name age
  
  -- List example
  let numbers = [1, 2, 3, 4, 5]
  putStrLn $ "Numbers: " ++ show numbers
  
  -- List comprehension
  let squares = [n * n | n <- numbers]
  putStrLn $ "Squares: " ++ show squares`
  },
  {
    id: 'lua',
    name: 'Lua',
    extension: 'lua',
    monacoLanguage: 'lua',
    icon: '🌙',
    category: 'Scripting',
    description: 'Lightweight scripting language',
    executionSupported: true,
    compilerRequired: false,
    defaultTemplate: `-- Lua - Lightweight scripting language

function greet(person, age)
  return "Hello, " .. person .. "! You are " .. age .. " years old."
end

print("Hello, World!")

local name = "Developer"
local age = 25

print(greet(name, age))

-- Table example
local numbers = {1, 2, 3, 4, 5}
print("Numbers: " .. table.concat(numbers, ", "))

-- Table iteration
local squares = {}
for i, n in ipairs(numbers) do
  squares[i] = n * n
end
print("Squares: " .. table.concat(squares, ", "))`
  }
];

// Get language by ID
export const getLanguageById = (id) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.id === id) || SUPPORTED_LANGUAGES[0];
};

// Get languages by category
export const getLanguagesByCategory = (category) => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.category === category);
};

// Get all categories
export const getCategories = () => {
  const categories = [...new Set(SUPPORTED_LANGUAGES.map(lang => lang.category))];
  return categories.sort();
};

// Get executable languages
export const getExecutableLanguages = () => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.executionSupported);
};

// Monaco theme configurations
export const MONACO_THEMES = {
  'vs-dark': {
    name: 'Dark',
    base: 'vs-dark'
  },
  'vs': {
    name: 'Light',
    base: 'vs'
  },
  'hc-black': {
    name: 'High Contrast Dark',
    base: 'hc-black'
  },
  'hc-light': {
    name: 'High Contrast Light',
    base: 'hc-light'
  }
};

// Code templates for different programming concepts
export const CODE_TEMPLATES = {
  'hello-world': {
    name: 'Hello World',
    description: 'Basic program that prints Hello World',
    category: 'Basics'
  },
  'variables': {
    name: 'Variables & Types',
    description: 'Working with variables and data types',
    category: 'Basics'
  },
  'functions': {
    name: 'Functions',
    description: 'Function definition and usage',
    category: 'Functions'
  },
  'loops': {
    name: 'Loops',
    description: 'For loops, while loops, and iteration',
    category: 'Control Flow'
  },
  'conditionals': {
    name: 'Conditionals',
    description: 'If statements and conditional logic',
    category: 'Control Flow'
  },
  'arrays': {
    name: 'Arrays/Lists',
    description: 'Working with arrays and lists',
    category: 'Data Structures'
  },
  'objects': {
    name: 'Objects/Classes',
    description: 'Object-oriented programming basics',
    category: 'Object-Oriented'
  },
  'error-handling': {
    name: 'Error Handling',
    description: 'Try-catch and error handling patterns',
    category: 'Error Handling'
  },
  'async': {
    name: 'Async Programming',
    description: 'Promises, async/await, and concurrency',
    category: 'Advanced'
  },
  'algorithms': {
    name: 'Algorithms',
    description: 'Common algorithms and problem solving',
    category: 'Algorithms'
  }
};

export default {
  SUPPORTED_LANGUAGES,
  getLanguageById,
  getLanguagesByCategory,
  getCategories,
  getExecutableLanguages,
  MONACO_THEMES,
  CODE_TEMPLATES
};