# 🛠 Team Workflows — CEO Office Toolkit

Bộ toolkit chia sẻ cho AI agents (Gravity, ClaudeCode) — **gọi là có, dùng ở bất kỳ dự án nào**.

## Cấu trúc

```
team-workflows/
├── directive-check.md      ← /directive-check — Kiểm tra chỉ đạo 5T
├── send-to-tg.md           ← /send-to-tg — Gửi file qua Telegram
├── package.json            ← Dependencies tự cài
├── scripts/
│   └── send-to-telegram.js ← Script gửi file/text qua Telegram bot
└── node_modules/           ← Tự cài bằng npm install
```

## Cài đặt vào project mới

```bash
# 1. Symlink toolkit vào project
ln -sf /Volumes/ESUHAI/Projects/team-workflows /path/to/your-project/.agents/workflows

# 2. Cài dependencies (chỉ cần chạy 1 lần)
cd /Volumes/ESUHAI/Projects/team-workflows && npm install
```

## Workflows hiện có

| Slash Command | Mô tả | Tools |
|---|---|---|
| `/directive-check` | Kiểm tra trạng thái 50 Chỉ đạo 5T | NotebookLM, Notion |
| `/send-to-tg` | Gửi file/text qua Telegram bot | `scripts/send-to-telegram.js` |

## Yêu cầu .env cho scripts

Project sử dụng toolkit cần có `.env` (ở root hoặc `automation/`) với:

```env
# Telegram (cho /send-to-tg)
TELEGRAM_BOT_TOKEN=xxx    # hoặc BOT_TOKEN
ADMIN_CHAT_ID=xxx         # Chat ID nhận file
```

## Thêm workflow mới

1. Tạo file `.md` ở root repo với YAML frontmatter
2. Tên file = slash command (ví dụ: `deploy.md` → `/deploy`)
3. Nếu cần script → thêm vào `scripts/`, cập nhật `package.json`
4. Commit + push → tất cả projects tự nhận được
