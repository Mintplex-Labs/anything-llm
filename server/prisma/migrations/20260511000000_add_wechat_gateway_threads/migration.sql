-- CreateTable
CREATE TABLE "wechat_gateway_threads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wxid" TEXT NOT NULL,
    "nickname" TEXT,
    "workspace_slug" TEXT NOT NULL,
    "thread_slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "wechat_gateway_threads_wxid_key" ON "wechat_gateway_threads"("wxid");

-- CreateIndex
CREATE INDEX "wechat_gateway_threads_workspace_slug_idx" ON "wechat_gateway_threads"("workspace_slug");

-- CreateIndex
CREATE INDEX "wechat_gateway_threads_thread_slug_idx" ON "wechat_gateway_threads"("thread_slug");
