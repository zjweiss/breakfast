export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen p-10">
      <section className="mx-auto grid max-w-6xl gap-6">
        <header className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Audit-Ready AI</h1>
          <p className="mt-2 text-sm text-slate-300">
            Base scaffold for a multi-tenant, compliance-focused document platform.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="font-medium">Upload & Analyze</h2>
            <p className="mt-1 text-sm text-slate-400">PDF intake, PII checks, classification, and semantic indexing.</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="font-medium">Audit Trail</h2>
            <p className="mt-1 text-sm text-slate-400">Chronological event log with actor, IP address, and user agent.</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="font-medium">Natural Language Search</h2>
            <p className="mt-1 text-sm text-slate-400">Vector-based document retrieval using Supabase pgvector.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
