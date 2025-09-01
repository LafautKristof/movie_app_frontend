import Link from "next/link";
import { genreMap, genreColors, genreIcons } from "@/helpers/genresMap";

export default function GenreOverviewPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Alle Genres</h1>

            <div className="flex flex-wrap gap-3">
                {Object.entries(genreMap).map(([id, name]) => {
                    const Icon = genreIcons[Number(id)];
                    return (
                        <Link
                            key={id}
                            href={`/genres/${id}`}
                            className={`flex items-center gap-2 text-2xl px-3 py-1 rounded-full font-semibold hover:opacity-80 transition ${
                                genreColors[name] ||
                                "bg-gray-500 border-amber-50 border-8"
                            }`}
                        >
                            {Icon && <Icon size={20} />}
                            {name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
