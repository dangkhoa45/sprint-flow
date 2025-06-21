const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:8005/api';
const TEST_USERS = {
  admin: { username: 'admin', password: 'admin123' },
  user1: { username: 'user1', password: 'user123' },
  user2: { username: 'user2', password: 'user123' }
};

// Test data
const TEST_PROJECTS = {
  project1: {
    name: 'Test Project 1',
    description: 'A test project for API testing',
    status: 'Planning',
    priority: 'Medium',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    estimatedHours: 100,
    tags: ['test', 'api']
  },
  project2: {
    name: 'Test Project 2',
    description: 'Another test project',
    status: 'InProgress',
    priority: 'High',
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    estimatedHours: 200,
    tags: ['development', 'testing']
  }
};

const TEST_MILESTONES = {
  milestone1: {
    title: 'Project Setup',
    description: 'Complete project initialization',
    dueDate: '2024-03-01',
    status: 'Pending',
    progress: 0,
    tags: ['setup', 'initialization']
  },
  milestone2: {
    title: 'Development Phase',
    description: 'Core development work',
    dueDate: '2024-06-01',
    status: 'InProgress',
    progress: 25,
    tags: ['development', 'core']
  }
};

// Helper functions
async function login(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

async function createTestFile(filename, content) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

async function cleanupTestFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Test utilities
const testUtils = {
  BASE_URL,
  TEST_USERS,
  TEST_PROJECTS,
  TEST_MILESTONES,
  login,
  createTestFile,
  cleanupTestFile,
  
  // Create axios instance with auth
  createAuthenticatedClient: (token) => {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  // Create form data for file upload
  createFormData: (filePath, description, tags) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    if (description) form.append('description', description);
    if (tags) form.append('tags', tags);
    return form;
  },
  
  // Wait for async operations
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate random string
  randomString: (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
  }
};

module.exports = testUtils; 