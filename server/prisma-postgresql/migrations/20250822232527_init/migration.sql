-- CreateTable
CREATE TABLE "desktop_mobile_devices" (
    "id" SERIAL NOT NULL,
    "deviceOs" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "desktop_mobile_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_parsed_files" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "userId" INTEGER,
    "threadId" INTEGER,
    "metadata" TEXT,
    "tokenCountEstimate" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_parsed_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "desktop_mobile_devices_token_key" ON "desktop_mobile_devices"("token");

-- CreateIndex
CREATE INDEX "desktop_mobile_devices_userId_idx" ON "desktop_mobile_devices"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_parsed_files_filename_key" ON "workspace_parsed_files"("filename");

-- CreateIndex
CREATE INDEX "workspace_parsed_files_workspaceId_idx" ON "workspace_parsed_files"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_parsed_files_userId_idx" ON "workspace_parsed_files"("userId");

-- AddForeignKey
ALTER TABLE "desktop_mobile_devices" ADD CONSTRAINT "desktop_mobile_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_parsed_files" ADD CONSTRAINT "workspace_parsed_files_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_parsed_files" ADD CONSTRAINT "workspace_parsed_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_parsed_files" ADD CONSTRAINT "workspace_parsed_files_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "workspace_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
