// app/api/typing/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, typing } = await req.json();

    await pusherServer.trigger(`conversation-${conversationId}`, "typing", {
        userId: session.user.id,
        userName: session.user.name ?? "Onbekend",
        typing,
    });

    return NextResponse.json({ ok: true });
}
