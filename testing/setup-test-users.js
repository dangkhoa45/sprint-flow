const axios = require('axios');
const bcrypt = require('bcrypt');

const BASE_URL = 'http://localhost:8005/api';

// Test users data
const TEST_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin',
    status: 'active',
    email: 'admin@test.com'
  },
  {
    username: 'user1',
    password: 'user123',
    displayName: 'Test User 1',
    role: 'user',
    status: 'active',
    email: 'user1@test.com'
  },
  {
    username: 'user2',
    password: 'user123',
    displayName: 'Test User 2',
    role: 'user',
    status: 'active',
    email: 'user2@test.com'
  }
];

async function setupTestUsers() {
  console.log('🔧 Setting up test users...\n');
  
  for (const userData of TEST_USERS) {
    try {
      console.log(`Creating user: ${userData.username}`);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const response = await axios.post(`${BASE_URL}/users`, {
        ...userData,
        password: hashedPassword
      });
      
      console.log(`✅ User ${userData.username} created successfully (ID: ${response.data._id})\n`);
      
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  User ${userData.username} already exists\n`);
      } else {
        console.error(`❌ Failed to create user ${userData.username}:`, error.response?.data?.message || error.message);
      }
    }
  }
  
  console.log('🎉 Test users setup completed!\n');
  console.log('You can now run the tests with: npm test');
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupTestUsers().catch(console.error);
}

module.exports = { setupTestUsers, TEST_USERS }; 