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

**SprintFlow** là nền tảng quản lý dự án hiện đại dành cho các nhóm phát triển phần mềm. Dự án tập trung vào workflow tự động, real-time collaboration và giao diện hiện đại, giúp tối ưu hóa quy trình làm việc và tăng hiệu suất cho team.

---

## ✨ Features
- **Quản lý dự án & công việc**: Tạo, phân quyền, theo dõi tiến độ, thành viên, file đính kèm
- **Real-time collaboration**: Hạ tầng sẵn sàng cho live updates, chat, thông báo
- **Role-based access**: Phân quyền Admin/Manager/Member
- **Modern UI/UX**: Responsive, dark/light theme, Material-UI
- **Tích hợp Git & Analytics**: (planned)

---

## 🛠️ Tech Stack
- **Backend**: NestJS, MongoDB, JWT, Session, Mongoose
- **Frontend**: Next.js 15, Material-UI, SWR, React Context
- **DevOps**: Docker, pnpm workspace, TypeScript, ESLint, Prettier

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
├── docker-compose.yml
└── pnpm-workspace.yaml
```

**Kiến trúc tổng thể:** Dự án sử dụng mô hình Monorepo với pnpm workspace, backend NestJS (RESTful API, MongoDB), frontend Next.js (App Router, Material-UI), quản lý bằng Docker, dễ mở rộng và phát triển.

---

## 🔧 Development
```bash
# Một số lệnh hữu ích
pnpm dev:all          # Chạy cả frontend & backend
pnpm build:server     # Build backend
pnpm build:web        # Build frontend
pnpm test             # Chạy test
pnpm lint             # Kiểm tra code style
```

---

## 📊 API Documentation
- Swagger UI: http://localhost:8005/api/docs

---

## 🤝 Contributing
Chào mừng mọi đóng góp! Hãy tạo branch mới, commit theo chuẩn, và mở pull request.

---

## 📄 License
Dự án này được cấp phép theo [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by the SprintFlow Team
</div>
