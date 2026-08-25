ALTER TABLE "workspaces" ADD COLUMN "chatConnectionId" INTEGER;

ALTER TABLE "model_routers" ADD COLUMN "fallback_connection_id" INTEGER;

ALTER TABLE "model_router_rules" ADD COLUMN "route_connection_id" INTEGER;

CREATE TABLE "local_ai_connections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "api_key" TEXT,
    "model" TEXT NOT NULL,
    "token_limit" INTEGER NOT NULL,
    "created_by" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "local_ai_connections_name_key" ON "local_ai_connections"("name");
