"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};

export default function ReleasesPage() {
    const [year, setYear] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function fetchMovies(y: string, pageNum: number) {
        if (!y) return;

        const res = await fetch(
            `/api/movies?year=${y}&page=${pageNum}` // 👈 proxy via je eigen API route
        );
        if (res.ok) {
            const data = await res.json();
            setResults(data.results);
            setPage(data.page);
            setTotalPages(data.total_pages);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        fetchMovies(year, 1);
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Search by Release Year</h1>

            {/* Form voor jaartal */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="number"
                    placeholder="Enter year e.g. 2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                />
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
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        onPageChange={(newPage) => fetchMovies(year, newPage)}
                    />
                </>
            )}
        </div>
    );
}
