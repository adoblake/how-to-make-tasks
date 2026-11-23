# studio-kit (lives in `adoblake/how-to-make-tasks`)

How we build, as a Claude Code plugin. One copy, used by every project.

| Skill | When it runs | What it fixes |
|---|---|---|
| `kickoff` | New project, client, or large feature | Unknowns found mid-build (rework, "supersedes" docs) |
| `verify-ui` | Any UI change, before a PR | "Looks fine" without looking: theme, overflow, accessibility, console, cache |
| `ship` | Merge / deploy / "is it ready" | PRs left open, migrations not run, stale caches, buried decisions |
| `write-it-down` | Any correction or repeat mistake | The same lesson learned twice |

`templates/CLAUDE.md` is the starting point for a new repo's memory file.

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

Edit the skill here and open a PR. Every project picks it up on its next session.
That's the point: a lesson learned on one project improves all of them.
