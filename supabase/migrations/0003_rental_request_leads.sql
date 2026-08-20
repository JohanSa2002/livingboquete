-- Distinguishes rental-inquiry leads (sent from a property's request flow
-- on the PDP) from the homepage guide and owner-listing leads. Reuses the
-- same table/admin screen with the existing `type` discriminator instead of
-- a parallel leads pipeline (same pattern as 0002_owner_leads.sql).
alter table leads add column if not exists rental_id text;
alter table leads add column if not exists rental_name text;
alter table leads add column if not exists move_in text;
alter table leads add column if not exists duracion text;
alter table leads add column if not exists personas integer;
alter table leads add column if not exists mascotas boolean;

-- Rental-request leads accept either email or WhatsApp (celular) — not
-- both required, unlike the guide/owner forms which still require email.
alter table leads alter column email drop not null;
