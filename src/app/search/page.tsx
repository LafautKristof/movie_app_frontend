// app/search/page.tsx  (SERVER)
import MovieList from "@/components/MovieList";
import MovieSearch from "@/components/MovieSearch"; // client form

export default async function SearchPage({
    searchParams,
}: {
    searchParams?: { q?: string; genres?: string; page?: string };
}) {
    const query = searchParams?.q || "";
    const genres = searchParams?.genres?.split(",").map(Number) || [];
    const page = parseInt(searchParams?.page || "1");

    let results: any[] = [];
    let totalPages = 1;

    if (query || genres.length > 0) {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        if (query) params.set("q", query);
        if (genres.length > 0) params.set("genres", genres.join(","));

        const res = await fetch(
            `${
                process.env.NEXTAUTH_URL
            }/api/movies/search?${params.toString()}`,
            { cache: "no-store" } // altijd verse data
        );
        if (res.ok) {
            const data = await res.json();
            results = data.results ?? [];
            totalPages = data.total_pages ?? 1;
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Search Movies</h1>

            {/* Client form dat URL params aanpast */}
            <MovieSearch initialQuery={query} initialGenres={genres} />

            {results.length > 0 && (
                <>
                    <MovieList movies={results} />
                    <p className="mt-4">
                        Page {page} of {totalPages}
                    </p>
                </>
            )}
        </div>
    );
}
