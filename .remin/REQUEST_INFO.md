# RE:MIND - Request for Change Details

To produce a minimal, PR-ready patch I need the following details. Please fill them in below
and paste relevant file excerpts if available.

## 1) Goal (one clear sentence)
Example: "Require JWT authentication for POST /api/events so only signed-in users can create events."

**Your goal:**
[ ]

## 2) Acceptance criteria (bullet points)
Example:
- Unauthenticated requests to POST /api/events return 401.
- Authenticated requests create an event and return 201 + JSON of the created event.
- Unit tests covering 401 and 201 scenarios are included.
- No DB schema changes required.

**Your acceptance criteria:**
- [ ]
- [ ]
- [ ]
- [ ]

## 3) Relevant file excerpts or error traces (copy/paste here)
- app/api/events/route.ts: (please paste the file or the failing section)
- app/api/push/subscribe/route.ts: (if related)
- app/api/auth/[...nextauth]/route.ts or auth config
- public/sw.js and public/manifest.json (if PWA changes)

**Your file excerpts:**
```
[ Paste relevant code here ]
```

## 4) Test runner and package manager
- package manager: npm | pnpm | yarn
- test runner: jest | vitest | none

**Your setup:**
- Package manager: [ ]
- Test runner: [ ]

## 5) Environment variable names (do not share secrets)
- e.g., NEXTAUTH_SECRET, DATABASE_URL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY

**Your environment variables:**
- [ ]
- [ ]
- [ ]

## 6) Any additional constraints
- e.g., must work on Vercel serverless; prefer SSE over WebSocket; avoid new dependencies

**Your constraints:**
- [ ]
- [ ]

---

After you provide these, I will:
- Propose the smallest possible patch and call out risks and edge cases.
- Produce a unified diff with code, tests, and documentation.
- Provide exact commands to run and expected outcomes.
