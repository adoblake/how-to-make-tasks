---
name: kickoff
description: Start a new project, client site, or large feature by finding the unknowns before any code is written. Use when the user says "new project", "new client", "kickoff", "let's start", or brings a brief, pitch, business plan or reference site to build from.
---

# Kickoff: find the unknowns first

The quality of what we ship is limited by what we didn't know to say. Most of the
rework on past projects (design passes, "supersedes" sections in product docs,
features rebuilt after a reference arrived late) came from unknowns we found
mid-build. Find them up front, when they're cheap.

Work through these in order, skipping any that clearly don't apply. Keep each
step short; the user should be reacting, not reading.

1. **Blind-spot pass.** Read what exists (brief, pasted plan, reference sites,
   existing repo). Then list the unknown unknowns: things the user probably
   hasn't considered that would change the build: hosting and cost limits,
   auth, data the user doesn't have yet, legal and privacy, who approves copy,
   what "launched" means. Say why each one matters.

2. **Directions to react to.** When the criteria are "I'll know it when I see
   it" (look, layout, tone), don't ask. Build 3–4 *very different* directions
   as quick HTML pages and let the user pick or mix. Point at real source code
   or live sites as references when the user names one.

3. **Interview.** Ask the remaining questions **one at a time**, most
   architecture-changing first (data model, auth, hosting, who the users are,
   budget). Stop when the remaining questions are ones you can decide sensibly
   yourself; say what you decided.

4. **Write the brief.** Create or update `BRIEF.md` (keep it under a page):
   - The promise: one sentence, plus how we'll know it worked.
   - First release: the few things it must do.
   - Not now: what's explicitly out.
   - Constraints: budget (for example "$0, free tiers only"), host, deadlines,
     who signs off (client name and what they approve).
   - Decisions: short dated lines. When one is reversed, edit the line. Don't
     append a "supersedes" essay.

5. **Set up the repo's memory.** If there's no `CLAUDE.md`, create one from this
   plugin's `templates/CLAUDE.md`, filling in only what's known now.

Then build. Prefer a working prototype over a longer spec.
