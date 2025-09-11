-- CreateTable
CREATE TABLE "rag_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firestoreDocId" TEXT NOT NULL,
    "timesRetrieved" INTEGER NOT NULL,
    "timesLmmUsed" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
