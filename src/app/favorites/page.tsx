"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Favorite = {
    id: string;
    movieId: number;
    title: string;
    posterPath: string | null;
};

export default function FavoritesPage() {
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;

        async function loadFavorites() {
            const res = await fetch("/api/favorites");
            if (res.ok) {
                const data = await res.json();
                setFavorites(data);
            }
            setLoading(false);
        }

        loadFavorites();
    }, [session]);

    if (!session) {
        return (
            <div className="p-8 text-center">
                <p>You must be signed in to see your favorites.</p>
            </div>
        );
    }

    if (loading) {
        return <p className="p-8">Loading...</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">
                {session.user?.name}&apos;s Favorites
            </h1>

            {favorites.length > 0 ? (
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {favorites.map((fav) => (
                        <li
                            key={fav.id}
                            className="bg-gray-800 text-white rounded p-4"
                        >
                            {fav.posterPath && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${fav.posterPath}`}
                                    alt={fav.title}
                                    className="rounded mb-2"
                                />
                            )}
                            <h2 className="font-semibold">{fav.title}</h2>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No favorites yet.</p>
            )}
        </div>
    );
}
