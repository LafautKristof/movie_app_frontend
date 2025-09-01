"use client";
import { useState } from "react";
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
}: {
    movie: Movie;
    initialRating?: number;
}) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0); // 👈 extra state

    async function handleRate(val: number) {
        setRating(val);

        await fetch("/api/rating", {
            method: "POST",
            body: JSON.stringify({
                id: movie.id,
                title: movie.title, // 👈 verplicht
                poster_path: movie.poster_path, // optioneel
                release_date: movie.release_date, // optioneel
                points: val,
            }),
            headers: { "Content-Type": "application/json" },
        });
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {[...Array(10)].map((_, i) => {
                    const val = i + 1;
                    return (
                        <button
                            key={val}
                            type="button"
                            onClick={() => handleRate(val)}
                            onMouseEnter={() => setHover(val)} // 👈 highlight bij hover
                            onMouseLeave={() => setHover(0)} // 👈 reset bij leave
                            className="text-2xl"
                        >
                            {val <= (hover || rating) ? (
                                <IoStar color="yellow" />
                            ) : (
                                <IoStarOutline color="yellow" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
