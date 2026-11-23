---
name: supabase-change
description: Make a database change in a Supabase project safely, including tables, columns, row-level security policies, functions, storage buckets and seed data. Covers inspecting the live schema, writing a new migration, testing policies, running the security advisors, and applying the migration in the right order relative to the code that needs it. Use when the user asks for a schema change, new table, RLS policy, "add a column", "migration", or when a feature needs data the database doesn't have yet. Uses the Supabase connector when it's available.
compatibility: Works best with the Supabase MCP connector. Falls back to migration files and the Supabase dashboard without it.
---

# Supabase change: schema first, safely

Several of our products run on Supabase (Schoolyard, Leftovers, Shypit, and
Bucketlist's sign-in). The risky part is never the SQL. It's the order:
code merged before its migration, an applied migration edited, or a policy
that quietly exposes rows. Shypit's review stalled on exactly this.

## 1. Look before changing

Use the Supabase connector's `list_tables`, `list_migrations` and
`list_extensions` to see what's actually live. Compare it to the repo's migration
folder (`supabase/migrations/`; Shypit keeps SQL files in `supabase/`).
If live and repo disagree, stop and tell the user. Don't guess which is right.

## 2. Write a new migration

- Always a **new** file, named the way the repo already names them (timestamped
  in Schoolyard, `00N_` in Leftovers). Never edit one that's been applied.
- Every new table gets RLS enabled and explicit policies in the same migration.
  Prefer helper functions in a private schema (as Schoolyard does) over
  repeating logic across policies.
- Make it safe to re-run where reasonable (`if not exists`, `create or replace`).

Then run the check:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/supabase-change/scripts/check-migrations.sh <base-branch>
```

It fails if any existing migration file was modified, renamed or deleted on this
branch.

## 3. Test it

Run the repo's policy tests if it has them (Leftovers and Shypit test real RLS
against PGlite). For a new policy, test at least: anonymous, the owner, another
signed-in user, and an admin if roles exist. If the repo has no policy tests and
the change touches access, add one.

## 4. Apply it, with the user's go-ahead

`apply_migration` changes the live project immediately. Before calling it:
- Tell the user which project it targets and what the migration does, then wait
  for a yes. Production data is involved.
- Don't create Supabase branches unless the user asks: they're a paid feature,
  and Leftovers is on a $0 budget.
- Without the connector, give the user the exact SQL and where to run it
  (SQL Editor), or the repo's own workflow (Shypit uses GitHub Actions).

After applying:
- Run `get_advisors` (security, then performance) and fix anything the change introduced.
- If the frontend is typed, regenerate types with `generate_typescript_types`.

## 5. Order the merge

The migration must be live **before** code that depends on it merges. Put this
line at the top of the PR:

> **Requires migration `<file>`: applied to `<project>` on `<date>`** (or "NOT YET APPLIED")

Dashboard-only settings (SMTP, auth URLs, providers) go in the PR as a checklist.
They aren't migrations.

## Never

- Put the service-role key, or any privileged key, in frontend code, `.env.local`,
  chat, or logs.
- Disable RLS to make something work.
- Run destructive SQL (`drop`, `truncate`, bulk `delete`) on a live project
  without an explicit yes and a stated way back.
