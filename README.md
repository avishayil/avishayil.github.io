# avishay.co.il

Personal site for Avishay Bar — Security Architect · Cloud & DevOps · Full-Stack.

Built with [Astro](https://astro.build). Minimal dark-editorial design; open-source
projects and articles are pulled live at build time from GitHub and Medium.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Content

- **Open source** — fetched from GitHub (`avishayil`). Curate the homepage list via
  `FEATURED_REPOS` in `src/lib/github.ts`.
- **Posts & Notes** — combines live Medium articles with curated LinkedIn posts in
  `src/lib/posts.ts` (Medium via `src/lib/medium.ts`; LinkedIn entries are hand-added).
- **Speaking** — edit `src/content/talks/*.md`.
- **Services** — edit `src/content/services/*.md`.
- **Identity & social links** — `src/lib/site.ts`.

Both GitHub and Medium fetches fall back to a committed snapshot if the network is
unavailable at build time, so builds never fail on a fetch hiccup.

## Deploy

Pushes to `master` deploy via GitHub Actions (`.github/workflows/deploy.yml`).
The repository's **Pages source must be set to "GitHub Actions"** (Settings → Pages).
`public/CNAME` preserves the `avishay.co.il` custom domain.

## License

MIT
