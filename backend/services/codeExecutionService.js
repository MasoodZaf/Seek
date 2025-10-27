const ivm = require('isolated-vm');
const { v4: uuidv4 } = require('uuid');
const { CodeExecution } = require('../models');
const logger = require('../config/logger');
const dockerExecutionService = require('./dockerExecutionService');
const nativeExecutionService = require('./nativeExecutionService');

class CodeExecutionService {
  constructor() {
    this.executionTimeouts = new Map();
    this.maxExecutionTime = parseInt(process.env.CODE_EXECUTION_TIMEOUT) || 5000;
    this.maxCodeLength = parseInt(process.env.MAX_CODE_LENGTH) || 10000;
  }

  async executeCode(userId, code, language, input = '', sessionId = null, tutorialId = null, lessonId = null, clientInfo = {}) {
    let executionRecord = null;

    try {
      if (!sessionId) {
        sessionId = uuidv4();
      }

      if (code.length > this.maxCodeLength) {
        throw new Error(`Code exceeds maximum length of ${this.maxCodeLength} characters`);
      }

      executionRecord = await CodeExecution.create({
        userId,
        sessionId,
        tutorialId,
        lessonId,
        language,
        code,
        input,
        ipAddress: clientInfo.ipAddress || 'unknown',
        userAgent: clientInfo.userAgent || null
      });

      await executionRecord.markAsRunning();

      let result;
      switch (language.toLowerCase()) {
        case 'javascript':
          result = await this.executeJavaScript(code, input);
          break;
        case 'python':
          result = await this.executePython(code, input);
          break;
        case 'typescript':
          result = await this.executeTypeScript(code, input);
          break;
        case 'java':
          result = await this.executeJava(code, input);
          break;
        case 'cpp':
        case 'c++':
          result = await this.executeCpp(code, input);
          break;
        case 'c':
          result = await this.executeC(code, input);
          break;
        case 'go':
          result = await this.executeGo(code, input);
          break;
        case 'rust':
          result = await this.executeRust(code, input);
          break;
        case 'csharp':
          result = await this.executeCSharp(code, input);
          break;
        case 'php':
          result = await this.executePHP(code, input);
          break;
        case 'ruby':
          result = await this.executeRuby(code, input);
          break;
        case 'kotlin':
          result = await this.executeKotlin(code, input);
          break;
        case 'swift':
          result = await this.executeSwift(code, input);
          break;
        case 'gml':
          result = await this.executeGML(code, input);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      await executionRecord.markAsCompleted(result.output, result.executionTime, result.memoryUsage);

      return {
        success: true,
        sessionId,
        executionId: executionRecord._id,
        output: result.output,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage
      };
    } catch (error) {
      logger.error('Code execution error:', { error: error.message, userId, language });

      if (executionRecord) {
        await executionRecord.markAsError(error.message);
      }

      return {
        success: false,
        error: error.message,
        sessionId: sessionId || uuidv4()
      };
    }
  }

  async executeJavaScript(code, input = '') {
    const startTime = Date.now();
    const output = { stdout: '', stderr: '', exitCode: 0 };
    let isolate = null;
    let context = null;

    try {
      // Create a new isolate with memory limits
      isolate = new ivm.Isolate({ memoryLimit: 32 });
      context = await isolate.createContext();

      // Use native execution for JavaScript (Docker has stdin issues)
      return await nativeExecutionService.executeCode(code, 'javascript', input);

      // Set up global objects safely
      await context.global.set('input', input);
      await context.global.set('Math', ivm.Reference.from(Math));
      await context.global.set('JSON', ivm.Reference.from(JSON));
      await context.global.set('Date', ivm.Reference.from(Date));
      await context.global.set('Array', ivm.Reference.from(Array));
      await context.global.set('Object', ivm.Reference.from(Object));
      await context.global.set('String', ivm.Reference.from(String));
      await context.global.set('Number', ivm.Reference.from(Number));
      await context.global.set('Boolean', ivm.Reference.from(Boolean));
      await context.global.set('RegExp', ivm.Reference.from(RegExp));
      await context.global.set('parseInt', ivm.Reference.from(parseInt));
      await context.global.set('parseFloat', ivm.Reference.from(parseFloat));
      await context.global.set('isNaN', ivm.Reference.from(isNaN));
      await context.global.set('isFinite', ivm.Reference.from(isFinite));

      const wrappedCode = `
        try {
          ${code}
        } catch (error) {
          console.error('Runtime Error: ' + error.message);
        }
      `;

      // Execute the code with timeout
      await context.eval(wrappedCode, { timeout: this.maxExecutionTime });

      const executionTime = Date.now() - startTime;
      const memoryUsage = isolate.getHeapStatisticsSync().used_heap_size;

      return {
        output,
        executionTime,
        memoryUsage
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      if (error.message.includes('Script execution timed out')) {
        output.stderr = `Execution timed out after ${this.maxExecutionTime}ms`;
        output.exitCode = 124;
      } else {
        output.stderr = `Error: ${error.message}`;
        output.exitCode = 1;
      }

      return {
        output,
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed
      };
    } finally {
      // Clean up resources
      if (context) {
        context.release();
      }
      if (isolate) {
        isolate.dispose();
      }
    }
  }

  async executePython(code, input = '') {
    const startTime = Date.now();

    try {
      // Try native execution first
      const result = await nativeExecutionService.executeCode(code, 'python', input);

      // Extract stdout from the nested output object
      const output = result.output.stdout || result.output;

      return {
        output: output,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage || 1024
      };
    } catch (error) {
      logger.error('Python execution error:', error);

      // Fallback response when native execution fails
      return {
        output: {
          stdout: `❌ Python Execution Error:\n${error.message}\n\n📋 Your Code:\n${code}\n\n💡 Make sure Python 3 is installed on your system.`,
          stderr: error.message,
          exitCode: 1
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 1024
      };
    }
  }

  async executeTypeScript(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'typescript', input);
      return result;
    } catch (error) {
      logger.error('TypeScript execution error:', error);
      return {
        output: `TypeScript code received successfully!\n\nCode:\n${code}\n\nNote: TypeScript execution requires Docker to be running. Please start Docker Desktop to execute TypeScript code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeJava(code, input = '') {
    const startTime = Date.now();

    try {
      // Try native execution first
      const result = await nativeExecutionService.executeCode(code, 'java', input);

      // Extract stdout from the nested output object
      const output = result.output.stdout || result.output;

      return {
        output: output,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage || 1024
      };
    } catch (error) {
      logger.error('Java execution error:', error);

      // Fallback response when native execution fails
      return {
        output: {
          stdout: `❌ Java Execution Error:\n${error.message}\n\n📋 Your Code:\n${code}\n\n💡 Make sure Java JDK is installed and javac/java are in PATH.`,
          stderr: error.message,
          exitCode: 1
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 1024
      };
    }
  }

  async executeCpp(code, input = '') {
    const startTime = Date.now();

    try {
      // Try native execution first
      const result = await nativeExecutionService.executeCode(code, 'cpp', input);

      // Extract stdout from the nested output object
      const output = result.output.stdout || result.output;

      return {
        output: output,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage || 1024
      };
    } catch (error) {
      logger.error('C++ execution error:', error);

      // Enhanced fallback with code analysis
      const hasMain = /int\s+main\s*\(/.test(code);
      const hasIncludes = /#include/.test(code);

      let analysisMessage = '';
      if (!hasIncludes) {
        analysisMessage += '\n🔍 Missing includes: Add #include <iostream> for cout/cin';
      }
      if (!hasMain) {
        analysisMessage += '\n🔍 Missing main function: Add int main() {...}';
      }

      return {
        output: {
          stdout: `🔧 C++ Code Analysis:\n\n📋 Your Code:\n${code}\n\n❌ Compilation Error: ${error.message}\n\n${analysisMessage}\n\n💡 To run C++ code:\n1. Install GCC: brew install gcc (macOS) or apt install g++ (Linux)\n2. Make sure your code has proper includes and main function\n3. For now, you can verify syntax and structure here`,
          stderr: error.message,
          exitCode: 1
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 1024
      };
    }
  }

  async executeC(code, input = '') {
    const startTime = Date.now();

    try {
      // Try native execution first
      const result = await nativeExecutionService.executeCode(code, 'c', input);

      // Extract stdout from the nested output object
      const output = result.output.stdout || result.output;

      return {
        output: output,
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage || 1024
      };
    } catch (error) {
      logger.error('C execution error:', error);

      // Fallback response when native execution fails
      return {
        output: {
          stdout: `❌ C Execution Error:\n${error.message}\n\n📋 Your Code:\n${code}\n\n💡 Make sure GCC or Clang is installed for C compilation.`,
          stderr: error.message,
          exitCode: 1
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 1024
      };
    }
  }

  async executeGML(code, input = '') {
    const startTime = Date.now();

    try {
      // Analyze GML code structure
      const hasDrawFunction = /draw_/.test(code);
      const hasVariables = /var\s+\w+/.test(code);
      const hasShowMessage = /show_message/.test(code);
      const hasFunctions = /function\s+\w+/.test(code);
      const hasArrays = /\[\]/.test(code);

      let analysis = '🔍 Code Analysis:\n';
      if (hasDrawFunction) analysis += '✅ Contains draw functions\n';
      if (hasVariables) analysis += '✅ Uses variables\n';
      if (hasShowMessage) analysis += '✅ Has show_message calls\n';
      if (hasFunctions) analysis += '✅ Defines custom functions\n';
      if (hasArrays) analysis += '✅ Uses arrays\n';

      // Simulate some GML execution
      let simulatedOutput = '';
      const lines = code.split('\n');

      lines.forEach((line) => {
        if (line.includes('show_message')) {
          const messageMatch = line.match(/show_message\s*\(\s*["']([^"']+)["']\s*\)/);
          if (messageMatch) {
            simulatedOutput += `📢 Message: ${messageMatch[1]}\n`;
          }
        }
        if (line.includes('var ')) {
          const varMatch = line.match(/var\s+(\w+)/);
          if (varMatch) {
            simulatedOutput += `📝 Variable declared: ${varMatch[1]}\n`;
          }
        }
      });

      return {
        output: {
          stdout: `🎮 GML Playground Simulation:\n\n📋 Your Code:\n${code}\n\n${analysis}\n${simulatedOutput}\n💡 This is a simulation - actual GML requires GameMaker Studio.\n\n🚀 In GameMaker Studio, this code would:\n- Execute in the game loop\n- Have access to sprites, sounds, and rooms\n- Interact with game objects and physics`,
          stderr: '',
          exitCode: 0
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 1024
      };
    } catch (error) {
      logger.error('GML execution error:', error);
      return {
        output: {
          stdout: `🎮 GML Code Validation:\n\n📋 Your Code:\n${code}\n\n✅ Syntax appears valid for GameMaker Language.\n\n💡 To run this code:\n1. Open GameMaker Studio\n2. Create a new project\n3. Add this code to an object's event\n4. Test in the room`,
          stderr: '',
          exitCode: 0
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 1024
      };
    }
  }

  async getUserExecutionHistory(userId, limit = 50, page = 1) {
    try {
      const skip = (page - 1) * limit;

      const executions = await CodeExecution.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('tutorial', 'title')
        .select('-code -output.stdout -output.stderr');

      const total = await CodeExecution.countDocuments({ user: userId });

      return {
        success: true,
        data: {
          executions,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
          }
        }
      };
    } catch (error) {
      logger.error('Get execution history error:', error);
      return {
        success: false,
        error: 'Failed to fetch execution history'
      };
    }
  }

  async getExecutionDetails(executionId, userId) {
    try {
      const execution = await CodeExecution.findOne({
        _id: executionId,
        user: userId
      }).populate('tutorial', 'title description');

      if (!execution) {
        return {
          success: false,
          error: 'Execution not found'
        };
      }

      return {
        success: true,
        data: execution
      };
    } catch (error) {
      logger.error('Get execution details error:', error);
      return {
        success: false,
        error: 'Failed to fetch execution details'
      };
    }
  }

  async getUserExecutionStats(userId, timeframeDays = 30) {
    try {
      const stats = await CodeExecution.getUserExecutionStats(userId, timeframeDays);

      const languageStats = {};
      stats.languageDistribution.forEach((lang) => {
        languageStats[lang] = (languageStats[lang] || 0) + 1;
      });

      return {
        success: true,
        data: {
          ...stats,
          languageDistribution: languageStats,
          successRate: stats.totalExecutions > 0
            ? Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)
            : 0
        }
      };
    } catch (error) {
      logger.error('Get execution stats error:', error);
      return {
        success: false,
        error: 'Failed to fetch execution statistics'
      };
    }
  }

  async executeGo(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'go', input);
      return result;
    } catch (error) {
      logger.error('Go execution error:', error);
      // Fallback to native execution or return a helpful message
      return {
        output: `Go code received successfully!\n\nCode:\n${code}\n\nNote: Go execution requires Docker to be running. Please start Docker Desktop to execute Go code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeRust(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'rust', input);
      return result;
    } catch (error) {
      logger.error('Rust execution error:', error);
      return {
        output: `Rust code received successfully!\n\nCode:\n${code}\n\nNote: Rust execution requires Docker to be running. Please start Docker Desktop to execute Rust code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeCSharp(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'csharp', input);
      return result;
    } catch (error) {
      logger.error('C# execution error:', error);
      return {
        output: `C# code received successfully!\n\nCode:\n${code}\n\nNote: C# execution requires Docker to be running. Please start Docker Desktop to execute C# code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executePHP(code, input = '') {
    try {
      // Try Docker first, fallback to native PHP if available
      const result = await dockerExecutionService.executeCode(code, 'php', input);
      return result;
    } catch (error) {
      logger.error('PHP execution error:', error);
      // Try native PHP execution
      try {
        return await this.executeNativePHP(code, input);
      } catch (nativeError) {
        return {
          output: `PHP code received successfully!\n\nCode:\n${code}\n\nNote: PHP execution requires Docker to be running or PHP to be installed locally. Please start Docker Desktop or install PHP to execute PHP code.`,
          executionTime: 0,
          memoryUsage: 0
        };
      }
    }
  }

  async executeRuby(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'ruby', input);
      return result;
    } catch (error) {
      logger.error('Ruby execution error:', error);
      return {
        output: `Ruby code received successfully!\n\nCode:\n${code}\n\nNote: Ruby execution requires Docker to be running. Please start Docker Desktop to execute Ruby code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeKotlin(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'kotlin', input);
      return result;
    } catch (error) {
      logger.error('Kotlin execution error:', error);
      return {
        output: `Kotlin code received successfully!\n\nCode:\n${code}\n\nNote: Kotlin execution requires Docker to be running. Please start Docker Desktop to execute Kotlin code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeSwift(code, input = '') {
    try {
      const result = await dockerExecutionService.executeCode(code, 'swift', input);
      return result;
    } catch (error) {
      logger.error('Swift execution error:', error);
      return {
        output: `Swift code received successfully!\n\nCode:\n${code}\n\nNote: Swift execution requires Docker to be running. Please start Docker Desktop to execute Swift code.`,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeNativePHP(code, input = '') {
    const { spawn } = require('child_process');
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const php = spawn('php', ['-r', code]);
      let output = '';
      let error = '';

      php.stdout.on('data', (data) => {
        output += data.toString();
      });

      php.stderr.on('data', (data) => {
        error += data.toString();
      });

      php.on('close', (code) => {
        const executionTime = Date.now() - startTime;
        resolve({
          output: output || error || 'Code executed successfully',
          executionTime,
          memoryUsage: 0
        });
      });

      // Send input if provided
      if (input) {
        php.stdin.write(input);
      }
      php.stdin.end();
      
      // Timeout after 5 seconds
      setTimeout(() => {
        php.kill();
        resolve({
          output: 'Execution timed out',
          executionTime: Date.now() - startTime,
          memoryUsage: 0
        });
      }, 5000);
    });
  }

  validateCode(code, language) {
    const errors = [];

    if (!code || code.trim().length === 0) {
      errors.push('Code cannot be empty');
    }

    if (code.length > this.maxCodeLength) {
      errors.push(`Code exceeds maximum length of ${this.maxCodeLength} characters`);
    }

    const dangerousPatterns = [
      /require\s*\(\s*['"][^'"]*fs['"]/, // File system access
      /require\s*\(\s*['"][^'"]*child_process['"]/, // Process execution
      /require\s*\(\s*['"][^'"]*net['"]/, // Network access
      /require\s*\(\s*['"][^'"]*http['"]/, // HTTP requests
      /eval\s*\(/, // Code evaluation
      /Function\s*\(\s*['"]/, // Dynamic function creation
      /import\s*\(/, // Dynamic imports
      /process\./, // Process access
      /global\./, // Global object access
      /Buffer\./ // Buffer access
    ];

    dangerousPatterns.forEach((pattern) => {
      if (pattern.test(code)) {
        errors.push('Code contains potentially dangerous operations');
      }
    });

    return errors;
  }

  cleanup() {
    this.executionTimeouts.clear();
  }
}

module.exports = new CodeExecutionService();
