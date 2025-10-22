const db = require('../_db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method Not Allowed' });
  }

  // Simple protection via one-time token header
  const seedToken = process.env.SEED_TOKEN || 'allow-seed-once';
  if (req.headers['x-seed-token'] !== seedToken) {
    res.statusCode = 401;
    return res.json({ error: 'Unauthorized' });
  }

  try {
    // Create tables if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INT NOT NULL,
        price_per_day NUMERIC(10,2) NOT NULL,
        fuel_type TEXT NOT NULL,
        transmission TEXT NOT NULL,
        seats INT NOT NULL,
        image_url TEXT,
        description TEXT,
        is_available BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_price NUMERIC(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create default admin if not exists
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await db.query(
      `INSERT INTO admins (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [adminEmail, passwordHash]
    );

    return res.json({ success: true, admin: { email: adminEmail } });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return res.json({ error: 'Internal Server Error' });
  }
};


