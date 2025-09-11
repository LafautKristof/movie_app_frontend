import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    const { channel, event, data } = await req.json();

    await pusherServer.trigger(channel, event, data);

    return NextResponse.json({ success: true });
}
