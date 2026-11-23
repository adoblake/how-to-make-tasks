# Shipping a Shopify theme (Very Rare, CVRBOY)

**How it deploys:** a theme goes live when it's **published** in the store
admin. Getting code to the store is separate:
- `shopify theme push` uploads to a theme. Push to an *unpublished* theme for
  review, never straight to the live one unless the client says so.
- Or the store connects the GitHub repo (Online Store → Themes → Add theme →
  Connect from GitHub). That theme then follows its branch automatically.

**Before handing over:**
- `shopify theme check` passes with no offenses.
- Share the unpublished theme's preview link (`shopify theme push` prints it) with
  the client, along with a short explainer: what changed, screenshots, and what they
  need to do in the admin.
- Every new section has editor settings. The client should be able to change copy
  and images without code.

**Publishing is the client's call.** Ask before publishing or overwriting the
live theme. These are client stores (Dalton for Very Rare).

**Confirming it's live:** after the client publishes, run `is-live.sh` against
the storefront with text only the new theme has. Shopify's CDN is usually quick,
but the browser may hold old assets.

**Gotchas:**
- Store data isn't in the repo: products, collections, menus and pages live in
  the admin. A theme that expects a collection handle or menu needs those
  created. List them in the handoff, the way Very Rare's README does.
- No store access (no `--store` credentials) means you can't preview live. Verify
  against the static prototype instead, and say so.
- Customizations the client makes in the theme editor live in
  `config/settings_data.json` and `templates/*.json`. Pull them
  (`shopify theme pull`) before pushing, or you'll overwrite their changes.
