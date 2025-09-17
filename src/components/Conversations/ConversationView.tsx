"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { MessageForm } from "./MessageForm";
import { isImageUrl } from "@/helpers/isImageUrl";
import ConversationSettings from "./ConversationSettings";
import Avatar from "@/components/Conversations/Avatar";
import Image from "next/image";
import { renderWithTwemoji } from "@/helpers/renderWithTwemoji";

type Message = {
    id: string;
    senderId: string;
    conversationId: string;
    content: string;
    createdAt: string;
    sender?: { id: string; name: string | null; image: string | null };
};

export default function ConversationView({
    conversationId,
    currentUserId,
}: {
    conversationId: string;
    currentUserId: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [bgColor, setBgColor] = useState("#f9fafb");
    const [conversationTitle, setConversationTitle] = useState("Gesprek");

    useEffect(() => {
        async function fetchMessages() {
            const res = await fetch(
                `/api/conversations/${conversationId}/messages`,
                {
                    cache: "no-store",
                }
            );
            if (res.ok) {
                const data: Message[] = await res.json();
                setMessages(data);
            }
        }
        fetchMessages();
    }, [conversationId]);

    useEffect(() => {
        async function fetchConversation() {
            const res = await fetch(`/api/conversations/${conversationId}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                setBgColor(data.color || "#f9fafb");
                setConversationTitle(data.title || "Gesprek");
            }
        }

        fetchConversation();
    }, [conversationId]);

    // 📡 Real-time luisteren
    useEffect(() => {
        const channel = pusherClient.subscribe(
            `conversation-${conversationId}`
        );

        channel.bind("new-message", (message: Message) => {
            if (message.conversationId === conversationId) {
                setMessages((prev) => {
                    if (prev.some((m) => m.id === message.id)) return prev;
                    return [...prev, message];
                });
            }
        });

        channel.bind(
            "typing",
            ({
                userId,
                userName,
                typing,
            }: {
                userId: string;
                userName: string;
                typing: boolean;
            }) => {
                if (userId !== currentUserId) {
                    setTypingUser(typing ? userName || "Iemand" : null);
                }
            }
        );

        channel.bind(
            "settings-updated",
            ({ title, color }: { title?: string; color?: string }) => {
                if (color) setBgColor(color);
                if (title) setConversationTitle(title);
            }
        );

        return () => {
            pusherClient.unsubscribe(`conversation-${conversationId}`);
        };
    }, [conversationId, currentUserId]);

    // 🔽 Scroll naar laatste bericht
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-[600px] border rounded shadow">
            {/* header */}
            <div className="flex items-center justify-between p-3 border-b bg-white sticky top-0 z-10">
                <h2 className="text-lg font-semibold">{conversationTitle}</h2>

                <button
                    onClick={() => setShowSettings(true)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    ⚙️ Instellingen
                </button>
            </div>

            {/* berichtenlijst */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{ backgroundColor: bgColor }}
            >
                {messages.map((msg) => {
                    const isOwn = msg.senderId === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${
                                isOwn ? "justify-end" : "justify-start"
                            } items-start gap-2`}
                        >
                            {!isOwn && (
                                <div className="flex flex-col items-center">
                                    <Avatar
                                        name={msg.sender?.name}
                                        avatarUrl={msg.sender?.image}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col max-w-[70%]">
                                {!isOwn && msg.sender?.name && (
                                    <span className="text-xs text-gray-500 mb-1">
                                        {msg.sender.name}
                                    </span>
                                )}

                                <div
                                    className={`px-4 py-2 rounded-2xl break-words ${
                                        isOwn
                                            ? "bg-blue-500 text-white rounded-br-none self-end"
                                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                                    }`}
                                >
                                    {isImageUrl(msg.content) ? (
                                        <Image
                                            src={msg.content}
                                            alt="Sent image"
                                            className="max-w-[200px] max-h-[200px] rounded"
                                            width={200}
                                            height={200}
                                        />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {typingUser && (
                    <p className="text-sm text-gray-500 italic">
                        💬 {typingUser} is aan het typen...
                    </p>
                )}

                <div ref={bottomRef} />
            </div>

            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2">Instellingen</h3>
                        <ConversationSettings
                            conversationId={conversationId}
                            currentUserId={currentUserId}
                        />

                        <button
                            onClick={() => setShowSettings(false)}
                            className="mt-4 text-sm text-gray-500 hover:underline"
                        >
                            Sluiten
                        </button>
                    </div>
                </div>
            )}

            {/* inputveld */}
            <div className="border-t bg-white p-2">
                <MessageForm conversationId={conversationId} />
            </div>
        </div>
    );
}
