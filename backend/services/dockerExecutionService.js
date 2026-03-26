const Docker = require('dockerode');
const tar = require('tar-stream');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

class DockerExecutionService {
  constructor() {
    this.docker = new Docker();
    this.maxExecutionTime = parseInt(process.env.CODE_EXECUTION_TIMEOUT) || 15000;
    this.maxMemory = '64m'; // 64MB memory limit (default)
    this.maxCpus = '0.5'; // 50% of one CPU core
    this.images = {
      python: 'seek-python-runner',
      typescript: 'seek-typescript-runner',
      javascript: 'seek-javascript-runner',
      java: 'seek-java-runner',
      cpp: 'seek-cpp-runner',
      c: 'seek-c-runner',
      go: 'seek-go-runner',
      rust: 'seek-rust-runner',
      csharp: 'seek-csharp-runner',
      php: 'seek-php-runner',
      ruby: 'seek-ruby-runner',
      kotlin: 'seek-kotlin-runner'
    };
    // Memory limits per language (some compilers need more memory)
    this.memoryLimits = {
      python: '256m',   // numpy/pandas can be memory-hungry
      typescript: '512m',
      javascript: '128m',
      java: '512m',     // JVM needs more memory
      cpp: '256m',
      c: '256m',
      go: '512m',
      rust: '256m',
      csharp: '512m',
      php: '128m',
      ruby: '128m',
      kotlin: '512m'
    };
    // Process limits per language (Go compiler spawns many processes)
    this.pidsLimits = {
      python: 100,
      typescript: 100,
      javascript: 100,
      java: 200,
      cpp: 200,
      c: 200,
      go: 300,
      rust: 200,
      csharp: 200,
      php: 100,
      ruby: 100,
      kotlin: 200
    };
    this.imageBuilt = {};
  }

  async init() {
    try {
      // Build Docker images for each language
      await this.buildImages();
      logger.info('Docker execution service initialized');
    } catch (error) {
      logger.error('Failed to initialize Docker execution service:', error);
      throw error;
    }
  }

  async buildImages() {
    const dockerDir = path.join(__dirname, '../docker');
    // Bump this version string whenever any Docker execute script or Dockerfile changes.
    // All images whose stored label doesn't match will be force-rebuilt.
    const CURRENT_BUILD_VERSION = '2025-03-24-v3';

    for (const [language, imageName] of Object.entries(this.images)) {
      try {
        // Check if image already exists AND is the current version
        let needsRebuild = true;
        try {
          const imageInfo = await this.docker.getImage(imageName).inspect();
          const storedVersion = imageInfo.Config?.Labels?.['seek.build.version'];
          if (storedVersion === CURRENT_BUILD_VERSION) {
            this.imageBuilt[language] = true;
            logger.info(`Docker image ${imageName} is current (v${CURRENT_BUILD_VERSION}), skipping rebuild`);
            needsRebuild = false;
          } else {
            logger.info(`Docker image ${imageName} is outdated (${storedVersion} vs ${CURRENT_BUILD_VERSION}), rebuilding...`);
            // Remove stale image
            try { await this.docker.getImage(imageName).remove({ force: true }); } catch (e) { /* ignore */ }
          }
        } catch (error) {
          // Image doesn't exist, build it
        }
        if (!needsRebuild) continue;

        logger.info(`Building Docker image for ${language}...`);

        // Create tar stream for Docker build context
        const tarStream = tar.pack();

        // Add Dockerfile
        const dockerfile = await fs.readFile(
          path.join(dockerDir, `Dockerfile.${language}`),
          'utf8'
        );
        tarStream.entry({ name: 'Dockerfile' }, dockerfile);

        // Add execution script
        let scriptName;
        switch (language) {
          case 'python':
            scriptName = 'execute.py';
            break;
          case 'typescript':
            scriptName = 'execute.ts.js';
            break;
          case 'javascript':
            scriptName = 'execute.js';
            break;
          case 'java':
            scriptName = 'Execute.java';
            break;
          case 'cpp':
            scriptName = 'execute.cpp';
            break;
          case 'c':
            scriptName = 'execute.c';
            break;
          case 'go':
            scriptName = 'execute.go';
            break;
          case 'rust':
            scriptName = 'execute.rs';
            break;
          case 'csharp':
            scriptName = 'execute.cs';
            break;
          case 'php':
            scriptName = 'execute.php';
            break;
          case 'ruby':
            scriptName = 'execute.rb';
            break;
          case 'kotlin':
            scriptName = 'execute.kt';
            break;
        }

        const script = await fs.readFile(
          path.join(dockerDir, scriptName),
          'utf8'
        );
        tarStream.entry({ name: scriptName }, script);
        
        // Add additional files for specific languages
        if (language === 'rust') {
          const cargoToml = await fs.readFile(
            path.join(dockerDir, 'Cargo.toml'),
            'utf8'
          );
          tarStream.entry({ name: 'Cargo.toml' }, cargoToml);
        }
        
        tarStream.finalize();

        // Build the image with version label for cache invalidation
        const buildStream = await this.docker.buildImage(tarStream, {
          t: imageName,
          rm: true,
          forcerm: true,
          labels: { 'seek.build.version': CURRENT_BUILD_VERSION }
        });

        await new Promise((resolve, reject) => {
          buildStream.on('data', (chunk) => {
            const data = chunk.toString();
            if (data.includes('error') || data.includes('Error')) {
              logger.error(`Docker build error for ${language}: ${data}`);
            }
          });

          buildStream.on('end', () => {
            this.imageBuilt[language] = true;
            logger.info(`Successfully built Docker image for ${language}`);
            resolve();
          });

          buildStream.on('error', reject);
        });
      } catch (error) {
        logger.error(`Failed to build Docker image for ${language}:`, error);
        throw error;
      }
    }
  }

  async executeCode(code, language, _input = '') {
    // Temporarily disable Go execution
    if (language === 'go') {
      return {
        success: false,
        output: {
          stdout: '',
          stderr: 'Go execution is temporarily disabled. This feature will be available soon.',
          exitCode: 1
        },
        executionTime: 0,
        memoryUsage: 0
      };
    }

    if (!this.imageBuilt[language]) {
      throw new Error(`Docker image not available for ${language}`);
    }

    const imageName = this.images[language];
    const memoryLimit = this.memoryLimits[language] || this.maxMemory;
    const pidsLimit = this.pidsLimits[language] || 50;
    let container;

    try {
      // Create container with resource limits
      container = await this.docker.createContainer({
        Image: imageName,
        Cmd: [],
        OpenStdin: true,
        StdinOnce: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        NetworkMode: 'none', // No network access
        HostConfig: {
          Memory: this.parseMemory(memoryLimit),
          MemorySwap: this.parseMemory(memoryLimit), // Same as memory to disable swap
          CpuQuota: Math.floor(this.maxCpus * 100000),
          CpuPeriod: 100000,
          PidsLimit: pidsLimit,
          ReadonlyRootfs: false,
          CapDrop: ['ALL'],
          CapAdd: ['SETUID', 'SETGID'], // Minimal caps needed
          SecurityOpt: ['no-new-privileges:true']
        },
        WorkingDir: '/app',
        User: 'coderunner'
      });

      // Attach to container BEFORE starting it
      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
        hijack: true
      });

      // Start container after attaching
      await container.start();

      // Send code to container
      logger.info(`Sending code to ${language} container: ${code.slice(0, 100)}...`);

      // Write code to stdin and close it
      stream.write(code);
      stream.end();

      // Set execution timeout (increased for debugging)
      const timeoutMs = this.maxExecutionTime * 2; // Double timeout for now
      logger.info(`Setting timeout for ${language} container: ${timeoutMs}ms`);
      const timeout = setTimeout(async () => {
        try {
          await container.kill('SIGTERM');
          logger.warn(`Container killed due to timeout: ${language} after ${timeoutMs}ms`);
        } catch (error) {
          logger.error('Error killing timed out container:', error);
        }
      }, timeoutMs);

      // Wait for container to finish
      const result = await container.wait();
      clearTimeout(timeout);

      // Get container output
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        timestamps: false
      });

      // Parse Docker logs — Docker multiplexes stdout(1) and stderr(2) with 8-byte headers.
      // We MUST separate them: our execute scripts write one JSON line to stdout;
      // any Node.js warnings/deprecations go to stderr. Mixing them breaks JSON.parse.
      let stdoutOutput = '';
      let stderrOutput = '';
      let offset = 0;

      while (offset < logs.length) {
        if (offset + 8 > logs.length) {
          stdoutOutput += logs.slice(offset).toString('utf8');
          break;
        }
        const streamType = logs[offset]; // 1=stdout, 2=stderr
        const size = logs.readUInt32BE(offset + 4);
        if (size === 0 || offset + 8 + size > logs.length) {
          stdoutOutput += logs.slice(offset).toString('utf8');
          break;
        }
        const data = logs.slice(offset + 8, offset + 8 + size).toString('utf8');
        if (streamType === 2) stderrOutput += data;
        else stdoutOutput += data;
        offset += 8 + size;
      }

      // If stdout has no JSON but stderr does (shouldn't happen but guard it)
      const cleanOutput = stdoutOutput.trim() || stderrOutput.trim();
      // Find the JSON object — execution scripts always emit one JSON line
      const jsonMatch = cleanOutput.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : cleanOutput;

      logger.info(`Docker logs — stdout: ${stdoutOutput.length}b, stderr: ${stderrOutput.length}b`);
      logger.info(`Clean output preview: ${cleanOutput.slice(0, 200)}`);

      try {
        // Try to parse as JSON (from our execution scripts)
        const parsedOutput = JSON.parse(jsonStr);
        return {
          success: parsedOutput.success,
          output: {
            stdout: parsedOutput.stdout || '',
            stderr: parsedOutput.stderr || '',
            exitCode: parsedOutput.exit_code || result.StatusCode
          },
          executionTime: Date.now(), // Would need to track this properly
          memoryUsage: 0 // Would need container stats for this
        };
      } catch (parseError) {
        logger.warn(`Failed to parse JSON output for ${language}:`, parseError.message);
        logger.warn('Raw output:', cleanOutput.slice(0, 500));
        
        // Fallback if JSON parsing fails
        return {
          success: result.StatusCode === 0,
          output: {
            stdout: stdoutOutput.trim(),
            stderr: stderrOutput.trim() || (result.StatusCode !== 0 ? `Exit code ${result.StatusCode}` : ''),
            exitCode: result.StatusCode
          },
          executionTime: Date.now(),
          memoryUsage: 0
        };
      }
    } catch (error) {
      logger.error(`Docker execution error for ${language}:`, error);

      return {
        success: false,
        output: {
          stdout: '',
          stderr: `Execution error: ${error.message}`,
          exitCode: 1
        },
        executionTime: 0,
        memoryUsage: 0
      };
    } finally {
      // Clean up container
      if (container) {
        try {
          await container.remove({ force: true });
        } catch (removeError) {
          logger.error('Error removing container:', removeError);
        }
      }
    }
  }

  parseMemory(memStr) {
    const units = {
      b: 1,
      k: 1024,
      m: 1024 * 1024,
      g: 1024 * 1024 * 1024
    };

    const match = memStr.toLowerCase().match(/^(\d+)([bkmg]?)$/);
    if (!match) return 64 * 1024 * 1024; // Default 64MB

    const [, amount, unit] = match;
    return parseInt(amount, 10) * (units[unit] || 1);
  }

  async cleanup() {
    try {
      // Remove any dangling containers
      const containers = await this.docker.listContainers({ all: true });
      const seekContainers = containers.filter((container) => container.Image.startsWith('seek-')
        && container.State === 'exited');

      await Promise.all(seekContainers.map(async (container) => {
        try {
          await this.docker.getContainer(container.Id).remove();
        } catch (error) {
          logger.error('Error cleaning up container:', error);
        }
      }));
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }

  async healthCheck() {
    try {
      const info = await this.docker.info();
      return {
        dockerRunning: true,
        containersRunning: info.ContainersRunning,
        images: Object.keys(this.imageBuilt).length,
        imagesBuilt: this.imageBuilt
      };
    } catch (error) {
      return {
        dockerRunning: false,
        error: error.message
      };
    }
  }
}

module.exports = new DockerExecutionService();
