const { connectSQLite } = require('../config/sqlite');
const { User } = require('../models');
const logger = require('../config/logger');

const fixAdminUser = async () => {
  try {
    // Connect to database
    await connectSQLite();

    // Delete existing admin user
    await User.destroy({ where: { email: 'admin@seek.com' } });
    logger.info('🗑️ Deleted existing admin user');

    // Create new admin user with correct password
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

    logger.info('✅ Admin user recreated: admin@seek.com / admin123456');
    process.exit(0);
  } catch (error) {
    logger.error('Error fixing admin user:', error);
    process.exit(1);
  }
};

fixAdminUser();
