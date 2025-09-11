// app/company/[id]/page.tsx
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function CompanyPage(
    props: {
        params: Promise<{ id: string }>;
        searchParams?: Promise<{ page?: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const { id } = await params;
    const page = Number(searchParams?.page) || 1;
    const companyRes = await fetch(
        `https://api.themoviedb.org/3/company/${id}?api_key=${process.env.TMDB_API_KEY}`,
        { cache: "no-store" }
    );
    if (!companyRes.ok) notFound();
    const company = await companyRes.json();

    // 2. Haal films van deze company op
    const moviesRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_companies=${id}&page=${page}&api_key=${process.env.TMDB_API_KEY}`,
        { cache: "no-store" }
    );
    if (!moviesRes.ok) notFound();
    const data = await moviesRes.json();

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
                {company.logo_path && (
                    <Image
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        width={100}
                        height={50}
                        className="object-contain bg-white p-2 rounded"
                    />
                )}
                <h1 className="text-3xl font-bold">{company.name}</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-4">
                Films van dit productiehuis
            </h2>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.results.map((movie: any) => (
                    <MovieCard movie={movie} key={movie.id} />
                ))}
            </ul>
            <Pagination
                page={data.page}
                totalPages={data.total_pages}
                basePath={`/companies/${id}`}
            />
        </div>
    );
}
