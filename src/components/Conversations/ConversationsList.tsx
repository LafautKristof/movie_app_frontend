"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher"; // ✅ import

type Conversation = {
    id: string;
    participants: { user: { id: string; name: string | null } }[];
    messages: { content: string; createdAt: string }[];
    title: string | null;
};

export default function ConversationsList({
    currentUserId,
    onSelectConversation,
}: {
    currentUserId: string;
    onSelectConversation: (id: string) => void;
}) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/conversations", {
                cache: "no-store",
            });
            const data = await res.json();

            setConversations(data);
        }

        // ✅ eerste load
        load();
        pusherClient.connection.bind("connected", () => {});

        pusherClient.connection.bind("error", (err: any) => {
            console.error("❌ Pusher error:", err);
        });
        // ✅ realtime updates
        const channel = pusherClient.subscribe("conversations");
        channel.bind("updated", (payload: any) => {
            load();
        });

        return () => {
            pusherClient.unsubscribe("conversations");
        };
    }, []);

    return (
        <div className="w-full max-w-md border rounded p-4 bg-white">
            <h2 className="text-lg font-semibold mb-4">Chats</h2>
            <ul className="space-y-3">
                {conversations.map((conv) => {
                    const others = conv.participants
                        .filter((p) => p.user.id !== currentUserId)
                        .map((p) => p.user.name ?? "Onbekend");

                    const displayName = conv.title
                        ? conv.title
                        : others.length === 1
                        ? others[0]
                        : `Groep: ${others.join(", ")}`;

                    const lastMsg = conv.messages[0];

                    return (
                        <li
                            key={conv.id}
                            className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                            onClick={() => onSelectConversation(conv.id)}
                        >
                            <div className="font-medium truncate">
                                {displayName}
                            </div>
                            {lastMsg ? (
                                <p className="text-sm text-gray-500 truncate">
                                    {lastMsg.content} •{" "}
                                    {new Date(
                                        lastMsg.createdAt
                                    ).toLocaleTimeString("nl-BE", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    Nog geen berichten
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
