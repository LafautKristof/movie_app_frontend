"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ConversationsList from "./ConversationsList";
import ConversationView from "./ConversationView";

export default function MessengerLayout({
    currentUserId,
}: {
    currentUserId: string;
}) {
    const searchParams = useSearchParams();
    const initialId = searchParams.get("id");

    const [activeConversation, setActiveConversation] = useState<string | null>(
        initialId
    );

    useEffect(() => {
        if (initialId) {
            setActiveConversation(initialId);
        }
    }, [initialId]);

    return (
        <div className="flex h-[700px] border rounded shadow">
            <div className="w-1/3 border-r overflow-y-auto">
                <ConversationsList
                    currentUserId={currentUserId}
                    onSelectConversation={(id) => setActiveConversation(id)}
                />
            </div>

            <div className="flex-1">
                {activeConversation ? (
                    <>
                        <ConversationView
                            conversationId={activeConversation}
                            currentUserId={currentUserId}
                        />
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Selecteer een gesprek
                    </div>
                )}
            </div>
        </div>
    );
}
