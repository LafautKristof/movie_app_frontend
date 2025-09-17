function getInitials(name?: string | null): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase(); // eerste 2 letters
    }

    return (parts[0][0] + parts[1][0]).toUpperCase(); // eerste letters van eerste 2 woorden
}

export default getInitials;
