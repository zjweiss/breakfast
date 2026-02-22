# Audit-Ready AI (Base Scaffold)

This repository now contains the **base project structure** for a Next.js + Supabase implementation of an audit-first document platform for regulated industries.

## Included

- Next.js App Router starter with strict TypeScript.
- Tailwind CSS setup with dark-mode defaults.
- Initial dashboard-style landing page shell.
- Supabase SQL migration for core multi-tenant and audit schema.
- `database.types.ts` for strongly typed Supabase usage.

## Project Structure

- `app/` - App Router routes/layout.
- `styles/` - Global Tailwind styles.
- `lib/supabase/database.types.ts` - Generated/maintained DB type contract.
- `supabase/migrations/0001_initial_schema.sql` - Core DB schema + vector search function.

## Notes

The upload-and-analyze API pipeline (Gemini summarization, PII detection, categorization, embedding generation) should be implemented next as API routes/edge functions against this schema.

## Demo Instructions

Use the steps below to run a local demo of the scaffold:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the Next.js app**

   ```bash
   npm run dev
   ```

3. **Open the dashboard shell**

   Visit [http://localhost:3000](http://localhost:3000) to view the base UI.

4. **(Optional) Validate strict TypeScript setup**

   ```bash
   npm run typecheck
   ```

5. **(Optional) Prepare Supabase migration flow**

   - Ensure Supabase CLI is installed.
   - Create/link a project.
   - Apply SQL from `supabase/migrations/0001_initial_schema.sql`.

### What this demo currently proves

- App Router + Tailwind baseline is working.
- Dark-mode-first dashboard shell renders.
- Database schema and typed contract are present for upcoming upload/analyze work.
