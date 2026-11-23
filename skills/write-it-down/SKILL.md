---
name: write-it-down
description: Turn a correction, mistake or hard-won gotcha into a lasting fix so it never needs repeating. Use whenever the user corrects Claude, says "again", "remember this" or "don't do that", or when a bug's root cause was something a future session could trip on too.
---

# Write it down: fix the class, not the instance

A correction in chat fixes one session. A written rule fixes every future
session. A check in code fixes it for everyone, forever. Each time something goes
wrong, move the fix as far down this list as it can go:

1. **A check in code** (best): a test, lint rule, CI step, build-script assertion,
   or a hook that runs automatically. Use this whenever the mistake can be
   detected mechanically, for example "forgot to bump asset versions",
   "migration edited after it was applied", "dark-mode color missing".
2. **The studio kit**: if it would bite *any* of our projects (theming, accessibility,
   caching, Supabase, deploys, honest demo labeling), add it to the right skill in
   `adoblake/how-to-make-tasks` and open a PR there.
3. **The repo's `CLAUDE.md`**: if it's specific to this project, add one line under
   "Gotchas" saying what to do and why. Write it as judgement ("match the
   surrounding code's comment density") rather than a brittle absolute ("never
   write comments") unless it's truly high-stakes.

Keep `CLAUDE.md` lean. It's read on every session, so:
- Delete or rewrite lines that are stale, duplicated, or obvious from the code.
- Move long procedures into a skill or a doc and link to it.
- Never paste secrets, keys or personal data into it.

Tell the user in one line what you wrote and where.
