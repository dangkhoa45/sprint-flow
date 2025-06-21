# Project Management API Tests

## Overview
This document contains test cases for the Project Management feature APIs including:
- Project CRUD operations
- Milestone management
- File attachments
- Member management

## Test Environment
- Base URL: `http://localhost:8005/api`
- Authentication: Bearer Token
- Database: MongoDB (test environment)

## Test Data Setup

### Test Users
```json
{
  "admin": {
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  },
  "user1": {
    "username": "user1", 
    "password": "user123",
    "role": "user"
  },
  "user2": {
    "username": "user2",
    "password": "user123", 
    "role": "user"
  }
}
```

### Test Projects
```json
{
  "project1": {
    "name": "Test Project 1",
    "description": "A test project for API testing",
    "status": "Planning",
    "priority": "Medium",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "estimatedHours": 100,
    "tags": ["test", "api"]
  },
  "project2": {
    "name": "Test Project 2", 
    "description": "Another test project",
    "status": "InProgress",
    "priority": "High",
    "startDate": "2024-02-01",
    "endDate": "2024-11-30",
    "estimatedHours": 200,
    "tags": ["development", "testing"]
  }
}
```

### Test Milestones
```json
{
  "milestone1": {
    "title": "Project Setup",
    "description": "Complete project initialization",
    "dueDate": "2024-03-01",
    "status": "Pending",
    "progress": 0,
    "tags": ["setup", "initialization"]
  },
  "milestone2": {
    "title": "Development Phase",
    "description": "Core development work",
    "dueDate": "2024-06-01", 
    "status": "InProgress",
    "progress": 25,
    "tags": ["development", "core"]
  }
}
```

## Test Cases

### 1. Authentication Tests

#### 1.1 Login Test
- **Endpoint**: `POST /auth/login`
- **Description**: Test user authentication
- **Expected**: 200 OK with access token

#### 1.2 Invalid Login Test  
- **Endpoint**: `POST /auth/login`
- **Description**: Test invalid credentials
- **Expected**: 401 Unauthorized

### 2. Project Management Tests

#### 2.1 Create Project Test
- **Endpoint**: `POST /projects`
- **Description**: Create a new project
- **Expected**: 201 Created with project data

#### 2.2 Get Projects List Test
- **Endpoint**: `GET /projects`
- **Description**: Get paginated list of projects
- **Expected**: 200 OK with projects array

#### 2.3 Get Project by ID Test
- **Endpoint**: `GET /projects/{id}`
- **Description**: Get specific project details
- **Expected**: 200 OK with project data

#### 2.4 Update Project Test
- **Endpoint**: `PATCH /projects/{id}`
- **Description**: Update project information
- **Expected**: 200 OK with updated project

#### 2.5 Delete Project Test
- **Endpoint**: `DELETE /projects/{id}`
- **Description**: Soft delete project
- **Expected**: 200 OK with success message

#### 2.6 Project Access Control Test
- **Endpoint**: `GET /projects/{id}`
- **Description**: Test access control for non-member
- **Expected**: 403 Forbidden

### 3. Milestone Management Tests

#### 3.1 Create Milestone Test
- **Endpoint**: `POST /milestones/{projectId}`
- **Description**: Create milestone for project
- **Expected**: 201 Created with milestone data

#### 3.2 Get Milestones List Test
- **Endpoint**: `GET /milestones`
- **Description**: Get paginated list of milestones
- **Expected**: 200 OK with milestones array

#### 3.3 Get Milestone by ID Test
- **Endpoint**: `GET /milestones/{id}`
- **Description**: Get specific milestone details
- **Expected**: 200 OK with milestone data

#### 3.4 Update Milestone Test
- **Endpoint**: `PATCH /milestones/{id}`
- **Description**: Update milestone information
- **Expected**: 200 OK with updated milestone

#### 3.5 Delete Milestone Test
- **Endpoint**: `DELETE /milestones/{id}`
- **Description**: Delete milestone
- **Expected**: 200 OK with success message

#### 3.6 Get Project Milestones Test
- **Endpoint**: `GET /milestones/project/{projectId}`
- **Description**: Get all milestones for specific project
- **Expected**: 200 OK with milestones array

### 4. File Attachment Tests

#### 4.1 Upload File Test
- **Endpoint**: `POST /attachments/{projectId}/upload`
- **Description**: Upload file to project
- **Expected**: 201 Created with attachment data

#### 4.2 Get Attachments List Test
- **Endpoint**: `GET /attachments`
- **Description**: Get paginated list of attachments
- **Expected**: 200 OK with attachments array

#### 4.3 Get Attachment by ID Test
- **Endpoint**: `GET /attachments/{id}`
- **Description**: Get specific attachment details
- **Expected**: 200 OK with attachment data

#### 4.4 Delete Attachment Test
- **Endpoint**: `DELETE /attachments/{id}`
- **Description**: Delete attachment
- **Expected**: 200 OK with success message

#### 4.5 Get Project Attachments Test
- **Endpoint**: `GET /attachments/project/{projectId}`
- **Description**: Get all attachments for specific project
- **Expected**: 200 OK with attachments array

#### 4.6 File Type Validation Test
- **Endpoint**: `POST /attachments/{projectId}/upload`
- **Description**: Test invalid file type upload
- **Expected**: 400 Bad Request

#### 4.7 File Size Validation Test
- **Endpoint**: `POST /attachments/{projectId}/upload`
- **Description**: Test file size limit
- **Expected**: 400 Bad Request for oversized files

### 5. Member Management Tests

#### 5.1 Add Member Test
- **Endpoint**: `POST /projects/{id}/members/{memberId}`
- **Description**: Add member to project
- **Expected**: 200 OK with updated project

#### 5.2 Remove Member Test
- **Endpoint**: `DELETE /projects/{id}/members/{memberId}`
- **Description**: Remove member from project
- **Expected**: 200 OK with updated project

#### 5.3 Member Access Control Test
- **Endpoint**: `GET /projects/{id}`
- **Description**: Test member access to project
- **Expected**: 200 OK for members, 403 Forbidden for non-members

### 6. Search and Filter Tests

#### 6.1 Project Search Test
- **Endpoint**: `GET /projects?search=test`
- **Description**: Search projects by name/description
- **Expected**: 200 OK with filtered results

#### 6.2 Project Status Filter Test
- **Endpoint**: `GET /projects?status=Planning`
- **Description**: Filter projects by status
- **Expected**: 200 OK with filtered results

#### 6.3 Milestone Search Test
- **Endpoint**: `GET /milestones?search=setup`
- **Description**: Search milestones by title/description
- **Expected**: 200 OK with filtered results

#### 6.4 Attachment Type Filter Test
- **Endpoint**: `GET /attachments?type=document`
- **Description**: Filter attachments by type
- **Expected**: 200 OK with filtered results

### 7. Pagination Tests

#### 7.1 Project Pagination Test
- **Endpoint**: `GET /projects?limit=5&offset=0`
- **Description**: Test project list pagination
- **Expected**: 200 OK with paginated results

#### 7.2 Milestone Pagination Test
- **Endpoint**: `GET /milestones?limit=10&offset=0`
- **Description**: Test milestone list pagination
- **Expected**: 200 OK with paginated results

#### 7.3 Attachment Pagination Test
- **Endpoint**: `GET /attachments?limit=5&offset=0`
- **Description**: Test attachment list pagination
- **Expected**: 200 OK with paginated results

## Test Execution Commands

### Manual Testing with curl

```bash
# 1. Login to get token
curl -X POST http://localhost:8005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# 2. Create project
curl -X POST http://localhost:8005/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Project",
    "description": "Test project for API testing",
    "status": "Planning",
    "priority": "Medium",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "estimatedHours": 100,
    "tags": ["test", "api"]
  }'

# 3. Create milestone
curl -X POST http://localhost:8005/api/milestones/PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Project Setup",
    "description": "Complete project initialization",
    "dueDate": "2024-03-01",
    "status": "Pending",
    "progress": 0,
    "tags": ["setup"]
  }'

# 4. Upload file
curl -X POST http://localhost:8005/api/attachments/PROJECT_ID/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-file.txt" \
  -F "description=Test file upload" \
  -F "tags=test,document"
```

### Automated Testing with Jest

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern=project-management

# Run tests with coverage
npm test -- --coverage
```

## Expected Test Results

All tests should pass with the following expected outcomes:

- ✅ Authentication: 100% pass rate
- ✅ Project CRUD: 100% pass rate  
- ✅ Milestone Management: 100% pass rate
- ✅ File Attachments: 100% pass rate
- ✅ Member Management: 100% pass rate
- ✅ Access Control: 100% pass rate
- ✅ Search & Filter: 100% pass rate
- ✅ Pagination: 100% pass rate

## Performance Benchmarks

- Project creation: < 500ms
- Project listing (100 items): < 1s
- File upload (1MB): < 2s
- Search operations: < 300ms
- Pagination: < 200ms

## Security Tests

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Project ownership validation
- ✅ File type validation
- ✅ File size limits
- ✅ SQL injection prevention
- ✅ XSS prevention

## Error Handling Tests

- ✅ Invalid project ID: 404 Not Found
- ✅ Unauthorized access: 403 Forbidden
- ✅ Invalid file type: 400 Bad Request
- ✅ File too large: 400 Bad Request
- ✅ Missing required fields: 400 Bad Request
- ✅ Invalid date format: 400 Bad Request 