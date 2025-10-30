"use client";
import { useState, useEffect } from "react";

export default function EntriesPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ project: "", type: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then(r => r.json())
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter(e =>
    (!filters.project || e.project.toLowerCase().includes(filters.project.toLowerCase()))
    && (!filters.type || e.type === filters.type)
  );

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1 style={{ textAlign: "center", margin: 24 }}>Entries</h1>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "8px 0 24px" }}>
        <input
          placeholder="Filter project..."
          style={{ padding: 8, border: "1px solid #ddd" }}
          value={filters.project}
          onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}
        />
        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          style={{ padding: 8, border: "1px solid #ddd" }}
        >
          <option value="">All Types</option>
          {["UI", "API", "test", "security"].map(opt =>
            <option key={opt} value={opt}>{opt}</option>
          )}
        </select>
        <a href="/entries/new" style={{
          padding: "8px 14px", background: "#266", color: "#fff",
          borderRadius: 4, textDecoration: "none"
        }}>+ New Entry</a>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", margin: "auto", minWidth: 500 }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              <th style={{ border: "1px solid #e2e2e2", padding: 8 }}>Created</th>
              <th style={{ border: "1px solid #e2e2e2", padding: 8 }}>Project</th>
              <th style={{ border: "1px solid #e2e2e2", padding: 8 }}>Type</th>
            </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr><td colSpan={3} style={{ textAlign: "center", padding: 24 }}>Loading…</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: "center", color: "#888" }}>No entries</td></tr>
          ) : filtered.map(e =>
            <tr key={e.id}>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{new Date(e.created_at).toLocaleString()}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{e.project}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{e.type}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </main>
  );
}


