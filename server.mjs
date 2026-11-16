/* ============================================================
   Локальный сервер лендинга + отправка заявок в Telegram
   Запуск: node server.mjs   → http://localhost:3000
   ============================================================ */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 3000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

function readJson(res, body) {
  try { return JSON.parse(body); }
  catch { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' })); return null; }
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function sendToTelegram(data) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
  const { botToken, chatId } = config.telegram || {};
  if (!botToken || !chatId || botToken.startsWith('ВАШ_') || chatId.startsWith('ВАШ_')) {
    throw new Error('Telegram не настроен: заполните config.json');
  }

  const text = [
    '<b>Новая заявка с сайта</b>',
    '',
    '<b>Имя:</b> ' + escapeHtml(data.name),
    '<b>Телефон / Telegram:</b> ' + escapeHtml(data.contact),
    data.message ? '<b>О проекте:</b> ' + escapeHtml(data.message) : '',
    '',
    '<b>Время:</b> ' + escapeHtml(data.date || new Date().toLocaleString('ru-RU')),
  ].filter(Boolean).join('\n');

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, parse_mode: 'HTML', text }),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.description || 'Telegram API error');
  return result;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/request' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 10000) req.destroy(); });
    req.on('end', async () => {
      const data = readJson(res, body);
      if (!data) return;
      try {
        await sendToTelegram(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (error) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      }
    });
    return;
  }

  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/config.json') { res.writeHead(404); res.end('Not found'); return; }
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.resolve(root, '.' + urlPath);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

server.listen(port, '127.0.0.1', () => console.log(`Сайт: http://localhost:${port}`));
