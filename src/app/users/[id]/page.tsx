import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function UserProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            // voeg hier velden toe die je wil tonen
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-400 mt-2">
                Lid sinds:{" "}
                {new Intl.DateTimeFormat("nl-BE").format(
                    new Date(user.createdAt)
                )}
            </p>
        </div>
    );
}
