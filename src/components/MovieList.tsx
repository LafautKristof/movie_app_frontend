// components/MovieList.tsx (SERVER)
import MovieCard from "./MovieCard";

export default function MovieList({ movies }: { movies: any[] }) {
    return (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </ul>
    );
}
