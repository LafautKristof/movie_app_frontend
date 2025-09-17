import type { NextConfig } from "next";
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL_WITHOUT_PROTOCOL;
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.tmdb.org",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            supabaseHost
                ? {
                      protocol: "https",
                      hostname: supabaseHost,
                      pathname: "/storage/v1/**",
                  }
                : undefined,
        ].filter(Boolean) as any,
    },
};

export default nextConfig;
