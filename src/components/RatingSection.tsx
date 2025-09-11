"use client";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import RatingForm from "@/components/RatingForm";

export default function RatingSection({
    movie,
    initialRating,
    initialAggregate,
}: {
    movie: {
        id: number;
        title: string;
        poster_path: string | null;
        release_date: string;
    };
    initialRating: number;
    initialAggregate: { average: number; count: number };
}) {
    const [agg, setAgg] = useState(initialAggregate);

    useEffect(() => {
        const channel = pusherClient.subscribe(`movie-${movie.id}`);

        channel.bind(
            "rating-updated",
            (data: { average: number; count: number }) => {
                setAgg(data);
            }
        );

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [movie.id]);

    return (
        <RatingForm
            movie={movie}
            initialRating={initialRating}
            aggregate={agg}
        />
    );
}
