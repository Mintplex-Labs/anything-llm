-- Multi-condition calculated rules. Swap single (property, comparator, value)
-- columns for a JSON `conditions` array plus a top-level `condition_logic`
-- operator. Existing calculated rules are migrated to a one-element array.

PRAGMA foreign_keys=OFF;

CREATE TABLE "new_model_router_rules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "model_router_rules_router_id_fkey" FOREIGN KEY ("router_id") REFERENCES "model_routers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_model_router_rules" (
    "id", "router_id", "enabled", "priority", "type", "title", "description",
    "condition_logic", "conditions",
    "route_provider", "route_model", "created_by", "createdAt", "lastUpdatedAt"
)
SELECT
    "id", "router_id", "enabled", "priority", "type", "title", "description",
    CASE
        WHEN "type" = 'calculated' AND "property" IS NOT NULL THEN 'AND'
        ELSE NULL
    END AS "condition_logic",
    CASE
        WHEN "type" = 'calculated' AND "property" IS NOT NULL
            THEN json_array(json_object(
                'property', "property",
                'comparator', "comparator",
                'value', "value"
            ))
        ELSE NULL
    END AS "conditions",
    "route_provider", "route_model", "created_by", "createdAt", "lastUpdatedAt"
FROM "model_router_rules";

DROP TABLE "model_router_rules";
ALTER TABLE "new_model_router_rules" RENAME TO "model_router_rules";

CREATE INDEX "model_router_rules_router_id_idx" ON "model_router_rules"("router_id");
CREATE INDEX "model_router_rules_router_id_enabled_priority_idx" ON "model_router_rules"("router_id", "enabled", "priority");
CREATE UNIQUE INDEX "model_router_rules_router_id_title_key" ON "model_router_rules"("router_id", "title");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
