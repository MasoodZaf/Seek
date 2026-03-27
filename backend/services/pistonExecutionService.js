/**
 * Piston Execution Service
 * Uses a self-hosted Piston instance for sandboxed code execution.
 * URL: PISTON_BASE_URL env var (default: http://seek-piston:2000 for Docker)
 * No rate limits, no external API dependency.
 */
const http = require('http');
const https = require('https');
const logger = require('../config/logger');

const PISTON_BASE_URL = process.env.PISTON_BASE_URL || 'http://seek-piston:2000';
const REQUEST_TIMEOUT_MS = 20000; // General HTTP timeout (health, packages, install)
const EXECUTION_TIMEOUT_MS = 20000; // Hard server-side cap on code execution calls

// ── Simple in-process circuit breaker ────────────────────────────────────────
// Prevents cascading failures when Piston is down or overloaded.
// States: closed (normal) → open (rejecting) → half-open (probe one request)
const CIRCUIT = {
  state: 'closed',   // 'closed' | 'open' | 'half-open'
  failures: 0,
  lastFailureAt: 0
};
const CB_THRESHOLD  = 5;           // consecutive failures before opening
const CB_RESET_MS   = 30 * 1000;   // 30 s cooldown before probing again

function cbAllow() {
  if (CIRCUIT.state === 'closed') return true;
  if (CIRCUIT.state === 'open') {
    if (Date.now() - CIRCUIT.lastFailureAt >= CB_RESET_MS) {
      CIRCUIT.state = 'half-open'; // allow one probe
      return true;
    }
    return false; // still cooling down — reject immediately
  }
  return true; // half-open: let one request through
}

function cbSuccess() {
  CIRCUIT.failures = 0;
  CIRCUIT.state = 'closed';
}

function cbFailure() {
  CIRCUIT.failures += 1;
  CIRCUIT.lastFailureAt = Date.now();
  if (CIRCUIT.failures >= CB_THRESHOLD) {
    if (CIRCUIT.state !== 'open') {
      logger.warn(`[Piston] Circuit breaker OPEN after ${CIRCUIT.failures} consecutive failures`);
    }
    CIRCUIT.state = 'open';
  }
}

// Maps internal language names → Piston runtime names as returned by /api/v2/runtimes
// Package 'node' installs as runtime 'javascript'; 'gcc' installs as 'c'/'c++'; 'mono' as 'csharp'
const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python:     { language: 'python',     version: '3.10.0' },
  java:       { language: 'java',       version: '15.0.2' },
  cpp:        { language: 'c++',        version: '10.2.0' },
  'c++':      { language: 'c++',        version: '10.2.0' },
  c:          { language: 'c',          version: '10.2.0' },
  go:         { language: 'go',         version: '1.16.2' },
  rust:       { language: 'rust',       version: '1.68.2' },
  csharp:     { language: 'csharp.net', version: '5.0.201' },
  php:        { language: 'php',        version: '8.2.3' },
  ruby:       { language: 'ruby',       version: '3.0.1' },
  kotlin:     { language: 'kotlin',     version: '1.8.20' },
  swift:      { language: 'swift',      version: '5.3.3' }
};

class PistonExecutionService {
  /**
   * Execute code via local Piston API.
   * Always resolves — errors are returned as {success:false, output:{stderr,...}}.
   */
  async executeCode(code, language, stdin = '') {
    const startTime = Date.now();

    // Circuit breaker — fail fast when Piston is known-down
    if (!cbAllow()) {
      logger.warn(`[Piston] Circuit is OPEN — rejecting execution request for ${language}`);
      return {
        success: false,
        output: {
          stdout: '',
          stderr: 'Code execution service is temporarily unavailable. Please try again in a moment.',
          exitCode: 1
        },
        executionTime: 0,
        memoryUsage: 0
      };
    }

    const lang = LANGUAGE_MAP[language.toLowerCase()];

    if (!lang) {
      return {
        success: false,
        output: { stdout: '', stderr: `Unsupported language: ${language}`, exitCode: 1 },
        executionTime: 0,
        memoryUsage: 0
      };
    }

    const payload = JSON.stringify({
      language: lang.language,
      version: lang.version,
      files: [{ content: code }],
      stdin: stdin || '',
      run_timeout: 15000,
      compile_timeout: 30000
    });

    try {
      // Server-side hard timeout — prevents 10 slow Piston calls from blocking all workers
      const executionTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('execution_timeout')), EXECUTION_TIMEOUT_MS)
      );
      const response = await Promise.race([
        this._post('/api/v2/execute', payload),
        executionTimeout
      ]);
      const executionTime = Date.now() - startTime;

      const run = response.run || {};
      const compile = response.compile;

      let stderr = run.stderr || '';
      if (compile && compile.code !== 0 && compile.stderr) {
        stderr = compile.stderr + (stderr ? '\n' + stderr : '');
      }

      const exitCode = run.code !== undefined ? run.code : (compile?.code ?? 0);

      cbSuccess(); // execution succeeded — close/reset circuit
      return {
        success: exitCode === 0 && !stderr,
        output: {
          stdout: run.stdout || '',
          stderr,
          exitCode
        },
        executionTime,
        memoryUsage: 0
      };
    } catch (error) {
      const isTimeout = error.message === 'execution_timeout' || error.message.includes('timed out');
      // Only count infrastructure failures toward circuit breaker, not timeouts from user code
      if (!isTimeout) cbFailure();
      logger.error(`Piston execution error for ${language} [${isTimeout ? 'TIMEOUT' : 'ERROR'}]:`, error.message);
      return {
        success: false,
        output: {
          stdout: '',
          stderr: isTimeout
            ? 'Time Limit Exceeded: execution took too long'
            : `Code execution unavailable: ${error.message}`,
          exitCode: isTimeout ? 124 : 1 // 124 = standard timeout exit code
        },
        executionTime: Date.now() - startTime,
        memoryUsage: 0
      };
    }
  }

  /** List installed packages */
  async getInstalledPackages() {
    try {
      const data = await this._get('/api/v2/packages');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  /** Install a language package — uses extended timeout since packages can be hundreds of MB */
  async installPackage(language, version) {
    const payload = JSON.stringify({ language, version });
    try {
      const result = await this._post('/api/v2/packages', payload, 300000); // 5 min timeout
      return result;
    } catch (error) {
      logger.error(`Piston install error for ${language}@${version}:`, error.message);
      throw error;
    }
  }

  /** Quick connectivity check */
  async healthCheck() {
    try {
      const data = await this._get('/api/v2/runtimes');
      return {
        available: Array.isArray(data),
        runtimeCount: Array.isArray(data) ? data.length : 0
      };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  _get(path) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, PISTON_BASE_URL);
      const lib = url.protocol === 'https:' ? https : http;

      const req = lib.get(url.toString(), (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Piston HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
            return;
          }
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
      });
      req.on('timeout', () => { req.destroy(); reject(new Error('Piston request timed out')); });
      req.on('error', reject);
      req.setTimeout(REQUEST_TIMEOUT_MS);
    });
  }

  _post(path, body, timeoutMs = REQUEST_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, PISTON_BASE_URL);
      const lib = url.protocol === 'https:' ? https : http;
      const bodyBuf = Buffer.from(body, 'utf8');

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': bodyBuf.length
        },
        timeout: timeoutMs
      };

      const req = lib.request(options, (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Piston HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
            return;
          }
          try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
        });
      });

      req.on('timeout', () => { req.destroy(); reject(new Error('Piston request timed out')); });
      req.on('error', reject);
      req.write(bodyBuf);
      req.end();
    });
  }
}

module.exports = new PistonExecutionService();
