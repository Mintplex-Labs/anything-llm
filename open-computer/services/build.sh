#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p dist

if ! command -v npx &>/dev/null; then
    echo "Error: npx is required (comes with Node.js)." >&2
    exit 1
fi

echo "Installing interface-service dependencies..."
(cd interface-service && npm install --silent)

echo "Bundling interface-service..."
npx --yes esbuild interface-service/index.js \
    --bundle --platform=node --target=node22 \
    --outfile=dist/interface-service.cjs \
    --format=cjs --minify \
    --external:bufferutil --external:utf-8-validate

echo "Bundling html-to-markdown..."
npx --yes esbuild interface-service/utils/html-to-markdown.js \
    --bundle --platform=node --target=node22 \
    --outfile=dist/html-to-markdown.cjs \
    --format=cjs --minify

echo "Bundling CDP utilities..."
mkdir -p dist/interface-service/utils
for util in cdp-eval.js cdp-input.js; do
    npx --yes esbuild "interface-service/utils/$util" \
        --bundle --platform=node --target=node22 \
        --outfile="dist/interface-service/utils/$util" \
        --format=cjs --minify \
        --external:bufferutil --external:utf-8-validate
done
cp interface-service/utils/browser-harvest.js dist/interface-service/utils/browser-harvest.js
cp interface-service/utils/html-to-markdown.js dist/interface-service/utils/html-to-markdown.js

echo "Installing memory-manager dependencies..."
(cd memory-manager && npm install --silent)

echo "Bundling memory-manager..."
mkdir -p dist/memory-manager/public
npx --yes esbuild memory-manager/server.js \
    --bundle --platform=node --target=node22 \
    --outfile=memory-manager/memory-manager.cjs \
    --format=cjs --minify
cp memory-manager/memory-manager.cjs dist/memory-manager/memory-manager.cjs
cp memory-manager/public/* dist/memory-manager/public/
cp memory-manager/start.sh dist/memory-manager/start.sh
chmod +x dist/memory-manager/start.sh

echo "Copying public (UI)..."
mkdir -p dist/public
cp public/* dist/public/

echo ""
ls -lh dist/interface-service.cjs dist/html-to-markdown.cjs dist/memory-manager/memory-manager.cjs
echo "Done: services/dist/"
