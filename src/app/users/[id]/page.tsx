import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // pas dit pad aan naar waar jouw authOptions staan
import Link from "next/link";
import { StartChatButton } from "@/components/Conversations/StartChatButton";

export default async function UserProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        notFound();
    }

    const isOwnProfile = user.id === session.user.id;

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

            {!isOwnProfile && (
                <div className="mt-4">
                    <div className="mt-4">
                        <StartChatButton userId={user.id} />
                    </div>
                </div>
            )}
        </div>
    );
}
