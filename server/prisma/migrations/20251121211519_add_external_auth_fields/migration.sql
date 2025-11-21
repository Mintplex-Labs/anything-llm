-- AlterTable
ALTER TABLE "users" ADD COLUMN "externalId" TEXT;
ALTER TABLE "users" ADD COLUMN "externalProvider" TEXT;

-- CreateIndex
CREATE INDEX "users_externalId_externalProvider_idx" ON "users"("externalId", "externalProvider");
