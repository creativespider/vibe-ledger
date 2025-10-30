import { NextResponse } from 'next/server';
import { pool, ensureInitialized } from '@/lib/db';

function dbError(details, status = 500) {
  return NextResponse.json({ error: 'db', details }, { status });
}

export async function GET(request) {
  try {
    await ensureInitialized();
    const url = new URL(request.url);
    const project = url.searchParams.get('project');

    let result;
    if (project && project.trim()) {
      result = await pool.query(
        `SELECT id, project, type, prompt, ai_draft, edits, why, evidence, created_at
         FROM entries
         WHERE project ILIKE $1
         ORDER BY created_at DESC
         LIMIT 50`,
        [`%${project.trim()}%`]
      );
    } else {
      result = await pool.query(
        `SELECT id, project, type, prompt, ai_draft, edits, why, evidence, created_at
         FROM entries
         ORDER BY created_at DESC
         LIMIT 50`
      );
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    return dbError(String(err), 500);
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'validation', details: 'Invalid JSON' }, { status: 400 });
  }

  const { project, type, prompt = '', ai_draft = '', edits = '', why = '', evidence = '' } = body || {};
  const validTypes = ['UI', 'API', 'test', 'security'];
  if (!project || typeof project !== 'string') {
    return NextResponse.json({ error: 'validation', details: 'Missing or invalid project' }, { status: 400 });
  }
  if (!type || typeof type !== 'string' || !validTypes.includes(type)) {
    return NextResponse.json({ error: 'validation', details: 'Missing or invalid type' }, { status: 400 });
  }

  try {
    await ensureInitialized();
    // Temporary observability to verify received payload
    console.log('entries.post_body', { project, type, hasPrompt: !!prompt, hasEdits: !!edits });
    const result = await pool.query(
      `INSERT INTO entries (project, type, prompt, ai_draft, edits, why, evidence)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, project, type, prompt, ai_draft, edits, why, evidence, created_at`,
      [project, type, prompt, ai_draft, edits, why, evidence]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    return dbError(String(err), 500);
  }
}