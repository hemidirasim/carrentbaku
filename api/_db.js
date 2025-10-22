const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iXWbsguID14k@ep-square-paper-a4l1reo7-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};


