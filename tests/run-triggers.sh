#!/usr/bin/env bash
# Check that each kit skill loads on the requests it should (and stays quiet otherwise).
# Runs headless Claude once per line of triggers.tsv with only this plugin added,
# stops after the first turn, and records which skill (if any) it invoked.
# No tools other than Skill are allowed, so nothing is changed.
#
#   bash tests/run-triggers.sh            # all prompts, 4 at a time
#   PARALLEL=8 bash tests/run-triggers.sh
#
# The guide's target: about 9 in 10 relevant prompts trigger the right skill.
set -uo pipefail
kit="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"; out="$work/results"; mkdir -p "$out"
export kit work out

run_one() {
  local n="$1" expected="$2" prompt="$3"
  ( cd "$work" && timeout 180 claude -p "$prompt" --plugin-dir "$kit" --max-turns 1 \
      --allowedTools Skill --output-format stream-json --verbose 2>/dev/null ) > "$out/$n.jsonl"
  local got
  got=$(python3 -I - "$out/$n.jsonl" <<'PY'
import json, sys
names = []
for line in open(sys.argv[1], encoding="utf-8", errors="ignore"):
    try: ev = json.loads(line)
    except ValueError: continue
    msg = ev.get("message") or {}
    for c in msg.get("content") or []:
        if isinstance(c, dict) and c.get("type") == "tool_use" and c.get("name") == "Skill":
            names.append(str((c.get("input") or {}).get("skill", "?")).split(":")[-1])
print(names[0] if names else "none")
PY
)
  printf '%s\t%s\t%s\t%s\n' "$n" "$expected" "$got" "$prompt" > "$out/$n.tsv"
}
export -f run_one

tail -n +2 "$kit/tests/triggers.tsv" | awk -F'\t' '{printf "%d\t%s\t%s\n", NR, $1, $2}' |
  while IFS=$'\t' read -r n expected prompt; do printf '%s\0%s\0%s\0' "$n" "$expected" "$prompt"; done |
  xargs -0 -n 3 -P "${PARALLEL:-4}" bash -c 'run_one "$0" "$1" "$2"'

pass=0; total=0
printf '%-4s %-16s %-16s %s\n' "#" "expected" "got" "prompt"
for f in $(ls "$out"/*.tsv | sort -V); do
  IFS=$'\t' read -r n expected got prompt < "$f"
  total=$((total+1)); mark="MISS"; [ "$expected" = "$got" ] && { pass=$((pass+1)); mark="ok"; }
  printf '%-4s %-16s %-16s %s  %s\n' "$n" "$expected" "$got" "$mark" "${prompt:0:70}"
done
echo; echo "Score: $pass/$total correct"
rm -rf "$work"
[ "$pass" -eq "$total" ]
