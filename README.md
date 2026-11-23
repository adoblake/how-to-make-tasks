# studio-kit (lives in `adoblake/how-to-make-tasks`)

How we build, as a Claude Code plugin. One copy, used by every project.

| Skill | When it runs | What it fixes |
|---|---|---|
| `kickoff` | New project, client, or large feature | Unknowns found mid-build (rework, "supersedes" docs) |
| `verify-ui` | Any UI change, before a PR, "looks off" | "Looks fine" without looking: theme, overflow, accessibility, console, cache |
| `ship` | Merge / deploy / "is it ready" | PRs left open, migrations not run, stale caches, buried decisions |
| `supabase-change` | Any database / RLS change | Migrations merged out of order, edited after applying, or exposing rows |
| `write-it-down` | Any correction or repeat mistake | The same lesson learned twice |

`templates/CLAUDE.md` is the starting point for a new repo's memory file.

Scripts the skills run (each works on its own too):
- `skills/verify-ui/scripts/verify-ui.cjs`: browser sweep (widths × themes: console, requests, overflow, axe, screenshots)
- `skills/ship/scripts/is-live.sh`: polls production, bypassing caches, until the new version shows
- `skills/supabase-change/scripts/check-migrations.sh`: fails if a branch edits an applied migration

## Install it for yourself

```
/plugin install studio-kit --marketplace adoblake/how-to-make-tasks
```

## Turn it on in a project

Add this to the project's `.claude/settings.json` and commit it:

```json
{
  "extraKnownMarketplaces": {
    "studio": { "source": { "source": "github", "repo": "adoblake/how-to-make-tasks" } }
  },
  "enabledPlugins": { "studio-kit@studio": true }
}
```

## Changing how we build

Edit the skill here, run `bash tests/run-triggers.sh` (does each skill still load on
the requests in `tests/triggers.tsv`? target 9 in 10), and open a PR.
When a skill misses a real request, add that request to `triggers.tsv`. Every project picks it up on its next session.
That's the point: a lesson learned on one project improves all of them.
