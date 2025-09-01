/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Favorite" ALTER COLUMN "posterPath" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_movieId_key" ON "public"."Favorite"("userId", "movieId");
