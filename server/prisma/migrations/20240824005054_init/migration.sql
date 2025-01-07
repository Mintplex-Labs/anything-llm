-- CreateTable
CREATE TABLE "browser_extension_api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "user_id" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "browser_extension_api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "browser_extension_api_keys_key_key" ON "browser_extension_api_keys"("key");

-- CreateIndex
CREATE INDEX "browser_extension_api_keys_user_id_idx" ON "browser_extension_api_keys"("user_id");
