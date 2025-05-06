-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspace_threads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_threads_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_workspace_threads" ("createdAt", "id", "lastUpdatedAt", "name", "slug", "user_id", "workspace_id") SELECT "createdAt", "id", "lastUpdatedAt", "name", "slug", "user_id", "workspace_id" FROM "workspace_threads";
DROP TABLE "workspace_threads";
ALTER TABLE "new_workspace_threads" RENAME TO "workspace_threads";
CREATE UNIQUE INDEX "workspace_threads_slug_key" ON "workspace_threads"("slug");
CREATE INDEX "workspace_threads_workspace_id_idx" ON "workspace_threads"("workspace_id");
CREATE INDEX "workspace_threads_user_id_idx" ON "workspace_threads"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
