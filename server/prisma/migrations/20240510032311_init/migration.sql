-- CreateTable
CREATE TABLE "slash_command_presets" (
    "id" BIGSERIAL PRIMARY KEY,
    "command" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "uid" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "slash_command_presets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "slash_command_presets_uid_command_key" ON "slash_command_presets"("uid", "command");
