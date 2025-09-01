import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import MovieCard from "@/components/MovieCard";
type Watchlist = {
    id: string;
    movieId: number;
    title: string;
    posterPath: string | null;
};

export default async function WatchListPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return (
            <div className="p-8 text-center">
                <p>You must be signed in to see your watchlist.</p>
            </div>
        );
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { watchlist: { include: { movie: true } } },
    });

    const watchlist = user?.watchlist ?? [];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">
                {session.user?.name}&apos;s Watchlist
            </h1>

            {watchlist.length > 0 ? (
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {watchlist.map((watch) => (
                        <MovieCard
                            key={watch.id}
                            movie={{
                                id: watch.movieId,
                                title: watch.movie.title,
                                poster_path: watch.movie.posterPath,
                                release_date: "", // je hebt release_date niet in je favs
                            }}
                        />
                    ))}
                </ul>
            ) : (
                <p>No watchlist yet.</p>
            )}
        </div>
    );
}
