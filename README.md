# slashuntitled.com

Portfolio site for [`slash-untitled`](https://www.instagram.com/slash.untitled/). Live at <https://slashuntitled.com>. Inspired by [ellenole.com](https://ellenole.com).

Stack: Nuxt 3 + Tailwind CSS, statically generated, deployed to GitHub Pages on every push to `main`.

## Develop

Requires Node 22+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Build / preview locally

```bash
npm run generate          # builds .output/public/
npx serve .output/public  # serve the static output
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which runs `npm run generate` and publishes `.output/public/` to GitHub Pages. The `public/CNAME` file pins the site to `slashuntitled.com`.

## Edit content

| What                                 | Where                                            |
|--------------------------------------|--------------------------------------------------|
| Display name, project list, About, socials | [`content/site.json`](./content/site.json) |
| Project images                       | `public/projects/<slug>/` (must match `folder` in site.json) |
| Site-wide font                       | `assets/fonts/` (registered in `assets/css/main.css`) |
| Layout shell, header, footer         | `app.vue`                                        |

Drop `.jpg/.jpeg/.png/.webp/.gif/.avif` files into the matching `public/projects/<slug>/` folder. The build script lists them automatically and bakes the URLs into the rendered HTML — no code changes needed.

## Project layout

```
app.vue                       Root layout (header, main, footer, password gate)
error.vue                     Custom 404 / error page
nuxt.config.ts                SEO defaults, prerender config, Tailwind module
tailwind.config.js            Tailwind content paths
assets/
  css/main.css                Base typography, @font-face
  fonts/                      Site fonts
composables/
  useSite.ts                  Typed accessor for content/site.json
content/
  site.json                   All editable text content
pages/
  index.vue                   Home (selected work + nav + socials)
  about.vue                   About
  archive.vue                 Archive
  [slug].vue                  Project detail (renders images from public/projects/<folder>)
public/
  CNAME                       slashuntitled.com — pins custom domain
  .nojekyll                   Tells GitHub Pages not to run Jekyll
  favicon.svg
  projects/<slug>/            Image folders, one per project
server/api/
  project-images.get.ts       Lists images at build/dev time only
.github/workflows/
  deploy.yml                  CI: build + deploy to GitHub Pages
```
