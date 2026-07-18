import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

export const CHECKSUMS_START = "<!-- source-checksums:start -->";
export const CHECKSUMS_END = "<!-- source-checksums:end -->";

export function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

export async function sha256Stream(stream) {
  const hash = createHash("sha256");
  for await (const chunk of stream) hash.update(chunk);
  return hash.digest("hex");
}

export function sourceArchiveUrls(repository, tag) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository))
    throw new Error(`Invalid GitHub repository: ${repository}`);
  if (!tag) throw new Error("Release tag is required.");

  const encodedTag = tag
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const baseUrl = `https://github.com/${repository}/archive/refs/tags/${encodedTag}`;
  return [
    { label: "Source code (zip)", url: `${baseUrl}.zip` },
    { label: "Source code (tar.gz)", url: `${baseUrl}.tar.gz` },
  ];
}

export function renderChecksumSection(archives) {
  if (!Array.isArray(archives) || archives.length === 0)
    throw new Error("At least one source archive is required.");

  const rows = archives.map(({ label, url, digest }) => {
    if (!label || !url || !/^[a-f0-9]{64}$/.test(digest))
      throw new Error("Archive label, URL, and SHA-256 digest are required.");
    return `| [${label}](${url}) | \`${digest}\` |`;
  });

  return [
    CHECKSUMS_START,
    "## Source checksums",
    "",
    "| Archive | SHA-256 |",
    "| --- | --- |",
    ...rows,
    CHECKSUMS_END,
  ].join("\n");
}

export function upsertChecksumSection(releaseBody, checksumSection) {
  const body = releaseBody ?? "";
  const startIndex = body.indexOf(CHECKSUMS_START);
  const endIndex = body.indexOf(CHECKSUMS_END);

  if ((startIndex === -1) !== (endIndex === -1) || endIndex < startIndex)
    throw new Error("Release notes contain an incomplete checksum section.");

  if (startIndex === -1)
    return [body.trimEnd(), checksumSection].filter(Boolean).join("\n\n");

  const before = body.slice(0, startIndex).trimEnd();
  const after = body.slice(endIndex + CHECKSUMS_END.length).trimStart();
  return [before, checksumSection, after].filter(Boolean).join("\n\n");
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Request failed (${response.status} ${response.statusText}): ${details}`
    );
  }
  return response;
}

export async function publishSourceChecksums({
  repository,
  releaseId,
  tag,
  token,
}) {
  if (!/^\d+$/.test(String(releaseId)))
    throw new Error("A numeric release ID is required.");
  if (!token) throw new Error("GH_TOKEN is required.");

  const archives = [];
  for (const archive of sourceArchiveUrls(repository, tag)) {
    const response = await request(archive.url, { redirect: "follow" });
    if (!response.body)
      throw new Error(`Source archive response was empty: ${archive.url}`);
    archives.push({ ...archive, digest: await sha256Stream(response.body) });
  }

  const apiUrl = `https://api.github.com/repos/${repository}/releases/${releaseId}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "anything-llm-release-checksums",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const release = await request(apiUrl, { headers }).then((response) =>
    response.json()
  );
  const body = upsertChecksumSection(
    release.body,
    renderChecksumSection(archives)
  );

  await request(apiUrl, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ body }),
  });
}

async function main() {
  await publishSourceChecksums({
    repository: process.env.GITHUB_REPOSITORY,
    releaseId: process.env.RELEASE_ID,
    tag: process.env.RELEASE_TAG,
    token: process.env.GH_TOKEN,
  });
  console.log(
    `Published source archive checksums for ${process.env.RELEASE_TAG}.`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
