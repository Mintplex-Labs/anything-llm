process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const JWT = require("jsonwebtoken");
const { User } = require("../../models/user");
const { jsonrepair } = require("jsonrepair");
const extract = require("extract-json-from-string");

function reqBody(request) {
  return typeof request.body === "string"
    ? JSON.parse(request.body)
    : request.body;
}

function queryParams(request) {
  return request.query;
}

/**
 * Creates a JWT with the given info and expiry
 * @param {object} info - The info to include in the JWT
 * @param {string} expiry - The expiry time for the JWT (default: 30 days)
 * @returns {string} The JWT
 */
function makeJWT(info = {}, expiry = "30d") {
  if (!process.env.JWT_SECRET)
    throw new Error("Cannot create JWT as JWT_SECRET is unset.");
  return JWT.sign(info, process.env.JWT_SECRET, { expiresIn: expiry });
}

/**
 * Gets the user from the session
 * Note: Only valid for multi-user mode
 * as single-user mode with password is not a "user"
 * @param {import("express").Request} request - The request object
 * @param {import("express").Response} response - The response object
 * @returns {Promise<import("@prisma/client").users | null>} The user
 */
async function userFromSession(request, response = null) {
  if (!!response && !!response.locals?.user) {
    return response.locals.user;
  }

  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    return null;
  }

  const valid = decodeJWT(token);
  if (!valid || !valid.id) {
    return null;
  }

  const user = await User.get({ id: valid.id });
  return user;
}

function decodeJWT(jwtToken) {
  try {
    return JWT.verify(jwtToken, process.env.JWT_SECRET);
  } catch {}
  return { p: null, id: null, username: null };
}

function multiUserMode(response) {
  return response?.locals?.multiUserMode;
}

function parseAuthHeader(headerValue = null, apiKey = null) {
  if (headerValue === null || apiKey === null) return {};
  if (headerValue === "Authorization")
    return { Authorization: `Bearer ${apiKey}` };
  return { [headerValue]: apiKey };
}

/**
 * Repairs improperly-escaped backslash sequences in a raw JSON string emitted
 * by an LLM tool call, BEFORE it is parsed.
 *
 * LLMs routinely write LaTeX (and Windows paths) inside JSON string values
 * without escaping the backslash — e.g. `"$\frac{1}{2}$"` instead of the valid
 * `"$\\frac{1}{2}$"`. Standard JSON.parse then either:
 *   - silently decodes the escape into a control character — `\f` -> U+000C
 *     (form feed), `\b` -> U+0008 — which both consumes the following letter
 *     (so `\frac` becomes `rac`) and embeds a character that is illegal in
 *     XML 1.0, making the generated .docx/.xlsx/.pptx unopenable; or
 *   - throws on an invalid escape (`\a` in `\alpha`, `\g` in `\gamma`, ...),
 *     causing safeJsonParse to fall back and the whole tool call to be dropped.
 *
 * This walks the string and, only inside JSON string literals, rewrites any
 * backslash that is NOT a safe/intended escape into a literal backslash (`\\`)
 * so the original text survives the parse. Intentional escapes are preserved
 * untouched: `\" \\ \/ \n \r \t` and a well-formed `\uXXXX`. `\f` and `\b` are
 * treated as literal because a model that emits them almost always means LaTeX
 * (`\frac`, `\beta`), not a control character.
 *
 * Note: `\n`, `\r`, `\t` are kept as whitespace because models overwhelmingly
 * use them for real markdown newlines/tabs; the rare LaTeX collision (`\nu`,
 * `\tau`, `\rho`) is an accepted trade-off and, unlike `\f`/`\b`, decodes to a
 * character that is legal in XML so it never corrupts a generated document.
 * @param {string} input - Raw JSON string from an LLM tool call.
 * @returns {string} The same JSON with unsafe backslash escapes made literal.
 */
function repairJsonEscapes(input) {
  if (typeof input !== "string" || !input.includes("\\")) return input;

  let out = "";
  let inString = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (ch !== "\\") {
      if (ch === '"') inString = !inString;
      out += ch;
      continue;
    }

    // A backslash outside a string literal cannot start an escape in JSON —
    // leave it for the parser/jsonrepair to handle.
    if (!inString) {
      out += ch;
      continue;
    }

    const next = input[i + 1];

    // Preserve intended escapes verbatim. Consuming `next` here also means an
    // escaped quote (`\"`) does not flip the in-string state below.
    if (
      next === '"' ||
      next === "\\" ||
      next === "/" ||
      next === "n" ||
      next === "r" ||
      next === "t"
    ) {
      out += ch + next;
      i++;
      continue;
    }

    // `\uXXXX` is only a valid escape with four hex digits; otherwise the
    // backslash is literal (e.g. LaTeX `\underline`, `\unit`).
    if (next === "u" && /^[0-9a-fA-F]{4}$/.test(input.slice(i + 2, i + 6))) {
      out += input.slice(i, i + 6);
      i += 5;
      continue;
    }

    // Everything else (`\f` `\b` `\v` `\a` `\g` `\u`-non-hex, a trailing
    // backslash, ...) is a literal backslash the model meant to keep.
    out += "\\\\";
    if (next !== undefined) {
      out += next;
      i++;
    }
  }

  return out;
}

/**
 * @param {string|null} jsonString - The JSON string to parse.
 * @param {*} fallback - Returned if the string cannot be parsed.
 * @param {{repairLLMEscapes?: boolean}} [options] - When `repairLLMEscapes` is
 * true the raw string is first run through {@link repairJsonEscapes} to recover
 * unescaped LaTeX/path backslashes emitted by LLM tool calls. Off by default so
 * behavior is unchanged for all existing (non tool-call) callers.
 */
function safeJsonParse(
  jsonString,
  fallback = null,
  { repairLLMEscapes = false } = {}
) {
  if (jsonString === null) return fallback;
  if (repairLLMEscapes) jsonString = repairJsonEscapes(jsonString);

  try {
    return JSON.parse(jsonString);
  } catch {}

  if (jsonString?.startsWith("[") || jsonString?.startsWith("{")) {
    try {
      const repairedJson = jsonrepair(jsonString);
      return JSON.parse(repairedJson);
    } catch {}
  }

  try {
    return extract(jsonString)?.[0] || fallback;
  } catch {}

  return fallback;
}

function isValidUrl(urlString = "") {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    return true;
  } catch {}
  return false;
}

function toValidNumber(number = null, fallback = null) {
  if (isNaN(Number(number))) return fallback;
  return Number(number);
}

/**
 * Decode HTML entities from a string.
 * The DMR response is encoded with HTML entities, so we need to decode them
 * so we can parse the JSON and report the progress percentage.
 * @param {string} str - The string to decode.
 * @returns {string} The decoded string.
 */
function decodeHtmlEntities(str) {
  return str
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

module.exports = {
  reqBody,
  multiUserMode,
  queryParams,
  makeJWT,
  decodeJWT,
  userFromSession,
  parseAuthHeader,
  safeJsonParse,
  repairJsonEscapes,
  isValidUrl,
  toValidNumber,
  decodeHtmlEntities,
};
