"use client";

import { useEffect, useState } from "react";
import AddParticipant from "./AddParticipant";
import Image from "next/image";
import Link from "next/link";

type Participant = {
    id: string;
    name: string;
    avatarUrl?: string | null;
};

export default function ConversationSettings({
    conversationId,
    currentUserId, // 👈 vanuit parent of session meegeven
}: {
    conversationId: string;
    currentUserId: string;
}) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#3b82f6");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [ownerId, setOwnerId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchConversation() {
            const res = await fetch(`/api/conversations/${conversationId}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                setTitle(data.title || "");
                setColor(data.color || "#3b82f6");
                setOwnerId(data.ownerId || null); // 👈 ownerId opslaan
            }
        }
        fetchConversation();
    }, [conversationId]);

    useEffect(() => {
        async function fetchParticipants() {
            const res = await fetch(
                `/api/conversations/${conversationId}/participants`,
                { cache: "no-store" }
            );
            if (res.ok) {
                const data = await res.json();
                setParticipants(data);
            }
        }
        fetchParticipants();
    }, [conversationId]);

    async function handleSave() {
        const res = await fetch(`/api/conversations/${conversationId}`, {
            method: "PATCH",
            body: JSON.stringify({ title, color }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            const updated = await res.json();
            setTitle(updated.title || "");
            setColor(updated.color || "#3b82f6"); // ✅ direct state updaten
        } else {
            const error = await res.json();
        }
    }

    async function handleRemove(userId: string) {
        const res = await fetch(
            `/api/conversations/${conversationId}/participants/${userId}`,
            { method: "DELETE" }
        );
        if (res.ok) {
            setParticipants((prev) => prev.filter((p) => p.id !== userId));
        } else {
            const error = await res.json();
            alert(error.error || "Kon deelnemer niet verwijderen");
        }
    }

    return (
        <div className="p-3 border-t space-y-3">
            {currentUserId === ownerId && (
                <>
                    {" "}
                    <div>
                        <label className="block text-sm font-medium">
                            Titel
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded px-2 py-1 w-full"
                            placeholder="Groepsnaam"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Kleur
                        </label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="h-8 w-16 cursor-pointer"
                        />
                    </div>
                    <div className="pt-4 border-t">
                        <h4 className="font-medium text-sm mb-2">
                            Deelnemer toevoegen
                        </h4>
                        <AddParticipant conversationId={conversationId} />
                    </div>
                </>
            )}

            {/* 🔹 Huidige deelnemers */}
            <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Deelnemers</h4>
                <ul className="space-y-2">
                    {participants.map((p) => {
                        const isCurrentUser = p.id === currentUserId;
                        const canRemove =
                            currentUserId === ownerId && !isCurrentUser; // 👈 alleen owner mag anderen verwijderen

                        return (
                            <li
                                key={p.id}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    {p.avatarUrl ? (
                                        <Image
                                            src={p.avatarUrl}
                                            alt={p.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                                            {p.name
                                                .split(" ")
                                                .slice(0, 2)
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    <Link
                                        href={`/users/${p.id}`}
                                        className="hover:underline flex items-center gap-1"
                                    >
                                        <span>{p.name}</span>
                                        {isCurrentUser && (
                                            <span className="text-gray-500">
                                                (jij)
                                            </span>
                                        )}
                                        {p.id === ownerId && (
                                            <span className="text-yellow-600">
                                                👑
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {canRemove && (
                                    <button
                                        onClick={() => handleRemove(p.id)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Verwijder
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
                {currentUserId !== ownerId && (
                    <div className="pt-4">
                        <button
                            onClick={() => handleRemove(currentUserId)}
                            className="text-red-600 text-sm underline"
                        >
                            Chat verlaten
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Opslaan
            </button>
        </div>
    );
}
