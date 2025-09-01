"use client";

import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { genreMap } from "@/helpers/genresMap";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};
export default function MoviePage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

    async function fetchMovies(pageNum: number) {
        const params = new URLSearchParams();
        params.set("page", pageNum.toString());

        if (query.trim()) {
            params.set("q", query.trim());
        }
        if (selectedGenres.length > 0) {
            params.set("genres", selectedGenres.join(","));
        }

        const url = `/api/movies/search?${params.toString()}`;

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            setResults(data.results);
            setPage(data.page);
            setTotalPages(data.total_pages);
        }
    }

    function toggleGenre(id: number) {
        setSelectedGenres((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Search Movies</h1>

            {/* Zoekbalk */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchMovies(1);
                }}
                className="mb-6 flex gap-2"
            >
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="border px-3 py-2 rounded flex-1"
                />
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
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </form>

            {/* Resultaten */}
            {results.length > 0 && (
                <>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {results.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        onPageChange={(newPage) => fetchMovies(newPage)}
                    />
                </>
            )}
        </div>
    );
}
