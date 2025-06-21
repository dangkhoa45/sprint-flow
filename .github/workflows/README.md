# 🚀 SprintFlow CI/CD Pipeline Documentation

## 📋 Tổng quan

Hệ thống CI/CD của SprintFlow được thiết kế để đảm bảo code chất lượng cao, tự động hóa quy trình phát triển và deployment an toàn.

## 🔧 Các Workflow Chính

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
Workflow chính chạy khi có PR hoặc push vào main/master.

**Các bước:**
- ✅ **Quality Check**: Linting, type checking, testing
- 🔒 **Security Check**: Security audit, SAST scan
- 🏗️ **Build & Test**: Build và integration testing
- 🚀 **Deploy Staging**: Deploy lên staging environment
- 🔄 **Close Issues**: Tự động đóng issues khi merge PR
- 📦 **Create Release**: Tạo release tự động

### 2. **Pull Request Check** (`pr-check.yml`)
Kiểm tra chi tiết cho từng PR.

**Các bước:**
- 🎨 **Code Style**: Format và linting
- 🔍 **Type Safety**: TypeScript compilation
- 📦 **Dependency Check**: Kiểm tra dependencies
- 🔒 **Security Check**: Security audit
- 📊 **Test Coverage**: Kiểm tra coverage (tối thiểu 80%)
- 🏗️ **Build Check**: Kiểm tra build thành công

### 3. **Advanced Code Quality** (`code-quality.yml`)
Phân tích code quality nâng cao.

**Các bước:**
- 📊 **SonarQube Analysis**: Phân tích chất lượng code
- 🔍 **Complexity Check**: Kiểm tra độ phức tạp
- ⚡ **Performance Check**: Phân tích hiệu suất
- 🔒 **Security Analysis**: Phân tích bảo mật nâng cao
- 📚 **Documentation Check**: Kiểm tra tài liệu
- ♿ **Accessibility Check**: Kiểm tra accessibility

### 4. **Issue Automation** (`issue-automation.yml`)
Tự động hóa quản lý issues.

**Tính năng:**
- 🏷️ **Auto Label**: Tự động gán labels dựa trên nội dung
- 🔄 **Auto Close**: Tự động đóng issues khi merge PR
- 👋 **Welcome Message**: Chào mừng issue mới
- 👥 **Auto Assign**: Tự động assign reviewers
- 📊 **Status Update**: Cập nhật trạng thái issues

### 5. **Deploy Production** (`deploy-production.yml`)
Deployment lên production.

**Các bước:**
- ✅ **Condition Check**: Kiểm tra điều kiện deploy
- 🚀 **Production Deploy**: Deploy lên production
- 🏥 **Health Check**: Kiểm tra sức khỏe hệ thống
- 🔄 **Rollback**: Khả năng rollback

### 6. **Branch Protection** (`branch-protection.yml`)
Thiết lập bảo vệ branch.

**Tính năng:**
- 🛡️ **Protection Rules**: Quy tắc bảo vệ branch
- 🔒 **Required Checks**: Yêu cầu checks bắt buộc
- 👥 **Review Requirements**: Yêu cầu review
- 🚫 **Force Push Protection**: Bảo vệ khỏi force push

## 🔑 Secrets Cần Thiết

### GitHub Secrets
```bash
# Docker Registry
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# Production Registry
PRODUCTION_REGISTRY=your_production_registry
PRODUCTION_REGISTRY_USERNAME=your_production_username
PRODUCTION_REGISTRY_PASSWORD=your_production_password

# Security Tools
SNYK_TOKEN=your_snyk_token
SONAR_TOKEN=your_sonarqube_token

# Environment Variables
MONGO_URI=your_mongodb_connection_string
APP_SECRET=your_app_secret
ACCESS_TOKEN_EXPIRE=1h
```

## 📊 Quality Gates

### Code Quality Standards
- **Test Coverage**: ≥ 80%
- **Code Complexity**: < 10 per function
- **Bundle Size**: < 5MB
- **Security Vulnerabilities**: 0
- **Documentation Coverage**: ≥ 80% (backend), ≥ 60% (frontend)

### Required Status Checks
1. `quality-check` - Code quality & testing
2. `security-check` - Security audit
3. `build-and-test` - Build & integration tests
4. `code-style` - Code formatting
5. `type-check` - TypeScript compilation
6. `test-coverage` - Test coverage check
7. `build-check` - Build verification

## 🚀 Quy Trình Làm Việc

### 1. Tạo Issue
```bash
# Tạo issue với format chuẩn
Title: [Feature/Bug/Docs] Brief description
Body: Detailed description with steps to reproduce
```

### 2. Tạo Branch
```bash
git checkout -b feature/issue-123-description
```

### 3. Commit với Convention
```bash
# Format: type(scope): description
git commit -m "feat(projects): add milestone management feature

- Add milestone CRUD operations
- Implement milestone timeline
- Add milestone status tracking

Closes #123"
```

### 4. Push và Tạo PR
```bash
git push origin feature/issue-123-description
# Tạo PR với description tham chiếu issue
```

### 5. Review Process
- ✅ Tất cả checks phải pass
- 👥 Cần ít nhất 2 approving reviews
- 🔒 Code owner review bắt buộc
- 💬 Conversation resolution required

### 6. Merge và Deploy
- 🚀 Tự động deploy staging
- 📦 Tự động tạo release
- 🔄 Tự động đóng issues
- 🏥 Health check sau deploy

## 🔧 Cấu Hình

### Branch Protection Rules
```yaml
# Main/Master Branch
required_status_checks:
  strict: true
  contexts:
    - quality-check
    - security-check
    - build-and-test
    - code-style
    - type-check
    - test-coverage
    - build-check

required_pull_request_reviews:
  required_approving_review_count: 2
  dismiss_stale_reviews: true
  require_code_owner_reviews: true
  require_last_push_approval: true

enforce_admins: true
allow_force_pushes: false
allow_deletions: false
required_conversation_resolution: true
```

### Issue Labels
- `bug` - Bug reports
- `enhancement` - Feature requests
- `documentation` - Documentation updates
- `high-priority` - High priority issues
- `medium-priority` - Medium priority issues
- `low-priority` - Low priority issues
- `frontend` - Frontend related
- `backend` - Backend related
- `devops` - DevOps related
- `in-progress` - Work in progress
- `auto-closed` - Automatically closed
- `merged` - Merged via PR

## 🛠️ Troubleshooting

### Common Issues

#### 1. Test Coverage Too Low
```bash
# Kiểm tra coverage hiện tại
cd apps/server
pnpm test:cov

# Thêm tests cho các functions chưa cover
```

#### 2. Build Failures
```bash
# Kiểm tra TypeScript errors
cd apps/server
pnpm build

cd apps/web
pnpm build
```

#### 3. Security Vulnerabilities
```bash
# Kiểm tra vulnerabilities
pnpm audit

# Update dependencies
pnpm update
```

#### 4. Performance Issues
```bash
# Kiểm tra bundle size
cd apps/web
npx @next/bundle-analyzer .next/static/chunks
```

### Debug Workflows
```bash
# Xem workflow logs
# GitHub Actions > Workflows > Select workflow > View logs

# Re-run failed jobs
# GitHub Actions > Workflows > Select workflow > Re-run jobs
```

## 📈 Monitoring và Metrics

### Quality Metrics Dashboard
- **Code Coverage**: Theo dõi test coverage trends
- **Security Score**: Theo dõi security vulnerabilities
- **Performance Metrics**: Bundle size, load time
- **Deployment Frequency**: Số lần deploy thành công

### Alerts
- 🔴 **Critical**: Security vulnerabilities, build failures
- 🟡 **Warning**: Low test coverage, high complexity
- 🟢 **Info**: Successful deployments, quality improvements

## 🔄 Rollback Process

### Automatic Rollback
```bash
# Trigger rollback workflow
# GitHub Actions > Deploy to Production > Run workflow > Rollback
```

### Manual Rollback
```bash
# Rollback to previous version
docker pull your-registry/sprintflow:v{previous-version}
# Deploy previous version
```

## 📚 Best Practices

### Code Quality
1. **Write Tests First**: TDD approach
2. **Keep Functions Small**: < 50 lines, complexity < 10
3. **Document Everything**: JSDoc comments
4. **Follow Conventions**: Consistent naming, formatting

### Security
1. **Regular Audits**: Weekly security scans
2. **Dependency Updates**: Monthly dependency reviews
3. **Secret Management**: Never commit secrets
4. **Access Control**: Principle of least privilege

### Performance
1. **Bundle Optimization**: Regular bundle analysis
2. **Database Optimization**: Index optimization
3. **Caching Strategy**: Implement proper caching
4. **Monitoring**: Real-time performance monitoring

## 🆘 Support

### Getting Help
- 📖 **Documentation**: Check this README first
- 🐛 **Issues**: Create GitHub issue with `ci-cd` label
- 💬 **Discussions**: Use GitHub Discussions
- 📧 **Email**: Contact DevOps team

### Emergency Contacts
- **DevOps Lead**: @devops-lead
- **Security Team**: @security-team
- **Infrastructure**: @infrastructure-team

---

*Last updated: $(date)*
*Version: 1.0.0* 