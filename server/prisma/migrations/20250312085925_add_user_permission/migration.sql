-- AlterTable
ALTER TABLE "system_settings" ADD COLUMN "default_managing_workspaces" BOOLEAN DEFAULT false;
ALTER TABLE "system_settings" ADD COLUMN "default_creating_workspaces" BOOLEAN DEFAULT false;
ALTER TABLE "system_settings" ADD COLUMN "default_workspace_dnd_file_upload" BOOLEAN DEFAULT false;
