-- CreateTable
CREATE TABLE "model_routers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fallback_provider" TEXT NOT NULL,
    "fallback_model" TEXT NOT NULL,
    "created_by" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "model_router_rules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "router_id" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'calculated',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "property" TEXT,
    "comparator" TEXT,
    "value" TEXT,
    "route_provider" TEXT NOT NULL,
    "route_model" TEXT NOT NULL,
    "created_by" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "model_router_rules_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "model_routers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspaces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vectorTag" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openAiTemp" REAL,
    "openAiHistory" INTEGER NOT NULL DEFAULT 20,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openAiPrompt" TEXT,
    "similarityThreshold" REAL DEFAULT 0.25,
    "chatProvider" TEXT,
    "chatModel" TEXT,
    "topN" INTEGER DEFAULT 4,
    "chatMode" TEXT DEFAULT 'chat',
    "pfpFilename" TEXT,
    "agentProvider" TEXT,
    "agentModel" TEXT,
    "queryRefusalResponse" TEXT,
    "vectorSearchMode" TEXT DEFAULT 'default',
    "router_id" INTEGER,
    CONSTRAINT "workspaces_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "model_routers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_workspaces" ("agentModel", "agentProvider", "chatMode", "chatModel", "chatProvider", "createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "pfpFilename", "queryRefusalResponse", "similarityThreshold", "slug", "topN", "vectorSearchMode", "vectorTag") SELECT "agentModel", "agentProvider", "chatMode", "chatModel", "chatProvider", "createdAt", "id", "lastUpdatedAt", "name", "openAiHistory", "openAiPrompt", "openAiTemp", "pfpFilename", "queryRefusalResponse", "similarityThreshold", "slug", "topN", "vectorSearchMode", "vectorTag" FROM "workspaces";
DROP TABLE "workspaces";
ALTER TABLE "new_workspaces" RENAME TO "workspaces";
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "model_routers_name_key" ON "model_routers"("name");

-- CreateIndex
CREATE INDEX "model_router_rules_router_id_idx" ON "model_router_rules"("router_id");

-- CreateIndex
CREATE INDEX "model_router_rules_router_id_enabled_priority_idx" ON "model_router_rules"("router_id", "enabled", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "model_router_rules_router_id_title_key" ON "model_router_rules"("router_id", "title");
