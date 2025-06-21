const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3001/api';
const WEB_BASE = 'http://localhost:3000';

class FrontendIntegrationTest {
  constructor() {
    this.testResults = [];
    this.authToken = null;
    this.testProject = null;
    this.testMilestone = null;
    this.testAttachment = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    this.testResults.push({ timestamp, type, message });
  }

  async testAuth() {
    this.log('Testing authentication...');
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username: 'testuser',
        password: 'testpass123'
      });
      
      this.authToken = response.data.accessToken;
      this.log('Authentication successful', 'success');
      return true;
    } catch (error) {
      this.log(`Authentication failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testProjectCreation() {
    this.log('Testing project creation...');
    try {
      const projectData = {
        name: 'Test Project for Frontend',
        description: 'Project to test frontend integration',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'InProgress',
        priority: 'Medium',
        progress: 25,
        estimatedHours: 40,
        actualHours: 10,
        actualCost: 5000000,
        tags: ['frontend', 'test', 'integration']
      };

      const response = await axios.post(`${API_BASE}/projects`, projectData, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.testProject = response.data;
      this.log(`Project created: ${this.testProject.name}`, 'success');
      return true;
    } catch (error) {
      this.log(`Project creation failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testMilestoneCreation() {
    this.log('Testing milestone creation...');
    try {
      const milestoneData = {
        title: 'Test Milestone',
        description: 'Milestone to test frontend integration',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        progress: 0,
        tags: ['milestone', 'test']
      };

      const response = await axios.post(`${API_BASE}/milestones/${this.testProject._id}`, milestoneData, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.testMilestone = response.data;
      this.log(`Milestone created: ${this.testMilestone.title}`, 'success');
      return true;
    } catch (error) {
      this.log(`Milestone creation failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testFileUpload() {
    this.log('Testing file upload...');
    try {
      // Create a test file
      const testFilePath = path.join(__dirname, 'test-file.txt');
      fs.writeFileSync(testFilePath, 'This is a test file for frontend integration testing.');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(testFilePath));
      formData.append('description', 'Test file for integration');
      formData.append('tags', 'test,file,integration');

      const response = await axios.post(`${API_BASE}/attachments/${this.testProject._id}/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      this.testAttachment = response.data;
      this.log(`File uploaded: ${this.testAttachment.originalName}`, 'success');

      // Clean up test file
      fs.unlinkSync(testFilePath);
      return true;
    } catch (error) {
      this.log(`File upload failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testProjectRetrieval() {
    this.log('Testing project retrieval with milestones and attachments...');
    try {
      const response = await axios.get(`${API_BASE}/projects/${this.testProject._id}`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      const project = response.data;
      this.log(`Project retrieved: ${project.name}`, 'success');
      this.log(`Project has ${project.milestones?.length || 0} milestones`, 'info');
      this.log(`Project has ${project.attachments?.length || 0} attachments`, 'info');
      return true;
    } catch (error) {
      this.log(`Project retrieval failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testMilestoneOperations() {
    this.log('Testing milestone operations...');
    try {
      // Update milestone
      const updateData = {
        status: 'InProgress',
        progress: 50
      };

      await axios.patch(`${API_BASE}/milestones/${this.testMilestone._id}`, updateData, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.log('Milestone updated successfully', 'success');

      // Get project milestones
      const response = await axios.get(`${API_BASE}/milestones/project/${this.testProject._id}`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.log(`Retrieved ${response.data.length} milestones for project`, 'success');
      return true;
    } catch (error) {
      this.log(`Milestone operations failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testAttachmentOperations() {
    this.log('Testing attachment operations...');
    try {
      // Get project attachments
      const response = await axios.get(`${API_BASE}/attachments/project/${this.testProject._id}`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      this.log(`Retrieved ${response.data.length} attachments for project`, 'success');

      // Test download
      const downloadResponse = await axios.get(`${API_BASE}/attachments/${this.testAttachment._id}/download`, {
        headers: { Authorization: `Bearer ${this.authToken}` },
        responseType: 'stream'
      });

      this.log('File download test successful', 'success');
      return true;
    } catch (error) {
      this.log(`Attachment operations failed: ${error.message}`, 'error');
      return false;
    }
  }

  async cleanup() {
    this.log('Cleaning up test data...');
    try {
      if (this.testAttachment) {
        await axios.delete(`${API_BASE}/attachments/${this.testAttachment._id}`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        this.log('Test attachment deleted', 'info');
      }

      if (this.testMilestone) {
        await axios.delete(`${API_BASE}/milestones/${this.testMilestone._id}`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        this.log('Test milestone deleted', 'info');
      }

      if (this.testProject) {
        await axios.delete(`${API_BASE}/projects/${this.testProject._id}`, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
        this.log('Test project deleted', 'info');
      }
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error');
    }
  }

  async runAllTests() {
    this.log('Starting Frontend Integration Tests...', 'info');
    this.log('=====================================', 'info');

    const tests = [
      { name: 'Authentication', fn: () => this.testAuth() },
      { name: 'Project Creation', fn: () => this.testProjectCreation() },
      { name: 'Milestone Creation', fn: () => this.testMilestoneCreation() },
      { name: 'File Upload', fn: () => this.testFileUpload() },
      { name: 'Project Retrieval', fn: () => this.testProjectRetrieval() },
      { name: 'Milestone Operations', fn: () => this.testMilestoneOperations() },
      { name: 'Attachment Operations', fn: () => this.testAttachmentOperations() },
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
      this.log(`Running test: ${test.name}`, 'info');
      const result = await test.fn();
      if (result) {
        passedTests++;
        this.log(`✓ ${test.name} passed`, 'success');
      } else {
        this.log(`✗ ${test.name} failed`, 'error');
      }
      this.log('---', 'info');
    }

    await this.cleanup();

    this.log('=====================================', 'info');
    this.log(`Test Results: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'success' : 'error');
    
    if (passedTests === totalTests) {
      this.log('🎉 All tests passed! Frontend integration is working correctly.', 'success');
    } else {
      this.log('❌ Some tests failed. Please check the errors above.', 'error');
    }

    // Save test results
    const resultsPath = path.join(__dirname, 'frontend-integration-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.testResults, null, 2));
    this.log(`Test results saved to: ${resultsPath}`, 'info');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new FrontendIntegrationTest();
  tester.runAllTests().catch(console.error);
}

module.exports = FrontendIntegrationTest; 