create extension if not exists "uuid-ossp";
create extension if not exists vector;

create type public.user_role as enum ('admin', 'auditor', 'member');
create type public.document_status as enum ('uploaded', 'processing', 'analyzed', 'failed');
create type public.document_category as enum ('contract', 'invoice', 'health_record', 'legal', 'unknown');
create type public.risk_level as enum ('low', 'medium', 'high', 'critical');
create type public.action_type as enum ('upload', 'view', 'download', 'edit', 'delete', 'analyze', 'search');
create type public.tag_source as enum ('ai', 'user');

create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  compliance_score numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  file_path text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  mime_type text not null,
  status public.document_status not null default 'uploaded',
  summary text,
  pii_detected boolean not null default false,
  pii_findings jsonb not null default '{}'::jsonb,
  category public.document_category not null default 'unknown',
  risk_level public.risk_level not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_embeddings (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  token_count integer not null check (token_count > 0),
  embedding vector(768) not null,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  tag text not null,
  source public.tag_source not null default 'ai',
  confidence numeric(5,4) not null default 0.5,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  document_id uuid references public.documents(id) on delete set null,
  action_type public.action_type not null,
  ip_address inet,
  browser_user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index documents_org_created_idx on public.documents (organization_id, created_at desc);
create index audit_logs_doc_created_idx on public.audit_logs (document_id, created_at desc);
create index document_embeddings_vector_idx on public.document_embeddings using ivfflat (embedding vector_cosine_ops);

create or replace function public.match_document_chunks(
  query_embedding vector(768),
  target_org_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    de.id,
    de.document_id,
    de.content,
    1 - (de.embedding <=> query_embedding) as similarity
  from public.document_embeddings de
  where de.organization_id = target_org_id
  order by de.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.document_download_allowed(doc_id uuid, actor_id uuid)
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from public.audit_logs al
    join public.documents d on d.id = doc_id
    where al.document_id = d.id
      and al.organization_id = d.organization_id
      and al.user_id = actor_id
      and al.action_type in ('view', 'analyze')
  );
$$;
