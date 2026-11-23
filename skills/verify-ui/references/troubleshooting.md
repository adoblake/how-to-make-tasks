# verify-ui troubleshooting

## "Playwright not found"
Cloud sessions have it pre-installed (`require('playwright')` works anywhere). On a
laptop, run `npm i -D playwright` and then `npx playwright install chromium` once.
If a project pins its own `@playwright/test`, launch with
`executablePath: '/opt/pw-browsers/chromium'` in cloud sessions.

## axe "unavailable"
The script uses the project's `axe-core` if it has one, and otherwise downloads
a pinned copy once (with curl, through the proxy) and caches it in
`~/.cache/studio-kit/`. If that's blocked, add `axe-core` as a dev dependency,
or run with `--no-axe` and say accessibility wasn't checked.

## Hosts listed as "Not verifiable here"
The cloud proxy refuses some hosts: map tiles, some font CDNs, Figma, pricing
pages. Report them as unverified, never as passing. Don't disable TLS
verification to get around it.

## Every page shows status 0 / "Could not load page"
The server isn't running yet, or it's on another port or bound to another
host. Next.js and Vite need `--hostname 0.0.0.0` / `--host 0.0.0.0` in some
setups. Wait for "ready" before running the sweep.

## Port already in use
Something from an earlier run is still listening. Find it with
`lsof -i :PORT` (or `ss -ltnp`) and stop it. Some suites need fixed ports
(Leftovers' a11y run uses 3150–3152).

## Contrast failures on text that looks fine
Check whether the text is mid-animation or deliberately dimmed (inactive
steps, disabled states). The sweep runs with reduced motion, so a page that
ignores `prefers-reduced-motion` can be caught mid-fade. That's itself worth
fixing. If the dimming is intentional, say so in the report.

## Dark screenshots look light
The sweep emulates the system color scheme. A site that only switches themes
through its own toggle and saved choice won't follow it. Set the saved value in
`localStorage` before loading (see the repo's `CLAUDE.md` for the key), or
click the toggle in your interaction script.
