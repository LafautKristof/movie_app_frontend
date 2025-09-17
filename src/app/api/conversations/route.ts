// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // alle conversaties waar user in zit
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: { some: { userId: session.user.id } },
        },
        include: {
            participants: { include: { user: true } },
            messages: {
                take: 1,
                orderBy: { createdAt: "desc" },
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
}
