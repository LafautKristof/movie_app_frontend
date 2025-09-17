import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";
// 👉 Alle comments ophalen
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
        return NextResponse.json(
            { error: "movieId is required" },
            { status: 400 }
        );
    }

    const comments = await prisma.comment.findMany({
        where: { movieId: Number(movieId) },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
        comments: comments.map((c) => ({
            id: c.id,
            comment: c.body,
            createdAt: c.createdAt,
            user: { name: c.user?.name ?? "Anonieme gebruiker" },
        })),
    });
}

// 👉 Nieuwe comment posten
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId, body } = await req.json();

    if (!movieId || !body?.trim()) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
        data: {
            movieId: Number(movieId),
            body,
            userId: user.id,
        },
        include: { user: { select: { name: true } } },
    });
    await pusherServer.trigger(`movie-${movieId}`, "new-comment", {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt,
        user: { name: comment.user?.name ?? "Anonieme gebruiker" },
    });
    return NextResponse.json({
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt,
        user: { name: comment.user?.name ?? "Anonieme gebruiker" },
    });
}
