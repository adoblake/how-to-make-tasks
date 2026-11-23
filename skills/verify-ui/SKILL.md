---
name: verify-ui
description: Verify a user-facing change in a real browser before calling it done. Use after any change to pages, styles, layout, theming, forms, navigation or copy, and before opening or updating a PR that touches the UI.
---

# Verify UI: prove it in a browser

A successful edit is not a working page. Giving yourself a way to check your own
work is the biggest quality lever we have, so never call a UI change done until
you've seen it.

1. **Run it.** Start the app the way the repo's `CLAUDE.md` says. In cloud
   sessions Chromium and Playwright are pre-installed: `require('playwright')`
   works and `chromium.launch()` needs no options. Never run `playwright install`.
   For a static site, serve the folder (`python3 -m http.server`).

2. **Look at what changed, everywhere it shows.** For each page the change touches:
   - Widths 390, 768 and 1440 px.
   - Light and dark themes, if the project has both.
   - Actually use the change: click it, submit it, open and close it, try the keyboard.
   - Screenshot each state and look at the screenshots yourself.

3. **Check the things that bite us most.**
   - No new console errors or failed requests (other than hosts the environment blocks).
   - No horizontal overflow at 390 px.
   - Run axe (`@axe-core/playwright`) on the changed pages, with no new serious or critical issues.
   - Contrast and focus visibility in **both** themes.
   - Content fits above fixed bars (bottom navigation, sticky headers).
   - `prefers-reduced-motion` turns motion off.
   - Cache: if you changed CSS, JS or a service worker, make sure the cache-busting step ran (see the repo's `CLAUDE.md`).

4. **Compare against the reference** when there is one (approved mockup, chosen
   direction, the project's design standard). List real differences as
   fixed / intentional / follow-up.

5. **Report honestly.** Say what was checked, at which sizes and themes, and what
   *could not* be verified and why (for example: map tiles or fonts blocked in this
   environment, no real device, no live database). Don't present a mocked state as
   a verified live one.

If a problem you find here could happen again, run the `write-it-down` skill so
the next run catches it automatically.
