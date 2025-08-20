const logger = require('../config/logger');

class CodeTranslationService {
  constructor() {
    this.supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'c', 'typescript'];
  }

  async translateCode(sourceCode, fromLanguage, toLanguage, userId = null) {
    try {
      if (!this.supportedLanguages.includes(fromLanguage) || !this.supportedLanguages.includes(toLanguage)) {
        throw new Error(`Unsupported language combination: ${fromLanguage} to ${toLanguage}`);
      }

      if (fromLanguage === toLanguage) {
        return {
          success: true,
          originalCode: sourceCode,
          translatedCode: sourceCode,
          fromLanguage,
          toLanguage,
          message: 'Same language - no translation needed'
        };
      }

      // Analyze the source code structure
      const codeAnalysis = this.analyzeCode(sourceCode, fromLanguage);

      // Generate equivalent code in target language
      const translatedCode = this.generateCode(codeAnalysis, toLanguage);

      logger.info(`Code translated from ${fromLanguage} to ${toLanguage}`, { userId });

      return {
        success: true,
        originalCode: sourceCode,
        translatedCode,
        fromLanguage,
        toLanguage,
        analysis: codeAnalysis,
        message: `Successfully translated ${fromLanguage} to ${toLanguage}`
      };
    } catch (error) {
      logger.error('Code translation error:', {
        error: error.message, fromLanguage, toLanguage, userId
      });

      return {
        success: false,
        error: error.message,
        originalCode: sourceCode,
        fromLanguage,
        toLanguage
      };
    }
  }

  analyzeCode(code, language) {
    const analysis = {
      variables: [],
      functions: [],
      classes: [],
      imports: [],
      controlStructures: [],
      dataTypes: {},
      hasMain: false,
      codeBlocks: []
    };

    // Remove comments and normalize whitespace
    const cleanCode = this.cleanCode(code, language);

    switch (language) {
      case 'javascript':
      case 'typescript':
        this.analyzeJavaScript(cleanCode, analysis);
        break;
      case 'python':
        this.analyzePython(cleanCode, analysis);
        break;
      case 'java':
        this.analyzeJava(cleanCode, analysis);
        break;
      case 'cpp':
      case 'c':
        this.analyzeC(cleanCode, analysis);
        break;
      default:
        throw new Error(`Analysis not implemented for ${language}`);
    }

    return analysis;
  }

  cleanCode(code, language) {
    // Remove single line comments
    let cleaned = code;

    switch (language) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'cpp':
      case 'c':
        cleaned = cleaned.replace(/\/\/.*$/gm, '');
        cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
        break;
      case 'python':
        cleaned = cleaned.replace(/#.*$/gm, '');
        break;
    }

    return cleaned.trim();
  }

  analyzeJavaScript(code, analysis) {
    // Variables
    const varMatches = code.match(/(?:let|const|var)\s+(\w+)/g);
    if (varMatches) {
      analysis.variables = varMatches.map((match) => {
        const parts = match.split(/\s+/);
        return { name: parts[1], type: 'auto', declaration: parts[0] };
      });
    }

    // Functions
    const funcMatches = code.match(/function\s+(\w+)\s*\([^)]*\)|(\w+)\s*=\s*\([^)]*\)\s*=>/g);
    if (funcMatches) {
      analysis.functions = funcMatches.map((match) => {
        if (match.includes('function')) {
          const name = match.match(/function\s+(\w+)/)[1];
          const params = match.match(/\(([^)]*)\)/)[1];
          return { name, params, type: 'function' };
        }
        const name = match.match(/(\w+)\s*=/)[1];
        const params = match.match(/\(([^)]*)\)/)[1];
        return { name, params, type: 'arrow' };
      });
    }

    // Console.log statements
    const consoleMatches = code.match(/console\.log\([^)]+\)/g);
    if (consoleMatches) {
      analysis.codeBlocks.push(...consoleMatches.map((match) => ({
        type: 'print',
        content: match.match(/console\.log\(([^)]+)\)/)[1]
      })));
    }

    // Control structures
    this.analyzeControlStructures(code, analysis);
  }

  analyzePython(code, analysis) {
    // Variables
    const varMatches = code.match(/^\s*(\w+)\s*=/gm);
    if (varMatches) {
      analysis.variables = varMatches.map((match) => {
        const name = match.match(/(\w+)\s*=/)[1];
        return { name, type: 'auto', declaration: 'var' };
      });
    }

    // Functions
    const funcMatches = code.match(/def\s+(\w+)\s*\([^)]*\):/g);
    if (funcMatches) {
      analysis.functions = funcMatches.map((match) => {
        const name = match.match(/def\s+(\w+)/)[1];
        const params = match.match(/\(([^)]*)\)/)[1];
        return { name, params, type: 'function' };
      });
    }

    // Print statements
    const printMatches = code.match(/print\([^)]+\)/g);
    if (printMatches) {
      analysis.codeBlocks.push(...printMatches.map((match) => ({
        type: 'print',
        content: match.match(/print\(([^)]+)\)/)[1]
      })));
    }

    this.analyzeControlStructures(code, analysis);
  }

  analyzeJava(code, analysis) {
    // Check for main method
    analysis.hasMain = /public\s+static\s+void\s+main/.test(code);

    // Variables
    const varMatches = code.match(/(?:int|String|double|float|boolean|char)\s+(\w+)/g);
    if (varMatches) {
      analysis.variables = varMatches.map((match) => {
        const parts = match.split(/\s+/);
        return { name: parts[1], type: parts[0], declaration: 'typed' };
      });
    }

    // Methods
    const methodMatches = code.match(/(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\([^)]*\)/g);
    if (methodMatches) {
      analysis.functions = methodMatches.map((match) => {
        const name = match.match(/\s(\w+)\s*\(/)[1];
        const params = match.match(/\(([^)]*)\)/)[1];
        return { name, params, type: 'method' };
      });
    }

    // System.out.println statements
    const printMatches = code.match(/System\.out\.println?\([^)]+\)/g);
    if (printMatches) {
      analysis.codeBlocks.push(...printMatches.map((match) => ({
        type: 'print',
        content: match.match(/System\.out\.println?\(([^)]+)\)/)[1]
      })));
    }

    this.analyzeControlStructures(code, analysis);
  }

  analyzeC(code, analysis) {
    // Check for main function
    analysis.hasMain = /int\s+main\s*\(/.test(code);

    // Variables
    const varMatches = code.match(/(?:int|char|float|double|void)\s+\*?(\w+)/g);
    if (varMatches) {
      analysis.variables = varMatches.map((match) => {
        const parts = match.split(/\s+/);
        const type = parts[0];
        const name = parts[1].replace('*', '');
        return { name, type, declaration: 'typed' };
      });
    }

    // Functions
    const funcMatches = code.match(/(?:int|char|float|double|void)\s+(\w+)\s*\([^)]*\)/g);
    if (funcMatches) {
      analysis.functions = funcMatches.map((match) => {
        const name = match.match(/\s(\w+)\s*\(/)[1];
        const params = match.match(/\(([^)]*)\)/)[1];
        const returnType = match.match(/(\w+)\s+\w+\s*\(/)[1];
        return {
          name, params, returnType, type: 'function'
        };
      });
    }

    // Printf statements
    const printMatches = code.match(/printf?\([^)]+\)/g);
    if (printMatches) {
      analysis.codeBlocks.push(...printMatches.map((match) => ({
        type: 'print',
        content: match.match(/printf?\(([^)]+)\)/)[1]
      })));
    }

    this.analyzeControlStructures(code, analysis);
  }

  analyzeControlStructures(code, analysis) {
    // If statements
    const ifMatches = code.match(/if\s*\([^)]+\)/g);
    if (ifMatches) {
      analysis.controlStructures.push(...ifMatches.map((match) => ({
        type: 'if',
        condition: match.match(/if\s*\(([^)]+)\)/)[1]
      })));
    }

    // For loops
    const forMatches = code.match(/for\s*\([^)]+\)/g);
    if (forMatches) {
      analysis.controlStructures.push(...forMatches.map((match) => ({
        type: 'for',
        condition: match.match(/for\s*\(([^)]+)\)/)[1]
      })));
    }

    // While loops
    const whileMatches = code.match(/while\s*\([^)]+\)/g);
    if (whileMatches) {
      analysis.controlStructures.push(...whileMatches.map((match) => ({
        type: 'while',
        condition: match.match(/while\s*\(([^)]+)\)/)[1]
      })));
    }
  }

  generateCode(analysis, toLanguage) {
    let translatedCode = '';

    switch (toLanguage) {
      case 'javascript':
        translatedCode = this.generateJavaScript(analysis);
        break;
      case 'python':
        translatedCode = this.generatePython(analysis);
        break;
      case 'java':
        translatedCode = this.generateJava(analysis);
        break;
      case 'cpp':
        translatedCode = this.generateCpp(analysis);
        break;
      case 'c':
        translatedCode = this.generateC(analysis);
        break;
      case 'typescript':
        translatedCode = this.generateTypeScript(analysis);
        break;
      default:
        throw new Error(`Code generation not implemented for ${toLanguage}`);
    }

    return translatedCode;
  }

  generateJavaScript(analysis) {
    let code = '';

    // Variables
    analysis.variables.forEach((variable) => {
      code += `let ${variable.name};\n`;
    });

    if (analysis.variables.length > 0) code += '\n';

    // Functions
    analysis.functions.forEach((func) => {
      code += `function ${func.name}(${func.params}) {\n    // TODO: Implement function logic\n}\n\n`;
    });

    // Main execution
    if (analysis.hasMain || analysis.codeBlocks.length > 0) {
      code += '// Main execution\n';
      analysis.codeBlocks.forEach((block) => {
        if (block.type === 'print') {
          code += `console.log(${block.content});\n`;
        }
      });
    }

    return code.trim();
  }

  generatePython(analysis) {
    let code = '';

    // Functions
    analysis.functions.forEach((func) => {
      code += `def ${func.name}(${func.params}):\n    # TODO: Implement function logic\n    pass\n\n`;
    });

    // Main execution
    if (analysis.hasMain || analysis.codeBlocks.length > 0) {
      if (analysis.functions.length > 0) code += '# Main execution\n';

      // Variables
      analysis.variables.forEach((variable) => {
        code += `${variable.name} = None  # TODO: Set appropriate value\n`;
      });

      analysis.codeBlocks.forEach((block) => {
        if (block.type === 'print') {
          code += `print(${block.content})\n`;
        }
      });
    }

    return code.trim();
  }

  generateJava(analysis) {
    let code = 'public class Main {\n';

    // Variables as class fields
    if (analysis.variables.length > 0) {
      analysis.variables.forEach((variable) => {
        const javaType = this.mapToJavaType(variable.type);
        code += `    private static ${javaType} ${variable.name};\n`;
      });
      code += '\n';
    }

    // Methods
    analysis.functions.forEach((func) => {
      if (func.name !== 'main') {
        code += `    public static void ${func.name}(${func.params}) {\n        // TODO: Implement method logic\n    }\n\n`;
      }
    });

    // Main method
    code += '    public static void main(String[] args) {\n';

    analysis.codeBlocks.forEach((block) => {
      if (block.type === 'print') {
        code += `        System.out.println(${block.content});\n`;
      }
    });

    if (analysis.codeBlocks.length === 0) {
      code += '        // TODO: Add main logic\n';
    }

    code += '    }\n';
    code += '}';

    return code;
  }

  generateCpp(analysis) {
    let code = '#include <iostream>\n';
    if (analysis.variables.some((v) => v.type === 'string')
        || analysis.codeBlocks.some((b) => b.content && b.content.includes('"'))) {
      code += '#include <string>\n';
    }
    code += 'using namespace std;\n\n';

    // Function declarations
    analysis.functions.forEach((func) => {
      if (func.name !== 'main') {
        const returnType = func.returnType || 'void';
        code += `${returnType} ${func.name}(${func.params});\n`;
      }
    });

    if (analysis.functions.length > 0) code += '\n';

    // Main function
    code += 'int main() {\n';

    // Variables
    analysis.variables.forEach((variable) => {
      const cppType = this.mapToCppType(variable.type);
      code += `    ${cppType} ${variable.name};\n`;
    });

    if (analysis.variables.length > 0) code += '\n';

    analysis.codeBlocks.forEach((block) => {
      if (block.type === 'print') {
        code += `    cout << ${block.content} << endl;\n`;
      }
    });

    if (analysis.codeBlocks.length === 0) {
      code += '    // TODO: Add main logic\n';
    }

    code += '\n    return 0;\n';
    code += '}\n\n';

    // Function implementations
    analysis.functions.forEach((func) => {
      if (func.name !== 'main') {
        const returnType = func.returnType || 'void';
        code += `${returnType} ${func.name}(${func.params}) {\n    // TODO: Implement function logic\n`;
        if (returnType !== 'void') {
          code += `    return ${this.getDefaultValue(returnType)};\n`;
        }
        code += '}\n\n';
      }
    });

    return code.trim();
  }

  generateC(analysis) {
    let code = '#include <stdio.h>\n';
    if (analysis.variables.some((v) => v.type === 'string')) {
      code += '#include <string.h>\n';
    }
    code += '\n';

    // Function declarations
    analysis.functions.forEach((func) => {
      if (func.name !== 'main') {
        const returnType = func.returnType || 'void';
        code += `${returnType} ${func.name}(${func.params});\n`;
      }
    });

    if (analysis.functions.length > 0) code += '\n';

    // Main function
    code += 'int main() {\n';

    // Variables
    analysis.variables.forEach((variable) => {
      const cType = this.mapToCType(variable.type);
      code += `    ${cType} ${variable.name};\n`;
    });

    if (analysis.variables.length > 0) code += '\n';

    analysis.codeBlocks.forEach((block) => {
      if (block.type === 'print') {
        code += `    printf(${block.content});\n`;
      }
    });

    if (analysis.codeBlocks.length === 0) {
      code += '    // TODO: Add main logic\n';
    }

    code += '\n    return 0;\n';
    code += '}\n\n';

    // Function implementations
    analysis.functions.forEach((func) => {
      if (func.name !== 'main') {
        const returnType = func.returnType || 'void';
        code += `${returnType} ${func.name}(${func.params}) {\n    // TODO: Implement function logic\n`;
        if (returnType !== 'void') {
          code += `    return ${this.getDefaultValue(returnType)};\n`;
        }
        code += '}\n\n';
      }
    });

    return code.trim();
  }

  generateTypeScript(analysis) {
    let code = '';

    // Interfaces or types if needed
    if (analysis.variables.length > 0) {
      code += '// Variable declarations\n';
      analysis.variables.forEach((variable) => {
        code += `let ${variable.name}: any;\n`;
      });
      code += '\n';
    }

    // Functions
    analysis.functions.forEach((func) => {
      code += `function ${func.name}(${func.params}): void {\n    // TODO: Implement function logic\n}\n\n`;
    });

    // Main execution
    if (analysis.hasMain || analysis.codeBlocks.length > 0) {
      code += '// Main execution\n';
      analysis.codeBlocks.forEach((block) => {
        if (block.type === 'print') {
          code += `console.log(${block.content});\n`;
        }
      });
    }

    return code.trim();
  }

  mapToJavaType(type) {
    const typeMap = {
      auto: 'Object',
      int: 'int',
      string: 'String',
      double: 'double',
      float: 'float',
      boolean: 'boolean',
      char: 'char'
    };
    return typeMap[type] || 'Object';
  }

  mapToCppType(type) {
    const typeMap = {
      auto: 'auto',
      int: 'int',
      string: 'string',
      double: 'double',
      float: 'float',
      boolean: 'bool',
      char: 'char'
    };
    return typeMap[type] || 'auto';
  }

  mapToCType(type) {
    const typeMap = {
      auto: 'int',
      int: 'int',
      string: 'char*',
      double: 'double',
      float: 'float',
      boolean: 'int',
      char: 'char'
    };
    return typeMap[type] || 'int';
  }

  getDefaultValue(type) {
    const defaults = {
      int: '0',
      double: '0.0',
      float: '0.0f',
      char: "'\\0'",
      bool: 'false',
      string: '""'
    };
    return defaults[type] || '0';
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }
}

module.exports = new CodeTranslationService();
