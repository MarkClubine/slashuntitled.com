# slashuntitled.com

Portfolio site for `slash-untitled`. Inspired by [ellenole.com](https://ellenole.com).

Stack: Nuxt 3 + Tailwind CSS, content driven by `content/site.json`.

## Develop

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Edit content

- `content/site.json` — name, project list, archive list, About text, social handle, email
- `public/projects/<Folder Name>/` — drop project images here. The folder name must match the `folder` field in `site.json`. Any `.jpg/.jpeg/.png/.webp/.gif/.avif` files are listed and rendered automatically by the project page.

## Build / preview

```bash
npm run build
npm run preview
```

Static export:

```bash
npm run generate
```

## Project layout

- `app.vue` — root layout, peach inner-glow frame, wordmark, accessibility button
- `pages/index.vue` — home (selected work list, nav, socials)
- `pages/about.vue` — about page
- `pages/archive.vue` — archive page
- `pages/[slug].vue` — individual project page; lists images from `public/projects/<folder>/`
- `content/site.json` — all editable text content
- `public/projects/` — image folders, one per project
- `server/api/project-images.get.ts` — server endpoint that lists image files for a given folder
- `composables/useSite.ts` — typed accessor for the JSON content
- `assets/css/main.css` — base typography + glow frame styles
