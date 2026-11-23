#!/usr/bin/env bash
# Fail if this branch modified, renamed or deleted an existing migration file.
# New migration files are fine. Usage: check-migrations.sh [base-branch] [dir ...]
# Default dirs: supabase/migrations drizzle migrations
set -euo pipefail

base="${1:-}"
shift || true
dirs=("$@")
[ ${#dirs[@]} -eq 0 ] && dirs=(supabase/migrations drizzle migrations)

if [ -z "$base" ]; then
  base=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##' || true)
  base="${base:-main}"
fi

# Make sure the base is available (shallow clones often don't have it).
if ! git rev-parse --verify --quiet "origin/$base" >/dev/null; then
  git fetch --quiet --depth=50 origin "+refs/heads/$base:refs/remotes/origin/$base" || {
    echo "Can't fetch origin/$base; pass the base branch name as the first argument." >&2; exit 2; }
fi

existing=()
for d in "${dirs[@]}"; do [ -d "$d" ] && existing+=("$d"); done
if [ ${#existing[@]} -eq 0 ]; then echo "No migration folders found (${dirs[*]}). Nothing to check."; exit 0; fi

# Shallow clones may not include the shared ancestor yet: deepen a little at a time.
mb=""
for depth in 50 200 1000; do
  mb=$(git merge-base "origin/$base" HEAD 2>/dev/null) && break
  git fetch --quiet --depth="$depth" origin "+refs/heads/$base:refs/remotes/origin/$base" 2>/dev/null || true
  [ "$(git rev-parse --is-shallow-repository)" = "true" ] && git fetch --quiet --deepen="$depth" origin 2>/dev/null || true
done
if [ -z "$mb" ]; then
  echo "No common history with origin/$base. Run: git fetch --depth=1000 origin $base" >&2; exit 2
fi

bad=$(git diff --name-status "$mb" HEAD -- "${existing[@]}" | grep -E '^(M|D|R)' || true)
added=$(git diff --name-status "$mb" HEAD -- "${existing[@]}" | grep -E '^A' | cut -f2 || true)

if [ -n "$bad" ]; then
  echo "Existing migrations were changed on this branch (vs origin/$base):"
  echo "$bad" | sed 's/^/  /'
  echo "Applied migrations must never change. Revert these and put the change in a new migration."
  exit 1
fi
echo "OK: no existing migrations changed (vs origin/$base)."
[ -n "$added" ] && { echo "New migrations on this branch (apply before merging dependent code):"; echo "$added" | sed 's/^/  /'; }
exit 0
