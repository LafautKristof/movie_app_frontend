// app/api/conversations/start/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();
    const currentUserId = session.user.id;

    if (!userId || userId === currentUserId) {
        return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    // 🔎 Zoek naar een bestaande privé-conversatie (geen groep, exact 2 deelnemers)
    let conversation = await prisma.conversation.findFirst({
        where: {
            isGroup: false,
            participants: {
                every: {
                    OR: [{ userId: currentUserId }, { userId }],
                },
            },
        },
        include: {
            participants: true,
        },
    });

    // Extra check: aantal deelnemers moet 2 zijn
    if (conversation && conversation.participants.length !== 2) {
        conversation = null;
    }

    // ❌ Geen gevonden? Maak nieuwe aan
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                isGroup: false,
                participants: {
                    create: [{ userId: currentUserId }, { userId }],
                },
            },
            include: { participants: true },
        });
    }

    return NextResponse.json({ conversationId: conversation.id });
}
