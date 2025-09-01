import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Stap 1: Movie garanderen in DB
    await prisma.movie.upsert({
        where: { id: body.id },
        update: {
            title: body.title ?? "unknown",
            posterPath: body.poster_path ?? null,
            releaseDate: body.release_date ? new Date(body.release_date) : null,
        },
        create: {
            id: body.id,
            title: body.title ?? "Untitled Movie",
            posterPath: body.poster_path ?? null,
            releaseDate: body.release_date ? new Date(body.release_date) : null,
        },
    });

    // ✅ Stap 2: Rating upserten
    const rating = await prisma.rating.upsert({
        where: {
            userId_movieId: {
                userId: user.id,
                movieId: body.id,
            },
        },
        update: {
            points: body.points,
        },
        create: {
            userId: user.id,
            movieId: body.id,
            points: body.points,
        },
    });

    return NextResponse.json(rating);
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { ratings: { include: { movie: true } } }, // ✅ ook movie info meegeven
    });

    return NextResponse.json(user?.ratings ?? []);
}
