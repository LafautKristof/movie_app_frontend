// app/api/movies/route.ts
import { NextResponse } from "next/server";

type TMDBMovie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string | null;
    genre_ids: number[];
    vote_average: number;
    vote_count: number;
    original_language: string;
    backdrop_path: string | null;
    popularity: number;
};

type TMDBListResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

const TMDB_API = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY; // <-- zet deze in je .env.local

if (!API_KEY) {
    console.warn(
        "[api/movies] TMDB_API_KEY ontbreekt. Voeg TMDB_API_KEY toe aan je environment."
    );
}
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get("q")?.trim() || "";
        const genres = url.searchParams.get("genres")?.trim() || "";
        const page = url.searchParams.get("page") || "1";

        if (!API_KEY) {
            return NextResponse.json(
                { error: "Server misconfigured: TMDB_API_KEY ontbreekt." },
                { status: 500 }
            );
        }

        // Als geen zoekterm & geen genres → lege lijst
        if (!q && !genres) {
            return NextResponse.json({
                page: 1,
                results: [],
                total_pages: 0,
                total_results: 0,
            });
        }

        let endpoint = "";
        const params: Record<string, string> = {
            api_key: API_KEY,
            language: "en-US",
            page,
        };

        if (q) {
            // ✅ Prioriteit aan zoekterm
            endpoint = "/search/movie";
            params.query = q;
            params.include_adult = "false";
        } else if (genres) {
            // ✅ Alleen genres
            endpoint = "/discover/movie";
            params.with_genres = genres;
            params.include_adult = "false";
            params.sort_by = "popularity.desc";
        }

        const tmdbUrl = `${TMDB_API}${endpoint}?${new URLSearchParams(params)}`;
        const res = await fetch(tmdbUrl, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`TMDB error ${res.status}`);
        }

        const data = await res.json();

        return NextResponse.json({
            page: data.page,
            results: data.results,
            total_pages: data.total_pages,
            total_results: data.total_results,
            applied: {
                q: q || null,
                genres: genres ? genres.split(",").map(Number) : [],
            },
        });
    } catch (err: any) {
        console.error("[api/movies] Error:", err);
        return NextResponse.json(
            {
                error: "Er ging iets mis bij het ophalen van films.",
                detail: err?.message,
            },
            { status: 500 }
        );
    }
}
