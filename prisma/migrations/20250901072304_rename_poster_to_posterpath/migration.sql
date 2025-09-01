/*
  Warnings:

  - You are about to drop the column `poster` on the `Watchlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Watchlist" DROP COLUMN "poster",
ADD COLUMN     "posterPath" TEXT;
