import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function fetchProjectEntries(project) {
  try {
    const h = headers();
    const host = h.get('host');
    const proto = h.get('x-forwarded-proto') || 'http';
    const base = `${proto}://${host}`;
    const res = await fetch(`${base}/api/entries?project=${encodeURIComponent(project)}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function groupByType(entries) {
  const groups = { UI: [], API: [], test: [], security: [] };
  for (const e of entries) {
    if (groups[e.type]) groups[e.type].push(e);
  }
  return groups;
}

export default async function ReportPage({ params }) {
  const project = params.project;
  const entries = await fetchProjectEntries(project);
  const groups = groupByType(entries);
  return (
    <main style={{ padding: '24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '12px' }}>Report: {project}</h1>
      {Object.entries(groups).map(([type, list]) => (
        <section key={type} style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '16px 0 8px' }}>{type}</h2>
          {list.length === 0 ? (
            <div style={{ color: '#666' }}>No items</div>
          ) : (
            <ul style={{ paddingLeft: '18px' }}>
              {list.map((e) => (
                <li key={e.id}>
                  <strong>{e.prompt}</strong>{' '}
                  <span style={{ color: '#666' }}>({new Date(e.created_at).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}


