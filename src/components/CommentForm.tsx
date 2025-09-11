// components/CommentForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Link as LinkIcon,
    Image as ImageIcon,
    Paperclip,
    List as ListIcon,
    Quote,
    Smile,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
};

export default function CommentForm({ movie }: { movie: Movie }) {
    const [showEmoji, setShowEmoji] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            BulletList,
            OrderedList,
            ListItem,
            Underline,
            Link.configure({ openOnClick: false }),
            Image,
            Placeholder.configure({ placeholder: "Schrijf je comment…" }),
        ],
        content: "",
        immediatelyRender: false,
    });

    useEffect(() => {
        if (!editor) return;

        const updateHandler = () => {
            const text = editor.getText().trim();
            const html = editor.getHTML().trim();
            const isHtmlEmpty = html === "<p></p>" || html === "<p><br></p>";
            setHasContent(text.length > 0 || !isHtmlEmpty);
        };

        editor.on("update", updateHandler);
        updateHandler();

        return () => {
            editor.off("update", updateHandler); // nu returnt de cleanup zelf niets
        };
    }, [editor]);

    function triggerFile() {
        fileInputRef.current?.click();
    }

    async function addFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        if (!res.ok) {
            console.error("Upload failed:", await res.text());
            return;
        }
        const data = await res.json();
        if (data.url) editor?.chain().focus().setImage({ src: data.url }).run();
    }

    function addLink() {
        if (!editor) return;
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const url = window.prompt("Link URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
    }

    function addImage() {
        const url = window.prompt("Image URL:");
        if (url) editor?.chain().focus().setImage({ src: url }).run();
    }

    function addEmoji(emoji: any) {
        editor?.chain().focus().insertContent(emoji).run();
    }

    async function saveComment() {
        setSaving(true);
        const comment = editor?.getHTML() || "";
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                movieId: movie.id,
                body: comment,
            }),
        });
        console.log(editor?.getHTML());
        setSaving(false);

        if (res.ok) {
            editor?.commands.clearContent();
            setShowEmoji(false);
            // Refreshen zodat nieuwe comment bovenaan verschijnt
            window.location.reload();
            // (alternatief: lift state op + router.refresh() in client wrapper)
        } else {
            console.error("Comment opslaan mislukt");
        }
    }

    return (
        <div className="w-full max-w-2xl mb-6">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                    <Bold size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                    <Italic size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                    }
                >
                    <UnderlineIcon size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }
                >
                    <ListIcon size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                    }
                >
                    <Quote size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={addLink}>
                    <LinkIcon size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={addImage}>
                    <ImageIcon size={16} />
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={addFile}
                />
                <Button size="sm" variant="outline" onClick={triggerFile}>
                    <Paperclip size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowEmoji((v) => !v)}
                >
                    <Smile size={16} />
                </Button>
            </div>

            {showEmoji && (
                <div className="rounded-lg shadow-lg border bg-white p-2 mb-2">
                    <EmojiPicker
                        onEmojiClick={(e) => addEmoji(e.emoji)}
                        height={350}
                        width="100%"
                    />
                </div>
            )}

            <EditorContent
                editor={editor}
                className="border p-2 w-full min-h-[160px] max-h-[360px] overflow-y-auto rounded bg-white text-black"
            />

            <div className="mt-3">
                <button
                    onClick={saveComment}
                    disabled={!hasContent || saving}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Comment opslaan
                </button>
            </div>
        </div>
    );
}
