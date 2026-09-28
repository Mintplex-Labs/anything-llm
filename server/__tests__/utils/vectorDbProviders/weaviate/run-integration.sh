#!/usr/bin/env bash
# Runs weaviate.integration.test.js against every Weaviate version below.
#   ./run-integration.sh                  # default matrix
#   ./run-integration.sh 1.33.18 1.28.16  # specific versions
# Versions older than MIN_SUPPORTED are expected to be rejected by the provider.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../../../../.." && pwd)"
MIN_SUPPORTED="1.29.0"
VERSIONS=("$@")
[ ${#VERSIONS[@]} -eq 0 ] && VERSIONS=(1.29.11 1.32.27 1.36.2 1.39.7 1.28.16)

export WEAVIATE_HTTP_PORT=18080 WEAVIATE_GRPC_PORT=15051 WEAVIATE_DEBUG_PORT=16060
export WEAVIATE_AUTH_HTTP_PORT=18081 WEAVIATE_AUTH_GRPC_PORT=15052
COMPOSE=(docker compose -p anythingllm-weaviate-it -f "$HERE/docker-compose.yml")

version_lt() { [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | head -1)" = "$1" ]; }

wait_ready() {
  for _ in $(seq 1 60); do
    curl -fs "http://127.0.0.1:$1/v1/.well-known/ready" >/dev/null && return 0
    sleep 1
  done
  echo "Weaviate on :$1 did not become ready" >&2
  return 1
}

cleanup() { "${COMPOSE[@]}" down -v >/dev/null 2>&1 || true; }
trap cleanup EXIT

declare -a RESULTS=()
for version in "${VERSIONS[@]}"; do
  echo "=== Weaviate $version"
  cleanup
  WEAVIATE_VERSION="$version" "${COMPOSE[@]}" up -d --quiet-pull >/dev/null 2>&1
  wait_ready "$WEAVIATE_HTTP_PORT"
  wait_ready "$WEAVIATE_AUTH_HTTP_PORT"

  unsupported=false
  version_lt "$version" "$MIN_SUPPORTED" && unsupported=true

  if (cd "$ROOT" && \
    WEAVIATE_TEST_URL="http://127.0.0.1:$WEAVIATE_HTTP_PORT" \
    WEAVIATE_TEST_GRPC_URL="http://127.0.0.1:$WEAVIATE_GRPC_PORT" \
    WEAVIATE_TEST_AUTH_URL="http://127.0.0.1:$WEAVIATE_AUTH_HTTP_PORT" \
    WEAVIATE_TEST_AUTH_GRPC_URL="http://127.0.0.1:$WEAVIATE_AUTH_GRPC_PORT" \
    WEAVIATE_TEST_API_KEY="anythingllm-test-key" \
    WEAVIATE_TEST_EXPECT_UNSUPPORTED="$unsupported" \
    npx jest server/__tests__/utils/vectorDbProviders/weaviate/weaviate.integration.test.js); then
    RESULTS+=("PASS  $version (unsupported=$unsupported)")
  else
    RESULTS+=("FAIL  $version (unsupported=$unsupported)")
  fi
done

echo
printf '%s\n' "${RESULTS[@]}"
! printf '%s\n' "${RESULTS[@]}" | grep -q '^FAIL'
