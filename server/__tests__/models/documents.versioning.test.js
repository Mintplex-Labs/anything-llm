/* eslint-env jest, node */
const prisma = require("../../utils/prisma");
const { Document } = require("../../models/documents");
const { execSync } = require("child_process");
const path = require("path");

describe("Document versioning", () => {
  beforeAll(() => {
    execSync("npx prisma generate", {
      cwd: path.join(__dirname, "../../"),
      stdio: "ignore",
    });
    execSync("npx prisma migrate deploy", {
      cwd: path.join(__dirname, "../../"),
      stdio: "ignore",
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("replace stores previous version and updates docpath", async () => {
    const workspace = await prisma.workspaces.create({
      data: { name: "ws", slug: `ws_${Date.now()}` },
    });
    const doc = await prisma.workspace_documents.create({
      data: {
        docId: `doc_${Date.now()}`,
        filename: "test.txt",
        docpath: "v1.txt",
        workspaceId: workspace.id,
      },
    });

    const updated = await Document.replace(doc.id, "v2.txt");
    expect(updated.version).toBe(2);

    const oldPath = await Document.docpathForVersion(doc.id, 1);
    const newPath = await Document.docpathForVersion(doc.id, 2);
    expect(oldPath).toBe("v1.txt");
    expect(newPath).toBe("v2.txt");

    await prisma.file_versions.deleteMany({ where: { workspaceDocId: doc.id } });
    await prisma.workspace_documents.delete({ where: { id: doc.id } });
    await prisma.workspaces.delete({ where: { id: workspace.id } });
  });
});
