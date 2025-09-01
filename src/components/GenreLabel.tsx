import { genreColors } from "@/helpers/genresMap";
import Link from "next/link";
type Genre = { id: number; name: string };
const GenreLabel = ({ g }: { g: Genre }) => {
    return (
        <Link href={`/genres/${g.id}`}>
            <span
                key={g.id}
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    genreColors[g.name] || "bg-gray-500"
                }`}
            >
                {g.name}
            </span>
        </Link>
    );
};
export default GenreLabel;
