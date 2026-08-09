## Development

Copy `.env.example` to `.env` and fill in the Supabase and admin auth values before running the admin panel, leads form, or `npm run seed` locally.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Supabase

The admin CMS (places/events/posts/rentals/gallery) and the leads form are backed by Supabase Postgres (`src/lib/supabase.ts`), using the service role key server-side only — RLS is enabled on every table with no public policies. Schema lives in `supabase/migrations/0001_init.sql`; apply it to a project via the Supabase SQL editor or `supabase db push`. Seed sample content with `npm run seed` (reads `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` from `.env`).

Image uploads in the admin CMS go to a public Supabase Storage bucket named `images` (`src/pages/api/upload.ts`, admin `type: 'image'` fields in `src/pages/admin/[section].astro`). Create the bucket once per project with `npm run setup-storage` (idempotent).

## Email (property PDF brochure)

From `/admin/leads`, the "Enviar PDF" button lets the admin pick an existing rental and an optional note, then emails the lead a branded PDF brochure of that property. The PDF is built at request time with `@react-pdf/renderer` (`src/lib/pdf/PropertyBrochure.tsx`) from the rental's Supabase data, and sent via Resend (`src/lib/email.ts`) from `src/pages/api/send-brochure.ts`. Requires `RESEND_API_KEY` (Resend dashboard) and `EMAIL_FROM` — the `EMAIL_FROM` address's domain must be verified in Resend or sends will fail. `EMAIL_REPLY_TO` is optional and doesn't need domain verification (Resend only enforces that for "from"), so it can point at any real inbox — e.g. a Gmail account the team already checks — to receive lead replies.

## Vercel

`astro.config.mjs` picks the `@astrojs/vercel` adapter automatically when `process.env.VERCEL` is set (i.e. on Vercel's build), and falls back to `@astrojs/node` otherwise (local dev, Docker). Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET`, and `ADMIN_PASS` as environment variables in the Vercel project settings.

## Docker

Build and run the production container:

```
docker build -t livingboquete .
docker run -d -p 8080:80 --name livingboquete livingboquete
```

The site is served at `http://localhost:8080`.

Stop and remove the container:

```
docker stop livingboquete && docker rm livingboquete
```

Rebuild after changes:

```
docker stop livingboquete && docker rm livingboquete
docker build -t livingboquete .
docker run -d -p 8080:80 --name livingboquete livingboquete
```

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
