import Image from "next/image";
import Link from "next/link";
import MovieActions from "./MovieActions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};
const MovieCard = async ({ movie }: { movie: Movie }) => {
    const session = await getServerSession(authOptions);

    let isFavorite = false;
    let isWatchlist = false;
    let initialRating = 0;

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                favorites: { select: { movieId: true } },
                watchlist: { select: { movieId: true } },
                ratings: {
                    where: { movieId: movie.id }, // 👈 alleen deze film
                    select: { points: true },
                },
            },
        });

        isFavorite =
            user?.favorites.some((f) => f.movieId === movie.id) ?? false;
        isWatchlist =
            user?.watchlist.some((f) => f.movieId === movie.id) ?? false;
        initialRating = user?.ratings[0]?.points ?? 0;
        console.log("Rating for", movie.id, "=", user?.ratings);
    }

    return (
        <>
            <div>
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
                        priority
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
                <MovieActions
                    movie={movie}
                    initialFavorites={isFavorite}
                    initialWatchlist={isWatchlist}
                    initialRating={initialRating}
                />
            </div>
        </>
    );
};
export default MovieCard;
