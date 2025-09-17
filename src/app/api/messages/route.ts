import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher"; // als je realtime gebruikt

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content } = await req.json();

    // 1. bericht aanmaken
    const message = await prisma.message.create({
        data: {
            conversationId,
            senderId: session.user.id,
            content,
        },
        include: { sender: true }, // handig voor frontend
    });

    // 2. conversation timestamp updaten
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });

    // 3. realtime push naar alle participants (optioneel)
    const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId },
        select: { userId: true },
    });

    for (const p of participants) {
        await pusherServer.trigger(`chat-${p.userId}`, "new-message", message);
    }
    await pusherServer.trigger(
        `conversation-${conversationId}`,
        "new-message",
        message
    );
    await pusherServer.trigger("conversations", "updated", {
        conversationId,
    });
    return NextResponse.json(message);
}
