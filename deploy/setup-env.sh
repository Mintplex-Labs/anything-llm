#!/usr/bin/env bash
#
# Create ready-to-run env files for this fork, with OpenRouter as the LLM.
#
# Usage:
#   deploy/setup-env.sh docker [options]   writes docker/.env (for docker compose)
#   deploy/setup-env.sh local  [options]   writes server/.env and collector/.env
#                                          (production run with node, no Docker)
#   deploy/setup-env.sh dev    [options]   writes server/.env.development and
#                                          frontend/.env (yarn dev, local only)
#
# Options:
#   --embedder openrouter|native   embedding engine (default: openrouter)
#   --force                        replace existing files (old ones are kept
#                                  as <file>.bak.<timestamp>)
#   -h, --help                     show this help
#
# Optional environment variables (used if set, otherwise prompted or generated):
#   OPENROUTER_API_KEY      your OpenRouter key (prompted for when interactive)
#   OPENROUTER_MODEL_PREF   chat model id (default: openrouter/auto)
#   AUTH_TOKEN              single-user login password (default: random)
#
# The script only writes local files. Nothing is sent anywhere.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$SCRIPT_DIR/openrouter.env.example"
STAMP="$(date +%Y%m%d%H%M%S)"

usage() { sed -n '3,24p' "$0" | sed 's/^# \{0,1\}//'; }
die() { echo "error: $*" >&2; exit 1; }

TARGET=""
EMBEDDER="openrouter"
FORCE=0
while [ $# -gt 0 ]; do
  case "$1" in
    docker|local|dev) TARGET="$1" ;;
    --embedder) shift; EMBEDDER="${1:-}" ;;
    --embedder=*) EMBEDDER="${1#*=}" ;;
    --force) FORCE=1 ;;
    -h|--help) usage; exit 0 ;;
    *) usage; die "unknown argument: $1" ;;
  esac
  shift
done
[ -n "$TARGET" ] || { usage; die "pick a target: docker, local or dev"; }
case "$EMBEDDER" in openrouter|native) ;; *) die "--embedder must be openrouter or native" ;; esac
[ -f "$TEMPLATE" ] || die "template not found: $TEMPLATE"

# Random bytes as hex. Hex never contains the characters the server strips
# when it rewrites the .env file (# ' " ` and whitespace).
rand_hex() {
  local bytes="${1:-32}"
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "$bytes"
  elif command -v node >/dev/null 2>&1; then
    node -e "process.stdout.write(require('crypto').randomBytes($bytes).toString('hex'))"
  else
    head -c "$bytes" /dev/urandom | od -An -tx1 | tr -d ' \n'
  fi
}

# Values are written inside double quotes and must survive the server's
# rewrite of the file, which cuts a value at the first # ' " ` or tab.
check_value() {
  local name="$1" value="$2"
  case "$value" in
    *[\"\'\`\#\\]*|*[[:space:]]*)
      die "$name contains a quote, #, backslash or whitespace, which the server would cut off" ;;
  esac
}

# Replace the first active KEY=... line (commented-out lines are left
# alone), or append the key if the file has no such line.
set_var() {
  local file="$1" key="$2" value="$3"
  check_value "$key" "$value"
  if grep -q "^${key}=" "$file"; then
    awk -v k="$key" -v v="$value" '
      !done && index($0, k "=") == 1 { print k "=\"" v "\""; done = 1; next }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  else
    printf '%s="%s"\n' "$key" "$value" >> "$file"
  fi
}

# Switch the embeddings block of the template to the built-in local model.
use_native_embedder() {
  local file="$1"
  awk '
    /^EMBEDDING_ENGINE="openrouter"$/ { print "# " $0; next }
    /^EMBEDDING_MODEL_PREF="baai\/bge-m3"$/ { print "# " $0; next }
    /^# EMBEDDING_ENGINE="native"$/ { sub(/^# /, ""); print; next }
    /^# EMBEDDING_MODEL_PREF="Xenova\/all-MiniLM-L6-v2"$/ { sub(/^# /, ""); print; next }
    { print }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

# Refuse to clobber unless --force; with --force keep a backup.
guard_existing() {
  local file="$1"
  [ -e "$file" ] || return 0
  [ "$FORCE" -eq 1 ] || die "${file#"$ROOT"/} already exists. Re-run with --force to replace it (a backup is kept)."
  cp -p "$file" "$file.bak.$STAMP"
  echo "Backed up ${file#"$ROOT"/} to ${file#"$ROOT"/}.bak.$STAMP"
}

# ---- Collect values ------------------------------------------------------

API_KEY="${OPENROUTER_API_KEY:-}"
if [ -z "$API_KEY" ] && [ -t 0 ]; then
  printf 'OpenRouter API key (leave blank to add it later): '
  read -r -s API_KEY || true
  echo
fi
if [ -n "$API_KEY" ]; then check_value OPENROUTER_API_KEY "$API_KEY"; fi

MODEL="${OPENROUTER_MODEL_PREF:-openrouter/auto}"
check_value OPENROUTER_MODEL_PREF "$MODEL"

PASSWORD_GENERATED=0
PASSWORD="${AUTH_TOKEN:-}"
if [ -z "$PASSWORD" ]; then
  PASSWORD="$(rand_hex 12)"
  PASSWORD_GENERATED=1
fi
check_value AUTH_TOKEN "$PASSWORD"

# Writes the main server env file from the template.
write_server_env() {
  local file="$1" storage_dir="$2"
  guard_existing "$file"
  mkdir -p "$(dirname "$file")"
  cp "$TEMPLATE" "$file"
  set_var "$file" STORAGE_DIR "$storage_dir"
  set_var "$file" JWT_SECRET "$(rand_hex 32)"
  set_var "$file" SIG_KEY "$(rand_hex 32)"
  set_var "$file" SIG_SALT "$(rand_hex 32)"
  set_var "$file" AUTH_TOKEN "$PASSWORD"
  set_var "$file" OPENROUTER_MODEL_PREF "$MODEL"
  if [ -n "$API_KEY" ]; then set_var "$file" OPENROUTER_API_KEY "$API_KEY"; fi
  if [ "$EMBEDDER" = "native" ]; then use_native_embedder "$file"; fi
}

# ---- Write files ---------------------------------------------------------

WRITTEN=()
case "$TARGET" in
  docker)
    OUT="$ROOT/docker/.env"
    write_server_env "$OUT" "/app/server/storage"

    # The container runs as UID:GID. Root on the host maps to the upstream
    # default 1000, because the image cannot give UID 0 to its app user.
    HOST_UID="$(id -u)"
    HOST_GID="$(id -g)"
    if [ "$HOST_UID" -eq 0 ]; then HOST_UID=1000; HOST_GID=1000; fi
    set_var "$OUT" UID "$HOST_UID"
    set_var "$OUT" GID "$HOST_GID"
    WRITTEN+=("$OUT")

    # Folders docker compose mounts into the container.
    mkdir -p "$ROOT/server/storage" "$ROOT/collector/hotdir" "$ROOT/collector/outputs"
    ;;

  local)
    write_server_env "$ROOT/server/.env" "$ROOT/server/storage"
    WRITTEN+=("$ROOT/server/.env")

    # In production the collector writes parsed documents straight into the
    # server's storage folder, so it needs the same STORAGE_DIR.
    COLLECTOR_ENV="$ROOT/collector/.env"
    guard_existing "$COLLECTOR_ENV"
    printf '# Written by deploy/setup-env.sh\nSTORAGE_DIR="%s"\n' "$ROOT/server/storage" > "$COLLECTOR_ENV"
    WRITTEN+=("$COLLECTOR_ENV")
    ;;

  dev)
    write_server_env "$ROOT/server/.env.development" "$ROOT/server/storage"
    WRITTEN+=("$ROOT/server/.env.development")

    FRONTEND_ENV="$ROOT/frontend/.env"
    guard_existing "$FRONTEND_ENV"
    printf "VITE_API_BASE='http://localhost:3001/api'\n" > "$FRONTEND_ENV"
    WRITTEN+=("$FRONTEND_ENV")
    ;;
esac

# Secrets inside: owner-only permissions. For Docker run as root, hand the
# env file and mounted folders to the container user so it can write them.
for f in "${WRITTEN[@]}"; do chmod 600 "$f"; done
if [ "$TARGET" = "docker" ] && [ "$(id -u)" -eq 0 ]; then
  chown "$HOST_UID:$HOST_GID" "$OUT"
  chown -R "$HOST_UID:$HOST_GID" "$ROOT/server/storage" "$ROOT/collector/hotdir" "$ROOT/collector/outputs"
  echo "Running as root: gave UID $HOST_UID ownership of docker/.env and the mounted folders so the container can write to them."
fi

# ---- Summary -------------------------------------------------------------

echo
echo "Wrote:"
for f in "${WRITTEN[@]}"; do echo "  ${f#"$ROOT"/}"; done
echo "  LLM:         OpenRouter, model $MODEL"
echo "  Embeddings:  $EMBEDDER"
echo "  Vector DB:   LanceDB (local files)"
echo "  Telemetry:   off"
MAIN_FILE="${WRITTEN[0]#"$ROOT"/}"
if [ -z "$API_KEY" ]; then
  echo
  echo "No OpenRouter key yet. Set OPENROUTER_API_KEY in $MAIN_FILE,"
  echo "or add it later in the app under Settings > AI Providers > LLM."
fi
if [ "$PASSWORD_GENERATED" -eq 1 ]; then
  echo
  echo "Login password (AUTH_TOKEN): $PASSWORD"
  echo "Keep it somewhere safe. It is also stored in $MAIN_FILE."
fi

echo
echo "Next steps (run from the repo root):"
case "$TARGET" in
  docker)
    echo "  (cd docker && docker compose up -d --build)"
    echo "  then open http://localhost:3001"
    ;;
  local)
    echo "  (cd server && yarn install && npx prisma generate && npx prisma migrate deploy)"
    echo "  (cd collector && yarn install)"
    echo "  (cd frontend && yarn install && yarn build) && rm -rf server/public && cp -R frontend/dist server/public"
    echo "  (cd server && NODE_ENV=production node index.js)       # terminal 1"
    echo "  (cd collector && NODE_ENV=production node index.js)    # terminal 2"
    echo "  then open http://localhost:3001 (keep port 8888 closed to the outside)"
    ;;
  dev)
    echo "  yarn setup    # first time: installs deps, prepares the database"
    echo "  yarn dev      # server :3001, collector :8888, frontend :3000"
    echo "  Dev mode turns off login and request signing. Never expose it."
    ;;
esac
echo
echo "Before uploading documents: set a chunk size under Settings > AI Providers > Text Splitter & Chunking,"
echo "and set each workspace's chat mode (query = answer only from documents). See docs/README.md."
