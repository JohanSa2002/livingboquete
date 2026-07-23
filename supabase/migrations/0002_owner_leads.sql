-- Distinguishes leads from the homepage "free guide" form (default, existing
-- behavior) from leads submitted by property owners wanting to list a rental
-- via /publicar-propiedad. Reuses the same table/admin screen with a `type`
-- discriminator instead of standing up a parallel leads pipeline.
alter table leads add column if not exists type text not null default 'guide';
alter table leads add column if not exists tipo_propiedad text;
alter table leads add column if not exists ubicacion text;
alter table leads add column if not exists mensaje text;
