// app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // user opzoeken
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ correcte Prisma create call
    const fav = await prisma.favorite.create({
        data: {
            userId: user.id,
            movieId: body.id, // van client
            title: body.title, // van client
            posterPath: body.poster_path, // van client
        },
    });

    return NextResponse.json(fav);
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { favorites: true },
    });

    return NextResponse.json(user?.favorites ?? []);
}
