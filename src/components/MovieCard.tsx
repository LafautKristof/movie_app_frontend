"use client";

import Image from "next/image";
import Link from "next/link";
import MovieActions from "./MovieActions";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};

export default function MovieCard({
    movie,
    isFavorite,
    isWatchlist,
}: {
    movie: Movie;
    isFavorite: boolean;
    isWatchlist: boolean;
}) {
    return (
        <div>
            <Link href={`/movies/${movie.id}`}>
                <Image
                    src={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/No_Image_Available.jpg"
                    }
                    alt={movie.title}
                    width={300}
                    height={450}
                    priority
                    className="rounded mb-2"
                />
                <h2 className="font-semibold">{movie.title}</h2>
                <p className="text-sm opacity-75">
                    {movie.release_date
                        ? new Intl.DateTimeFormat("nl-BE", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                          }).format(new Date(movie.release_date))
                        : "Onbekend"}
                </p>
            </Link>

            <MovieActions
                movie={movie}
                initialFavorites={isFavorite}
                initialWatchlist={isWatchlist}
            />
        </div>
    );
}
