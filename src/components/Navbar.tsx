"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isMoviesOpen, setIsMoviesOpen] = useState(false);

    return (
        <nav className="w-full bg-gray-900 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    🎬 MovieApp
                </Link>

                {/* Links */}
                <div className="flex gap-6 items-center">
                    <Link href="/" className="hover:text-gray-300">
                        Home
                    </Link>
                    <div className="relative">
                        <button
                            onClick={() => setIsMoviesOpen((prev) => !prev)}
                            className="flex items-center hover:text-gray-300"
                        >
                            Movies <ChevronDown size={16} className="ml-1" />
                        </button>
                        {isMoviesOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded shadow-lg z-50">
                                <Link
                                    href="/search"
                                    className="block px-4 py-2 hover:bg-gray-700"
                                    onClick={() => setIsMoviesOpen(false)}
                                >
                                    Search
                                </Link>
                                <Link
                                    href="/genres"
                                    className="block px-4 py-2 hover:bg-gray-700"
                                    onClick={() => setIsMoviesOpen(false)}
                                >
                                    Genres
                                </Link>
                                <Link
                                    href="/releases"
                                    className="block px-4 py-2 hover:bg-gray-700"
                                    onClick={() => setIsMoviesOpen(false)}
                                >
                                    Upcoming Releases
                                </Link>
                                <Link
                                    href="/movies/popular"
                                    className="block px-4 py-2 hover:bg-gray-700"
                                    onClick={() => setIsMoviesOpen(false)}
                                >
                                    Popular
                                </Link>
                                <Link
                                    href="/movies/top-rated"
                                    className="block px-4 py-2 hover:bg-gray-700"
                                    onClick={() => setIsMoviesOpen(false)}
                                >
                                    Top Rated
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link href="/favorites" className="hover:text-gray-300">
                        Favorites
                    </Link>
                </div>

                {/* Auth */}
                <div>
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm">
                                Hi, {session.user?.name}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
