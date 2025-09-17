import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MessageForm } from "@/components/Conversations/MessageForm";

export default async function ConversationPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) notFound();

    const conversation = await prisma.conversation.findUnique({
        where: { id: params.id },
        include: {
            participants: { include: { user: true } },
            messages: {
                include: { sender: true },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!conversation) notFound();

    const currentUserId = session.user.id;
    const otherUser = conversation.participants.find(
        (p) => p.userId !== currentUserId
    )?.user;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">
                Chat met {otherUser?.name ?? "Onbekend"}
            </h1>

            <div className="space-y-3 border rounded p-4 bg-gray-50 mb-4">
                {conversation.messages.length === 0 && (
                    <p className="text-gray-500 text-sm">Nog geen berichten…</p>
                )}

                {conversation.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${
                            msg.senderId === currentUserId
                                ? "items-end"
                                : "items-start"
                        }`}
                    >
                        <span className="text-sm font-semibold">
                            {msg.sender.name}
                        </span>
                        <span className="bg-gray-200 px-3 py-1 rounded">
                            {msg.content}
                        </span>
                    </div>
                ))}
            </div>

            <MessageForm conversationId={conversation.id} />
        </div>
    );
}
