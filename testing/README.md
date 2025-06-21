# SprintFlow Project Management API Testing

This directory contains comprehensive test suites for the SprintFlow Project Management API.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running
- SprintFlow server running on `http://localhost:8005`

### Installation
```bash
cd testing
npm install
```

### Setup Test Users
```bash
npm run setup
```

### Run All Tests
```bash
npm test
```

## 📋 Test Suites

### 1. Project API Tests (`test:projects`)
Tests for project management functionality:
- ✅ Create, Read, Update, Delete projects
- ✅ Project member management
- ✅ Project search and filtering
- ✅ Access control and permissions
- ✅ Pagination

### 2. Milestone API Tests (`test:milestones`)
Tests for milestone management functionality:
- ✅ Create, Read, Update, Delete milestones
- ✅ Milestone progress tracking
- ✅ Due date management
- ✅ Assignment to team members
- ✅ Search and filtering

### 3. Attachment API Tests (`test:attachments`)
Tests for file attachment functionality:
- ✅ File upload and download
- ✅ File type validation
- ✅ File size limits
- ✅ File metadata management
- ✅ Access control

## 🧪 Test Coverage

### Authentication Tests
- ✅ Valid login
- ✅ Invalid login rejection
- ✅ Token validation

### CRUD Operations
- ✅ Create operations
- ✅ Read operations
- ✅ Update operations
- ✅ Delete operations

### Access Control
- ✅ Owner permissions
- ✅ Member permissions
- ✅ Non-member access denial

### Search & Filter
- ✅ Text search
- ✅ Status filtering
- ✅ Date range filtering
- ✅ Type filtering

### Pagination
- ✅ Limit and offset
- ✅ Total count
- ✅ Page calculation

### File Validation
- ✅ File type validation
- ✅ File size limits
- ✅ MIME type checking

## 📊 Expected Results

After proper setup, tests should achieve:

- **Authentication:** 100% pass rate
- **Project CRUD:** 100% pass rate
- **Milestone Management:** 100% pass rate
- **File Attachments:** 100% pass rate
- **Access Control:** 100% pass rate
- **Search & Filter:** 100% pass rate
- **Pagination:** 100% pass rate

## 🔧 Troubleshooting

### Authentication Issues
If you see "401 Unauthorized" errors:
1. Run `npm run setup` to create test users
2. Verify server is running on port 8005
3. Check MongoDB connection

### File Upload Issues
If file upload tests fail:
1. Verify uploads directory exists: `apps/server/uploads/attachments`
2. Check file permissions
3. Ensure server has write access

### Database Issues
If database operations fail:
1. Verify MongoDB is running
2. Check connection string in server config
3. Ensure database exists and is accessible

## 📁 File Structure

```
testing/
├── README.md                 # This file
├── package.json             # Dependencies and scripts
├── test-setup.js            # Test utilities and configuration
├── setup-test-users.js      # Database setup script
├── run-all-tests.js         # Main test runner
├── project-api-tests.js     # Project API test suite
├── milestone-api-tests.js   # Milestone API test suite
├── attachment-api-tests.js  # Attachment API test suite
├── project-management-api-tests.md  # Test documentation
└── test-results.md          # Test results and analysis
```

## 🎯 Test Data

### Test Users
- **admin** / admin123 (Admin role)
- **user1** / user123 (User role)
- **user2** / user123 (User role)

### Test Projects
- Test Project 1 (Planning status)
- Test Project 2 (InProgress status)

### Test Milestones
- Project Setup (Pending)
- Development Phase (InProgress)

## 📈 Performance Benchmarks

- Project creation: < 500ms
- Project listing (100 items): < 1s
- File upload (1MB): < 2s
- Search operations: < 300ms
- Pagination: < 200ms

## 🔒 Security Testing

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Project ownership validation
- ✅ File type validation
- ✅ File size limits
- ✅ Input validation

## 📝 API Endpoints Tested

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Get project
- `PATCH /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/members/{memberId}` - Add member
- `DELETE /api/projects/{id}/members/{memberId}` - Remove member

### Milestones
- `POST /api/milestones/{projectId}` - Create milestone
- `GET /api/milestones` - List milestones
- `GET /api/milestones/{id}` - Get milestone
- `PATCH /api/milestones/{id}` - Update milestone
- `DELETE /api/milestones/{id}` - Delete milestone
- `GET /api/milestones/project/{projectId}` - Get project milestones

### Attachments
- `POST /api/attachments/{projectId}/upload` - Upload file
- `GET /api/attachments` - List attachments
- `GET /api/attachments/{id}` - Get attachment
- `DELETE /api/attachments/{id}` - Delete attachment
- `GET /api/attachments/project/{projectId}` - Get project attachments

## 🚀 Production Readiness

The API has been verified as **production-ready** with:
- ✅ Complete CRUD operations
- ✅ Comprehensive access control
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ File upload security
- ✅ Search and pagination
- ✅ RESTful API design
- ✅ Swagger documentation

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for detailed error information
3. Verify all prerequisites are met
4. Ensure database and server are properly configured 