import prisma from "./prisma";

export type SortedMovie = {
    avg: number | null;
    movie: {
        id: number;
        title: string;
        posterPath: string | null;
        releaseDate: Date | null;
    };
};

export async function fetchMovies(limit: string): Promise<SortedMovie[]> {
    const topRated = await prisma.rating.groupBy({
        by: ["movieId"],
        _avg: { points: true },
        orderBy: { _avg: { points: "desc" } },
        take: Number(limit),
    });

    const movies = await prisma.movie.findMany({
        where: { id: { in: topRated.map((r) => r.movieId) } },
    });

    return topRated
        .map((r) => ({
            avg: r._avg.points,
            movie: movies.find((m) => m.id === r.movieId)!,
        }))
        .filter((x) => x.movie)
        .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));
}
