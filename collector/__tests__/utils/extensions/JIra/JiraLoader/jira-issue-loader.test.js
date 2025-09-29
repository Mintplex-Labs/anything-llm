const { JiraIssueLoader } = require("../../../../../utils/extensions/Jira/JiraLoader");

describe("JiraIssueLoader", () => {
  const baseUrl = "https://example.atlassian.net";
  const projectKey = "TEST";
  const username = "user";
  const accessToken = "token";
  const personalAccessToken = "pat";

  let loader;

  beforeEach(() => {
    loader = new JiraIssueLoader({ baseUrl, projectKey, username, accessToken });
  });

  test("generates Basic auth header with username and token", () => {
    const expected = `Basic ${Buffer.from(`${username}:${accessToken}`).toString("base64")}`;
    expect(loader.authorizationHeader).toBe(expected);
  });

  test("generates Bearer auth header with personal access token", () => {
    const patLoader = new JiraIssueLoader({ baseUrl, projectKey, personalAccessToken });
    expect(patLoader.authorizationHeader).toBe(`Bearer ${personalAccessToken}`);
  });

  test("createDocumentFromIssue extracts code blocks correctly", () => {
    const issue = {
      id: "1",
      key: "TEST-1",
      fields: {
        summary: "Test Issue",
        description: {
          storage: {
            value: `<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">js</ac:parameter><ac:plain-text-body><![CDATA[console.log("Hello World");]]></ac:plain-text-body></ac:structured-macro>`
          }
        },
        status: { name: "Open" },
        issuetype: { name: "Task" },
        creator: { displayName: "Alice" },
        created: "2025-01-01T00:00:00.000Z",
      },
    };

    const doc = loader.createDocumentFromIssue(issue);

    expect(doc.pageContent).toContain("```js\nconsole.log(\"Hello World\");\n```");
    expect(doc.metadata.id).toBe("1");
    expect(doc.metadata.key).toBe("TEST-1");
    expect(doc.metadata.status).toBe("Open");
    expect(doc.metadata.title).toBe("Test Issue");
    expect(doc.metadata.created_by).toBe("Alice");
    expect(doc.metadata.url).toBe(`${baseUrl}/jira/browse/TEST-1`);
  });

  test("load returns empty array on fetch failure", async () => {
    // Suppress console.error output
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock fetchJiraData to throw an error
    jest.spyOn(loader, "fetchJiraData").mockImplementation(async () => {
      throw new Error("Network error");
    });

    const result = await loader.load();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("Error:", expect.any(Error));

    consoleSpy.mockRestore();
  });

  test("fetchAllIssuesInProject handles paginated results", async () => {
    const totalIssues = 4;

    // Mock fetchJiraData to simulate paginated API
    jest.spyOn(loader, "fetchJiraData").mockImplementation(async (url) => {
      const urlObj = new URL(url);
      const startAt = parseInt(urlObj.searchParams.get("startAt") || "0", 10);
      const limit = parseInt(urlObj.searchParams.get("maxResults") || "25", 10);

      const issues = [];
      for (let i = startAt + 1; i <= Math.min(startAt + limit, totalIssues); i++) {
        issues.push({ id: i, key: `TEST-${i}`, fields: {} });
      }

      return { issues, total: totalIssues };
    });

    const issues = await loader.fetchAllIssuesInProject();
    expect(issues).toHaveLength(totalIssues);
    expect(issues.map(i => i.key)).toEqual(["TEST-1", "TEST-2", "TEST-3", "TEST-4"]);
  });
});
