# 🗺️ SprintFlow - Roadmap Phát triển Chi tiết (Stack: Next.js/NestJS/MongoDB)

Roadmap này được xây dựng dựa trên stack công nghệ cụ thể của dự án, tập trung vào việc ra mắt sản phẩm cốt lõi (MVP) nhanh chóng, sau đó mở rộng các tính năng hợp tác và nâng cao.

---

## 🎯 Trạng thái Hiện tại (Tháng 12/2024)

### ✅ **Đã hoàn thành 100%**
- ✅ **Nền tảng & Cài đặt Dự án**: Monorepo, Docker, TypeScript, Environment
- ✅ **User Management & Bảo mật**: JWT, MongoDB, Authentication, Authorization
- ✅ **Project & Task Management**: CRUD operations, basic UI/UX
- ✅ **CI/CD Pipeline & Automation**: GitHub Actions, automated testing, issue management
- ✅ **Coding Standards & Conventions**: Comprehensive documentation, commit rules, code quality

### 🔄 **Đang phát triển**
- 🔄 Real-time collaboration features
- 🔄 Advanced UI components (Kanban board)

### ❌ **Chưa bắt đầu**
- ❌ Analytics & Reporting system
- ❌ Production deployment
- ❌ Advanced features & integrations

---

## Giai đoạn 1: MVP - Cốt lõi của Quản lý Công việc 🚀 ✅ **HOÀN THÀNH**

**Mục tiêu:** Xây dựng một sản phẩm tối thiểu (MVP) vững chắc, giải quyết bài toán cốt lõi: cho phép người dùng đăng ký, tạo dự án và quản lý công việc bằng stack công nghệ đã chọn.

### **Module 1.1: 🏗️ Nền tảng & Cài đặt Dự án** ✅ **HOÀN THÀNH**
*Đây là bước chuẩn bị không thể thiếu, tạo ra bộ khung xương cho toàn bộ dự án.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                                                                          | Trạng thái   |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- |
| **🚀 Backend / Infra**    | - Khởi tạo project backend với **NestJS**.<br>- Cấu trúc thư mục theo chuẩn NestJS (`modules`, `controllers`, `services`).<br>- Thiết lập `Dockerfile` tối ưu cho ứng dụng NestJS.<br>- Thiết lập `docker-compose.yml` để chạy các service: `nest-backend`, `next-frontend`, và `mongodb`. | ✅ Hoàn thành |
| **🎨 Frontend / UI/UX**   | - Khởi tạo project frontend với **Next.js** (sử dụng App Router).<br>- Cài đặt và cấu hình **MUI (Material-UI)** làm thư viện component chính.<br>- Tùy chỉnh theme (màu sắc, font) cho MUI.<br>- Thiết lập `Dockerfile` tối ưu cho ứng dụng Next.js.                                      | ✅ Hoàn thành |
| **⚙️ CI/CD**              | - Tạo workflow `.github/workflows/ci.yml` cơ bản với các job: `lint`, `test`, `build` cho cả frontend và backend.                                                                                                                                                                          | ✅ Hoàn thành |
| **🎯 Definition of Done** | - Lệnh `docker-compose up --build` chạy thành công toàn bộ ứng dụng trên local.<br>- Pipeline CI/CD trên GitHub Actions báo xanh khi push code.<br>- Giao diện có thể sử dụng các component từ MUI.                                                                                        | ✅ Hoàn thành |

### **Module 1.2: 🔐 User Management & Bảo mật (NestJS + JWT)** ✅ **HOÀN THÀNH**
*Cho phép người dùng tham gia và tương tác an toàn với hệ thống.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                                                                                                                                                                                                                           | Trạng thái   |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------- |
| **🚀 Backend**            | - **Database (MongoDB):** Tích hợp **Mongoose** vào NestJS. Tạo `UserSchema` với các trường cần thiết.<br>- **Authentication:** Sử dụng các module `@nestjs/passport` và `@nestjs/jwt`.<br>- **API Endpoints:**<br>  - `POST /api/auth/register`: Tạo người dùng, hash mật khẩu bằng `bcrypt`.<br>  - `POST /api/auth/login`: Xác thực, tạo và trả về **JWT**.<br>- **Authorization:** Tạo `JwtAuthGuard` để bảo vệ các route cần xác thực. | ✅ Hoàn thành |
| **🎨 Frontend**           | - **Pages:** Tạo các trang `/login` và `/register` bằng các component của **MUI**.<br>- **Forms:** Xây dựng form đăng nhập/đăng ký với validation (sử dụng `react-hook-form`).<br>- **State Management:** Lưu thông tin người dùng và token.<br>- **Routing:** Tạo "Protected Routes" chỉ cho phép truy cập sau khi đăng nhập.                                                                                                              | ✅ Hoàn thành |
| **🎯 Definition of Done** | - Người dùng có thể đăng ký, đăng nhập và đăng xuất.<br>- Dữ liệu người dùng được lưu trữ an toàn trong MongoDB.<br>- Các trang yêu cầu đăng nhập được bảo vệ bằng JWT.                                                                                                                                                                                                                                                                     | ✅ Hoàn thành |

### **Module 1.3: 🏢 Project & Task Management (Core)** ✅ **HOÀN THÀNH**
*Đây là trái tim của MVP, giải quyết nhu cầu cốt lõi của người dùng.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                                                                                                                                                                     | Trạng thái   |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------- |
| **🚀 Backend**            | - **Database (Mongoose):** Tạo `ProjectSchema` và `TaskSchema`, thiết lập quan hệ giữa chúng.<br>- **API Endpoints:**<br>  - CRUD cho Projects (`/api/projects`).<br>  - CRUD cho Tasks (`/api/projects/{projectId}/tasks`).<br>  - Quản lý thành viên trong dự án.<br>- **Authorization:** Đảm bảo chỉ Manager của dự án mới có quyền sửa/xóa dự án.                                 | ✅ Hoàn thành |
| **🎨 Frontend**           | - **Pages:**<br>  - `/dashboard/projects`: Trang danh sách dự án (dùng `Grid` và `Card` của **MUI**).<br>  - `/dashboard/projects/{id}`: Trang chi tiết dự án, hiển thị **Kanban Board**.<br>- **Functionality:**<br>  - Xây dựng bảng Kanban với thư viện như `@hello-pangea/dnd` (đã được tối ưu cho React 18+).<br>  - Mở `Modal` của **MUI** để xem/chỉnh sửa chi tiết công việc. | ✅ Hoàn thành |
| **🎯 Definition of Done** | - Người dùng có thể tạo, xem, sửa, xóa dự án và công việc.<br>- Bảng Kanban hoạt động mượt mà với chức năng kéo-thả để thay đổi trạng thái task.<br>- Dữ liệu được lưu trữ và truy xuất từ MongoDB.                                                                                                                                                                                   | ✅ Hoàn thành |

### **Module 1.4: ⚙️ CI/CD & Code Quality** ✅ **HOÀN THÀNH** 🆕
*Thiết lập quy trình phát triển tự động và đảm bảo chất lượng code.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                       | Trạng thái   |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- |
| **🚀 GitHub Actions**     | - **Automated Workflows:** Linting, type-checking, testing, building<br>- **Issue Automation:** Auto-update checkboxes, auto-close completed issues<br>- **Commit Validation:** Conventional commits và Jira format support             | ✅ Hoàn thành |
| **🎨 Code Quality**       | - **ESLint & Prettier:** TypeScript rules, formatting<br>- **Husky & Lint-staged:** Pre-commit hooks<br>- **Component Limits:** 200 lines max per component<br>- **Documentation:** CODING_STANDARDS.md, CONVENTIONS.md, CI_CD_GUIDE.md | ✅ Hoàn thành |
| **🎯 Definition of Done** | - Mọi commit đều được validate tự động<br>- Code quality được enforce<br>- Issues được track và update tự động<br>- Documentation đầy đủ và cập nhật                                                                                    | ✅ Hoàn thành |

---

## Giai đoạn 2: Nâng cao Trải nghiệm & Hợp tác 💬📊 🔄 **ĐANG PHÁT TRIỂN**

**Mục tiêu:** Bổ sung các tính năng giúp làm việc nhóm hiệu quả hơn, trực quan hóa tiến độ và tăng cường tương tác.

### **Module 2.1: ⚡ Real-time & Notifications (NestJS Gateway)** 🔄 **ĐANG PHÁT TRIỂN**
*Mang lại sự sống động và tương tác tức thì cho ứng dụng.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                                                                                                                        | Trạng thái        |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| **🚀 Backend**            | - Tích hợp **NestJS Gateway** sử dụng adapter **WebSocket** (`socket.io`).<br>- Tạo một `EventsGateway` để xử lý các kết nối và sự kiện.<br>- Phát các sự kiện (`task:updated`, `comment:added`) đến các client trong cùng một "phòng" (room, tương ứng với project ID).<br>- Tạo `NotificationSchema` và logic gửi thông báo real-time. | 🔄 Đang phát triển |
| **🎨 Frontend**           | - Sử dụng thư viện `socket.io-client` để kết nối đến NestJS Gateway.<br>- Lắng nghe sự kiện để cập nhật UI Kanban Board mà không cần refresh.<br>- Hiển thị `Badge` của **MUI** trên biểu tượng chuông thông báo khi có tin mới.                                                                                                         | 🔄 Đang phát triển |
| **🎯 Definition of Done** | - Khi một người dùng thay đổi trạng thái task, tất cả người dùng khác thấy thay đổi ngay lập tức.<br>- Người dùng nhận được thông báo trong ứng dụng khi có hoạt động liên quan.                                                                                                                                                         | 🔄 Đang phát triển |

### **Module 2.2: 🎯 Advanced Kanban Board** 🔄 **ĐANG PHÁT TRIỂN**
*Nâng cao trải nghiệm quản lý task với drag-and-drop và real-time updates.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                                 | Trạng thái        |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------- |
| **🚀 Backend**            | - **Task Status Management:** API endpoints cho drag-and-drop operations<br>- **Real-time Updates:** WebSocket events cho task status changes<br>- **Task Dependencies:** Support cho task dependencies và blocking                               | 🔄 Đang phát triển |
| **🎨 Frontend**           | - **Drag & Drop:** Implement với `@hello-pangea/dnd`<br>- **Real-time UI:** Live updates khi task status thay đổi<br>- **Task Cards:** Detailed information, assignees, due dates<br>- **Filters & Search:** Advanced filtering trong Kanban view | 🔄 Đang phát triển |
| **🎯 Definition of Done** | - Kanban board hoạt động mượt mà với drag-and-drop<br>- Real-time updates khi có thay đổi<br>- Advanced filtering và search functionality                                                                                                         | 🔄 Đang phát triển |

---

## Giai đoạn 3: Hoàn thiện và Mở rộng 🌐✨ ❌ **CHƯA BẮT ĐẦU**

**Mục tiêu:** Biến SprintFlow thành một công cụ mạnh mẽ, có khả năng tùy biến, tích hợp và cung cấp các phân tích sâu sắc.

### **Module 3.1: 📈 Reports & Data Export (PDF)** ❌ **CHƯA BẮT ĐẦU**
*Tổng hợp thông tin và cung cấp dữ liệu để ra quyết định.*

| Hạng mục công việc       | Chi tiết kỹ thuật                                                                                                                                                                                                                                                                                                     | Trạng thái     |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| **🚀 Backend**            | - **Export to PDF:** Tạo một API endpoint riêng (`POST /api/reports/export-pdf`).<br>- Sử dụng **Puppeteer** trên server để: <br>  1. Mở một trang trình duyệt headless.<br>  2. Render một template HTML (với dữ liệu báo cáo) bằng một templating engine.<br>  3. In trang đó ra file PDF và trả về cho người dùng. | ❌ Chưa bắt đầu |
| **🎨 Frontend**           | - Tạo trang `/dashboard/reports` với các biểu đồ (dùng `Recharts` hoặc `Chart.js`, tương thích tốt với Next.js).<br>- Thêm nút "Xuất báo cáo PDF" để gọi API backend và kích hoạt việc tải file.                                                                                                                      | ❌ Chưa bắt đầu |
| **🎯 Definition of Done** | - Manager có thể xem các báo cáo trực quan về tiến độ dự án.<br>- Báo cáo có thể được xuất ra một file PDF có định dạng đẹp từ phía server.                                                                                                                                                                           | ❌ Chưa bắt đầu |

### **Module 3.2: 🚀 Triển khai & CI/CD Nâng cao** ❌ **CHƯA BẮT ĐẦU**
*Đưa sản phẩm lên môi trường production và tự động hóa quy trình.*

| Hạng mục công việc           | Chi tiết kỹ thuật                                                                                                                                                                                                                                                                                                                                                                                                                                     | Trạng thái     |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| **🚀 Backend / Infra**        | - Cấu hình biến môi trường cho production (DATABASE_URL, JWT_SECRET, etc.) trên **Railway**.<br>- Tối ưu hóa `Dockerfile` cho production (multi-stage builds).                                                                                                                                                                                                                                                                                        | ❌ Chưa bắt đầu |
| **⚙️ CI/CD (GitHub Actions)** | - Tạo workflow deploy riêng (`deploy.yml`). Trigger khi merge vào nhánh `main`.<br>- **Cách 1 (Build trên CI):**<br>  - Build các image Docker `backend` và `frontend` rồi đẩy lên GitHub Container Registry (GHCR).<br>  - Cấu hình Railway để deploy từ image trên GHCR.<br>- **Cách 2 (Build trên Railway):**<br>  - Cấu hình GitHub Actions để chỉ trigger một webhook deploy trên Railway khi có commit mới. Railway sẽ tự kéo code về và build. | ❌ Chưa bắt đầu |
| **🎯 Definition of Done**     | - Mỗi khi có thay đổi được merge vào `main`, ứng dụng sẽ được tự động triển khai lên Railway.<br>- Ứng dụng chạy ổn định trên môi trường production.                                                                                                                                                                                                                                                                                                  | ❌ Chưa bắt đầu |

---

## 📊 Tổng kết Tiến độ

### ✅ **Giai đoạn 1: MVP (100% Hoàn thành)**
- ✅ Nền tảng & Cài đặt Dự án
- ✅ User Management & Bảo mật
- ✅ Project & Task Management
- ✅ CI/CD & Code Quality

### 🔄 **Giai đoạn 2: Real-time & Collaboration (25% Hoàn thành)**
- 🔄 Real-time & Notifications (đang phát triển)
- 🔄 Advanced Kanban Board (đang phát triển)

### ❌ **Giai đoạn 3: Analytics & Production (0% Hoàn thành)**
- ❌ Reports & Data Export
- ❌ Production Deployment

---

## 🎯 **Ưu tiên tiếp theo**

1. **Real-time Collaboration** - Hoàn thành WebSocket integration
2. **Advanced Kanban Board** - Implement drag-and-drop và real-time updates
3. **Production Deployment** - Triển khai lên Railway
4. **Analytics Dashboard** - Thêm charts và reports

---

