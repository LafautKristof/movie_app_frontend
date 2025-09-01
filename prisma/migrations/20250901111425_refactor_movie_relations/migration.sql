/*
  Warnings:

  - You are about to drop the column `posterPath` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `posterPath` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Watchlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Favorite" DROP COLUMN "posterPath",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "public"."Watchlist" DROP COLUMN "posterPath",
DROP COLUMN "title";

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
