# Rahul Sharma — Portfolio

Single-page portfolio: React, Vite, Framer Motion, and a Three.js hero scene. Content is driven from one file so you can tweak copy and links without hunting through components.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist` locally |
| `npm run lint` | ESLint |

## Project layout

| Path | Role |
| --- | --- |
| `src/data/portfolioData.js` | Site copy, links, projects, contact, status repo |
| `src/App.jsx` | Page structure and sections |
| `src/components/` | Command palette, hero canvas, insights, etc. |
| `public/` | Static assets (favicon, images, PDFs) |

## Before you ship

1. Add project images under `public/images/` (names must match `portfolioData` → work projects).
2. Add your résumé PDF under `public/` and set `socialLinks.resume`.
3. Set `status.githubRepo` in `portfolioData` to your public `owner/repo` if you want the status strip.

## Deploy

Build output is static files in `dist/`.

### Vercel (recommended)

1. Push this repo to GitHub (e.g. [PortfolioDevFuture](https://github.com/rahul24sharma/PortfolioDevFuture)).
2. Go to [vercel.com](https://vercel.com) → **Add New…** → **Project** → import that repository.
3. Vercel should detect **Vite**. Confirm:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. No environment variables are required for a normal deploy.
5. Click **Deploy**.

`vercel.json` sets the Vite framework, build/output, and SPA **rewrites** so deep links fall back to `index.html`. The `.vercel` folder (from `npx vercel link`) is gitignored.

**CLI (optional):** `npx vercel` for a preview, `npx vercel --prod` for production.

### Other hosts

Netlify, Cloudflare Pages, or GitHub Pages: publish the `dist` folder after `npm run build` (same as locally).

When your **production URL** is final, add `<link rel="canonical" href="…">` and `og:url` in `index.html` (and optionally `og:image` under `public/`) so social previews point at the right domain.

## Repo

[github.com/rahul24sharma/PortfolioDevFuture](https://github.com/rahul24sharma/PortfolioDevFuture)

## License

MIT — see [LICENSE](./LICENSE).
