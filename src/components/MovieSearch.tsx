"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { genreMap } from "@/helpers/genresMap";

export default function MovieSearch({
    initialQuery = "",
    initialGenres = [],
}: {
    initialQuery?: string;
    initialGenres?: number[];
}) {
    const [query, setQuery] = useState(initialQuery);
    const [selectedGenres, setSelectedGenres] =
        useState<number[]>(initialGenres);
    const router = useRouter();

    function toggleGenre(id: number) {
        setSelectedGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) {
            // ✅ Zoekterm heeft voorrang → genres worden genegeerd
            params.set("q", query.trim());
        } else if (selectedGenres.length > 0) {
            params.set("genres", selectedGenres.join(","));
        }
        params.set("page", "1");
        router.push(`/movies?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
            <div className="flex gap-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="border px-3 py-2 rounded flex-1"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            {/* Genres alleen actief als query leeg is */}
            {!query.trim() && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(genreMap).map(([id, name]) => (
                        <label key={id} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={selectedGenres.includes(Number(id))}
                                onChange={() => toggleGenre(Number(id))}
                            />
                            {name}
                        </label>
                    ))}
                </div>
            )}
        </form>
    );
}
