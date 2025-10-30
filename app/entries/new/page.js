export default function NewEntryPage() {
  return (
    <main style={{ padding: '24px', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '12px' }}>New Entry</h1>
      <form method="post" action="/api/entries" style={{ display: 'grid', gap: '12px', maxWidth: 720 }}>
        <label>
          <div>User ID</div>
          <input name="user_id" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>Project</div>
          <input name="project" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>Type (UI | API | test | security)</div>
          <input name="type" required style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>Prompt</div>
          <textarea name="prompt" required rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>AI Draft</div>
          <textarea name="ai_draft" rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>Your Edits</div>
          <textarea name="edits" rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>Why</div>
          <textarea name="why" rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <label>
          <div>Evidence</div>
          <textarea name="evidence" rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }} />
        </label>
        <button type="submit" style={{ padding: '10px 14px', background: '#111', color: '#fff', border: 'none' }}>
          Create
        </button>
      </form>
    </main>
  );
}


