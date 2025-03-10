-- CreateTable
CREATE TABLE "event_logs" (
    "id" BIGSERIAL PRIMARY KEY,
    "event" TEXT NOT NULL,
    "metadata" TEXT,
    "userId" INTEGER,
    "occurredAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "event_logs_event_idx" ON "event_logs"("event");
