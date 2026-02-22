# Audit-Ready AI (Base Scaffold)

This repository now contains the **base project structure** for a Next.js + Supabase implementation of an audit-first document platform for regulated industries.

## Included

- Next.js App Router starter with strict TypeScript.
- Tailwind CSS setup with dark-mode defaults.
- Initial dashboard-style landing page shell.
- Supabase SQL migration for core multi-tenant and audit schema.
- `database.types.ts` for strongly typed Supabase usage.
- Flask backend scaffold for the upload-and-analyze API flow.

## Project Structure

- `app/` - App Router routes/layout.
- `styles/` - Global Tailwind styles.
- `lib/supabase/database.types.ts` - Generated/maintained DB type contract.
- `supabase/migrations/0001_initial_schema.sql` - Core DB schema + vector search function.
- `backend/` - Flask API service scaffold.

## Notes

The upload-and-analyze API pipeline (Gemini summarization, PII detection, categorization, embedding generation) has an initial Flask route scaffold in `backend/app.py` and can be extended with real Supabase/Gemini integration.

## Demo Instructions

Use the steps below to run a local demo of the scaffold.

### 1) Frontend (Next.js)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the web app:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

4. Optional strict TS check:

   ```bash
   npm run typecheck
   ```

### 2) Backend (Flask)

1. Create a Python virtual environment and install deps:

   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY` when ready.

3. Start Flask API:

   ```bash
   python app.py
   ```

4. Verify health endpoint:

   ```bash
   curl http://localhost:5000/health
   ```

5. Test upload-and-analyze demo endpoint:

   ```bash
   curl -X POST http://localhost:5000/api/upload-and-analyze \
     -H 'Content-Type: application/json' \
     -d '{"file_name":"demo.pdf","organization_id":"org-123","user_id":"user-456","category":"contract","risk_level":"high"}'
   ```

### 3) Supabase Migration

- Ensure Supabase CLI is installed.
- Create/link a project.
- Apply SQL from `supabase/migrations/0001_initial_schema.sql`.

## What this demo currently proves

- App Router + Tailwind baseline is working.
- Dark-mode-first dashboard shell renders.
- Database schema and typed contract are present.
- Flask backend route shape exists for the upload-and-analyze flow and audit payload design.
