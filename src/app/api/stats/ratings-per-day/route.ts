// app/api/stats/ratings-per-day/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// helper om per dag te groeperen
function groupByDay(records: { createdAt: Date }[]) {
    const map = new Map<string, number>();

    records.forEach((r) => {
        const date = r.createdAt.toISOString().split("T")[0]; // yyyy-mm-dd
        map.set(date, (map.get(date) ?? 0) + 1);
    });

    return Array.from(map.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function GET() {
    const session = await getServerSession(authOptions);

    // 🔹 1. Globale data
    const allRatings = await prisma.rating.findMany({
        select: { createdAt: true },
    });
    const global = groupByDay(allRatings);

    // 🔹 2. Persoonlijke data (indien ingelogd)
    let personal: { date: string; count: number }[] = [];
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (user) {
            const userRatings = await prisma.rating.findMany({
                where: { userId: user.id },
                select: { createdAt: true },
            });
            personal = groupByDay(userRatings);
        }
    }

    return NextResponse.json({ global, personal });
}
