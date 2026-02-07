// 25 C Tutorials with full 3-phase content
module.exports = function (T, S) {
  return [
    T({
      title: 'C Variables and Data Types', slug: 'c-variables-data-types',
      description: 'Learn how to declare variables and use fundamental data types in C.',
      language: 'c', difficulty: 'beginner', duration: 30,
      tags: ['c', 'variables', 'data-types', 'fundamentals'],
      objectives: ['Declare variables with proper types', 'Understand int, float, double, char', 'Use sizeof operator'],
      featured: true,
      steps: [
        S(1, {
          title: 'Integer and Float Types', content: 'C has several numeric types: int, float, double, short, long.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    int age = 25;\n    float price = 9.99f;\n    double pi = 3.14159265358979;\n    printf("age=%d price=%.2f pi=%.10f\\n", age, price, pi);\n    printf("Sizes: int=%zu float=%zu double=%zu\\n", sizeof(int), sizeof(float), sizeof(double));\n    return 0;\n}',
          concept: 'C is statically typed. Every variable must be declared with a type before use. int holds whole numbers, float holds single-precision decimals, double holds double-precision decimals.',
          keyPoints: ['int is typically 4 bytes', 'float has ~7 decimal digits of precision', 'double has ~15 decimal digits of precision', 'Use sizeof to check type sizes'],
          realWorld: 'Embedded systems use specific integer sizes (uint8_t, uint16_t) to match hardware register widths exactly.',
          mistakes: ['Forgetting the f suffix on float literals', 'Using float for financial calculations (precision loss)', 'Not initializing variables before use'],
          pInstructions: ['Declare an int, float, and double variable', 'Print each value with appropriate format specifiers', 'Print the size of each type'],
          starter: '#include <stdio.h>\nint main() {\n    // Declare an int called count\n    \n    // Declare a float called temperature\n    \n    // Declare a double called distance\n    \n    // Print all values\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    int count = 42;\n    float temperature = 98.6f;\n    double distance = 384400.0;\n    printf("count=%d temp=%.1f dist=%.1f\\n", count, temperature, distance);\n    printf("Sizes: %zu %zu %zu\\n", sizeof(count), sizeof(temperature), sizeof(distance));\n    return 0;\n}',
          hints: ['Use %d for int, %f for float/double', 'sizeof returns the size in bytes'],
          challenge: 'Write a program that declares variables of all basic numeric types and prints their sizes and ranges.',
          reqs: ['Declare int, short, long, float, double', 'Print sizeof each', 'Print at least one max value using limits.h'],
          tests: [['sizeof(int)', '4', 5], ['sizeof(double)', '8', 5]]
        }),
        S(2, {
          title: 'Characters and Strings', content: 'Characters are stored as char (1 byte). Strings are arrays of chars ending with a null terminator.',
          lang: 'c', code: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char letter = \'A\';\n    char name[] = "Alice";\n    printf("letter=%c (ASCII %d)\\n", letter, letter);\n    printf("name=%s length=%zu\\n", name, strlen(name));\n    return 0;\n}',
          concept: 'In C, a char is a small integer representing an ASCII code. Strings are char arrays terminated by \\0 (null character). There is no built-in string type.',
          keyPoints: ['char stores ASCII values (0-127)', 'Strings are null-terminated char arrays', 'strlen returns length without null terminator', 'String literals are immutable'],
          realWorld: 'Network protocols often require building raw character buffers — understanding null termination prevents buffer overruns.',
          mistakes: ['Forgetting null terminator in manual char arrays', 'Comparing strings with == instead of strcmp', 'Buffer overflow by writing past array bounds'],
          pInstructions: ['Declare a char variable', 'Declare a string using a char array', 'Print the char as both character and integer'],
          starter: '#include <stdio.h>\n#include <string.h>\nint main() {\n    // Declare a char\n    \n    // Declare a string\n    \n    // Print char as character and ASCII value\n    \n    // Print string and its length\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char grade = \'B\';\n    char greeting[] = "Hello World";\n    printf("grade=%c ASCII=%d\\n", grade, grade);\n    printf("greeting=%s length=%zu\\n", greeting, strlen(greeting));\n    return 0;\n}',
          hints: ['Use single quotes for char, double quotes for strings', '%c prints character, %d prints integer value'],
          challenge: 'Write a program that takes a string and prints each character with its ASCII value.',
          reqs: ['Iterate through each character', 'Print both the char and its ASCII code', 'Stop at null terminator'],
          tests: [['input "ABC"', 'A=65 B=66 C=67', 5]]
        })
      ]
    }),

    T({
      title: 'C Control Flow', slug: 'c-control-flow',
      description: 'Master if/else, switch, for, while, and do-while in C.',
      language: 'c', difficulty: 'beginner', duration: 35,
      tags: ['c', 'control-flow', 'loops', 'conditionals'],
      objectives: ['Write if/else and switch statements', 'Use for, while, do-while loops', 'Understand break and continue'],
      steps: [
        S(1, {
          title: 'Conditionals and Switch', content: 'C supports if/else chains and switch statements for branching logic.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    int score = 85;\n    if (score >= 90) printf("A\\n");\n    else if (score >= 80) printf("B\\n");\n    else printf("C or below\\n");\n    \n    char grade = \'B\';\n    switch (grade) {\n        case \'A\': printf("Excellent\\n"); break;\n        case \'B\': printf("Good\\n"); break;\n        default: printf("OK\\n");\n    }\n    return 0;\n}',
          concept: 'if/else evaluates boolean conditions. switch compares a value against constant cases. Always use break in switch to prevent fallthrough.',
          keyPoints: ['C uses 0 as false, non-zero as true', 'switch only works with integer types', 'Forgetting break causes fallthrough', 'Ternary operator: condition ? a : b'],
          realWorld: 'State machines in embedded systems use switch statements to handle different device states efficiently.',
          mistakes: ['Forgetting break in switch cases', 'Using = instead of == in conditions', 'Missing curly braces in multi-statement if blocks'],
          pInstructions: ['Write an if/else chain for grading', 'Write a switch for day of week', 'Use ternary operator for simple condition'],
          starter: '#include <stdio.h>\nint main() {\n    int score = 75;\n    // Write if/else for grade\n    \n    int day = 3;\n    // Write switch for day name\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    int score = 75;\n    if (score >= 90) printf("A\\n");\n    else if (score >= 80) printf("B\\n");\n    else if (score >= 70) printf("C\\n");\n    else printf("F\\n");\n    \n    int day = 3;\n    switch (day) {\n        case 1: printf("Monday\\n"); break;\n        case 2: printf("Tuesday\\n"); break;\n        case 3: printf("Wednesday\\n"); break;\n        default: printf("Other\\n");\n    }\n    return 0;\n}',
          hints: ['Use >= for range comparisons', 'Each case needs a break'],
          challenge: 'Write a simple calculator that uses switch on an operator char (+, -, *, /) to perform the corresponding operation.',
          reqs: ['Read two numbers and an operator', 'Use switch for operations', 'Handle division by zero'],
          tests: [['10 + 5', '15', 5], ['10 / 0', 'error', 5]]
        }),
        S(2, {
          title: 'Loops', content: 'C provides for, while, and do-while loops for repeated execution.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    for (int i = 0; i < 5; i++) printf("%d ", i);\n    printf("\\n");\n    \n    int n = 5;\n    while (n > 0) { printf("%d ", n); n--; }\n    printf("\\n");\n    \n    int x = 0;\n    do { printf("x=%d\\n", x); x++; } while (x < 3);\n    return 0;\n}',
          concept: 'for loops are best when you know the count. while loops test before each iteration. do-while always executes at least once.',
          keyPoints: ['for(init; test; update) is most common', 'while checks condition first', 'do-while guarantees one execution', 'break exits loop, continue skips to next iteration'],
          realWorld: 'Reading data from a file uses while loops: while there is data to read, process it.',
          mistakes: ['Off-by-one errors in loop bounds', 'Infinite loops from missing update', 'Modifying loop variable unexpectedly'],
          pInstructions: ['Write a for loop printing 1 to 10', 'Write a while loop that halves a number until < 1', 'Use do-while for menu simulation'],
          starter: '#include <stdio.h>\nint main() {\n    // for loop: print 1 to 10\n    \n    // while loop: halve 100 until < 1\n    double val = 100.0;\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    for (int i = 1; i <= 10; i++) printf("%d ", i);\n    printf("\\n");\n    \n    double val = 100.0;\n    while (val >= 1.0) { printf("%.2f ", val); val /= 2; }\n    printf("\\n");\n    return 0;\n}',
          hints: ['Use <= for inclusive upper bound', 'Divide by 2 each iteration'],
          challenge: 'Print a multiplication table (1-10) using nested for loops.',
          reqs: ['Use nested loops', 'Format output in a grid', 'Include row and column headers'],
          tests: [['row 3 col 4', '12', 5]]
        })
      ]
    }),

    T({
      title: 'C Functions', slug: 'c-functions',
      description: 'Learn to write, declare, and call functions in C with proper prototypes.',
      language: 'c', difficulty: 'beginner', duration: 35,
      tags: ['c', 'functions', 'prototypes', 'parameters'],
      objectives: ['Write function declarations and definitions', 'Understand parameter passing', 'Use function prototypes'],
      steps: [
        S(1, {
          title: 'Function Basics', content: 'Functions in C have a return type, name, parameters, and body.',
          lang: 'c', code: '#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nvoid greet(const char *name) {\n    printf("Hello, %s!\\n", name);\n}\n\nint main() {\n    printf("%d\\n", add(3, 4));\n    greet("Alice");\n    return 0;\n}',
          concept: 'Every C function must specify its return type. void means no return value. Parameters are passed by value — the function gets copies of the arguments.',
          keyPoints: ['Functions must be declared before use', 'Pass by value is the default', 'void functions return nothing', 'main() returns int (0 = success)'],
          realWorld: 'Library APIs like qsort() accept function pointers as parameters for custom comparison logic.',
          mistakes: ['Forgetting return type', 'Calling function before declaration without prototype', 'Assuming arrays are passed by value (they decay to pointers)'],
          pInstructions: ['Write a function that returns the max of two ints', 'Write a void function that prints a horizontal line', 'Call both from main'],
          starter: '#include <stdio.h>\n\n// Write max function\n\n// Write printLine function\n\nint main() {\n    // Call max and print result\n    // Call printLine\n    return 0;\n}',
          solution: '#include <stdio.h>\n\nint max(int a, int b) {\n    return (a > b) ? a : b;\n}\n\nvoid printLine(int length) {\n    for (int i = 0; i < length; i++) printf("-");\n    printf("\\n");\n}\n\nint main() {\n    printf("Max: %d\\n", max(10, 20));\n    printLine(30);\n    return 0;\n}',
          hints: ['Use ternary for simple max', 'void functions use printf directly'],
          challenge: 'Write a recursive factorial function and an iterative version. Compare results for n=0 to 10.',
          reqs: ['Recursive version', 'Iterative version', 'Handle n=0 correctly', 'Print both results side by side'],
          tests: [['factorial(5)', '120', 5], ['factorial(0)', '1', 5]]
        })
      ]
    }),

    T({
      title: 'C Pointers Fundamentals', slug: 'c-pointers-fundamentals',
      description: 'Understand pointers, addresses, dereferencing, and pointer arithmetic in C.',
      language: 'c', difficulty: 'intermediate', duration: 45,
      tags: ['c', 'pointers', 'memory', 'addresses'],
      objectives: ['Declare and use pointers', 'Understand address-of and dereference operators', 'Use pointer arithmetic'],
      featured: true,
      steps: [
        S(1, {
          title: 'Pointer Basics', content: 'A pointer stores a memory address. Use & to get address, * to dereference.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    int x = 42;\n    int *p = &x;\n    printf("x = %d\\n", x);\n    printf("address of x = %p\\n", (void*)p);\n    printf("*p = %d\\n", *p);\n    *p = 100;\n    printf("x after *p=100: %d\\n", x);\n    return 0;\n}',
          concept: 'A pointer variable holds the address of another variable. The & operator yields the address; the * operator follows the pointer to the value (dereferencing).',
          keyPoints: ['int *p declares a pointer to int', '& gets the address of a variable', '* dereferences a pointer', 'Changing *p changes the original variable'],
          realWorld: 'Operating system kernels use pointers extensively for page tables, where each entry points to a physical memory frame.',
          mistakes: ['Dereferencing NULL or uninitialized pointers', 'Confusing * in declaration vs expression', 'Forgetting that pointer type matters for arithmetic'],
          pInstructions: ['Declare an int and a pointer to it', 'Print the value via the pointer', 'Modify the value through the pointer'],
          starter: '#include <stdio.h>\nint main() {\n    int value = 10;\n    // Declare a pointer to value\n    \n    // Print value using the pointer\n    \n    // Change value through pointer to 99\n    \n    // Print value to confirm change\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    int value = 10;\n    int *ptr = &value;\n    printf("*ptr = %d\\n", *ptr);\n    *ptr = 99;\n    printf("value = %d\\n", value);\n    return 0;\n}',
          hints: ['Use & to get the address', '*ptr reads or writes the pointed-to value'],
          challenge: 'Write a swap function that swaps two integers using pointers.',
          reqs: ['Function takes two int pointers', 'Values are actually swapped in the caller', 'Print before and after in main'],
          tests: [['swap(3,5)', '5,3', 5]]
        }),
        S(2, {
          title: 'Pointer Arithmetic', content: 'Pointer arithmetic moves by the size of the pointed-to type.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    int *p = arr;\n    for (int i = 0; i < 5; i++) {\n        printf("*(p+%d) = %d\\n", i, *(p + i));\n    }\n    return 0;\n}',
          concept: 'Adding 1 to an int pointer advances it by sizeof(int) bytes, not 1 byte. This is how arrays are traversed with pointers.',
          keyPoints: ['p+1 moves by sizeof(*p) bytes', 'Array name decays to pointer to first element', 'arr[i] is equivalent to *(arr+i)', 'Pointer subtraction gives element count'],
          realWorld: 'Image processing libraries use pointer arithmetic to iterate over pixel buffers for fast manipulation.',
          mistakes: ['Adding byte offsets instead of element offsets', 'Going past array bounds', 'Subtracting pointers to different arrays'],
          pInstructions: ['Create an array of 5 ints', 'Use pointer arithmetic to print each element', 'Calculate the difference between two pointers'],
          starter: '#include <stdio.h>\nint main() {\n    int nums[] = {2, 4, 6, 8, 10};\n    int *start = nums;\n    // Print each element using pointer arithmetic\n    \n    // Print pointer difference between last and first\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    int nums[] = {2, 4, 6, 8, 10};\n    int *start = nums;\n    for (int i = 0; i < 5; i++) printf("*(start+%d) = %d\\n", i, *(start + i));\n    int *end = &nums[4];\n    printf("Difference: %td elements\\n", end - start);\n    return 0;\n}',
          hints: ['*(p+i) is the same as p[i]', 'Pointer subtraction counts elements, not bytes'],
          challenge: 'Write a function that reverses an array in place using only pointer arithmetic (no index variables).',
          reqs: ['Use two pointers (start and end)', 'Swap elements moving inward', 'No array indexing allowed'],
          tests: [['reverse {1,2,3,4,5}', '{5,4,3,2,1}', 5]]
        })
      ]
    }),

    T({
      title: 'C Arrays', slug: 'c-arrays',
      description: 'Learn to declare, initialize, and manipulate arrays in C.',
      language: 'c', difficulty: 'beginner', duration: 30,
      tags: ['c', 'arrays', 'data-structures', 'fundamentals'],
      objectives: ['Declare and initialize arrays', 'Access and modify array elements', 'Pass arrays to functions'],
      steps: [
        S(1, {
          title: 'Array Basics', content: 'Arrays store multiple values of the same type in contiguous memory.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    int nums[5] = {10, 20, 30, 40, 50};\n    for (int i = 0; i < 5; i++) {\n        printf("nums[%d] = %d\\n", i, nums[i]);\n    }\n    nums[2] = 99;\n    printf("After change: nums[2] = %d\\n", nums[2]);\n    return 0;\n}',
          concept: 'Arrays in C have a fixed size determined at compile time. Elements are accessed by index starting at 0. The array name represents the address of the first element.',
          keyPoints: ['Arrays are zero-indexed', 'Size must be known at compile time (VLAs aside)', 'No bounds checking in C', 'Array name decays to pointer in most contexts'],
          realWorld: 'Sensor data buffers in embedded systems use fixed-size arrays to store readings from hardware.',
          mistakes: ['Accessing out-of-bounds indices', 'Forgetting arrays are zero-indexed', 'Trying to assign one array to another with ='],
          pInstructions: ['Declare an array of 5 integers', 'Initialize with values', 'Print all elements using a loop'],
          starter: '#include <stdio.h>\nint main() {\n    // Declare and initialize an array\n    \n    // Print all elements\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    int scores[] = {85, 90, 78, 92, 88};\n    for (int i = 0; i < 5; i++) {\n        printf("scores[%d] = %d\\n", i, scores[i]);\n    }\n    return 0;\n}',
          hints: ['Use [] with a size or let compiler infer from initializer', 'Loop from 0 to size-1'],
          challenge: 'Write a function that finds the min and max of an array and returns them through pointer parameters.',
          reqs: ['Function takes array, size, and two int pointers', 'Sets min and max through pointers', 'Works for any size array'],
          tests: [['minmax({3,1,4,1,5})', 'min=1 max=5', 5]]
        })
      ]
    }),

    T({
      title: 'C Strings and String Functions', slug: 'c-strings',
      description: 'Master C string manipulation with standard library functions.',
      language: 'c', difficulty: 'beginner', duration: 35,
      tags: ['c', 'strings', 'string-functions', 'char-arrays'],
      objectives: ['Work with null-terminated strings', 'Use strlen, strcpy, strcat, strcmp', 'Handle string input safely'],
      steps: [
        S(1, {
          title: 'String Library Functions', content: 'The <string.h> header provides functions for string manipulation.',
          lang: 'c', code: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s1[50] = "Hello";\n    char s2[] = " World";\n    printf("Length: %zu\\n", strlen(s1));\n    strcat(s1, s2);\n    printf("Concatenated: %s\\n", s1);\n    printf("Compare: %d\\n", strcmp("abc", "abd"));\n    return 0;\n}',
          concept: 'C strings are char arrays ending in \\0. The string.h library provides strlen (length), strcpy (copy), strcat (concatenate), strcmp (compare), and more.',
          keyPoints: ['strlen does not count the null terminator', 'strcpy and strcat need sufficient buffer space', 'strcmp returns 0 for equal strings', 'Use strncpy/strncat for safety'],
          realWorld: 'Web servers parse HTTP headers by tokenizing raw character buffers using string functions like strtok and strstr.',
          mistakes: ['Buffer overflow with strcpy/strcat', 'Comparing strings with == instead of strcmp', 'Forgetting to null-terminate manual buffers'],
          pInstructions: ['Create two strings', 'Find and print the length of each', 'Concatenate them and print the result'],
          starter: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char first[100] = "Good";\n    char second[] = " Morning";\n    // Print lengths\n    \n    // Concatenate and print\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char first[100] = "Good";\n    char second[] = " Morning";\n    printf("first length: %zu\\n", strlen(first));\n    printf("second length: %zu\\n", strlen(second));\n    strcat(first, second);\n    printf("Combined: %s\\n", first);\n    return 0;\n}',
          hints: ['Make sure first has enough space for both strings', 'strcat appends to the end'],
          challenge: 'Write a function that safely copies a string with a maximum length, always ensuring null termination.',
          reqs: ['Take destination buffer, source string, and max size', 'Never write past max size', 'Always null-terminate'],
          tests: [['safeCopy(buf, "hello", 4)', '"hel"', 5]]
        })
      ]
    }),

    T({
      title: 'C Structs', slug: 'c-structs',
      description: 'Learn to create and use structures for grouping related data.',
      language: 'c', difficulty: 'intermediate', duration: 40,
      tags: ['c', 'structs', 'data-structures', 'compound-types'],
      objectives: ['Define and use structs', 'Access members with dot and arrow operators', 'Pass structs to functions'],
      steps: [
        S(1, {
          title: 'Defining and Using Structs', content: 'A struct groups related variables under one name.',
          lang: 'c', code: '#include <stdio.h>\n\ntypedef struct {\n    char name[50];\n    int age;\n    float gpa;\n} Student;\n\nint main() {\n    Student s = {"Alice", 20, 3.8f};\n    printf("%s, age %d, GPA %.1f\\n", s.name, s.age, s.gpa);\n    \n    Student *p = &s;\n    printf("Via pointer: %s\\n", p->name);\n    return 0;\n}',
          concept: 'Structs let you group different types into a single unit. Use . to access members directly, -> to access through a pointer. typedef creates an alias so you can omit the struct keyword.',
          keyPoints: ['typedef struct creates a named type', 'Use . for direct access, -> for pointer access', 'Structs are passed by value (copied)', 'Pass by pointer for efficiency'],
          realWorld: 'Network packet headers are defined as structs, mapping fields directly to byte positions in the packet buffer.',
          mistakes: ['Forgetting typedef and having to write struct everywhere', 'Passing large structs by value (expensive copy)', 'Not initializing all members'],
          pInstructions: ['Define a struct for a 2D point (x, y)', 'Create two points', 'Write a function to compute distance between them'],
          starter: '#include <stdio.h>\n#include <math.h>\n\n// Define Point struct\n\n// Write distance function\n\nint main() {\n    // Create two points and compute distance\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <math.h>\n\ntypedef struct { double x; double y; } Point;\n\ndouble distance(Point a, Point b) {\n    return sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));\n}\n\nint main() {\n    Point p1 = {0.0, 0.0};\n    Point p2 = {3.0, 4.0};\n    printf("Distance: %.2f\\n", distance(p1, p2));\n    return 0;\n}',
          hints: ['Use typedef for cleaner syntax', 'The distance formula is sqrt((x2-x1)^2 + (y2-y1)^2)'],
          challenge: 'Create a dynamic array of students (using malloc) and write functions to add, find, and print students.',
          reqs: ['Use malloc for dynamic array', 'Add student function', 'Find by name function', 'Free memory when done'],
          tests: [['add and find "Alice"', 'found', 5]]
        })
      ]
    }),

    T({
      title: 'C Dynamic Memory Allocation', slug: 'c-dynamic-memory',
      description: 'Master malloc, calloc, realloc, and free for dynamic memory management.',
      language: 'c', difficulty: 'intermediate', duration: 45,
      tags: ['c', 'memory', 'malloc', 'dynamic-allocation'],
      objectives: ['Use malloc and free', 'Understand calloc and realloc', 'Avoid memory leaks and dangling pointers'],
      featured: true,
      steps: [
        S(1, {
          title: 'malloc and free', content: 'malloc allocates heap memory; free releases it.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int n = 5;\n    int *arr = (int*)malloc(n * sizeof(int));\n    if (!arr) { printf("Allocation failed\\n"); return 1; }\n    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    free(arr);\n    return 0;\n}',
          concept: 'malloc(size) allocates size bytes from the heap and returns a pointer. Always check for NULL. free() releases the memory. Forgetting free causes memory leaks.',
          keyPoints: ['malloc returns void*, cast to needed type', 'Always check malloc return for NULL', 'Every malloc needs a matching free', 'calloc zeros the memory, malloc does not'],
          realWorld: 'Database engines allocate buffer pools with malloc to cache frequently accessed disk pages in memory.',
          mistakes: ['Forgetting to free allocated memory', 'Using memory after free (dangling pointer)', 'Not checking for NULL return', 'Double freeing memory'],
          pInstructions: ['Allocate an array of n integers with malloc', 'Fill it with squares (1,4,9,...)', 'Print and free'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int n = 10;\n    // Allocate array\n    \n    // Fill with squares\n    \n    // Print and free\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int n = 10;\n    int *arr = (int*)malloc(n * sizeof(int));\n    if (!arr) return 1;\n    for (int i = 0; i < n; i++) arr[i] = (i+1)*(i+1);\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    free(arr);\n    return 0;\n}',
          hints: ['malloc(n * sizeof(int)) for n ints', 'Square of i+1 is (i+1)*(i+1)'],
          challenge: 'Implement a resizable array (vector) using realloc that doubles capacity when full.',
          reqs: ['Start with capacity 2', 'Double capacity when full using realloc', 'Track size and capacity', 'Free everything at end'],
          tests: [['push 10 elements', 'capacity >= 10', 5]]
        })
      ]
    }),

    T({
      title: 'C File I/O', slug: 'c-file-io',
      description: 'Read from and write to files using the C standard library.',
      language: 'c', difficulty: 'intermediate', duration: 35,
      tags: ['c', 'file-io', 'stdio', 'files'],
      objectives: ['Open and close files', 'Read with fscanf and fgets', 'Write with fprintf and fputs'],
      steps: [
        S(1, {
          title: 'Reading and Writing Files', content: 'Use fopen to open, fprintf/fscanf to write/read, fclose to close.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    FILE *f = fopen("test.txt", "w");\n    if (!f) { perror("fopen"); return 1; }\n    fprintf(f, "Hello, file!\\n");\n    fprintf(f, "Number: %d\\n", 42);\n    fclose(f);\n    \n    f = fopen("test.txt", "r");\n    char line[256];\n    while (fgets(line, sizeof(line), f)) {\n        printf("Read: %s", line);\n    }\n    fclose(f);\n    return 0;\n}',
          concept: 'Files are accessed through FILE pointers. fopen opens a file in a mode ("r" read, "w" write, "a" append). Always check the return and close files when done.',
          keyPoints: ['fopen returns NULL on failure', 'fprintf works like printf but to a file', 'fgets reads a line safely with buffer size', 'Always fclose to flush and release resources'],
          realWorld: 'Log file rotation in servers writes logs with fprintf and reads them back for analysis.',
          mistakes: ['Forgetting to check fopen return', 'Not closing files (resource leak)', 'Using gets() instead of fgets() (buffer overflow)', 'Opening in wrong mode'],
          pInstructions: ['Write 5 lines to a file', 'Read them back and print to console', 'Close the file properly'],
          starter: '#include <stdio.h>\nint main() {\n    // Write to file\n    \n    // Read from file\n    \n    return 0;\n}',
          solution: '#include <stdio.h>\nint main() {\n    FILE *f = fopen("output.txt", "w");\n    if (!f) { perror("write"); return 1; }\n    for (int i = 1; i <= 5; i++) fprintf(f, "Line %d\\n", i);\n    fclose(f);\n    \n    f = fopen("output.txt", "r");\n    if (!f) { perror("read"); return 1; }\n    char buf[256];\n    while (fgets(buf, sizeof(buf), f)) printf("%s", buf);\n    fclose(f);\n    return 0;\n}',
          hints: ['Use "w" for writing, "r" for reading', 'fgets includes the newline character'],
          challenge: 'Write a program that copies one file to another, handling errors and reporting bytes copied.',
          reqs: ['Open source for reading, dest for writing', 'Copy byte by byte or buffer at a time', 'Report total bytes copied', 'Handle all errors'],
          tests: [['copy file', 'bytes match', 5]]
        })
      ]
    }),

    T({
      title: 'C Preprocessor Directives', slug: 'c-preprocessor',
      description: 'Understand #define, #include, #ifdef, and macros in C.',
      language: 'c', difficulty: 'intermediate', duration: 30,
      tags: ['c', 'preprocessor', 'macros', 'header-files'],
      objectives: ['Use #define for constants and macros', 'Understand conditional compilation', 'Create and use header files'],
      steps: [
        S(1, {
          title: 'Macros and Conditional Compilation', content: 'The preprocessor transforms code before compilation.',
          lang: 'c', code: '#include <stdio.h>\n\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n#define PI 3.14159\n#define DEBUG 1\n\nint main() {\n    printf("Max: %d\\n", MAX(10, 20));\n    printf("PI: %f\\n", PI);\n    #if DEBUG\n    printf("Debug mode is ON\\n");\n    #endif\n    return 0;\n}',
          concept: 'The preprocessor runs before the compiler. #define creates text substitutions. #ifdef/#endif enables conditional compilation. Always parenthesize macro arguments to avoid operator precedence bugs.',
          keyPoints: ['#define creates compile-time constants', 'Macros are text substitution, not functions', 'Parenthesize macro arguments', '#include guards prevent double inclusion'],
          realWorld: 'Cross-platform libraries use #ifdef to compile different code paths for Windows, Linux, and macOS.',
          mistakes: ['Macro arguments evaluated multiple times', 'Missing parentheses in macros', 'Forgetting include guards in headers'],
          pInstructions: ['Define a macro for MIN(a,b)', 'Define a constant for ARRAY_SIZE', 'Use #ifdef to conditionally print debug info'],
          starter: '#include <stdio.h>\n\n// Define MIN macro\n\n// Define ARRAY_SIZE constant\n\nint main() {\n    printf("Min of 5,3: %d\\n", /* use MIN */);\n    int arr[/* use ARRAY_SIZE */];\n    return 0;\n}',
          solution: '#include <stdio.h>\n\n#define MIN(a, b) ((a) < (b) ? (a) : (b))\n#define ARRAY_SIZE 10\n#define DEBUG\n\nint main() {\n    printf("Min of 5,3: %d\\n", MIN(5, 3));\n    int arr[ARRAY_SIZE];\n    for (int i = 0; i < ARRAY_SIZE; i++) arr[i] = i;\n    #ifdef DEBUG\n    printf("Array filled with %d elements\\n", ARRAY_SIZE);\n    #endif\n    return 0;\n}',
          hints: ['Wrap each macro parameter in parentheses', '#ifdef checks if a symbol is defined'],
          challenge: 'Create a simple logging macro system with LOG_INFO, LOG_WARN, LOG_ERROR levels that can be disabled at compile time.',
          reqs: ['Define log level macros', 'Only print messages at or above current level', 'Include file and line info using __FILE__ and __LINE__'],
          tests: [['LOG_ERROR("test")', 'prints with file/line', 5]]
        })
      ]
    }),

    T({
      title: 'C Enums and Unions', slug: 'c-enums-unions',
      description: 'Use enumerations for named constants and unions for memory-efficient type variants.',
      language: 'c', difficulty: 'intermediate', duration: 30,
      tags: ['c', 'enums', 'unions', 'type-system'],
      objectives: ['Define and use enums', 'Understand unions and their memory layout', 'Combine enums and unions for tagged unions'],
      steps: [
        S(1, {
          title: 'Enums and Unions', content: 'Enums provide named integer constants. Unions share memory between members.',
          lang: 'c', code: '#include <stdio.h>\n\ntypedef enum { RED, GREEN, BLUE } Color;\n\ntypedef union {\n    int i;\n    float f;\n    char c;\n} Value;\n\nint main() {\n    Color c = GREEN;\n    printf("GREEN = %d\\n", c);\n    \n    Value v;\n    v.i = 42;\n    printf("As int: %d\\n", v.i);\n    v.f = 3.14f;\n    printf("As float: %.2f\\n", v.f);\n    printf("sizeof(Value) = %zu\\n", sizeof(Value));\n    return 0;\n}',
          concept: 'Enums auto-number constants from 0. Unions overlay all members at the same address — only one is valid at a time. The union size equals the largest member.',
          keyPoints: ['Enum values start at 0 by default', 'You can set explicit enum values', 'Union size = size of largest member', 'Only one union member is valid at a time'],
          realWorld: 'JSON parsers use tagged unions: an enum for the type (string, number, bool) and a union for the value.',
          mistakes: ['Reading wrong union member (undefined behavior)', 'Assuming enum is a specific integer size', 'Forgetting that writing one union member invalidates others'],
          pInstructions: ['Define an enum for days of the week', 'Define a union that can hold int, float, or char', 'Demonstrate storing and reading different types'],
          starter: '#include <stdio.h>\n\n// Define Day enum\n\n// Define Data union\n\nint main() {\n    // Use enum\n    // Use union\n    return 0;\n}',
          solution: '#include <stdio.h>\n\ntypedef enum { MON, TUE, WED, THU, FRI, SAT, SUN } Day;\n\ntypedef union { int i; float f; char c; } Data;\n\nint main() {\n    Day today = WED;\n    printf("Wednesday = %d\\n", today);\n    \n    Data d;\n    d.i = 100;\n    printf("int: %d\\n", d.i);\n    d.f = 2.5f;\n    printf("float: %.1f\\n", d.f);\n    return 0;\n}',
          hints: ['Enum values auto-increment', 'Only read the last-written union member'],
          challenge: 'Implement a tagged union (struct with enum tag + union value) to represent a variant type that can be int, float, or string.',
          reqs: ['Enum for the type tag', 'Union for the value', 'Print function that checks the tag', 'Demonstrate all three types'],
          tests: [['create int variant', 'prints int value', 5]]
        })
      ]
    }),

    T({
      title: 'C Bitwise Operations', slug: 'c-bitwise-operations',
      description: 'Learn bitwise AND, OR, XOR, shift operators and their practical uses.',
      language: 'c', difficulty: 'intermediate', duration: 35,
      tags: ['c', 'bitwise', 'bit-manipulation', 'operators'],
      objectives: ['Use &, |, ^, ~, <<, >> operators', 'Set, clear, and toggle bits', 'Understand bit masks'],
      steps: [
        S(1, {
          title: 'Bitwise Operators', content: 'Bitwise operators work on individual bits of integer values.',
          lang: 'c', code: '#include <stdio.h>\nint main() {\n    unsigned char a = 0b11001010;\n    unsigned char b = 0b10110101;\n    printf("a & b = 0x%02X\\n", a & b);\n    printf("a | b = 0x%02X\\n", a | b);\n    printf("a ^ b = 0x%02X\\n", a ^ b);\n    printf("~a    = 0x%02X\\n", (unsigned char)~a);\n    printf("a << 2 = 0x%02X\\n", (unsigned char)(a << 2));\n    printf("a >> 2 = 0x%02X\\n", a >> 2);\n    return 0;\n}',
          concept: 'AND (&) masks bits. OR (|) sets bits. XOR (^) toggles bits. NOT (~) inverts all bits. Shifts (<< >>) multiply/divide by powers of 2.',
          keyPoints: ['& is bitwise AND (both bits must be 1)', '| is bitwise OR (either bit is 1)', '^ is XOR (bits differ)', '<< n multiplies by 2^n'],
          realWorld: 'Hardware drivers use bit manipulation to read/write specific bits in device control registers.',
          mistakes: ['Confusing & with &&', 'Shifting signed integers (implementation-defined)', 'Shifting by more bits than the type width'],
          pInstructions: ['Create a set of permission flags using bit positions', 'Use OR to combine permissions', 'Use AND to check permissions'],
          starter: '#include <stdio.h>\n#define READ  (1 << 0)\n#define WRITE (1 << 1)\n#define EXEC  (1 << 2)\n\nint main() {\n    unsigned char perms = 0;\n    // Set read and write\n    // Check if executable\n    // Toggle write\n    return 0;\n}',
          solution: '#include <stdio.h>\n#define READ  (1 << 0)\n#define WRITE (1 << 1)\n#define EXEC  (1 << 2)\n\nint main() {\n    unsigned char perms = 0;\n    perms |= (READ | WRITE);\n    printf("Has exec: %s\\n", (perms & EXEC) ? "yes" : "no");\n    perms ^= WRITE;\n    printf("After toggle, has write: %s\\n", (perms & WRITE) ? "yes" : "no");\n    return 0;\n}',
          hints: ['OR to set bits, AND to check, XOR to toggle', '1 << n creates a bit mask for position n'],
          challenge: 'Write functions to count the number of set bits (popcount) and to reverse the bits of a 32-bit integer.',
          reqs: ['popcount function using bit operations', 'reverseBits function', 'Handle edge cases (0, all 1s)'],
          tests: [['popcount(0xFF)', '8', 5], ['reverse(1)', 'MSB set', 5]]
        })
      ]
    }),

    T({
      title: 'C Linked List Implementation', slug: 'c-linked-list',
      description: 'Build a singly linked list from scratch with insert, delete, and traverse operations.',
      language: 'c', difficulty: 'intermediate', duration: 50,
      tags: ['c', 'linked-list', 'data-structures', 'pointers'],
      category: 'Data Structures',
      objectives: ['Implement a singly linked list', 'Insert and delete nodes', 'Traverse and search the list'],
      steps: [
        S(1, {
          title: 'Node Structure and Insertion', content: 'A linked list is a chain of nodes where each node points to the next.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nNode* createNode(int data) {\n    Node *n = (Node*)malloc(sizeof(Node));\n    n->data = data;\n    n->next = NULL;\n    return n;\n}\n\nvoid pushFront(Node **head, int data) {\n    Node *n = createNode(data);\n    n->next = *head;\n    *head = n;\n}\n\nvoid printList(Node *head) {\n    while (head) { printf("%d -> ", head->data); head = head->next; }\n    printf("NULL\\n");\n}\n\nint main() {\n    Node *head = NULL;\n    pushFront(&head, 30);\n    pushFront(&head, 20);\n    pushFront(&head, 10);\n    printList(head);\n    return 0;\n}',
          concept: 'Each node holds data and a pointer to the next node. The head pointer tracks the first node. Inserting at the front is O(1) — just update the head.',
          keyPoints: ['Node = data + next pointer', 'Head is a pointer to the first node', 'Use double pointer (Node**) to modify head', 'Always malloc new nodes'],
          realWorld: 'Operating systems use linked lists for process scheduling queues, where processes are inserted and removed dynamically.',
          mistakes: ['Forgetting to set next to NULL', 'Not using double pointer for head modification', 'Memory leaks from not freeing nodes'],
          pInstructions: ['Implement the Node struct', 'Write pushFront to add at the beginning', 'Write printList to display all elements'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n\n// Define Node struct\n\n// createNode function\n\n// pushFront function\n\n// printList function\n\nint main() {\n    Node *head = NULL;\n    // Add elements and print\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int data; struct Node *next; } Node;\n\nNode* createNode(int d) { Node *n = malloc(sizeof(Node)); n->data = d; n->next = NULL; return n; }\n\nvoid pushFront(Node **head, int d) { Node *n = createNode(d); n->next = *head; *head = n; }\n\nvoid printList(Node *h) { while(h) { printf("%d -> ", h->data); h = h->next; } printf("NULL\\n"); }\n\nint main() {\n    Node *head = NULL;\n    pushFront(&head, 3); pushFront(&head, 2); pushFront(&head, 1);\n    printList(head);\n    return 0;\n}',
          hints: ['Use struct self-reference for the next pointer', 'Double pointer lets you modify the caller\'s head'],
          challenge: 'Extend the list with: insertAt(index), deleteNode(value), reverse(), and freeList(). Handle edge cases.',
          reqs: ['Insert at any position', 'Delete by value', 'Reverse in place', 'Free all memory'],
          tests: [['insertAt(1, 99)', 'inserts at index 1', 5], ['reverse list', 'reversed order', 5]]
        })
      ]
    }),

    T({
      title: 'C Stack Implementation', slug: 'c-stack',
      description: 'Implement a stack data structure using arrays and linked lists.',
      language: 'c', difficulty: 'intermediate', duration: 40,
      tags: ['c', 'stack', 'data-structures', 'LIFO'],
      category: 'Data Structures',
      objectives: ['Implement stack with push, pop, peek', 'Build array-based and linked-list-based stacks', 'Understand LIFO principle'],
      steps: [
        S(1, {
          title: 'Array-Based Stack', content: 'A stack follows Last-In-First-Out (LIFO) ordering.',
          lang: 'c', code: '#include <stdio.h>\n#define MAX 100\n\ntypedef struct {\n    int data[MAX];\n    int top;\n} Stack;\n\nvoid init(Stack *s) { s->top = -1; }\nint isEmpty(Stack *s) { return s->top == -1; }\nint isFull(Stack *s) { return s->top == MAX - 1; }\n\nvoid push(Stack *s, int val) {\n    if (isFull(s)) { printf("Overflow\\n"); return; }\n    s->data[++s->top] = val;\n}\n\nint pop(Stack *s) {\n    if (isEmpty(s)) { printf("Underflow\\n"); return -1; }\n    return s->data[s->top--];\n}\n\nint main() {\n    Stack s;\n    init(&s);\n    push(&s, 10); push(&s, 20); push(&s, 30);\n    printf("Popped: %d\\n", pop(&s));\n    printf("Popped: %d\\n", pop(&s));\n    return 0;\n}',
          concept: 'A stack is like a stack of plates — you add to and remove from the top. The top index tracks the current position. Push increments top and stores; pop returns and decrements.',
          keyPoints: ['LIFO: Last In, First Out', 'top = -1 means empty', 'O(1) for push and pop', 'Fixed size with array implementation'],
          realWorld: 'Function call stacks in CPUs use LIFO: each function call pushes a frame, return pops it.',
          mistakes: ['Stack overflow (pushing to full stack)', 'Stack underflow (popping empty stack)', 'Off-by-one with top index'],
          pInstructions: ['Implement the Stack struct and init', 'Write push and pop functions', 'Add a peek function that returns top without removing'],
          starter: '#include <stdio.h>\n#define MAX 100\n\ntypedef struct { int data[MAX]; int top; } Stack;\n\n// Implement init, push, pop, peek\n\nint main() {\n    Stack s;\n    // Test push, pop, peek\n    return 0;\n}',
          solution: '#include <stdio.h>\n#define MAX 100\n\ntypedef struct { int data[MAX]; int top; } Stack;\n\nvoid init(Stack *s) { s->top = -1; }\nvoid push(Stack *s, int v) { if(s->top < MAX-1) s->data[++s->top] = v; }\nint pop(Stack *s) { return (s->top >= 0) ? s->data[s->top--] : -1; }\nint peek(Stack *s) { return (s->top >= 0) ? s->data[s->top] : -1; }\n\nint main() {\n    Stack s; init(&s);\n    push(&s, 10); push(&s, 20);\n    printf("Peek: %d\\n", peek(&s));\n    printf("Pop: %d\\n", pop(&s));\n    return 0;\n}',
          hints: ['peek is like pop but without decrementing top', 'Check for empty before pop/peek'],
          challenge: 'Use a stack to check if a string of parentheses (), [], {} is balanced.',
          reqs: ['Push opening brackets', 'Pop and match for closing brackets', 'Return true only if stack is empty at end', 'Handle mismatched types'],
          tests: [['check "({[]})"', 'balanced', 5], ['check "({[})"', 'not balanced', 5]]
        })
      ]
    }),

    T({
      title: 'C Queue Implementation', slug: 'c-queue',
      description: 'Build a queue data structure with enqueue, dequeue using circular array.',
      language: 'c', difficulty: 'intermediate', duration: 40,
      tags: ['c', 'queue', 'data-structures', 'FIFO'],
      category: 'Data Structures',
      objectives: ['Implement circular queue', 'Handle front and rear pointers', 'Understand FIFO principle'],
      steps: [
        S(1, {
          title: 'Circular Queue', content: 'A queue follows First-In-First-Out. A circular array avoids wasted space.',
          lang: 'c', code: '#include <stdio.h>\n#define MAX 5\n\ntypedef struct {\n    int data[MAX];\n    int front, rear, count;\n} Queue;\n\nvoid init(Queue *q) { q->front = 0; q->rear = -1; q->count = 0; }\nint isEmpty(Queue *q) { return q->count == 0; }\nint isFull(Queue *q) { return q->count == MAX; }\n\nvoid enqueue(Queue *q, int val) {\n    if (isFull(q)) { printf("Full\\n"); return; }\n    q->rear = (q->rear + 1) % MAX;\n    q->data[q->rear] = val;\n    q->count++;\n}\n\nint dequeue(Queue *q) {\n    if (isEmpty(q)) { printf("Empty\\n"); return -1; }\n    int val = q->data[q->front];\n    q->front = (q->front + 1) % MAX;\n    q->count--;\n    return val;\n}\n\nint main() {\n    Queue q; init(&q);\n    enqueue(&q, 10); enqueue(&q, 20); enqueue(&q, 30);\n    printf("Dequeued: %d\\n", dequeue(&q));\n    printf("Dequeued: %d\\n", dequeue(&q));\n    enqueue(&q, 40);\n    printf("Dequeued: %d\\n", dequeue(&q));\n    return 0;\n}',
          concept: 'A circular queue wraps around using modulo arithmetic. front tracks the next element to dequeue; rear tracks where to enqueue next. count tracks the number of elements.',
          keyPoints: ['FIFO: First In, First Out', 'Modulo wraps indices around the array', 'count distinguishes full from empty', 'O(1) enqueue and dequeue'],
          realWorld: 'Print spoolers and network packet buffers use circular queues to handle requests in order.',
          mistakes: ['Not using modulo for circular wrap', 'Confusing full and empty states', 'Off-by-one with front/rear initialization'],
          pInstructions: ['Implement the circular queue struct', 'Write enqueue and dequeue', 'Add a peek function'],
          starter: '#include <stdio.h>\n#define MAX 5\ntypedef struct { int data[MAX]; int front, rear, count; } Queue;\n\n// Implement init, enqueue, dequeue, peek\n\nint main() {\n    Queue q;\n    // Test operations\n    return 0;\n}',
          solution: '#include <stdio.h>\n#define MAX 5\ntypedef struct { int data[MAX]; int front, rear, count; } Queue;\n\nvoid init(Queue *q) { q->front=0; q->rear=-1; q->count=0; }\nvoid enqueue(Queue *q, int v) { if(q->count<MAX) { q->rear=(q->rear+1)%MAX; q->data[q->rear]=v; q->count++; } }\nint dequeue(Queue *q) { if(q->count==0) return -1; int v=q->data[q->front]; q->front=(q->front+1)%MAX; q->count--; return v; }\nint peek(Queue *q) { return q->count > 0 ? q->data[q->front] : -1; }\n\nint main() {\n    Queue q; init(&q);\n    enqueue(&q,1); enqueue(&q,2); enqueue(&q,3);\n    printf("%d %d\\n", dequeue(&q), peek(&q));\n    return 0;\n}',
          hints: ['(index + 1) % MAX wraps around', 'Use count to track fullness'],
          challenge: 'Implement a priority queue where each element has a priority and dequeue returns the highest priority item.',
          reqs: ['Store value and priority', 'Dequeue highest priority first', 'Handle equal priorities (FIFO)', 'Print queue state'],
          tests: [['enqueue(A,1) enqueue(B,3) dequeue', 'B', 5]]
        })
      ]
    }),

    T({
      title: 'C Binary Search Tree', slug: 'c-binary-search-tree',
      description: 'Implement a BST with insert, search, and traversal operations.',
      language: 'c', difficulty: 'advanced', duration: 55,
      tags: ['c', 'bst', 'binary-tree', 'data-structures'],
      category: 'Data Structures',
      objectives: ['Build a BST from scratch', 'Implement insert and search', 'Perform inorder, preorder, postorder traversals'],
      steps: [
        S(1, {
          title: 'BST Insert and Traversal', content: 'A BST keeps smaller values left and larger values right.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int data;\n    struct Node *left, *right;\n} Node;\n\nNode* newNode(int d) {\n    Node *n = (Node*)malloc(sizeof(Node));\n    n->data = d; n->left = n->right = NULL;\n    return n;\n}\n\nNode* insert(Node *root, int d) {\n    if (!root) return newNode(d);\n    if (d < root->data) root->left = insert(root->left, d);\n    else if (d > root->data) root->right = insert(root->right, d);\n    return root;\n}\n\nvoid inorder(Node *root) {\n    if (!root) return;\n    inorder(root->left);\n    printf("%d ", root->data);\n    inorder(root->right);\n}\n\nint main() {\n    Node *root = NULL;\n    int vals[] = {50, 30, 70, 20, 40, 60, 80};\n    for (int i = 0; i < 7; i++) root = insert(root, vals[i]);\n    printf("Inorder: "); inorder(root); printf("\\n");\n    return 0;\n}',
          concept: 'A BST enforces the property: left child < parent < right child. Inorder traversal produces sorted output. Average operations are O(log n) but degenerate to O(n) for skewed trees.',
          keyPoints: ['Left < Parent < Right', 'Inorder traversal gives sorted order', 'Recursive insert follows BST property', 'Average O(log n), worst O(n)'],
          realWorld: 'Database indexes often use balanced BSTs (like B-trees) to enable fast key lookups.',
          mistakes: ['Not handling the empty tree case', 'Forgetting to return the root after insert', 'Memory leaks from not freeing the tree'],
          pInstructions: ['Implement the Node struct and newNode', 'Write recursive insert', 'Write inorder traversal and test'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n\n// Node struct\n// newNode function\n// insert function\n// inorder function\n\nint main() {\n    Node *root = NULL;\n    // Insert values and print inorder\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\ntypedef struct Node { int data; struct Node *left, *right; } Node;\nNode* newNode(int d) { Node *n=malloc(sizeof(Node)); n->data=d; n->left=n->right=NULL; return n; }\nNode* insert(Node *r, int d) { if(!r) return newNode(d); if(d<r->data) r->left=insert(r->left,d); else if(d>r->data) r->right=insert(r->right,d); return r; }\nvoid inorder(Node *r) { if(!r) return; inorder(r->left); printf("%d ",r->data); inorder(r->right); }\nint main() {\n    Node *root=NULL;\n    root=insert(root,50); insert(root,30); insert(root,70);\n    inorder(root); printf("\\n");\n    return 0;\n}',
          hints: ['Base case: NULL means insert here', 'Compare to decide left or right'],
          challenge: 'Add search, delete (with all 3 cases), and a function to find the kth smallest element.',
          reqs: ['Search returns Node* or NULL', 'Delete handles leaf, one child, two children', 'Kth smallest using inorder count', 'Free deleted nodes'],
          tests: [['search(50)', 'found', 5], ['delete(30)', 'tree valid', 5]]
        })
      ]
    }),

    T({
      title: 'C Hash Table Implementation', slug: 'c-hash-table',
      description: 'Build a hash table with chaining for collision resolution.',
      language: 'c', difficulty: 'advanced', duration: 50,
      tags: ['c', 'hash-table', 'data-structures', 'hashing'],
      category: 'Data Structures',
      objectives: ['Implement a hash function', 'Handle collisions with chaining', 'Build insert, search, delete operations'],
      steps: [
        S(1, {
          title: 'Hash Table with Chaining', content: 'A hash table maps keys to indices using a hash function. Collisions are resolved with linked lists.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n#define TABLE_SIZE 10\n\ntypedef struct Entry {\n    char key[64];\n    int value;\n    struct Entry *next;\n} Entry;\n\nEntry* table[TABLE_SIZE] = {NULL};\n\nunsigned int hash(const char *key) {\n    unsigned int h = 0;\n    while (*key) h = h * 31 + *key++;\n    return h % TABLE_SIZE;\n}\n\nvoid put(const char *key, int val) {\n    unsigned int idx = hash(key);\n    Entry *e = (Entry*)malloc(sizeof(Entry));\n    strcpy(e->key, key);\n    e->value = val;\n    e->next = table[idx];\n    table[idx] = e;\n}\n\nint get(const char *key) {\n    unsigned int idx = hash(key);\n    Entry *e = table[idx];\n    while (e) {\n        if (strcmp(e->key, key) == 0) return e->value;\n        e = e->next;\n    }\n    return -1;\n}\n\nint main() {\n    put("alice", 90);\n    put("bob", 85);\n    printf("alice: %d\\n", get("alice"));\n    printf("bob: %d\\n", get("bob"));\n    return 0;\n}',
          concept: 'A hash function converts keys to array indices. When two keys hash to the same index (collision), chaining stores them in a linked list at that index.',
          keyPoints: ['Hash function must distribute keys evenly', 'Chaining uses linked lists for collisions', 'O(1) average, O(n) worst case', 'Load factor affects performance'],
          realWorld: 'Symbol tables in compilers use hash tables to quickly look up variable names and their types during compilation.',
          mistakes: ['Poor hash function causing many collisions', 'Not handling duplicate keys (update vs insert)', 'Memory leaks from not freeing chains'],
          pInstructions: ['Implement the hash function', 'Write put and get functions', 'Test with several key-value pairs'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#define TABLE_SIZE 10\n\ntypedef struct Entry { char key[64]; int value; struct Entry *next; } Entry;\nEntry* table[TABLE_SIZE];\n\n// hash, put, get functions\n\nint main() {\n    // Test hash table\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#define TABLE_SIZE 10\ntypedef struct Entry { char key[64]; int value; struct Entry *next; } Entry;\nEntry* table[TABLE_SIZE];\nunsigned int hash(const char *k) { unsigned int h=0; while(*k) h=h*31+*k++; return h%TABLE_SIZE; }\nvoid put(const char *k, int v) { unsigned int i=hash(k); Entry *e=malloc(sizeof(Entry)); strcpy(e->key,k); e->value=v; e->next=table[i]; table[i]=e; }\nint get(const char *k) { Entry *e=table[hash(k)]; while(e) { if(!strcmp(e->key,k)) return e->value; e=e->next; } return -1; }\nint main() { put("x",1); put("y",2); printf("%d %d\\n",get("x"),get("y")); return 0; }',
          hints: ['h * 31 + c is a common string hash', 'Use strcmp to compare string keys'],
          challenge: 'Add a delete function, handle duplicate keys by updating value, and implement a resize function that doubles the table when load factor exceeds 0.75.',
          reqs: ['Delete by key', 'Update existing key instead of duplicating', 'Resize and rehash all entries', 'Print load factor'],
          tests: [['put("a",1) put("a",2) get("a")', '2', 5]]
        })
      ]
    }),

    T({
      title: 'C Sorting Algorithms', slug: 'c-sorting-algorithms',
      description: 'Implement bubble sort, selection sort, insertion sort, and quicksort in C.',
      language: 'c', difficulty: 'intermediate', duration: 50,
      tags: ['c', 'sorting', 'algorithms', 'comparison'],
      category: 'Algorithms',
      objectives: ['Implement multiple sorting algorithms', 'Compare time complexities', 'Understand in-place vs extra space'],
      steps: [
        S(1, {
          title: 'Basic Sorting: Bubble and Selection', content: 'Bubble sort repeatedly swaps adjacent elements. Selection sort finds the minimum each pass.',
          lang: 'c', code: '#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) {\n                int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;\n            }\n}\n\nvoid selectionSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        int min = i;\n        for (int j = i+1; j < n; j++)\n            if (arr[j] < arr[min]) min = j;\n        int tmp = arr[i]; arr[i] = arr[min]; arr[min] = tmp;\n    }\n}\n\nvoid print(int a[], int n) { for(int i=0;i<n;i++) printf("%d ",a[i]); printf("\\n"); }\n\nint main() {\n    int a[] = {64,25,12,22,11};\n    bubbleSort(a, 5);\n    print(a, 5);\n    return 0;\n}',
          concept: 'Bubble sort is O(n^2) — simple but slow. Selection sort is also O(n^2) but makes fewer swaps. Both are in-place and good for learning fundamentals.',
          keyPoints: ['Bubble sort: compare adjacent, swap if out of order', 'Selection sort: find min, place at front', 'Both are O(n^2) average and worst', 'In-place, O(1) extra space'],
          realWorld: 'Small embedded systems with tiny datasets sometimes use simple sorts due to their minimal code size.',
          mistakes: ['Off-by-one in loop bounds', 'Forgetting to handle already-sorted input', 'Not swapping correctly (losing values)'],
          pInstructions: ['Implement bubble sort', 'Implement selection sort', 'Test both on the same array'],
          starter: '#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    // Implement\n}\n\nvoid selectionSort(int arr[], int n) {\n    // Implement\n}\n\nint main() {\n    int a[] = {5, 3, 8, 1, 2};\n    // Sort and print\n    return 0;\n}',
          solution: '#include <stdio.h>\nvoid bubbleSort(int a[], int n) { for(int i=0;i<n-1;i++) for(int j=0;j<n-i-1;j++) if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;} }\nvoid selectionSort(int a[], int n) { for(int i=0;i<n-1;i++){int m=i;for(int j=i+1;j<n;j++) if(a[j]<a[m])m=j; int t=a[i];a[i]=a[m];a[m]=t;} }\nint main() { int a[]={5,3,8,1,2}; bubbleSort(a,5); for(int i=0;i<5;i++) printf("%d ",a[i]); printf("\\n"); return 0; }',
          hints: ['Inner loop of bubble goes to n-i-1', 'Selection: track min index, swap once per pass'],
          challenge: 'Implement quicksort with Lomuto partition. Count comparisons and swaps for a random array of 20 elements.',
          reqs: ['Quicksort with partition function', 'Count comparisons and swaps', 'Print array before and after', 'Handle duplicates'],
          tests: [['sort {5,1,3,2,4}', '{1,2,3,4,5}', 5]]
        })
      ]
    }),

    T({
      title: 'C Binary Search', slug: 'c-binary-search',
      description: 'Implement binary search iteratively and recursively in C.',
      language: 'c', difficulty: 'intermediate', duration: 35,
      tags: ['c', 'binary-search', 'algorithms', 'searching'],
      category: 'Algorithms',
      objectives: ['Implement iterative binary search', 'Implement recursive binary search', 'Understand O(log n) complexity'],
      steps: [
        S(1, {
          title: 'Binary Search Implementation', content: 'Binary search halves the search space each step on a sorted array.',
          lang: 'c', code: '#include <stdio.h>\n\nint binarySearch(int arr[], int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n\nint bsRecursive(int arr[], int lo, int hi, int target) {\n    if (lo > hi) return -1;\n    int mid = lo + (hi - lo) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) return bsRecursive(arr, mid+1, hi, target);\n    return bsRecursive(arr, lo, mid-1, target);\n}\n\nint main() {\n    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int n = 10;\n    printf("Found 23 at index: %d\\n", binarySearch(arr, n, 23));\n    printf("Found 72 at index: %d\\n", bsRecursive(arr, 0, n-1, 72));\n    return 0;\n}',
          concept: 'Binary search requires a sorted array. It compares the target with the middle element and eliminates half the remaining elements each step, giving O(log n) time.',
          keyPoints: ['Array must be sorted', 'Use lo + (hi-lo)/2 to avoid overflow', 'O(log n) time complexity', 'Returns -1 if not found'],
          realWorld: 'Searching through sorted log files for a specific timestamp uses binary search for fast lookups.',
          mistakes: ['Using (lo+hi)/2 which can overflow', 'Wrong condition: lo < hi vs lo <= hi', 'Not returning -1 for not found'],
          pInstructions: ['Implement iterative binary search', 'Implement recursive version', 'Test with a sorted array'],
          starter: '#include <stdio.h>\n\nint binarySearch(int arr[], int n, int target) {\n    // Implement iterative version\n}\n\nint main() {\n    int arr[] = {1, 3, 5, 7, 9, 11, 13};\n    // Test searches\n    return 0;\n}',
          solution: '#include <stdio.h>\nint binarySearch(int a[], int n, int t) {\n    int lo=0, hi=n-1;\n    while(lo<=hi) { int m=lo+(hi-lo)/2; if(a[m]==t) return m; if(a[m]<t) lo=m+1; else hi=m-1; }\n    return -1;\n}\nint main() {\n    int a[]={1,3,5,7,9,11,13};\n    printf("Index of 7: %d\\n", binarySearch(a,7,7));\n    printf("Index of 4: %d\\n", binarySearch(a,7,4));\n    return 0;\n}',
          hints: ['Use lo+(hi-lo)/2 to prevent overflow', 'lo <= hi handles single-element case'],
          challenge: 'Implement lower_bound and upper_bound functions that find the first and last occurrence of a value in a sorted array with duplicates.',
          reqs: ['lower_bound returns first index >= target', 'upper_bound returns first index > target', 'Handle not found case', 'O(log n) for both'],
          tests: [['lower_bound({1,2,2,2,3},2)', '1', 5], ['upper_bound({1,2,2,2,3},2)', '4', 5]]
        })
      ]
    }),

    T({
      title: 'C Recursion', slug: 'c-recursion',
      description: 'Understand recursion with practical examples: factorial, Fibonacci, Tower of Hanoi.',
      language: 'c', difficulty: 'intermediate', duration: 40,
      tags: ['c', 'recursion', 'algorithms', 'fundamentals'],
      objectives: ['Write recursive functions', 'Identify base cases and recursive cases', 'Understand stack frames and recursion depth'],
      steps: [
        S(1, {
          title: 'Recursive Functions', content: 'Recursion is when a function calls itself with a smaller subproblem.',
          lang: 'c', code: '#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}\n\nint main() {\n    printf("5! = %d\\n", factorial(5));\n    for (int i = 0; i < 10; i++) printf("fib(%d)=%d ", i, fib(i));\n    printf("\\n");\n    return 0;\n}',
          concept: 'Every recursive function needs: (1) a base case that stops recursion, (2) a recursive case that moves toward the base case. Each call adds a stack frame.',
          keyPoints: ['Base case prevents infinite recursion', 'Each call uses stack space', 'Fibonacci has exponential naive recursion', 'Tail recursion can be optimized by compilers'],
          realWorld: 'File system traversal (listing all files in nested directories) is naturally recursive.',
          mistakes: ['Missing base case (infinite recursion)', 'Base case that is never reached', 'Stack overflow for deep recursion', 'Redundant computation (naive Fibonacci)'],
          pInstructions: ['Write recursive factorial', 'Write recursive Fibonacci', 'Add memoization to Fibonacci'],
          starter: '#include <stdio.h>\n\nint factorial(int n) {\n    // Implement\n}\n\nint fib(int n) {\n    // Implement\n}\n\nint main() {\n    printf("6! = %d\\n", factorial(6));\n    printf("fib(10) = %d\\n", fib(10));\n    return 0;\n}',
          solution: '#include <stdio.h>\nint factorial(int n) { return n <= 1 ? 1 : n * factorial(n-1); }\nint fib(int n) { if(n<=1) return n; return fib(n-1)+fib(n-2); }\nint main() {\n    printf("6! = %d\\n", factorial(6));\n    printf("fib(10) = %d\\n", fib(10));\n    return 0;\n}',
          hints: ['Base case for factorial: n <= 1 returns 1', 'Fibonacci base cases: fib(0)=0, fib(1)=1'],
          challenge: 'Implement Tower of Hanoi that prints each move, and a power function using recursion (fast exponentiation).',
          reqs: ['Tower of Hanoi with move printing', 'Fast power: O(log n) recursive', 'Count total moves for Hanoi', 'Handle n up to 20'],
          tests: [['hanoi(3)', '7 moves', 5], ['power(2,10)', '1024', 5]]
        })
      ]
    }),

    T({
      title: 'C Graph Algorithms', slug: 'c-graph-algorithms',
      description: 'Implement BFS and DFS on graphs represented as adjacency lists in C.',
      language: 'c', difficulty: 'advanced', duration: 55,
      tags: ['c', 'graphs', 'bfs', 'dfs', 'algorithms'],
      category: 'Algorithms',
      objectives: ['Represent graphs with adjacency lists', 'Implement BFS and DFS', 'Find connected components'],
      steps: [
        S(1, {
          title: 'Graph Representation and Traversal', content: 'Graphs consist of vertices and edges. BFS uses a queue; DFS uses a stack (or recursion).',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\n#define V 6\nint adj[V][V] = {0};\nint visited[V];\n\nvoid addEdge(int u, int v) { adj[u][v] = 1; adj[v][u] = 1; }\n\nvoid dfs(int node) {\n    visited[node] = 1;\n    printf("%d ", node);\n    for (int i = 0; i < V; i++)\n        if (adj[node][i] && !visited[i]) dfs(i);\n}\n\nvoid bfs(int start) {\n    int queue[V], front = 0, rear = 0;\n    int vis[V] = {0};\n    queue[rear++] = start;\n    vis[start] = 1;\n    while (front < rear) {\n        int node = queue[front++];\n        printf("%d ", node);\n        for (int i = 0; i < V; i++)\n            if (adj[node][i] && !vis[i]) { vis[i] = 1; queue[rear++] = i; }\n    }\n}\n\nint main() {\n    addEdge(0,1); addEdge(0,2); addEdge(1,3); addEdge(2,4); addEdge(3,5);\n    printf("DFS: "); for(int i=0;i<V;i++) visited[i]=0; dfs(0); printf("\\n");\n    printf("BFS: "); bfs(0); printf("\\n");\n    return 0;\n}',
          concept: 'DFS explores as deep as possible before backtracking. BFS explores all neighbors at the current depth before going deeper. Both visit every vertex exactly once.',
          keyPoints: ['DFS uses recursion/stack — goes deep first', 'BFS uses a queue — goes wide first', 'Both are O(V + E)', 'Mark visited to avoid cycles'],
          realWorld: 'Social networks use BFS to find degrees of separation between users.',
          mistakes: ['Not marking nodes as visited', 'Stack overflow in DFS for large graphs', 'Queue overflow in BFS'],
          pInstructions: ['Create a graph with 6 vertices', 'Implement DFS recursively', 'Implement BFS with a queue array'],
          starter: '#include <stdio.h>\n#define V 6\nint adj[V][V];\n\nvoid addEdge(int u, int v) { adj[u][v]=1; adj[v][u]=1; }\n\n// Implement DFS\n// Implement BFS\n\nint main() {\n    addEdge(0,1); addEdge(0,2); addEdge(1,3);\n    // Run DFS and BFS\n    return 0;\n}',
          solution: '#include <stdio.h>\n#define V 6\nint adj[V][V]={0}; int vis[V];\nvoid addEdge(int u,int v){adj[u][v]=1;adj[v][u]=1;}\nvoid dfs(int n){vis[n]=1;printf("%d ",n);for(int i=0;i<V;i++)if(adj[n][i]&&!vis[i])dfs(i);}\nvoid bfs(int s){int q[V],f=0,r=0,v2[V]={0};q[r++]=s;v2[s]=1;while(f<r){int n=q[f++];printf("%d ",n);for(int i=0;i<V;i++)if(adj[n][i]&&!v2[i]){v2[i]=1;q[r++]=i;}}}\nint main(){addEdge(0,1);addEdge(0,2);addEdge(1,3);for(int i=0;i<V;i++)vis[i]=0;printf("DFS:");dfs(0);printf("\\nBFS:");bfs(0);printf("\\n");return 0;}',
          hints: ['DFS: mark visited, recurse on unvisited neighbors', 'BFS: enqueue unvisited neighbors, mark visited immediately'],
          challenge: 'Find all connected components in an undirected graph and detect if the graph contains a cycle.',
          reqs: ['Count and list connected components', 'Detect cycle using DFS', 'Handle disconnected graphs', 'Print component membership'],
          tests: [['graph with 2 components', 'components=2', 5]]
        })
      ]
    }),

    T({
      title: 'C Merge Sort', slug: 'c-merge-sort',
      description: 'Implement the merge sort algorithm with O(n log n) guaranteed performance.',
      language: 'c', difficulty: 'intermediate', duration: 40,
      tags: ['c', 'merge-sort', 'algorithms', 'divide-and-conquer'],
      category: 'Algorithms',
      objectives: ['Implement merge sort', 'Understand divide and conquer', 'Analyze O(n log n) complexity'],
      steps: [
        S(1, {
          title: 'Merge Sort Implementation', content: 'Merge sort divides the array in half, sorts each half, then merges them.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nvoid merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1, n2 = r - m;\n    int *L = malloc(n1 * sizeof(int)), *R = malloc(n2 * sizeof(int));\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int i = 0; i < n2; i++) R[i] = arr[m + 1 + i];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n    free(L); free(R);\n}\n\nvoid mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}\n\nint main() {\n    int arr[] = {38, 27, 43, 3, 9, 82, 10};\n    int n = 7;\n    mergeSort(arr, 0, n - 1);\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          concept: 'Merge sort is a divide-and-conquer algorithm. It splits the array into halves, recursively sorts each half, then merges the sorted halves. It guarantees O(n log n) in all cases.',
          keyPoints: ['Divide array in half recursively', 'Merge two sorted halves', 'O(n log n) guaranteed', 'Requires O(n) extra space'],
          realWorld: 'External sorting (sorting data that does not fit in memory) uses merge sort because it accesses data sequentially.',
          mistakes: ['Incorrect merge boundaries', 'Memory leaks from not freeing temp arrays', 'Off-by-one in splitting'],
          pInstructions: ['Implement the merge function', 'Implement recursive mergeSort', 'Test on an unsorted array'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n\nvoid merge(int arr[], int l, int m, int r) {\n    // Implement merge\n}\n\nvoid mergeSort(int arr[], int l, int r) {\n    // Implement recursive sort\n}\n\nint main() {\n    int arr[] = {12, 11, 13, 5, 6, 7};\n    mergeSort(arr, 0, 5);\n    for (int i = 0; i < 6; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\nvoid merge(int a[],int l,int m,int r){int n1=m-l+1,n2=r-m;int*L=malloc(n1*sizeof(int)),*R=malloc(n2*sizeof(int));for(int i=0;i<n1;i++)L[i]=a[l+i];for(int i=0;i<n2;i++)R[i]=a[m+1+i];int i=0,j=0,k=l;while(i<n1&&j<n2)a[k++]=(L[i]<=R[j])?L[i++]:R[j++];while(i<n1)a[k++]=L[i++];while(j<n2)a[k++]=R[j++];free(L);free(R);}\nvoid mergeSort(int a[],int l,int r){if(l<r){int m=l+(r-l)/2;mergeSort(a,l,m);mergeSort(a,m+1,r);merge(a,l,m,r);}}\nint main(){int a[]={12,11,13,5,6,7};mergeSort(a,0,5);for(int i=0;i<6;i++)printf("%d ",a[i]);printf("\\n");return 0;}',
          hints: ['Split: mid = l + (r-l)/2', 'Merge: compare front of both halves'],
          challenge: 'Count the number of inversions in an array using merge sort. An inversion is when a[i] > a[j] for i < j.',
          reqs: ['Modify merge sort to count inversions', 'Return inversion count', 'Do not change the algorithm complexity', 'Test with known arrays'],
          tests: [['inversions({2,4,1,3,5})', '3', 5]]
        })
      ]
    }),

    T({
      title: 'C Memory Layout and Segments', slug: 'c-memory-layout',
      description: 'Understand the memory layout of a C program: stack, heap, data, text segments.',
      language: 'c', difficulty: 'advanced', duration: 40,
      tags: ['c', 'memory', 'stack', 'heap', 'segments'],
      objectives: ['Understand program memory segments', 'Differentiate stack vs heap allocation', 'Identify common memory errors'],
      steps: [
        S(1, {
          title: 'Program Memory Segments', content: 'A C program has text (code), data (globals), stack (local vars), and heap (dynamic) segments.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint global_var = 42;           // Data segment\nconst char *str = "hello";     // Text/rodata\n\nint main() {\n    int local_var = 10;        // Stack\n    int *heap_var = malloc(sizeof(int));  // Heap\n    *heap_var = 99;\n    \n    printf("global: %p\\n", (void*)&global_var);\n    printf("local:  %p\\n", (void*)&local_var);\n    printf("heap:   %p\\n", (void*)heap_var);\n    printf("func:   %p\\n", (void*)main);\n    \n    free(heap_var);\n    return 0;\n}',
          concept: 'Text segment holds code (read-only). Data segment holds global/static variables. Stack holds local variables and function call frames (grows down). Heap holds dynamically allocated memory (grows up).',
          keyPoints: ['Text: code, read-only', 'Data: global and static variables', 'Stack: local variables, function frames', 'Heap: malloc/calloc allocated memory'],
          realWorld: 'Understanding memory layout is crucial for debugging segfaults and preventing buffer overflow exploits.',
          mistakes: ['Returning pointer to local variable (stack)', 'Heap fragmentation from many small allocations', 'Stack overflow from deep recursion'],
          pInstructions: ['Create variables in each segment', 'Print their addresses', 'Observe the address ranges'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n\nint g = 10;\n\nint main() {\n    int l = 20;\n    int *h = malloc(sizeof(int));\n    // Print addresses of g, l, h, main\n    free(h);\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\nint g = 10;\nint main() {\n    int l = 20;\n    int *h = malloc(sizeof(int));\n    printf("Global (data): %p\\n", (void*)&g);\n    printf("Local (stack): %p\\n", (void*)&l);\n    printf("Heap:          %p\\n", (void*)h);\n    printf("main (text):   %p\\n", (void*)main);\n    free(h);\n    return 0;\n}',
          hints: ['Use %p format specifier for pointers', 'Cast to void* for portable printing'],
          challenge: 'Write a program that demonstrates a stack overflow (deep recursion) and a dangling pointer. Fix both issues.',
          reqs: ['Show stack overflow scenario', 'Show dangling pointer scenario', 'Provide fixed versions', 'Explain the memory issues'],
          tests: [['detect dangling', 'uses after free shown', 5]]
        })
      ]
    }),

    T({
      title: 'C Function Pointers', slug: 'c-function-pointers',
      description: 'Use function pointers for callbacks, strategy pattern, and dynamic dispatch.',
      language: 'c', difficulty: 'advanced', duration: 45,
      tags: ['c', 'function-pointers', 'callbacks', 'advanced'],
      objectives: ['Declare and use function pointers', 'Implement callback patterns', 'Use qsort with custom comparators'],
      steps: [
        S(1, {
          title: 'Function Pointers and Callbacks', content: 'A function pointer stores the address of a function, enabling dynamic dispatch.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint add(int a, int b) { return a + b; }\nint sub(int a, int b) { return a - b; }\n\nint compare(const void *a, const void *b) {\n    return (*(int*)a - *(int*)b);\n}\n\nint main() {\n    int (*op)(int, int) = add;\n    printf("add: %d\\n", op(3, 4));\n    op = sub;\n    printf("sub: %d\\n", op(3, 4));\n    \n    int arr[] = {5, 2, 8, 1, 9};\n    qsort(arr, 5, sizeof(int), compare);\n    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          concept: 'Function pointers allow passing functions as arguments, storing them in arrays, and calling them dynamically. The C standard library uses this pattern extensively (qsort, bsearch).',
          keyPoints: ['Syntax: return_type (*name)(params)', 'Can assign any matching function', 'qsort uses function pointer for comparison', 'typedef simplifies function pointer types'],
          realWorld: 'Plugin architectures load function pointers from shared libraries at runtime using dlsym().',
          mistakes: ['Calling through NULL function pointer', 'Wrong function signature causing UB', 'Complex syntax without typedef'],
          pInstructions: ['Declare a function pointer type for math operations', 'Create an array of function pointers', 'Use qsort to sort an array of strings'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef int (*MathOp)(int, int);\n\nint mul(int a, int b) { return a * b; }\nint divide(int a, int b) { return b ? a / b : 0; }\n\n// Array of operations\n// String comparison for qsort\n\nint main() {\n    // Use function pointer array\n    // Sort strings with qsort\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\ntypedef int (*MathOp)(int, int);\nint add(int a,int b){return a+b;}\nint mul(int a,int b){return a*b;}\nint cmpStr(const void*a,const void*b){return strcmp(*(const char**)a,*(const char**)b);}\nint main(){\n    MathOp ops[]={add,mul};\n    printf("add:%d mul:%d\\n",ops[0](3,4),ops[1](3,4));\n    const char*words[]={"banana","apple","cherry"};\n    qsort(words,3,sizeof(char*),cmpStr);\n    for(int i=0;i<3;i++) printf("%s ",words[i]);\n    printf("\\n");\n    return 0;\n}',
          hints: ['typedef makes function pointer syntax cleaner', 'qsort comparator receives void pointers to elements'],
          challenge: 'Implement a simple command dispatcher: map string commands to function pointers and execute the matching function.',
          reqs: ['Map of command names to functions', 'Lookup by string', 'Handle unknown commands', 'At least 4 commands'],
          tests: [['dispatch("add", 3, 4)', '7', 5]]
        })
      ]
    }),

    T({
      title: 'C Multi-file Projects and Makefiles', slug: 'c-makefiles',
      description: 'Organize C code across multiple files and build with Makefiles.',
      language: 'c', difficulty: 'intermediate', duration: 35,
      tags: ['c', 'makefiles', 'build-systems', 'header-files'],
      objectives: ['Split code into header and source files', 'Write a basic Makefile', 'Understand compilation and linking'],
      steps: [
        S(1, {
          title: 'Headers, Source Files, and Make', content: 'C projects use .h files for declarations and .c files for implementations.',
          lang: 'c', code: '// math_utils.h\n#ifndef MATH_UTILS_H\n#define MATH_UTILS_H\nint add(int a, int b);\nint multiply(int a, int b);\n#endif\n\n// math_utils.c\n#include "math_utils.h"\nint add(int a, int b) { return a + b; }\nint multiply(int a, int b) { return a * b; }\n\n// main.c\n#include <stdio.h>\n#include "math_utils.h"\nint main() {\n    printf("add: %d\\n", add(3, 4));\n    printf("mul: %d\\n", multiply(3, 4));\n    return 0;\n}',
          concept: 'Header files (.h) contain declarations (prototypes, typedefs). Source files (.c) contain definitions (function bodies). Include guards prevent double inclusion. Makefiles automate compilation.',
          keyPoints: ['#ifndef include guards prevent double inclusion', 'Headers declare, sources define', 'Compile each .c to .o, then link', 'Makefiles track dependencies'],
          realWorld: 'Large projects like the Linux kernel use thousands of header files and complex Makefiles to manage compilation.',
          mistakes: ['Missing include guards (double inclusion)', 'Defining functions in headers (multiple definition errors)', 'Forgetting to link all object files'],
          pInstructions: ['Create a header file with function prototypes', 'Create a source file with implementations', 'Create main.c that uses the functions'],
          starter: '// Create a header file with prototypes for max and min\n// Create a source file with implementations\n// Create main.c to test them',
          solution: '// utils.h\n#ifndef UTILS_H\n#define UTILS_H\nint maxVal(int a, int b);\nint minVal(int a, int b);\n#endif\n\n// utils.c\n#include "utils.h"\nint maxVal(int a, int b) { return a > b ? a : b; }\nint minVal(int a, int b) { return a < b ? a : b; }\n\n// main.c\n#include <stdio.h>\n#include "utils.h"\nint main() { printf("max:%d min:%d\\n", maxVal(3,7), minVal(3,7)); return 0; }',
          hints: ['Use #ifndef FILENAME_H pattern', 'Compile: gcc -c utils.c && gcc -c main.c && gcc -o prog utils.o main.o'],
          challenge: 'Write a Makefile that compiles a 3-file project, supports clean, and only recompiles changed files.',
          reqs: ['Makefile with targets for each .o', 'all target links everything', 'clean removes .o and executable', 'Proper dependency tracking on headers'],
          tests: [['make', 'builds successfully', 5]]
        })
      ]
    }),

    T({
      title: 'C Error Handling Patterns', slug: 'c-error-handling',
      description: 'Learn robust error handling in C using return codes, errno, and perror.',
      language: 'c', difficulty: 'intermediate', duration: 35,
      tags: ['c', 'error-handling', 'errno', 'defensive-programming'],
      objectives: ['Use return codes for error signaling', 'Understand errno and perror', 'Write defensive code with proper cleanup'],
      steps: [
        S(1, {
          title: 'Error Handling Strategies', content: 'C uses return codes (no exceptions). errno and perror help diagnose system errors.',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n#include <errno.h>\n#include <string.h>\n\nint divide(int a, int b, int *result) {\n    if (b == 0) return -1;  // Error code\n    *result = a / b;\n    return 0;  // Success\n}\n\nint main() {\n    int result;\n    if (divide(10, 0, &result) != 0) {\n        printf("Error: division by zero\\n");\n    }\n    \n    FILE *f = fopen("nonexistent.txt", "r");\n    if (!f) {\n        printf("errno: %d\\n", errno);\n        printf("Error: %s\\n", strerror(errno));\n        perror("fopen");\n    }\n    return 0;\n}',
          concept: 'C has no try/catch. Functions return 0 for success, non-zero for error. System calls set errno on failure. perror() prints a human-readable message.',
          keyPoints: ['Return 0 for success, non-zero for error', 'errno is set by system/library calls', 'perror prints error message with prefix', 'Always check return values of I/O functions'],
          realWorld: 'Production servers check every system call return value — a missed error check can cause silent data corruption.',
          mistakes: ['Ignoring return values', 'Checking errno without a failed call', 'Not cleaning up resources on error paths'],
          pInstructions: ['Write a function that returns an error code', 'Use perror after a failed fopen', 'Implement cleanup on error (goto pattern)'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n#include <errno.h>\n\n// Write a function with error return codes\n\nint main() {\n    // Test error handling\n    // Show perror usage\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\n#include <errno.h>\n\nint readFile(const char *path, char *buf, int size) {\n    FILE *f = fopen(path, "r");\n    if (!f) return -1;\n    if (!fgets(buf, size, f)) { fclose(f); return -2; }\n    fclose(f);\n    return 0;\n}\n\nint main() {\n    char buf[256];\n    int err = readFile("missing.txt", buf, sizeof(buf));\n    if (err == -1) perror("readFile");\n    else if (err == -2) printf("Read error\\n");\n    else printf("Content: %s\\n", buf);\n    return 0;\n}',
          hints: ['perror uses errno automatically', 'Return different codes for different errors'],
          challenge: 'Implement a resource-safe function that opens a file, allocates a buffer, reads data, processes it, and cleans up properly using the goto-cleanup pattern.',
          reqs: ['Use goto cleanup for error paths', 'Free all resources on any error', 'Return specific error codes', 'No resource leaks'],
          tests: [['call with bad file', 'returns error, no leaks', 5]]
        })
      ]
    }),

    T({
      title: 'C Command Line Arguments', slug: 'c-command-line-args',
      description: 'Parse and use command line arguments with argc and argv.',
      language: 'c', difficulty: 'beginner', duration: 25,
      tags: ['c', 'argc-argv', 'command-line', 'fundamentals'],
      objectives: ['Understand argc and argv', 'Parse command line options', 'Convert string arguments to numbers'],
      steps: [
        S(1, {
          title: 'Using argc and argv', content: 'main() receives command line arguments via argc (count) and argv (values).',
          lang: 'c', code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    printf("Program: %s\\n", argv[0]);\n    printf("Arguments: %d\\n", argc - 1);\n    for (int i = 1; i < argc; i++) {\n        printf("  argv[%d] = %s\\n", i, argv[i]);\n    }\n    \n    if (argc == 3) {\n        int a = atoi(argv[1]);\n        int b = atoi(argv[2]);\n        printf("Sum: %d\\n", a + b);\n    }\n    return 0;\n}',
          concept: 'argc is the argument count (including the program name). argv is an array of strings. argv[0] is the program name, argv[1] is the first argument, etc.',
          keyPoints: ['argc includes the program name', 'argv[0] is the program name', 'All arguments are strings', 'Use atoi/atof to convert to numbers'],
          realWorld: 'Unix command-line tools like grep, ls, and gcc all parse argc/argv to determine behavior.',
          mistakes: ['Accessing argv beyond argc', 'Forgetting argv[0] is the program name', 'Not validating argument count before use'],
          pInstructions: ['Write a program that prints all arguments', 'Convert two arguments to ints and add them', 'Handle wrong number of arguments'],
          starter: '#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char *argv[]) {\n    // Print argument count\n    // Print each argument\n    // If 2 args, add them\n    return 0;\n}',
          solution: '#include <stdio.h>\n#include <stdlib.h>\nint main(int argc, char *argv[]) {\n    printf("Args: %d\\n", argc-1);\n    for (int i = 1; i < argc; i++) printf("[%d] %s\\n", i, argv[i]);\n    if (argc == 3) printf("Sum: %d\\n", atoi(argv[1]) + atoi(argv[2]));\n    else if (argc != 1) printf("Usage: %s [num1 num2]\\n", argv[0]);\n    return 0;\n}',
          hints: ['Loop from 1 to argc-1 to skip program name', 'atoi converts string to int'],
          challenge: 'Build a simple command-line calculator: ./calc 10 + 5 should output 15. Support +, -, *, /.',
          reqs: ['Parse operator from argv[2]', 'Support all 4 operations', 'Print usage on wrong args', 'Handle division by zero'],
          tests: [['./calc 10 + 5', '15', 5], ['./calc 10 / 0', 'error', 5]]
        })
      ]
    })
  ];
};
