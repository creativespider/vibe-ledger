import { Pool } from 'pg';
import fs from 'fs';
let pool = global._dbPool;
if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
  global._dbPool = pool;
}

let _initialized = false;
export async function ensureInitialized() {
  if (_initialized) return;
  const sql = fs.readFileSync(process.cwd() + '/sql/001_create_entries.sql', 'utf8');
  await pool.query(sql);
  _initialized = true;
}

export { pool };
