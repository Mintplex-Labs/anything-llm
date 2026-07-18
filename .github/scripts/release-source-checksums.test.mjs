import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { describe, test } from "node:test";
import {
  CHECKSUMS_END,
  CHECKSUMS_START,
  publishSourceChecksums,
  renderChecksumSection,
  sha256,
  sha256Stream,
  sourceArchiveUrls,
  upsertChecksumSection,
} from "./release-source-checksums.mjs";

const archive = {
  label: "Source code (zip)",
  url: "https://github.com/Mintplex-Labs/anything-llm/archive/refs/tags/v1.2.3.zip",
  digest: "a".repeat(64),
};

describe("release source checksums", () => {
  test("builds source archive URLs for tags with path segments", () => {
    assert.deepEqual(
      sourceArchiveUrls("Mintplex-Labs/anything-llm", "release/v1.2.3"),
      [
        {
          label: "Source code (zip)",
          url: "https://github.com/Mintplex-Labs/anything-llm/archive/refs/tags/release/v1.2.3.zip",
        },
        {
          label: "Source code (tar.gz)",
          url: "https://github.com/Mintplex-Labs/anything-llm/archive/refs/tags/release/v1.2.3.tar.gz",
        },
      ]
    );
  });

  test("calculates a SHA-256 digest", () => {
    assert.equal(
      sha256("AnythingLLM"),
      "fc9085f77a432be18cda8b8266bc6a6893889f6270d68ef29fe863a03852ae35"
    );
  });

  test("calculates a SHA-256 digest from a stream", async () => {
    assert.equal(
      await sha256Stream(Readable.from(["Anything", "LLM"])),
      "fc9085f77a432be18cda8b8266bc6a6893889f6270d68ef29fe863a03852ae35"
    );
  });

  test("renders a marked Markdown checksum table", () => {
    const section = renderChecksumSection([archive]);
    assert.match(section, new RegExp(`^${CHECKSUMS_START}`));
    assert.match(section, /\| Archive \| SHA-256 \|/);
    assert.match(section, new RegExp(`${"a".repeat(64)}`));
    assert.match(section, new RegExp(`${CHECKSUMS_END}$`));
  });

  test("appends checksums without replacing existing release notes", () => {
    const section = renderChecksumSection([archive]);
    assert.equal(
      upsertChecksumSection("# Release notes\n\nExisting details.\n", section),
      `# Release notes\n\nExisting details.\n\n${section}`
    );
  });

  test("replaces an existing checksum section and preserves trailing notes", () => {
    const section = renderChecksumSection([archive]);
    const existing = [
      "# Release notes",
      "",
      CHECKSUMS_START,
      "old checksums",
      CHECKSUMS_END,
      "",
      "Postscript.",
    ].join("\n");

    assert.equal(
      upsertChecksumSection(existing, section),
      `# Release notes\n\n${section}\n\nPostscript.`
    );
  });

  test("rejects an incomplete checksum section", () => {
    assert.throws(
      () => upsertChecksumSection(`Notes\n${CHECKSUMS_START}`, "replacement"),
      /incomplete checksum section/
    );
  });

  test("downloads both archives and updates the existing release body", async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];
    let patchedBody;
    globalThis.fetch = async (url, options = {}) => {
      requests.push({ url, options });
      if (url.endsWith(".zip")) return new Response("zip archive");
      if (url.endsWith(".tar.gz")) return new Response("tar archive");
      if (options.method === "PATCH") {
        patchedBody = JSON.parse(options.body).body;
        return new Response("{}", { status: 200 });
      }
      return new Response(
        JSON.stringify({ body: "# Existing release notes" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    };

    try {
      await publishSourceChecksums({
        repository: "Mintplex-Labs/anything-llm",
        releaseId: "123",
        tag: "v1.2.3",
        token: "test-token",
      });
    } finally {
      globalThis.fetch = originalFetch;
    }

    assert.equal(requests.length, 4);
    assert.equal(
      requests[2].options.headers.Authorization,
      "Bearer test-token"
    );
    assert.equal(requests[3].options.method, "PATCH");
    assert.match(patchedBody, /^# Existing release notes/);
    assert.match(patchedBody, new RegExp(sha256("zip archive")));
    assert.match(patchedBody, new RegExp(sha256("tar archive")));
  });
});
