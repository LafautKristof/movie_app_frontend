// components/MovieActions.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
};

export default function MovieActions({ movie }: { movie: Movie }) {
    const { data: session } = useSession();
    const [rating, setRating] = useState(0);

    async function addFavorite() {
        await fetch("/api/favorites", {
            method: "POST",
            body: JSON.stringify({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
            }),
            headers: { "Content-Type": "application/json" },
        });
        alert("Added to favorites!");
    }

    async function addWatchlist() {
        await fetch("/api/watchlist", {
            method: "POST",
            body: JSON.stringify({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
            }),
            headers: { "Content-Type": "application/json" },
        });
        alert("Added to watchlist!");
    }

    async function submitRating(e: React.FormEvent) {
        e.preventDefault();
        await fetch("/api/ratings", {
            method: "POST",
            body: JSON.stringify({
                id: movie.id,
                points: rating,
            }),
            headers: { "Content-Type": "application/json" },
        });
        alert("Rating submitted!");
    }

    if (!session) return null;

    return (
        <div className="mt-2 flex flex-col gap-2">
            <button
                onClick={addFavorite}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
                ❤️ Favorite
            </button>

            <button
                onClick={addWatchlist}
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
                👀 Watchlist
            </button>

            <form onSubmit={submitRating} className="flex gap-2 items-center">
                <input
                    type="number"
                    min={1}
                    max={10}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-16 px-2 text-black rounded"
                />
                <button
                    type="submit"
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                    ⭐ Rate
                </button>
            </form>
        </div>
    );
}
