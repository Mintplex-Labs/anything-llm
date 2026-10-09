/* eslint-env jest */

/**
 * Values written back to server/.env are single quoted so a value can never
 * escape its own line. Single quotes are also the one form that neither dotenv
 * nor `docker compose` unescapes, so line breaks have to travel as the literal
 * characters `\n`/`\r` and be restored when the process boots.
 *
 * Escaping is limited to the keys that can legitimately hold line breaks.
 * Everything else keeps the previous behaviour, so a value such as
 * `D:\reports\cert.pem` is never reinterpreted as containing a line break.
 */

const dotenv = require("dotenv");

const {
  MULTILINE_ENV_KEYS,
  sanitizeEnvValue,
  escapeEnvValue,
  unescapeEnvValue,
  serializeEnvValue,
  restoreEscapedEnvValues,
} = require("../../../utils/helpers/envValueCodec");

const PREFIX_KEY = "GENERIC_OPEN_AI_EMBEDDING_QUERY_PREFIX";
const PREFIX_VALUE =
  "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery: ";

describe("env value codec", () => {
  test("escapes and restores line breaks", () => {
    const escaped = escapeEnvValue("a\r\nb");
    expect(escaped).toBe("a\\r\\nb");
    expect(unescapeEnvValue(escaped)).toBe("a\r\nb");
  });

  test("escapes and restores backslashes so the round trip is exact", () => {
    const value = "line1\nD:\\new\\cert.pem";
    expect(unescapeEnvValue(escapeEnvValue(value))).toBe(value);
  });

  test("serializes a multi-line prefix onto a single quoted line", () => {
    const serialized = serializeEnvValue(PREFIX_KEY, PREFIX_VALUE);

    expect(serialized).toBe(
      `'Instruct: Given a web search query, retrieve relevant passages that answer the query\\nQuery: '`
    );
    expect(serialized).not.toMatch(/[\r\n]/);
    expect(dotenv.parse(`KEY=${serialized}`).KEY).not.toBe(PREFIX_VALUE);
  });

  test("keeps a multi-line value byte for byte through dotenv and restore", () => {
    const env = dotenv.parse(
      `${PREFIX_KEY}=${serializeEnvValue(PREFIX_KEY, PREFIX_VALUE)}\n`
    );
    restoreEscapedEnvValues(env);

    expect(env[PREFIX_KEY]).toBe(PREFIX_VALUE);
  });

  test("only multi-line capable keys are escaped", () => {
    expect(MULTILINE_ENV_KEYS.has(PREFIX_KEY)).toBe(true);

    // A path that happens to contain \r/\n stays exactly as the user wrote it.
    const certPath = "D:\\reports\\cert.pem";
    expect(serializeEnvValue("HTTPS_CERT_PATH", certPath)).toBe(
      `'${certPath}'`
    );
    const env = { HTTPS_CERT_PATH: certPath };
    restoreEscapedEnvValues(env);
    expect(env.HTTPS_CERT_PATH).toBe(certPath);
  });

  test("still truncates values at characters that could break out of the quotes", () => {
    expect(sanitizeEnvValue("safe'\nINJECTED=1")).toBe("safe");
    expect(sanitizeEnvValue('safe"INJECTED=1')).toBe("safe");
    expect(sanitizeEnvValue("safe`INJECTED=1")).toBe("safe");
    expect(sanitizeEnvValue("safe#INJECTED=1")).toBe("safe");
    expect(sanitizeEnvValue("safe\tINJECTED=1")).toBe("safe");
    expect(sanitizeEnvValue("safe\nINJECTED=1")).toBe("safe");
  });

  test("allows line breaks only where they are expected", () => {
    expect(sanitizeEnvValue("a\nb", { allowLineBreaks: true })).toBe("a\nb");
    expect(sanitizeEnvValue("a\r\nb", { allowLineBreaks: true })).toBe(
      "a\r\nb"
    );
    // Still stops at the first injectable character.
    expect(sanitizeEnvValue("a\nb'injected", { allowLineBreaks: true })).toBe(
      "a\nb"
    );
  });
});
