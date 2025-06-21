const testUtils = require('./test-setup');

class ProjectAPITests {
  constructor() {
    this.testResults = [];
    this.adminToken = null;
    this.user1Token = null;
    this.user2Token = null;
    this.testProjectId = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Project API Tests...\n');
    
    try {
      // Setup authentication
      await this.setupAuthentication();
      
      // Run test suites
      await this.testAuthentication();
      await this.testProjectCRUD();
      await this.testProjectAccessControl();
      await this.testProjectSearchAndFilter();
      await this.testProjectPagination();
      
      // Print results
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
    }
  }

  async setupAuthentication() {
    console.log('🔐 Setting up authentication...');
    
    this.adminToken = await testUtils.login('admin', 'admin123');
    this.user1Token = await testUtils.login('user1', 'user123');
    this.user2Token = await testUtils.login('user2', 'user123');
    
    if (!this.adminToken || !this.user1Token || !this.user2Token) {
      throw new Error('Authentication setup failed');
    }
    
    console.log('✅ Authentication setup completed\n');
  }

  async testAuthentication() {
    console.log('📋 Testing Authentication...');
    
    // Test valid login
    const validLogin = await this.testValidLogin();
    this.recordTest('Valid Login', validLogin);
    
    // Test invalid login
    const invalidLogin = await this.testInvalidLogin();
    this.recordTest('Invalid Login', invalidLogin);
    
    console.log('✅ Authentication tests completed\n');
  }

  async testValidLogin() {
    try {
      const token = await testUtils.login('admin', 'admin123');
      return {
        passed: !!token,
        message: token ? 'Login successful' : 'Login failed'
      };
    } catch (error) {
      return {
        passed: false,
        message: `Login error: ${error.message}`
      };
    }
  }

  async testInvalidLogin() {
    try {
      const token = await testUtils.login('admin', 'wrongpassword');
      return {
        passed: !token,
        message: token ? 'Login should have failed' : 'Invalid login correctly rejected'
      };
    } catch (error) {
      return {
        passed: true,
        message: 'Invalid login correctly rejected'
      };
    }
  }

  async testProjectCRUD() {
    console.log('📋 Testing Project CRUD Operations...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test create project
    const createResult = await this.testCreateProject(adminClient);
    this.recordTest('Create Project', createResult);
    
    if (createResult.passed && createResult.data) {
      this.testProjectId = createResult.data._id;
      
      // Test get project by ID
      const getResult = await this.testGetProject(adminClient, this.testProjectId);
      this.recordTest('Get Project by ID', getResult);
      
      // Test update project
      const updateResult = await this.testUpdateProject(adminClient, this.testProjectId);
      this.recordTest('Update Project', updateResult);
      
      // Test get projects list
      const listResult = await this.testGetProjectsList(adminClient);
      this.recordTest('Get Projects List', listResult);
    }
    
    console.log('✅ Project CRUD tests completed\n');
  }

  async testCreateProject(client) {
    try {
      const response = await client.post('/projects', testUtils.TEST_PROJECTS.project1);
      return {
        passed: response.status === 201,
        message: 'Project created successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Create project failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetProject(client, projectId) {
    try {
      const response = await client.get(`/projects/${projectId}`);
      return {
        passed: response.status === 200 && response.data._id === projectId,
        message: 'Project retrieved successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get project failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testUpdateProject(client, projectId) {
    try {
      const updateData = {
        name: 'Updated Test Project',
        description: 'Updated description',
        progress: 50
      };
      
      const response = await client.patch(`/projects/${projectId}`, updateData);
      return {
        passed: response.status === 200 && response.data.name === updateData.name,
        message: 'Project updated successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Update project failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetProjectsList(client) {
    try {
      const response = await client.get('/projects');
      return {
        passed: response.status === 200 && Array.isArray(response.data.data),
        message: `Projects list retrieved successfully (${response.data.data.length} projects)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get projects list failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testProjectAccessControl() {
    console.log('📋 Testing Project Access Control...');
    
    const user1Client = testUtils.createAuthenticatedClient(this.user1Token);
    const user2Client = testUtils.createAuthenticatedClient(this.user2Token);
    
    if (this.testProjectId) {
      // Test access by non-member
      const accessResult = await this.testProjectAccessByNonMember(user2Client, this.testProjectId);
      this.recordTest('Project Access Control', accessResult);
    }
    
    console.log('✅ Project access control tests completed\n');
  }

  async testProjectAccessByNonMember(client, projectId) {
    try {
      await client.get(`/projects/${projectId}`);
      return {
        passed: false,
        message: 'Non-member should not have access to project'
      };
    } catch (error) {
      const isForbidden = error.response?.status === 403;
      return {
        passed: isForbidden,
        message: isForbidden ? 'Access correctly denied to non-member' : `Unexpected error: ${error.response?.status}`
      };
    }
  }

  async testProjectSearchAndFilter() {
    console.log('📋 Testing Project Search and Filter...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test search
    const searchResult = await this.testProjectSearch(adminClient);
    this.recordTest('Project Search', searchResult);
    
    // Test status filter
    const filterResult = await this.testProjectStatusFilter(adminClient);
    this.recordTest('Project Status Filter', filterResult);
    
    console.log('✅ Project search and filter tests completed\n');
  }

  async testProjectSearch(client) {
    try {
      const response = await client.get('/projects?search=Test');
      return {
        passed: response.status === 200,
        message: `Search completed successfully (${response.data.data.length} results)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Project search failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testProjectStatusFilter(client) {
    try {
      const response = await client.get('/projects?status=Planning');
      return {
        passed: response.status === 200,
        message: `Status filter completed successfully (${response.data.data.length} results)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Project status filter failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testProjectPagination() {
    console.log('📋 Testing Project Pagination...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    const paginationResult = await this.testProjectPagination(adminClient);
    this.recordTest('Project Pagination', paginationResult);
    
    console.log('✅ Project pagination tests completed\n');
  }

  async testProjectPagination(client) {
    try {
      const response = await client.get('/projects?limit=5&offset=0');
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
        message: `Project pagination failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  recordTest(testName, result) {
    this.testResults.push({
      name: testName,
      ...result,
      timestamp: new Date().toISOString()
    });
  }

  printResults() {
    console.log('📊 Test Results Summary');
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
  const tests = new ProjectAPITests();
  tests.runAllTests();
}

module.exports = ProjectAPITests; 