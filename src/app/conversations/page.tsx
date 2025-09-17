import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import MessengerLayout from "@/components/Conversations/MessengerLayout";

export default async function ConversationsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return <div className="p-6">Je moet ingelogd zijn om te chatten.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Conversations</h1>
            <MessengerLayout currentUserId={session.user.id} />
        </div>
    );
}
