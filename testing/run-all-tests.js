const ProjectAPITests = require('./project-api-tests');
const MilestoneAPITests = require('./milestone-api-tests');
const AttachmentAPITests = require('./attachment-api-tests');

class AllTestsRunner {
  constructor() {
    this.allResults = [];
    this.startTime = null;
    this.endTime = null;
  }

  async runAllTests() {
    console.log('🚀 Starting All Project Management API Tests');
    console.log('='.repeat(60));
    console.log(`Test started at: ${new Date().toLocaleString()}\n`);
    
    this.startTime = Date.now();
    
    try {
      // Run Project API Tests
      console.log('📋 RUNNING PROJECT API TESTS');
      console.log('-'.repeat(40));
      const projectTests = new ProjectAPITests();
      await projectTests.runAllTests();
      this.allResults.push({
        suite: 'Project API',
        results: projectTests.testResults
      });
      
      console.log('\n' + '='.repeat(60) + '\n');
      
      // Run Milestone API Tests
      console.log('📋 RUNNING MILESTONE API TESTS');
      console.log('-'.repeat(40));
      const milestoneTests = new MilestoneAPITests();
      await milestoneTests.runAllTests();
      this.allResults.push({
        suite: 'Milestone API',
        results: milestoneTests.testResults
      });
      
      console.log('\n' + '='.repeat(60) + '\n');
      
      // Run Attachment API Tests
      console.log('📋 RUNNING ATTACHMENT API TESTS');
      console.log('-'.repeat(40));
      const attachmentTests = new AttachmentAPITests();
      await attachmentTests.runAllTests();
      this.allResults.push({
        suite: 'Attachment API',
        results: attachmentTests.testResults
      });
      
      this.endTime = Date.now();
      
      // Print comprehensive results
      this.printComprehensiveResults();
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      this.endTime = Date.now();
      this.printComprehensiveResults();
    }
  }

  printComprehensiveResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    
    const duration = this.endTime - this.startTime;
    console.log(`Total Execution Time: ${duration}ms (${(duration / 1000).toFixed(2)}s)\n`);
    
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    
    // Summary by test suite
    console.log('📋 RESULTS BY TEST SUITE:');
    console.log('-'.repeat(40));
    
    this.allResults.forEach(suite => {
      const passed = suite.results.filter(r => r.passed).length;
      const total = suite.results.length;
      const percentage = ((passed / total) * 100).toFixed(1);
      
      totalTests += total;
      totalPassed += passed;
      totalFailed += (total - passed);
      
      const status = passed === total ? '✅' : '⚠️';
      console.log(`${status} ${suite.suite}: ${passed}/${total} passed (${percentage}%)`);
    });
    
    console.log('\n📊 OVERALL SUMMARY:');
    console.log('-'.repeat(40));
    const overallPercentage = ((totalPassed / totalTests) * 100).toFixed(1);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${overallPercentage}%`);
    
    // Detailed results
    console.log('\n📋 DETAILED RESULTS:');
    console.log('-'.repeat(40));
    
    this.allResults.forEach(suite => {
      console.log(`\n🔹 ${suite.suite}:`);
      suite.results.forEach((result, index) => {
        const status = result.passed ? '✅' : '❌';
        console.log(`  ${index + 1}. ${status} ${result.name}: ${result.message}`);
      });
    });
    
    // Performance summary
    console.log('\n⚡ PERFORMANCE SUMMARY:');
    console.log('-'.repeat(40));
    console.log(`Average test time: ${(duration / totalTests).toFixed(2)}ms per test`);
    console.log(`Tests per second: ${(totalTests / (duration / 1000)).toFixed(2)}`);
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('-'.repeat(40));
    
    if (totalFailed === 0) {
      console.log('✅ All tests passed! The API is working correctly.');
      console.log('✅ Ready for production deployment.');
    } else {
      console.log('⚠️  Some tests failed. Please review the failed tests above.');
      console.log('🔧 Check server logs for detailed error information.');
      console.log('🔧 Verify database connectivity and schema.');
      console.log('🔧 Ensure all required services are running.');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`Test completed at: ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  const runner = new AllTestsRunner();
  runner.runAllTests();
}

module.exports = AllTestsRunner; 