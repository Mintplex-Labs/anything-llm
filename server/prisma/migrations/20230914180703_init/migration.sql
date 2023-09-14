-- CreateTable
CREATE TABLE "api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "secret" TEXT,
    "createdBy" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "document_vectors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "vectorId" TEXT NOT NULL,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "invites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "claimedBy" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "createdBy" INTEGER NOT NULL,
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'default',
    "suspended" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "welcome_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "orderIndex" INTEGER,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "workspace_chats" (
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

-- CreateTable
CREATE TABLE "workspace_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP'
);

-- CreateTable
CREATE TABLE "workspace_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "createdAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    "lastUpdatedAt" TEXT DEFAULT 'CURRENT_TIMESTAMP',
    CONSTRAINT "workspace_users_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "workspace_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "workspaces" (
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

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_api_keys_1" ON "api_keys"("secret");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_invites_1" ON "invites"("code");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_system_settings_1" ON "system_settings"("label");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_users_1" ON "users"("username");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_workspace_documents_1" ON "workspace_documents"("docId");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_workspaces_1" ON "workspaces"("slug");
Pragma writable_schema=0;
