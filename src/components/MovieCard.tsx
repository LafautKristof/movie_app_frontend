import Image from "next/image";
import Link from "next/link";
import MovieActions from "./MovieActions";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};
const MovieCard = ({ movie }: { movie: Movie }) => {
    return (
        <li key={movie.id} className="bg-gray-800 text-white rounded p-3">
            {" "}
            <Link href={`/search/${movie.id}`}>
                <Image
                    src={
                        movie.poster_path !== null
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/No_Image_Available.jpg"
                    }
                    alt={movie.title}
                    width={300} // 👈 verplicht
                    height={450}
                    className="rounded mb-2"
                />
                <h2 className="font-semibold">{movie.title}</h2>
                <p className="text-sm opacity-75">
                    {movie.release_date
                        ? new Intl.DateTimeFormat("nl-BE", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                          }).format(new Date(movie.release_date))
                        : "Onbekend"}
                </p>{" "}
            </Link>
            <MovieActions movie={movie} />
        </li>
    );
};
export default MovieCard;
