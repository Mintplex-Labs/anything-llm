-- CreateTable
CREATE TABLE "binaries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentHash" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mime" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "binaryId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "ext" TEXT,
    "ownerId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "documents_binaryId_fkey" FOREIGN KEY ("binaryId") REFERENCES "binaries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AlterTable
ALTER TABLE "workspace_documents" ADD COLUMN "documentId" INTEGER REFERENCES "documents" ("id");
ALTER TABLE "workspace_documents" ADD COLUMN "parentId" INTEGER;
ALTER TABLE "workspace_documents" ADD COLUMN "embedProfileId" INTEGER;
ALTER TABLE "workspace_documents" ADD COLUMN "embedStatus" TEXT;
ALTER TABLE "workspace_documents" ADD COLUMN "chunkCount" INTEGER DEFAULT 0;
ALTER TABLE "workspace_documents" ADD COLUMN "lastIndexedAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "binaries_contentHash_key" ON "binaries"("contentHash");

-- CreateIndex
CREATE INDEX "workspace_documents_workspaceId_parentId_filename_idx" ON "workspace_documents"("workspaceId", "parentId", "filename");

-- CreateIndex
CREATE INDEX "workspace_documents_documentId_workspaceId_idx" ON "workspace_documents"("documentId", "workspaceId");
