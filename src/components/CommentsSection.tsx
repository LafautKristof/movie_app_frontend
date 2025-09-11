"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import CommentCard from "@/components/CommentCard";
import CommentForm from "@/components/CommentForm";

export default function CommentsSection({
    movieId,
    initialComments,
}: {
    movieId: number;
    initialComments: any[];
}) {
    const [comments, setComments] = useState(initialComments);

    useEffect(() => {
        // ✅ Luister naar Pusher kanaal
        const channel = pusherClient.subscribe(`movie-${movieId}`);

        channel.bind("new-comment", (comment: any) => {
            setComments((prev) => {
                if (prev.find((c) => c.id === comment.id)) return prev;
                return [comment, ...prev];
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [movieId]);

    return (
        <div>
            <CommentForm
                movie={{ id: movieId }}
                onSuccess={(comment) =>
                    setComments((prev) => {
                        if (prev.find((c) => c.id === comment.id)) return prev;
                        return [comment, ...prev];
                    })
                }
            />{" "}
            <CommentCard comments={comments} />
        </div>
    );
}
