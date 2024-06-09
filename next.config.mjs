
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: 'different-clownfish-519.convex.cloud',
          },
        ],
      },
};

export default nextConfig;
