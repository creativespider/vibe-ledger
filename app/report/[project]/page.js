"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const types = ["UI", "API", "test", "security"];

function groupByType(entries) {
  const groups = {};
  types.forEach(type => groups[type] = []);
  entries.forEach(e => { if (groups[e.type]) groups[e.type].push(e); });
  return groups;
}

export default function ReportPage() {
  const params = useParams();
  const project = typeof params?.project === 'string' ? params.project : '';
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    if (!project) return;
    const q = encodeURIComponent(project);
    fetch(`/api/entries?project=${q}`)
      .then(r => r.json())
      .then(setEntries);
  }, [project]);

  const grouped = groupByType(entries);

  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    });
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1 style={{ textAlign: "center", margin: 24 }}>
        Report: <span style={{ color: "#095" }}>{project}</span>
      </h1>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button onClick={copyLink} style={{
          background: "#eee", border: "1px solid #ccc", color: "#222", padding: "8px 18px", borderRadius: 4, fontWeight: 500
        }}>
          {copied ? "Copied link!" : "Copy public link"}
        </button>
      </div>
      {types.map(type => (
        <section key={type} style={{ marginBottom: 24 }}>
          <h2 style={{ marginBottom: 6 }}>{type} <span style={{
            background: "#eee", borderRadius: 8, padding: "2px 12px", fontSize: 12
          }}>{grouped[type].length}</span></h2>
          {grouped[type].length === 0 ? (
            <div style={{ color: "#888" }}>No entries</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 24 }}>
              {grouped[type].map(entry =>
                <li key={entry.id} style={{ marginBottom: 10 }}>
                  <div><b>Created:</b> {new Date(entry.created_at).toLocaleString()}</div>
                  <div><b>Prompt:</b> {entry.prompt || <em style={{ color: "#bbb" }}>none</em>}</div>
                  <div><b>AI Draft:</b> <span style={{ color: "#345" }}>{entry.ai_draft || <em>none</em>}</span></div>
                  <div><b>Edits:</b> <span style={{ color: "#345" }}>{entry.edits || <em>none</em>}</span></div>
                  <div><b>Why:</b> <span style={{ color: "#345" }}>{entry.why || <em>none</em>}</span></div>
                  <div><b>Evidence:</b> <span style={{ color: "#345" }}>{entry.evidence || <em>none</em>}</span></div>
                </li>
              )}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}


