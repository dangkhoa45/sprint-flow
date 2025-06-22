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
