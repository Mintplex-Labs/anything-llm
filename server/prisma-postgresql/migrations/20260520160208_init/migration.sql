-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN "router_id" INTEGER;

-- CreateTable
CREATE TABLE "model_routers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fallback_provider" TEXT NOT NULL,
    "fallback_model" TEXT NOT NULL,
    "cooldown_seconds" INTEGER NOT NULL DEFAULT 30,
    "created_by" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_routers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_router_rules" (
    "id" SERIAL NOT NULL,
    "router_id" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'calculated',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "condition_logic" TEXT,
    "conditions" TEXT,
    "route_provider" TEXT NOT NULL,
    "route_model" TEXT NOT NULL,
    "created_by" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_router_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "model_routers_name_key" ON "model_routers"("name");

-- CreateIndex
CREATE INDEX "model_router_rules_router_id_idx" ON "model_router_rules"("router_id");

-- CreateIndex
CREATE INDEX "model_router_rules_router_id_enabled_priority_idx" ON "model_router_rules"("router_id", "enabled", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "model_router_rules_router_id_title_key" ON "model_router_rules"("router_id", "title");

-- AddForeignKey
ALTER TABLE "model_router_rules" ADD CONSTRAINT "model_router_rules_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "model_routers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
