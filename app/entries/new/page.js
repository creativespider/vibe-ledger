"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const entryTypes = ["UI", "API", "test", "security"];

export default function NewEntryPage() {
  const [form, setForm] = useState({
    project: "",
    type: entryTypes[0],
    prompt: "",
    ai_draft: "",
    edits: "",
    why: "",
    evidence: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onField(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.status === 201) {
      router.push("/entries");
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d?.details || "Error—please check fields");
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 540, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1 style={{ textAlign: "center", margin: 24 }}>New Entry</h1>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          Project
          <input name="project" value={form.project} onChange={onField} required style={{ width: "100%", padding: 8, border: "1px solid #ddd" }} />
        </label>
        <label>
          Type
          <select name="type" value={form.type} onChange={onField} required style={{ width: "100%", padding: 8, border: "1px solid #ddd" }}>
            {entryTypes.map(option =>
              <option key={option} value={option}>{option}</option>
            )}
          </select>
        </label>
        <label>
          Prompt
          <textarea name="prompt" value={form.prompt} onChange={onField} required rows={2} style={{ width: "100%", padding: 8, border: "1px solid #ddd" }} />
        </label>
        <label>
          AI Draft
          <textarea name="ai_draft" value={form.ai_draft} onChange={onField} rows={2} style={{ width: "100%", padding: 8, border: "1px solid #ddd" }} />
        </label>
        <label>
          Edits
          <textarea name="edits" value={form.edits} onChange={onField} rows={2} style={{ width: "100%", padding: 8, border: "1px solid #ddd" }} />
        </label>
        <label>
          Why
          <textarea name="why" value={form.why} onChange={onField} rows={2} style={{ width: "100%", padding: 8, border: "1px solid #ddd" }} />
        </label>
        <label>
          Evidence
          <textarea name="evidence" value={form.evidence} onChange={onField} rows={2} style={{ width: "100%", padding: 8, border: "1px solid #ddd" }} />
        </label>
        <button type="submit" style={{ padding: "12px", background: "#266", color: "#fff", fontWeight: 600, border: "none", marginTop: 8 }}>
          {loading ? "Saving..." : "Create Entry"}
        </button>
        {error && <div style={{ color: "#a00", marginTop: 8, textAlign: "center" }}>{error}</div>}
      </form>
    </main>
  );
}


