-- AlterTable
ALTER TABLE "workspace_chats" ADD COLUMN "memory_processed" BOOLEAN;

-- CreateTable
CREATE TABLE "memories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "workspace_id" INTEGER,
    "scope" TEXT NOT NULL DEFAULT 'workspace',
    "content" TEXT NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "memories_user_id_workspace_id_idx" ON "memories"("user_id", "workspace_id");

-- CreateIndex
CREATE INDEX "memories_user_id_scope_idx" ON "memories"("user_id", "scope");

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
