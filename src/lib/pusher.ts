import Pusher from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    }
);

if (typeof window !== "undefined") {
    pusherClient.connection.bind("connected", () => {
        console.log("✅ Pusher client connected");
    });

    pusherClient.connection.bind("error", (err: any) => {
        console.error("❌ Pusher client error", err);
    });
}
