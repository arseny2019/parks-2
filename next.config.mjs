/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        dangerouslyAllowSVG: true,
    },
    webpack: (config) => {
        // Solve compiling problem via vagrant
        config.watchOptions = {
            poll: 1000,   // Check for changes every second
            aggregateTimeout: 300,   // delay before rebuilding
        };
        return config;
    },
    trailingSlash: true,
};

export default nextConfig;
