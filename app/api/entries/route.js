import { NextResponse } from 'next/server';
import { pool, ensureInitialized } from '@/lib/db';

function errorRes(details, status = 500) {
  return NextResponse.json({ error: 'db', details }, { status });
}

export async function GET() {
  try {
    await ensureInitialized();
    const result = await pool.query(
      'SELECT id, project, type, created_at FROM entries ORDER BY created_at DESC LIMIT 50'
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    return errorRes(String(err), 500);
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return errorRes('Invalid JSON', 400);
  }
  const { project, type } = body || {};
  const validTypes = ['UI', 'API', 'test', 'security'];
  if (
    !project ||
    typeof project !== 'string' ||
    !type ||
    typeof type !== 'string' ||
    !validTypes.includes(type)
  ) {
    return NextResponse.json({ error: 'validation', details: 'Missing or invalid project/type' }, { status: 400 });
  }

  try {
    await ensureInitialized();
    const result = await pool.query(
      'INSERT INTO entries (project, type) VALUES ($1, $2) RETURNING id, project, type, created_at',
      [project, type]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    return errorRes(String(err), 500);
  }
}


