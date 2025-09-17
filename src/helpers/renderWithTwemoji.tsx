import twemoji from "twemoji";

export function renderWithTwemoji(text: string): string {
    return twemoji.parse(text, {
        folder: "svg",
        ext: ".svg",
        className: "twemoji", // 👈 voeg class toe
    });
}
