"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react"; // ✅ enum importeren
import { renderWithTwemoji } from "@/helpers/renderWithTwemoji";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
    ssr: false,
});

export function MessageForm({ conversationId }: { conversationId: string }) {
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    async function sendTyping(isTyping: boolean) {
        await fetch("/api/typing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId, typing: isTyping }),
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim() || sending) return;

        setSending(true);

        await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId, content }),
        });

        await sendTyping(false);
        setContent("");
        setSending(false);
    }

    async function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setContent(val);
        sendTyping(val.length > 0);
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        if (data.url) {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, content: data.url }),
            });

            await sendTyping(false);
        }
    }

    function addEmoji(emojiData: EmojiClickData) {
        setContent((prev) => prev + emojiData.emoji);
        sendTyping(true);
    }

    return (
        <div className="flex flex-col gap-2 relative">
            {showEmoji && (
                <div className="absolute bottom-14 right-16 border rounded shadow-md bg-white z-50">
                    <EmojiPicker
                        onEmojiClick={addEmoji}
                        emojiStyle={EmojiStyle.FACEBOOK} // ✅ gebruik enum
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <div
                    contentEditable
                    onInput={(e) =>
                        setContent(e.currentTarget.textContent || "")
                    }
                    dangerouslySetInnerHTML={{
                        __html: renderWithTwemoji(content),
                    }}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[40px]"
                />

                <button
                    type="button"
                    onClick={() => setShowEmoji((v) => !v)}
                    className="px-3 py-2 rounded border bg-gray-100 hover:bg-gray-200"
                    title="Emoji"
                >
                    😊
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200"
                    title="Upload een foto"
                >
                    📎
                </button>

                <button
                    type="submit"
                    disabled={sending}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {sending ? "..." : "Verstuur"}
                </button>
            </form>
        </div>
    );
}
