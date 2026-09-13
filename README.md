# Portfolio — Harshul Gupta

Live at **[harshul.is-a.dev](https://harshul.is-a.dev)**
(also reachable at the underlying Vercel URL, e.g. `portfolio-five-liart-11.vercel.app`)

```
index.html          the whole site — structure, styles, and behavior in one file
api/leetcode.js     cached LeetCode proxy (Vercel serverless function)
Harshul_Resume.pdf  linked from the Resume button — keep this filename exact
README.md           this file
```

## How it's deployed

The repo is connected to Vercel via GitHub. Any push to `main` redeploys
automatically:

```bash
git add .
git commit -m "your change"
git push
```

No manual `vercel` command is needed day to day — that connection already
does it. The custom domain `harshul.is-a.dev` is registered through
[is-a.dev](https://github.com/is-a-dev/register), a free subdomain registry
that works by merging a JSON file into their public repo. That registration
lives in **a different repo** (`register`, not this one) — this README only
covers the portfolio itself.

## LeetCode section

The stats and heatmap are fetched live on every page load from `LC_USER` (set
near the top of the `<script>` in `index.html`). Four sources are tried in
parallel — your own `/api/leetcode` endpoint first, then three public
mirrors — and the UI updates the moment any of them responds, so a slow or
down mirror doesn't stall the section.

**`/api/leetcode` only runs once deployed to Vercel.** Static file servers
(`python3 -m http.server`, VS Code Live Server, etc.) can't execute it, so
testing locally that way only exercises the public-mirror fallbacks — which
is fine for a quick look, but don't debug a real problem against it. To test
the actual endpoint locally:

```bash
npx vercel dev
```

If the whole section ever shows nothing, it's almost always one of:

- **Opened via `file:///...`** instead of a server. A page loaded from disk
  has no origin, so the browser blocks every request it makes.
- **A sandboxed preview** (some embedded browser previews block outbound
  network calls entirely).
- **LeetCode's own submission-privacy setting** — check
  Settings → Privacy on leetcode.com that Progress/Submissions are public.

None of these are bugs in the code; serving over `http(s)` on a real domain,
which is exactly what `harshul.is-a.dev` already does, resolves the first two.

### Hard-coded fallback (optional)

If you ever want the section to render instantly with zero network
dependency, there's an escape hatch. Open this URL while logged out:

```
https://leetcode-api-faisalshohag.vercel.app/harshul17
```

Copy the JSON response, then in `index.html` find:

```js
const LC_FALLBACK = null;
```

and paste the object in place of `null`. Live sources still run on top and
overwrite it if they succeed, so this is a snapshot that self-heals once a
live source responds — not a replacement for the real fetch.

## Things to keep in sync as your situation changes

- **`LC_USER`** near the top of the script — if your LeetCode handle changes.
- **The availability line** in the hero (currently: *"Open to internships
  from January 2027, and full-time roles from June 2027"*) — update as those
  dates pass or your status changes.
- **`Harshul_Resume.pdf`** — replace the file in place; the link doesn't need
  to change as long as the filename stays exact.
- **Work / Projects / Achievements** — each is a plain repeated block in
  `index.html`; copy an existing `<article class="entry">` (Work, Projects) or
  `<div class="win">` (Achievements) to add another one.

## Domain setup, if you ever need to redo it

Registering or editing `harshul.is-a.dev` means editing files in a **separate**
GitHub repo you forked: `github.com/<your-username>/register`. The two
records that make the domain work:

- `domains/harshul.json` — an `A` record pointing at Vercel's IP
- `domains/_vercel.harshul.json` — a `TXT` record proving you own the domain
  in Vercel (the exact value is shown in Vercel → Settings → Domains when you
  add a new domain there)

Any change to either file needs a fresh pull request to
`is-a-dev/register`, filling out their PR template completely — an
incomplete template fails their automated check before a human ever reviews
it.
