/* eslint-env jest */
const fs = require("fs");
const path = require("path");
const prisma = require("../../utils/prisma");
const { Document } = require("../../models/documents");
const { WorkspaceParsedFiles } = require("../../models/workspaceParsedFiles");

jest.mock("fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock("../../utils/prisma", () => ({
  workspace_parsed_files: {
    findFirst: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

jest.mock("../../utils/files", () => ({
  documentsPath: "/documents",
  directUploadsPath: "/direct-uploads",
}));

jest.mock("../../models/documents", () => ({
  Document: {
    addDocuments: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));

describe("WorkspaceParsedFiles.moveToDocuments", () => {
  const workspace = { id: 1, slug: "test-workspace" };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.workspace_parsed_files.findFirst.mockResolvedValue({
      id: 7,
      workspaceId: workspace.id,
      userId: null,
      metadata: JSON.stringify({ location: "attachment.json" }),
    });
    prisma.workspace_parsed_files.deleteMany.mockResolvedValue({ count: 1 });
    fs.existsSync.mockReturnValue(true);
    Document.addDocuments.mockResolvedValue({
      failedToEmbed: [],
      errors: [],
      embedded: ["custom-documents/attachment.json"],
    });
    Document.get.mockResolvedValue({
      id: 1,
      docpath: "custom-documents/attachment.json",
    });
  });

  it("keeps the parsed file record when copying the file fails", async () => {
    fs.copyFileSync.mockImplementationOnce(() => {
      throw new Error("disk is read-only");
    });

    await expect(
      WorkspaceParsedFiles.moveToDocuments(null, 7, workspace)
    ).rejects.toThrow("disk is read-only");

    expect(prisma.workspace_parsed_files.deleteMany).not.toHaveBeenCalled();
  });

  it("keeps the parsed file record when the source file is missing", async () => {
    fs.existsSync.mockReturnValueOnce(false);

    await expect(
      WorkspaceParsedFiles.moveToDocuments(null, 7, workspace)
    ).rejects.toThrow("Source file not found");

    expect(prisma.workspace_parsed_files.deleteMany).not.toHaveBeenCalled();
  });

  it("removes the parsed file record only after the move succeeds", async () => {
    const result = await WorkspaceParsedFiles.moveToDocuments(
      null,
      7,
      workspace
    );

    expect(result).toBe("custom-documents/attachment.json");
    expect(fs.copyFileSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalledWith(
      path.join("/direct-uploads", "attachment.json")
    );
    expect(prisma.workspace_parsed_files.deleteMany).toHaveBeenCalledWith({
      where: { id: 7, workspaceId: workspace.id },
    });
  });

  it("keeps the parsed attachment when embedding the copied file fails", async () => {
    Document.addDocuments.mockResolvedValueOnce({
      failedToEmbed: ["attachment"],
      errors: ["embedder rejected the request"],
      embedded: [],
    });

    const result = await WorkspaceParsedFiles.moveToDocumentsAndEmbed(
      null,
      7,
      workspace
    );

    expect(result).toEqual({
      success: false,
      error: "embedder rejected the request",
      document: null,
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith(
      path.join("/documents", "custom-documents", "attachment.json")
    );
    expect(fs.unlinkSync).not.toHaveBeenCalledWith(
      path.join("/direct-uploads", "attachment.json")
    );
    expect(prisma.workspace_parsed_files.deleteMany).not.toHaveBeenCalled();
  });

  it("removes the parsed attachment only after embedding succeeds", async () => {
    const result = await WorkspaceParsedFiles.moveToDocumentsAndEmbed(
      null,
      7,
      workspace
    );

    expect(result.success).toBe(true);
    expect(fs.unlinkSync).toHaveBeenCalledWith(
      path.join("/direct-uploads", "attachment.json")
    );
    expect(prisma.workspace_parsed_files.deleteMany).toHaveBeenCalledWith({
      where: { id: 7, workspaceId: workspace.id },
    });
  });
});
