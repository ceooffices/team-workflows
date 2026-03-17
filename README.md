# 🤖 Team Workflows

Shared AI agent workflows cho toàn bộ projects của CEO Office.

## Cách sử dụng

Repo này chứa các workflow files (`.md`) mà AI agents (Gravity, ClaudeCode) sẽ đọc và thực thi khi được gọi bằng slash command.

### Kết nối vào project

```bash
# Tạo symlink từ project vào repo này
ln -sf /Volumes/ESUHAI/Projects/team-workflows /path/to/your-project/.agents/workflows
```

### Workflows hiện có

| Slash Command | Mô tả |
|---|---|
| `/directive-check` | Kiểm tra trạng thái 50 Chỉ đạo 5T theo Triết lý Cố vấn Đồng hành |

## Quy tắc

- Mỗi workflow là 1 file `.md` với YAML frontmatter (`description`)
- Tên file = slash command (ví dụ: `directive-check.md` → `/directive-check`)
- Annotation `// turbo` hoặc `// turbo-all` để AI tự động chạy các bước
