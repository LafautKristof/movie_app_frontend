"use client";

import { useRouter } from "next/navigation";

export function StartChatButton({ userId }: { userId: string }) {
    const router = useRouter();

    async function handleClick() {
        const res = await fetch("/api/conversations/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        if (res.ok) {
            const data = await res.json();
            router.push(`/conversations?id=${data.conversationId}`);
        } else {
            alert("Kon geen chat starten");
        }
    }

    return (
        <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Stuur bericht
        </button>
    );
}
