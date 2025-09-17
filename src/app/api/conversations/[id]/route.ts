//conversations/[id]/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, color } = await req.json();

    // 👇 eerst conversatie ophalen om te weten wie owner is
    const convo = await prisma.conversation.findUnique({
        where: { id: params.id },
        select: { ownerId: true },
    });

    if (!convo) {
        return NextResponse.json(
            { error: "Conversation not found" },
            { status: 404 }
        );
    }

    // 👇 bouw dynamisch update object
    const data: any = {};

    // Alleen owner mag titel aanpassen
    if (title !== undefined && convo.ownerId === session.user.id) {
        data.title = title;
    }

    // Iedereen mag kleur aanpassen
    if (color !== undefined) {
        data.color = color;
    }

    const conversation = await prisma.conversation.update({
        where: { id: params.id },
        data,
        include: {
            participants: { include: { user: true } },
            messages: { take: 1, orderBy: { createdAt: "desc" } },
        },
    });

    // 🔔 realtime events
    await pusherServer.trigger("conversations", "updated", {
        conversationId: conversation.id,
    });
    await pusherServer.trigger(
        `conversation-${conversation.id}`,
        "settings-updated",
        { title: conversation.title, color: conversation.color }
    );

    return NextResponse.json(conversation);
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            title: true,
            color: true,
            ownerId: true, // 👈 heel belangrijk
            messages: {
                include: { sender: true },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!conversation) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(conversation);
}
