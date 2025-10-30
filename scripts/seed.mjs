import "dotenv/config"; 
import { Pool } from 'pg';
import fs from 'fs/promises';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('Missing DATABASE_URL');
const pool = new Pool({ connectionString: dbUrl });
const sql = await fs.readFile(new URL('../sql/001_create_entries.sql', import.meta.url), 'utf8');
await pool.query(sql);
await pool.query(
  'INSERT INTO entries (project,type) VALUES ($1,$2),($3,$4)',
  ['demo1', 'UI', 'demo2', 'API']
);
console.log('Rows inserted');
await pool.end();
