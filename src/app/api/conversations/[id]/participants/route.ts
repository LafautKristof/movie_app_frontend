// app/api/conversations/[id]/participants/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { userId } = await req.json();

    // check of user al in conversatie zit
    const exists = await prisma.conversationParticipant.findFirst({
        where: {
            userId,
            conversationId: id,
        },
    });

    if (exists) {
        return NextResponse.json(
            { error: "User zit al in conversatie" },
            { status: 400 }
        );
    }

    // tel huidige aantal deelnemers
    const count = await prisma.conversationParticipant.count({
        where: { conversationId: id },
    });

    // voeg nieuwe participant toe
    const participant = await prisma.conversationParticipant.create({
        data: {
            conversationId: id,
            userId,
        },
        include: { user: true },
    });

    // als er al minstens 2 waren → nu is het een groep
    if (count >= 2) {
        await prisma.conversation.update({
            where: { id },
            data: { isGroup: true },
        });
    }

    return NextResponse.json({
        id: participant.user.id,
        name: participant.user.name,
        avatarUrl: participant.user.image ?? null,
    });
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId: id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },
    });

    return NextResponse.json(
        participants.map((p) => ({
            id: p.user.id,
            name: p.user.name,
            avatarUrl: p.user.image ?? null,
        }))
    );
}
