#!/usr/bin/env bash
# Poll a production URL until it contains text that only the new version has.
# Bypasses caches with a unique query string and no-cache headers.
# Usage: is-live.sh URL "expected text" [timeout-seconds=600] [interval=20]
set -uo pipefail
url="${1:?usage: is-live.sh URL \"expected text\" [timeout] [interval]}"
want="${2:?give a string that only the new version contains}"
timeout="${3:-600}"; interval="${4:-20}"
sep='?'; [[ "$url" == *\?* ]] && sep='&'
start=$(date +%s)
while :; do
  bust="${url}${sep}live_check=$(date +%s%N)"
  body=$(curl -sL --max-time 30 -H 'Cache-Control: no-cache' -H 'Pragma: no-cache' -w '\n__STATUS__%{http_code}' "$bust")
  status="${body##*__STATUS__}"; body="${body%__STATUS__*}"
  if [[ "$body" == *"$want"* ]]; then
    echo "LIVE: $url contains the new text (HTTP $status, after $(( $(date +%s) - start ))s)."
    exit 0
  fi
  if (( $(date +%s) - start >= timeout )); then
    echo "NOT LIVE after ${timeout}s: $url (HTTP $status) doesn't contain: $want"
    echo "Check the host's deploy status next (see the ship skill's host reference)."
    exit 1
  fi
  echo "waiting… HTTP $status, not there yet"
  sleep "$interval"
done
