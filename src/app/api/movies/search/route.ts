import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const genres = searchParams.get("genres");
    const page = searchParams.get("page") || "1";

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${page}`;

    if (q) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${
            process.env.TMDB_API_KEY
        }&query=${encodeURIComponent(q)}&page=${page}`;
    }

    if (genres) {
        // TMDB ondersteunt with_genres=1,2,3
        url += `&with_genres=${genres}`;
    }

    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();

    return NextResponse.json(data);
}
