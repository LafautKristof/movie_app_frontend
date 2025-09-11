import type { Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#3b82f6", // blauw
                    dark: "#1e40af",
                },
            },
        },
    },
    plugins: [],
};

export default config;
