// app/api/conversations/[id]/participants/[userId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string; userId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, userId } = params;

    // check of participant bestaat
    const participant = await prisma.conversationParticipant.findFirst({
        where: { conversationId: id, userId },
    });

    if (!participant) {
        return NextResponse.json(
            { error: "Participant not found" },
            { status: 404 }
        );
    }

    // verwijderen
    await prisma.conversationParticipant.delete({
        where: { id: participant.id },
    });

    // check hoeveel deelnemers er nog over zijn
    const remaining = await prisma.conversationParticipant.count({
        where: { conversationId: id },
    });

    if (remaining < 3) {
        // terugzetten naar privé-conversatie
        await prisma.conversation.update({
            where: { id },
            data: { isGroup: false },
        });
    }

    return NextResponse.json({ success: true });
}
