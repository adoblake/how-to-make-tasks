# Shipping on GitHub Pages (Bucketlist, 2DAY, Portfolio, Shypit review site)

**How it deploys:** one of two ways. Check the repo:
- **From a branch** (Bucketlist: `npm run publish:web` updates `gh-pages`). Pushing
  source to `main` does *not* publish by itself, so run the publish step.
- **From GitHub Actions** (Portfolio's `publish.yml`, Shypit's `pages.yml`). Merging
  to the workflow's branch publishes once the workflow succeeds.

**Confirming it's live:**
- Latest Pages build: `gh api repos/OWNER/REPO/pages/builds/latest --jq '{status, commit, created_at}'`.
  For Actions-based Pages, check the workflow run:
  `gh api repos/OWNER/REPO/actions/runs --jq '.workflow_runs[0] | {name, status, conclusion, head_sha}'`.
- Then run `is-live.sh` against the public URL. The Pages CDN can lag a few minutes.

**When production looks old:** it's usually the service worker. These are
installable PWAs with cache-first workers:
- Bump the worker's cache version on every shell change (2DAY: `CACHE` in `sw.js`).
- Make sure the new worker activates and the page reloads once (2DAY's
  `update.html` is the recovery path for stuck users).
- For static CSS/JS, refresh cache-busting tags (Portfolio: `python3 asset-versions.py`).

**Gotchas:**
- Pages serves from a subpath (`/REPO/`). Absolute `/asset` paths break. Test the
  built output at the same subpath, as Bucketlist's `test:phone` does.
- Pages is static: no server routes, no secrets. Anything needing a key belongs on
  another host.
