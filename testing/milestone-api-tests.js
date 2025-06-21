const testUtils = require('./test-setup');

class MilestoneAPITests {
  constructor() {
    this.testResults = [];
    this.adminToken = null;
    this.user1Token = null;
    this.testProjectId = null;
    this.testMilestoneId = null;
  }

  async runAllTests() {
    console.log('🚀 Starting Milestone API Tests...\n');
    
    try {
      // Setup authentication
      await this.setupAuthentication();
      
      // Create test project first
      await this.createTestProject();
      
      // Run test suites
      await this.testMilestoneCRUD();
      await this.testMilestoneAccessControl();
      await this.testMilestoneSearchAndFilter();
      await this.testMilestonePagination();
      
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
    
    if (!this.adminToken || !this.user1Token) {
      throw new Error('Authentication setup failed');
    }
    
    console.log('✅ Authentication setup completed\n');
  }

  async createTestProject() {
    console.log('📋 Creating test project for milestone tests...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    try {
      const response = await adminClient.post('/projects', testUtils.TEST_PROJECTS.project1);
      this.testProjectId = response.data._id;
      console.log(`✅ Test project created with ID: ${this.testProjectId}\n`);
    } catch (error) {
      throw new Error(`Failed to create test project: ${error.response?.data?.message || error.message}`);
    }
  }

  async testMilestoneCRUD() {
    console.log('📋 Testing Milestone CRUD Operations...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test create milestone
    const createResult = await this.testCreateMilestone(adminClient);
    this.recordTest('Create Milestone', createResult);
    
    if (createResult.passed && createResult.data) {
      this.testMilestoneId = createResult.data._id;
      
      // Test get milestone by ID
      const getResult = await this.testGetMilestone(adminClient, this.testMilestoneId);
      this.recordTest('Get Milestone by ID', getResult);
      
      // Test update milestone
      const updateResult = await this.testUpdateMilestone(adminClient, this.testMilestoneId);
      this.recordTest('Update Milestone', updateResult);
      
      // Test get milestones list
      const listResult = await this.testGetMilestonesList(adminClient);
      this.recordTest('Get Milestones List', listResult);
      
      // Test get project milestones
      const projectMilestonesResult = await this.testGetProjectMilestones(adminClient);
      this.recordTest('Get Project Milestones', projectMilestonesResult);
    }
    
    console.log('✅ Milestone CRUD tests completed\n');
  }

  async testCreateMilestone(client) {
    try {
      const response = await client.post(`/milestones/${this.testProjectId}`, testUtils.TEST_MILESTONES.milestone1);
      return {
        passed: response.status === 201,
        message: 'Milestone created successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Create milestone failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetMilestone(client, milestoneId) {
    try {
      const response = await client.get(`/milestones/${milestoneId}`);
      return {
        passed: response.status === 200 && response.data._id === milestoneId,
        message: 'Milestone retrieved successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get milestone failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testUpdateMilestone(client, milestoneId) {
    try {
      const updateData = {
        title: 'Updated Milestone',
        description: 'Updated milestone description',
        progress: 75,
        status: 'InProgress'
      };
      
      const response = await client.patch(`/milestones/${milestoneId}`, updateData);
      return {
        passed: response.status === 200 && response.data.title === updateData.title,
        message: 'Milestone updated successfully',
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Update milestone failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetMilestonesList(client) {
    try {
      const response = await client.get('/milestones');
      return {
        passed: response.status === 200 && Array.isArray(response.data.data),
        message: `Milestones list retrieved successfully (${response.data.data.length} milestones)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get milestones list failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testGetProjectMilestones(client) {
    try {
      const response = await client.get(`/milestones/project/${this.testProjectId}`);
      return {
        passed: response.status === 200 && Array.isArray(response.data),
        message: `Project milestones retrieved successfully (${response.data.length} milestones)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Get project milestones failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testMilestoneAccessControl() {
    console.log('📋 Testing Milestone Access Control...');
    
    const user1Client = testUtils.createAuthenticatedClient(this.user1Token);
    
    if (this.testMilestoneId) {
      // Test access by non-member
      const accessResult = await this.testMilestoneAccessByNonMember(user1Client, this.testMilestoneId);
      this.recordTest('Milestone Access Control', accessResult);
    }
    
    console.log('✅ Milestone access control tests completed\n');
  }

  async testMilestoneAccessByNonMember(client, milestoneId) {
    try {
      await client.get(`/milestones/${milestoneId}`);
      return {
        passed: false,
        message: 'Non-member should not have access to milestone'
      };
    } catch (error) {
      const isForbidden = error.response?.status === 403;
      return {
        passed: isForbidden,
        message: isForbidden ? 'Access correctly denied to non-member' : `Unexpected error: ${error.response?.status}`
      };
    }
  }

  async testMilestoneSearchAndFilter() {
    console.log('📋 Testing Milestone Search and Filter...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    // Test search
    const searchResult = await this.testMilestoneSearch(adminClient);
    this.recordTest('Milestone Search', searchResult);
    
    // Test status filter
    const filterResult = await this.testMilestoneStatusFilter(adminClient);
    this.recordTest('Milestone Status Filter', filterResult);
    
    console.log('✅ Milestone search and filter tests completed\n');
  }

  async testMilestoneSearch(client) {
    try {
      const response = await client.get('/milestones?search=Setup');
      return {
        passed: response.status === 200,
        message: `Search completed successfully (${response.data.data.length} results)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Milestone search failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testMilestoneStatusFilter(client) {
    try {
      const response = await client.get('/milestones?status=Pending');
      return {
        passed: response.status === 200,
        message: `Status filter completed successfully (${response.data.data.length} results)`,
        data: response.data
      };
    } catch (error) {
      return {
        passed: false,
        message: `Milestone status filter failed: ${error.response?.data?.message || error.message}`
      };
    }
  }

  async testMilestonePagination() {
    console.log('📋 Testing Milestone Pagination...');
    
    const adminClient = testUtils.createAuthenticatedClient(this.adminToken);
    
    const paginationResult = await this.testMilestonePagination(adminClient);
    this.recordTest('Milestone Pagination', paginationResult);
    
    console.log('✅ Milestone pagination tests completed\n');
  }

  async testMilestonePagination(client) {
    try {
      const response = await client.get('/milestones?limit=10&offset=0');
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
        message: `Milestone pagination failed: ${error.response?.data?.message || error.message}`
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
    console.log('📊 Milestone Test Results Summary');
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
  const tests = new MilestoneAPITests();
  tests.runAllTests();
}

module.exports = MilestoneAPITests; 