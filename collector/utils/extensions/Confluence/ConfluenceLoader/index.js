/*
 * This is a custom implementation of the Confluence langchain loader. There was an issue where
 * code blocks were not being extracted. This is a temporary fix until this issue is resolved.*/

const { htmlToText } = require("html-to-text");

class ConfluencePagesLoader {
  constructor({
    baseUrl,
    spaceKey,
    username,
    accessToken,
    limit = 25,
    expand = "body.storage,version",
    personalAccessToken,
  }) {
    this.baseUrl = baseUrl;
    this.spaceKey = spaceKey;
    this.username = username;
    this.accessToken = accessToken;
    this.limit = limit;
    this.expand = expand;
    this.personalAccessToken = personalAccessToken;
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
      const pages = await this.fetchAllPagesInSpace(
        options?.start,
        options?.limit
      );
      return pages.map((page) => this.createDocumentFromPage(page));
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  async fetchConfluenceData(url) {
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
        throw new Error(
          `Failed to fetch ${url} from Confluence: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch ${url} from Confluence: ${error}`);
    }
  }

  async fetchAllPagesInSpace(start = 0, limit = this.limit) {
    const url = `${this.baseUrl}/rest/api/content?spaceKey=${this.spaceKey}&limit=${limit}&start=${start}&expand=${this.expand}`;
    const data = await this.fetchConfluenceData(url);
    if (data.size === 0) {
      return [];
    }
    const nextPageStart = start + data.size;
    const nextPageResults = await this.fetchAllPagesInSpace(
      nextPageStart,
      limit
    );
    return data.results.concat(nextPageResults);
  }

  createDocumentFromPage(page) {
    // Function to extract code blocks
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

    const contentWithCodeBlocks = extractCodeBlocks(page.body.storage.value);
    const plainTextContent = htmlToText(contentWithCodeBlocks, {
      wordwrap: false,
      preserveNewlines: true,
    });
    const textWithPreservedStructure = plainTextContent.replace(
      /\n{3,}/g,
      "\n\n"
    );
    const pageUrl = `${this.baseUrl}/spaces/${this.spaceKey}/pages/${page.id}`;

    return {
      pageContent: textWithPreservedStructure,
      metadata: {
        id: page.id,
        status: page.status,
        title: page.title,
        type: page.type,
        url: pageUrl,
        version: page.version?.number,
        updated_by: page.version?.by?.displayName,
        updated_at: page.version?.when,
      },
    };
  }
}

module.exports = { ConfluencePagesLoader };
