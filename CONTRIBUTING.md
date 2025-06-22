# 🤝 Contributing to SprintFlow

Cảm ơn bạn đã quan tâm đến việc đóng góp cho SprintFlow! Chúng tôi rất hoan nghênh mọi đóng góp từ cộng đồng.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

---

## 📜 Code of Conduct

Dự án này tuân theo [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Bằng cách tham gia, bạn đồng ý tuân thủ các quy tắc này.

---

## 🤔 How Can I Contribute?

### 🐛 Reporting Bugs
- Sử dụng [GitHub Issues](https://github.com/dangkhoa45/sprint-flow/issues)
- Kiểm tra xem bug đã được báo cáo chưa
- Cung cấp thông tin chi tiết về bug

### 💡 Suggesting Enhancements
- Mô tả rõ ràng tính năng mong muốn
- Giải thích lý do tại sao tính năng này hữu ích
- Đề xuất cách implement (nếu có thể)

### 🔧 Code Contributions
- Fix bugs
- Implement new features
- Improve documentation
- Optimize performance
- Add tests

---

## 🛠️ Development Setup

### Prerequisites
```bash
# Required software
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Git
```

### Initial Setup
```bash
# 1. Fork và clone repository
git clone git@github.com:YOUR_USERNAME/sprint-flow.git
cd sprint-flow

# 2. Add upstream remote
git remote add upstream git@github.com:dangkhoa45/sprint-flow.git

# 3. Install dependencies
pnpm install

# 4. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 5. Start development
pnpm dev:all
```

---

## 🔄 Development Workflow

### 1. Create Feature Branch
```bash
# Sync with upstream
git fetch upstream
git checkout master
git merge upstream/master

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Development Guidelines
- **Small commits**: Commit thường xuyên với messages rõ ràng
- **Conventional commits**: Sử dụng format `type(scope): description`
- **Test locally**: Đảm bảo code hoạt động trước khi push

### 3. Commit Message Format
```bash
# Format: type(scope): description

# Examples:
feat(auth): add OAuth2 login support
fix(projects): resolve project deletion bug
docs(readme): update installation instructions
style(ui): improve button component styling
refactor(api): optimize database queries
test(auth): add unit tests for login service
chore(deps): update dependencies to latest versions
```

### 4. Push và Create PR
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request trên GitHub
```

---

## 📏 Code Standards

### TypeScript
- **Strict mode**: Luôn sử dụng strict TypeScript
- **No any**: Tránh sử dụng `any` type
- **Interfaces**: Sử dụng interfaces cho object types
- **Enums**: Sử dụng enums cho constants

### Backend (NestJS)
```typescript
// ✅ Good
@Injectable()
export class UserService {
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}

// ❌ Bad
@Injectable()
export class UserService {
  async findById(id: any): Promise<any> {
    return this.userModel.findById(id);
  }
}
```

### Frontend (Next.js)
```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.displayName}</Typography>
      </CardContent>
    </Card>
  );
};

// ❌ Bad
export const UserCard = (props: any) => {
  return (
    <div>
      <h1>{props.user.name}</h1>
    </div>
  );
};
```

### File Naming
- **Components**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase (`useUser.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Folder Structure
```
src/
├── components/
│   ├── atoms/          # Basic components
│   ├── molecules/      # Composite components
│   └── organisms/      # Complex components
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
└── constants/          # Constants
```

---

## 🧪 Testing

### Test Coverage Requirements
- **Unit Tests**: > 80% coverage
- **Integration Tests**: Critical API endpoints
- **E2E Tests**: User workflows

### Running Tests
```bash
# All tests
pnpm test

# Backend tests
pnpm test:server

# Frontend tests
pnpm test:web

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:cov
```

### Writing Tests
```typescript
// ✅ Good test example
describe('UserService', () => {
  let service: UserService;
  let mockUserModel: jest.Mocked<UserModel>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find user by id', async () => {
    const mockUser = { _id: '123', username: 'test' };
    mockUserModel.findById.mockResolvedValue(mockUser);

    const result = await service.findById('123');
    
    expect(result).toEqual(mockUser);
    expect(mockUserModel.findById).toHaveBeenCalledWith('123');
  });
});
```

---

## 🔍 Pull Request Process

### Before Submitting PR
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-review completed

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance impact assessed

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: At least 2 approvals required
3. **QA Testing**: Manual testing on staging
4. **Merge**: Squash merge to master

---

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Ubuntu 20.04]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

## Additional Context
Screenshots, logs, etc.
```

---

## 💡 Suggesting Enhancements

### Enhancement Request Template
```markdown
## Problem Statement
Clear description of the problem

## Proposed Solution
Description of the proposed solution

## Alternative Solutions
Other possible solutions considered

## Additional Context
Screenshots, mockups, etc.
```

---

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: low`: Low priority issue
- `status: in progress`: Currently being worked on
- `status: blocked`: Blocked by another issue

---

## 🎯 Getting Help

- **Discussions**: Use [GitHub Discussions](https://github.com/dangkhoa45/sprint-flow/discussions)
- **Issues**: Create [GitHub Issue](https://github.com/dangkhoa45/sprint-flow/issues)
- **Documentation**: Check [README.md](README.md) và [docs/](docs/)

---

## 🙏 Recognition

Contributors sẽ được:
- Liệt kê trong [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Mention trong release notes
- Invite vào organization (nếu đóng góp nhiều)

---

**Thank you for contributing to SprintFlow! 🚀** 