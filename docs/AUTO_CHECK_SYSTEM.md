# 🤖 Auto-Check System Documentation

## 📋 Tổng quan

Hệ thống Auto-Check Issues là một CI/CD workflow tự động phân tích code changes và cập nhật trạng thái các công việc trong GitHub Issues dựa trên những thay đổi thực tế trong code.

## 🎯 Mục tiêu

- **Tự động theo dõi tiến độ:** Check/uncheck các công việc khi code được push
- **Giảm công việc thủ công:** Không cần manually update issue status
- **Tăng tính minh bạch:** Team có thể thấy ngay công việc nào đã hoàn thành
- **Cải thiện workflow:** Tích hợp với development process

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│  GitHub Actions  │───▶│  Issue Update   │
│   / PR          │    │   Workflow       │    │   (Auto-Check)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Task Mapping     │
                       │ Configuration    │
                       └──────────────────┘
```

## 📁 Cấu trúc file

```
.github/
├── workflows/
│   └── auto-check-issues.yml    # GitHub Actions workflow
├── task-mapping.json            # Mapping giữa code và tasks
scripts/
├── update-task-mapping.sh       # Script quản lý task mapping
docs/
└── AUTO_CHECK_SYSTEM.md         # Documentation này
```

## 🚀 Cách sử dụng

### 1. Thiết lập ban đầu

```bash
# Tạo issues với checkbox format
./generate_issues.sh

# Tạo task mapping từ issues.json
./scripts/update-task-mapping.sh generate

# Validate task mapping
./scripts/update-task-mapping.sh validate
```

### 2. Thêm task mapping mới

```bash
# Thêm mapping cho task cụ thể
./scripts/update-task-mapping.sh add 1 "Create Task entity" \
  "apps/server/src/modules/tasks/entities/*.ts" \
  "apps/server/src/modules/tasks/entities/task.entity.ts"

# Thêm mapping cho frontend component
./scripts/update-task-mapping.sh add 1 "Create Task component" \
  "apps/web/components/tasks/*.tsx" \
  "apps/web/app/(local)/tasks/*.tsx"
```

### 3. Quản lý task mapping

```bash
# Xem tất cả mappings
./scripts/update-task-mapping.sh list

# Xóa mapping
./scripts/update-task-mapping.sh remove "Create Task entity"

# Validate mapping
./scripts/update-task-mapping.sh validate
```

## ⚙️ Cấu hình Task Mapping

### Format JSON

```json
{
  "version": "1.0",
  "description": "Mapping between code file patterns and issue tasks",
  "tasks": [
    {
      "task_id": "Tên công việc chính xác trong checkbox",
      "issue_number": 1,
      "patterns": [
        "apps/server/src/modules/tasks/entities/*.ts",
        "apps/web/components/tasks/*.tsx"
      ],
      "description": "Mô tả ngắn gọn"
    }
  ]
}
```

### Pattern Matching

Hệ thống sử dụng regex patterns để match files:

- `apps/server/src/modules/tasks/entities/*.ts` - Tất cả file .ts trong thư mục entities
- `apps/web/components/tasks/*.tsx` - Tất cả file .tsx trong thư mục components/tasks
- `apps/web/app/(local)/tasks/.*` - Tất cả file trong thư mục tasks

### Task ID Format

Task ID phải khớp chính xác với nội dung checkbox trong issue:

```markdown
- [ ] Cần tạo Task entity với các trường
- [ ] Cần implement TaskController, TaskService
```

→ Task ID: `"Cần tạo Task entity với các trường"`

## 🔄 Workflow hoạt động

### 1. Trigger Events

Workflow được trigger khi:
- Push code lên `main` hoặc `develop` branch
- Tạo Pull Request vào `main` hoặc `develop` branch

### 2. Phân tích thay đổi

```yaml
- name: Get changed files
  run: |
    # Lấy danh sách file đã thay đổi
    git diff --name-only HEAD~1...HEAD > changed_files.txt
```

### 3. Match với Task Mapping

```yaml
- name: Analyze code changes
  run: |
    # So sánh file changes với patterns trong task mapping
    TASK_MATCHES=$(echo "$TASK_MAPPING" | jq -r --arg file "$file" '
      .tasks[] | 
      select(.patterns[] | test($file)) | 
      .task_id
    ')
```

### 4. Cập nhật Issues

```yaml
- name: Update issues with completed tasks
  run: |
    # Cập nhật checkbox từ [ ] thành [x]
    UPDATED_BODY=$(echo "$CURRENT_BODY" | sed "s/- \[ \] $task_id/- [x] $task_id/")
    gh issue edit "$ISSUE_NUMBER" --body "$UPDATED_BODY"
```

## 📊 Kết quả

### 1. Issue được cập nhật tự động

```markdown
**Chi tiết:**
- [x] Cần tạo Task entity với các trường  ← Đã được check tự động
- [ ] Cần implement TaskController, TaskService
- [ ] Cần tạo frontend components cho task management
```

### 2. PR Comments

Khi tạo Pull Request, hệ thống sẽ comment:

```markdown
## 🤖 Auto-Analysis Results

**Changed files:** ["apps/server/src/modules/tasks/entities/task.entity.ts"]

**Tasks completed:** 1
**New tasks detected:** 0

### Completed Tasks:
- ✅ Cần tạo Task entity với các trường

---
*This analysis was performed automatically by CI/CD*
```

### 3. Workflow Summary

GitHub Actions sẽ hiển thị summary:

```markdown
## 📊 Auto-Check Summary

**Event:** push
**Branch:** feature/task-management
**Commit:** abc123

**Files changed:** 1
**Tasks completed:** 1
**New tasks detected:** 0
```

## 🛠️ Tùy chỉnh nâng cao

### 1. Thêm pattern matching phức tạp

```json
{
  "task_id": "Implement authentication flow",
  "patterns": [
    "apps/server/src/modules/auth/.*\\.ts",
    "apps/web/components/auth/.*\\.tsx",
    "apps/web/actions/apiLogin\\.ts"
  ]
}
```

### 2. Conditional Task Completion

Bạn có thể thêm logic phức tạp hơn trong workflow:

```yaml
- name: Advanced analysis
  run: |
    # Kiểm tra nội dung file thay vì chỉ tên file
    if grep -q "TaskController" "$file"; then
      echo "Found TaskController implementation"
    fi
```

### 3. Multiple Issue Updates

Một task có thể update nhiều issues:

```json
{
  "task_id": "Implement database migration",
  "issue_number": [1, 5, 10],
  "patterns": ["apps/server/src/migrations/*.ts"]
}
```

## 🔧 Troubleshooting

### 1. Task không được check

**Nguyên nhân:**
- Task ID không khớp chính xác
- Pattern không match với file path
- Issue number không đúng

**Giải pháp:**
```bash
# Kiểm tra task mapping
./scripts/update-task-mapping.sh list

# Validate mapping
./scripts/update-task-mapping.sh validate

# Test pattern matching
echo "apps/server/src/modules/tasks/entities/task.entity.ts" | grep -E "apps/server/src/modules/.*/entities/.*\.ts"
```

### 2. Workflow không chạy

**Nguyên nhân:**
- Branch không đúng (main/develop)
- Permissions không đủ
- Syntax error trong workflow

**Giải pháp:**
```bash
# Kiểm tra workflow syntax
gh workflow view auto-check-issues.yml

# Kiểm tra permissions
gh repo view --json permissions
```

### 3. Performance issues

**Nguyên nhân:**
- Quá nhiều patterns
- File mapping quá lớn
- Rate limiting

**Giải pháp:**
- Tối ưu patterns
- Chia nhỏ task mapping
- Thêm caching

## 📈 Best Practices

### 1. Task ID Naming

```markdown
✅ Tốt: "Cần tạo Task entity với các trường"
❌ Xấu: "Create entity"
```

### 2. Pattern Design

```json
✅ Tốt: ["apps/server/src/modules/tasks/entities/*.ts"]
❌ Xấu: ["*.ts"]
```

### 3. Issue Organization

- Mỗi issue nên có 5-10 tasks
- Tasks nên có mức độ chi tiết phù hợp
- Sử dụng labels để phân loại

### 4. Regular Maintenance

```bash
# Cập nhật mapping hàng tuần
./scripts/update-task-mapping.sh validate

# Clean up old mappings
./scripts/update-task-mapping.sh list | grep "old-task"
```

## 🔮 Tính năng tương lai

- [ ] Support cho multiple repositories
- [ ] Advanced pattern matching với regex
- [ ] Integration với project management tools
- [ ] Analytics và reporting
- [ ] Slack/Discord notifications
- [ ] Custom webhook support

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:

1. Kiểm tra logs trong GitHub Actions
2. Validate task mapping
3. Test pattern matching
4. Tạo issue với label `auto-check-system`

---

*Hệ thống Auto-Check được thiết kế để tự động hóa quy trình quản lý dự án và tăng hiệu suất development team.* 