# <Project name>

<One or two sentences: what this is, who it's for, and who signs off (us, or a client by name).>

## Run
- `<install>`, then `<dev command>` (port <n>)

## Verify (all must pass before a PR)
- `<test>` · `<typecheck>` · `<build>`
- UI changes: run the `verify-ui` skill.

## Ship
- Host: <Netlify / Vercel / GitHub Pages / Shopify>. Deploys from `<branch>`.
- Out-of-code steps, in order: <migrations, env vars, dashboard settings>

## Gotchas
- <Only what isn't obvious from the code. One line each: what to do, and why.>

<!-- Keep this file short: it loads every session. Product direction lives in BRIEF.md;
     long procedures live in docs/ or a skill. Add lines with the write-it-down skill. -->
