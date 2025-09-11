import sanitizeHtml from "sanitize-html";

export function cleanHtml(dirty: string) {
    return sanitizeHtml(dirty, {
        allowedTags: [
            "p",
            "b",
            "i",
            "em",
            "strong",
            "a",
            "img",
            "ul",
            "li",
            "u",
        ],
        allowedAttributes: {
            a: ["href", "target"],
            img: ["src", "alt"],
        },
    });
}
