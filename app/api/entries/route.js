import { NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool = global.vibePool;
if (!pool) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  global.vibePool = pool;
}

function badRequest(details) {
  return NextResponse.json({ error: 'Bad Request', details }, { status: 400 });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    const values = [];
    let where = '';
    if (project) {
      where = 'WHERE project = $1';
      values.push(project);
    }
    const result = await pool.query(
      `SELECT id, user_id, project, type, prompt, ai_draft, edits, why, evidence, created_at
       FROM entries
       ${where}
       ORDER BY created_at DESC
       LIMIT 200`,
      values
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error('entries.get_error', { message: err?.message });
    return NextResponse.json(
      { error: 'Server Error', details: 'Unexpected error' },
      { status: 500 }
    );
  }
}

async function parseBody(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  const form = await request.formData();
  const obj = {};
  for (const [k, v] of form.entries()) obj[k] = typeof v === 'string' ? v : '';
  return obj;
}

export async function POST(request) {
  let body;
  try {
    body = await parseBody(request);
  } catch {
    return badRequest('Body must be valid JSON or form data');
  }

  const required = ['user_id', 'project', 'type', 'prompt'];
  for (const key of required) {
    if (!body?.[key] || typeof body[key] !== 'string') {
      return badRequest(`Missing or invalid field: ${key}`);
    }
  }
  const validTypes = new Set(['UI', 'API', 'test', 'security']);
  if (!validTypes.has(body.type)) {
    return badRequest('type must be one of UI|API|test|security');
  }

  const {
    user_id,
    project,
    type,
    prompt,
    ai_draft = '',
    edits = '',
    why = '',
    evidence = '',
  } = body;

  try {
    const result = await pool.query(
      `INSERT INTO entries (id, user_id, project, type, prompt, ai_draft, edits, why, evidence)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [user_id, project, type, prompt, ai_draft, edits, why, evidence]
    );
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (err) {
    console.error('entries.post_error', { message: err?.message });
    return NextResponse.json(
      { error: 'Server Error', details: 'Unexpected error' },
      { status: 500 }
    );
  }
}


