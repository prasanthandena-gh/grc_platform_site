# Verity — marketing site

A self-contained, **no-build** landing page for Verity, the AI-native GRC controls-testing platform. Pure HTML/CSS/JS — nothing to compile, npm-free, deploys to GitHub Pages as-is.

```
website/
├── index.html      # the page
├── styles.css      # brand design system (graphite · sage · gold · verdict colors)
├── app.js          # live console, product gallery, lightbox, reveals, theme toggle
├── favicon.svg     # brand mark
├── og.svg          # social share card
├── assets/shots/   # real product screenshots used in the gallery
├── .nojekyll       # tell Pages to serve files verbatim
├── .gitignore      # keeps dev tooling (_capture/node_modules) out of git/Pages
├── _capture/       # dev-only Playwright script to (re)generate screenshots
└── .github/workflows/deploy.yml
```

## Preview locally

Open `index.html` directly in a browser, or serve it:

```powershell
# from the website/ folder
python -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

You have two easy paths. **Option A** (separate repo) is simplest.

### Option A — dedicated repo (recommended)

1. Create a new GitHub repo, e.g. `verity-site`.
2. Copy the **contents** of this `website/` folder into the repo root (so `index.html` is at the top level).
3. Push to `main`.
4. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   - The included `.github/workflows/deploy.yml` will publish on every push.
   - Since the files are now at the repo root, set `SITE_DIR: "."` in that workflow.
5. Your site goes live at `https://<user>.github.io/verity-site/`.

> Tip: for a root URL like `https://<user>.github.io/`, name the repo `<user>.github.io`.

### Option B — keep it as a subfolder of an existing repo

1. Move `.github/workflows/deploy.yml` to the **repo root** (`.github/workflows/deploy.yml`).
2. Leave `SITE_DIR: website` (already set) so it publishes this subfolder.
3. Settings → Pages → Source: **GitHub Actions**, then push to `main`.

### Option C — classic "/docs" Pages (no Actions)

Rename/copy this folder to `docs/` at the repo root, then
Settings → Pages → Source: **Deploy from a branch** → `main` / `/docs`.

## Custom domain

Add a `CNAME` file (one line: `verity.example.com`) next to `index.html`, then point a `CNAME` DNS record at `<user>.github.io`. Set it in Settings → Pages → Custom domain too.

## Screenshots (the product gallery)

The "Inside the product" section shows **real** screenshots captured from the running
app (dark mode), living in `assets/shots/`. They power an interactive browser-frame
gallery with thumbnail tabs, auto-advance, and a click-to-zoom lightbox.

To **regenerate** them (e.g. after UI changes), start the app locally
(frontend on `:5174`, backend on `:8004`, demo data seeded) and run:

```powershell
cd website/_capture
npm install playwright          # first time only
npx playwright install chromium # first time only
node capture.mjs                # writes PNGs into ../assets/shots/
```

Edit the `pages` array in `_capture/capture.mjs` to add/remove screens, then add a
matching `<button class="shot-tab">` in `index.html`. The `_capture/` folder is dev
tooling only — `.gitignore` keeps its `node_modules` out of git and out of the
deployed Pages artifact.

## Editing notes

- **Brand tokens** live in `:root` / `[data-theme="light"]` at the top of `styles.css`
  (sage `#5fa08f`, gold `#c9a56c`, verdict green/red/amber/blue — all lifted from the
  product design system). Change them in one place and the whole page follows.
- The hero **reasoning console** is scripted in `app.js` (`const script = [...]`) — edit
  the steps to demo a different control.
- All copy is plain HTML in `index.html`. Replace the demo CTA links (`#cta` / `#top`)
  with your real product/demo URL when you have one.
- No tracking, no external JS, two web-font requests (Inter + JetBrains Mono). Fully
  responsive and respects `prefers-reduced-motion`.
