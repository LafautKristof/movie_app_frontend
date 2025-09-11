import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key!
);

export async function POST(req: Request) {
    console.log("🚀 Upload API route gestart");
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    console.log("file", file);
    if (!file) {
        return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    // uploaden naar Supabase
    const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        return NextResponse.json(
            { error: uploadError.message },
            { status: 500 }
        );
    }

    // publieke URL ophalen
    const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);

    const publicUrl = data.publicUrl; // 👈 hier goed zetten
    console.log(publicUrl);
    // Opslaan in Prisma
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.upload.create({
        data: {
            userId: user.id,
            url: publicUrl,
        },
    });

    return NextResponse.json({ url: publicUrl });
}
