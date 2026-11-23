---
name: ship
description: Get a change from branch to merged and live. Use when the user says ship it, merge, open a PR, deploy, go live, or "is this ready".
---

# Ship: branch → reviewed → merged → live → finished

Writing code is cheap now. What stalls our projects is the last mile: PRs left
open, migrations not run, a deploy that serves a stale cache, a decision nobody
made. Shipping means all the way to live.

1. **Checks.** Run every check listed under "Verify" in the repo's `CLAUDE.md`.
   If any part touches the UI, run `verify-ui`. Fix failures; don't report them
   as "pre-existing" unless you showed that on `main`.

2. **Second opinion.** Have a *fresh* agent review the diff (`/code-review`, or a
   subagent that didn't write the code). The author shouldn't grade its own work.
   Fix what's real; say what you skipped and why.

3. **Order-dependent steps.** List anything that must happen outside the code, in
   order: database migrations, environment variables, provider dashboard settings,
   DNS. If code depends on a migration, the migration goes first, and the PR
   says so at the top.

4. **The PR.** Write for a reviewer who wasn't here: what changed and why,
   before/after screenshots for UI, what was verified, what wasn't, and the
   decisions the user needs to make (as a short numbered list, each with a
   recommendation). Don't let a PR wait on questions buried in the description.

5. **Live.** After merge, confirm the production URL serves the new version
   (fetch it and look for the change; check in a cache-free browser context). If
   it doesn't, find out why: build failure, cache, or wrong branch.

6. **Close the loop.** Delete the merged branch, update `BRIEF.md` decisions if
   one changed, and capture any lesson with `write-it-down`.

For client projects, finish with a one-page explainer the client can read: what
changed, a screenshot or GIF first, what they need to do, and what's next.
