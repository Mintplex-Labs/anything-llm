-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rag_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firestoreDocId" TEXT NOT NULL,
    "timesRetrieved" INTEGER NOT NULL DEFAULT 0,
    "timesLmmUsed" INTEGER NOT NULL DEFAULT 0,
    "usedIfRetrieved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_rag_documents" ("createdAt", "firestoreDocId", "id", "timesLmmUsed", "timesRetrieved") SELECT "createdAt", "firestoreDocId", "id", "timesLmmUsed", "timesRetrieved" FROM "rag_documents";
DROP TABLE "rag_documents";
ALTER TABLE "new_rag_documents" RENAME TO "rag_documents";
CREATE UNIQUE INDEX "rag_documents_firestoreDocId_key" ON "rag_documents"("firestoreDocId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
