# 🚀 SprintFlow CI/CD Pipeline Guide

## 📋 Tổng quan

SprintFlow sử dụng một hệ thống CI/CD tự động hoàn chỉnh với các tính năng:

- **Code Quality Checks**: ESLint, Prettier, TypeScript validation
- **Automated Testing**: Unit tests, integration tests
- **Build Verification**: Đảm bảo build thành công
- **Issue Automation**: Tự động update và đóng issues
- **Smart PR Management**: Tự động tạo PR với changelog

## 🔧 Cấu hình Local

### Pre-commit Hooks

Hệ thống sử dụng Husky để chạy các checks trước khi commit:

```bash
# Tự động chạy khi commit
pnpm lint-staged        # Lint và format staged files
pnpm commitlint         # Validate commit message
```

### Commit Message Convention

Sử dụng Conventional Commits với issue references:

```bash
# Format chuẩn
type(scope): description

# Ví dụ
feat(auth): add JWT authentication system #1
fix(tasks): resolve task assignment bug #2
docs(api): update API documentation #3
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

**Scopes**: `auth`, `users`, `projects`, `tasks`, `milestones`, `attachments`, `ui`, `api`, `database`, `ci`, `deps`, `config`, `docs`, `test`, `docker`, `release`

## 🤖 Issue Automation

### Cách hoạt động

1. **Parse Commit Messages**: Tự động tìm issue references (`#123`)
2. **Update Checkboxes**: Dựa trên keywords trong commit messages
3. **Auto Close**: Đóng issue khi tất cả tasks hoàn thành
4. **Generate Comments**: Tạo comment chi tiết về công việc đã làm

### Keywords để Auto-complete Tasks

Các từ khóa sau sẽ trigger auto-completion:

- `complete`, `finish`, `done`
- `implement`, `add`, `create`, `update`
- `fix`, `resolve`
- `integrate`, `setup`, `configure`

### Ví dụ Workflow

```bash
# 1. Tạo issue với tasks
feat(auth): add JWT authentication system #1

# 2. Commit với task completion
git commit -m "feat(auth): implement JWT authentication #1"

# 3. Push - automation sẽ:
#    - Parse commit message
#    - Find issue #1
#    - Check if commit contains completion keywords
#    - Update checkboxes if matched
#    - Close issue if all tasks done
```

## 📊 GitHub Actions Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Chạy trên mọi push/PR:

- **Lint**: ESLint + Prettier checks
- **Type Check**: TypeScript validation
- **Test**: Unit/Integration tests
- **Build**: Build verification

### 2. Issue Automation (`.github/workflows/issue-automation.yml`)

Tự động quản lý issues:

- Parse commit messages
- Update issue checkboxes
- Auto-close completed issues
- Generate PR comments

## 🛠️ Scripts

### Root Level Scripts

```bash
pnpm lint              # Lint toàn bộ codebase
pnpm lint:fix          # Lint và auto-fix
pnpm format            # Format code với Prettier
pnpm format:check      # Check format without fixing
pnpm type-check        # TypeScript check cho cả apps
pnpm test              # Run tests
```

### Issue Automation Script

```bash
node scripts/update-issues.js
```

Script này sẽ:
- Parse git commits
- Extract issue numbers
- Update issue checkboxes
- Close completed issues
- Generate detailed comments

## 📝 Best Practices

### 1. Commit Messages

```bash
# ✅ Good
feat(auth): add JWT authentication system #1
fix(tasks): resolve task assignment bug #2

# ❌ Bad
add auth
fix bug
```

### 2. Issue Management

```markdown
## Tasks
- [ ] Implement JWT authentication
- [ ] Add login endpoint
- [ ] Add logout endpoint
- [ ] Add refresh token logic
```

### 3. Code Quality

- Components tối đa 200 dòng
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Format code với Prettier

## 🔍 Troubleshooting

### Common Issues

1. **Commit Message Rejected**
   ```bash
   # Kiểm tra format
   pnpm commitlint --edit .git/COMMIT_EDITMSG
   ```

2. **Pre-commit Hook Failed**
   ```bash
   # Fix linting issues
   pnpm lint:fix
   pnpm format
   ```

3. **Issue Not Auto-closed**
   - Kiểm tra commit message có reference issue không
   - Kiểm tra keywords trong commit message
   - Kiểm tra tất cả checkboxes đã done chưa

### Debug Workflows

```bash
# Check workflow logs
gh run list
gh run view <run-id>

# Re-run failed workflow
gh run rerun <run-id>
```

## 🚀 Mở rộng

### Thêm Quality Gates

```yaml
# .github/workflows/ci.yml
- name: Security Scan
  run: pnpm audit

- name: Bundle Analysis
  run: pnpm --filter web build --analyze
```

### Thêm Deployment

```yaml
# .github/workflows/deploy.yml
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: # deployment commands

- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: # deployment commands
```

## 📞 Support

Nếu gặp vấn đề với CI/CD pipeline:

1. Kiểm tra workflow logs trên GitHub
2. Verify commit message format
3. Check ESLint/Prettier configuration
4. Review issue automation script

---

*Hệ thống CI/CD được thiết kế để tự động hóa tối đa quy trình phát triển, giúp team tập trung vào việc viết code chất lượng thay vì quản lý thủ công.* 