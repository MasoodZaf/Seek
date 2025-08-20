// Demo mode storage for users
const demoUsers = new Map();
const demoMode = !process.env.MONGODB_URI;

const createDemoUserData = (userData) => ({
  id: Date.now().toString(),
  username: userData.username,
  email: userData.email,
  firstName: userData.firstName || '',
  lastName: userData.lastName || '',
  createdAt: new Date(),
  lastLoginAt: new Date(),
  refreshTokens: []
});

module.exports = {
  demoUsers,
  demoMode,
  createDemoUserData
};
