-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspaces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vectorTag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openAiTemp" REAL,
    "openAiHistory" INTEGER DEFAULT 20,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openAiPrompt" TEXT
);
INSERT INTO "new_workspaces" ("createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "slug", "vectorTag") SELECT "createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "slug", "vectorTag" FROM "workspaces";
DROP TABLE "workspaces";
ALTER TABLE "new_workspaces" RENAME TO "workspaces";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_workspaces_1" ON "workspaces"("slug");
Pragma writable_schema=0;
CREATE TABLE "new_workspace_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_users_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "workspace_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_workspace_users" ("createdAt", "id", "lastUpdatedAt", "user_id", "workspace_id") SELECT "createdAt", "id", "lastUpdatedAt", "user_id", "workspace_id" FROM "workspace_users";
DROP TABLE "workspace_users";
ALTER TABLE "new_workspace_users" RENAME TO "workspace_users";
CREATE TABLE "new_workspace_chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspaceId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "include" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_workspace_chats" ("createdAt", "id", "include", "lastUpdatedAt", "prompt", "response", "user_id", "workspaceId") SELECT "createdAt", "id", "include", "lastUpdatedAt", "prompt", "response", "user_id", "workspaceId" FROM "workspace_chats";
DROP TABLE "workspace_chats";
ALTER TABLE "new_workspace_chats" RENAME TO "workspace_chats";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineIndex
DROP INDEX "api_keys_secret_key";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_api_keys_1" ON "api_keys"("secret");
Pragma writable_schema=0;

-- RedefineIndex
DROP INDEX "invites_code_key";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_invites_1" ON "invites"("code");
Pragma writable_schema=0;

-- RedefineIndex
DROP INDEX "system_settings_label_key";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_system_settings_1" ON "system_settings"("label");
Pragma writable_schema=0;

-- RedefineIndex
DROP INDEX "users_username_key";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_users_1" ON "users"("username");
Pragma writable_schema=0;

-- RedefineIndex
DROP INDEX "workspace_documents_docId_key";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_workspace_documents_1" ON "workspace_documents"("docId");
Pragma writable_schema=0;
