#!/usr/bin/env bash

grep -RIn --include=\*.{jsx,tsx,css} -E '#[0-9a-fA-F]{3,8}' frontend \
  && echo "❌ Hex color found. Use OneNew tokens/utilities." && exit 1 || exit 0
