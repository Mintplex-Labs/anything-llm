-- AlterTable
ALTER TABLE "workspace_documents" ADD COLUMN "contentHash" TEXT;
CREATE INDEX "workspace_documents_workspaceId_parentId_contentHash_idx" ON "workspace_documents"("workspaceId","parentId","contentHash");
