const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);

  try {
    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true });

    logger.info('Starting MongoDB backup...');

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    // Execute mongodump
    const command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;

    await new Promise((resolve, reject) => {
      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          logger.error('Backup failed:', { error: error.message, stderr });
          reject(error);
          return;
        }

        logger.info('Backup completed successfully', {
          backupPath,
          output: stdout
        });
        resolve();
      });
    });

    // Clean up old backups (keep last 7 days)
    await cleanOldBackups(backupDir, 7);

    console.log(`✅ Backup completed successfully: ${backupPath}`);
    return backupPath;
  } catch (error) {
    logger.error('Database backup failed:', error);
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

async function cleanOldBackups(backupDir, daysToKeep) {
  try {
    const files = await fs.readdir(backupDir);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > maxAge) {
        await fs.rm(filePath, { recursive: true, force: true });
        logger.info(`Deleted old backup: ${file}`);
      }
    }
  } catch (error) {
    logger.warn('Failed to clean old backups:', error);
  }
}

// Run backup if called directly
if (require.main === module) {
  require('dotenv').config();
  backupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { backupDatabase, cleanOldBackups };
