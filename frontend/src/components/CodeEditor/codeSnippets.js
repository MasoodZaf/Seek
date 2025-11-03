/**
 * Comprehensive Code Snippets Library
 * VSCode-style snippets for multiple programming languages
 */

export const CODE_SNIPPETS = {
  // ==================== JAVASCRIPT SNIPPETS ====================
  javascript: {
    // Algorithm snippets
    'binary-search': {
      prefix: 'binsearch',
      body: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
      description: 'Binary search algorithm'
    },

    'quick-sort': {
      prefix: 'quicksort',
      body: `function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
      description: 'Quick sort algorithm'
    },

    'debounce': {
      prefix: 'debounce',
      body: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      description: 'Debounce function for performance'
    },

    'throttle': {
      prefix: 'throttle',
      body: `function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`,
      description: 'Throttle function for performance'
    },

    'deep-clone': {
      prefix: 'deepclone',
      body: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}`,
      description: 'Deep clone object'
    },

    'fetch-json': {
      prefix: 'fetchjson',
      body: `async function fetchJSON(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
      description: 'Fetch JSON with error handling'
    },

    'local-storage': {
      prefix: 'localstorage',
      body: `const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};`,
      description: 'Local storage utility'
    },

    'event-emitter': {
      prefix: 'eventemitter',
      body: `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
  }
}`,
      description: 'Event emitter pattern'
    }
  },

  // ==================== PYTHON SNIPPETS ====================
  python: {
    'binary-search': {
      prefix: 'binsearch',
      body: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
      description: 'Binary search algorithm'
    },

    'quick-sort': {
      prefix: 'quicksort',
      body: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)`,
      description: 'Quick sort algorithm'
    },

    'decorator': {
      prefix: 'decorator',
      body: `def ${1:decorator_name}(func):
    def wrapper(*args, **kwargs):
        # Code before function call
        result = func(*args, **kwargs)
        # Code after function call
        return result
    return wrapper`,
      description: 'Function decorator'
    },

    'context-manager': {
      prefix: 'contextmanager',
      body: `class ${1:ContextManager}:
    def __enter__(self):
        # Setup code
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Cleanup code
        if exc_type is not None:
            # Handle exception
            pass
        return False`,
      description: 'Context manager class'
    },

    'singleton': {
      prefix: 'singleton',
      body: `class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance`,
      description: 'Singleton pattern'
    },

    'property-decorator': {
      prefix: 'property',
      body: `@property
def ${1:property_name}(self):
    return self._${1:property_name}

@${1:property_name}.setter
def ${1:property_name}(self, value):
    self._${1:property_name} = value`,
      description: 'Property with getter and setter'
    },

    'dataclass': {
      prefix: 'dataclass',
      body: `from dataclasses import dataclass

@dataclass
class ${1:ClassName}:
    ${2:field1}: ${3:str}
    ${4:field2}: ${5:int}`,
      description: 'Dataclass definition'
    },

    'file-handling': {
      prefix: 'filehandler',
      body: `with open('${1:filename}', '${2:r}') as file:
    ${3:content = file.read()}`,
      description: 'File handling with context manager'
    },

    'list-comprehension': {
      prefix: 'listcomp',
      body: `[${1:expression} for ${2:item} in ${3:iterable} if ${4:condition}]`,
      description: 'List comprehension'
    },

    'dict-comprehension': {
      prefix: 'dictcomp',
      body: `{${1:key}: ${2:value} for ${3:item} in ${4:iterable} if ${5:condition}}`,
      description: 'Dictionary comprehension'
    }
  },

  // ==================== JAVA SNIPPETS ====================
  java: {
    'main-method': {
      prefix: 'psvm',
      body: `public static void main(String[] args) {
    $1
}`,
      description: 'Main method'
    },

    'class-template': {
      prefix: 'class',
      body: `public class \${1:ClassName} {

    // Fields
    private \${2:String} \${3:field};

    // Constructor
    public \${1:ClassName}(\${2:String} \${3:field}) {
        this.\${3:field} = \${3:field};
    }

    // Getters and Setters
    public \${2:String} get\${3/(.)(.*)/\u$1$2/}() {
        return \${3:field};
    }

    public void set\${3/(.)(.*)/\u$1$2/}(\${2:String} \${3:field}) {
        this.\${3:field} = \${3:field};
    }
}`,
      description: 'Class template with getters/setters'
    },

    'singleton': {
      prefix: 'singleton',
      body: `public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}`,
      description: 'Thread-safe singleton'
    },

    'try-resources': {
      prefix: 'tryresources',
      body: `try (\${1:Resource} \${2:resource} = new \${1:Resource}()) {
    \${3:// Use resource}
} catch (\${4:Exception} e) {
    \${5:e.printStackTrace();}
}`,
      description: 'Try-with-resources'
    },

    'interface': {
      prefix: 'interface',
      body: `public interface \${1:InterfaceName} {
    \${2:void method();}
}`,
      description: 'Interface declaration'
    },

    'enum': {
      prefix: 'enum',
      body: `public enum \${1:EnumName} {
    \${2:VALUE1}, \${3:VALUE2}, \${4:VALUE3};

    private \${5:String} \${6:field};

    \${1:EnumName}(\${5:String} \${6:field}) {
        this.\${6:field} = \${6:field};
    }

    public \${5:String} get\${6/(.)(.*)/\u$1$2/}() {
        return \${6:field};
    }
}`,
      description: 'Enum with fields'
    }
  },

  // ==================== TYPESCRIPT SNIPPETS ====================
  typescript: {
    'interface': {
      prefix: 'interface',
      body: `interface \${1:InterfaceName} {
  \${2:property}: \${3:string};
}`,
      description: 'Interface declaration'
    },

    'type': {
      prefix: 'type',
      body: `type \${1:TypeName} = {
  \${2:property}: \${3:string};
};`,
      description: 'Type alias'
    },

    'generic-function': {
      prefix: 'genericfunc',
      body: `function \${1:functionName}<T>(arg: T): T {
  return arg;
}`,
      description: 'Generic function'
    },

    'enum': {
      prefix: 'enum',
      body: `enum \${1:EnumName} {
  \${2:Value1} = '\${3:value1}',
  \${4:Value2} = '\${5:value2}',
}`,
      description: 'Enum declaration'
    },

    'react-component': {
      prefix: 'rfc',
      body: `import React from 'react';

interface \${1:Component}Props {
  \${2:prop}: \${3:string};
}

const \${1:Component}: React.FC<\${1:Component}Props> = ({ \${2:prop} }) => {
  return (
    <div>
      {\${2:prop}}
    </div>
  );
};

export default \${1:Component};`,
      description: 'React functional component with TypeScript'
    },

    'async-function': {
      prefix: 'asyncfunc',
      body: `async function \${1:functionName}(): Promise<\${2:void}> {
  try {
    \${3:// code}
  } catch (error) {
    console.error(error);
  }
}`,
      description: 'Async function with error handling'
    }
  },

  // ==================== C++ SNIPPETS ====================
  cpp: {
    'main': {
      prefix: 'main',
      body: `int main() {
    \${1:// code}
    return 0;
}`,
      description: 'Main function'
    },

    'class': {
      prefix: 'class',
      body: `class \${1:ClassName} {
private:
    \${2:// private members}

public:
    \${1:ClassName}() {
        \${3:// constructor}
    }

    ~\${1:ClassName}() {
        \${4:// destructor}
    }

    \${5:// public methods}
};`,
      description: 'Class declaration'
    },

    'vector': {
      prefix: 'vector',
      body: `std::vector<\${1:int}> \${2:vec} = {\${3:values}};`,
      description: 'Vector declaration'
    },

    'for-each': {
      prefix: 'foreach',
      body: `for (const auto& \${1:item} : \${2:container}) {
    \${3:// code}
}`,
      description: 'Range-based for loop'
    },

    'smart-pointer': {
      prefix: 'smartptr',
      body: `std::unique_ptr<\${1:Type}> \${2:ptr} = std::make_unique<\${1:Type}>(\${3:args});`,
      description: 'Unique pointer'
    }
  },

  // ==================== SQL SNIPPETS ====================
  sql: {
    'select': {
      prefix: 'select',
      body: `SELECT \${1:columns}
FROM \${2:table}
WHERE \${3:condition};`,
      description: 'SELECT statement'
    },

    'join': {
      prefix: 'join',
      body: `SELECT \${1:columns}
FROM \${2:table1}
INNER JOIN \${3:table2} ON \${2:table1}.\${4:id} = \${3:table2}.\${5:id}
WHERE \${6:condition};`,
      description: 'INNER JOIN query'
    },

    'create-table': {
      prefix: 'createtable',
      body: `CREATE TABLE \${1:table_name} (
    id INT PRIMARY KEY AUTO_INCREMENT,
    \${2:column_name} \${3:VARCHAR(255)} NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      description: 'CREATE TABLE statement'
    },

    'insert': {
      prefix: 'insert',
      body: `INSERT INTO \${1:table} (\${2:columns})
VALUES (\${3:values});`,
      description: 'INSERT statement'
    }
  }
};

// Export individual language snippets
export const getSnippetsForLanguage = (language) => {
  return CODE_SNIPPETS[language] || {};
};

// Get all snippet prefixes for a language
export const getSnippetPrefixes = (language) => {
  const snippets = CODE_SNIPPETS[language] || {};
  return Object.keys(snippets).map(key => snippets[key].prefix);
};

// Search snippets by prefix
export const findSnippetByPrefix = (language, prefix) => {
  const snippets = CODE_SNIPPETS[language] || {};
  return Object.values(snippets).find(snippet => snippet.prefix === prefix);
};

export default CODE_SNIPPETS;
