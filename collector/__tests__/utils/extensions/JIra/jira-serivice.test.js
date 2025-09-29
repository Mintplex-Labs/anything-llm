process.env.NODE_ENV = "development";
process.env.STORAGE_DIR = "C:/temp";

const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const { loadJira, fetchJiraIssue } = require("../../../../utils/extensions/Jira");
const { JiraIssueLoader } = require("../../../../utils/extensions/Jira/JiraLoader");
const { writeToServerDocuments, sanitizeFileName } = require("../../../../utils/files");
const { tokenizeString } = require("../../../../utils/tokenizer");

jest.mock("../../../../utils/extensions/Jira/JiraLoader");
jest.mock("../../../../utils/files");
jest.mock("../../../../utils/tokenizer");
jest.mock("fs");

describe("Jira Service", () => {
  const mockResponse = { locals: { encryptionWorker: { encrypt: jest.fn((s) => `encrypted:${s}`) } } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadJira", () => {
    test("fails when no credentials provided", async () => {
      const result = await loadJira({ baseUrl: "https://example.atlassian.net", projectKey: "TEST" }, mockResponse);
      expect(result.success).toBe(false);
      expect(result.reason).toContain("You need either a personal access token");
    });

    test("fails when invalid baseUrl", async () => {
      const result = await loadJira({ baseUrl: "invalid-url", projectKey: "TEST", personalAccessToken: "pat" }, mockResponse);
      expect(result.success).toBe(false);
      expect(result.reason).toContain("Provided base URL is not a valid URL");
    });

    test("saves documents correctly when Jira returns issues", async () => {
      const mockDocs = [
        {
          pageContent: "Test content",
          metadata: { title: "Issue 1", url: "https://example.atlassian.net/browse/TEST-1", source: "Test source" },
        },
      ];

      JiraIssueLoader.mockImplementation(() => ({
        load: jest.fn().mockResolvedValue(mockDocs),
      }));

      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});

      sanitizeFileName.mockImplementation((s) => s);
      tokenizeString.mockReturnValue(5);
      writeToServerDocuments.mockImplementation(() => {});

      const result = await loadJira(
        { baseUrl: "https://example.atlassian.net", projectKey: "TEST", personalAccessToken: "pat" },
        mockResponse
      );

      expect(result.success).toBe(true);
      expect(writeToServerDocuments).toHaveBeenCalled();
      expect(tokenizeString).toHaveBeenCalledWith("Test content");
      expect(mockResponse.locals.encryptionWorker.encrypt).toHaveBeenCalled();
    });
  });

  describe("fetchJiraIssue", () => {
    test("fails when required params are missing", async () => {
      const result = await fetchJiraIssue({ baseUrl: null, pageUrl: "url", projectKey: "TEST", username: "user", accessToken: "token" });
      expect(result.success).toBe(false);
      expect(result.reason).toContain("You need either a username and access token");
    });

    test("returns content when Jira issue found", async () => {
      const mockDocs = [
        { pageContent: "Issue content", metadata: { url: "url" } },
      ];

      JiraIssueLoader.mockImplementation(() => ({
        load: jest.fn().mockResolvedValue(mockDocs),
      }));

      const result = await fetchJiraIssue({
        baseUrl: "https://example.atlassian.net",
        pageUrl: "url",
        projectKey: "TEST",
        username: "user",
        accessToken: "token",
      });

      expect(result.success).toBe(true);
      expect(result.content).toBe("Issue content");
    });

    test("returns failure when issue not found", async () => {
      const mockDocs = [
        { pageContent: "Other content", metadata: { url: "other-url" } },
      ];

      JiraIssueLoader.mockImplementation(() => ({
        load: jest.fn().mockResolvedValue(mockDocs),
      }));

      const result = await fetchJiraIssue({
        baseUrl: "https://example.atlassian.net",
        pageUrl: "url",
        projectKey: "TEST",
        username: "user",
        accessToken: "token",
      });

      expect(result.success).toBe(false);
      expect(result.content).toBeNull();
      expect(result.reason).toContain("Target page could not be found");
    });
  });
});
