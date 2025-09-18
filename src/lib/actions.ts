"use server";

import prisma from "@/lib/prisma";

export async function getTopRatedMovies(limit: number) {
    const topRated = await prisma.rating.groupBy({
        by: ["movieId"],
        _avg: { points: true },
        orderBy: { _avg: { points: "desc" } },
        take: limit,
    });

    const movies = await prisma.movie.findMany({
        where: { id: { in: topRated.map((r) => r.movieId) } },
    });

    return topRated
        .map((r) => ({
            avg: r._avg.points,
            movie: movies.find((m) => m.id === r.movieId),
        }))
        .filter((x) => x.movie);
}
