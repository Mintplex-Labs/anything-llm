-- CreateTable
CREATE TABLE "chat_quota_reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "chat_quota_reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "chat_quota_reservations_user_id_expiresAt_idx" ON "chat_quota_reservations"("user_id", "expiresAt");

-- AlterTable
ALTER TABLE "workspace_agent_invocations" ADD COLUMN "quota_reservation_id" TEXT;
