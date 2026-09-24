jest.mock("../../utils/prisma", () => ({
  workspaces: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
}));

const { Workspace } = require("../../models/workspace");
const { Document } = require("../../models/documents");
const prisma = require("../../utils/prisma");

describe("Workspace scoping for the manager role", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getWithUser", () => {
    it("lets admins bypass the membership filter", async () => {
      const getSpy = jest
        .spyOn(Workspace, "get")
        .mockResolvedValue({ id: 1, slug: "ws" });

      const result = await Workspace.getWithUser(
        { id: 1, role: "admin" },
        { slug: "ws" }
      );

      expect(getSpy).toHaveBeenCalledWith({ slug: "ws" });
      expect(result).toMatchObject({ id: 1 });
      expect(prisma.workspaces.findFirst).not.toHaveBeenCalled();
    });

    it("scopes managers to workspaces they are a member of", async () => {
      prisma.workspaces.findFirst.mockResolvedValue({
        id: 2,
        slug: "ws",
        workspace_users: [{ user_id: 5 }],
      });
      jest.spyOn(Document, "forWorkspace").mockResolvedValue([]);
      jest.spyOn(Workspace, "_getContextWindow").mockReturnValue(4096);
      jest
        .spyOn(Workspace, "_getCurrentContextTokenCount")
        .mockResolvedValue(0);

      const result = await Workspace.getWithUser(
        { id: 5, role: "manager" },
        { slug: "ws" }
      );

      const arg = prisma.workspaces.findFirst.mock.calls[0][0];
      expect(arg.where.slug).toBe("ws");
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
      const whereSpy = jest
        .spyOn(Workspace, "where")
        .mockResolvedValue([{ id: 1 }]);

      const result = await Workspace.whereWithUser(
        { id: 1, role: "admin" },
        {}
      );

      expect(whereSpy).toHaveBeenCalledWith({}, null, null);
      expect(prisma.workspaces.findMany).not.toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });

    it("scopes managers to member workspaces in list queries", async () => {
      prisma.workspaces.findMany.mockResolvedValue([{ id: 2 }]);

      const result = await Workspace.whereWithUser(
        { id: 5, role: "manager" },
        {}
      );

      const arg = prisma.workspaces.findMany.mock.calls[0][0];
      expect(arg.where.workspace_users).toEqual({ some: { user_id: 5 } });
      expect(result).toEqual([{ id: 2 }]);
    });
  });
});
