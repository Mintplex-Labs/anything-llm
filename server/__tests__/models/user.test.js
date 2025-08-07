/* eslint-env jest, node */
const prisma = require("../../utils/prisma");
const { User } = require("../../models/user");
const { execSync } = require("child_process");
const path = require("path");

describe("User private workspace", () => {
  beforeAll(() => {
    execSync("npx prisma migrate deploy", {
      cwd: path.join(__dirname, "../../"),
      stdio: "ignore",
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("creating a user also creates a private workspace", async () => {
    const username = `testuser_${Date.now()}`;
    const { user, error } = await User.create({
      username,
      password: "password123",
    });

    expect(error).toBeNull();
    expect(user).toBeTruthy();

    const workspaceLinks = await prisma.workspace_users.findMany({
      where: { user_id: user.id },
    });

    expect(workspaceLinks.length).toBe(1);

    const workspace = await prisma.workspaces.findUnique({
      where: { id: workspaceLinks[0].workspace_id },
    });

    expect(workspace.private).toBe(true);

    const members = await prisma.workspace_users.findMany({
      where: { workspace_id: workspace.id },
    });

    expect(members.length).toBe(1);
    expect(members[0].user_id).toBe(user.id);

    // Cleanup
    await prisma.workspace_users.deleteMany({
      where: { workspace_id: workspace.id },
    });
    await prisma.workspaces.delete({ where: { id: workspace.id } });
    await prisma.users.delete({ where: { id: user.id } });
  });
});

