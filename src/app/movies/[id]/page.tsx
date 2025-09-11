// app/movie/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import GenreLabel from "@/components/GenreLabel";
import ProductionCompanyCard from "@/components/ProductionCompanyCard";
import Map from "@/components/Map";
import CommentCard from "@/components/CommentCard";
import RatingForm from "@/components/RatingForm";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentForm from "@/components/CommentForm";
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

type CommentResponse = {
    comments: {
        id: string;
        comment: string | null;
        createdAt: string;
        user?: { name?: string | null };
    }[];
    aggregate?: { average: number | null; count: number };
};

type RatingResponse = {
    rating?: { id: string; points: number; comment: string | null } | null;
    aggregate?: { average: number | null | undefined; count: number };
};

export default async function MovieDetailPage({
    params,
}: {
    params: { id: string }; // ✅ niet als Promise
}) {
    const session = await getServerSession(authOptions);
    const id = params.id;

    const [movieRes, commentRes] = await Promise.all([
        fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`,
            { cache: "no-store" }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/comments?movieId=${id}`,
            {
                cache: "no-store",
            }
        ),
    ]);

    if (!movieRes.ok) notFound(); // alleen de film is doorslaggevend

    const movie: MovieDetails = await movieRes.json();

    // Comments: best-effort
    let rawComments: CommentResponse["comments"] = [];
    if (commentRes.ok) {
        const json = await commentRes.json();
        rawComments = json.comments ?? [];
    }
    const comments = (rawComments ?? [])
        .filter((r) => (r.comment ?? "").trim().length > 0)
        .map((r) => ({
            id: r.id,
            body: r.comment!,
            createdAt: r.createdAt,
            user: { name: r.user?.name ?? "Anonieme gebruiker" },
        }));
    console.log("comments", comments);
    // Rating + aggregaat: best-effort (401 bij geen sessie is oké)
    let initialRating = 0;
    let agg = { average: 0, count: 0 };

    const movieId = Number(params.id);

    const aggregate = await prisma.rating.aggregate({
        where: { movieId },
        _avg: { points: true },
        _count: { _all: true },
    });

    agg = {
        average: aggregate._avg.points ?? 0,
        count: aggregate._count._all ?? 0,
    };

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (user) {
            const userRating = await prisma.rating.findUnique({
                where: { userId_movieId: { userId: user.id, movieId } },
                select: { points: true },
            });
            initialRating = userRating?.points ?? 0;
        }
    }
    return (
        <div className="p-6 flex flex-col justify-center items-center">
            <RatingForm
                movie={movie}
                initialRating={initialRating ?? 0}
                aggregate={agg ?? { average: 0, count: 0 }}
            />

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
                        width={250}
                        height={500}
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
            <CommentForm movie={movie} />
            <CommentCard comments={comments} />
        </div>
    );
}
