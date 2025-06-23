# 📋 SprintFlow - Quy tắc Code và Commit Standards

## 🎯 Mục tiêu

Tài liệu này định nghĩa các quy tắc và tiêu chuẩn cho việc viết code và commit trong dự án SprintFlow, đảm bảo tính nhất quán, dễ bảo trì và chất lượng cao.

---

## 📝 Quy tắc Commit Messages

### 🏗️ Conventional Commits Format

```bash
type(scope): description #issue_number

# Ví dụ:
feat(auth): add JWT authentication system #1
fix(tasks): resolve task assignment bug #2
docs(api): update API documentation #3
```

### 📋 Types (Bắt buộc)

| Type       | Mô tả                                        | Ví dụ                                          |
| ---------- | -------------------------------------------- | ---------------------------------------------- |
| `feat`     | Tính năng mới                                | `feat(auth): add login functionality`          |
| `fix`      | Sửa lỗi                                      | `fix(ui): resolve button alignment issue`      |
| `docs`     | Thay đổi documentation                       | `docs(readme): update installation guide`      |
| `style`    | Thay đổi format code (không ảnh hưởng logic) | `style(components): format code with prettier` |
| `refactor` | Refactor code (không thêm tính năng/sửa lỗi) | `refactor(services): restructure user service` |
| `test`     | Thêm/sửa test                                | `test(auth): add unit tests for login`         |
| `chore`    | Công việc bảo trì                            | `chore(deps): update dependencies`             |
| `perf`     | Cải thiện performance                        | `perf(api): optimize database queries`         |
| `ci`       | Thay đổi CI/CD                               | `ci(pipeline): add GitHub Actions workflow`    |
| `build`    | Thay đổi build system                        | `build(docker): update Docker configuration`   |
| `revert`   | Revert commit trước đó                       | `revert: revert "feat: add new feature"`       |

### 🎯 Scopes (Bắt buộc)

| Scope         | Mô tả                  | Ví dụ                                         |
| ------------- | ---------------------- | --------------------------------------------- |
| `auth`        | Authentication module  | `feat(auth): add OAuth integration`           |
| `users`       | User management        | `fix(users): resolve user profile update`     |
| `projects`    | Project management     | `feat(projects): add project templates`       |
| `tasks`       | Task management        | `fix(tasks): resolve task assignment bug`     |
| `milestones`  | Milestone management   | `feat(milestones): add milestone tracking`    |
| `attachments` | File attachments       | `fix(attachments): resolve file upload issue` |
| `ui`          | Frontend UI components | `style(ui): improve button design`            |
| `api`         | Backend API            | `perf(api): optimize response time`           |
| `database`    | Database changes       | `fix(database): resolve migration issue`      |
| `ci`          | CI/CD pipeline         | `ci(pipeline): add automated testing`         |
| `deps`        | Dependencies           | `chore(deps): update React to v18`            |
| `config`      | Configuration files    | `chore(config): update ESLint rules`          |
| `docs`        | Documentation          | `docs(api): add API documentation`            |
| `test`        | Testing                | `test(auth): add integration tests`           |
| `docker`      | Docker configuration   | `build(docker): optimize image size`          |
| `release`     | Release process        | `ci(release): add automated release`          |

### 📏 Quy tắc Description

- **Độ dài**: Tối đa 72 ký tự
- **Ngôn ngữ**: Tiếng Anh
- **Thì**: Sử dụng imperative mood (như đang ra lệnh)
- **Không dấu chấm** ở cuối
- **Issue reference**: Luôn thêm `#issue_number` ở cuối

```bash
# ✅ Good
feat(auth): add JWT authentication system #1
fix(tasks): resolve task assignment bug #2

# ❌ Bad
feat(auth): added JWT authentication system. #1
fix(tasks): resolving task assignment bug #2
feat(auth): add JWT authentication system for user login and logout with refresh token support #1
```

### 🔗 Issue References

```bash
# Single issue
feat(auth): add JWT authentication #1

# Multiple issues
feat(auth): add JWT authentication #1 #2

# Related issues
feat(auth): add JWT authentication #1
# Relates to #2
```

---

## 💻 Quy tắc Code

### 🎨 TypeScript/JavaScript

#### 1. **Naming Conventions**

```typescript
// ✅ Variables và Functions - camelCase
const userName = 'john';
const getUserData = () => {};

// ✅ Classes và Interfaces - PascalCase
class UserService {}
interface UserData {}

// ✅ Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ Private methods - underscore prefix
class UserService {
  private _validateUser() {}
  private _formatData() {}
}
```

#### 2. **File Naming**

```bash
# ✅ Components - PascalCase
UserProfile.tsx
ProjectCard.tsx
TaskList.tsx

# ✅ Services/Utils - camelCase
userService.ts
apiClient.ts
dateUtils.ts

# ✅ Constants - camelCase
constants.ts
apiEndpoints.ts

# ✅ Types - camelCase
userTypes.ts
projectTypes.ts
```

#### 3. **Import/Export**

```typescript
// ✅ Named exports
export const UserService = {};
export interface UserData {}

// ✅ Default exports (chỉ cho components)
export default UserProfile;

// ✅ Import order
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';

// 3. Internal modules
import { UserService } from '@/services/userService';
import { UserData } from '@/types/userTypes';

// 4. Relative imports
import './UserProfile.css';
```

### 🧩 React Components

#### 1. **Component Structure**

```typescript
// ✅ Component template
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface UserProfileProps {
  userId: string;
  onUpdate?: (data: UserData) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  // 1. State declarations
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Effects
  useEffect(() => {
    loadUserData();
  }, [userId]);

  // 3. Event handlers
  const handleUpdate = async (data: UserData) => {
    setLoading(true);
    try {
      await UserService.update(userId, data);
      setUser(data);
      onUpdate?.(data);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <Box>
      <Typography variant="h4">{user.name}</Typography>
      <Button onClick={() => handleUpdate(user)}>
        Update
      </Button>
    </Box>
  );
};

export default UserProfile;
```

#### 2. **Component Rules**

- **Tối đa 200 dòng** cho mỗi component
- **Single Responsibility**: Mỗi component chỉ làm một việc
- **Props Interface**: Luôn định nghĩa interface cho props
- **Error Boundaries**: Sử dụng error boundaries cho components quan trọng
- **Loading States**: Luôn có loading state cho async operations

#### 3. **Hooks Usage**

```typescript
// ✅ Custom hooks
const useUser = (userId: string) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await UserService.getById(userId);
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, refetch: loadUser };
};
```

### 🗄️ Backend (NestJS)

#### 1. **Service Structure**

```typescript
// ✅ Service template
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
```

#### 2. **Controller Structure**

```typescript
// ✅ Controller template
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
```

### 🎨 Styling

#### 1. **CSS/SCSS**

```scss
// ✅ BEM Methodology
.user-profile {
  &__header {
    display: flex;
    align-items: center;
    
    &--large {
      font-size: 24px;
    }
  }
  
  &__content {
    padding: 16px;
  }
  
  &__actions {
    display: flex;
    gap: 8px;
  }
}
```

#### 2. **Material-UI**

```typescript
// ✅ Theme usage
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
}));
```

---

## 🔍 Code Quality Rules

### 1. **ESLint Rules**

```javascript
// ✅ Strict rules
'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
'@typescript-eslint/no-explicit-any': 'warn',
'no-console': 'warn',
'no-debugger': 'error',
'prefer-const': 'error',
'no-var': 'error',

// ✅ Component rules (web only)
'max-lines-per-function': ['error', 200, { 
  skipBlankLines: true, 
  skipComments: true 
}],
```

### 2. **Prettier Configuration**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 3. **TypeScript Rules**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 📁 File Organization

### 1. **Frontend Structure**

```
apps/web/
├── app/                    # Next.js app directory
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── hooks/                # Custom hooks
├── services/             # API services
├── types/                # TypeScript types
├── utils/                # Utility functions
└── styles/               # Global styles
```

### 2. **Backend Structure**

```
apps/server/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   └── tasks/
│   ├── shared/           # Shared utilities
│   ├── decorators/       # Custom decorators
│   └── utils/            # Utility functions
└── test/                 # Test files
```

---

## 🧪 Testing Standards

### 1. **Unit Tests**

```typescript
// ✅ Test template
describe('UserService', () => {
  let service: UserService;
  let mockUserModel: jest.Mocked<Model<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { name: 'John', email: 'john@example.com' };
      const expectedUser = { id: '1', ...createUserDto };

      mockUserModel.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserModel.save).toHaveBeenCalledWith(createUserDto);
    });
  });
});
```

### 2. **Component Tests**

```typescript
// ✅ Component test template
describe('UserProfile', () => {
  const mockUser = { id: '1', name: 'John', email: 'john@example.com' };

  it('should render user information', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onUpdate when update button is clicked', () => {
    const mockOnUpdate = jest.fn();
    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByText('Update'));
    
    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser);
  });
});
```

---

## 🚀 Performance Guidelines

### 1. **Frontend Optimization**

```typescript
// ✅ Lazy loading
const LazyComponent = lazy(() => import('./LazyComponent'));

// ✅ Memoization
const ExpensiveComponent = memo(({ data }) => {
  return <div>{expensiveCalculation(data)}</div>;
});

// ✅ Custom hooks for data fetching
const useUserData = (userId: string) => {
  return useSWR(`/api/users/${userId}`, fetcher);
};
```

### 2. **Backend Optimization**

```typescript
// ✅ Database indexing
@Schema({ timestamps: true })
export class User {
  @Prop({ index: true })
  email: string;

  @Prop({ index: true })
  username: string;
}

// ✅ Caching
@Injectable()
export class UserService {
  async findById(id: string): Promise<User> {
    const cacheKey = `user:${id}`;
    let user = await this.cacheManager.get(cacheKey);
    
    if (!user) {
      user = await this.userModel.findById(id).exec();
      await this.cacheManager.set(cacheKey, user, 300); // 5 minutes
    }
    
    return user;
  }
}
```

---

## 🔒 Security Guidelines

### 1. **Input Validation**

```typescript
// ✅ DTO validation
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}
```

### 2. **Authentication & Authorization**

```typescript
// ✅ JWT validation
@UseGuards(JwtAuthGuard)
@Roles(Role.ADMIN)
@Get('admin/users')
async getAdminUsers() {
  return this.usersService.findAll();
}
```

---

## 📚 Documentation Standards

### 1. **Code Comments**

```typescript
/**
 * Creates a new user in the system
 * @param createUserDto - User data to create
 * @returns Promise<User> - Created user object
 * @throws BadRequestException - If user data is invalid
 */
async create(createUserDto: CreateUserDto): Promise<User> {
  // Implementation
}
```

### 2. **API Documentation**

```typescript
@ApiOperation({ 
  summary: 'Create a new user',
  description: 'Creates a new user account with the provided information'
})
@ApiResponse({ 
  status: 201, 
  description: 'User created successfully',
  type: User 
})
@ApiResponse({ 
  status: 400, 
  description: 'Invalid user data',
  type: BadRequestResponse 
})
```

---

## 🔄 Git Workflow

### 1. **Branch Naming**

```bash
# ✅ Feature branches
feature/issue-1-add-jwt-authentication
feature/issue-2-implement-kanban-board

# ✅ Bug fix branches
fix/issue-3-resolve-login-bug
fix/issue-4-fix-task-assignment

# ✅ Hotfix branches
hotfix/issue-5-critical-security-fix
```

### 2. **Commit Frequency**

- **Small commits**: Mỗi commit nên thực hiện một thay đổi logic
- **Frequent commits**: Commit thường xuyên để track progress
- **Meaningful messages**: Commit message phải mô tả rõ thay đổi

### 3. **Pull Request**

```markdown
## 🎯 Description
Brief description of changes

## 🔗 Related Issues
Closes #1
Relates to #2

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated

## 📝 Changes Made
- Add JWT authentication
- Implement user login/logout
- Add refresh token logic

## 🧪 Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed
```

---

## 🎯 Best Practices Summary

### ✅ Do's

- ✅ Sử dụng TypeScript strict mode
- ✅ Viết tests cho mọi logic quan trọng
- ✅ Follow naming conventions
- ✅ Keep components under 200 lines
- ✅ Use meaningful commit messages
- ✅ Document complex logic
- ✅ Handle errors gracefully
- ✅ Optimize for performance

### ❌ Don'ts

- ❌ Sử dụng `any` type
- ❌ Commit code không test
- ❌ Viết components quá dài
- ❌ Ignore ESLint warnings
- ❌ Commit với message không rõ ràng
- ❌ Hardcode values
- ❌ Ignore error handling

---

*Tuân thủ các quy tắc này sẽ giúp dự án SprintFlow có code chất lượng cao, dễ bảo trì và mở rộng.* 