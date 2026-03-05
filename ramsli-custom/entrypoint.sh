#!/bin/bash
# Fix workspace permissions on every boot
if [ -d /workspace ]; then
    chown -R anythingllm:anythingllm /workspace 2>/dev/null || true
fi

exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
