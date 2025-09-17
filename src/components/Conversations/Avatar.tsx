import getInitials from "@/helpers/getInitals";
import Image from "next/image";

function Avatar({
    name,
    avatarUrl,
}: {
    name?: string | null;
    avatarUrl?: string | null;
}) {
    const initials = getInitials(name);

    if (avatarUrl) {
        return (
            <Image
                src={avatarUrl}
                alt={name || "User avatar"}
                className="w-8 h-8 rounded-full object-cover"
                width={40}
                height={40}
            />
        );
    }

    return (
        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
            {initials}
        </div>
    );
}

export default Avatar;
