"use client";

import { useEffect, useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};

export default function RatingForm({
    movie,
    initialRating = 0,
    aggregate = { average: 0, count: 0 },
}: {
    movie: Movie;
    initialRating?: number;
    aggregate?: { average: number | null | undefined; count: number };
}) {
    const [rating, setRating] = useState(initialRating);
    const [agg, setAgg] = useState<{
        average: number | null | undefined;
        count: number;
    }>(aggregate);
    const [hover, setHover] = useState(0);
    const [saving, setSaving] = useState(false);

    // Als de parent later een andere initialRating meegeeft, sync ‘m éénmalig
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    async function savePoints(val: number) {
        try {
            setSaving(true);
            setRating(val); // optimistisch

            // ✅ POST naar enkelvoudige route
            const postRes = await fetch("/api/rating", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    points: val,
                }),
            });

            if (!postRes.ok) {
                console.error("Save failed", postRes.status);
                // rollback als je wil:
                // setRating(prev => prev);
                return;
            }

            // ✅ Herlaad eigen rating + aggregaat vanaf de enkelvoud-route
            const getRes = await fetch(`/api/rating?movieId=${movie.id}`, {
                cache: "no-store",
            });
            if (getRes.ok) {
                const { rating: updated, aggregate: newAgg } =
                    await getRes.json();
                setRating(updated?.points ?? val);
                if (newAgg)
                    setAgg({
                        average: newAgg.average ?? 0,
                        count: newAgg.count ?? 0,
                    });
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => {
                        const active = val <= (hover || rating);
                        return (
                            <button
                                key={val}
                                type="button"
                                onClick={() => savePoints(val)}
                                onMouseEnter={() => setHover(val)}
                                onMouseLeave={() => setHover(0)}
                                className="text-2xl"
                                aria-label={`Geef ${val} punten`}
                                title={`${val}/10`}
                                disabled={saving}
                            >
                                {active ? (
                                    <IoStar color="yellow" />
                                ) : (
                                    <IoStarOutline color="yellow" />
                                )}
                            </button>
                        );
                    })}
                    <span className="ml-2 text-sm opacity-75">{rating}/10</span>
                </div>

                <div className="text-sm opacity-75">
                    Gemiddeld: {agg.average ?? "-"} ({agg.count} rating
                    {agg.count === 1 ? "" : "s"})
                </div>
            </div>
        </div>
    );
}
