"use client";

import { useActionState, useTransition } from "react";
import { getTopRatedMovies } from "@/lib/actions";
import MovieCard from "@/components/MovieCard";

export default function TopRatedMovies({
    initialMovies,
    favoriteIds,
    watchlistIds,
}: {
    initialMovies: any[];
    favoriteIds: number[];
    watchlistIds: number[];
}) {
    const [isPending, startTransition] = useTransition();
    const [movies, formAction, pending] = useActionState(
        async (_: any, formData: FormData) => {
            const limit = parseInt(formData.get("limit") as string, 10);
            return await getTopRatedMovies(limit);
        },
        initialMovies
    );
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const formData = new FormData();
        formData.set("limit", e.target.value);
        startTransition(() => {
            formAction(formData);
        });
    }
    return (
        <div>
            {/* Form om aantal films te kiezen */}
            <div className="mb-6 flex items-center gap-2">
                <select
                    name="limit"
                    defaultValue="8"
                    onChange={handleChange}
                    disabled={pending}
                    className="border px-2 py-1 rounded"
                >
                    {[1, 2, 4, 8, 16, 32, 64].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
                {pending && (
                    <span className="text-sm text-gray-400">Loading…</span>
                )}
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {movies.map(({ movie, avg }) => (
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
                            isFavorite={favoriteIds.includes(movie!.id)}
                            isWatchlist={watchlistIds.includes(movie!.id)}
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
