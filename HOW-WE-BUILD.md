# How we build

Based on Boris Cherny (creator of Claude Code) and his team, filtered for what we
actually do: client sites and Shopify themes, our own Next.js/Supabase products,
and static studio sites, many at once, mostly from cloud sessions.

## The loop, every project

1. **Kickoff: find the unknowns before building.** Blind-spot pass → 3–4 HTML
   directions to react to → interview one question at a time → one-page `BRIEF.md`.
   Prototypes over specs. (`/kickoff`)
2. **Build.** Give Claude the goal and let it work (auto mode). Medium effort for
   normal features. One session per job; name them.
3. **Verify: the #1 lever.** Never "done" from an edit alone: real browser, 3 widths,
   both themes, console, accessibility, cache. Say what couldn't be checked.
   High effort here. (`/verify-ui`)
4. **Ship: all the way to live.** Checks → a fresh agent reviews → out-of-code steps
   in order (migrations first) → PR with decisions up top → confirm production
   actually changed → client explainer. (`/ship`) Database changes go through
   `/supabase-change` first.
5. **Write it down.** Every correction becomes a check in code, a kit skill,
   or one line in the repo's `CLAUDE.md`, in that order of preference. Never fix the
   same thing twice. (`/write-it-down`)

## Rules of thumb

- **Finish migrations you start.** Half-done switches confuse people and agents.
- **Lean memory.** `CLAUDE.md` holds only commands and gotchas. Product direction
  goes in `BRIEF.md`, long procedures in skills. Don't let a README become a changelog.
- **Fix the class, not the instance.** If a mistake can be caught by a script, a
  test or CI, put it there.
- **The author doesn't grade its own work.** Use a second agent for review.
- **One kit, every repo.** Cross-project lessons go into the kit (this repo), so a fix
  learned on Leftovers improves Bucketlist the next morning.

## Next moves (in order)

1. Merge the "How we build" PR in each repo. Each one adds a lean `CLAUDE.md` and
   turns this kit on. (This repo, `how-to-make-tasks`, is the kit.)
2. Clear the loose ends:
   - Shypit PR (four decisions + migration)
   - Bucketlist merge to `main`
   - Leftovers host choice (`vercel.json` vs Netlify)
   - Schoolyard: production deploys from `claude/trusting-lamport-7tjtib`; rename it to `main`
   - Archive `leftovers-f096f`
3. Very Rare: add its `CLAUDE.md` (drafted, not pushed yet).
4. Turn manual steps into checks:
   - Portfolio `asset-versions.py` → CI fails if `?v=` tags are stale
   - 2DAY service-worker version bump → test
   - Netlify cache → a post-deploy "is it live" check
5. Add one routine: a weekly health check of our live sites (links, console errors,
   accessibility, "is it the latest commit"). Tune the routine, not the report.
6. Save each project's install step as its cloud environment's setup script, so
   sessions start ready.
7. CVRBOY: start from the Very Rare theme's structure rather than from scratch.

## Not for us (yet)

BigQuery and Slack workflows, terminal customization, dozens of parallel agents,
dynamic workflows for migrations. Revisit when a project is big enough to need them.
