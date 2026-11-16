/* Netlify Function: отправка заявки с сайта в Telegram */
function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return { statusCode: 503, body: JSON.stringify({ ok: false, error: 'Telegram не настроен на хостинге' }) };
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

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, parse_mode: 'HTML', text }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.description || 'Telegram API error');
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 502, body: JSON.stringify({ ok: false, error: error.message }) };
  }
};
