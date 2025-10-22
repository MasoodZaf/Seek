const Docker = require('dockerode');
const tar = require('tar-stream');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

class DockerExecutionService {
  constructor() {
    this.docker = new Docker();
    this.maxExecutionTime = parseInt(process.env.CODE_EXECUTION_TIMEOUT) || 5000;
    this.maxMemory = '64m'; // 64MB memory limit
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

    for (const [language, imageName] of Object.entries(this.images)) {
      try {
        // Check if image already exists
        try {
          await this.docker.getImage(imageName).inspect();
          this.imageBuilt[language] = true;
          logger.info(`Docker image ${imageName} already exists`);
          continue;
        } catch (error) {
          // Image doesn't exist, build it
        }

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

        // Build the image
        const buildStream = await this.docker.buildImage(tarStream, {
          t: imageName,
          rm: true,
          forcerm: true
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
    if (!this.imageBuilt[language]) {
      throw new Error(`Docker image not available for ${language}`);
    }

    const imageName = this.images[language];
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
          Memory: this.parseMemory(this.maxMemory),
          MemorySwap: this.parseMemory(this.maxMemory), // Same as memory to disable swap
          CpuQuota: Math.floor(this.maxCpus * 100000),
          CpuPeriod: 100000,
          PidsLimit: 50,
          ReadonlyRootfs: false,
          CapDrop: ['ALL'],
          CapAdd: ['SETUID', 'SETGID'], // Minimal caps needed
          SecurityOpt: ['no-new-privileges:true']
        },
        WorkingDir: '/app',
        User: 'coderunner'
      });

      // Start container
      await container.start();

      // Get execution stream with simpler approach
      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true
      });

      // Send code to container
      logger.info(`Sending code to ${language} container: ${code.slice(0, 100)}...`);
      
      // Write code to stdin
      const codeBuffer = Buffer.from(code, 'utf8');
      stream.write(codeBuffer);
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

      // Parse Docker logs - they use a special format with 8-byte headers for each line
      // Docker log format: [STREAM_TYPE][RESERVED][SIZE] followed by data
      let cleanOutput = '';
      let offset = 0;
      
      while (offset < logs.length) {
        if (offset + 8 > logs.length) {
          // Not enough bytes for a header, treat as raw data
          cleanOutput += logs.slice(offset).toString('utf8');
          break;
        }
        
        // Read the header
        const streamType = logs[offset]; // 1=stdout, 2=stderr
        const size = logs.readUInt32BE(offset + 4); // Big-endian 32-bit size
        
        if (size === 0 || offset + 8 + size > logs.length) {
          // Invalid header or not enough data, treat as raw
          cleanOutput += logs.slice(offset).toString('utf8');
          break;
        }
        
        // Extract the data
        const data = logs.slice(offset + 8, offset + 8 + size).toString('utf8');
        cleanOutput += data;
        
        // Move to next chunk
        offset += 8 + size;
      }
      
      cleanOutput = cleanOutput.trim();

      logger.info(`Raw Docker logs length: ${logs.length}, Clean output length: ${cleanOutput.length}`);
      logger.info(`Clean output preview: ${cleanOutput.slice(0, 200)}`);
      
      try {
        // Try to parse as JSON (from our execution scripts)
        const parsedOutput = JSON.parse(cleanOutput);
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
            stdout: cleanOutput,
            stderr: result.StatusCode !== 0 ? 'Non-zero exit code' : '',
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
