"use client";

import { useEffect, useState } from "react";

export default function AddParticipant({
    conversationId,
}: {
    conversationId: string;
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            const res = await fetch(
                `/api/users?q=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            setResults(data);
            setLoading(false);
        }, 300); // debounce

        return () => clearTimeout(timeout);
    }, [query]);

    async function handleAdd(userId: string) {
        const res = await fetch(
            `/api/conversations/${conversationId}/participants`,
            {
                method: "POST",
                body: JSON.stringify({ userId }),
                headers: { "Content-Type": "application/json" },
            }
        );

        if (res.ok) {
            setQuery("");
            setResults([]);
        } else {
            const error = await res.json();
            alert(error.error || "Kon user niet toevoegen");
        }
    }

    return (
        <div className="mt-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoek username..."
                className="border rounded px-2 py-1 w-full"
            />

            {loading && <p className="text-sm text-gray-500">Zoeken…</p>}

            {results.length > 0 && (
                <ul className="border rounded mt-2 bg-white shadow">
                    {results.map((u) => (
                        <li
                            key={u.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        >
                            <span>{u.name}</span>
                            <button
                                onClick={() => handleAdd(u.id)}
                                className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                            >
                                Toevoegen
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
