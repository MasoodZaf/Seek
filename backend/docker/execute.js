#!/usr/bin/env node
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');

function executeCode(code, language) {
  try {
    const result = {
      success: true,
      stdout: '',
      stderr: '',
      exit_code: 0
    };

    try {
      if (language === 'typescript') {
        // Write TypeScript code to a temporary file
        const tempFile = '/tmp/user_code.ts';
        writeFileSync(tempFile, code);

        // Compile TypeScript
        execSync(`tsc ${tempFile} --outDir /tmp --target es2020 --module commonjs --strict false`, {
          timeout: 5000,
          stdio: 'pipe'
        });

        // Execute the compiled JavaScript
        const output = execSync('node /tmp/user_code.js', {
          timeout: 5000,
          stdio: 'pipe',
          encoding: 'utf8'
        });

        result.stdout = output;
      } else {
        // Execute JavaScript directly
        const tempFile = '/tmp/user_code.js';
        writeFileSync(tempFile, code);

        const output = execSync(`node ${tempFile}`, {
          timeout: 5000,
          stdio: 'pipe',
          encoding: 'utf8'
        });

        result.stdout = output;
      }
    } catch (execError) {
      result.success = false;
      result.stderr = execError.message || execError.toString();
      result.exit_code = execError.status || 1;

      // Handle compilation/execution errors
      if (execError.stderr) {
        result.stderr = execError.stderr.toString();
      }
    }

    console.log(JSON.stringify(result));
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      stdout: '',
      stderr: `Execution error: ${error.message}`,
      exit_code: 1
    }));
  }
}

function main() {
  try {
    // Read code from stdin
    process.stdin.setEncoding('utf8');
    let code = '';
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.log(JSON.stringify({
        success: false,
        stdout: '',
        stderr: 'Timeout waiting for input',
        exit_code: 1
      }));
      process.exit(1);
    }, 5000);

    process.stdin.on('readable', () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        code += chunk;
      }
    });

    process.stdin.on('end', () => {
      clearTimeout(timeout);
      if (!code.trim()) {
        console.log(JSON.stringify({
          success: false,
          stdout: '',
          stderr: 'No code received',
          exit_code: 1
        }));
        return;
      }
      // Determine language based on container name or assume JavaScript by default
      const language = process.env.CONTAINER_LANGUAGE || 'javascript';
      executeCode(code, language);
    });
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      stdout: '',
      stderr: `Execution error: ${error.message}`,
      exit_code: 1
    }));
  }
}

main();
