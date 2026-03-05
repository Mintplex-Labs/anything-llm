#!/bin/bash
# Fix workspace permissions on every boot
if [ -d /workspace ]; then
    chown -R anythingllm:anythingllm /workspace
fi

# Ensure collector hotdir exists (path is hardcoded in AnythingLLM collector source)
mkdir -p /collector/hotdir

exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
