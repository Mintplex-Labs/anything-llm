-- CreateTable
CREATE TABLE "system_prompt_variables" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'system',
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "system_prompt_variables_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "system_prompt_variables_key_key" ON "system_prompt_variables"("key");

-- CreateIndex
CREATE INDEX "system_prompt_variables_userId_idx" ON "system_prompt_variables"("userId");
