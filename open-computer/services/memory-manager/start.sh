#!/bin/bash
# Prod: run the bundled server.cjs (no node_modules needed).
# Dev (9p mount): fall back to server.js with parent node_modules on NODE_PATH.
cd "$(dirname "$0")"
if [ -f memory-manager.cjs ]; then
  exec node memory-manager.cjs
else
  exec env NODE_PATH=/opt/open-computer/node_modules node server.js
fi
