// app/genre/[id]/page.tsx
import GenreLabel from "@/components/GenreLabel";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import { genreMap, genreColors } from "@/helpers/genresMap";

export default async function GenrePage(
    props: {
        params: Promise<{ id: string }>;
        searchParams: Promise<{ page?: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const { id } = await params;

    const name = genreMap[Number(id)];
    const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&page=${page}&api_key=${process.env.TMDB_API_KEY}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        notFound();
    }

    const data = await res.json();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Films in dit genre</h1>
            <GenreLabel g={{ id: Number(id), name }} />

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.results.map((movie: any) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </ul>

            <Pagination
                page={data.page}
                totalPages={data.total_pages}
                basePath={`/genres/${id}`}
            />
        </div>
    );
}
