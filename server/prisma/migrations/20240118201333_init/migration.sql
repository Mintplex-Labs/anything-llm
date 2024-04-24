-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN "topN" INTEGER DEFAULT 4 CHECK ("topN" > 0);
