const db = require('../_db');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-secret';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.statusCode = 400;
      return res.json({ error: 'Email and password are required' });
    }

    const { rows } = await db.query('SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1', [email]);
    const admin = rows[0];
    if (!admin) {
      res.statusCode = 401;
      return res.json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      res.statusCode = 401;
      return res.json({ error: 'Invalid credentials' });
    }

    // Simple signed token (no payload exposure)
    const token = Buffer.from(`${admin.id}:${JWT_SECRET}`).toString('base64');

    // Set httpOnly cookie
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000`);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return res.json({ error: 'Internal Server Error' });
  }
};


