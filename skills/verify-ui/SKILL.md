---
name: verify-ui
description: Verify a user-facing change in a real browser before calling it done, or investigate a page that looks wrong. Checks pages at phone, tablet and desktop widths in light and dark themes for console errors, failed requests, horizontal overflow and accessibility, and takes screenshots. Use after any change to pages, styles, layout, theming, forms, navigation or copy; before opening a PR or sending work to a client; and whenever the user says something "looks off", "looks broken on mobile/phones", asks to "check it", "test it", "make sure it works", "does it look right", or "test across screen sizes".
compatibility: Needs Node and Playwright with Chromium (pre-installed in Claude Code cloud sessions).
---

# Verify UI: prove it in a browser

A successful edit is not a working page. Giving yourself a way to check your own
work is the biggest quality lever we have, so never call a UI change done until
you've seen it.

## 1. Run the site

Start it the way the repo's `CLAUDE.md` says, in the background. For a static
site, run `python3 -m http.server 8000`. In cloud sessions Playwright and
Chromium are already installed, so never run `playwright install`.

## 2. Run the sweep

```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/verify-ui/scripts/verify-ui.cjs \
  --url http://127.0.0.1:3000 --paths /,/pricing,/contact
```

It loads each path at 390, 768 and 1440 px in light and dark (with reduced
motion on), then saves full-page screenshots plus `report.md` and `report.json`
to `verify-ui-results/`. It exits 1 if anything needs attention. Useful options:
- `--widths 390,1440` and `--themes light`: narrow the run.
- `--ignore-hosts a.com,b.com`: hosts whose failures you've already explained.
- `--no-axe`: skip the accessibility check.
- `--wait 1500`: give slow animations or data more time.

Pass every path the change touches. Add `verify-ui-results/` to `.gitignore`,
or delete it when you're done.

## 3. Look and interact

The script can't judge design or use the feature.
- Open the screenshots for the pages you changed and look at them.
- Then write a short Playwright script, or extend an existing test, that
  actually *uses* the change: click it, submit it, open and close it, try the
  keyboard.
- Check what the sweep can't see:
  - Content stays clear of fixed bars.
  - Focus is visible in both themes.
  - Any toggle-based theme (one saved in `localStorage` rather than following
    the system) still works.

## 4. Compare against the reference

When there's an approved mockup, a chosen direction, or the project's design
standard, list real differences as fixed / intentional / follow-up.

## 5. Report honestly

Paste the summary table. Say what was checked and what *couldn't* be verified,
and why. The script lists hosts this environment blocked separately: those are
environment limits, not passes. Don't present a mocked state as a live one.

Fix what the sweep found and run it again. If a problem could recur, use
`write-it-down` so the next run catches it.

If something about the run itself goes wrong, see `references/troubleshooting.md`.
