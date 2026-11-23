# Shipping on Netlify (Phalinx, Leftovers)

**How it deploys:** each push to the production branch (usually `main`) builds
with the settings in `netlify.toml`, which override the Netlify UI. Every PR
gets a Deploy Preview, linked in the PR's checks. Review the preview before
merging.

**Before merging:** open the Deploy Preview from the PR checks
(`gh api repos/OWNER/REPO/commits/SHA/check-runs` lists them) and run `verify-ui`
against that URL, not just localhost.

**Confirming it's live:** run `is-live.sh` against the production URL. Netlify
usually publishes within a minute or two of the build finishing.

**When production looks old:**
1. Check in a cache-free browser context first. A stale tab or the browser's
   cache is the usual cause. On Leftovers, the "old gold homepage" was a cache,
   not the code.
2. If the deploy log shows the new commit published but the page is still old,
   use **Deploys → Trigger deploy → Clear cache and deploy site**. That's a
   dashboard action, so ask the user to do it, or do it only if you have access.
3. If the build failed, the previous deploy stays live. Read the deploy log;
   don't push guesses.

**Gotchas:**
- Next.js on Netlify needs the server runtime. A drag-and-drop of `.next` doesn't
  run server routes.
- Environment variables are set in the Netlify UI per context (production / deploy
  previews). A missing one in previews often explains "works in prod, broken in preview".
- Stay on free-plan features unless the user says otherwise (Leftovers is $0).
