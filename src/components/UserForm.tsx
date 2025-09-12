"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSearchForm() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (query.length < 1) {
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

    return (
        <div className="max-w-md mx-auto">
            <input
                type="text"
                placeholder="Zoek user..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border p-2 rounded"
            />

            {loading && <p className="text-sm text-gray-500">Zoeken…</p>}

            {results.length > 0 && (
                <ul className="border rounded mt-2 bg-white shadow">
                    {results.map((u) => (
                        <li
                            key={u.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push(`/users/${u.id}`)} // 👈 redirect naar profielpagina
                        >
                            {u.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
