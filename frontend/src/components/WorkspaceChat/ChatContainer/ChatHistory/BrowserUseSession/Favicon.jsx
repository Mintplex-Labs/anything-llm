import { useState } from "react";
import { Globe } from "@phosphor-icons/react";

// The page declares its own favicon, so only web and inline image addresses are ever loaded.
const SAFE_SRC =
  /^(https?:\/\/|data:image\/(png|jpeg|gif|webp|x-icon|vnd\.microsoft\.icon);)/i;

/**
 * A site's favicon: the one the page declared, else the favicon service chat
 * citations use for the host, else a globe.
 * @param {{src?: string|null, host?: string|null, size?: number}} props
 */
export default function Favicon({ src, host, size = 16 }) {
  // Sources that failed to load - a new src or host gets its own attempt.
  const [failed, setFailed] = useState([]);
  const candidates = [
    SAFE_SRC.test(String(src || "")) ? src : null,
    host &&
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`,
  ].filter((url) => url && !failed.includes(url));
  const current = candidates[0];
  if (!current)
    return (
      <Globe
        size={size}
        className="text-zinc-400 light:text-slate-500 flex-shrink-0"
      />
    );
  return (
    <img
      key={current}
      src={current}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed((list) => [...list, current])}
      className="rounded-sm flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
