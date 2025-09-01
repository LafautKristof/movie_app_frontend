import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/watchlist → alle films van de user
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { watchlist: { include: { movie: true } } }, // ✅ film info erbij
    });

    return NextResponse.json(user?.watchlist ?? []);
}

// POST /api/watchlist → voeg toe als hij nog niet bestaat
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

    // ✅ Stap 1: Movie garanderen
    await prisma.movie.upsert({
        where: { id: body.id },
        update: {
            title: body.title,
            posterPath: body.poster_path ?? null,
            releaseDate: body.release_date ? new Date(body.release_date) : null,
        },
        create: {
            id: body.id,
            title: body.title,
            posterPath: body.poster_path ?? null,
            releaseDate: body.release_date ? new Date(body.release_date) : null,
        },
    });

    // ✅ Stap 2: Watchlist item upserten
    const item = await prisma.watchlist.upsert({
        where: {
            userId_movieId: {
                userId: user.id,
                movieId: body.id,
            },
        },
        update: {}, // niks aanpassen
        create: {
            userId: user.id,
            movieId: body.id,
        },
    });

    return NextResponse.json(item);
}

// DELETE /api/watchlist → verwijder film
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
        await prisma.watchlist.delete({
            where: {
                userId_movieId: {
                    userId: user.id,
                    movieId: body.id,
                },
            },
        });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Watchlist item not found" },
            { status: 404 }
        );
    }
}
