/**
 * Piston Package Setup
 * Installs required language runtimes in the self-hosted Piston instance.
 * Runs at backend startup — skips packages already installed.
 * Runs in the background (non-blocking) so server starts immediately.
 */
const pistonExecutionService = require('../services/pistonExecutionService');
const logger = require('../config/logger');

// Package names as returned by Piston's /api/v2/packages endpoint.
// 'gcc' provides both 'c' and 'c++' runtimes after installation.
// 'node' provides the 'node'/'javascript' runtime.
// 'mono' provides the 'mono'/'csharp' runtime.
const REQUIRED_PACKAGES = [
  { language: 'python',     version: '3.10.0' },
  { language: 'node',       version: '18.15.0' },
  { language: 'typescript', version: '5.0.3' },
  { language: 'java',       version: '15.0.2' },
  { language: 'gcc',        version: '10.2.0' },
  { language: 'go',         version: '1.16.2' },
  { language: 'rust',       version: '1.68.2' },
  { language: 'dotnet',     version: '5.0.201' },
  { language: 'php',        version: '8.2.3' },
  { language: 'ruby',       version: '3.0.1' },
  { language: 'kotlin',     version: '1.8.20' },
  { language: 'swift',      version: '5.3.3' }
];

async function waitForPiston(maxWaitMs = 60000) {
  const interval = 3000;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const health = await pistonExecutionService.healthCheck();
    if (health.available) return true;
    await new Promise(r => setTimeout(r, interval));
  }
  return false;
}

async function setupPistonPackages() {
  try {
    logger.info('🔧 Waiting for Piston service to be ready...');
    const ready = await waitForPiston(120000);
    if (!ready) {
      logger.warn('⚠️  Piston service did not become ready in time — code execution may be unavailable');
      return;
    }

    logger.info('📦 Setting up Piston language packages...');
    // Use runtimes (installed) endpoint to check what's already available
    const runtimes = await pistonExecutionService.healthCheck();
    const runtimesList = await pistonExecutionService._get('/api/v2/runtimes').catch(() => []);
    const installedSet = new Set(runtimesList.map(r => `${r.language}@${r.version}`));
    // Also check by language name only for things installed under different names (gcc → c, c++)
    const installedLangs = new Set(runtimesList.map(r => r.language));

    let installCount = 0;
    for (const pkg of REQUIRED_PACKAGES) {
      const key = `${pkg.language}@${pkg.version}`;
      // Skip if this exact version is installed OR if a runtime provided by this package already exists
      // e.g., if gcc is installed it provides 'c' and 'c++' runtimes
      const pkgAlreadyInstalledByKey = installedSet.has(key);
      // For node package: check if 'node' runtime exists
      // For gcc package: check if 'c' runtime exists (gcc installs both c and c++)
      const providedRuntime = pkg.language === 'gcc' ? installedLangs.has('c') : installedLangs.has(pkg.language);
      if (pkgAlreadyInstalledByKey || providedRuntime) {
        logger.info(`  ✅ Already installed: ${key}`);
        continue;
      }
      try {
        logger.info(`  📥 Installing ${key}...`);
        await pistonExecutionService.installPackage(pkg.language, pkg.version);
        logger.info(`  ✅ Installed: ${key}`);
        installCount++;
      } catch (err) {
        logger.warn(`  ⚠️  Failed to install ${key}: ${err.message}`);
      }
    }

    if (installCount > 0) {
      logger.info(`✅ Piston setup complete — installed ${installCount} new packages`);
    } else {
      logger.info('✅ Piston packages already up to date');
    }
  } catch (error) {
    logger.warn('⚠️  Piston setup failed (non-fatal):', error.message);
  }
}

module.exports = { setupPistonPackages };
