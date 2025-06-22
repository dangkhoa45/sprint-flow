# 🚀 SprintFlow - Modern Project Management Platform

<div align="center">

![SprintFlow Logo](https://img.shields.io/badge/SprintFlow-Project%20Management-blue?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

**Modern project management platform for software development teams**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

**SprintFlow** là một hệ thống quản lý dự án hiện đại được thiết kế đặc biệt cho các nhóm phát triển phần mềm. Tích hợp workflow tự động, real-time collaboration và UX/UI hiện đại để tối ưu hóa quy trình làm việc.

### 🎯 Mục tiêu chính
- **Tăng 20% productivity** cho development teams
- **Giảm 50% thời gian** quản lý dự án
- **Workflow tự động** với Git integration
- **Real-time collaboration** cho team members
- **Modern UX/UI** với responsive design

---

## ✨ Features

### 🔄 **Git-Integrated Workflow**
- Auto-create branches từ issues
- Checkbox tracking trong commits
- Automatic PR creation khi hoàn thành
- Detailed work summary trong PR description
- Issue auto-closing sau merge

### ⚡ **Real-time Collaboration**
- WebSocket cho instant updates
- Live notifications cho team members
- Real-time chat system
- Activity feed với live updates
- Presence indicators (online/offline)

### 🎨 **Modern UX/UI**
- Design system với reusable components
- Responsive design (mobile-first)
- Dark/Light theme toggle
- Progressive Web App (PWA)
- Accessibility compliance (WCAG 2.1)

### 📊 **Advanced Analytics**
- Dashboard với project metrics
- Team performance tracking
- Time tracking analytics
- Custom reports và export
- Real-time project health indicators

### 🔐 **Role-based Access Control**
- **Admin**: System management, security, analytics
- **Manager**: Project management, team coordination
- **Member**: Task execution, collaboration

### 🤖 **AI-Powered Features**
- Smart task assignment
- Automated code review suggestions
- Predictive analytics
- Intelligent notifications

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [MongoDB](https://www.mongodb.com/) với Mongoose ODM
- **Authentication**: JWT + Session management
- **Real-time**: WebSocket với Socket.io
- **File Upload**: Multer với cloud storage
- **Validation**: Class-validator + class-transformer

### **Frontend**
- **Framework**: [Next.js 15](https://nextjs.org/) với App Router
- **UI Library**: [Material-UI (MUI)](https://mui.com/)
- **State Management**: [SWR](https://swr.vercel.app/) + React Context
- **Styling**: Emotion + CSS-in-JS
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### **Infrastructure**
- **Containerization**: [Docker](https://www.docker.com/) + Docker Compose
- **Package Manager**: [pnpm](https://pnpm.io/) với workspace
- **CI/CD**: GitHub Actions
- **Testing**: Jest + Cypress + Lighthouse
- **Code Quality**: ESLint + Prettier + TypeScript

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose
- MongoDB (local hoặc cloud)

### **1. Clone Repository**
```bash
git clone git@github.com:dangkhoa45/sprint-flow.git
cd sprint-flow
```

### **2. Environment Setup**
```bash
# Copy environment files
cp .env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Database
MONGO_URI=mongodb://localhost:27017/sprintflow
MONGO_DB=sprintflow
MONGO_USER=admin
MONGO_PASS=password

# Application
APP_SECRET=your-super-secret-key
ACCESS_TOKEN_EXPIRE=1h
REFRESH_TOKEN_EXPIRE=7d

# Frontend
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8005/api

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **3. Install Dependencies**
```bash
# Install all dependencies
pnpm install

# Install specific package to server
pnpm i --filter server <package-name>

# Install specific package to web
pnpm i --filter web <package-name>
```

### **4. Start Development**
```bash
# Start all services (recommended)
pnpm dev:all

# Or start individually
pnpm dev:server  # Backend on http://localhost:8005
pnpm dev:web     # Frontend on http://localhost:8000

# Start with Docker
docker compose up -d
```

### **5. Access Applications**
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:8005/api
- **API Documentation**: http://localhost:8005/api/docs
- **MongoDB**: mongodb://localhost:27017
- **Mongo Express**: http://localhost:8081

---

## 📁 Project Structure

```
SprintFlow/
├── apps/
│   ├── server/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/        # Feature modules
│   │   │   ├── shared/         # Shared utilities
│   │   │   ├── decorators/     # Custom decorators
│   │   │   └── utils/          # Helper functions
│   │   └── uploads/            # File uploads
│   └── web/                    # Next.js Frontend
│       ├── app/                # App Router pages
│       ├── components/         # Reusable components
│       ├── hooks/              # Custom hooks
│       ├── api/                # API functions
│       └── utils/              # Helper functions
├── brain/                      # Documentation & Roadmap
├── docs/                       # Additional documentation
└── docker-compose.yml          # Docker configuration
```

---

## 📋 Source Code Analysis

### 🏗️ **Kiến trúc tổng thể**

SprintFlow được xây dựng theo kiến trúc **Monorepo** với **Microservices** pattern:

```
SprintFlow/
├── apps/
│   ├── server/     # Backend API (NestJS)
│   └── web/        # Frontend (Next.js 15)
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### 🔧 **Backend (NestJS Server)**

#### **1. Cấu trúc Module**
```typescript
// app.module.ts - Module chính
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule, 
    ProjectsModule,
    TasksModule,
    JwtModule.register({...})
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ]
})
```

#### **2. Hệ thống Authentication**
- **JWT + Session Management**: Kết hợp JWT token với session lưu trong MongoDB
- **Role-based Access Control**: Admin, User roles
- **Session Tracking**: Theo dõi IP, User Agent, thời gian đăng nhập
- **Password Reset**: Hệ thống reset password với token mã hóa

```typescript
// auth.service.ts
async signIn(username: string, pass: string, ip: string, ua: string) {
  const user = await this.usersService.findOne({ username, status: UserStatus.Active });
  const isAuthenticated = await compareSync(pass, user.password);
  
  const session = await this.sessionService.create({
    user: user._id.toString(),
    startAt: new Date(),
    endAt: new Date(Date.now() + 1000 * 60 * 1),
    ip, ...uaData
  });
  
  return {
    accessToken: await this.jwtService.signAsync(payload),
    refreshToken: await this.jwtService.signAsync(payload, { expiresIn: REFRESH_TOKEN_EXPIRE }),
    profile: { _id, username, displayName, role, avatar }
  };
}
```

#### **3. Data Models (MongoDB + Mongoose)**

**User Entity:**
```typescript
@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ required: true }) displayName: string;
  @Prop({ unique: true }) username: string;
  @Prop({ required: true }) password: string;
  @Prop({ type: String, enum: UserRole, required: true }) role: UserRole;
  @Prop({ type: String, enum: UserStatus, default: UserStatus.Active }) status: UserStatus;
  @Prop() lastLogin?: Date;
  @Prop() email?: string;
  @Prop() avatar?: string;
  @Prop() resetPasswordToken?: string;
  @Prop() resetPasswordExpires?: Date;
}
```

**Project Entity:**
```typescript
@Schema({ timestamps: true })
export class Project extends BaseEntity {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.Planning }) status: ProjectStatus;
  @Prop({ type: String, enum: ProjectPriority, default: ProjectPriority.Medium }) priority: ProjectPriority;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) owner: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] }) members: Types.ObjectId[];
  @Prop() startDate?: Date;
  @Prop() endDate?: Date;
  @Prop() estimatedHours?: number;
  @Prop({ default: 0 }) actualHours: number;
  @Prop({ min: 0, max: 100, default: 0 }) progress: number;
  @Prop([String]) tags: string[];
}
```

**Task Entity:**
```typescript
@Schema({ timestamps: true })
export class Task extends BaseEntity {
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ trim: true }) description?: string;
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true }) projectId: Types.ObjectId;
  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO }) status: TaskStatus;
  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM }) priority: TaskPriority;
  @Prop({ type: Types.ObjectId, ref: 'User' }) assignedTo?: Types.ObjectId;
  @Prop() dueDate?: Date;
  @Prop({ min: 0 }) estimatedTime?: number;
  @Prop({ min: 0, default: 0 }) actualTime?: number;
  @Prop([String]) tags: string[];
}
```

#### **4. API Endpoints Structure**
- **Authentication**: `/api/auth/*` (login, register, refresh, forgot-password)
- **Users**: `/api/users/*` (CRUD operations, sessions)
- **Projects**: `/api/projects/*` (CRUD, members, stats, attachments)
- **Tasks**: `/api/tasks/*` (CRUD, assignment, time tracking)
- **Attachments**: `/api/attachments/*` (file upload/download)

### 🎨 **Frontend (Next.js 15)**

#### **1. App Router Structure**
```
app/
├── (local)/           # Protected routes
│   ├── dashboard/     # Dashboard pages
│   ├── projects/      # Project management
│   └── layout.tsx     # App layout with sidebar
├── login/             # Authentication pages
├── forgot-password/   # Password reset
└── layout.tsx         # Root layout
```

#### **2. State Management**
- **SWR**: Data fetching và caching
- **React Context**: Global state (user, theme)
- **Local Storage**: UI preferences (sidebar collapse)

```typescript
// AppProvider.tsx
function AppProvider({ children, currentUser }: Props) {
  const [user, setUser] = useState<User | undefined>(currentUser);
  
  return (
    <AppContext.Provider value={{ user, setUser }}>
      <ThemeModeProvider>
        <ThemeRegistry>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ToastProvider>
              <SWRProvider>{children}</SWRProvider>
            </ToastProvider>
          </LocalizationProvider>
        </ThemeRegistry>
      </ThemeModeProvider>
    </AppContext.Provider>
  );
}
```

#### **3. Custom Hooks Pattern**
```typescript
// useProjects.ts
export function useProjects(query?: ProjectQueryDto) {
  const { data, error, mutate, isLoading } = useSWR(
    query ? [`/api/projects`, query] : `/api/projects`,
    () => projectsApi.getProjects(query),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    projects: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error: error as ErrorResponse,
    mutate,
  };
}
```

#### **4. API Layer**
```typescript
// projects.ts
export const projectsApi = {
  getProjects: async (query?: ProjectQueryDto) => {
    return fetcher<{
      data: Project[];
      total: number;
      page: number;
      limit: number;
    }>({
      path: `${API_HOST}/api/projects`,
      method: "GET",
      params: query,
    });
  },
  
  createProject: async (data: CreateProjectDto) => {
    return fetcher<Project>({
      path: `${API_HOST}/api/projects`,
      method: "POST",
      body: data,
    });
  }
};
```

#### **5. UI Components (Material-UI)**
- **Responsive Layout**: Sidebar navigation với collapse/expand
- **Data Grid**: MUI X Data Grid cho tables
- **Date Pickers**: MUI X Date Pickers
- **Theme System**: Dark/Light mode toggle
- **Toast Notifications**: React Toastify integration

### 🐳 **DevOps & Infrastructure**

#### **1. Docker Setup**
```yaml
# docker-compose.yml
services:
  apps:
    build: .
    command: pnpm dev:all
    ports:
      - 8000:3000  # Frontend
      - 8005:8005  # Backend
    volumes:
      - .:/home/app
      
  dbSF:
    image: mongo:5.0
    environment:
      - MONGO_INITDB_DATABASE=$MONGO_DB
      - MONGO_INITDB_ROOT_USERNAME=$MONGO_USER
      - MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASS
      
  admin:
    image: mongo-express
    ports:
      - $ADMIN_PORT:8081
```

#### **2. Package Management**
- **pnpm Workspace**: Monorepo management
- **TypeScript**: Strict type checking
- **ESLint + Prettier**: Code quality
- **Jest**: Unit testing

### 🔐 **Security Features**

1. **Authentication & Authorization**
   - JWT tokens với expiration
   - Session management với MongoDB
   - Role-based access control
   - Password hashing với bcrypt

2. **Input Validation**
   - Class-validator decorators
   - DTO validation
   - SQL injection prevention (MongoDB)

3. **CORS & Security Headers**
   - CORS configuration
   - Secure cookies
   - CSRF protection

### 📈 **Performance Optimizations**

1. **Frontend**
   - SWR caching strategy
   - React.memo cho components
   - Lazy loading với Next.js
   - Image optimization

2. **Backend**
   - MongoDB indexes
   - Query optimization
   - Response caching
   - File upload streaming

3. **Database**
   - Indexed fields cho queries
   - Text search indexes
   - Compound indexes cho complex queries

### 🎯 **Key Features Implemented**

1. **Project Management**
   - CRUD operations
   - Member management
   - Progress tracking
   - File attachments

2. **Task Management**
   - Task assignment
   - Status tracking
   - Time estimation
   - Priority levels

3. **User Management**
   - User registration/login
   - Role management
   - Session tracking
   - Password reset

4. **Real-time Features**
   - WebSocket ready (infrastructure)
   - Live updates (planned)
   - Notifications system

### 🚀 **Development Workflow**

1. **Local Development**
   ```bash
   pnpm dev:all        # Start both frontend & backend
   pnpm dev:server     # Backend only
   pnpm dev:web        # Frontend only
   ```

2. **Docker Development**
   ```bash
   docker compose up -d  # Start all services
   ```

3. **API Documentation**
   - Swagger UI tại `/api/docs`
   - Auto-generated từ decorators
   - Interactive testing

---

## 🔧 Development

### **Available Scripts**
```bash
# Development
pnpm dev:all          # Start both frontend & backend
pnpm dev:server       # Start only backend
pnpm dev:web          # Start only frontend

# Building
pnpm build:server     # Build backend
pnpm build:web        # Build frontend

# Production
pnpm start:server     # Start backend in production
pnpm start:web        # Start frontend in production

# Testing
pnpm test             # Run all tests
pnpm test:server      # Run backend tests
pnpm test:web         # Run frontend tests
pnpm test:e2e         # Run end-to-end tests

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm type-check       # Run TypeScript check
```

### **Adding New Features**
```bash
# Create new NestJS module
nest generate module modules/feature-name
nest generate controller modules/feature-name
nest generate service modules/feature-name

# Create new Next.js page
# Add file in apps/web/app/(local)/feature-name/page.tsx
```

---

## 📊 API Documentation

API documentation được tạo tự động với Swagger UI:

- **Development**: http://localhost:8005/api/docs
- **Production**: https://your-domain.com/api/docs

### **Authentication**
```bash
# Login to get access token
curl -X POST http://localhost:8005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Use token in subsequent requests
curl -X GET http://localhost:8005/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🧪 Testing

### **Backend Testing**
```bash
# Unit tests
pnpm test:server

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### **Frontend Testing**
```bash
# Unit tests
pnpm test:web

# E2E tests with Cypress
pnpm test:e2e:web

# Performance tests
pnpm lighthouse
```

---

## 🚀 Deployment

### **Docker Deployment**
```bash
# Build and run with Docker
docker compose up -d

# Build production images
docker compose -f docker-compose.prod.yml up -d
```

### **Manual Deployment**
```bash
# Build applications
pnpm build:server
pnpm build:web

# Start production
pnpm start:server
pnpm start:web
```

---

## 🤝 Contributing

Chúng tôi rất hoan nghênh mọi đóng góp! Hãy đọc [Contributing Guidelines](CONTRIBUTING.md) để biết thêm chi tiết.

### **Development Workflow**
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**
- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Follow project rules
- **Prettier**: Consistent code formatting
- **Tests**: >80% coverage required
- **Commits**: Conventional commits format

---

## 📈 Roadmap

Xem [Modern Roadmap](brain/ModernRoadmap.md) để biết chi tiết về kế hoạch phát triển.

### **Phase 1: Foundation** (Weeks 1-4)
- [x] Project setup và basic structure
- [ ] Design system implementation
- [ ] Authentication system
- [ ] Basic CRUD operations

### **Phase 2: Core Features** (Weeks 5-8)
- [ ] Project management
- [ ] Task management với Kanban
- [ ] Real-time features
- [ ] File upload system

### **Phase 3: Advanced Features** (Weeks 9-12)
- [ ] Chat system
- [ ] Analytics & reports
- [ ] Git integration
- [ ] Export functionality

### **Phase 4: Optimization** (Weeks 13-16)
- [ ] Performance optimization
- [ ] Testing coverage
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Material-UI](https://mui.com/) - React component library
- [MongoDB](https://www.mongodb.com/) - NoSQL database

---

<div align="center">

**Made with ❤️ by the SprintFlow Team**

[![GitHub stars](https://img.shields.io/github/stars/dangkhoa45/sprint-flow?style=social)](https://github.com/dangkhoa45/sprint-flow/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dangkhoa45/sprint-flow?style=social)](https://github.com/dangkhoa45/sprint-flow/network/members)
[![GitHub issues](https://img.shields.io/github/issues/dangkhoa45/sprint-flow)](https://github.com/dangkhoa45/sprint-flow/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/dangkhoa45/sprint-flow)](https://github.com/dangkhoa45/sprint-flow/pulls)

</div>
