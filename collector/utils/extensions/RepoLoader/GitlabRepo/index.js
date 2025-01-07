const RepoLoader = require("./RepoLoader");
const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../../files");
const { tokenizeString } = require("../../../tokenizer");

/**
 * Load in a Gitlab Repo recursively or just the top level if no PAT is provided
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadGitlabRepo(args, response) {
  const repo = new RepoLoader(args);
  await repo.init();

  if (!repo.ready)
    return {
      success: false,
      reason: "Could not prepare Gitlab repo for loading! Check URL",
    };

  console.log(
    `-- Working GitLab ${repo.author}/${repo.project}:${repo.branch} --`
  );
  const docs = await repo.recursiveLoader();
  if (!docs.length) {
    return {
      success: false,
      reason: "No files were found for those settings.",
    };
  }

  console.log(`[GitLab Loader]: Found ${docs.length} source files. Saving...`);
  const outFolder = slugify(
    `${repo.author}-${repo.project}-${repo.branch}-${v4().slice(0, 4)}`
  ).toLowerCase();

  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../../../server/storage/documents/${outFolder}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  for (const doc of docs) {
    if (!doc.metadata || (!doc.pageContent && !doc.issue)) continue;
    let pageContent = null;

    const data = {
      id: v4(),
      url: "gitlab://" + doc.metadata.source,
      docSource: doc.metadata.source,
      chunkSource: generateChunkSource(
        repo,
        doc,
        response.locals.encryptionWorker
      ),
      published: new Date().toLocaleString(),
    };

    if (doc.pageContent) {
      pageContent = doc.pageContent;

      data.title = doc.metadata.source;
      data.docAuthor = repo.author;
      data.description = "No description found.";
    } else if (doc.issue) {
      pageContent = issueToMarkdown(doc.issue);

      data.title = `Issue ${doc.issue.iid}: ${doc.issue.title}`;
      data.docAuthor = doc.issue.author.username;
      data.description = doc.issue.description;
    } else {
      continue;
    }

    data.wordCount = pageContent.split(" ").length;
    data.token_count_estimate = tokenizeString(pageContent).length;
    data.pageContent = pageContent;

    console.log(
      `[GitLab Loader]: Saving ${doc.metadata.source} to ${outFolder}`
    );

    writeToServerDocuments(
      data,
      `${slugify(doc.metadata.source)}-${data.id}`,
      outFolderPath
    );
  }

  return {
    success: true,
    reason: null,
    data: {
      author: repo.author,
      repo: repo.project,
      projectId: repo.projectId,
      branch: repo.branch,
      files: docs.length,
      destination: outFolder,
    },
  };
}

async function fetchGitlabFile({
  repoUrl,
  branch,
  accessToken = null,
  sourceFilePath,
}) {
  const repo = new RepoLoader({
    repo: repoUrl,
    branch,
    accessToken,
  });
  await repo.init();

  if (!repo.ready)
    return {
      success: false,
      content: null,
      reason: "Could not prepare GitLab repo for loading! Check URL or PAT.",
    };
  console.log(
    `-- Working GitLab ${repo.author}/${repo.project}:${repo.branch} file:${sourceFilePath} --`
  );
  const fileContent = await repo.fetchSingleFile(sourceFilePath);
  if (!fileContent) {
    return {
      success: false,
      reason: "Target file returned a null content response.",
      content: null,
    };
  }

  return {
    success: true,
    reason: null,
    content: fileContent,
  };
}

function generateChunkSource(repo, doc, encryptionWorker) {
  const payload = {
    projectId: decodeURIComponent(repo.projectId),
    branch: repo.branch,
    path: doc.metadata.source,
    pat: !!repo.accessToken ? repo.accessToken : null,
  };
  return `gitlab://${repo.repo}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

function issueToMarkdown(issue) {
  const metadata = {};

  const userFields = ["author", "assignees", "closed_by"];
  const userToUsername = ({ username }) => username;
  for (const userField of userFields) {
    if (issue[userField]) {
      if (Array.isArray(issue[userField])) {
        metadata[userField] = issue[userField].map(userToUsername);
      } else {
        metadata[userField] = userToUsername(issue[userField]);
      }
    }
  }

  const singleValueFields = [
    "web_url",
    "state",
    "created_at",
    "updated_at",
    "closed_at",
    "due_date",
    "type",
    "merge_request_count",
    "upvotes",
    "downvotes",
    "labels",
    "has_tasks",
    "task_status",
    "confidential",
    "severity",
  ];

  for (const singleValueField of singleValueFields) {
    metadata[singleValueField] = issue[singleValueField];
  }

  if (issue.milestone) {
    metadata.milestone = `${issue.milestone.title} (${issue.milestone.id})`;
  }

  if (issue.time_stats) {
    const timeFields = ["time_estimate", "total_time_spent"];
    for (const timeField of timeFields) {
      const fieldName = `human_${timeField}`;
      if (issue?.time_stats[fieldName]) {
        metadata[timeField] = issue.time_stats[fieldName];
      }
    }
  }

  const metadataString = Object.entries(metadata)
    .map(([name, value]) => {
      if (!value || value?.length < 1) {
        return null;
      }
      let result = `- ${name.replace("_", " ")}:`;

      if (!Array.isArray(value)) {
        result += ` ${value}`;
      } else {
        result += "\n" + value.map((s) => `  - ${s}`).join("\n");
      }

      return result;
    })
    .filter((item) => item != null)
    .join("\n");

  let markdown = `# ${issue.title} (${issue.iid})

${issue.description}

## Metadata

${metadataString}`;

  if (issue.discussions.length > 0) {
    markdown += `

## Activity

${issue.discussions.join("\n\n")}
`;
  }

  return markdown;
}

module.exports = { loadGitlabRepo, fetchGitlabFile };
