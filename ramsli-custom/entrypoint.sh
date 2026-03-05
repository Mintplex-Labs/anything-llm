#!/bin/bash
# Fix workspace permissions on every boot
if [ -d /workspace ]; then
    chown -R anythingllm:anythingllm /workspace 2>/dev/null || true
fi

# Persist SQLite DB on /workspace so it survives pod restarts
DB_CONTAINER="/app/server/storage/anythingllm.db"
DB_VOLUME="/workspace/anythingllm.db"

if [ -f "$DB_VOLUME" ] && [ ! -L "$DB_CONTAINER" ]; then
    # Volume has a saved DB — restore it
    rm -f "$DB_CONTAINER"
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Restored DB from $DB_VOLUME"
elif [ ! -f "$DB_VOLUME" ] && [ ! -L "$DB_CONTAINER" ]; then
    # No saved DB yet — symlink so writes go to volume
    ln -s "$DB_VOLUME" "$DB_CONTAINER"
    echo "[entrypoint] Linked DB to $DB_VOLUME (will be created on first run)"
else
    echo "[entrypoint] DB symlink already in place"
fi

exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
