import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlayIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, Card } from '../components/ui';
import CodeEditor from '../components/editor/CodeEditor/CodeEditor';
import OutputPanel from '../components/editor/OutputPanel/OutputPanel';
import AITutorButton from '../components/ai/AITutorButton';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EXAMPLES = {
  javascript: [
    {
      label: 'Array Methods',
      code: `// Array Methods: map, filter, reduce
const products = [
  { name: 'Apple',  price: 1.2,  inStock: true  },
  { name: 'Mango',  price: 3.5,  inStock: false },
  { name: 'Banana', price: 0.8,  inStock: true  },
  { name: 'Cherry', price: 5.0,  inStock: true  },
];

// filter: only in-stock items
const available = products.filter(p => p.inStock);
console.log('Available:', available.map(p => p.name).join(', '));

// map: apply 10% discount
const discounted = available.map(p => ({
  ...p,
  price: +(p.price * 0.9).toFixed(2),
}));
console.log('Discounted prices:');
discounted.forEach(p => console.log(\` \${p.name}: \$\${p.price}\`));

// reduce: total cost
const total = discounted.reduce((sum, p) => sum + p.price, 0);
console.log('Total: \$' + total.toFixed(2));`,
    },
    {
      label: 'Closures & Currying',
      code: `// Closures and currying in JavaScript
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double  = multiply(2);
const triple  = multiply(3);
const tenX    = multiply(10);

console.log('double(5) =', double(5));
console.log('triple(5) =', triple(5));
console.log('tenX(7)   =', tenX(7));

// Practical: tax calculator
function withTax(rate) {
  return (price) => +(price * (1 + rate / 100)).toFixed(2);
}

const ukPrice  = withTax(20);
const euPrice  = withTax(19);

console.log('\\nProduct: $100');
console.log('UK (20% VAT):', ukPrice(100));
console.log('EU (19% VAT):', euPrice(100));`,
    },
    {
      label: 'Classes & Inheritance',
      code: `// ES6 Classes with inheritance
class Animal {
  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
  }
  speak() {
    return \`\${this.name} says \${this.sound}!\`;
  }
  toString() {
    return \`Animal(\${this.name})\`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, 'Woof');
    this.breed = breed;
  }
  fetch(item) {
    return \`\${this.name} fetches the \${item}!\`;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name, 'Meow');
  }
  purr() {
    return \`\${this.name} purrs contentedly...\`;
  }
}

const dog = new Dog('Rex', 'Labrador');
const cat = new Cat('Whiskers');

console.log(dog.speak());
console.log(dog.fetch('ball'));
console.log(cat.speak());
console.log(cat.purr());
console.log('Is dog an Animal?', dog instanceof Animal);`,
    },
  ],

  python: [
    {
      label: 'List Comprehensions',
      code: `# Python List Comprehensions & Generators

# Basic comprehension
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)

# Conditional comprehension
evens = [x for x in range(20) if x % 2 == 0]
print("Evens:", evens)

# Nested comprehension – multiplication table
table = [[i * j for j in range(1, 6)] for i in range(1, 6)]
print("\\n5x5 Multiplication table:")
for row in table:
    print("  ", row)

# Dictionary comprehension
words = ["hello", "world", "python", "code"]
word_lengths = {w: len(w) for w in words}
print("\\nWord lengths:", word_lengths)

# Generator expression (memory-efficient)
total = sum(x**2 for x in range(1, 101))
print(f"\\nSum of squares 1-100: {total}")`,
    },
    {
      label: 'OOP & Dataclasses',
      code: `# Python OOP with dataclasses
from dataclasses import dataclass, field
from typing import List

@dataclass
class Student:
    name: str
    age: int
    grades: List[float] = field(default_factory=list)

    def add_grade(self, grade: float):
        self.grades.append(grade)

    @property
    def average(self) -> float:
        return sum(self.grades) / len(self.grades) if self.grades else 0

    @property
    def letter_grade(self) -> str:
        avg = self.average
        if avg >= 90: return 'A'
        if avg >= 80: return 'B'
        if avg >= 70: return 'C'
        if avg >= 60: return 'D'
        return 'F'

    def __str__(self):
        return f"{self.name} (avg: {self.average:.1f} — {self.letter_grade})"

# Usage
students = [Student("Alice", 20), Student("Bob", 22), Student("Carol", 21)]

for scores, student in zip(
    [[92, 88, 95], [75, 80, 70], [60, 65, 58]],
    students
):
    for s in scores:
        student.add_grade(s)

for s in students:
    print(s)

best = max(students, key=lambda s: s.average)
print(f"\\nTop student: {best.name}")`,
    },
    {
      label: 'Decorators',
      code: `# Python Decorators
import time
import functools

# Timing decorator
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = (time.time() - start) * 1000
        print(f"  {func.__name__} took {elapsed:.2f}ms")
        return result
    return wrapper

# Memoisation decorator
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

@timer
@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Computing fibonacci(30):")
result = fibonacci(30)
print(f"Result: {result}")

print("\\nComputing fibonacci(30) again (cached):")
result = fibonacci(30)
print(f"Result: {result}")`,
    },
  ],

  typescript: [
    {
      label: 'Interfaces & Generics',
      code: `// TypeScript: Interfaces and Generics

interface Repository<T> {
  findById(id: number): T | undefined;
  findAll(): T[];
  save(item: T): void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'learner';
}

class InMemoryRepo<T extends { id: number }> implements Repository<T> {
  private items: Map<number, T> = new Map();

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  save(item: T): void {
    this.items.set(item.id, item);
  }
}

const users = new InMemoryRepo<User>();
users.save({ id: 1, name: 'Alice', email: 'alice@seek.com', role: 'admin' });
users.save({ id: 2, name: 'Bob',   email: 'bob@seek.com',   role: 'learner' });
users.save({ id: 3, name: 'Carol', email: 'carol@seek.com', role: 'learner' });

console.log('All users:');
users.findAll().forEach(u => console.log(\` [\${u.role}] \${u.name} — \${u.email}\`));

const found = users.findById(2);
console.log('\\nFound by id 2:', found?.name);`,
    },
    {
      label: 'Enums & Type Guards',
      code: `// TypeScript: Enums and Type Guards

enum Status { Pending = 'PENDING', Active = 'ACTIVE', Closed = 'CLOSED' }

type Circle    = { kind: 'circle';    radius: number };
type Rectangle = { kind: 'rectangle'; width: number; height: number };
type Triangle  = { kind: 'triangle';  base: number;  height: number };
type Shape = Circle | Rectangle | Triangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
  }
}

const shapes: Shape[] = [
  { kind: 'circle',    radius: 5        },
  { kind: 'rectangle', width: 4, height: 6 },
  { kind: 'triangle',  base: 3, height: 8  },
];

shapes.forEach(s => {
  console.log(\`\${s.kind}: area = \${area(s).toFixed(2)}\`);
});

// Enum usage
function describe(status: Status): string {
  return \`Order is currently \${status.toLowerCase()}\`;
}

console.log('\\n' + describe(Status.Active));
console.log(describe(Status.Pending));`,
    },
    {
      label: 'Async & Typed API',
      code: `// TypeScript: Async/Await with typed responses

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Simulated async fetch with typed response
async function fetchPost(id: number): Promise<ApiResponse<Post>> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));

  if (id < 1 || id > 5) {
    throw new Error(\`Post \${id} not found\`);
  }

  return {
    status: 200,
    message: 'OK',
    data: {
      id,
      userId: Math.ceil(id / 2),
      title: \`Post number \${id}\`,
      body: \`This is the body of post \${id}. TypeScript keeps this fully typed.\`,
    }
  };
}

async function main() {
  for (const id of [1, 3, 5]) {
    try {
      const { data, status } = await fetchPost(id);
      console.log(\`[\${status}] \${data.title} (user \${data.userId})\`);
    } catch (e: unknown) {
      console.error((e as Error).message);
    }
  }
}

main();`,
    },
  ],

  java: [
    {
      label: 'Collections & Streams',
      code: `import java.util.*;
import java.util.stream.*;

public class HelloWorld {
    public static void main(String[] args) {
        // ArrayList and manipulation
        List<String> fruits = new ArrayList<>(
            Arrays.asList("Apple","Mango","Banana","Cherry","Pear")
        );

        // Sort and print
        Collections.sort(fruits);
        System.out.println("Sorted: " + fruits);

        // Stream: filter + map + collect
        List<String> longFruits = fruits.stream()
            .filter(f -> f.length() > 4)
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Long names (upper): " + longFruits);

        // Map (dictionary)
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 92);
        scores.put("Bob",   78);
        scores.put("Carol", 85);

        // Sort by value and print
        System.out.println("\\nRankings:");
        scores.entrySet().stream()
            .sorted(Map.Entry.<String,Integer>comparingByValue().reversed())
            .forEach(e -> System.out.println("  " + e.getKey() + ": " + e.getValue()));
    }
}`,
    },
    {
      label: 'OOP & Polymorphism',
      code: `public class HelloWorld {
    abstract static class Shape {
        String color;
        Shape(String color) { this.color = color; }
        abstract double area();
        public String toString() {
            return String.format("%s %s (area=%.2f)", color, getClass().getSimpleName(), area());
        }
    }

    static class Circle extends Shape {
        double radius;
        Circle(String color, double radius) {
            super(color); this.radius = radius;
        }
        double area() { return Math.PI * radius * radius; }
    }

    static class Rectangle extends Shape {
        double w, h;
        Rectangle(String color, double w, double h) {
            super(color); this.w = w; this.h = h;
        }
        double area() { return w * h; }
    }

    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle("Red",  5),
            new Rectangle("Blue", 4, 6),
            new Circle("Green", 3),
            new Rectangle("Yellow", 7, 2),
        };

        for (Shape s : shapes) {
            System.out.println(s);
        }

        double total = 0;
        for (Shape s : shapes) total += s.area();
        System.out.printf("\\nTotal area: %.2f%n", total);
    }
}`,
    },
    {
      label: 'Fibonacci & Recursion',
      code: `public class HelloWorld {
    // Recursive Fibonacci
    public static long fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }

    // Iterative Fibonacci (faster)
    public static long fibIter(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long c = a + b; a = b; b = c;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println("First 12 Fibonacci numbers:");
        for (int i = 0; i < 12; i++) {
            System.out.printf("  F(%2d) = %d%n", i, fib(i));
        }

        // Larger values need iterative approach
        System.out.println("\\nLarger values (iterative):");
        int[] targets = {30, 40, 50};
        for (int n : targets) {
            System.out.printf("  F(%d) = %d%n", n, fibIter(n));
        }
    }
}`,
    },
  ],

  cpp: [
    {
      label: 'STL Containers',
      code: `#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    // Vector operations
    vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    sort(nums.begin(), nums.end());
    cout << "Sorted: ";
    for (int n : nums) cout << n << " ";
    cout << endl;

    // Binary search
    bool found = binary_search(nums.begin(), nums.end(), 7);
    cout << "Found 7: " << (found ? "yes" : "no") << endl;

    // Map (dictionary)
    map<string, int> scores;
    scores["Alice"] = 92;
    scores["Bob"]   = 78;
    scores["Carol"] = 85;

    cout << "\\nScores:" << endl;
    for (auto& [name, score] : scores) {
        cout << "  " << name << ": " << score << endl;
    }

    // Find max
    auto best = max_element(scores.begin(), scores.end(),
        [](auto& a, auto& b){ return a.second < b.second; });
    cout << "Top: " << best->first << " (" << best->second << ")" << endl;

    return 0;
}`,
    },
    {
      label: 'Classes & OOP',
      code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

class BankAccount {
    string owner;
    double balance;
    vector<string> history;

public:
    BankAccount(string name, double initial)
        : owner(name), balance(initial) {
        history.push_back("Account opened: $" + to_string((int)initial));
    }

    void deposit(double amount) {
        balance += amount;
        history.push_back("Deposit: $" + to_string((int)amount));
    }

    bool withdraw(double amount) {
        if (amount > balance) return false;
        balance -= amount;
        history.push_back("Withdrawal: $" + to_string((int)amount));
        return true;
    }

    void printStatement() const {
        cout << "Account: " << owner << endl;
        for (const auto& h : history) cout << "  " << h << endl;
        cout << "  Balance: $" << balance << endl;
    }
};

int main() {
    BankAccount acc("Alice", 1000);
    acc.deposit(500);
    acc.withdraw(200);
    bool ok = acc.withdraw(2000);
    cout << "Overdraft attempt: " << (ok ? "allowed" : "denied") << "\\n\\n";
    acc.printStatement();
    return 0;
}`,
    },
    {
      label: 'Fibonacci & Pointers',
      code: `#include <iostream>
#include <vector>
using namespace std;

// Fibonacci with memoisation
long long fib(int n, vector<long long>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fib(n-1, memo) + fib(n-2, memo);
    return memo[n];
}

// Pointer arithmetic example
void reverseArray(int* arr, int size) {
    int* left  = arr;
    int* right = arr + size - 1;
    while (left < right) {
        swap(*left, *right);
        left++; right--;
    }
}

int main() {
    // Fibonacci
    int N = 15;
    vector<long long> memo(N+1, -1);
    cout << "Fibonacci sequence:" << endl;
    for (int i = 0; i <= N; i++) {
        cout << "F(" << i << ") = " << fib(i, memo) << endl;
    }

    // Pointer reversal
    int arr[] = {1, 2, 3, 4, 5};
    int size = 5;
    reverseArray(arr, size);
    cout << "\\nReversed array: ";
    for (int i = 0; i < size; i++) cout << arr[i] << " ";
    cout << endl;

    return 0;
}`,
    },
  ],

  c: [
    {
      label: 'Strings & Pointers',
      code: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

// Reverse a string in-place using pointers
void reverseStr(char* s) {
    char* left  = s;
    char* right = s + strlen(s) - 1;
    while (left < right) {
        char tmp = *left;
        *left = *right;
        *right = tmp;
        left++; right--;
    }
}

// Count vowels
int countVowels(const char* s) {
    int count = 0;
    while (*s) {
        char c = tolower(*s);
        if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') count++;
        s++;
    }
    return count;
}

int main() {
    char str[] = "Hello, World!";
    printf("Original: %s\\n", str);
    printf("Vowels: %d\\n", countVowels(str));

    reverseStr(str);
    printf("Reversed: %s\\n", str);

    // String comparison
    const char* a = "apple";
    const char* b = "banana";
    int cmp = strcmp(a, b);
    printf("\\n'%s' vs '%s': %s\\n", a, b,
           cmp < 0 ? "a comes first" : cmp > 0 ? "b comes first" : "equal");

    return 0;
}`,
    },
    {
      label: 'Structs & Functions',
      code: `#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 5

typedef struct {
    char name[50];
    int  age;
    float grades[3];
    float average;
} Student;

float calcAverage(float* grades, int n) {
    float sum = 0;
    for (int i = 0; i < n; i++) sum += grades[i];
    return sum / n;
}

void printStudent(const Student* s) {
    printf("%-10s | age %2d | avg: %.1f\\n",
           s->name, s->age, s->average);
}

int compareAvg(const void* a, const void* b) {
    float diff = ((Student*)b)->average - ((Student*)a)->average;
    return diff > 0 ? 1 : diff < 0 ? -1 : 0;
}

int main() {
    Student students[MAX_STUDENTS] = {
        {"Alice",  20, {88, 92, 95}},
        {"Bob",    22, {72, 68, 75}},
        {"Carol",  21, {80, 85, 90}},
        {"Dave",   23, {60, 65, 70}},
        {"Eve",    20, {95, 98, 92}},
    };

    // Compute averages
    for (int i = 0; i < MAX_STUDENTS; i++)
        students[i].average = calcAverage(students[i].grades, 3);

    // Sort by average (descending)
    qsort(students, MAX_STUDENTS, sizeof(Student), compareAvg);

    printf("Student Rankings:\\n");
    printf("%-10s | age    | average\\n", "Name");
    printf("--------------------------------\\n");
    for (int i = 0; i < MAX_STUDENTS; i++)
        printStudent(&students[i]);

    return 0;
}`,
    },
    {
      label: 'Fibonacci & Recursion',
      code: `#include <stdio.h>

// Recursive fibonacci
long long fib_recursive(int n) {
    if (n <= 1) return n;
    return fib_recursive(n-1) + fib_recursive(n-2);
}

// Iterative fibonacci (efficient)
long long fib_iterative(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1, c;
    for (int i = 2; i <= n; i++) {
        c = a + b; a = b; b = c;
    }
    return b;
}

// Factorial (recursive)
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("Fibonacci sequence (first 12):\\n");
    for (int i = 0; i < 12; i++) {
        printf("  F(%2d) = %lld\\n", i, fib_recursive(i));
    }

    printf("\\nLarger values (iterative):\\n");
    int targets[] = {20, 30, 40};
    for (int k = 0; k < 3; k++) {
        printf("  F(%d) = %lld\\n", targets[k], fib_iterative(targets[k]));
    }

    printf("\\nFactorials:\\n");
    for (int i = 1; i <= 10; i++) {
        printf("  %2d! = %lld\\n", i, factorial(i));
    }

    return 0;
}`,
    },
  ],

  go: [
    {
      label: 'Goroutines & Channels',
      code: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		result := j * j // square the job value
		fmt.Printf("Worker %d processed job %d → %d\\n", id, j, result)
		results <- result
	}
}

func main() {
	jobs    := make(chan int, 10)
	results := make(chan int, 10)
	var wg sync.WaitGroup

	// Launch 3 workers
	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	// Send 9 jobs
	for j := 1; j <= 9; j++ {
		jobs <- j
	}
	close(jobs)

	// Wait then close results
	go func() {
		wg.Wait()
		close(results)
	}()

	total := 0
	for r := range results {
		total += r
	}
	fmt.Printf("\\nSum of squares 1-9: %d\\n", total)
}`,
    },
    {
      label: 'Structs & Methods',
      code: `package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Area() float64
	Perimeter() float64
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }

func printShape(s Shape) {
	fmt.Printf("  Area: %.2f  Perimeter: %.2f\\n", s.Area(), s.Perimeter())
}

func main() {
	shapes := []Shape{
		Circle{Radius: 5},
		Rectangle{Width: 4, Height: 6},
		Circle{Radius: 3},
		Rectangle{Width: 10, Height: 2},
	}

	for _, s := range shapes {
		fmt.Printf("%T\\n", s)
		printShape(s)
	}
}`,
    },
    {
      label: 'Maps & Slices',
      code: `package main

import (
	"fmt"
	"sort"
	"strings"
)

func wordCount(text string) map[string]int {
	counts := make(map[string]int)
	for _, word := range strings.Fields(strings.ToLower(text)) {
		word = strings.Trim(word, ".,!?")
		counts[word]++
	}
	return counts
}

func main() {
	text := "Go is fast. Go is simple. Go is great for concurrency."
	counts := wordCount(text)

	// Sort keys for consistent output
	keys := make([]string, 0, len(counts))
	for k := range counts {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	fmt.Println("Word frequencies:")
	for _, k := range keys {
		fmt.Printf("  %-15s %d\\n", k, counts[k])
	}

	// Slice operations
	nums := []int{5, 2, 8, 1, 9, 3, 7}
	sort.Ints(nums)
	fmt.Println("\\nSorted slice:", nums)

	// Filter evens
	evens := nums[:0]
	for _, n := range nums {
		if n%2 == 0 {
			evens = append(evens, n)
		}
	}
	fmt.Println("Evens:", evens)
}`,
    },
  ],

  gml: [
    {
      label: 'Variables & Loops',
      code: `// GML: Variables, loops and arrays
var i, result;

// Basic output
show_debug_message("=== GML Playground ===");

// For loop
show_debug_message("Counting 1-5:");
for (i = 1; i <= 5; i++) {
    show_debug_message("  " + string(i));
}

// Array operations
var numbers = [10, 20, 30, 40, 50];
var sum = 0;
for (i = 0; i < array_length(numbers); i++) {
    sum += numbers[i];
}
show_debug_message("Sum of array: " + string(sum));
show_debug_message("Average: " + string(sum / array_length(numbers)));

// While loop
show_debug_message("Powers of 2:");
var val = 1;
i = 0;
while (val <= 64) {
    show_debug_message("  2^" + string(i) + " = " + string(val));
    val *= 2;
    i++;
}`,
    },
    {
      label: 'Fibonacci',
      code: `// GML: Fibonacci sequence

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

show_debug_message("First 10 Fibonacci numbers:");
for (var i = 0; i < 10; i++) {
    var result = fibonacci(i);
    show_debug_message("  F(" + string(i) + ") = " + string(result));
}

// Array to store results
var fib_array = array_create(10, 0);
for (var j = 0; j < 10; j++) {
    fib_array[j] = fibonacci(j);
}

show_debug_message("\\nStored array: " + string(fib_array));

// Sum of first 10
var total = 0;
for (var k = 0; k < array_length(fib_array); k++) {
    total += fib_array[k];
}
show_debug_message("Sum of first 10 Fibonacci: " + string(total));`,
    },
    {
      label: 'String Operations',
      code: `// GML: String manipulation

var greeting = "Hello, World!";
show_debug_message("Original: " + greeting);
show_debug_message("Length: "   + string(string_length(greeting)));
show_debug_message("Upper: "    + string_upper(greeting));
show_debug_message("Lower: "    + string_lower(greeting));

// Substring
var sub = string_copy(greeting, 1, 5);
show_debug_message("First 5 chars: " + sub);

// String repeat pattern
var line = "";
for (var i = 0; i < 5; i++) {
    line += string(i + 1) + " ";
}
show_debug_message("Number string: " + line);

// Build a table
show_debug_message("\\nMultiplication (3x):");
for (var n = 1; n <= 5; n++) {
    show_debug_message("  3 x " + string(n) + " = " + string(3 * n));
}`,
    },
  ],
};

// Derive DEFAULT_TEMPLATES from first example of each language
const DEFAULT_TEMPLATES = Object.fromEntries(
  Object.entries(EXAMPLES).map(([lang, exs]) => [lang, exs[0].code])
);

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500', available: true },
  { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600', available: true },
  { id: 'python', name: 'Python', color: 'bg-blue-500', available: true },
  { id: 'java', name: 'Java', color: 'bg-red-500', available: true },
  { id: 'cpp', name: 'C++', color: 'bg-purple-600', available: true },
  { id: 'c', name: 'C', color: 'bg-gray-600', available: true },
  { id: 'go', name: 'Go', color: 'bg-cyan-500', available: true },
  { id: 'gml', name: 'GML', color: 'bg-green-600', available: true },
];

const Playground = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(DEFAULT_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [settings, setSettings] = useState({
    theme: 'vs-dark',
    fontSize: 14,
    wordWrap: true,
    minimap: true,
  });
  const [executionHistory, setExecutionHistory] = useState([]);
  const [selectedExample, setSelectedExample] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const { user } = useAuth();
  const editorRef = useRef(null);
  // Suppress Monaco's onValidate during language switches — it fires stale errors briefly
  const suppressValidationRef = useRef(false);

  // Load shared code from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('share');
    if (shared) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(shared))));
        if (decoded.lang && decoded.code) {
          setEditorLanguage(decoded.lang);
          setCode(decoded.code);
          if (editorRef.current?.setValue) editorRef.current.setValue(decoded.code);
          toast.success('Shared code loaded!');
        }
      } catch (e) {
        // Invalid share param — ignore silently
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fixed viewport-based panel height: both editor and output are equal size and
  // fit the screen. Header (64px) + playground toolbar rows (~160px) + run buttons
  // row (~50px) + gaps = ~290px. Both panels scroll internally for long content.
  // On mobile (< 768px) panels stack vertically so we use a fixed 400px height.
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 768);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const PANEL_HEIGHT = isMobile ? '400px' : 'calc(100vh - 310px)';

  useEffect(() => {
    if (!showSettings) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.settings-panel-container')) setShowSettings(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`playground-code-${editorLanguage}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(DEFAULT_TEMPLATES[editorLanguage]);
    }
  }, [editorLanguage]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    // Save to localStorage
    localStorage.setItem(`playground-code-${editorLanguage}`, newCode);
    // Clear previous outputs when code changes
    if (error || output) {
      setError('');
      setOutput('');
    }
  }, [editorLanguage, error, output]);

  const handleLanguageChange = useCallback((newLanguage) => {
    // Suppress Monaco validation errors for 1.5s while the new language model loads
    suppressValidationRef.current = true;
    setTimeout(() => { suppressValidationRef.current = false; }, 1500);
    setEditorLanguage(newLanguage);
    setSelectedExample(0);
    setError('');
    setOutput('');
  }, []);

  const loadExample = useCallback((index) => {
    const examples = EXAMPLES[editorLanguage];
    if (!examples || !examples[index]) return;
    const newCode = examples[index].code;
    setSelectedExample(index);
    setCode(newCode);
    // Imperatively update Monaco so the UI reflects immediately
    if (editorRef.current && editorRef.current.setValue) {
      editorRef.current.setValue(newCode);
    }
    localStorage.setItem(`playground-code-${editorLanguage}`, newCode);
    setError('');
    setOutput('');
  }, [editorLanguage]);

  const executeCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error(String(t('playground.writeCodeFirst') || 'Please write some code first'));
      return;
    }

    if (!user) {
      toast.error(String(t('auth.loginRequired') || 'Login required'));
      setError('Authentication required: Please login to use the code execution feature.');
      return;
    }

    const language = LANGUAGES.find(l => l.id === editorLanguage);
    if (!language?.available) {
      toast.error(`${language?.name} execution is coming soon!`);
      return;
    }

    setIsExecuting(true);
    setError('');
    setOutput('');

    try {
      // Call backend API for code execution
      const csrfMatch = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]+)/);
      const csrfToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : null;
      const response = await fetch('/api/v1/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          code,
          language: editorLanguage,
          input: ''
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 Playground API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 401) {
          throw new Error('Authentication failed: Please logout and login again to refresh your session.');
        } else if (response.status === 403) {
          throw new Error('Access denied: You do not have permission to execute code.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded: Please wait a moment before executing code again.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        const output = result.data?.output || result.output;
        const executionTime = result.data?.executionTime || result.executionTime;
        
        // output may be: a plain string (Python/Java/C/C++) | {stdout,...} (Rust/PHP/Ruby) | {output,...} (JS native)
        const rawOutput = typeof output === 'string'
          ? output
          : (output?.stdout ?? output?.output ?? '');
        const rawError  = typeof output === 'object' ? (output?.stderr ?? '') : '';

        // Unescape newlines and other escape sequences
        let formattedOutput = rawOutput.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        if (!formattedOutput.trim()) {
          formattedOutput = String(t('playground.codeExecutedSuccessfully') || 'Code executed successfully (no output)');
        }
        setOutput(formattedOutput);
        if (rawError) {
          setError(rawError);
        }
        
        // Add to execution history
        setExecutionHistory(prev => [{
          id: Date.now(),
          code: code.slice(0, 100) + (code.length > 100 ? '...' : ''),
          timestamp: new Date(),
          success: true,
          executionTime: executionTime,
        }, ...prev.slice(0, 9)]);
        
      } else {
        setError(result.error || 'Execution failed');
        setExecutionHistory(prev => [{
          id: Date.now(),
          code: code.slice(0, 100) + (code.length > 100 ? '...' : ''),
          timestamp: new Date(),
          success: false,
          error: result.error,
        }, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      // Fall back to client-side execution
      
      // Fallback to client-side execution for JavaScript
      if (editorLanguage === 'javascript') {
        try {
          const originalConsoleLog = console.log;
          const originalConsoleError = console.error;
          let output = '';
          
          console.log = (...args) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
          };
          
          console.error = (...args) => {
            output += 'Error: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
          };

          // eslint-disable-next-line no-new-func
          new Function(code)();
          setOutput(output || String(t('playground.codeExecutedSuccessfully') || 'Code executed successfully'));
          setError('ℹ️ ' + String(t('playground.executedLocally') || 'Executed locally'));
          
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
        } catch (execError) {
          setError(execError.toString());
        }
      } else {
        setError(`Network error: ${err.message}. Please check your connection.`);
      }
    }
    
    setIsExecuting(false);
  }, [code, editorLanguage, user]);

  const resetCode = useCallback(() => {
    setCode('');
    if (editorRef.current?.setValue) editorRef.current.setValue('');
    localStorage.removeItem(`playground-code-${editorLanguage}`);
    setError('');
    setOutput('');
    localStorage.removeItem(`playground-code-${editorLanguage}`);
    toast.success(String(t('playground.codeReset') || 'Code reset'));
  }, [editorLanguage]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(String(t('playground.codeCopied') || 'Code copied'));
    } catch (err) {
      toast.error(String(t('playground.failedToCopy') || 'Failed to copy'));
    }
  }, [code]);

  const shareCode = useCallback(async () => {
    try {
      const payload = JSON.stringify({ lang: editorLanguage, code });
      const encoded = btoa(unescape(encodeURIComponent(payload)));
      const url = `${window.location.origin}/playground?share=${encoded}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to generate share link');
    }
  }, [code, editorLanguage]);

  const saveCode = useCallback(() => {
    // Simulate saving functionality
    toast.success(String(t('playground.saveComingSoon') || 'Save coming soon'));
  }, [t]);

  const handleEditorValidation = useCallback((errors) => {
    // Ignore Monaco's stale validation events during language switches
    if (suppressValidationRef.current) return;
    if (errors.length > 0) {
      const errorMessages = errors
        .map(err => `Line ${err.startLineNumber}: ${err.message}`)
        .join('\n');
      setError(errorMessages);
    } else if (error) {
      setError('');
    }
  }, [error]);

  const currentExamples = EXAMPLES[editorLanguage] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-codearc-50">{t('playground.title')}</h1>
          <p className="text-sm text-codearc-300">{t('playground.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Language selector */}
          <div className="relative">
            <select
              value={editorLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-codearc-800 border border-white/10 text-codearc-50 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-codearc-500 pointer-events-none" />
          </div>
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${LANGUAGES.find(l => l.id === editorLanguage)?.color}`} />
          <Badge variant="success">{LANGUAGES.find(l => l.id === editorLanguage)?.name}</Badge>
        </div>
      </div>

      {/* ── Examples strip ── */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <span className="text-xs font-medium text-codearc-500 uppercase tracking-wide mr-1">Examples:</span>
        {currentExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => loadExample(i)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              selectedExample === i
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-codearc-800 text-codearc-300 border-white/10 hover:border-primary-400 hover:text-primary-400'
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* ── Main content: Editor | Output ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

        {/* Left: Code Editor */}
        <div>
          <Card padding="none" className="overflow-hidden" style={{ height: `calc(${PANEL_HEIGHT} + 41px)` }}>
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-codearc-300">{t('playground.editor')}</span>
                {user
                  ? <span className="text-xs text-codearc-500">Hi, {user.firstName}</span>
                  : <span className="text-xs text-red-400">Login required</span>
                }
              </div>
              <div className="flex items-center space-x-1">
                <AITutorButton
                  variant="ghost" size="sm"
                  context={{ type: 'codeReview', page: 'playground', language: editorLanguage }}
                  code={code} language={editorLanguage}
                >AI Review</AITutorButton>
                <Button variant="ghost" size="sm" onClick={copyCode}  icon={DocumentDuplicateIcon} />
                <Button variant="ghost" size="sm" onClick={shareCode} icon={ShareIcon} />
                <Button variant="ghost" size="sm" onClick={saveCode}  icon={BookmarkIcon} />
                <Button variant="ghost" size="sm" onClick={resetCode} icon={ArrowPathIcon} />
              </div>
            </div>

            <CodeEditor
              ref={editorRef}
              value={code}
              language={editorLanguage}
              theme={settings.theme}
              onChange={handleCodeChange}
              onValidate={handleEditorValidation}
              onRun={executeCode}
              height={PANEL_HEIGHT}
              options={{
                fontSize: settings.fontSize,
                wordWrap: settings.wordWrap ? 'on' : 'off',
                minimap: { enabled: settings.minimap },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </Card>

        </div>

        {/* Right: Output */}
        <div>
          <Card padding="none" className="overflow-hidden" style={{ height: `calc(${PANEL_HEIGHT} + 41px)` }}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <h3 className="text-sm font-medium text-codearc-300">{t('playground.output')}</h3>
              <div className="flex items-center space-x-2">
                {error && (
                  <AITutorButton
                    variant="ghost" size="sm"
                    context={{ type: 'debugging', page: 'playground', language: editorLanguage, hasError: true }}
                    code={code} language={editorLanguage}
                  >AI Debug</AITutorButton>
                )}
                {executionHistory.length > 0 && executionHistory[0].executionTime && (
                  <span className="text-xs text-codearc-500">
                    {executionHistory[0].executionTime.toFixed(0)}ms
                  </span>
                )}
              </div>
            </div>
            <OutputPanel
              output={output}
              error={error}
              isLoading={isExecuting}
              height={PANEL_HEIGHT}
              maxHeight={PANEL_HEIGHT}
              style={{ height: PANEL_HEIGHT, maxHeight: PANEL_HEIGHT }}
            />
          </Card>

          {/* Execution history (compact) */}
          {executionHistory.length > 0 && (
            <Card className="p-3 mt-3 flex-shrink-0">
              <p className="text-xs font-medium text-codearc-500 uppercase tracking-wide mb-2">Recent runs</p>
              <div className="space-y-1 max-h-28 overflow-y-auto">
                {executionHistory.map(run => (
                  <div key={run.id} className="flex items-center justify-between text-xs p-1.5 bg-codearc-800 rounded">
                    <span className="truncate flex-1 mr-2 text-codearc-300 font-mono">{run.code}</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Badge variant={run.success ? 'success' : 'error'} size="sm">
                        {run.success ? '✓' : '✗'}
                      </Badge>
                      <span className="text-codearc-500">{run.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── Action bar ── */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <Button
          variant="primary"
          size="md"
          onClick={executeCode}
          loading={isExecuting}
          disabled={!user}
          icon={PlayIcon}
          iconPosition="left"
          className="px-10"
        >
          {isExecuting ? 'Running…' : !user ? 'Login Required' : 'Run Code  ⌘↵'}
        </Button>
        <Button variant="ghost" size="md" onClick={resetCode} icon={ArrowPathIcon}>
          Clear
        </Button>
      </div>

      {/* AI Tutor floating button */}
      <AITutorButton
        variant="floating"
        context={{ type: 'general', page: 'playground', language: editorLanguage }}
        code={code}
        language={editorLanguage}
      />
    </div>
  );
};

export default Playground;
