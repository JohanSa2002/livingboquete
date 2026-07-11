## Development

Copy `.env.example` to `.env` and fill in the Supabase and admin auth values before running the admin panel, leads form, or `npm run seed` locally.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Supabase

The admin CMS (places/events/posts/rentals/gallery) and the leads form are backed by Supabase Postgres (`src/lib/supabase.ts`), using the service role key server-side only — RLS is enabled on every table with no public policies. Schema lives in `supabase/migrations/0001_init.sql`; apply it to a project via the Supabase SQL editor or `supabase db push`. Seed sample content with `npm run seed` (reads `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` from `.env`).

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
