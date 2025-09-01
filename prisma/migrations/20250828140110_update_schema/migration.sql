-- CreateTable
CREATE TABLE "public"."Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "poster" TEXT,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
