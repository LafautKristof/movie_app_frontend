import Image from "next/image";
import Link from "next/link";
type Company = {
    id: number;
    name: string;
    logo_path: string | null;
};
const ProductionCompanyCard = ({ companies }: { companies: Company[] }) => {
    if (!companies || companies.length === 0) return null;

    return (
        <div className="mt-6 w-full">
            <h2 className="text-xl font-bold mb-2">Production</h2>
            <div className="mt-6 flex flex-wrap gap-3">
                {companies.map((company) => (
                    <Link
                        key={company.id}
                        href={`/companies/${company.id}`}
                        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                        {company.logo_path ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                alt={company.name}
                                width={200}
                                height={200}
                                className="h-auto w-20"
                            />
                        ) : (
                            <div className="w-[120px] h-[60px] bg-gray-600 flex items-center justify-center mb-2 text-xs">
                                No Logo
                            </div>
                        )}
                        {company.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default ProductionCompanyCard;
