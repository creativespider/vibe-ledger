import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function fetchEntries() {
  try {
    const h = headers();
    const host = h.get('host');
    const proto = h.get('x-forwarded-proto') || 'http';
    const base = `${proto}://${host}`;
    const res = await fetch(`${base}/api/entries`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function EntriesPage() {
  const entries = await fetchEntries();
  return (
    <main style={{ padding: '24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '12px' }}>Entries</h1>
      <a href="/entries/new" style={{ display: 'inline-block', marginBottom: '16px' }}>New Entry</a>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Project</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Prompt</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(entries) && entries.length > 0 ? (
              entries.map((e) => (
                <tr key={e.id}>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{e.project}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{e.type}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px', maxWidth: 420, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.prompt}</td>
                  <td style={{ borderBottom: '1px solid #f0f0f0', padding: '8px' }}>{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: '12px', color: '#666' }}>No entries yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}


