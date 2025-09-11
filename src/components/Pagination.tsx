"use client";

import Link from "next/link";

type ClientProps = {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    onPageChange: (page: number) => void;
    basePath?: never;
};

type ServerProps = {
    page: number;
    totalPages: number;
    basePath: string;
    searchParams?: Record<string, string>;
    setPage?: never;
    onPageChange?: never;
};

type Props = ClientProps | ServerProps;

export default function Pagination(props: Props) {
    const { page, totalPages } = props;

    // ✅ client-side mode
    if ("setPage" in props && "onPageChange" in props) {
        const clientProps = props as ClientProps;
        return (
            <div className="flex justify-center gap-4 mt-6">
                <button
                    disabled={page <= 1}
                    onClick={() => {
                        clientProps.setPage(page - 1);
                        clientProps.onPageChange(page - 1);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="px-2">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => {
                        clientProps.setPage(page + 1);
                        clientProps.onPageChange(page + 1);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    }

    // ✅ server-side mode
    if ("basePath" in props) {
        const { basePath, page, totalPages, searchParams } =
            props as ServerProps & { searchParams?: Record<string, string> };

        function makeHref(newPage: number) {
            const params = new URLSearchParams(searchParams || {});
            params.set("page", String(newPage));
            return `${basePath}?${params.toString()}`;
        }
        return (
            <div className="flex justify-center gap-4 mt-6">
                {page > 1 && (
                    <Link
                        href={makeHref(page - 1)}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Prev
                    </Link>
                )}

                <span className="px-2">
                    Page {page} of {totalPages}
                </span>

                {page < totalPages && (
                    <Link
                        href={makeHref(page + 1)}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Next
                    </Link>
                )}
            </div>
        );
    }

    return null;
}
