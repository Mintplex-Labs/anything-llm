-- AlterTable
ALTER TABLE "workspace_chats" ADD COLUMN "thread_id" INTEGER;

-- CreateTable
CREATE TABLE "workspace_threads" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_threads_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_threads_slug_key" ON "workspace_threads"("slug");

-- CreateIndex
CREATE INDEX "workspace_threads_workspace_id_idx" ON "workspace_threads"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_threads_user_id_idx" ON "workspace_threads"("user_id");
