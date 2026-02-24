-- AlterTable: Add retention_started_at to embed_configs
ALTER TABLE "embed_configs" ADD COLUMN "retention_started_at" DATETIME;
