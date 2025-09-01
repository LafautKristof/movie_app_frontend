import Link from "next/link";
import { genreMap, genreColors } from "@/helpers/genresMap";

export default async function HomePage() {
    // 🔥 optioneel: populaire films ophalen via TMDB
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`,
        { cache: "no-store" }
    );
    const data = await res.json();
    const popularMovies = data.results || [];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">🎬 Movie Explorer</h1>

            {/* Genres */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(genreMap).map(([id, name]) => (
                        <Link key={id} href={`/genre/${id}`}>
                            <span
                                className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                    genreColors[name] || "bg-gray-500"
                                }`}
                            >
                                {name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Populaire films */}
            <div>
                <h2 className="text-2xl font-semibold mb-3">Popular Movies</h2>
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {popularMovies.slice(0, 8).map((movie: any) => (
                        <li
                            key={movie.id}
                            className="bg-gray-800 text-white rounded p-3"
                        >
                            <Link href={`/search/${movie.id}`}>
                                <img
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : "/No_Image_Available.jpg"
                                    }
                                    alt={movie.title}
                                    className="rounded mb-2"
                                />
                                <h3 className="font-semibold">{movie.title}</h3>
                                <p className="text-sm opacity-75">
                                    {movie.release_date}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
