/*
 * This is a custom implementation of the Confluence langchain loader. There was an issue where
 * code blocks were not being extracted. This is a temporary fix until this issue is resolved.*/

const { htmlToText } = require("html-to-text");

class JiraIssueLoader {
  constructor({
    baseUrl,
    projectKey,
    username,
    accessToken,
    limit = 25,
    expand = "changelog",
    personalAccessToken,
    cloud = true,
  }) {
    this.baseUrl = baseUrl;
    this.projectKey = projectKey;
    this.username = username;
    this.accessToken = accessToken;
    this.limit = limit;
    this.expand = expand;
    this.personalAccessToken = personalAccessToken;
    this.cloud = cloud;
  }

  get authorizationHeader() {
    if (this.personalAccessToken) {
      return `Bearer ${this.personalAccessToken}`;
    } else if (this.username && this.accessToken) {
      const authToken = Buffer.from(
        `${this.username}:${this.accessToken}`
      ).toString("base64");
      return `Basic ${authToken}`;
    }
    return undefined;
  }

  async load(options) {
    try {
      const issues = await this.fetchAllIssuesInProject(
        options?.start,
        options?.limit
      );
      return issues.map((issue) => this.createDocumentFromIssue(issue));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async fetchJiraData(url) {
    try {
      const initialHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const authHeader = this.authorizationHeader;
      if (authHeader) {
        initialHeaders.Authorization = authHeader;
      }
      const response = await fetch(url, {
        headers: initialHeaders,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url} from Jira: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch ${url} from Jira: ${error}`);
    }
  }

  // https://developer.atlassian.com/rest/api/3/search?jql=project=ABC&startAt=0&maxResults=100
  async fetchAllIssuesInProject(start = 0, limit = this.limit) {
    const base = this.baseUrl.replace(/\/+$/, "");
    const apiVersion = this.cloud ? "3" : "2";

    const url = new URL(`/jira/rest/api/${apiVersion}/search`, base);
    url.searchParams.set("jql", `project=${this.projectKey}`);
    url.searchParams.set("startAt", String(start));
    url.searchParams.set("maxResults", String(limit));
    if (this.expand) url.searchParams.set("expand", String(this.expand));
    //url.searchParams.set('fields', 'summary,issuetype,status,assignee,priority,updated');

    const data = await this.fetchJiraData(url);

    const issues = Array.isArray(data?.issues) ? data.issues : [];
    if (!issues.length) return [];

    const total = Number.isFinite(data?.total) ? data.total : issues.length;
    const nextStart = start + issues.length;

    if (nextStart >= total) {
      return issues;
    }

    const nextIssueResults = await this.fetchAllIssuesInProject(
      nextStart,
      limit
    );
    return issues.concat(nextIssueResults);
  }

  createDocumentFromIssue(issue) {
    const extractCodeBlocks = (content) => {
      const codeBlockRegex =
        /<ac:structured-macro ac:name="code"[^>]*>[\s\S]*?<ac:plain-text-body><!\[CDATA\[([\s\S]*?)\]\]><\/ac:plain-text-body>[\s\S]*?<\/ac:structured-macro>/g;
      const languageRegex =
        /<ac:parameter ac:name="language">(.*?)<\/ac:parameter>/;

      return content.replace(codeBlockRegex, (match) => {
        const language = match.match(languageRegex)?.[1] || "";
        const code =
          match.match(
            /<ac:plain-text-body><!\[CDATA\[([\s\S]*?)\]\]><\/ac:plain-text-body>/
          )?.[1] || "";
        return `\n\`\`\`${language}\n${code.trim()}\n\`\`\`\n`;
      });
    };

    let rawDescription = "";
    if (issue.fields?.description) {
      if (issue.fields.description.storage?.value) {
        rawDescription = extractCodeBlocks(
          issue.fields.description.storage.value
        );
      } else if (typeof issue.fields.description === "string") {
        rawDescription = issue.fields.description;
      } else if (issue.fields.description.content) {
        rawDescription = issue.fields.description.content
          .map((block) => block.content?.map((c) => c.text || "").join(" "))
          .join("\n");
      }
    }

    const plainTextContent = htmlToText(rawDescription, {
      wordwrap: false,
      preserveNewlines: true,
    });
    const textWithPreservedStructure = plainTextContent.replace(
      /\n{3,}/g,
      "\n\n"
    );
    const issueUrl = `${this.baseUrl}/jira/browse/${issue.key}`;

    return {
      pageContent: textWithPreservedStructure,
      metadata: {
        id: issue.id,
        key: issue.key,
        status: issue.fields?.status?.name || "",
        title: issue.fields?.summary || "",
        type: issue.fields?.issuetype?.name || "",
        url: issueUrl,
        created_by: issue.fields?.creator?.displayName || "",
        created_at: issue.fields?.created || "",
        updated_by: issue.fields?.updated_by?.displayName || "",
        updated_at: issue.fields?.updated || "",
      },
    };
  }
}

module.exports = { JiraIssueLoader };
