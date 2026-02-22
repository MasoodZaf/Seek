const fs = require('fs');
const { exec } = require('child_process');

// Read code from stdin
let code = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  code += chunk;
});

process.stdin.on('end', () => {
  const tempFile = '/tmp/user_code.ts';

  try {
    // Write TypeScript code to file
    fs.writeFileSync(tempFile, code);

    // Execute TypeScript using ts-node with transpile-only and compatible compiler options
    const compilerOptions = JSON.stringify({ module: "commonjs", moduleResolution: "node", target: "es2020" });
    const env = { ...process.env, TS_NODE_COMPILER_OPTIONS: compilerOptions };

    exec(`ts-node --transpile-only "${tempFile}"`, { timeout: 5000, env }, (execError, execStdout, execStderr) => {
      const result = {
        success: !execError,
        stdout: execStdout,
        stderr: execStderr,
        exit_code: execError ? (execError.code || 1) : 0
      };

      // Cleanup
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch (e) {
        // Ignore cleanup errors
      }

      console.log(JSON.stringify(result));
      process.exit(0);
    });
  } catch (error) {
    const result = {
      success: false,
      stdout: '',
      stderr: error.message,
      exit_code: 1
    };
    console.log(JSON.stringify(result));
    process.exit(0);
  }
});
