-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN "metaResponse" BOOLEAN DEFAULT false;
ALTER TABLE "workspaces" ADD COLUMN "metaResponseSettings" TEXT;
