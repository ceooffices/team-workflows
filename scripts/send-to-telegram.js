#!/usr/bin/env node
/**
 * send-to-telegram.js (Portable version)
 * 🛠 Toolkit: gửi file hoặc text qua Telegram bot, rồi thoát.
 * 
 * Tìm config theo thứ tự ưu tiên:
 *   1. Biến môi trường (ENV vars)
 *   2. --chat / --token args
 *   3. .env trong project gọi (cwd)
 *   4. .env trong thư mục script
 *
 * Usage:
 *   node scripts/send-to-telegram.js --file <path> [--caption "Mô tả"]
 *   node scripts/send-to-telegram.js --text "Tin nhắn"
 *   node scripts/send-to-telegram.js --file report.html --token BOT_TOKEN --chat CHAT_ID
 */

const fs = require('fs');
const path = require('path');

// ===== SMART .ENV LOADING =====
// Thử load .env từ cwd trước (project gọi), rồi fallback về thư mục script
const cwdEnv = path.join(process.cwd(), '.env');
const scriptEnv = path.join(__dirname, '..', '.env');
const automationEnv = path.join(process.cwd(), 'automation', '.env');

if (fs.existsSync(cwdEnv)) {
  require('dotenv').config({ path: cwdEnv });
} else if (fs.existsSync(automationEnv)) {
  require('dotenv').config({ path: automationEnv });
} else if (fs.existsSync(scriptEnv)) {
  require('dotenv').config({ path: scriptEnv });
}

const TelegramBot = require('node-telegram-bot-api');

// ===== PARSE ARGS =====
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    file: null,
    caption: null,
    text: null,
    chat: null,
    token: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file': case '-f':
        opts.file = args[++i]; break;
      case '--caption': case '-c':
        opts.caption = args[++i]; break;
      case '--text': case '-t':
        opts.text = args[++i]; break;
      case '--chat':
        opts.chat = args[++i]; break;
      case '--token':
        opts.token = args[++i]; break;
    }
  }

  // Resolve config: args > env
  opts.token = opts.token || process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
  opts.chat = opts.chat || process.env.ADMIN_CHAT_ID || process.env.ADMIN_USER_IDS;

  if (!opts.token) {
    console.error('✖ Bot token không tìm thấy.');
    console.error('  Cách 1: Đặt TELEGRAM_BOT_TOKEN trong .env của project');
    console.error('  Cách 2: Truyền --token <token>');
    process.exit(1);
  }

  if (!opts.chat) {
    console.error('✖ Chat ID không tìm thấy.');
    console.error('  Cách 1: Đặt ADMIN_CHAT_ID trong .env của project');
    console.error('  Cách 2: Truyền --chat <id>');
    process.exit(1);
  }

  if (!opts.file && !opts.text) {
    console.error('Usage:');
    console.error('  node send-to-telegram.js --file <path> [--caption "Mô tả"]');
    console.error('  node send-to-telegram.js --text "Tin nhắn"');
    process.exit(1);
  }

  return opts;
}

// ===== CONSTANTS =====
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.md': 'text/markdown',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.csv': 'text/csv',
};

// ===== MAIN =====
async function main() {
  const opts = parseArgs();
  const bot = new TelegramBot(opts.token); // Không polling

  try {
    if (opts.text) {
      await bot.sendMessage(opts.chat, opts.text, { parse_mode: 'HTML' });
      console.log(`✅ Đã gửi tin nhắn → chat ${opts.chat}`);
    } else if (opts.file) {
      const filePath = path.resolve(opts.file);
      if (!fs.existsSync(filePath)) {
        console.error(`✖ File không tồn tại: ${filePath}`);
        process.exit(1);
      }

      const ext = path.extname(filePath).toLowerCase();
      const fileName = path.basename(filePath);
      const caption = opts.caption || `📎 ${fileName}`;
      const fileSize = fs.statSync(filePath).size;

      console.log(`📤 Đang gửi: ${fileName} (${(fileSize / 1024).toFixed(1)} KB)...`);

      if (IMAGE_EXTS.has(ext)) {
        await bot.sendPhoto(opts.chat, filePath, { caption });
        console.log(`✅ Đã gửi ảnh → chat ${opts.chat}`);
      } else {
        await bot.sendDocument(opts.chat, filePath, { caption }, {
          filename: fileName,
          contentType: CONTENT_TYPES[ext] || 'application/octet-stream',
        });
        console.log(`✅ Đã gửi file → chat ${opts.chat}`);
      }
    }
  } catch (err) {
    console.error(`✖ Lỗi gửi Telegram: ${err.message}`);
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      console.error('💡 Bot token đã bị revoke. Tạo token mới qua @BotFather.');
    }
    if (err.message.includes('chat not found')) {
      console.error(`💡 Chat ID ${opts.chat} không hợp lệ. Gửi /start cho bot trước.`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
