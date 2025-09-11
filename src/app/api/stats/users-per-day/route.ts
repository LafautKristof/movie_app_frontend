// app/api/stats/users-per-day/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const rows = await prisma.$queryRawUnsafe<
            { date: string; count: number }[]
        >(`
  SELECT DATE("createdAt") AS date, COUNT(*)::int AS count
  FROM "User"
  GROUP BY DATE("createdAt")
  ORDER BY date ASC
`);

        return NextResponse.json(rows);
    } catch (err) {
        console.error("❌ users-per-day failed", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
