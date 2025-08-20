const { execFile, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');

class NativeExecutionService {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.maxExecutionTime = 10000; // 10 seconds
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create temp directory:', error);
    }
  }

  async executeCode(code, language, input = '') {
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      let result;

      switch (language) {
        case 'python':
          result = await this.executePython(code, input, executionId);
          break;
        case 'typescript':
          result = await this.executeTypeScript(code, input, executionId);
          break;
        case 'java':
          result = await this.executeJava(code, input, executionId);
          break;
        case 'c':
          result = await this.executeC(code, input, executionId);
          break;
        case 'cpp':
        case 'c++':
          result = await this.executeCpp(code, input, executionId);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      const executionTime = Date.now() - startTime;

      return {
        output: result,
        executionTime,
        memoryUsage: 0 // Not tracking memory for native execution
      };
    } catch (error) {
      logger.error(`Native execution error for ${language}:`, error);
      throw error;
    }
  }

  async executePython(code, input, executionId) {
    const filename = path.join(this.tempDir, `${executionId}.py`);

    try {
      await fs.writeFile(filename, code);

      return new Promise((resolve, reject) => {
        const process = spawn('python3', [filename], {
          timeout: this.maxExecutionTime,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        if (input) {
          process.stdin.write(input);
          process.stdin.end();
        }

        process.on('close', async (code) => {
          // Cleanup after process closes
          try {
            await fs.unlink(filename);
          } catch (e) {
            // Ignore cleanup errors
          }

          resolve({
            stdout: stdout || 'Code executed successfully',
            stderr,
            exitCode: code
          });
        });

        process.on('error', async (error) => {
          // Cleanup on error
          try {
            await fs.unlink(filename);
          } catch (e) {
            // Ignore cleanup errors
          }
          reject(error);
        });

        setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error('Execution timeout'));
        }, this.maxExecutionTime);
      });
    } catch (error) {
      // Cleanup if file creation failed
      try {
        await fs.unlink(filename);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  async executeTypeScript(code, input, executionId) {
    const tsFilename = path.join(this.tempDir, `${executionId}.ts`);
    const jsFilename = path.join(this.tempDir, `${executionId}.js`);

    try {
      // Write TypeScript file
      await fs.writeFile(tsFilename, code);

      // Compile TypeScript to JavaScript
      const tscResult = await new Promise((resolve, reject) => {
        execFile(
          'npx',
          ['tsc', '--target', 'ES2020', '--module', 'commonjs', tsFilename],
          { timeout: 5000 },
          (error, stdout, stderr) => {
            if (error) {
              resolve({ error: error.message, stderr });
              return;
            }
            resolve({ success: true });
          }
        );
      });

      if (tscResult.error) {
        return {
          stdout: '',
          stderr: `TypeScript compilation error: ${tscResult.stderr || tscResult.error}`,
          exitCode: 1
        };
      }

      // Execute the compiled JavaScript
      return new Promise((resolve, reject) => {
        const process = spawn('node', [jsFilename], {
          timeout: this.maxExecutionTime,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        if (input) {
          process.stdin.write(input);
          process.stdin.end();
        }

        process.on('close', async (code) => {
          // Cleanup after execution completes
          try {
            await fs.unlink(tsFilename);
            await fs.unlink(jsFilename);
          } catch (e) {
            // Ignore cleanup errors
          }

          resolve({
            stdout: stdout || 'Code executed successfully',
            stderr,
            exitCode: code
          });
        });

        process.on('error', async (error) => {
          // Cleanup on error
          try {
            await fs.unlink(tsFilename);
            await fs.unlink(jsFilename);
          } catch (e) {
            // Ignore cleanup errors
          }
          reject(error);
        });

        setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error('Execution timeout'));
        }, this.maxExecutionTime);
      });
    } catch (error) {
      // Cleanup if there was an error during compilation
      try {
        await fs.unlink(tsFilename);
        await fs.unlink(jsFilename);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  async executeJava(code, input, executionId) {
    // Extract class name from code
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Main';

    const filename = path.join(this.tempDir, `${className}.java`);
    const classFile = path.join(this.tempDir, `${className}.class`);

    try {
      await fs.writeFile(filename, code);

      // Compile Java
      const compileResult = await new Promise((resolve, reject) => {
        execFile('javac', [filename], { timeout: 5000 }, (error, stdout, stderr) => {
          if (error) {
            resolve({ error: error.message, stderr });
            return;
          }
          resolve({ success: true });
        });
      });

      if (compileResult.error) {
        return {
          stdout: '',
          stderr: `Java compilation error: ${compileResult.stderr || compileResult.error}`,
          exitCode: 1
        };
      }

      // Execute Java
      return new Promise((resolve, reject) => {
        const process = spawn('java', ['-cp', this.tempDir, className], {
          timeout: this.maxExecutionTime,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        if (input) {
          process.stdin.write(input);
          process.stdin.end();
        }

        process.on('close', async (code) => {
          // Cleanup after execution completes
          try {
            await fs.unlink(filename);
            await fs.unlink(classFile);
          } catch (e) {
            // Ignore cleanup errors
          }

          resolve({
            stdout: stdout || 'Code executed successfully',
            stderr,
            exitCode: code
          });
        });

        process.on('error', async (error) => {
          // Cleanup on error
          try {
            await fs.unlink(filename);
            await fs.unlink(classFile);
          } catch (e) {
            // Ignore cleanup errors
          }
          reject(error);
        });

        setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error('Execution timeout'));
        }, this.maxExecutionTime);
      });
    } catch (error) {
      // Cleanup if there was an error during compilation
      try {
        await fs.unlink(filename);
        await fs.unlink(classFile);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  async executeC(code, input, executionId) {
    const sourceFile = path.join(this.tempDir, `${executionId}.c`);
    const execFile = path.join(this.tempDir, `${executionId}_c_exec`);

    try {
      await fs.writeFile(sourceFile, code);

      // Compile C
      const compileResult = await new Promise((resolve, reject) => {
        const compiler = spawn('gcc', [sourceFile, '-o', execFile], { timeout: 5000 });

        let stderr = '';
        let stdout = '';

        compiler.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        compiler.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        compiler.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true });
          } else {
            resolve({ error: stderr || `Compilation failed with exit code ${code}`, code });
          }
        });

        compiler.on('error', (error) => {
          resolve({ error: error.message });
        });
      });

      if (compileResult.error) {
        return {
          stdout: '',
          stderr: `C compilation error: ${compileResult.error}`,
          exitCode: 1
        };
      }

      // Execute C program
      return new Promise((resolve, reject) => {
        const process = spawn(execFile, [], {
          timeout: this.maxExecutionTime,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        if (input) {
          process.stdin.write(input);
          process.stdin.end();
        }

        process.on('close', async (code) => {
          // Cleanup after execution completes
          try {
            await fs.unlink(sourceFile);
            await fs.unlink(execFile);
          } catch (e) {
            // Ignore cleanup errors
          }

          resolve({
            stdout: stdout || 'Code executed successfully',
            stderr,
            exitCode: code
          });
        });

        process.on('error', async (error) => {
          // Cleanup on error
          try {
            await fs.unlink(sourceFile);
            await fs.unlink(execFile);
          } catch (e) {
            // Ignore cleanup errors
          }
          reject(error);
        });

        setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error('Execution timeout'));
        }, this.maxExecutionTime);
      });
    } catch (error) {
      // Cleanup if there was an error during compilation
      try {
        await fs.unlink(sourceFile);
        await fs.unlink(execFile);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  async executeCpp(code, input, executionId) {
    const sourceFile = path.join(this.tempDir, `${executionId}.cpp`);
    const execFile = path.join(this.tempDir, `${executionId}_cpp_exec`);

    try {
      await fs.writeFile(sourceFile, code);

      // Compile C++
      const compileResult = await new Promise((resolve, reject) => {
        const compiler = spawn('g++', ['-std=c++17', sourceFile, '-o', execFile], { timeout: 5000 });

        let stderr = '';
        let stdout = '';

        compiler.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        compiler.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        compiler.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true });
          } else {
            resolve({ error: stderr || `Compilation failed with exit code ${code}`, code });
          }
        });

        compiler.on('error', (error) => {
          resolve({ error: error.message });
        });
      });

      if (compileResult.error) {
        return {
          stdout: '',
          stderr: `C++ compilation error: ${compileResult.error}`,
          exitCode: 1
        };
      }

      // Execute C++ program
      return new Promise((resolve, reject) => {
        const process = spawn(execFile, [], {
          timeout: this.maxExecutionTime,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        if (input) {
          process.stdin.write(input);
          process.stdin.end();
        }

        process.on('close', async (code) => {
          // Cleanup after execution completes
          try {
            await fs.unlink(sourceFile);
            await fs.unlink(execFile);
          } catch (e) {
            // Ignore cleanup errors
          }

          resolve({
            stdout: stdout || 'Code executed successfully',
            stderr,
            exitCode: code
          });
        });

        process.on('error', async (error) => {
          // Cleanup on error
          try {
            await fs.unlink(sourceFile);
            await fs.unlink(execFile);
          } catch (e) {
            // Ignore cleanup errors
          }
          reject(error);
        });

        setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error('Execution timeout'));
        }, this.maxExecutionTime);
      });
    } catch (error) {
      // Cleanup if there was an error during compilation
      try {
        await fs.unlink(sourceFile);
        await fs.unlink(execFile);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }
}

module.exports = new NativeExecutionService();
