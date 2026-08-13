#!/bin/bash
# Wrapper around curl that:
#  1. Always runs real curl first (pipes, auth, JSON — everything works unchanged)
#  2. For simple GETs that return HTML: converts output to clean markdown and
#     opens the page in Chromium so the user can see it visually.

REAL_CURL=/usr/bin/curl
HTML_TO_MD=/opt/open-computer/html-to-markdown
DEBUG_LOG=/tmp/curl-wrapper.log

# --- Parse args to decide if this is a simple, viewable GET ---
is_get=true
has_output_file=false
silent_or_head=false
url=""

prev=""
for arg in "$@"; do
  if [ -n "$prev" ]; then
    case "$prev" in
      -X|--request)
        if [ "$arg" != "GET" ] && [ "$arg" != "get" ]; then
          is_get=false
        fi ;;
    esac
    prev=""
    continue
  fi
  case "$arg" in
    -X|--request)                                          prev="$arg" ;;
    -d|--data|--data-*|-F|--form|--form-*|--upload-file|-T)
                                                           is_get=false ;;
    -o|--output|-O|--remote-name|-J|--remote-header-name)  has_output_file=true ;;
    -I|--head)                                             silent_or_head=true ;;
    -w|--write-out)                                        prev="$arg" ;;
    -H|--header|-A|--user-agent|-b|--cookie|-c|--cookie-jar|-e|--referer|-u|--user)
                                                           prev="$arg" ;;
    -*)  ;; # other flags
    *)
      if [ -z "$url" ]; then
        case "$arg" in
          http://*|https://*) url="$arg" ;;
          *.*) url="$arg" ;;
        esac
      fi
      ;;
  esac
done

# --- Fast path: not a candidate for interception, run curl directly ---
if ! $is_get || $has_output_file || $silent_or_head || [ -z "$url" ]; then
  echo "[curl-wrapper] SKIP: is_get=$is_get output=$has_output_file head=$silent_or_head url='$url' args=$*" >> "$DEBUG_LOG" 2>/dev/null
  exec "$REAL_CURL" "$@"
fi

# Normalize URL: add https:// if no scheme (matches curl's own default behavior)
case "$url" in
  http://*|https://*) full_url="$url" ;;
  *) full_url="https://$url" ;;
esac

echo "[curl-wrapper] INTERCEPT: url='$url' full_url='$full_url' args=$*" >> "$DEBUG_LOG" 2>/dev/null

# Skip URLs that look like file downloads or structured data
lower_url=$(echo "$url" | tr '[:upper:]' '[:lower:]')
case "$lower_url" in
  *.tar.gz|*.tgz|*.zip|*.gz|*.bz2|*.xz|*.7z|*.rar|\
  *.deb|*.rpm|*.dmg|*.iso|*.img|\
  *.pdf|*.exe|*.msi|*.bin|*.app|\
  *.mp3|*.mp4|*.avi|*.mkv|*.mov|*.wav|*.flac|\
  *.jpg|*.jpeg|*.png|*.gif|*.svg|*.webp|*.ico|\
  *.whl|*.gem|*.jar|*.war|*.ear|\
  *.json|*.xml|*.csv|*.tsv|*.yaml|*.yml|*.toml)
    exec "$REAL_CURL" "$@" ;;
esac

# --- Capture curl output + headers to decide if it's HTML ---
tmpfile=$(mktemp /tmp/curl-wrap.XXXXXX)
trap 'rm -f "$tmpfile" "${tmpfile}.headers"' EXIT

"$REAL_CURL" -sS -D "${tmpfile}.headers" -o "$tmpfile" "$@"
exit_code=$?

if [ $exit_code -ne 0 ]; then
  # Curl failed — output whatever it captured and pass through the error
  cat "$tmpfile" 2>/dev/null
  exit $exit_code
fi

# Check content-type from the captured response headers
content_type=$(grep -i '^content-type:' "${tmpfile}.headers" 2>/dev/null | tail -1 | tr '[:upper:]' '[:lower:]')

case "$content_type" in
  *text/html*|*application/xhtml*)
    echo "[curl-wrapper] HTML detected, converting + opening browser: $full_url (content-type: $content_type)" >> "$DEBUG_LOG" 2>/dev/null
    if [ -f "${HTML_TO_MD}.cjs" ]; then
      node "${HTML_TO_MD}.cjs" "$full_url" < "$tmpfile"
    elif [ -f "${HTML_TO_MD}.js" ]; then
      NODE_PATH=/opt/open-computer/node_modules:/usr/lib/node_modules node "${HTML_TO_MD}.js" "$full_url" < "$tmpfile"
    else
      cat "$tmpfile"
    fi

    # Also open in Chromium visually for the user
    DISPLAY="${DISPLAY:-:0}" chromium \
      --disable-session-crashed-bubble \
      "$full_url" >/dev/null 2>&1 &
    ;;
  *)
    # Non-HTML — output raw content unchanged
    cat "$tmpfile"
    ;;
esac

exit $exit_code
