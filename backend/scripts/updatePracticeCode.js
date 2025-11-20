require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Better practice code templates based on topic
const practiceCodeTemplates = {
  javascript: {
    'variables-and-data-types': `// Practice: Variables and Data Types
// Complete the exercises below

// Exercise 1: Declare variables using let, const, and var
let firstName = "Alice";
const lastName = "Johnson";
var age = 25;

// Exercise 2: Try different data types
let score = 100;              // number
let isActive = true;          // boolean
let message = "Hello World";  // string
let nothing = null;           // null
let notDefined;               // undefined

// Exercise 3: Type conversion
let strNumber = "42";
let converted = Number(strNumber);
console.log(converted + 10);  // Should output 52

// Your turn: Create variables for a user profile
// TODO: Add name, email, age, and isStudent variables
`,
    default: `// Practice Exercise
// Try the examples and experiment with the code

// TODO: Implement the practice exercises here

console.log("Practice starting...");
`
  },
  python: {
    'variables-and-data-types': `# Practice: Variables and Data Types
# Complete the exercises below

# Exercise 1: Declare variables
first_name = "Alice"
last_name = "Johnson"
age = 25

# Exercise 2: Try different data types
score = 100              # int
is_active = True         # boolean
message = "Hello World"  # string
nothing = None           # None

# Exercise 3: Type conversion
str_number = "42"
converted = int(str_number)
print(converted + 10)  # Should output 52

# Your turn: Create variables for a user profile
# TODO: Add name, email, age, and is_student variables
`,
    default: `# Practice Exercise
# Try the examples and experiment with the code

# TODO: Implement the practice exercises here

print("Practice starting...")
`
  },
  java: {
    'variables-and-data-types': `// Practice: Variables and Data Types
// Complete the exercises below

public class Practice {
    public static void main(String[] args) {
        // Exercise 1: Declare variables
        String firstName = "Alice";
        String lastName = "Johnson";
        int age = 25;

        // Exercise 2: Try different data types
        int score = 100;
        boolean isActive = true;
        String message = "Hello World";

        // Exercise 3: Type conversion
        String strNumber = "42";
        int converted = Integer.parseInt(strNumber);
        System.out.println(converted + 10);  // Should output 52

        // Your turn: Create variables for a user profile
        // TODO: Add name, email, age, and isStudent variables
    }
}`,
    default: `// Practice Exercise
// Try the examples and experiment with the code

public class Practice {
    public static void main(String[] args) {
        // TODO: Implement the practice exercises here
        System.out.println("Practice starting...");
    }
}
`
  },
  typescript: {
    'variables-and-data-types': `// Practice: Variables and Data Types
// Complete the exercises below

// Exercise 1: Declare variables with types
let firstName: string = "Alice";
const lastName: string = "Johnson";
let age: number = 25;

// Exercise 2: Try different data types
let score: number = 100;
let isActive: boolean = true;
let message: string = "Hello World";
let nothing: null = null;
let notDefined: undefined;

// Exercise 3: Type conversion
let strNumber: string = "42";
let converted: number = Number(strNumber);
console.log(converted + 10);  // Should output 52

// Your turn: Create variables for a user profile
// TODO: Add name, email, age, and isStudent variables with proper types
`,
    default: `// Practice Exercise
// Try the examples and experiment with the code

// TODO: Implement the practice exercises here

console.log("Practice starting...");
`
  },
  c: {
    'variables-and-data-types': `// Practice: Variables and Data Types
// Complete the exercises below

#include <stdio.h>
#include <string.h>

int main() {
    // Exercise 1: Declare variables
    char firstName[] = "Alice";
    char lastName[] = "Johnson";
    int age = 25;

    // Exercise 2: Try different data types
    int score = 100;
    float height = 5.6;
    char grade = 'A';

    // Exercise 3: Print variables
    printf("Name: %s %s\\n", firstName, lastName);
    printf("Age: %d\\n", age);
    printf("Score: %d\\n", score);

    // Your turn: Create variables for a user profile
    // TODO: Add more variables and print them

    return 0;
}`,
    default: `// Practice Exercise
// Try the examples and experiment with the code

#include <stdio.h>

int main() {
    // TODO: Implement the practice exercises here
    printf("Practice starting...\\n");
    return 0;
}
`
  },
  cpp: {
    'variables-and-data-types': `// Practice: Variables and Data Types
// Complete the exercises below

#include <iostream>
#include <string>
using namespace std;

int main() {
    // Exercise 1: Declare variables
    string firstName = "Alice";
    string lastName = "Johnson";
    int age = 25;

    // Exercise 2: Try different data types
    int score = 100;
    bool isActive = true;
    string message = "Hello World";
    float height = 5.6;

    // Exercise 3: Print variables
    cout << "Name: " << firstName << " " << lastName << endl;
    cout << "Age: " << age << endl;
    cout << "Score: " << score << endl;

    // Your turn: Create variables for a user profile
    // TODO: Add more variables and print them

    return 0;
}`,
    default: `// Practice Exercise
// Try the examples and experiment with the code

#include <iostream>
using namespace std;

int main() {
    // TODO: Implement the practice exercises here
    cout << "Practice starting..." << endl;
    return 0;
}
`
  }
};

async function updatePracticeCode() {
  try {
    console.log('🚀 Updating practice code for all programming tutorials...\n');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const languages = ['javascript', 'python', 'java', 'typescript', 'c', 'cpp'];
    let totalUpdated = 0;

    for (const language of languages) {
      console.log(`📝 Processing ${language.toUpperCase()} tutorials...`);

      const tutorials = await MongoTutorial.find({
        category: 'Programming Fundamentals',
        language: language
      });

      let langUpdated = 0;

      for (const tutorial of tutorials) {
        if (tutorial.steps && tutorial.steps.length >= 2) {
          const practiceStep = tutorial.steps[1]; // Step 2 is practice

          // Extract topic slug from tutorial slug
          const topicMatch = tutorial.slug.match(/^[^-]+-\d+-(.+)$/);
          const topicSlug = topicMatch ? topicMatch[1] : 'default';

          // Get appropriate practice code
          const langTemplates = practiceCodeTemplates[language] || practiceCodeTemplates.javascript;
          const practiceCode = langTemplates[topicSlug] || langTemplates.default;

          // Update the code example
          if (practiceStep.codeExamples && practiceStep.codeExamples.length > 0) {
            practiceStep.codeExamples[0].code = practiceCode;

            // IMPORTANT: Also update practicePhase.starterCode if it exists
            if (practiceStep.practicePhase) {
              practiceStep.practicePhase.starterCode = practiceCode;
            }

            await tutorial.save();
            langUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`  ✓ Updated ${langUpdated} ${language} tutorials`);
    }

    console.log(`\n✅ Successfully updated ${totalUpdated} programming tutorials with meaningful practice code!`);

    mongoose.connection.close();
    console.log('\n🎉 Update complete!');
  } catch (error) {
    console.error('❌ Error updating practice code:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updatePracticeCode();
}

module.exports = updatePracticeCode;
