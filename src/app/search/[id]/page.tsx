// app/movie/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

import GenreLabel from "@/components/GenreLabel";
import ProductionCompanyCard from "@/components/ProductionCompanyCard";
import Map from "@/components/Map";
type MovieDetails = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    genres: { id: number; name: string }[];
    backdrop_path: string | null;
    tagline: string;
    production_countries: { iso_3166_1: string; name: string }[];
    production_companies: ProductionCompany[];
};

type ProductionCompany = {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
};
export default async function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`,
        { cache: "no-store" } // altijd verse data
    );

    if (!res.ok) {
        notFound();
    }

    const movie: MovieDetails = await res.json();

    return (
        <div className="p-6 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="mb-4 text-gray-300">
                {movie.release_date
                    ? new Intl.DateTimeFormat("nl-BE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                      }).format(new Date(movie.release_date))
                    : "Onbekend"}
            </p>
            <p className="mb-4 text-gray-300 italic">
                {movie.tagline && `"${movie.tagline}"`}
            </p>

            <div className="flex flex-col items-center gap-2">
                <div className="flex flex-wrap gap-1 mt-2">
                    {movie.genres.map((g) => (
                        <GenreLabel key={g.id} g={g} />
                    ))}
                </div>
                {movie.poster_path && (
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={250} // 👈 verplicht
                        height={500} // 👈 verplicht
                        priority
                        className="rounded-2xl mb-6 border-gray-500 border-2"
                    />
                )}

                <p>{movie.overview}</p>
            </div>
            {movie.production_companies.length > 0 && (
                <ProductionCompanyCard companies={movie.production_companies} />
            )}
            {movie.production_countries?.length > 0 && (
                <Map
                    originCountries={movie.production_countries.map(
                        (c) => c.iso_3166_1
                    )}
                />
            )}
        </div>
    );
}
