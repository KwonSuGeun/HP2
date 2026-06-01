<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project structure (required)

This repo uses **`src/`**. Do not follow Next.js doc examples that put shared UI under `app/components/`.

| Kind | Path |
|------|------|
| Routes | `src/app/` only (`page.tsx`, `layout.tsx`, `route.ts`, …) |
| Components | `src/components/` |
| Utilities | `src/lib/` |
| Static files | `public/` |

**Never** create `src/app/components/` or `@/app/components/...`. Import shared UI from `@/components/...`.

# Backend (separate repo/folder)

DB and MyBatis live in **`../hospital-backend`** (Spring Boot, port 8080). This repo is frontend only; call the API via `NEXT_PUBLIC_API_URL`.
