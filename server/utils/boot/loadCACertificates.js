const fs = require("fs");
const path = require("path");
const tls = require("tls");
const { X509Certificate } = require("crypto");

const LOG_PREFIX = "\x1b[36m[CA Certificates]\x1b[0m";
const PEM_CERTIFICATE =
  /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g;
const TRUTHY = new Set(["1", "true", "yes", "on"]);

/**
 * Reads the PEM certificates out of a bundle file. Blocks that are not valid
 * certificates are skipped so one bad entry cannot break the whole bundle.
 * @param {string} filePath
 * @param {typeof fs} fsModule
 * @returns {{certs: string[], skipped: number}}
 */
function readPemBundle(filePath, fsModule = fs) {
  const content = fsModule.readFileSync(filePath, "utf8");
  const blocks = content.match(PEM_CERTIFICATE) ?? [];
  const certs = [];
  let skipped = 0;
  for (const block of blocks) {
    try {
      new X509Certificate(block);
      certs.push(block);
    } catch {
      skipped++;
    }
  }
  return { certs, skipped };
}

/**
 * Lets AnythingLLM trust certificate authorities that are not in Node's
 * bundled list, so providers behind an internal or self-signed CA (a Generic
 * OpenAI endpoint, LM Studio over a VPN, a corporate proxy) can be reached
 * over HTTPS without disabling certificate verification.
 *
 * - `ANYTHINGLLM_USE_SYSTEM_CA=true` also trusts the operating system store.
 * - `ANYTHINGLLM_EXTRA_CA_CERTS=/path/to/bundle.pem` also trusts the
 *   certificates in that PEM file.
 *
 * Node's own `NODE_EXTRA_CA_CERTS` is read when the process starts, which is
 * before the `.env` file is loaded, so it cannot be set from `.env`. These
 * settings are applied at boot instead, after the `.env` file is loaded.
 *
 * Nothing changes unless one of the settings is set. Must be called before
 * the first outgoing HTTPS request. Never throws: a problem is logged and the
 * default trusted certificates stay in place.
 *
 * @param {object} [deps] Injectable for tests.
 * @returns {{applied: boolean, system: number, extra: number}}
 */
function loadCACertificates({
  env = process.env,
  tlsModule = tls,
  fsModule = fs,
} = {}) {
  const result = { applied: false, system: 0, extra: 0 };
  const useSystemCA = TRUTHY.has(
    String(env.ANYTHINGLLM_USE_SYSTEM_CA ?? "")
      .trim()
      .toLowerCase()
  );
  const extraCertsPath = String(env.ANYTHINGLLM_EXTRA_CA_CERTS ?? "").trim();
  if (!useSystemCA && !extraCertsPath) return result;

  if (
    typeof tlsModule.getCACertificates !== "function" ||
    typeof tlsModule.setDefaultCACertificates !== "function"
  ) {
    console.warn(
      `${LOG_PREFIX} Custom CA certificates need Node.js 22.19+ or 24.5+ (running ${process.version}) - ignoring ANYTHINGLLM_USE_SYSTEM_CA and ANYTHINGLLM_EXTRA_CA_CERTS.`
    );
    return result;
  }

  try {
    const trusted = new Set(tlsModule.getCACertificates("default"));
    const initialCount = trusted.size;

    if (useSystemCA) {
      const before = trusted.size;
      for (const cert of tlsModule.getCACertificates("system"))
        trusted.add(cert);
      result.system = trusted.size - before;
    }

    if (extraCertsPath) {
      const resolved = path.resolve(extraCertsPath);
      try {
        const { certs, skipped } = readPemBundle(resolved, fsModule);
        const before = trusted.size;
        for (const cert of certs) trusted.add(cert);
        result.extra = trusted.size - before;
        if (skipped > 0)
          console.warn(
            `${LOG_PREFIX} Skipped ${skipped} invalid certificate(s) in ${resolved}`
          );
        if (certs.length === 0)
          console.warn(
            `${LOG_PREFIX} No valid PEM certificates found in ${resolved}`
          );
      } catch (error) {
        console.warn(
          `${LOG_PREFIX} Could not read ANYTHINGLLM_EXTRA_CA_CERTS=${resolved} - ${error.message}`
        );
      }
    }

    if (trusted.size === initialCount) return result;
    tlsModule.setDefaultCACertificates([...trusted]);
    result.applied = true;
    console.log(
      `${LOG_PREFIX} Trusting ${trusted.size - initialCount} additional CA certificate(s) (operating system: ${result.system}, ANYTHINGLLM_EXTRA_CA_CERTS: ${result.extra})`
    );
  } catch (error) {
    result.applied = false;
    result.system = 0;
    result.extra = 0;
    console.warn(
      `${LOG_PREFIX} Could not load custom CA certificates - ${error.message}`
    );
  }
  return result;
}

module.exports = loadCACertificates;
