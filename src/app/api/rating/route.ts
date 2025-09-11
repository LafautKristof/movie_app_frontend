import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

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
    const agg = await prisma.rating.aggregate({
        where: { movieId: body.id },
        _avg: { points: true },
        _count: { _all: true },
    });
    await pusherServer.trigger(`movie-${body.id}`, "rating-updated", {
        average: agg._avg.points ?? 0,
        count: agg._count._all ?? 0,
    });

    return NextResponse.json(rating);
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const movieIdParam = searchParams.get("movieId");
    const movieId = Number(movieIdParam);

    if (!movieId || Number.isNaN(movieId)) {
        return NextResponse.json({ error: "Invalid movieId" }, { status: 400 });
    }

    // aggregaat altijd publiek
    const agg = await prisma.rating.aggregate({
        where: { movieId },
        _avg: { points: true },
        _count: { _all: true },
    });

    let rating = null;
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });
        if (user) {
            rating = await prisma.rating.findUnique({
                where: { userId_movieId: { userId: user.id, movieId } },
                select: {
                    id: true,
                    points: true,

                    createdAt: true,
                },
            });
        }
    }

    return NextResponse.json({
        rating, // null voor gasten
        aggregate: {
            average: agg._avg.points ?? null,
            count: agg._count._all ?? 0,
        },
    });
}
export async function DELETE(req: Request) {
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

    try {
        await prisma.rating.delete({
            where: {
                userId_movieId: {
                    userId: user.id,
                    movieId: body.id,
                },
            },
        });
        const agg = await prisma.rating.aggregate({
            where: { movieId: body.id },
            _avg: { points: true },
            _count: { _all: true },
        });

        await pusherServer.trigger(`movie-${body.id}`, "rating-updated", {
            average: agg._avg.points ?? 0,
            count: agg._count._all ?? 0,
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Rating not found" },
            { status: 404 }
        );
    }
}
