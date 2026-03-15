/*
  Warnings:

  - You are about to drop the `welcome_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "welcome_messages";
PRAGMA foreign_keys=on;
