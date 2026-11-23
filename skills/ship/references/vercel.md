# Shipping on Vercel (Schoolyard)

**How it deploys:** Vercel deploys the repo's **production branch**, which is
whatever is set in Vercel (usually the GitHub default branch). Schoolyard's is
currently `claude/trusting-lamport-7tjtib`, not `main`. Every other branch and
PR gets a Preview deployment, linked in the PR's checks and comments.

**Before merging:** open the Preview URL from the PR checks and run `verify-ui`
against it. Previews use Vercel's "Preview" environment variables, which can
differ from production.

**Confirming it's live:** run `is-live.sh` against the production domain. Builds
usually finish in 1–3 minutes. GitHub's deployments API shows the status:
`gh api repos/OWNER/REPO/deployments --jq '.[0] | {sha, environment, created_at}'`.

**When production looks old:**
- Check the deployment actually targeted production. A push to a non-production
  branch only makes a preview.
- A failed build leaves the previous deployment live. Read the build log in the
  PR check before changing code.
- Vercel caches at the edge per deployment, so a new deployment gets fresh
  caches. A stale page is usually the browser or a service worker.

**Gotchas:**
- With Supabase Auth, the site URL and redirect URLs in Supabase must include the
  production domain *and* the preview domains you test sign-in on.
- `NEXT_PUBLIC_*` variables are baked in at build time. Changing one needs a redeploy.
