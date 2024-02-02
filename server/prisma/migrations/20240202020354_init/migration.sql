-- CreateTable
CREATE TABLE "event_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "metadata" TEXT,
    "userId" INTEGER,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT
);

-- CreateIndex
CREATE INDEX "event_logs_userId_idx" ON "event_logs"("userId");

-- CreateIndex
CREATE INDEX "event_logs_event_idx" ON "event_logs"("event");
