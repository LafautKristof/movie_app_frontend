import prisma from "@/lib/prisma";
import MovieCard from "@/components/MovieCard";

export default async function HomePage(
    props: {
        searchParams?: Promise<{ limit?: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const limit = parseInt(searchParams?.limit ?? "8", 10);

    // top rated query
    const topRated = await prisma.rating.groupBy({
        by: ["movieId"],
        _avg: { points: true },
        orderBy: { _avg: { points: "desc" } },
        take: limit,
    });

    const movies = await prisma.movie.findMany({
        where: { id: { in: topRated.map((r) => r.movieId) } },
    });

    const sortedMovies = topRated
        .map((r) => ({
            avg: r._avg.points,
            movie: movies.find((m) => m.id === r.movieId),
        }))
        .filter((x) => x.movie)
        .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">🎬 Movie Explorer</h1>

            {/* Form om aantal films te kiezen */}
            <form className="mb-6 flex items-center gap-2">
                <select
                    name="limit"
                    defaultValue={limit}
                    className="border px-2 py-1 rounded"
                >
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="64">64</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                    Update
                </button>
            </form>

            <h2 className="text-2xl font-semibold mb-3">
                ⭐ Top Rated by Users (showing {limit})
            </h2>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {sortedMovies.map(({ movie, avg }) => (
                    <li
                        key={movie!.id}
                        className="bg-gray-800 text-white rounded p-3"
                    >
                        <MovieCard
                            movie={{
                                id: movie!.id,
                                title: movie!.title,
                                poster_path: movie!.posterPath,
                                release_date:
                                    movie!.releaseDate?.toISOString() ?? "",
                            }}
                        />
                        <p className="mt-2 text-yellow-400 font-semibold">
                            Avg: {avg?.toFixed(1)}/10
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
