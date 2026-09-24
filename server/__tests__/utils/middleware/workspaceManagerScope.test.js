jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn() },
}));
jest.mock("../../../models/workspaceUsers", () => ({
  WorkspaceUser: { get: jest.fn() },
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../../utils/http", () => ({
  userFromSession: jest.fn(),
}));

const { Workspace } = require("../../../models/workspace");
const { WorkspaceUser } = require("../../../models/workspaceUsers");
const { SystemSettings } = require("../../../models/systemSettings");
const { userFromSession } = require("../../../utils/http");
const {
  workspaceManagerScopeValid,
} = require("../../../utils/middleware/workspaceManagerScope");

describe("workspaceManagerScopeValid middleware", () => {
  const next = jest.fn();
  let response;

  beforeEach(() => {
    jest.clearAllMocks();
    next.mockReset();
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { multiUserMode: true },
    };
  });

  it("bypasses the check entirely in single-user mode", async () => {
    response.locals.multiUserMode = false;

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(Workspace.get).not.toHaveBeenCalled();
    expect(WorkspaceUser.get).not.toHaveBeenCalled();
  });

  it("lets admins pass without a membership check", async () => {
    response.locals.user = { id: 1, role: "admin" };

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(Workspace.get).not.toHaveBeenCalled();
    expect(WorkspaceUser.get).not.toHaveBeenCalled();
  });

  it("lets a manager pass when they are a member of the workspace", async () => {
    response.locals.user = { id: 2, role: "manager" };
    Workspace.get.mockResolvedValue({ id: 11, slug: "ws" });
    WorkspaceUser.get.mockResolvedValue({ user_id: 2, workspace_id: 11 });

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "ws" });
    expect(WorkspaceUser.get).toHaveBeenCalledWith({
      user_id: 2,
      workspace_id: 11,
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("falls back to the session user when locals are absent", async () => {
    response.locals = { multiUserMode: true };
    userFromSession.mockResolvedValue({ id: 2, role: "manager" });
    Workspace.get.mockResolvedValue({ id: 11, slug: "ws" });
    WorkspaceUser.get.mockResolvedValue({ user_id: 2, workspace_id: 11 });

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(userFromSession).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("blocks a manager who is not a member of the workspace", async () => {
    response.locals.user = { id: 2, role: "manager" };
    Workspace.get.mockResolvedValue({ id: 11, slug: "ws" });
    WorkspaceUser.get.mockResolvedValue(null);

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it("blocks a manager when the workspace does not exist", async () => {
    response.locals.user = { id: 2, role: "manager" };
    Workspace.get.mockResolvedValue(null);

    await workspaceManagerScopeValid(
      { params: { slug: "ghost" } },
      response,
      next
    );

    expect(WorkspaceUser.get).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it("blocks any non-admin, non-manager role as a defense in depth", async () => {
    response.locals.user = { id: 3, role: "default" };

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(Workspace.get).not.toHaveBeenCalled();
  });

  it("does not require multi-user mode lookup when already resolved in locals", async () => {
    response.locals.user = { id: 1, role: "admin" };

    await workspaceManagerScopeValid(
      { params: { slug: "ws" } },
      response,
      next
    );

    expect(SystemSettings.isMultiUserMode).not.toHaveBeenCalled();
  });

  it("resolves the workspace by :workspaceId on admin panel routes", async () => {
    response.locals.user = { id: 2, role: "manager" };
    Workspace.get.mockResolvedValue({ id: 11, slug: "ws" });
    WorkspaceUser.get.mockResolvedValue({ user_id: 2, workspace_id: 11 });

    await workspaceManagerScopeValid(
      { params: { workspaceId: "11" } },
      response,
      next
    );

    expect(Workspace.get).toHaveBeenCalledWith({ id: 11 });
    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("resolves the workspace by :id on delete routes", async () => {
    response.locals.user = { id: 2, role: "manager" };
    Workspace.get.mockResolvedValue({ id: 11, slug: "ws" });
    WorkspaceUser.get.mockResolvedValue({ user_id: 2, workspace_id: 11 });

    await workspaceManagerScopeValid({ params: { id: "11" } }, response, next);

    expect(Workspace.get).toHaveBeenCalledWith({ id: 11 });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("blocks a manager on an id-addressed workspace they are not a member of", async () => {
    response.locals.user = { id: 2, role: "manager" };
    Workspace.get.mockResolvedValue({ id: 11, slug: "ws" });
    WorkspaceUser.get.mockResolvedValue(null);

    await workspaceManagerScopeValid(
      { params: { workspaceId: "11" } },
      response,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it("blocks a manager when the id param is not a valid workspace id", async () => {
    response.locals.user = { id: 2, role: "manager" };

    await workspaceManagerScopeValid(
      { params: { workspaceId: "not-a-number" } },
      response,
      next
    );

    expect(Workspace.get).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it("blocks a manager when the route exposes no workspace param at all", async () => {
    response.locals.user = { id: 2, role: "manager" };

    await workspaceManagerScopeValid({ params: {} }, response, next);

    expect(Workspace.get).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
  });
});
