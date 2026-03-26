-- CreateTable
CREATE TABLE "memories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "workspace_id" INTEGER,
    "scope" TEXT NOT NULL DEFAULT 'workspace',
    "content" TEXT NOT NULL,
    "source_thread_id" INTEGER,
    "last_used_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "memories_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspace_chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspaceId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "include" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER,
    "thread_id" INTEGER,
    "api_session_id" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackScore" BOOLEAN,
    "memory_processed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "workspace_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_workspace_chats" ("api_session_id", "createdAt", "feedbackScore", "id", "include", "lastUpdatedAt", "prompt", "response", "thread_id", "user_id", "workspaceId") SELECT "api_session_id", "createdAt", "feedbackScore", "id", "include", "lastUpdatedAt", "prompt", "response", "thread_id", "user_id", "workspaceId" FROM "workspace_chats";
DROP TABLE "workspace_chats";
ALTER TABLE "new_workspace_chats" RENAME TO "workspace_chats";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "memories_user_id_workspace_id_idx" ON "memories"("user_id", "workspace_id");

-- CreateIndex
CREATE INDEX "memories_user_id_scope_idx" ON "memories"("user_id", "scope");
