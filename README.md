# Portfolio — Harshul Gupta

```
index.html          the whole site
api/leetcode.js     cached LeetCode proxy (Vercel serverless function)
Harshul_Resume.pdf  ← add this yourself, next to index.html
```

## Why LeetCode shows nothing in a preview

The stats and heatmap are fetched at page load. Browsers block those requests
in two situations, and a preview pane is usually both:

1. **Opening the file directly** (the address bar shows `file:///...`). A page
   loaded from disk has a null origin, so every cross-origin request is refused.
2. **A sandboxed preview iframe.** Most preview panes set a content-security
   policy that blocks outbound network calls entirely.

Neither is a problem with the code. Serve the page over http and it works.

## See it working locally

From the folder containing `index.html`:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** — not the file path. The heatmap should
fill within a few seconds.

## Deploy

**Vercel** is the recommended host, because it serves `index.html` as a static
file *and* turns `api/leetcode.js` into a live endpoint with no configuration:

```bash
npm i -g vercel
vercel
```

The page calls `/api/leetcode` first and falls back to public mirrors if it
isn't there, so a static-only host (GitHub Pages, Netlify without functions)
still works — just less reliably, since those mirrors are volunteer-run and
sometimes down.

## Last resort: hard-code the data

If you'd rather not depend on any network call, open this URL in a browser tab
while logged out:

```
https://leetcode-api-faisalshohag.vercel.app/harshul17
```

Copy the whole JSON response, then in `index.html` find:

```js
const LC_FALLBACK = null;
```

and replace `null` with the pasted object. The section will render instantly
from that snapshot, with no request at all. Live sources still run on top and
overwrite it if they succeed, so the numbers self-heal once deployed — you'd
just need to re-paste occasionally to keep the offline copy fresh.

## Things to update as you go

- `LC_USER` at the top of the script, if your LeetCode handle ever changes.
- The availability line in the hero (`Open to full-time roles from June 2027`).
- Add new roles to the Work section; the layout takes any number of entries.
