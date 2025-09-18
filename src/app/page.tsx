import { getTopRatedMovies } from "@/lib/actions";
import TopRatedMovies from "@/components/TopRatedMovies";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export default async function HomePage() {
    const initialMovies = await getTopRatedMovies(8);
    const session = await getServerSession(authOptions);

    // user-info ophalen
    const user = session?.user?.email
        ? await prisma.user.findUnique({
              where: { email: session.user.email },
              select: {
                  favorites: { select: { movieId: true } },
                  watchlist: { select: { movieId: true } },
              },
          })
        : null;

    const favoriteIds = user?.favorites.map((f) => f.movieId) ?? [];
    const watchlistIds = user?.watchlist.map((f) => f.movieId) ?? [];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">🎬 Movie Explorer</h1>

            <h2 className="text-2xl font-semibold mb-3">
                ⭐ Top Rated by Users
            </h2>

            <TopRatedMovies
                initialMovies={initialMovies}
                favoriteIds={favoriteIds}
                watchlistIds={watchlistIds}
            />
        </div>
    );
}
