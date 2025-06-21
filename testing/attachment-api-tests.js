const testUtils = require('./test-setup');
const path = require('path');

class AttachmentAPITests {
  constructor() {
    this.testResults = [];
    this.adminToken = null;
    this.user1Token = null;
    this.testProjectId = null;
    this.testAttachmentId = null;
    this.testFilePath = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Attachment API Tests...\n');
    
    try {
      // Setup authentication
      await this.setupAuthentication();
      
      // Create test project first
      await this.createTestProject();
      
      // Create test file
      await this.createTestFile();
      
      // Run test suites
      await this.testAttachmentCRUD();
      await this.testAttachmentAccessControl();
      await this.testAttachmentSearchAndFilter();
      await this.testAttachmentPagination();
      await this.testFileValidation();
      
      // Cleanup
      await this.cleanup();
      
      // Print results
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      await this.cleanup();
    }
  }

  async setupAuthentication() {
    console.log('🔐 Setting up authentication...');
    
    this.adminToken = await testUtils.login('admin', 'admin123');
    this.user1Token = await testUtils.login('user1', 'user123');
    
    if (!this.adminToken || !this.user1Token) {
      throw new Error('Authentication setup failed');
    }
    
    console.log('✅ Authentication setup completed\n');
  }

  async createTestProject() {
    console.log('📋 Creating test project for attachment tests...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    try {
      const response = await adminClient.post('/projects', testUtils.TEST_PROJECTS.project1);
      this.testProjectId = response.data._id;
      console.log(`✅ Test project created with ID: ${this.testProjectId}\n`);
    } catch (error) {
      throw new Error(`Failed to create test project: ${error.response?.data?.message || error.message}`);
    }
  }

  async createTestFile() {
    console.log('📋 Creating test file for upload...');
    
    const testContent = 'This is a test file for API testing.\nIt contains some sample content.\n';
    this.testFilePath = await testUtils.createTestFile('test-document.txt', testContent);
    console.log(`✅ Test file created: ${this.testFilePath}\n`);
  }

  async testAttachmentCRUD() {
    console.log('📋 Testing Attachment CRUD Operations...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test upload file
    const uploadResult = await this.testUploadFile(adminClient);
    this.recordTest('Upload File', uploadResult);
    
    if (uploadResult.passed && uploadResult.data) {
      this.testAttachmentId = uploadResult.data._id;
      
      // Test get attachment by ID
      const getResult = await this.testGetAttachment(adminClient, this.testAttachmentId);
      this.recordTest('Get Attachment by ID', getResult);
      
      // Test get attachments list
      const listResult = await this.testGetAttachmentsList(adminClient);
      this.recordTest('Get Attachments List', listResult);
      
      // Test get project attachments
      const projectAttachmentsResult = await this.testGetProjectAttachments(adminClient);
      this.recordTest('Get Project Attachments', projectAttachmentsResult);
    }
    
    console.log('✅ Attachment CRUD tests completed\n');
  }

  async testUploadFile(client) {
    try {
      const formData = testUtils.createFormData(this.testFilePath, 'Test document upload', 'test,document');
      
      const response = await client.post(`/attachments/${this.testProjectId}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.adminToken}`
        }
      });
      
      return {
        passed: response.status === 201,
        message: 'File uploaded successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `File upload failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetAttachment(client, attachmentId) {
    try {
      const response = await client.get(`/attachments/${attachmentId}`);
      return {
        passed: response.status === 200 && response.data._id === attachmentId,
        message: 'Attachment retrieved successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get attachment failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetAttachmentsList(client) {
    try {
      const response = await client.get('/attachments');
      return {
        passed: response.status === 200 && Array.isArray(response.data.data),
        message: `Attachments list retrieved successfully (${response.data.data.length} attachments)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get attachments list failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetProjectAttachments(client) {
    try {
      const response = await client.get(`/attachments/project/${this.testProjectId}`);
      return {
        passed: response.status === 200 && Array.isArray(response.data),
        message: `Project attachments retrieved successfully (${response.data.length} attachments)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get project attachments failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testAttachmentAccessControl() {
    console.log('📋 Testing Attachment Access Control...');
    
    const user1Client = testUtils.createAuthenticatedClient(this.user1Token);
    
    if (this.testAttachmentId) {
      // Test access by non-member
      const accessResult = await this.testAttachmentAccessByNonMember(user1Client, this.testAttachmentId);
      this.recordTest('Attachment Access Control', accessResult);
    }
    
    console.log('✅ Attachment access control tests completed\n');
  }

  async testAttachmentAccessByNonMember(client, attachmentId) {
    try {
      await client.get(`/attachments/${attachmentId}`);
      return {
        passed: false,
        message: 'Non-member should not have access to attachment'
      };
    } catch (error) {
      const isForbidden = error.response?.status === 403;
      return {
        passed: isForbidden,
        message: isForbidden ? 'Access correctly denied to non-member' : `Unexpected error: ${error.response?.status}`
      };
    }
  }

  async testAttachmentSearchAndFilter() {
    console.log('📋 Testing Attachment Search and Filter...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test search
    const searchResult = await this.testAttachmentSearch(adminClient);
    this.recordTest('Attachment Search', searchResult);
    
    // Test type filter
    const filterResult = await this.testAttachmentTypeFilter(adminClient);
    this.recordTest('Attachment Type Filter', filterResult);
    
    console.log('✅ Attachment search and filter tests completed\n');
  }

  async testAttachmentSearch(client) {
    try {
      const response = await client.get('/attachments?search=test');
      return {
        passed: response.status === 200,
        message: `Search completed successfully (${response.data.data.length} results)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Attachment search failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testAttachmentTypeFilter(client) {
    try {
      const response = await client.get('/attachments?type=document');
      return {
        passed: response.status === 200,
        message: `Type filter completed successfully (${response.data.data.length} results)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Attachment type filter failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testAttachmentPagination() {
    console.log('📋 Testing Attachment Pagination...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    const paginationResult = await this.testAttachmentPagination(adminClient);
    this.recordTest('Attachment Pagination', paginationResult);
    
    console.log('✅ Attachment pagination tests completed\n');
  }

  async testAttachmentPagination(client) {
    try {
      const response = await client.get('/attachments?limit=5&offset=0');
      const hasPaginationData = response.data.hasOwnProperty('total') && 
                               response.data.hasOwnProperty('page') && 
                               response.data.hasOwnProperty('limit');
      
      return {
        passed: response.status === 200 && hasPaginationData,
        message: `Pagination working correctly (page ${response.data.page}, limit ${response.data.limit}, total ${response.data.total})`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Attachment pagination failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testFileValidation() {
    console.log('📋 Testing File Validation...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test invalid file type
    const invalidTypeResult = await this.testInvalidFileType(adminClient);
    this.recordTest('Invalid File Type Validation', invalidTypeResult);
    
    // Test file size limit (create a large file)
    const sizeLimitResult = await this.testFileSizeLimit(adminClient);
    this.recordTest('File Size Limit Validation', sizeLimitResult);
    
    console.log('✅ File validation tests completed\n');
  }

  async testInvalidFileType(adminClient) {
    try {
      // Create a file with invalid extension
      const invalidFilePath = await testUtils.createTestFile('test.exe', 'This is an executable file');
      
      const formData = testUtils.createFormData(invalidFilePath, 'Invalid file type', 'test');
      
      await adminClient.post(`/attachments/${this.testProjectId}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.adminToken}`
        }
      });
      
      // Cleanup
      await testUtils.cleanupTestFile(invalidFilePath);
      
      return {
        passed: false,
        message: 'Invalid file type should have been rejected'
      };
    } catch (error) {
      const isBadRequest = error.response?.status === 400;
      
      // Cleanup
      const invalidFilePath = path.join(__dirname, 'test.exe');
      await testUtils.cleanupTestFile(invalidFilePath);
      
      return {
        passed: isBadRequest,
        message: isBadRequest ? 'Invalid file type correctly rejected' : `Unexpected error: ${error.response?.status}`
      };
    }
  }

  async testFileSizeLimit(adminClient) {
    try {
      // Create a large file (11MB to exceed 10MB limit)
      const largeContent = 'A'.repeat(11 * 1024 * 1024); // 11MB
      const largeFilePath = await testUtils.createTestFile('large-file.txt', largeContent);
      
      const formData = testUtils.createFormData(largeFilePath, 'Large file test', 'test');
      
      await adminClient.post(`/attachments/${this.testProjectId}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.adminToken}`
        }
      });
      
      // Cleanup
      await testUtils.cleanupTestFile(largeFilePath);
      
      return {
        passed: false,
        message: 'Large file should have been rejected'
      };
    } catch (error) {
      const isBadRequest = error.response?.status === 400;
      
      // Cleanup
      const largeFilePath = path.join(__dirname, 'large-file.txt');
      await testUtils.cleanupTestFile(largeFilePath);
      
      return {
        passed: isBadRequest,
        message: isBadRequest ? 'Large file correctly rejected' : `Unexpected error: ${error.response?.status}`
      };
    }
  }

  async cleanup() {
    console.log('🧹 Cleaning up test files...');
    
    if (this.testFilePath) {
      await testUtils.cleanupTestFile(this.testFilePath);
    }
    
    // Cleanup any other test files
    const testFiles = ['test.exe', 'large-file.txt'];
    for (const file of testFiles) {
      const filePath = path.join(__dirname, file);
      await testUtils.cleanupTestFile(filePath);
    }
    
    console.log('✅ Cleanup completed\n');
  }

  recordTest(testName, result) {
    this.testResults.push({
      name: testName,
      ...result,
      timestamp: new Date().toISOString()
    });
  }

  printResults() {
    console.log('📊 Attachment Test Results Summary');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    const percentage = ((passed / total) * 100).toFixed(1);
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${total - passed}`);
    console.log(`Success Rate: ${percentage}%\n`);
    
    console.log('Detailed Results:');
    console.log('-'.repeat(50));
    
    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.name}: ${result.message}`);
    });
    
    console.log('\n' + '='.repeat(50));
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tests = new AttachmentAPITests();
  tests.runAllTests();
}

module.exports = AttachmentAPITests; 