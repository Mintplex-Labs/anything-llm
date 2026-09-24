jest.mock("../../../utils/prisma", () => ({
  prisma: {
    workspaces: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const { Workspace } = require("../../../models/workspace");
const { Document } = require("../../../models/documents");
const {
  WorkspaceParsedFiles,
} = require("../../../models/workspaceParsedFiles");
const { prisma } = require("../../../utils/prisma");

describe("Workspace scoping for the manager role", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getWithUser", () => {
    it("lets admins bypass the membership filter", async () => {
      prisma.workspaces.findFirst.mockResolvedValue({ id: 1, slug: "ws" });
      jest.spyOn(WorkspaceParsedFiles, "totalTokenCount").mockResolvedValue(0);

      const result = await Workspace.getWithUser(
        { id: 1, role: "admin" },
        { slug: "ws" }
      );

      expect(result).toMatchObject({ id: 1 });
      const arg = prisma.workspaces.findFirst.mock.calls[0][0];
      expect(arg.where).toEqual({ slug: "ws" });
    });

    it("scopes managers to workspaces they are a member of", async () => {
      prisma.workspaces.findFirst.mockResolvedValue({
        id: 2,
        slug: "ws",
        workspace_users: [],
      });
      jest.spyOn(Document, "forWorkspace").mockResolvedValue([]);
      jest.spyOn(WorkspaceParsedFiles, "totalTokenCount").mockResolvedValue(0);

      const result = await Workspace.getWithUser(
        { id: 5, role: "manager" },
        { slug: "ws" }
      );

      const arg = prisma.workspaces.findFirst.mock.calls[0][0];
      expect(arg.where.workspace_users).toEqual({ some: { user_id: 5 } });
      expect(result).toMatchObject({ id: 2 });
    });

    it("returns null for a manager who is not a member of the workspace", async () => {
      prisma.workspaces.findFirst.mockResolvedValue(null);

      const result = await Workspace.getWithUser(
        { id: 5, role: "manager" },
        { slug: "ws" }
      );

      expect(result).toBeNull();
    });
  });

  describe("whereWithUser", () => {
    it("lets admins bypass the membership filter in list queries", async () => {
      prisma.workspaces.findMany.mockResolvedValue([{ id: 1 }]);

      const result = await Workspace.whereWithUser(
        { id: 1, role: "admin" },
        {}
      );

      const arg = prisma.workspaces.findMany.mock.calls[0][0];
      expect(arg.where).toEqual({});
      expect(result).toEqual([{ id: 1 }]);
    });

    it("scopes managers to member workspaces in list queries", async () => {
      prisma.workspaces.findMany.mockResolvedValue([]);

      await Workspace.whereWithUser({ id: 5, role: "manager" }, {});

      const arg = prisma.workspaces.findMany.mock.calls[0][0];
      expect(arg.where.workspace_users).toEqual({ some: { user_id: 5 } });
    });
  });
});
