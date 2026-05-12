const prisma = require("../utils/prisma");

const WeChatGatewayThread = {
  ensureTable: async function () {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "wechat_gateway_threads" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "wxid" TEXT NOT NULL,
        "nickname" TEXT,
        "workspace_slug" TEXT NOT NULL,
        "thread_slug" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "wechat_gateway_threads_wxid_key"
      ON "wechat_gateway_threads"("wxid")
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "wechat_gateway_threads_workspace_slug_idx"
      ON "wechat_gateway_threads"("workspace_slug")
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "wechat_gateway_threads_thread_slug_idx"
      ON "wechat_gateway_threads"("thread_slug")
    `);
  },

  getByWxid: async function (wxid = null) {
    if (!wxid) return null;
    try {
      await this.ensureTable();
      const rows = await prisma.$queryRaw`
        SELECT * FROM wechat_gateway_threads WHERE wxid = ${String(wxid)} LIMIT 1
      `;
      return rows?.[0] || null;
    } catch (error) {
      console.error("WeChatGatewayThread.getByWxid", error.message);
      return null;
    }
  },

  upsert: async function ({
    wxid = null,
    nickname = null,
    workspaceSlug = null,
    threadSlug = null,
  }) {
    if (!wxid || !workspaceSlug || !threadSlug)
      return {
        mapping: null,
        error: "wxid, workspaceSlug, and threadSlug are required",
      };

    try {
      await this.ensureTable();
      await prisma.$executeRaw`
        INSERT INTO wechat_gateway_threads (
          wxid,
          nickname,
          workspace_slug,
          thread_slug
        ) VALUES (
          ${String(wxid)},
          ${nickname ? String(nickname) : null},
          ${String(workspaceSlug)},
          ${String(threadSlug)}
        )
        ON CONFLICT(wxid) DO UPDATE SET
          nickname = excluded.nickname,
          workspace_slug = excluded.workspace_slug,
          thread_slug = excluded.thread_slug,
          lastUpdatedAt = CURRENT_TIMESTAMP
      `;
      const mapping = await this.getByWxid(wxid);
      return { mapping, error: null };
    } catch (error) {
      console.error("WeChatGatewayThread.upsert", error.message);
      return { mapping: null, error: error.message };
    }
  },
};

module.exports = { WeChatGatewayThread };
