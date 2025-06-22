# 🚀 SprintFlow - Modern Project Management Platform

<div align="center">

![SprintFlow Logo](https://img.shields.io/badge/SprintFlow-Project%20Management-blue?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-MVP%20Complete-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated-brightgreen?style=for-the-badge)

**Modern project management platform for software development teams**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

**SprintFlow** là nền tảng quản lý dự án hiện đại dành cho các nhóm phát triển phần mềm. Dự án tập trung vào workflow tự động, real-time collaboration và giao diện hiện đại, giúp tối ưu hóa quy trình làm việc và tăng hiệu suất cho team.

**🎯 Trạng thái hiện tại:** MVP đã hoàn thành với CI/CD pipeline tự động, coding standards comprehensive, và foundation vững chắc cho việc phát triển tiếp theo.

---

## ✨ Features

- **Quản lý dự án & công việc**: Tạo, phân quyền, theo dõi tiến độ, thành viên, file đính kèm
- **Real-time collaboration**: Hạ tầng sẵn sàng cho live updates, chat, thông báo
- **Role-based access**: Phân quyền Admin/Manager/Member
- **Modern UI/UX**: Responsive, dark/light theme, Material-UI
- **Automated CI/CD**: GitHub Actions với automated testing, linting, issue management
- **Code Quality**: ESLint, Prettier, Husky, component size limits
- **Comprehensive Documentation**: Coding standards, conventions, CI/CD guide

---

## 🛠️ Tech Stack

- **Backend**: NestJS, MongoDB, JWT, Session, Mongoose
- **Frontend**: Next.js 15, Material-UI, SWR, React Context
- **DevOps**: Docker, pnpm workspace, TypeScript, ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions, Automated testing, Issue automation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+, pnpm 8+, Docker, MongoDB

### 1. Clone & Setup

```bash
git clone git@github.com:dangkhoa45/sprint-flow.git
cd sprint-flow
cp .env.example .env # Tạo file môi trường
pnpm install
```

### 2. Start Development

```bash
pnpm dev:all         # Chạy cả frontend & backend
# hoặc từng phần:
pnpm dev:server      # Backend: http://localhost:8005
pnpm dev:web         # Frontend: http://localhost:8000
# hoặc bằng Docker:
docker compose up -d
```

### 3. Truy cập

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:8005/api
- **API Docs**: http://localhost:8005/api/docs

---

## 📁 Project Structure

```
SprintFlow/
├── apps/
│   ├── server/   # NestJS Backend
│   └── web/      # Next.js Frontend
├── docs/         # Documentation
│   ├── CODING_STANDARDS.md
│   ├── CONVENTIONS.md
│   ├── CI_CD_GUIDE.md
│   ├── PROJECT_ANALYSIS_AND_FUTURE_TASKS.md
│   └── ROADMAP.md
├── .github/      # CI/CD Workflows
├── docker-compose.yml
└── pnpm-workspace.yaml
```

**Kiến trúc tổng thể:** Dự án sử dụng mô hình Monorepo với pnpm workspace, backend NestJS (RESTful API, MongoDB), frontend Next.js (App Router, Material-UI), quản lý bằng Docker, CI/CD tự động, và documentation comprehensive.

---

## 🔧 Development

```bash
# Một số lệnh hữu ích
pnpm dev:all          # Chạy cả frontend & backend
pnpm build:server     # Build backend
pnpm build:web        # Build frontend
pnpm test             # Chạy test
pnpm lint             # Kiểm tra code style
pnpm format           # Format code với Prettier
```

---

## 📚 Documentation

### 📋 **Coding Standards & Conventions**

- **[CODING_STANDARDS.md](docs/CODING_STANDARDS.md)** - Quy tắc tổng quan, best practices, workflow
- **[CONVENTIONS.md](docs/CONVENTIONS.md)** - Quy tắc chi tiết về naming, commit, React/TS
- **[CI_CD_GUIDE.md](docs/CI_CD_GUIDE.md)** - Hướng dẫn CI/CD và automation

### 📊 **Project Planning**

- **[PROJECT_ANALYSIS_AND_FUTURE_TASKS.md](docs/PROJECT_ANALYSIS_AND_FUTURE_TASKS.md)** - Phân tích hiện trạng và kế hoạch phát triển
- **[ROADMAP.md](docs/ROADMAP.md)** - Roadmap chi tiết theo giai đoạn

### 🔗 **API Documentation**

- Swagger UI: http://localhost:8005/api/docs

---

## ⚙️ CI/CD Pipeline

Dự án có CI/CD pipeline tự động với các tính năng:

### 🔄 **Automated Workflows**

- **Linting & Type-checking**: ESLint, TypeScript validation
- **Testing**: Automated testing cho frontend và backend
- **Building**: Automated build process
- **Code Quality**: Prettier formatting, component size limits

### 🤖 **Issue Automation**

- **Auto-update checkboxes**: Tự động cập nhật task checkboxes dựa trên commit messages
- **Auto-close issues**: Tự động đóng issues khi tất cả tasks hoàn thành
- **Commit validation**: Enforce conventional commits và Jira format
- **PR comments**: Tự động comment progress trên Pull Requests

### 📝 **Commit Message Standards**

```bash
# Conventional Commits
feat(auth): add JWT authentication system #1
fix(tasks): resolve task assignment bug #2

# Jira Format
SPRINT-1: add JWT authentication system
SPRINT-2, SPRINT-3: implement user management
```

---

## 🤝 Contributing

Chào mừng mọi đóng góp! Hãy tuân thủ các quy tắc sau:

### 📋 **Quy trình Contributing**

1. **Đọc documentation**: [CODING_STANDARDS.md](docs/CODING_STANDARDS.md) và [CONVENTIONS.md](docs/CONVENTIONS.md)
2. **Tạo branch**: `dev/feature-name` hoặc `fix/issue-description`
3. **Commit theo chuẩn**: Conventional Commits hoặc Jira format
4. **Tạo Pull Request**: Với description chi tiết và checklist
5. **Code review**: Đảm bảo code quality và test coverage

### 🎯 **Code Quality Requirements**

- ✅ ESLint và Prettier pass
- ✅ TypeScript strict mode
- ✅ Component size < 200 lines
- ✅ Test coverage đầy đủ
- ✅ Documentation cập nhật

### 📝 **Commit Message Examples**

```bash
# Feature
feat(projects): add project templates system #15

# Bug fix
fix(auth): resolve login validation issue #23

# Documentation
docs(api): update authentication endpoints #8

# Jira format
SPRINT-5: implement real-time notifications
```

---

## 📊 Project Status

### ✅ **Đã hoàn thành (MVP)**

- ✅ Authentication & Authorization system
- ✅ Project & Task management
- ✅ User management với role-based access
- ✅ Modern UI/UX với Material-UI
- ✅ CI/CD pipeline tự động
- ✅ Comprehensive documentation
- ✅ Code quality enforcement

### 🔄 **Đang phát triển**

- 🔄 Real-time collaboration features
- 🔄 Advanced Kanban board
- 🔄 WebSocket integration

### ❌ **Kế hoạch tương lai**

- ❌ Analytics & Reporting system
- ❌ Production deployment
- ❌ Advanced integrations

---

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by the SprintFlow Team

**🚀 Ready for production development!**

</div>
