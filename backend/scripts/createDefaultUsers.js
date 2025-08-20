const bcrypt = require('bcryptjs');
const { connectSQLite } = require('../config/sqlite');
const { User } = require('../models');
const logger = require('../config/logger');

const createDefaultUsers = async () => {
  try {
    // Connect to database
    await connectSQLite();

    // Check if users already exist
    const existingAdmin = await User.findOne({ where: { email: 'admin@seek.com' } });
    const existingTest = await User.findOne({ where: { email: 'test@seek.com' } });

    if (existingAdmin && existingTest) {
      logger.info('Default users already exist');
      return;
    }

    // Create admin user
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: 'admin@seek.com',
        password: 'admin123456', // Will be hashed by the model hook
        firstName: 'Admin',
        lastName: 'User',
        isEmailVerified: true,
        role: 'admin',
        preferences: {
          theme: 'dark',
          language: 'javascript',
          interfaceLanguage: 'en',
          notifications: {
            email: true,
            push: true
          }
        }
      });
      logger.info('✅ Admin user created: admin@seek.com / admin123456');
    }

    // Create test user
    if (!existingTest) {
      await User.create({
        username: 'testuser',
        email: 'test@seek.com',
        password: 'test123456', // Will be hashed by the model hook
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true,
        role: 'student',
        preferences: {
          theme: 'light',
          language: 'python',
          interfaceLanguage: 'en',
          notifications: {
            email: true,
            push: false
          }
        }
      });
      logger.info('✅ Test user created: test@seek.com / test123456');
    }

    logger.info('🎉 Default users setup complete!');

    // Only exit if called directly (not as module)
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error creating default users:', error);

    // Only exit if called directly (not as module)
    if (require.main === module) {
      process.exit(1);
    }

    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  createDefaultUsers();
}

module.exports = { createDefaultUsers };
