// components/MovieActions.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import RatingForm from "./RatingForm";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { useRouter } from "next/navigation";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};

export default function MovieActions({
    movie,
    initialFavorites,
    initialWatchlist,
}: {
    movie: Movie;
    initialFavorites: boolean;
    initialWatchlist: boolean;
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(initialFavorites);
    const [inWatchlist, setInWatchlist] = useState(initialWatchlist);

    async function toggleFavorite() {
        if (isFavorite) {
            await fetch("/api/favorites", {
                method: "DELETE",
                body: JSON.stringify({ id: movie.id }),
                headers: { "Content-Type": "application/json" },
            });
            setIsFavorite(false);
            router.refresh();
        } else {
            await fetch("/api/favorites", {
                method: "POST",
                body: JSON.stringify({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                }),
                headers: { "Content-Type": "application/json" },
            });
            setIsFavorite(true);
            router.refresh();
        }
    }

    async function toggleWatchlist() {
        if (inWatchlist) {
            await fetch("/api/watchlist", {
                method: "DELETE",
                body: JSON.stringify({ id: movie.id }),
                headers: { "Content-Type": "application/json" },
            });
            setInWatchlist(false);
            router.refresh();
        } else {
            await fetch("/api/watchlist", {
                method: "POST",
                body: JSON.stringify({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                }),
                headers: { "Content-Type": "application/json" },
            });
            setInWatchlist(true);
            router.refresh();
        }
    }

    if (!session) return null;

    return (
        <div className="mt-2 flex flex-col gap-2">
            {/* Favorite toggle */}
            <span
                onClick={toggleFavorite}
                className="cursor-pointer text-2xl hover:scale-110 transition"
            >
                {isFavorite ? (
                    <GoHeartFill className="text-red-600" />
                ) : (
                    <GoHeart />
                )}
            </span>

            {/* Watchlist toggle */}
            <span
                onClick={toggleWatchlist}
                className="cursor-pointer text-lg hover:scale-110 transition"
            >
                {inWatchlist ? "✔ In Watchlist" : "➕ Add to Watchlist"}
            </span>

            {/* <RatingForm
                movie={movie}
                initialRating={initialRating}
                initialComment={initialComment}
            /> */}
        </div>
    );
}
