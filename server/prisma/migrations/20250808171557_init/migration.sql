-- CreateTable
CREATE TABLE "workspace_parsed_files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "userId" INTEGER,
    "threadId" INTEGER,
    "metadata" TEXT,
    "tokenCountEstimate" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_parsed_files_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_parsed_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workspace_parsed_files_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "workspace_threads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_parsed_files_filename_key" ON "workspace_parsed_files"("filename");

-- CreateIndex
CREATE INDEX "workspace_parsed_files_workspaceId_idx" ON "workspace_parsed_files"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_parsed_files_userId_idx" ON "workspace_parsed_files"("userId");
