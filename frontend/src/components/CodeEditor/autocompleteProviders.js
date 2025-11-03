/**
 * Enhanced Autocomplete Providers for Monaco Editor
 * Provides intelligent code completion, snippets, and suggestions
 */

// Common programming patterns and snippets
export const createAutocompleteProviders = (monaco) => {
  const providers = {};

  // ==================== JAVASCRIPT AUTOCOMPLETE ====================
  providers.javascript = monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [
        // Console methods
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'console.log(${1:message});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Log a message to the console',
          detail: 'Console logging',
          range: range
        },
        {
          label: 'console.error',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'console.error(${1:error});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Log an error to the console',
          detail: 'Error logging',
          range: range
        },
        {
          label: 'console.table',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'console.table(${1:data});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Display tabular data as a table',
          detail: 'Table logging',
          range: range
        },

        // Function declarations
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'function ${1:functionName}(${2:params}) {\n\t${3:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create a named function',
          detail: 'Function declaration',
          range: range
        },
        {
          label: 'arrow function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'const ${1:functionName} = (${2:params}) => {\n\t${3:// code}\n};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create an arrow function',
          detail: 'Arrow function',
          range: range
        },
        {
          label: 'async function',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create an async function',
          detail: 'Async function',
          range: range
        },

        // Control structures
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement',
          detail: 'Conditional',
          range: range
        },
        {
          label: 'if...else',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:condition}) {\n\t${2:// true}\n} else {\n\t${3:// false}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-else statement',
          detail: 'Conditional',
          range: range
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For loop',
          detail: 'Loop',
          range: range
        },
        {
          label: 'for...of',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for (const ${1:item} of ${2:array}) {\n\t${3:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For-of loop for iterables',
          detail: 'Loop',
          range: range
        },
        {
          label: 'for...in',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for (const ${1:key} in ${2:object}) {\n\tif (${2:object}.hasOwnProperty(${1:key})) {\n\t\t${3:// code}\n\t}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For-in loop for object properties',
          detail: 'Loop',
          range: range
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'while (${1:condition}) {\n\t${2:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'While loop',
          detail: 'Loop',
          range: range
        },

        // Try-catch
        {
          label: 'try...catch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\t${1:// code}\n} catch (${2:error}) {\n\t${3:console.error(error);}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Try-catch error handling',
          detail: 'Error handling',
          range: range
        },
        {
          label: 'try...catch...finally',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\t${1:// code}\n} catch (${2:error}) {\n\t${3:console.error(error);}\n} finally {\n\t${4:// cleanup}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Try-catch-finally error handling',
          detail: 'Error handling',
          range: range
        },

        // Array methods
        {
          label: '.map()',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '.map(${1:item} => ${2:item})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Transform array elements',
          detail: 'Array method',
          range: range
        },
        {
          label: '.filter()',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '.filter(${1:item} => ${2:condition})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Filter array elements',
          detail: 'Array method',
          range: range
        },
        {
          label: '.reduce()',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '.reduce((${1:acc}, ${2:item}) => ${3:acc + item}, ${4:0})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Reduce array to single value',
          detail: 'Array method',
          range: range
        },
        {
          label: '.find()',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '.find(${1:item} => ${2:condition})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Find first matching element',
          detail: 'Array method',
          range: range
        },
        {
          label: '.forEach()',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '.forEach(${1:item} => {\n\t${2:// code}\n})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Iterate over array elements',
          detail: 'Array method',
          range: range
        },

        // Promise/Async patterns
        {
          label: 'Promise',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'new Promise((resolve, reject) => {\n\t${1:// code}\n\tresolve(${2:value});\n})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create a new Promise',
          detail: 'Promise',
          range: range
        },
        {
          label: 'async/await',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\tconst ${1:result} = await ${2:promise};\n\t${3:// code}\n} catch (error) {\n\tconsole.error(error);\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Async/await pattern with error handling',
          detail: 'Async pattern',
          range: range
        },

        // Class declaration
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'class ${1:ClassName} {\n\tconstructor(${2:params}) {\n\t\t${3:// constructor code}\n\t}\n\n\t${4:methodName}() {\n\t\t${5:// method code}\n\t}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create a class',
          detail: 'Class declaration',
          range: range
        },

        // Import/Export
        {
          label: 'import',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'import ${1:module} from \'${2:package}\';',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Import module',
          detail: 'ES6 import',
          range: range
        },
        {
          label: 'export',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'export ${1:const} ${2:name} = ${3:value};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Export declaration',
          detail: 'ES6 export',
          range: range
        },

        // Fetch API
        {
          label: 'fetch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'fetch(\'${1:url}\')\n\t.then(response => response.json())\n\t.then(data => {\n\t\t${2:// handle data}\n\t})\n\t.catch(error => console.error(error));',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Fetch API request',
          detail: 'HTTP request',
          range: range
        },
        {
          label: 'fetch async',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\tconst response = await fetch(\'${1:url}\');\n\tconst data = await response.json();\n\t${2:// handle data}\n} catch (error) {\n\tconsole.error(error);\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Fetch API with async/await',
          detail: 'HTTP request',
          range: range
        },

        // setTimeout/setInterval
        {
          label: 'setTimeout',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'setTimeout(() => {\n\t${1:// code}\n}, ${2:1000});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Execute code after delay',
          detail: 'Timer',
          range: range
        },
        {
          label: 'setInterval',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'const ${1:intervalId} = setInterval(() => {\n\t${2:// code}\n}, ${3:1000});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Execute code repeatedly',
          detail: 'Timer',
          range: range
        }
      ];

      return { suggestions };
    }
  });

  // ==================== PYTHON AUTOCOMPLETE ====================
  providers.python = monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [
        // Print statements
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print(${1:message})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Print to console',
          detail: 'Built-in function',
          range: range
        },

        // Function definition
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'def ${1:function_name}(${2:params}):\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define a function',
          detail: 'Function definition',
          range: range
        },

        // Class definition
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'class ${1:ClassName}:\n\tdef __init__(self, ${2:params}):\n\t\t${3:pass}\n\n\tdef ${4:method_name}(self):\n\t\t${5:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define a class',
          detail: 'Class definition',
          range: range
        },

        // Control structures
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condition}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement',
          detail: 'Conditional',
          range: range
        },
        {
          label: 'if...else',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-else statement',
          detail: 'Conditional',
          range: range
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For loop',
          detail: 'Loop',
          range: range
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'while ${1:condition}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'While loop',
          detail: 'Loop',
          range: range
        },

        // Try-except
        {
          label: 'try...except',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:print(e)}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Try-except error handling',
          detail: 'Error handling',
          range: range
        },

        // List comprehension
        {
          label: 'list comprehension',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '[${1:expression} for ${2:item} in ${3:iterable}]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'List comprehension',
          detail: 'List comprehension',
          range: range
        },

        // Common imports
        {
          label: 'import',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'import ${1:module}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Import module',
          detail: 'Import statement',
          range: range
        },
        {
          label: 'from...import',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'from ${1:module} import ${2:name}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Import from module',
          detail: 'Import statement',
          range: range
        },

        // Lambda
        {
          label: 'lambda',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'lambda ${1:x}: ${2:x}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Lambda function',
          detail: 'Lambda',
          range: range
        },

        // With statement
        {
          label: 'with',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'with ${1:expression} as ${2:variable}:\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Context manager',
          detail: 'With statement',
          range: range
        }
      ];

      return { suggestions };
    }
  });

  // ==================== JAVA AUTOCOMPLETE ====================
  providers.java = monaco.languages.registerCompletionItemProvider('java', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [
        // Main method
        {
          label: 'main',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'public static void main(String[] args) {\n\t${1:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Main method',
          detail: 'Entry point',
          range: range
        },

        // Print statements
        {
          label: 'System.out.println',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'System.out.println(${1:message});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Print line to console',
          detail: 'Output',
          range: range
        },
        {
          label: 'sout',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'System.out.println(${1:message});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Print line to console (shortcut)',
          detail: 'Output',
          range: range
        },

        // Class declaration
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'public class ${1:ClassName} {\n\t${2:// fields and methods}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Public class declaration',
          detail: 'Class',
          range: range
        },

        // Method declaration
        {
          label: 'method',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'public ${1:void} ${2:methodName}(${3:params}) {\n\t${4:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Method declaration',
          detail: 'Method',
          range: range
        },

        // Control structures
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If statement',
          detail: 'Conditional',
          range: range
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'For loop',
          detail: 'Loop',
          range: range
        },
        {
          label: 'foreach',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for (${1:Type} ${2:item} : ${3:collection}) {\n\t${4:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Enhanced for loop',
          detail: 'Loop',
          range: range
        },

        // Try-catch
        {
          label: 'try...catch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\t${1:// code}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Try-catch error handling',
          detail: 'Error handling',
          range: range
        }
      ];

      return { suggestions };
    }
  });

  return providers;
};

// ==================== HOVER PROVIDERS ====================
export const createHoverProviders = (monaco) => {
  const hoverProviders = {};

  // JavaScript hover provider
  hoverProviders.javascript = monaco.languages.registerHoverProvider('javascript', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const hoverDocs = {
        'console': {
          contents: [
            { value: '**Console Object**' },
            { value: 'The console object provides access to the browser\'s debugging console.' },
            { value: '```javascript\nconsole.log(message)\nconsole.error(error)\nconsole.warn(warning)\nconsole.table(data)\n```' }
          ]
        },
        'const': {
          contents: [
            { value: '**const** (ES6)' },
            { value: 'Declares a read-only named constant.' },
            { value: '```javascript\nconst PI = 3.14159;\n```' }
          ]
        },
        'let': {
          contents: [
            { value: '**let** (ES6)' },
            { value: 'Declares a block-scoped local variable.' },
            { value: '```javascript\nlet count = 0;\n```' }
          ]
        },
        'async': {
          contents: [
            { value: '**async** (ES2017)' },
            { value: 'Declares an asynchronous function that returns a Promise.' },
            { value: '```javascript\nasync function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}\n```' }
          ]
        },
        'await': {
          contents: [
            { value: '**await** (ES2017)' },
            { value: 'Pauses async function execution until Promise is resolved.' },
            { value: '```javascript\nconst data = await fetchData();\n```' }
          ]
        },
        'Promise': {
          contents: [
            { value: '**Promise** (ES6)' },
            { value: 'Represents the eventual completion or failure of an asynchronous operation.' },
            { value: '```javascript\nnew Promise((resolve, reject) => {\n  // async operation\n  resolve(value);\n});\n```' }
          ]
        }
      };

      const doc = hoverDocs[word.word];
      if (doc) {
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: doc.contents
        };
      }

      return null;
    }
  });

  // Python hover provider
  hoverProviders.python = monaco.languages.registerHoverProvider('python', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const hoverDocs = {
        'print': {
          contents: [
            { value: '**print()** - Built-in Function' },
            { value: 'Prints objects to the text stream.' },
            { value: '```python\nprint(*objects, sep=\' \', end=\'\\n\', file=sys.stdout, flush=False)\n```' }
          ]
        },
        'def': {
          contents: [
            { value: '**def** - Function Definition' },
            { value: 'Defines a function.' },
            { value: '```python\ndef function_name(parameters):\n    # function body\n    return value\n```' }
          ]
        },
        'class': {
          contents: [
            { value: '**class** - Class Definition' },
            { value: 'Defines a class.' },
            { value: '```python\nclass ClassName:\n    def __init__(self, params):\n        self.attribute = value\n```' }
          ]
        },
        'import': {
          contents: [
            { value: '**import** - Import Statement' },
            { value: 'Imports modules or specific items from modules.' },
            { value: '```python\nimport module\nfrom module import item\n```' }
          ]
        }
      };

      const doc = hoverDocs[word.word];
      if (doc) {
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: doc.contents
        };
      }

      return null;
    }
  });

  return hoverProviders;
};

// ==================== CODE ACTION PROVIDERS ====================
export const createCodeActionProviders = (monaco) => {
  const actionProviders = {};

  // JavaScript code actions
  actionProviders.javascript = monaco.languages.registerCodeActionProvider('javascript', {
    provideCodeActions: (model, range, context) => {
      const actions = [];

      // Add console.log action
      actions.push({
        title: 'Add console.log',
        kind: 'quickfix',
        edit: {
          edits: [{
            resource: model.uri,
            edit: {
              range: range,
              text: 'console.log();'
            }
          }]
        }
      });

      // Add try-catch wrapper
      const selectedText = model.getValueInRange(range);
      if (selectedText) {
        actions.push({
          title: 'Wrap in try-catch',
          kind: 'refactor',
          edit: {
            edits: [{
              resource: model.uri,
              edit: {
                range: range,
                text: `try {\n\t${selectedText}\n} catch (error) {\n\tconsole.error(error);\n}`
              }
            }]
          }
        });
      }

      return {
        actions: actions,
        dispose: () => {}
      };
    }
  });

  return actionProviders;
};

// ==================== INLINE SUGGESTIONS ====================
export const setupInlineSuggestions = (editor, monaco) => {
  // Enable inline suggestions
  editor.updateOptions({
    inlineSuggest: {
      enabled: true,
      mode: 'prefix'
    },
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    wordBasedSuggestions: true
  });
};

export default {
  createAutocompleteProviders,
  createHoverProviders,
  createCodeActionProviders,
  setupInlineSuggestions
};
