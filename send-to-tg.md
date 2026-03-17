---
description: Gửi file hoặc tin nhắn từ Antigravity qua Telegram bot cho CEO
---

# Gửi file/tin nhắn qua Telegram

## Khi nào dùng

- CEO yêu cầu gửi output (báo cáo, file HTML, markdown, ảnh...) qua Telegram
- Sau khi tạo walkthrough, report, hoặc bất kỳ output nào CEO muốn nhận trên điện thoại
- Từ khóa trigger: "gửi qua telegram", "gửi file cho anh", "gửi qua bot", "nhận trên điện thoại"

## Yêu cầu

- Project cần có `.env` với `TELEGRAM_BOT_TOKEN` (hoặc `BOT_TOKEN`) và `ADMIN_CHAT_ID`
- Nếu `.env` nằm trong `automation/` thì script cũng tự tìm được

## Các bước thực hiện

// turbo-all

### 1. Gửi file

```bash
node .agents/workflows/scripts/send-to-telegram.js \
  --file "<absolute-path-to-file>" \
  --caption "📋 <Mô tả ngắn>"
```

### 2. Gửi tin nhắn text (không có file)

```bash
node .agents/workflows/scripts/send-to-telegram.js \
  --text "📋 <Nội dung tin nhắn>"
```

## Lưu ý

- File path PHẢI là đường dẫn tuyệt đối
- Caption nên ngắn gọn, có emoji để dễ đọc trên mobile
- Nếu file là ảnh (PNG/JPG/GIF/WEBP), bot sẽ tự gửi dạng photo (hiển thị inline)
- Nếu file là HTML/MD/PDF, bot gửi dạng document (download được)
- Nếu lỗi "Unauthorized" → bot token cần tạo lại qua @BotFather
- Nếu lỗi "chat not found" → CEO cần gửi /start cho bot trước
