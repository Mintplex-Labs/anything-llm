-- CreateTable
CREATE TABLE "swarmsy_memory_locks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'pasted',
    "content" TEXT NOT NULL,
    "archived_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "swarmsy_memory_locks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "swarmsy_memory_locks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "swarmsy_memory_locks_workspace_id_user_id_version_key" ON "swarmsy_memory_locks"("workspace_id", "user_id", "version");

-- CreateIndex
CREATE INDEX "swarmsy_memory_locks_workspace_id_user_id_archived_at_idx" ON "swarmsy_memory_locks"("workspace_id", "user_id", "archived_at");

-- CreateIndex
CREATE INDEX "swarmsy_memory_locks_workspace_id_user_id_is_active_idx" ON "swarmsy_memory_locks"("workspace_id", "user_id", "is_active");
