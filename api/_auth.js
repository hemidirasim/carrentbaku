const db = require('./_db');

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

async function getAdminFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies['admin_token'];
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [adminId, secret] = decoded.split(':');
    if (!adminId) return null;
    const { rows } = await db.query('SELECT id, email FROM admins WHERE id = $1 LIMIT 1', [adminId]);
    return rows[0] || null;
  } catch {
    return null;
  }
}

module.exports = { getAdminFromRequest };


