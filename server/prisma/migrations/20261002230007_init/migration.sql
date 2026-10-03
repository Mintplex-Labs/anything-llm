-- CreateTable
CREATE TABLE "agent_skill_configs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skill" TEXT NOT NULL,
    "workspace_id" INTEGER,
    "user_id" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "personal" BOOLEAN NOT NULL DEFAULT false,
    "config" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "agent_skill_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "agent_skill_configs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "agent_skill_configs_skill_idx" ON "agent_skill_configs"("skill");

-- CreateIndex
CREATE INDEX "agent_skill_configs_workspace_id_user_id_idx" ON "agent_skill_configs"("workspace_id", "user_id");
