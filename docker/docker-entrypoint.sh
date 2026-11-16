#!/bin/bash

# Check if STORAGE_DIR is set
if [ -z "$STORAGE_DIR" ]; then
    echo "================================================================"
    echo "⚠️  ⚠️  ⚠️  WARNING: STORAGE_DIR environment variable is not set! ⚠️  ⚠️  ⚠️"
    echo ""
    echo "Not setting this will result in data loss on container restart since"
    echo "the application will not have a persistent storage location."
    echo "It can also result in weird errors in various parts of the application."
    echo ""
    echo "Please run the container with the official docker command at"
    echo "https://docs.anythingllm.com/installation-docker/quickstart"
    echo ""
    echo "⚠️  ⚠️  ⚠️  WARNING: STORAGE_DIR environment variable is not set! ⚠️  ⚠️  ⚠️"
    echo "================================================================"
fi

# Forward stop signals to both services so `docker stop`/`docker restart` shut them
# down cleanly instead of waiting out the timeout and getting SIGKILLed.
shutdown() {
  trap - TERM INT
  kill -TERM "$server_pid" "$collector_pid" "$watchdog_pid" 2>/dev/null
  wait
  exit 0
}
trap shutdown TERM INT

# The collector can hang without its process exiting. Poll it and kill it once it has
# failed COLLECTOR_WATCHDOG_FAILURES checks in a row so the container restarts.
# Set COLLECTOR_WATCHDOG_INTERVAL=0 to disable.
COLLECTOR_WATCHDOG_INTERVAL="${COLLECTOR_WATCHDOG_INTERVAL:-30}"
COLLECTOR_WATCHDOG_TIMEOUT="${COLLECTOR_WATCHDOG_TIMEOUT:-10}"
COLLECTOR_WATCHDOG_FAILURES="${COLLECTOR_WATCHDOG_FAILURES:-3}"
watch_collector() {
  local failures=0
  while true; do
    sleep "$COLLECTOR_WATCHDOG_INTERVAL"
    if curl --silent --fail --output /dev/null --max-time "$COLLECTOR_WATCHDOG_TIMEOUT" \
      "http://localhost:${COLLECTOR_PORT:-8888}/accepts"; then
      failures=0
      continue
    fi

    failures=$((failures + 1))
    echo "[docker-entrypoint] Collector did not answer (${failures}/${COLLECTOR_WATCHDOG_FAILURES})."
    if [ "$failures" -ge "$COLLECTOR_WATCHDOG_FAILURES" ]; then
      echo "[docker-entrypoint] Collector is not answering - killing it so the container restarts."
      kill -KILL "$collector_pid" 2>/dev/null
      failures=0
    fi
  done
}

# `exec` so the tracked PIDs are the node processes themselves and not wrapper subshells.
{
  cd /app/server/ &&
    # Disable Prisma CLI telemetry (https://www.prisma.io/docs/orm/tools/prisma-cli#how-to-opt-out-of-data-collection)
    export CHECKPOINT_DISABLE=1 &&
    npx prisma generate --schema=./prisma/schema.prisma &&
    npx prisma migrate deploy --schema=./prisma/schema.prisma &&
    exec node /app/server/index.js
} &
server_pid=$!
{ exec node /app/collector/index.js; } &
collector_pid=$!
if [ "$COLLECTOR_WATCHDOG_INTERVAL" != "0" ]; then
  watch_collector &
  watchdog_pid=$!
fi

# The server and collector are only useful together. If either one exits, stop the
# other and exit non-zero so the container's restart policy brings both back up.
wait -n -p exited_pid
status=$?
case "$exited_pid" in
  "$server_pid") exited="Server" ;;
  "$collector_pid") exited="Collector" ;;
  *) exited="Collector watchdog" ;;
esac
echo "[docker-entrypoint] ${exited} exited with code ${status} - stopping the other services so the container restarts."
trap - TERM INT
kill -TERM "$server_pid" "$collector_pid" "$watchdog_pid" 2>/dev/null
wait
[ "$status" -eq 0 ] && status=1
exit "$status"