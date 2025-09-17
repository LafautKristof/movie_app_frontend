export function isImageUrl(url: string) {
    try {
        // snelle regex op extensie
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
    } catch {
        return false;
    }
}
