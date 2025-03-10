-- CreateTable
CREATE TABLE "workspace_suggested_messages" (
    "id" BIGSERIAL PRIMARY KEY,
    "workspaceId" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_suggested_messages_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "workspace_suggested_messages_workspaceId_idx" ON "workspace_suggested_messages"("workspaceId");
