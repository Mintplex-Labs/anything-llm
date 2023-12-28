/*
  Warnings:

  - You are about to drop the `workspace_chats` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE "thread_chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspace_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "include" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "thread_chats_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "threads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    CONSTRAINT "threads_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "threads" (workspace_id, user_id, name) SELECT DISTINCT workspaceId, user_id, 'Default' from "workspace_chats";

INSERT INTO "thread_chats" (id, workspace_id, thread_id, prompt, response, "include", created_at, last_updated_at)
SELECT wc.id, wc.workspaceId, t.id, wc.prompt, wc.response, wc.include, wc.createdAt, wc.lastUpdatedAt
FROM "workspace_chats" wc
JOIN "threads" t ON wc.workspaceId = t.workspace_id AND
  (wc.user_id = t.user_id OR (wc.user_id IS NULL AND t.user_id IS NULL));

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "workspace_chats";
PRAGMA foreign_keys=on;
