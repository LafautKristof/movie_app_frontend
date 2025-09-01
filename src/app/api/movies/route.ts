// app/api/movies/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const genres = searchParams.get("genres");
    const year = searchParams.get("year");
    const page = searchParams.get("page") || "1";

    let url = "";

    if (q) {
        url = `https://api.themoviedb.org/3/search/movie?query=${q}&page=${page}&api_key=${process.env.TMDB_API_KEY}`;
    } else if (genres) {
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genres}&page=${page}&api_key=${process.env.TMDB_API_KEY}`;
    } else if (year) {
        url = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&page=${page}&api_key=${process.env.TMDB_API_KEY}`;
    } else {
        url = `https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${process.env.TMDB_API_KEY}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
}
