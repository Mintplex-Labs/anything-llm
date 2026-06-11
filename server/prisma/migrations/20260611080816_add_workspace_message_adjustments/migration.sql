-- CreateTable
-- IF NOT EXISTS: the docker-entrypoint.sh fallback marks failed migrations as
-- applied and retries — both statements must converge on re-runs.
CREATE TABLE IF NOT EXISTS "workspace_message_adjustments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspaceId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_message_adjustments_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "workspace_message_adjustments_workspaceId_idx" ON "workspace_message_adjustments"("workspaceId");
