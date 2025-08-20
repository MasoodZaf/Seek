// Syntax help database for different programming languages
export const syntaxHelp = {
  javascript: {
    keywords: {
      'function': {
        title: 'Function Declaration',
        description: 'Declares a named function that can be called later',
        syntax: 'function name(parameters) { ... }',
        example: 'function greet(name) {\n  console.log("Hello " + name);\n}'
      },
      'const': {
        title: 'Constant Declaration',
        description: 'Declares a constant variable that cannot be reassigned',
        syntax: 'const variableName = value;',
        example: 'const PI = 3.14159;'
      },
      'let': {
        title: 'Variable Declaration',
        description: 'Declares a block-scoped variable that can be reassigned',
        syntax: 'let variableName = value;',
        example: 'let count = 0;'
      },
      'var': {
        title: 'Variable Declaration (Legacy)',
        description: 'Declares a function-scoped variable (use let instead)',
        syntax: 'var variableName = value;',
        example: 'var name = "John";'
      },
      'if': {
        title: 'Conditional Statement',
        description: 'Executes code block if condition is true',
        syntax: 'if (condition) { ... }',
        example: 'if (age >= 18) {\n  console.log("Adult");\n}'
      },
      'else': {
        title: 'Else Clause',
        description: 'Executes when if condition is false',
        syntax: 'if (condition) { ... } else { ... }',
        example: 'if (x > 0) {\n  return "positive";\n} else {\n  return "negative";\n}'
      },
      'for': {
        title: 'For Loop',
        description: 'Repeats code block for a specified number of times',
        syntax: 'for (init; condition; increment) { ... }',
        example: 'for (let i = 0; i < 10; i++) {\n  console.log(i);\n}'
      },
      'while': {
        title: 'While Loop',
        description: 'Repeats code block while condition is true',
        syntax: 'while (condition) { ... }',
        example: 'while (count < 5) {\n  count++;\n}'
      }
    },
    methods: {
      'console.log': {
        title: 'Console Output',
        description: 'Prints output to the browser console',
        syntax: 'console.log(value1, value2, ...);',
        example: 'console.log("Hello World");'
      },
      'parseInt': {
        title: 'Parse Integer',
        description: 'Converts string to integer number',
        syntax: 'parseInt(string, radix)',
        example: 'parseInt("42") // returns 42'
      }
    }
  },
  
  python: {
    keywords: {
      'def': {
        title: 'Function Definition',
        description: 'Defines a reusable function in Python',
        syntax: 'def function_name(parameters):',
        example: 'def greet(name):\n    print(f"Hello {name}")'
      },
      'if': {
        title: 'Conditional Statement',
        description: 'Executes code block if condition is true',
        syntax: 'if condition:',
        example: 'if age >= 18:\n    print("Adult")'
      },
      'elif': {
        title: 'Else If Clause',
        description: 'Additional condition to check if previous conditions were false',
        syntax: 'elif condition:',
        example: 'if x > 0:\n    print("positive")\nelif x < 0:\n    print("negative")'
      },
      'else': {
        title: 'Else Clause',
        description: 'Executes when all previous conditions are false',
        syntax: 'else:',
        example: 'if x > 0:\n    print("positive")\nelse:\n    print("not positive")'
      },
      'for': {
        title: 'For Loop',
        description: 'Iterates over a sequence (list, tuple, string, etc.)',
        syntax: 'for item in sequence:',
        example: 'for i in range(5):\n    print(i)'
      },
      'while': {
        title: 'While Loop',
        description: 'Repeats code block while condition is true',
        syntax: 'while condition:',
        example: 'while count < 5:\n    count += 1'
      },
      'class': {
        title: 'Class Definition',
        description: 'Defines a new class (blueprint for objects)',
        syntax: 'class ClassName:',
        example: 'class Person:\n    def __init__(self, name):\n        self.name = name'
      },
      'import': {
        title: 'Import Statement',
        description: 'Imports modules or specific functions from modules',
        syntax: 'import module_name',
        example: 'import math\nfrom datetime import date'
      }
    },
    methods: {
      'print': {
        title: 'Print Function',
        description: 'Outputs text to the console',
        syntax: 'print(value1, value2, ...)',
        example: 'print("Hello World")'
      },
      'len': {
        title: 'Length Function',
        description: 'Returns the length of an object',
        syntax: 'len(object)',
        example: 'len("Hello") # returns 5'
      },
      'range': {
        title: 'Range Function',
        description: 'Generates a sequence of numbers',
        syntax: 'range(start, stop, step)',
        example: 'range(5) # 0, 1, 2, 3, 4'
      }
    }
  },

  java: {
    keywords: {
      'public': {
        title: 'Public Access Modifier',
        description: 'Makes the element accessible from anywhere',
        syntax: 'public class/method/variable',
        example: 'public class HelloWorld { ... }'
      },
      'private': {
        title: 'Private Access Modifier', 
        description: 'Makes the element accessible only within the same class',
        syntax: 'private type variableName;',
        example: 'private String name;'
      },
      'static': {
        title: 'Static Keyword',
        description: 'Belongs to the class rather than any instance',
        syntax: 'static type methodName()',
        example: 'public static void main(String[] args)'
      },
      'class': {
        title: 'Class Declaration',
        description: 'Defines a new class (blueprint for objects)',
        syntax: 'public class ClassName { ... }',
        example: 'public class Person {\n    private String name;\n}'
      },
      'void': {
        title: 'Void Return Type',
        description: 'Indicates the method does not return a value',
        syntax: 'void methodName()',
        example: 'public void greet() {\n    System.out.println("Hello");\n}'
      },
      'if': {
        title: 'Conditional Statement',
        description: 'Executes code block if condition is true',
        syntax: 'if (condition) { ... }',
        example: 'if (age >= 18) {\n    System.out.println("Adult");\n}'
      },
      'for': {
        title: 'For Loop',
        description: 'Repeats code block for a specified number of times',
        syntax: 'for (init; condition; increment) { ... }',
        example: 'for (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}'
      }
    },
    methods: {
      'System.out.println': {
        title: 'Print Line',
        description: 'Prints text to console with a new line',
        syntax: 'System.out.println(value);',
        example: 'System.out.println("Hello World");'
      },
      'System.out.print': {
        title: 'Print',
        description: 'Prints text to console without a new line',
        syntax: 'System.out.print(value);',
        example: 'System.out.print("Hello ");'
      }
    }
  },

  cpp: {
    keywords: {
      '#include': {
        title: 'Include Directive',
        description: 'Includes header files in the program',
        syntax: '#include <filename>',
        example: '#include <iostream>\n#include <string>'
      },
      'using namespace': {
        title: 'Namespace Declaration',
        description: 'Allows use of identifiers from a namespace without prefix',
        syntax: 'using namespace namespace_name;',
        example: 'using namespace std;'
      },
      'int': {
        title: 'Integer Type',
        description: 'Declares an integer variable',
        syntax: 'int variableName = value;',
        example: 'int age = 25;'
      },
      'string': {
        title: 'String Type',
        description: 'Declares a string variable (needs #include <string>)',
        syntax: 'string variableName = "value";',
        example: 'string name = "John";'
      },
      'void': {
        title: 'Void Return Type',
        description: 'Indicates the function does not return a value',
        syntax: 'void functionName(parameters)',
        example: 'void greet(string name) {\n    cout << "Hello " << name;\n}'
      },
      'if': {
        title: 'Conditional Statement',
        description: 'Executes code block if condition is true',
        syntax: 'if (condition) { ... }',
        example: 'if (age >= 18) {\n    cout << "Adult";\n}'
      },
      'for': {
        title: 'For Loop',
        description: 'Repeats code block for a specified number of times',
        syntax: 'for (init; condition; increment) { ... }',
        example: 'for (int i = 0; i < 10; i++) {\n    cout << i << endl;\n}'
      }
    },
    methods: {
      'cout': {
        title: 'Console Output',
        description: 'Outputs data to the console (needs using namespace std;)',
        syntax: 'cout << value << endl;',
        example: 'cout << "Hello World" << endl;'
      },
      'cin': {
        title: 'Console Input',
        description: 'Reads input from the console',
        syntax: 'cin >> variable;',
        example: 'cin >> name;'
      },
      'endl': {
        title: 'End Line',
        description: 'Inserts a new line and flushes the output buffer',
        syntax: 'cout << value << endl;',
        example: 'cout << "Hello" << endl;'
      }
    }
  },

  c: {
    keywords: {
      '#include': {
        title: 'Include Directive',
        description: 'Includes header files in the program',
        syntax: '#include <filename.h>',
        example: '#include <stdio.h>\n#include <string.h>'
      },
      'int': {
        title: 'Integer Type',
        description: 'Declares an integer variable',
        syntax: 'int variableName = value;',
        example: 'int age = 25;'
      },
      'char': {
        title: 'Character Type',
        description: 'Declares a character or string variable',
        syntax: 'char variableName = \'value\';\nchar array[] = "string";',
        example: 'char letter = \'A\';\nchar name[] = "John";'
      },
      'void': {
        title: 'Void Return Type',
        description: 'Indicates the function does not return a value',
        syntax: 'void functionName(parameters)',
        example: 'void greet(char* name) {\n    printf("Hello %s", name);\n}'
      },
      'if': {
        title: 'Conditional Statement',
        description: 'Executes code block if condition is true',
        syntax: 'if (condition) { ... }',
        example: 'if (age >= 18) {\n    printf("Adult");\n}'
      },
      'for': {
        title: 'For Loop',
        description: 'Repeats code block for a specified number of times',
        syntax: 'for (init; condition; increment) { ... }',
        example: 'for (int i = 0; i < 10; i++) {\n    printf("%d\\n", i);\n}'
      }
    },
    methods: {
      'printf': {
        title: 'Print Formatted',
        description: 'Prints formatted output to the console',
        syntax: 'printf("format", variables...);',
        example: 'printf("Hello %s\\n", name);'
      },
      'scanf': {
        title: 'Scan Formatted',
        description: 'Reads formatted input from the console',
        syntax: 'scanf("format", &variable);',
        example: 'scanf("%d", &age);'
      }
    }
  },

  typescript: {
    keywords: {
      'interface': {
        title: 'Interface Declaration',
        description: 'Defines a contract for object structure',
        syntax: 'interface Name { property: type; }',
        example: 'interface Person {\n  name: string;\n  age: number;\n}'
      },
      'type': {
        title: 'Type Alias',
        description: 'Creates a new name for a type',
        syntax: 'type AliasName = Type;',
        example: 'type ID = string | number;'
      },
      'function': {
        title: 'Function Declaration with Types',
        description: 'Declares a typed function',
        syntax: 'function name(param: type): returnType { ... }',
        example: 'function greet(name: string): void {\n  console.log("Hello " + name);\n}'
      },
      'const': {
        title: 'Typed Constant',
        description: 'Declares a typed constant variable',
        syntax: 'const variableName: type = value;',
        example: 'const PI: number = 3.14159;'
      },
      'let': {
        title: 'Typed Variable',
        description: 'Declares a typed variable that can be reassigned',
        syntax: 'let variableName: type = value;',
        example: 'let count: number = 0;'
      }
    },
    methods: {
      'console.log': {
        title: 'Console Output',
        description: 'Prints output to the browser console',
        syntax: 'console.log(value1, value2, ...);',
        example: 'console.log("Hello World");'
      }
    }
  }
};

// Get syntax help for a specific token
export const getSyntaxHelp = (language, token) => {
  const langHelp = syntaxHelp[language.toLowerCase()];
  if (!langHelp) return null;

  // Check keywords first
  if (langHelp.keywords && langHelp.keywords[token]) {
    return { ...langHelp.keywords[token], category: 'keyword' };
  }

  // Check methods
  if (langHelp.methods && langHelp.methods[token]) {
    return { ...langHelp.methods[token], category: 'method' };
  }

  // Check for partial matches (for complex tokens like System.out.println)
  const allTokens = {
    ...langHelp.keywords,
    ...langHelp.methods
  };

  for (const [key, value] of Object.entries(allTokens)) {
    if (token.includes(key) || key.includes(token)) {
      return { ...value, category: key in langHelp.keywords ? 'keyword' : 'method' };
    }
  }

  return null;
};

// Extract tokens from code for syntax highlighting and help
export const extractTokens = (code, language) => {
  const tokens = [];
  let match;
  
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'typescript':
      // Keywords and methods pattern for JavaScript/TypeScript
      const jsPattern = /\b(function|const|let|var|if|else|for|while|class|import|export|return|console\.log|parseInt|parseFloat)\b/g;
      while ((match = jsPattern.exec(code)) !== null) {
        tokens.push({
          token: match[1],
          start: match.index,
          end: match.index + match[1].length
        });
      }
      break;
      
    case 'python':
      const pyPattern = /\b(def|if|elif|else|for|while|class|import|return|print|len|range|str|int|float)\b/g;
      while ((match = pyPattern.exec(code)) !== null) {
        tokens.push({
          token: match[1],
          start: match.index,
          end: match.index + match[1].length
        });
      }
      break;
      
    case 'java':
      const javaPattern = /\b(public|private|static|class|void|int|String|if|else|for|while|System\.out\.println|System\.out\.print)\b/g;
      while ((match = javaPattern.exec(code)) !== null) {
        tokens.push({
          token: match[1],
          start: match.index,
          end: match.index + match[1].length
        });
      }
      break;
      
    case 'cpp':
      const cppPattern = /#include|using namespace|int|string|void|if|else|for|while|cout|cin|endl/g;
      while ((match = cppPattern.exec(code)) !== null) {
        tokens.push({
          token: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
      }
      break;
      
    case 'c':
      const cPattern = /#include|int|char|void|if|else|for|while|printf|scanf/g;
      while ((match = cPattern.exec(code)) !== null) {
        tokens.push({
          token: match[0],
          start: match.index,
          end: match.index + match[0].length
        });
      }
      break;
    
    default:
      // For unsupported languages, return empty tokens
      break;
  }
  
  return tokens;
};