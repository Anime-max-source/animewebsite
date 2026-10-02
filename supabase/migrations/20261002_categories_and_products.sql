-- ====================================================================
-- AnimeMax Categories & Products Schema Upgrade
-- ====================================================================

-- 1. Ensure uuid extension is available
create extension if not exists "pgcrypto";

-- 2. CREATE CATEGORIES TABLE
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    display_order integer not null default 0,
    created_at timestamp with time zone default now()
);

-- Seed initial categories if table is empty
insert into public.categories (name, slug, display_order)
values
    ('Anime Figures', 'anime-figures', 1),
    ('Keychains', 'keychains', 2),
    ('Toy Cars', 'toy-cars', 3),
    ('Posters & Wall Art', 'posters', 4),
    ('Apparel', 'apparel', 5),
    ('Accessories', 'accessories', 6)
on conflict (slug) do update set
    name = excluded.name,
    display_order = excluded.display_order;

-- Index for ordering
create index if not exists idx_categories_display_order on public.categories(display_order asc);

-- 3. UPGRADE PRODUCTS TABLE WITH MISSING COLUMNS
alter table public.products 
    add column if not exists category_id uuid references public.categories(id) on delete set null;

alter table public.products 
    add column if not exists display_section text not null default 'grid';

alter table public.products 
    add column if not exists sort_order integer not null default 0;

-- Ensure indexes exist
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_display_section on public.products(display_section);
create index if not exists idx_products_sort_order on public.products(sort_order asc);

-- 4. ROW LEVEL SECURITY (RLS) FOR CATEGORIES & PRODUCTS

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Categories RLS:
drop policy if exists "Allow public read access to categories" on public.categories;
create policy "Allow public read access to categories"
    on public.categories
    for select
    to public, anon, authenticated
    using (true);

drop policy if exists "Allow owner write access to categories" on public.categories;
create policy "Allow owner write access to categories"
    on public.categories
    for all
    to public, anon, authenticated
    using (true)
    with check (true);

-- Products RLS:
-- Ensure public read access is enabled
drop policy if exists "Allow public read access to products" on public.products;
create policy "Allow public read access to products"
    on public.products
    for select
    to public, anon, authenticated
    using (true);

-- Allow write access to products (for admin management)
drop policy if exists "Allow owner full access to products" on public.products;
drop policy if exists "Allow write access to products" on public.products;
create policy "Allow write access to products"
    on public.products
    for all
    to public, anon, authenticated
    using (true)
    with check (true);
