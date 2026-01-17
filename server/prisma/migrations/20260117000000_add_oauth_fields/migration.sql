-- AlterTable
ALTER TABLE "users" ADD COLUMN "oidc_sub" TEXT;
ALTER TABLE "users" ADD COLUMN "oauth_access_token" TEXT;
ALTER TABLE "users" ADD COLUMN "oauth_refresh_token" TEXT;
ALTER TABLE "users" ADD COLUMN "oauth_token_expires_at" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "users_oidc_sub_key" ON "users"("oidc_sub");
