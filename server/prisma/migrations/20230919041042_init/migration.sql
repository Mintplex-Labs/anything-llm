/*
  Warnings:

  - You are about to alter the column `createdAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `welcome_messages` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `system_settings` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `system_settings` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `workspace_documents` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `workspace_documents` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `api_keys` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `api_keys` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `workspace_chats` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `include` on the `workspace_chats` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("bool")` to `Boolean`.
  - You are about to alter the column `lastUpdatedAt` on the `workspace_chats` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `invites` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `invites` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `workspaces` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `workspaces` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `document_vectors` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `document_vectors` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `createdAt` on the `workspace_users` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `lastUpdatedAt` on the `workspace_users` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'default',
    "suspended" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("createdAt", "id", "lastUpdatedAt", "password", "role", "suspended", "username") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "password", "role", "suspended", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE TABLE "new_welcome_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "orderIndex" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_welcome_messages" ("createdAt", "id", "orderIndex", "response", "user") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", "orderIndex", "response", "user" FROM "welcome_messages";
DROP TABLE "welcome_messages";
ALTER TABLE "new_welcome_messages" RENAME TO "welcome_messages";
CREATE TABLE "new_system_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_system_settings" ("createdAt", "id", "label", "lastUpdatedAt", "value") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", "label", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "value" FROM "system_settings";
DROP TABLE "system_settings";
ALTER TABLE "new_system_settings" RENAME TO "system_settings";
CREATE UNIQUE INDEX "system_settings_label_key" ON "system_settings"("label");
CREATE TABLE "new_workspace_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_workspace_documents" ("createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "workspaceId") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "docId", "docpath", "filename", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "metadata", "workspaceId" FROM "workspace_documents";
DROP TABLE "workspace_documents";
ALTER TABLE "new_workspace_documents" RENAME TO "workspace_documents";
CREATE UNIQUE INDEX "workspace_documents_docId_key" ON "workspace_documents"("docId");
CREATE TABLE "new_api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "secret" TEXT,
    "createdBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_api_keys" ("createdAt", "createdBy", "id", "lastUpdatedAt", "secret") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "createdBy", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "secret" FROM "api_keys";
DROP TABLE "api_keys";
ALTER TABLE "new_api_keys" RENAME TO "api_keys";
CREATE UNIQUE INDEX "api_keys_secret_key" ON "api_keys"("secret");
CREATE TABLE "new_workspace_chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspaceId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "include" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_chats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_workspace_chats" ("createdAt", "id", "include", "lastUpdatedAt", "prompt", "response", "user_id", "workspaceId") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", coalesce("include", true) AS "include", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "prompt", "response", "user_id", "workspaceId" FROM "workspace_chats";
DROP TABLE "workspace_chats";
ALTER TABLE "new_workspace_chats" RENAME TO "workspace_chats";
CREATE TABLE "new_invites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "claimedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_invites" ("claimedBy", "code", "createdAt", "createdBy", "id", "lastUpdatedAt", "status") SELECT "claimedBy", "code", coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "createdBy", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "status" FROM "invites";
DROP TABLE "invites";
ALTER TABLE "new_invites" RENAME TO "invites";
CREATE UNIQUE INDEX "invites_code_key" ON "invites"("code");
CREATE TABLE "new_workspaces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vectorTag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openAiTemp" REAL,
    "openAiHistory" INTEGER NOT NULL DEFAULT 20,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openAiPrompt" TEXT
);
INSERT INTO "new_workspaces" ("createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "slug", "vectorTag") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "name", coalesce("openAiHistory", 20) AS "openAiHistory", "openAiPrompt", "openAiTemp", "slug", "vectorTag" FROM "workspaces";
DROP TABLE "workspaces";
ALTER TABLE "new_workspaces" RENAME TO "workspaces";
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");
CREATE TABLE "new_document_vectors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "vectorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_document_vectors" ("createdAt", "docId", "id", "lastUpdatedAt", "vectorId") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "docId", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "vectorId" FROM "document_vectors";
DROP TABLE "document_vectors";
ALTER TABLE "new_document_vectors" RENAME TO "document_vectors";
CREATE TABLE "new_workspace_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_users_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_workspace_users" ("createdAt", "id", "lastUpdatedAt", "user_id", "workspace_id") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", coalesce("lastUpdatedAt", CURRENT_TIMESTAMP) AS "lastUpdatedAt", "user_id", "workspace_id" FROM "workspace_users";
DROP TABLE "workspace_users";
ALTER TABLE "new_workspace_users" RENAME TO "workspace_users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
