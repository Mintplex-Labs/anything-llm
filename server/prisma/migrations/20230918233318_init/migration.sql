/*
  Warnings:

  - You are about to alter the column `include` on the `workspace_chats` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `Unsupported("bool")`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'default',
    "suspended" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_users" ("createdAt", "id", "lastUpdatedAt", "password", "role", "suspended", "username") SELECT "createdAt", "id", "lastUpdatedAt", "password", "role", "suspended", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_users_1" ON "users"("username");
Pragma writable_schema=0;
CREATE TABLE "new_invites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "claimedBy" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "createdBy" INTEGER NOT NULL,
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_invites" ("claimedBy", "code", "createdAt", "createdBy", "id", "lastUpdatedAt", "status") SELECT "claimedBy", "code", "createdAt", "createdBy", "id", "lastUpdatedAt", "status" FROM "invites";
DROP TABLE "invites";
ALTER TABLE "new_invites" RENAME TO "invites";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_invites_1" ON "invites"("code");
Pragma writable_schema=0;
CREATE TABLE "new_system_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_system_settings" ("createdAt", "id", "label", "lastUpdatedAt", "value") SELECT "createdAt", "id", "label", "lastUpdatedAt", "value" FROM "system_settings";
DROP TABLE "system_settings";
ALTER TABLE "new_system_settings" RENAME TO "system_settings";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_system_settings_1" ON "system_settings"("label");
Pragma writable_schema=0;
CREATE TABLE "new_workspaces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vectorTag" TEXT,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "openAiTemp" REAL,
    "openAiHistory" INTEGER DEFAULT 20,
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "openAiPrompt" TEXT
);
INSERT INTO "new_workspaces" ("createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "slug", "vectorTag") SELECT "createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "slug", "vectorTag" FROM "workspaces";
DROP TABLE "workspaces";
ALTER TABLE "new_workspaces" RENAME TO "workspaces";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_workspaces_1" ON "workspaces"("slug");
Pragma writable_schema=0;
CREATE TABLE "new_document_vectors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "vectorId" TEXT NOT NULL,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_document_vectors" ("createdAt", "docId", "id", "lastUpdatedAt", "vectorId") SELECT "createdAt", "docId", "id", "lastUpdatedAt", "vectorId" FROM "document_vectors";
DROP TABLE "document_vectors";
ALTER TABLE "new_document_vectors" RENAME TO "document_vectors";
CREATE TABLE "new_workspace_chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspaceId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "include" bool DEFAULT true,
    "user_id" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    CONSTRAINT "workspace_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_workspace_chats" ("createdAt", "id", "include", "lastUpdatedAt", "prompt", "response", "user_id", "workspaceId") SELECT "createdAt", "id", "include", "lastUpdatedAt", "prompt", "response", "user_id", "workspaceId" FROM "workspace_chats";
DROP TABLE "workspace_chats";
ALTER TABLE "new_workspace_chats" RENAME TO "workspace_chats";
CREATE TABLE "new_welcome_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "orderIndex" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_welcome_messages" ("createdAt", "id", "orderIndex", "response", "user") SELECT "createdAt", "id", "orderIndex", "response", "user" FROM "welcome_messages";
DROP TABLE "welcome_messages";
ALTER TABLE "new_welcome_messages" RENAME TO "welcome_messages";
CREATE TABLE "new_api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "secret" TEXT,
    "createdBy" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_api_keys" ("createdAt", "createdBy", "id", "lastUpdatedAt", "secret") SELECT "createdAt", "createdBy", "id", "lastUpdatedAt", "secret" FROM "api_keys";
DROP TABLE "api_keys";
ALTER TABLE "new_api_keys" RENAME TO "api_keys";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_api_keys_1" ON "api_keys"("secret");
Pragma writable_schema=0;
CREATE TABLE "new_workspace_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);
INSERT INTO "new_workspace_documents" ("createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "workspaceId") SELECT "createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "workspaceId" FROM "workspace_documents";
DROP TABLE "workspace_documents";
ALTER TABLE "new_workspace_documents" RENAME TO "workspace_documents";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_workspace_documents_1" ON "workspace_documents"("docId");
Pragma writable_schema=0;
CREATE TABLE "new_workspace_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    CONSTRAINT "workspace_users_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "workspace_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_workspace_users" ("createdAt", "id", "lastUpdatedAt", "user_id", "workspace_id") SELECT "createdAt", "id", "lastUpdatedAt", "user_id", "workspace_id" FROM "workspace_users";
DROP TABLE "workspace_users";
ALTER TABLE "new_workspace_users" RENAME TO "workspace_users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
