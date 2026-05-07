# Onboarding — slashuntitled.com

You're an admin on the [slashuntitled.com](https://github.com/MarkClubine/slashuntitled.com) portfolio repo. Mark set things up so you can update the site without writing code — just talk to Claude inside the repo and it'll handle the edits, commits, and deploys.

Live site: <https://slashuntitled.com>

## What you can do

- Add new projects (a folder of photos + a one-line entry in a data file)
- Edit the About text, Instagram handle, contact email
- Drop new photos into existing projects
- Move projects between Selected work and Archive
- Tweak design (typography, layout) — coordinate with Mark first

## One-time setup

1. **Accept the GitHub admin invite:** <https://github.com/MarkClubine/slashuntitled.com/invitations>
2. **Install Node 22+:** <https://nodejs.org/>
3. **Install Git:** <https://git-scm.com/>
4. **Install Claude Code:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude  # follow prompts to authenticate
   ```
5. **Clone the repo:**
   ```bash
   git clone https://github.com/MarkClubine/slashuntitled.com.git
   cd slashuntitled.com
   npm install
   ```
6. **Set git identity.** If your GitHub email is private (default for new accounts), use the noreply form or pushes will be rejected. Find your noreply at <https://github.com/settings/emails> — it looks like `12345+yourusername@users.noreply.github.com`.
   ```bash
   git config user.email "ID+username@users.noreply.github.com"
   git config user.name "Your Name"
   ```

## Day-to-day

From inside the cloned `slashuntitled.com` folder:

```bash
claude
```

That opens Claude with the project's full conventions loaded (the repo's `CLAUDE.md` auto-loads — it tells Claude where content lives, what slugs to use, what the design rules are).

### Things to ask Claude

- *"Add a new project called BALENCIAGA Resort. Photos are in ~/Desktop/balenciaga/."*
- *"Update the About text to: I'm a stylist based in Paris…"*
- *"Why isn't my new project showing up on the site?"*
- *"Show me the site running locally."* (starts dev server at localhost:3000)
- *"Deploy."* (push to main; CI deploys in ~1 min)
- *"Move 'KYLER GORDON Styling' from Selected work to Archive."*
- *"Change the Instagram URL to …"*

Claude knows:
- Where editable content lives (`content/site.json`)
- Where photos go (`public/projects/<slug>/`)
- That slugs are lowercase-hyphens, no spaces
- The design is intentionally minimal (don't add headers/menus/decoration without coordinating)
- Don't `git push --force` on main (breaks the other person's clone)

## How edits go live

Every push to `main` triggers a GitHub Actions workflow that builds the site and publishes to <https://slashuntitled.com>. Takes about a minute. You can watch runs at <https://github.com/MarkClubine/slashuntitled.com/actions>.

- Small content edits (new project, photo drop, text edit) → push direct to `main`
- Design changes or anything that might break the build → use a branch + PR, check with Mark first

## Coordinating with Mark

Both of you have admin write access. The light protocol:

- **Tiny edits:** push to main, optionally mention in chat after
- **Bigger changes:** branch + PR + a quick "ok?" before merging
- **Never** `git push --force` or `git commit --amend` on `main` — it rewrites history and breaks the other clone

## If something goes wrong

- **Site not updating after push?** Check the Actions tab; the workflow might have failed. Ask Claude to look.
- **My new project doesn't appear?** Most common cause: the folder name in `public/projects/` doesn't match the `folder` field in `content/site.json`. They must be identical (lowercase, hyphens).
- **Push rejected with `GH007`?** That's the private-email issue from step 6 above — set the noreply email.
- **Anything else:** ask Claude. It has the full project context.

## Useful links

- Live site: <https://slashuntitled.com>
- Repo: <https://github.com/MarkClubine/slashuntitled.com>
- Actions (build/deploy logs): <https://github.com/MarkClubine/slashuntitled.com/actions>
- Project conventions Claude follows: [`CLAUDE.md`](https://github.com/MarkClubine/slashuntitled.com/blob/main/CLAUDE.md) in the repo
