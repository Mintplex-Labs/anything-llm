-- AlterTable
ALTER TABLE "users" ADD COLUMN "auth_provider" TEXT;
ALTER TABLE "users" ADD COLUMN "external_id" TEXT;
ALTER TABLE "users" ADD COLUMN "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_provider_external_id" ON "users"("auth_provider", "external_id");
