-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN "ollamaConnectionId" INTEGER;

-- CreateTable
CREATE TABLE "ollama_connections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "basePath" TEXT NOT NULL,
    "authToken" TEXT,
    "keepAlive" INTEGER,
    "responseTimeout" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ollama_connections_name_key" ON "ollama_connections"("name");
