# ICF practice scaffold — hospital-quality full-stack scenario

A timed rehearsal for a 90-minute screen-share interview, in the shape of the
role (React + Node + PostgreSQL + AWS, CMS hospital-quality reporting). This
is **not** ICF's actual test — no one has published that. It is a practice
scenario built from the job description's stack and the team's work, so you can
rehearse talking while you code before AI help is banned on the call itself.

## Run it

Server (zero dependencies, Node 18+):

```bash
cd server
node server.js        # in one terminal — API on http://localhost:3001
node test.js          # in another — 18 checks; all fail until you implement
```

Client (React + Vite):

```bash
cd client
npm install
npm run dev           # http://localhost:5173, /api proxied to :3001
```

## The timed run (~65 minutes, tonight — not tomorrow morning)

1. **Node API, ~25 min** — implement `GET /api/hospitals` and
   `POST /api/compare` in `server/server.js` per the spec in its header
   comment. Run `node test.js` until green. Say edge cases out loud as you
   go: empty result set, invalid measure name, page beyond the last page.
2. **React table, ~25 min** — implement `client/src/HospitalsTable.jsx`
   (filter dropdown and fetch plumbing are already wired in `App.jsx`):
   sortable column headers, loading / error / empty states. This is the
   deliberate React stretch — your production proof is Angular.
3. **Talk-through, ~15 min, no coding** — how would you index the
   PostgreSQL query behind the filter? Why paginate instead of returning
   everything for hundreds of thousands of daily users? Where would caching
   sit? Lean on your real PostgreSQL story (indexing + transaction
   boundaries, p95 down 55%). Do not claim production Terraform depth — it
   is on their stack but not your resume.

Optional 10-minute warm-up only if time remains: one binary-tree traversal
(the single Glassdoor data point suggesting a classic data-structure
question could appear — a possibility, not a prediction).

## Data

`server/data/hospitals.json` — 24 mock hospitals (including Queen's,
Straub, Kaiser Moanalua, Adventist Castle in HI) with four quality scores
each: readmission, mortality, safety, experience. Scores are invented for
practice; they are not real CMS data.
