import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (q.length < 1) {
        return NextResponse.json([], { status: 200 });
    }
    const user = await prisma.user.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 10,
        select: {
            id: true,
            name: true,
            image: true,
        },
    });
    return NextResponse.json(user, { status: 200 });
}
