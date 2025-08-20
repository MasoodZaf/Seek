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
      java: 'seek-java-runner',
      cpp: 'seek-cpp-runner',
      c: 'seek-c-runner'
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
            scriptName = 'execute.js';
            break;
          case 'java':
            scriptName = 'Execute.java';
            break;
        }

        const script = await fs.readFile(
          path.join(dockerDir, scriptName),
          'utf8'
        );
        tarStream.entry({ name: scriptName }, script);
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

      // Get execution stream
      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true
      });

      // Send code to container
      stream.write(code);
      stream.end();

      // Set execution timeout
      const timeout = setTimeout(async () => {
        try {
          await container.kill('SIGTERM');
          logger.warn(`Container killed due to timeout: ${language}`);
        } catch (error) {
          logger.error('Error killing timed out container:', error);
        }
      }, this.maxExecutionTime);

      // Wait for container to finish
      const result = await container.wait();
      clearTimeout(timeout);

      // Get container output
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        timestamps: false
      });

      // Parse output
      const output = logs.toString('utf8');

      try {
        // Try to parse as JSON (from our execution scripts)
        const parsedOutput = JSON.parse(output);
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
        // Fallback if JSON parsing fails
        return {
          success: result.StatusCode === 0,
          output: {
            stdout: output,
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
