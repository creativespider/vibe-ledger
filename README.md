# Vibe Ledger — Starter

## One-liner
A tiny app that tracks your vibe-coding work: prompts, AI draft, your edits, reasons, and evidence—then generates a public Authorship Report.

## 8-Hour Plan
Hour 0–1: Scaffold Next.js app (pages: /entries, /entries/new, /report/[project])  
Hour 1–2: Add Postgres (Neon/Supabase) + Entry table + CRUD routes  
Hour 2–3: Build /entries/new form; redirect to /entries  
Hour 3–4: Add Clerk email login; gate /entries*; /report public  
Hour 4–5: Build /report/[project] grouped by type; copy-link button  
Hour 5–6: Deploy to Vercel; set env vars; smoke test  
Hour 6–7: Generate tests (happy + negative); quick security pass  
Hour 7–8: Polish list UI; fill Prompt → Output → Review log; make a short demo

## Copy/Paste Prompts
- Scaffold a Next.js app “Vibe Ledger” with pages: /entries (list), /entries/new (form), /report/[project]. Clean, simple styles.
- Add Postgres via Neon/Supabase; create Entry table {id, userId, project, prompt, aiDraft, yourEdits, why, evidence, commitHash, type, createdAt}. CRUD routes with validation + proper HTTP codes.
- Add Clerk email login; /entries* require login tied to userId; /report/[project] is public read-only.
- Generate unit tests for create-entry route + a negative test for missing fields. Summarize the diff.
