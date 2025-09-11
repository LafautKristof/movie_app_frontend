import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    // ✅ globale stats
    const [favorites, watchlist, ratings, users] = await Promise.all([
        prisma.favorite.count(),
        prisma.watchlist.count(),
        prisma.rating.count(),
        prisma.user.count(),
    ]);

    // ✅ persoonlijke stats
    let personal = { favorites: 0, watchlist: 0, ratings: 0 };
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                favorites: true,
                watchlist: true,
                ratings: true,
            },
        });
        if (user) {
            personal = {
                favorites: user.favorites.length,
                watchlist: user.watchlist.length,
                ratings: user.ratings.length,
            };
        }
    }

    return NextResponse.json({
        global: { favorites, watchlist, ratings, users },
        personal,
    });
}
